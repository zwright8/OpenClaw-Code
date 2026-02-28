import type { EvaluatorResult } from './evaluator.js';

export interface EvaluationThresholds {
    promotionSuccessRate: number;
    holdSuccessRate: number;
    demotionSuccessRate: number;
    confidenceFloor: number;
    minSampleSize: number;
    maxBrierScore: number;
    maxCalibrationGap: number;
}

export interface ThresholdChange {
    field: keyof EvaluationThresholds;
    previous: number;
    next: number;
    reason: string;
}

export interface ThresholdTuningResult {
    thresholds: EvaluationThresholds;
    changes: ThresholdChange[];
}

export const DEFAULT_THRESHOLDS: EvaluationThresholds = {
    promotionSuccessRate: 0.85,
    holdSuccessRate: 0.7,
    demotionSuccessRate: 0.55,
    confidenceFloor: 0.6,
    minSampleSize: 10,
    maxBrierScore: 0.2,
    maxCalibrationGap: 0.2
};

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function round(value: number, decimals = 4): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

function withChange(
    result: ThresholdTuningResult,
    field: keyof EvaluationThresholds,
    next: number,
    reason: string
): void {
    const previous = result.thresholds[field];
    if (round(previous) === round(next)) return;
    result.thresholds[field] = round(next);
    result.changes.push({
        field,
        previous,
        next: result.thresholds[field],
        reason
    });
}

export function tuneThresholds(
    evaluation: EvaluatorResult,
    currentThresholds: Partial<EvaluationThresholds> = {}
): ThresholdTuningResult {
    const thresholds: EvaluationThresholds = {
        ...DEFAULT_THRESHOLDS,
        ...currentThresholds
    };

    const result: ThresholdTuningResult = {
        thresholds: { ...thresholds },
        changes: []
    };

    const { metrics } = evaluation;
    if (metrics.totalOutcomes < result.thresholds.minSampleSize) {
        return result;
    }

    if (metrics.successRate < result.thresholds.holdSuccessRate) {
        withChange(
            result,
            'confidenceFloor',
            clamp(result.thresholds.confidenceFloor + 0.03, 0.4, 0.95),
            `Success rate ${metrics.successRate} below hold threshold ${result.thresholds.holdSuccessRate}`
        );

        withChange(
            result,
            'promotionSuccessRate',
            clamp(result.thresholds.promotionSuccessRate + 0.02, 0.75, 0.98),
            'Promotion gate tightened after weak execution quality.'
        );
    } else if (
        metrics.successRate > result.thresholds.promotionSuccessRate &&
        (metrics.brierScore ?? result.thresholds.maxBrierScore) <= result.thresholds.maxBrierScore &&
        (metrics.calibrationGap ?? result.thresholds.maxCalibrationGap) <= result.thresholds.maxCalibrationGap
    ) {
        withChange(
            result,
            'confidenceFloor',
            clamp(result.thresholds.confidenceFloor - 0.02, 0.4, 0.95),
            'Strong performance and calibration allow more throughput.'
        );

        withChange(
            result,
            'promotionSuccessRate',
            clamp(result.thresholds.promotionSuccessRate - 0.01, 0.75, 0.98),
            'Promotion gate relaxed after consistent performance.'
        );
    }

    if (
        metrics.brierScore !== null &&
        metrics.brierScore > result.thresholds.maxBrierScore
    ) {
        withChange(
            result,
            'maxBrierScore',
            clamp(result.thresholds.maxBrierScore - 0.01, 0.1, 0.35),
            `Observed Brier score ${metrics.brierScore} exceeded tolerated range.`
        );
    }

    if (
        metrics.calibrationGap !== null &&
        metrics.calibrationGap > result.thresholds.maxCalibrationGap
    ) {
        withChange(
            result,
            'maxCalibrationGap',
            clamp(result.thresholds.maxCalibrationGap - 0.01, 0.08, 0.4),
            `Observed calibration gap ${metrics.calibrationGap} exceeded tolerated range.`
        );
    }

    // Maintain ordering invariants.
    if (result.thresholds.holdSuccessRate > result.thresholds.promotionSuccessRate - 0.05) {
        withChange(
            result,
            'holdSuccessRate',
            clamp(result.thresholds.promotionSuccessRate - 0.05, 0.5, 0.9),
            'Maintain spacing between hold and promotion thresholds.'
        );
    }

    if (result.thresholds.demotionSuccessRate > result.thresholds.holdSuccessRate - 0.05) {
        withChange(
            result,
            'demotionSuccessRate',
            clamp(result.thresholds.holdSuccessRate - 0.05, 0.35, 0.85),
            'Maintain spacing between demotion and hold thresholds.'
        );
    }

    return result;
}
