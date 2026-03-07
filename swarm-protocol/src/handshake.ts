import { HandshakeRequest, HandshakeResponse } from '../index.js';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_SUPPORTED_PROTOCOLS = ['swarm/0.1'];
const DEFAULT_CAPABILITIES = ['log-analysis', 'task-execution'];
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_RETRIES = 0;
const DEFAULT_RETRY_DELAY_MS = 250;
const DEFAULT_RETRY_STRATEGY = 'linear';
const DEFAULT_RETRY_JITTER = 'none';
const DEFAULT_MAX_RETRY_HINT_MS = 60_000;

export class HandshakeError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'HandshakeError';
        this.code = code;
        this.details = details;
    }
}

function normalizeStringArray(value, fieldName) {
    if (value === undefined) return [];
    if (!Array.isArray(value)) {
        throw new HandshakeError('INVALID_OPTIONS', `${fieldName} must be an array`, { fieldName, value });
    }

    const normalized = [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];

    if (value.length > 0 && normalized.length === 0) {
        throw new HandshakeError('INVALID_OPTIONS', `${fieldName} must contain non-empty strings`, { fieldName });
    }

    return normalized;
}

function validateTransport(transport) {
    if (!transport || typeof transport.sendAndWait !== 'function') {
        throw new HandshakeError('INVALID_TRANSPORT', 'Transport must expose sendAndWait(targetAgentId, request)', {
            received: typeof transport
        });
    }
}

function parseProtocolVersion(protocol) {
    const match = /^swarm\/(\d+)(?:\.(\d+))?(?:\.(\d+))?$/.exec(protocol);
    if (!match) return null;
    return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)];
}

function protocolComparatorDesc(a, b) {
    const va = parseProtocolVersion(a);
    const vb = parseProtocolVersion(b);

    if (!va || !vb) return b.localeCompare(a);

    for (let i = 0; i < 3; i++) {
        if (va[i] !== vb[i]) return vb[i] - va[i];
    }

    return 0;
}

function negotiateProtocol(localProtocols, response) {
    if (response.protocol) {
        if (localProtocols.includes(response.protocol)) {
            return response.protocol;
        }
        return null;
    }

    const remoteSupported = Array.isArray(response.supportedProtocols)
        ? response.supportedProtocols
        : [];

    const mutual = remoteSupported.filter((version) => localProtocols.includes(version));
    if (mutual.length === 0) return null;

    return mutual.sort(protocolComparatorDesc)[0];
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function clampNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function readHeaderValue(headers, key) {
    if (!headers) return null;
    const target = String(key).toLowerCase();

    if (typeof headers.get === 'function') {
        return headers.get(key) ?? headers.get(target) ?? null;
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

function parseRetryHintMsFromMessage(message, nowMs = Date.now()) {
    if (typeof message !== 'string' || !message.trim()) return null;

    const explicitMsMatch = message.match(/retry[_-]?after[_-]?ms\s*[:=]\s*(\d+)(?!\d)/i);
    if (explicitMsMatch) {
        return Number(explicitMsMatch[1]);
    }

    const explicitSecondsMatch = message.match(/retry[_-]?after\s*[:=]\s*(\d+)\s*(?:s|sec|secs|second|seconds)?(?![A-Za-z])/i);
    if (explicitSecondsMatch) {
        return Number(explicitSecondsMatch[1]) * 1000;
    }

    const explicitDateMatch = message.match(/retry[_-]?after\s*[:=]\s*([A-Za-z]{3},\s*\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+GMT)/i);
    if (explicitDateMatch) {
        const dateMs = Date.parse(explicitDateMatch[1].trim());
        if (Number.isFinite(dateMs)) {
            return Math.max(0, dateMs - nowMs);
        }
    }

    return null;
}

function extractRetryHintMs(error, nowMs = Date.now()) {
    if (!error || typeof error !== 'object') return null;

    const directMs = Number(error.retryAfterMs ?? error.details?.retryAfterMs);
    if (Number.isFinite(directMs) && directMs >= 0) {
        return directMs;
    }

    const directSeconds = Number(error.retryAfterSeconds ?? error.details?.retryAfterSeconds);
    if (Number.isFinite(directSeconds) && directSeconds >= 0) {
        return directSeconds * 1000;
    }

    const retryAfterHeader = readHeaderValue(
        error.headers
        ?? error.response?.headers
        ?? error.details?.headers
        ?? null,
        'retry-after'
    );
    const retryAfterHeaderMs = parseRetryAfterHeaderMs(retryAfterHeader, nowMs);
    if (Number.isFinite(retryAfterHeaderMs)) {
        return retryAfterHeaderMs;
    }

    const retryAfterValue = error.retryAfter ?? error.details?.retryAfter;
    const retryAfterValueMs = parseRetryAfterHeaderMs(retryAfterValue, nowMs);
    if (Number.isFinite(retryAfterValueMs)) {
        return retryAfterValueMs;
    }

    return parseRetryHintMsFromMessage(error.message, nowMs);
}

function resolveRetryDelayMs({
    attempt,
    retryDelayMs,
    retryStrategy,
    maxRetryDelayMs,
    retryJitter,
    random
}) {
    const multiplier = retryStrategy === 'exponential'
        ? (2 ** Math.max(0, attempt - 1))
        : Math.max(1, attempt);

    let delayMs = retryDelayMs * multiplier;
    if (Number.isFinite(maxRetryDelayMs) && maxRetryDelayMs >= 0) {
        delayMs = Math.min(delayMs, maxRetryDelayMs);
    }

    if (retryJitter === 'full' && delayMs > 0) {
        const sample = Number(random?.());
        const ratio = Number.isFinite(sample)
            ? clampNumber(sample, 0, 1)
            : 0.5;
        delayMs *= ratio;
    }

    return Math.max(0, Math.round(delayMs));
}

async function withTimeout(promiseFactory, timeoutMs) {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        return promiseFactory();
    }

    let timer = null;
    try {
        return await Promise.race([
            promiseFactory(),
            new Promise((_, reject) => {
                timer = setTimeout(() => {
                    reject(new HandshakeError('TIMEOUT', `Handshake timed out after ${timeoutMs}ms`, { timeoutMs }));
                }, timeoutMs);
            })
        ]);
    } finally {
        if (timer) clearTimeout(timer);
    }
}

function isRetryableError(error) {
    if (error instanceof HandshakeError) {
        return error.code === 'TIMEOUT' || error.code === 'TRANSPORT_ERROR';
    }

    return false;
}

/**
 * Perform a protocol handshake with reliability controls.
 */
export async function performHandshake(fromAgentId, targetAgentId, transport, options = {}) {
    validateTransport(transport);

    const supportedProtocols = normalizeStringArray(
        options.supportedProtocols ?? DEFAULT_SUPPORTED_PROTOCOLS,
        'supportedProtocols'
    );
    const capabilities = normalizeStringArray(
        options.capabilities ?? DEFAULT_CAPABILITIES,
        'capabilities'
    );
    const requiredCapabilities = normalizeStringArray(
        options.requiredCapabilities ?? [],
        'requiredCapabilities'
    );

    if (supportedProtocols.length === 0) {
        throw new HandshakeError('INVALID_OPTIONS', 'supportedProtocols must contain at least one version');
    }

    const timeoutMs = Number.isFinite(options.timeoutMs)
        ? Number(options.timeoutMs)
        : DEFAULT_TIMEOUT_MS;
    const retries = Number.isInteger(options.retries) && options.retries >= 0
        ? options.retries
        : DEFAULT_RETRIES;
    const retryDelayMs = Number.isFinite(options.retryDelayMs) && options.retryDelayMs >= 0
        ? Number(options.retryDelayMs)
        : DEFAULT_RETRY_DELAY_MS;
    const retryStrategy = options.retryStrategy === 'exponential'
        ? 'exponential'
        : DEFAULT_RETRY_STRATEGY;
    const retryJitter = options.retryJitter === 'full'
        ? 'full'
        : DEFAULT_RETRY_JITTER;
    const maxRetryDelayMs = Number.isFinite(options.maxRetryDelayMs) && options.maxRetryDelayMs >= 0
        ? Number(options.maxRetryDelayMs)
        : Number.POSITIVE_INFINITY;
    const retryBudgetMs = Number.isFinite(options.retryBudgetMs) && options.retryBudgetMs > 0
        ? Number(options.retryBudgetMs)
        : null;
    const maxRetryHintMs = Number.isFinite(options.maxRetryHintMs) && options.maxRetryHintMs > 0
        ? Number(options.maxRetryHintMs)
        : DEFAULT_MAX_RETRY_HINT_MS;
    const now = typeof options.now === 'function' ? options.now : Date.now;
    const sleep = typeof options.sleep === 'function' ? options.sleep : wait;
    const random = typeof options.random === 'function' ? options.random : Math.random;
    const logger = options.logger ?? console;
    const startedAtMs = now();

    const handshakeId = uuidv4();
    const request = {
        kind: 'handshake_request',
        id: handshakeId,
        from: fromAgentId,
        supportedProtocols,
        capabilities,
        timestamp: now()
    };

    HandshakeRequest.parse(request);

    const maxAttempts = retries + 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (retryBudgetMs !== null) {
            const elapsedMs = Math.max(0, now() - startedAtMs);
            if (elapsedMs >= retryBudgetMs) {
                throw new HandshakeError(
                    'RETRY_BUDGET_EXHAUSTED',
                    `Handshake retry budget exhausted after ${elapsedMs}ms`,
                    {
                        retryBudgetMs,
                        elapsedMs,
                        attempts: attempt - 1
                    }
                );
            }
        }

        const attemptStartMs = now();

        try {
            logger.info?.(
                `[Swarm] Handshake attempt ${attempt}/${maxAttempts} ${handshakeId} from ${fromAgentId} to ${targetAgentId}`
            );

            const rawResponse = await withTimeout(
                () => transport.sendAndWait(targetAgentId, request),
                timeoutMs
            );

            const response = HandshakeResponse.parse(rawResponse);
            const latencyMs = now() - attemptStartMs;

            if (response.requestId !== handshakeId) {
                throw new HandshakeError(
                    'ID_MISMATCH',
                    `Handshake ID mismatch: expected ${handshakeId}, got ${response.requestId}`,
                    { expected: handshakeId, actual: response.requestId }
                );
            }

            const peerCapabilities = normalizeStringArray(response.capabilities ?? [], 'response.capabilities');
            const negotiatedProtocol = negotiateProtocol(supportedProtocols, response);

            if (!response.accepted) {
                logger.warn?.(`[Swarm] Handshake rejected by ${targetAgentId}: ${response.reason ?? 'no reason provided'}`);
                return {
                    accepted: false,
                    protocol: negotiatedProtocol,
                    reason: response.reason ?? 'rejected_by_peer',
                    missingCapabilities: [],
                    peerCapabilities,
                    handshakeId,
                    attempts: attempt,
                    latencyMs
                };
            }

            if (!negotiatedProtocol) {
                throw new HandshakeError('PROTOCOL_NEGOTIATION_FAILED', 'No mutually supported protocol could be negotiated', {
                    localSupported: supportedProtocols,
                    remoteProtocol: response.protocol,
                    remoteSupported: response.supportedProtocols ?? []
                });
            }

            const missingCapabilities = requiredCapabilities.filter((capability) => !peerCapabilities.includes(capability));
            if (missingCapabilities.length > 0) {
                logger.warn?.(`[Swarm] Handshake accepted but missing required capabilities: ${missingCapabilities.join(', ')}`);
                return {
                    accepted: false,
                    protocol: negotiatedProtocol,
                    reason: 'missing_capabilities',
                    missingCapabilities,
                    peerCapabilities,
                    handshakeId,
                    attempts: attempt,
                    latencyMs
                };
            }

            logger.info?.(`[Swarm] Handshake accepted! Protocol: ${negotiatedProtocol}`);
            return {
                accepted: true,
                protocol: negotiatedProtocol,
                reason: null,
                missingCapabilities: [],
                peerCapabilities,
                handshakeId,
                attempts: attempt,
                latencyMs
            };
        } catch (error) {
            const wrappedError = error instanceof HandshakeError
                ? error
                : new HandshakeError('TRANSPORT_ERROR', error?.message || 'Transport handshake failed', { cause: error });

            if (attempt < maxAttempts && isRetryableError(wrappedError)) {
                logger.warn?.(`[Swarm] Handshake attempt ${attempt} failed (${wrappedError.code}), retrying...`);
                const retryDelay = resolveRetryDelayMs({
                    attempt,
                    retryDelayMs,
                    retryStrategy,
                    maxRetryDelayMs,
                    retryJitter,
                    random
                });

                let boundedDelayMs = retryDelay;
                const retryHintMs = extractRetryHintMs(wrappedError, now());
                if (Number.isFinite(retryHintMs) && retryHintMs > 0) {
                    boundedDelayMs = Math.max(
                        boundedDelayMs,
                        Math.min(retryHintMs, maxRetryHintMs)
                    );
                }
                if (retryBudgetMs !== null) {
                    const elapsedMs = Math.max(0, now() - startedAtMs);
                    const budgetRemainingMs = Math.max(0, retryBudgetMs - elapsedMs);
                    if (budgetRemainingMs <= 0) {
                        throw new HandshakeError(
                            'RETRY_BUDGET_EXHAUSTED',
                            `Handshake retry budget exhausted after ${elapsedMs}ms`,
                            {
                                retryBudgetMs,
                                elapsedMs,
                                attempts: attempt
                            }
                        );
                    }
                    boundedDelayMs = Math.min(boundedDelayMs, budgetRemainingMs);
                }

                if (boundedDelayMs > 0) {
                    await sleep(boundedDelayMs);
                }
                continue;
            }

            throw wrappedError;
        }
    }

    throw new HandshakeError('UNKNOWN', 'Handshake failed without a terminal error');
}
