import { type RawSignal } from '../normalize/event-normalizer.js';
import {
    inferRiskFromSeverity,
    loadRecords,
    normalizeSeverityFromRecord,
    normalizeText,
    readTimestampFromRecord
} from './shared.js';

export interface BusinessIngestOptions {
    paths?: string[];
    sinceMs?: number;
}

function inferBusinessType(payload: Record<string, unknown>): string {
    const explicitType = normalizeText(payload.type ?? payload.event ?? payload.kind);
    const domain = normalizeText(payload.domain ?? payload.category ?? payload.system).toLowerCase();

    const prefixed = explicitType
        ? (explicitType.startsWith('business.') ? explicitType : `business.${explicitType.toLowerCase()}`)
        : '';

    if (prefixed) return prefixed;

    if (domain) {
        if (domain.includes('ci') || domain.includes('build') || domain.includes('deploy')) return 'business.ci_event';
        if (domain.includes('revenue') || domain.includes('sales') || domain.includes('crm')) return 'business.revenue_event';
        if (domain.includes('support')) return 'business.support_event';
    }

    if (normalizeText(payload.pipeline)) return 'business.ci_event';
    if (Number.isFinite(Number(payload.amount)) || Number.isFinite(Number(payload.arrDelta))) return 'business.revenue_event';

    return 'business.event';
}

function inferBusinessSeverity(payload: Record<string, unknown>, type: string): string {
    const status = normalizeText(payload.status).toLowerCase();
    if (status === 'failed' || status === 'error') return 'error';
    if (status === 'degraded' || status === 'warning') return 'warning';
    if (status === 'critical') return 'critical';

    if (type === 'business.revenue_event') {
        const delta = Number(payload.arrDelta ?? payload.amount ?? 0);
        if (Number.isFinite(delta)) {
            if (delta <= -50_000) return 'critical';
            if (delta < 0) return 'error';
            if (delta > 0) return 'info';
        }
    }

    return normalizeSeverityFromRecord(payload);
}

function extractBusinessEntities(payload: Record<string, unknown>): string[] {
    const entities = new Set<string>();

    const candidates = [
        payload.customerId,
        payload.accountId,
        payload.opportunityId,
        payload.repo,
        payload.pipeline,
        payload.owner,
        payload.team,
        payload.region,
        payload.currency
    ];

    for (const candidate of candidates) {
        const normalized = normalizeText(candidate);
        if (normalized) entities.add(normalized);
    }

    return Array.from(entities).sort((a, b) => a.localeCompare(b));
}

export function ingestBusinessSignals(options: BusinessIngestOptions = {}): RawSignal[] {
    const records = loadRecords(options.paths || []);
    const output: RawSignal[] = [];

    for (const record of records) {
        if (!record.value || typeof record.value !== 'object') continue;

        const payload = record.value as Record<string, unknown>;
        const type = inferBusinessType(payload);
        const severity = inferBusinessSeverity(payload, type);
        const ts = readTimestampFromRecord(payload);

        const normalizedTs = Number(
            typeof ts === 'number' ? (ts < 1e12 ? ts * 1000 : ts) : Date.parse(String(ts || ''))
        );

        if (Number.isFinite(Number(options.sinceMs)) && Number.isFinite(normalizedTs) && normalizedTs < Number(options.sinceMs)) {
            continue;
        }

        output.push({
            source: 'business',
            type,
            ts,
            severity,
            entities: extractBusinessEntities(payload),
            payload: {
                ...payload,
                __meta: {
                    sourcePath: record.sourcePath,
                    line: record.line
                }
            },
            confidence: type === 'business.revenue_event' ? 0.8 : 0.75,
            riskTier: inferRiskFromSeverity(severity)
        });
    }

    return output;
}
