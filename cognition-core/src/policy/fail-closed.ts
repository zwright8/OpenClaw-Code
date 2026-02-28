import type { EvidenceItem, RiskTier } from '../reasoning/anomaly.js';

const KNOWN_RISK_TIERS = new Set<RiskTier>(['low', 'medium', 'high', 'critical']);

export interface RiskMetadataInput {
    riskTier?: string | null;
    confidence?: number | null;
    evidence?: EvidenceItem[] | null;
}

export interface FailClosedValidation {
    ok: boolean;
    reason?: string;
    riskTier?: RiskTier;
    confidence?: number;
}

function isKnownRiskTier(value: string): value is RiskTier {
    return KNOWN_RISK_TIERS.has(value as RiskTier);
}

export function validateRiskMetadata(metadata: RiskMetadataInput): FailClosedValidation {
    if (!metadata || typeof metadata !== 'object') {
        return { ok: false, reason: 'Missing risk metadata object.' };
    }

    const tier = metadata.riskTier;
    if (!tier || typeof tier !== 'string') {
        return { ok: false, reason: 'Missing risk tier (fail-closed).' };
    }

    if (!isKnownRiskTier(tier)) {
        return { ok: false, reason: `Unknown risk tier "${tier}" (fail-closed).` };
    }

    const confidence = Number(metadata.confidence);
    if (!Number.isFinite(confidence)) {
        return { ok: false, reason: 'Missing confidence score (fail-closed).' };
    }

    if (confidence < 0 || confidence > 1) {
        return { ok: false, reason: 'Confidence score must be between 0 and 1 (fail-closed).' };
    }

    if (!Array.isArray(metadata.evidence) || metadata.evidence.length === 0) {
        return { ok: false, reason: 'Missing evidence payload (fail-closed).' };
    }

    return {
        ok: true,
        riskTier: tier,
        confidence
    };
}

export function assertFailClosed(metadata: RiskMetadataInput) {
    const validation = validateRiskMetadata(metadata);
    if (!validation.ok) {
        throw new Error(validation.reason || 'Fail-closed validation failed.');
    }

    return {
        riskTier: validation.riskTier as RiskTier,
        confidence: validation.confidence as number
    };
}
