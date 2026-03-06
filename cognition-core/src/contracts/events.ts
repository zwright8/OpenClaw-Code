export const COGNITION_RISK_TIERS = ['low', 'medium', 'high', 'critical'] as const;
export type CognitionRiskTier = (typeof COGNITION_RISK_TIERS)[number];

export const COGNITION_EVENT_SEVERITIES = ['info', 'warning', 'error', 'critical'] as const;
export type CognitionEventSeverity = (typeof COGNITION_EVENT_SEVERITIES)[number];

export interface ContractValidationIssue {
    path: string;
    message: string;
}

export type ContractValidationResult<T> =
    | { ok: true; value: T }
    | { ok: false; errors: ContractValidationIssue[] };

export interface CognitionEntityRef {
    kind: string;
    id: string;
    label?: string;
    confidence?: number;
    metadata?: Record<string, unknown>;
}

export interface CognitionEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
    eventId: string;
    ts: number;
    source: string;
    type: string;
    severity: CognitionEventSeverity;
    entities: CognitionEntityRef[];
    payload: TPayload;
    confidence: number;
    riskTier: CognitionRiskTier;
    metadata?: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function normalizeTimestamp(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.floor(value);
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;

        const asNumber = Number(trimmed);
        if (Number.isFinite(asNumber)) {
            return Math.floor(asNumber);
        }

        const asDate = Date.parse(trimmed);
        if (Number.isFinite(asDate)) {
            return Math.floor(asDate);
        }
    }

    return null;
}

function normalizeConfidence(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return null;
    if (numeric < 0 || numeric > 1) return null;
    return numeric;
}

function isRiskTier(value: unknown): value is CognitionRiskTier {
    return typeof value === 'string' && COGNITION_RISK_TIERS.includes(value as CognitionRiskTier);
}

function isSeverity(value: unknown): value is CognitionEventSeverity {
    return typeof value === 'string' && COGNITION_EVENT_SEVERITIES.includes(value as CognitionEventSeverity);
}

function normalizeSeverity(value: unknown): CognitionEventSeverity | null {
    if (isSeverity(value)) return value;

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'warn') return 'warning';
        if (normalized === 'fatal') return 'critical';
        if (isSeverity(normalized)) return normalized;
    }

    return null;
}

function normalizeRiskTier(value: unknown): CognitionRiskTier | null {
    if (isRiskTier(value)) return value;

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'p0') return 'critical';
        if (normalized === 'p1') return 'high';
        if (normalized === 'p2') return 'medium';
        if (normalized === 'p3') return 'low';
        if (isRiskTier(normalized)) return normalized;
    }

    return null;
}

function normalizeEntity(value: unknown, index: number): ContractValidationResult<CognitionEntityRef> {
    if (!isRecord(value)) {
        return {
            ok: false,
            errors: [{ path: `entities[${index}]`, message: 'Entity must be an object.' }]
        };
    }

    const errors: ContractValidationIssue[] = [];

    const kind = normalizeString(value.kind);
    if (!kind) errors.push({ path: `entities[${index}].kind`, message: 'kind is required.' });

    const id = normalizeString(value.id);
    if (!id) errors.push({ path: `entities[${index}].id`, message: 'id is required.' });

    const labelRaw = value.label;
    const label = labelRaw === undefined ? undefined : normalizeString(labelRaw) ?? undefined;

    const confidenceRaw = value.confidence;
    const confidence = confidenceRaw === undefined ? undefined : normalizeConfidence(confidenceRaw);
    if (confidenceRaw !== undefined && confidence === null) {
        errors.push({
            path: `entities[${index}].confidence`,
            message: 'confidence must be a number between 0 and 1.'
        });
    }

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: `entities[${index}].metadata`, message: 'metadata must be an object.' });
    }

    if (errors.length > 0 || !kind || !id) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            kind,
            id,
            label,
            confidence,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

export function validateCognitionEvent(value: unknown): ContractValidationResult<CognitionEvent> {
    if (!isRecord(value)) {
        return {
            ok: false,
            errors: [{ path: '$', message: 'Event must be an object.' }]
        };
    }

    const errors: ContractValidationIssue[] = [];

    const eventId = normalizeString(value.eventId) ?? normalizeString(value.id);
    if (!eventId) errors.push({ path: 'eventId', message: 'eventId is required.' });

    const ts = normalizeTimestamp(value.ts ?? value.timestamp ?? value.createdAt);
    if (ts === null) errors.push({ path: 'ts', message: 'ts must be a valid timestamp.' });

    const source = normalizeString(value.source);
    if (!source) errors.push({ path: 'source', message: 'source is required.' });

    const type = normalizeString(value.type) ?? normalizeString(value.eventType);
    if (!type) errors.push({ path: 'type', message: 'type is required.' });

    const severity = normalizeSeverity(value.severity);
    if (!severity) {
        errors.push({
            path: 'severity',
            message: `severity must be one of: ${COGNITION_EVENT_SEVERITIES.join(', ')}.`
        });
    }

    const payload = value.payload;
    if (!isRecord(payload)) {
        errors.push({ path: 'payload', message: 'payload must be an object.' });
    }

    const confidence = normalizeConfidence(value.confidence);
    if (confidence === null) {
        errors.push({ path: 'confidence', message: 'confidence must be a number between 0 and 1.' });
    }

    const riskTier = normalizeRiskTier(value.riskTier);
    if (!riskTier) {
        errors.push({
            path: 'riskTier',
            message: `riskTier must be one of: ${COGNITION_RISK_TIERS.join(', ')}.`
        });
    }

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: 'metadata', message: 'metadata must be an object.' });
    }

    const entitiesRaw = value.entities;
    const entities: CognitionEntityRef[] = [];
    if (!Array.isArray(entitiesRaw)) {
        errors.push({ path: 'entities', message: 'entities must be an array.' });
    } else {
        for (let index = 0; index < entitiesRaw.length; index += 1) {
            const entityResult = normalizeEntity(entitiesRaw[index], index);
            if (entityResult.ok) {
                entities.push(entityResult.value);
            } else {
                errors.push(...entityResult.errors);
            }
        }
    }

    if (
        errors.length > 0 ||
        !eventId ||
        ts === null ||
        !source ||
        !type ||
        !severity ||
        !riskTier ||
        confidence === null ||
        !isRecord(payload)
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            eventId,
            ts,
            source,
            type,
            severity,
            entities,
            payload,
            confidence,
            riskTier,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

export function assertCognitionEvent(value: unknown): CognitionEvent {
    const result = validateCognitionEvent(value);
    if (result.ok) return result.value;

    const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
    throw new Error(`Invalid CognitionEvent: ${message}`);
}

export function validateCognitionEvents(value: unknown): ContractValidationResult<CognitionEvent[]> {
    if (!Array.isArray(value)) {
        return {
            ok: false,
            errors: [{ path: '$', message: 'Events payload must be an array.' }]
        };
    }

    const errors: ContractValidationIssue[] = [];
    const events: CognitionEvent[] = [];

    for (let index = 0; index < value.length; index += 1) {
        const eventResult = validateCognitionEvent(value[index]);
        if (eventResult.ok) {
            events.push(eventResult.value);
        } else {
            for (const issue of eventResult.errors) {
                errors.push({ path: `[${index}].${issue.path}`, message: issue.message });
            }
        }
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return { ok: true, value: events };
}
