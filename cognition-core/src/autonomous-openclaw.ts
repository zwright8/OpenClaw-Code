import fs from 'fs';
import path from 'path';
import {
    buildTaskRequest,
    FileTaskStore
} from '../../swarm-protocol/runtime.js';
import { loadSkillManifest } from '../../skills/runtime/index.js';
import { enqueueTaskEntries } from './task-bundle-enqueuer.js';
import { runBotWorkerLoop } from './bot-worker-loop.js';
import { detectOpenClawRepoRoot } from './openclaw-bot.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

const SUCCESS_STATUSES = new Set([
    'completed',
    'partial'
]);

const DEFAULT_FAILURE_COOLDOWN_WAVES = 2;
const MAX_FAILURE_COOLDOWN_WAVES = 20;
const FAILURE_COOLDOWN_MIN_STREAK = 2;
const DEFAULT_RECENT_OUTCOME_WEIGHT = 0.2;
const MAX_RECENT_OUTCOME_WEIGHT = 0.6;
const DEFAULT_RECENT_OUTCOME_HALF_LIFE_WAVES = 3;
const MAX_RECENT_OUTCOME_HALF_LIFE_WAVES = 30;
const DEFAULT_STALE_WAVE_BOOST = 0.03;
const MAX_STALE_WAVE_BOOST = 0.2;
const DEFAULT_MAX_STALE_BOOST = 0.25;
const MAX_MAX_STALE_BOOST = 1;
const DEFAULT_SELECTION_POLICY_MODE = 'ucb';
const DEFAULT_THOMPSON_EXPLORATION = 0.2;
const DEFAULT_THOMPSON_PRIOR_ALPHA = 1;
const DEFAULT_THOMPSON_PRIOR_BETA = 1;
const MAX_THOMPSON_PRIOR = 100;
const DEFAULT_SLIDING_WINDOW_SIZE = 12;
const MAX_SLIDING_WINDOW_SIZE = 200;
const MAX_RECENT_OUTCOMES_TRACKED = 128;

function safeNow(nowFactory = Date.now) {
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function parsePositiveInt(raw, fallback = 1) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) return fallback;
    return value;
}

function parseNonNegativeInt(raw, fallback = 0) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0) return fallback;
    return value;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeFailureRate(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return clamp(numeric, 0, 1);
}

function normalizeCapabilityId(value) {
    if (typeof value !== 'string') return '';
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/_+/g, '_');
}

function normalizeSkillCode(value, skillId) {
    if (typeof value === 'string' && value.trim()) {
        return value.trim().toUpperCase();
    }
    const id = toSkillId(skillId);
    if (id === null) return 'SK-UNKNOWN';
    return `SK-${String(id).padStart(5, '0')}`;
}

function normalizeStatus(value) {
    if (typeof value !== 'string') return 'unknown';
    return value.trim().toLowerCase() || 'unknown';
}

function toSkillId(value) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric <= 0) return null;
    return numeric;
}

function makeDeterministicSeed(text) {
    let hash = 2_166_136_261;
    for (const ch of String(text)) {
        hash ^= ch.charCodeAt(0);
        hash = Math.imul(hash, 16_777_619);
    }
    return hash >>> 0;
}

function pseudoRatio(seed, offset) {
    let state = (seed + Math.imul(offset + 1, 1_013_904_223)) >>> 0;
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_295;
}

function pseudoInRange(seed, offset, min, max) {
    const ratio = pseudoRatio(seed, offset);
    return Math.round(min + ratio * (max - min));
}

function normalizeFailureCooldownWaves(raw, fallback = DEFAULT_FAILURE_COOLDOWN_WAVES) {
    return clamp(parseNonNegativeInt(raw, fallback), 0, MAX_FAILURE_COOLDOWN_WAVES);
}

function normalizeAdaptiveScoreConfig(rawConfig = null) {
    const value = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};

    return {
        recentOutcomeWeight: clamp(
            Number.isFinite(Number(value.recentOutcomeWeight))
                ? Number(value.recentOutcomeWeight)
                : DEFAULT_RECENT_OUTCOME_WEIGHT,
            0,
            MAX_RECENT_OUTCOME_WEIGHT
        ),
        recentOutcomeHalfLifeWaves: clamp(
            Number.isFinite(Number(value.recentOutcomeHalfLifeWaves))
                ? Number(value.recentOutcomeHalfLifeWaves)
                : DEFAULT_RECENT_OUTCOME_HALF_LIFE_WAVES,
            1,
            MAX_RECENT_OUTCOME_HALF_LIFE_WAVES
        ),
        staleWaveBoost: clamp(
            Number.isFinite(Number(value.staleWaveBoost))
                ? Number(value.staleWaveBoost)
                : DEFAULT_STALE_WAVE_BOOST,
            0,
            MAX_STALE_WAVE_BOOST
        ),
        maxStaleBoost: clamp(
            Number.isFinite(Number(value.maxStaleBoost))
                ? Number(value.maxStaleBoost)
                : DEFAULT_MAX_STALE_BOOST,
            0,
            MAX_MAX_STALE_BOOST
        )
    };
}

function normalizeSelectionPolicyConfig(rawConfig = null) {
    const value = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};
    const mode = typeof value.mode === 'string'
        ? value.mode.trim().toLowerCase()
        : DEFAULT_SELECTION_POLICY_MODE;
    const normalizedMode = (mode === 'epsilon_ts'
        || mode === 'sw_ucb'
        || mode === 'sw_epsilon_ts')
        ? mode
        : DEFAULT_SELECTION_POLICY_MODE;

    return {
        mode: normalizedMode,
        thompsonExploration: clamp(
            Number.isFinite(Number(value.thompsonExploration))
                ? Number(value.thompsonExploration)
                : DEFAULT_THOMPSON_EXPLORATION,
            0,
            1
        ),
        thompsonPriorAlpha: clamp(
            Number.isFinite(Number(value.thompsonPriorAlpha))
                ? Number(value.thompsonPriorAlpha)
                : DEFAULT_THOMPSON_PRIOR_ALPHA,
            Number.EPSILON,
            MAX_THOMPSON_PRIOR
        ),
        thompsonPriorBeta: clamp(
            Number.isFinite(Number(value.thompsonPriorBeta))
                ? Number(value.thompsonPriorBeta)
                : DEFAULT_THOMPSON_PRIOR_BETA,
            Number.EPSILON,
            MAX_THOMPSON_PRIOR
        ),
        slidingWindowSize: clamp(
            Number.isFinite(Number(value.slidingWindowSize))
                ? Number(value.slidingWindowSize)
                : DEFAULT_SLIDING_WINDOW_SIZE,
            1,
            MAX_SLIDING_WINDOW_SIZE
        )
    };
}

function normalizeRecentOutcomeEntry(rawEntry = {}) {
    const entry = rawEntry && typeof rawEntry === 'object' ? rawEntry : {};
    const status = normalizeStatus(entry.status);
    return {
        wave: Number.isFinite(Number(entry.wave))
            ? parseNonNegativeInt(entry.wave, 0)
            : 0,
        status,
        didSucceed: SUCCESS_STATUSES.has(status)
    };
}

function normalizeRecentOutcomes(rawOutcomes = []) {
    if (!Array.isArray(rawOutcomes)) return [];
    const normalized = [];
    for (const rawEntry of rawOutcomes) {
        const entry = normalizeRecentOutcomeEntry(rawEntry);
        if (!TERMINAL_STATUSES.has(entry.status)) continue;
        normalized.push(entry);
    }
    return normalized.slice(-MAX_RECENT_OUTCOMES_TRACKED);
}

function normalizeExecutionStat(rawStat = {}) {
    const stat = rawStat && typeof rawStat === 'object' ? rawStat : {};
    const attempts = parseNonNegativeInt(stat.attempts, 0);
    const successes = clamp(parseNonNegativeInt(stat.successes, 0), 0, attempts);
    const failures = clamp(parseNonNegativeInt(stat.failures, 0), 0, attempts);
    const consecutiveFailures = clamp(parseNonNegativeInt(stat.consecutiveFailures, 0), 0, attempts);
    const lastStatus = typeof stat.lastStatus === 'string' && stat.lastStatus.trim()
        ? normalizeStatus(stat.lastStatus)
        : null;
    const lastAttemptAt = Number.isFinite(Number(stat.lastAttemptAt))
        ? Number(stat.lastAttemptAt)
        : null;
    const lastWave = Number.isFinite(Number(stat.lastWave))
        ? parseNonNegativeInt(stat.lastWave, 0)
        : null;
    const recentOutcomes = normalizeRecentOutcomes(stat.recentOutcomes);

    return {
        attempts,
        successes,
        failures,
        consecutiveFailures,
        lastStatus,
        lastAttemptAt,
        lastWave,
        recentOutcomes
    };
}

function normalizeSkillExecutionStats(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const normalized = {};

    for (const [key, value] of Object.entries(stats)) {
        const skillId = toSkillId(key);
        if (skillId === null) continue;
        normalized[String(skillId)] = normalizeExecutionStat(value);
    }

    return normalized;
}

function normalizeCapabilityExecutionStats(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const normalized = {};

    for (const [key, value] of Object.entries(stats)) {
        const capabilityId = normalizeCapabilityId(key);
        if (!capabilityId) continue;
        normalized[capabilityId] = normalizeExecutionStat(value);
    }

    return normalized;
}

function normalizeState(rawState = {}) {
    const state = rawState && typeof rawState === 'object' ? rawState : {};

    return {
        version: 1,
        runCount: parseNonNegativeInt(state.runCount, 0),
        skillCursor: parseNonNegativeInt(state.skillCursor, 0),
        capabilityCursor: parseNonNegativeInt(state.capabilityCursor, 0),
        successfulSkillIds: Array.isArray(state.successfulSkillIds)
            ? [...new Set(state.successfulSkillIds.map((value) => toSkillId(value)).filter(Boolean))].sort((a, b) => a - b)
            : [],
        successfulCapabilityIds: Array.isArray(state.successfulCapabilityIds)
            ? [...new Set(state.successfulCapabilityIds.map((value) => normalizeCapabilityId(value)).filter(Boolean))].sort()
            : [],
        failedSkillIds: Array.isArray(state.failedSkillIds)
            ? [...new Set(state.failedSkillIds.map((value) => toSkillId(value)).filter(Boolean))].sort((a, b) => a - b)
            : [],
        failedCapabilityIds: Array.isArray(state.failedCapabilityIds)
            ? [...new Set(state.failedCapabilityIds.map((value) => normalizeCapabilityId(value)).filter(Boolean))].sort()
            : [],
        skillExecutionStats: normalizeSkillExecutionStats(state.skillExecutionStats),
        capabilityExecutionStats: normalizeCapabilityExecutionStats(state.capabilityExecutionStats),
        updatedAt: Number.isFinite(Number(state.updatedAt)) ? Number(state.updatedAt) : null
    };
}

export function loadAutonomousState(statePath) {
    if (!statePath || typeof statePath !== 'string') {
        return normalizeState();
    }
    const resolved = path.resolve(statePath);
    if (!fs.existsSync(resolved)) {
        return normalizeState();
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8'));
        return normalizeState(parsed);
    } catch {
        return normalizeState();
    }
}

export function saveAutonomousState(statePath, statePayload) {
    if (!statePath || typeof statePath !== 'string') {
        throw new Error('statePath is required');
    }
    const resolved = path.resolve(statePath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, `${JSON.stringify(normalizeState(statePayload), null, 2)}\n`);
}

export function loadCapabilityCatalog(repoRoot = detectOpenClawRepoRoot(process.cwd())) {
    const resolvedRoot = path.resolve(repoRoot);
    const entrypointPath = path.join(resolvedRoot, 'swarm-protocol', 'capabilities.ts');
    if (!fs.existsSync(entrypointPath)) {
        throw new Error(`Capability entrypoint not found: ${entrypointPath}`);
    }

    const content = fs.readFileSync(entrypointPath, 'utf8');
    const pattern = /^export \* from '\.\/src\/([^']+)\.js';$/gm;
    const moduleIds = [];
    let match;

    while ((match = pattern.exec(content)) !== null) {
        moduleIds.push(match[1]);
    }

    const capabilityIds = [...new Set(moduleIds
        .map((moduleId) => normalizeCapabilityId(moduleId.replace(/-/g, '_')))
        .filter(Boolean)
    )].sort();

    return capabilityIds;
}

export function loadExternalSkillCatalog(catalogPath) {
    if (!catalogPath || typeof catalogPath !== 'string') {
        throw new Error('catalogPath is required');
    }
    const resolvedPath = path.resolve(catalogPath);
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Skill catalog file not found: ${resolvedPath}`);
    }

    const content = fs.readFileSync(resolvedPath, 'utf8');
    const lines = content.split('\n');
    const entries = [];
    const byId = new Map();

    let lastEntry = null;
    for (const line of lines) {
        const skillMatch = line.match(/^\d+\.\s+\[SK-(\d{5})\]\s+(.+?)\s*$/);
        if (skillMatch) {
            const id = Number(skillMatch[1]);
            const title = skillMatch[2].trim();
            if (Number.isInteger(id) && id > 0 && title) {
                const existing = byId.get(id);
                if (!existing) {
                    const entry = {
                        id,
                        code: `SK-${String(id).padStart(5, '0')}`,
                        name: `external-skill-${String(id).padStart(5, '0')}`,
                        title,
                        reason: '',
                        source: resolvedPath
                    };
                    entries.push(entry);
                    byId.set(id, entry);
                    lastEntry = entry;
                } else {
                    lastEntry = existing;
                }
            } else {
                lastEntry = null;
            }
            continue;
        }

        const reasonMatch = line.match(/^\s*Reason:\s*(.+)\s*$/i);
        if (reasonMatch && lastEntry) {
            lastEntry.reason = reasonMatch[1].trim();
        }
    }

    if (entries.length === 0) {
        throw new Error(`No skill entries found in catalog: ${resolvedPath}`);
    }

    entries.sort((a, b) => a.id - b.id);
    return entries;
}

function loadSkillCatalogSource({
    repoRoot,
    skillCatalogPath = null
}) {
    if (skillCatalogPath && typeof skillCatalogPath === 'string') {
        return {
            source: 'external',
            sourcePath: path.resolve(skillCatalogPath),
            entries: loadExternalSkillCatalog(skillCatalogPath)
        };
    }

    return {
        source: 'manifest',
        sourcePath: path.join(path.resolve(repoRoot), 'skills', 'generated', 'skills.manifest.json'),
        entries: loadSkillManifest(repoRoot)
    };
}

function computeCoverageSummary(catalogIds, successfulIds = [], failedIds = []) {
    const catalogSet = new Set((Array.isArray(catalogIds) ? catalogIds : []).map((value) => String(value)));
    const successfulSet = new Set((Array.isArray(successfulIds) ? successfulIds : []).map((value) => String(value)));
    const failedSet = new Set((Array.isArray(failedIds) ? failedIds : []).map((value) => String(value)));

    let successful = 0;
    let failed = 0;
    for (const id of catalogSet) {
        if (successfulSet.has(id)) successful++;
        else if (failedSet.has(id)) failed++;
    }

    const total = catalogSet.size;
    const pending = Math.max(0, total - successful - failed);

    return {
        total,
        successful,
        failed,
        pending,
        coverage: total > 0 ? Number((successful / total).toFixed(4)) : 1
    };
}

function buildSkillInput(skillId, waveIndex, nowMs) {
    const seed = makeDeterministicSeed(`${skillId}:${waveIndex}:${Math.floor(nowMs / 1000)}`);
    return {
        signalQuality: pseudoInRange(seed, 0, 52, 96),
        evidenceCoverage: pseudoInRange(seed, 1, 48, 94),
        confidenceHealth: pseudoInRange(seed, 2, 46, 92),
        operationalReadiness: pseudoInRange(seed, 3, 45, 91),
        harmPotential: pseudoInRange(seed, 4, 10, 65),
        resourcePressure: pseudoInRange(seed, 5, 12, 70),
        urgency: pseudoInRange(seed, 6, 35, 88),
        impactPotential: pseudoInRange(seed, 7, 50, 96),
        humanApprovalLatency: pseudoInRange(seed, 8, 5, 60)
    };
}

function buildCapabilityInput(capabilityId, waveIndex, nowMs) {
    const seed = makeDeterministicSeed(`${capabilityId}:${waveIndex}:${Math.floor(nowMs / 1000)}`);
    const entity = {
        entityId: `${capabilityId}-entity-${waveIndex + 1}`,
        name: `${capabilityId.replace(/_/g, ' ')} entity`,
        demand: pseudoInRange(seed, 0, 45, 92),
        capacity: pseudoInRange(seed, 1, 35, 85),
        risk: pseudoInRange(seed, 2, 20, 88),
        impact: pseudoInRange(seed, 3, 55, 98),
        readiness: pseudoInRange(seed, 4, 30, 85),
        resilience: pseudoInRange(seed, 5, 34, 87),
        equity: pseudoInRange(seed, 6, 40, 92),
        efficiency: pseudoInRange(seed, 7, 40, 90),
        quality: pseudoInRange(seed, 8, 45, 94),
        trust: pseudoInRange(seed, 9, 35, 92),
        opportunity: pseudoInRange(seed, 10, 45, 95),
        criticality: pseudoInRange(seed, 11, 45, 96)
    };

    return {
        entities: [entity],
        contexts: [
            {
                contextId: `${capabilityId}-context-${waveIndex + 1}`,
                ...entity
            }
        ],
        hypotheses: [
            {
                id: `${capabilityId}-hypothesis-${waveIndex + 1}`,
                statement: `Hypothesis for ${capabilityId}`,
                priorConfidence: Number((pseudoInRange(seed, 12, 35, 75) / 100).toFixed(2)),
                supportSignals: ['readiness_attention', 'incident'],
                contradictSignals: ['readiness_blocked'],
                criticality: 'normal'
            }
        ],
        capacity: {
            executionSlots: pseudoInRange(seed, 13, 2, 8),
            analysisHours: pseudoInRange(seed, 14, 40, 120),
            reviewHours: pseudoInRange(seed, 15, 20, 60)
        },
        readinessReport: {
            status: entity.readiness < 45 ? 'blocked' : entity.readiness < 65 ? 'needs_attention' : 'ready'
        },
        driftReport: {
            alerts: entity.risk > 65
                ? [{ id: `${capabilityId}-drift`, code: 'drift_alert', priority: entity.risk > 80 ? 'P1' : 'P2' }]
                : []
        },
        incidents: entity.risk > 75
            ? [{ id: `${capabilityId}-incident`, code: 'incident', priority: 'P1' }]
            : []
    };
}

function isInFailureCooldown(stat, currentWave, cooldownWaves) {
    if (!stat || typeof stat !== 'object') return false;
    if (cooldownWaves <= 0) return false;
    if (parseNonNegativeInt(stat.consecutiveFailures, 0) < FAILURE_COOLDOWN_MIN_STREAK) return false;
    const lastWave = parseNonNegativeInt(stat.lastWave, 0);
    if (lastWave <= 0) return false;
    return (currentWave - lastWave) < cooldownWaves;
}

function computeRecencyDecay(wavesAgo, halfLifeWaves) {
    if (wavesAgo <= 0) return 1;
    return Math.pow(0.5, wavesAgo / halfLifeWaves);
}

function computeAdaptiveAdjustments(stat, currentWave, adaptiveScoreConfig) {
    const normalized = normalizeExecutionStat(stat);
    const adaptive = normalizeAdaptiveScoreConfig(adaptiveScoreConfig);
    const lastWave = parseNonNegativeInt(normalized.lastWave, 0);
    const wavesAgo = lastWave > 0 && currentWave > 0
        ? Math.max(0, currentWave - lastWave)
        : 0;
    const failurePenalty = normalized.consecutiveFailures >= FAILURE_COOLDOWN_MIN_STREAK
        ? Math.min(0.45, normalized.consecutiveFailures * 0.08)
        : 0;

    let recentOutcomeBonus = 0;
    if (wavesAgo >= 0 && normalized.lastStatus) {
        const decay = computeRecencyDecay(wavesAgo, adaptive.recentOutcomeHalfLifeWaves);
        if (SUCCESS_STATUSES.has(normalized.lastStatus)) {
            recentOutcomeBonus = adaptive.recentOutcomeWeight * decay;
        } else if (TERMINAL_STATUSES.has(normalized.lastStatus)) {
            recentOutcomeBonus = -adaptive.recentOutcomeWeight * decay;
        }
    }

    const staleBoost = lastWave > 0 && currentWave > lastWave
        ? Math.min(adaptive.maxStaleBoost, wavesAgo * adaptive.staleWaveBoost)
        : 0;

    return {
        failurePenalty,
        recentOutcomeBonus,
        staleBoost
    };
}

function computeWindowedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const window = normalized.recentOutcomes.slice(-policy.slidingWindowSize);
    const attempts = window.length;
    const successes = window.reduce((count, entry) => count + (entry.didSucceed ? 1 : 0), 0);
    const failures = attempts - successes;
    return {
        attempts,
        successes,
        failures
    };
}

function resolveScoreStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    if (policy.mode === 'sw_ucb' || policy.mode === 'sw_epsilon_ts') {
        const windowed = computeWindowedStats(normalized, policy);
        return {
            ...normalized,
            attempts: windowed.attempts,
            successes: windowed.successes,
            failures: windowed.failures
        };
    }
    return normalized;
}

function computeUcbScore(stat, totalAttempts, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const smoothedMean = (normalized.successes + 1) / (normalized.attempts + 2);
    const exploration = Math.sqrt((2 * Math.log(Math.max(1, totalAttempts))) / normalized.attempts);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return smoothedMean
        + exploration
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function createDeterministicRng(seedText) {
    const seed = makeDeterministicSeed(seedText);
    let offset = 0;
    return () => {
        const ratio = pseudoRatio(seed, offset++);
        if (ratio <= 0) return Number.EPSILON;
        if (ratio >= 1) return 1 - Number.EPSILON;
        return ratio;
    };
}

function sampleStandardNormal(rng) {
    const u1 = rng();
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function sampleGamma(shape, rng) {
    if (!Number.isFinite(shape) || shape <= 0) return 0;
    if (shape < 1) {
        const u = rng();
        return sampleGamma(shape + 1, rng) * Math.pow(u, 1 / shape);
    }

    const d = shape - (1 / 3);
    const c = 1 / Math.sqrt(9 * d);
    for (let attempt = 0; attempt < 64; attempt++) {
        const x = sampleStandardNormal(rng);
        const onePlusCx = 1 + c * x;
        if (onePlusCx <= 0) continue;
        const v = onePlusCx * onePlusCx * onePlusCx;
        const u = rng();
        if (u < 1 - 0.0331 * x * x * x * x) {
            return d * v;
        }
        if (Math.log(u) < (0.5 * x * x) + d * (1 - v + Math.log(v))) {
            return d * v;
        }
    }
    return Math.max(Number.EPSILON, d);
}

function sampleBeta(alpha, beta, rng) {
    const x = sampleGamma(alpha, rng);
    const y = sampleGamma(beta, rng);
    if (x <= 0 && y <= 0) return 0.5;
    return x / (x + y);
}

function computeEpsilonThompsonScore(stat, currentWave, adaptiveScoreConfig, selectionPolicyConfig, seedText) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);
    const alpha = policy.thompsonPriorAlpha + normalized.successes;
    const beta = policy.thompsonPriorBeta + normalized.failures;
    const posteriorMean = alpha / (alpha + beta);
    const rng = createDeterministicRng(seedText);
    const posteriorSample = sampleBeta(alpha, beta, rng);
    const blendedScore = ((1 - policy.thompsonExploration) * posteriorMean)
        + (policy.thompsonExploration * posteriorSample);

    return blendedScore
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function cursorDistance(index, pointer, total) {
    if (total <= 0) return 0;
    return (index - pointer + total) % total;
}

function selectCatalogSlice({
    catalog,
    cursor,
    limit,
    successfulSet,
    executionStats = {},
    currentWave = 0,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    adaptiveScoreConfig = null,
    selectionPolicyConfig = null,
    selectionScope = 'catalog'
}) {
    const list = Array.isArray(catalog) ? catalog : [];
    if (list.length === 0 || limit <= 0) {
        return {
            selected: [],
            nextCursor: 0
        };
    }

    const total = list.length;
    let pointer = ((Number(cursor) || 0) % total + total) % total;
    const selected = [];
    const selectedKeySet = new Set();

    let scanned = 0;
    while (selected.length < limit && scanned < total) {
        const candidate = list[pointer];
        const key = String(candidate?.id ?? candidate);
        const stat = normalizeExecutionStat(executionStats[key]);
        // Prioritize unseen items first for broad coverage.
        if (!selectedKeySet.has(key) && !successfulSet.has(key) && stat.attempts === 0) {
            selected.push(candidate);
            selectedKeySet.add(key);
        }
        pointer = (pointer + 1) % total;
        scanned++;
    }

    const normalizedPolicy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const normalizedCurrentWave = parseNonNegativeInt(currentWave, 0);
    const totalAttempts = Math.max(1, Object.values(executionStats)
        .reduce((sum, stat) => sum + resolveScoreStats(stat, normalizedPolicy).attempts, 0));

    const ranked = [];
    const cooled = [];
    for (let index = 0; index < total; index++) {
        const candidate = list[index];
        const key = String(candidate?.id ?? candidate);
        if (selectedKeySet.has(key)) continue;
        const stat = normalizeExecutionStat(executionStats[key]);
        const scoreStats = resolveScoreStats(stat, normalizedPolicy);
        const item = {
            candidate,
            key,
            score: (normalizedPolicy.mode === 'epsilon_ts' || normalizedPolicy.mode === 'sw_epsilon_ts')
                ? computeEpsilonThompsonScore(
                    stat,
                    normalizedCurrentWave,
                    adaptiveScoreConfig,
                    normalizedPolicy,
                    `${selectionScope}:${normalizedPolicy.mode}:${key}:${normalizedCurrentWave}:${scoreStats.attempts}:${scoreStats.successes}:${scoreStats.failures}`
                )
                : computeUcbScore(
                    stat,
                    totalAttempts,
                    normalizedCurrentWave,
                    adaptiveScoreConfig,
                    normalizedPolicy
                ),
            distance: cursorDistance(index, pointer, total),
            cooled: isInFailureCooldown(stat, currentWave, failureCooldownWaves)
        };
        if (item.cooled) cooled.push(item);
        else ranked.push(item);
    }

    ranked.sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return left.distance - right.distance;
    });
    cooled.sort((left, right) => left.distance - right.distance);

    for (const item of [...ranked, ...cooled]) {
        if (selected.length >= limit) break;
        selected.push(item.candidate);
        selectedKeySet.add(item.key);
    }

    return {
        selected,
        nextCursor: pointer
    };
}

export function buildAutonomousBatchPlan({
    skillCatalog,
    capabilityCatalog,
    state,
    skillsPerWave = 20,
    capabilitiesPerWave = 10,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    adaptiveScoreConfig = null,
    selectionPolicyConfig = null,
    skillCatalogSource = 'manifest',
    waveIndex = 0,
    nowFactory = Date.now
}) {
    const normalizedState = normalizeState(state);
    const nowMs = safeNow(nowFactory);
    const normalizedWaveIndex = parseNonNegativeInt(waveIndex, normalizedState.runCount + 1);
    const normalizedAdaptiveScoreConfig = normalizeAdaptiveScoreConfig(adaptiveScoreConfig);
    const normalizedSelectionPolicyConfig = normalizeSelectionPolicyConfig(selectionPolicyConfig);

    const skillSuccessfulSet = new Set(normalizedState.successfulSkillIds.map((value) => String(value)));
    const capabilitySuccessfulSet = new Set(normalizedState.successfulCapabilityIds.map((value) => String(value)));

    const skillSelection = selectCatalogSlice({
        catalog: skillCatalog,
        cursor: normalizedState.skillCursor,
        limit: parseNonNegativeInt(skillsPerWave, 0),
        successfulSet: skillSuccessfulSet,
        executionStats: normalizedState.skillExecutionStats,
        currentWave: normalizedWaveIndex,
        failureCooldownWaves: normalizeFailureCooldownWaves(failureCooldownWaves),
        adaptiveScoreConfig: normalizedAdaptiveScoreConfig,
        selectionPolicyConfig: normalizedSelectionPolicyConfig,
        selectionScope: 'skills'
    });

    const capabilitySelection = selectCatalogSlice({
        catalog: capabilityCatalog,
        cursor: normalizedState.capabilityCursor,
        limit: parseNonNegativeInt(capabilitiesPerWave, 0),
        successfulSet: capabilitySuccessfulSet,
        executionStats: normalizedState.capabilityExecutionStats,
        currentWave: normalizedWaveIndex,
        failureCooldownWaves: normalizeFailureCooldownWaves(failureCooldownWaves),
        adaptiveScoreConfig: normalizedAdaptiveScoreConfig,
        selectionPolicyConfig: normalizedSelectionPolicyConfig,
        selectionScope: 'capabilities'
    });

    const tasks = [];

    for (let i = 0; i < skillSelection.selected.length; i++) {
        const entry = skillSelection.selected[i];
        const taskCreatedAt = nowMs + i;
        const skillCode = normalizeSkillCode(entry.code, entry.id);
        tasks.push(buildTaskRequest({
            from: 'agent:autonomous-openclaw',
            target: 'agent:skills-runtime',
            priority: 'high',
            task: `[AUTO][${skillCode}] Execute ${entry.title}`,
            context: {
                planner: 'cognition-core/autonomous-openclaw',
                autonomy: {
                    lane: 'skills',
                    wave: waveIndex,
                    sourceCatalog: skillCatalogSource
                },
                skillId: entry.id,
                skillCode,
                missionId: `autonomy-wave-${waveIndex}-skill-${entry.id}`,
                skillBlueprint: {
                    code: skillCode,
                    title: entry.title,
                    reason: typeof entry.reason === 'string' ? entry.reason : '',
                    sourceCatalog: skillCatalogSource
                },
                skillInput: buildSkillInput(entry.id, waveIndex, taskCreatedAt)
            },
            createdAt: taskCreatedAt
        }));
    }

    for (let i = 0; i < capabilitySelection.selected.length; i++) {
        const capabilityId = capabilitySelection.selected[i];
        const taskCreatedAt = nowMs + skillSelection.selected.length + i;
        tasks.push(buildTaskRequest({
            from: 'agent:autonomous-openclaw',
            target: 'agent:capability-runtime',
            priority: 'normal',
            task: `[AUTO][capability:${capabilityId}] Evaluate capability status`,
            context: {
                planner: 'cognition-core/autonomous-openclaw',
                autonomy: {
                    lane: 'capabilities',
                    wave: waveIndex
                },
                capabilityId,
                capabilityInput: buildCapabilityInput(capabilityId, waveIndex, taskCreatedAt)
            },
            createdAt: taskCreatedAt
        }));
    }

    return {
        tasks,
        selection: {
            skillIds: skillSelection.selected.map((entry) => entry.id),
            capabilityIds: capabilitySelection.selected.slice()
        },
        nextCursor: {
            skillCursor: skillSelection.nextCursor,
            capabilityCursor: capabilitySelection.nextCursor
        }
    };
}

function recordRecentOutcome(stat, { status, wave }) {
    const normalized = normalizeExecutionStat(stat);
    const normalizedStatus = normalizeStatus(status);
    normalized.recentOutcomes.push({
        wave: parseNonNegativeInt(wave, 0),
        status: normalizedStatus,
        didSucceed: SUCCESS_STATUSES.has(normalizedStatus)
    });
    normalized.recentOutcomes = normalized.recentOutcomes.slice(-MAX_RECENT_OUTCOMES_TRACKED);
    return normalized;
}

export async function collectAutonomousCoverage({
    storePath,
    nowFactory = Date.now
}) {
    const store = new FileTaskStore({
        filePath: storePath,
        now: nowFactory
    });
    const records = await store.loadRecords();

    const successfulSkillIds = new Set();
    const failedSkillIds = new Set();
    const successfulCapabilityIds = new Set();
    const failedCapabilityIds = new Set();
    const skillExecutionStats = {};
    const capabilityExecutionStats = {};

    for (const record of records) {
        const status = normalizeStatus(record?.status);
        if (!TERMINAL_STATUSES.has(status)) continue;

        const context = record?.request?.context && typeof record.request.context === 'object'
            ? record.request.context
            : {};

        const skillId = toSkillId(context.skillId);
        const capabilityId = normalizeCapabilityId(context.capabilityId);
        const attemptAt = Number.isFinite(Number(record?.updatedAt))
            ? Number(record.updatedAt)
            : (Number.isFinite(Number(record?.request?.createdAt))
                ? Number(record.request.createdAt)
                : safeNow(nowFactory));
        const attemptWave = parseNonNegativeInt(
            record?.request?.context?.autonomy?.wave ?? context.autonomy?.wave,
            0
        );
        const didSucceed = SUCCESS_STATUSES.has(status);

        if (skillId !== null) {
            const key = String(skillId);
            let current = normalizeExecutionStat(skillExecutionStats[key]);
            current.attempts += 1;
            if (didSucceed) {
                current.successes += 1;
                current.consecutiveFailures = 0;
                successfulSkillIds.add(skillId);
            } else {
                current.failures += 1;
                current.consecutiveFailures += 1;
                failedSkillIds.add(skillId);
            }
            current.lastStatus = status;
            current.lastAttemptAt = attemptAt;
            current.lastWave = attemptWave > 0 ? attemptWave : current.lastWave;
            current = recordRecentOutcome(current, { status, wave: attemptWave });
            skillExecutionStats[key] = current;
        }

        if (capabilityId) {
            let current = normalizeExecutionStat(capabilityExecutionStats[capabilityId]);
            current.attempts += 1;
            if (didSucceed) {
                current.successes += 1;
                current.consecutiveFailures = 0;
                successfulCapabilityIds.add(capabilityId);
            } else {
                current.failures += 1;
                current.consecutiveFailures += 1;
                failedCapabilityIds.add(capabilityId);
            }
            current.lastStatus = status;
            current.lastAttemptAt = attemptAt;
            current.lastWave = attemptWave > 0 ? attemptWave : current.lastWave;
            current = recordRecentOutcome(current, { status, wave: attemptWave });
            capabilityExecutionStats[capabilityId] = current;
        }
    }

    return {
        successfulSkillIds: [...successfulSkillIds].sort((a, b) => a - b),
        failedSkillIds: [...failedSkillIds].sort((a, b) => a - b),
        successfulCapabilityIds: [...successfulCapabilityIds].sort(),
        failedCapabilityIds: [...failedCapabilityIds].sort(),
        skillExecutionStats: normalizeSkillExecutionStats(skillExecutionStats),
        capabilityExecutionStats: normalizeCapabilityExecutionStats(capabilityExecutionStats)
    };
}

function mergeUniqueNumeric(left = [], right = []) {
    return [...new Set([...left, ...right].map((value) => toSkillId(value)).filter(Boolean))].sort((a, b) => a - b);
}

function mergeUniqueString(left = [], right = []) {
    return [...new Set([...left, ...right].map((value) => normalizeCapabilityId(value)).filter(Boolean))].sort();
}

function mergeExecutionStats(existingStats = {}, incomingStats = {}) {
    const merged = {};
    const existing = existingStats && typeof existingStats === 'object' ? existingStats : {};
    const incoming = incomingStats && typeof incomingStats === 'object' ? incomingStats : {};
    const keys = new Set([...Object.keys(existing), ...Object.keys(incoming)]);

    for (const key of keys) {
        const previous = normalizeExecutionStat(existing[key]);
        const next = normalizeExecutionStat(incoming[key]);
        merged[key] = next.attempts >= previous.attempts ? next : previous;
    }

    return merged;
}

function createCoverageReport({
    skillCatalog,
    capabilityCatalog,
    state
}) {
    return {
        skills: computeCoverageSummary(
            skillCatalog.map((entry) => entry.id),
            state.successfulSkillIds,
            state.failedSkillIds
        ),
        capabilities: computeCoverageSummary(
            capabilityCatalog,
            state.successfulCapabilityIds,
            state.failedCapabilityIds
        )
    };
}

async function sleep(ms) {
    const duration = parseNonNegativeInt(ms, 0);
    if (duration <= 0) return;
    await new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

export function renderAutonomousRunMarkdown(reportPayload) {
    const report = reportPayload && typeof reportPayload === 'object' ? reportPayload : {};
    const coverage = report.coverage || {};

    const lines = [
        '# Autonomous OpenClaw Run',
        '',
        `- stopReason: ${report.stopReason || 'unknown'}`,
        `- wavesRun: ${report.wavesRun || 0}`,
        `- skillCatalogSource: ${report.config?.skillCatalogSource || 'unknown'}`,
        `- skillCatalogPath: ${report.config?.skillCatalogPath || 'n/a'}`,
        `- hardeningProfilePath: ${report.config?.skillHardeningProfilePath || 'n/a'}`,
        `- selectionPolicy: ${report.config?.selectionPolicy?.mode || 'unknown'}`,
        `- planned.skillTasks: ${report.totals?.plannedSkillTasks || 0}`,
        `- planned.capabilityTasks: ${report.totals?.plannedCapabilityTasks || 0}`,
        `- dispatched: ${report.totals?.dispatched || 0}`,
        `- resultsAccepted: ${report.totals?.resultsAccepted || 0}`,
        `- followupTasksSaved: ${report.totals?.followupTasksSaved || 0}`,
        `- botSkillHardeningBlocked: ${report.totals?.botSkillHardeningBlocked || 0}`,
        '',
        '## Coverage',
        '',
        `- skills: ${(Number(coverage.skills?.coverage || 0) * 100).toFixed(2)}% (${coverage.skills?.successful || 0}/${coverage.skills?.total || 0})`,
        `- capabilities: ${(Number(coverage.capabilities?.coverage || 0) * 100).toFixed(2)}% (${coverage.capabilities?.successful || 0}/${coverage.capabilities?.total || 0})`,
        '',
        '## Waves',
        ''
    ];

    const waves = Array.isArray(report.waves) ? report.waves : [];
    if (waves.length === 0) {
        lines.push('- none');
    } else {
        for (const wave of waves) {
            lines.push(`- wave ${wave.wave}: skillTasks=${wave.planned.skillTasks} capabilityTasks=${wave.planned.capabilityTasks} accepted=${wave.enqueue.accepted} skipped=${wave.enqueue.skipped} stopReason=${wave.worker.stopReason}`);
        }
    }

    return lines.join('\n');
}

export async function writeAutonomousRunReport({
    report,
    jsonPath = null,
    markdownPath = null
}) {
    if (typeof jsonPath === 'string' && jsonPath.trim()) {
        const resolved = path.resolve(jsonPath);
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        fs.writeFileSync(resolved, `${JSON.stringify(report, null, 2)}\n`);
    }

    if (typeof markdownPath === 'string' && markdownPath.trim()) {
        const resolved = path.resolve(markdownPath);
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        fs.writeFileSync(resolved, `${renderAutonomousRunMarkdown(report)}\n`);
    }
}

export async function runAutonomousOpenClaw({
    repoRoot = detectOpenClawRepoRoot(process.cwd()),
    skillCatalogPath = null,
    storePath = path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
    outboxDir = path.resolve(process.cwd(), '../swarm-protocol/state/outbox'),
    archiveDir = path.join(path.resolve(process.cwd(), '../swarm-protocol/state/outbox'), 'processed'),
    statePath = path.resolve(process.cwd(), 'reports/autonomous-openclaw/state.json'),
    waves = 1,
    skillsPerWave = 25,
    capabilitiesPerWave = 12,
    dispatchLimit = 100,
    workerCycles = 12,
    workerIdleCycles = 2,
    sleepMs = 0,
    stopOnFullCoverage = true,
    failureRate = 0,
    botRuntime = true,
    botAgentId = 'agent:openclaw-bot',
    skillHardeningPolicy = 'enforce',
    skillHardeningMinScore = 82,
    skillDeployabilityIndexPath = null,
    skillHardeningProfilePath = null,
    enqueueFollowupTasks = true,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    adaptiveScoreConfig = null,
    selectionPolicyConfig = null,
    nowFactory = Date.now
} = {}) {
    const resolvedRepoRoot = path.resolve(repoRoot);
    const resolvedStorePath = path.resolve(storePath);
    const resolvedOutboxDir = path.resolve(outboxDir);
    const resolvedArchiveDir = path.resolve(archiveDir);
    const resolvedDeployabilityIndexPath = typeof skillDeployabilityIndexPath === 'string' && skillDeployabilityIndexPath.trim()
        ? path.resolve(skillDeployabilityIndexPath)
        : path.join(resolvedRepoRoot, 'skills', 'state', 'skills.deployability.index.json');
    const effectiveDeployabilityIndexPath = fs.existsSync(resolvedDeployabilityIndexPath)
        ? resolvedDeployabilityIndexPath
        : null;
    const resolvedHardeningProfilePath = typeof skillHardeningProfilePath === 'string' && skillHardeningProfilePath.trim()
        ? path.resolve(skillHardeningProfilePath)
        : path.join(resolvedRepoRoot, 'skills', 'state', 'skills.hardening.profile.json');
    const effectiveHardeningProfilePath = fs.existsSync(resolvedHardeningProfilePath)
        ? resolvedHardeningProfilePath
        : null;

    const normalizedWaves = parsePositiveInt(waves, 1);
    const normalizedSkillsPerWave = parseNonNegativeInt(skillsPerWave, 0);
    const normalizedCapabilitiesPerWave = parseNonNegativeInt(capabilitiesPerWave, 0);
    const normalizedFailureCooldownWaves = normalizeFailureCooldownWaves(failureCooldownWaves);
    const normalizedAdaptiveScoreConfig = normalizeAdaptiveScoreConfig(adaptiveScoreConfig);
    const normalizedSelectionPolicyConfig = normalizeSelectionPolicyConfig(selectionPolicyConfig);

    const skillCatalogSource = loadSkillCatalogSource({
        repoRoot: resolvedRepoRoot,
        skillCatalogPath
    });
    const skillCatalog = skillCatalogSource.entries;
    const capabilityCatalog = loadCapabilityCatalog(resolvedRepoRoot);

    let state = loadAutonomousState(statePath);

    const totals = {
        plannedSkillTasks: 0,
        plannedCapabilityTasks: 0,
        enqueuedAccepted: 0,
        enqueuedSaved: 0,
        enqueuedSkipped: 0,
        dispatched: 0,
        resultsAccepted: 0,
        followupTasksSaved: 0,
        botTasksExecuted: 0,
        botTasksFailed: 0,
        botSkillHardeningBlocked: 0
    };

    const waveReports = [];
    let stopReason = 'max_waves_reached';

    for (let wave = 1; wave <= normalizedWaves; wave++) {
        const plan = buildAutonomousBatchPlan({
            skillCatalog,
            capabilityCatalog,
            state,
            skillsPerWave: normalizedSkillsPerWave,
            capabilitiesPerWave: normalizedCapabilitiesPerWave,
            failureCooldownWaves: normalizedFailureCooldownWaves,
            adaptiveScoreConfig: normalizedAdaptiveScoreConfig,
            selectionPolicyConfig: normalizedSelectionPolicyConfig,
            skillCatalogSource: skillCatalogSource.source,
            waveIndex: state.runCount + 1,
            nowFactory
        });

        const entries = plan.tasks.map((request) => ({
            source: `autonomous-openclaw:wave-${wave}`,
            request
        }));

        // eslint-disable-next-line no-await-in-loop
        const enqueueResult = await enqueueTaskEntries({
            storePath: resolvedStorePath,
            entries,
            actor: 'agent:autonomous-openclaw',
            nowFactory
        });

        // eslint-disable-next-line no-await-in-loop
        const workerReport = await runBotWorkerLoop({
            storePath: resolvedStorePath,
            outboxDir: resolvedOutboxDir,
            archiveDir: resolvedArchiveDir,
            localAgentId: 'agent:main',
            dispatchLimit: parsePositiveInt(dispatchLimit, 100),
            includeAllCreated: false,
            maxCycles: parsePositiveInt(workerCycles, 12),
            idleCyclesToStop: parsePositiveInt(workerIdleCycles, 2),
            stopWhenOnlyApprovals: true,
            sleepMs: 0,
            etaMs: 1_000,
            resultDelayMs: 500,
            failureRate: normalizeFailureRate(failureRate),
            botRuntime,
            botAgentId,
            botRepoRoot: resolvedRepoRoot,
            skillHardeningPolicy,
            skillHardeningMinScore,
            skillDeployabilityIndexPath: effectiveDeployabilityIndexPath,
            skillHardeningProfilePath: effectiveHardeningProfilePath,
            enqueueFollowupTasks,
            nowFactory
        });

        // eslint-disable-next-line no-await-in-loop
        const coverage = await collectAutonomousCoverage({
            storePath: resolvedStorePath,
            nowFactory
        });

        state = normalizeState({
            ...state,
            runCount: state.runCount + 1,
            skillCursor: plan.nextCursor.skillCursor,
            capabilityCursor: plan.nextCursor.capabilityCursor,
            successfulSkillIds: mergeUniqueNumeric(state.successfulSkillIds, coverage.successfulSkillIds),
            failedSkillIds: mergeUniqueNumeric(state.failedSkillIds, coverage.failedSkillIds),
            successfulCapabilityIds: mergeUniqueString(state.successfulCapabilityIds, coverage.successfulCapabilityIds),
            failedCapabilityIds: mergeUniqueString(state.failedCapabilityIds, coverage.failedCapabilityIds),
            skillExecutionStats: mergeExecutionStats(state.skillExecutionStats, coverage.skillExecutionStats),
            capabilityExecutionStats: mergeExecutionStats(state.capabilityExecutionStats, coverage.capabilityExecutionStats),
            updatedAt: safeNow(nowFactory)
        });

        saveAutonomousState(statePath, state);

        const waveReport = {
            wave,
            skillCatalogSource: skillCatalogSource.source,
            selection: plan.selection,
            planned: {
                totalTasks: plan.tasks.length,
                skillTasks: plan.selection.skillIds.length,
                capabilityTasks: plan.selection.capabilityIds.length
            },
            enqueue: {
                accepted: enqueueResult.stats.accepted,
                saved: enqueueResult.stats.saved,
                skipped: enqueueResult.skipped.length
            },
            worker: {
                stopReason: workerReport.stopReason,
                cyclesRun: workerReport.cyclesRun,
                dispatched: workerReport.totals.dispatched,
                resultsAccepted: workerReport.totals.resultsAccepted,
                followupTasksSaved: workerReport.totals.followupTasksSaved,
                botTasksExecuted: workerReport.totals.botTasksExecuted,
                botTasksFailed: workerReport.totals.botTasksFailed,
                botSkillHardeningBlocked: workerReport.totals.botSkillHardeningBlocked,
                finalQueueOpen: workerReport.finalQueue.open
            }
        };
        waveReports.push(waveReport);

        totals.plannedSkillTasks += waveReport.planned.skillTasks;
        totals.plannedCapabilityTasks += waveReport.planned.capabilityTasks;
        totals.enqueuedAccepted += waveReport.enqueue.accepted;
        totals.enqueuedSaved += waveReport.enqueue.saved;
        totals.enqueuedSkipped += waveReport.enqueue.skipped;
        totals.dispatched += waveReport.worker.dispatched;
        totals.resultsAccepted += waveReport.worker.resultsAccepted;
        totals.followupTasksSaved += waveReport.worker.followupTasksSaved;
        totals.botTasksExecuted += waveReport.worker.botTasksExecuted;
        totals.botTasksFailed += waveReport.worker.botTasksFailed;
        totals.botSkillHardeningBlocked += waveReport.worker.botSkillHardeningBlocked;

        const coverageReport = createCoverageReport({
            skillCatalog,
            capabilityCatalog,
            state
        });

        if (stopOnFullCoverage
            && coverageReport.skills.coverage >= 1
            && coverageReport.capabilities.coverage >= 1) {
            stopReason = 'full_coverage';
            break;
        }

        if (wave < normalizedWaves) {
            // eslint-disable-next-line no-await-in-loop
            await sleep(sleepMs);
        }
    }

    const coverage = createCoverageReport({
        skillCatalog,
        capabilityCatalog,
        state
    });

    return {
        stopReason,
        wavesRun: waveReports.length,
        requestedWaves: normalizedWaves,
        config: {
            skillCatalogSource: skillCatalogSource.source,
            skillCatalogPath: skillCatalogSource.sourcePath,
            skillsPerWave: normalizedSkillsPerWave,
            capabilitiesPerWave: normalizedCapabilitiesPerWave,
            dispatchLimit: parsePositiveInt(dispatchLimit, 100),
            workerCycles: parsePositiveInt(workerCycles, 12),
            workerIdleCycles: parsePositiveInt(workerIdleCycles, 2),
            stopOnFullCoverage,
            failureRate: normalizeFailureRate(failureRate),
            botRuntime,
            failureCooldownWaves: normalizedFailureCooldownWaves,
            adaptiveScore: normalizedAdaptiveScoreConfig,
            selectionPolicy: normalizedSelectionPolicyConfig,
            skillHardeningPolicy,
            skillHardeningMinScore,
            skillDeployabilityIndexPath: effectiveDeployabilityIndexPath,
            skillHardeningProfilePath: effectiveHardeningProfilePath,
            enqueueFollowupTasks
        },
        coverage,
        totals,
        state,
        waves: waveReports
    };
}
