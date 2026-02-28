import {
    type CognitionRecommendation,
    type EvidenceItem,
    type RiskTier,
    riskTierRequiresApproval
} from './anomaly.js';
import { type RootCauseFinding } from './root-cause.js';

export interface CounterfactualScenarioInput {
    scenarioId: string;
    title: string;
    description: string;
    expectedImprovementPct: number;
    implementationRisk: RiskTier;
    executionConfidence: number;
    evidence?: EvidenceItem[];
}

export interface CounterfactualSimulationInput {
    finding: RootCauseFinding;
    scenarios: CounterfactualScenarioInput[];
}

export interface CounterfactualOutcome {
    scenarioId: string;
    findingId: string;
    title: string;
    netBenefitScore: number;
    predictedResidualRisk: RiskTier;
    confidence: number;
    evidence: EvidenceItem[];
    recommendation: CognitionRecommendation;
}

const TIER_SCORE: Record<RiskTier, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
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

function scoreToRiskTier(score: number): RiskTier {
    if (score >= 3.5) return 'critical';
    if (score >= 2.5) return 'high';
    if (score >= 1.75) return 'medium';
    return 'low';
}

export function simulateCounterfactuals(inputs: CounterfactualSimulationInput[]): CounterfactualOutcome[] {
    const outcomes: CounterfactualOutcome[] = [];

    for (const input of inputs) {
        const baselineRiskScore = TIER_SCORE[input.finding.riskTier];

        for (const scenario of input.scenarios) {
            const improvement = clamp(scenario.expectedImprovementPct / 100, 0, 2);
            const scenarioConfidence = clamp((input.finding.confidence * 0.5) + (scenario.executionConfidence * 0.5));
            const implementationRiskScore = TIER_SCORE[scenario.implementationRisk];

            const residualRiskScore = Math.max(
                1,
                baselineRiskScore
                    - (improvement * 2.2)
                    + (implementationRiskScore * 0.45)
                    - (scenarioConfidence * 0.4)
            );
            const predictedResidualRisk = scoreToRiskTier(residualRiskScore);
            const netBenefitScore = Number(((improvement * 10) - (implementationRiskScore * 1.4) + (scenarioConfidence * 3)).toFixed(2));

            const evidence = [
                ...input.finding.evidence,
                ...(scenario.evidence || [])
            ];

            const recommendationRiskTier = TIER_SCORE[scenario.implementationRisk] > TIER_SCORE[predictedResidualRisk]
                ? scenario.implementationRisk
                : predictedResidualRisk;

            const recommendation: CognitionRecommendation = {
                recommendationId: deterministicId('rec-cf', `${input.finding.findingId}:${scenario.scenarioId}`),
                title: `Run counterfactual plan: ${scenario.title}`,
                reasoning: `Scenario "${scenario.title}" is projected to reduce risk from ${input.finding.riskTier} to ${predictedResidualRisk} with net benefit ${netBenefitScore}.`,
                evidence,
                confidence: scenarioConfidence,
                riskTier: recommendationRiskTier,
                requiresHumanApproval: riskTierRequiresApproval(recommendationRiskTier),
                estimatedImpact: {
                    summary: `Expected improvement: ${scenario.expectedImprovementPct.toFixed(1)}%`,
                    score: Math.round((Math.max(netBenefitScore, 0) / 12) * 100)
                },
                verificationPlan: [
                    'Execute change in a controlled window or canary cohort.',
                    'Measure primary anomaly signal and rollback if deterioration exceeds threshold.'
                ],
                priority: Math.round((Math.max(netBenefitScore, 0) * 6) + (scenarioConfidence * 40))
            };

            outcomes.push({
                scenarioId: scenario.scenarioId,
                findingId: input.finding.findingId,
                title: scenario.title,
                netBenefitScore,
                predictedResidualRisk,
                confidence: scenarioConfidence,
                evidence,
                recommendation
            });
        }
    }

    outcomes.sort((a, b) => b.netBenefitScore - a.netBenefitScore);
    return outcomes;
}
