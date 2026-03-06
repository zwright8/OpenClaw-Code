import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRecommendations, type EvaluatorResult } from '../../src/learning/evaluator.js';
import { DEFAULT_THRESHOLDS, tuneThresholds } from '../../src/learning/threshold-tuner.js';

test('evaluateRecommendations computes core metrics and recommendation rollups', () => {
    const predictions = [
        { recommendationId: 'r1', owner: 'agent:a', confidence: 0.9 },
        { recommendationId: 'r2', owner: 'agent:b', confidence: 0.6 }
    ];

    const outcomes = [
        { taskId: 't1', recommendationId: 'r1', status: 'completed', attempts: 1, createdAt: 0, closedAt: 100 },
        { taskId: 't2', recommendationId: 'r1', status: 'failed', attempts: 2, createdAt: 100, closedAt: 260 },
        { taskId: 't3', recommendationId: 'r2', status: 'completed', attempts: 1, createdAt: 300, closedAt: 420 },
        { taskId: 't4', status: 'timed_out', attempts: 3 }
    ];

    const result = evaluateRecommendations(predictions, outcomes, '2026-02-28T00:00:00.000Z');

    assert.equal(result.generatedAt, '2026-02-28T00:00:00.000Z');
    assert.equal(result.metrics.totalOutcomes, 4);
    assert.equal(result.metrics.successfulOutcomes, 2);
    assert.equal(result.metrics.successRate, 0.5);
    assert.equal(result.metrics.mappedOutcomes, 3);
    assert.equal(result.metrics.mappingRate, 0.75);
    assert.equal(result.metrics.calibrationSampleSize, 3);
    assert.equal(result.recommendations.length, 2);

    const top = result.recommendations[0];
    assert.equal(top.recommendationId, 'r2');
    assert.equal(top.successRate, 1);

    assert.ok(result.metrics.brierScore !== null);
    assert.ok(result.metrics.calibrationGap !== null);
    assert.equal(result.metrics.calibrationDiagnostics?.readiness, 'ready');
    assert.equal(result.metrics.calibrationDiagnostics?.reasonCode, 'ready');
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /calibration_readiness=ready; reason_code=ready; terminal_outcomes=4; eligible_terminal_outcomes=3; mapped_outcomes=3;/
    );
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /readiness_flags\(sample_size_ready=true,mapping_rate_ready=true,sample_size_shortfall=0,mapping_rate_shortfall=0,[^)]*\)/
    );
    assert.equal(result.metrics.calibrationDiagnostics?.observedTerminalOutcomes, 4);
    assert.equal(result.metrics.calibrationDiagnostics?.observedEligibleTerminalOutcomes, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappedOutcomes, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.observedSampleSize, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappingRate, 0.75);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isSampleSizeReady, true);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isMappingRateReady, true);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.sampleSizeShortfall, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappingRateShortfall, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.minimumMappedOutcomesForMappingRate, 2);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappedOutcomesRateShortfall, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.method, 'hoeffding');
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.sampleSize, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.predictedSuccessMean, 0.8);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessMean, 0.6667);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessLowerBound, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessUpperBound, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapLowerBound, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapUpperBound, 0.8);
});

test('evaluateRecommendations handles empty mappings safely', () => {
    const result = evaluateRecommendations([], [{ status: 'failed' }]);

    assert.equal(result.metrics.totalOutcomes, 1);
    assert.equal(result.metrics.terminalOutcomes, 1);
    assert.equal(result.metrics.nonTerminalOutcomes, 0);
    assert.equal(result.metrics.mappedOutcomes, 0);
    assert.equal(result.metrics.calibrationSampleSize, 0);
    assert.equal(result.metrics.brierScore, null);
    assert.equal(result.metrics.calibrationGap, null);
    assert.equal(result.metrics.calibrationDiagnostics?.readiness, 'no_mapped_outcomes');
    assert.equal(result.metrics.calibrationDiagnostics?.reasonCode, 'no_eligible_terminal_outcomes');
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /calibration_readiness=no_mapped_outcomes; reason_code=no_eligible_terminal_outcomes; terminal_outcomes=1; eligible_terminal_outcomes=0; mapped_outcomes=0;/
    );
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /readiness_flags\(sample_size_ready=false,mapping_rate_ready=false,sample_size_shortfall=3,mapping_rate_shortfall=0\.35,[^)]*\)/
    );
    assert.equal(result.metrics.calibrationDiagnostics?.observedTerminalOutcomes, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.observedEligibleTerminalOutcomes, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappedOutcomes, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.observedSampleSize, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappingRate, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isSampleSizeReady, false);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isMappingRateReady, false);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.sampleSizeShortfall, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappingRateShortfall, 0.35);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.minimumMappedOutcomesForMappingRate, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappedOutcomesRateShortfall, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.sampleSize, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.predictedSuccessMean, null);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessMean, null);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessLowerBound, null);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessUpperBound, null);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapLowerBound, null);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapUpperBound, null);
});

test('evaluateRecommendations backfills recommendation buckets from terminal outcomes', () => {
    const result = evaluateRecommendations(
        [],
        [
            { recommendationId: 'rec-1', status: 'completed' },
            { recommendationId: 'rec-1', status: 'failed' },
            { recommendationId: 'rec-2', status: 'completed' }
        ]
    );

    assert.equal(result.metrics.terminalOutcomes, 3);
    assert.equal(result.metrics.eligibleTerminalOutcomes, 3);
    assert.equal(result.metrics.mappedOutcomes, 3);
    assert.equal(result.metrics.mappingRate, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.readiness, 'ready');
    assert.equal(result.metrics.meanPredictedSuccess, 0.5);
    assert.equal(result.metrics.brierScore, 0.25);

    const rec1 = result.recommendations.find((row) => row.recommendationId === 'rec-1');
    const rec2 = result.recommendations.find((row) => row.recommendationId === 'rec-2');
    assert.ok(rec1);
    assert.ok(rec2);
    assert.equal(rec1?.predictedSuccessProbability, 0.5);
    assert.equal(rec1?.outcomes, 2);
    assert.equal(rec2?.predictedSuccessProbability, 0.5);
});

test('evaluateRecommendations preserves confidence envelope diagnostics when no terminal outcomes exist', () => {
    const result = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.4 }],
        [
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { status: 'awaiting_approval' }
        ]
    );

    assert.equal(result.metrics.totalOutcomes, 2);
    assert.equal(result.metrics.terminalOutcomes, 0);
    assert.equal(result.metrics.nonTerminalOutcomes, 2);
    assert.equal(result.metrics.calibrationDiagnostics?.readiness, 'no_terminal_outcomes');
    assert.equal(result.metrics.calibrationDiagnostics?.reasonCode, 'no_terminal_outcomes');
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /calibration_readiness=no_terminal_outcomes; reason_code=no_terminal_outcomes; terminal_outcomes=0; eligible_terminal_outcomes=0; mapped_outcomes=0;/
    );
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /readiness_flags\(sample_size_ready=false,mapping_rate_ready=false,sample_size_shortfall=3,mapping_rate_shortfall=0\.35,[^)]*\)/
    );
    assert.equal(result.metrics.calibrationDiagnostics?.observedTerminalOutcomes, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.observedEligibleTerminalOutcomes, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappedOutcomes, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.observedSampleSize, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappingRate, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isSampleSizeReady, false);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isMappingRateReady, false);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.sampleSizeShortfall, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappingRateShortfall, 0.35);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.minimumMappedOutcomesForMappingRate, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappedOutcomesRateShortfall, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.sampleSize, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.method, 'hoeffding');
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.predictedSuccessMean, null);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessMean, null);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapLowerBound, null);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapUpperBound, null);
});

test('evaluateRecommendations suppresses calibration metrics for sparse mapped samples', () => {
    const result = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 1 }],
        [
            { recommendationId: 'r1', status: 'failed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'failed' }
        ]
    );

    assert.equal(result.metrics.totalOutcomes, 10);
    assert.equal(result.metrics.terminalOutcomes, 10);
    assert.equal(result.metrics.mappedOutcomes, 1);
    assert.equal(result.metrics.calibrationSampleSize, 1);
    assert.equal(result.metrics.meanPredictedSuccess, null);
    assert.equal(result.metrics.brierScore, null);
    assert.equal(result.metrics.calibrationGap, null);
    assert.equal(result.metrics.calibrationDiagnostics?.readiness, 'insufficient_sample_size');
    assert.equal(result.metrics.calibrationDiagnostics?.reasonCode, 'insufficient_sample_size_and_mapping_rate');
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /calibration_readiness=insufficient_sample_size; reason_code=insufficient_sample_size_and_mapping_rate; terminal_outcomes=10; eligible_terminal_outcomes=1; mapped_outcomes=1;/
    );
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /readiness_flags\(sample_size_ready=false,mapping_rate_ready=false,sample_size_shortfall=2,mapping_rate_shortfall=0\.25,[^)]*\)/
    );
    assert.equal(result.metrics.calibrationDiagnostics?.observedTerminalOutcomes, 10);
    assert.equal(result.metrics.calibrationDiagnostics?.observedEligibleTerminalOutcomes, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappedOutcomes, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.observedSampleSize, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappingRate, 0.1);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isSampleSizeReady, false);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isMappingRateReady, false);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.sampleSizeShortfall, 2);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappingRateShortfall, 0.25);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.minimumMappedOutcomesForMappingRate, 4);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappedOutcomesRateShortfall, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.sampleSize, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.predictedSuccessMean, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessMean, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessLowerBound, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessUpperBound, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapLowerBound, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapUpperBound, 1);
});

test('evaluateRecommendations keeps calibration gated until mapped coverage over terminal outcomes clears threshold', () => {
    const result = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.7 }],
        [
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'failed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'failed' }
        ]
    );

    assert.equal(result.metrics.totalOutcomes, 10);
    assert.equal(result.metrics.terminalOutcomes, 10);
    assert.equal(result.metrics.eligibleTerminalOutcomes, 3);
    assert.equal(result.metrics.mappedOutcomes, 3);
    assert.equal(result.metrics.mappingRate, 0.3);
    assert.equal(result.metrics.calibrationSampleSize, 3);
    assert.equal(result.metrics.meanPredictedSuccess, null);
    assert.equal(result.metrics.brierScore, null);
    assert.equal(result.metrics.calibrationGap, null);
    assert.equal(result.metrics.calibrationDiagnostics?.readiness, 'insufficient_mapping_rate');
    assert.equal(result.metrics.calibrationDiagnostics?.reasonCode, 'insufficient_mapping_rate');
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /calibration_readiness=insufficient_mapping_rate; reason_code=insufficient_mapping_rate; terminal_outcomes=10; eligible_terminal_outcomes=3; mapped_outcomes=3;/
    );
    assert.match(
        result.metrics.calibrationDiagnostics?.reason ?? '',
        /readiness_flags\(sample_size_ready=true,mapping_rate_ready=false,sample_size_shortfall=0,mapping_rate_shortfall=0\.05,[^)]*\)/
    );
    assert.equal(result.metrics.calibrationDiagnostics?.observedTerminalOutcomes, 10);
    assert.equal(result.metrics.calibrationDiagnostics?.observedEligibleTerminalOutcomes, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappedOutcomes, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.observedSampleSize, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.observedMappingRate, 0.3);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isSampleSizeReady, true);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isMappingRateReady, false);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.sampleSizeShortfall, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappingRateShortfall, 0.05);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.minimumMappedOutcomesForMappingRate, 4);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappedOutcomesRateShortfall, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.sampleSize, 3);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.predictedSuccessMean, 0.7);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessMean, 0.6667);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessLowerBound, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.observedSuccessUpperBound, 1);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapLowerBound, 0);
    assert.equal(result.metrics.calibrationDiagnostics?.confidenceEnvelope?.calibrationGapUpperBound, 0.7);
});

test('evaluateRecommendations promotes readiness once mapped terminal coverage clears minimum rate', () => {
    const result = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.7 }],
        [
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { status: 'completed' },
            { status: 'failed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'failed' }
        ]
    );

    assert.equal(result.metrics.terminalOutcomes, 10);
    assert.equal(result.metrics.mappedOutcomes, 4);
    assert.equal(result.metrics.mappingRate, 0.4);
    assert.equal(result.metrics.calibrationDiagnostics?.readiness, 'ready');
    assert.equal(result.metrics.calibrationDiagnostics?.reasonCode, 'ready');
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isSampleSizeReady, true);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.isMappingRateReady, true);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.minimumMappedOutcomesForMappingRate, 4);
    assert.equal(result.metrics.calibrationDiagnostics?.sampleReadiness.mappedOutcomesRateShortfall, 0);
    assert.equal(result.metrics.meanPredictedSuccess, 0.7);
    assert.equal(result.metrics.brierScore, 0.19);
    assert.equal(result.metrics.calibrationGap, 0.05);
});

test('evaluateRecommendations keeps sparse-sample diagnostics stable across reruns', () => {
    const predictions = [{ recommendationId: 'r1', confidence: 1 }];

    const first = evaluateRecommendations(
        predictions,
        [
            { taskId: 't1', recommendationId: 'r1', status: 'failed' },
            { taskId: 't2', status: 'completed' },
            { taskId: 't3', status: 'completed' },
            { taskId: 't4', status: 'completed' },
            { taskId: 't5', status: 'completed' },
            { taskId: 't6', status: 'completed' },
            { taskId: 't7', status: 'completed' },
            { taskId: 't8', status: 'completed' },
            { taskId: 't9', status: 'completed' },
            { taskId: 't10', status: 'completed' }
        ]
    );

    const second = evaluateRecommendations(
        predictions,
        [
            { taskId: 't10', status: 'completed' },
            { taskId: 't1', recommendationId: 'r1', status: 'failed' },
            { taskId: 't9', status: 'completed' },
            { taskId: 't8', status: 'completed' },
            { taskId: 't7', status: 'completed' },
            { taskId: 't6', status: 'completed' },
            { taskId: 't5', status: 'completed' },
            { taskId: 't4', status: 'completed' },
            { taskId: 't3', status: 'completed' },
            { taskId: 't2', status: 'completed' }
        ]
    );

    assert.deepEqual(first.metrics.calibrationDiagnostics, second.metrics.calibrationDiagnostics);
    assert.equal(first.metrics.calibrationDiagnostics?.reason, second.metrics.calibrationDiagnostics?.reason);
});

test('evaluateRecommendations excludes awaiting approval outcomes from fail-rate math', () => {
    const result = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.7 }],
        [
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'completed' }
        ]
    );

    assert.equal(result.metrics.totalOutcomes, 2);
    assert.equal(result.metrics.terminalOutcomes, 1);
    assert.equal(result.metrics.nonTerminalOutcomes, 1);
    assert.equal(result.metrics.successfulOutcomes, 1);
    assert.equal(result.metrics.failedOutcomes, 0);
    assert.equal(result.metrics.successRate, 1);
});


test('tuneThresholds keeps promotion gates stable when calibration evidence is sparse', () => {
    const evaluation = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.9 }],
        [
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'failed' }
        ]
    );

    assert.equal(evaluation.metrics.totalOutcomes, 10);
    assert.equal(evaluation.metrics.mappedOutcomes, 2);

    const tuned = tuneThresholds(evaluation);

    assert.equal(tuned.changes.length, 0);
    assert.equal(tuned.thresholds.confidenceFloor, DEFAULT_THRESHOLDS.confidenceFloor);
    assert.equal(tuned.thresholds.promotionSuccessRate, DEFAULT_THRESHOLDS.promotionSuccessRate);
});

test('tuneThresholds relaxes quality gates with healthy, sufficient calibration evidence', () => {
    const evaluation = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.9 }],
        [
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'completed' },
            { recommendationId: 'r1', status: 'failed' }
        ]
    );

    const tuned = tuneThresholds(evaluation);

    assert.deepEqual(tuned.changes.map((change) => change.field), [
        'confidenceFloor',
        'promotionSuccessRate'
    ]);
    assert.equal(tuned.thresholds.confidenceFloor, 0.58);
    assert.equal(tuned.thresholds.promotionSuccessRate, 0.84);
});

test('tuneThresholds skips calibration penalties when mapped evidence is too small', () => {
    const evaluation = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 1 }],
        [
            { recommendationId: 'r1', status: 'failed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'failed' }
        ]
    );

    assert.equal(evaluation.metrics.calibrationSampleSize, 1);
    assert.equal(evaluation.metrics.brierScore, null);
    assert.equal(evaluation.metrics.calibrationGap, null);

    const tuned = tuneThresholds(evaluation);

    assert.equal(tuned.changes.length, 0);
    assert.equal(tuned.thresholds.maxBrierScore, DEFAULT_THRESHOLDS.maxBrierScore);
    assert.equal(tuned.thresholds.maxCalibrationGap, DEFAULT_THRESHOLDS.maxCalibrationGap);
});

test('tuneThresholds relaxes quality gates when sparse mapping still meets legacy mapped-outcome floor', () => {
    const evaluation = {
        generatedAt: '2026-03-01T00:00:00.000Z',
        metrics: {
            totalOutcomes: 40,
            terminalOutcomes: 40,
            nonTerminalOutcomes: 0,
            successfulOutcomes: 38,
            failedOutcomes: 2,
            successRate: 0.95,
            mappedOutcomes: 8,
            mappingRate: 0.2,
            calibrationSampleSize: 8,
            averageAttempts: 1,
            averageLatencyMs: 0,
            meanPredictedSuccess: 0.92,
            brierScore: 0.04,
            calibrationGap: 0.03
        },
        recommendations: []
    } as EvaluatorResult;

    const tuned = tuneThresholds(evaluation);

    assert.deepEqual(tuned.changes.map((change) => change.field), [
        'confidenceFloor',
        'promotionSuccessRate'
    ]);
    assert.equal(tuned.thresholds.confidenceFloor, 0.58);
    assert.equal(tuned.thresholds.promotionSuccessRate, 0.84);
});


test('tuneThresholds currently keys relaxation on mapped outcomes, not calibrationSampleSize', () => {
    const evaluation = {
        generatedAt: '2026-03-01T00:00:00.000Z',
        metrics: {
            totalOutcomes: 40,
            terminalOutcomes: 40,
            nonTerminalOutcomes: 0,
            successfulOutcomes: 38,
            failedOutcomes: 2,
            successRate: 0.95,
            mappedOutcomes: 20,
            mappingRate: 0.5,
            calibrationSampleSize: 2,
            averageAttempts: 1,
            averageLatencyMs: 0,
            meanPredictedSuccess: 0.92,
            brierScore: 0.04,
            calibrationGap: 0.03
        },
        recommendations: []
    } as EvaluatorResult;

    const tuned = tuneThresholds(evaluation);

    assert.deepEqual(tuned.changes.map((change) => change.field), [
        'confidenceFloor',
        'promotionSuccessRate'
    ]);
    assert.equal(tuned.thresholds.confidenceFloor, 0.58);
    assert.equal(tuned.thresholds.promotionSuccessRate, 0.84);
});

test('tuneThresholds still tightens quality gates for weak execution success', () => {
    const evaluation = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.6 }],
        [
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'failed' },
            { status: 'failed' },
            { status: 'failed' },
            { status: 'failed' },
            { status: 'failed' },
            { status: 'failed' }
        ]
    );

    const tuned = tuneThresholds(evaluation);

    assert.deepEqual(tuned.changes.map((change) => change.field), [
        'confidenceFloor',
        'promotionSuccessRate'
    ]);
    assert.equal(tuned.thresholds.confidenceFloor, 0.63);
    assert.equal(tuned.thresholds.promotionSuccessRate, 0.87);
});

test('evaluateRecommendations keeps terminal metrics deterministic when non-terminal outcomes dominate', () => {
    const result = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.2 }],
        [
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' }
        ]
    );

    assert.equal(result.metrics.totalOutcomes, 10);
    assert.equal(result.metrics.terminalOutcomes, 2);
    assert.equal(result.metrics.nonTerminalOutcomes, 8);
    assert.equal(result.metrics.mappedOutcomes, 2);
    assert.equal(result.metrics.mappingRate, 1);
    assert.equal(result.metrics.successRate, 0);
});

test('tuneThresholds keeps quality gates stable when terminal sample size is below minimum', () => {
    const evaluation = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.1 }],
        [
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' }
        ]
    );

    assert.equal(evaluation.metrics.totalOutcomes, 12);
    assert.equal(evaluation.metrics.terminalOutcomes, 2);
    assert.equal(evaluation.metrics.nonTerminalOutcomes, 10);

    const tuned = tuneThresholds(evaluation);

    assert.equal(tuned.changes.length, 0);
    assert.equal(tuned.thresholds.confidenceFloor, DEFAULT_THRESHOLDS.confidenceFloor);
    assert.equal(tuned.thresholds.promotionSuccessRate, DEFAULT_THRESHOLDS.promotionSuccessRate);
});

test('tuneThresholds applies weak-success tightening when explicit min sample allows tiny windows', () => {
    const evaluation = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.2 }],
        [
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' }
        ]
    );

    const tuned = tuneThresholds(evaluation, { minSampleSize: 1 });

    assert.equal(evaluation.metrics.terminalOutcomes, 4);
    assert.deepEqual(tuned.changes.map((change) => change.field), [
        'confidenceFloor',
        'promotionSuccessRate'
    ]);
    assert.equal(tuned.thresholds.confidenceFloor, 0.63);
    assert.equal(tuned.thresholds.promotionSuccessRate, 0.87);
});

test('tuneThresholds can still tighten when minSampleSize is satisfied despite non-terminal dominance', () => {
    const evaluation = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.2 }],
        [
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' }
        ]
    );

    const tuned = tuneThresholds(evaluation, { minSampleSize: 5 });

    assert.equal(evaluation.metrics.terminalOutcomes, 6);
    assert.equal(evaluation.metrics.totalOutcomes, 20);
    assert.deepEqual(tuned.changes.map((change) => change.field), [
        'confidenceFloor',
        'promotionSuccessRate'
    ]);
    assert.equal(tuned.thresholds.confidenceFloor, 0.63);
    assert.equal(tuned.thresholds.promotionSuccessRate, 0.87);
});

test('tuneThresholds derives terminal sample size from total-minus-non-terminal for legacy metrics', () => {
    const evaluation = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.1 }],
        [
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'failed' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' },
            { recommendationId: 'r1', status: 'awaiting_approval' }
        ]
    );

    const legacyEvaluation = {
        ...evaluation,
        metrics: {
            ...evaluation.metrics
        }
    } as unknown as EvaluatorResult;

    delete (legacyEvaluation.metrics as unknown as { terminalOutcomes?: number }).terminalOutcomes;

    const tuned = tuneThresholds(legacyEvaluation);

    assert.equal(tuned.changes.length, 0);
    assert.equal(tuned.thresholds.confidenceFloor, DEFAULT_THRESHOLDS.confidenceFloor);
    assert.equal(tuned.thresholds.promotionSuccessRate, DEFAULT_THRESHOLDS.promotionSuccessRate);
});

test('evaluateRecommendations resolves duplicate task paths deterministically in sparse windows', () => {
    const predictions = [{ recommendationId: 'r1', confidence: 0.8 }];

    const first = evaluateRecommendations(
        predictions,
        [
            { taskId: 'task-1', recommendationId: 'r1', status: 'awaiting_approval', createdAt: 0, closedAt: 10 },
            { taskId: 'task-1', recommendationId: 'r1', status: 'completed', createdAt: 0, closedAt: 100 },
            { taskId: 'task-2', recommendationId: 'r1', status: 'awaiting_approval' },
            { taskId: 'task-2', recommendationId: 'r1', status: 'awaiting_approval' }
        ],
        '2026-03-01T00:00:00.000Z'
    );

    const second = evaluateRecommendations(
        predictions,
        [
            { taskId: 'task-2', recommendationId: 'r1', status: 'awaiting_approval' },
            { taskId: 'task-1', recommendationId: 'r1', status: 'completed', createdAt: 0, closedAt: 100 },
            { taskId: 'task-2', recommendationId: 'r1', status: 'awaiting_approval' },
            { taskId: 'task-1', recommendationId: 'r1', status: 'awaiting_approval', createdAt: 0, closedAt: 10 }
        ],
        '2026-03-01T00:00:00.000Z'
    );

    assert.deepEqual(first, second);
    assert.equal(first.metrics.totalOutcomes, 2);
    assert.equal(first.metrics.terminalOutcomes, 1);
    assert.equal(first.metrics.nonTerminalOutcomes, 1);
    assert.equal(first.metrics.mappedOutcomes, 1);
    assert.equal(first.metrics.successRate, 1);
});

test('evaluateRecommendations preserves recommendation mapping when terminal row omits recommendation id', () => {
    const result = evaluateRecommendations(
        [{ recommendationId: 'r1', confidence: 0.2 }],
        [
            { taskId: 'task-3', recommendationId: 'r1', status: 'awaiting_approval' },
            { taskId: 'task-3', status: 'failed' }
        ]
    );

    assert.equal(result.metrics.totalOutcomes, 1);
    assert.equal(result.metrics.terminalOutcomes, 1);
    assert.equal(result.metrics.mappedOutcomes, 1);

    const recommendation = result.recommendations.find((item) => item.recommendationId === 'r1');
    assert.ok(recommendation);
    assert.equal(recommendation?.outcomes, 1);
    assert.equal(recommendation?.failures, 1);
});
