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
const DEFAULT_LINUCB_ALPHA = 0.6;
const MAX_LINUCB_ALPHA = 5;
const DEFAULT_THOMPSON_EXPLORATION = 0.2;
const DEFAULT_THOMPSON_PRIOR_ALPHA = 1;
const DEFAULT_THOMPSON_PRIOR_BETA = 1;
const MAX_THOMPSON_PRIOR = 100;
const DEFAULT_SLIDING_WINDOW_SIZE = 12;
const MAX_SLIDING_WINDOW_SIZE = 200;
const MAX_RECENT_OUTCOMES_TRACKED = 128;
const DEFAULT_DISCOUNT_FACTOR = 0.97;
const MIN_DISCOUNT_FACTOR = 0.5;
const DEFAULT_KL_UCB_CONFIDENCE = 3;
const MAX_KL_UCB_CONFIDENCE = 20;
const DEFAULT_CD_MIN_SAMPLES = 8;
const MAX_CD_MIN_SAMPLES = 64;
const DEFAULT_CD_DRIFT_THRESHOLD = 1.5;
const MAX_CD_DRIFT_THRESHOLD = 10;
const DEFAULT_CD_MEAN_DELTA = 0.02;
const MAX_CD_MEAN_DELTA = 0.5;
const DEFAULT_CORRAL_GAMMA = 0.12;
const MAX_CORRAL_GAMMA = 0.8;
const DEFAULT_CORRAL_ETA = 0.8;
const MAX_CORRAL_ETA = 5;
const DEFAULT_MOSS_ALPHA = 1;
const MAX_MOSS_ALPHA = 10;
const LINUCB_FEATURE_NAMES = [
    'bias',
    'successRate',
    'failureRate',
    'failureStreak',
    'novelty',
    'staleness'
];
const SUPPORTED_SELECTION_POLICY_MODES = new Set([
    'ucb',
    'linucb',
    'd_linucb',
    'epsilon_ts',
    'kl_ucb',
    'sw_ucb',
    'sw_epsilon_ts',
    'sw_kl_ucb',
    'd_ucb',
    'd_epsilon_ts',
    'cd_ucb',
    'corral_exp3',
    'moss_anytime'
]);
const THOMPSON_POLICY_MODES = new Set([
    'epsilon_ts',
    'sw_epsilon_ts',
    'd_epsilon_ts'
]);
const KL_UCB_POLICY_MODES = new Set([
    'kl_ucb',
    'sw_kl_ucb'
]);
const SLIDING_WINDOW_POLICY_MODES = new Set([
    'sw_ucb',
    'sw_epsilon_ts',
    'sw_kl_ucb'
]);
const DISCOUNTED_POLICY_MODES = new Set([
    'd_ucb',
    'd_epsilon_ts',
    'd_linucb'
]);
const CORRAL_BASE_POLICIES = [
    'ucb',
    'epsilon_ts',
    'kl_ucb',
    'cd_ucb'
];

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
    const normalizedMode = SUPPORTED_SELECTION_POLICY_MODES.has(mode)
        ? mode
        : DEFAULT_SELECTION_POLICY_MODE;

    return {
        mode: normalizedMode,
        linucbAlpha: clamp(
            Number.isFinite(Number(value.linucbAlpha))
                ? Number(value.linucbAlpha)
                : DEFAULT_LINUCB_ALPHA,
            Number.EPSILON,
            MAX_LINUCB_ALPHA
        ),
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
        ),
        discountFactor: clamp(
            Number.isFinite(Number(value.discountFactor))
                ? Number(value.discountFactor)
                : DEFAULT_DISCOUNT_FACTOR,
            MIN_DISCOUNT_FACTOR,
            1
        ),
        klUcbConfidence: clamp(
            Number.isFinite(Number(value.klUcbConfidence))
                ? Number(value.klUcbConfidence)
                : DEFAULT_KL_UCB_CONFIDENCE,
            0,
            MAX_KL_UCB_CONFIDENCE
        ),
        changeDetectionMinSamples: clamp(
            Number.isFinite(Number(value.changeDetectionMinSamples))
                ? parsePositiveInt(value.changeDetectionMinSamples, DEFAULT_CD_MIN_SAMPLES)
                : DEFAULT_CD_MIN_SAMPLES,
            2,
            MAX_CD_MIN_SAMPLES
        ),
        changeDetectionThreshold: clamp(
            Number.isFinite(Number(value.changeDetectionThreshold))
                ? Number(value.changeDetectionThreshold)
                : DEFAULT_CD_DRIFT_THRESHOLD,
            Number.EPSILON,
            MAX_CD_DRIFT_THRESHOLD
        ),
        changeDetectionDelta: clamp(
            Number.isFinite(Number(value.changeDetectionDelta))
                ? Number(value.changeDetectionDelta)
                : DEFAULT_CD_MEAN_DELTA,
            0,
            MAX_CD_MEAN_DELTA
        ),
        corralGamma: clamp(
            Number.isFinite(Number(value.corralGamma))
                ? Number(value.corralGamma)
                : DEFAULT_CORRAL_GAMMA,
            0,
            MAX_CORRAL_GAMMA
        ),
        corralEta: clamp(
            Number.isFinite(Number(value.corralEta))
                ? Number(value.corralEta)
                : DEFAULT_CORRAL_ETA,
            Number.EPSILON,
            MAX_CORRAL_ETA
        ),
        mossAlpha: clamp(
            Number.isFinite(Number(value.mossAlpha))
                ? Number(value.mossAlpha)
                : DEFAULT_MOSS_ALPHA,
            Number.EPSILON,
            MAX_MOSS_ALPHA
        )
    };
}

function normalizePolicyPerformanceStat(rawStat = {}) {
    const stat = rawStat && typeof rawStat === 'object' ? rawStat : {};
    const attempts = parseNonNegativeInt(stat.attempts, 0);
    const successes = clamp(parseNonNegativeInt(stat.successes, 0), 0, attempts);
    const failures = clamp(parseNonNegativeInt(stat.failures, 0), 0, attempts);
    const cumulativeReward = Number.isFinite(Number(stat.cumulativeReward))
        ? Math.max(0, Number(stat.cumulativeReward))
        : successes;

    return {
        attempts,
        successes,
        failures,
        cumulativeReward
    };
}

function normalizePolicyPerformanceByLane(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const normalized = {};

    for (const policy of CORRAL_BASE_POLICIES) {
        normalized[policy] = normalizePolicyPerformanceStat(stats[policy]);
    }

    return normalized;
}

function normalizePolicyExecutionStats(rawStats = {}) {
    const stats = rawStats && typeof rawStats === 'object' ? rawStats : {};
    return {
        skills: normalizePolicyPerformanceByLane(stats.skills),
        capabilities: normalizePolicyPerformanceByLane(stats.capabilities)
    };
}

function createIdentityMatrix(size) {
    const n = parsePositiveInt(size, LINUCB_FEATURE_NAMES.length);
    const matrix = [];
    for (let row = 0; row < n; row++) {
        const values = new Array(n).fill(0);
        values[row] = 1;
        matrix.push(values);
    }
    return matrix;
}

function normalizeNumericVector(rawValues, size, fallback = 0) {
    const values = Array.isArray(rawValues) ? rawValues : [];
    const normalized = [];
    for (let i = 0; i < size; i++) {
        const numeric = Number(values[i]);
        normalized.push(Number.isFinite(numeric) ? numeric : fallback);
    }
    return normalized;
}

function normalizeNumericMatrix(rawValues, size, fallbackMatrix) {
    const values = Array.isArray(rawValues) ? rawValues : [];
    const fallback = Array.isArray(fallbackMatrix) ? fallbackMatrix : createIdentityMatrix(size);
    const matrix = [];
    for (let row = 0; row < size; row++) {
        const sourceRow = Array.isArray(values[row]) ? values[row] : fallback[row];
        matrix.push(normalizeNumericVector(sourceRow, size, fallback[row][row] ?? 0));
    }
    return matrix;
}

function normalizeLinUcbModel(rawModel = {}) {
    const model = rawModel && typeof rawModel === 'object' ? rawModel : {};
    const dimension = LINUCB_FEATURE_NAMES.length;
    const defaultMatrix = createIdentityMatrix(dimension);
    return {
        dimension,
        featureNames: LINUCB_FEATURE_NAMES.slice(),
        samples: parseNonNegativeInt(model.samples, 0),
        matrixA: normalizeNumericMatrix(model.matrixA, dimension, defaultMatrix),
        vectorB: normalizeNumericVector(model.vectorB, dimension, 0)
    };
}

function normalizeContextualBanditModels(rawModels = {}) {
    const models = rawModels && typeof rawModels === 'object' ? rawModels : {};
    return {
        skills: normalizeLinUcbModel(models.skills),
        capabilities: normalizeLinUcbModel(models.capabilities)
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
        policyExecutionStats: normalizePolicyExecutionStats(state.policyExecutionStats),
        contextualBanditModels: normalizeContextualBanditModels(state.contextualBanditModels),
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

function computeDiscountedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const outcomes = normalized.recentOutcomes;
    if (outcomes.length <= 0) {
        return {
            attempts: normalized.attempts,
            successes: normalized.successes,
            failures: normalized.failures
        };
    }

    let attempts = 0;
    let successes = 0;
    for (let index = 0; index < outcomes.length; index++) {
        const entry = outcomes[index];
        const age = outcomes.length - 1 - index;
        const weight = Math.pow(policy.discountFactor, age);
        attempts += weight;
        successes += entry.didSucceed ? weight : 0;
    }

    return {
        attempts,
        successes,
        failures: Math.max(0, attempts - successes)
    };
}

function detectPageHinkleyChangeIndex(outcomes = [], selectionPolicyConfig = null) {
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const values = Array.isArray(outcomes)
        ? outcomes.map((entry) => (entry?.didSucceed ? 1 : 0))
        : [];
    const minSamples = parsePositiveInt(policy.changeDetectionMinSamples, DEFAULT_CD_MIN_SAMPLES);
    if (values.length < minSamples) return 0;

    let runningMean = 0;
    let cumulativeDeviation = 0;
    let minDeviation = 0;
    let changeIndex = 0;

    for (let i = 0; i < values.length; i++) {
        const reward = values[i];
        runningMean += (reward - runningMean) / (i + 1);
        cumulativeDeviation += reward - runningMean - policy.changeDetectionDelta;
        minDeviation = Math.min(minDeviation, cumulativeDeviation);
        if ((i + 1) >= minSamples && (cumulativeDeviation - minDeviation) > policy.changeDetectionThreshold) {
            changeIndex = i + 1;
        }
    }

    return clamp(changeIndex, 0, values.length);
}

function computeChangeDetectedStats(stat, selectionPolicyConfig) {
    const normalized = normalizeExecutionStat(stat);
    const changeIndex = detectPageHinkleyChangeIndex(normalized.recentOutcomes, selectionPolicyConfig);
    const effective = changeIndex > 0
        ? normalized.recentOutcomes.slice(changeIndex)
        : normalized.recentOutcomes;
    const attempts = effective.length > 0 ? effective.length : normalized.attempts;
    const successes = effective.length > 0
        ? effective.reduce((count, entry) => count + (entry.didSucceed ? 1 : 0), 0)
        : normalized.successes;
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
    if (SLIDING_WINDOW_POLICY_MODES.has(policy.mode)) {
        const windowed = computeWindowedStats(normalized, policy);
        return {
            ...normalized,
            attempts: windowed.attempts,
            successes: windowed.successes,
            failures: windowed.failures
        };
    }
    if (DISCOUNTED_POLICY_MODES.has(policy.mode)) {
        const discounted = computeDiscountedStats(normalized, policy);
        return {
            ...normalized,
            attempts: discounted.attempts,
            successes: discounted.successes,
            failures: discounted.failures
        };
    }
    if (policy.mode === 'cd_ucb') {
        const changed = computeChangeDetectedStats(normalized, policy);
        return {
            ...normalized,
            attempts: changed.attempts,
            successes: changed.successes,
            failures: changed.failures
        };
    }
    return normalized;
}

function invertMatrix(matrix) {
    const size = Array.isArray(matrix) ? matrix.length : 0;
    if (size <= 0) return null;
    const augmented = matrix.map((row, rowIndex) => {
        const left = normalizeNumericVector(row, size, 0);
        const right = new Array(size).fill(0);
        right[rowIndex] = 1;
        return [...left, ...right];
    });

    for (let pivot = 0; pivot < size; pivot++) {
        let pivotRow = pivot;
        let pivotValue = Math.abs(augmented[pivot][pivot]);
        for (let row = pivot + 1; row < size; row++) {
            const candidate = Math.abs(augmented[row][pivot]);
            if (candidate > pivotValue) {
                pivotValue = candidate;
                pivotRow = row;
            }
        }
        if (pivotValue <= Number.EPSILON) return null;
        if (pivotRow !== pivot) {
            const temp = augmented[pivot];
            augmented[pivot] = augmented[pivotRow];
            augmented[pivotRow] = temp;
        }
        const divisor = augmented[pivot][pivot];
        for (let col = 0; col < (size * 2); col++) {
            augmented[pivot][col] /= divisor;
        }
        for (let row = 0; row < size; row++) {
            if (row === pivot) continue;
            const factor = augmented[row][pivot];
            if (factor === 0) continue;
            for (let col = 0; col < (size * 2); col++) {
                augmented[row][col] -= factor * augmented[pivot][col];
            }
        }
    }

    return augmented.map((row) => row.slice(size));
}

function multiplyMatrixVector(matrix, vector) {
    const rows = Array.isArray(matrix) ? matrix : [];
    const values = Array.isArray(vector) ? vector : [];
    return rows.map((row) => {
        const normalizedRow = normalizeNumericVector(row, values.length, 0);
        let sum = 0;
        for (let i = 0; i < values.length; i++) {
            sum += normalizedRow[i] * values[i];
        }
        return sum;
    });
}

function dotProduct(left, right) {
    const l = Array.isArray(left) ? left : [];
    const r = Array.isArray(right) ? right : [];
    const size = Math.min(l.length, r.length);
    let total = 0;
    for (let i = 0; i < size; i++) {
        total += l[i] * r[i];
    }
    return total;
}

function computeSelectionFeatureVector(stat, currentWave) {
    const normalized = normalizeExecutionStat(stat);
    const attempts = Math.max(0, normalized.attempts);
    const successes = Math.max(0, normalized.successes);
    const failures = Math.max(0, normalized.failures);
    const lastWave = parseNonNegativeInt(normalized.lastWave, 0);
    const wavesSinceAttempt = currentWave > 0 && lastWave > 0
        ? Math.max(0, currentWave - lastWave)
        : currentWave > 0 && attempts <= 0 ? currentWave : 0;
    const successRate = attempts > 0 ? successes / attempts : 0.5;
    const failureRate = attempts > 0 ? failures / attempts : 0.5;
    const failureStreak = attempts > 0
        ? Math.min(1, normalized.consecutiveFailures / Math.max(1, attempts))
        : 0;
    const novelty = attempts > 0 ? 0 : 1;
    const staleness = Math.min(1, wavesSinceAttempt / 12);
    return [
        1,
        successRate,
        failureRate,
        failureStreak,
        novelty,
        staleness
    ];
}

function computeLinUcbScore({
    stat,
    currentWave,
    adaptiveScoreConfig,
    selectionPolicyConfig,
    contextualBanditModel
}) {
    const normalizedStat = resolveScoreStats(stat, selectionPolicyConfig);
    const normalizedPolicy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const normalizedModel = normalizeLinUcbModel(contextualBanditModel);
    const featureVector = computeSelectionFeatureVector(normalizedStat, currentWave);
    const inverse = invertMatrix(normalizedModel.matrixA);
    if (!inverse) {
        return {
            score: Number.NEGATIVE_INFINITY,
            featureVector
        };
    }
    const theta = multiplyMatrixVector(inverse, normalizedModel.vectorB);
    const expectedReward = dotProduct(theta, featureVector);
    const projected = multiplyMatrixVector(inverse, featureVector);
    const uncertainty = Math.sqrt(Math.max(0, dotProduct(featureVector, projected)));
    const adjustments = computeAdaptiveAdjustments(normalizedStat, currentWave, adaptiveScoreConfig);
    const score = expectedReward
        + (normalizedPolicy.linucbAlpha * uncertainty)
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
    return {
        score,
        featureVector
    };
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

function computeBernoulliKlDivergence(p, q) {
    const epsilon = 1e-12;
    const left = clamp(p, epsilon, 1 - epsilon);
    const right = clamp(q, epsilon, 1 - epsilon);
    return (left * Math.log(left / right))
        + ((1 - left) * Math.log((1 - left) / (1 - right)));
}

function computeKlUcbIndex(empiricalMean, attempts, horizon, confidence = DEFAULT_KL_UCB_CONFIDENCE) {
    if (attempts <= 0) return Number.POSITIVE_INFINITY;
    if (empiricalMean >= 1) return 1;

    const safeMean = clamp(empiricalMean, 0, 1);
    const safeHorizon = Math.max(2, horizon);
    const safeAttempts = Math.max(1, attempts);
    const bound = (
        Math.log(safeHorizon)
        + (confidence * Math.log(Math.max(1, Math.log(safeHorizon))))
    ) / safeAttempts;

    let low = safeMean;
    let high = 1;
    for (let i = 0; i < 28; i++) {
        const mid = (low + high) / 2;
        const divergence = computeBernoulliKlDivergence(safeMean, mid);
        if (divergence > bound) {
            high = mid;
        } else {
            low = mid;
        }
    }
    return low;
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

function computeKlUcbScore(stat, totalAttempts, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const empiricalMean = normalized.successes / normalized.attempts;
    const index = computeKlUcbIndex(
        empiricalMean,
        normalized.attempts,
        totalAttempts + 1,
        policy.klUcbConfidence
    );
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return index
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function computeMossAnytimeScore(stat, totalAttempts, totalArms, currentWave, adaptiveScoreConfig, selectionPolicyConfig = null) {
    const normalized = resolveScoreStats(stat, selectionPolicyConfig);
    if (normalized.attempts <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const empiricalMean = normalized.successes / normalized.attempts;
    const horizon = Math.max(2, totalAttempts + 1);
    const arms = Math.max(1, totalArms);
    const ratio = horizon / (arms * Math.max(1, normalized.attempts));
    const explorationTerm = Math.max(0, Math.log(ratio));
    const exploration = Math.sqrt(((1 + policy.mossAlpha) * explorationTerm) / (2 * normalized.attempts));
    const adjustments = computeAdaptiveAdjustments(normalized, currentWave, adaptiveScoreConfig);

    return empiricalMean
        + exploration
        - adjustments.failurePenalty
        + adjustments.recentOutcomeBonus
        + adjustments.staleBoost;
}

function resolveCorralPolicyDistribution(policyExecutionStats, selectionPolicyConfig) {
    const laneStats = normalizePolicyPerformanceByLane(policyExecutionStats);
    const policy = normalizeSelectionPolicyConfig(selectionPolicyConfig);
    const gamma = policy.corralGamma;
    const uniform = 1 / CORRAL_BASE_POLICIES.length;
    const weighted = CORRAL_BASE_POLICIES.map((name) => {
        const reward = Math.max(0, Number(laneStats[name]?.cumulativeReward || 0));
        const scaled = clamp(reward * policy.corralEta, -30, 30);
        return {
            name,
            weight: Math.exp(scaled)
        };
    });
    const sumWeights = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    const safeSum = sumWeights > 0 ? sumWeights : CORRAL_BASE_POLICIES.length;

    return weighted.map((entry) => {
        const exploitation = entry.weight / safeSum;
        return {
            name: entry.name,
            probability: ((1 - gamma) * exploitation) + (gamma * uniform)
        };
    });
}

function pickPolicyFromDistribution(distribution, seedText) {
    const rng = createDeterministicRng(seedText);
    const roll = rng();
    let cumulative = 0;
    for (const item of distribution) {
        cumulative += item.probability;
        if (roll <= cumulative) return item.name;
    }
    return distribution[distribution.length - 1]?.name || DEFAULT_SELECTION_POLICY_MODE;
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
    policyExecutionStats = {},
    contextualBanditModel = null,
    selectionScope = 'catalog'
}) {
    const list = Array.isArray(catalog) ? catalog : [];
    if (list.length === 0 || limit <= 0) {
        return {
            selected: [],
            nextCursor: 0,
            selectedPolicy: normalizeSelectionPolicyConfig(selectionPolicyConfig).mode,
            policyProbabilities: null,
            selectionFeatures: {}
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
    let scoringPolicy = normalizedPolicy;
    let selectedPolicy = normalizedPolicy.mode;
    let policyProbabilities = null;
    const selectionFeatures = {};

    if (normalizedPolicy.mode === 'corral_exp3') {
        const distribution = resolveCorralPolicyDistribution(policyExecutionStats, normalizedPolicy);
        selectedPolicy = pickPolicyFromDistribution(
            distribution,
            `${selectionScope}:corral_exp3:${normalizedCurrentWave}:${pointer}:${total}`
        );
        scoringPolicy = {
            ...normalizedPolicy,
            mode: selectedPolicy
        };
        policyProbabilities = Object.fromEntries(distribution.map((entry) => [
            entry.name,
            Number(entry.probability.toFixed(6))
        ]));
    }

    const totalAttempts = Math.max(1, Object.values(executionStats)
        .reduce((sum, stat) => sum + resolveScoreStats(stat, scoringPolicy).attempts, 0));

    const ranked = [];
    const cooled = [];
    for (let index = 0; index < total; index++) {
        const candidate = list[index];
        const key = String(candidate?.id ?? candidate);
        if (selectedKeySet.has(key)) continue;
        const stat = normalizeExecutionStat(executionStats[key]);
        const scoreStats = resolveScoreStats(stat, scoringPolicy);
        let score;
        let featureVector = null;
        if (THOMPSON_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeEpsilonThompsonScore(
                stat,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy,
                `${selectionScope}:${scoringPolicy.mode}:${key}:${normalizedCurrentWave}:${scoreStats.attempts}:${scoreStats.successes}:${scoreStats.failures}`
            );
        } else if (KL_UCB_POLICY_MODES.has(scoringPolicy.mode)) {
            score = computeKlUcbScore(
                stat,
                totalAttempts,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        } else if (scoringPolicy.mode === 'moss_anytime') {
            score = computeMossAnytimeScore(
                stat,
                totalAttempts,
                total,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        } else if (scoringPolicy.mode === 'linucb' || scoringPolicy.mode === 'd_linucb') {
            const linucb = computeLinUcbScore({
                stat,
                currentWave: normalizedCurrentWave,
                adaptiveScoreConfig,
                selectionPolicyConfig: scoringPolicy,
                contextualBanditModel
            });
            score = linucb.score;
            featureVector = linucb.featureVector;
        } else {
            score = computeUcbScore(
                stat,
                totalAttempts,
                normalizedCurrentWave,
                adaptiveScoreConfig,
                scoringPolicy
            );
        }

        const item = {
            candidate,
            key,
            score,
            featureVector,
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
        if (Array.isArray(item.featureVector) && item.featureVector.length > 0) {
            selectionFeatures[item.key] = {
                names: LINUCB_FEATURE_NAMES.slice(),
                values: item.featureVector.map((value) => Number(Number(value).toFixed(6)))
            };
        }
    }

    return {
        selected,
        nextCursor: pointer,
        selectedPolicy,
        policyProbabilities,
        selectionFeatures
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
        policyExecutionStats: normalizedState.policyExecutionStats.skills,
        contextualBanditModel: normalizedState.contextualBanditModels.skills,
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
        policyExecutionStats: normalizedState.policyExecutionStats.capabilities,
        contextualBanditModel: normalizedState.contextualBanditModels.capabilities,
        selectionScope: 'capabilities'
    });

    const tasks = [];

    for (let i = 0; i < skillSelection.selected.length; i++) {
        const entry = skillSelection.selected[i];
        const taskCreatedAt = nowMs + i;
        const skillCode = normalizeSkillCode(entry.code, entry.id);
        const featureKey = String(entry.id);
        const selectionFeatures = skillSelection.selectionFeatures[featureKey]
            || {
                names: LINUCB_FEATURE_NAMES.slice(),
                values: computeSelectionFeatureVector(
                    normalizedState.skillExecutionStats[featureKey],
                    normalizedWaveIndex
                )
            };
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
                    sourceCatalog: skillCatalogSource,
                    selectionPolicyApplied: skillSelection.selectedPolicy,
                    selectionPolicyConfig: normalizedSelectionPolicyConfig,
                    selectionFeatures
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
        const featureKey = String(capabilityId);
        const selectionFeatures = capabilitySelection.selectionFeatures[featureKey]
            || {
                names: LINUCB_FEATURE_NAMES.slice(),
                values: computeSelectionFeatureVector(
                    normalizedState.capabilityExecutionStats[featureKey],
                    normalizedWaveIndex
                )
            };
        tasks.push(buildTaskRequest({
            from: 'agent:autonomous-openclaw',
            target: 'agent:capability-runtime',
            priority: 'normal',
            task: `[AUTO][capability:${capabilityId}] Evaluate capability status`,
            context: {
                planner: 'cognition-core/autonomous-openclaw',
                autonomy: {
                    lane: 'capabilities',
                    wave: waveIndex,
                    selectionPolicyApplied: capabilitySelection.selectedPolicy,
                    selectionPolicyConfig: normalizedSelectionPolicyConfig,
                    selectionFeatures
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
            capabilityIds: capabilitySelection.selected.slice(),
            policy: {
                skills: skillSelection.selectedPolicy,
                capabilities: capabilitySelection.selectedPolicy
            },
            policyProbabilities: {
                skills: skillSelection.policyProbabilities,
                capabilities: capabilitySelection.policyProbabilities
            }
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

function extractSelectionFeatureVector(context) {
    const values = context?.autonomy?.selectionFeatures?.values;
    if (!Array.isArray(values)) return null;
    const vector = normalizeNumericVector(values, LINUCB_FEATURE_NAMES.length, 0);
    if (vector.length !== LINUCB_FEATURE_NAMES.length) return null;
    return vector;
}

function updateLinUcbModel(model, featureVector, reward) {
    return updateLinUcbModelDiscounted(model, featureVector, reward, 1);
}

function updateLinUcbModelDiscounted(model, featureVector, reward, discountFactor = 1) {
    const normalizedModel = normalizeLinUcbModel(model);
    const vector = normalizeNumericVector(featureVector, LINUCB_FEATURE_NAMES.length, 0);
    const boundedReward = clamp(Number(reward), 0, 1);
    const boundedDiscount = clamp(
        Number.isFinite(Number(discountFactor)) ? Number(discountFactor) : DEFAULT_DISCOUNT_FACTOR,
        MIN_DISCOUNT_FACTOR,
        1
    );
    for (let row = 0; row < vector.length; row++) {
        normalizedModel.vectorB[row] = (boundedDiscount * normalizedModel.vectorB[row])
            + (vector[row] * boundedReward);
        for (let col = 0; col < vector.length; col++) {
            normalizedModel.matrixA[row][col] *= boundedDiscount;
        }
        // Keep ridge regularization stable while discounting historical mass.
        normalizedModel.matrixA[row][row] += (1 - boundedDiscount);
        for (let col = 0; col < vector.length; col++) {
            normalizedModel.matrixA[row][col] += vector[row] * vector[col];
        }
    }
    normalizedModel.samples += 1;
    return normalizedModel;
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
    const policyExecutionStats = normalizePolicyExecutionStats({});
    const contextualBanditModels = normalizeContextualBanditModels({});

    for (const record of records) {
        const status = normalizeStatus(record?.status);
        if (!TERMINAL_STATUSES.has(status)) continue;

        const context = record?.request?.context && typeof record.request.context === 'object'
            ? record.request.context
            : {};
        const lane = context.autonomy?.lane === 'skills' || context.autonomy?.lane === 'capabilities'
            ? context.autonomy.lane
            : null;
        const selectedPolicy = typeof context.autonomy?.selectionPolicyApplied === 'string'
            ? context.autonomy.selectionPolicyApplied.trim().toLowerCase()
            : '';
        const selectedPolicyConfig = normalizeSelectionPolicyConfig(context.autonomy?.selectionPolicyConfig);

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

        if (lane && CORRAL_BASE_POLICIES.includes(selectedPolicy)) {
            const currentPolicy = normalizePolicyPerformanceStat(policyExecutionStats[lane][selectedPolicy]);
            currentPolicy.attempts += 1;
            if (didSucceed) {
                currentPolicy.successes += 1;
                currentPolicy.cumulativeReward += 1;
            } else {
                currentPolicy.failures += 1;
            }
            policyExecutionStats[lane][selectedPolicy] = currentPolicy;
        }

        if (lane && (selectedPolicy === 'linucb' || selectedPolicy === 'd_linucb')) {
            const featureVector = extractSelectionFeatureVector(context);
            if (featureVector) {
                const discountFactor = selectedPolicy === 'd_linucb'
                    ? selectedPolicyConfig.discountFactor
                    : 1;
                contextualBanditModels[lane] = updateLinUcbModelDiscounted(
                    contextualBanditModels[lane],
                    featureVector,
                    didSucceed ? 1 : 0,
                    discountFactor
                );
            }
        }
    }

    return {
        successfulSkillIds: [...successfulSkillIds].sort((a, b) => a - b),
        failedSkillIds: [...failedSkillIds].sort((a, b) => a - b),
        successfulCapabilityIds: [...successfulCapabilityIds].sort(),
        failedCapabilityIds: [...failedCapabilityIds].sort(),
        skillExecutionStats: normalizeSkillExecutionStats(skillExecutionStats),
        capabilityExecutionStats: normalizeCapabilityExecutionStats(capabilityExecutionStats),
        policyExecutionStats: normalizePolicyExecutionStats(policyExecutionStats),
        contextualBanditModels: normalizeContextualBanditModels(contextualBanditModels)
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

function mergePolicyExecutionStats(existingStats = {}, incomingStats = {}) {
    const existing = normalizePolicyExecutionStats(existingStats);
    const incoming = normalizePolicyExecutionStats(incomingStats);
    const merged = normalizePolicyExecutionStats({});

    for (const lane of ['skills', 'capabilities']) {
        for (const policy of CORRAL_BASE_POLICIES) {
            const previous = normalizePolicyPerformanceStat(existing[lane][policy]);
            const next = normalizePolicyPerformanceStat(incoming[lane][policy]);
            merged[lane][policy] = next.attempts >= previous.attempts ? next : previous;
        }
    }

    return merged;
}

function mergeLinUcbModels(existingModel = {}, incomingModel = {}) {
    const previous = normalizeLinUcbModel(existingModel);
    const next = normalizeLinUcbModel(incomingModel);
    return next.samples >= previous.samples ? next : previous;
}

function mergeContextualBanditModels(existingModels = {}, incomingModels = {}) {
    const previous = normalizeContextualBanditModels(existingModels);
    const next = normalizeContextualBanditModels(incomingModels);
    return {
        skills: mergeLinUcbModels(previous.skills, next.skills),
        capabilities: mergeLinUcbModels(previous.capabilities, next.capabilities)
    };
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
            lines.push(`- wave ${wave.wave}: skillTasks=${wave.planned.skillTasks} capabilityTasks=${wave.planned.capabilityTasks} policy.skills=${wave.selection?.policy?.skills || 'n/a'} policy.capabilities=${wave.selection?.policy?.capabilities || 'n/a'} accepted=${wave.enqueue.accepted} skipped=${wave.enqueue.skipped} stopReason=${wave.worker.stopReason}`);
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
            policyExecutionStats: mergePolicyExecutionStats(state.policyExecutionStats, coverage.policyExecutionStats),
            contextualBanditModels: mergeContextualBanditModels(state.contextualBanditModels, coverage.contextualBanditModels),
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
