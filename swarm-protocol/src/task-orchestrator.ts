import { randomUUID } from 'crypto';
import { TaskReceipt, TaskRequest, TaskResult } from './schemas.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
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
        deadLetterMaxEntries = DEFAULT_DEAD_LETTER_MAX_ENTRIES,
        adaptiveTimeoutEnabled = true,
        adaptiveTimeoutMinMs = 250,
        adaptiveTimeoutMaxMs = 120_000,
        adaptiveTimeoutSafetyMarginMs = 100,
        adaptiveTimeoutAlpha = DEFAULT_ADAPTIVE_TIMEOUT_ALPHA,
        adaptiveTimeoutBeta = DEFAULT_ADAPTIVE_TIMEOUT_BETA,
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
        this.targetLatencyStats = new Map();
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
        const key = typeof target === 'string' ? target.trim() : '';
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
        }

        const hydratedAt = safeNow(this.now);
        let applied = 0;
        for (const record of loaded) {
            if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') {
                continue;
            }
            this.tasks.set(record.taskId, clone(record));
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

    _canRetry(record) {
        return record.attempts <= record.maxRetries;
    }

    _parseRetryHintMsFromReason(reason) {
        if (typeof reason !== 'string' || !reason.trim()) {
            return null;
        }

        const retryAfterMatch = reason.match(
            /\b(?:retry[-_\s]?after|x[-_\s]?ratelimit[-_\s]?reset|ratelimit[-_\s]?reset)\b\s*[:=]?\s*(\d{1,10})\b/i
        );
        if (retryAfterMatch) {
            const seconds = Number(retryAfterMatch[1]);
            if (Number.isFinite(seconds) && seconds >= 0) {
                return seconds * 1_000;
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

    _scheduleRetry(record, nowMs, {
        reason = 'retry_scheduled',
        event = 'retry_scheduled',
        hintMs = null,
        auditEvent = 'task_retry_scheduled',
        metadata = null
    } = {}) {
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
            ...(metadata && typeof metadata === 'object' ? metadata : {})
        }, nowMs);
    }

    async dispatchTask({
        target,
        task,
        priority = 'normal',
        context,
        constraints,
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
            deadLetter: null,
            idempotency: normalizedIdempotencyKey
                ? {
                    key: normalizedIdempotencyKey,
                    fingerprint: idempotencyFingerprint
                }
                : null
        };

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
            if (error instanceof TaskOrchestratorError && error.code === 'CIRCUIT_OPEN') {
                if (this._canRetry(record)) {
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
            this._scheduleRetry(record, reviewedAt, {
                reason: 'approval_release_failed',
                event: 'approval_release_retry_scheduled',
                metadata: {
                    error: error.message
                }
            });
        }

        return this.getTask(taskId);
    }

    async _sendTask(record, reason) {
        const sendAt = safeNow(this.now);
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

        record.attempts += 1;
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

        try {
            await this.transport.send(record.target, record.request);
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
            this._persistRecord(record);
            this._emitAudit('task_send_success', {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts
            }, record.updatedAt);
        } catch (error) {
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

            if (transient && this._canRetry(record)) {
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
            timedOut: 0,
            transportFailures: 0
        };

        for (const record of this.tasks.values()) {
            if (!OPEN_STATUSES.has(record.status)) continue;
            summary.checked++;

            if (nowMs <= record.deadlineAt) continue;

            if (!this._canRetry(record)) {
                record.status = 'timed_out';
                record.updatedAt = nowMs;
                record.closedAt = nowMs;
                record.history.push({ at: nowMs, event: 'timed_out' });
                this._persistRecord(record);
                this._emitAudit('task_timed_out', {
                    taskId: record.taskId,
                    target: record.target,
                    attempts: record.attempts
                }, nowMs);
                this._markDeadLetter(record, nowMs, {
                    reason: 'timed_out',
                    sourceEvent: 'maintenance_timeout'
                });
                summary.timedOut++;
                continue;
            }

            if (record.nextRetryAt === null) {
                this._scheduleRetry(record, nowMs, {
                    reason: 'deadline_exceeded',
                    event: 'retry_scheduled'
                });
                summary.scheduledRetries++;
                continue;
            }

            if (nowMs < record.nextRetryAt) continue;

            try {
                await this._sendTask(record, 'timeout_retry');
                summary.retried++;
            } catch (error) {
                if (error instanceof TaskOrchestratorError && error.code === 'CIRCUIT_OPEN') {
                    this._scheduleRetry(record, nowMs, {
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
                    summary.scheduledRetries++;
                    continue;
                }

                summary.transportFailures++;
                this.logger.warn?.(
                    `[Swarm] Retry send failed for task ${record.taskId}: ${error.message}`
                );

                if (!this._canRetry(record)) {
                    record.status = 'transport_error';
                    record.updatedAt = nowMs;
                    record.closedAt = nowMs;
                    record.history.push({
                        at: nowMs,
                        event: 'transport_error',
                        error: record.lastError
                    });
                    this._persistRecord(record);
                    this._emitAudit('task_transport_error', {
                        taskId: record.taskId,
                        target: record.target,
                        error: record.lastError
                    }, nowMs);
                    this._markDeadLetter(record, nowMs, {
                        reason: `transport_error:${record.lastError || 'unknown'}`,
                        sourceEvent: 'maintenance_transport_error'
                    });
                } else {
                    this._scheduleRetry(record, nowMs, {
                        reason: 'transport_send_failed',
                        event: 'retry_scheduled',
                        metadata: {
                            error: record.lastError
                        }
                    });
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
        record.deadLetter = {
            ...previousDeadLetter,
            redriveCount: Number(previousDeadLetter?.redriveCount || 0) + 1,
            lastRedriveAt: at
        };
        record.history.push({
            at,
            event: 'dead_letter_redriven',
            reason,
            resetAttempts,
            delayMs: normalizedDelayMs,
            previousStatus
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

        metrics.avgAttempts = this.tasks.size > 0
            ? Number((attemptsTotal / this.tasks.size).toFixed(2))
            : 0;

        return metrics;
    }
}
