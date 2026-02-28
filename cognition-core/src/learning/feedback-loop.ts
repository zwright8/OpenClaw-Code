import {
    evaluateRecommendations,
    type EvaluatorResult,
    type ExecutionOutcome,
    type RecommendationPrediction
} from './evaluator.js';
import {
    tuneThresholds,
    DEFAULT_THRESHOLDS,
    type EvaluationThresholds,
    type ThresholdTuningResult
} from './threshold-tuner.js';

export type PromotionSignal = 'promote' | 'hold' | 'demote';

export interface SkillSignal {
    owner: string;
    outcomes: number;
    successRate: number;
    signal: PromotionSignal;
    rationale: string;
}

export interface FeedbackLoopResult {
    generatedAt: string;
    evaluation: EvaluatorResult;
    thresholdTuning: ThresholdTuningResult;
    skillSignals: SkillSignal[];
}

function round(value: number, decimals = 4): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

function buildSkillSignals(
    evaluation: EvaluatorResult,
    thresholds: EvaluationThresholds
): SkillSignal[] {
    const byOwner = new Map<string, { outcomes: number; successes: number }>();

    for (const recommendation of evaluation.recommendations) {
        if (!recommendation.owner || recommendation.outcomes === 0) continue;

        const bucket = byOwner.get(recommendation.owner) ?? {
            outcomes: 0,
            successes: 0
        };

        bucket.outcomes += recommendation.outcomes;
        bucket.successes += recommendation.successes;
        byOwner.set(recommendation.owner, bucket);
    }

    return Array.from(byOwner.entries())
        .map(([owner, summary]) => {
            const successRate = summary.outcomes > 0
                ? round(summary.successes / summary.outcomes)
                : 0;

            let signal: PromotionSignal = 'hold';
            if (summary.outcomes < thresholds.minSampleSize) {
                signal = 'hold';
            } else if (successRate >= thresholds.promotionSuccessRate) {
                signal = 'promote';
            } else if (successRate <= thresholds.demotionSuccessRate) {
                signal = 'demote';
            }

            const rationale = summary.outcomes < thresholds.minSampleSize
                ? `Insufficient evidence (${summary.outcomes} outcomes, requires ${thresholds.minSampleSize}).`
                : `Success rate ${successRate} against promotion=${thresholds.promotionSuccessRate}, demotion=${thresholds.demotionSuccessRate}.`;

            return {
                owner,
                outcomes: summary.outcomes,
                successRate,
                signal,
                rationale
            };
        })
        .sort((a, b) => {
            const priority = { demote: 0, hold: 1, promote: 2 };
            if (priority[a.signal] !== priority[b.signal]) {
                return priority[a.signal] - priority[b.signal];
            }
            return b.outcomes - a.outcomes;
        });
}

export function runFeedbackLoop(
    predictions: RecommendationPrediction[],
    outcomes: ExecutionOutcome[],
    options: {
        generatedAt?: string;
        thresholds?: Partial<EvaluationThresholds>;
    } = {}
): FeedbackLoopResult {
    const generatedAt = options.generatedAt ?? new Date().toISOString();
    const evaluation = evaluateRecommendations(predictions, outcomes, generatedAt);
    const thresholdTuning = tuneThresholds(evaluation, options.thresholds ?? DEFAULT_THRESHOLDS);
    const skillSignals = buildSkillSignals(evaluation, thresholdTuning.thresholds);

    return {
        generatedAt,
        evaluation,
        thresholdTuning,
        skillSignals
    };
}
