import type { EvidenceItem, RiskTier } from '../reasoning/anomaly.js';

const KNOWN_RISK_TIERS = new Set<RiskTier>(['low', 'medium', 'high', 'critical']);
const HIGH_RISK_TIERS = new Set<RiskTier>(['high', 'critical']);

export type FailClosedReasonCode =
    | 'missing_risk_metadata'
    | 'missing_risk_tier'
    | 'unknown_risk_tier'
    | 'missing_confidence'
    | 'confidence_out_of_range'
    | 'missing_evidence'
    | 'high_risk_requires_approval'
    | 'missing_required_approvers'
    | 'missing_rollback_metadata'
    | 'missing_rollback_trigger'
    | 'missing_rollback_steps';

export interface RiskMetadataInput {
    riskTier?: unknown;
    confidence?: unknown;
    evidence?: EvidenceItem[] | null;
    requiresHumanApproval?: unknown;
    requiredApprovers?: unknown;
    rollbackPlan?: unknown;
    metadata?: unknown;
}

export interface FailClosedValidation {
    ok: boolean;
    code?: FailClosedReasonCode;
    reason?: string;
    riskTier?: RiskTier;
    confidence?: number;
}

type RollbackMetadata = {
    present: boolean;
    trigger: string | null;
    steps: string[];
};

function isKnownRiskTier(value: string): value is RiskTier {
    return KNOWN_RISK_TIERS.has(value as RiskTier);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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

function normalizeString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function compareStringsDeterministically(left: string, right: string): number {
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
}

function normalizeApproverList(value: unknown): string[] {
    if (!Array.isArray(value)) return [];

    const normalized = value
        .map((entry) => normalizeString(entry))
        .filter((entry): entry is string => Boolean(entry));

    return Array.from(new Set(normalized)).sort(compareStringsDeterministically);
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

function extractMetadataRecord(input: RiskMetadataInput): Record<string, unknown> | null {
    return isRecord(input.metadata) ? input.metadata : null;
}

function extractRequiredApprovers(input: RiskMetadataInput): string[] {
    const metadata = extractMetadataRecord(input);

    const metadataPolicyGate = metadata && isRecord(metadata.policyGate)
        ? metadata.policyGate
        : null;

    const policyPassthrough = metadataPolicyGate && isRecord(metadataPolicyGate.passthrough)
        ? metadataPolicyGate.passthrough
        : null;

    return Array.from(new Set([
        ...normalizeApproverList(input.requiredApprovers),
        ...normalizeApproverList(metadata?.requiredApprovers),
        ...normalizeApproverList(policyPassthrough?.requiredApprovers)
    ])).sort(compareStringsDeterministically);
}

function resolveRequiresHumanApproval(input: RiskMetadataInput): boolean | null {
    if (typeof input.requiresHumanApproval === 'boolean') {
        return input.requiresHumanApproval;
    }

    const metadata = extractMetadataRecord(input);
    if (typeof metadata?.requiresHumanApproval === 'boolean') {
        return metadata.requiresHumanApproval;
    }

    const metadataPolicyGate = metadata && isRecord(metadata.policyGate)
        ? metadata.policyGate
        : null;

    if (typeof metadataPolicyGate?.requiresHumanApproval === 'boolean') {
        return metadataPolicyGate.requiresHumanApproval;
    }

    return null;
}

function normalizeRollbackMetadata(input: RiskMetadataInput): RollbackMetadata {
    const metadata = extractMetadataRecord(input);

    const rollbackCandidate = isRecord(input.rollbackPlan)
        ? input.rollbackPlan
        : (isRecord(metadata?.rollbackPlan)
            ? metadata.rollbackPlan
            : (isRecord(metadata?.rollback) ? metadata.rollback : null));

    if (!rollbackCandidate) {
        return {
            present: false,
            trigger: null,
            steps: []
        };
    }

    return {
        present: true,
        trigger: normalizeString(rollbackCandidate.trigger),
        steps: normalizeApproverList(rollbackCandidate.steps)
    };
}

function validateHighRiskContracts(input: RiskMetadataInput, riskTier: RiskTier): FailClosedValidation | null {
    if (!HIGH_RISK_TIERS.has(riskTier)) {
        return null;
    }

    if (resolveRequiresHumanApproval(input) !== true) {
        return failClosed(
            'high_risk_requires_approval',
            'High-risk recommendations must set requiresHumanApproval=true (fail-closed).'
        );
    }

    if (extractRequiredApprovers(input).length === 0) {
        return failClosed(
            'missing_required_approvers',
            'High-risk recommendations must include requiredApprovers metadata (fail-closed).'
        );
    }

    const rollbackMetadata = normalizeRollbackMetadata(input);
    if (!rollbackMetadata.present) {
        return failClosed(
            'missing_rollback_metadata',
            'High-risk recommendations must include rollbackPlan metadata (fail-closed).'
        );
    }

    if (!rollbackMetadata.trigger) {
        return failClosed(
            'missing_rollback_trigger',
            'High-risk recommendations must include rollbackPlan.trigger (fail-closed).'
        );
    }

    if (rollbackMetadata.steps.length === 0) {
        return failClosed(
            'missing_rollback_steps',
            'High-risk recommendations must include at least one rollback step (fail-closed).'
        );
    }

    return null;
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

    const highRiskContractValidation = validateHighRiskContracts(metadata, tierToken);
    if (highRiskContractValidation) {
        return highRiskContractValidation;
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
