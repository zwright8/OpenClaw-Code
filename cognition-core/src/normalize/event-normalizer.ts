import crypto from 'crypto';

export const SOURCE_ORDER = ['gateway', 'runtime', 'business', 'unknown'] as const;
export type CognitionSource = typeof SOURCE_ORDER[number] | string;

export const SEVERITY_ORDER = ['info', 'warning', 'error', 'critical'] as const;
export type CognitionSeverity = typeof SEVERITY_ORDER[number] | string;

export const RISK_ORDER = ['low', 'medium', 'high', 'critical'] as const;
export type CognitionRiskTier = typeof RISK_ORDER[number] | string;

export interface RawSignal {
    eventId?: string;
    ts?: number | string | Date;
    source?: CognitionSource;
    type?: string;
    severity?: CognitionSeverity;
    entities?: string[];
    payload?: unknown;
    confidence?: number;
    riskTier?: CognitionRiskTier;
}

export interface CognitionEvent {
    eventId: string;
    ts: number;
    source: CognitionSource;
    type: string;
    severity: CognitionSeverity;
    entities: string[];
    payload: unknown;
    confidence: number;
    riskTier: CognitionRiskTier;
}

export function clamp(value: number, min = 0, max = 1): number {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
}

function normalizeString(value: unknown, fallback: string): string {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    return trimmed || fallback;
}

export function normalizeSource(value: unknown): CognitionSource {
    const source = normalizeString(value, 'unknown').toLowerCase();
    if (SOURCE_ORDER.includes(source as (typeof SOURCE_ORDER)[number])) return source;
    return source || 'unknown';
}

export function normalizeSeverity(value: unknown): CognitionSeverity {
    const raw = normalizeString(value, 'info').toLowerCase();
    if (raw === 'warn') return 'warning';
    if (raw === 'fatal') return 'critical';
    if (SEVERITY_ORDER.includes(raw as (typeof SEVERITY_ORDER)[number])) return raw;
    return 'info';
}

export function normalizeRiskTier(value: unknown, severity: CognitionSeverity = 'info'): CognitionRiskTier {
    const raw = normalizeString(value, '').toLowerCase();
    if (RISK_ORDER.includes(raw as (typeof RISK_ORDER)[number])) return raw;
    if (severity === 'critical') return 'critical';
    if (severity === 'error') return 'high';
    if (severity === 'warning') return 'medium';
    return 'low';
}

export function normalizeTimestamp(value: unknown, nowMs = Date.now()): number {
    if (value instanceof Date && Number.isFinite(value.getTime())) {
        return value.getTime();
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return value < 1e12 ? value * 1000 : value;
    }

    if (typeof value === 'string' && value.trim()) {
        const numeric = Number(value);
        if (Number.isFinite(numeric)) {
            return numeric < 1e12 ? numeric * 1000 : numeric;
        }
        const parsed = Date.parse(value);
        if (!Number.isNaN(parsed)) return parsed;
    }

    return nowMs;
}

export function canonicalizePayload(payload: unknown): unknown {
    if (Array.isArray(payload)) {
        return payload.map((item) => canonicalizePayload(item));
    }

    if (payload && typeof payload === 'object') {
        const plain = payload as Record<string, unknown>;
        const sortedKeys = Object.keys(plain).sort((a, b) => a.localeCompare(b));
        const normalized: Record<string, unknown> = {};
        for (const key of sortedKeys) {
            normalized[key] = canonicalizePayload(plain[key]);
        }
        return normalized;
    }

    if (typeof payload === 'bigint') return payload.toString();
    if (typeof payload === 'undefined') return null;

    return payload;
}

export function stableStringify(value: unknown): string {
    return JSON.stringify(canonicalizePayload(value));
}

function normalizedEntities(input: unknown): string[] {
    if (!Array.isArray(input)) return [];

    const values = new Set<string>();
    for (const item of input) {
        if (typeof item !== 'string') continue;
        const normalized = item.trim();
        if (!normalized) continue;
        values.add(normalized);
    }

    return Array.from(values).sort((a, b) => a.localeCompare(b));
}

function buildFallbackEventId(input: {
    source: CognitionSource;
    type: string;
    ts: number;
    severity: CognitionSeverity;
    payload: unknown;
    index: number;
}): string {
    const basis = [
        String(input.source),
        input.type,
        String(input.ts),
        String(input.severity),
        stableStringify(input.payload),
        String(input.index)
    ].join('|');

    return `evt_${crypto.createHash('sha256').update(basis).digest('hex').slice(0, 16)}`;
}

function severityRank(value: CognitionSeverity): number {
    const index = SEVERITY_ORDER.indexOf(value as (typeof SEVERITY_ORDER)[number]);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function riskRank(value: CognitionRiskTier): number {
    const index = RISK_ORDER.indexOf(value as (typeof RISK_ORDER)[number]);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function sourceRank(value: CognitionSource): number {
    const index = SOURCE_ORDER.indexOf(value as (typeof SOURCE_ORDER)[number]);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export function compareCognitionEvents(a: CognitionEvent, b: CognitionEvent): number {
    if (a.ts !== b.ts) return a.ts - b.ts;

    const sourceCompare = sourceRank(a.source) - sourceRank(b.source);
    if (sourceCompare !== 0) return sourceCompare;

    const typeCompare = a.type.localeCompare(b.type);
    if (typeCompare !== 0) return typeCompare;

    const severityCompare = severityRank(a.severity) - severityRank(b.severity);
    if (severityCompare !== 0) return severityCompare;

    const riskCompare = riskRank(a.riskTier) - riskRank(b.riskTier);
    if (riskCompare !== 0) return riskCompare;

    return a.eventId.localeCompare(b.eventId);
}

export function sortCognitionEvents(events: CognitionEvent[]): CognitionEvent[] {
    return [...events].sort(compareCognitionEvents);
}

export function normalizeEvent(
    signal: RawSignal,
    {
        index = 0,
        nowMs = Date.now()
    }: {
        index?: number;
        nowMs?: number;
    } = {}
): CognitionEvent {
    const source = normalizeSource(signal?.source);
    const type = normalizeString(signal?.type, `${source}.event`);
    const ts = normalizeTimestamp(signal?.ts, nowMs);
    const severity = normalizeSeverity(signal?.severity);
    const payload = canonicalizePayload(signal?.payload ?? {});
    const confidence = clamp(
        Number.isFinite(Number(signal?.confidence))
            ? Number(signal?.confidence)
            : (source === 'gateway' ? 0.9 : source === 'runtime' ? 0.85 : source === 'business' ? 0.75 : 0.6)
    );
    const riskTier = normalizeRiskTier(signal?.riskTier, severity);
    const entities = normalizedEntities(signal?.entities);

    const eventId = normalizeString(
        signal?.eventId,
        buildFallbackEventId({
            source,
            type,
            ts,
            severity,
            payload,
            index
        })
    );

    return {
        eventId,
        ts,
        source,
        type,
        severity,
        entities,
        payload,
        confidence,
        riskTier
    };
}

export function normalizeEventBatch(
    signals: RawSignal[],
    {
        nowMs = Date.now()
    }: {
        nowMs?: number;
    } = {}
): CognitionEvent[] {
    const normalized = signals.map((signal, index) => normalizeEvent(signal, { index, nowMs }));
    return sortCognitionEvents(normalized);
}
