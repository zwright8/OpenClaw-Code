import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { z } from 'zod';

const SignedEnvelopeSchema = z.object({
    kind: z.literal('federated_envelope'),
    envelopeId: z.string().uuid(),
    tenantId: z.string().min(1),
    from: z.string().min(1),
    to: z.string().min(1),
    sentAt: z.number().int(),
    protocol: z.string().min(1),
    sourceStack: z.string().min(1).default('openclaw'),
    payload: z.record(z.any()),
    metadata: z.record(z.any()).default({}),
    keyId: z.string().min(1),
    algorithm: z.literal('hmac-sha256').default('hmac-sha256'),
    signature: z.string().min(1)
});

const KeyRecordSchema = z.object({
    tenantId: z.string().min(1),
    keyId: z.string().min(1),
    secret: z.string().min(1),
    createdAt: z.number().int(),
    status: z.enum(['active', 'retired']).default('active')
});

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function canonicalize(value) {
    if (Array.isArray(value)) {
        return `[${value.map((item) => canonicalize(item)).join(',')}]`;
    }

    if (value && typeof value === 'object') {
        const keys = Object.keys(value).sort();
        return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
    }

    return JSON.stringify(value);
}

function signPayload(secret, envelopeBody) {
    return createHmac('sha256', secret)
        .update(canonicalize(envelopeBody))
        .digest('hex');
}

function normalizeCapabilities(payload) {
    const required = payload?.context?.requiredCapabilities;
    if (!Array.isArray(required)) return [];
    return [...new Set(required
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function tenantPairKey(fromTenant, toTenant) {
    return `${fromTenant}->${toTenant}`;
}

function bodyFromEnvelope(envelope) {
    const {
        kind,
        envelopeId,
        tenantId,
        from,
        to,
        sentAt,
        protocol,
        sourceStack,
        payload,
        metadata,
        keyId,
        algorithm
    } = envelope;

    return {
        kind,
        envelopeId,
        tenantId,
        from,
        to,
        sentAt,
        protocol,
        sourceStack,
        payload,
        metadata,
        keyId,
        algorithm
    };
}

export class FederationTrustError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'FederationTrustError';
        this.code = code;
        this.details = details;
    }
}

export class FederationKeyring {
    constructor({
        now = Date.now
    } = {}) {
        this.now = typeof now === 'function' ? now : Date.now;
        this.keys = new Map();
    }

    addKey(keyPayload) {
        const key = KeyRecordSchema.parse({
            createdAt: safeNow(this.now),
            ...keyPayload
        });

        const existing = this.keys.get(key.tenantId) || [];
        const replaced = existing.filter((item) => item.keyId !== key.keyId);
        replaced.push(key);
        this.keys.set(key.tenantId, replaced.sort((a, b) => a.createdAt - b.createdAt));
        return clone(key);
    }

    listKeys(tenantId) {
        const keys = this.keys.get(tenantId) || [];
        return keys.map((key) => clone(key));
    }

    getKey(tenantId, keyId) {
        const keys = this.keys.get(tenantId) || [];
        return keys.find((key) => key.keyId === keyId) || null;
    }

    getActiveKey(tenantId) {
        const keys = this.keys.get(tenantId) || [];
        const active = keys.filter((key) => key.status === 'active');
        return active.length > 0 ? active[active.length - 1] : null;
    }

    rotateKey({
        tenantId,
        newKeyId,
        newSecret,
        retirePrevious = true
    }) {
        const keys = this.keys.get(tenantId) || [];

        if (retirePrevious) {
            for (const key of keys) {
                if (key.status === 'active') {
                    key.status = 'retired';
                }
            }
        }

        const added = this.addKey({
            tenantId,
            keyId: newKeyId,
            secret: newSecret,
            status: 'active',
            createdAt: safeNow(this.now)
        });

        return {
            rotated: true,
            key: added
        };
    }

    signEnvelope(envelopePayload, {
        tenantId,
        keyId = null
    } = {}) {
        const resolvedTenantId = tenantId || envelopePayload?.tenantId;
        if (!resolvedTenantId) {
            throw new FederationTrustError('MISSING_TENANT', 'tenantId is required for signing');
        }

        const key = keyId
            ? this.getKey(resolvedTenantId, keyId)
            : this.getActiveKey(resolvedTenantId);
        if (!key) {
            throw new FederationTrustError(
                'MISSING_SIGNING_KEY',
                `No signing key available for tenant ${resolvedTenantId}`
            );
        }

        const envelope = {
            kind: 'federated_envelope',
            envelopeId: envelopePayload?.envelopeId || randomUUID(),
            tenantId: resolvedTenantId,
            from: envelopePayload?.from,
            to: envelopePayload?.to,
            sentAt: Number.isFinite(Number(envelopePayload?.sentAt))
                ? Number(envelopePayload.sentAt)
                : safeNow(this.now),
            protocol: envelopePayload?.protocol || 'swarm/0.2',
            sourceStack: envelopePayload?.sourceStack || 'openclaw',
            payload: envelopePayload?.payload || {},
            metadata: envelopePayload?.metadata || {},
            keyId: key.keyId,
            algorithm: 'hmac-sha256',
            signature: ''
        };

        const body = bodyFromEnvelope(envelope);
        envelope.signature = signPayload(key.secret, body);
        return SignedEnvelopeSchema.parse(envelope);
    }

    verifyEnvelope(envelopePayload) {
        const envelope = SignedEnvelopeSchema.parse(envelopePayload);
        const key = this.getKey(envelope.tenantId, envelope.keyId);
        if (!key) {
            return {
                ok: false,
                reason: 'key_not_found'
            };
        }

        const expected = signPayload(key.secret, bodyFromEnvelope(envelope));
        const actualBuf = Buffer.from(envelope.signature, 'hex');
        const expectedBuf = Buffer.from(expected, 'hex');

        if (actualBuf.length !== expectedBuf.length) {
            return {
                ok: false,
                reason: 'signature_length_mismatch'
            };
        }

        if (!timingSafeEqual(actualBuf, expectedBuf)) {
            return {
                ok: false,
                reason: 'signature_mismatch'
            };
        }

        return {
            ok: true,
            keyStatus: key.status,
            tenantId: envelope.tenantId,
            keyId: envelope.keyId
        };
    }
}

export function evaluateTenantBoundary(envelopePayload, {
    localTenantId = null,
    allowedTenantPairs = [],
    blockedCrossTenantCapabilities = ['credential_access', 'destructive_shell'],
    allowSameTenant = true
} = {}) {
    const envelope = SignedEnvelopeSchema.parse(envelopePayload);

    const remoteTenantId = envelope.tenantId;
    const destinationTenant = localTenantId || envelope.metadata?.targetTenantId || remoteTenantId;
    const isSameTenant = remoteTenantId === destinationTenant;

    if (!allowSameTenant && isSameTenant) {
        return {
            allowed: false,
            reasons: [{ code: 'same_tenant_blocked', reason: remoteTenantId }]
        };
    }

    const reasons = [];
    if (!isSameTenant) {
        const allowedPairs = new Set(allowedTenantPairs.map((pair) => String(pair)));
        const pair = tenantPairKey(remoteTenantId, destinationTenant);
        if (!allowedPairs.has(pair)) {
            reasons.push({
                code: 'tenant_pair_not_allowed',
                reason: pair
            });
        }

        const blockedCapabilities = new Set(blockedCrossTenantCapabilities);
        const requiredCaps = normalizeCapabilities(envelope.payload);
        for (const cap of requiredCaps) {
            if (blockedCapabilities.has(cap)) {
                reasons.push({
                    code: 'blocked_cross_tenant_capability',
                    reason: cap
                });
            }
        }
    }

    return {
        allowed: reasons.length === 0,
        reasons,
        sourceTenantId: remoteTenantId,
        destinationTenantId: destinationTenant
    };
}

function adaptFromSwarm(message) {
    if (message?.kind === 'task_request') {
        return {
            type: 'task',
            id: message.id,
            from: message.from,
            to: message.target || null,
            priority: message.priority,
            task: message.task,
            context: message.context || {},
            constraints: message.constraints || [],
            createdAt: message.createdAt
        };
    }

    return clone(message);
}

function adaptToSwarm(message) {
    if (message?.type === 'task') {
        return {
            kind: 'task_request',
            id: message.id || randomUUID(),
            from: message.from || 'agent:bridge',
            target: message.to || undefined,
            priority: message.priority || 'normal',
            task: message.task || '',
            context: message.context || {},
            constraints: message.constraints || [],
            createdAt: Number.isFinite(Number(message.createdAt)) ? Number(message.createdAt) : Date.now()
        };
    }

    return clone(message);
}

function adaptFromAutogen(message) {
    if (message?.type === 'task') {
        return {
            type: 'task',
            id: message.task_id || randomUUID(),
            from: message.sender || 'agent:autogen',
            to: message.receiver || null,
            priority: message.priority || 'normal',
            task: message.content || '',
            context: message.context || {},
            constraints: message.constraints || [],
            createdAt: Number.isFinite(Number(message.created_at))
                ? Number(message.created_at)
                : Date.now()
        };
    }

    return clone(message);
}

function adaptToAutogen(message) {
    if (message?.type === 'task') {
        return {
            type: 'task',
            task_id: message.id || randomUUID(),
            sender: message.from,
            receiver: message.to,
            priority: message.priority,
            content: message.task,
            context: message.context || {},
            constraints: message.constraints || [],
            created_at: message.createdAt || Date.now()
        };
    }

    return clone(message);
}

function adaptFromJsonRpc(message) {
    if (message?.jsonrpc === '2.0' && message?.method === 'task.dispatch') {
        return {
            type: 'task',
            id: message.id || randomUUID(),
            from: message.params?.from || 'agent:jsonrpc',
            to: message.params?.target || null,
            priority: message.params?.priority || 'normal',
            task: message.params?.task || '',
            context: message.params?.context || {},
            constraints: message.params?.constraints || [],
            createdAt: Number.isFinite(Number(message.params?.createdAt))
                ? Number(message.params.createdAt)
                : Date.now()
        };
    }

    return clone(message);
}

function adaptToJsonRpc(message) {
    if (message?.type === 'task') {
        return {
            jsonrpc: '2.0',
            id: message.id || randomUUID(),
            method: 'task.dispatch',
            params: {
                from: message.from,
                target: message.to,
                priority: message.priority,
                task: message.task,
                context: message.context || {},
                constraints: message.constraints || [],
                createdAt: message.createdAt || Date.now()
            }
        };
    }

    return clone(message);
}

export class ProtocolBridge {
    constructor() {
        this.adapters = new Map();

        this.registerAdapter('swarm', {
            toCanonical: adaptFromSwarm,
            fromCanonical: adaptToSwarm
        });

        this.registerAdapter('autogen-v1', {
            toCanonical: adaptFromAutogen,
            fromCanonical: adaptToAutogen
        });

        this.registerAdapter('jsonrpc-2.0', {
            toCanonical: adaptFromJsonRpc,
            fromCanonical: adaptToJsonRpc
        });
    }

    registerAdapter(protocolId, {
        toCanonical,
        fromCanonical
    }) {
        if (!protocolId || typeof protocolId !== 'string') {
            throw new Error('protocolId is required');
        }

        if (typeof toCanonical !== 'function' || typeof fromCanonical !== 'function') {
            throw new Error('adapter must define toCanonical and fromCanonical functions');
        }

        this.adapters.set(protocolId, {
            toCanonical,
            fromCanonical
        });
    }

    toCanonical(message, {
        fromProtocol
    } = {}) {
        const adapter = this.adapters.get(fromProtocol);
        if (!adapter) {
            throw new Error(`Unknown protocol adapter: ${fromProtocol}`);
        }
        return adapter.toCanonical(clone(message));
    }

    fromCanonical(message, {
        toProtocol
    } = {}) {
        const adapter = this.adapters.get(toProtocol);
        if (!adapter) {
            throw new Error(`Unknown protocol adapter: ${toProtocol}`);
        }
        return adapter.fromCanonical(clone(message));
    }

    bridge(message, {
        fromProtocol,
        toProtocol
    } = {}) {
        const canonical = this.toCanonical(message, { fromProtocol });
        return this.fromCanonical(canonical, { toProtocol });
    }
}

export const __federationInternals = {
    SignedEnvelopeSchema,
    KeyRecordSchema,
    canonicalize,
    signPayload,
    adaptFromSwarm,
    adaptToSwarm,
    adaptFromAutogen,
    adaptToAutogen,
    adaptFromJsonRpc,
    adaptToJsonRpc
};
