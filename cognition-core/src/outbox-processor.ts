import fs from 'fs/promises';
import path from 'path';
import {
    buildTaskReceipt,
    buildTaskResult,
    FileTaskStore,
    TaskOrchestrator
} from '../../swarm-protocol/runtime.js';
import { enqueueTaskEntries } from './task-bundle-enqueuer.js';
import { OpenClawBot } from './openclaw-bot.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

function safeNow(nowFactory = Date.now) {
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeFailureRate(value) {
    return clamp(Number(value) || 0, 0, 1);
}

function chooseResultStatus(failureRate, rng = Math.random) {
    if (normalizeFailureRate(failureRate) <= 0) return 'success';
    return rng() < normalizeFailureRate(failureRate) ? 'failure' : 'success';
}

function parsePositiveInt(value, fallback) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric <= 0) return fallback;
    return numeric;
}

function parseNonNegativeInt(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 0) return fallback;
    return numeric;
}

function normalizeRetryJitter(value, fallback = 0.2) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeRetryJitterStrategy(value, fallback = 'symmetric') {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'symmetric' || normalized === 'full' || normalized === 'decorrelated') {
        return normalized;
    }
    return fallback;
}

function normalizeRetryBudgetRatio(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeHedgeBudgetRatio(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeAttemptTimeoutAutoPercentile(value, fallback = 0.95) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0.5, 0.999);
}

function normalizeAttemptTimeoutAutoMinSamples(value, fallback = 8) {
    return parsePositiveInt(value, fallback);
}

function normalizeAttemptTimeoutAutoWindowSize(value, fallback = 32) {
    return parsePositiveInt(value, fallback);
}

function normalizeAttemptTimeoutAutoBlend(value, fallback = 0.5) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeHedgedAttemptCount(value, fallback = 1) {
    return clamp(parsePositiveInt(value, fallback), 1, 5);
}

function normalizeHedgedDelayMs(value, fallback = 0) {
    return parseNonNegativeInt(value, fallback);
}

function normalizeRetryMaxElapsedMs(value, fallback = 0) {
    return parseNonNegativeInt(value, fallback);
}

function normalizeRetryHintMaxDelayMs(value, fallback = 120_000) {
    return parseNonNegativeInt(value, fallback);
}

function normalizeRetryHintJitter(value, fallback = 0.1) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeCircuitBreakerFailureThreshold(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 0) return fallback;
    return numeric;
}

function normalizeCircuitBreakerCooldownMs(value, fallback = 30_000) {
    return parseNonNegativeInt(value, fallback);
}

function normalizeCircuitBreakerCooldownBackoffMultiplier(value, fallback = 1) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 1, 10);
}

function normalizeCircuitBreakerCooldownJitter(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeCircuitBreakerMaxCooldownMs(value, fallback = 180_000) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerHalfOpenMaxProbes(value, fallback = 1) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerHalfOpenSuccessThreshold(value, fallback = 1) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerHalfOpenMaxWaitMs(value, fallback = 0) {
    return parseNonNegativeInt(value, fallback);
}

function normalizeCircuitBreakerFailureRateThreshold(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeCircuitBreakerFailureRateWindow(value, fallback = 20) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerFailureRateMinSamples(value, fallback = 8) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerSlowCallRateThreshold(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeCircuitBreakerSlowCallDurationMs(value, fallback = 120_000) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerSlowCallWindow(value, fallback = 20) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerSlowCallMinSamples(value, fallback = 8) {
    return parsePositiveInt(value, fallback);
}

function normalizeResilienceScopeKey(value) {
    if (typeof value !== 'string') return '__default__';
    const normalized = value.trim().toLowerCase();
    return normalized || '__default__';
}

function updateBinaryRateObservations(observations, value, windowSize) {
    const next = Array.isArray(observations) ? observations.slice() : [];
    next.push(value ? 1 : 0);
    const normalizedWindowSize = Math.max(1, parsePositiveInt(windowSize, 20));
    if (next.length > normalizedWindowSize) {
        next.splice(0, next.length - normalizedWindowSize);
    }
    return next;
}

function computeBinaryRate(observations) {
    if (!Array.isArray(observations) || observations.length === 0) return 0;
    const failures = observations.reduce((sum, sample) => sum + (Number(sample) >= 1 ? 1 : 0), 0);
    return failures / observations.length;
}

function updateDurationObservations(observations, durationMs, windowSize) {
    const duration = Number(durationMs);
    if (!Number.isFinite(duration) || duration < 0) {
        return Array.isArray(observations) ? observations.slice() : [];
    }
    const next = Array.isArray(observations) ? observations.slice() : [];
    next.push(duration);
    const normalizedWindowSize = Math.max(1, parsePositiveInt(windowSize, 32));
    if (next.length > normalizedWindowSize) {
        next.splice(0, next.length - normalizedWindowSize);
    }
    return next;
}

function computePercentile(observations, percentile) {
    if (!Array.isArray(observations) || observations.length === 0) return null;
    const sorted = observations
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value >= 0)
        .sort((a, b) => a - b);
    if (sorted.length === 0) return null;
    const normalizedPercentile = clamp(Number(percentile) || 0.95, 0.5, 0.999);
    const rank = Math.ceil(normalizedPercentile * sorted.length) - 1;
    return sorted[clamp(rank, 0, sorted.length - 1)];
}

function resolveAdaptiveAttemptTimeoutMs({
    staticTimeoutMs,
    autoEnabled,
    observations,
    autoPercentile,
    autoMinSamples,
    autoBlend
}) {
    const normalizedStaticTimeoutMs = parseNonNegativeInt(staticTimeoutMs, 120_000);
    if (normalizedStaticTimeoutMs <= 0 || !autoEnabled) {
        return {
            timeoutMs: normalizedStaticTimeoutMs,
            autoTargetMs: null
        };
    }
    const sampleCount = Array.isArray(observations) ? observations.length : 0;
    if (sampleCount < Math.max(1, parsePositiveInt(autoMinSamples, 8))) {
        return {
            timeoutMs: normalizedStaticTimeoutMs,
            autoTargetMs: null
        };
    }
    const autoTargetMs = computePercentile(observations, autoPercentile);
    if (!Number.isFinite(autoTargetMs)) {
        return {
            timeoutMs: normalizedStaticTimeoutMs,
            autoTargetMs: null
        };
    }
    const blend = normalizeAttemptTimeoutAutoBlend(autoBlend, 0.5);
    const blendedTimeoutMs = Math.round(
        (normalizedStaticTimeoutMs * (1 - blend)) + (autoTargetMs * blend)
    );
    return {
        timeoutMs: Math.max(1, blendedTimeoutMs),
        autoTargetMs: Math.max(1, Math.round(autoTargetMs))
    };
}

function resolveAdaptiveHedgedDelayMs({
    staticDelayMs,
    autoEnabled,
    observations,
    autoPercentile,
    autoMinSamples,
    autoBlend,
    maxDelayMs = Number.MAX_SAFE_INTEGER
}) {
    const normalizedStaticDelayMs = parseNonNegativeInt(staticDelayMs, 0);
    const normalizedMaxDelayMs = Math.max(0, parseNonNegativeInt(maxDelayMs, Number.MAX_SAFE_INTEGER));
    if (!autoEnabled) {
        return {
            delayMs: clamp(normalizedStaticDelayMs, 0, normalizedMaxDelayMs),
            autoTargetMs: null
        };
    }
    const sampleCount = Array.isArray(observations) ? observations.length : 0;
    if (sampleCount < Math.max(1, parsePositiveInt(autoMinSamples, 8))) {
        return {
            delayMs: clamp(normalizedStaticDelayMs, 0, normalizedMaxDelayMs),
            autoTargetMs: null
        };
    }
    const autoTargetMs = computePercentile(observations, autoPercentile);
    if (!Number.isFinite(autoTargetMs)) {
        return {
            delayMs: clamp(normalizedStaticDelayMs, 0, normalizedMaxDelayMs),
            autoTargetMs: null
        };
    }
    const blend = normalizeAttemptTimeoutAutoBlend(autoBlend, 0.5);
    const blendedDelayMs = Math.round(
        (normalizedStaticDelayMs * (1 - blend)) + (autoTargetMs * blend)
    );
    const delayMs = clamp(blendedDelayMs, 0, normalizedMaxDelayMs);
    return {
        delayMs,
        autoTargetMs: Math.max(0, Math.round(autoTargetMs))
    };
}

function resolveCircuitBreakerCooldownMs({
    baseCooldownMs,
    maxCooldownMs,
    backoffMultiplier,
    openStreak,
    cooldownJitter = 0,
    rng = Math.random
}) {
    const normalizedBase = Math.max(0, parseNonNegativeInt(baseCooldownMs, 30_000));
    const normalizedMax = Math.max(normalizedBase, normalizeCircuitBreakerMaxCooldownMs(maxCooldownMs, 180_000));
    const normalizedMultiplier = normalizeCircuitBreakerCooldownBackoffMultiplier(backoffMultiplier, 1);
    const normalizedOpenStreak = Math.max(1, parsePositiveInt(openStreak, 1));
    if (normalizedBase <= 0) return 0;
    const scaled = (normalizedMultiplier <= 1 || normalizedOpenStreak <= 1)
        ? normalizedBase
        : normalizedBase * Math.pow(normalizedMultiplier, normalizedOpenStreak - 1);
    const effectiveBase = clamp(Math.round(scaled), normalizedBase, normalizedMax);
    const normalizedJitter = normalizeCircuitBreakerCooldownJitter(cooldownJitter, 0);
    if (normalizedJitter <= 0) {
        return effectiveBase;
    }
    const random = typeof rng === 'function' ? clamp(Number(rng()) || 0, 0, 1) : 0.5;
    // Keep the configured cooldown as a floor while adding spread to desynchronize reopen probes.
    const jittered = effectiveBase * (1 + (random * normalizedJitter));
    return clamp(Math.round(jittered), effectiveBase, normalizedMax);
}

function isTransientBotFailure(execution) {
    if (!execution || typeof execution !== 'object') return false;
    if (execution.status !== 'failure') return false;
    if (Number(execution.metrics?.retryable) >= 1 || Number(execution.metrics?.transientFailure) >= 1) {
        return true;
    }
    const output = typeof execution.output === 'string' ? execution.output.toLowerCase() : '';
    if (!output) return false;
    return /timed?\s*out|timeout|transport|rate\s*limit|too many requests|throttl|econn|eai_again|enotfound|temporar|unavailable|502|503|504/.test(output);
}

export function computeRetryDelayMs({
    baseDelayMs,
    maxDelayMs,
    attempt,
    jitter,
    jitterStrategy = 'symmetric',
    previousDelayMs = null,
    rng = Math.random
}) {
    const normalizedBase = Math.max(0, parseNonNegativeInt(baseDelayMs, 200));
    const normalizedMax = Math.max(normalizedBase, parseNonNegativeInt(maxDelayMs, 5_000));
    const exponent = Math.max(0, parseNonNegativeInt(attempt, 1) - 1);
    const uncapped = normalizedBase * Math.pow(2, exponent);
    const capped = Math.min(normalizedMax, uncapped);
    const jitterRatio = normalizeRetryJitter(jitter, 0.2);
    const normalizedStrategy = normalizeRetryJitterStrategy(jitterStrategy, 'symmetric');
    if (capped <= 0 || jitterRatio <= 0) return capped;
    const random = typeof rng === 'function' ? clamp(Number(rng()) || 0, 0, 1) : 0.5;
    if (normalizedStrategy === 'full') {
        const minDelay = capped * (1 - jitterRatio);
        const maxDelay = capped;
        const delay = minDelay + ((maxDelay - minDelay) * random);
        return Math.max(0, Math.round(delay));
    }
    if (normalizedStrategy === 'decorrelated') {
        const previous = Math.max(normalizedBase, parseNonNegativeInt(previousDelayMs, normalizedBase));
        const rawUpperBound = Math.min(normalizedMax, previous * 3);
        const effectiveUpperBound = normalizedBase + ((rawUpperBound - normalizedBase) * jitterRatio);
        const delay = normalizedBase + ((effectiveUpperBound - normalizedBase) * random);
        return Math.max(0, Math.round(delay));
    }
    const offset = ((random * 2) - 1) * jitterRatio;
    return Math.max(0, Math.round(capped * (1 + offset)));
}

function normalizeRetryAfterDelayMs(value, nowMs) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
        return Math.round(value);
    }
    const raw = String(value || '').trim();
    if (!raw) return null;
    if (/^\d+(\.\d+)?$/.test(raw)) {
        return Math.max(0, Math.round(Number(raw) * 1000));
    }
    const durationLiteralMs = parseDurationLiteralMs(raw);
    if (durationLiteralMs !== null) {
        return durationLiteralMs;
    }
    const parsedDate = Date.parse(raw);
    if (Number.isFinite(parsedDate)) {
        return Math.max(0, Math.round(parsedDate - nowMs));
    }
    return null;
}

function normalizeRateLimitResetDelayMs(value, nowMs) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') {
        const durationLiteralMs = parseDurationLiteralMs(value);
        if (durationLiteralMs !== null) {
            return durationLiteralMs;
        }
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return null;

    // RFC 9331 RateLimit-Reset is a delta in seconds; many x-ratelimit variants use epoch times.
    if (numeric >= 1_000_000_000_000) {
        return Math.max(0, Math.round(numeric - nowMs));
    }
    if (numeric >= 1_000_000_000) {
        return Math.max(0, Math.round((numeric * 1000) - nowMs));
    }
    return Math.max(0, Math.round(numeric * 1000));
}

function parseDurationLiteralMs(rawValue) {
    if (typeof rawValue !== 'string') return null;
    const raw = rawValue.trim().toLowerCase();
    if (!raw) return null;

    const tokenPattern = /(\d+(?:\.\d+)?)\s*(ms|milliseconds?|s|sec|secs|seconds?|m|min|mins|minutes?|h|hr|hrs|hours?|d|day|days)/g;
    let match;
    let consumed = '';
    let totalMs = 0;

    while ((match = tokenPattern.exec(raw)) !== null) {
        const amount = Number(match[1]);
        if (!Number.isFinite(amount) || amount < 0) return null;
        const unit = match[2];
        if (unit.startsWith('ms')) {
            totalMs += amount;
        } else if (unit.startsWith('s')) {
            totalMs += amount * 1000;
        } else if (unit.startsWith('m')) {
            totalMs += amount * 60_000;
        } else if (unit.startsWith('h')) {
            totalMs += amount * 3_600_000;
        } else if (unit.startsWith('d')) {
            totalMs += amount * 86_400_000;
        } else {
            return null;
        }
        consumed += match[0];
    }

    if (!consumed) return null;
    const normalizedConsumed = consumed.replace(/\s+/g, '');
    const normalizedRaw = raw.replace(/\s+/g, '');
    if (normalizedConsumed !== normalizedRaw) return null;
    return Math.max(0, Math.round(totalMs));
}

function parseRetryAfterHintFromOutput(output, nowMs) {
    if (typeof output !== 'string' || !output.trim()) return null;
    const candidates = [];
    const lineMatch = output.match(/retry-?after\s*[:=]\s*([^\r\n;]+)/i);
    if (lineMatch) {
        const parsedFromLine = normalizeRetryAfterDelayMs(lineMatch[1], nowMs);
        if (parsedFromLine !== null) candidates.push(parsedFromLine);
    }

    const jsonHeaderMatch = output.match(/["']retry-?after["']\s*:\s*["']([^"']+)["']/i);
    if (jsonHeaderMatch) {
        const parsedFromJsonHeader = normalizeRetryAfterDelayMs(jsonHeaderMatch[1], nowMs);
        if (parsedFromJsonHeader !== null) candidates.push(parsedFromJsonHeader);
    }

    const rateLimitResetLineMatch = output.match(/(?:^|\b)(?:x-)?ratelimit-reset(?:-[a-z_]+)?\s*[:=]\s*([^\r\n;]+)/i);
    if (rateLimitResetLineMatch) {
        const parsedRateLimitReset = normalizeRateLimitResetDelayMs(rateLimitResetLineMatch[1], nowMs);
        if (parsedRateLimitReset !== null) candidates.push(parsedRateLimitReset);
    }

    const rateLimitResetJsonMatch = output.match(/["'](?:x-)?ratelimit-reset(?:-[a-z_]+)?["']\s*:\s*["']?([^"',\]\}\s]+)["']?/i);
    if (rateLimitResetJsonMatch) {
        const parsedRateLimitReset = normalizeRateLimitResetDelayMs(rateLimitResetJsonMatch[1], nowMs);
        if (parsedRateLimitReset !== null) candidates.push(parsedRateLimitReset);
    }

    const phraseMatch = output.match(
        /retry(?:ing)?\s+after\s+(\d+(?:\.\d+)?)\s*(ms|msec|milliseconds?|s|sec|secs|seconds?|m|min|mins|minutes?)?\b/i
    );
    if (phraseMatch) {
        const amount = Number(phraseMatch[1]);
        if (Number.isFinite(amount) && amount >= 0) {
            const unit = String(phraseMatch[2] || 's').toLowerCase();
            if (unit.startsWith('ms')) candidates.push(Math.round(amount));
            else if (unit.startsWith('m')) candidates.push(Math.round(amount * 60_000));
            else candidates.push(Math.round(amount * 1000));
        }
    }

    const resetPhraseMatch = output.match(
        /rate\s*limit(?:ing)?\s*(?:resets?|resetting)\s*(?:in|after)?\s*(\d+(?:\.\d+)?)\s*(s|sec|secs|seconds?|m|min|mins|minutes?)?\b/i
    );
    if (resetPhraseMatch) {
        const amount = Number(resetPhraseMatch[1]);
        if (Number.isFinite(amount) && amount >= 0) {
            const unit = String(resetPhraseMatch[2] || 's').toLowerCase();
            if (unit.startsWith('m')) candidates.push(Math.round(amount * 60_000));
            else candidates.push(Math.round(amount * 1000));
        }
    }
    if (candidates.length === 0) return null;
    return Math.max(...candidates);
}

export function applyRetryHintJitterMs({
    delayMs,
    jitter = 0.1,
    rng = Math.random
}) {
    const normalizedDelay = Math.max(0, parseNonNegativeInt(delayMs, 0));
    const normalizedJitter = normalizeRetryHintJitter(jitter, 0.1);
    if (normalizedDelay <= 0 || normalizedJitter <= 0) return normalizedDelay;
    const random = typeof rng === 'function' ? clamp(Number(rng()) || 0, 0, 1) : 0.5;
    // Retry-After / RateLimit-Reset semantics describe a minimum wait; only add positive spread.
    return Math.max(0, Math.round(normalizedDelay * (1 + (random * normalizedJitter))));
}

export function extractRetryAfterHintMs(execution, { nowFactory = Date.now } = {}) {
    if (!execution || typeof execution !== 'object') return null;
    const now = safeNow(nowFactory);
    const metrics = execution.metrics && typeof execution.metrics === 'object'
        ? execution.metrics
        : {};

    const candidateHints = [];

    const directMetricKeys = [
        'retryAfterMs',
        'retry_after_ms',
        'retryAfterMilliseconds',
        'retry_after_milliseconds',
        'retry-after-ms',
        'x-ms-retry-after-ms'
    ];
    for (const key of directMetricKeys) {
        const parsed = normalizeRetryAfterDelayMs(metrics[key], now);
        if (parsed !== null) candidateHints.push(parsed);
    }

    const secondsMetricKeys = [
        'retryAfterSeconds',
        'retry_after_seconds'
    ];
    for (const key of secondsMetricKeys) {
        const numeric = Number(metrics[key]);
        if (Number.isFinite(numeric) && numeric >= 0) {
            candidateHints.push(Math.round(numeric * 1000));
        }
    }

    const rateLimitSecondsMetricKeys = [
        'rateLimitResetSeconds',
        'rate_limit_reset_seconds',
        'ratelimitResetSeconds',
        'ratelimit_reset_seconds',
        'rateLimitReset',
        'rate_limit_reset',
        'ratelimitReset',
        'ratelimit_reset'
    ];
    for (const key of rateLimitSecondsMetricKeys) {
        const parsed = normalizeRateLimitResetDelayMs(metrics[key], now);
        if (parsed !== null) candidateHints.push(parsed);
    }

    const epochMsMetricKeys = [
        'retryAfterEpochMs',
        'retry_after_epoch_ms'
    ];
    for (const key of epochMsMetricKeys) {
        const epochMs = Number(metrics[key]);
        if (Number.isFinite(epochMs) && epochMs >= 0) {
            candidateHints.push(Math.max(0, Math.round(epochMs - now)));
        }
    }

    const epochSecondsMetricKeys = [
        'retryAfterUnixSeconds',
        'retry_after_unix_seconds'
    ];
    for (const key of epochSecondsMetricKeys) {
        const epochSeconds = Number(metrics[key]);
        if (Number.isFinite(epochSeconds) && epochSeconds >= 0) {
            candidateHints.push(Math.max(0, Math.round((epochSeconds * 1000) - now)));
        }
    }

    const headerLikeMetricKeys = [
        'retryAfter',
        'retry_after',
        'retryAfterHeader',
        'retry_after_header'
    ];
    for (const key of headerLikeMetricKeys) {
        const parsed = normalizeRetryAfterDelayMs(metrics[key], now);
        if (parsed !== null) candidateHints.push(parsed);
    }

    const rateLimitHeaderMetricKeys = [
        'rateLimitResetHeader',
        'rate_limit_reset_header',
        'ratelimitResetHeader',
        'ratelimit_reset_header',
        'xRateLimitReset',
        'x_ratelimit_reset',
        'xRateLimitResetRequests',
        'x_ratelimit_reset_requests',
        'xRateLimitResetTokens',
        'x_ratelimit_reset_tokens'
    ];
    for (const key of rateLimitHeaderMetricKeys) {
        const parsed = normalizeRateLimitResetDelayMs(metrics[key], now);
        if (parsed !== null) candidateHints.push(parsed);
    }
    const outputHint = parseRetryAfterHintFromOutput(execution.output, now);
    if (outputHint !== null) candidateHints.push(outputHint);
    if (candidateHints.length === 0) return null;
    return Math.max(...candidateHints);
}

async function sleep(ms) {
    const duration = parseNonNegativeInt(ms, 0);
    if (duration <= 0) return;
    await new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

function createBotFailureExecution({
    output,
    metrics = {}
}) {
    return {
        mode: 'generic',
        status: 'failure',
        output,
        metrics,
        artifacts: [],
        followupTasks: []
    };
}

async function executeBotTaskWithTimeout({
    request,
    bot,
    attempt,
    executeBotTask,
    timeoutMs,
    hedgedAttemptCount = 1,
    hedgedDelayMs = 0,
    nowFactory = Date.now
}) {
    const startedAt = safeNow(nowFactory);
    const normalizedTimeoutMs = parseNonNegativeInt(timeoutMs, 0);
    const normalizedHedgedAttemptCount = normalizeHedgedAttemptCount(hedgedAttemptCount, 1);
    const normalizedHedgedDelayMs = normalizeHedgedDelayMs(hedgedDelayMs, 0);
    const hedgingEnabled = normalizedHedgedAttemptCount > 1 && normalizedHedgedDelayMs > 0;

    const ensureExecutionShape = (execution) => (execution && typeof execution === 'object'
        ? execution
        : createBotFailureExecution({
            output: 'Task execution failed: invalid execution response.',
            metrics: {
                executionError: 1
            }
        }));

    const invoke = async () => {
        try {
            return ensureExecutionShape(await executeBotTask(request, bot, attempt));
        } catch (error) {
            return createBotFailureExecution({
                output: `Task execution failed: ${error?.message || 'bot execution error'}`,
                metrics: {
                    executionError: 1
                }
            });
        }
    };

    if (!hedgingEnabled) {
        if (normalizedTimeoutMs <= 0) {
            const execution = await invoke();
            return ensureExecutionShape(execution);
        }

        let timeoutHandle;
        const timeoutResult = new Promise((resolve) => {
            timeoutHandle = setTimeout(() => {
                resolve(createBotFailureExecution({
                    output: `Task execution failed: bot attempt timed out after ${normalizedTimeoutMs}ms.`,
                    metrics: {
                        timedOut: 1,
                        transientFailure: 1,
                        retryable: 1,
                        durationMs: normalizedTimeoutMs
                    }
                }));
            }, normalizedTimeoutMs);
        });

        const execution = await Promise.race([invoke(), timeoutResult]);
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }

        const resolvedExecution = ensureExecutionShape(execution);
        if (resolvedExecution?.metrics?.durationMs === undefined) {
            const durationMs = clamp(safeNow(nowFactory) - startedAt, 0, Number.MAX_SAFE_INTEGER);
            resolvedExecution.metrics = {
                ...(resolvedExecution.metrics || {}),
                durationMs
            };
        }
        return resolvedExecution;
    }

    let resolved = false;
    let launchedAttempts = 0;
    let completedAttempts = 0;

    const withHedgeMetrics = (execution, {
        selectedAttempt = null,
        timedOut = false
    } = {}) => {
        const normalizedExecution = ensureExecutionShape(execution);
        return {
            ...normalizedExecution,
            metrics: {
                ...(normalizedExecution.metrics || {}),
            hedgeEnabled: 1,
            hedgeAttemptsConfigured: normalizedHedgedAttemptCount,
            hedgeDelayMs: normalizedHedgedDelayMs,
            hedgeAttemptsLaunched: Math.max(0, launchedAttempts),
            hedgeAttemptsCompleted: Math.max(0, completedAttempts),
            ...(Number.isInteger(selectedAttempt) && selectedAttempt > 0
                ? {
                    hedgeSelectedAttempt: selectedAttempt
                }
                : {}),
            ...(Number.isInteger(selectedAttempt) && selectedAttempt > 1 && normalizedExecution.status !== 'failure'
                ? {
                    hedgeWonRace: 1
                }
                : {}),
            ...(timedOut
                ? {
                    hedgeTimedOut: 1
                }
                : {})
            }
        };
    };

    const invokeAttempt = async (attemptIndex) => {
        if (attemptIndex > 1) {
            await sleep(normalizedHedgedDelayMs * (attemptIndex - 1));
        }
        if (resolved) {
            return {
                skipped: true,
                attemptIndex
            };
        }

        launchedAttempts++;
        const attemptStartedAt = safeNow(nowFactory);
        const execution = ensureExecutionShape(await invoke());
        if (execution.metrics?.durationMs === undefined) {
            execution.metrics = {
                ...(execution.metrics || {}),
                durationMs: clamp(safeNow(nowFactory) - attemptStartedAt, 0, Number.MAX_SAFE_INTEGER)
            };
        }
        return {
            skipped: false,
            attemptIndex,
            execution
        };
    };

    const attempts = [];
    for (let attemptIndex = 1; attemptIndex <= normalizedHedgedAttemptCount; attemptIndex++) {
        attempts.push(invokeAttempt(attemptIndex));
    }

    const wrappedAttempts = attempts.map((promise, index) => promise.then((result) => ({
        index,
        result
    })));
    const pending = new Set(wrappedAttempts.map((_, index) => index));
    const deadlineAt = normalizedTimeoutMs > 0
        ? startedAt + normalizedTimeoutMs
        : null;
    let firstFailure = null;

    while (pending.size > 0) {
        const racers = [...pending].map((index) => wrappedAttempts[index]);
        let timeoutHandle = null;
        let timeoutRace = null;
        if (deadlineAt !== null) {
            const remainingMs = deadlineAt - safeNow(nowFactory);
            if (remainingMs <= 0) {
                resolved = true;
                return withHedgeMetrics(createBotFailureExecution({
                    output: `Task execution failed: bot attempt timed out after ${normalizedTimeoutMs}ms.`,
                    metrics: {
                        timedOut: 1,
                        transientFailure: 1,
                        retryable: 1,
                        durationMs: normalizedTimeoutMs
                    }
                }), {
                    selectedAttempt: null,
                    timedOut: true
                });
            }
            timeoutRace = new Promise((resolve) => {
                timeoutHandle = setTimeout(() => {
                    resolve({
                        timeout: true
                    });
                }, remainingMs);
            });
        }
        const winner = await Promise.race([
            ...racers,
            ...(timeoutRace ? [timeoutRace] : [])
        ]);
        if (timeoutHandle) clearTimeout(timeoutHandle);

        if (winner && winner.timeout) {
            resolved = true;
            return withHedgeMetrics(createBotFailureExecution({
                output: `Task execution failed: bot attempt timed out after ${normalizedTimeoutMs}ms.`,
                metrics: {
                    timedOut: 1,
                    transientFailure: 1,
                    retryable: 1,
                    durationMs: normalizedTimeoutMs
                }
            }), {
                selectedAttempt: null,
                timedOut: true
            });
        }

        pending.delete(winner.index);
        if (winner.result?.skipped) {
            continue;
        }
        completedAttempts++;

        if (winner.result?.execution?.status !== 'failure') {
            resolved = true;
            return withHedgeMetrics(winner.result.execution, {
                selectedAttempt: winner.result.attemptIndex
            });
        }
        if (!firstFailure) {
            firstFailure = winner.result.execution;
        }
    }

    resolved = true;
    return withHedgeMetrics(
        firstFailure || createBotFailureExecution({
            output: 'Task execution failed: empty execution response.',
            metrics: {
                executionError: 1
            }
        }),
        {
            selectedAttempt: null
        }
    );
}

function isTaskDispatchEnvelope(payload) {
    return payload
        && typeof payload === 'object'
        && payload.kind === 'task_dispatch_envelope'
        && payload.message
        && typeof payload.message === 'object'
        && payload.message.kind === 'task_request';
}

function parseEnvelopeLines(raw, filePath) {
    const lines = raw.split('\n').filter((line) => line.trim());
    const envelopes = [];
    let invalid = 0;

    for (let i = 0; i < lines.length; i++) {
        try {
            const parsed = JSON.parse(lines[i]);
            if (!isTaskDispatchEnvelope(parsed)) {
                invalid++;
                continue;
            }
            envelopes.push(parsed);
        } catch {
            invalid++;
        }
    }

    return {
        filePath,
        lineCount: lines.length,
        invalid,
        envelopes
    };
}

async function listOutboxFiles(outboxDir) {
    try {
        const entries = await fs.readdir(outboxDir, { withFileTypes: true });
        return entries
            .filter((entry) => entry.isFile() && entry.name.endsWith('.jsonl'))
            .map((entry) => path.join(outboxDir, entry.name))
            .sort();
    } catch (error) {
        if (error?.code === 'ENOENT') return [];
        throw error;
    }
}

function archiveFilePath(filePath, archiveDir, nowFactory) {
    const base = path.basename(filePath, '.jsonl');
    const stamp = safeNow(nowFactory);
    return path.join(archiveDir, `${base}.${stamp}.processed.jsonl`);
}

function sanitizeMetrics(rawMetrics) {
    if (!rawMetrics || typeof rawMetrics !== 'object') return undefined;
    const metrics = {};
    for (const [key, value] of Object.entries(rawMetrics)) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) continue;
        metrics[key] = numeric;
    }
    return Object.keys(metrics).length > 0 ? metrics : undefined;
}

function sanitizeArtifacts(rawArtifacts) {
    if (!Array.isArray(rawArtifacts)) return undefined;

    const artifacts = rawArtifacts
        .filter((artifact) => artifact && typeof artifact === 'object')
        .map((artifact) => ({
            name: typeof artifact.name === 'string' && artifact.name.trim()
                ? artifact.name.trim()
                : null,
            path: typeof artifact.path === 'string' && artifact.path.trim()
                ? artifact.path.trim()
                : null,
            type: typeof artifact.type === 'string' && artifact.type.trim()
                ? artifact.type.trim()
                : undefined
        }))
        .filter((artifact) => artifact.name && artifact.path)
        .map((artifact) => ({
            name: artifact.name,
            path: artifact.path,
            type: artifact.type
        }));

    return artifacts.length > 0 ? artifacts : undefined;
}

function normalizeBotResultStatus(status) {
    if (status === 'failure') return 'failure';
    if (status === 'partial') return 'partial';
    return 'success';
}

function botModeToStatField(mode) {
    if (mode === 'skill') return 'botSkillTasks';
    if (mode === 'skill_action') return 'botSkillActionTasks';
    if (mode === 'skill_blueprint') return 'botSkillBlueprintTasks';
    if (mode === 'capability') return 'botCapabilityTasks';
    if (mode === 'capability_action') return 'botCapabilityActionTasks';
    return 'botGenericTasks';
}

export async function processOutboxEnvelopes({
    storePath,
    outboxDir,
    archiveDir = path.join(outboxDir, 'processed'),
    localAgentId = 'agent:main',
    etaMs = 1_000,
    resultDelayMs = 500,
    failureRate = 0,
    botRuntime = true,
    botAgentId = 'agent:openclaw-bot',
    botRepoRoot = null,
    skillHardeningPolicy = 'enforce',
    skillHardeningMinScore = 82,
    skillDeployabilityIndexPath = null,
    skillHardeningProfilePath = null,
    enqueueFollowupTasks = true,
    botMaxAttempts = 2,
    botRetryBaseDelayMs = 200,
    botRetryMaxDelayMs = 5_000,
    botRetryJitter = 0.2,
    botRetryJitterStrategy = 'symmetric',
    botRetryHintMaxDelayMs = 120_000,
    botRetryHintJitter = 0.1,
    botAttemptTimeoutMs = 120_000,
    botHedgedAttemptCount = 1,
    botHedgedDelayMs = 0,
    botHedgedDelayAutoTarget = false,
    botHedgedDelayAutoPercentile = 0.95,
    botHedgedDelayAutoMinSamples = 8,
    botHedgedDelayAutoWindowSize = 32,
    botHedgedDelayAutoBlend = 0.5,
    botAttemptTimeoutAutoTarget = false,
    botAttemptTimeoutAutoPercentile = 0.95,
    botAttemptTimeoutAutoMinSamples = 8,
    botAttemptTimeoutAutoWindowSize = 32,
    botAttemptTimeoutAutoBlend = 0.5,
    botRetryMaxElapsedMs = 0,
    botRetryBudgetRatio = 0,
    botHedgeBudgetRatio = 0,
    botCircuitBreakerFailureThreshold = 0,
    botCircuitBreakerCooldownMs = 30_000,
    botCircuitBreakerCooldownBackoffMultiplier = 1,
    botCircuitBreakerCooldownJitter = 0,
    botCircuitBreakerMaxCooldownMs = 180_000,
    botCircuitBreakerHalfOpenMaxProbes = 1,
    botCircuitBreakerHalfOpenSuccessThreshold = 1,
    botCircuitBreakerHalfOpenMaxWaitMs = 0,
    botCircuitBreakerFailureRateThreshold = 0,
    botCircuitBreakerFailureRateWindow = 20,
    botCircuitBreakerFailureRateMinSamples = 8,
    botCircuitBreakerSlowCallRateThreshold = 0,
    botCircuitBreakerSlowCallDurationMs = 120_000,
    botCircuitBreakerSlowCallWindow = 20,
    botCircuitBreakerSlowCallMinSamples = 8,
    botExecute = null,
    dryRun = false,
    nowFactory = Date.now,
    rng = Math.random
}) {
    if (!storePath || typeof storePath !== 'string') {
        throw new Error('storePath is required');
    }
    if (!outboxDir || typeof outboxDir !== 'string') {
        throw new Error('outboxDir is required');
    }

    const now = typeof nowFactory === 'function' ? nowFactory : Date.now;
    const normalizedBotMaxAttempts = parsePositiveInt(botMaxAttempts, 2);
    const normalizedBotRetryBaseDelayMs = parseNonNegativeInt(botRetryBaseDelayMs, 200);
    const normalizedBotRetryMaxDelayMs = Math.max(
        normalizedBotRetryBaseDelayMs,
        parseNonNegativeInt(botRetryMaxDelayMs, 5_000)
    );
    const normalizedBotRetryJitter = normalizeRetryJitter(botRetryJitter, 0.2);
    const normalizedBotRetryJitterStrategy = normalizeRetryJitterStrategy(botRetryJitterStrategy, 'symmetric');
    const normalizedBotRetryHintMaxDelayMs = normalizeRetryHintMaxDelayMs(botRetryHintMaxDelayMs, 120_000);
    const normalizedBotRetryHintJitter = normalizeRetryHintJitter(botRetryHintJitter, 0.1);
    const normalizedBotAttemptTimeoutMs = parseNonNegativeInt(botAttemptTimeoutMs, 120_000);
    const normalizedBotHedgedAttemptCount = normalizeHedgedAttemptCount(botHedgedAttemptCount, 1);
    const normalizedBotHedgedDelayMs = normalizeHedgedDelayMs(botHedgedDelayMs, 0);
    const normalizedBotHedgedDelayAutoPercentile = normalizeAttemptTimeoutAutoPercentile(
        botHedgedDelayAutoPercentile,
        0.95
    );
    const normalizedBotHedgedDelayAutoMinSamples = normalizeAttemptTimeoutAutoMinSamples(
        botHedgedDelayAutoMinSamples,
        8
    );
    const normalizedBotHedgedDelayAutoWindowSize = normalizeAttemptTimeoutAutoWindowSize(
        botHedgedDelayAutoWindowSize,
        32
    );
    const normalizedBotHedgedDelayAutoBlend = normalizeAttemptTimeoutAutoBlend(
        botHedgedDelayAutoBlend,
        0.5
    );
    const hedgedDelayAutoEnabled = normalizedBotHedgedAttemptCount > 1 && Boolean(botHedgedDelayAutoTarget);
    const normalizedBotAttemptTimeoutAutoPercentile = normalizeAttemptTimeoutAutoPercentile(
        botAttemptTimeoutAutoPercentile,
        0.95
    );
    const normalizedBotAttemptTimeoutAutoMinSamples = normalizeAttemptTimeoutAutoMinSamples(
        botAttemptTimeoutAutoMinSamples,
        8
    );
    const normalizedBotAttemptTimeoutAutoWindowSize = normalizeAttemptTimeoutAutoWindowSize(
        botAttemptTimeoutAutoWindowSize,
        32
    );
    const normalizedBotAttemptTimeoutAutoBlend = normalizeAttemptTimeoutAutoBlend(
        botAttemptTimeoutAutoBlend,
        0.5
    );
    const attemptTimeoutAutoEnabled = normalizedBotAttemptTimeoutMs > 0 && Boolean(botAttemptTimeoutAutoTarget);
    const adaptiveDurationWindowSize = Math.max(
        attemptTimeoutAutoEnabled ? normalizedBotAttemptTimeoutAutoWindowSize : 1,
        hedgedDelayAutoEnabled ? normalizedBotHedgedDelayAutoWindowSize : 1
    );
    const normalizedBotRetryMaxElapsedMs = normalizeRetryMaxElapsedMs(botRetryMaxElapsedMs, 0);
    const normalizedBotRetryBudgetRatio = normalizeRetryBudgetRatio(botRetryBudgetRatio, 0);
    const normalizedBotHedgeBudgetRatio = normalizeHedgeBudgetRatio(botHedgeBudgetRatio, 0);
    const normalizedBotCircuitBreakerFailureThreshold = normalizeCircuitBreakerFailureThreshold(
        botCircuitBreakerFailureThreshold,
        0
    );
    const normalizedBotCircuitBreakerCooldownMs = normalizeCircuitBreakerCooldownMs(
        botCircuitBreakerCooldownMs,
        30_000
    );
    const normalizedBotCircuitBreakerCooldownBackoffMultiplier = normalizeCircuitBreakerCooldownBackoffMultiplier(
        botCircuitBreakerCooldownBackoffMultiplier,
        1
    );
    const normalizedBotCircuitBreakerCooldownJitter = normalizeCircuitBreakerCooldownJitter(
        botCircuitBreakerCooldownJitter,
        0
    );
    const normalizedBotCircuitBreakerMaxCooldownMs = Math.max(
        normalizedBotCircuitBreakerCooldownMs,
        normalizeCircuitBreakerMaxCooldownMs(botCircuitBreakerMaxCooldownMs, 180_000)
    );
    const normalizedBotCircuitBreakerHalfOpenMaxProbes = normalizeCircuitBreakerHalfOpenMaxProbes(
        botCircuitBreakerHalfOpenMaxProbes,
        1
    );
    const normalizedBotCircuitBreakerHalfOpenSuccessThreshold = Math.min(
        normalizedBotCircuitBreakerHalfOpenMaxProbes,
        normalizeCircuitBreakerHalfOpenSuccessThreshold(
            botCircuitBreakerHalfOpenSuccessThreshold,
            1
        )
    );
    const normalizedBotCircuitBreakerHalfOpenMaxWaitMs = normalizeCircuitBreakerHalfOpenMaxWaitMs(
        botCircuitBreakerHalfOpenMaxWaitMs,
        0
    );
    const normalizedBotCircuitBreakerFailureRateThreshold = normalizeCircuitBreakerFailureRateThreshold(
        botCircuitBreakerFailureRateThreshold,
        0
    );
    const normalizedBotCircuitBreakerFailureRateWindow = normalizeCircuitBreakerFailureRateWindow(
        botCircuitBreakerFailureRateWindow,
        20
    );
    const normalizedBotCircuitBreakerFailureRateMinSamples = Math.min(
        normalizedBotCircuitBreakerFailureRateWindow,
        normalizeCircuitBreakerFailureRateMinSamples(
            botCircuitBreakerFailureRateMinSamples,
            8
        )
    );
    const normalizedBotCircuitBreakerSlowCallRateThreshold = normalizeCircuitBreakerSlowCallRateThreshold(
        botCircuitBreakerSlowCallRateThreshold,
        0
    );
    const normalizedBotCircuitBreakerSlowCallDurationMs = normalizeCircuitBreakerSlowCallDurationMs(
        botCircuitBreakerSlowCallDurationMs,
        120_000
    );
    const normalizedBotCircuitBreakerSlowCallWindow = normalizeCircuitBreakerSlowCallWindow(
        botCircuitBreakerSlowCallWindow,
        20
    );
    const normalizedBotCircuitBreakerSlowCallMinSamples = Math.min(
        normalizedBotCircuitBreakerSlowCallWindow,
        normalizeCircuitBreakerSlowCallMinSamples(
            botCircuitBreakerSlowCallMinSamples,
            8
        )
    );
    const circuitBreakerFailureRateEnabled = normalizedBotCircuitBreakerFailureRateThreshold > 0;
    const circuitBreakerSlowCallRateEnabled = normalizedBotCircuitBreakerSlowCallRateThreshold > 0;
    const retryBudgetEnabled = normalizedBotRetryBudgetRatio > 0;
    const hedgeBudgetEnabled = normalizedBotHedgeBudgetRatio > 0 && normalizedBotHedgedAttemptCount > 1;
    const circuitBreakerEnabled =
        normalizedBotCircuitBreakerFailureThreshold > 0
        || circuitBreakerFailureRateEnabled
        || circuitBreakerSlowCallRateEnabled;
    const resilienceStateByScope = new Map();
    const getResilienceState = (scopeKey) => {
        const key = normalizeResilienceScopeKey(scopeKey);
        if (resilienceStateByScope.has(key)) {
            return resilienceStateByScope.get(key);
        }
        const state = {
            retryBudgetTokens: 0,
            hedgeBudgetTokens: 0,
            consecutiveTransientBotFailures: 0,
            botAttemptDurationObservations: [],
            transientFailureRateObservations: [],
            slowCallRateObservations: [],
            circuitBreakerOpenUntilMs: 0,
            circuitBreakerHalfOpenProbeCount: 0,
            circuitBreakerHalfOpenSuccessCount: 0,
            circuitBreakerHalfOpenSinceMs: 0,
            circuitBreakerOpenStreak: 0
        };
        resilienceStateByScope.set(key, state);
        return state;
    };

    const openCircuitBreaker = (state, {
        retryAfterHintMs = null
    } = {}) => {
        const nextOpenStreak = state.circuitBreakerOpenStreak + 1;
        const baseCooldownMs = resolveCircuitBreakerCooldownMs({
            baseCooldownMs: normalizedBotCircuitBreakerCooldownMs,
            maxCooldownMs: normalizedBotCircuitBreakerMaxCooldownMs,
            backoffMultiplier: normalizedBotCircuitBreakerCooldownBackoffMultiplier,
            openStreak: nextOpenStreak,
            cooldownJitter: normalizedBotCircuitBreakerCooldownJitter,
            rng
        });
        let cooldownMs = baseCooldownMs;
        let appliedRetryAfterHintMs = null;
        if (normalizedBotRetryHintMaxDelayMs > 0) {
            const numericHint = Number(retryAfterHintMs);
            if (Number.isFinite(numericHint) && numericHint > 0) {
                const boundedRetryAfterHintMs = clamp(
                    Math.round(numericHint),
                    0,
                    normalizedBotRetryHintMaxDelayMs
                );
                appliedRetryAfterHintMs = applyRetryHintJitterMs({
                    delayMs: boundedRetryAfterHintMs,
                    jitter: normalizedBotRetryHintJitter,
                    rng
                });
                cooldownMs = Math.max(cooldownMs, appliedRetryAfterHintMs);
            }
        }
        state.circuitBreakerOpenUntilMs = safeNow(now) + cooldownMs;
        state.circuitBreakerOpenStreak = nextOpenStreak;
        state.circuitBreakerHalfOpenProbeCount = 0;
        state.circuitBreakerHalfOpenSuccessCount = 0;
        state.circuitBreakerHalfOpenSinceMs = 0;
        state.consecutiveTransientBotFailures = 0;
        state.transientFailureRateObservations = [];
        state.slowCallRateObservations = [];
        return {
            cooldownMs,
            openStreak: nextOpenStreak,
            retryAfterHintMs: appliedRetryAfterHintMs
        };
    };

    const closeCircuitBreaker = (state) => {
        state.consecutiveTransientBotFailures = 0;
        state.circuitBreakerOpenUntilMs = 0;
        state.circuitBreakerHalfOpenProbeCount = 0;
        state.circuitBreakerHalfOpenSuccessCount = 0;
        state.circuitBreakerHalfOpenSinceMs = 0;
        state.transientFailureRateObservations = [];
        state.slowCallRateObservations = [];
        state.circuitBreakerOpenStreak = 0;
    };
    const executeBotTask = typeof botExecute === 'function'
        ? botExecute
        : async (request, runtimeBot) => runtimeBot.executeTask(request);
    const store = new FileTaskStore({ filePath: storePath, now });
    const orchestrator = new TaskOrchestrator({
        localAgentId,
        transport: {
            async send() {}
        },
        store,
        now
    });
    const bot = botRuntime
        ? new OpenClawBot({
            agentId: botAgentId,
            repoRoot: botRepoRoot || undefined,
            skillHardeningPolicy,
            skillHardeningMinScore,
            skillDeployabilityIndexPath,
            skillHardeningProfilePath,
            nowFactory: now
        })
        : null;

    const hydration = await orchestrator.hydrate();
    const files = await listOutboxFiles(outboxDir);
    const followupEntries = [];

    const stats = {
        loaded: hydration.loaded,
        filesFound: files.length,
        filesArchived: 0,
        envelopesSeen: 0,
        envelopesInvalid: 0,
        receiptsAccepted: 0,
        resultsAccepted: 0,
        skippedUnknownTask: 0,
        skippedTerminal: 0,
        dryRun,
        botRuntime,
        botTasksExecuted: 0,
        botTasksFailed: 0,
        botSkillTasks: 0,
        botSkillHardeningBlocked: 0,
        botSkillActionTasks: 0,
        botSkillBlueprintTasks: 0,
        botCapabilityTasks: 0,
        botCapabilityActionTasks: 0,
        botGenericTasks: 0,
        botRetriesAttempted: 0,
        botRetriesRecovered: 0,
        botRetriesExhausted: 0,
        botRetriesBudgetExhausted: 0,
        botHedgesBudgetLimited: 0,
        botRetriesDeadlineExceeded: 0,
        botAttemptTimeouts: 0,
        botHedgedAttemptsLaunched: 0,
        botHedgedSuccesses: 0,
        botHedgedWins: 0,
        botCircuitBreakerOpened: 0,
        botCircuitBreakerOpenSkips: 0,
        botCircuitBreakerHalfOpenProbes: 0,
        botCircuitBreakerClosed: 0,
        followupTasksGenerated: 0,
        followupTasksAccepted: 0,
        followupTasksSaved: 0,
        followupTasksSkipped: 0
    };

    for (const filePath of files) {
        // eslint-disable-next-line no-await-in-loop
        const raw = await fs.readFile(filePath, 'utf8');
        const parsed = parseEnvelopeLines(raw, filePath);
        stats.envelopesSeen += parsed.envelopes.length;
        stats.envelopesInvalid += parsed.invalid;

        for (const envelope of parsed.envelopes) {
            const request = envelope.message;
            const taskId = request.id;
            const target = request.target || envelope.target || 'agent:worker';
            const record = orchestrator.getTask(taskId);
            if (!record) {
                stats.skippedUnknownTask++;
                continue;
            }
            if (TERMINAL_STATUSES.has(record.status)) {
                stats.skippedTerminal++;
                continue;
            }
            if (dryRun) {
                continue;
            }

            const accepted = orchestrator.ingestReceipt(buildTaskReceipt({
                taskId,
                from: target,
                accepted: true,
                etaMs,
                timestamp: safeNow(now)
            }));
            if (accepted) {
                stats.receiptsAccepted++;
            }

            let resultStatus = 'success';
            let resultOutput = `Processed by outbox worker: ${request.task}`;
            let resultArtifacts;
            let resultMetrics;

            if (bot) {
                const targetResilienceState = getResilienceState(target);
                let execution = null;
                let attempts = 0;
                let previousRetryDelayMs = null;
                let transientFailureRetried = false;
                let retryBudgetBlocked = false;
                let retryDeadlineBlocked = false;
                const retryStartedAtMs = safeNow(now);
                const taskNow = safeNow(now);
                const startedInCircuitHalfOpen = circuitBreakerEnabled
                    && targetResilienceState.circuitBreakerOpenUntilMs > 0
                    && taskNow >= targetResilienceState.circuitBreakerOpenUntilMs;
                if (startedInCircuitHalfOpen && targetResilienceState.circuitBreakerHalfOpenSinceMs <= 0) {
                    targetResilienceState.circuitBreakerHalfOpenSinceMs = targetResilienceState.circuitBreakerOpenUntilMs;
                }
                if (circuitBreakerEnabled && targetResilienceState.circuitBreakerOpenUntilMs > 0 && !startedInCircuitHalfOpen) {
                    const remainingMs = Math.max(0, targetResilienceState.circuitBreakerOpenUntilMs - taskNow);
                    execution = createBotFailureExecution({
                        output: `Task execution skipped: circuit breaker is open for another ${remainingMs}ms after consecutive transient failures.`,
                        metrics: {
                            circuitBreakerOpen: 1,
                            circuitBreakerRemainingMs: remainingMs,
                            retryable: 1
                        }
                    });
                    stats.botCircuitBreakerOpenSkips++;
                }
                if (
                    !execution
                    && startedInCircuitHalfOpen
                    && normalizedBotCircuitBreakerHalfOpenMaxWaitMs > 0
                    && taskNow - targetResilienceState.circuitBreakerHalfOpenSinceMs >= normalizedBotCircuitBreakerHalfOpenMaxWaitMs
                ) {
                    execution = createBotFailureExecution({
                        output: 'Task execution skipped: half-open max-wait window exceeded before breaker could close; reopening cooldown window.',
                        metrics: {
                            circuitBreakerOpen: 1,
                            circuitBreakerHalfOpenMaxWaitExceeded: 1,
                            circuitBreakerHalfOpenElapsedMs: Math.max(0, taskNow - targetResilienceState.circuitBreakerHalfOpenSinceMs),
                            retryable: 1
                        }
                    });
                    const reopened = openCircuitBreaker(targetResilienceState);
                    stats.botCircuitBreakerOpened++;
                    stats.botCircuitBreakerOpenSkips++;
                    execution = {
                        ...execution,
                        output: `${execution.output} Circuit breaker reopened for ${reopened.cooldownMs}ms after half-open max wait.`,
                        metrics: {
                            ...(execution.metrics || {}),
                            circuitBreakerOpened: 1,
                            circuitBreakerCooldownMs: reopened.cooldownMs,
                            circuitBreakerOpenStreak: reopened.openStreak
                        }
                    };
                }
                if (
                    !execution
                    && startedInCircuitHalfOpen
                    && targetResilienceState.circuitBreakerHalfOpenProbeCount >= normalizedBotCircuitBreakerHalfOpenMaxProbes
                ) {
                    execution = createBotFailureExecution({
                        output: 'Task execution skipped: half-open probe limit reached before circuit could close; reopening cooldown window.',
                        metrics: {
                            circuitBreakerOpen: 1,
                            circuitBreakerHalfOpenProbeLimitReached: 1,
                            retryable: 1
                        }
                    });
                    const reopened = openCircuitBreaker(targetResilienceState);
                    stats.botCircuitBreakerOpened++;
                    stats.botCircuitBreakerOpenSkips++;
                    execution = {
                        ...execution,
                        output: `${execution.output} Circuit breaker reopened for ${reopened.cooldownMs}ms after half-open probe limit.`,
                        metrics: {
                            ...(execution.metrics || {}),
                            circuitBreakerOpened: 1,
                            circuitBreakerCooldownMs: reopened.cooldownMs,
                            circuitBreakerOpenStreak: reopened.openStreak
                        }
                    };
                }
                if (retryBudgetEnabled) {
                    targetResilienceState.retryBudgetTokens += normalizedBotRetryBudgetRatio;
                }
                if (hedgeBudgetEnabled) {
                    targetResilienceState.hedgeBudgetTokens += normalizedBotHedgeBudgetRatio;
                }
                while (!execution && attempts < normalizedBotMaxAttempts) {
                    attempts++;
                    let effectiveHedgedAttemptCount = normalizedBotHedgedAttemptCount;
                    let hedgeBudgetLimited = false;
                    if (hedgeBudgetEnabled) {
                        const desiredFollowers = Math.max(0, normalizedBotHedgedAttemptCount - 1);
                        const availableFollowers = Math.max(
                            0,
                            Math.min(
                                desiredFollowers,
                                Math.floor(targetResilienceState.hedgeBudgetTokens)
                            )
                        );
                        effectiveHedgedAttemptCount = 1 + availableFollowers;
                        hedgeBudgetLimited = availableFollowers < desiredFollowers;
                        if (hedgeBudgetLimited) {
                            stats.botHedgesBudgetLimited++;
                        }
                    }
                    const timeoutResolution = resolveAdaptiveAttemptTimeoutMs({
                        staticTimeoutMs: normalizedBotAttemptTimeoutMs,
                        autoEnabled: attemptTimeoutAutoEnabled,
                        observations: targetResilienceState.botAttemptDurationObservations,
                        autoPercentile: normalizedBotAttemptTimeoutAutoPercentile,
                        autoMinSamples: normalizedBotAttemptTimeoutAutoMinSamples,
                        autoBlend: normalizedBotAttemptTimeoutAutoBlend
                    });
                    const hedgedDelayResolution = resolveAdaptiveHedgedDelayMs({
                        staticDelayMs: normalizedBotHedgedDelayMs,
                        autoEnabled: hedgedDelayAutoEnabled,
                        observations: targetResilienceState.botAttemptDurationObservations,
                        autoPercentile: normalizedBotHedgedDelayAutoPercentile,
                        autoMinSamples: normalizedBotHedgedDelayAutoMinSamples,
                        autoBlend: normalizedBotHedgedDelayAutoBlend,
                        maxDelayMs: timeoutResolution.timeoutMs > 0
                            ? Math.max(0, timeoutResolution.timeoutMs - 1)
                            : Number.MAX_SAFE_INTEGER
                    });
                    // eslint-disable-next-line no-await-in-loop
                    execution = await executeBotTaskWithTimeout({
                        request,
                        bot,
                        attempt: attempts,
                        executeBotTask,
                        timeoutMs: timeoutResolution.timeoutMs,
                        hedgedAttemptCount: effectiveHedgedAttemptCount,
                        hedgedDelayMs: hedgedDelayResolution.delayMs,
                        nowFactory: now
                    });
                    const hedgedAttemptsLaunched = parseNonNegativeInt(execution?.metrics?.hedgeAttemptsLaunched, 0);
                    if (hedgeBudgetEnabled && hedgedAttemptsLaunched > 1) {
                        targetResilienceState.hedgeBudgetTokens = Math.max(
                            0,
                            targetResilienceState.hedgeBudgetTokens - (hedgedAttemptsLaunched - 1)
                        );
                    }
                    if (hedgedAttemptsLaunched > 1) {
                        stats.botHedgedAttemptsLaunched += hedgedAttemptsLaunched - 1;
                    }
                    if (
                        parseNonNegativeInt(execution?.metrics?.hedgeSelectedAttempt, 1) > 1
                        && execution?.status !== 'failure'
                    ) {
                        stats.botHedgedSuccesses++;
                    }
                    if (parseNonNegativeInt(execution?.metrics?.hedgeWonRace, 0) >= 1) {
                        stats.botHedgedWins++;
                    }
                    const durationMs = Number(execution?.metrics?.durationMs);
                    targetResilienceState.botAttemptDurationObservations = updateDurationObservations(
                        targetResilienceState.botAttemptDurationObservations,
                        durationMs,
                        adaptiveDurationWindowSize
                    );
                    execution = {
                        ...execution,
                        metrics: {
                            ...(execution?.metrics || {}),
                            attemptTimeoutMs: timeoutResolution.timeoutMs,
                            ...(timeoutResolution.autoTargetMs !== null
                                ? {
                                    attemptTimeoutAutoTargetMs: timeoutResolution.autoTargetMs
                                }
                                : {}),
                            ...(hedgedDelayResolution.autoTargetMs !== null
                                ? {
                                    hedgeDelayAutoTargetMs: hedgedDelayResolution.autoTargetMs
                                }
                                : {}),
                            ...(hedgeBudgetLimited
                                ? {
                                    hedgeBudgetLimited: 1
                                }
                                : {}),
                            ...(hedgeBudgetEnabled
                                ? {
                                    hedgeBudgetTokensRemaining: Number(
                                        targetResilienceState.hedgeBudgetTokens.toFixed(4)
                                    )
                                }
                                : {})
                        }
                    };
                    if (Number(execution?.metrics?.timedOut) >= 1) {
                        stats.botAttemptTimeouts++;
                    }
                    const shouldRetry = isTransientBotFailure(execution) && attempts < normalizedBotMaxAttempts;
                    if (!shouldRetry) break;
                    if (normalizedBotRetryMaxElapsedMs > 0) {
                        const elapsedMs = Math.max(0, safeNow(now) - retryStartedAtMs);
                        if (elapsedMs >= normalizedBotRetryMaxElapsedMs) {
                            retryDeadlineBlocked = true;
                            stats.botRetriesDeadlineExceeded++;
                            execution = {
                                ...execution,
                                output: `${execution.output} Retry deadline exceeded (${elapsedMs}ms >= ${normalizedBotRetryMaxElapsedMs}ms); skipping additional retries.`,
                                metrics: {
                                    ...(execution.metrics || {}),
                                    retryDeadlineExceeded: 1,
                                    retryElapsedMs: elapsedMs
                                }
                            };
                            break;
                        }
                    }
                    if (retryBudgetEnabled && targetResilienceState.retryBudgetTokens < 1) {
                        retryBudgetBlocked = true;
                        stats.botRetriesBudgetExhausted++;
                        execution = {
                            ...execution,
                            output: `${execution.output} Retry budget exhausted; skipping additional retries.`,
                            metrics: {
                                ...(execution.metrics || {}),
                                retryBudgetExhausted: 1
                            }
                        };
                        break;
                    }
                    transientFailureRetried = true;
                    stats.botRetriesAttempted++;
                    if (retryBudgetEnabled) {
                        targetResilienceState.retryBudgetTokens = Math.max(0, targetResilienceState.retryBudgetTokens - 1);
                    }
                    // eslint-disable-next-line no-await-in-loop
                    const retryDelayMs = computeRetryDelayMs({
                        baseDelayMs: normalizedBotRetryBaseDelayMs,
                        maxDelayMs: normalizedBotRetryMaxDelayMs,
                        attempt: attempts,
                        jitter: normalizedBotRetryJitter,
                        jitterStrategy: normalizedBotRetryJitterStrategy,
                        previousDelayMs: previousRetryDelayMs,
                        rng
                    });
                    let effectiveRetryDelayMs = retryDelayMs;
                    if (normalizedBotRetryHintMaxDelayMs > 0) {
                        const retryAfterHintMs = extractRetryAfterHintMs(execution, { nowFactory: now });
                        if (retryAfterHintMs !== null) {
                            const jitteredRetryAfterHintMs = applyRetryHintJitterMs({
                                delayMs: clamp(retryAfterHintMs, 0, normalizedBotRetryHintMaxDelayMs),
                                jitter: normalizedBotRetryHintJitter,
                                rng
                            });
                            effectiveRetryDelayMs = Math.max(
                                retryDelayMs,
                                jitteredRetryAfterHintMs
                            );
                        }
                    }
                    if (normalizedBotRetryMaxElapsedMs > 0) {
                        const elapsedMs = Math.max(0, safeNow(now) - retryStartedAtMs);
                        const remainingBudgetMs = normalizedBotRetryMaxElapsedMs - elapsedMs;
                        if (remainingBudgetMs <= 0 || effectiveRetryDelayMs > remainingBudgetMs) {
                            retryDeadlineBlocked = true;
                            stats.botRetriesDeadlineExceeded++;
                            execution = {
                                ...execution,
                                output: `${execution.output} Retry deadline would be exceeded by waiting ${effectiveRetryDelayMs}ms with ${Math.max(0, remainingBudgetMs)}ms remaining; skipping additional retries.`,
                                metrics: {
                                    ...(execution.metrics || {}),
                                    retryDeadlineExceeded: 1,
                                    retryElapsedMs: elapsedMs,
                                    retryRemainingBudgetMs: Math.max(0, remainingBudgetMs)
                                }
                            };
                            break;
                        }
                    }
                    previousRetryDelayMs = effectiveRetryDelayMs;
                    // eslint-disable-next-line no-await-in-loop
                    await sleep(effectiveRetryDelayMs);
                }
                if (!execution) {
                    execution = {
                        mode: 'generic',
                        status: 'failure',
                        output: 'Task execution failed: empty execution response.',
                        metrics: {},
                        artifacts: [],
                        followupTasks: []
                    };
                }
                stats.botTasksExecuted++;
                stats[botModeToStatField(execution.mode)]++;
                if (attempts > 1 && execution.status !== 'failure') {
                    stats.botRetriesRecovered++;
                } else if (execution.status === 'failure' && (transientFailureRetried || retryBudgetBlocked || retryDeadlineBlocked)) {
                    stats.botRetriesExhausted++;
                }
                if (
                    execution.mode === 'skill'
                    && execution.status === 'partial'
                    && Number(execution.metrics?.hardeningDeployable) === 0
                ) {
                    stats.botSkillHardeningBlocked++;
                }

                if (execution.status === 'failure') {
                    stats.botTasksFailed++;
                }

                const transientBotFailure = isTransientBotFailure(execution);
                const skippedByCircuitBreaker = Number(execution?.metrics?.circuitBreakerOpen) >= 1;
                if (!circuitBreakerEnabled || skippedByCircuitBreaker) {
                    if (!circuitBreakerEnabled) {
                        closeCircuitBreaker(targetResilienceState);
                    }
                } else if (startedInCircuitHalfOpen) {
                    stats.botCircuitBreakerHalfOpenProbes++;
                    if (execution.status === 'failure') {
                        const circuitBreakerRetryAfterHintMs =
                            normalizedBotRetryHintMaxDelayMs > 0 && transientBotFailure
                                ? extractRetryAfterHintMs(execution, { nowFactory: now })
                                : null;
                        const reopened = openCircuitBreaker(targetResilienceState, {
                            retryAfterHintMs: circuitBreakerRetryAfterHintMs
                        });
                        stats.botCircuitBreakerOpened++;
                        execution = {
                            ...execution,
                            output: `${execution.output} Circuit breaker reopened for ${reopened.cooldownMs}ms after failed half-open probe.`,
                            metrics: {
                                ...(execution.metrics || {}),
                                circuitBreakerOpened: 1,
                                circuitBreakerCooldownMs: reopened.cooldownMs,
                                circuitBreakerOpenStreak: reopened.openStreak,
                                ...(reopened.retryAfterHintMs !== null
                                    ? {
                                        circuitBreakerRetryAfterHintMs: reopened.retryAfterHintMs
                                    }
                                    : {})
                            }
                        };
                    } else {
                        targetResilienceState.circuitBreakerHalfOpenProbeCount += 1;
                        targetResilienceState.circuitBreakerHalfOpenSuccessCount += 1;
                        if (targetResilienceState.circuitBreakerHalfOpenSuccessCount >= normalizedBotCircuitBreakerHalfOpenSuccessThreshold) {
                            closeCircuitBreaker(targetResilienceState);
                            stats.botCircuitBreakerClosed++;
                        } else if (targetResilienceState.circuitBreakerHalfOpenProbeCount >= normalizedBotCircuitBreakerHalfOpenMaxProbes) {
                            const reopened = openCircuitBreaker(targetResilienceState);
                            stats.botCircuitBreakerOpened++;
                            execution = {
                                ...execution,
                                output: `${execution.output} Circuit breaker reopened for ${reopened.cooldownMs}ms after half-open probe limit without meeting success threshold.`,
                                metrics: {
                                    ...(execution.metrics || {}),
                                    circuitBreakerOpened: 1,
                                    circuitBreakerHalfOpenProbeLimitReached: 1,
                                    circuitBreakerCooldownMs: reopened.cooldownMs,
                                    circuitBreakerOpenStreak: reopened.openStreak
                                }
                            };
                        }
                    }
                } else {
                    targetResilienceState.transientFailureRateObservations = updateBinaryRateObservations(
                        targetResilienceState.transientFailureRateObservations,
                        execution.status === 'failure' && transientBotFailure,
                        normalizedBotCircuitBreakerFailureRateWindow
                    );
                    const durationMs = Number(execution?.metrics?.durationMs);
                    if (Number.isFinite(durationMs) && durationMs >= 0) {
                        targetResilienceState.slowCallRateObservations = updateBinaryRateObservations(
                            targetResilienceState.slowCallRateObservations,
                            durationMs >= normalizedBotCircuitBreakerSlowCallDurationMs,
                            normalizedBotCircuitBreakerSlowCallWindow
                        );
                    }

                    if (execution.status === 'failure' && transientBotFailure) {
                        targetResilienceState.consecutiveTransientBotFailures += 1;
                    } else {
                        targetResilienceState.consecutiveTransientBotFailures = 0;
                    }

                    const shouldOpenByConsecutiveFailures =
                        normalizedBotCircuitBreakerFailureThreshold > 0
                        && targetResilienceState.consecutiveTransientBotFailures >= normalizedBotCircuitBreakerFailureThreshold;
                    const failureRate = computeBinaryRate(targetResilienceState.transientFailureRateObservations);
                    const hasEnoughFailureRateSamples =
                        targetResilienceState.transientFailureRateObservations.length >= normalizedBotCircuitBreakerFailureRateMinSamples;
                    const shouldOpenByFailureRate =
                        circuitBreakerFailureRateEnabled
                        && hasEnoughFailureRateSamples
                        && failureRate >= normalizedBotCircuitBreakerFailureRateThreshold;
                    const slowCallRate = computeBinaryRate(targetResilienceState.slowCallRateObservations);
                    const hasEnoughSlowCallSamples =
                        targetResilienceState.slowCallRateObservations.length >= normalizedBotCircuitBreakerSlowCallMinSamples;
                    const shouldOpenBySlowCallRate =
                        circuitBreakerSlowCallRateEnabled
                        && hasEnoughSlowCallSamples
                        && slowCallRate >= normalizedBotCircuitBreakerSlowCallRateThreshold;

                    if (shouldOpenByConsecutiveFailures || shouldOpenByFailureRate || shouldOpenBySlowCallRate) {
                        const failureRateSampleCount = targetResilienceState.transientFailureRateObservations.length;
                        const slowCallRateSampleCount = targetResilienceState.slowCallRateObservations.length;
                        const reason = shouldOpenByConsecutiveFailures
                            ? `transient-failure threshold`
                            : shouldOpenByFailureRate
                                ? `transient failure-rate threshold (${failureRate.toFixed(3)} >= ${normalizedBotCircuitBreakerFailureRateThreshold.toFixed(3)} over ${failureRateSampleCount} samples)`
                                : `slow-call rate threshold (${slowCallRate.toFixed(3)} >= ${normalizedBotCircuitBreakerSlowCallRateThreshold.toFixed(3)} over ${slowCallRateSampleCount} samples with duration >= ${normalizedBotCircuitBreakerSlowCallDurationMs}ms)`;
                        const circuitBreakerRetryAfterHintMs =
                            normalizedBotRetryHintMaxDelayMs > 0 && execution.status === 'failure' && transientBotFailure
                                ? extractRetryAfterHintMs(execution, { nowFactory: now })
                                : null;
                        const reopened = openCircuitBreaker(targetResilienceState, {
                            retryAfterHintMs: circuitBreakerRetryAfterHintMs
                        });
                        stats.botCircuitBreakerOpened++;
                        execution = {
                            ...execution,
                            output: `${execution.output} Circuit breaker opened for ${reopened.cooldownMs}ms after ${reason}.`,
                            metrics: {
                                ...(execution.metrics || {}),
                                circuitBreakerOpened: 1,
                                circuitBreakerCooldownMs: reopened.cooldownMs,
                                circuitBreakerOpenStreak: reopened.openStreak,
                                ...(reopened.retryAfterHintMs !== null
                                    ? {
                                        circuitBreakerRetryAfterHintMs: reopened.retryAfterHintMs
                                    }
                                    : {}),
                                ...(shouldOpenByFailureRate
                                    ? {
                                        circuitBreakerFailureRate: failureRate,
                                        circuitBreakerFailureRateSamples: failureRateSampleCount
                                    }
                                    : {}),
                                ...(shouldOpenBySlowCallRate
                                    ? {
                                        circuitBreakerSlowCallRate: slowCallRate,
                                        circuitBreakerSlowCallRateSamples: slowCallRateSampleCount,
                                        circuitBreakerSlowCallDurationMs: normalizedBotCircuitBreakerSlowCallDurationMs
                                    }
                                    : {})
                            }
                        };
                    }
                }

                resultStatus = normalizeBotResultStatus(execution.status);
                resultOutput = execution.output;
                resultArtifacts = sanitizeArtifacts(execution.artifacts);
                resultMetrics = sanitizeMetrics({
                    ...execution.metrics,
                    followupTaskCount: Array.isArray(execution.followupTasks)
                        ? execution.followupTasks.length
                        : 0
                });

                if (enqueueFollowupTasks && Array.isArray(execution.followupTasks) && execution.followupTasks.length > 0) {
                    for (let i = 0; i < execution.followupTasks.length; i++) {
                        followupEntries.push({
                            source: `openclaw-bot:${taskId}`,
                            request: execution.followupTasks[i]
                        });
                    }
                    stats.followupTasksGenerated += execution.followupTasks.length;
                }

                if (resultStatus !== 'failure' && chooseResultStatus(failureRate, rng) === 'failure') {
                    resultStatus = 'failure';
                    resultOutput = `Injected worker failure after bot execution: ${request.task}`;
                    resultMetrics = sanitizeMetrics({
                        ...(resultMetrics || {}),
                        chaosInjected: 1
                    });
                }
            } else {
                resultStatus = chooseResultStatus(failureRate, rng);
                resultOutput = resultStatus === 'success'
                    ? `Processed by outbox worker: ${request.task}`
                    : `Failed by outbox worker: ${request.task}`;
            }

            const resultAccepted = orchestrator.ingestResult(buildTaskResult({
                taskId,
                from: target,
                status: resultStatus,
                output: resultOutput,
                artifacts: resultArtifacts,
                metrics: resultMetrics,
                completedAt: safeNow(now) + Math.max(0, Number(resultDelayMs) || 0)
            }));
            if (resultAccepted) {
                stats.resultsAccepted++;
            }
        }

        if (dryRun) continue;

        // Only archive after successful processing of file contents.
        const archivedPath = archiveFilePath(filePath, archiveDir, now);
        // eslint-disable-next-line no-await-in-loop
        await fs.mkdir(path.dirname(archivedPath), { recursive: true });
        // eslint-disable-next-line no-await-in-loop
        await fs.rename(filePath, archivedPath);
        stats.filesArchived++;
    }

    if (!dryRun) {
        await orchestrator.flush();

        if (bot && enqueueFollowupTasks && followupEntries.length > 0) {
            const enqueueResult = await enqueueTaskEntries({
                storePath,
                entries: followupEntries,
                actor: botAgentId,
                nowFactory: now
            });

            stats.followupTasksAccepted = enqueueResult.stats.accepted;
            stats.followupTasksSaved = enqueueResult.stats.saved;
            stats.followupTasksSkipped = enqueueResult.skipped.length;
        }
    }

    return stats;
}
