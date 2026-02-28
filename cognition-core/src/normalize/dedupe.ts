import crypto from 'crypto';
import {
    type CognitionEvent,
    type CognitionRiskTier,
    sortCognitionEvents,
    stableStringify
} from './event-normalizer.js';

export interface DedupeResult {
    events: CognitionEvent[];
    duplicates: number;
    duplicateEventIds: string[];
}

function riskRank(value: CognitionRiskTier): number {
    if (value === 'critical') return 4;
    if (value === 'high') return 3;
    if (value === 'medium') return 2;
    return 1;
}


function payloadForDedupe(payload: unknown): unknown {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return payload;
    const plain = payload as Record<string, unknown>;
    const clone: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(plain)) {
        if (key === '__meta') continue;
        clone[key] = value;
    }
    return clone;
}

function dedupeKey(event: CognitionEvent): string {
    const payloadHash = crypto.createHash('sha1').update(stableStringify(payloadForDedupe(event.payload))).digest('hex');
    const entityHash = crypto.createHash('sha1').update((event.entities || []).join('|')).digest('hex');

    return [
        event.source,
        event.type,
        String(event.ts),
        event.severity,
        payloadHash.slice(0, 16),
        entityHash.slice(0, 8)
    ].join('|');
}

function comparePreferredEvent(a: CognitionEvent, b: CognitionEvent): number {
    if (a.confidence !== b.confidence) return b.confidence - a.confidence;

    const riskDelta = riskRank(b.riskTier) - riskRank(a.riskTier);
    if (riskDelta !== 0) return riskDelta;

    if (a.entities.length !== b.entities.length) return b.entities.length - a.entities.length;
    if (a.ts !== b.ts) return a.ts - b.ts;

    return a.eventId.localeCompare(b.eventId);
}

export function dedupeEvents(events: CognitionEvent[]): DedupeResult {
    const grouped = new Map<string, CognitionEvent[]>();

    for (const event of events) {
        const key = dedupeKey(event);
        const bucket = grouped.get(key) || [];
        bucket.push(event);
        grouped.set(key, bucket);
    }

    const unique: CognitionEvent[] = [];
    const duplicateEventIds: string[] = [];

    const keys = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));
    for (const key of keys) {
        const bucket = grouped.get(key) || [];
        if (bucket.length === 0) continue;

        const sortedBucket = [...bucket].sort(comparePreferredEvent);
        const winner = sortedBucket[0];
        unique.push(winner);

        for (const duplicate of sortedBucket.slice(1)) {
            duplicateEventIds.push(duplicate.eventId);
        }
    }

    return {
        events: sortCognitionEvents(unique),
        duplicates: duplicateEventIds.length,
        duplicateEventIds: duplicateEventIds.sort((a, b) => a.localeCompare(b))
    };
}
