import fs from 'fs';
import path from 'path';
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'crypto';

function clone(value) {
    return JSON.parse(JSON.stringify(value));
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

function toHexDigest(input) {
    return createHash('sha256').update(input).digest('hex');
}

function signDigest(secret, digest, previousHash) {
    const message = `${digest}|${previousHash || ''}`;
    return createHmac('sha256', secret).update(message).digest('hex');
}

export class AuditLogError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'AuditLogError';
        this.code = code;
        this.details = details;
    }
}

export function signAuditEntry(
    entryPayload,
    {
        secret,
        keyId = 'default',
        previousHash = null,
        now = Date.now
    } = {}
) {
    if (typeof secret !== 'string' || !secret.length) {
        throw new AuditLogError('MISSING_SECRET', 'signAuditEntry requires a non-empty secret');
    }

    const base = {
        id: typeof entryPayload?.id === 'string' ? entryPayload.id : randomUUID(),
        at: Number.isFinite(Number(entryPayload?.at)) ? Number(entryPayload.at) : Number(now()),
        eventType: typeof entryPayload?.eventType === 'string' && entryPayload.eventType.trim()
            ? entryPayload.eventType.trim()
            : 'event',
        actor: typeof entryPayload?.actor === 'string' ? entryPayload.actor : null,
        payload: entryPayload?.payload && typeof entryPayload.payload === 'object'
            ? clone(entryPayload.payload)
            : {},
        previousHash: typeof previousHash === 'string' && previousHash.length > 0
            ? previousHash
            : null,
        keyId
    };

    const canonical = canonicalize(base);
    const digest = toHexDigest(canonical);
    const signature = signDigest(secret, digest, base.previousHash);

    return {
        ...base,
        digest,
        signature
    };
}

export function verifySignedAuditEntry(
    entry,
    {
        secret,
        expectedPreviousHash = null
    } = {}
) {
    if (typeof secret !== 'string' || !secret.length) {
        throw new AuditLogError('MISSING_SECRET', 'verifySignedAuditEntry requires a non-empty secret');
    }

    if (!entry || typeof entry !== 'object') {
        return {
            ok: false,
            reason: 'invalid_entry'
        };
    }

    const base = {
        id: entry.id,
        at: entry.at,
        eventType: entry.eventType,
        actor: entry.actor ?? null,
        payload: entry.payload && typeof entry.payload === 'object' ? entry.payload : {},
        previousHash: entry.previousHash ?? null,
        keyId: entry.keyId ?? 'default'
    };

    if (expectedPreviousHash !== null && base.previousHash !== expectedPreviousHash) {
        return {
            ok: false,
            reason: 'previous_hash_mismatch'
        };
    }

    const canonical = canonicalize(base);
    const digest = toHexDigest(canonical);
    if (digest !== entry.digest) {
        return {
            ok: false,
            reason: 'digest_mismatch'
        };
    }

    const expectedSignature = signDigest(secret, digest, base.previousHash);
    const actualBuffer = Buffer.from(String(entry.signature), 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (actualBuffer.length !== expectedBuffer.length) {
        return {
            ok: false,
            reason: 'signature_length_mismatch'
        };
    }

    if (!timingSafeEqual(actualBuffer, expectedBuffer)) {
        return {
            ok: false,
            reason: 'signature_mismatch'
        };
    }

    return {
        ok: true,
        digest
    };
}

export class SignedAuditLog {
    constructor({
        secret,
        keyId = 'default',
        now = Date.now
    } = {}) {
        if (typeof secret !== 'string' || !secret.length) {
            throw new AuditLogError('MISSING_SECRET', 'SignedAuditLog requires a non-empty secret');
        }

        this.secret = secret;
        this.keyId = keyId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.entries = [];
    }

    append(entryPayload) {
        const previousHash = this.entries.length > 0
            ? this.entries[this.entries.length - 1].digest
            : null;

        const signed = signAuditEntry(entryPayload, {
            secret: this.secret,
            keyId: this.keyId,
            previousHash,
            now: this.now
        });

        this.entries.push(signed);
        return clone(signed);
    }

    listEntries() {
        return clone(this.entries);
    }

    verifyChain(entries = this.entries) {
        const rows = Array.isArray(entries) ? entries : [];

        for (let index = 0; index < rows.length; index++) {
            const previousHash = index > 0
                ? rows[index - 1].digest
                : null;

            const verification = verifySignedAuditEntry(rows[index], {
                secret: this.secret,
                expectedPreviousHash: previousHash
            });

            if (!verification.ok) {
                return {
                    ok: false,
                    failedAt: index,
                    reason: verification.reason
                };
            }
        }

        return {
            ok: true,
            count: rows.length
        };
    }
}

export class FileAuditLogStore {
    constructor({ filePath }) {
        if (!filePath || typeof filePath !== 'string') {
            throw new AuditLogError('MISSING_FILE_PATH', 'FileAuditLogStore requires filePath');
        }

        this.filePath = path.resolve(filePath);
    }

    append(entry) {
        fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
        fs.appendFileSync(this.filePath, `${JSON.stringify(entry)}\n`);
    }

    loadEntries() {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }

        const lines = fs.readFileSync(this.filePath, 'utf8')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

        const entries = [];
        for (const line of lines) {
            try {
                entries.push(JSON.parse(line));
            } catch {
                // Skip malformed lines so partial corruption doesn't block incident review.
            }
        }

        return entries;
    }
}

export const __auditInternals = {
    canonicalize,
    toHexDigest,
    signDigest
};
