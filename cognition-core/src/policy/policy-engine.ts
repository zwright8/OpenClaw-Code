import {
    type CognitionRecommendation,
    type RiskTier,
    riskTierRequiresApproval
} from '../reasoning/anomaly.js';
import {
    type ApprovalLevel,
    determineApprovalRequirement,
    isApprovalSatisfied
} from './approval-gates.js';
import { validateRiskMetadata } from './fail-closed.js';

export type PolicyDecisionStatus = 'approved' | 'requires_human_approval' | 'blocked';

export interface PolicyEvaluationInput {
    recommendation: CognitionRecommendation;
    grantedApprovals?: ApprovalLevel[];
}

export interface PolicyDecision {
    recommendationId: string;
    status: PolicyDecisionStatus;
    reason: string;
    riskTier?: RiskTier;
    confidence?: number;
    requiresHumanApproval: boolean;
    requiredApprovalLevel: ApprovalLevel;
}

export interface PolicyBatchResult {
    decisions: PolicyDecision[];
    approved: CognitionRecommendation[];
    blocked: CognitionRecommendation[];
    pendingApproval: CognitionRecommendation[];
}

function getHasRollbackPlan(recommendation: CognitionRecommendation) {
    return Array.isArray(recommendation.verificationPlan) && recommendation.verificationPlan.length > 0;
}

export function evaluateRecommendationPolicy(input: PolicyEvaluationInput): PolicyDecision {
    const { recommendation, grantedApprovals = [] } = input;

    const metadata = validateRiskMetadata({
        riskTier: recommendation.riskTier,
        confidence: recommendation.confidence,
        evidence: recommendation.evidence
    });

    if (!metadata.ok) {
        return {
            recommendationId: recommendation.recommendationId,
            status: 'blocked',
            reason: metadata.reason || 'Fail-closed validation failed.',
            requiresHumanApproval: true,
            requiredApprovalLevel: 'executive'
        };
    }

    const gate = determineApprovalRequirement(
        metadata.riskTier as RiskTier,
        metadata.confidence as number,
        getHasRollbackPlan(recommendation)
    );

    const effectiveApprovalRequired = gate.required || recommendation.requiresHumanApproval || riskTierRequiresApproval(metadata.riskTier as RiskTier);
    const effectiveApprovalLevel: ApprovalLevel = gate.required
        ? gate.level
        : (effectiveApprovalRequired ? 'team-lead' : 'none');

    if (!effectiveApprovalRequired) {
        return {
            recommendationId: recommendation.recommendationId,
            status: 'approved',
            reason: gate.reason,
            riskTier: metadata.riskTier,
            confidence: metadata.confidence,
            requiresHumanApproval: false,
            requiredApprovalLevel: 'none'
        };
    }

    if (!isApprovalSatisfied(effectiveApprovalLevel, grantedApprovals)) {
        return {
            recommendationId: recommendation.recommendationId,
            status: 'requires_human_approval',
            reason: `Awaiting ${effectiveApprovalLevel} approval. ${gate.reason}`,
            riskTier: metadata.riskTier,
            confidence: metadata.confidence,
            requiresHumanApproval: true,
            requiredApprovalLevel: effectiveApprovalLevel
        };
    }

    return {
        recommendationId: recommendation.recommendationId,
        status: 'approved',
        reason: `${effectiveApprovalLevel} approval satisfied.`,
        riskTier: metadata.riskTier,
        confidence: metadata.confidence,
        requiresHumanApproval: false,
        requiredApprovalLevel: 'none'
    };
}

export function evaluatePolicyBatch(
    recommendations: CognitionRecommendation[],
    approvalsByRecommendationId: Record<string, ApprovalLevel[]> = {}
): PolicyBatchResult {
    const decisions: PolicyDecision[] = [];
    const approved: CognitionRecommendation[] = [];
    const blocked: CognitionRecommendation[] = [];
    const pendingApproval: CognitionRecommendation[] = [];

    for (const recommendation of recommendations) {
        const decision = evaluateRecommendationPolicy({
            recommendation,
            grantedApprovals: approvalsByRecommendationId[recommendation.recommendationId] || []
        });

        decisions.push(decision);

        if (decision.status === 'approved') {
            approved.push(recommendation);
        } else if (decision.status === 'blocked') {
            blocked.push(recommendation);
        } else {
            pendingApproval.push(recommendation);
        }
    }

    return {
        decisions,
        approved,
        blocked,
        pendingApproval
    };
}
