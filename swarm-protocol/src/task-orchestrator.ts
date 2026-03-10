import { randomUUID } from 'crypto';
import { TaskReceipt, TaskRequest, TaskResult } from './schemas.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error',
    'cancelled'
]);

const OPEN_STATUSES = new Set([
    'created',
    'dispatched',
    'acknowledged',
    'retry_scheduled'
]);
const TERMINAL_REPLAY_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

const APPROVAL_PENDING_STATUS = 'awaiting_approval';
const RETRY_BACKOFF_STRATEGIES = new Set(['fixed', 'exponential']);
const RETRY_JITTER_STRATEGIES = new Set(['none', 'full', 'decorrelated']);
const DEFAULT_RETRY_THROTTLE = Object.freeze({
    maxTokens: 10,
    tokenRatio: 0.1,
    retryCost: 1,
    timeoutRetryCost: 1,
    throttlingRetryCost: 1,
    transportRetryCost: 1,
    threshold: 5,
    scope: 'global'
});
const DEFAULT_RETRY_BUDGET = Object.freeze({
    ratio: 0.2,
    minRetries: 1,
    maxRetries: null,
    scope: 'target'
});
const DEFAULT_CIRCUIT_BREAKER = Object.freeze({
    failureThreshold: 3,
    cooldownMs: 30_000,
    halfOpenMaxAttempts: 1,
    successThreshold: 1,
    cooldownBackoffMultiplier: 1,
    maxCooldownMs: 300_000
});
const DEFAULT_ADAPTIVE_CONCURRENCY = Object.freeze({
    initialLimit: 4,
    minLimit: 1,
    maxLimit: 32,
    increaseStep: 1,
    decreaseMultiplier: 0.7,
    latencyHighWatermarkMs: null
});
const DEFAULT_DISPATCH_DEDUPLICATION = Object.freeze({
    windowMs: 5_000,
    openOnly: true,
    terminalWindowMs: 0,
    inFlightWindowMs: null,
    coalesceOpenUntilTerminal: false
});
const DEFAULT_TERMINAL_TASK_RETENTION = Object.freeze({
    maxAgeMs: 900_000,
    maxTasks: 2_000,
    sweepLimit: 200
});
const DEFAULT_QUEUE_CAPACITY = Object.freeze({
    maxOpenTasks: 2_000,
    maxOpenTasksPerTarget: 500,
    reservedOpenSlotsByPriority: Object.freeze({
        critical: 0,
        high: 0
    })
});
const DEFAULT_STALE_TASK_POLICY = Object.freeze({
    maxAgeMs: 300_000,
    terminalStatus: 'timed_out',
    propagateCancel: true
});
const DEFAULT_DRAIN_MODE = Object.freeze({
    rejectNewDispatches: true,
    forceCancelAfterMs: null,
    propagateCancel: true
});
const DEFAULT_MAINTENANCE_POLICY = Object.freeze({
    maxRetryDispatchesPerRun: null,
    fairRetryDispatchByTarget: false
});
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
const RETRYABLE_HTTP_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const RETRYABLE_GRPC_STATUS_CODES = new Set([4, 8, 14]);
const RETRYABLE_GRPC_STATUS_NAMES = new Set([
    'deadline_exceeded',
    'resource_exhausted',
    'unavailable'
]);
const RATE_LIMIT_RESET_KEY_PATTERN = String.raw`(?:x[-_\s]?ratelimit[-_\s]?reset(?:[-_\s]?(?:requests|tokens))?|ratelimit[-_\s]?reset(?:[-_\s]?(?:requests|tokens))?)`;
const RATE_LIMIT_RESET_KEY_VALUE_REGEX = new RegExp(
    `\\b${RATE_LIMIT_RESET_KEY_PATTERN}\\b\\s*[:=]?\\s*([^\\s;,]+)`,
    'gi'
);
const PRIORITY_LEVELS = Object.freeze(['low', 'normal', 'high', 'critical']);
const PRIORITY_RANK = Object.freeze(
    PRIORITY_LEVELS.reduce((acc, priority, index) => {
        acc[priority] = index;
        return acc;
    }, {})
);

function clone(value) {
    return JSON.parse(JSON.stringify(value));
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

function normalizeTaskPriority(value) {
    const normalized = typeof value === 'string'
        ? value.trim().toLowerCase()
        : '';
    return Object.prototype.hasOwnProperty.call(PRIORITY_RANK, normalized)
        ? normalized
        : 'normal';
}

function parseRateLimitResetDelayMs(rawValue, nowMs) {
    if (!Number.isFinite(rawValue) || rawValue < 0) {
        return null;
    }

    const numeric = Number(rawValue);
    // APIs vary: some send delta-seconds, others send absolute Unix timestamps.
    if (numeric >= 1_000_000_000_000) {
        return Math.max(0, Math.floor(numeric - nowMs));
    }
    if (numeric >= 1_000_000_000) {
        return Math.max(0, Math.floor((numeric * 1_000) - nowMs));
    }
    return Math.floor(numeric * 1_000);
}

function parseDurationLiteralMs(rawValue) {
    if (typeof rawValue !== 'string' || !rawValue.trim()) {
        return null;
    }

    const value = rawValue.trim().toLowerCase();
    let totalMs = 0;
    let matchCount = 0;
    let consumedLength = 0;
    const tokenRegex = /(\d+(?:\.\d+)?)(ms|s|m|h|d)/gi;
    let match = tokenRegex.exec(value);
    while (match) {
        const amount = Number(match[1]);
        const unit = match[2].toLowerCase();
        if (!Number.isFinite(amount) || amount < 0) {
            return null;
        }

        if (unit === 'ms') totalMs += amount;
        else if (unit === 's') totalMs += amount * 1_000;
        else if (unit === 'm') totalMs += amount * 60_000;
        else if (unit === 'h') totalMs += amount * 3_600_000;
        else if (unit === 'd') totalMs += amount * 86_400_000;

        matchCount += 1;
        consumedLength += match[0].length;
        match = tokenRegex.exec(value);
    }

    if (matchCount === 0) {
        return null;
    }

    const compactLength = value.replace(/\s+/g, '').length;
    if (consumedLength !== compactLength) {
        return null;
    }

    return Math.max(0, Math.floor(totalMs));
}

function parseRateLimitResetHintMs(rawValue, nowMs) {
    if (typeof rawValue !== 'string' || !rawValue.trim()) {
        return null;
    }

    const value = rawValue.trim();
    if (/^\d+(?:\.\d+)?$/.test(value)) {
        return parseRateLimitResetDelayMs(Number(value), nowMs);
    }

    const durationMs = parseDurationLiteralMs(value);
    if (durationMs !== null) {
        return durationMs;
    }

    const absolute = Date.parse(value);
    if (Number.isFinite(absolute)) {
        return Math.max(0, absolute - nowMs);
    }

    return null;
}

function stableSerialize(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
        return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
    }
    if (typeof value === 'object') {
        const entries = Object.entries(value)
            .filter(([, item]) => item !== undefined)
            .sort(([a], [b]) => a.localeCompare(b));
        return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`).join(',')}}`;
    }
    return JSON.stringify(value);
}

function parseRetryableStatusFromReason(reason) {
    if (typeof reason !== 'string' || !reason.trim()) {
        return {
            http: null,
            grpc: null
        };
    }

    const normalized = reason.toLowerCase();
    const statusCodeMatch = normalized.match(
        /\b(?:http(?:\/\d(?:\.\d)?)?(?:\s+status)?|http_status|status(?:_code)?)\b\s*[:=]?\s*(\d{3})\b/
    );
    const standaloneHttpCodeMatch = normalized.match(
        /\b(408|425|429|500|502|503|504)\b(?!\s*(?:ms|msec|milliseconds?|s|sec|seconds?)\b)/
    );
    const rawHttpCode = statusCodeMatch
        ? Number(statusCodeMatch[1])
        : standaloneHttpCodeMatch
            ? Number(standaloneHttpCodeMatch[1])
            : null;
    const httpCode = Number.isFinite(rawHttpCode) && RETRYABLE_HTTP_STATUS_CODES.has(rawHttpCode)
        ? rawHttpCode
        : null;

    const grpcNumericMatch = normalized.match(
        /\b(?:grpc[-_\s]?(?:status|code)|grpc_status|grpc_code)\b\s*[:=]?\s*(-?\d{1,2})\b/
    );
    if (grpcNumericMatch) {
        const grpcCode = Number(grpcNumericMatch[1]);
        return {
            http: httpCode,
            grpc: Number.isInteger(grpcCode) && RETRYABLE_GRPC_STATUS_CODES.has(grpcCode)
                ? grpcCode
                : null
        };
    }

    const grpcNameMatch = normalized.match(
        /\b(?:grpc[-_\s]?(?:status|code)|grpc_status|grpc_code)\b\s*[:=]?\s*([a-z_]+)\b/
    );
    if (!grpcNameMatch) {
        return {
            http: httpCode,
            grpc: null
        };
    }

    const grpcName = grpcNameMatch[1];
    return {
        http: httpCode,
        grpc: RETRYABLE_GRPC_STATUS_NAMES.has(grpcName)
            ? grpcName
            : null
    };
}

function resolveRetryThrottling(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_RETRY_THROTTLE
        };
    }

    const maxTokens = clampPositiveNumber(value.maxTokens, DEFAULT_RETRY_THROTTLE.maxTokens);
    const tokenRatio = clampPositiveNumber(value.tokenRatio, DEFAULT_RETRY_THROTTLE.tokenRatio);
    const retryCost = clampPositiveNumber(value.retryCost, DEFAULT_RETRY_THROTTLE.retryCost);
    const timeoutRetryCost = clampPositiveNumber(value.timeoutRetryCost, retryCost);
    const throttlingRetryCost = clampPositiveNumber(value.throttlingRetryCost, retryCost);
    const transportRetryCost = clampPositiveNumber(value.transportRetryCost, retryCost);
    const defaultThreshold = maxTokens / 2;
    let threshold = clampNonNegativeNumber(value.threshold, defaultThreshold);
    if (threshold >= maxTokens) {
        threshold = defaultThreshold;
    }
    const scope = value.scope === 'target' ? 'target' : 'global';

    return {
        enabled: true,
        maxTokens,
        tokenRatio,
        retryCost,
        timeoutRetryCost,
        throttlingRetryCost,
        transportRetryCost,
        threshold,
        scope
    };
}

function resolveRetryBudget(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_RETRY_BUDGET
        };
    }

    const ratio = Math.min(
        1,
        Math.max(0, clampNonNegativeNumber(value.ratio, DEFAULT_RETRY_BUDGET.ratio))
    );
    const minRetries = Math.max(
        0,
        Math.floor(clampNonNegativeNumber(value.minRetries, DEFAULT_RETRY_BUDGET.minRetries))
    );
    const maxRetriesRaw = value.maxRetries;
    const maxRetries = maxRetriesRaw === null || maxRetriesRaw === undefined
        ? null
        : Math.max(0, Math.floor(clampNonNegativeNumber(maxRetriesRaw, minRetries)));
    const scope = value.scope === 'global' ? 'global' : 'target';

    return {
        enabled: true,
        ratio,
        minRetries,
        maxRetries,
        scope
    };
}

function resolveCircuitBreaker(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_CIRCUIT_BREAKER
        };
    }

    return {
        enabled: true,
        failureThreshold: Math.max(
            1,
            Math.floor(clampPositiveNumber(value.failureThreshold, DEFAULT_CIRCUIT_BREAKER.failureThreshold))
        ),
        cooldownMs: Math.max(
            1,
            Math.floor(clampPositiveNumber(value.cooldownMs, DEFAULT_CIRCUIT_BREAKER.cooldownMs))
        ),
        halfOpenMaxAttempts: Math.max(
            1,
            Math.floor(clampPositiveNumber(value.halfOpenMaxAttempts, DEFAULT_CIRCUIT_BREAKER.halfOpenMaxAttempts))
        ),
        successThreshold: Math.max(
            1,
            Math.floor(clampPositiveNumber(value.successThreshold, DEFAULT_CIRCUIT_BREAKER.successThreshold))
        ),
        cooldownBackoffMultiplier: Math.max(
            1,
            clampPositiveNumber(value.cooldownBackoffMultiplier, DEFAULT_CIRCUIT_BREAKER.cooldownBackoffMultiplier)
        ),
        maxCooldownMs: Math.max(
            1,
            Math.floor(clampPositiveNumber(value.maxCooldownMs, DEFAULT_CIRCUIT_BREAKER.maxCooldownMs))
        )
    };
}

function resolveMaxRetryHintMs(maxRetryHintMs, fallbackMs) {
    if (maxRetryHintMs === null || maxRetryHintMs === undefined) {
        return null;
    }

    const value = Number(maxRetryHintMs);
    if (!Number.isFinite(value) || value < 0) {
        return Math.max(0, Math.floor(fallbackMs));
    }
    return Math.max(0, Math.floor(value));
}

function resolveAdaptiveConcurrency(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_ADAPTIVE_CONCURRENCY
        };
    }

    const minLimit = Math.max(
        1,
        Math.floor(clampPositiveNumber(value.minLimit, DEFAULT_ADAPTIVE_CONCURRENCY.minLimit))
    );
    const maxLimit = Math.max(
        minLimit,
        Math.floor(clampPositiveNumber(value.maxLimit, DEFAULT_ADAPTIVE_CONCURRENCY.maxLimit))
    );
    const initialLimit = Math.min(
        maxLimit,
        Math.max(
            minLimit,
            Math.floor(clampPositiveNumber(value.initialLimit, DEFAULT_ADAPTIVE_CONCURRENCY.initialLimit))
        )
    );
    const increaseStep = Math.max(
        1,
        Math.floor(clampPositiveNumber(value.increaseStep, DEFAULT_ADAPTIVE_CONCURRENCY.increaseStep))
    );
    const decreaseMultiplier = Math.min(
        1,
        Math.max(
            0.1,
            clampPositiveNumber(value.decreaseMultiplier, DEFAULT_ADAPTIVE_CONCURRENCY.decreaseMultiplier)
        )
    );
    const latencyHighWatermarkMs = value.latencyHighWatermarkMs === null || value.latencyHighWatermarkMs === undefined
        ? null
        : Math.max(0, Math.floor(clampNonNegativeNumber(
            value.latencyHighWatermarkMs,
            DEFAULT_ADAPTIVE_CONCURRENCY.latencyHighWatermarkMs
        )));

    return {
        enabled: true,
        initialLimit,
        minLimit,
        maxLimit,
        increaseStep,
        decreaseMultiplier,
        latencyHighWatermarkMs
    };
}

function resolveDispatchDeduplication(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_DISPATCH_DEDUPLICATION,
            fingerprint: null
        };
    }

    return {
        enabled: true,
        windowMs: Math.max(
            0,
            Math.floor(clampNonNegativeNumber(value.windowMs, DEFAULT_DISPATCH_DEDUPLICATION.windowMs))
        ),
        openOnly: value.openOnly !== false,
        terminalWindowMs: Math.max(
            0,
            Math.floor(clampNonNegativeNumber(
                value.terminalWindowMs,
                DEFAULT_DISPATCH_DEDUPLICATION.terminalWindowMs
            ))
        ),
        inFlightWindowMs: value.inFlightWindowMs === null || value.inFlightWindowMs === undefined
            ? DEFAULT_DISPATCH_DEDUPLICATION.inFlightWindowMs
            : Math.max(
                0,
                Math.floor(clampNonNegativeNumber(
                    value.inFlightWindowMs,
                    DEFAULT_DISPATCH_DEDUPLICATION.windowMs
                ))
            ),
        coalesceOpenUntilTerminal: value.coalesceOpenUntilTerminal === true,
        fingerprint: typeof value.fingerprint === 'function' ? value.fingerprint : null
    };
}

function resolveTerminalTaskRetention(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_TERMINAL_TASK_RETENTION
        };
    }

    const maxAgeMsRaw = value.maxAgeMs;
    const maxTasksRaw = value.maxTasks;
    const maxAgeMs = maxAgeMsRaw === null || maxAgeMsRaw === undefined
        ? null
        : Math.max(0, Math.floor(clampNonNegativeNumber(maxAgeMsRaw, DEFAULT_TERMINAL_TASK_RETENTION.maxAgeMs)));
    const maxTasks = maxTasksRaw === null || maxTasksRaw === undefined
        ? null
        : Math.max(1, Math.floor(clampPositiveNumber(maxTasksRaw, DEFAULT_TERMINAL_TASK_RETENTION.maxTasks)));
    const sweepLimit = Math.max(
        1,
        Math.floor(clampPositiveNumber(value.sweepLimit, DEFAULT_TERMINAL_TASK_RETENTION.sweepLimit))
    );

    return {
        enabled: maxAgeMs !== null || maxTasks !== null,
        maxAgeMs,
        maxTasks,
        sweepLimit
    };
}

function resolveQueueCapacity(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_QUEUE_CAPACITY,
            maxOpenTasks: null,
            maxOpenTasksPerTarget: null,
            reservedOpenSlotsByPriority: clone(DEFAULT_QUEUE_CAPACITY.reservedOpenSlotsByPriority)
        };
    }

    const maxOpenTasksRaw = value.maxOpenTasks;
    const maxOpenTasksPerTargetRaw = value.maxOpenTasksPerTarget;
    const maxOpenTasks = maxOpenTasksRaw === null || maxOpenTasksRaw === undefined
        ? null
        : Math.max(1, Math.floor(clampPositiveNumber(maxOpenTasksRaw, DEFAULT_QUEUE_CAPACITY.maxOpenTasks)));
    const maxOpenTasksPerTarget = maxOpenTasksPerTargetRaw === null || maxOpenTasksPerTargetRaw === undefined
        ? null
        : Math.max(
            1,
            Math.floor(
                clampPositiveNumber(
                    maxOpenTasksPerTargetRaw,
                    DEFAULT_QUEUE_CAPACITY.maxOpenTasksPerTarget
                )
            )
        );
    const reservedOpenSlotsByPriority = clone(DEFAULT_QUEUE_CAPACITY.reservedOpenSlotsByPriority);
    if (value.reservedOpenSlotsByPriority && typeof value.reservedOpenSlotsByPriority === 'object') {
        for (const [priority, rawSlots] of Object.entries(value.reservedOpenSlotsByPriority)) {
            const normalized = normalizeTaskPriority(priority);
            if (!['high', 'critical'].includes(normalized)) continue;
            const slots = Math.max(0, Math.floor(clampNonNegativeNumber(rawSlots, 0)));
            reservedOpenSlotsByPriority[normalized] = slots;
        }
    }
    const hasPriorityReservation = Object.values(reservedOpenSlotsByPriority)
        .some((slots) => Number(slots) > 0);

    return {
        enabled: maxOpenTasks !== null || maxOpenTasksPerTarget !== null || hasPriorityReservation,
        maxOpenTasks,
        maxOpenTasksPerTarget,
        reservedOpenSlotsByPriority
    };
}

function resolveStaleTaskPolicy(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_STALE_TASK_POLICY,
            maxAgeMs: null
        };
    }

    const maxAgeMsRaw = value.maxAgeMs;
    const maxAgeMs = maxAgeMsRaw === null || maxAgeMsRaw === undefined
        ? null
        : Math.max(1, Math.floor(clampPositiveNumber(maxAgeMsRaw, DEFAULT_STALE_TASK_POLICY.maxAgeMs)));
    const terminalStatus = value.terminalStatus === 'cancelled'
        ? 'cancelled'
        : 'timed_out';
    const propagateCancel = value.propagateCancel !== false;

    return {
        enabled: maxAgeMs !== null,
        maxAgeMs,
        terminalStatus,
        propagateCancel
    };
}

function resolveDrainMode(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            initiatedAt: null,
            reason: null,
            ...DEFAULT_DRAIN_MODE
        };
    }

    const forceCancelAfterMs = Number.isFinite(Number(value.forceCancelAfterMs))
        && Number(value.forceCancelAfterMs) > 0
        ? Number(value.forceCancelAfterMs)
        : null;

    return {
        enabled: value.enabled === true,
        initiatedAt: Number.isFinite(Number(value.initiatedAt))
            ? Number(value.initiatedAt)
            : null,
        reason: typeof value.reason === 'string' && value.reason.trim()
            ? value.reason.trim()
            : null,
        rejectNewDispatches: value.rejectNewDispatches !== false,
        forceCancelAfterMs,
        propagateCancel: value.propagateCancel !== false
    };
}

function resolveMaintenancePolicy(value) {
    if (!value || typeof value !== 'object') {
        return {
            enabled: false,
            ...DEFAULT_MAINTENANCE_POLICY
        };
    }

    const maxRetryDispatchesPerRunRaw = value.maxRetryDispatchesPerRun;
    const maxRetryDispatchesPerRun = maxRetryDispatchesPerRunRaw === null
        || maxRetryDispatchesPerRunRaw === undefined
        ? null
        : Math.max(
            1,
            Math.floor(
                clampPositiveNumber(
                    maxRetryDispatchesPerRunRaw,
                    Number.MAX_SAFE_INTEGER
                )
            )
        );
    const fairRetryDispatchByTarget = value.fairRetryDispatchByTarget === true;

    return {
        enabled: maxRetryDispatchesPerRun !== null || fairRetryDispatchByTarget,
        maxRetryDispatchesPerRun,
        fairRetryDispatchByTarget
    };
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
        overallTimeoutMs = null,
        retryThrottling = null,
        retryBudget = null,
        circuitBreaker = null,
        adaptiveConcurrency = null,
        dispatchDeduplication = null,
        terminalTaskRetention = null,
        queueCapacity = null,
        staleTaskPolicy = null,
        drainMode = null,
        maintenancePolicy = null,
        transportSendTimeoutMs = 10_000,
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
        this.maxRetryHintMs = resolveMaxRetryHintMs(maxRetryHintMs, this.maxRetryDelayMs);
        this.overallTimeoutMs = Number.isFinite(overallTimeoutMs) && Number(overallTimeoutMs) > 0
            ? Number(overallTimeoutMs)
            : null;
        this.retryThrottling = resolveRetryThrottling(retryThrottling);
        this.retryBudget = resolveRetryBudget(retryBudget);
        this.retryThrottleTokens = this.retryThrottling.enabled && this.retryThrottling.scope === 'global'
            ? this.retryThrottling.maxTokens
            : null;
        this.retryThrottleTokensByTarget = this.retryThrottling.enabled && this.retryThrottling.scope === 'target'
            ? new Map()
            : null;
        this.circuitBreaker = resolveCircuitBreaker(circuitBreaker);
        this.circuitBreakerStateByTarget = this.circuitBreaker.enabled
            ? new Map()
            : null;
        this.adaptiveConcurrency = resolveAdaptiveConcurrency(adaptiveConcurrency);
        this.adaptiveConcurrencyByTarget = this.adaptiveConcurrency.enabled
            ? new Map()
            : null;
        this.dispatchDeduplication = resolveDispatchDeduplication(dispatchDeduplication);
        this.terminalTaskRetention = resolveTerminalTaskRetention(terminalTaskRetention);
        this.queueCapacity = resolveQueueCapacity(queueCapacity);
        this.staleTaskPolicy = resolveStaleTaskPolicy(staleTaskPolicy);
        this.drainMode = resolveDrainMode(drainMode);
        this.maintenancePolicy = resolveMaintenancePolicy(maintenancePolicy);
        this.terminalTasksPruned = 0;
        this.transportSendTimeoutMs = Number.isFinite(transportSendTimeoutMs) && Number(transportSendTimeoutMs) > 0
            ? Number(transportSendTimeoutMs)
            : null;
        this.random = typeof random === 'function' ? random : Math.random;
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.tasks = new Map();
        this._persistenceQueue = Promise.resolve();
    }

    _resolveOverallDeadlineAt(createdAt) {
        if (!Number.isFinite(this.overallTimeoutMs) || this.overallTimeoutMs === null) {
            return null;
        }
        return createdAt + this.overallTimeoutMs;
    }

    _applyOverallDeadline(record, deadlineAt) {
        if (!Number.isFinite(record?.overallDeadlineAt)) {
            return deadlineAt;
        }
        return Math.min(deadlineAt, Number(record.overallDeadlineAt));
    }

    _remainingOverallDeadlineMs(record, nowMs) {
        if (!Number.isFinite(record?.overallDeadlineAt)) {
            return null;
        }
        return Number(record.overallDeadlineAt) - nowMs;
    }

    _isOverallDeadlineExceeded(record, nowMs) {
        const remainingMs = this._remainingOverallDeadlineMs(record, nowMs);
        return Number.isFinite(remainingMs) && remainingMs < 0;
    }

    _markTimedOut(record, nowMs, {
        event = 'timed_out',
        reason = null
    } = {}) {
        this._releaseAdaptiveConcurrencySlot(record, nowMs, 'overload');
        record.status = 'timed_out';
        record.updatedAt = nowMs;
        record.closedAt = nowMs;
        record.history.push({
            at: nowMs,
            event,
            reason
        });
        this._persistRecord(record);
        this._emitAudit('task_timed_out', {
            taskId: record.taskId,
            target: record.target,
            attempts: record.attempts,
            reason
        }, nowMs);
    }

    _resolveCircuitTarget(target) {
        if (typeof target !== 'string' || !target.trim()) {
            return '__unknown_target__';
        }
        return target.trim();
    }

    _getCircuitState(target, { create = true } = {}) {
        if (!this.circuitBreaker.enabled || !this.circuitBreakerStateByTarget) {
            return null;
        }

        const key = this._resolveCircuitTarget(target);
        if (this.circuitBreakerStateByTarget.has(key)) {
            return this.circuitBreakerStateByTarget.get(key);
        }

        if (!create) {
            return null;
        }

        const state = {
            target: key,
            status: 'closed',
            consecutiveFailures: 0,
            consecutiveSuccesses: 0,
            openedAt: null,
            openUntil: null,
            halfOpenAttempts: 0,
            currentCooldownMs: this.circuitBreaker.cooldownMs
        };
        this.circuitBreakerStateByTarget.set(key, state);
        return state;
    }

    _openCircuit(target, nowMs, reason, { increaseCooldown = false } = {}) {
        const state = this._getCircuitState(target);
        if (!state) return;

        const baselineCooldownMs = this.circuitBreaker.cooldownMs;
        let cooldownMs = clampPositiveNumber(state.currentCooldownMs, baselineCooldownMs);
        if (increaseCooldown && this.circuitBreaker.cooldownBackoffMultiplier > 1) {
            cooldownMs = Math.min(
                this.circuitBreaker.maxCooldownMs,
                Math.max(
                    baselineCooldownMs,
                    Math.floor(cooldownMs * this.circuitBreaker.cooldownBackoffMultiplier)
                )
            );
        }

        state.status = 'open';
        state.currentCooldownMs = cooldownMs;
        state.openedAt = nowMs;
        state.openUntil = nowMs + cooldownMs;
        state.consecutiveSuccesses = 0;
        state.halfOpenAttempts = 0;
        this._emitAudit('target_circuit_opened', {
            target: state.target,
            reason,
            openUntil: state.openUntil,
            failureThreshold: this.circuitBreaker.failureThreshold,
            cooldownMs
        }, nowMs);
    }

    _closeCircuit(target, nowMs, reason) {
        const state = this._getCircuitState(target);
        if (!state) return;

        const previousStatus = state.status;
        state.status = 'closed';
        state.consecutiveFailures = 0;
        state.consecutiveSuccesses = 0;
        state.openedAt = null;
        state.openUntil = null;
        state.halfOpenAttempts = 0;
        state.currentCooldownMs = this.circuitBreaker.cooldownMs;

        if (previousStatus !== 'closed') {
            this._emitAudit('target_circuit_closed', {
                target: state.target,
                reason
            }, nowMs);
        }
    }

    _onCircuitSendFailure(target, nowMs, reason) {
        const state = this._getCircuitState(target);
        if (!state) return;

        if (state.status === 'half_open') {
            state.consecutiveFailures += 1;
            this._openCircuit(target, nowMs, `half_open_failure:${reason}`, {
                increaseCooldown: true
            });
            return;
        }

        state.consecutiveFailures += 1;
        state.consecutiveSuccesses = 0;
        if (state.consecutiveFailures >= this.circuitBreaker.failureThreshold) {
            this._openCircuit(target, nowMs, reason);
        }
    }

    _onCircuitSendSuccess(target, nowMs, reason) {
        const state = this._getCircuitState(target);
        if (!state) return;

        if (state.status === 'half_open') {
            state.consecutiveSuccesses += 1;
            if (state.consecutiveSuccesses >= this.circuitBreaker.successThreshold) {
                this._closeCircuit(target, nowMs, reason);
            }
            return;
        }

        if (state.status === 'closed') {
            state.consecutiveFailures = 0;
        }
    }

    _ensureCircuitCanSend(target, nowMs) {
        if (!this.circuitBreaker.enabled) {
            return { allowed: true, retryAfterMs: null };
        }

        const state = this._getCircuitState(target);
        if (!state || state.status === 'closed') {
            return { allowed: true, retryAfterMs: null };
        }

        if (state.status === 'open') {
            const openUntil = Number(state.openUntil);
            if (Number.isFinite(openUntil) && nowMs < openUntil) {
                return {
                    allowed: false,
                    retryAfterMs: Math.max(0, openUntil - nowMs)
                };
            }

            state.status = 'half_open';
            state.consecutiveSuccesses = 0;
            state.halfOpenAttempts = 0;
            this._emitAudit('target_circuit_half_open', {
                target: state.target,
                cooldownMs: this.circuitBreaker.cooldownMs
            }, nowMs);
        }

        if (state.status === 'half_open') {
            if (state.halfOpenAttempts >= this.circuitBreaker.halfOpenMaxAttempts) {
                this._openCircuit(target, nowMs, 'half_open_probe_budget_exhausted', {
                    increaseCooldown: true
                });
                return {
                    allowed: false,
                    retryAfterMs: Math.max(
                        1,
                        Math.floor(clampPositiveNumber(state.currentCooldownMs, this.retryDelayMs))
                    )
                };
            }
            state.halfOpenAttempts += 1;
        }

        return { allowed: true, retryAfterMs: null };
    }

    _getAdaptiveConcurrencyState(target, { create = true } = {}) {
        if (!this.adaptiveConcurrency.enabled || !this.adaptiveConcurrencyByTarget) {
            return null;
        }

        const key = this._resolveCircuitTarget(target);
        if (this.adaptiveConcurrencyByTarget.has(key)) {
            return this.adaptiveConcurrencyByTarget.get(key);
        }

        if (!create) {
            return null;
        }

        const state = {
            target: key,
            inFlight: 0,
            limit: this.adaptiveConcurrency.initialLimit,
            blockedCount: 0,
            limitIncreaseCount: 0,
            limitDecreaseCount: 0
        };
        this.adaptiveConcurrencyByTarget.set(key, state);
        return state;
    }

    _recordAdaptiveLimitChange(state, nowMs, reason, previousLimit) {
        if (!state || previousLimit === state.limit) return;
        this._emitAudit('adaptive_concurrency_limit_updated', {
            target: state.target,
            reason,
            previousLimit,
            nextLimit: state.limit,
            inFlight: state.inFlight
        }, nowMs);
    }

    _acquireAdaptiveConcurrencySlot(record, nowMs) {
        if (!this.adaptiveConcurrency.enabled) {
            return { allowed: true, retryAfterMs: null };
        }

        if (record.adaptiveConcurrency?.acquired === true) {
            return { allowed: true, retryAfterMs: null };
        }

        const state = this._getAdaptiveConcurrencyState(record.target);
        if (!state) {
            return { allowed: true, retryAfterMs: null };
        }

        if (state.inFlight >= state.limit) {
            state.blockedCount += 1;
            this._emitAudit('task_send_deferred_adaptive_concurrency', {
                taskId: record.taskId,
                target: state.target,
                inFlight: state.inFlight,
                limit: state.limit
            }, nowMs);
            return {
                allowed: false,
                retryAfterMs: this.retryDelayMs
            };
        }

        state.inFlight += 1;
        record.adaptiveConcurrency = {
            acquired: true,
            target: state.target,
            acquiredAt: nowMs
        };
        return { allowed: true, retryAfterMs: null };
    }

    _releaseAdaptiveConcurrencySlot(record, nowMs, outcome = 'neutral') {
        if (!this.adaptiveConcurrency.enabled || !record?.adaptiveConcurrency?.acquired) {
            return;
        }

        const target = record.adaptiveConcurrency.target || record.target;
        const state = this._getAdaptiveConcurrencyState(target, { create: false });
        if (!state) {
            record.adaptiveConcurrency = null;
            return;
        }

        state.inFlight = Math.max(0, state.inFlight - 1);
        const acquiredAt = Number(record.adaptiveConcurrency.acquiredAt);
        const latencyMs = Number.isFinite(acquiredAt)
            ? Math.max(0, nowMs - acquiredAt)
            : null;
        const latencyThreshold = this.adaptiveConcurrency.latencyHighWatermarkMs;
        const isSlow = Number.isFinite(latencyThreshold)
            && Number.isFinite(latencyMs)
            && latencyMs > latencyThreshold;

        const previousLimit = state.limit;
        if (outcome === 'healthy' && !isSlow) {
            state.limit = Math.min(
                this.adaptiveConcurrency.maxLimit,
                state.limit + this.adaptiveConcurrency.increaseStep
            );
            if (state.limit > previousLimit) {
                state.limitIncreaseCount += 1;
                this._recordAdaptiveLimitChange(state, nowMs, 'healthy_completion', previousLimit);
            }
        } else if (outcome === 'overload' || isSlow) {
            state.limit = Math.max(
                this.adaptiveConcurrency.minLimit,
                Math.floor(state.limit * this.adaptiveConcurrency.decreaseMultiplier)
            );
            if (state.limit < previousLimit) {
                state.limitDecreaseCount += 1;
                this._recordAdaptiveLimitChange(
                    state,
                    nowMs,
                    isSlow ? 'high_latency' : 'overload_signal',
                    previousLimit
                );
            }
        }

        record.adaptiveConcurrency = null;
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
        }

        let applied = 0;
        for (const record of loaded) {
            if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') {
                continue;
            }
            this.tasks.set(record.taskId, clone(record));
            applied++;
        }

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

    _buildDeduplicationFingerprint(request) {
        if (this.dispatchDeduplication.fingerprint) {
            try {
                const customFingerprint = this.dispatchDeduplication.fingerprint(clone(request));
                if (typeof customFingerprint === 'string' && customFingerprint.trim()) {
                    return customFingerprint.trim();
                }
            } catch (error) {
                this.logger.warn?.(
                    `[Swarm] dispatchDeduplication fingerprint() failed: ${error.message}`
                );
            }
        }

        return [
            request.target,
            request.task,
            request.priority,
            stableSerialize(request.context ?? null),
            stableSerialize(request.constraints ?? null)
        ].join('|');
    }

    _findDuplicateRecord(request, nowMs) {
        if (!this.dispatchDeduplication.enabled) return null;

        const windowMs = this.dispatchDeduplication.windowMs;
        const terminalWindowMs = this.dispatchDeduplication.terminalWindowMs;
        const inFlightWindowMs = this.dispatchDeduplication.inFlightWindowMs;
        const coalesceOpenUntilTerminal = this.dispatchDeduplication.coalesceOpenUntilTerminal;
        const fingerprint = this._buildDeduplicationFingerprint(request);

        for (const record of this.tasks.values()) {
            const isTerminal = TERMINAL_STATUSES.has(record.status);
            if (isTerminal) {
                if (!TERMINAL_REPLAY_STATUSES.has(record.status)) {
                    continue;
                }
                if (terminalWindowMs <= 0) {
                    if (this.dispatchDeduplication.openOnly) {
                        continue;
                    }
                    if (windowMs > 0 && nowMs - Number(record.createdAt) > windowMs) {
                        continue;
                    }
                } else {
                    const terminalAt = Number.isFinite(Number(record.closedAt))
                        ? Number(record.closedAt)
                        : Number.isFinite(Number(record.updatedAt))
                            ? Number(record.updatedAt)
                            : Number(record.createdAt);
                    if (terminalAt > nowMs || nowMs - terminalAt > terminalWindowMs) {
                        continue;
                    }
                }
            } else {
                // Optional "singleflight" mode: coalesce duplicates for open tasks until terminal.
                // inFlightWindowMs then acts as a lock-age escape hatch for very long/stuck runs.
                if (coalesceOpenUntilTerminal) {
                    if (Number.isFinite(inFlightWindowMs) && inFlightWindowMs > 0) {
                        if (nowMs - Number(record.createdAt) > Number(inFlightWindowMs)) {
                            continue;
                        }
                    }
                } else {
                    const openWindowMs = Number.isFinite(inFlightWindowMs)
                        ? Number(inFlightWindowMs)
                        : windowMs;
                    if (openWindowMs > 0 && nowMs - Number(record.createdAt) > openWindowMs) {
                        continue;
                    }
                }
            }

            if (this._buildDeduplicationFingerprint(record.request) !== fingerprint) {
                continue;
            }
            return record;
        }
        return null;
    }

    _countOpenTasks(target = null) {
        let count = 0;
        for (const record of this.tasks.values()) {
            if (TERMINAL_STATUSES.has(record.status)) continue;
            if (target && record.target !== target) continue;
            count += 1;
        }
        return count;
    }

    _reservedHigherPrioritySlots(requestPriority) {
        const normalizedPriority = normalizeTaskPriority(requestPriority);
        const requestRank = PRIORITY_RANK[normalizedPriority];
        let reserved = 0;
        for (const [priority, slots] of Object.entries(this.queueCapacity.reservedOpenSlotsByPriority || {})) {
            const priorityRank = PRIORITY_RANK[normalizeTaskPriority(priority)];
            if (priorityRank <= requestRank) continue;
            const numericSlots = Number(slots);
            if (!Number.isFinite(numericSlots) || numericSlots <= 0) continue;
            reserved += Math.floor(numericSlots);
        }
        return Math.max(0, reserved);
    }

    _assertQueueCapacity(target, nowMs, priority = 'normal') {
        if (!this.queueCapacity.enabled) return;

        const maxOpenTasks = this.queueCapacity.maxOpenTasks;
        if (Number.isFinite(maxOpenTasks)) {
            const openTotal = this._countOpenTasks();
            const reservedForHigherPriority = this._reservedHigherPrioritySlots(priority);
            const effectiveCapacity = Math.max(
                0,
                Number(maxOpenTasks) - reservedForHigherPriority
            );
            if (openTotal >= effectiveCapacity) {
                const rejectionScope = reservedForHigherPriority > 0
                    ? 'global_priority_reservation'
                    : 'global';
                this._emitAudit('task_capacity_rejected', {
                    target,
                    priority: normalizeTaskPriority(priority),
                    scope: rejectionScope,
                    openTasks: openTotal,
                    maxOpenTasks: Number(maxOpenTasks),
                    effectiveMaxOpenTasks: effectiveCapacity,
                    reservedForHigherPriority
                }, nowMs);
                throw new TaskOrchestratorError(
                    'CAPACITY_EXCEEDED',
                    `Open task capacity exceeded (${openTotal}/${effectiveCapacity})`,
                    {
                        target,
                        priority: normalizeTaskPriority(priority),
                        scope: rejectionScope,
                        openTasks: openTotal,
                        maxOpenTasks: Number(maxOpenTasks),
                        effectiveMaxOpenTasks: effectiveCapacity,
                        reservedForHigherPriority
                    }
                );
            }
        }

        const maxOpenTasksPerTarget = this.queueCapacity.maxOpenTasksPerTarget;
        if (Number.isFinite(maxOpenTasksPerTarget)) {
            const openForTarget = this._countOpenTasks(target);
            if (openForTarget >= Number(maxOpenTasksPerTarget)) {
                this._emitAudit('task_capacity_rejected', {
                    target,
                    scope: 'target',
                    openTasks: openForTarget,
                    maxOpenTasksPerTarget: Number(maxOpenTasksPerTarget)
                }, nowMs);
                throw new TaskOrchestratorError(
                    'CAPACITY_EXCEEDED',
                    `Open task capacity exceeded for target ${target} (${openForTarget}/${Number(maxOpenTasksPerTarget)})`,
                    {
                        target,
                        scope: 'target',
                        openTasks: openForTarget,
                        maxOpenTasksPerTarget: Number(maxOpenTasksPerTarget)
                    }
                );
            }
        }
    }

    _assertDispatchAdmission(request, nowMs) {
        if (!this.drainMode.enabled || !this.drainMode.rejectNewDispatches) {
            return;
        }

        this._emitAudit('task_dispatch_rejected_drain_mode', {
            target: request?.target ?? null,
            priority: normalizeTaskPriority(request?.priority),
            reason: this.drainMode.reason
        }, nowMs);

        throw new TaskOrchestratorError(
            'DRAINING',
            'Orchestrator is draining and is not accepting new task dispatches',
            {
                initiatedAt: this.drainMode.initiatedAt,
                reason: this.drainMode.reason,
                rejectNewDispatches: this.drainMode.rejectNewDispatches
            }
        );
    }

    _resolveTerminalTimestamp(record) {
        if (Number.isFinite(Number(record?.closedAt))) {
            return Number(record.closedAt);
        }
        if (Number.isFinite(Number(record?.updatedAt))) {
            return Number(record.updatedAt);
        }
        if (Number.isFinite(Number(record?.createdAt))) {
            return Number(record.createdAt);
        }
        return 0;
    }

    _isTaskPastStaleAge(record, nowMs) {
        if (!this.staleTaskPolicy.enabled || !Number.isFinite(this.staleTaskPolicy.maxAgeMs)) {
            return false;
        }
        const createdAt = Number(record?.createdAt);
        if (!Number.isFinite(createdAt)) {
            return false;
        }
        return (nowMs - createdAt) > Number(this.staleTaskPolicy.maxAgeMs);
    }

    _shouldForceCancelInDrain(record, nowMs) {
        if (TERMINAL_STATUSES.has(record?.status)) {
            return false;
        }
        if (!this.drainMode.enabled || !Number.isFinite(this.drainMode.forceCancelAfterMs)) {
            return false;
        }
        const initiatedAt = Number(this.drainMode.initiatedAt);
        if (!Number.isFinite(initiatedAt)) {
            return false;
        }
        return nowMs >= (initiatedAt + Number(this.drainMode.forceCancelAfterMs));
    }

    async _forceCancelForDrain(record, nowMs) {
        const cancelled = await this.cancelTask(record.taskId, {
            reason: 'drain_grace_timeout_exceeded',
            cancelledBy: 'orchestrator:drain-mode',
            timestamp: nowMs,
            propagate: this.drainMode.propagateCancel
        });
        if (!cancelled) {
            return false;
        }
        this._emitAudit('task_drain_force_cancelled', {
            taskId: record.taskId,
            target: record.target,
            initiatedAt: this.drainMode.initiatedAt,
            forceCancelAfterMs: this.drainMode.forceCancelAfterMs
        }, nowMs);
        return true;
    }

    async _expireStaleTask(record, nowMs) {
        const ageMs = Math.max(0, nowMs - Number(record.createdAt || nowMs));
        const reason = 'stale_task_max_age_exceeded';
        if (this.staleTaskPolicy.terminalStatus === 'cancelled') {
            const cancelled = await this.cancelTask(record.taskId, {
                reason,
                cancelledBy: 'orchestrator:stale-task-policy',
                timestamp: nowMs,
                propagate: this.staleTaskPolicy.propagateCancel
            });
            if (!cancelled) {
                return false;
            }
            this._emitAudit('task_stale_expired', {
                taskId: record.taskId,
                target: record.target,
                terminalStatus: 'cancelled',
                ageMs,
                maxAgeMs: this.staleTaskPolicy.maxAgeMs
            }, nowMs);
            return true;
        }

        this._markTimedOut(record, nowMs, {
            event: 'timed_out_stale_task',
            reason
        });
        this._emitAudit('task_stale_expired', {
            taskId: record.taskId,
            target: record.target,
            terminalStatus: 'timed_out',
            ageMs,
            maxAgeMs: this.staleTaskPolicy.maxAgeMs
        }, nowMs);
        return true;
    }

    _pruneTerminalTasks(nowMs = safeNow(this.now), reason = 'maintenance') {
        if (!this.terminalTaskRetention.enabled) {
            return 0;
        }

        const pruneCandidates = [];
        for (const record of this.tasks.values()) {
            if (!TERMINAL_STATUSES.has(record.status)) continue;
            pruneCandidates.push({
                taskId: record.taskId,
                terminalAt: this._resolveTerminalTimestamp(record)
            });
        }

        if (pruneCandidates.length === 0) {
            return 0;
        }

        pruneCandidates.sort((a, b) => a.terminalAt - b.terminalAt);
        const maxAgeMs = this.terminalTaskRetention.maxAgeMs;
        const maxTasks = this.terminalTaskRetention.maxTasks;
        const pruneIds = new Set();

        if (Number.isFinite(maxAgeMs)) {
            const cutoff = nowMs - Number(maxAgeMs);
            for (const candidate of pruneCandidates) {
                if (candidate.terminalAt <= cutoff) {
                    pruneIds.add(candidate.taskId);
                }
            }
        }

        if (Number.isFinite(maxTasks) && pruneCandidates.length - pruneIds.size > Number(maxTasks)) {
            const overflow = (pruneCandidates.length - pruneIds.size) - Number(maxTasks);
            let overflowPruned = 0;
            for (const candidate of pruneCandidates) {
                if (pruneIds.has(candidate.taskId)) continue;
                pruneIds.add(candidate.taskId);
                overflowPruned += 1;
                if (overflowPruned >= overflow) break;
            }
        }

        if (pruneIds.size === 0) {
            return 0;
        }

        const limit = Math.max(1, Math.floor(this.terminalTaskRetention.sweepLimit));
        const toPrune = Array.from(pruneIds).slice(0, limit);
        for (const taskId of toPrune) {
            const record = this.tasks.get(taskId);
            this.tasks.delete(taskId);
            this._deleteRecord(taskId);
            this.terminalTasksPruned += 1;
            if (record) {
                this._emitAudit('task_terminal_pruned', {
                    taskId,
                    target: record.target,
                    status: record.status,
                    reason
                }, nowMs);
            }
        }
        return toPrune.length;
    }

    _selectRetryDispatchTasksForMaintenance(nowMs) {
        const dueRetryRecords = [];
        for (const record of this.tasks.values()) {
            if (record.status !== 'retry_scheduled') continue;
            if (!Number.isFinite(record.nextRetryAt) || nowMs < record.nextRetryAt) continue;
            dueRetryRecords.push(record);
        }

        if (dueRetryRecords.length === 0) {
            return null;
        }

        const limit = Number.isFinite(this.maintenancePolicy.maxRetryDispatchesPerRun)
            ? Math.floor(this.maintenancePolicy.maxRetryDispatchesPerRun)
            : dueRetryRecords.length;
        const normalizedLimit = Math.max(0, limit);
        if (dueRetryRecords.length <= normalizedLimit) {
            return null;
        }

        const compareRecords = (a, b) => {
            const priorityDelta = PRIORITY_RANK[normalizeTaskPriority(b.request?.priority)]
                - PRIORITY_RANK[normalizeTaskPriority(a.request?.priority)];
            if (priorityDelta !== 0) return priorityDelta;

            const nextRetryDelta = Number(a.nextRetryAt) - Number(b.nextRetryAt);
            if (nextRetryDelta !== 0) return nextRetryDelta;

            return Number(a.createdAt) - Number(b.createdAt);
        };

        if (!this.maintenancePolicy.fairRetryDispatchByTarget) {
            dueRetryRecords.sort(compareRecords);
            return new Set(
                dueRetryRecords
                    .slice(0, normalizedLimit)
                    .map((record) => record.taskId)
            );
        }

        const groups = new Map();
        for (const record of dueRetryRecords) {
            const targetKey = this._resolveCircuitTarget(record.target);
            if (!groups.has(targetKey)) {
                groups.set(targetKey, []);
            }
            groups.get(targetKey).push(record);
        }
        for (const records of groups.values()) {
            records.sort(compareRecords);
        }

        const selectedTaskIds = new Set();
        let targetOrder = Array.from(groups.keys());
        while (selectedTaskIds.size < normalizedLimit && targetOrder.length > 0) {
            targetOrder.sort((left, right) => {
                const leftHead = groups.get(left)?.[0] || null;
                const rightHead = groups.get(right)?.[0] || null;
                if (!leftHead && !rightHead) return 0;
                if (!leftHead) return 1;
                if (!rightHead) return -1;
                return compareRecords(leftHead, rightHead);
            });

            const nextRound = [];
            for (const targetKey of targetOrder) {
                if (selectedTaskIds.size >= normalizedLimit) break;
                const bucket = groups.get(targetKey);
                if (!bucket || bucket.length === 0) {
                    continue;
                }
                const nextRecord = bucket.shift();
                if (!nextRecord) {
                    continue;
                }
                selectedTaskIds.add(nextRecord.taskId);
                if (bucket.length > 0) {
                    nextRound.push(targetKey);
                }
            }
            targetOrder = nextRound;
        }

        return selectedTaskIds;
    }

    _parseRetryDirectiveFromReason(reason) {
        const output = {
            hintMs: null,
            noRetryPushback: false
        };

        if (typeof reason !== 'string' || !reason.trim()) {
            return output;
        }

        const grpcPushbackMatch = reason.match(
            /\bgrpc[-_\s]?retry[-_\s]?pushback[-_\s]?ms\b\s*[:=]?\s*(-?\d{1,10})\b/i
        );
        if (grpcPushbackMatch) {
            const pushbackMs = Number(grpcPushbackMatch[1]);
            if (Number.isFinite(pushbackMs)) {
                if (pushbackMs < 0) {
                    return {
                        hintMs: null,
                        noRetryPushback: true
                    };
                }
                return {
                    hintMs: pushbackMs,
                    noRetryPushback: false
                };
            }
        }

        const nowMs = safeNow(this.now);
        const retryHints = [];

        const retryAfterMsMatch = reason.match(
            /\b(?:retry[-_\s]?after[-_\s]?ms|x[-_\s]?ms[-_\s]?retry[-_\s]?after[-_\s]?ms)\b\s*[:=]?\s*(\d{1,16})\b/i
        );
        if (retryAfterMsMatch) {
            const retryAfterMs = Number(retryAfterMsMatch[1]);
            if (Number.isFinite(retryAfterMs) && retryAfterMs >= 0) {
                retryHints.push(retryAfterMs);
            }
        }

        const retryAfterMatch = reason.match(
            /\bretry[-_\s]?after\b\s*[:=]?\s*(\d{1,10})\b/i
        );
        if (retryAfterMatch) {
            const seconds = Number(retryAfterMatch[1]);
            if (Number.isFinite(seconds) && seconds >= 0) {
                retryHints.push(seconds * 1_000);
            }
        }

        const retryAfterHeaderMatch = reason.match(/\bretry[-_\s]?after\b\s*[:=]\s*([^\n;]+)/i);
        if (retryAfterHeaderMatch) {
            const rawValue = retryAfterHeaderMatch[1].trim();
            if (/^\d{1,10}$/.test(rawValue)) {
                retryHints.push(Number(rawValue) * 1_000);
            } else {
                const retryAt = Date.parse(rawValue);
                if (Number.isFinite(retryAt)) {
                    retryHints.push(Math.max(0, retryAt - nowMs));
                }
            }
        }

        RATE_LIMIT_RESET_KEY_VALUE_REGEX.lastIndex = 0;
        let rateLimitMatch = RATE_LIMIT_RESET_KEY_VALUE_REGEX.exec(reason);
        while (rateLimitMatch) {
            const parsed = parseRateLimitResetHintMs(rateLimitMatch[1], nowMs);
            if (parsed !== null) {
                retryHints.push(parsed);
            }
            rateLimitMatch = RATE_LIMIT_RESET_KEY_VALUE_REGEX.exec(reason);
        }

        const delayMatch = reason.match(
            /\b(?:retry[-_\s]?in|retry[-_\s]?delay|backoff)\b\s*[:=]?\s*(\d{1,10})\s*(ms|msec|milliseconds?|s|sec|seconds?)?\b/i
        );
        if (delayMatch) {
            const amount = Number(delayMatch[1]);
            if (Number.isFinite(amount) && amount >= 0) {
                const unit = (delayMatch[2] || '').toLowerCase();
                retryHints.push(unit.startsWith('s') ? amount * 1_000 : amount);
            }
        }

        if (retryHints.length === 0) {
            return output;
        }

        // Prefer the most conservative delay when multiple backoff hints are present.
        return {
            hintMs: Math.max(...retryHints),
            noRetryPushback: false
        };
    }

    _isTransientRejectionReason(reason) {
        if (typeof reason !== 'string' || !reason.trim()) {
            return false;
        }
        const statusSignals = parseRetryableStatusFromReason(reason);
        if (statusSignals.http !== null || statusSignals.grpc !== null) {
            return true;
        }
        const normalized = reason.toLowerCase();
        return TRANSIENT_REJECTION_MARKERS.some((marker) => normalized.includes(marker));
    }

    _resolveRetryDelayMs(record, hintMs = null) {
        const attemptIndex = Math.max(record.attempts, 1);
        let delayMs = this.retryDelayMs;
        const hasHint = Number.isFinite(hintMs) && hintMs >= 0;
        if (this.retryBackoffStrategy === 'exponential') {
            const exponentialDelay = this.retryDelayMs * (2 ** (attemptIndex - 1));
            delayMs = Math.min(this.maxRetryDelayMs, exponentialDelay);
        }

        if (hasHint) {
            const normalizedHintMs = Math.max(0, Number(hintMs));
            delayMs = Number.isFinite(this.maxRetryHintMs)
                ? Math.min(Number(this.maxRetryHintMs), normalizedHintMs)
                : normalizedHintMs;
        }

        if (!hasHint && this.retryJitter === 'full' && delayMs > 1) {
            const randomSample = Number(this.random());
            const randomValue = Number.isFinite(randomSample) ? randomSample : Math.random();
            delayMs = Math.floor(Math.min(Math.max(randomValue, 0), 1) * delayMs);
        }
        if (!hasHint && this.retryJitter === 'decorrelated' && delayMs > 1) {
            const randomSample = Number(this.random());
            const randomValue = Number.isFinite(randomSample) ? randomSample : Math.random();
            const boundedRandom = Math.min(Math.max(randomValue, 0), 1);
            const previousDelayMs = clampPositiveNumber(record.lastRetryDelayMs, this.retryDelayMs);
            const upper = Math.max(
                this.retryDelayMs,
                Math.min(delayMs, previousDelayMs * 3)
            );
            const lower = Math.min(this.retryDelayMs, upper);
            delayMs = Math.floor(lower + ((upper - lower) * boundedRandom));
        }

        return Math.max(0, Math.floor(delayMs));
    }

    _resolveRetryThrottleTokenState(target) {
        if (!this.retryThrottling.enabled) {
            return null;
        }

        if (this.retryThrottling.scope === 'target' && this.retryThrottleTokensByTarget) {
            const bucketKey = typeof target === 'string' && target.trim()
                ? target.trim()
                : '__unknown_target__';

            if (!this.retryThrottleTokensByTarget.has(bucketKey)) {
                this.retryThrottleTokensByTarget.set(bucketKey, this.retryThrottling.maxTokens);
            }

            return {
                bucketKey,
                tokenCount: Number(this.retryThrottleTokensByTarget.get(bucketKey))
            };
        }

        return {
            bucketKey: null,
            tokenCount: Number(this.retryThrottleTokens)
        };
    }

    _resolveRetryBudgetBucketKey(target) {
        if (this.retryBudget.scope !== 'target') {
            return null;
        }
        return this._resolveCircuitTarget(target);
    }

    _computeRetryBudgetState(target, { excludeTaskId = null } = {}) {
        const bucketKey = this._resolveRetryBudgetBucketKey(target);
        let primaryOpen = 0;
        let retryScheduled = 0;

        for (const record of this.tasks.values()) {
            if (record.taskId === excludeTaskId) continue;
            if (TERMINAL_STATUSES.has(record.status)) continue;
            if (bucketKey !== null && this._resolveCircuitTarget(record.target) !== bucketKey) continue;

            if (record.status === 'retry_scheduled') {
                retryScheduled += 1;
            } else if (OPEN_STATUSES.has(record.status)) {
                primaryOpen += 1;
            }
        }

        const ratioAllowance = Math.ceil(primaryOpen * this.retryBudget.ratio);
        let allowance = Math.max(this.retryBudget.minRetries, ratioAllowance);
        if (Number.isFinite(this.retryBudget.maxRetries)) {
            allowance = Math.min(allowance, Number(this.retryBudget.maxRetries));
        }
        allowance = Math.max(0, Math.floor(allowance));

        return {
            bucketKey,
            primaryOpen,
            retryScheduled,
            allowance,
            canSchedule: retryScheduled < allowance
        };
    }

    _scheduleRetry(record, nowMs, {
        reason = 'retry_scheduled',
        event = 'retry_scheduled',
        hintMs = null,
        auditEvent = 'task_retry_scheduled',
        consumeThrottleToken = false,
        retryCost = null,
        metadata = null
    } = {}) {
        if (consumeThrottleToken && !this._consumeRetryThrottleToken(
            nowMs,
            record.taskId,
            reason,
            record.target,
            retryCost
        )) {
            return {
                scheduled: false,
                blockedBy: 'throttle'
            };
        }

        if (this.retryBudget.enabled) {
            const budgetState = this._computeRetryBudgetState(
                record.target,
                { excludeTaskId: record.taskId }
            );
            if (!budgetState.canSchedule) {
                this._emitAudit('task_retry_budget_blocked', {
                    taskId: record.taskId,
                    target: record.target,
                    reason,
                    scope: this.retryBudget.scope,
                    bucketKey: budgetState.bucketKey,
                    primaryOpen: budgetState.primaryOpen,
                    retryScheduled: budgetState.retryScheduled,
                    allowance: budgetState.allowance
                }, nowMs);
                return {
                    scheduled: false,
                    blockedBy: 'retry_budget'
                };
            }
        }

        const remainingOverallDeadlineMs = this._remainingOverallDeadlineMs(record, nowMs);
        if (Number.isFinite(remainingOverallDeadlineMs) && remainingOverallDeadlineMs < 0) {
            return {
                scheduled: false,
                blockedBy: 'retry_window'
            };
        }

        let retryDelayMs = this._resolveRetryDelayMs(record, hintMs);
        if (Number.isFinite(remainingOverallDeadlineMs)) {
            retryDelayMs = Math.min(
                retryDelayMs,
                Math.max(0, Math.floor(Number(remainingOverallDeadlineMs)))
            );
        }
        const nextRetryAt = nowMs + retryDelayMs;

        record.status = 'retry_scheduled';
        record.lastRetryDelayMs = retryDelayMs;
        record.nextRetryAt = nextRetryAt;
        record.updatedAt = nowMs;
        record.history.push({
            at: nowMs,
            event,
            reason,
            nextRetryAt,
            retryDelayMs,
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
            retryHintMs: Number.isFinite(hintMs) ? Number(hintMs) : null,
            ...(metadata && typeof metadata === 'object' ? metadata : {})
        }, nowMs);
        return {
            scheduled: true,
            blockedBy: null
        };
    }

    _consumeRetryThrottleToken(nowMs, taskId, reason, target, retryCost = null) {
        if (!this.retryThrottling.enabled) return true;
        const tokenState = this._resolveRetryThrottleTokenState(target);
        const tokenCount = tokenState?.tokenCount;
        const spendCost = clampPositiveNumber(retryCost, this.retryThrottling.retryCost);
        if (!Number.isFinite(tokenCount) || tokenCount <= this.retryThrottling.threshold) {
            this._emitAudit('task_retry_throttled', {
                taskId,
                reason,
                target,
                tokenCount: Number.isFinite(tokenCount) ? tokenCount : 0,
                threshold: this.retryThrottling.threshold,
                retryCost: spendCost,
                scope: this.retryThrottling.scope
            }, nowMs);
            return false;
        }

        const nextTokenCount = Math.max(0, tokenCount - spendCost);
        if (tokenState?.bucketKey !== null && this.retryThrottleTokensByTarget) {
            this.retryThrottleTokensByTarget.set(tokenState.bucketKey, nextTokenCount);
        } else {
            this.retryThrottleTokens = nextTokenCount;
        }
        this._emitAudit('task_retry_throttle_token_spent', {
            taskId,
            reason,
            target,
            tokenCount: nextTokenCount,
            threshold: this.retryThrottling.threshold,
            retryCost: spendCost,
            scope: this.retryThrottling.scope
        }, nowMs);
        return true;
    }

    _creditRetryThrottleTokens(nowMs, taskId, source, target) {
        if (!this.retryThrottling.enabled) return;
        const tokenState = this._resolveRetryThrottleTokenState(target);
        const tokenCount = tokenState?.tokenCount;
        const current = Number.isFinite(tokenCount)
            ? tokenCount
            : this.retryThrottling.maxTokens;
        const next = Math.min(
            this.retryThrottling.maxTokens,
            current + this.retryThrottling.tokenRatio
        );
        if (next === current) return;
        if (tokenState?.bucketKey !== null && this.retryThrottleTokensByTarget) {
            this.retryThrottleTokensByTarget.set(tokenState.bucketKey, next);
        } else {
            this.retryThrottleTokens = next;
        }
        this._emitAudit('task_retry_throttle_token_credit', {
            taskId,
            source,
            target,
            tokenCount: next,
            maxTokens: this.retryThrottling.maxTokens,
            scope: this.retryThrottling.scope
        }, nowMs);
    }

    async dispatchTask({
        target,
        task,
        priority = 'normal',
        context,
        constraints,
        id = randomUUID(),
        createdAt = safeNow(this.now)
    }) {
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

        const duplicateRecord = this._findDuplicateRecord(request, createdAt);
        if (duplicateRecord) {
            duplicateRecord.updatedAt = createdAt;
            duplicateRecord.history.push({
                at: createdAt,
                event: 'duplicate_dispatch_suppressed',
                duplicateTaskId: request.id
            });
            this._persistRecord(duplicateRecord);
            this._emitAudit('task_duplicate_dispatch_suppressed', {
                taskId: duplicateRecord.taskId,
                duplicateTaskId: request.id,
                target: duplicateRecord.target,
                status: duplicateRecord.status
            }, createdAt);
            return this.getTask(duplicateRecord.taskId);
        }

        this._assertDispatchAdmission(request, createdAt);
        this._assertQueueCapacity(request.target, createdAt, request.priority);

        const overallDeadlineAt = this._resolveOverallDeadlineAt(request.createdAt);
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
            lastRetryDelayMs: null,
            adaptiveConcurrency: null,
            overallDeadlineAt,
            deadlineAt: this._applyOverallDeadline(
                { overallDeadlineAt },
                request.createdAt + this.defaultTimeoutMs
            ),
            nextRetryAt: null,
            closedAt: null,
            lastError: null,
            receipts: [],
            result: null,
            history: [
                { at: request.createdAt, event: 'created' }
            ]
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
                const nowMs = safeNow(this.now);
                const scheduled = this._scheduleRetry(record, nowMs, {
                    reason: 'initial_dispatch_circuit_open',
                    event: 'initial_dispatch_circuit_open_retry_scheduled',
                    hintMs: Number.isFinite(error.details?.retryAfterMs) ? Number(error.details.retryAfterMs) : null
                });
                if (!scheduled.scheduled) {
                    this._markTimedOut(record, nowMs, {
                        event: scheduled.blockedBy === 'retry_budget'
                            ? 'timed_out_retry_budget_exhausted'
                            : 'timed_out_retry_window_exhausted',
                        reason: 'initial_dispatch_circuit_open'
                    });
                }
                return this.getTask(record.taskId);
            }
            if (error instanceof TaskOrchestratorError && error.code === 'ADAPTIVE_CONCURRENCY_LIMIT') {
                const nowMs = safeNow(this.now);
                const scheduled = this._scheduleRetry(record, nowMs, {
                    reason: 'initial_dispatch_adaptive_concurrency_limited',
                    event: 'initial_dispatch_concurrency_limited_retry_scheduled',
                    hintMs: Number.isFinite(error.details?.retryAfterMs) ? Number(error.details.retryAfterMs) : null
                });
                if (!scheduled.scheduled) {
                    this._markTimedOut(record, nowMs, {
                        event: scheduled.blockedBy === 'retry_budget'
                            ? 'timed_out_retry_budget_exhausted'
                            : 'timed_out_retry_window_exhausted',
                        reason: 'initial_dispatch_adaptive_concurrency_limited'
                    });
                }
                return this.getTask(record.taskId);
            }
            this.tasks.delete(record.taskId);
            this._deleteRecord(record.taskId);
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
            if (error instanceof TaskOrchestratorError && error.code === 'CIRCUIT_OPEN') {
                const scheduled = this._scheduleRetry(record, reviewedAt, {
                    reason: 'approval_release_circuit_open',
                    event: 'approval_release_circuit_open_retry_scheduled',
                    hintMs: Number.isFinite(error.details?.retryAfterMs) ? Number(error.details.retryAfterMs) : null
                });
                if (!scheduled.scheduled) {
                    if (scheduled.blockedBy === 'retry_window' || scheduled.blockedBy === 'retry_budget') {
                        this._markTimedOut(record, reviewedAt, {
                            event: scheduled.blockedBy === 'retry_budget'
                                ? 'timed_out_retry_budget_exhausted'
                                : 'timed_out_retry_window_exhausted',
                            reason: 'approval_release_circuit_open'
                        });
                    }
                }
                return this.getTask(taskId);
            }
            if (error instanceof TaskOrchestratorError && error.code === 'ADAPTIVE_CONCURRENCY_LIMIT') {
                const scheduled = this._scheduleRetry(record, reviewedAt, {
                    reason: 'approval_release_adaptive_concurrency_limited',
                    event: 'approval_release_concurrency_limited_retry_scheduled',
                    hintMs: Number.isFinite(error.details?.retryAfterMs) ? Number(error.details.retryAfterMs) : null
                });
                if (!scheduled.scheduled) {
                    if (scheduled.blockedBy === 'retry_window' || scheduled.blockedBy === 'retry_budget') {
                        this._markTimedOut(record, reviewedAt, {
                            event: scheduled.blockedBy === 'retry_budget'
                                ? 'timed_out_retry_budget_exhausted'
                                : 'timed_out_retry_window_exhausted',
                            reason: 'approval_release_adaptive_concurrency_limited'
                        });
                    }
                }
                return this.getTask(taskId);
            }
            const scheduled = this._scheduleRetry(record, reviewedAt, {
                reason: 'approval_release_failed',
                event: 'approval_release_retry_scheduled',
                consumeThrottleToken: true,
                retryCost: this.retryThrottling.transportRetryCost,
                metadata: {
                    error: error.message
                }
            });
            if (!scheduled.scheduled) {
                if (scheduled.blockedBy === 'retry_window') {
                    this._markTimedOut(record, reviewedAt, {
                        event: 'timed_out_retry_window_exhausted',
                        reason: 'approval_release_failed'
                    });
                } else {
                    record.status = 'transport_error';
                    record.updatedAt = reviewedAt;
                    record.closedAt = reviewedAt;
                    record.history.push({
                        at: reviewedAt,
                        event: scheduled.blockedBy === 'retry_budget'
                            ? 'approval_release_retry_budget_exhausted'
                            : 'approval_release_retry_throttled',
                        error: error.message
                    });
                    this._persistRecord(record);
                    this._emitAudit('task_transport_error', {
                        taskId: record.taskId,
                        target: record.target,
                        error: error.message
                    }, reviewedAt);
                }
            }
        }

        return this.getTask(taskId);
    }

    async cancelTask(taskId, {
        reason = 'cancelled_by_operator',
        cancelledBy = this.localAgentId,
        timestamp = safeNow(this.now),
        propagate = true
    } = {}) {
        const record = this.tasks.get(taskId);
        if (!record) return null;
        if (TERMINAL_STATUSES.has(record.status)) {
            return this.getTask(taskId);
        }

        const cancelledAt = Number.isFinite(Number(timestamp)) ? Number(timestamp) : safeNow(this.now);
        const previousStatus = record.status;
        const reasonText = typeof reason === 'string' && reason.trim()
            ? reason.trim()
            : 'cancelled_by_operator';
        const actor = typeof cancelledBy === 'string' && cancelledBy.trim()
            ? cancelledBy.trim()
            : this.localAgentId;

        this._releaseAdaptiveConcurrencySlot(record, cancelledAt, 'neutral');
        record.status = 'cancelled';
        record.updatedAt = cancelledAt;
        record.closedAt = cancelledAt;
        record.nextRetryAt = null;
        record.history.push({
            at: cancelledAt,
            event: 'cancelled',
            reason: reasonText,
            cancelledBy: actor
        });
        this._persistRecord(record);
        this._emitAudit('task_cancelled', {
            taskId: record.taskId,
            target: record.target,
            reason: reasonText,
            cancelledBy: actor,
            previousStatus
        }, cancelledAt);

        const shouldPropagate = propagate
            && previousStatus !== APPROVAL_PENDING_STATUS
            && record.attempts > 0;
        if (!shouldPropagate) {
            return this.getTask(taskId);
        }

        const cancelEnvelope = {
            kind: 'task_cancel',
            taskId: record.taskId,
            from: this.localAgentId,
            target: record.target,
            reason: reasonText,
            timestamp: cancelledAt
        };

        try {
            let via = null;
            if (typeof this.transport.cancel === 'function') {
                await this.transport.cancel(record.target, cancelEnvelope);
                via = 'cancel';
            } else if (typeof this.transport.send === 'function') {
                await this.transport.send(record.target, cancelEnvelope);
                via = 'send';
            }

            if (via) {
                const signalAt = safeNow(this.now);
                record.updatedAt = signalAt;
                record.history.push({
                    at: signalAt,
                    event: 'cancel_signal_sent',
                    via
                });
                this._persistRecord(record);
                this._emitAudit('task_cancel_signal_sent', {
                    taskId: record.taskId,
                    target: record.target,
                    via
                }, signalAt);
            }
        } catch (error) {
            const failedAt = safeNow(this.now);
            const message = error?.message || 'Failed to propagate cancellation';
            record.updatedAt = failedAt;
            record.history.push({
                at: failedAt,
                event: 'cancel_signal_failed',
                error: message
            });
            this._persistRecord(record);
            this._emitAudit('task_cancel_signal_failed', {
                taskId: record.taskId,
                target: record.target,
                error: message
            }, failedAt);
            this.logger.warn?.(
                `[Swarm] Cancellation propagation failed for task ${record.taskId}: ${message}`
            );
        }

        return this.getTask(taskId);
    }

    async _sendTask(record, reason) {
        const sendAt = safeNow(this.now);
        const circuit = this._ensureCircuitCanSend(record.target, sendAt);
        if (!circuit.allowed) {
            const retryAfterMs = Number.isFinite(circuit.retryAfterMs)
                ? Number(circuit.retryAfterMs)
                : this.retryDelayMs;
            throw new TaskOrchestratorError('CIRCUIT_OPEN', 'Target circuit is open', {
                taskId: record.taskId,
                target: record.target,
                retryAfterMs
            });
        }
        const adaptiveConcurrency = this._acquireAdaptiveConcurrencySlot(record, sendAt);
        if (!adaptiveConcurrency.allowed) {
            const retryAfterMs = Number.isFinite(adaptiveConcurrency.retryAfterMs)
                ? Number(adaptiveConcurrency.retryAfterMs)
                : this.retryDelayMs;
            throw new TaskOrchestratorError('ADAPTIVE_CONCURRENCY_LIMIT', 'Adaptive concurrency limit reached', {
                taskId: record.taskId,
                target: record.target,
                retryAfterMs
            });
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
            if (Number.isFinite(this.transportSendTimeoutMs) && this.transportSendTimeoutMs > 0) {
                let timeoutHandle = null;
                try {
                    await Promise.race([
                        Promise.resolve(this.transport.send(record.target, record.request)),
                        new Promise((_, reject) => {
                            timeoutHandle = setTimeout(() => {
                                reject(new TaskOrchestratorError(
                                    'SEND_TIMEOUT',
                                    `Transport send timed out after ${this.transportSendTimeoutMs}ms`,
                                    {
                                        taskId: record.taskId,
                                        target: record.target,
                                        attempt: record.attempts,
                                        timeoutMs: this.transportSendTimeoutMs
                                    }
                                ));
                            }, this.transportSendTimeoutMs);
                        })
                    ]);
                } finally {
                    if (timeoutHandle !== null) {
                        clearTimeout(timeoutHandle);
                    }
                }
            } else {
                await this.transport.send(record.target, record.request);
            }
            record.status = 'dispatched';
            record.deadlineAt = this._applyOverallDeadline(record, sendAt + this.defaultTimeoutMs);
            record.nextRetryAt = null;
            record.lastError = null;
            record.history.push({
                at: safeNow(this.now),
                event: 'send_success',
                attempt: record.attempts
            });
            this._persistRecord(record);
            this._emitAudit('task_send_success', {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts
            }, record.updatedAt);
            this._onCircuitSendSuccess(record.target, record.updatedAt, 'send_success');
        } catch (error) {
            const message = error?.message || 'Failed to dispatch task';
            const isSendTimeout = error instanceof TaskOrchestratorError
                && error.code === 'SEND_TIMEOUT';
            record.lastError = message;
            record.updatedAt = safeNow(this.now);
            record.history.push({
                at: record.updatedAt,
                event: isSendTimeout ? 'send_timed_out' : 'send_failed',
                attempt: record.attempts,
                error: message
            });
            this._persistRecord(record);
            this._emitAudit(isSendTimeout ? 'task_send_timed_out' : 'task_send_failed', {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts,
                error: message
            }, record.updatedAt);
            this._releaseAdaptiveConcurrencySlot(record, record.updatedAt, 'overload');
            this._onCircuitSendFailure(record.target, record.updatedAt, isSendTimeout ? 'send_timeout' : 'send_failed');
            if (isSendTimeout) {
                throw error;
            }
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
            const retryDirective = this._parseRetryDirectiveFromReason(reason);
            const reasonHintMs = Number.isFinite(retryDirective.hintMs) ? Number(retryDirective.hintMs) : null;
            const retryHintMs = receiptHintMs !== null ? receiptHintMs : reasonHintMs;
            const transient = this._isTransientRejectionReason(reason);

            if (retryDirective.noRetryPushback) {
                this._releaseAdaptiveConcurrencySlot(record, receipt.timestamp, transient ? 'overload' : 'neutral');
                record.status = 'rejected';
                record.closedAt = receipt.timestamp;
                record.history.push({
                    at: receipt.timestamp,
                    event: 'rejected_no_retry_pushback',
                    reason
                });
                this._persistRecord(record);
                this._emitAudit('task_rejected_no_retry_pushback', {
                    taskId: record.taskId,
                    from: receipt.from,
                    reason
                }, receipt.timestamp);
                return true;
            }

            if (transient && this._canRetry(record)) {
                const scheduled = this._scheduleRetry(record, receipt.timestamp, {
                    reason: 'rejected_transient',
                    event: 'rejected_retry_scheduled',
                    hintMs: retryHintMs,
                    auditEvent: 'task_rejected_retry_scheduled',
                    consumeThrottleToken: true,
                    retryCost: this.retryThrottling.throttlingRetryCost,
                    metadata: {
                        from: receipt.from,
                        rejectionReason: reason
                    }
                });

                if (!scheduled.scheduled) {
                    if (scheduled.blockedBy === 'retry_window') {
                        this._markTimedOut(record, receipt.timestamp, {
                            event: 'timed_out_retry_window_exhausted',
                            reason
                        });
                        return true;
                    }
                    this._releaseAdaptiveConcurrencySlot(record, receipt.timestamp, 'overload');
                    record.status = 'rejected';
                    record.closedAt = receipt.timestamp;
                    record.history.push({
                        at: receipt.timestamp,
                        event: scheduled.blockedBy === 'retry_budget'
                            ? 'retry_budget_exhausted'
                            : 'retry_throttled',
                        reason
                    });
                    this._persistRecord(record);
                    return true;
                }
                this._releaseAdaptiveConcurrencySlot(record, receipt.timestamp, 'overload');
                return true;
            }

            this._releaseAdaptiveConcurrencySlot(record, receipt.timestamp, transient ? 'overload' : 'neutral');
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
            return true;
        }

        record.status = 'acknowledged';
        if (Number.isFinite(receipt.etaMs)) {
            record.deadlineAt = this._applyOverallDeadline(
                record,
                receipt.timestamp + Number(receipt.etaMs)
            );
        }
        this._creditRetryThrottleTokens(
            receipt.timestamp,
            record.taskId,
            'receipt_acknowledged',
            record.target
        );
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

        if (result.status === 'success') {
            record.status = 'completed';
            this._releaseAdaptiveConcurrencySlot(record, result.completedAt, 'healthy');
            this._creditRetryThrottleTokens(
                result.completedAt,
                record.taskId,
                'result_success',
                record.target
            );
        } else if (result.status === 'partial') {
            record.status = 'partial';
            this._releaseAdaptiveConcurrencySlot(record, result.completedAt, 'healthy');
            this._creditRetryThrottleTokens(
                result.completedAt,
                record.taskId,
                'result_partial',
                record.target
            );
        } else {
            record.status = 'failed';
            this._releaseAdaptiveConcurrencySlot(record, result.completedAt, 'neutral');
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

        return true;
    }

    async runMaintenance(nowMs = safeNow(this.now)) {
        const summary = {
            checked: 0,
            scheduledRetries: 0,
            retried: 0,
            deferredRetries: 0,
            timedOut: 0,
            staleExpired: 0,
            drainForceCancelled: 0,
            transportFailures: 0,
            prunedTerminalTasks: 0
        };
        const retryDispatchSelection = this._selectRetryDispatchTasksForMaintenance(nowMs);

        for (const record of this.tasks.values()) {
            if (this._shouldForceCancelInDrain(record, nowMs)) {
                const cancelled = await this._forceCancelForDrain(record, nowMs);
                if (cancelled) {
                    summary.drainForceCancelled++;
                    continue;
                }
            }

            if (!TERMINAL_STATUSES.has(record.status) && this._isTaskPastStaleAge(record, nowMs)) {
                const expired = await this._expireStaleTask(record, nowMs);
                if (expired) {
                    summary.staleExpired++;
                    if (record.status === 'timed_out') {
                        summary.timedOut++;
                    }
                    continue;
                }
            }

            if (!OPEN_STATUSES.has(record.status)) continue;
            summary.checked++;
            if (this._isOverallDeadlineExceeded(record, nowMs)) {
                this._markTimedOut(record, nowMs, {
                    event: 'timed_out_overall_deadline',
                    reason: 'overall_timeout_exceeded'
                });
                summary.timedOut++;
                continue;
            }

            if (record.status === 'retry_scheduled') {
                if (record.adaptiveConcurrency?.acquired) {
                    this._releaseAdaptiveConcurrencySlot(record, nowMs, 'neutral');
                }
                if (!Number.isFinite(record.nextRetryAt)) {
                    const recovered = this._scheduleRetry(record, nowMs, {
                        reason: 'retry_schedule_recovered',
                        event: 'retry_scheduled_recovered'
                    });
                    if (recovered.scheduled) {
                        summary.scheduledRetries++;
                    } else if (recovered.blockedBy === 'retry_window') {
                        this._markTimedOut(record, nowMs, {
                            event: 'timed_out_retry_window_exhausted',
                            reason: 'retry_schedule_recovered'
                        });
                        summary.timedOut++;
                    } else if (recovered.blockedBy === 'retry_budget') {
                        this._markTimedOut(record, nowMs, {
                            event: 'timed_out_retry_budget_exhausted',
                            reason: 'retry_schedule_recovered'
                        });
                        summary.timedOut++;
                    }
                    continue;
                }

                if (nowMs < record.nextRetryAt) continue;
                if (retryDispatchSelection && !retryDispatchSelection.has(record.taskId)) {
                    summary.deferredRetries++;
                    continue;
                }

                try {
                    await this._sendTask(record, 'timeout_retry');
                    summary.retried++;
                } catch (error) {
                    if (error instanceof TaskOrchestratorError && error.code === 'CIRCUIT_OPEN') {
                        const scheduled = this._scheduleRetry(record, nowMs, {
                            reason: 'target_circuit_open',
                            event: 'retry_scheduled_circuit_open',
                            hintMs: Number.isFinite(error.details?.retryAfterMs) ? Number(error.details.retryAfterMs) : null
                        });
                        if (scheduled.scheduled) {
                            summary.scheduledRetries++;
                        } else if (scheduled.blockedBy === 'retry_window') {
                            this._markTimedOut(record, nowMs, {
                                event: 'timed_out_retry_window_exhausted',
                                reason: 'target_circuit_open'
                            });
                            summary.timedOut++;
                        } else if (scheduled.blockedBy === 'retry_budget') {
                            this._markTimedOut(record, nowMs, {
                                event: 'timed_out_retry_budget_exhausted',
                                reason: 'target_circuit_open'
                            });
                            summary.timedOut++;
                        }
                        continue;
                    }
                    if (error instanceof TaskOrchestratorError && error.code === 'ADAPTIVE_CONCURRENCY_LIMIT') {
                        const scheduled = this._scheduleRetry(record, nowMs, {
                            reason: 'adaptive_concurrency_limited',
                            event: 'retry_scheduled_adaptive_concurrency_limited',
                            hintMs: Number.isFinite(error.details?.retryAfterMs) ? Number(error.details.retryAfterMs) : null
                        });
                        if (scheduled.scheduled) {
                            summary.scheduledRetries++;
                        } else if (scheduled.blockedBy === 'retry_window') {
                            this._markTimedOut(record, nowMs, {
                                event: 'timed_out_retry_window_exhausted',
                                reason: 'adaptive_concurrency_limited'
                            });
                            summary.timedOut++;
                        } else if (scheduled.blockedBy === 'retry_budget') {
                            this._markTimedOut(record, nowMs, {
                                event: 'timed_out_retry_budget_exhausted',
                                reason: 'adaptive_concurrency_limited'
                            });
                            summary.timedOut++;
                        }
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
                    } else {
                        const scheduled = this._scheduleRetry(record, nowMs, {
                            reason: 'transport_send_failed',
                            event: 'retry_scheduled',
                            consumeThrottleToken: true,
                            retryCost: this.retryThrottling.transportRetryCost,
                            metadata: {
                                error: record.lastError
                            }
                        });
                        if (!scheduled.scheduled) {
                            if (scheduled.blockedBy === 'retry_window') {
                                this._markTimedOut(record, nowMs, {
                                    event: 'timed_out_retry_window_exhausted',
                                    reason: 'transport_send_failed'
                                });
                                summary.timedOut++;
                                continue;
                            }
                            record.status = 'transport_error';
                            record.updatedAt = nowMs;
                            record.closedAt = nowMs;
                            record.history.push({
                                at: nowMs,
                                event: scheduled.blockedBy === 'retry_budget'
                                    ? 'transport_error_retry_budget_exhausted'
                                    : 'transport_error_retry_throttled',
                                error: record.lastError
                            });
                            this._persistRecord(record);
                            this._emitAudit('task_transport_error', {
                                taskId: record.taskId,
                                target: record.target,
                                error: record.lastError
                            }, nowMs);
                        }
                    }
                }
                continue;
            }

            if (nowMs <= record.deadlineAt) continue;

            if (!this._canRetry(record)) {
                this._markTimedOut(record, nowMs, {
                    event: 'timed_out',
                    reason: 'retry_budget_exhausted'
                });
                summary.timedOut++;
                continue;
            }

            if (record.nextRetryAt === null) {
                this._releaseAdaptiveConcurrencySlot(record, nowMs, 'overload');
                const scheduled = this._scheduleRetry(record, nowMs, {
                    reason: 'deadline_exceeded',
                    event: 'retry_scheduled',
                    consumeThrottleToken: true,
                    retryCost: this.retryThrottling.timeoutRetryCost
                });
                if (scheduled.scheduled) {
                    summary.scheduledRetries++;
                } else if (scheduled.blockedBy === 'retry_window') {
                    this._markTimedOut(record, nowMs, {
                        event: 'timed_out_retry_window_exhausted',
                        reason: 'deadline_exceeded'
                    });
                    summary.timedOut++;
                } else {
                    this._markTimedOut(record, nowMs, {
                        event: scheduled.blockedBy === 'retry_budget'
                            ? 'timed_out_retry_budget_exhausted'
                            : 'timed_out_retry_throttled',
                        reason: 'deadline_exceeded'
                    });
                    summary.timedOut++;
                }
                continue;
            }
        }

        summary.prunedTerminalTasks = this._pruneTerminalTasks(nowMs, 'maintenance');

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

    setDrainMode({
        enabled = true,
        reason = null,
        initiatedAt = safeNow(this.now),
        rejectNewDispatches = true,
        forceCancelAfterMs = null,
        propagateCancel = true
    } = {}) {
        const nowMs = safeNow(this.now);
        const normalizedForceCancelAfterMs = Number.isFinite(Number(forceCancelAfterMs))
            && Number(forceCancelAfterMs) > 0
            ? Number(forceCancelAfterMs)
            : null;
        const nextMode = {
            enabled: enabled === true,
            initiatedAt: Number.isFinite(Number(initiatedAt))
                ? Number(initiatedAt)
                : nowMs,
            reason: typeof reason === 'string' && reason.trim()
                ? reason.trim()
                : null,
            rejectNewDispatches: rejectNewDispatches !== false,
            forceCancelAfterMs: normalizedForceCancelAfterMs,
            propagateCancel: propagateCancel !== false
        };
        this.drainMode = nextMode;
        this._emitAudit(
            nextMode.enabled ? 'orchestrator_drain_enabled' : 'orchestrator_drain_disabled',
            {
                reason: nextMode.reason,
                initiatedAt: nextMode.initiatedAt,
                rejectNewDispatches: nextMode.rejectNewDispatches,
                forceCancelAfterMs: nextMode.forceCancelAfterMs,
                propagateCancel: nextMode.propagateCancel
            },
            nowMs
        );
        return clone(nextMode);
    }

    getDrainMode() {
        return clone(this.drainMode);
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
                overallTimeoutMs: this.overallTimeoutMs,
                budget: {
                    enabled: this.retryBudget.enabled,
                    scope: this.retryBudget.scope,
                    ratio: this.retryBudget.ratio,
                    minRetries: this.retryBudget.minRetries,
                    maxRetries: this.retryBudget.maxRetries,
                    activeRetryScheduled: 0,
                    activePrimaryOpen: 0,
                    activeAllowance: null,
                    trackedTargetBuckets: null,
                    saturatedTargetBuckets: null
                },
                throttling: {
                    enabled: this.retryThrottling.enabled,
                    scope: this.retryThrottling.scope,
                    maxTokens: this.retryThrottling.maxTokens,
                    tokenRatio: this.retryThrottling.tokenRatio,
                    retryCost: this.retryThrottling.retryCost,
                    timeoutRetryCost: this.retryThrottling.timeoutRetryCost,
                    throttlingRetryCost: this.retryThrottling.throttlingRetryCost,
                    transportRetryCost: this.retryThrottling.transportRetryCost,
                    threshold: this.retryThrottling.threshold,
                    tokenCount: this.retryThrottling.enabled
                        ? (
                            this.retryThrottling.scope === 'global'
                                ? Number(this.retryThrottleTokens)
                                : null
                        )
                        : null,
                    activeTargetBuckets: this.retryThrottling.scope === 'target'
                        ? this.retryThrottleTokensByTarget?.size ?? 0
                        : null
                }
            },
            circuitBreaker: {
                enabled: this.circuitBreaker.enabled,
                failureThreshold: this.circuitBreaker.failureThreshold,
                cooldownMs: this.circuitBreaker.cooldownMs,
                halfOpenMaxAttempts: this.circuitBreaker.halfOpenMaxAttempts,
                successThreshold: this.circuitBreaker.successThreshold,
                cooldownBackoffMultiplier: this.circuitBreaker.cooldownBackoffMultiplier,
                maxCooldownMs: this.circuitBreaker.maxCooldownMs,
                targets: {
                    open: 0,
                    halfOpen: 0,
                    closed: 0
                }
            },
            adaptiveConcurrency: {
                enabled: this.adaptiveConcurrency.enabled,
                initialLimit: this.adaptiveConcurrency.initialLimit,
                minLimit: this.adaptiveConcurrency.minLimit,
                maxLimit: this.adaptiveConcurrency.maxLimit,
                increaseStep: this.adaptiveConcurrency.increaseStep,
                decreaseMultiplier: this.adaptiveConcurrency.decreaseMultiplier,
                latencyHighWatermarkMs: this.adaptiveConcurrency.latencyHighWatermarkMs,
                targets: {
                    tracked: 0,
                    limited: 0,
                    totalInFlight: 0,
                    blockedCount: 0,
                    limitIncreaseCount: 0,
                    limitDecreaseCount: 0
                }
            },
            dispatchDeduplication: {
                enabled: this.dispatchDeduplication.enabled,
                windowMs: this.dispatchDeduplication.windowMs,
                openOnly: this.dispatchDeduplication.openOnly,
                terminalWindowMs: this.dispatchDeduplication.terminalWindowMs,
                inFlightWindowMs: this.dispatchDeduplication.inFlightWindowMs,
                coalesceOpenUntilTerminal: this.dispatchDeduplication.coalesceOpenUntilTerminal
            },
            terminalTaskRetention: {
                enabled: this.terminalTaskRetention.enabled,
                maxAgeMs: this.terminalTaskRetention.maxAgeMs,
                maxTasks: this.terminalTaskRetention.maxTasks,
                sweepLimit: this.terminalTaskRetention.sweepLimit,
                prunedTotal: this.terminalTasksPruned
            },
            queueCapacity: {
                enabled: this.queueCapacity.enabled,
                maxOpenTasks: this.queueCapacity.maxOpenTasks,
                maxOpenTasksPerTarget: this.queueCapacity.maxOpenTasksPerTarget,
                reservedOpenSlotsByPriority: clone(this.queueCapacity.reservedOpenSlotsByPriority),
                openTasksTotal: 0,
                trackedTargets: 0,
                openByPriority: {
                    low: 0,
                    normal: 0,
                    high: 0,
                    critical: 0
                }
            },
            staleTaskPolicy: {
                enabled: this.staleTaskPolicy.enabled,
                maxAgeMs: this.staleTaskPolicy.maxAgeMs,
                terminalStatus: this.staleTaskPolicy.terminalStatus,
                propagateCancel: this.staleTaskPolicy.propagateCancel
            },
            drainMode: {
                enabled: this.drainMode.enabled,
                initiatedAt: this.drainMode.initiatedAt,
                reason: this.drainMode.reason,
                rejectNewDispatches: this.drainMode.rejectNewDispatches,
                forceCancelAfterMs: this.drainMode.forceCancelAfterMs,
                propagateCancel: this.drainMode.propagateCancel
            },
            maintenancePolicy: {
                enabled: this.maintenancePolicy.enabled,
                maxRetryDispatchesPerRun: this.maintenancePolicy.maxRetryDispatchesPerRun,
                fairRetryDispatchByTarget: this.maintenancePolicy.fairRetryDispatchByTarget
            },
            transportSendTimeoutMs: this.transportSendTimeoutMs
        };

        let attemptsTotal = 0;
        const openTargets = new Set();
        for (const record of this.tasks.values()) {
            attemptsTotal += record.attempts;
            metrics.byStatus[record.status] = (metrics.byStatus[record.status] || 0) + 1;

            if (TERMINAL_STATUSES.has(record.status)) {
                metrics.terminal++;
            } else {
                metrics.open++;
                metrics.queueCapacity.openTasksTotal += 1;
                const priorityBucket = normalizeTaskPriority(record.request?.priority);
                metrics.queueCapacity.openByPriority[priorityBucket] += 1;
                if (typeof record.target === 'string' && record.target) {
                    openTargets.add(record.target);
                }
            }
        }
        metrics.queueCapacity.trackedTargets = openTargets.size;

        if (this.retryBudget.enabled) {
            if (this.retryBudget.scope === 'global') {
                const budgetState = this._computeRetryBudgetState('__global__');
                metrics.retry.budget.activeRetryScheduled = budgetState.retryScheduled;
                metrics.retry.budget.activePrimaryOpen = budgetState.primaryOpen;
                metrics.retry.budget.activeAllowance = budgetState.allowance;
                metrics.retry.budget.trackedTargetBuckets = 1;
                metrics.retry.budget.saturatedTargetBuckets = budgetState.retryScheduled >= budgetState.allowance
                    ? 1
                    : 0;
            } else {
                const buckets = new Set();
                for (const record of this.tasks.values()) {
                    if (TERMINAL_STATUSES.has(record.status)) continue;
                    buckets.add(this._resolveCircuitTarget(record.target));
                }
                let allowanceTotal = 0;
                let saturated = 0;
                for (const bucketKey of buckets) {
                    const budgetState = this._computeRetryBudgetState(bucketKey);
                    metrics.retry.budget.activeRetryScheduled += budgetState.retryScheduled;
                    metrics.retry.budget.activePrimaryOpen += budgetState.primaryOpen;
                    allowanceTotal += budgetState.allowance;
                    if (budgetState.retryScheduled >= budgetState.allowance) {
                        saturated += 1;
                    }
                }
                metrics.retry.budget.activeAllowance = allowanceTotal;
                metrics.retry.budget.trackedTargetBuckets = buckets.size;
                metrics.retry.budget.saturatedTargetBuckets = saturated;
            }
        }

        metrics.avgAttempts = this.tasks.size > 0
            ? Number((attemptsTotal / this.tasks.size).toFixed(2))
            : 0;

        if (this.circuitBreaker.enabled && this.circuitBreakerStateByTarget) {
            for (const state of this.circuitBreakerStateByTarget.values()) {
                if (state.status === 'open') metrics.circuitBreaker.targets.open++;
                else if (state.status === 'half_open') metrics.circuitBreaker.targets.halfOpen++;
                else metrics.circuitBreaker.targets.closed++;
            }
        }

        if (this.adaptiveConcurrency.enabled && this.adaptiveConcurrencyByTarget) {
            metrics.adaptiveConcurrency.targets.tracked = this.adaptiveConcurrencyByTarget.size;
            for (const state of this.adaptiveConcurrencyByTarget.values()) {
                metrics.adaptiveConcurrency.targets.totalInFlight += state.inFlight;
                metrics.adaptiveConcurrency.targets.blockedCount += state.blockedCount;
                metrics.adaptiveConcurrency.targets.limitIncreaseCount += state.limitIncreaseCount;
                metrics.adaptiveConcurrency.targets.limitDecreaseCount += state.limitDecreaseCount;
                if (state.inFlight >= state.limit) {
                    metrics.adaptiveConcurrency.targets.limited++;
                }
            }
        }

        return metrics;
    }
}
