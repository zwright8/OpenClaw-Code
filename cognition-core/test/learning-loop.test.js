import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildLearningRecommendations,
    evaluateLearningLoop,
    runCounterfactualReplay,
    summarizeOutcomes
} from '../src/learning-loop.js';

function sampleOutcomes() {
    return [
        { taskId: '1', target: 'agent:a', status: 'completed', attempts: 1, createdAt: 100, closedAt: 160, request: { priority: 'high' } },
        { taskId: '2', target: 'agent:a', status: 'timed_out', attempts: 2, createdAt: 200, closedAt: 360, request: { priority: 'high' } },
        { taskId: '3', target: 'agent:b', status: 'failed', attempts: 2, createdAt: 300, closedAt: 450, request: { priority: 'normal' } },
        { taskId: '4', target: 'agent:b', status: 'rejected', attempts: 1, createdAt: 400, closedAt: 470, request: { priority: 'critical' } },
        { taskId: '5', target: 'agent:a', status: 'completed', attempts: 1, createdAt: 500, closedAt: 560, request: { priority: 'normal' } }
    ];
}

test('summarizeOutcomes builds aggregate and per-agent metrics', () => {
    const result = summarizeOutcomes(sampleOutcomes());

    assert.equal(result.summary.total, 5);
    assert.equal(result.summary.success, 2);
    assert.equal(result.summary.timedOut, 1);
    assert.equal(result.summary.failure, 3);
    assert.equal(result.summary.successRate, 0.4);
    assert.ok(result.summary.byAgent['agent:a']);
    assert.ok(result.summary.byAgent['agent:b']);
});

test('runCounterfactualReplay ranks variants by projected gain', () => {
    const summary = summarizeOutcomes(sampleOutcomes());
    const replay = runCounterfactualReplay(summary, [
        {
            id: 'small',
            name: 'Small improvements',
            timeoutRecoveryRate: 0.1,
            retryRecoveryRate: 0.05,
            routingRecoveryRate: 0.05
        },
        {
            id: 'large',
            name: 'Large improvements',
            timeoutRecoveryRate: 0.7,
            retryRecoveryRate: 0.3,
            routingRecoveryRate: 0.3
        }
    ]);

    assert.equal(replay.runs.length, 2);
    assert.equal(replay.runs[0].id, 'large');
    assert.ok(replay.runs[0].deltaSuccessRate >= replay.runs[1].deltaSuccessRate);
});

test('buildLearningRecommendations emits prioritized actions', () => {
    const summary = summarizeOutcomes(sampleOutcomes());
    const replay = runCounterfactualReplay(summary);
    const recommendations = buildLearningRecommendations(summary, replay, {
        minTimeoutRateForAction: 0.05,
        minAgentSuccessRate: 0.8,
        maxAvgAttempts: 1.1
    });

    assert.ok(recommendations.length > 0);
    assert.ok(recommendations.some((item) => item.category === 'timeout_resilience'));
    assert.ok(recommendations.some((item) => item.category === 'counterfactual_winner'));
});

test('evaluateLearningLoop bundles summary, replay, and recommendations', () => {
    const result = evaluateLearningLoop(sampleOutcomes());

    assert.ok(result.summary);
    assert.ok(result.replay.best);
    assert.ok(Array.isArray(result.recommendations));
    assert.ok(result.recommendations.length > 0);
});

