import {
    COGNITION_RISK_TIERS,
    type CognitionRiskTier,
    type ContractValidationIssue,
    type ContractValidationResult
} from './events.js';
import {
    COGNITION_RECOMMENDATION_PRIORITIES,
    normalizeRecommendationPriority,
    type CognitionRecommendationPriority
} from './recommendations.js';

export interface CognitionRiskTierPolicy {
    requiresHumanApproval: boolean;
    allowedAutoPriorities: CognitionRecommendationPriority[];
    maxEstimatedImpact?: number;
}

export interface CognitionPolicySet {
    policyId: string;
    version: number;
    updatedAt: number;
    failClosed: boolean;
    minConfidence: number;
    riskTierPolicies: Record<CognitionRiskTier, CognitionRiskTierPolicy>;
    metadata?: Record<string, unknown>;
}

export interface CognitionPolicyEvaluationInput {
    riskTier?: CognitionRiskTier;
    confidence?: number;
    priority?: CognitionRecommendationPriority;
    estimatedImpact?: number;
    requiresHumanApproval?: boolean;
}

export interface CognitionPolicyEvaluationResult {
    allowed: boolean;
    decision: 'allow' | 'require_approval' | 'deny';
    requiresHumanApproval: boolean;
    reasons: string[];
    evaluatedAt: number;
    matchedRiskTier?: CognitionRiskTier;
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
    if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;
        const asNumber = Number(trimmed);
        if (Number.isFinite(asNumber)) return Math.floor(asNumber);
        const asDate = Date.parse(trimmed);
        if (Number.isFinite(asDate)) return Math.floor(asDate);
    }
    return null;
}

function normalizeNonNegativeNumber(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return null;
    return numeric;
}

function normalizeConfidence(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return null;
    if (numeric < 0 || numeric > 1) return null;
    return numeric;
}

function normalizeRiskTier(value: unknown): CognitionRiskTier | null {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    if (!COGNITION_RISK_TIERS.includes(normalized as CognitionRiskTier)) {
        return null;
    }
    return normalized as CognitionRiskTier;
}

function validatePriorityArray(value: unknown, path: string): ContractValidationResult<CognitionRecommendationPriority[]> {
    if (!Array.isArray(value)) {
        return { ok: false, errors: [{ path, message: 'must be an array of recommendation priorities.' }] };
    }

    const errors: ContractValidationIssue[] = [];
    const out: CognitionRecommendationPriority[] = [];

    for (let index = 0; index < value.length; index += 1) {
        const priority = normalizeRecommendationPriority(value[index]);
        if (!priority) {
            errors.push({
                path: `${path}[${index}]`,
                message: `must be one of: ${COGNITION_RECOMMENDATION_PRIORITIES.join(', ')}.`
            });
            continue;
        }
        if (!out.includes(priority)) out.push(priority);
    }

    if (errors.length > 0) return { ok: false, errors };
    return { ok: true, value: out };
}

function validateRiskTierPolicy(value: unknown, path: string): ContractValidationResult<CognitionRiskTierPolicy> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path, message: 'must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const requiresHumanApproval = value.requiresHumanApproval;
    if (typeof requiresHumanApproval !== 'boolean') {
        errors.push({ path: `${path}.requiresHumanApproval`, message: 'must be a boolean.' });
    }

    const allowedAutoPrioritiesResult = validatePriorityArray(
        value.allowedAutoPriorities ?? [],
        `${path}.allowedAutoPriorities`
    );
    if (!allowedAutoPrioritiesResult.ok) errors.push(...allowedAutoPrioritiesResult.errors);

    const maxEstimatedImpactRaw = value.maxEstimatedImpact;
    const maxEstimatedImpact = maxEstimatedImpactRaw === undefined
        ? undefined
        : normalizeNonNegativeNumber(maxEstimatedImpactRaw);
    if (maxEstimatedImpactRaw !== undefined && maxEstimatedImpact === null) {
        errors.push({ path: `${path}.maxEstimatedImpact`, message: 'must be a non-negative number.' });
    }

    if (errors.length > 0 || typeof requiresHumanApproval !== 'boolean' || !allowedAutoPrioritiesResult.ok) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            requiresHumanApproval,
            allowedAutoPriorities: allowedAutoPrioritiesResult.value,
            maxEstimatedImpact
        }
    };
}

export function createDefaultCognitionPolicySet(now = Date.now()): CognitionPolicySet {
    return {
        policyId: 'cognition-default-policy',
        version: 1,
        updatedAt: now,
        failClosed: true,
        minConfidence: 0.5,
        riskTierPolicies: {
            low: {
                requiresHumanApproval: false,
                allowedAutoPriorities: ['P2', 'P3'],
                maxEstimatedImpact: 100
            },
            medium: {
                requiresHumanApproval: false,
                allowedAutoPriorities: ['P2', 'P3'],
                maxEstimatedImpact: 50
            },
            high: {
                requiresHumanApproval: true,
                allowedAutoPriorities: [],
                maxEstimatedImpact: 0
            },
            critical: {
                requiresHumanApproval: true,
                allowedAutoPriorities: [],
                maxEstimatedImpact: 0
            }
        }
    };
}

export function validateCognitionPolicySet(value: unknown): ContractValidationResult<CognitionPolicySet> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: '$', message: 'Policy set must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const policyId = normalizeString(value.policyId) ?? normalizeString(value.id);
    if (!policyId) errors.push({ path: 'policyId', message: 'policyId is required.' });

    const version = normalizeNonNegativeNumber(value.version);
    if (version === null || !Number.isInteger(version) || version <= 0) {
        errors.push({ path: 'version', message: 'version must be a positive integer.' });
    }

    const updatedAt = normalizeTimestamp(value.updatedAt);
    if (updatedAt === null) errors.push({ path: 'updatedAt', message: 'updatedAt must be a timestamp.' });

    const failClosed = value.failClosed;
    if (typeof failClosed !== 'boolean') {
        errors.push({ path: 'failClosed', message: 'failClosed must be a boolean.' });
    }

    const minConfidence = normalizeConfidence(value.minConfidence);
    if (minConfidence === null) {
        errors.push({ path: 'minConfidence', message: 'minConfidence must be a number between 0 and 1.' });
    }

    const riskTierPoliciesRaw = value.riskTierPolicies;
    const riskTierPolicies: Record<CognitionRiskTier, CognitionRiskTierPolicy> = {
        low: { requiresHumanApproval: false, allowedAutoPriorities: [] },
        medium: { requiresHumanApproval: false, allowedAutoPriorities: [] },
        high: { requiresHumanApproval: true, allowedAutoPriorities: [] },
        critical: { requiresHumanApproval: true, allowedAutoPriorities: [] }
    };

    if (!isRecord(riskTierPoliciesRaw)) {
        errors.push({ path: 'riskTierPolicies', message: 'riskTierPolicies must be an object.' });
    } else {
        for (const tier of COGNITION_RISK_TIERS) {
            const result = validateRiskTierPolicy(riskTierPoliciesRaw[tier], `riskTierPolicies.${tier}`);
            if (!result.ok) {
                errors.push(...result.errors);
                continue;
            }
            riskTierPolicies[tier] = result.value;
        }
    }

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: 'metadata', message: 'metadata must be an object.' });
    }

    if (
        errors.length > 0 ||
        !policyId ||
        version === null ||
        !Number.isInteger(version) ||
        version <= 0 ||
        updatedAt === null ||
        typeof failClosed !== 'boolean' ||
        minConfidence === null ||
        !isRecord(riskTierPoliciesRaw)
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            policyId,
            version,
            updatedAt,
            failClosed,
            minConfidence,
            riskTierPolicies,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

export function evaluateCognitionPolicy(
    policy: CognitionPolicySet,
    input: CognitionPolicyEvaluationInput,
    now = Date.now()
): CognitionPolicyEvaluationResult {
    const reasons: string[] = [];

    const riskTier = input.riskTier;
    if (!riskTier) {
        reasons.push('Missing riskTier metadata.');
        return {
            allowed: false,
            decision: policy.failClosed ? 'deny' : 'require_approval',
            requiresHumanApproval: true,
            reasons,
            evaluatedAt: now
        };
    }

    if (!COGNITION_RISK_TIERS.includes(riskTier)) {
        reasons.push(`Unsupported riskTier: ${riskTier}.`);
        return {
            allowed: false,
            decision: 'deny',
            requiresHumanApproval: true,
            reasons,
            evaluatedAt: now,
            matchedRiskTier: riskTier
        };
    }

    const confidence = input.confidence;
    if (typeof confidence !== 'number' || !Number.isFinite(confidence)) {
        reasons.push('Missing confidence metadata.');
        return {
            allowed: false,
            decision: policy.failClosed ? 'deny' : 'require_approval',
            requiresHumanApproval: true,
            reasons,
            evaluatedAt: now,
            matchedRiskTier: riskTier
        };
    }

    if (confidence < policy.minConfidence) {
        reasons.push(`Confidence ${confidence.toFixed(2)} below policy minimum ${policy.minConfidence.toFixed(2)}.`);
        return {
            allowed: false,
            decision: 'deny',
            requiresHumanApproval: true,
            reasons,
            evaluatedAt: now,
            matchedRiskTier: riskTier
        };
    }

    const tierPolicy = policy.riskTierPolicies[riskTier];
    let requiresHumanApproval = tierPolicy.requiresHumanApproval || input.requiresHumanApproval === true;

    if (input.priority && !tierPolicy.allowedAutoPriorities.includes(input.priority)) {
        reasons.push(`Priority ${input.priority} is not auto-approved for risk tier ${riskTier}.`);
        requiresHumanApproval = true;
    }

    if (
        typeof input.estimatedImpact === 'number' &&
        Number.isFinite(input.estimatedImpact) &&
        typeof tierPolicy.maxEstimatedImpact === 'number' &&
        input.estimatedImpact > tierPolicy.maxEstimatedImpact
    ) {
        reasons.push(
            `Estimated impact ${input.estimatedImpact} exceeds max auto threshold ${tierPolicy.maxEstimatedImpact} for ${riskTier}.`
        );
        requiresHumanApproval = true;
    }

    if (requiresHumanApproval) {
        if (reasons.length === 0) {
            reasons.push(`Policy requires human approval for risk tier ${riskTier}.`);
        }

        return {
            allowed: false,
            decision: 'require_approval',
            requiresHumanApproval: true,
            reasons,
            evaluatedAt: now,
            matchedRiskTier: riskTier
        };
    }

    reasons.push('Passed policy checks for autonomous execution.');
    return {
        allowed: true,
        decision: 'allow',
        requiresHumanApproval: false,
        reasons,
        evaluatedAt: now,
        matchedRiskTier: riskTier
    };
}

export function assertCognitionPolicySet(value: unknown): CognitionPolicySet {
    const result = validateCognitionPolicySet(value);
    if (result.ok) return result.value;

    const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
    throw new Error(`Invalid CognitionPolicySet: ${message}`);
}

export function normalizePolicyInput(input: unknown): CognitionPolicyEvaluationInput {
    if (!isRecord(input)) return {};

    const riskTier = normalizeRiskTier(input.riskTier);
    const confidence = normalizeConfidence(input.confidence);
    const priority = normalizeRecommendationPriority(input.priority);
    const estimatedImpact = normalizeNonNegativeNumber(input.estimatedImpact);
    const requiresHumanApproval = typeof input.requiresHumanApproval === 'boolean'
        ? input.requiresHumanApproval
        : undefined;

    return {
        riskTier: riskTier ?? undefined,
        confidence: confidence ?? undefined,
        priority: priority ?? undefined,
        estimatedImpact: estimatedImpact ?? undefined,
        requiresHumanApproval
    };
}
