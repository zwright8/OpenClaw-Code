import test from 'node:test';
import assert from 'node:assert/strict';
import {
    __learningLoopInternals,
    buildLearningRecommendations,
    evaluateLearningLoop,
    runCounterfactualReplay,
    simulateAdaptivePolicySelection,
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
    assert.equal(result.summary.latencyPercentiles.p95, 158);
    assert.ok(result.summary.byAgent['agent:a']);
    assert.ok(result.summary.byAgent['agent:b']);
    assert.ok(result.summary.byAgent['agent:a'].successRateLower95 < result.summary.byAgent['agent:a'].successRate);
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
    const adaptive = simulateAdaptivePolicySelection(replay, {
        seed: 42,
        episodes: 30,
        trialsPerEpisode: 10
    });
    const recommendations = buildLearningRecommendations(summary, replay, null, {
        minTimeoutRateForAction: 0.05,
        minAgentSuccessRate: 0.8,
        maxAvgAttempts: 1.1
    });

    const recommendationsWithAdaptive = buildLearningRecommendations(summary, replay, adaptive, {
        minTimeoutRateForAction: 0.05,
        minAgentSuccessRate: 0.8,
        maxAvgAttempts: 1.1
    });

    assert.ok(recommendations.length > 0);
    assert.ok(recommendations.some((item) => item.category === 'timeout_resilience'));
    assert.ok(recommendations.some((item) => item.category === 'counterfactual_winner'));
    assert.ok(recommendationsWithAdaptive.some((item) => item.category === 'adaptive_policy_selection'));
});

test('simulateAdaptivePolicySelection converges toward stronger policy', () => {
    const summary = summarizeOutcomes(sampleOutcomes());
    const replay = runCounterfactualReplay(summary, [
        {
            id: 'weak',
            name: 'Weak',
            timeoutRecoveryRate: 0,
            retryRecoveryRate: 0,
            routingRecoveryRate: 0
        },
        {
            id: 'strong',
            name: 'Strong',
            timeoutRecoveryRate: 0.8,
            retryRecoveryRate: 0.4,
            routingRecoveryRate: 0.4
        }
    ]);

    const adaptive = simulateAdaptivePolicySelection(replay, {
        seed: 9,
        episodes: 80,
        trialsPerEpisode: 8
    });

    assert.equal(adaptive.recommendedArm?.id, 'strong');
    assert.ok(adaptive.ranking[0].selectionRate > adaptive.ranking[1].selectionRate);
});

test('buildLearningRecommendations ignores low sample routing noise and flags tail latency', () => {
    const outcomes = [
        ...sampleOutcomes(),
        { taskId: '6', target: 'agent:c', status: 'failed', attempts: 1, createdAt: 600, closedAt: 1800, request: { priority: 'normal' } }
    ];
    const summary = summarizeOutcomes(outcomes);
    const replay = runCounterfactualReplay(summary);
    const recommendations = buildLearningRecommendations(summary, replay, null, {
        minTimeoutRateForAction: 0.05,
        minAgentSuccessRate: 0.8,
        maxAvgAttempts: 1.1,
        minAgentSamplesForAction: 2,
        minP95LatencyMsForAction: 200
    });

    assert.ok(recommendations.some((item) => item.category === 'tail_latency'));
    assert.ok(!recommendations.some((item) => item.title.includes('agent:c')));
});

test('evaluateLearningLoop bundles summary, replay, and recommendations', () => {
    const result = evaluateLearningLoop(sampleOutcomes(), {
        adaptiveRollout: {
            seed: 123
        }
    });

    assert.ok(result.summary);
    assert.ok(result.replay.best);
    assert.ok(result.adaptiveRollout.recommendedArm);
    assert.ok(Array.isArray(result.recommendations));
    assert.ok(result.recommendations.length > 0);
});

test('learning-loop internals expose stable statistical helpers', () => {
    const p = __learningLoopInternals.latencyPercentiles([100, 200, 300, 400, 500]);
    assert.equal(p.p50, 300);
    assert.equal(p.p95, 480);

    const lower = __learningLoopInternals.wilsonLowerBound(8, 10);
    assert.ok(lower > 0.49 && lower < 0.8);
});
