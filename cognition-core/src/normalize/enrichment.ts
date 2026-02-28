import {
    type CognitionEvent,
    type CognitionRiskTier,
    normalizeRiskTier,
    sortCognitionEvents
} from './event-normalizer.js';

export interface EnrichmentOptions {
    maxEntities?: number;
}

function riskRank(value: CognitionRiskTier): number {
    if (value === 'critical') return 4;
    if (value === 'high') return 3;
    if (value === 'medium') return 2;
    return 1;
}

function mergeRiskTier(a: CognitionRiskTier, b: CognitionRiskTier): CognitionRiskTier {
    return riskRank(a) >= riskRank(b) ? a : b;
}

function baselineConfidenceForSource(source: string): number {
    if (source === 'gateway') return 0.9;
    if (source === 'runtime') return 0.85;
    if (source === 'business') return 0.75;
    return 0.6;
}

function extractTextCorpus(payload: unknown): string[] {
    const out: string[] = [];

    function walk(value: unknown) {
        if (typeof value === 'string') {
            out.push(value);
            return;
        }

        if (Array.isArray(value)) {
            for (const item of value) walk(item);
            return;
        }

        if (value && typeof value === 'object') {
            for (const nested of Object.values(value as Record<string, unknown>)) {
                walk(nested);
            }
        }
    }

    walk(payload);
    return out;
}

function extractEntities(event: CognitionEvent): string[] {
    const entities = new Set<string>(event.entities || []);
    entities.add(`source:${event.source}`);
    entities.add(`type:${event.type}`);

    const corpus = extractTextCorpus(event.payload).join(' \n ');

    for (const match of corpus.matchAll(/https?:\/\/([^\s/]+)/g)) {
        const host = match[1]?.toLowerCase().trim();
        if (host) entities.add(`host:${host}`);
    }

    for (const match of corpus.matchAll(/\b([a-z0-9_.-]+\/[a-z0-9_.-]+)\b/gi)) {
        const repo = match[1]?.trim();
        if (repo && repo.includes('/')) entities.add(`repo:${repo}`);
    }

    for (const match of corpus.matchAll(/\bagent:[a-z0-9:_-]+\b/gi)) {
        entities.add(match[0]);
    }

    for (const match of corpus.matchAll(/#(\d{1,8})\b/g)) {
        entities.add(`ref:${match[1]}`);
    }

    return Array.from(entities)
        .filter((value) => Boolean(value && value.trim()))
        .map((value) => value.trim())
        .sort((a, b) => a.localeCompare(b));
}

function inferRiskTier(event: CognitionEvent): CognitionRiskTier {
    const corpus = extractTextCorpus(event.payload).join(' ').toLowerCase();

    if (event.severity === 'critical') return 'critical';
    if (event.severity === 'error') return 'high';

    if (/breach|data\s+loss|outage|sev[-\s]?0|sev[-\s]?1/.test(corpus)) return 'critical';
    if (/failed|error|downtime|incident|rollback|revenue\s+drop/.test(corpus)) return 'high';
    if (/warning|retry|latency|degraded/.test(corpus)) return 'medium';

    return normalizeRiskTier(event.riskTier, event.severity);
}

function enrichConfidence(event: CognitionEvent): number {
    const baseline = baselineConfidenceForSource(event.source);
    const payload = (event.payload && typeof event.payload === 'object')
        ? event.payload as Record<string, unknown>
        : {};

    const sourceConfidence = Number(
        payload.confidence
        ?? payload.sourceConfidence
        ?? payload.score
        ?? Number.NaN
    );

    const hasPayloadConfidence = Number.isFinite(sourceConfidence);

    let confidence = hasPayloadConfidence
        ? Math.max(event.confidence, Math.min(1, Math.max(0, sourceConfidence)))
        : Math.max(event.confidence, baseline);

    if (event.riskTier === 'critical' || event.riskTier === 'high') {
        confidence = Math.max(confidence, Math.min(1, baseline + 0.05));
    }

    return Math.min(1, Math.max(0, Number(confidence.toFixed(4))));
}

export function enrichEvent(event: CognitionEvent, options: EnrichmentOptions = {}): CognitionEvent {
    const inferredRisk = inferRiskTier(event);
    const mergedRisk = mergeRiskTier(event.riskTier, inferredRisk);

    let entities = extractEntities({
        ...event,
        riskTier: mergedRisk
    });

    if (Number.isFinite(Number(options.maxEntities)) && Number(options.maxEntities) > 0) {
        entities = entities.slice(0, Number(options.maxEntities));
    }

    const enriched = {
        ...event,
        entities,
        riskTier: mergedRisk,
        confidence: enrichConfidence({
            ...event,
            riskTier: mergedRisk,
            entities
        })
    };

    return enriched;
}

export function enrichEvents(events: CognitionEvent[], options: EnrichmentOptions = {}): CognitionEvent[] {
    return sortCognitionEvents(events.map((event) => enrichEvent(event, options)));
}
