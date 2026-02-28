import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRecommendations } from '../../src/learning/evaluator.js';
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
    assert.equal(result.recommendations.length, 2);

    const top = result.recommendations[0];
    assert.equal(top.recommendationId, 'r2');
    assert.equal(top.successRate, 1);

    assert.ok(result.metrics.brierScore !== null);
    assert.ok(result.metrics.calibrationGap !== null);
});

test('evaluateRecommendations handles empty mappings safely', () => {
    const result = evaluateRecommendations([], [{ status: 'failed' }]);

    assert.equal(result.metrics.totalOutcomes, 1);
    assert.equal(result.metrics.mappedOutcomes, 0);
    assert.equal(result.metrics.brierScore, null);
    assert.equal(result.metrics.calibrationGap, null);
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

    assert.equal(evaluation.metrics.brierScore, 1);
    assert.equal(evaluation.metrics.calibrationGap, 1);

    const tuned = tuneThresholds(evaluation);

    assert.equal(tuned.changes.length, 0);
    assert.equal(tuned.thresholds.maxBrierScore, DEFAULT_THRESHOLDS.maxBrierScore);
    assert.equal(tuned.thresholds.maxCalibrationGap, DEFAULT_THRESHOLDS.maxCalibrationGap);
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
