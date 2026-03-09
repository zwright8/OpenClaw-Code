import { randomUUID } from 'crypto';
import { TaskReceipt, TaskRequest, TaskResult } from './schemas.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'cancelled',
    'rejected',
    'timed_out',
    'transport_error'
]);

const OPEN_STATUSES = new Set([
    'created',
    'dispatched',
    'acknowledged',
    'retry_scheduled'
]);

const APPROVAL_PENDING_STATUS = 'awaiting_approval';
const RETRY_BACKOFF_STRATEGIES = new Set(['fixed', 'exponential']);
const RETRY_JITTER_STRATEGIES = new Set(['none', 'full']);
const CIRCUIT_STATES = new Set(['closed', 'open', 'half_open']);
const TRANSIENT_REJECTION_MARKERS = [
    'overload',
    'overloaded',
    'busy',
    'rate_limit',
    'rate-limit',
    'too_many_requests',
    'service_unavailable',
    'temporarily_unavailable',
    'throttle',
    'backpressure',
    'try_again',
    'retry_later',
    'capacity'
];

const DEFAULT_DEAD_LETTER_MAX_ENTRIES = 250;
const DEFAULT_ADAPTIVE_TIMEOUT_ALPHA = 0.125;
const DEFAULT_ADAPTIVE_TIMEOUT_BETA = 0.25;
const DEFAULT_TARGET_SELECTION_CHOICES = 2;
const DEFAULT_TARGET_OUTLIER_FAILURE_THRESHOLD = 3;
const DEFAULT_TARGET_OUTLIER_BASE_EJECTION_MS = 30_000;
const DEFAULT_TARGET_OUTLIER_MAX_EJECTION_MS = 5 * 60_000;
const DEFAULT_HEDGE_DELAY_RATIO = 0.8;
const DEFAULT_HEDGE_MIN_DELAY_MS = 250;
const DEFAULT_HEDGE_MAX_DELAY_MS = 5_000;
const DEFAULT_HEDGE_MAX_DISPATCHES = 1;
const DEFAULT_HEDGE_ELIGIBLE_PRIORITIES = ['high', 'critical'];
const DEFAULT_ADAPTIVE_THROTTLE_WINDOW_MS = 30_000;
const DEFAULT_ADAPTIVE_THROTTLE_MIN_SAMPLES = 10;
const DEFAULT_ADAPTIVE_THROTTLE_DROP_THRESHOLD = 0.5;
const IN_FLIGHT_STATUSES = new Set(['dispatched', 'acknowledged']);
const HIGH_PRIORITY_TASKS = new Set(['critical', 'high']);
const PRIORITY_RANK = {
    critical: 0,
    high: 1,
    normal: 2,
    low: 3
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function canonicalize(value) {
    if (Array.isArray(value)) {
        return value.map((entry) => canonicalize(entry));
    }
    if (value && typeof value === 'object') {
        const ordered = {};
        for (const key of Object.keys(value).sort()) {
            ordered[key] = canonicalize(value[key]);
        }
        return ordered;
    }
    return value;
}

function stableStringify(value) {
    return JSON.stringify(canonicalize(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function clampNonNegativeNumber(value, fallback) {
    return Number.isFinite(value) && value >= 0
        ? Number(value)
        : fallback;
}

function clampPositiveNumber(value, fallback) {
    return Number.isFinite(value) && value > 0
        ? Number(value)
        : fallback;
}

function clampRatio(value, fallback) {
    if (!Number.isFinite(value)) return fallback;
    const numeric = Number(value);
    if (numeric <= 0 || numeric >= 1) return fallback;
    return numeric;
}

function normalizeBulkheadLimit(value, fallback) {
    if (value === null || value === undefined) return fallback;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return Number.POSITIVE_INFINITY;
    return Math.max(1, Math.floor(numeric));
}

function normalizePositiveIntOrInfinity(value, fallback) {
    if (value === null || value === undefined) return fallback;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return Number.POSITIVE_INFINITY;
    if (numeric <= 0) return Number.POSITIVE_INFINITY;
    return Math.max(1, Math.floor(numeric));
}

function normalizeNonNegativeInt(value, fallback) {
    if (value === null || value === undefined) return fallback;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return fallback;
    return Math.floor(numeric);
}

function normalizeNonEmptyString(value) {
    if (typeof value !== 'string') return null;
    const normalized = value.trim();
    return normalized ? normalized : null;
}

export function buildTaskRequest({
    from,
    target,
    task,
    priority = 'normal',
    context,
    constraints,
    id = randomUUID(),
    createdAt = Date.now()
}) {
    return TaskRequest.parse({
        kind: 'task_request',
        id,
        from,
        target,
        priority,
        task,
        context,
        constraints,
        createdAt
    });
}

export function buildTaskReceipt({
    taskId,
    from,
    accepted,
    reason,
    etaMs,
    timestamp = Date.now()
}) {
    return TaskReceipt.parse({
        kind: 'task_receipt',
        taskId,
        from,
        accepted,
        reason,
        etaMs,
        timestamp
    });
}

export function buildTaskResult({
    taskId,
    from,
    status,
    output,
    artifacts,
    metrics,
    completedAt = Date.now()
}) {
    return TaskResult.parse({
        kind: 'task_result',
        taskId,
        from,
        status,
        output,
        artifacts,
        metrics,
        completedAt
    });
}

export class TaskOrchestratorError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'TaskOrchestratorError';
        this.code = code;
        this.details = details;
    }
}

export class TaskOrchestrator {
    constructor({
        localAgentId,
        transport,
        routeTask = null,
        dispatchPolicy = null,
        approvalPolicy = null,
        auditLog = null,
        store = null,
        defaultTimeoutMs = 30_000,
        maxRetries = 1,
        retryDelayMs = 500,
        retryBackoffStrategy = 'fixed',
        retryJitter = 'none',
        maxRetryDelayMs = 30_000,
        maxRetryHintMs = null,
        retryTokenBucketCapacity = 32,
        retryTokenRefillPerSecond = 4,
        retryTokenCost = 1,
        idempotencyKeyTtlMs = 5 * 60_000,
        circuitBreakerFailureThreshold = 3,
        circuitBreakerCooldownMs = 15_000,
        circuitBreakerHalfOpenProbeCooldownMs = 250,
        bulkheadMaxInFlightPerTarget = 8,
        bulkheadMaxInFlightGlobal = Number.POSITIVE_INFINITY,
        bulkheadGlobalHighPriorityReserve = 0,
        bulkheadRetryDelayMs = 250,
        deadLetterMaxEntries = DEFAULT_DEAD_LETTER_MAX_ENTRIES,
        adaptiveTimeoutEnabled = true,
        adaptiveTimeoutMinMs = 250,
        adaptiveTimeoutMaxMs = 120_000,
        adaptiveTimeoutSafetyMarginMs = 100,
        adaptiveTimeoutAlpha = DEFAULT_ADAPTIVE_TIMEOUT_ALPHA,
        adaptiveTimeoutBeta = DEFAULT_ADAPTIVE_TIMEOUT_BETA,
        targetSelectionChoices = DEFAULT_TARGET_SELECTION_CHOICES,
        targetOutlierFailureThreshold = DEFAULT_TARGET_OUTLIER_FAILURE_THRESHOLD,
        targetOutlierBaseEjectionMs = DEFAULT_TARGET_OUTLIER_BASE_EJECTION_MS,
        targetOutlierMaxEjectionMs = DEFAULT_TARGET_OUTLIER_MAX_EJECTION_MS,
        maintenanceRetryBatchLimit = Number.POSITIVE_INFINITY,
        maintenanceHighPriorityShare = 2,
        retryBudgetRatio = 0.2,
        retryBudgetMinPerWindow = 3,
        retryBudgetWindowMs = 10_000,
        maxRetryElapsedMs = null,
        hedgingEnabled = false,
        hedgingDelayRatio = DEFAULT_HEDGE_DELAY_RATIO,
        hedgingMinDelayMs = DEFAULT_HEDGE_MIN_DELAY_MS,
        hedgingMaxDelayMs = DEFAULT_HEDGE_MAX_DELAY_MS,
        hedgingMaxDispatches = DEFAULT_HEDGE_MAX_DISPATCHES,
        hedgingEligiblePriorities = DEFAULT_HEDGE_ELIGIBLE_PRIORITIES,
        adaptiveThrottleEnabled = false,
        adaptiveThrottleWindowMs = DEFAULT_ADAPTIVE_THROTTLE_WINDOW_MS,
        adaptiveThrottleMinSamples = DEFAULT_ADAPTIVE_THROTTLE_MIN_SAMPLES,
        adaptiveThrottleDropThreshold = DEFAULT_ADAPTIVE_THROTTLE_DROP_THRESHOLD,
        adaptiveThrottleBypassPriorities = ['high', 'critical'],
        random = Math.random,
        now = Date.now,
        logger = console
    }) {
        if (!localAgentId || typeof localAgentId !== 'string') {
            throw new TaskOrchestratorError('INVALID_OPTIONS', 'localAgentId is required');
        }

        if (!transport || typeof transport.send !== 'function') {
            throw new TaskOrchestratorError(
                'INVALID_TRANSPORT',
                'transport must expose send(targetAgentId, message)'
            );
        }

        this.localAgentId = localAgentId;
        this.transport = transport;
        this.routeTask = typeof routeTask === 'function' ? routeTask : null;
        this.dispatchPolicy = typeof dispatchPolicy === 'function' ? dispatchPolicy : null;
        this.approvalPolicy = typeof approvalPolicy === 'function' ? approvalPolicy : null;
        this.auditLog = auditLog && typeof auditLog.append === 'function' ? auditLog : null;
        this.store = store && typeof store === 'object' ? store : null;
        this.defaultTimeoutMs = Number.isFinite(defaultTimeoutMs) && defaultTimeoutMs > 0
            ? Number(defaultTimeoutMs)
            : 30_000;
        this.maxRetries = Number.isInteger(maxRetries) && maxRetries >= 0
            ? maxRetries
            : 1;
        this.retryDelayMs = clampNonNegativeNumber(retryDelayMs, 500);
        this.retryBackoffStrategy = RETRY_BACKOFF_STRATEGIES.has(retryBackoffStrategy)
            ? retryBackoffStrategy
            : 'fixed';
        this.retryJitter = RETRY_JITTER_STRATEGIES.has(retryJitter)
            ? retryJitter
            : 'none';
        this.maxRetryDelayMs = Math.max(
            this.retryDelayMs,
            clampNonNegativeNumber(maxRetryDelayMs, 30_000)
        );
        this.maxRetryHintMs = Math.max(
            this.retryDelayMs,
            clampNonNegativeNumber(maxRetryHintMs, this.maxRetryDelayMs)
        );
        this.retryTokenBucketCapacity = clampPositiveNumber(retryTokenBucketCapacity, 32);
        this.retryTokenRefillPerSecond = clampPositiveNumber(retryTokenRefillPerSecond, 4);
        this.retryTokenCost = clampPositiveNumber(retryTokenCost, 1);
        this.retryTokens = this.retryTokenBucketCapacity;
        this.idempotencyKeyTtlMs = clampNonNegativeNumber(idempotencyKeyTtlMs, 5 * 60_000);
        this.idempotencyCache = new Map();
        this.idempotencyTaskIndex = new Map();
        this.circuitBreakerFailureThreshold = Math.max(
            1,
            Math.floor(clampPositiveNumber(circuitBreakerFailureThreshold, 3))
        );
        this.circuitBreakerCooldownMs = clampNonNegativeNumber(circuitBreakerCooldownMs, 15_000);
        this.circuitBreakerHalfOpenProbeCooldownMs = clampNonNegativeNumber(
            circuitBreakerHalfOpenProbeCooldownMs,
            250
        );
        this.bulkheadMaxInFlightPerTarget = normalizeBulkheadLimit(
            bulkheadMaxInFlightPerTarget,
            8
        );
        this.bulkheadMaxInFlightGlobal = normalizeBulkheadLimit(
            bulkheadMaxInFlightGlobal,
            Number.POSITIVE_INFINITY
        );
        const requestedGlobalReserve = normalizeNonNegativeInt(
            bulkheadGlobalHighPriorityReserve,
            0
        );
        this.bulkheadGlobalHighPriorityReserve = Number.isFinite(this.bulkheadMaxInFlightGlobal)
            ? Math.max(
                0,
                Math.min(this.bulkheadMaxInFlightGlobal, requestedGlobalReserve)
            )
            : requestedGlobalReserve;
        this.bulkheadRetryDelayMs = Math.max(
            1,
            Math.floor(clampPositiveNumber(bulkheadRetryDelayMs, 250))
        );
        this.deadLetterMaxEntries = Math.max(
            0,
            Math.floor(clampNonNegativeNumber(deadLetterMaxEntries, DEFAULT_DEAD_LETTER_MAX_ENTRIES))
        );
        this.adaptiveTimeoutEnabled = adaptiveTimeoutEnabled !== false;
        this.adaptiveTimeoutMinMs = Math.max(
            1,
            Math.floor(clampPositiveNumber(adaptiveTimeoutMinMs, 250))
        );
        this.adaptiveTimeoutMaxMs = Math.max(
            this.adaptiveTimeoutMinMs,
            Math.floor(clampPositiveNumber(adaptiveTimeoutMaxMs, 120_000))
        );
        this.adaptiveTimeoutSafetyMarginMs = Math.max(
            0,
            Math.floor(clampNonNegativeNumber(adaptiveTimeoutSafetyMarginMs, 100))
        );
        this.adaptiveTimeoutAlpha = clampRatio(adaptiveTimeoutAlpha, DEFAULT_ADAPTIVE_TIMEOUT_ALPHA);
        this.adaptiveTimeoutBeta = clampRatio(adaptiveTimeoutBeta, DEFAULT_ADAPTIVE_TIMEOUT_BETA);
        this.targetSelectionChoices = Math.max(
            1,
            Math.floor(clampPositiveNumber(targetSelectionChoices, DEFAULT_TARGET_SELECTION_CHOICES))
        );
        this.targetOutlierFailureThreshold = Math.max(
            1,
            Math.floor(
                clampPositiveNumber(
                    targetOutlierFailureThreshold,
                    DEFAULT_TARGET_OUTLIER_FAILURE_THRESHOLD
                )
            )
        );
        this.targetOutlierBaseEjectionMs = Math.max(
            1,
            Math.floor(
                clampPositiveNumber(
                    targetOutlierBaseEjectionMs,
                    DEFAULT_TARGET_OUTLIER_BASE_EJECTION_MS
                )
            )
        );
        this.targetOutlierMaxEjectionMs = Math.max(
            this.targetOutlierBaseEjectionMs,
            Math.floor(
                clampPositiveNumber(
                    targetOutlierMaxEjectionMs,
                    DEFAULT_TARGET_OUTLIER_MAX_EJECTION_MS
                )
            )
        );
        this.maintenanceRetryBatchLimit = normalizePositiveIntOrInfinity(
            maintenanceRetryBatchLimit,
            Number.POSITIVE_INFINITY
        );
        this.maintenanceHighPriorityShare = Math.max(
            1,
            Math.floor(clampPositiveNumber(maintenanceHighPriorityShare, 2))
        );
        this.retryBudgetRatio = Math.max(0, clampNonNegativeNumber(retryBudgetRatio, 0.2));
        this.retryBudgetMinPerWindow = normalizeNonNegativeInt(retryBudgetMinPerWindow, 3);
        this.retryBudgetWindowMs = Math.max(
            1,
            normalizeNonNegativeInt(retryBudgetWindowMs, 10_000)
        );
        this.retryBudgetRequestEvents = [];
        this.retryBudgetRetryEvents = [];
        this.retryBudgetExhaustedCount = 0;
        this.maxRetryElapsedMs = maxRetryElapsedMs === null || maxRetryElapsedMs === undefined
            ? null
            : normalizeNonNegativeInt(maxRetryElapsedMs, 0);
        this.hedgingEnabled = hedgingEnabled === true;
        this.hedgingDelayRatio = clampRatio(hedgingDelayRatio, DEFAULT_HEDGE_DELAY_RATIO);
        this.hedgingMinDelayMs = Math.max(
            0,
            Math.floor(clampNonNegativeNumber(hedgingMinDelayMs, DEFAULT_HEDGE_MIN_DELAY_MS))
        );
        this.hedgingMaxDelayMs = Math.max(
            this.hedgingMinDelayMs,
            Math.floor(clampPositiveNumber(hedgingMaxDelayMs, DEFAULT_HEDGE_MAX_DELAY_MS))
        );
        this.hedgingMaxDispatches = Math.max(
            0,
            normalizeNonNegativeInt(hedgingMaxDispatches, DEFAULT_HEDGE_MAX_DISPATCHES)
        );
        this.hedgingEligiblePriorities = new Set(
            this._normalizeCandidateTargets(hedgingEligiblePriorities)
                .map((priority) => this._classifyTaskPriority(priority))
                .filter((priority) => PRIORITY_RANK[priority] !== undefined)
        );
        if (this.hedgingEligiblePriorities.size === 0) {
            for (const priority of DEFAULT_HEDGE_ELIGIBLE_PRIORITIES) {
                this.hedgingEligiblePriorities.add(priority);
            }
        }
        this.adaptiveThrottleEnabled = adaptiveThrottleEnabled === true;
        this.adaptiveThrottleWindowMs = Math.max(
            1,
            normalizeNonNegativeInt(adaptiveThrottleWindowMs, DEFAULT_ADAPTIVE_THROTTLE_WINDOW_MS)
        );
        this.adaptiveThrottleMinSamples = Math.max(
            1,
            normalizeNonNegativeInt(adaptiveThrottleMinSamples, DEFAULT_ADAPTIVE_THROTTLE_MIN_SAMPLES)
        );
        this.adaptiveThrottleDropThreshold = Math.min(
            0.99,
            Math.max(0, clampNonNegativeNumber(
                adaptiveThrottleDropThreshold,
                DEFAULT_ADAPTIVE_THROTTLE_DROP_THRESHOLD
            ))
        );
        this.adaptiveThrottleBypassPriorities = new Set(
            this._normalizeCandidateTargets(adaptiveThrottleBypassPriorities)
                .map((priority) => this._classifyTaskPriority(priority))
                .filter((priority) => PRIORITY_RANK[priority] !== undefined)
        );
        this.retryWindowExhaustedCount = 0;
        this.targetLatencyStats = new Map();
        this.targetOutlierStats = new Map();
        this.targetAdaptiveThrottleStats = new Map();
        this.circuitBreakers = new Map();
        this.random = typeof random === 'function' ? random : Math.random;
        this.now = typeof now === 'function' ? now : Date.now;
        this.retryTokenLastRefillAt = safeNow(this.now);
        this.logger = logger;
        this.tasks = new Map();
        this._persistenceQueue = Promise.resolve();
    }

    _buildIdempotencyFingerprint({
        target,
        task,
        priority,
        context,
        constraints
    }) {
        return stableStringify({
            target,
            task,
            priority,
            context: context ?? null,
            constraints: constraints ?? null
        });
    }

    _normalizeIdempotencyKey(value) {
        if (typeof value !== 'string') return null;
        const normalized = value.trim();
        return normalized ? normalized : null;
    }

    _cleanupExpiredIdempotencyEntries(nowMs = safeNow(this.now)) {
        if (this.idempotencyCache.size === 0) return;
        for (const [key, entry] of this.idempotencyCache.entries()) {
            if (!entry || !Number.isFinite(entry.expiresAt) || nowMs >= entry.expiresAt) {
                this.idempotencyCache.delete(key);
                if (entry?.taskId) {
                    this.idempotencyTaskIndex.delete(entry.taskId);
                }
            }
        }
    }

    _registerIdempotencyKey(key, taskId, fingerprint, nowMs) {
        if (!key || this.idempotencyKeyTtlMs <= 0) return;
        const expiresAt = nowMs + this.idempotencyKeyTtlMs;
        this.idempotencyCache.set(key, {
            key,
            taskId,
            fingerprint,
            createdAt: nowMs,
            expiresAt
        });
        this.idempotencyTaskIndex.set(taskId, key);
    }

    _clearIdempotencyKeyForTask(taskId) {
        const key = this.idempotencyTaskIndex.get(taskId);
        if (!key) return;
        this.idempotencyTaskIndex.delete(taskId);
        this.idempotencyCache.delete(key);
    }

    _getCircuitState(target) {
        const existing = this.circuitBreakers.get(target);
        if (existing) return existing;
        const baseline = {
            target,
            state: 'closed',
            failures: 0,
            openedAt: null,
            nextAttemptAt: null,
            halfOpenProbeInFlight: false
        };
        this.circuitBreakers.set(target, baseline);
        return baseline;
    }

    _setCircuitState(state, nextState) {
        state.state = CIRCUIT_STATES.has(nextState) ? nextState : 'closed';
    }

    _getTargetLatencyState(target) {
        const key = normalizeNonEmptyString(target) || '';
        if (!key) return null;
        const existing = this.targetLatencyStats.get(key);
        if (existing) return existing;
        const baseline = {
            target: key,
            samples: 0,
            srttMs: null,
            rttvarMs: null,
            lastSampleMs: null,
            lastUpdatedAt: null,
            timeoutMs: this.defaultTimeoutMs
        };
        this.targetLatencyStats.set(key, baseline);
        return baseline;
    }

    _computeAdaptiveTimeoutMs(state) {
        if (!state || state.samples <= 0 || !Number.isFinite(state.srttMs)) {
            return this.defaultTimeoutMs;
        }
        const rttVariance = Number.isFinite(state.rttvarMs) ? state.rttvarMs : 0;
        const raw = state.srttMs + (4 * rttVariance) + this.adaptiveTimeoutSafetyMarginMs;
        const bounded = Math.max(this.adaptiveTimeoutMinMs, Math.min(this.adaptiveTimeoutMaxMs, raw));
        return Math.floor(bounded);
    }

    _recordTargetLatencySample(target, sampleMs, nowMs) {
        if (!this.adaptiveTimeoutEnabled) return null;
        const normalizedSampleMs = Number(sampleMs);
        if (!Number.isFinite(normalizedSampleMs) || normalizedSampleMs < 0) return null;
        const state = this._getTargetLatencyState(target);
        if (!state) return null;
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);

        if (state.samples <= 0 || !Number.isFinite(state.srttMs)) {
            state.samples = 1;
            state.srttMs = normalizedSampleMs;
            state.rttvarMs = normalizedSampleMs / 2;
        } else {
            const prevSrtt = state.srttMs;
            const error = Math.abs(prevSrtt - normalizedSampleMs);
            state.rttvarMs = ((1 - this.adaptiveTimeoutBeta) * state.rttvarMs)
                + (this.adaptiveTimeoutBeta * error);
            state.srttMs = ((1 - this.adaptiveTimeoutAlpha) * prevSrtt)
                + (this.adaptiveTimeoutAlpha * normalizedSampleMs);
            state.samples += 1;
        }

        state.lastSampleMs = normalizedSampleMs;
        state.lastUpdatedAt = at;
        state.timeoutMs = this._computeAdaptiveTimeoutMs(state);
        return state.timeoutMs;
    }

    _getTargetOutlierState(target) {
        const key = normalizeNonEmptyString(target);
        if (!key) return null;
        const existing = this.targetOutlierStats.get(key);
        if (existing) return existing;
        const baseline = {
            target: key,
            consecutiveFailures: 0,
            totalFailures: 0,
            totalSuccesses: 0,
            ejectionCount: 0,
            ejectedUntil: null,
            lastFailureAt: null,
            lastSuccessAt: null
        };
        this.targetOutlierStats.set(key, baseline);
        return baseline;
    }

    _isTargetOutlierEjected(target, nowMs = safeNow(this.now)) {
        const state = this._getTargetOutlierState(target);
        if (!state) return false;
        if (!Number.isFinite(state.ejectedUntil)) return false;
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        if (at >= state.ejectedUntil) {
            state.ejectedUntil = null;
            return false;
        }
        return true;
    }

    _recordTargetOutlierSuccess(target, nowMs = safeNow(this.now)) {
        const state = this._getTargetOutlierState(target);
        if (!state) return;
        state.totalSuccesses += 1;
        state.consecutiveFailures = 0;
        state.lastSuccessAt = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        state.ejectedUntil = null;
    }

    _recordTargetOutlierFailure(target, nowMs = safeNow(this.now)) {
        const state = this._getTargetOutlierState(target);
        if (!state) return;
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        state.totalFailures += 1;
        state.consecutiveFailures += 1;
        state.lastFailureAt = at;
        if (state.consecutiveFailures < this.targetOutlierFailureThreshold) {
            return;
        }
        state.ejectionCount += 1;
        const multiplier = Math.max(1, state.ejectionCount);
        const rawEjectionMs = this.targetOutlierBaseEjectionMs * multiplier;
        const ejectionMs = Math.min(this.targetOutlierMaxEjectionMs, rawEjectionMs);
        state.ejectedUntil = at + ejectionMs;
    }

    _getTargetAdaptiveThrottleState(target) {
        const key = normalizeNonEmptyString(target);
        if (!key) return null;
        const existing = this.targetAdaptiveThrottleStats.get(key);
        if (existing) return existing;
        const baseline = {
            target: key,
            acceptedEvents: [],
            rejectedEvents: [],
            blockedCount: 0,
            lastBlockedAt: null
        };
        this.targetAdaptiveThrottleStats.set(key, baseline);
        return baseline;
    }

    _pruneAdaptiveThrottleState(state, nowMs = safeNow(this.now)) {
        if (!state) return state;
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        const cutoff = at - this.adaptiveThrottleWindowMs;
        while (state.acceptedEvents.length > 0 && state.acceptedEvents[0] <= cutoff) {
            state.acceptedEvents.shift();
        }
        while (state.rejectedEvents.length > 0 && state.rejectedEvents[0] <= cutoff) {
            state.rejectedEvents.shift();
        }
        return state;
    }

    _recordAdaptiveThrottleOutcome(target, accepted, nowMs = safeNow(this.now)) {
        if (!this.adaptiveThrottleEnabled) return null;
        const state = this._getTargetAdaptiveThrottleState(target);
        if (!state) return null;
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        this._pruneAdaptiveThrottleState(state, at);
        if (accepted) {
            state.acceptedEvents.push(at);
        } else {
            state.rejectedEvents.push(at);
        }
        return state;
    }

    _evaluateAdaptiveThrottle(target, priority = 'normal', nowMs = safeNow(this.now)) {
        if (!this.adaptiveThrottleEnabled) {
            return {
                allowed: true,
                acceptedInWindow: 0,
                rejectedInWindow: 0,
                totalInWindow: 0,
                rejectionRatio: 0,
                dropProbability: 0,
                sample: null,
                minSamples: this.adaptiveThrottleMinSamples,
                dropThreshold: this.adaptiveThrottleDropThreshold
            };
        }
        const normalizedPriority = this._classifyTaskPriority(priority);
        if (this.adaptiveThrottleBypassPriorities.has(normalizedPriority)) {
            return {
                allowed: true,
                acceptedInWindow: 0,
                rejectedInWindow: 0,
                totalInWindow: 0,
                rejectionRatio: 0,
                dropProbability: 0,
                sample: null,
                bypassed: true,
                minSamples: this.adaptiveThrottleMinSamples,
                dropThreshold: this.adaptiveThrottleDropThreshold
            };
        }
        const state = this._getTargetAdaptiveThrottleState(target);
        if (!state) {
            return {
                allowed: true,
                acceptedInWindow: 0,
                rejectedInWindow: 0,
                totalInWindow: 0,
                rejectionRatio: 0,
                dropProbability: 0,
                sample: null,
                minSamples: this.adaptiveThrottleMinSamples,
                dropThreshold: this.adaptiveThrottleDropThreshold
            };
        }
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        this._pruneAdaptiveThrottleState(state, at);
        const acceptedInWindow = state.acceptedEvents.length;
        const rejectedInWindow = state.rejectedEvents.length;
        const totalInWindow = acceptedInWindow + rejectedInWindow;
        if (totalInWindow < this.adaptiveThrottleMinSamples) {
            return {
                allowed: true,
                acceptedInWindow,
                rejectedInWindow,
                totalInWindow,
                rejectionRatio: totalInWindow > 0 ? rejectedInWindow / totalInWindow : 0,
                dropProbability: 0,
                sample: null,
                minSamples: this.adaptiveThrottleMinSamples,
                dropThreshold: this.adaptiveThrottleDropThreshold
            };
        }

        const rejectionRatio = rejectedInWindow / totalInWindow;
        if (rejectionRatio <= this.adaptiveThrottleDropThreshold) {
            return {
                allowed: true,
                acceptedInWindow,
                rejectedInWindow,
                totalInWindow,
                rejectionRatio,
                dropProbability: 0,
                sample: null,
                minSamples: this.adaptiveThrottleMinSamples,
                dropThreshold: this.adaptiveThrottleDropThreshold
            };
        }

        const denominator = Math.max(0.0001, 1 - this.adaptiveThrottleDropThreshold);
        const dropProbability = Math.min(
            1,
            Math.max(0, (rejectionRatio - this.adaptiveThrottleDropThreshold) / denominator)
        );
        const sampled = Number(this.random());
        const sample = Number.isFinite(sampled) ? sampled : Math.random();
        const allowed = sample >= dropProbability;

        if (!allowed) {
            state.blockedCount += 1;
            state.lastBlockedAt = at;
        }

        return {
            allowed,
            acceptedInWindow,
            rejectedInWindow,
            totalInWindow,
            rejectionRatio,
            dropProbability,
            sample,
            minSamples: this.adaptiveThrottleMinSamples,
            dropThreshold: this.adaptiveThrottleDropThreshold
        };
    }

    _normalizeCandidateTargets(...values) {
        const output = [];
        const seen = new Set();
        for (const value of values) {
            if (Array.isArray(value)) {
                for (const entry of value) {
                    const normalized = normalizeNonEmptyString(entry);
                    if (!normalized || seen.has(normalized)) continue;
                    output.push(normalized);
                    seen.add(normalized);
                }
                continue;
            }
            const normalized = normalizeNonEmptyString(value);
            if (!normalized || seen.has(normalized)) continue;
            output.push(normalized);
            seen.add(normalized);
        }
        return output;
    }

    _ensureRoutingState(record) {
        if (!record || typeof record !== 'object') {
            return {
                candidates: [],
                failovers: 0,
                hedges: {
                    dispatched: 0,
                    lastDispatchedAt: null,
                    lastTarget: null,
                    attemptedTargets: []
                }
            };
        }

        if (!record.routing || typeof record.routing !== 'object') {
            record.routing = {};
        }

        record.routing.candidates = this._normalizeCandidateTargets(
            record.routing.candidates,
            record.target
        );
        record.routing.failovers = normalizeNonNegativeInt(record.routing.failovers, 0);
        if (!record.routing.hedges || typeof record.routing.hedges !== 'object') {
            record.routing.hedges = {};
        }

        const hedges = record.routing.hedges;
        hedges.dispatched = normalizeNonNegativeInt(hedges.dispatched, 0);
        hedges.lastDispatchedAt = Number.isFinite(Number(hedges.lastDispatchedAt))
            ? Number(hedges.lastDispatchedAt)
            : null;
        hedges.lastTarget = normalizeNonEmptyString(hedges.lastTarget);
        hedges.attemptedTargets = this._normalizeCandidateTargets(
            hedges.attemptedTargets,
            record.target
        );
        return record.routing;
    }

    _resolveHedgeDelayMs(record) {
        const timeoutMs = this._resolveTimeoutMs(record?.target);
        const rawDelay = Math.floor(timeoutMs * this.hedgingDelayRatio);
        const bounded = Math.max(
            this.hedgingMinDelayMs,
            Math.min(this.hedgingMaxDelayMs, rawDelay)
        );
        return Math.max(1, Math.min(Math.max(1, timeoutMs - 1), bounded));
    }

    async _maybeDispatchSpeculativeHedge(record, nowMs) {
        if (!this.hedgingEnabled || this.hedgingMaxDispatches <= 0) return false;
        if (!record || record.status !== 'dispatched' || record.nextRetryAt !== null) return false;
        if (!Number.isFinite(record.lastDispatchAt) || record._sending === true) return false;

        const priority = this._classifyTaskPriority(record?.request?.priority);
        if (!this.hedgingEligiblePriorities.has(priority)) return false;

        const routing = this._ensureRoutingState(record);
        const hedges = routing.hedges;
        if (hedges.dispatched >= this.hedgingMaxDispatches) return false;

        const delayMs = this._resolveHedgeDelayMs(record);
        const elapsedMs = Math.max(0, nowMs - Number(record.lastDispatchAt));
        if (elapsedMs < delayMs) return false;

        const excludedTargets = new Set(
            this._normalizeCandidateTargets(
                record.target,
                hedges.attemptedTargets
            )
        );
        const nextTarget = this._selectDispatchTarget(routing.candidates, nowMs, {
            exclude: excludedTargets
        });
        if (!nextTarget) return false;

        const budgetDecision = this._consumeRetryBudget(nowMs);
        if (!budgetDecision.allowed) {
            record.history.push({
                at: nowMs,
                event: 'hedge_skipped_retry_budget_exhausted',
                retryBudgetRequestsInWindow: budgetDecision.requestsInWindow,
                retryBudgetRetriesInWindow: budgetDecision.retriesInWindow,
                retryBudgetMaxRetriesInWindow: budgetDecision.maxRetriesInWindow
            });
            this._persistRecord(record);
            this._emitAudit('task_hedge_skipped_retry_budget_exhausted', {
                taskId: record.taskId,
                target: record.target,
                priority,
                retryBudgetRequestsInWindow: budgetDecision.requestsInWindow,
                retryBudgetRetriesInWindow: budgetDecision.retriesInWindow,
                retryBudgetMaxRetriesInWindow: budgetDecision.maxRetriesInWindow
            }, nowMs);
            return false;
        }

        const tokenGranted = this._consumeRetryToken(nowMs);
        if (!tokenGranted) {
            const tokenRecoveryDelayMs = this._retryTokenRecoveryDelayMs(nowMs);
            record.history.push({
                at: nowMs,
                event: 'hedge_skipped_retry_token_exhausted',
                retryTokenRecoveryDelayMs: tokenRecoveryDelayMs,
                retryTokensAvailable: Number(this.retryTokens.toFixed(3))
            });
            this._persistRecord(record);
            this._emitAudit('task_hedge_skipped_retry_token_exhausted', {
                taskId: record.taskId,
                target: record.target,
                priority,
                retryTokenRecoveryDelayMs: tokenRecoveryDelayMs,
                retryTokensAvailable: Number(this.retryTokens.toFixed(3))
            }, nowMs);
            return false;
        }

        this._retargetRecord(record, nextTarget, nowMs, 'speculative_hedge');
        const updatedRouting = this._ensureRoutingState(record);
        updatedRouting.hedges.dispatched += 1;
        updatedRouting.hedges.lastDispatchedAt = nowMs;
        updatedRouting.hedges.lastTarget = nextTarget;
        updatedRouting.hedges.attemptedTargets = this._normalizeCandidateTargets(
            updatedRouting.hedges.attemptedTargets,
            nextTarget
        );
        record.updatedAt = nowMs;
        record.history.push({
            at: nowMs,
            event: 'hedge_dispatch_scheduled',
            target: nextTarget,
            delayMs,
            elapsedMs,
            retryBudgetRequestsInWindow: budgetDecision.requestsInWindow,
            retryBudgetRetriesInWindow: budgetDecision.retriesInWindow + 1,
            retryBudgetMaxRetriesInWindow: budgetDecision.maxRetriesInWindow,
            retryTokensAvailable: Number(this.retryTokens.toFixed(3))
        });
        this._persistRecord(record);
        this._emitAudit('task_hedge_dispatch_scheduled', {
            taskId: record.taskId,
            target: nextTarget,
            delayMs,
            elapsedMs,
            retryBudgetRequestsInWindow: budgetDecision.requestsInWindow,
            retryBudgetRetriesInWindow: budgetDecision.retriesInWindow + 1,
            retryBudgetMaxRetriesInWindow: budgetDecision.maxRetriesInWindow,
            retryTokensAvailable: Number(this.retryTokens.toFixed(3))
        }, nowMs);

        try {
            await this._sendTask(record, 'hedged_dispatch');
            return true;
        } catch (error) {
            const failedAt = safeNow(this.now);
            record.history.push({
                at: failedAt,
                event: 'hedge_dispatch_failed',
                error: error?.message || null,
                code: error?.code || null
            });
            this._persistRecord(record);
            this._emitAudit('task_hedge_dispatch_failed', {
                taskId: record.taskId,
                target: record.target,
                error: error?.message || null,
                code: error?.code || null
            }, failedAt);
            return false;
        }
    }

    _rankTargetsByLoadAndHealth(targets, nowMs = safeNow(this.now), {
        exclude = null
    } = {}) {
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        const excluded = exclude instanceof Set ? exclude : new Set();
        const candidates = [];
        for (const target of this._normalizeCandidateTargets(targets)) {
            if (excluded.has(target)) continue;
            const outlier = this._getTargetOutlierState(target);
            const inFlight = this._countTargetInFlight(target);
            candidates.push({
                target,
                inFlight,
                ejected: this._isTargetOutlierEjected(target, at),
                consecutiveFailures: Number(outlier?.consecutiveFailures || 0),
                ejectionCount: Number(outlier?.ejectionCount || 0),
                lastSuccessAt: Number.isFinite(outlier?.lastSuccessAt)
                    ? Number(outlier.lastSuccessAt)
                    : null
            });
        }

        candidates.sort((a, b) => {
            if (a.ejected !== b.ejected) return a.ejected ? 1 : -1;
            if (a.inFlight !== b.inFlight) return a.inFlight - b.inFlight;
            if (a.consecutiveFailures !== b.consecutiveFailures) {
                return a.consecutiveFailures - b.consecutiveFailures;
            }
            if (a.ejectionCount !== b.ejectionCount) return a.ejectionCount - b.ejectionCount;
            const successA = Number.isFinite(a.lastSuccessAt) ? Number(a.lastSuccessAt) : -1;
            const successB = Number.isFinite(b.lastSuccessAt) ? Number(b.lastSuccessAt) : -1;
            if (successA !== successB) return successB - successA;
            return a.target.localeCompare(b.target);
        });
        return candidates;
    }

    _selectDispatchTarget(targets, nowMs = safeNow(this.now), {
        exclude = null
    } = {}) {
        const ranked = this._rankTargetsByLoadAndHealth(targets, nowMs, { exclude });
        if (ranked.length === 0) return null;
        const eligible = ranked.filter((candidate) => !candidate.ejected);
        const pool = eligible.length > 0 ? eligible : ranked;
        const choiceCount = Math.max(1, Math.min(pool.length, this.targetSelectionChoices));
        if (choiceCount >= pool.length) {
            return pool[0].target;
        }

        // Sample a bounded subset, then pick the best-ranked within that subset.
        const sampledIndexes = new Set();
        while (sampledIndexes.size < choiceCount) {
            const sample = Number(this.random());
            const randomValue = Number.isFinite(sample) ? sample : Math.random();
            const index = Math.min(
                pool.length - 1,
                Math.max(0, Math.floor(randomValue * pool.length))
            );
            sampledIndexes.add(index);
        }

        let bestIndex = null;
        for (const index of sampledIndexes) {
            if (bestIndex === null || index < bestIndex) {
                bestIndex = index;
            }
        }
        return pool[bestIndex ?? 0].target;
    }

    _retargetRecord(record, nextTarget, nowMs, reason = 'target_failover') {
        const normalized = normalizeNonEmptyString(nextTarget);
        if (!normalized || !record || normalized === record.target) return false;
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        const previousTarget = record.target;
        record.target = normalized;
        record.request = buildTaskRequest({
            ...record.request,
            target: normalized,
            id: record.request.id,
            from: record.request.from,
            createdAt: record.request.createdAt
        });
        const routing = this._ensureRoutingState(record);
        routing.candidates = this._normalizeCandidateTargets(routing.candidates, normalized);
        routing.failovers = Number(routing.failovers || 0) + 1;
        routing.hedges.attemptedTargets = this._normalizeCandidateTargets(
            routing.hedges.attemptedTargets,
            normalized
        );
        record.updatedAt = at;
        record.history.push({
            at,
            event: 'target_failover',
            reason,
            previousTarget,
            target: normalized
        });
        this._persistRecord(record);
        this._emitAudit('task_target_failover', {
            taskId: record.taskId,
            previousTarget,
            target: normalized,
            reason
        }, at);
        return true;
    }

    _maybeFailoverRecordTarget(record, nowMs, reason = 'send_failed', {
        excludeCurrent = true
    } = {}) {
        if (!record || !record.routing || !Array.isArray(record.routing.candidates)) return false;
        const excluded = new Set();
        if (excludeCurrent && normalizeNonEmptyString(record.target)) {
            excluded.add(record.target);
        }
        const nextTarget = this._selectDispatchTarget(record.routing.candidates, nowMs, {
            exclude: excluded
        });
        if (!nextTarget || nextTarget === record.target) return false;
        return this._retargetRecord(record, nextTarget, nowMs, reason);
    }

    _resolveTimeoutMs(target) {
        if (!this.adaptiveTimeoutEnabled) {
            return this.defaultTimeoutMs;
        }
        const state = this._getTargetLatencyState(target);
        if (!state || state.samples <= 0) {
            return this.defaultTimeoutMs;
        }
        return this._computeAdaptiveTimeoutMs(state);
    }

    _allowTargetSend(target, nowMs) {
        const state = this._getCircuitState(target);
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);

        if (state.state === 'open') {
            const readyAt = Number.isFinite(state.nextAttemptAt)
                ? Number(state.nextAttemptAt)
                : at + this.circuitBreakerCooldownMs;

            if (at < readyAt) {
                return {
                    allowed: false,
                    state: state.state,
                    retryAfterMs: Math.max(0, readyAt - at)
                };
            }

            this._setCircuitState(state, 'half_open');
            state.halfOpenProbeInFlight = false;
            state.nextAttemptAt = null;
        }

        if (state.state === 'half_open') {
            if (state.halfOpenProbeInFlight) {
                return {
                    allowed: false,
                    state: state.state,
                    retryAfterMs: Math.max(1, this.circuitBreakerHalfOpenProbeCooldownMs)
                };
            }
            state.halfOpenProbeInFlight = true;
        }

        return {
            allowed: true,
            state: state.state,
            retryAfterMs: 0
        };
    }

    _closeCircuit(target) {
        const state = this._getCircuitState(target);
        state.failures = 0;
        state.openedAt = null;
        state.nextAttemptAt = null;
        state.halfOpenProbeInFlight = false;
        this._setCircuitState(state, 'closed');
    }

    _openCircuit(target, nowMs) {
        const state = this._getCircuitState(target);
        state.openedAt = nowMs;
        state.nextAttemptAt = nowMs + this.circuitBreakerCooldownMs;
        state.halfOpenProbeInFlight = false;
        this._setCircuitState(state, 'open');
    }

    _recordCircuitSendSuccess(target, nowMs) {
        const state = this._getCircuitState(target);
        const previousState = state.state;
        state.halfOpenProbeInFlight = false;
        state.failures = 0;
        if (state.state !== 'closed') {
            this._closeCircuit(target);
            this._emitAudit('target_circuit_closed', {
                target,
                previousState
            }, nowMs);
        }
    }

    _recordCircuitSendFailure(target, nowMs) {
        const state = this._getCircuitState(target);
        state.halfOpenProbeInFlight = false;
        state.failures += 1;

        if (
            state.state === 'half_open'
            || state.failures >= this.circuitBreakerFailureThreshold
        ) {
            const previousState = state.state;
            this._openCircuit(target, nowMs);
            this._emitAudit('target_circuit_opened', {
                target,
                previousState,
                failures: state.failures,
                failureThreshold: this.circuitBreakerFailureThreshold,
                cooldownMs: this.circuitBreakerCooldownMs
            }, nowMs);
        }
    }

    _countTargetInFlight(target, {
        excludeTaskId = null
    } = {}) {
        if (typeof target !== 'string' || !target.trim()) return 0;

        let inFlight = 0;
        for (const record of this.tasks.values()) {
            if (!record || record.target !== target) continue;
            if (excludeTaskId && record.taskId === excludeTaskId) continue;
            if (record._sending === true) {
                inFlight++;
                continue;
            }
            if (!IN_FLIGHT_STATUSES.has(record.status)) continue;
            inFlight++;
        }
        return inFlight;
    }

    _countGlobalInFlight({
        excludeTaskId = null
    } = {}) {
        let inFlight = 0;
        for (const record of this.tasks.values()) {
            if (!record) continue;
            if (excludeTaskId && record.taskId === excludeTaskId) continue;
            if (record._sending === true) {
                inFlight++;
                continue;
            }
            if (!IN_FLIGHT_STATUSES.has(record.status)) continue;
            inFlight++;
        }
        return inFlight;
    }

    _globalLowPriorityLimit() {
        if (!Number.isFinite(this.bulkheadMaxInFlightGlobal)) {
            return Number.POSITIVE_INFINITY;
        }
        return Math.max(
            0,
            this.bulkheadMaxInFlightGlobal - this.bulkheadGlobalHighPriorityReserve
        );
    }

    _allowGlobalBulkheadSend(taskId, priority = 'normal') {
        if (!Number.isFinite(this.bulkheadMaxInFlightGlobal)) {
            return {
                allowed: true,
                inFlight: 0,
                limit: Number.POSITIVE_INFINITY,
                lowPriorityLimit: Number.POSITIVE_INFINITY,
                reservedForHighPriority: this.bulkheadGlobalHighPriorityReserve,
                retryAfterMs: 0,
                saturationReason: null
            };
        }

        const normalizedPriority = typeof priority === 'string'
            ? priority
            : 'normal';
        const highPriority = HIGH_PRIORITY_TASKS.has(normalizedPriority);
        const inFlight = this._countGlobalInFlight({ excludeTaskId: taskId });
        const lowPriorityLimit = this._globalLowPriorityLimit();
        const allowed = highPriority
            ? inFlight < this.bulkheadMaxInFlightGlobal
            : inFlight < lowPriorityLimit;

        return {
            allowed,
            inFlight,
            limit: this.bulkheadMaxInFlightGlobal,
            lowPriorityLimit,
            reservedForHighPriority: this.bulkheadGlobalHighPriorityReserve,
            retryAfterMs: allowed ? 0 : this.bulkheadRetryDelayMs,
            saturationReason: allowed
                ? null
                : (highPriority ? 'global_limit' : 'reserved_for_high_priority')
        };
    }

    _allowTargetBulkheadSend(target, taskId) {
        if (!Number.isFinite(this.bulkheadMaxInFlightPerTarget)) {
            return {
                allowed: true,
                inFlight: 0,
                limit: Number.POSITIVE_INFINITY,
                retryAfterMs: 0
            };
        }

        const inFlight = this._countTargetInFlight(target, { excludeTaskId: taskId });
        if (inFlight < this.bulkheadMaxInFlightPerTarget) {
            return {
                allowed: true,
                inFlight,
                limit: this.bulkheadMaxInFlightPerTarget,
                retryAfterMs: 0
            };
        }

        return {
            allowed: false,
            inFlight,
            limit: this.bulkheadMaxInFlightPerTarget,
            retryAfterMs: this.bulkheadRetryDelayMs
        };
    }

    _isDeadLettered(record) {
        return Boolean(
            record
            && record.deadLetter
            && Number.isFinite(Number(record.deadLetter.at))
        );
    }

    _markDeadLetter(record, nowMs, {
        reason = null,
        sourceEvent = null
    } = {}) {
        if (!record || this.deadLetterMaxEntries <= 0) return false;

        const at = Number.isFinite(Number(nowMs))
            ? Number(nowMs)
            : safeNow(this.now);
        const deadLetterReason = typeof reason === 'string' && reason.trim()
            ? reason
            : record.status;

        const existing = this._isDeadLettered(record)
            ? record.deadLetter
            : null;

        record.deadLetter = {
            at: existing?.at ?? at,
            reason: deadLetterReason,
            sourceEvent: typeof sourceEvent === 'string' && sourceEvent.trim()
                ? sourceEvent
                : (existing?.sourceEvent ?? null),
            updatedAt: at,
            redriveCount: Number.isFinite(existing?.redriveCount)
                ? Number(existing.redriveCount)
                : 0,
            lastRedriveAt: Number.isFinite(existing?.lastRedriveAt)
                ? Number(existing.lastRedriveAt)
                : null
        };
        record.history.push({
            at,
            event: 'dead_lettered',
            reason: deadLetterReason,
            sourceEvent: record.deadLetter.sourceEvent
        });
        this._persistRecord(record);
        this._emitAudit('task_dead_lettered', {
            taskId: record.taskId,
            target: record.target,
            status: record.status,
            reason: deadLetterReason,
            sourceEvent: record.deadLetter.sourceEvent,
            attempts: record.attempts
        }, at);
        this._enforceDeadLetterCapacity(at);
        return true;
    }

    _enforceDeadLetterCapacity(nowMs) {
        if (this.deadLetterMaxEntries <= 0) return;

        const deadLettered = [];
        for (const record of this.tasks.values()) {
            if (!this._isDeadLettered(record)) continue;
            deadLettered.push(record);
        }

        if (deadLettered.length <= this.deadLetterMaxEntries) return;

        deadLettered.sort((a, b) => {
            const aAt = Number(a.deadLetter?.at) || 0;
            const bAt = Number(b.deadLetter?.at) || 0;
            return aAt - bAt;
        });

        const overflow = deadLettered.length - this.deadLetterMaxEntries;
        for (let index = 0; index < overflow; index++) {
            const record = deadLettered[index];
            const evicted = clone(record.deadLetter);
            delete record.deadLetter;
            record.history.push({
                at: nowMs,
                event: 'dead_letter_evicted',
                reason: evicted.reason || null
            });
            this._persistRecord(record);
            this._emitAudit('task_dead_letter_evicted', {
                taskId: record.taskId,
                target: record.target,
                status: record.status,
                reason: evicted.reason || null
            }, nowMs);
        }
    }

    async hydrate({ replace = true } = {}) {
        if (!this.store || typeof this.store.loadRecords !== 'function') {
            return {
                loaded: 0
            };
        }

        const loaded = await this.store.loadRecords();
        if (!Array.isArray(loaded)) {
            throw new TaskOrchestratorError('INVALID_STORE_DATA', 'loadRecords() must return an array');
        }

        if (replace) {
            this.tasks.clear();
            this.idempotencyCache.clear();
            this.idempotencyTaskIndex.clear();
            this.targetLatencyStats.clear();
            this.targetOutlierStats.clear();
            this.targetAdaptiveThrottleStats.clear();
        }

        const hydratedAt = safeNow(this.now);
        let applied = 0;
        for (const record of loaded) {
            if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') {
                continue;
            }
            this.tasks.set(record.taskId, clone(record));
            const hydratedRecord = this.tasks.get(record.taskId);
            this._ensureRoutingState(hydratedRecord);
            const idempotencyKey = this._normalizeIdempotencyKey(record?.idempotency?.key);
            const idempotencyFingerprint = typeof record?.idempotency?.fingerprint === 'string'
                ? record.idempotency.fingerprint
                : null;
            if (idempotencyKey && idempotencyFingerprint && this.idempotencyKeyTtlMs > 0) {
                const createdAt = Number.isFinite(Number(record.createdAt))
                    ? Number(record.createdAt)
                    : hydratedAt;
                const expiresAt = createdAt + this.idempotencyKeyTtlMs;
                if (expiresAt > hydratedAt) {
                    this.idempotencyCache.set(idempotencyKey, {
                        key: idempotencyKey,
                        taskId: record.taskId,
                        fingerprint: idempotencyFingerprint,
                        createdAt,
                        expiresAt
                    });
                    this.idempotencyTaskIndex.set(record.taskId, idempotencyKey);
                }
            }

            if (
                this.adaptiveTimeoutEnabled
                && Number.isFinite(record?.lastDispatchAt)
                && Number.isFinite(record?.closedAt)
                && Number(record.closedAt) >= Number(record.lastDispatchAt)
            ) {
                this._recordTargetLatencySample(
                    record.target,
                    Number(record.closedAt) - Number(record.lastDispatchAt),
                    Number(record.closedAt)
                );
            }

            if (this.adaptiveThrottleEnabled && Array.isArray(record?.receipts)) {
                for (const receipt of record.receipts) {
                    const accepted = receipt?.accepted === true;
                    const timestamp = Number.isFinite(Number(receipt?.timestamp))
                        ? Number(receipt.timestamp)
                        : hydratedAt;
                    this._recordAdaptiveThrottleOutcome(record.target, accepted, timestamp);
                }
            }

            applied++;
        }

        this._enforceDeadLetterCapacity(hydratedAt);

        return {
            loaded: applied
        };
    }

    _enqueuePersistence(operation, label) {
        if (!this.store || typeof operation !== 'function') return;

        this._persistenceQueue = this._persistenceQueue
            .then(async () => {
                await operation();
            })
            .catch((error) => {
                this.logger.warn?.(
                    `[Swarm] Persistence operation failed (${label}): ${error.message}`
                );
            });
    }

    _persistRecord(record) {
        if (!this.store || typeof this.store.saveRecord !== 'function') return;
        const payload = clone(record);
        this._enqueuePersistence(
            () => this.store.saveRecord(payload),
            'saveRecord'
        );
    }

    _deleteRecord(taskId) {
        if (!this.store || typeof this.store.deleteRecord !== 'function') return;
        this._enqueuePersistence(
            () => this.store.deleteRecord(taskId),
            'deleteRecord'
        );
    }

    _emitAudit(eventType, payload, at = safeNow(this.now)) {
        if (!this.auditLog) return;

        try {
            this.auditLog.append({
                eventType,
                at,
                actor: this.localAgentId,
                payload: clone(payload)
            });
        } catch (error) {
            this.logger.warn?.(
                `[Swarm] Audit append failed (${eventType}): ${error.message}`
            );
        }
    }

    async flush() {
        await this._persistenceQueue;
    }

    _resolveTaskMaxRetryElapsedMs(value) {
        if (value === null || value === undefined) return this.maxRetryElapsedMs;
        return normalizeNonNegativeInt(value, this.maxRetryElapsedMs ?? 0);
    }

    _retryEligibility(record, nowMs = safeNow(this.now)) {
        if (!record || typeof record !== 'object') {
            return {
                allowed: false,
                reason: 'invalid_record',
                maxRetryElapsedMs: null,
                elapsedMs: null
            };
        }

        if (record.attempts > record.maxRetries) {
            return {
                allowed: false,
                reason: 'max_retries_exceeded',
                maxRetryElapsedMs: Number.isFinite(record?.maxRetryElapsedMs)
                    ? Number(record.maxRetryElapsedMs)
                    : null,
                elapsedMs: null
            };
        }

        const retryWindowMs = Number.isFinite(record?.maxRetryElapsedMs)
            ? Math.max(0, Number(record.maxRetryElapsedMs))
            : null;
        if (retryWindowMs === null) {
            return {
                allowed: true,
                reason: null,
                maxRetryElapsedMs: null,
                elapsedMs: null
            };
        }

        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        const createdAt = Number.isFinite(record.createdAt) ? Number(record.createdAt) : at;
        const elapsedMs = Math.max(0, at - createdAt);
        if (elapsedMs > retryWindowMs) {
            return {
                allowed: false,
                reason: 'retry_window_exhausted',
                maxRetryElapsedMs: retryWindowMs,
                elapsedMs
            };
        }

        return {
            allowed: true,
            reason: null,
            maxRetryElapsedMs: retryWindowMs,
            elapsedMs
        };
    }

    _canRetry(record, nowMs = safeNow(this.now)) {
        return this._retryEligibility(record, nowMs).allowed;
    }

    _parseRetryHintMsFromReason(reason) {
        if (typeof reason !== 'string' || !reason.trim()) {
            return null;
        }

        const nowMs = safeNow(this.now);
        const retryAfterDelayMatch = reason.match(
            /\bretry[-_\s]?after\b\s*[:=]?\s*(\d{1,10})\b/i
        );
        if (retryAfterDelayMatch) {
            const seconds = Number(retryAfterDelayMatch[1]);
            if (Number.isFinite(seconds) && seconds >= 0) {
                return seconds * 1_000;
            }
        }

        const retryAfterDateMatch = reason.match(
            /\bretry[-_\s]?after\b\s*[:=]?\s*([A-Za-z]{3},\s*\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+GMT|\d{4}-\d{2}-\d{2}T[0-9:.+-Z]+)/i
        );
        if (retryAfterDateMatch) {
            const retryAtMs = Date.parse(retryAfterDateMatch[1]);
            if (Number.isFinite(retryAtMs)) {
                return Math.max(0, retryAtMs - nowMs);
            }
        }

        const rateLimitResetMatch = reason.match(
            /\b(x[-_\s]?ratelimit[-_\s]?reset|ratelimit[-_\s]?reset)\b\s*[:=]?\s*(\d{1,13})\b/i
        );
        if (rateLimitResetMatch) {
            const marker = rateLimitResetMatch[1].toLowerCase();
            const rawValue = Number(rateLimitResetMatch[2]);
            if (Number.isFinite(rawValue) && rawValue >= 0) {
                if (marker.includes('x-')) {
                    const epochMs = rawValue >= 1_000_000_000_000 ? rawValue : rawValue * 1_000;
                    return Math.max(0, epochMs - nowMs);
                }

                if (rawValue >= 1_000_000_000) {
                    return Math.max(0, (rawValue * 1_000) - nowMs);
                }

                return rawValue * 1_000;
            }
        }

        const delayMatch = reason.match(
            /\b(?:retry[-_\s]?in|retry[-_\s]?delay|backoff)\b\s*[:=]?\s*(\d{1,10})\s*(ms|msec|milliseconds?|s|sec|seconds?)?\b/i
        );
        if (!delayMatch) {
            return null;
        }

        const amount = Number(delayMatch[1]);
        if (!Number.isFinite(amount) || amount < 0) {
            return null;
        }
        const unit = (delayMatch[2] || '').toLowerCase();
        if (unit.startsWith('s')) {
            return amount * 1_000;
        }
        return amount;
    }

    _isTransientRejectionReason(reason) {
        if (typeof reason !== 'string' || !reason.trim()) {
            return false;
        }
        const normalized = reason.toLowerCase();
        if (/\b(?:429|503)\b/.test(normalized)) {
            return true;
        }
        return TRANSIENT_REJECTION_MARKERS.some((marker) => normalized.includes(marker));
    }

    _resolveRetryDelayMs(record, hintMs = null) {
        const attemptIndex = Math.max(record.attempts, 1);
        let delayMs = this.retryDelayMs;
        if (this.retryBackoffStrategy === 'exponential') {
            const exponentialDelay = this.retryDelayMs * (2 ** (attemptIndex - 1));
            delayMs = Math.min(this.maxRetryDelayMs, exponentialDelay);
        }

        if (Number.isFinite(hintMs) && hintMs >= 0) {
            delayMs = Math.min(this.maxRetryHintMs, Number(hintMs));
        }

        if (this.retryJitter === 'full' && delayMs > 1) {
            const randomSample = Number(this.random());
            const randomValue = Number.isFinite(randomSample) ? randomSample : Math.random();
            delayMs = Math.floor(Math.min(Math.max(randomValue, 0), 1) * delayMs);
        }

        return Math.max(0, Math.floor(delayMs));
    }

    _refillRetryTokens(nowMs) {
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        if (!Number.isFinite(this.retryTokenLastRefillAt)) {
            this.retryTokenLastRefillAt = at;
            return;
        }

        const elapsedMs = Math.max(0, at - this.retryTokenLastRefillAt);
        if (elapsedMs <= 0) return;

        const refill = (elapsedMs / 1_000) * this.retryTokenRefillPerSecond;
        if (refill > 0) {
            this.retryTokens = Math.min(
                this.retryTokenBucketCapacity,
                Math.max(0, this.retryTokens + refill)
            );
        }
        this.retryTokenLastRefillAt = at;
    }

    _consumeRetryToken(nowMs, tokenCost = this.retryTokenCost) {
        const cost = clampPositiveNumber(tokenCost, this.retryTokenCost);
        this._refillRetryTokens(nowMs);
        if (this.retryTokens + Number.EPSILON < cost) {
            return false;
        }
        this.retryTokens = Math.max(0, this.retryTokens - cost);
        return true;
    }

    _retryTokenRecoveryDelayMs(nowMs, tokenCost = this.retryTokenCost) {
        const cost = clampPositiveNumber(tokenCost, this.retryTokenCost);
        this._refillRetryTokens(nowMs);
        if (this.retryTokens + Number.EPSILON >= cost) return 0;
        const deficit = cost - this.retryTokens;
        const seconds = deficit / this.retryTokenRefillPerSecond;
        return Math.max(0, Math.ceil(seconds * 1_000));
    }

    _pruneRetryBudgetEvents(nowMs) {
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        const cutoff = at - this.retryBudgetWindowMs;
        while (this.retryBudgetRequestEvents.length > 0 && this.retryBudgetRequestEvents[0] <= cutoff) {
            this.retryBudgetRequestEvents.shift();
        }
        while (this.retryBudgetRetryEvents.length > 0 && this.retryBudgetRetryEvents[0] <= cutoff) {
            this.retryBudgetRetryEvents.shift();
        }
    }

    _recordRetryBudgetRequest(nowMs) {
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        this._pruneRetryBudgetEvents(at);
        this.retryBudgetRequestEvents.push(at);
    }

    _consumeRetryBudget(nowMs) {
        const at = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        this._pruneRetryBudgetEvents(at);
        const requestsInWindow = this.retryBudgetRequestEvents.length;
        const retriesInWindow = this.retryBudgetRetryEvents.length;
        const dynamicAllowance = Math.floor(requestsInWindow * this.retryBudgetRatio);
        const maxRetriesInWindow = this.retryBudgetMinPerWindow + dynamicAllowance;
        const granted = retriesInWindow < maxRetriesInWindow;
        if (granted) {
            this.retryBudgetRetryEvents.push(at);
        } else {
            this.retryBudgetExhaustedCount += 1;
        }
        return {
            granted,
            requestsInWindow,
            retriesInWindow,
            maxRetriesInWindow
        };
    }

    _markRetryBudgetExhausted(record, nowMs, {
        reason = 'retry_budget_exhausted',
        event = 'retry_budget_exhausted',
        sourceEvent = 'retry_budget_exhausted',
        auditEvent = 'task_retry_budget_exhausted',
        metadata = null
    } = {}) {
        const exhaustedAt = Number.isFinite(nowMs) ? Number(nowMs) : safeNow(this.now);
        record.status = 'transport_error';
        record.nextRetryAt = null;
        record.updatedAt = exhaustedAt;
        record.closedAt = exhaustedAt;
        record.lastError = reason;
        record.history.push({
            at: exhaustedAt,
            event,
            reason,
            ...(metadata && typeof metadata === 'object' ? metadata : {})
        });
        this._persistRecord(record);
        this._emitAudit(auditEvent, {
            taskId: record.taskId,
            target: record.target,
            reason,
            ...(metadata && typeof metadata === 'object' ? metadata : {})
        }, exhaustedAt);
        this._markDeadLetter(record, exhaustedAt, {
            reason,
            sourceEvent
        });
    }

    _scheduleRetry(record, nowMs, {
        reason = 'retry_scheduled',
        event = 'retry_scheduled',
        hintMs = null,
        auditEvent = 'task_retry_scheduled',
        metadata = null
    } = {}) {
        const budgetDecision = this._consumeRetryBudget(nowMs);
        if (!budgetDecision.granted) {
            this._markRetryBudgetExhausted(record, nowMs, {
                reason: `retry_budget_exhausted:${reason}`,
                event: 'retry_budget_exhausted',
                sourceEvent: 'retry_budget_exhausted',
                auditEvent: 'task_retry_budget_exhausted',
                metadata: {
                    retryReason: reason,
                    retryBudgetRequestsInWindow: budgetDecision.requestsInWindow,
                    retryBudgetRetriesInWindow: budgetDecision.retriesInWindow,
                    retryBudgetMaxRetriesInWindow: budgetDecision.maxRetriesInWindow,
                    ...(metadata && typeof metadata === 'object' ? metadata : {})
                }
            });
            return false;
        }

        const baseRetryDelayMs = this._resolveRetryDelayMs(record, hintMs);
        const tokenGranted = this._consumeRetryToken(nowMs);
        const tokenRecoveryDelayMs = tokenGranted ? 0 : this._retryTokenRecoveryDelayMs(nowMs);
        const retryDelayMs = tokenGranted
            ? baseRetryDelayMs
            : Math.max(baseRetryDelayMs, tokenRecoveryDelayMs);
        const nextRetryAt = nowMs + retryDelayMs;

        record.status = 'retry_scheduled';
        record.nextRetryAt = nextRetryAt;
        record.updatedAt = nowMs;
        record.history.push({
            at: nowMs,
            event,
            reason,
            nextRetryAt,
            retryDelayMs,
            retryBaseDelayMs: baseRetryDelayMs,
            retryTokenGranted: tokenGranted,
            retryTokenRecoveryDelayMs: tokenRecoveryDelayMs,
            retryTokensAvailable: Number(this.retryTokens.toFixed(3)),
            retryHintMs: Number.isFinite(hintMs) ? Number(hintMs) : null,
            retryBudgetRequestsInWindow: budgetDecision.requestsInWindow,
            retryBudgetRetriesInWindow: budgetDecision.retriesInWindow + 1,
            retryBudgetMaxRetriesInWindow: budgetDecision.maxRetriesInWindow,
            ...(metadata && typeof metadata === 'object' ? metadata : {})
        });
        this._persistRecord(record);
        this._emitAudit(auditEvent, {
            taskId: record.taskId,
            target: record.target,
            reason,
            nextRetryAt,
            retryDelayMs,
            retryBaseDelayMs: baseRetryDelayMs,
            retryTokenGranted: tokenGranted,
            retryTokenRecoveryDelayMs: tokenRecoveryDelayMs,
            retryTokensAvailable: Number(this.retryTokens.toFixed(3)),
            retryHintMs: Number.isFinite(hintMs) ? Number(hintMs) : null,
            retryBudgetRequestsInWindow: budgetDecision.requestsInWindow,
            retryBudgetRetriesInWindow: budgetDecision.retriesInWindow + 1,
            retryBudgetMaxRetriesInWindow: budgetDecision.maxRetriesInWindow,
            ...(metadata && typeof metadata === 'object' ? metadata : {})
        }, nowMs);
        return true;
    }

    _classifyTaskPriority(priority) {
        if (typeof priority !== 'string') return 'normal';
        const normalized = priority.trim().toLowerCase();
        if (normalized in PRIORITY_RANK) return normalized;
        return 'normal';
    }

    _sortRetryCandidates(records, nowMs) {
        const at = Number.isFinite(Number(nowMs))
            ? Number(nowMs)
            : safeNow(this.now);
        const sorted = [...records];
        sorted.sort((a, b) => {
            const priorityA = this._classifyTaskPriority(a?.request?.priority);
            const priorityB = this._classifyTaskPriority(b?.request?.priority);
            const priorityDelta = (PRIORITY_RANK[priorityA] ?? 2) - (PRIORITY_RANK[priorityB] ?? 2);
            if (priorityDelta !== 0) return priorityDelta;

            const dueA = Number.isFinite(Number(a?.nextRetryAt)) ? Number(a.nextRetryAt) : at;
            const dueB = Number.isFinite(Number(b?.nextRetryAt)) ? Number(b.nextRetryAt) : at;
            if (dueA !== dueB) return dueA - dueB;

            const attemptsA = Number.isFinite(Number(a?.attempts)) ? Number(a.attempts) : 0;
            const attemptsB = Number.isFinite(Number(b?.attempts)) ? Number(b.attempts) : 0;
            if (attemptsA !== attemptsB) return attemptsA - attemptsB;

            return String(a?.taskId || '').localeCompare(String(b?.taskId || ''));
        });
        return sorted;
    }

    _buildMaintenanceRetryPlan(candidates, nowMs) {
        const limit = this.maintenanceRetryBatchLimit;
        if (!Array.isArray(candidates) || candidates.length === 0) {
            return {
                selected: [],
                deferredCount: 0
            };
        }

        const sorted = this._sortRetryCandidates(candidates, nowMs);
        if (!Number.isFinite(limit)) {
            return {
                selected: sorted,
                deferredCount: 0
            };
        }

        const highQueue = [];
        const regularQueue = [];
        for (const record of sorted) {
            const priority = this._classifyTaskPriority(record?.request?.priority);
            if (HIGH_PRIORITY_TASKS.has(priority)) {
                highQueue.push(record);
            } else {
                regularQueue.push(record);
            }
        }

        const selected = [];
        let highBurstBudget = this.maintenanceHighPriorityShare;
        while (selected.length < limit && (highQueue.length > 0 || regularQueue.length > 0)) {
            const canTakeHigh = highQueue.length > 0 && (highBurstBudget > 0 || regularQueue.length === 0);
            if (canTakeHigh) {
                selected.push(highQueue.shift());
                highBurstBudget = Math.max(0, highBurstBudget - 1);
                continue;
            }

            if (regularQueue.length > 0) {
                selected.push(regularQueue.shift());
                highBurstBudget = this.maintenanceHighPriorityShare;
                continue;
            }
        }

        return {
            selected,
            deferredCount: Math.max(0, candidates.length - selected.length)
        };
    }

    async dispatchTask({
        target,
        task,
        priority = 'normal',
        context,
        constraints,
        maxRetryElapsedMs = null,
        idempotencyKey = null,
        id = randomUUID(),
        createdAt = safeNow(this.now)
    }) {
        const dispatchAt = safeNow(this.now);
        this._cleanupExpiredIdempotencyEntries(dispatchAt);
        const normalizedIdempotencyKey = this._normalizeIdempotencyKey(idempotencyKey);
        const idempotencyFingerprint = this._buildIdempotencyFingerprint({
            target,
            task,
            priority,
            context,
            constraints
        });
        if (normalizedIdempotencyKey) {
            const existingEntry = this.idempotencyCache.get(normalizedIdempotencyKey);
            if (existingEntry) {
                if (existingEntry.fingerprint !== idempotencyFingerprint) {
                    throw new TaskOrchestratorError(
                        'IDEMPOTENCY_KEY_REUSED',
                        `idempotency key ${normalizedIdempotencyKey} was reused with a different task payload`,
                        {
                            idempotencyKey: normalizedIdempotencyKey,
                            existingTaskId: existingEntry.taskId
                        }
                    );
                }

                const existingRecord = this.tasks.get(existingEntry.taskId);
                if (existingRecord) {
                    return this.getTask(existingEntry.taskId);
                }

                this.idempotencyCache.delete(normalizedIdempotencyKey);
                this.idempotencyTaskIndex.delete(existingEntry.taskId);
            }
        }

        const routingDraft = buildTaskRequest({
            from: this.localAgentId,
            target,
            task,
            priority,
            context,
            constraints,
            id,
            createdAt
        });

        let resolvedTarget = target;
        let candidateTargets = [];
        if (!resolvedTarget && this.routeTask) {
            const routed = await this.routeTask(routingDraft);
            if (typeof routed === 'string' && routed.trim()) {
                resolvedTarget = routed;
            } else if (routed && typeof routed === 'object') {
                if (typeof routed.target === 'string' && routed.target.trim()) {
                    resolvedTarget = routed.target;
                } else if (typeof routed.selectedAgentId === 'string' && routed.selectedAgentId.trim()) {
                    resolvedTarget = routed.selectedAgentId;
                } else if (typeof routed.taskRequest?.target === 'string' && routed.taskRequest.target.trim()) {
                    resolvedTarget = routed.taskRequest.target;
                }
                candidateTargets = this._normalizeCandidateTargets(
                    routed.candidateTargets,
                    routed.targets,
                    routed.candidates
                );
                if (!resolvedTarget && candidateTargets.length > 0) {
                    resolvedTarget = candidateTargets[0];
                }
            }
        }

        if (!resolvedTarget || typeof resolvedTarget !== 'string') {
            throw new TaskOrchestratorError(
                'MISSING_TARGET',
                'Task target is required (or provide a routeTask function that resolves one)'
            );
        }

        let request = buildTaskRequest({
            from: this.localAgentId,
            target: resolvedTarget,
            task,
            priority,
            context,
            constraints,
            id,
            createdAt
        });

        candidateTargets = this._normalizeCandidateTargets(candidateTargets, request.target);
        const selectedTarget = this._selectDispatchTarget(candidateTargets, dispatchAt);
        if (selectedTarget && selectedTarget !== request.target) {
            request = buildTaskRequest({
                ...request,
                target: selectedTarget,
                id: request.id,
                from: request.from,
                createdAt: request.createdAt
            });
        }

        let policyDecision = null;
        if (this.dispatchPolicy) {
            const decision = await this.dispatchPolicy(request);
            if (decision === false) {
                this._emitAudit('task_policy_denied', {
                    taskId: request.id,
                    target: request.target,
                    reasons: [{ code: 'policy_denied', reason: 'dispatch_policy_returned_false' }]
                }, request.createdAt);
                throw new TaskOrchestratorError(
                    'POLICY_DENIED',
                    `Task ${request.id} denied by dispatch policy`,
                    {
                        taskId: request.id,
                        reasons: [{ code: 'policy_denied', reason: 'dispatch_policy_returned_false' }]
                    }
                );
            }

            if (decision && typeof decision === 'object') {
                const allowed = decision.allowed !== false && decision.decision !== 'deny';
                const reasons = Array.isArray(decision.reasons) ? decision.reasons : [];
                const redactions = Array.isArray(decision.redactions) ? decision.redactions : [];

                if (decision.taskRequest && typeof decision.taskRequest === 'object') {
                    request = buildTaskRequest({
                        ...request,
                        ...decision.taskRequest,
                        id: request.id,
                        from: request.from,
                        target: request.target,
                        createdAt: request.createdAt
                    });
                }

                policyDecision = {
                    allowed,
                    reasons: clone(reasons),
                    redactions: clone(redactions)
                };

                if (!allowed) {
                    this._emitAudit('task_policy_denied', {
                        taskId: request.id,
                        target: request.target,
                        reasons
                    }, request.createdAt);
                    throw new TaskOrchestratorError(
                        'POLICY_DENIED',
                        `Task ${request.id} denied by dispatch policy`,
                        {
                            taskId: request.id,
                            reasons
                        }
                    );
                }
            }
        }

        const record = {
            taskId: request.id,
            target: request.target,
            request,
            status: 'created',
            approval: null,
            policy: policyDecision,
            attempts: 0,
            maxRetries: this.maxRetries,
            maxRetryElapsedMs: this._resolveTaskMaxRetryElapsedMs(
                maxRetryElapsedMs ?? context?.retryMaxElapsedMs
            ),
            createdAt: request.createdAt,
            updatedAt: request.createdAt,
            deadlineAt: request.createdAt + this.defaultTimeoutMs,
            nextRetryAt: null,
            closedAt: null,
            lastDispatchAt: null,
            lastError: null,
            receipts: [],
            result: null,
            history: [
                { at: request.createdAt, event: 'created' }
            ],
            routing: {
                candidates: candidateTargets,
                failovers: 0,
                hedges: {
                    dispatched: 0,
                    lastDispatchedAt: null,
                    lastTarget: null,
                    attemptedTargets: [request.target]
                }
            },
            deadLetter: null,
            idempotency: normalizedIdempotencyKey
                ? {
                    key: normalizedIdempotencyKey,
                    fingerprint: idempotencyFingerprint
                }
                : null
        };
        this._ensureRoutingState(record);

        if (policyDecision?.redactions?.length > 0) {
            record.history.push({
                at: request.createdAt,
                event: 'policy_redacted',
                redactionCount: policyDecision.redactions.length
            });
        }

        if (this.approvalPolicy) {
            const decision = await this.approvalPolicy(request);
            if (decision?.required) {
                record.status = APPROVAL_PENDING_STATUS;
                record.approval = {
                    status: 'pending',
                    reviewerGroup: decision.reviewerGroup || null,
                    reason: decision.reason || 'approval_required',
                    matchedRules: Array.isArray(decision.matchedRules) ? decision.matchedRules : [],
                    requestedAt: createdAt,
                    reviewedAt: null,
                    reviewer: null,
                    reviewReason: null
                };
                record.history.push({
                    at: createdAt,
                    event: 'approval_requested',
                    reason: record.approval.reason
                });
            }
        }

        this.tasks.set(record.taskId, record);
        this._registerIdempotencyKey(
            normalizedIdempotencyKey,
            record.taskId,
            idempotencyFingerprint,
            request.createdAt
        );
        this._persistRecord(record);
        this._emitAudit('task_created', {
            taskId: record.taskId,
            target: record.target,
            status: record.status,
            priority: record.request.priority,
            policyRedactions: record.policy?.redactions?.length || 0
        }, record.createdAt);

        if (record.status === APPROVAL_PENDING_STATUS) {
            this._emitAudit('task_awaiting_approval', {
                taskId: record.taskId,
                reviewerGroup: record.approval?.reviewerGroup || null,
                reason: record.approval?.reason || null
            }, record.updatedAt);
            return this.getTask(record.taskId);
        }

        try {
            await this._sendTask(record, 'initial_dispatch');
        } catch (error) {
            if (
                error instanceof TaskOrchestratorError
                && ['SEND_FAILED', 'CIRCUIT_OPEN', 'TARGET_BACKPRESSURE', 'ADAPTIVE_THROTTLED'].includes(error.code)
                && this._maybeFailoverRecordTarget(record, dispatchAt, `initial_dispatch_${error.code.toLowerCase()}`)
            ) {
                await this._sendTask(record, 'initial_dispatch_failover');
                return this.getTask(record.taskId);
            }
            if (error instanceof TaskOrchestratorError && error.code === 'CIRCUIT_OPEN') {
                if (this._canRetry(record, dispatchAt)) {
                    this._scheduleRetry(record, dispatchAt, {
                        reason: 'circuit_open_on_dispatch',
                        event: 'dispatch_deferred_circuit_open',
                        hintMs: Number.isFinite(error?.details?.retryAfterMs)
                            ? Number(error.details.retryAfterMs)
                            : null,
                        auditEvent: 'task_dispatch_deferred_circuit_open',
                        metadata: {
                            circuitState: error?.details?.circuitState || null
                        }
                    });
                    return this.getTask(record.taskId);
                }
            }
            if (error instanceof TaskOrchestratorError && error.code === 'TARGET_BACKPRESSURE') {
                if (this._canRetry(record, dispatchAt)) {
                    this._scheduleRetry(record, dispatchAt, {
                        reason: 'target_backpressure_on_dispatch',
                        event: 'dispatch_deferred_target_backpressure',
                        hintMs: Number.isFinite(error?.details?.retryAfterMs)
                            ? Number(error.details.retryAfterMs)
                            : this.bulkheadRetryDelayMs,
                        auditEvent: 'task_dispatch_deferred_target_backpressure',
                        metadata: {
                            inFlight: Number.isFinite(error?.details?.inFlight)
                                ? Number(error.details.inFlight)
                                : null,
                            inFlightLimit: Number.isFinite(error?.details?.limit)
                                ? Number(error.details.limit)
                                : null
                        }
                    });
                    return this.getTask(record.taskId);
                }
            }
            if (error instanceof TaskOrchestratorError && error.code === 'GLOBAL_BACKPRESSURE') {
                if (this._canRetry(record, dispatchAt)) {
                    this._scheduleRetry(record, dispatchAt, {
                        reason: 'global_backpressure_on_dispatch',
                        event: 'dispatch_deferred_global_backpressure',
                        hintMs: Number.isFinite(error?.details?.retryAfterMs)
                            ? Number(error.details.retryAfterMs)
                            : this.bulkheadRetryDelayMs,
                        auditEvent: 'task_dispatch_deferred_global_backpressure',
                        metadata: {
                            inFlight: Number.isFinite(error?.details?.inFlight)
                                ? Number(error.details.inFlight)
                                : null,
                            inFlightLimit: Number.isFinite(error?.details?.limit)
                                ? Number(error.details.limit)
                                : null,
                            lowPriorityLimit: Number.isFinite(error?.details?.lowPriorityLimit)
                                ? Number(error.details.lowPriorityLimit)
                                : null,
                            reservedForHighPriority: Number.isFinite(error?.details?.reservedForHighPriority)
                                ? Number(error.details.reservedForHighPriority)
                                : null,
                            saturationReason: error?.details?.saturationReason || null
                        }
                    });
                    return this.getTask(record.taskId);
                }
            }
            if (error instanceof TaskOrchestratorError && error.code === 'ADAPTIVE_THROTTLED') {
                if (this._canRetry(record, dispatchAt)) {
                    this._scheduleRetry(record, dispatchAt, {
                        reason: 'adaptive_throttle_on_dispatch',
                        event: 'dispatch_deferred_adaptive_throttle',
                        hintMs: this.retryDelayMs,
                        auditEvent: 'task_dispatch_deferred_adaptive_throttle',
                        metadata: {
                            acceptedInWindow: Number.isFinite(error?.details?.acceptedInWindow)
                                ? Number(error.details.acceptedInWindow)
                                : null,
                            rejectedInWindow: Number.isFinite(error?.details?.rejectedInWindow)
                                ? Number(error.details.rejectedInWindow)
                                : null,
                            totalInWindow: Number.isFinite(error?.details?.totalInWindow)
                                ? Number(error.details.totalInWindow)
                                : null,
                            rejectionRatio: Number.isFinite(error?.details?.rejectionRatio)
                                ? Number(error.details.rejectionRatio)
                                : null,
                            dropProbability: Number.isFinite(error?.details?.dropProbability)
                                ? Number(error.details.dropProbability)
                                : null
                        }
                    });
                    return this.getTask(record.taskId);
                }
            }

            this.tasks.delete(record.taskId);
            this._deleteRecord(record.taskId);
            this._clearIdempotencyKeyForTask(record.taskId);
            throw error;
        }

        return this.getTask(record.taskId);
    }

    async reviewTask(taskId, decision = {}) {
        const record = this.tasks.get(taskId);
        if (!record) return null;
        if (record.status !== APPROVAL_PENDING_STATUS) {
            throw new TaskOrchestratorError(
                'NOT_AWAITING_APPROVAL',
                `Task ${taskId} is not waiting for approval`
            );
        }

        const approved = decision.approved === true;
        const reviewedAt = Number.isFinite(Number(decision.reviewedAt))
            ? Number(decision.reviewedAt)
            : safeNow(this.now);

        record.updatedAt = reviewedAt;
        record.approval = {
            ...(record.approval || {}),
            status: approved ? 'approved' : 'denied',
            reviewedAt,
            reviewer: decision.reviewer || null,
            reviewReason: decision.reason || null
        };

        if (!approved) {
            record.status = 'rejected';
            record.closedAt = reviewedAt;
            record.history.push({
                at: reviewedAt,
                event: 'approval_denied',
                reason: decision.reason || 'denied'
            });
            this._persistRecord(record);
            this._emitAudit('task_approval_denied', {
                taskId: record.taskId,
                reviewer: record.approval.reviewer,
                reason: record.approval.reviewReason
            }, reviewedAt);
            return this.getTask(taskId);
        }

        record.status = 'created';
        record.history.push({
            at: reviewedAt,
            event: 'approval_approved'
        });
        this._persistRecord(record);
        this._emitAudit('task_approval_approved', {
            taskId: record.taskId,
            reviewer: record.approval.reviewer,
            reason: record.approval.reviewReason
        }, reviewedAt);

        try {
            await this._sendTask(record, 'approval_release');
        } catch (error) {
            if (
                error instanceof TaskOrchestratorError
                && ['SEND_FAILED', 'CIRCUIT_OPEN', 'TARGET_BACKPRESSURE', 'ADAPTIVE_THROTTLED'].includes(error.code)
                && this._maybeFailoverRecordTarget(record, reviewedAt, `approval_release_${error.code.toLowerCase()}`)
            ) {
                await this._sendTask(record, 'approval_release_failover');
                return this.getTask(taskId);
            }
            if (this._canRetry(record, reviewedAt)) {
                this._scheduleRetry(record, reviewedAt, {
                    reason: 'approval_release_failed',
                    event: 'approval_release_retry_scheduled',
                    metadata: {
                        error: error.message
                    }
                });
            } else {
                record.status = 'transport_error';
                record.updatedAt = reviewedAt;
                record.closedAt = reviewedAt;
                record.history.push({
                    at: reviewedAt,
                    event: 'approval_release_retry_exhausted',
                    reason: 'approval_release_failed',
                    error: error.message
                });
                this._persistRecord(record);
                this._emitAudit('task_approval_release_retry_exhausted', {
                    taskId: record.taskId,
                    target: record.target,
                    error: error.message
                }, reviewedAt);
                this._markDeadLetter(record, reviewedAt, {
                    reason: 'approval_release_failed',
                    sourceEvent: 'approval_release_failed'
                });
            }
        }

        return this.getTask(taskId);
    }

    async _sendTask(record, reason) {
        const sendAt = safeNow(this.now);
        const globalBulkheadGate = this._allowGlobalBulkheadSend(
            record.taskId,
            record.request?.priority
        );
        if (!globalBulkheadGate.allowed) {
            record.updatedAt = sendAt;
            record.history.push({
                at: sendAt,
                event: 'send_blocked_global_backpressure',
                reason,
                priority: record.request?.priority || 'normal',
                inFlight: globalBulkheadGate.inFlight,
                inFlightLimit: globalBulkheadGate.limit,
                lowPriorityLimit: globalBulkheadGate.lowPriorityLimit,
                reservedForHighPriority: globalBulkheadGate.reservedForHighPriority,
                saturationReason: globalBulkheadGate.saturationReason,
                retryAfterMs: globalBulkheadGate.retryAfterMs
            });
            this._persistRecord(record);
            this._emitAudit('task_send_blocked_global_backpressure', {
                taskId: record.taskId,
                target: record.target,
                reason,
                priority: record.request?.priority || 'normal',
                inFlight: globalBulkheadGate.inFlight,
                inFlightLimit: globalBulkheadGate.limit,
                lowPriorityLimit: globalBulkheadGate.lowPriorityLimit,
                reservedForHighPriority: globalBulkheadGate.reservedForHighPriority,
                saturationReason: globalBulkheadGate.saturationReason,
                retryAfterMs: globalBulkheadGate.retryAfterMs
            }, sendAt);
            throw new TaskOrchestratorError(
                'GLOBAL_BACKPRESSURE',
                `Global in-flight limit reached (${globalBulkheadGate.inFlight}/${globalBulkheadGate.limit})`,
                {
                    taskId: record.taskId,
                    target: record.target,
                    priority: record.request?.priority || 'normal',
                    inFlight: globalBulkheadGate.inFlight,
                    limit: globalBulkheadGate.limit,
                    lowPriorityLimit: globalBulkheadGate.lowPriorityLimit,
                    reservedForHighPriority: globalBulkheadGate.reservedForHighPriority,
                    saturationReason: globalBulkheadGate.saturationReason,
                    retryAfterMs: globalBulkheadGate.retryAfterMs
                }
            );
        }

        const bulkheadGate = this._allowTargetBulkheadSend(record.target, record.taskId);
        if (!bulkheadGate.allowed) {
            record.updatedAt = sendAt;
            record.history.push({
                at: sendAt,
                event: 'send_blocked_target_backpressure',
                reason,
                inFlight: bulkheadGate.inFlight,
                inFlightLimit: bulkheadGate.limit,
                retryAfterMs: bulkheadGate.retryAfterMs
            });
            this._persistRecord(record);
            this._emitAudit('task_send_blocked_target_backpressure', {
                taskId: record.taskId,
                target: record.target,
                reason,
                inFlight: bulkheadGate.inFlight,
                inFlightLimit: bulkheadGate.limit,
                retryAfterMs: bulkheadGate.retryAfterMs
            }, sendAt);
            throw new TaskOrchestratorError(
                'TARGET_BACKPRESSURE',
                `Target ${record.target} reached in-flight limit (${bulkheadGate.inFlight}/${bulkheadGate.limit})`,
                {
                    taskId: record.taskId,
                    target: record.target,
                    inFlight: bulkheadGate.inFlight,
                    limit: bulkheadGate.limit,
                    retryAfterMs: bulkheadGate.retryAfterMs
                }
            );
        }

        const circuitGate = this._allowTargetSend(record.target, sendAt);
        if (!circuitGate.allowed) {
            record.updatedAt = sendAt;
            record.history.push({
                at: sendAt,
                event: 'send_blocked_circuit_open',
                reason,
                circuitState: circuitGate.state,
                retryAfterMs: circuitGate.retryAfterMs
            });
            this._persistRecord(record);
            this._emitAudit('task_send_blocked_circuit_open', {
                taskId: record.taskId,
                target: record.target,
                reason,
                circuitState: circuitGate.state,
                retryAfterMs: circuitGate.retryAfterMs
            }, sendAt);
            throw new TaskOrchestratorError(
                'CIRCUIT_OPEN',
                `Target ${record.target} circuit is ${circuitGate.state}`,
                {
                    taskId: record.taskId,
                    target: record.target,
                    circuitState: circuitGate.state,
                    retryAfterMs: circuitGate.retryAfterMs
                }
            );
        }

        const adaptiveThrottleGate = this._evaluateAdaptiveThrottle(
            record.target,
            record.request?.priority,
            sendAt
        );
        if (!adaptiveThrottleGate.allowed) {
            record.updatedAt = sendAt;
            record.history.push({
                at: sendAt,
                event: 'send_blocked_adaptive_throttle',
                reason,
                acceptedInWindow: adaptiveThrottleGate.acceptedInWindow,
                rejectedInWindow: adaptiveThrottleGate.rejectedInWindow,
                totalInWindow: adaptiveThrottleGate.totalInWindow,
                rejectionRatio: Number(adaptiveThrottleGate.rejectionRatio.toFixed(4)),
                dropProbability: Number(adaptiveThrottleGate.dropProbability.toFixed(4)),
                sample: Number.isFinite(adaptiveThrottleGate.sample)
                    ? Number(adaptiveThrottleGate.sample.toFixed(4))
                    : null
            });
            this._persistRecord(record);
            this._emitAudit('task_send_blocked_adaptive_throttle', {
                taskId: record.taskId,
                target: record.target,
                reason,
                priority: record.request?.priority || 'normal',
                acceptedInWindow: adaptiveThrottleGate.acceptedInWindow,
                rejectedInWindow: adaptiveThrottleGate.rejectedInWindow,
                totalInWindow: adaptiveThrottleGate.totalInWindow,
                rejectionRatio: Number(adaptiveThrottleGate.rejectionRatio.toFixed(4)),
                dropProbability: Number(adaptiveThrottleGate.dropProbability.toFixed(4)),
                sample: Number.isFinite(adaptiveThrottleGate.sample)
                    ? Number(adaptiveThrottleGate.sample.toFixed(4))
                    : null
            }, sendAt);
            throw new TaskOrchestratorError(
                'ADAPTIVE_THROTTLED',
                `Target ${record.target} send throttled by adaptive rejection control`,
                {
                    taskId: record.taskId,
                    target: record.target,
                    priority: record.request?.priority || 'normal',
                    acceptedInWindow: adaptiveThrottleGate.acceptedInWindow,
                    rejectedInWindow: adaptiveThrottleGate.rejectedInWindow,
                    totalInWindow: adaptiveThrottleGate.totalInWindow,
                    rejectionRatio: adaptiveThrottleGate.rejectionRatio,
                    dropProbability: adaptiveThrottleGate.dropProbability
                }
            );
        }

        record.attempts += 1;
        if (record.attempts === 1) {
            this._recordRetryBudgetRequest(sendAt);
        }
        record.updatedAt = sendAt;
        record.history.push({
            at: sendAt,
            event: 'send_attempt',
            reason,
            attempt: record.attempts
        });
        this._emitAudit('task_send_attempt', {
            taskId: record.taskId,
            target: record.target,
            reason,
            attempt: record.attempts
        }, sendAt);
        record._sending = true;

        try {
            await this.transport.send(record.target, record.request);
            delete record._sending;
            record.status = 'dispatched';
            record.lastDispatchAt = sendAt;
            record.deadlineAt = sendAt + this._resolveTimeoutMs(record.target);
            record.nextRetryAt = null;
            record.lastError = null;
            record.history.push({
                at: safeNow(this.now),
                event: 'send_success',
                attempt: record.attempts
            });
            this._recordCircuitSendSuccess(record.target, record.updatedAt);
            this._recordTargetOutlierSuccess(record.target, record.updatedAt);
            this._persistRecord(record);
            this._emitAudit('task_send_success', {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts
            }, record.updatedAt);
        } catch (error) {
            delete record._sending;
            const message = error?.message || 'Failed to dispatch task';
            record.lastError = message;
            record.updatedAt = safeNow(this.now);
            record.history.push({
                at: record.updatedAt,
                event: 'send_failed',
                attempt: record.attempts,
                error: message
            });
            this._recordCircuitSendFailure(record.target, record.updatedAt);
            this._recordTargetOutlierFailure(record.target, record.updatedAt);
            this._persistRecord(record);
            this._emitAudit('task_send_failed', {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts,
                error: message
            }, record.updatedAt);
            throw new TaskOrchestratorError('SEND_FAILED', message, {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts,
                cause: error
            });
        }
    }

    ingestReceipt(receiptPayload) {
        const receipt = TaskReceipt.parse(receiptPayload);
        const record = this.tasks.get(receipt.taskId);
        if (!record) return false;
        if (TERMINAL_STATUSES.has(record.status)) return false;

        record.receipts.push(receipt);
        record.updatedAt = receipt.timestamp;

        if (!receipt.accepted) {
            const reason = receipt.reason || 'rejected_by_worker';
            const receiptHintMs = Number.isFinite(receipt.etaMs) ? Number(receipt.etaMs) : null;
            const reasonHintMs = this._parseRetryHintMsFromReason(reason);
            const retryHintMs = receiptHintMs !== null ? receiptHintMs : reasonHintMs;
            const transient = this._isTransientRejectionReason(reason);
            this._recordAdaptiveThrottleOutcome(record.target, false, receipt.timestamp);

            if (transient && this._canRetry(record, receipt.timestamp)) {
                this._scheduleRetry(record, receipt.timestamp, {
                    reason: 'rejected_transient',
                    event: 'rejected_retry_scheduled',
                    hintMs: retryHintMs,
                    auditEvent: 'task_rejected_retry_scheduled',
                    metadata: {
                        from: receipt.from,
                        rejectionReason: reason
                    }
                });
                return true;
            }

            record.status = 'rejected';
            record.closedAt = receipt.timestamp;
            record.history.push({
                at: receipt.timestamp,
                event: 'rejected',
                reason
            });
            this._persistRecord(record);
            this._emitAudit('task_rejected', {
                taskId: record.taskId,
                from: receipt.from,
                reason
            }, receipt.timestamp);
            this._markDeadLetter(record, receipt.timestamp, {
                reason,
                sourceEvent: 'receipt_rejected'
            });
            return true;
        }

        record.status = 'acknowledged';
        this._recordAdaptiveThrottleOutcome(record.target, true, receipt.timestamp);
        if (Number.isFinite(receipt.etaMs)) {
            record.deadlineAt = receipt.timestamp + Number(receipt.etaMs);
        }
        record.history.push({
            at: receipt.timestamp,
            event: 'acknowledged',
            etaMs: receipt.etaMs ?? null
        });
        this._persistRecord(record);
        this._emitAudit('task_acknowledged', {
            taskId: record.taskId,
            from: receipt.from,
            etaMs: receipt.etaMs ?? null
        }, receipt.timestamp);
        return true;
    }

    ingestResult(resultPayload) {
        const result = TaskResult.parse(resultPayload);
        const record = this.tasks.get(result.taskId);
        if (!record) return false;
        if (TERMINAL_STATUSES.has(record.status)) return false;

        record.result = result;
        record.updatedAt = result.completedAt;
        record.closedAt = result.completedAt;

        if (
            this.adaptiveTimeoutEnabled
            && Number.isFinite(record.lastDispatchAt)
            && Number.isFinite(result.completedAt)
            && result.completedAt >= record.lastDispatchAt
        ) {
            this._recordTargetLatencySample(
                record.target,
                result.completedAt - record.lastDispatchAt,
                result.completedAt
            );
        }

        if (result.status === 'success') {
            record.status = 'completed';
        } else if (result.status === 'partial') {
            record.status = 'partial';
        } else {
            record.status = 'failed';
        }

        record.history.push({
            at: result.completedAt,
            event: 'result',
            resultStatus: result.status
        });
        this._persistRecord(record);
        this._emitAudit('task_result', {
            taskId: record.taskId,
            from: result.from,
            status: result.status
        }, result.completedAt);

        if (record.status === 'failed') {
            this._markDeadLetter(record, result.completedAt, {
                reason: `result_status:${result.status}`,
                sourceEvent: 'result_failed'
            });
        }

        return true;
    }

    async runMaintenance(nowMs = safeNow(this.now)) {
        const summary = {
            checked: 0,
            scheduledRetries: 0,
            retried: 0,
            hedged: 0,
            timedOut: 0,
            transportFailures: 0,
            retryBacklog: 0
        };
        const dueRetryCandidates = [];

        for (const record of this.tasks.values()) {
            if (!OPEN_STATUSES.has(record.status)) continue;
            summary.checked++;

            const hedged = await this._maybeDispatchSpeculativeHedge(record, nowMs);
            if (hedged) {
                summary.hedged++;
                continue;
            }

            if (nowMs <= record.deadlineAt) continue;

            const retryEligibility = this._retryEligibility(record, nowMs);
            if (!retryEligibility.allowed) {
                const exhaustedByWindow = retryEligibility.reason === 'retry_window_exhausted';
                if (exhaustedByWindow) {
                    this.retryWindowExhaustedCount += 1;
                }
                record.status = 'timed_out';
                record.updatedAt = nowMs;
                record.closedAt = nowMs;
                record.history.push({
                    at: nowMs,
                    event: exhaustedByWindow ? 'retry_window_exhausted' : 'timed_out',
                    reason: exhaustedByWindow ? 'retry_window_exhausted' : undefined,
                    elapsedMs: exhaustedByWindow ? retryEligibility.elapsedMs : undefined,
                    maxRetryElapsedMs: exhaustedByWindow ? retryEligibility.maxRetryElapsedMs : undefined
                });
                this._persistRecord(record);
                this._emitAudit(exhaustedByWindow ? 'task_retry_window_exhausted' : 'task_timed_out', {
                    taskId: record.taskId,
                    target: record.target,
                    attempts: record.attempts,
                    elapsedMs: exhaustedByWindow ? retryEligibility.elapsedMs : undefined,
                    maxRetryElapsedMs: exhaustedByWindow ? retryEligibility.maxRetryElapsedMs : undefined
                }, nowMs);
                this._markDeadLetter(record, nowMs, {
                    reason: exhaustedByWindow ? 'retry_window_exhausted' : 'timed_out',
                    sourceEvent: exhaustedByWindow ? 'maintenance_retry_window_exhausted' : 'maintenance_timeout'
                });
                summary.timedOut++;
                continue;
            }

            if (record.nextRetryAt === null) {
                const scheduled = this._scheduleRetry(record, nowMs, {
                    reason: 'deadline_exceeded',
                    event: 'retry_scheduled'
                });
                if (scheduled) {
                    summary.scheduledRetries++;
                } else {
                    summary.transportFailures++;
                }
                continue;
            }

            if (nowMs < record.nextRetryAt) continue;
            dueRetryCandidates.push(record);
        }

        const retryPlan = this._buildMaintenanceRetryPlan(dueRetryCandidates, nowMs);
        summary.retryBacklog = retryPlan.deferredCount;
        for (const record of retryPlan.selected) {
            try {
                await this._sendTask(record, 'timeout_retry');
                summary.retried++;
            } catch (error) {
                if (error instanceof TaskOrchestratorError && error.code === 'TARGET_BACKPRESSURE') {
                    const failovered = this._maybeFailoverRecordTarget(
                        record,
                        nowMs,
                        'maintenance_target_backpressure'
                    );
                    if (failovered) {
                        const sentAfterFailover = await this._attemptImmediateFailoverSend(record, nowMs, summary);
                        if (sentAfterFailover) {
                            continue;
                        }
                    }
                    const scheduled = this._scheduleRetry(record, nowMs, {
                        reason: 'target_backpressure',
                        event: 'retry_deferred_target_backpressure',
                        hintMs: Number.isFinite(error?.details?.retryAfterMs)
                            ? Number(error.details.retryAfterMs)
                            : this.bulkheadRetryDelayMs,
                        auditEvent: 'task_retry_deferred_target_backpressure',
                        metadata: {
                            inFlight: Number.isFinite(error?.details?.inFlight)
                                ? Number(error.details.inFlight)
                                : null,
                            inFlightLimit: Number.isFinite(error?.details?.limit)
                                ? Number(error.details.limit)
                                : null
                        }
                    });
                    if (scheduled) {
                        summary.scheduledRetries++;
                    } else {
                        summary.transportFailures++;
                    }
                    continue;
                }
                if (error instanceof TaskOrchestratorError && error.code === 'GLOBAL_BACKPRESSURE') {
                    const scheduled = this._scheduleRetry(record, nowMs, {
                        reason: 'global_backpressure',
                        event: 'retry_deferred_global_backpressure',
                        hintMs: Number.isFinite(error?.details?.retryAfterMs)
                            ? Number(error.details.retryAfterMs)
                            : this.bulkheadRetryDelayMs,
                        auditEvent: 'task_retry_deferred_global_backpressure',
                        metadata: {
                            inFlight: Number.isFinite(error?.details?.inFlight)
                                ? Number(error.details.inFlight)
                                : null,
                            inFlightLimit: Number.isFinite(error?.details?.limit)
                                ? Number(error.details.limit)
                                : null,
                            lowPriorityLimit: Number.isFinite(error?.details?.lowPriorityLimit)
                                ? Number(error.details.lowPriorityLimit)
                                : null,
                            reservedForHighPriority: Number.isFinite(error?.details?.reservedForHighPriority)
                                ? Number(error.details.reservedForHighPriority)
                                : null,
                            saturationReason: error?.details?.saturationReason || null
                        }
                    });
                    if (scheduled) {
                        summary.scheduledRetries++;
                    } else {
                        summary.transportFailures++;
                    }
                    continue;
                }
                if (error instanceof TaskOrchestratorError && error.code === 'ADAPTIVE_THROTTLED') {
                    const failovered = this._maybeFailoverRecordTarget(
                        record,
                        nowMs,
                        'maintenance_adaptive_throttled'
                    );
                    if (failovered) {
                        const sentAfterFailover = await this._attemptImmediateFailoverSend(record, nowMs, summary);
                        if (sentAfterFailover) {
                            continue;
                        }
                    }
                    const scheduled = this._scheduleRetry(record, nowMs, {
                        reason: 'adaptive_throttled',
                        event: 'retry_deferred_adaptive_throttle',
                        hintMs: this.retryDelayMs,
                        auditEvent: 'task_retry_deferred_adaptive_throttle',
                        metadata: {
                            acceptedInWindow: Number.isFinite(error?.details?.acceptedInWindow)
                                ? Number(error.details.acceptedInWindow)
                                : null,
                            rejectedInWindow: Number.isFinite(error?.details?.rejectedInWindow)
                                ? Number(error.details.rejectedInWindow)
                                : null,
                            totalInWindow: Number.isFinite(error?.details?.totalInWindow)
                                ? Number(error.details.totalInWindow)
                                : null,
                            rejectionRatio: Number.isFinite(error?.details?.rejectionRatio)
                                ? Number(error.details.rejectionRatio)
                                : null,
                            dropProbability: Number.isFinite(error?.details?.dropProbability)
                                ? Number(error.details.dropProbability)
                                : null
                        }
                    });
                    if (scheduled) {
                        summary.scheduledRetries++;
                    } else {
                        summary.transportFailures++;
                    }
                    continue;
                }
                if (error instanceof TaskOrchestratorError && error.code === 'CIRCUIT_OPEN') {
                    const failovered = this._maybeFailoverRecordTarget(
                        record,
                        nowMs,
                        'maintenance_circuit_open'
                    );
                    if (failovered) {
                        const sentAfterFailover = await this._attemptImmediateFailoverSend(record, nowMs, summary);
                        if (sentAfterFailover) {
                            continue;
                        }
                    }
                    const scheduled = this._scheduleRetry(record, nowMs, {
                        reason: 'circuit_open',
                        event: 'retry_deferred_circuit_open',
                        hintMs: Number.isFinite(error?.details?.retryAfterMs)
                            ? Number(error.details.retryAfterMs)
                            : null,
                        auditEvent: 'task_retry_deferred_circuit_open',
                        metadata: {
                            circuitState: error?.details?.circuitState || null
                        }
                    });
                    if (scheduled) {
                        summary.scheduledRetries++;
                    } else {
                        summary.transportFailures++;
                    }
                    continue;
                }

                summary.transportFailures++;
                this.logger.warn?.(
                    `[Swarm] Retry send failed for task ${record.taskId}: ${error.message}`
                );
                if (error instanceof TaskOrchestratorError && error.code === 'SEND_FAILED') {
                    const failovered = this._maybeFailoverRecordTarget(
                        record,
                        nowMs,
                        'maintenance_send_failed'
                    );
                    if (failovered) {
                        const sentAfterFailover = await this._attemptImmediateFailoverSend(record, nowMs, summary);
                        if (sentAfterFailover) {
                            summary.transportFailures = Math.max(0, summary.transportFailures - 1);
                            continue;
                        }
                    }
                }

                const retryEligibility = this._retryEligibility(record, nowMs);
                if (!retryEligibility.allowed) {
                    const exhaustedByWindow = retryEligibility.reason === 'retry_window_exhausted';
                    if (exhaustedByWindow) {
                        this.retryWindowExhaustedCount += 1;
                    }
                    record.status = 'transport_error';
                    record.updatedAt = nowMs;
                    record.closedAt = nowMs;
                    record.history.push({
                        at: nowMs,
                        event: exhaustedByWindow ? 'retry_window_exhausted' : 'transport_error',
                        error: record.lastError,
                        reason: exhaustedByWindow ? 'retry_window_exhausted' : undefined,
                        elapsedMs: exhaustedByWindow ? retryEligibility.elapsedMs : undefined,
                        maxRetryElapsedMs: exhaustedByWindow ? retryEligibility.maxRetryElapsedMs : undefined
                    });
                    this._persistRecord(record);
                    this._emitAudit(exhaustedByWindow ? 'task_retry_window_exhausted' : 'task_transport_error', {
                        taskId: record.taskId,
                        target: record.target,
                        error: record.lastError,
                        elapsedMs: exhaustedByWindow ? retryEligibility.elapsedMs : undefined,
                        maxRetryElapsedMs: exhaustedByWindow ? retryEligibility.maxRetryElapsedMs : undefined
                    }, nowMs);
                    this._markDeadLetter(record, nowMs, {
                        reason: exhaustedByWindow
                            ? 'retry_window_exhausted'
                            : `transport_error:${record.lastError || 'unknown'}`,
                        sourceEvent: exhaustedByWindow
                            ? 'maintenance_retry_window_exhausted'
                            : 'maintenance_transport_error'
                    });
                } else {
                    const scheduled = this._scheduleRetry(record, nowMs, {
                        reason: 'transport_send_failed',
                        event: 'retry_scheduled',
                        metadata: {
                            error: record.lastError
                        }
                    });
                    if (scheduled) {
                        summary.scheduledRetries++;
                    } else {
                        summary.transportFailures++;
                    }
                }
            }
        }

        return summary;
    }

    getTask(taskId) {
        const record = this.tasks.get(taskId);
        if (!record) return null;
        return clone(record);
    }

    listTasks({ status = null, openOnly = false, target = null } = {}) {
        const output = [];
        for (const record of this.tasks.values()) {
            if (status && record.status !== status) continue;
            if (target && record.target !== target) continue;
            if (openOnly && TERMINAL_STATUSES.has(record.status)) continue;
            output.push(clone(record));
        }
        return output;
    }

    listPendingApprovals() {
        return this.listTasks({ status: APPROVAL_PENDING_STATUS });
    }

    listDeadLetters({ target = null, status = null, limit = null } = {}) {
        const output = [];
        for (const record of this.tasks.values()) {
            if (!this._isDeadLettered(record)) continue;
            if (target && record.target !== target) continue;
            if (status && record.status !== status) continue;
            output.push(clone(record));
        }

        output.sort((a, b) => Number(b.deadLetter?.at || 0) - Number(a.deadLetter?.at || 0));
        if (Number.isFinite(Number(limit)) && Number(limit) >= 0) {
            return output.slice(0, Number(limit));
        }
        return output;
    }

    async redriveDeadLetter(taskId, {
        resetAttempts = true,
        delayMs = 0,
        reason = 'manual_redrive'
    } = {}) {
        const record = this.tasks.get(taskId);
        if (!record) return null;

        if (!this._isDeadLettered(record)) {
            throw new TaskOrchestratorError(
                'NOT_DEAD_LETTERED',
                `Task ${taskId} is not in the dead-letter set`
            );
        }

        const at = safeNow(this.now);
        const normalizedDelayMs = Math.max(0, Math.floor(clampNonNegativeNumber(delayMs, 0)));
        const previousDeadLetter = clone(record.deadLetter);
        const previousStatus = record.status;

        if (resetAttempts) {
            record.attempts = 0;
        }

        record.status = 'retry_scheduled';
        record.updatedAt = at;
        record.closedAt = null;
        record.lastError = null;
        record.result = null;
        record.deadlineAt = at - 1;
        record.nextRetryAt = at + normalizedDelayMs;
        record.history.push({
            at,
            event: 'dead_letter_redriven',
            reason,
            resetAttempts,
            delayMs: normalizedDelayMs,
            previousStatus,
            deadLetterRedriveCount: Number(previousDeadLetter?.redriveCount || 0) + 1
        });
        delete record.deadLetter;
        this._persistRecord(record);
        this._emitAudit('task_dead_letter_redriven', {
            taskId: record.taskId,
            target: record.target,
            previousStatus,
            reason,
            resetAttempts,
            delayMs: normalizedDelayMs
        }, at);

        return this.getTask(record.taskId);
    }

    cancelTask(taskId, {
        reason = 'manual_cancelled',
        actor = null,
        cancelledAt = null
    } = {}) {
        const record = this.tasks.get(taskId);
        if (!record) return null;

        if (TERMINAL_STATUSES.has(record.status)) {
            if (record.status === 'cancelled') {
                return this.getTask(taskId);
            }
            throw new TaskOrchestratorError(
                'NOT_CANCELLABLE',
                `Task ${taskId} is already terminal (${record.status})`
            );
        }

        const at = Number.isFinite(Number(cancelledAt))
            ? Number(cancelledAt)
            : safeNow(this.now);
        const cancelReason = typeof reason === 'string' && reason.trim()
            ? reason
            : 'manual_cancelled';
        const priorStatus = record.status;

        record.status = 'cancelled';
        record.updatedAt = at;
        record.closedAt = at;
        record.nextRetryAt = null;
        record.deadlineAt = at;
        record.history.push({
            at,
            event: 'cancelled',
            reason: cancelReason,
            actor: typeof actor === 'string' && actor.trim() ? actor : null,
            priorStatus
        });
        this._persistRecord(record);
        this._emitAudit('task_cancelled', {
            taskId: record.taskId,
            target: record.target,
            reason: cancelReason,
            actor: typeof actor === 'string' && actor.trim() ? actor : null,
            priorStatus
        }, at);
        this._clearIdempotencyKeyForTask(record.taskId);

        return this.getTask(taskId);
    }

    async _attemptImmediateFailoverSend(record, nowMs, summary) {
        try {
            await this._sendTask(record, 'target_failover_retry');
            if (summary && typeof summary === 'object') {
                summary.retried = Number(summary.retried || 0) + 1;
            }
            return true;
        } catch (retryError) {
            this.logger.warn?.(
                `[Swarm] Failover send failed for task ${record.taskId}: ${retryError.message}`
            );
            return false;
        }
    }

    getMetrics() {
        const metrics = {
            total: this.tasks.size,
            open: 0,
            terminal: 0,
            byStatus: {},
            avgAttempts: 0,
            retry: {
                delayMs: this.retryDelayMs,
                strategy: this.retryBackoffStrategy,
                jitter: this.retryJitter,
                maxDelayMs: this.maxRetryDelayMs,
                maxHintMs: this.maxRetryHintMs,
                tokenBucket: {
                    capacity: this.retryTokenBucketCapacity,
                    refillPerSecond: this.retryTokenRefillPerSecond,
                    tokenCost: this.retryTokenCost,
                    tokensAvailable: Number(this.retryTokens.toFixed(3))
                },
                idempotency: {
                    ttlMs: this.idempotencyKeyTtlMs,
                    activeKeys: this.idempotencyCache.size
                },
                circuitBreaker: {
                    failureThreshold: this.circuitBreakerFailureThreshold,
                    cooldownMs: this.circuitBreakerCooldownMs,
                    halfOpenProbeCooldownMs: this.circuitBreakerHalfOpenProbeCooldownMs,
                    targetCount: this.circuitBreakers.size,
                    openTargets: 0,
                    halfOpenTargets: 0
                },
                bulkhead: {
                    maxInFlightPerTarget: Number.isFinite(this.bulkheadMaxInFlightPerTarget)
                        ? this.bulkheadMaxInFlightPerTarget
                        : null,
                    maxInFlightGlobal: Number.isFinite(this.bulkheadMaxInFlightGlobal)
                        ? this.bulkheadMaxInFlightGlobal
                        : null,
                    globalHighPriorityReserve: this.bulkheadGlobalHighPriorityReserve,
                    globalInFlight: 0,
                    lowPriorityLimit: Number.isFinite(this.bulkheadMaxInFlightGlobal)
                        ? this._globalLowPriorityLimit()
                        : null,
                    saturated: false,
                    lowPrioritySaturated: false,
                    retryDelayMs: this.bulkheadRetryDelayMs,
                    activeTargets: 0,
                    targets: {}
                },
                adaptiveTimeout: {
                    enabled: this.adaptiveTimeoutEnabled,
                    defaultTimeoutMs: this.defaultTimeoutMs,
                    minTimeoutMs: this.adaptiveTimeoutMinMs,
                    maxTimeoutMs: this.adaptiveTimeoutMaxMs,
                    safetyMarginMs: this.adaptiveTimeoutSafetyMarginMs,
                    alpha: this.adaptiveTimeoutAlpha,
                    beta: this.adaptiveTimeoutBeta,
                    targetCount: this.targetLatencyStats.size,
                    targets: {}
                },
                targetSelection: {
                    choices: this.targetSelectionChoices,
                    targetStats: this.targetOutlierStats.size
                },
                adaptiveThrottle: {
                    enabled: this.adaptiveThrottleEnabled,
                    windowMs: this.adaptiveThrottleWindowMs,
                    minSamples: this.adaptiveThrottleMinSamples,
                    dropThreshold: this.adaptiveThrottleDropThreshold,
                    bypassPriorities: [...this.adaptiveThrottleBypassPriorities],
                    blockedTotal: 0,
                    targetCount: this.targetAdaptiveThrottleStats.size,
                    targets: {}
                },
                outlierDetection: {
                    failureThreshold: this.targetOutlierFailureThreshold,
                    baseEjectionMs: this.targetOutlierBaseEjectionMs,
                    maxEjectionMs: this.targetOutlierMaxEjectionMs,
                    ejectedTargets: 0,
                    targets: {}
                },
                maintenance: {
                    retryBatchLimit: Number.isFinite(this.maintenanceRetryBatchLimit)
                        ? this.maintenanceRetryBatchLimit
                        : null,
                    highPriorityShare: this.maintenanceHighPriorityShare
                },
                budget: {
                    ratio: this.retryBudgetRatio,
                    minPerWindow: this.retryBudgetMinPerWindow,
                    windowMs: this.retryBudgetWindowMs,
                    requestsInWindow: 0,
                    retriesInWindow: 0,
                    maxRetriesInWindow: 0,
                    budgetRemaining: 0,
                    exhaustedCount: this.retryBudgetExhaustedCount
                },
                retryWindow: {
                    maxRetryElapsedMs: this.maxRetryElapsedMs,
                    exhaustedCount: this.retryWindowExhaustedCount
                },
                hedging: {
                    enabled: this.hedgingEnabled,
                    delayRatio: this.hedgingDelayRatio,
                    minDelayMs: this.hedgingMinDelayMs,
                    maxDelayMs: this.hedgingMaxDelayMs,
                    maxDispatches: this.hedgingMaxDispatches,
                    eligiblePriorities: [...this.hedgingEligiblePriorities],
                    dispatched: 0
                }
            },
            deadLetter: {
                maxEntries: this.deadLetterMaxEntries,
                total: 0,
                byStatus: {},
                byReason: {},
                oldestAt: null,
                newestAt: null
            }
        };

        let attemptsTotal = 0;
        for (const record of this.tasks.values()) {
            attemptsTotal += record.attempts;
            metrics.byStatus[record.status] = (metrics.byStatus[record.status] || 0) + 1;

            if (TERMINAL_STATUSES.has(record.status)) {
                metrics.terminal++;
            } else {
                metrics.open++;
            }

            const dispatchedHedges = Number(record?.routing?.hedges?.dispatched || 0);
            if (dispatchedHedges > 0) {
                metrics.retry.hedging.dispatched += dispatchedHedges;
            }

            if (this._isDeadLettered(record)) {
                const reason = record.deadLetter.reason || 'unknown';
                const at = Number(record.deadLetter.at) || 0;
                metrics.deadLetter.total++;
                metrics.deadLetter.byStatus[record.status] = (metrics.deadLetter.byStatus[record.status] || 0) + 1;
                metrics.deadLetter.byReason[reason] = (metrics.deadLetter.byReason[reason] || 0) + 1;
                metrics.deadLetter.oldestAt = metrics.deadLetter.oldestAt === null
                    ? at
                    : Math.min(metrics.deadLetter.oldestAt, at);
                metrics.deadLetter.newestAt = metrics.deadLetter.newestAt === null
                    ? at
                    : Math.max(metrics.deadLetter.newestAt, at);
            }
        }

        for (const state of this.circuitBreakers.values()) {
            if (state.state === 'open') {
                metrics.retry.circuitBreaker.openTargets++;
            } else if (state.state === 'half_open') {
                metrics.retry.circuitBreaker.halfOpenTargets++;
            }
        }

        this._pruneRetryBudgetEvents(safeNow(this.now));
        const requestsInWindow = this.retryBudgetRequestEvents.length;
        const retriesInWindow = this.retryBudgetRetryEvents.length;
        const maxRetriesInWindow = this.retryBudgetMinPerWindow
            + Math.floor(requestsInWindow * this.retryBudgetRatio);
        metrics.retry.budget.requestsInWindow = requestsInWindow;
        metrics.retry.budget.retriesInWindow = retriesInWindow;
        metrics.retry.budget.maxRetriesInWindow = maxRetriesInWindow;
        metrics.retry.budget.budgetRemaining = Math.max(0, maxRetriesInWindow - retriesInWindow);

        for (const [target, state] of this.targetLatencyStats.entries()) {
            metrics.retry.adaptiveTimeout.targets[target] = {
                samples: state.samples,
                srttMs: Number.isFinite(state.srttMs) ? Number(state.srttMs.toFixed(2)) : null,
                rttvarMs: Number.isFinite(state.rttvarMs) ? Number(state.rttvarMs.toFixed(2)) : null,
                timeoutMs: this._computeAdaptiveTimeoutMs(state),
                lastSampleMs: Number.isFinite(state.lastSampleMs)
                    ? Number(state.lastSampleMs.toFixed(2))
                    : null,
                lastUpdatedAt: Number.isFinite(state.lastUpdatedAt) ? state.lastUpdatedAt : null
            };
        }
        const metricNowMs = safeNow(this.now);
        for (const [target, state] of this.targetAdaptiveThrottleStats.entries()) {
            this._pruneAdaptiveThrottleState(state, metricNowMs);
            const acceptedInWindow = state.acceptedEvents.length;
            const rejectedInWindow = state.rejectedEvents.length;
            const totalInWindow = acceptedInWindow + rejectedInWindow;
            const rejectionRatio = totalInWindow > 0
                ? rejectedInWindow / totalInWindow
                : 0;
            const denominator = Math.max(0.0001, 1 - this.adaptiveThrottleDropThreshold);
            const dropProbability = rejectionRatio > this.adaptiveThrottleDropThreshold
                ? Math.min(
                    1,
                    Math.max(0, (rejectionRatio - this.adaptiveThrottleDropThreshold) / denominator)
                )
                : 0;
            metrics.retry.adaptiveThrottle.blockedTotal += Number(state.blockedCount || 0);
            metrics.retry.adaptiveThrottle.targets[target] = {
                acceptedInWindow,
                rejectedInWindow,
                totalInWindow,
                rejectionRatio: Number(rejectionRatio.toFixed(4)),
                estimatedDropProbability: Number(dropProbability.toFixed(4)),
                blockedCount: Number(state.blockedCount || 0),
                lastBlockedAt: Number.isFinite(state.lastBlockedAt)
                    ? Number(state.lastBlockedAt)
                    : null
            };
        }
        for (const [target, state] of this.targetOutlierStats.entries()) {
            const ejected = this._isTargetOutlierEjected(target, metricNowMs);
            if (ejected) {
                metrics.retry.outlierDetection.ejectedTargets += 1;
            }
            metrics.retry.outlierDetection.targets[target] = {
                consecutiveFailures: state.consecutiveFailures,
                totalFailures: state.totalFailures,
                totalSuccesses: state.totalSuccesses,
                ejectionCount: state.ejectionCount,
                ejectedUntil: Number.isFinite(state.ejectedUntil) ? state.ejectedUntil : null,
                lastFailureAt: Number.isFinite(state.lastFailureAt) ? state.lastFailureAt : null,
                lastSuccessAt: Number.isFinite(state.lastSuccessAt) ? state.lastSuccessAt : null
            };
        }
        const inFlightByTarget = new Map();
        for (const record of this.tasks.values()) {
            if (!record || typeof record.target !== 'string' || !record.target.trim()) continue;
            if (record._sending !== true && !IN_FLIGHT_STATUSES.has(record.status)) continue;
            const current = inFlightByTarget.get(record.target) || 0;
            inFlightByTarget.set(record.target, current + 1);
        }
        for (const [target, inFlight] of inFlightByTarget.entries()) {
            metrics.retry.bulkhead.targets[target] = {
                inFlight,
                limit: Number.isFinite(this.bulkheadMaxInFlightPerTarget)
                    ? this.bulkheadMaxInFlightPerTarget
                    : null,
                saturated: Number.isFinite(this.bulkheadMaxInFlightPerTarget)
                    ? inFlight >= this.bulkheadMaxInFlightPerTarget
                    : false
            };
        }
        metrics.retry.bulkhead.activeTargets = inFlightByTarget.size;
        const globalInFlight = this._countGlobalInFlight();
        metrics.retry.bulkhead.globalInFlight = globalInFlight;
        metrics.retry.bulkhead.saturated = Number.isFinite(this.bulkheadMaxInFlightGlobal)
            ? globalInFlight >= this.bulkheadMaxInFlightGlobal
            : false;
        metrics.retry.bulkhead.lowPrioritySaturated = Number.isFinite(this.bulkheadMaxInFlightGlobal)
            ? globalInFlight >= this._globalLowPriorityLimit()
            : false;

        metrics.avgAttempts = this.tasks.size > 0
            ? Number((attemptsTotal / this.tasks.size).toFixed(2))
            : 0;

        return metrics;
    }
}
