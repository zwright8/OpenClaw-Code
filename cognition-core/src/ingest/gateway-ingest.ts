import { type RawSignal } from '../normalize/event-normalizer.js';
import {
    inferRiskFromSeverity,
    inferSeverityFromText,
    loadRecords,
    normalizeSeverityFromRecord,
    normalizeText,
    readTimestampFromRecord
} from './shared.js';

export interface GatewayIngestOptions {
    paths?: string[];
    sinceMs?: number;
}

function inferGatewayType(record: Record<string, unknown>, message: string): string {
    const explicit = normalizeText(record.type ?? record.event ?? record.action);
    if (explicit) {
        return explicit.startsWith('gateway.') ? explicit : `gateway.${explicit.toLowerCase()}`;
    }

    const normalized = message.toLowerCase();
    if (/restart|restarting/.test(normalized)) return 'gateway.restart';
    if (/start|boot/.test(normalized)) return 'gateway.start';
    if (/stop|shutdown/.test(normalized)) return 'gateway.stop';
    if (/connect|connected/.test(normalized)) return 'gateway.connect';
    if (/disconnect|disconnected/.test(normalized)) return 'gateway.disconnect';
    if (/error|failed|panic/.test(normalized)) return 'gateway.error';

    return 'gateway.event';
}

function extractGatewayEntities(record: Record<string, unknown>): string[] {
    const entityCandidates = [
        record.gatewayId,
        record.instanceId,
        record.node,
        record.nodeId,
        record.host,
        record.region
    ];

    return entityCandidates
        .map((value) => normalizeText(value))
        .filter((value) => Boolean(value))
        .sort((a, b) => a.localeCompare(b));
}

export function ingestGatewaySignals(options: GatewayIngestOptions = {}): RawSignal[] {
    const records = loadRecords(options.paths || []);
    const output: RawSignal[] = [];

    for (const record of records) {
        if (!record.value || typeof record.value !== 'object') continue;

        const payload = record.value as Record<string, unknown>;
        const message = normalizeText(
            payload.message
            ?? payload.msg
            ?? payload.log
            ?? payload.description
        );
        const ts = readTimestampFromRecord(payload);
        const severity = message
            ? inferSeverityFromText(message, normalizeSeverityFromRecord(payload))
            : normalizeSeverityFromRecord(payload);

        const normalizedTs = Number(
            typeof ts === 'number' ? (ts < 1e12 ? ts * 1000 : ts) : Date.parse(String(ts || ''))
        );

        if (Number.isFinite(Number(options.sinceMs)) && Number.isFinite(normalizedTs) && normalizedTs < Number(options.sinceMs)) {
            continue;
        }

        output.push({
            source: 'gateway',
            type: inferGatewayType(payload, message),
            ts,
            severity,
            entities: extractGatewayEntities(payload),
            payload: {
                ...payload,
                __meta: {
                    sourcePath: record.sourcePath,
                    line: record.line
                }
            },
            confidence: 0.9,
            riskTier: inferRiskFromSeverity(severity)
        });
    }

    return output;
}
