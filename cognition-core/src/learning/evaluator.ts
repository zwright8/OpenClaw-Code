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

export type CalibrationReadiness =
    | 'ready'
    | 'no_terminal_outcomes'
    | 'no_mapped_outcomes'
    | 'insufficient_sample_size'
    | 'insufficient_mapping_rate';

export interface CalibrationConfidenceEnvelope {
    confidenceLevel: number;
    method: 'hoeffding';
    sampleSize: number;
    predictedSuccessMean: number | null;
    observedSuccessMean: number | null;
    observedSuccessLowerBound: number | null;
    observedSuccessUpperBound: number | null;
    calibrationGapLowerBound: number | null;
    calibrationGapUpperBound: number | null;
}

export interface CalibrationDiagnostics {
    readiness: CalibrationReadiness;
    reason: string;
    minimumSampleSize: number;
    minimumMappingRate: number;
    observedTerminalOutcomes: number;
    observedMappedOutcomes: number;
    observedSampleSize: number;
    observedMappingRate: number;
    confidenceEnvelope?: CalibrationConfidenceEnvelope;
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
    calibrationSampleSize: number;
    averageAttempts: number;
    averageLatencyMs: number;
    meanPredictedSuccess: number | null;
    brierScore: number | null;
    calibrationGap: number | null;
    calibrationDiagnostics?: CalibrationDiagnostics;
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

function asFiniteOptional(value: unknown): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function toProbability(value: unknown, fallback = 0.5): number {
    return clamp(asFiniteNumber(value, fallback), 0, 1);
}

function normalizeStatus(status: EvaluationStatus): string {
    return String(status ?? '').trim().toLowerCase();
}

const TERMINAL_OUTCOME_STATUSES = new Set<Lowercase<EvaluationStatus>>([
    'completed',
    'partial',
    'failed',
    'timed_out',
    'rejected',
    'transport_error'
]);

const TERMINAL_STATUS_PRIORITY = new Map<string, number>([
    ['completed', 60],
    ['partial', 50],
    ['failed', 40],
    ['timed_out', 30],
    ['rejected', 20],
    ['transport_error', 10]
]);

const MIN_CALIBRATION_SAMPLE_SIZE = 3;
const MIN_CALIBRATION_MAPPING_RATE = 0.35;
const CALIBRATION_ENVELOPE_CONFIDENCE_LEVEL = 0.95;

interface CalibrationPair {
    prediction: number;
    actual: number;
}

function buildHoeffdingEnvelope(
    sampleMean: number,
    sampleSize: number
): { lowerBound: number; upperBound: number } | null {
    if (sampleSize <= 0) {
        return null;
    }

    const alpha = 1 - CALIBRATION_ENVELOPE_CONFIDENCE_LEVEL;
    const epsilon = Math.sqrt(Math.log(2 / alpha) / (2 * sampleSize));

    return {
        lowerBound: round(clamp(sampleMean - epsilon, 0, 1)),
        upperBound: round(clamp(sampleMean + epsilon, 0, 1))
    };
}

function buildCalibrationConfidenceEnvelope(mappedLabels: CalibrationPair[]): CalibrationConfidenceEnvelope {
    const sampleSize = mappedLabels.length;
    if (sampleSize === 0) {
        return {
            confidenceLevel: CALIBRATION_ENVELOPE_CONFIDENCE_LEVEL,
            method: 'hoeffding',
            sampleSize: 0,
            predictedSuccessMean: null,
            observedSuccessMean: null,
            observedSuccessLowerBound: null,
            observedSuccessUpperBound: null,
            calibrationGapLowerBound: null,
            calibrationGapUpperBound: null
        };
    }

    const predictedSuccessMean = round(mean(mappedLabels.map((item) => item.prediction)));
    const observedSuccessMean = round(mean(mappedLabels.map((item) => item.actual)));
    const observedEnvelope = buildHoeffdingEnvelope(observedSuccessMean, sampleSize);

    if (!observedEnvelope) {
        return {
            confidenceLevel: CALIBRATION_ENVELOPE_CONFIDENCE_LEVEL,
            method: 'hoeffding',
            sampleSize,
            predictedSuccessMean,
            observedSuccessMean,
            observedSuccessLowerBound: null,
            observedSuccessUpperBound: null,
            calibrationGapLowerBound: null,
            calibrationGapUpperBound: null
        };
    }

    const observedSuccessLowerBound = observedEnvelope.lowerBound;
    const observedSuccessUpperBound = observedEnvelope.upperBound;
    const predictedInsideObservedBand = predictedSuccessMean >= observedSuccessLowerBound
        && predictedSuccessMean <= observedSuccessUpperBound;

    const lowerGapCandidate = Math.min(
        Math.abs(predictedSuccessMean - observedSuccessLowerBound),
        Math.abs(predictedSuccessMean - observedSuccessUpperBound)
    );

    const calibrationGapLowerBound = round(predictedInsideObservedBand ? 0 : lowerGapCandidate);
    const calibrationGapUpperBound = round(Math.max(
        Math.abs(predictedSuccessMean - observedSuccessLowerBound),
        Math.abs(predictedSuccessMean - observedSuccessUpperBound)
    ));

    return {
        confidenceLevel: CALIBRATION_ENVELOPE_CONFIDENCE_LEVEL,
        method: 'hoeffding',
        sampleSize,
        predictedSuccessMean,
        observedSuccessMean,
        observedSuccessLowerBound,
        observedSuccessUpperBound,
        calibrationGapLowerBound,
        calibrationGapUpperBound
    };
}

function buildCalibrationDiagnostics(
    terminalOutcomeCount: number,
    calibrationSampleSize: number,
    calibrationMappingRate: number,
    confidenceEnvelope: CalibrationConfidenceEnvelope
): CalibrationDiagnostics {
    const observedMappedOutcomes = Math.max(0, calibrationSampleSize);
    const observedTerminalOutcomes = Math.max(0, terminalOutcomeCount);
    const observedMappingRate = observedTerminalOutcomes > 0
        ? round(calibrationMappingRate)
        : 0;

    const baseDiagnostics = {
        minimumSampleSize: MIN_CALIBRATION_SAMPLE_SIZE,
        minimumMappingRate: MIN_CALIBRATION_MAPPING_RATE,
        observedTerminalOutcomes,
        observedMappedOutcomes,
        observedSampleSize: observedMappedOutcomes,
        observedMappingRate,
        confidenceEnvelope
    };

    if (observedTerminalOutcomes === 0) {
        return {
            readiness: 'no_terminal_outcomes',
            reason: 'Calibration metrics deferred: no terminal outcomes yet.',
            ...baseDiagnostics
        };
    }

    if (observedMappedOutcomes === 0) {
        return {
            readiness: 'no_mapped_outcomes',
            reason: 'Calibration metrics deferred: no mapped terminal outcomes.',
            ...baseDiagnostics
        };
    }

    if (observedMappedOutcomes < MIN_CALIBRATION_SAMPLE_SIZE) {
        return {
            readiness: 'insufficient_sample_size',
            reason: `Calibration metrics deferred: mapped sample ${observedMappedOutcomes} is below minimum ${MIN_CALIBRATION_SAMPLE_SIZE}.`,
            ...baseDiagnostics
        };
    }

    if (calibrationMappingRate < MIN_CALIBRATION_MAPPING_RATE) {
        return {
            readiness: 'insufficient_mapping_rate',
            reason: `Calibration metrics deferred: mapping rate ${round(calibrationMappingRate)} is below minimum ${MIN_CALIBRATION_MAPPING_RATE}.`,
            ...baseDiagnostics
        };
    }

    return {
        readiness: 'ready',
        reason: 'Calibration metrics active: sample-size and mapping-rate gates satisfied.',
        ...baseDiagnostics
    };
}

function isTerminalStatus(status: EvaluationStatus): boolean {
    return TERMINAL_OUTCOME_STATUSES.has(normalizeStatus(status) as Lowercase<EvaluationStatus>);
}

function outcomeToLabel(status: EvaluationStatus): number | null {
    const normalized = normalizeStatus(status) as Lowercase<EvaluationStatus>;
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

function statusPriority(status: EvaluationStatus): number {
    const normalized = normalizeStatus(status);
    if (TERMINAL_STATUS_PRIORITY.has(normalized)) {
        return TERMINAL_STATUS_PRIORITY.get(normalized) ?? 0;
    }

    return isTerminalStatus(status) ? 5 : 0;
}

function compareNullableNumbers(a: number | null, b: number | null): number {
    if (a !== null && b !== null && a !== b) {
        return a > b ? 1 : -1;
    }
    if (a !== null && b === null) return 1;
    if (a === null && b !== null) return -1;
    return 0;
}

function compareStrings(a: string | undefined, b: string | undefined): number {
    const left = a ?? '';
    const right = b ?? '';
    if (left === right) return 0;
    return left.localeCompare(right);
}

function mergeMissingFields(primary: ExecutionOutcome, secondary: ExecutionOutcome): ExecutionOutcome {
    return {
        ...primary,
        recommendationId: primary.recommendationId ?? secondary.recommendationId,
        owner: primary.owner ?? secondary.owner,
        attempts: primary.attempts ?? secondary.attempts,
        createdAt: primary.createdAt ?? secondary.createdAt,
        closedAt: primary.closedAt ?? secondary.closedAt
    };
}

function pickPreferredOutcome(a: ExecutionOutcome, b: ExecutionOutcome): ExecutionOutcome {
    const aTerminal = isTerminalStatus(a.status);
    const bTerminal = isTerminalStatus(b.status);

    if (aTerminal !== bTerminal) {
        return aTerminal ? mergeMissingFields(a, b) : mergeMissingFields(b, a);
    }

    const aTimestamp = asFiniteOptional(a.closedAt) ?? asFiniteOptional(a.createdAt);
    const bTimestamp = asFiniteOptional(b.closedAt) ?? asFiniteOptional(b.createdAt);
    const timestampComparison = compareNullableNumbers(aTimestamp, bTimestamp);
    if (timestampComparison !== 0) {
        return timestampComparison > 0 ? mergeMissingFields(a, b) : mergeMissingFields(b, a);
    }

    const aPriority = statusPriority(a.status);
    const bPriority = statusPriority(b.status);
    if (aPriority !== bPriority) {
        return aPriority > bPriority ? mergeMissingFields(a, b) : mergeMissingFields(b, a);
    }

    const recommendationComparison = compareStrings(a.recommendationId, b.recommendationId);
    if (recommendationComparison !== 0) {
        return recommendationComparison <= 0 ? mergeMissingFields(a, b) : mergeMissingFields(b, a);
    }

    const ownerComparison = compareStrings(a.owner, b.owner);
    if (ownerComparison !== 0) {
        return ownerComparison <= 0 ? mergeMissingFields(a, b) : mergeMissingFields(b, a);
    }

    const attemptsA = asFiniteOptional(a.attempts);
    const attemptsB = asFiniteOptional(b.attempts);
    const attemptsComparison = compareNullableNumbers(attemptsA, attemptsB);
    if (attemptsComparison !== 0) {
        return attemptsComparison > 0 ? mergeMissingFields(a, b) : mergeMissingFields(b, a);
    }

    return mergeMissingFields(a, b);
}

function collapseOutcomePaths(outcomes: ExecutionOutcome[]): ExecutionOutcome[] {
    const groupedByTaskPath = new Map<string, ExecutionOutcome>();

    for (let index = 0; index < outcomes.length; index += 1) {
        const outcome = outcomes[index];
        const taskId = outcome.taskId ? String(outcome.taskId).trim() : '';
        const key = taskId ? `task:${taskId}` : `row:${index}`;

        const existing = groupedByTaskPath.get(key);
        if (!existing) {
            groupedByTaskPath.set(key, { ...outcome, taskId: taskId || outcome.taskId });
            continue;
        }

        groupedByTaskPath.set(key, pickPreferredOutcome(existing, outcome));
    }

    return Array.from(groupedByTaskPath.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([, outcome]) => outcome);
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
        }))
        .sort((a, b) => {
            const recommendationOrder = a.recommendationId.localeCompare(b.recommendationId);
            if (recommendationOrder !== 0) return recommendationOrder;

            const ownerOrder = a.owner.localeCompare(b.owner);
            if (ownerOrder !== 0) return ownerOrder;

            const riskTierOrder = a.riskTier.localeCompare(b.riskTier);
            if (riskTierOrder !== 0) return riskTierOrder;

            return b.probability - a.probability;
        });

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

    const canonicalOutcomes = collapseOutcomePaths(
        outcomes.filter((item) => Boolean(item && item.status !== undefined && item.status !== null))
    );

    const mappedLabels: Array<{ prediction: number; actual: number }> = [];
    const attempts: number[] = [];
    const latencies: number[] = [];
    let terminalOutcomeCount = 0;
    let nonTerminalOutcomeCount = 0;
    let successCount = 0;

    for (const outcome of canonicalOutcomes) {
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
            if (b.outcomes !== a.outcomes) return b.outcomes - a.outcomes;
            return a.recommendationId.localeCompare(b.recommendationId);
        });

    const calibrationSampleSize = mappedLabels.length;
    const calibrationMappingRate = terminalOutcomeCount > 0
        ? calibrationSampleSize / terminalOutcomeCount
        : 0;
    const calibrationConfidenceEnvelope = buildCalibrationConfidenceEnvelope(mappedLabels);
    const calibrationDiagnostics = buildCalibrationDiagnostics(
        terminalOutcomeCount,
        calibrationSampleSize,
        calibrationMappingRate,
        calibrationConfidenceEnvelope
    );

    const hasCalibrationEvidence = calibrationDiagnostics.readiness === 'ready';

    const brierScore = hasCalibrationEvidence
        ? round(mean(mappedLabels.map((item) => (item.prediction - item.actual) ** 2)))
        : null;

    const calibrationGap = hasCalibrationEvidence
        ? round(Math.abs(
            (calibrationConfidenceEnvelope.predictedSuccessMean ?? 0)
            - (calibrationConfidenceEnvelope.observedSuccessMean ?? 0)
        ))
        : null;

    const metrics: EvaluatorMetrics = {
        totalOutcomes: canonicalOutcomes.length,
        terminalOutcomes: terminalOutcomeCount,
        nonTerminalOutcomes: nonTerminalOutcomeCount,
        successfulOutcomes: successCount,
        failedOutcomes: Math.max(0, terminalOutcomeCount - successCount),
        successRate: terminalOutcomeCount > 0 ? round(successCount / terminalOutcomeCount) : 0,
        mappedOutcomes: mappedLabels.length,
        mappingRate: terminalOutcomeCount > 0 ? round(mappedLabels.length / terminalOutcomeCount) : 0,
        calibrationSampleSize,
        averageAttempts: attempts.length > 0 ? round(mean(attempts), 2) : 0,
        averageLatencyMs: latencies.length > 0 ? round(mean(latencies), 2) : 0,
        meanPredictedSuccess: hasCalibrationEvidence
            ? calibrationConfidenceEnvelope.predictedSuccessMean
            : null,
        brierScore,
        calibrationGap,
        calibrationDiagnostics
    };

    return {
        generatedAt,
        metrics,
        recommendations: recommendationRows
    };
}
