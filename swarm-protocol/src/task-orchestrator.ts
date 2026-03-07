import { createHash, randomUUID } from 'crypto';
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
const IN_FLIGHT_STATUSES = new Set([
    'dispatched',
    'acknowledged'
]);

const APPROVAL_PENDING_STATUS = 'awaiting_approval';
const CIRCUIT_CLOSED = 'closed';
const CIRCUIT_OPEN = 'open';
const CIRCUIT_HALF_OPEN = 'half_open';
const DEFAULT_MAX_RETRY_DELAY_MULTIPLIER = 32;
const DEFAULT_MAX_RETRY_HINT_MS = 60_000;
const DEFAULT_RETRY_JITTER_RATIO = 0.2;
const DEFAULT_RETRY_HINT_JITTER_RATIO = 0;
const RETRY_CYCLE_GUARD_MULTIPLIER = 4;
const DEFAULT_GLOBAL_RETRY_BUDGET_RATIO = 0.2;
const DEFAULT_GLOBAL_RETRY_BUDGET_WINDOW_MS = 60_000;
const DEFAULT_GLOBAL_RETRY_BUDGET_MIN_BASE_REQUESTS = 5;
const DEFAULT_GLOBAL_RETRY_BUDGET_MIN_RETRIES = 1;
const DEFAULT_GLOBAL_RETRY_BUDGET_PRIORITY_RESERVE = Object.freeze({
    low: 0,
    normal: 0,
    high: 0,
    critical: 0
});
const TASK_PRIORITY_ORDER = Object.freeze({
    low: 0,
    normal: 1,
    high: 2,
    critical: 3
});
const DEFAULT_RETRY_THROTTLE_MAX_TOKENS = 10;
const DEFAULT_RETRY_THROTTLE_TOKEN_RATIO = 0.1;
const DEFAULT_RETRY_THROTTLE_THRESHOLD_RATIO = 0.5;
const DEFAULT_CIRCUIT_FAILURE_RATE_WINDOW_MS = 60_000;
const DEFAULT_CIRCUIT_FAILURE_RATE_MIN_SAMPLES = 10;
const DEFAULT_MIN_TASK_TIMEOUT_MS = 100;
const DEFAULT_TASK_TIMEOUT_MAX_MULTIPLIER = 8;
const TRANSIENT_REJECTION_REASON_MARKERS = [
    '429',
    '503',
    'overload',
    'overloaded',
    'busy',
    'throttle',
    'too_many_requests',
    'service_unavailable',
    'rate_limit',
    'rate-limit',
    'retry_after',
    'retry-after',
    'temporar',
    'unavailable',
    'try_again',
    'try-again',
    'queue_full',
    'queue-full',
    'capacity'
];

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
    ['approval_release', 'approval_release_failed'],
    ['circuit_open', 'target_circuit_open'],
    ['target_circuit_open', 'target_circuit_open'],
    ['worker_transient_rejection', 'worker_transient_rejection'],
    ['bulkhead', 'bulkhead_limit'],
    ['bulkhead_limit', 'bulkhead_limit'],
    ['retry_throttled', 'target_retry_throttled'],
    ['target_retry_throttled', 'target_retry_throttled']
]);

const RETRY_DISPATCH_REASON_BY_CODE = new Map([
    ['timeout_retry', 'timeout_retry'],
    ['timeout', 'timeout_retry'],
    ['transport_failure_retry', 'transport_failure_retry'],
    ['transport_failure', 'transport_failure_retry'],
    ['transport_error', 'transport_failure_retry'],
    ['approval_release_retry', 'approval_release_retry'],
    ['approval_release_failed', 'approval_release_retry'],
    ['approval_release', 'approval_release_retry'],
    ['target_circuit_open', 'target_circuit_open_retry'],
    ['target_circuit_open_retry', 'target_circuit_open_retry'],
    ['worker_transient_rejection', 'worker_transient_rejection_retry'],
    ['worker_transient_rejection_retry', 'worker_transient_rejection_retry'],
    ['bulkhead_limit', 'bulkhead_limit_retry'],
    ['bulkhead_limit_retry', 'bulkhead_limit_retry'],
    ['target_retry_throttled', 'target_retry_throttled_retry'],
    ['target_retry_throttled_retry', 'target_retry_throttled_retry']
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

function stableSerialize(value) {
    if (Array.isArray(value)) {
        return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
    }

    if (value && typeof value === 'object') {
        const entries = Object.entries(value)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, entryValue]) => `"${key}":${stableSerialize(entryValue)}`);
        return `{${entries.join(',')}}`;
    }

    return JSON.stringify(value);
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

function normalizeTaskPriority(value) {
    const normalized = normalizeReasonToken(value, 'normal');
    return Object.prototype.hasOwnProperty.call(TASK_PRIORITY_ORDER, normalized)
        ? normalized
        : 'normal';
}

function normalizePriorityReserveConfig(priorityReserve) {
    const normalized = {
        ...DEFAULT_GLOBAL_RETRY_BUDGET_PRIORITY_RESERVE
    };

    if (!priorityReserve || typeof priorityReserve !== 'object') {
        return normalized;
    }

    let total = 0;
    for (const priority of Object.keys(TASK_PRIORITY_ORDER)) {
        const value = Number(priorityReserve[priority]);
        const clamped = Number.isFinite(value) && value > 0
            ? Math.min(value, 1)
            : 0;
        normalized[priority] = clamped;
        total += clamped;
    }

    if (total > 1) {
        const scale = 1 / total;
        for (const priority of Object.keys(TASK_PRIORITY_ORDER)) {
            normalized[priority] = Number((normalized[priority] * scale).toFixed(4));
        }
    }

    return normalized;
}

function higherPriorityReserveFraction(priorityReserve, priority) {
    const normalizedPriority = normalizeTaskPriority(priority);
    const currentOrder = TASK_PRIORITY_ORDER[normalizedPriority];
    let fraction = 0;

    for (const [label, order] of Object.entries(TASK_PRIORITY_ORDER)) {
        if (order <= currentOrder) continue;
        fraction += Number(priorityReserve?.[label] || 0);
    }

    return Math.min(1, Math.max(0, fraction));
}

function safePositiveIntegerOrInfinity(value, fallback = Infinity) {
    if (value === null || value === undefined) return fallback;
    if (value === Infinity) return Infinity;
    if (Number.isFinite(value) && Number.isInteger(value) && value > 0) {
        return Number(value);
    }
    return fallback;
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

function normalizeRetrySafetyMode(value) {
    if (typeof value !== 'string') return 'auto';
    const normalized = normalizeReasonToken(value, 'auto');
    if (normalized === 'always' || normalized === 'auto' || normalized === 'require_explicit_idempotency') {
        return normalized;
    }
    return 'auto';
}

function normalizeConstraintTokens(constraints) {
    if (!Array.isArray(constraints)) return [];
    return constraints
        .filter((item) => typeof item === 'string' && item.trim())
        .map((item) => normalizeReasonToken(item, null))
        .filter(Boolean);
}

function getRetrySafetySignal(taskRequest) {
    const constraints = normalizeConstraintTokens(taskRequest?.constraints);
    const context = taskRequest?.context && typeof taskRequest.context === 'object'
        ? taskRequest.context
        : {};

    const hasConstraint = (token) => constraints.includes(token);
    const hasAnyConstraintPrefix = (prefix) => constraints.some((item) => item.startsWith(prefix));

    const contextIdempotent = typeof context.idempotent === 'boolean' ? context.idempotent : null;
    const contextRetrySafe = typeof context.retrySafe === 'boolean' ? context.retrySafe : null;
    const idempotencyKey = typeof context.idempotencyKey === 'string' && context.idempotencyKey.trim()
        ? context.idempotencyKey.trim()
        : null;

    if (
        contextIdempotent === false
        || contextRetrySafe === false
        || hasConstraint('non_idempotent')
        || hasConstraint('no_retry')
        || hasAnyConstraintPrefix('non_idempotent_')
    ) {
        return {
            safe: false,
            source: 'declared_non_idempotent'
        };
    }

    if (
        contextIdempotent === true
        || contextRetrySafe === true
        || Boolean(idempotencyKey)
        || hasConstraint('idempotent')
        || hasConstraint('retry_safe')
        || hasAnyConstraintPrefix('idempotent_')
    ) {
        return {
            safe: true,
            source: idempotencyKey ? 'idempotency_key' : 'declared_idempotent'
        };
    }

    return {
        safe: null,
        source: 'unknown'
    };
}

function parseRetryHintMsFromReason(reason, nowMs = Date.now()) {
    if (typeof reason !== 'string' || !reason.trim()) return null;
    const text = reason.trim();

    const explicitMsKeyMatch = text.match(/retry[_-]?after[_-]?ms\s*[:=]\s*(\d+)(?!\d)/i);
    if (explicitMsKeyMatch) return Number(explicitMsKeyMatch[1]);

    const explicitMsUnitMatch = text.match(/retry[_-]?after\s*[:=]\s*(\d+)\s*(?:ms|msec|millisecond|milliseconds)(?![A-Za-z])/i);
    if (explicitMsUnitMatch) return Number(explicitMsUnitMatch[1]);

    const secMatch = text.match(/retry[_-]?after\s*[:=]\s*(\d+)\s*(?:s|sec|secs|second|seconds)?(?![A-Za-z])/i);
    if (secMatch) return Number(secMatch[1]) * 1000;

    const dateMatch = text.match(/retry[_-]?after\s*[:=]\s*([A-Za-z]{3},\s*\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+GMT)/i);
    if (dateMatch) {
        const dateMs = Date.parse(dateMatch[1].trim());
        if (Number.isFinite(dateMs)) {
            return Math.max(0, dateMs - nowMs);
        }
    }

    const rateLimitResetMatch = text.match(/(?:^|[\s,;])rate[_-]?limit[_-]?reset\s*[:=]\s*(\d{1,13})(?!\d)/i);
    if (rateLimitResetMatch) {
        const rawValue = Number(rateLimitResetMatch[1]);
        if (Number.isFinite(rawValue) && rawValue >= 0) {
            if (rawValue >= 10_000_000_000) {
                return Math.max(0, rawValue - nowMs);
            }

            if (rawValue >= 1_000_000_000) {
                return Math.max(0, (rawValue * 1000) - nowMs);
            }

            return rawValue * 1000;
        }
    }

    const xRateLimitResetMatch = text.match(/(?:^|[\s,;])x[_-]?rate[_-]?limit[_-]?reset\s*[:=]\s*(\d{1,13})(?!\d)/i);
    if (xRateLimitResetMatch) {
        const epochSeconds = Number(xRateLimitResetMatch[1]);
        if (Number.isFinite(epochSeconds) && epochSeconds >= 0) {
            return Math.max(0, (epochSeconds * 1000) - nowMs);
        }
    }

    const rateLimitCombinedMatch = text.match(/(?:^|[\s,;])ratelimit\s*[:=]\s*[^;\n]*?\breset\s*=\s*(\d{1,13})(?!\d)/i);
    if (rateLimitCombinedMatch) {
        const rawValue = Number(rateLimitCombinedMatch[1]);
        if (Number.isFinite(rawValue) && rawValue >= 0) {
            if (rawValue >= 10_000_000_000) {
                return Math.max(0, rawValue - nowMs);
            }
            if (rawValue >= 1_000_000_000) {
                return Math.max(0, (rawValue * 1000) - nowMs);
            }
            return rawValue * 1000;
        }
    }

    return null;
}

function parseRetryAfterHeaderMs(value, nowMs = Date.now()) {
    if (value === null || value === undefined) return null;
    const text = String(value).trim();
    if (!text) return null;

    const seconds = Number(text);
    if (Number.isFinite(seconds) && seconds >= 0) {
        return seconds * 1000;
    }

    const dateMs = Date.parse(text);
    if (Number.isFinite(dateMs)) {
        return Math.max(0, dateMs - nowMs);
    }

    return null;
}

function parseRateLimitResetHeaderMs(value, nowMs = Date.now(), { treatSmallAsEpoch = false } = {}) {
    if (value === null || value === undefined) return null;

    const raw = Number(String(value).trim());
    if (!Number.isFinite(raw) || raw < 0) return null;

    if (raw >= 10_000_000_000) {
        return Math.max(0, raw - nowMs);
    }

    if (raw >= 1_000_000_000 || treatSmallAsEpoch) {
        return Math.max(0, (raw * 1000) - nowMs);
    }

    return raw * 1000;
}

function readHeaderValue(headers, key) {
    if (!headers) return null;
    const target = String(key).toLowerCase();

    if (typeof headers.get === 'function') {
        const value = headers.get(key) ?? headers.get(target);
        return value ?? null;
    }

    if (headers instanceof Map) {
        for (const [entryKey, entryValue] of headers.entries()) {
            if (String(entryKey).toLowerCase() === target) {
                return entryValue;
            }
        }
        return null;
    }

    if (typeof headers === 'object') {
        for (const [entryKey, entryValue] of Object.entries(headers)) {
            if (entryKey.toLowerCase() === target) {
                return entryValue;
            }
        }
    }

    return null;
}

function parseRetryHintMsFromHeaders(headers, nowMs = Date.now()) {
    if (!headers) return null;

    const retryAfterRaw = readHeaderValue(headers, 'retry-after');
    const retryAfterValue = Array.isArray(retryAfterRaw) ? retryAfterRaw[0] : retryAfterRaw;
    const retryAfterMs = parseRetryAfterHeaderMs(retryAfterValue, nowMs);
    if (Number.isFinite(retryAfterMs)) return retryAfterMs;

    const rateLimitResetRaw = readHeaderValue(headers, 'ratelimit-reset');
    const rateLimitResetValue = Array.isArray(rateLimitResetRaw) ? rateLimitResetRaw[0] : rateLimitResetRaw;
    const rateLimitResetMs = parseRateLimitResetHeaderMs(rateLimitResetValue, nowMs, {
        treatSmallAsEpoch: false
    });
    if (Number.isFinite(rateLimitResetMs)) return rateLimitResetMs;

    const xRateLimitResetRaw = readHeaderValue(headers, 'x-ratelimit-reset');
    const xRateLimitResetValue = Array.isArray(xRateLimitResetRaw) ? xRateLimitResetRaw[0] : xRateLimitResetRaw;
    const xRateLimitResetMs = parseRateLimitResetHeaderMs(xRateLimitResetValue, nowMs, {
        treatSmallAsEpoch: true
    });
    if (Number.isFinite(xRateLimitResetMs)) return xRateLimitResetMs;

    const rateLimitRaw = readHeaderValue(headers, 'ratelimit');
    const rateLimitValue = Array.isArray(rateLimitRaw) ? rateLimitRaw[0] : rateLimitRaw;
    if (rateLimitValue !== null && rateLimitValue !== undefined) {
        const parsedRateLimitMs = parseRetryHintMsFromReason(
            `RateLimit: ${String(rateLimitValue)}`,
            nowMs
        );
        if (Number.isFinite(parsedRateLimitMs)) return parsedRateLimitMs;
    }

    return null;
}

function parseTaskTimeoutHintMs(taskRequest) {
    if (!taskRequest || typeof taskRequest !== 'object') return null;

    const context = taskRequest.context && typeof taskRequest.context === 'object'
        ? taskRequest.context
        : null;

    const timeoutCandidates = [
        context?.timeoutMs,
        context?.timeout_ms,
        Number.isFinite(context?.timeoutSeconds) ? Number(context.timeoutSeconds) * 1000 : null,
        Number.isFinite(context?.timeout_s) ? Number(context.timeout_s) * 1000 : null
    ];

    for (const value of timeoutCandidates) {
        if (Number.isFinite(value) && value > 0) {
            return Number(value);
        }
    }

    if (!Array.isArray(taskRequest.constraints)) return null;
    for (const raw of taskRequest.constraints) {
        if (typeof raw !== 'string' || !raw.trim()) continue;

        const token = raw.trim();
        const msMatch = token.match(/^timeout[_-]?ms\s*[:=]\s*(\d+(?:\.\d+)?)$/i);
        if (msMatch) {
            return Number(msMatch[1]);
        }

        const genericMatch = token.match(/^timeout\s*[:=]\s*(\d+(?:\.\d+)?)\s*(ms|s|sec|secs|seconds?)?$/i);
        if (genericMatch) {
            const amount = Number(genericMatch[1]);
            const unit = (genericMatch[2] || 'ms').toLowerCase();
            return unit.startsWith('s') ? amount * 1000 : amount;
        }
    }

    return null;
}

function isTransientRejectionReason(reason) {
    const normalized = normalizeReasonToken(reason, null);
    if (!normalized) return false;
    return TRANSIENT_REJECTION_REASON_MARKERS.some((marker) => normalized.includes(marker));
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
    retryable,
    retryAfterMs,
    etaMs,
    timestamp = Date.now()
}) {
    return TaskReceipt.parse({
        kind: 'task_receipt',
        taskId,
        from,
        accepted,
        reason,
        retryable,
        retryAfterMs,
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
        maxRetryHintMs = null,
        retryJitterRatio = DEFAULT_RETRY_JITTER_RATIO,
        retryHintJitterRatio = DEFAULT_RETRY_HINT_JITTER_RATIO,
        globalRetryBudgetRatio = DEFAULT_GLOBAL_RETRY_BUDGET_RATIO,
        globalRetryBudgetWindowMs = DEFAULT_GLOBAL_RETRY_BUDGET_WINDOW_MS,
        globalRetryBudgetMinBaseRequests = DEFAULT_GLOBAL_RETRY_BUDGET_MIN_BASE_REQUESTS,
        globalRetryBudgetMinRetries = DEFAULT_GLOBAL_RETRY_BUDGET_MIN_RETRIES,
        globalRetryBudgetPriorityReserve = DEFAULT_GLOBAL_RETRY_BUDGET_PRIORITY_RESERVE,
        retryThrottleEnabled = false,
        retryThrottleMaxTokens = DEFAULT_RETRY_THROTTLE_MAX_TOKENS,
        retryThrottleTokenRatio = DEFAULT_RETRY_THROTTLE_TOKEN_RATIO,
        retryThrottleThresholdRatio = DEFAULT_RETRY_THROTTLE_THRESHOLD_RATIO,
        circuitBreakerEnabled = true,
        circuitFailureThreshold = 3,
        circuitFailureRateThreshold = null,
        circuitFailureRateWindowMs = DEFAULT_CIRCUIT_FAILURE_RATE_WINDOW_MS,
        circuitFailureRateMinSamples = DEFAULT_CIRCUIT_FAILURE_RATE_MIN_SAMPLES,
        circuitCooldownMs = 30_000,
        circuitHalfOpenMaxAttempts = 1,
        minTaskTimeoutMs = DEFAULT_MIN_TASK_TIMEOUT_MS,
        maxTaskTimeoutMs = null,
        maxInFlightPerTarget = null,
        maxInFlightGlobal = null,
        retrySafetyMode = 'auto',
        dedupeEnabled = false,
        dedupeMode = 'coalesce',
        dedupeWindowMs = 300_000,
        dedupeUseContentHash = true,
        resolveIdempotencyKey = null,
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
        const normalizedRetryStrategy = normalizeReasonToken(retryStrategy, 'exponential');
        this.retryStrategy = normalizedRetryStrategy === 'fixed'
            ? 'fixed'
            : normalizedRetryStrategy === 'full_jitter'
                ? 'full_jitter'
                : 'exponential';
        this.retryBackoffMultiplier = Number.isFinite(retryBackoffMultiplier) && retryBackoffMultiplier >= 1
            ? Number(retryBackoffMultiplier)
            : 2;
        const defaultMaxRetryDelayMs = this.retryDelayMs * DEFAULT_MAX_RETRY_DELAY_MULTIPLIER;
        this.maxRetryDelayMs = maxRetryDelayMs === null || maxRetryDelayMs === undefined
            ? defaultMaxRetryDelayMs
            : safeNonNegativeNumber(maxRetryDelayMs, defaultMaxRetryDelayMs);
        const defaultMaxRetryHintMs = Math.max(this.maxRetryDelayMs, DEFAULT_MAX_RETRY_HINT_MS);
        this.maxRetryHintMs = maxRetryHintMs === null || maxRetryHintMs === undefined
            ? defaultMaxRetryHintMs
            : safeNonNegativeNumber(maxRetryHintMs, defaultMaxRetryHintMs);
        this.retryJitterRatio = Number.isFinite(retryJitterRatio) && retryJitterRatio >= 0
            ? Math.min(Number(retryJitterRatio), 1)
            : DEFAULT_RETRY_JITTER_RATIO;
        this.retryHintJitterRatio = Number.isFinite(retryHintJitterRatio) && retryHintJitterRatio >= 0
            ? Math.min(Number(retryHintJitterRatio), 1)
            : DEFAULT_RETRY_HINT_JITTER_RATIO;
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
        this.globalRetryBudgetPriorityReserve = normalizePriorityReserveConfig(
            globalRetryBudgetPriorityReserve
        );
        this.retryThrottleEnabled = retryThrottleEnabled === true;
        this.retryThrottleMaxTokens = Number.isFinite(retryThrottleMaxTokens) && retryThrottleMaxTokens > 0
            ? Number(retryThrottleMaxTokens)
            : DEFAULT_RETRY_THROTTLE_MAX_TOKENS;
        this.retryThrottleTokenRatio = Number.isFinite(retryThrottleTokenRatio) && retryThrottleTokenRatio > 0
            ? Number(retryThrottleTokenRatio)
            : DEFAULT_RETRY_THROTTLE_TOKEN_RATIO;
        this.retryThrottleThresholdRatio = Number.isFinite(retryThrottleThresholdRatio) && retryThrottleThresholdRatio >= 0
            ? Math.min(Number(retryThrottleThresholdRatio), 1)
            : DEFAULT_RETRY_THROTTLE_THRESHOLD_RATIO;
        this.circuitBreakerEnabled = circuitBreakerEnabled !== false;
        this.circuitFailureThreshold = Number.isInteger(circuitFailureThreshold) && circuitFailureThreshold >= 1
            ? Number(circuitFailureThreshold)
            : 3;
        this.circuitFailureRateThreshold = Number.isFinite(circuitFailureRateThreshold)
            && circuitFailureRateThreshold > 0
            && circuitFailureRateThreshold <= 1
            ? Number(circuitFailureRateThreshold)
            : null;
        this.circuitFailureRateWindowMs = Number.isFinite(circuitFailureRateWindowMs)
            && circuitFailureRateWindowMs > 0
            ? Number(circuitFailureRateWindowMs)
            : DEFAULT_CIRCUIT_FAILURE_RATE_WINDOW_MS;
        this.circuitFailureRateMinSamples = Number.isInteger(circuitFailureRateMinSamples)
            && circuitFailureRateMinSamples > 0
            ? Number(circuitFailureRateMinSamples)
            : DEFAULT_CIRCUIT_FAILURE_RATE_MIN_SAMPLES;
        this.circuitCooldownMs = Number.isFinite(circuitCooldownMs) && circuitCooldownMs >= 0
            ? Number(circuitCooldownMs)
            : 30_000;
        this.circuitHalfOpenMaxAttempts = Number.isInteger(circuitHalfOpenMaxAttempts)
            && circuitHalfOpenMaxAttempts >= 1
            ? Number(circuitHalfOpenMaxAttempts)
            : 1;
        this.minTaskTimeoutMs = Number.isFinite(minTaskTimeoutMs) && minTaskTimeoutMs > 0
            ? Number(minTaskTimeoutMs)
            : DEFAULT_MIN_TASK_TIMEOUT_MS;
        const defaultMaxTaskTimeoutMs = Math.max(
            this.defaultTimeoutMs,
            this.defaultTimeoutMs * DEFAULT_TASK_TIMEOUT_MAX_MULTIPLIER
        );
        this.maxTaskTimeoutMs = maxTaskTimeoutMs === null || maxTaskTimeoutMs === undefined
            ? defaultMaxTaskTimeoutMs
            : safeNonNegativeNumber(maxTaskTimeoutMs, defaultMaxTaskTimeoutMs);
        if (this.maxTaskTimeoutMs < this.minTaskTimeoutMs) {
            this.maxTaskTimeoutMs = this.minTaskTimeoutMs;
        }
        this.maxInFlightPerTarget = safePositiveIntegerOrInfinity(maxInFlightPerTarget, Infinity);
        this.maxInFlightGlobal = safePositiveIntegerOrInfinity(maxInFlightGlobal, Infinity);
        this.retrySafetyMode = normalizeRetrySafetyMode(retrySafetyMode);
        this.dedupeEnabled = dedupeEnabled === true;
        this.dedupeMode = dedupeMode === 'reject' ? 'reject' : 'coalesce';
        this.dedupeWindowMs = Number.isFinite(dedupeWindowMs) && dedupeWindowMs > 0
            ? Number(dedupeWindowMs)
            : 300_000;
        this.dedupeUseContentHash = dedupeUseContentHash !== false;
        this.resolveIdempotencyKey = typeof resolveIdempotencyKey === 'function'
            ? resolveIdempotencyKey
            : null;
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.tasks = new Map();
        this.circuits = new Map();
        this.retryThrottleBuckets = new Map();
        this.dedupeIndex = new Map();
        this.dedupeSuppressions = 0;
        this.globalRetryBudgetEvents = [];
        this.retryHintClampCount = 0;
        this._persistenceQueue = Promise.resolve();
    }

    _pruneDedupeIndex(nowMs = safeNow(this.now)) {
        if (!this.dedupeEnabled || this.dedupeIndex.size === 0) return;

        for (const [key, entry] of this.dedupeIndex.entries()) {
            if (!entry || nowMs > entry.expiresAt) {
                this.dedupeIndex.delete(key);
                continue;
            }

            const record = this.tasks.get(entry.taskId);
            if (!record) {
                this.dedupeIndex.delete(key);
            }
        }
    }

    _extractIdempotencyKey(taskRequest) {
        const context = taskRequest?.context && typeof taskRequest.context === 'object'
            ? taskRequest.context
            : {};

        const contextCandidates = [
            context.idempotencyKey,
            context.idempotency_key,
            context.dedupeKey,
            context.deduplicationKey,
            context.requestKey
        ];

        for (const candidate of contextCandidates) {
            if (typeof candidate === 'string' && candidate.trim()) {
                return candidate.trim();
            }
        }

        if (Array.isArray(taskRequest?.constraints)) {
            for (const constraint of taskRequest.constraints) {
                if (typeof constraint !== 'string' || !constraint.trim()) continue;
                const match = constraint.match(
                    /\b(?:idempotency|idempotency_key|dedupe|dedupe_key|deduplication_key)\s*[:=]\s*([a-zA-Z0-9._:-]{4,})\b/i
                );
                if (match?.[1]) {
                    return match[1];
                }
            }
        }

        return null;
    }

    _resolveDedupeKey(taskRequest) {
        if (!this.dedupeEnabled || !taskRequest || typeof taskRequest !== 'object') {
            return null;
        }

        const customKey = this.resolveIdempotencyKey?.(taskRequest);
        if (typeof customKey === 'string' && customKey.trim()) {
            return `idempotency:${customKey.trim()}`;
        }

        const extracted = this._extractIdempotencyKey(taskRequest);
        if (typeof extracted === 'string' && extracted.trim()) {
            return `idempotency:${extracted.trim()}`;
        }

        if (!this.dedupeUseContentHash) {
            return null;
        }

        const digest = createHash('sha256')
            .update(
                stableSerialize({
                    target: taskRequest.target,
                    task: taskRequest.task,
                    priority: taskRequest.priority,
                    context: taskRequest.context || null,
                    constraints: taskRequest.constraints || null
                })
            )
            .digest('hex');
        return `content:${digest}`;
    }

    _registerDedupeForRecord(record, nowMs = safeNow(this.now)) {
        if (!this.dedupeEnabled || !record || typeof record !== 'object') return;

        if (typeof record.dedupeKey !== 'string' || !record.dedupeKey.trim()) {
            record.dedupeKey = this._resolveDedupeKey(record.request);
        }
        if (typeof record.dedupeKey !== 'string' || !record.dedupeKey) return;

        this.dedupeIndex.set(record.dedupeKey, {
            taskId: record.taskId,
            createdAt: nowMs,
            expiresAt: nowMs + this.dedupeWindowMs
        });
    }

    _findDedupedRecord(dedupeKey, nowMs = safeNow(this.now)) {
        if (!this.dedupeEnabled || typeof dedupeKey !== 'string' || !dedupeKey) {
            return null;
        }

        this._pruneDedupeIndex(nowMs);

        const entry = this.dedupeIndex.get(dedupeKey);
        if (!entry) return null;

        const record = this.tasks.get(entry.taskId);
        if (!record) {
            this.dedupeIndex.delete(dedupeKey);
            return null;
        }

        return record;
    }

    _resolveTaskTimeoutMs(taskRequest) {
        const hintMs = parseTaskTimeoutHintMs(taskRequest);
        if (!Number.isFinite(hintMs) || hintMs <= 0) {
            return this.defaultTimeoutMs;
        }

        return Math.max(
            this.minTaskTimeoutMs,
            Math.min(this.maxTaskTimeoutMs, Number(hintMs))
        );
    }

    _pruneGlobalRetryBudgetEvents(nowMs) {
        const earliest = nowMs - this.globalRetryBudgetWindowMs;
        this.globalRetryBudgetEvents = this.globalRetryBudgetEvents.filter(
            (event) => Number.isFinite(event?.at) && event.at >= earliest
        );
    }

    _recordGlobalRetryBudgetEvent(kind, at, priority = 'normal') {
        this.globalRetryBudgetEvents.push({
            kind,
            at,
            priority: normalizeTaskPriority(priority)
        });
        this._pruneGlobalRetryBudgetEvents(at);
    }

    _globalRetryBudgetSnapshot(nowMs) {
        this._pruneGlobalRetryBudgetEvents(nowMs);

        let baseDispatches = 0;
        let retryDispatches = 0;
        const retryDispatchesByPriority = {
            low: 0,
            normal: 0,
            high: 0,
            critical: 0
        };
        for (const event of this.globalRetryBudgetEvents) {
            if (event.kind === 'base_dispatch') {
                baseDispatches += 1;
            } else if (event.kind === 'retry_dispatch') {
                retryDispatches += 1;
                const priority = normalizeTaskPriority(event.priority);
                retryDispatchesByPriority[priority] += 1;
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
            priorityReserve: clone(this.globalRetryBudgetPriorityReserve),
            baseDispatches,
            retryDispatches,
            retryDispatchesByPriority,
            allowedRetryDispatches,
            remainingRetryDispatches,
            exhausted,
            warmupBypassed
        };
    }

    _canConsumeGlobalRetryBudget(nowMs, priority = 'normal') {
        const snapshot = this._globalRetryBudgetSnapshot(nowMs);
        if (snapshot.exhausted) {
            return {
                allowed: false,
                snapshot,
                reason: 'window_exhausted'
            };
        }

        const normalizedPriority = normalizeTaskPriority(priority);
        if (Number.isFinite(snapshot.allowedRetryDispatches)) {
            const reservedFraction = higherPriorityReserveFraction(
                this.globalRetryBudgetPriorityReserve,
                normalizedPriority
            );
            const reservedSlots = Math.ceil(snapshot.allowedRetryDispatches * reservedFraction);
            const maxDispatchesForPriority = Math.max(0, snapshot.allowedRetryDispatches - reservedSlots);

            if (snapshot.retryDispatches >= maxDispatchesForPriority) {
                return {
                    allowed: false,
                    snapshot: {
                        ...snapshot,
                        priorityRequest: normalizedPriority,
                        priorityReserveFraction: reservedFraction,
                        reservedSlots,
                        maxDispatchesForPriority
                    },
                    reason: 'priority_reserve'
                };
            }
        }

        this._recordGlobalRetryBudgetEvent('retry_dispatch', nowMs, normalizedPriority);
        return {
            allowed: true,
            snapshot: this._globalRetryBudgetSnapshot(nowMs)
        };
    }

    _getRetryThrottleBucket(target) {
        if (!this.retryThrottleEnabled || typeof target !== 'string' || !target.trim()) {
            return null;
        }

        const existing = this.retryThrottleBuckets.get(target);
        if (existing) return existing;

        const bucket = {
            target,
            tokens: this.retryThrottleMaxTokens,
            lastUpdatedAt: null
        };
        this.retryThrottleBuckets.set(target, bucket);
        return bucket;
    }

    _retryThrottleThresholdTokens() {
        return this.retryThrottleMaxTokens * this.retryThrottleThresholdRatio;
    }

    _recordRetryThrottleFailure(target, nowMs) {
        const bucket = this._getRetryThrottleBucket(target);
        if (!bucket) return null;

        bucket.tokens = Math.max(0, bucket.tokens - 1);
        bucket.lastUpdatedAt = nowMs;
        return {
            target: bucket.target,
            tokens: bucket.tokens,
            threshold: this._retryThrottleThresholdTokens(),
            maxTokens: this.retryThrottleMaxTokens,
            tokenRatio: this.retryThrottleTokenRatio
        };
    }

    _recordRetryThrottleSuccess(target, nowMs) {
        const bucket = this._getRetryThrottleBucket(target);
        if (!bucket) return null;

        bucket.tokens = Math.min(this.retryThrottleMaxTokens, bucket.tokens + this.retryThrottleTokenRatio);
        bucket.lastUpdatedAt = nowMs;
        return {
            target: bucket.target,
            tokens: bucket.tokens,
            threshold: this._retryThrottleThresholdTokens(),
            maxTokens: this.retryThrottleMaxTokens,
            tokenRatio: this.retryThrottleTokenRatio
        };
    }

    _canRetryDispatchForTarget(target, nowMs) {
        const bucket = this._getRetryThrottleBucket(target);
        if (!bucket) {
            return {
                allowed: true,
                bucket: null
            };
        }

        const threshold = this._retryThrottleThresholdTokens();
        const allowed = bucket.tokens > threshold;
        return {
            allowed,
            bucket: {
                target: bucket.target,
                tokens: bucket.tokens,
                threshold,
                maxTokens: this.retryThrottleMaxTokens,
                tokenRatio: this.retryThrottleTokenRatio,
                lastUpdatedAt: bucket.lastUpdatedAt,
                at: nowMs
            }
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
            this.dedupeIndex.clear();
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
            this._registerDedupeForRecord(hydrated, safeNonNegativeNumber(hydrated.createdAt, safeNow(this.now)));

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
            halfOpenAttempts: 0,
            outcomes: []
        };
        this.circuits.set(target, circuit);
        return circuit;
    }

    _countInFlightTasks({ target = null, excludeTaskId = null } = {}) {
        let count = 0;
        for (const record of this.tasks.values()) {
            if (!record || typeof record !== 'object') continue;
            if (excludeTaskId && record.taskId === excludeTaskId) continue;
            if (target && record.target !== target) continue;
            if (!IN_FLIGHT_STATUSES.has(record.status)) continue;
            count += 1;
        }
        return count;
    }

    _assertBulkheadCapacity(record, nowMs) {
        if (!Number.isFinite(this.maxInFlightGlobal) && !Number.isFinite(this.maxInFlightPerTarget)) {
            return;
        }

        const globalInFlight = this._countInFlightTasks({ excludeTaskId: record.taskId });
        const targetInFlight = this._countInFlightTasks({
            target: record.target,
            excludeTaskId: record.taskId
        });
        const globalExceeded = Number.isFinite(this.maxInFlightGlobal) && globalInFlight >= this.maxInFlightGlobal;
        const targetExceeded = Number.isFinite(this.maxInFlightPerTarget) && targetInFlight >= this.maxInFlightPerTarget;

        if (!globalExceeded && !targetExceeded) {
            return;
        }

        const scope = globalExceeded ? 'global' : 'target';
        this._emitAudit('task_bulkhead_blocked', {
            taskId: record.taskId,
            target: record.target,
            scope,
            globalInFlight,
            targetInFlight,
            maxInFlightGlobal: Number.isFinite(this.maxInFlightGlobal) ? this.maxInFlightGlobal : null,
            maxInFlightPerTarget: Number.isFinite(this.maxInFlightPerTarget) ? this.maxInFlightPerTarget : null
        }, nowMs);

        throw new TaskOrchestratorError(
            'BULKHEAD_LIMIT_EXCEEDED',
            `In-flight limit reached (${scope}) for target ${record.target}`,
            {
                scope,
                target: record.target,
                globalInFlight,
                targetInFlight,
                maxInFlightGlobal: Number.isFinite(this.maxInFlightGlobal) ? this.maxInFlightGlobal : null,
                maxInFlightPerTarget: Number.isFinite(this.maxInFlightPerTarget) ? this.maxInFlightPerTarget : null,
                retryAfterMs: this.retryDelayMs
            }
        );
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

    _pruneCircuitOutcomes(circuit, nowMs) {
        if (!circuit || !Array.isArray(circuit.outcomes)) return;
        if (this.circuitFailureRateThreshold === null) {
            circuit.outcomes = [];
            return;
        }

        const cutoff = nowMs - this.circuitFailureRateWindowMs;
        while (circuit.outcomes.length > 0 && circuit.outcomes[0].at < cutoff) {
            circuit.outcomes.shift();
        }
    }

    _recordCircuitOutcome(circuit, nowMs, success) {
        if (!circuit || !Array.isArray(circuit.outcomes)) return;
        if (this.circuitFailureRateThreshold === null) return;

        circuit.outcomes.push({
            at: nowMs,
            success: success === true
        });
        this._pruneCircuitOutcomes(circuit, nowMs);
    }

    _getCircuitFailureRate(circuit, nowMs = safeNow(this.now)) {
        if (!circuit || !Array.isArray(circuit.outcomes)) {
            return {
                sampleCount: 0,
                failureCount: 0,
                failureRate: null
            };
        }

        this._pruneCircuitOutcomes(circuit, nowMs);
        const sampleCount = circuit.outcomes.length;
        if (sampleCount === 0) {
            return {
                sampleCount: 0,
                failureCount: 0,
                failureRate: null
            };
        }

        const failureCount = circuit.outcomes.reduce(
            (sum, entry) => sum + (entry.success ? 0 : 1),
            0
        );
        return {
            sampleCount,
            failureCount,
            failureRate: failureCount / sampleCount
        };
    }

    _recordCircuitFailure(target, nowMs, reason) {
        const circuit = this._getCircuit(target);
        if (!circuit) return null;

        this._recordCircuitOutcome(circuit, nowMs, false);
        circuit.consecutiveFailures += 1;
        const failureRateWindow = this._getCircuitFailureRate(circuit, nowMs);
        const thresholdByRate = this.circuitFailureRateThreshold !== null
            && failureRateWindow.sampleCount >= this.circuitFailureRateMinSamples
            && failureRateWindow.failureRate >= this.circuitFailureRateThreshold;
        const shouldOpen = circuit.state === CIRCUIT_HALF_OPEN
            || circuit.consecutiveFailures >= this.circuitFailureThreshold
            || thresholdByRate;
        if (!shouldOpen) {
            return {
                state: circuit.state,
                consecutiveFailures: circuit.consecutiveFailures,
                retryAfterMs: null,
                failureRateWindow
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
                cooldownMs: this.circuitCooldownMs,
                trigger: thresholdByRate ? 'failure_rate' : 'consecutive_failures',
                failureRateWindow
            }, nowMs);
        }

        return {
            state: circuit.state,
            consecutiveFailures: circuit.consecutiveFailures,
            retryAfterMs: this.circuitCooldownMs,
            failureRateWindow
        };
    }

    _recordCircuitSuccess(target, nowMs) {
        const circuit = this._getCircuit(target);
        if (!circuit) return;

        this._recordCircuitOutcome(circuit, nowMs, true);
        const previousState = circuit.state;
        const previousFailures = circuit.consecutiveFailures;
        circuit.state = CIRCUIT_CLOSED;
        circuit.consecutiveFailures = 0;
        circuit.openedAt = null;
        circuit.halfOpenAttempts = 0;
        if (previousState !== CIRCUIT_CLOSED) {
            circuit.outcomes = [];
        }

        if (previousState !== CIRCUIT_CLOSED || previousFailures > 0) {
            this._emitAudit('circuit_closed', {
                target,
                previousState,
                previousFailures
            }, nowMs);
        }
    }

    _extractRetryHintMs(error) {
        const nowMs = safeNow(this.now);
        const visited = new Set();
        let current = error;

        while (current && typeof current === 'object' && !visited.has(current)) {
            visited.add(current);

            const direct = Number(current.retryAfterMs);
            if (Number.isFinite(direct) && direct >= 0) return direct;

            const detailsHint = Number(current?.details?.retryAfterMs);
            if (Number.isFinite(detailsHint) && detailsHint >= 0) return detailsHint;

            const headerHint = parseRetryHintMsFromHeaders(current?.headers, nowMs)
                ?? parseRetryHintMsFromHeaders(current?.response?.headers, nowMs)
                ?? parseRetryHintMsFromHeaders(current?.details?.headers, nowMs);
            if (Number.isFinite(headerHint) && headerHint >= 0) return headerHint;

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

        const dedupeKey = this._resolveDedupeKey(request);
        if (dedupeKey) {
            const duplicateRecord = this._findDedupedRecord(dedupeKey, request.createdAt);
            if (duplicateRecord) {
                this.dedupeSuppressions += 1;
                this._emitAudit('task_deduplicated', {
                    taskId: request.id,
                    duplicateOf: duplicateRecord.taskId,
                    target: request.target,
                    mode: this.dedupeMode,
                    dedupeKey
                }, request.createdAt);

                if (this.dedupeMode === 'reject') {
                    throw new TaskOrchestratorError(
                        'DUPLICATE_TASK',
                        `Task ${request.id} deduplicated against existing task ${duplicateRecord.taskId}`,
                        {
                            taskId: request.id,
                            duplicateOf: duplicateRecord.taskId,
                            dedupeKey
                        }
                    );
                }

                return this.getTask(duplicateRecord.taskId);
            }
        }

        const taskTimeoutMs = this._resolveTaskTimeoutMs(request);
        const record = {
            taskId: request.id,
            target: request.target,
            request,
            dedupeKey,
            taskTimeoutMs,
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
            deadlineAt: request.createdAt + taskTimeoutMs,
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
        this._registerDedupeForRecord(record, request.createdAt);
        this._persistRecord(record);
        this._emitAudit('task_created', {
            taskId: record.taskId,
            target: record.target,
            status: record.status,
            priority: record.request.priority,
            policyRedactions: record.policy?.redactions?.length || 0,
            taskTimeoutMs: record.taskTimeoutMs
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
            if (error instanceof TaskOrchestratorError) {
                if (error.code === 'CIRCUIT_OPEN' || error.code === 'BULKHEAD_LIMIT_EXCEEDED') {
                    const nowMs = safeNow(this.now);
                    const scheduleReason = error.code === 'CIRCUIT_OPEN'
                        ? 'target_circuit_open'
                        : 'bulkhead_limit';
                    this._scheduleRetry(record, nowMs, scheduleReason, { error });
                    return this.getTask(record.taskId);
                }
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

            const scheduleReason = error instanceof TaskOrchestratorError && error.code === 'CIRCUIT_OPEN'
                ? 'target_circuit_open'
                : error instanceof TaskOrchestratorError && error.code === 'BULKHEAD_LIMIT_EXCEEDED'
                    ? 'bulkhead_limit'
                    : 'approval_release_failed';

            this._scheduleRetry(record, reviewedAt, scheduleReason, {
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
        const requestPriority = normalizeTaskPriority(record?.request?.priority);
        const isRetryDispatch = (
            reason === 'timeout_retry'
            || reason === 'transport_failure_retry'
            || reason === 'approval_release_failed'
            || reason === 'approval_release_retry'
        );
        if (isRetryDispatch) {
            const throttleDecision = this._canRetryDispatchForTarget(record.target, sendAt);
            if (!throttleDecision.allowed) {
                throw new TaskOrchestratorError(
                    'RETRY_THROTTLED',
                    `Retry throttled for target ${record.target}`,
                    {
                        retryAfterMs: this.retryDelayMs,
                        retryThrottle: throttleDecision.bucket
                    }
                );
            }
        }

        if (isRetryDispatch) {
            const budgetDecision = this._canConsumeGlobalRetryBudget(sendAt, requestPriority);
            if (!budgetDecision.allowed) {
                throw new TaskOrchestratorError(
                    'GLOBAL_RETRY_BUDGET_EXHAUSTED',
                    'Global retry budget exhausted',
                    {
                        reason: budgetDecision.reason || 'window_exhausted',
                        budget: budgetDecision.snapshot
                    }
                );
            }
        } else {
            this._recordGlobalRetryBudgetEvent('base_dispatch', sendAt, requestPriority);
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
            this._assertBulkheadCapacity(record, sendAt);
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
            const timeoutBudgetMs = Number.isFinite(record.taskTimeoutMs) && record.taskTimeoutMs > 0
                ? Number(record.taskTimeoutMs)
                : this.defaultTimeoutMs;
            record.deadlineAt = sendAt + timeoutBudgetMs;
            record.nextRetryAt = null;
            record.lastError = null;
            lifecycle.consecutiveFailures = 0;
            this._recordRetryThrottleSuccess(record.target, sendAt);
            const circuit = this._getCircuit(record.target);
            if (circuit && (circuit.state === CIRCUIT_HALF_OPEN || !isRetryDispatch)) {
                this._recordCircuitSuccess(record.target, sendAt);
            }
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
            const retryThrottle = this._recordRetryThrottleFailure(record.target, sendAt);
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
                retryAfterMs: circuit?.retryAfterMs ?? null,
                retryThrottle
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
            const etaHintMs = Number.isFinite(receipt.etaMs) ? Number(receipt.etaMs) : null;
            const reasonHintMs = parseRetryHintMsFromReason(receipt.reason, receipt.timestamp);
            const structuredHintMs = Number.isFinite(receipt.retryAfterMs) ? Number(receipt.retryAfterMs) : null;
            const retryHints = [etaHintMs, reasonHintMs, structuredHintMs]
                .filter((value) => Number.isFinite(value));
            const retryHintMs = retryHints.length > 0
                ? Math.max(...retryHints)
                : null;
            const transientRejection = Number.isFinite(retryHintMs)
                || receipt.retryable === true
                || isTransientRejectionReason(receipt.reason);

            if (transientRejection) {
                const retryThrottle = this._recordRetryThrottleFailure(
                    record.target,
                    receipt.timestamp
                );
                const circuit = this._recordCircuitFailure(
                    record.target,
                    receipt.timestamp,
                    receipt.reason || 'worker_transient_rejection'
                );
                const scheduledAt = this._scheduleRetry(
                    record,
                    receipt.timestamp,
                    'worker_transient_rejection',
                    {
                        retryHintMs
                    }
                );
                if (scheduledAt !== null) {
                    this._emitAudit('task_rejected_retry_scheduled', {
                        taskId: record.taskId,
                        from: receipt.from,
                        reason: receipt.reason || 'worker_transient_rejection',
                        reasonCode: 'worker_transient_rejection',
                        reasonContext: normalizeReasonContext(receipt.reason),
                        nextRetryAt: scheduledAt,
                        retryThrottle,
                        circuitState: circuit?.state || null
                    }, receipt.timestamp);
                    return true;
                }
            }

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
            const timeoutBudgetMs = Number.isFinite(record.taskTimeoutMs) && record.taskTimeoutMs > 0
                ? Number(record.taskTimeoutMs)
                : this.defaultTimeoutMs;
            const etaDeadlineAt = receipt.timestamp + Number(receipt.etaMs);
            const budgetDeadlineAt = receipt.timestamp + timeoutBudgetMs;
            record.deadlineAt = Math.min(etaDeadlineAt, budgetDeadlineAt);
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

    _isRetryAllowedBySafety(record) {
        const signal = getRetrySafetySignal(record?.request);
        if (this.retrySafetyMode === 'always') {
            return {
                allowed: true,
                signal
            };
        }

        if (signal.safe === false) {
            return {
                allowed: false,
                signal
            };
        }

        if (this.retrySafetyMode === 'require_explicit_idempotency') {
            return {
                allowed: signal.safe === true,
                signal
            };
        }

        return {
            allowed: true,
            signal
        };
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
            : reason === 'target_retry_throttled'
                ? 1.5
            : 1;

        const uncappedDelayMs = strategyDelayMs * failureMultiplier * reasonMultiplier;
        const cappedDelayMs = Math.min(maxDelayMs, uncappedDelayMs);

        const jitterSeed = `${record?.taskId}:${reason}:${lifecycle?.scheduledCount}:${consecutiveFailures}:${record?.attempts}:${record?.updatedAt ?? 0}`;
        if (this.retryStrategy === 'full_jitter') {
            const unit = stableUnitInterval(jitterSeed);
            return Math.min(maxDelayMs, Math.max(0, Math.round(cappedDelayMs * unit)));
        }

        if (cappedDelayMs === 0 || this.retryJitterRatio <= 0) {
            return Math.round(cappedDelayMs);
        }

        const minFactor = Math.max(0, 1 - this.retryJitterRatio);
        const maxFactor = 1 + this.retryJitterRatio;
        const unit = stableUnitInterval(jitterSeed);
        const jitterFactor = minFactor + (maxFactor - minFactor) * unit;
        const jitteredDelayMs = cappedDelayMs * jitterFactor;

        return Math.min(maxDelayMs, Math.max(0, Math.round(jitteredDelayMs)));
    }

    _scheduleRetry(record, nowMs, reason = 'timeout', options = {}) {
        const lifecycle = this._normalizeRetryLifecycle(record);
        const scheduleReason = canonicalRetryScheduleReason(reason);
        const directRetryHintMs = Number(options?.retryHintMs);
        const rawRetryHintMs = Number.isFinite(directRetryHintMs) && directRetryHintMs >= 0
            ? directRetryHintMs
            : this._extractRetryHintMs(options?.error);
        const retryHintMs = Number.isFinite(rawRetryHintMs)
            ? Math.min(rawRetryHintMs, this.maxRetryHintMs)
            : null;
        const retryHintClamped = Number.isFinite(rawRetryHintMs)
            && Number.isFinite(retryHintMs)
            && retryHintMs < rawRetryHintMs;
        const retrySafety = this._isRetryAllowedBySafety(record);

        if (!retrySafety.allowed) {
            this._terminalizeRecordForRetry(record, {
                nowMs,
                status: 'failed',
                event: 'retry_blocked_non_idempotent',
                reason: 'failed:retry_unsafe_non_idempotent',
                auditEvent: 'task_retry_blocked_non_idempotent',
                auditPayload: {
                    retryGuard: 'idempotency_safety',
                    retrySafetyMode: this.retrySafetyMode,
                    retrySafetySignal: retrySafety.signal?.source || 'unknown',
                    blockedReason: scheduleReason
                }
            });
            return null;
        }

        const bypassRetryBudget = scheduleReason === 'target_circuit_open'
            || scheduleReason === 'bulkhead_limit'
            || scheduleReason === 'target_retry_throttled';

        if (!bypassRetryBudget && this._isRetryBudgetExhausted(record)) {
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
        const baseDelayMs = Number.isFinite(retryHintMs)
            ? Math.max(computedDelayMs, retryHintMs)
            : computedDelayMs;
        const hintJitterWindowMs = Number.isFinite(retryHintMs) && this.retryHintJitterRatio > 0
            ? Math.max(0, Math.round(Number(retryHintMs) * this.retryHintJitterRatio))
            : 0;
        const hintJitterMs = hintJitterWindowMs > 0
            ? Math.round(
                hintJitterWindowMs
                * stableUnitInterval(
                    `${record?.taskId}:${scheduleReason}:${safeNonNegativeInteger(lifecycle?.scheduledCount, 0)}:${record?.attempts}:${nowMs}:hint-jitter`
                )
            )
            : 0;
        const delayMs = baseDelayMs + hintJitterMs;
        const nextRetryAt = nowMs + delayMs;
        if (retryHintClamped) {
            this.retryHintClampCount += 1;
            this._emitAudit('task_retry_hint_clamped', {
                taskId: record.taskId,
                target: record.target,
                reason: scheduleReason,
                rawRetryHintMs,
                maxRetryHintMs: this.maxRetryHintMs,
                appliedRetryHintMs: retryHintMs
            }, nowMs);
        }

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
            hintJitterMs,
            retryHintMs: Number.isFinite(retryHintMs) ? retryHintMs : null,
            retryHintOriginalMs: Number.isFinite(rawRetryHintMs) ? rawRetryHintMs : null,
            retryHintClamped,
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
            hintJitterMs,
            retryHintMs: Number.isFinite(retryHintMs) ? retryHintMs : null,
            retryHintOriginalMs: Number.isFinite(rawRetryHintMs) ? rawRetryHintMs : null,
            retryHintClamped,
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
            globalRetryBudgetDrops: 0,
            retrySafetyDrops: 0,
            blockedRetries: 0,
            blockedByCircuit: 0,
            blockedByBulkhead: 0,
            blockedByRetryThrottle: 0
        };

        for (const record of this.tasks.values()) {
            if (!OPEN_STATUSES.has(record.status)) continue;
            this._normalizeRetryLifecycle(record);
            summary.checked++;

            if (record.status === 'retry_scheduled' && Number.isFinite(record.nextRetryAt)) {
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

                    const isCircuitBlocked = error instanceof TaskOrchestratorError && error.code === 'CIRCUIT_OPEN';
                    const isBulkheadBlocked = error instanceof TaskOrchestratorError
                        && error.code === 'BULKHEAD_LIMIT_EXCEEDED';
                    const isRetryThrottled = error instanceof TaskOrchestratorError
                        && error.code === 'RETRY_THROTTLED';

                    if (isCircuitBlocked || isBulkheadBlocked || isRetryThrottled) {
                        summary.blockedRetries++;
                        if (isCircuitBlocked) summary.blockedByCircuit++;
                        if (isBulkheadBlocked) summary.blockedByBulkhead++;
                        if (isRetryThrottled) summary.blockedByRetryThrottle++;

                        const scheduledAt = this._scheduleRetry(
                            record,
                            nowMs,
                            isCircuitBlocked
                                ? 'target_circuit_open'
                                : isBulkheadBlocked
                                    ? 'bulkhead_limit'
                                    : 'target_retry_throttled',
                            { error }
                        );
                        if (scheduledAt !== null) {
                            summary.scheduledRetries++;
                        } else if (record.status === 'timed_out') {
                            summary.timedOut++;
                        } else if (record.status === 'transport_error') {
                            summary.transportFailures++;
                        }
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
                    } else if (record.status === 'failed') {
                        summary.retrySafetyDrops++;
                    }
                }
                continue;
            }

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
                } else if (record.status === 'failed') {
                    summary.retrySafetyDrops++;
                }
                continue;
            }

            if (nowMs < record.nextRetryAt) continue;
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
        this._pruneDedupeIndex();
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
                enabled: this.circuitBreakerEnabled,
                tracked: 0,
                closed: 0,
                open: 0,
                halfOpen: 0,
                failureThreshold: this.circuitFailureThreshold,
                failureRateThreshold: this.circuitFailureRateThreshold,
                failureRateWindowMs: this.circuitFailureRateWindowMs,
                failureRateMinSamples: this.circuitFailureRateMinSamples,
                rateHotTargets: 0
            },
            inFlight: {
                current: 0,
                globalLimit: Number.isFinite(this.maxInFlightGlobal) ? this.maxInFlightGlobal : null,
                perTargetLimit: Number.isFinite(this.maxInFlightPerTarget) ? this.maxInFlightPerTarget : null,
                saturatedTargets: 0
            },
            retryThrottle: {
                enabled: this.retryThrottleEnabled,
                maxTokens: this.retryThrottleMaxTokens,
                tokenRatio: this.retryThrottleTokenRatio,
                thresholdRatio: this.retryThrottleThresholdRatio,
                trackedTargets: 0,
                throttledTargets: 0
            },
            retryHint: {
                maxHintMs: this.maxRetryHintMs,
                clampCount: this.retryHintClampCount,
                jitterRatio: this.retryHintJitterRatio
            },
            taskTimeout: {
                defaultMs: this.defaultTimeoutMs,
                minMs: this.minTaskTimeoutMs,
                maxMs: this.maxTaskTimeoutMs
            },
            dedupe: {
                enabled: this.dedupeEnabled,
                mode: this.dedupeMode,
                windowMs: this.dedupeWindowMs,
                trackedKeys: this.dedupeIndex.size,
                suppressions: this.dedupeSuppressions
            }
        };

        let attemptsTotal = 0;
        const retryStateCounts = {};
        const retryScheduleReasonCounts = {};
        const retryDispatchReasonCounts = {};
        const terminalReasonCounts = {};
        const inFlightByTarget = {};

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

            if (IN_FLIGHT_STATUSES.has(record.status) && typeof record.target === 'string' && record.target) {
                inFlightByTarget[record.target] = safeNonNegativeInteger(inFlightByTarget[record.target], 0) + 1;
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
        metrics.inFlight.current = Object.values(inFlightByTarget).reduce(
            (sum, value) => sum + safeNonNegativeInteger(value, 0),
            0
        );
        if (Number.isFinite(this.maxInFlightPerTarget)) {
            for (const count of Object.values(inFlightByTarget)) {
                if (safeNonNegativeInteger(count, 0) >= this.maxInFlightPerTarget) {
                    metrics.inFlight.saturatedTargets += 1;
                }
            }
        }
        metrics.circuits.tracked = this.circuits.size;
        for (const circuit of this.circuits.values()) {
            if (circuit.state === CIRCUIT_OPEN) metrics.circuits.open += 1;
            else if (circuit.state === CIRCUIT_HALF_OPEN) metrics.circuits.halfOpen += 1;
            else metrics.circuits.closed += 1;

            if (this.circuitFailureRateThreshold !== null) {
                const window = this._getCircuitFailureRate(circuit);
                if (
                    window.sampleCount >= this.circuitFailureRateMinSamples
                    && window.failureRate !== null
                    && window.failureRate >= this.circuitFailureRateThreshold
                ) {
                    metrics.circuits.rateHotTargets += 1;
                }
            }
        }
        metrics.retryThrottle.trackedTargets = this.retryThrottleBuckets.size;
        if (this.retryThrottleEnabled) {
            const threshold = this._retryThrottleThresholdTokens();
            for (const bucket of this.retryThrottleBuckets.values()) {
                if (Number.isFinite(bucket?.tokens) && bucket.tokens <= threshold) {
                    metrics.retryThrottle.throttledTargets += 1;
                }
            }
        }

        return metrics;
    }
}
