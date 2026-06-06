import { HandshakeRequest, HandshakeResponse } from '../index.js';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_SUPPORTED_PROTOCOLS = ['swarm/0.1'];
const DEFAULT_CAPABILITIES = ['log-analysis', 'task-execution'];
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_RETRIES = 0;
const DEFAULT_RETRY_DELAY_MS = 250;
const DEFAULT_BACKOFF_MULTIPLIER = 2;
const DEFAULT_MAX_RETRY_DELAY_MS = 5_000;

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
        return (
            error.code === 'TIMEOUT' ||
            error.code === 'TRANSPORT_ERROR' ||
            error.code === 'RETRYABLE_REJECTION'
        );
    }

    return false;
}

function parseRetryAfterMsFromError(error) {
    if (!error || typeof error !== 'object') return null;

    const candidateValues = [
        error.retryAfterMs,
        error?.details?.retryAfterMs
    ];

    for (const value of candidateValues) {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
            return numeric;
        }
    }

    return null;
}

function isTransientRetrySignal(error) {
    if (!error || typeof error !== 'object') return false;

    const status = Number(error.status ?? error.statusCode ?? error?.details?.status);
    if (status === 429 || status === 503) return true;

    const code = String(error.code ?? error?.details?.code ?? '').toUpperCase();
    return code === 'TOO_MANY_REQUESTS' || code === 'RATE_LIMITED' || code === 'SERVICE_UNAVAILABLE';
}

function resolveAttemptTimeoutMs(timeoutMs, retryBudgetMs, startedAtMs, nowFactory = Date.now) {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return timeoutMs;
    if (!Number.isFinite(retryBudgetMs) || retryBudgetMs <= 0) return timeoutMs;

    const elapsedMs = Math.max(0, Number(nowFactory()) - startedAtMs);
    const remainingBudgetMs = retryBudgetMs - elapsedMs;
    if (remainingBudgetMs <= 0) {
        return 1;
    }

    return Math.max(1, Math.min(timeoutMs, remainingBudgetMs));
}

function computeRetryDelayMs({
    attempt,
    baseDelayMs,
    multiplier,
    maxDelayMs,
    random,
    retryAfterMs
}) {
    if (!Number.isFinite(baseDelayMs) || baseDelayMs <= 0) return 0;

    const exponent = Math.max(0, attempt - 1);
    const exponentialDelay = baseDelayMs * Math.pow(multiplier, exponent);
    const cappedDelay = Math.min(exponentialDelay, maxDelayMs);
    const floorDelay = Number.isFinite(retryAfterMs) && retryAfterMs > 0
        ? Math.max(cappedDelay, retryAfterMs)
        : cappedDelay;

    // Full jitter backoff reduces synchronized retry storms under contention.
    const r = Math.max(0, Math.min(1, Number(random())));
    return Math.max(1, Math.floor(r * floorDelay));
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
    const retryBackoffMultiplier = Number.isFinite(options.retryBackoffMultiplier) && options.retryBackoffMultiplier >= 1
        ? Number(options.retryBackoffMultiplier)
        : DEFAULT_BACKOFF_MULTIPLIER;
    const maxRetryDelayMs = Number.isFinite(options.maxRetryDelayMs) && options.maxRetryDelayMs > 0
        ? Number(options.maxRetryDelayMs)
        : DEFAULT_MAX_RETRY_DELAY_MS;
    const retryBudgetMs = Number.isFinite(options.retryBudgetMs) && options.retryBudgetMs > 0
        ? Number(options.retryBudgetMs)
        : null;
    const random = typeof options.random === 'function' ? options.random : Math.random;
    const now = typeof options.nowFactory === 'function' ? options.nowFactory : Date.now;
    const logger = options.logger ?? console;

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
    const handshakeStartedAtMs = now();
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const attemptStartMs = now();

        try {
            logger.info?.(
                `[Swarm] Handshake attempt ${attempt}/${maxAttempts} ${handshakeId} from ${fromAgentId} to ${targetAgentId}`
            );

            const rawResponse = await withTimeout(
                () => transport.sendAndWait(targetAgentId, request),
                resolveAttemptTimeoutMs(timeoutMs, retryBudgetMs, handshakeStartedAtMs, now)
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
                const retryAfterMs = Number(response.retryAfterMs);
                if (attempt < maxAttempts && Number.isFinite(retryAfterMs) && retryAfterMs > 0) {
                    throw new HandshakeError('RETRYABLE_REJECTION', 'Handshake peer requested retry', {
                        reason: response.reason ?? null,
                        retryAfterMs
                    });
                }
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
            const retryBudgetExhausted = retryBudgetMs !== null
                && now() - handshakeStartedAtMs >= retryBudgetMs;

            if (
                !retryBudgetExhausted &&
                attempt < maxAttempts &&
                (isRetryableError(wrappedError) || isTransientRetrySignal(error))
            ) {
                logger.warn?.(`[Swarm] Handshake attempt ${attempt} failed (${wrappedError.code}), retrying...`);
                if (retryDelayMs > 0) {
                    const retryAfterMs = parseRetryAfterMsFromError(error) ?? parseRetryAfterMsFromError(wrappedError);
                    const delayMs = computeRetryDelayMs({
                        attempt,
                        baseDelayMs: retryDelayMs,
                        multiplier: retryBackoffMultiplier,
                        maxDelayMs: maxRetryDelayMs,
                        random,
                        retryAfterMs
                    });
                    await wait(delayMs);
                }
                continue;
            }

            throw wrappedError;
        }
    }

    throw new HandshakeError('UNKNOWN', 'Handshake failed without a terminal error');
}
