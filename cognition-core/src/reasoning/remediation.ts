import {
    type CognitionRecommendation,
    type EvidenceItem,
    type RiskTier,
    riskTierRequiresApproval
} from './anomaly.js';
import { type RootCauseFinding } from './root-cause.js';
import { type CounterfactualOutcome } from './counterfactual.js';

export interface RemediationOption {
    optionId: string;
    title: string;
    description: string;
    targetsCauseIds: string[];
    expectedRiskReductionPct: number;
    implementationEffort: 'low' | 'medium' | 'high';
    rollbackPlan: string;
    verificationSteps: string[];
    evidence?: EvidenceItem[];
}

export interface RemediationRecommendation extends CognitionRecommendation {
    relatedCauseIds: string[];
    rollbackPlan: string;
    score: number;
}

export interface RemediationResult {
    recommendations: RemediationRecommendation[];
}

const TIER_SCORE: Record<RiskTier, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
};

const EFFORT_PENALTY: Record<RemediationOption['implementationEffort'], number> = {
    low: 0.8,
    medium: 1.5,
    high: 2.2
};

function clamp(value: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

function deterministicId(prefix: string, seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    return `${prefix}-${Math.abs(hash).toString(36).padStart(6, '0')}`;
}

function maxRiskTier(left: RiskTier, right: RiskTier): RiskTier {
    return TIER_SCORE[left] >= TIER_SCORE[right] ? left : right;
}

export function planRemediation(
    findings: RootCauseFinding[],
    outcomes: CounterfactualOutcome[],
    options: RemediationOption[]
): RemediationResult {
    const recommendations: RemediationRecommendation[] = [];

    for (const option of options) {
        const relatedFindings = findings.filter((finding) => option.targetsCauseIds.includes(finding.causeId));
        if (relatedFindings.length === 0) {
            continue;
        }

        const relatedOutcomes = outcomes.filter((outcome) =>
            relatedFindings.some((finding) => finding.findingId === outcome.findingId)
        );

        const avgFindingConfidence = relatedFindings.reduce((acc, finding) => acc + finding.confidence, 0) / relatedFindings.length;
        const avgOutcomeBenefit = relatedOutcomes.length > 0
            ? relatedOutcomes.reduce((acc, outcome) => acc + outcome.netBenefitScore, 0) / relatedOutcomes.length
            : 0;

        const riskTier = relatedFindings
            .map((finding) => finding.riskTier)
            .reduce((acc, tier) => maxRiskTier(acc, tier), 'low' as RiskTier);

        const confidence = clamp((avgFindingConfidence * 0.65) + clamp(avgOutcomeBenefit / 10, 0, 1) * 0.35);
        const score = Number((
            (option.expectedRiskReductionPct * 0.45)
            + (Math.max(avgOutcomeBenefit, 0) * 4)
            + (confidence * 22)
            - (EFFORT_PENALTY[option.implementationEffort] * 6)
        ).toFixed(2));

        const evidence = [
            ...relatedFindings.flatMap((finding) => finding.evidence),
            ...relatedOutcomes.flatMap((outcome) => outcome.evidence),
            ...(option.evidence || [])
        ];

        recommendations.push({
            recommendationId: deterministicId('rec-remed', `${option.optionId}:${relatedFindings.map((f) => f.findingId).join(',')}`),
            title: option.title,
            reasoning: `${option.description} Targets ${relatedFindings.length} root-cause finding(s) with expected risk reduction ${option.expectedRiskReductionPct.toFixed(1)}%.`,
            evidence,
            confidence,
            riskTier,
            requiresHumanApproval: riskTierRequiresApproval(riskTier),
            estimatedImpact: {
                summary: `Projected net benefit ${avgOutcomeBenefit.toFixed(2)} with effort ${option.implementationEffort}.`,
                score: Math.round(Math.max(score, 0))
            },
            verificationPlan: option.verificationSteps,
            priority: Math.round(Math.max(score, 0)),
            relatedCauseIds: relatedFindings.map((finding) => finding.causeId),
            rollbackPlan: option.rollbackPlan,
            score
        });
    }

    recommendations.sort((a, b) => b.score - a.score);

    return { recommendations };
}
