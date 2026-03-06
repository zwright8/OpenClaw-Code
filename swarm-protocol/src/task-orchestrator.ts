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
const CIRCUIT_CLOSED = 'closed';
const CIRCUIT_OPEN = 'open';
const CIRCUIT_HALF_OPEN = 'half_open';
const DEFAULT_MAX_RETRY_DELAY_MULTIPLIER = 32;
const DEFAULT_RETRY_JITTER_RATIO = 0.2;
const RETRY_CYCLE_GUARD_MULTIPLIER = 4;
const DEFAULT_GLOBAL_RETRY_BUDGET_RATIO = 0.2;
const DEFAULT_GLOBAL_RETRY_BUDGET_WINDOW_MS = 60_000;
const DEFAULT_GLOBAL_RETRY_BUDGET_MIN_BASE_REQUESTS = 5;
const DEFAULT_GLOBAL_RETRY_BUDGET_MIN_RETRIES = 1;

const RETRY_SCHEDULE_REASON_BY_CODE = new Map([
    ['timeout', 'timeout'],
    ['timed_out', 'timeout'],
    ['timeout_retry', 'timeout'],
    ['retry_timeout', 'timeout'],
    ['transport_failure', 'transport_failure'],
    ['transport_error', 'transport_failure'],
    ['transport_failure_retry', 'transport_failure'],
    ['approval_release_failed', 'approval_release_failed'],
    ['approval_release_retry', 'approval_release_failed'],
    ['approval_release', 'approval_release_failed']
]);

const RETRY_DISPATCH_REASON_BY_CODE = new Map([
    ['timeout_retry', 'timeout_retry'],
    ['timeout', 'timeout_retry'],
    ['transport_failure_retry', 'transport_failure_retry'],
    ['transport_failure', 'transport_failure_retry'],
    ['transport_error', 'transport_failure_retry'],
    ['approval_release_retry', 'approval_release_retry'],
    ['approval_release_failed', 'approval_release_retry'],
    ['approval_release', 'approval_release_retry']
]);

const TERMINAL_REASON_CANONICAL_CODE_BY_ALIAS = new Map([
    ['success', 'completed'],
    ['completed_successfully', 'completed'],
    ['error', 'failed'],
    ['failure', 'failed'],
    ['timed_out', 'timeout'],
    ['timeout_retry', 'timeout'],
    ['transport_error', 'transport_failure'],
    ['transport_failure_retry', 'transport_failure'],
    ['denied', 'approval_denied'],
    ['approval_rejected', 'approval_denied'],
    ['retry_exhausted', 'retry_budget_exhausted'],
    ['retry_budget_exceeded', 'retry_budget_exhausted']
]);

const TERMINAL_STATUS_BY_REASON_CODE = new Map([
    ['completed', 'completed'],
    ['partial', 'partial'],
    ['failed', 'failed'],
    ['approval_denied', 'rejected'],
    ['rejected_by_worker', 'rejected'],
    ['timeout', 'timed_out'],
    ['retry_budget_exhausted', 'timed_out'],
    ['retry_cycle_guard', 'timed_out'],
    ['transport_failure', 'transport_error'],
    ['approval_release_failed', 'transport_error']
]);

const TERMINAL_REASON_DEFAULT_CODE_BY_STATUS = new Map([
    ['completed', 'completed'],
    ['partial', 'partial'],
    ['failed', 'failed'],
    ['rejected', 'rejected_by_worker'],
    ['timed_out', 'timeout'],
    ['transport_error', 'transport_failure']
]);

const TERMINAL_REASON_ALLOWED_CODES_BY_STATUS = new Map([
    ['completed', new Set(['completed'])],
    ['partial', new Set(['partial'])],
    ['failed', new Set(['failed'])],
    ['rejected', new Set(['approval_denied', 'rejected_by_worker'])],
    ['timed_out', new Set(['timeout', 'retry_budget_exhausted', 'retry_cycle_guard'])],
    ['transport_error', new Set([
        'transport_failure',
        'approval_release_failed',
        'retry_budget_exhausted',
        'retry_cycle_guard'
    ])]
]);

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNonNegativeInteger(value, fallback = 0) {
    return Number.isInteger(value) && value >= 0 ? value : fallback;
}

function safeNonNegativeNumber(value, fallback = 0) {
    return Number.isFinite(value) && value >= 0 ? Number(value) : fallback;
}

function normalizeReasonToken(value, fallback = 'unknown') {
    if (value === null || value === undefined) return fallback;
    const normalized = String(value)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    return normalized || fallback;
}

function normalizeReasonContext(value) {
    return normalizeReasonToken(value, null);
}

function parseReason(value, fallbackCode = 'unknown') {
    if (value === null || value === undefined) {
        return {
            raw: null,
            code: fallbackCode,
            context: null
        };
    }

    const raw = String(value).trim();
    if (!raw) {
        return {
            raw: null,
            code: fallbackCode,
            context: null
        };
    }

    const [codeCandidate, ...contextParts] = raw.split(':');
    const contextRaw = contextParts.join(':').trim();

    return {
        raw,
        code: normalizeReasonToken(codeCandidate, fallbackCode),
        context: contextRaw ? normalizeReasonToken(contextRaw, null) : null
    };
}

function formatReasonToken(code, context = null, fallbackCode = 'unknown') {
    const normalizedCode = normalizeReasonToken(code, fallbackCode);
    const normalizedContext = normalizeReasonToken(context, null);
    return normalizedContext ? `${normalizedCode}:${normalizedContext}` : normalizedCode;
}

function canonicalizeReason(value, fallbackCode = 'unknown') {
    const parsed = parseReason(value, fallbackCode);
    return formatReasonToken(parsed.code, parsed.context, fallbackCode);
}

function canonicalizeTerminalReasonCode(code) {
    const normalized = normalizeReasonToken(code, null);
    if (!normalized) return null;
    return TERMINAL_REASON_CANONICAL_CODE_BY_ALIAS.get(normalized) || normalized;
}

function deriveTerminalStatusFromReason(reasonCode, reasonContext) {
    const normalizedCode = canonicalizeTerminalReasonCode(reasonCode);
    const normalizedContext = canonicalizeTerminalReasonCode(reasonContext);

    if (
        normalizedCode === 'retry_budget_exhausted'
        || normalizedCode === 'retry_cycle_guard'
        || normalizedCode === 'timeout'
    ) {
        if (
            normalizedContext === 'transport_failure'
            || normalizedContext === 'approval_release_failed'
        ) {
            return 'transport_error';
        }

        if (
            normalizedContext === 'approval_denied'
            || normalizedContext === 'rejected_by_worker'
        ) {
            return 'rejected';
        }

        if (
            normalizedContext === 'completed'
            || normalizedContext === 'partial'
            || normalizedContext === 'failed'
        ) {
            return normalizedContext;
        }
    }

    if (normalizedCode && TERMINAL_STATUS_BY_REASON_CODE.has(normalizedCode)) {
        return TERMINAL_STATUS_BY_REASON_CODE.get(normalizedCode);
    }

    if (normalizedContext && TERMINAL_STATUS_BY_REASON_CODE.has(normalizedContext)) {
        return TERMINAL_STATUS_BY_REASON_CODE.get(normalizedContext);
    }

    return null;
}

function normalizeTerminalReason(status, reason, fallbackCode = 'unknown') {
    const normalizedStatusInput = normalizeReasonToken(status, null);
    const parsed = parseReason(reason, normalizedStatusInput ?? fallbackCode);

    let code = canonicalizeTerminalReasonCode(parsed.code)
        ?? normalizeReasonToken(parsed.code, normalizeReasonToken(fallbackCode, 'unknown'));
    let context = canonicalizeTerminalReasonCode(parsed.context);

    const inferredStatus = inferTerminalClassification({
        status: normalizedStatusInput,
        reasonCode: code,
        reasonContext: context,
        fallback: normalizeReasonToken(fallbackCode, 'unknown')
    });

    const normalizedStatus = TERMINAL_STATUSES.has(inferredStatus)
        ? inferredStatus
        : normalizeReasonToken(fallbackCode, 'unknown');

    const fallbackReasonCode = TERMINAL_REASON_DEFAULT_CODE_BY_STATUS.get(normalizedStatus)
        ?? normalizeReasonToken(fallbackCode, 'unknown');
    const allowedCodes = TERMINAL_REASON_ALLOWED_CODES_BY_STATUS.get(normalizedStatus)
        ?? new Set([fallbackReasonCode]);

    if (!allowedCodes.has(code)) {
        context = context ?? code;
        code = fallbackReasonCode;
    }

    const normalizedCode = normalizeReasonToken(code, fallbackReasonCode);
    const normalizedContext = normalizeReasonToken(context, null);

    return {
        status: normalizedStatus,
        code: normalizedCode,
        context: normalizedContext,
        raw: formatReasonToken(normalizedCode, normalizedContext, fallbackReasonCode)
    };
}

function canonicalRetryScheduleReason(reason) {
    const parsed = parseReason(reason, 'timeout');
    return RETRY_SCHEDULE_REASON_BY_CODE.get(parsed.code) || 'timeout';
}

function canonicalRetryDispatchReason(reason) {
    const parsed = parseReason(reason, 'timeout');
    return RETRY_DISPATCH_REASON_BY_CODE.get(parsed.code) || 'timeout_retry';
}

function buildTerminalReasonCountKey(reason, reasonCode, reasonContext, fallbackCode = 'unknown') {
    if (reasonCode || reasonContext) {
        return formatReasonToken(reasonCode ?? fallbackCode, reasonContext, fallbackCode);
    }

    if (reason === null || reason === undefined) {
        return null;
    }

    return canonicalizeReason(reason, fallbackCode);
}

function inferTerminalClassification({
    status,
    reasonCode,
    reasonContext,
    fallback = 'non_terminal'
} = {}) {
    const normalizedStatus = normalizeReasonToken(status, null);
    const normalizedReasonCode = canonicalizeTerminalReasonCode(reasonCode);
    const normalizedReasonContext = canonicalizeTerminalReasonCode(reasonContext);
    const derivedStatus = deriveTerminalStatusFromReason(normalizedReasonCode, normalizedReasonContext);

    if (derivedStatus && TERMINAL_STATUSES.has(derivedStatus)) {
        return derivedStatus;
    }

    if (normalizedStatus && TERMINAL_STATUSES.has(normalizedStatus)) {
        return normalizedStatus;
    }

    return normalizeReasonToken(fallback, 'non_terminal');
}

function buildRetryTransitionSchema({
    state,
    attemptIndex,
    retryAttemptIndex,
    scheduledCount,
    dispatchCount,
    reason,
    reasonCode,
    reasonContext,
    delayMs,
    nextRetryAt,
    terminalClassification,
    terminalReason,
    terminalReasonCode,
    terminalReasonContext
}) {
    const normalizedState = normalizeReasonToken(state, 'unknown');

    const fallbackReasonCode = normalizeReasonToken(
        reasonCode,
        normalizeReasonToken(normalizedState, 'unknown')
    );
    const parsedReason = parseReason(reason, fallbackReasonCode);
    const normalizedReasonCode = normalizedState === 'scheduled'
        ? canonicalRetryScheduleReason(parsedReason.code)
        : normalizedState === 'dispatching'
            ? canonicalRetryDispatchReason(parsedReason.code)
            : normalizeReasonToken(parsedReason.code, fallbackReasonCode);
    const normalizedReasonContext = parsedReason.context ?? normalizeReasonContext(reasonContext);

    const fallbackTerminalReasonCode = normalizeReasonToken(terminalReasonCode, 'unknown');
    const parsedTerminalReason = parseReason(terminalReason, fallbackTerminalReasonCode);
    const normalizedTerminalReasonCode = canonicalizeTerminalReasonCode(parsedTerminalReason.code);
    const normalizedTerminalReasonContext = parsedTerminalReason.context ?? normalizeReasonContext(terminalReasonContext);
    const normalizedTerminalClassification = inferTerminalClassification({
        status: terminalClassification,
        reasonCode: normalizedTerminalReasonCode,
        reasonContext: normalizedTerminalReasonContext,
        fallback: 'non_terminal'
    });

    return {
        version: 2,
        state: normalizedState,
        attemptIndex: safeNonNegativeInteger(attemptIndex, 0),
        retryAttemptIndex: safeNonNegativeInteger(retryAttemptIndex, 0),
        attemptCounters: {
            scheduledRetries: safeNonNegativeInteger(scheduledCount, 0),
            retryDispatches: safeNonNegativeInteger(dispatchCount, 0)
        },
        reason: {
            raw: formatReasonToken(
                normalizedReasonCode,
                normalizedReasonContext,
                fallbackReasonCode
            ),
            code: normalizedReasonCode,
            context: normalizedReasonContext
        },
        delayMs: Number.isFinite(delayMs) ? Number(delayMs) : null,
        nextRetryAt: Number.isFinite(nextRetryAt) ? Number(nextRetryAt) : null,
        terminalClassification: normalizedTerminalClassification,
        terminalReason: {
            raw: formatReasonToken(
                normalizedTerminalReasonCode,
                normalizedTerminalReasonContext,
                fallbackTerminalReasonCode
            ),
            code: normalizedTerminalReasonCode,
            context: normalizedTerminalReasonContext
        }
    };
}

function sortNumericRecord(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    const sorted = {};
    for (const key of Object.keys(value).sort()) {
        sorted[key] = value[key];
    }

    return sorted;
}

function sanitizeTelemetryCounterMap(value, canonicalizeKey = (key) => normalizeReasonToken(key, null)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    const sanitized = {};
    for (const [key, count] of Object.entries(value)) {
        const normalizedKey = canonicalizeKey(key);
        if (!normalizedKey) continue;

        const normalizedCount = safeNonNegativeInteger(count, 0);
        if (normalizedCount <= 0) continue;

        sanitized[normalizedKey] = safeNonNegativeInteger(sanitized[normalizedKey], 0) + normalizedCount;
    }

    return sortNumericRecord(sanitized);
}

function incrementTelemetryCounter(map, key) {
    const normalizedKey = normalizeReasonToken(key, null);
    if (!normalizedKey) return;
    map[normalizedKey] = safeNonNegativeInteger(map[normalizedKey], 0) + 1;
}

function mergeCounterMaps(into, from, canonicalizeKey = (key) => normalizeReasonToken(key, null)) {
    if (!from || typeof from !== 'object') return into;
    for (const [key, count] of Object.entries(from).sort(([left], [right]) => left.localeCompare(right))) {
        const normalizedKey = canonicalizeKey(key);
        if (!normalizedKey) continue;
        into[normalizedKey] = safeNonNegativeInteger(into[normalizedKey], 0) + safeNonNegativeInteger(count, 0);
    }
    return sortNumericRecord(into);
}

function stableHash(value) {
    const input = String(value ?? '');
    let hash = 2166136261;
    for (let idx = 0; idx < input.length; idx += 1) {
        hash ^= input.charCodeAt(idx);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function stableUnitInterval(seed) {
    return stableHash(seed) / 0xffffffff;
}

function ensureRetryLifecycle(record, fallbackMaxRetries = 0) {
    const maxRetries = safeNonNegativeInteger(record?.maxRetries, fallbackMaxRetries);
    const minGuardCycles = Math.max(1, (maxRetries + 1) * RETRY_CYCLE_GUARD_MULTIPLIER);
    const existing = record?.retryLifecycle;

    const lifecycle = existing && typeof existing === 'object'
        ? existing
        : {
            state: 'idle',
            scheduledCount: 0,
            dispatchCount: 0,
            consecutiveFailures: 0,
            maxCycles: minGuardCycles,
            lastReason: null,
            lastReasonCode: null,
            lastReasonContext: null,
            lastDelayMs: null,
            nextRetryAt: null,
            terminalReason: null,
            terminalReasonCode: null,
            terminalReasonContext: null,
            terminalClassification: 'non_terminal',
            lastTransition: null,
            lastTransitionAt: null
        };

    const normalizedState = normalizeReasonToken(lifecycle.state, 'idle');
    lifecycle.state = ['idle', 'scheduled', 'dispatching', 'terminalized'].includes(normalizedState)
        ? normalizedState
        : 'idle';
    lifecycle.scheduledCount = safeNonNegativeInteger(lifecycle.scheduledCount, 0);
    lifecycle.dispatchCount = safeNonNegativeInteger(lifecycle.dispatchCount, 0);
    lifecycle.consecutiveFailures = safeNonNegativeInteger(lifecycle.consecutiveFailures, 0);
    lifecycle.maxCycles = Math.max(
        minGuardCycles,
        safeNonNegativeInteger(lifecycle.maxCycles, minGuardCycles)
    );

    const parsedLastReason = parseReason(lifecycle.lastReason, null);
    let normalizedLastReasonCode = normalizeReasonToken(lifecycle.lastReasonCode, null)
        ?? parsedLastReason.code;
    if (lifecycle.state === 'scheduled') {
        normalizedLastReasonCode = canonicalRetryScheduleReason(normalizedLastReasonCode ?? 'timeout');
    } else if (lifecycle.state === 'dispatching') {
        normalizedLastReasonCode = canonicalRetryDispatchReason(normalizedLastReasonCode ?? 'timeout_retry');
    } else {
        normalizedLastReasonCode = normalizeReasonToken(normalizedLastReasonCode, null);
    }
    const normalizedLastReasonContext = normalizeReasonContext(lifecycle.lastReasonContext)
        ?? parsedLastReason.context
        ?? null;

    lifecycle.lastReasonCode = normalizedLastReasonCode;
    lifecycle.lastReasonContext = normalizedLastReasonContext;
    lifecycle.lastReason = normalizedLastReasonCode
        ? formatReasonToken(normalizedLastReasonCode, normalizedLastReasonContext, normalizedLastReasonCode)
        : null;

    lifecycle.lastDelayMs = Number.isFinite(lifecycle.lastDelayMs)
        ? Number(lifecycle.lastDelayMs)
        : null;
    lifecycle.nextRetryAt = Number.isFinite(lifecycle.nextRetryAt)
        ? Number(lifecycle.nextRetryAt)
        : null;

    const normalizedStatus = normalizeReasonToken(record?.status, null);
    const terminalReasonInput = buildTerminalReasonCountKey(
        lifecycle.terminalReason,
        lifecycle.terminalReasonCode,
        lifecycle.terminalReasonContext,
        normalizedStatus ?? 'unknown'
    );

    if (terminalReasonInput || TERMINAL_STATUSES.has(normalizedStatus) || lifecycle.state === 'terminalized') {
        const normalizedTerminal = normalizeTerminalReason(
            normalizedStatus,
            terminalReasonInput,
            normalizedStatus ?? 'unknown'
        );
        lifecycle.terminalReason = normalizedTerminal.raw;
        lifecycle.terminalReasonCode = normalizedTerminal.code;
        lifecycle.terminalReasonContext = normalizedTerminal.context;
        lifecycle.terminalClassification = normalizedTerminal.status;
    } else {
        lifecycle.terminalReason = null;
        lifecycle.terminalReasonCode = null;
        lifecycle.terminalReasonContext = null;
        lifecycle.terminalClassification = 'non_terminal';
    }

    lifecycle.lastTransition = lifecycle.lastTransition && typeof lifecycle.lastTransition === 'object'
        ? clone(lifecycle.lastTransition)
        : null;
    lifecycle.lastTransitionAt = Number.isFinite(lifecycle.lastTransitionAt)
        ? Number(lifecycle.lastTransitionAt)
        : null;

    if (record && typeof record === 'object') {
        record.retryLifecycle = lifecycle;
        record.maxRetries = maxRetries;
    }

    return lifecycle;
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
        retryStrategy = 'exponential',
        retryBackoffMultiplier = 2,
        maxRetryDelayMs = null,
        retryJitterRatio = DEFAULT_RETRY_JITTER_RATIO,
        globalRetryBudgetRatio = DEFAULT_GLOBAL_RETRY_BUDGET_RATIO,
        globalRetryBudgetWindowMs = DEFAULT_GLOBAL_RETRY_BUDGET_WINDOW_MS,
        globalRetryBudgetMinBaseRequests = DEFAULT_GLOBAL_RETRY_BUDGET_MIN_BASE_REQUESTS,
        globalRetryBudgetMinRetries = DEFAULT_GLOBAL_RETRY_BUDGET_MIN_RETRIES,
        circuitBreakerEnabled = true,
        circuitFailureThreshold = 3,
        circuitCooldownMs = 30_000,
        circuitHalfOpenMaxAttempts = 1,
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
        this.maxRetries = safeNonNegativeInteger(maxRetries, 1);
        this.retryDelayMs = safeNonNegativeNumber(retryDelayMs, 500);
        this.retryStrategy = retryStrategy === 'fixed' ? 'fixed' : 'exponential';
        this.retryBackoffMultiplier = Number.isFinite(retryBackoffMultiplier) && retryBackoffMultiplier >= 1
            ? Number(retryBackoffMultiplier)
            : 2;
        const defaultMaxRetryDelayMs = this.retryDelayMs * DEFAULT_MAX_RETRY_DELAY_MULTIPLIER;
        this.maxRetryDelayMs = maxRetryDelayMs === null || maxRetryDelayMs === undefined
            ? defaultMaxRetryDelayMs
            : safeNonNegativeNumber(maxRetryDelayMs, defaultMaxRetryDelayMs);
        this.retryJitterRatio = Number.isFinite(retryJitterRatio) && retryJitterRatio >= 0
            ? Math.min(Number(retryJitterRatio), 1)
            : DEFAULT_RETRY_JITTER_RATIO;
        this.globalRetryBudgetRatio = Number.isFinite(globalRetryBudgetRatio) && globalRetryBudgetRatio >= 0
            ? Math.min(Number(globalRetryBudgetRatio), 1)
            : DEFAULT_GLOBAL_RETRY_BUDGET_RATIO;
        this.globalRetryBudgetWindowMs = Number.isFinite(globalRetryBudgetWindowMs) && globalRetryBudgetWindowMs > 0
            ? Number(globalRetryBudgetWindowMs)
            : DEFAULT_GLOBAL_RETRY_BUDGET_WINDOW_MS;
        this.globalRetryBudgetMinBaseRequests = safeNonNegativeInteger(
            globalRetryBudgetMinBaseRequests,
            DEFAULT_GLOBAL_RETRY_BUDGET_MIN_BASE_REQUESTS
        );
        this.globalRetryBudgetMinRetries = safeNonNegativeInteger(
            globalRetryBudgetMinRetries,
            DEFAULT_GLOBAL_RETRY_BUDGET_MIN_RETRIES
        );
        this.circuitBreakerEnabled = circuitBreakerEnabled !== false;
        this.circuitFailureThreshold = Number.isInteger(circuitFailureThreshold) && circuitFailureThreshold >= 1
            ? Number(circuitFailureThreshold)
            : 3;
        this.circuitCooldownMs = Number.isFinite(circuitCooldownMs) && circuitCooldownMs >= 0
            ? Number(circuitCooldownMs)
            : 30_000;
        this.circuitHalfOpenMaxAttempts = Number.isInteger(circuitHalfOpenMaxAttempts)
            && circuitHalfOpenMaxAttempts >= 1
            ? Number(circuitHalfOpenMaxAttempts)
            : 1;
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.tasks = new Map();
        this.circuits = new Map();
        this.globalRetryBudgetEvents = [];
        this._persistenceQueue = Promise.resolve();
    }

    _pruneGlobalRetryBudgetEvents(nowMs) {
        const earliest = nowMs - this.globalRetryBudgetWindowMs;
        this.globalRetryBudgetEvents = this.globalRetryBudgetEvents.filter(
            (event) => Number.isFinite(event?.at) && event.at >= earliest
        );
    }

    _recordGlobalRetryBudgetEvent(kind, at) {
        this.globalRetryBudgetEvents.push({ kind, at });
        this._pruneGlobalRetryBudgetEvents(at);
    }

    _globalRetryBudgetSnapshot(nowMs) {
        this._pruneGlobalRetryBudgetEvents(nowMs);

        let baseDispatches = 0;
        let retryDispatches = 0;
        for (const event of this.globalRetryBudgetEvents) {
            if (event.kind === 'base_dispatch') {
                baseDispatches += 1;
            } else if (event.kind === 'retry_dispatch') {
                retryDispatches += 1;
            }
        }

        const warmupBypassed = baseDispatches < this.globalRetryBudgetMinBaseRequests;
        const allowedRetryDispatches = warmupBypassed
            ? Infinity
            : Math.max(
                this.globalRetryBudgetMinRetries,
                Math.floor(baseDispatches * this.globalRetryBudgetRatio)
            );

        const remainingRetryDispatches = Number.isFinite(allowedRetryDispatches)
            ? Math.max(0, allowedRetryDispatches - retryDispatches)
            : Infinity;
        const exhausted = Number.isFinite(allowedRetryDispatches)
            ? retryDispatches >= allowedRetryDispatches
            : false;

        return {
            windowMs: this.globalRetryBudgetWindowMs,
            ratio: this.globalRetryBudgetRatio,
            minBaseRequests: this.globalRetryBudgetMinBaseRequests,
            minRetries: this.globalRetryBudgetMinRetries,
            baseDispatches,
            retryDispatches,
            allowedRetryDispatches,
            remainingRetryDispatches,
            exhausted,
            warmupBypassed
        };
    }

    _canConsumeGlobalRetryBudget(nowMs) {
        const snapshot = this._globalRetryBudgetSnapshot(nowMs);
        if (snapshot.exhausted) {
            return {
                allowed: false,
                snapshot
            };
        }

        this._recordGlobalRetryBudgetEvent('retry_dispatch', nowMs);
        return {
            allowed: true,
            snapshot: this._globalRetryBudgetSnapshot(nowMs)
        };
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

            const hydrated = clone(record);
            hydrated.attempts = safeNonNegativeInteger(hydrated.attempts, 0);
            hydrated.maxRetries = safeNonNegativeInteger(hydrated.maxRetries, this.maxRetries);
            ensureRetryLifecycle(hydrated, this.maxRetries);

            this.tasks.set(hydrated.taskId, hydrated);
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

    _getCircuit(target) {
        if (!this.circuitBreakerEnabled || typeof target !== 'string' || !target.trim()) {
            return null;
        }

        const existing = this.circuits.get(target);
        if (existing) return existing;

        const circuit = {
            target,
            state: CIRCUIT_CLOSED,
            consecutiveFailures: 0,
            openedAt: null,
            halfOpenAttempts: 0
        };
        this.circuits.set(target, circuit);
        return circuit;
    }

    _canSendWithCircuit(target, nowMs) {
        const circuit = this._getCircuit(target);
        if (!circuit) return;

        if (circuit.state === CIRCUIT_OPEN) {
            const retryAt = (Number.isFinite(circuit.openedAt) ? circuit.openedAt : nowMs) + this.circuitCooldownMs;
            if (nowMs < retryAt) {
                throw new TaskOrchestratorError('CIRCUIT_OPEN', `Circuit open for target ${target}`, {
                    target,
                    circuitState: circuit.state,
                    retryAfterMs: Math.max(0, retryAt - nowMs)
                });
            }

            circuit.state = CIRCUIT_HALF_OPEN;
            circuit.halfOpenAttempts = 0;
            this._emitAudit('circuit_half_open', {
                target,
                openedAt: circuit.openedAt
            }, nowMs);
        }

        if (circuit.state === CIRCUIT_HALF_OPEN) {
            if (circuit.halfOpenAttempts >= this.circuitHalfOpenMaxAttempts) {
                throw new TaskOrchestratorError('CIRCUIT_OPEN', `Circuit half-open probe budget exhausted for ${target}`, {
                    target,
                    circuitState: circuit.state,
                    retryAfterMs: this.circuitCooldownMs
                });
            }

            circuit.halfOpenAttempts += 1;
        }
    }

    _recordCircuitFailure(target, nowMs, reason) {
        const circuit = this._getCircuit(target);
        if (!circuit) return null;

        circuit.consecutiveFailures += 1;
        const shouldOpen = circuit.state === CIRCUIT_HALF_OPEN
            || circuit.consecutiveFailures >= this.circuitFailureThreshold;
        if (!shouldOpen) {
            return {
                state: circuit.state,
                consecutiveFailures: circuit.consecutiveFailures,
                retryAfterMs: null
            };
        }

        const wasOpen = circuit.state === CIRCUIT_OPEN;
        circuit.state = CIRCUIT_OPEN;
        circuit.openedAt = nowMs;
        circuit.halfOpenAttempts = 0;

        if (!wasOpen) {
            this._emitAudit('circuit_opened', {
                target,
                reason: reason || 'send_failed',
                consecutiveFailures: circuit.consecutiveFailures,
                cooldownMs: this.circuitCooldownMs
            }, nowMs);
        }

        return {
            state: circuit.state,
            consecutiveFailures: circuit.consecutiveFailures,
            retryAfterMs: this.circuitCooldownMs
        };
    }

    _recordCircuitSuccess(target, nowMs) {
        const circuit = this._getCircuit(target);
        if (!circuit) return;

        const previousState = circuit.state;
        const previousFailures = circuit.consecutiveFailures;
        circuit.state = CIRCUIT_CLOSED;
        circuit.consecutiveFailures = 0;
        circuit.openedAt = null;
        circuit.halfOpenAttempts = 0;

        if (previousState !== CIRCUIT_CLOSED || previousFailures > 0) {
            this._emitAudit('circuit_closed', {
                target,
                previousState,
                previousFailures
            }, nowMs);
        }
    }

    _extractRetryHintMs(error) {
        const visited = new Set();
        let current = error;

        while (current && typeof current === 'object' && !visited.has(current)) {
            visited.add(current);

            const direct = Number(current.retryAfterMs);
            if (Number.isFinite(direct) && direct >= 0) return direct;

            const detailsHint = Number(current?.details?.retryAfterMs);
            if (Number.isFinite(detailsHint) && detailsHint >= 0) return detailsHint;

            current = current.cause;
        }

        return null;
    }

    _normalizeRetryLifecycle(record) {
        if (!record || typeof record !== 'object') return null;

        record.attempts = safeNonNegativeInteger(record.attempts, 0);
        record.maxRetries = safeNonNegativeInteger(record.maxRetries, this.maxRetries);

        return ensureRetryLifecycle(record, this.maxRetries);
    }

    _setRetryLifecycleState(record, state, at, details = {}) {
        const lifecycle = this._normalizeRetryLifecycle(record);
        if (!lifecycle) return null;

        const normalizedStateToken = normalizeReasonToken(state, 'idle');
        const normalizedState = ['idle', 'scheduled', 'dispatching', 'terminalized'].includes(normalizedStateToken)
            ? normalizedStateToken
            : 'idle';
        const changed = lifecycle.state !== normalizedState;
        lifecycle.state = normalizedState;
        lifecycle.lastTransitionAt = at;

        if (Object.prototype.hasOwnProperty.call(details, 'reason')) {
            lifecycle.lastReason = details.reason ?? null;
            if (!Object.prototype.hasOwnProperty.call(details, 'reasonCode')) {
                lifecycle.lastReasonCode = null;
            }
            if (!Object.prototype.hasOwnProperty.call(details, 'reasonContext')) {
                lifecycle.lastReasonContext = null;
            }
        }

        if (Object.prototype.hasOwnProperty.call(details, 'reasonCode')) {
            lifecycle.lastReasonCode = details.reasonCode ?? null;
        }

        if (Object.prototype.hasOwnProperty.call(details, 'reasonContext')) {
            lifecycle.lastReasonContext = details.reasonContext ?? null;
        }

        if (Object.prototype.hasOwnProperty.call(details, 'delayMs')) {
            lifecycle.lastDelayMs = Number.isFinite(details.delayMs)
                ? Number(details.delayMs)
                : null;
        }

        if (Object.prototype.hasOwnProperty.call(details, 'nextRetryAt')) {
            lifecycle.nextRetryAt = Number.isFinite(details.nextRetryAt)
                ? Number(details.nextRetryAt)
                : null;
        }

        if (Object.prototype.hasOwnProperty.call(details, 'terminalReason')) {
            lifecycle.terminalReason = details.terminalReason ?? null;
            if (!Object.prototype.hasOwnProperty.call(details, 'terminalReasonCode')) {
                lifecycle.terminalReasonCode = null;
            }
            if (!Object.prototype.hasOwnProperty.call(details, 'terminalReasonContext')) {
                lifecycle.terminalReasonContext = null;
            }
        }

        if (Object.prototype.hasOwnProperty.call(details, 'terminalReasonCode')) {
            lifecycle.terminalReasonCode = details.terminalReasonCode ?? null;
        }

        if (Object.prototype.hasOwnProperty.call(details, 'terminalReasonContext')) {
            lifecycle.terminalReasonContext = details.terminalReasonContext ?? null;
        }

        const parsedReason = parseReason(lifecycle.lastReason, null);
        let reasonCode = normalizeReasonToken(lifecycle.lastReasonCode, null) ?? parsedReason.code;
        if (lifecycle.state === 'scheduled') {
            reasonCode = canonicalRetryScheduleReason(reasonCode ?? 'timeout');
        } else if (lifecycle.state === 'dispatching') {
            reasonCode = canonicalRetryDispatchReason(reasonCode ?? 'timeout_retry');
        } else {
            reasonCode = normalizeReasonToken(reasonCode, null);
        }
        const reasonContext = normalizeReasonContext(lifecycle.lastReasonContext)
            ?? parsedReason.context
            ?? null;

        lifecycle.lastReasonCode = reasonCode;
        lifecycle.lastReasonContext = reasonContext;
        lifecycle.lastReason = reasonCode
            ? formatReasonToken(reasonCode, reasonContext, reasonCode)
            : null;

        const terminalReasonInput = buildTerminalReasonCountKey(
            lifecycle.terminalReason,
            lifecycle.terminalReasonCode,
            lifecycle.terminalReasonContext,
            normalizeReasonToken(record?.status, 'unknown')
        );
        const terminalStatusHint = details.terminalStatus ?? record?.status;

        if (terminalReasonInput || lifecycle.state === 'terminalized' || TERMINAL_STATUSES.has(normalizeReasonToken(terminalStatusHint, null))) {
            const normalizedTerminal = normalizeTerminalReason(
                terminalStatusHint,
                terminalReasonInput,
                normalizeReasonToken(terminalStatusHint, 'unknown')
            );
            lifecycle.terminalReason = normalizedTerminal.raw;
            lifecycle.terminalReasonCode = normalizedTerminal.code;
            lifecycle.terminalReasonContext = normalizedTerminal.context;
            lifecycle.terminalClassification = normalizedTerminal.status;
        } else {
            lifecycle.terminalReason = null;
            lifecycle.terminalReasonCode = null;
            lifecycle.terminalReasonContext = null;
            lifecycle.terminalClassification = 'non_terminal';
        }

        const transition = buildRetryTransitionSchema({
            state: lifecycle.state,
            attemptIndex: safeNonNegativeInteger(record?.attempts, 0),
            retryAttemptIndex: safeNonNegativeInteger(lifecycle.dispatchCount, 0),
            scheduledCount: safeNonNegativeInteger(lifecycle.scheduledCount, 0),
            dispatchCount: safeNonNegativeInteger(lifecycle.dispatchCount, 0),
            reason: lifecycle.lastReason,
            reasonCode: lifecycle.lastReasonCode,
            reasonContext: lifecycle.lastReasonContext,
            delayMs: lifecycle.lastDelayMs,
            nextRetryAt: lifecycle.nextRetryAt,
            terminalClassification: lifecycle.terminalClassification,
            terminalReason: lifecycle.terminalReason,
            terminalReasonCode: lifecycle.terminalReasonCode,
            terminalReasonContext: lifecycle.terminalReasonContext
        });
        lifecycle.lastTransition = transition;

        if (changed || details.forceHistory === true) {
            record.history.push({
                at,
                event: 'retry_state',
                state: lifecycle.state,
                reason: lifecycle.lastReason,
                reasonCode: lifecycle.lastReasonCode,
                reasonContext: lifecycle.lastReasonContext,
                delayMs: lifecycle.lastDelayMs,
                nextRetryAt: lifecycle.nextRetryAt,
                terminalReason: lifecycle.terminalReason,
                terminalReasonCode: lifecycle.terminalReasonCode,
                terminalReasonContext: lifecycle.terminalReasonContext,
                terminalClassification: lifecycle.terminalClassification,
                attemptCounters: clone(transition.attemptCounters),
                retryTransition: transition
            });
        }

        return lifecycle;
    }

    _isRetryCycleExhausted(record) {
        const lifecycle = this._normalizeRetryLifecycle(record);
        if (!lifecycle) return true;
        return lifecycle.scheduledCount >= lifecycle.maxCycles;
    }

    _terminalizeRecordForRetry(record, {
        nowMs,
        status,
        event,
        reason,
        auditEvent,
        auditPayload
    }) {
        record.status = status;
        record.updatedAt = nowMs;
        record.closedAt = nowMs;
        record.nextRetryAt = null;

        const lifecycle = this._setRetryLifecycleState(record, 'terminalized', nowMs, {
            reason,
            terminalReason: reason,
            terminalStatus: status,
            nextRetryAt: null,
            forceHistory: true
        });

        record.history.push({
            at: nowMs,
            event,
            reason: lifecycle?.terminalReason ?? reason,
            reasonCode: lifecycle?.terminalReasonCode ?? null,
            reasonContext: lifecycle?.terminalReasonContext ?? null,
            error: record.lastError
        });
        this._persistRecord(record);
        this._emitAudit(auditEvent, {
            taskId: record.taskId,
            target: record.target,
            attempts: record.attempts,
            reason: lifecycle?.terminalReason ?? reason,
            reasonCode: lifecycle?.terminalReasonCode ?? null,
            reasonContext: lifecycle?.terminalReasonContext ?? null,
            terminalClassification: lifecycle?.terminalClassification ?? status,
            ...(auditPayload || {})
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

        const record = {
            taskId: request.id,
            target: request.target,
            request,
            status: 'created',
            approval: null,
            policy: policyDecision,
            attempts: 0,
            maxRetries: this.maxRetries,
            retryLifecycle: {
                state: 'idle',
                scheduledCount: 0,
                dispatchCount: 0,
                consecutiveFailures: 0,
                maxCycles: Math.max(1, (this.maxRetries + 1) * RETRY_CYCLE_GUARD_MULTIPLIER),
                lastReason: null,
                lastReasonCode: null,
                lastReasonContext: null,
                lastDelayMs: null,
                nextRetryAt: null,
                terminalReason: null,
                terminalReasonCode: null,
                terminalReasonContext: null,
                terminalClassification: 'non_terminal',
                lastTransition: null,
                lastTransitionAt: request.createdAt
            },
            createdAt: request.createdAt,
            updatedAt: request.createdAt,
            deadlineAt: request.createdAt + this.defaultTimeoutMs,
            nextRetryAt: null,
            closedAt: null,
            lastError: null,
            receipts: [],
            result: null,
            history: [
                { at: request.createdAt, event: 'created' }
            ]
        };
        this._normalizeRetryLifecycle(record);

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

            const deniedReasonContext = normalizeReasonContext(decision.reason);
            const terminalReason = deniedReasonContext && deniedReasonContext !== 'approval_denied'
                ? formatReasonToken('approval_denied', deniedReasonContext, 'approval_denied')
                : 'approval_denied';

            this._setRetryLifecycleState(record, 'terminalized', reviewedAt, {
                reason: terminalReason,
                reasonCode: 'approval_denied',
                reasonContext: deniedReasonContext,
                terminalReason,
                terminalReasonCode: 'approval_denied',
                terminalReasonContext: deniedReasonContext,
                terminalStatus: 'rejected',
                nextRetryAt: null,
                forceHistory: true
            });
            record.history.push({
                at: reviewedAt,
                event: 'approval_denied',
                reason: decision.reason || 'denied',
                terminalReason,
                reasonCode: 'approval_denied',
                reasonContext: deniedReasonContext
            });
            this._persistRecord(record);
            this._emitAudit('task_approval_denied', {
                taskId: record.taskId,
                reviewer: record.approval.reviewer,
                reason: terminalReason,
                reasonCode: 'approval_denied',
                reasonContext: deniedReasonContext,
                reviewReason: record.approval.reviewReason
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
            record.updatedAt = reviewedAt;
            record.history.push({
                at: reviewedAt,
                event: 'approval_release_failed',
                error: error.message
            });

            this._scheduleRetry(record, reviewedAt, 'approval_release_failed', {
                error
            });
        }

        return this.getTask(taskId);
    }

    async _sendTask(record, reason) {
        const sendAt = safeNow(this.now);
        const lifecycle = this._normalizeRetryLifecycle(record);
        const normalizedReason = normalizeReasonToken(reason, 'dispatch');
        const parsedReason = parseReason(normalizedReason, normalizedReason);
        const dispatchReasonCode = canonicalRetryDispatchReason(parsedReason.code);
        const dispatchReasonContext = parsedReason.context ?? null;
        const dispatchReason = formatReasonToken(
            dispatchReasonCode,
            dispatchReasonContext,
            dispatchReasonCode
        );
        const isRetryDispatch = (
            reason === 'timeout_retry'
            || reason === 'transport_failure_retry'
            || reason === 'approval_release_failed'
            || reason === 'approval_release_retry'
        );
        if (isRetryDispatch) {
            const budgetDecision = this._canConsumeGlobalRetryBudget(sendAt);
            if (!budgetDecision.allowed) {
                throw new TaskOrchestratorError(
                    'GLOBAL_RETRY_BUDGET_EXHAUSTED',
                    'Global retry budget exhausted',
                    {
                        budget: budgetDecision.snapshot
                    }
                );
            }
        } else {
            this._recordGlobalRetryBudgetEvent('base_dispatch', sendAt);
        }

        if (isRetryDispatch) {
            lifecycle.dispatchCount += 1;
            this._setRetryLifecycleState(record, 'dispatching', sendAt, {
                reason: dispatchReason,
                reasonCode: dispatchReasonCode,
                reasonContext: dispatchReasonContext,
                forceHistory: true
            });
        }

        record.attempts += 1;
        record.updatedAt = sendAt;
        record.history.push({
            at: sendAt,
            event: 'send_attempt',
            reason: isRetryDispatch ? dispatchReason : normalizedReason,
            reasonCode: isRetryDispatch ? dispatchReasonCode : parsedReason.code,
            reasonContext: parsedReason.context ?? null,
            attempt: record.attempts
        });
        this._emitAudit('task_send_attempt', {
            taskId: record.taskId,
            target: record.target,
            reason: isRetryDispatch ? dispatchReason : normalizedReason,
            reasonCode: isRetryDispatch ? dispatchReasonCode : parsedReason.code,
            reasonContext: parsedReason.context ?? null,
            attempt: record.attempts
        }, sendAt);

        try {
            this._canSendWithCircuit(record.target, sendAt);
        } catch (error) {
            const message = error?.message || 'Circuit is open';
            record.lastError = message;
            record.updatedAt = safeNow(this.now);
            record.history.push({
                at: record.updatedAt,
                event: 'send_blocked',
                reason: isRetryDispatch ? dispatchReason : normalizedReason,
                reasonCode: isRetryDispatch ? dispatchReasonCode : parsedReason.code,
                reasonContext: parsedReason.context ?? null,
                attempt: record.attempts,
                error: message
            });
            this._persistRecord(record);
            this._emitAudit('task_send_blocked', {
                taskId: record.taskId,
                target: record.target,
                attempt: record.attempts,
                reason: isRetryDispatch ? dispatchReason : normalizedReason,
                reasonCode: isRetryDispatch ? dispatchReasonCode : parsedReason.code,
                reasonContext: parsedReason.context ?? null,
                error: message,
                retryAfterMs: this._extractRetryHintMs(error)
            }, record.updatedAt);
            throw error;
        }

        try {
            await this.transport.send(record.target, record.request);
            record.status = 'dispatched';
            record.deadlineAt = sendAt + this.defaultTimeoutMs;
            record.nextRetryAt = null;
            record.lastError = null;
            lifecycle.consecutiveFailures = 0;
            this._recordCircuitSuccess(record.target, sendAt);
            this._setRetryLifecycleState(record, 'idle', sendAt, {
                reason: isRetryDispatch ? dispatchReason : normalizedReason,
                reasonCode: isRetryDispatch ? dispatchReasonCode : parsedReason.code,
                reasonContext: parsedReason.context ?? null,
                nextRetryAt: null
            });
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
        } catch (error) {
            const message = error?.message || 'Failed to dispatch task';
            lifecycle.consecutiveFailures += 1;
            const circuit = this._recordCircuitFailure(record.target, sendAt, message);
            record.lastError = message;
            record.updatedAt = safeNow(this.now);
            record.history.push({
                at: record.updatedAt,
                event: 'send_failed',
                attempt: record.attempts,
                error: message
            });
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
                cause: error,
                circuitState: circuit?.state || null,
                retryAfterMs: circuit?.retryAfterMs ?? null
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
            record.status = 'rejected';
            record.closedAt = receipt.timestamp;

            const rejectionContext = normalizeReasonContext(receipt.reason);
            const rejectionReason = rejectionContext && rejectionContext !== 'rejected_by_worker'
                ? formatReasonToken('rejected_by_worker', rejectionContext, 'rejected_by_worker')
                : 'rejected_by_worker';

            this._setRetryLifecycleState(record, 'terminalized', receipt.timestamp, {
                reason: rejectionReason,
                reasonCode: 'rejected_by_worker',
                reasonContext: rejectionContext,
                terminalReason: rejectionReason,
                terminalReasonCode: 'rejected_by_worker',
                terminalReasonContext: rejectionContext,
                terminalStatus: 'rejected',
                nextRetryAt: null,
                forceHistory: true
            });
            record.history.push({
                at: receipt.timestamp,
                event: 'rejected',
                reason: receipt.reason || 'rejected_by_worker',
                terminalReason: rejectionReason,
                reasonCode: 'rejected_by_worker',
                reasonContext: rejectionContext
            });
            this._persistRecord(record);
            this._emitAudit('task_rejected', {
                taskId: record.taskId,
                from: receipt.from,
                reason: rejectionReason,
                reasonCode: 'rejected_by_worker',
                reasonContext: rejectionContext
            }, receipt.timestamp);
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

        if (result.status === 'success') {
            record.status = 'completed';
        } else if (result.status === 'partial') {
            record.status = 'partial';
        } else {
            record.status = 'failed';
        }

        const lifecycle = this._setRetryLifecycleState(record, 'terminalized', result.completedAt, {
            reason: result.status,
            terminalReason: result.status,
            terminalStatus: record.status,
            nextRetryAt: null,
            forceHistory: true
        });

        record.history.push({
            at: result.completedAt,
            event: 'result',
            resultStatus: result.status,
            terminalReason: lifecycle?.terminalReason ?? null,
            reasonCode: lifecycle?.terminalReasonCode ?? null,
            reasonContext: lifecycle?.terminalReasonContext ?? null
        });
        this._persistRecord(record);
        this._emitAudit('task_result', {
            taskId: record.taskId,
            from: result.from,
            status: result.status,
            terminalReason: lifecycle?.terminalReason ?? null,
            reasonCode: lifecycle?.terminalReasonCode ?? null,
            reasonContext: lifecycle?.terminalReasonContext ?? null,
            terminalClassification: lifecycle?.terminalClassification ?? record.status
        }, result.completedAt);

        return true;
    }

    _isRetryBudgetExhausted(record) {
        this._normalizeRetryLifecycle(record);
        const attempts = safeNonNegativeInteger(record?.attempts, 0);
        const maxRetries = safeNonNegativeInteger(record?.maxRetries, this.maxRetries);
        return attempts > maxRetries;
    }

    _computeRetryDelayMs(record, reason = 'timeout') {
        const lifecycle = this._normalizeRetryLifecycle(record);
        const baseDelayMs = safeNonNegativeNumber(this.retryDelayMs, 0);
        if (baseDelayMs === 0) return 0;

        const maxDelayMs = safeNonNegativeNumber(this.maxRetryDelayMs, baseDelayMs);
        const exponent = Math.min(safeNonNegativeInteger(lifecycle?.scheduledCount, 0), 30);
        const strategyDelayMs = this.retryStrategy === 'fixed'
            ? baseDelayMs
            : baseDelayMs * (this.retryBackoffMultiplier ** exponent);

        const consecutiveFailures = safeNonNegativeInteger(lifecycle?.consecutiveFailures, 0);
        const failureMultiplier = 1 + Math.min(consecutiveFailures, 4) * 0.15;
        const reasonMultiplier = reason === 'transport_failure' || reason === 'approval_release_failed'
            ? 1.25
            : 1;

        const uncappedDelayMs = strategyDelayMs * failureMultiplier * reasonMultiplier;
        const cappedDelayMs = Math.min(maxDelayMs, uncappedDelayMs);

        if (cappedDelayMs === 0 || this.retryJitterRatio <= 0) {
            return Math.round(cappedDelayMs);
        }

        const minFactor = Math.max(0, 1 - this.retryJitterRatio);
        const maxFactor = 1 + this.retryJitterRatio;
        const unit = stableUnitInterval(
            `${record?.taskId}:${reason}:${lifecycle?.scheduledCount}:${consecutiveFailures}:${record?.attempts}:${record?.updatedAt ?? 0}`
        );
        const jitterFactor = minFactor + (maxFactor - minFactor) * unit;
        const jitteredDelayMs = cappedDelayMs * jitterFactor;

        return Math.min(maxDelayMs, Math.max(0, Math.round(jitteredDelayMs)));
    }

    _scheduleRetry(record, nowMs, reason = 'timeout', options = {}) {
        const lifecycle = this._normalizeRetryLifecycle(record);
        const scheduleReason = canonicalRetryScheduleReason(reason);
        const retryHintMs = this._extractRetryHintMs(options?.error);

        if (this._isRetryBudgetExhausted(record)) {
            const terminalReason = `retry_budget_exhausted:${scheduleReason}`;
            const status = scheduleReason === 'transport_failure' || scheduleReason === 'approval_release_failed'
                ? 'transport_error'
                : 'timed_out';

            this._terminalizeRecordForRetry(record, {
                nowMs,
                status,
                event: status === 'transport_error' ? 'transport_error' : 'timed_out',
                reason: terminalReason,
                auditEvent: status === 'transport_error' ? 'task_transport_error' : 'task_timed_out',
                auditPayload: {
                    error: record.lastError,
                    retryGuard: 'retry_budget_exhausted'
                }
            });
            return null;
        }

        if (this._isRetryCycleExhausted(record)) {
            const terminalReason = `retry_cycle_guard:${scheduleReason}`;
            const status = scheduleReason === 'transport_failure' || scheduleReason === 'approval_release_failed'
                ? 'transport_error'
                : 'timed_out';

            this._terminalizeRecordForRetry(record, {
                nowMs,
                status,
                event: status === 'transport_error' ? 'transport_error' : 'timed_out',
                reason: terminalReason,
                auditEvent: status === 'transport_error' ? 'task_transport_error' : 'task_timed_out',
                auditPayload: {
                    error: record.lastError,
                    retryGuard: 'retry_cycle_guard'
                }
            });
            return null;
        }

        const computedDelayMs = this._computeRetryDelayMs(record, scheduleReason);
        const delayMs = Number.isFinite(retryHintMs)
            ? Math.max(computedDelayMs, retryHintMs)
            : computedDelayMs;
        const nextRetryAt = nowMs + delayMs;

        lifecycle.scheduledCount += 1;
        lifecycle.lastReason = scheduleReason;
        lifecycle.lastReasonCode = scheduleReason;
        lifecycle.lastReasonContext = null;
        lifecycle.lastDelayMs = delayMs;
        lifecycle.nextRetryAt = nextRetryAt;

        record.status = 'retry_scheduled';
        record.nextRetryAt = nextRetryAt;
        record.updatedAt = nowMs;
        this._setRetryLifecycleState(record, 'scheduled', nowMs, {
            reason: scheduleReason,
            reasonCode: scheduleReason,
            delayMs,
            nextRetryAt,
            forceHistory: true
        });
        record.history.push({
            at: nowMs,
            event: 'retry_scheduled',
            reason: scheduleReason,
            reasonCode: scheduleReason,
            reasonContext: null,
            delayMs,
            retryHintMs: Number.isFinite(retryHintMs) ? retryHintMs : null,
            nextRetryAt,
            retryCount: lifecycle.scheduledCount
        });
        this._persistRecord(record);
        this._emitAudit('task_retry_scheduled', {
            taskId: record.taskId,
            target: record.target,
            reason: scheduleReason,
            reasonCode: scheduleReason,
            reasonContext: null,
            delayMs,
            retryHintMs: Number.isFinite(retryHintMs) ? retryHintMs : null,
            nextRetryAt,
            retryCount: lifecycle.scheduledCount,
            retryTransition: lifecycle.lastTransition ? clone(lifecycle.lastTransition) : null
        }, nowMs);

        return nextRetryAt;
    }

    async runMaintenance(nowMs = safeNow(this.now)) {
        const summary = {
            checked: 0,
            scheduledRetries: 0,
            retried: 0,
            timedOut: 0,
            transportFailures: 0,
            globalRetryBudgetDrops: 0
        };

        for (const record of this.tasks.values()) {
            if (!OPEN_STATUSES.has(record.status)) continue;
            this._normalizeRetryLifecycle(record);
            summary.checked++;

            const deadlineAt = Number.isFinite(record.deadlineAt) ? Number(record.deadlineAt) : 0;
            if (nowMs <= deadlineAt) continue;

            if (this._isRetryBudgetExhausted(record)) {
                this._terminalizeRecordForRetry(record, {
                    nowMs,
                    status: 'timed_out',
                    event: 'timed_out',
                    reason: 'retry_budget_exhausted:timeout',
                    auditEvent: 'task_timed_out',
                    auditPayload: {
                        retryGuard: 'retry_budget_exhausted'
                    }
                });
                summary.timedOut++;
                continue;
            }

            if (this._isRetryCycleExhausted(record)) {
                this._terminalizeRecordForRetry(record, {
                    nowMs,
                    status: 'timed_out',
                    event: 'timed_out',
                    reason: 'retry_cycle_guard:timeout',
                    auditEvent: 'task_timed_out',
                    auditPayload: {
                        retryGuard: 'retry_cycle_guard'
                    }
                });
                summary.timedOut++;
                continue;
            }

            if (record.nextRetryAt === null) {
                const scheduledAt = this._scheduleRetry(record, nowMs, 'timeout');
                if (scheduledAt !== null) {
                    summary.scheduledRetries++;
                } else if (record.status === 'timed_out') {
                    summary.timedOut++;
                } else if (record.status === 'transport_error') {
                    summary.transportFailures++;
                }
                continue;
            }

            if (nowMs < record.nextRetryAt) continue;

            try {
                await this._sendTask(record, 'timeout_retry');
                summary.retried++;
            } catch (error) {
                if (error instanceof TaskOrchestratorError && error.code === 'GLOBAL_RETRY_BUDGET_EXHAUSTED') {
                    this._terminalizeRecordForRetry(record, {
                        nowMs,
                        status: 'timed_out',
                        event: 'timed_out',
                        reason: 'retry_budget_exhausted:global_window',
                        auditEvent: 'task_timed_out',
                        auditPayload: {
                            retryGuard: 'global_retry_budget',
                            budget: error.details?.budget || null
                        }
                    });
                    summary.globalRetryBudgetDrops++;
                    summary.timedOut++;
                    continue;
                }

                summary.transportFailures++;
                this.logger.warn?.(
                    `[Swarm] Retry send failed for task ${record.taskId}: ${error.message}`
                );

                const scheduledAt = this._scheduleRetry(record, nowMs, 'transport_failure', {
                    error
                });
                if (scheduledAt !== null) {
                    summary.scheduledRetries++;
                } else if (record.status === 'timed_out') {
                    summary.timedOut++;
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

    getMetrics() {
        const metrics = {
            total: this.tasks.size,
            open: 0,
            terminal: 0,
            byStatus: {},
            avgAttempts: 0,
            retryStateCounts: {},
            retryScheduleReasonCounts: {},
            retryDispatchReasonCounts: {},
            terminalReasonCounts: {},
            globalRetryBudget: this._globalRetryBudgetSnapshot(safeNow(this.now)),
            circuits: {
                tracked: 0,
                closed: 0,
                open: 0,
                halfOpen: 0
            }
        };

        let attemptsTotal = 0;
        const retryStateCounts = {};
        const retryScheduleReasonCounts = {};
        const retryDispatchReasonCounts = {};
        const terminalReasonCounts = {};

        for (const record of this.tasks.values()) {
            const lifecycle = this._normalizeRetryLifecycle(record);
            attemptsTotal += safeNonNegativeNumber(record.attempts, 0);
            metrics.byStatus[record.status] = (metrics.byStatus[record.status] || 0) + 1;

            if (TERMINAL_STATUSES.has(record.status)) {
                metrics.terminal++;

                const terminalReasonKey = buildTerminalReasonCountKey(
                    lifecycle?.terminalReason,
                    lifecycle?.terminalReasonCode,
                    lifecycle?.terminalReasonContext,
                    normalizeReasonToken(record.status, 'unknown')
                );
                if (terminalReasonKey) {
                    terminalReasonCounts[terminalReasonKey] = safeNonNegativeInteger(
                        terminalReasonCounts[terminalReasonKey],
                        0
                    ) + 1;
                }
            } else {
                metrics.open++;
            }

            if (lifecycle?.state) {
                incrementTelemetryCounter(retryStateCounts, lifecycle.state);

                if (lifecycle.state === 'scheduled') {
                    incrementTelemetryCounter(
                        retryScheduleReasonCounts,
                        canonicalRetryScheduleReason(lifecycle.lastReasonCode ?? lifecycle.lastReason)
                    );
                }

                if (lifecycle.state === 'dispatching') {
                    incrementTelemetryCounter(
                        retryDispatchReasonCounts,
                        canonicalRetryDispatchReason(lifecycle.lastReasonCode ?? lifecycle.lastReason)
                    );
                }
            }
        }

        metrics.avgAttempts = this.tasks.size > 0
            ? Number((attemptsTotal / this.tasks.size).toFixed(2))
            : 0;
        metrics.retryStateCounts = sortNumericRecord(retryStateCounts);
        metrics.retryScheduleReasonCounts = sanitizeTelemetryCounterMap(
            retryScheduleReasonCounts,
            canonicalRetryScheduleReason
        );
        metrics.retryDispatchReasonCounts = sanitizeTelemetryCounterMap(
            retryDispatchReasonCounts,
            canonicalRetryDispatchReason
        );
        metrics.terminalReasonCounts = sortNumericRecord(terminalReasonCounts);
        metrics.circuits.tracked = this.circuits.size;
        for (const circuit of this.circuits.values()) {
            if (circuit.state === CIRCUIT_OPEN) metrics.circuits.open += 1;
            else if (circuit.state === CIRCUIT_HALF_OPEN) metrics.circuits.halfOpen += 1;
            else metrics.circuits.closed += 1;
        }

        return metrics;
    }
}
