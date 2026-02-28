export type EvaluationStatus =
    | 'completed'
    | 'partial'
    | 'failed'
    | 'timed_out'
    | 'rejected'
    | 'transport_error'
    | string;

export interface RecommendationPrediction {
    recommendationId: string;
    owner?: string;
    riskTier?: string;
    confidence?: number;
    expectedSuccessProbability?: number;
}

export interface ExecutionOutcome {
    taskId?: string;
    recommendationId?: string;
    status: EvaluationStatus;
    owner?: string;
    attempts?: number;
    createdAt?: number;
    closedAt?: number;
}

export interface EvaluatorMetrics {
    totalOutcomes: number;
    terminalOutcomes: number;
    nonTerminalOutcomes: number;
    successfulOutcomes: number;
    failedOutcomes: number;
    successRate: number;
    mappedOutcomes: number;
    mappingRate: number;
    averageAttempts: number;
    averageLatencyMs: number;
    meanPredictedSuccess: number | null;
    brierScore: number | null;
    calibrationGap: number | null;
}

export interface RecommendationEvaluation {
    recommendationId: string;
    owner: string;
    riskTier: string;
    predictedSuccessProbability: number;
    outcomes: number;
    successes: number;
    failures: number;
    successRate: number;
}

export interface EvaluatorResult {
    generatedAt: string;
    metrics: EvaluatorMetrics;
    recommendations: RecommendationEvaluation[];
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function asFiniteNumber(value: unknown, fallback = 0): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toProbability(value: unknown, fallback = 0.5): number {
    return clamp(asFiniteNumber(value, fallback), 0, 1);
}

const TERMINAL_OUTCOME_STATUSES = new Set<Lowercase<EvaluationStatus>>([
    'completed',
    'partial',
    'failed',
    'timed_out',
    'rejected',
    'transport_error'
]);

function outcomeToLabel(status: EvaluationStatus): number | null {
    const normalized = String(status ?? '').trim().toLowerCase() as Lowercase<EvaluationStatus>;
    if (!TERMINAL_OUTCOME_STATUSES.has(normalized)) {
        return null;
    }

    if (normalized === 'completed') return 1;
    if (normalized === 'partial') return 0.5;
    return 0;
}

function round(value: number, decimals = 4): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function resolvePredictionProbability(prediction: RecommendationPrediction): number {
    if (prediction.expectedSuccessProbability !== undefined) {
        return toProbability(prediction.expectedSuccessProbability);
    }
    if (prediction.confidence !== undefined) {
        return toProbability(prediction.confidence);
    }
    return 0.5;
}

export function evaluateRecommendations(
    predictions: RecommendationPrediction[],
    outcomes: ExecutionOutcome[],
    generatedAt = new Date().toISOString()
): EvaluatorResult {
    const byRecommendation = new Map<string, RecommendationEvaluation>();
    const normalizedPredictions = predictions
        .filter((item) => Boolean(item && item.recommendationId))
        .map((item) => ({
            recommendationId: String(item.recommendationId),
            owner: item.owner ?? 'unassigned',
            riskTier: item.riskTier ?? 'unknown',
            probability: resolvePredictionProbability(item)
        }));

    for (const prediction of normalizedPredictions) {
        if (!byRecommendation.has(prediction.recommendationId)) {
            byRecommendation.set(prediction.recommendationId, {
                recommendationId: prediction.recommendationId,
                owner: prediction.owner,
                riskTier: prediction.riskTier,
                predictedSuccessProbability: prediction.probability,
                outcomes: 0,
                successes: 0,
                failures: 0,
                successRate: 0
            });
        }
    }

    const mappedLabels: Array<{ prediction: number; actual: number }> = [];
    const attempts: number[] = [];
    const latencies: number[] = [];
    let terminalOutcomeCount = 0;
    let nonTerminalOutcomeCount = 0;
    let successCount = 0;

    for (const outcome of outcomes) {
        const actualLabel = outcomeToLabel(outcome.status);
        if (actualLabel === null) {
            nonTerminalOutcomeCount += 1;
            continue;
        }

        terminalOutcomeCount += 1;
        if (actualLabel > 0) successCount++;

        attempts.push(Math.max(0, asFiniteNumber(outcome.attempts, 0)));

        const createdAt = asFiniteNumber(outcome.createdAt, NaN);
        const closedAt = asFiniteNumber(outcome.closedAt, NaN);
        if (Number.isFinite(createdAt) && Number.isFinite(closedAt)) {
            latencies.push(Math.max(0, closedAt - createdAt));
        }

        const recommendationId = outcome.recommendationId ? String(outcome.recommendationId) : null;
        if (!recommendationId) continue;

        const bucket = byRecommendation.get(recommendationId);
        if (!bucket) continue;

        bucket.outcomes += 1;
        if (actualLabel > 0) {
            bucket.successes += 1;
        } else {
            bucket.failures += 1;
        }
        mappedLabels.push({
            prediction: bucket.predictedSuccessProbability,
            actual: actualLabel
        });
    }

    const recommendationRows = Array.from(byRecommendation.values())
        .map((row) => ({
            ...row,
            successRate: row.outcomes > 0 ? round(row.successes / row.outcomes) : 0
        }))
        .sort((a, b) => {
            if (b.successRate !== a.successRate) return b.successRate - a.successRate;
            return b.outcomes - a.outcomes;
        });

    const brierScore = mappedLabels.length > 0
        ? round(mean(mappedLabels.map((item) => (item.prediction - item.actual) ** 2)))
        : null;

    const calibrationGap = mappedLabels.length > 0
        ? round(Math.abs(mean(mappedLabels.map((item) => item.prediction)) - mean(mappedLabels.map((item) => item.actual))))
        : null;

    const metrics: EvaluatorMetrics = {
        totalOutcomes: outcomes.length,
        terminalOutcomes: terminalOutcomeCount,
        nonTerminalOutcomes: nonTerminalOutcomeCount,
        successfulOutcomes: successCount,
        failedOutcomes: Math.max(0, terminalOutcomeCount - successCount),
        successRate: terminalOutcomeCount > 0 ? round(successCount / terminalOutcomeCount) : 0,
        mappedOutcomes: mappedLabels.length,
        mappingRate: terminalOutcomeCount > 0 ? round(mappedLabels.length / terminalOutcomeCount) : 0,
        averageAttempts: attempts.length > 0 ? round(mean(attempts), 2) : 0,
        averageLatencyMs: latencies.length > 0 ? round(mean(latencies), 2) : 0,
        meanPredictedSuccess: mappedLabels.length > 0 ? round(mean(mappedLabels.map((item) => item.prediction))) : null,
        brierScore,
        calibrationGap
    };

    return {
        generatedAt,
        metrics,
        recommendations: recommendationRows
    };
}
