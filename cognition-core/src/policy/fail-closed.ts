import type { EvidenceItem, RiskTier } from '../reasoning/anomaly.js';

const KNOWN_RISK_TIERS = new Set<RiskTier>(['low', 'medium', 'high', 'critical']);

export type FailClosedReasonCode =
    | 'missing_risk_metadata'
    | 'missing_risk_tier'
    | 'unknown_risk_tier'
    | 'missing_confidence'
    | 'confidence_out_of_range'
    | 'missing_evidence';

export interface RiskMetadataInput {
    riskTier?: unknown;
    confidence?: unknown;
    evidence?: EvidenceItem[] | null;
}

export interface FailClosedValidation {
    ok: boolean;
    code?: FailClosedReasonCode;
    reason?: string;
    riskTier?: RiskTier;
    confidence?: number;
}

function isKnownRiskTier(value: string): value is RiskTier {
    return KNOWN_RISK_TIERS.has(value as RiskTier);
}

function failClosed(code: FailClosedReasonCode, detail: string): FailClosedValidation {
    return {
        ok: false,
        code,
        reason: `[${code}] ${detail}`
    };
}

function normalizeRiskTierToken(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim().toLowerCase();
    return trimmed.length > 0 ? trimmed : null;
}

function parseConfidence(
    value: unknown
):
    | { ok: true; value: number }
    | { ok: false; code: 'missing_confidence' | 'confidence_out_of_range' } {
    if (value === null || value === undefined) {
        return { ok: false, code: 'missing_confidence' };
    }

    if (typeof value === 'string' && value.trim().length === 0) {
        return { ok: false, code: 'missing_confidence' };
    }

    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) {
        return { ok: false, code: 'missing_confidence' };
    }

    if (numeric < 0 || numeric > 1) {
        return { ok: false, code: 'confidence_out_of_range' };
    }

    return {
        ok: true,
        value: numeric
    };
}

export function validateRiskMetadata(metadata: RiskMetadataInput): FailClosedValidation {
    if (!metadata || typeof metadata !== 'object') {
        return failClosed('missing_risk_metadata', 'Missing risk metadata object (fail-closed).');
    }

    const tierToken = normalizeRiskTierToken(metadata.riskTier);
    if (!tierToken) {
        return failClosed('missing_risk_tier', 'Missing risk tier (fail-closed).');
    }

    if (!isKnownRiskTier(tierToken)) {
        return failClosed('unknown_risk_tier', `Unknown risk tier "${tierToken}" (fail-closed).`);
    }

    const confidenceResult = parseConfidence(metadata.confidence);
    if (!confidenceResult.ok) {
        if (confidenceResult.code === 'confidence_out_of_range') {
            return failClosed('confidence_out_of_range', 'Confidence score must be between 0 and 1 (fail-closed).');
        }

        return failClosed('missing_confidence', 'Missing confidence score (fail-closed).');
    }

    if (!Array.isArray(metadata.evidence) || metadata.evidence.length === 0) {
        return failClosed('missing_evidence', 'Missing evidence payload (fail-closed).');
    }

    return {
        ok: true,
        riskTier: tierToken,
        confidence: confidenceResult.value
    };
}

export function assertFailClosed(metadata: RiskMetadataInput) {
    const validation = validateRiskMetadata(metadata);
    if (!validation.ok) {
        throw new Error(validation.reason || '[fail_closed_unknown] Fail-closed validation failed.');
    }

    return {
        riskTier: validation.riskTier as RiskTier,
        confidence: validation.confidence as number
    };
}
