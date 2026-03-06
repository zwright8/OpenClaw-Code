import { HandshakeRequest, HandshakeResponse } from '../index.js';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_SUPPORTED_PROTOCOLS = ['swarm/0.1'];
const DEFAULT_CAPABILITIES = ['log-analysis', 'task-execution'];
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_RETRIES = 0;
const DEFAULT_RETRY_DELAY_MS = 250;

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
    const logger = options.logger ?? console;

    const handshakeId = uuidv4();
    const request = {
        kind: 'handshake_request',
        id: handshakeId,
        from: fromAgentId,
        supportedProtocols,
        capabilities,
        timestamp: Date.now()
    };

    HandshakeRequest.parse(request);

    const maxAttempts = retries + 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const attemptStartMs = Date.now();

        try {
            logger.info?.(
                `[Swarm] Handshake attempt ${attempt}/${maxAttempts} ${handshakeId} from ${fromAgentId} to ${targetAgentId}`
            );

            const rawResponse = await withTimeout(
                () => transport.sendAndWait(targetAgentId, request),
                timeoutMs
            );

            const response = HandshakeResponse.parse(rawResponse);
            const latencyMs = Date.now() - attemptStartMs;

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
                if (retryDelayMs > 0) {
                    await wait(retryDelayMs * attempt);
                }
                continue;
            }

            throw wrappedError;
        }
    }

    throw new HandshakeError('UNKNOWN', 'Handshake failed without a terminal error');
}
