import {
    type CognitionRecommendation,
    type RiskTier,
    riskTierRequiresApproval
} from './anomaly.js';

export interface ImpactContext {
    revenueAtRiskUsd?: number;
    incidentCostPerHourUsd?: number;
    affectedUsers?: number;
    strategicPriorityMultiplier?: number;
}

export interface RecommendationImpact {
    recommendationId: string;
    impactScore: number;
    urgencyScore: number;
    estimatedValueUsd: number;
    confidence: number;
    riskTier: RiskTier;
    requiresHumanApproval: boolean;
}

const RISK_WEIGHT: Record<RiskTier, number> = {
    low: 1,
    medium: 1.7,
    high: 2.6,
    critical: 3.5
};

function clamp(value: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

export function scoreRecommendationImpact(
    recommendation: CognitionRecommendation,
    context: ImpactContext = {}
): RecommendationImpact {
    const confidence = clamp(recommendation.confidence);
    const riskWeight = RISK_WEIGHT[recommendation.riskTier] || 1;
    const strategicMultiplier = Math.max(context.strategicPriorityMultiplier || 1, 0.5);

    const revenueAtRisk = Math.max(context.revenueAtRiskUsd || 0, 0);
    const incidentCost = Math.max(context.incidentCostPerHourUsd || 0, 0);
    const affectedUsers = Math.max(context.affectedUsers || 0, 0);

    const valueComponent = (revenueAtRisk * 0.015) + (incidentCost * 1.2) + (affectedUsers * 0.35);
    const estimatedValueUsd = Number((valueComponent * riskWeight * strategicMultiplier).toFixed(2));

    const urgencyScore = Number((
        (riskWeight * 20)
        + (confidence * 25)
        + ((recommendation.priority || 0) * 0.35)
    ).toFixed(2));

    const impactScore = Number((
        (urgencyScore * 0.55)
        + (Math.min(estimatedValueUsd / 1000, 100) * 0.45)
    ).toFixed(2));

    return {
        recommendationId: recommendation.recommendationId,
        impactScore,
        urgencyScore,
        estimatedValueUsd,
        confidence,
        riskTier: recommendation.riskTier,
        requiresHumanApproval: recommendation.requiresHumanApproval || riskTierRequiresApproval(recommendation.riskTier)
    };
}

export function scoreImpactForRecommendations(
    recommendations: CognitionRecommendation[],
    context: ImpactContext = {}
): RecommendationImpact[] {
    return recommendations
        .map((recommendation) => scoreRecommendationImpact(recommendation, context))
        .sort((a, b) => b.impactScore - a.impactScore);
}
