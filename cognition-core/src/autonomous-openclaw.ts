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

const DEFAULT_FAILURE_STREAK_THRESHOLD = 2;
const DEFAULT_FAILURE_COOLDOWN_WAVES = 2;
const DEFAULT_FAILURE_COOLDOWN_BACKOFF_MULTIPLIER = 2;
const DEFAULT_FAILURE_COOLDOWN_MAX_WAVES = 16;
const DEFAULT_ERROR_BUDGET_WINDOW_WAVES = 4;
const DEFAULT_ERROR_BUDGET_FAILURE_THRESHOLD = 0.4;
const DEFAULT_ERROR_BUDGET_THROTTLE_SCALE = 0.5;
const DEFAULT_ERROR_BUDGET_MIN_TASKS_PER_LANE = 1;
const MAX_WAVE_FAILURE_RATE_HISTORY = 24;

function safeNow(nowFactory = Date.now) {
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function parsePositiveInt(raw, fallback = 1) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) return fallback;
    return value;
}

function parsePositiveNumber(raw, fallback = 1) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) return fallback;
    return value;
}

function parseNonNegativeInt(raw, fallback = 0) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0) return fallback;
    return value;
}

function normalizeNonNegativeRecord(rawRecord) {
    if (!rawRecord || typeof rawRecord !== 'object' || Array.isArray(rawRecord)) {
        return {};
    }

    const normalized = {};
    for (const [key, value] of Object.entries(rawRecord)) {
        if (typeof key !== 'string' || !key.trim()) continue;
        const parsed = parseNonNegativeInt(value, -1);
        if (parsed < 0) continue;
        normalized[String(key)] = parsed;
    }
    return normalized;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeFailureRate(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return clamp(numeric, 0, 1);
}

function normalizeFailureRateSeries(rawValues, maxEntries = MAX_WAVE_FAILURE_RATE_HISTORY) {
    if (!Array.isArray(rawValues)) return [];
    const normalized = rawValues
        .map((value) => normalizeFailureRate(value))
        .filter((value) => Number.isFinite(value));
    if (normalized.length <= maxEntries) return normalized;
    return normalized.slice(normalized.length - maxEntries);
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
        skillFailureStreakById: normalizeNonNegativeRecord(state.skillFailureStreakById),
        capabilityFailureStreakById: normalizeNonNegativeRecord(state.capabilityFailureStreakById),
        skillCooldownUntilRunById: normalizeNonNegativeRecord(state.skillCooldownUntilRunById),
        capabilityCooldownUntilRunById: normalizeNonNegativeRecord(state.capabilityCooldownUntilRunById),
        recentWaveFailureRates: normalizeFailureRateSeries(state.recentWaveFailureRates),
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

function getCatalogEntryId(candidate) {
    if (!candidate || typeof candidate !== 'object') return String(candidate);
    if ('id' in candidate) return String(candidate.id);
    return String(candidate);
}

function selectCatalogSlice({
    catalog,
    cursor,
    limit,
    successfulSet,
    cooldownUntilRunById,
    currentRunCount
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
        const key = getCatalogEntryId(candidate);
        const cooldownUntilRun = parseNonNegativeInt(cooldownUntilRunById?.[key], 0);
        const inCooldown = cooldownUntilRun > 0 && currentRunCount <= cooldownUntilRun;
        if (!selectedKeySet.has(key) && !successfulSet.has(key) && !inCooldown) {
            selected.push(candidate);
            selectedKeySet.add(key);
        }
        pointer = (pointer + 1) % total;
        scanned++;
    }

    scanned = 0;
    while (selected.length < limit && scanned < total) {
        const candidate = list[pointer];
        const key = getCatalogEntryId(candidate);
        if (!selectedKeySet.has(key) && !successfulSet.has(key)) {
            selected.push(candidate);
            selectedKeySet.add(key);
        }
        pointer = (pointer + 1) % total;
        scanned++;
    }

    return {
        selected,
        nextCursor: pointer
    };
}

export function computeFailureCooldownWaves({
    failureStreak = 0,
    failureStreakThreshold = DEFAULT_FAILURE_STREAK_THRESHOLD,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    failureCooldownBackoffMultiplier = DEFAULT_FAILURE_COOLDOWN_BACKOFF_MULTIPLIER,
    failureCooldownMaxWaves = DEFAULT_FAILURE_COOLDOWN_MAX_WAVES
} = {}) {
    const streak = parseNonNegativeInt(failureStreak, 0);
    const threshold = Math.max(1, parsePositiveInt(failureStreakThreshold, DEFAULT_FAILURE_STREAK_THRESHOLD));
    const baseCooldown = parseNonNegativeInt(failureCooldownWaves, DEFAULT_FAILURE_COOLDOWN_WAVES);
    const backoffMultiplier = parsePositiveNumber(
        failureCooldownBackoffMultiplier,
        DEFAULT_FAILURE_COOLDOWN_BACKOFF_MULTIPLIER
    );
    const maxCooldown = parseNonNegativeInt(failureCooldownMaxWaves, DEFAULT_FAILURE_COOLDOWN_MAX_WAVES);

    if (baseCooldown <= 0 || streak < threshold) {
        return 0;
    }

    const extraFailures = Math.max(0, streak - threshold);
    const scaled = Math.round(baseCooldown * Math.pow(backoffMultiplier, extraFailures));
    const bounded = Math.max(baseCooldown, scaled);
    if (maxCooldown <= 0) return bounded;
    return Math.min(maxCooldown, bounded);
}

export function computeWaveFailureRate({
    successfulCount = 0,
    failedCount = 0
} = {}) {
    const successful = parseNonNegativeInt(successfulCount, 0);
    const failed = parseNonNegativeInt(failedCount, 0);
    const terminal = successful + failed;
    if (terminal <= 0) return 0;
    return Number((failed / terminal).toFixed(4));
}

export function computeErrorBudgetThrottle({
    recentWaveFailureRates = [],
    errorBudgetWindowWaves = DEFAULT_ERROR_BUDGET_WINDOW_WAVES,
    errorBudgetFailureThreshold = DEFAULT_ERROR_BUDGET_FAILURE_THRESHOLD,
    errorBudgetThrottleScale = DEFAULT_ERROR_BUDGET_THROTTLE_SCALE
} = {}) {
    const normalizedWindow = Math.max(1, parsePositiveInt(errorBudgetWindowWaves, DEFAULT_ERROR_BUDGET_WINDOW_WAVES));
    const normalizedThreshold = normalizeFailureRate(errorBudgetFailureThreshold);
    const normalizedScale = clamp(Number(errorBudgetThrottleScale), 0.1, 1);
    const samples = normalizeFailureRateSeries(recentWaveFailureRates).slice(-normalizedWindow);
    const averageFailureRate = samples.length > 0
        ? Number((samples.reduce((sum, value) => sum + value, 0) / samples.length).toFixed(4))
        : 0;

    return {
        applied: samples.length > 0 && averageFailureRate >= normalizedThreshold && normalizedScale < 1,
        scale: samples.length > 0 && averageFailureRate >= normalizedThreshold ? normalizedScale : 1,
        averageFailureRate,
        threshold: normalizedThreshold,
        windowWaves: normalizedWindow,
        sampleCount: samples.length
    };
}

export function computeThrottledWaveSize({
    baseCount = 0,
    throttle = {},
    minimumCount = DEFAULT_ERROR_BUDGET_MIN_TASKS_PER_LANE
} = {}) {
    const normalizedBase = parseNonNegativeInt(baseCount, 0);
    if (normalizedBase <= 0 || !throttle || !throttle.applied) {
        return normalizedBase;
    }
    const normalizedMinimum = parseNonNegativeInt(minimumCount, DEFAULT_ERROR_BUDGET_MIN_TASKS_PER_LANE);
    const rawScaled = Math.floor(normalizedBase * Number(throttle.scale || 1));
    return Math.min(
        normalizedBase,
        Math.max(normalizedMinimum, rawScaled)
    );
}

export function buildAutonomousBatchPlan({
    skillCatalog,
    capabilityCatalog,
    state,
    skillsPerWave = 20,
    capabilitiesPerWave = 10,
    failureStreakThreshold = DEFAULT_FAILURE_STREAK_THRESHOLD,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    failureCooldownBackoffMultiplier = DEFAULT_FAILURE_COOLDOWN_BACKOFF_MULTIPLIER,
    failureCooldownMaxWaves = DEFAULT_FAILURE_COOLDOWN_MAX_WAVES,
    skillCatalogSource = 'manifest',
    waveIndex = 0,
    nowFactory = Date.now
}) {
    const normalizedState = normalizeState(state);
    const nowMs = safeNow(nowFactory);
    const currentRunCount = normalizedState.runCount + 1;
    const normalizedFailureStreakThreshold = Math.max(1, parsePositiveInt(failureStreakThreshold, DEFAULT_FAILURE_STREAK_THRESHOLD));
    const normalizedFailureCooldownWaves = parseNonNegativeInt(failureCooldownWaves, DEFAULT_FAILURE_COOLDOWN_WAVES);
    const normalizedFailureCooldownBackoffMultiplier = parsePositiveNumber(
        failureCooldownBackoffMultiplier,
        DEFAULT_FAILURE_COOLDOWN_BACKOFF_MULTIPLIER
    );
    const normalizedFailureCooldownMaxWaves = parseNonNegativeInt(
        failureCooldownMaxWaves,
        DEFAULT_FAILURE_COOLDOWN_MAX_WAVES
    );

    const skillSuccessfulSet = new Set(normalizedState.successfulSkillIds.map((value) => String(value)));
    const capabilitySuccessfulSet = new Set(normalizedState.successfulCapabilityIds.map((value) => String(value)));

    const skillSelection = selectCatalogSlice({
        catalog: skillCatalog,
        cursor: normalizedState.skillCursor,
        limit: parseNonNegativeInt(skillsPerWave, 0),
        successfulSet: skillSuccessfulSet,
        cooldownUntilRunById: normalizedState.skillCooldownUntilRunById,
        currentRunCount
    });

    const capabilitySelection = selectCatalogSlice({
        catalog: capabilityCatalog,
        cursor: normalizedState.capabilityCursor,
        limit: parseNonNegativeInt(capabilitiesPerWave, 0),
        successfulSet: capabilitySuccessfulSet,
        cooldownUntilRunById: normalizedState.capabilityCooldownUntilRunById,
        currentRunCount
    });

    const tasks = [];

    for (let i = 0; i < skillSelection.selected.length; i++) {
        const entry = skillSelection.selected[i];
        const taskCreatedAt = nowMs + i;
        const skillCode = normalizeSkillCode(entry.code, entry.id);
        const skillIdKey = String(entry.id);
        const failureStreak = parseNonNegativeInt(normalizedState.skillFailureStreakById[skillIdKey], 0);
        const cooldownUntilRun = parseNonNegativeInt(normalizedState.skillCooldownUntilRunById[skillIdKey], 0);
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
                    reliability: {
                        failureStreak,
                        cooldownUntilRun,
                        failureStreakThreshold: normalizedFailureStreakThreshold,
                        failureCooldownWaves: normalizedFailureCooldownWaves,
                        failureCooldownBackoffMultiplier: normalizedFailureCooldownBackoffMultiplier,
                        failureCooldownMaxWaves: normalizedFailureCooldownMaxWaves
                    }
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
        const failureStreak = parseNonNegativeInt(normalizedState.capabilityFailureStreakById[capabilityId], 0);
        const cooldownUntilRun = parseNonNegativeInt(normalizedState.capabilityCooldownUntilRunById[capabilityId], 0);
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
                    reliability: {
                        failureStreak,
                        cooldownUntilRun,
                        failureStreakThreshold: normalizedFailureStreakThreshold,
                        failureCooldownWaves: normalizedFailureCooldownWaves,
                        failureCooldownBackoffMultiplier: normalizedFailureCooldownBackoffMultiplier,
                        failureCooldownMaxWaves: normalizedFailureCooldownMaxWaves
                    }
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

    for (const record of records) {
        const status = normalizeStatus(record?.status);
        if (!TERMINAL_STATUSES.has(status)) continue;

        const context = record?.request?.context && typeof record.request.context === 'object'
            ? record.request.context
            : {};

        const skillId = toSkillId(context.skillId);
        const capabilityId = normalizeCapabilityId(context.capabilityId);

        if (skillId !== null) {
            if (SUCCESS_STATUSES.has(status)) {
                successfulSkillIds.add(skillId);
            } else {
                failedSkillIds.add(skillId);
            }
        }

        if (capabilityId) {
            if (SUCCESS_STATUSES.has(status)) {
                successfulCapabilityIds.add(capabilityId);
            } else {
                failedCapabilityIds.add(capabilityId);
            }
        }
    }

    return {
        successfulSkillIds: [...successfulSkillIds].sort((a, b) => a - b),
        failedSkillIds: [...failedSkillIds].sort((a, b) => a - b),
        successfulCapabilityIds: [...successfulCapabilityIds].sort(),
        failedCapabilityIds: [...failedCapabilityIds].sort()
    };
}

async function collectWaveOutcomes({
    storePath,
    selectedSkillIds = [],
    selectedCapabilityIds = [],
    nowFactory = Date.now
}) {
    const store = new FileTaskStore({
        filePath: storePath,
        now: nowFactory
    });
    const records = await store.loadRecords();

    const skillOutcomeById = new Map(selectedSkillIds.map((id) => [String(id), 'pending']));
    const capabilityOutcomeById = new Map(selectedCapabilityIds.map((id) => [String(id), 'pending']));

    for (const record of records) {
        const status = normalizeStatus(record?.status);
        if (!TERMINAL_STATUSES.has(status)) continue;

        const context = record?.request?.context && typeof record.request.context === 'object'
            ? record.request.context
            : {};
        const skillId = toSkillId(context.skillId);
        const capabilityId = normalizeCapabilityId(context.capabilityId);
        const success = SUCCESS_STATUSES.has(status);

        if (skillId !== null) {
            const key = String(skillId);
            if (skillOutcomeById.has(key)) {
                if (success) {
                    skillOutcomeById.set(key, 'success');
                } else if (skillOutcomeById.get(key) !== 'success') {
                    skillOutcomeById.set(key, 'failed');
                }
            }
        }

        if (capabilityId) {
            if (capabilityOutcomeById.has(capabilityId)) {
                if (success) {
                    capabilityOutcomeById.set(capabilityId, 'success');
                } else if (capabilityOutcomeById.get(capabilityId) !== 'success') {
                    capabilityOutcomeById.set(capabilityId, 'failed');
                }
            }
        }
    }

    const successfulSkillIds = [];
    const failedSkillIds = [];
    for (const [id, outcome] of skillOutcomeById.entries()) {
        if (outcome === 'success') successfulSkillIds.push(Number(id));
        else if (outcome === 'failed') failedSkillIds.push(Number(id));
    }

    const successfulCapabilityIds = [];
    const failedCapabilityIds = [];
    for (const [id, outcome] of capabilityOutcomeById.entries()) {
        if (outcome === 'success') successfulCapabilityIds.push(id);
        else if (outcome === 'failed') failedCapabilityIds.push(id);
    }

    successfulSkillIds.sort((a, b) => a - b);
    failedSkillIds.sort((a, b) => a - b);
    successfulCapabilityIds.sort();
    failedCapabilityIds.sort();

    const successfulCount = successfulSkillIds.length + successfulCapabilityIds.length;
    const failedCount = failedSkillIds.length + failedCapabilityIds.length;
    const plannedCount = skillOutcomeById.size + capabilityOutcomeById.size;
    const terminalCount = successfulCount + failedCount;

    return {
        successfulSkillIds,
        failedSkillIds,
        successfulCapabilityIds,
        failedCapabilityIds,
        summary: {
            plannedCount,
            terminalCount,
            successfulCount,
            failedCount,
            pendingCount: Math.max(0, plannedCount - terminalCount),
            failureRate: computeWaveFailureRate({
                successfulCount,
                failedCount
            })
        }
    };
}

function mergeUniqueNumeric(left = [], right = []) {
    return [...new Set([...left, ...right].map((value) => toSkillId(value)).filter(Boolean))].sort((a, b) => a - b);
}

function mergeUniqueString(left = [], right = []) {
    return [...new Set([...left, ...right].map((value) => normalizeCapabilityId(value)).filter(Boolean))].sort();
}

function updateReliabilityForWave({
    selectedIds,
    successfulSet,
    failedSet,
    previousFailureStreakById,
    previousCooldownUntilRunById,
    runCount,
    failureStreakThreshold,
    failureCooldownWaves,
    failureCooldownBackoffMultiplier,
    failureCooldownMaxWaves
}) {
    const nextFailureStreakById = { ...normalizeNonNegativeRecord(previousFailureStreakById) };
    const nextCooldownUntilRunById = { ...normalizeNonNegativeRecord(previousCooldownUntilRunById) };
    const normalizedThreshold = Math.max(1, parsePositiveInt(failureStreakThreshold, DEFAULT_FAILURE_STREAK_THRESHOLD));
    const normalizedCooldownWaves = parseNonNegativeInt(failureCooldownWaves, DEFAULT_FAILURE_COOLDOWN_WAVES);
    const normalizedCooldownBackoffMultiplier = parsePositiveNumber(
        failureCooldownBackoffMultiplier,
        DEFAULT_FAILURE_COOLDOWN_BACKOFF_MULTIPLIER
    );
    const normalizedCooldownMaxWaves = parseNonNegativeInt(
        failureCooldownMaxWaves,
        DEFAULT_FAILURE_COOLDOWN_MAX_WAVES
    );

    for (const rawId of selectedIds) {
        const id = String(rawId);
        if (!id) continue;

        if (successfulSet.has(id)) {
            delete nextFailureStreakById[id];
            delete nextCooldownUntilRunById[id];
            continue;
        }

        if (failedSet.has(id)) {
            const nextFailureStreak = parseNonNegativeInt(nextFailureStreakById[id], 0) + 1;
            nextFailureStreakById[id] = nextFailureStreak;
            const cooldownWaves = computeFailureCooldownWaves({
                failureStreak: nextFailureStreak,
                failureStreakThreshold: normalizedThreshold,
                failureCooldownWaves: normalizedCooldownWaves,
                failureCooldownBackoffMultiplier: normalizedCooldownBackoffMultiplier,
                failureCooldownMaxWaves: normalizedCooldownMaxWaves
            });
            if (cooldownWaves > 0) {
                nextCooldownUntilRunById[id] = runCount + cooldownWaves;
            }
        }
    }

    return {
        failureStreakById: nextFailureStreakById,
        cooldownUntilRunById: nextCooldownUntilRunById
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
    failureStreakThreshold = DEFAULT_FAILURE_STREAK_THRESHOLD,
    failureCooldownWaves = DEFAULT_FAILURE_COOLDOWN_WAVES,
    failureCooldownBackoffMultiplier = DEFAULT_FAILURE_COOLDOWN_BACKOFF_MULTIPLIER,
    failureCooldownMaxWaves = DEFAULT_FAILURE_COOLDOWN_MAX_WAVES,
    errorBudgetWindowWaves = DEFAULT_ERROR_BUDGET_WINDOW_WAVES,
    errorBudgetFailureThreshold = DEFAULT_ERROR_BUDGET_FAILURE_THRESHOLD,
    errorBudgetThrottleScale = DEFAULT_ERROR_BUDGET_THROTTLE_SCALE,
    errorBudgetMinTasksPerLane = DEFAULT_ERROR_BUDGET_MIN_TASKS_PER_LANE,
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
    const normalizedFailureStreakThreshold = Math.max(1, parsePositiveInt(failureStreakThreshold, DEFAULT_FAILURE_STREAK_THRESHOLD));
    const normalizedFailureCooldownWaves = parseNonNegativeInt(failureCooldownWaves, DEFAULT_FAILURE_COOLDOWN_WAVES);
    const normalizedFailureCooldownBackoffMultiplier = parsePositiveNumber(
        failureCooldownBackoffMultiplier,
        DEFAULT_FAILURE_COOLDOWN_BACKOFF_MULTIPLIER
    );
    const normalizedFailureCooldownMaxWaves = parseNonNegativeInt(
        failureCooldownMaxWaves,
        DEFAULT_FAILURE_COOLDOWN_MAX_WAVES
    );
    const normalizedErrorBudgetWindowWaves = Math.max(
        1,
        parsePositiveInt(errorBudgetWindowWaves, DEFAULT_ERROR_BUDGET_WINDOW_WAVES)
    );
    const normalizedErrorBudgetFailureThreshold = normalizeFailureRate(errorBudgetFailureThreshold);
    const normalizedErrorBudgetThrottleScale = clamp(Number(errorBudgetThrottleScale), 0.1, 1);
    const normalizedErrorBudgetMinTasksPerLane = parseNonNegativeInt(
        errorBudgetMinTasksPerLane,
        DEFAULT_ERROR_BUDGET_MIN_TASKS_PER_LANE
    );

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
        const errorBudgetThrottle = computeErrorBudgetThrottle({
            recentWaveFailureRates: state.recentWaveFailureRates,
            errorBudgetWindowWaves: normalizedErrorBudgetWindowWaves,
            errorBudgetFailureThreshold: normalizedErrorBudgetFailureThreshold,
            errorBudgetThrottleScale: normalizedErrorBudgetThrottleScale
        });
        const effectiveSkillsPerWave = computeThrottledWaveSize({
            baseCount: normalizedSkillsPerWave,
            throttle: errorBudgetThrottle,
            minimumCount: normalizedErrorBudgetMinTasksPerLane
        });
        const effectiveCapabilitiesPerWave = computeThrottledWaveSize({
            baseCount: normalizedCapabilitiesPerWave,
            throttle: errorBudgetThrottle,
            minimumCount: normalizedErrorBudgetMinTasksPerLane
        });

        const plan = buildAutonomousBatchPlan({
            skillCatalog,
            capabilityCatalog,
            state,
            skillsPerWave: effectiveSkillsPerWave,
            capabilitiesPerWave: effectiveCapabilitiesPerWave,
            failureStreakThreshold: normalizedFailureStreakThreshold,
            failureCooldownWaves: normalizedFailureCooldownWaves,
            failureCooldownBackoffMultiplier: normalizedFailureCooldownBackoffMultiplier,
            failureCooldownMaxWaves: normalizedFailureCooldownMaxWaves,
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
        const waveOutcome = await collectWaveOutcomes({
            storePath: resolvedStorePath,
            selectedSkillIds: plan.selection.skillIds,
            selectedCapabilityIds: plan.selection.capabilityIds,
            nowFactory
        });

        const nextRunCount = state.runCount + 1;
        const skillOutcome = updateReliabilityForWave({
            selectedIds: plan.selection.skillIds,
            successfulSet: new Set(waveOutcome.successfulSkillIds.map((value) => String(value))),
            failedSet: new Set(waveOutcome.failedSkillIds.map((value) => String(value))),
            previousFailureStreakById: state.skillFailureStreakById,
            previousCooldownUntilRunById: state.skillCooldownUntilRunById,
            runCount: nextRunCount,
            failureStreakThreshold: normalizedFailureStreakThreshold,
            failureCooldownWaves: normalizedFailureCooldownWaves,
            failureCooldownBackoffMultiplier: normalizedFailureCooldownBackoffMultiplier,
            failureCooldownMaxWaves: normalizedFailureCooldownMaxWaves
        });
        const capabilityOutcome = updateReliabilityForWave({
            selectedIds: plan.selection.capabilityIds,
            successfulSet: new Set(waveOutcome.successfulCapabilityIds.map((value) => String(value))),
            failedSet: new Set(waveOutcome.failedCapabilityIds.map((value) => String(value))),
            previousFailureStreakById: state.capabilityFailureStreakById,
            previousCooldownUntilRunById: state.capabilityCooldownUntilRunById,
            runCount: nextRunCount,
            failureStreakThreshold: normalizedFailureStreakThreshold,
            failureCooldownWaves: normalizedFailureCooldownWaves,
            failureCooldownBackoffMultiplier: normalizedFailureCooldownBackoffMultiplier,
            failureCooldownMaxWaves: normalizedFailureCooldownMaxWaves
        });

        state = normalizeState({
            ...state,
            runCount: nextRunCount,
            skillCursor: plan.nextCursor.skillCursor,
            capabilityCursor: plan.nextCursor.capabilityCursor,
            successfulSkillIds: mergeUniqueNumeric(state.successfulSkillIds, waveOutcome.successfulSkillIds),
            failedSkillIds: mergeUniqueNumeric(state.failedSkillIds, waveOutcome.failedSkillIds),
            successfulCapabilityIds: mergeUniqueString(state.successfulCapabilityIds, waveOutcome.successfulCapabilityIds),
            failedCapabilityIds: mergeUniqueString(state.failedCapabilityIds, waveOutcome.failedCapabilityIds),
            skillFailureStreakById: skillOutcome.failureStreakById,
            capabilityFailureStreakById: capabilityOutcome.failureStreakById,
            skillCooldownUntilRunById: skillOutcome.cooldownUntilRunById,
            capabilityCooldownUntilRunById: capabilityOutcome.cooldownUntilRunById,
            recentWaveFailureRates: normalizeFailureRateSeries([
                ...normalizeFailureRateSeries(state.recentWaveFailureRates),
                waveOutcome.summary.failureRate
            ]),
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
            errorBudget: {
                throttleApplied: errorBudgetThrottle.applied,
                throttleScale: errorBudgetThrottle.scale,
                averageFailureRate: errorBudgetThrottle.averageFailureRate,
                threshold: errorBudgetThrottle.threshold,
                windowWaves: errorBudgetThrottle.windowWaves,
                sampleCount: errorBudgetThrottle.sampleCount
            },
            outcomes: waveOutcome.summary,
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
            failureStreakThreshold: normalizedFailureStreakThreshold,
            failureCooldownWaves: normalizedFailureCooldownWaves,
            failureCooldownBackoffMultiplier: normalizedFailureCooldownBackoffMultiplier,
            failureCooldownMaxWaves: normalizedFailureCooldownMaxWaves,
            errorBudgetWindowWaves: normalizedErrorBudgetWindowWaves,
            errorBudgetFailureThreshold: normalizedErrorBudgetFailureThreshold,
            errorBudgetThrottleScale: normalizedErrorBudgetThrottleScale,
            errorBudgetMinTasksPerLane: normalizedErrorBudgetMinTasksPerLane,
            dispatchLimit: parsePositiveInt(dispatchLimit, 100),
            workerCycles: parsePositiveInt(workerCycles, 12),
            workerIdleCycles: parsePositiveInt(workerIdleCycles, 2),
            stopOnFullCoverage,
            failureRate: normalizeFailureRate(failureRate),
            botRuntime,
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
