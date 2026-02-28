import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRecommendations } from '../../src/learning/evaluator.js';

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
