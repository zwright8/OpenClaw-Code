import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildErrorTaxonomy,
    buildSkillGrowthPlan,
    buildLearningRecommendations,
    evaluateLearningLoop,
    runCounterfactualReplay,
    summarizeOutcomes,
    updateLearningState
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

test('summarizeOutcomes tracks trace and evidence coverage', () => {
    const result = summarizeOutcomes([
        {
            taskId: '1',
            target: 'agent:a',
            status: 'completed',
            traceId: 'trace-1',
            evidence: [{ type: 'tool_call' }],
            traceEvents: [
                { type: 'tool_call', name: 'shell.exec' },
                { type: 'guardrail_check', name: 'policy' }
            ]
        },
        {
            taskId: '2',
            target: 'agent:b',
            status: 'failed',
            context: { traceId: 'trace-2' },
            lastError: { code: 'tool_timeout', message: 'tool timed out' },
            result: {
                traceEvents: [
                    { kind: 'handoff', name: 'debugger' }
                ]
            }
        },
        {
            taskId: '3',
            target: 'agent:c',
            status: 'failed'
        }
    ]);

    assert.equal(result.summary.observability.traced, 2);
    assert.equal(result.summary.observability.evidenceBacked, 2);
    assert.equal(result.summary.observability.replayableTraces, 2);
    assert.equal(result.summary.observability.failuresWithTrace, 1);
    assert.equal(result.summary.observability.failuresWithErrorDetail, 1);
    assert.equal(result.summary.observability.traceEventBacked, 2);
    assert.equal(result.summary.observability.toolTraceBacked, 1);
    assert.equal(result.summary.observability.guardrailTraceBacked, 1);
    assert.equal(result.summary.observability.handoffTraceBacked, 1);
    assert.equal(result.summary.traceCoverage, 0.6667);
    assert.equal(result.summary.evidenceCoverage, 0.6667);
    assert.equal(result.summary.replayableTraceCoverage, 0.6667);
    assert.equal(result.summary.failureTraceCoverage, 0.5);
    assert.equal(result.summary.failureErrorDetailCoverage, 0.5);
    assert.equal(result.summary.traceEventCoverage, 0.6667);
    assert.equal(result.summary.toolTraceCoverage, 0.3333);
    assert.equal(result.summary.guardrailTraceCoverage, 0.3333);
    assert.equal(result.summary.handoffTraceCoverage, 0.3333);
});

test('summarizeOutcomes recognizes OpenAI and OTel GenAI span shapes', () => {
    const result = summarizeOutcomes([
        {
            taskId: '1',
            target: 'agent:a',
            status: 'completed',
            spans: [
                {
                    trace_id: 'trace-openai-1',
                    span_data: { type: 'function', name: 'shell.exec' }
                },
                {
                    trace_id: 'trace-openai-1',
                    span_data: { type: 'guardrail', name: 'policy_check' }
                },
                {
                    trace_id: 'trace-openai-1',
                    span_data: { type: 'handoff', name: 'debugger' }
                }
            ]
        },
        {
            taskId: '2',
            target: 'agent:b',
            status: 'completed',
            result: {
                spans: [
                    {
                        traceID: 'trace-otel-1',
                        attributes: {
                            'gen_ai.operation.name': 'execute_tool',
                            'gen_ai.tool.name': 'query_database'
                        }
                    }
                ]
            }
        }
    ]);

    assert.equal(result.summary.observability.traced, 2);
    assert.equal(result.summary.observability.traceEventBacked, 2);
    assert.equal(result.summary.observability.toolTraceBacked, 2);
    assert.equal(result.summary.observability.guardrailTraceBacked, 1);
    assert.equal(result.summary.observability.handoffTraceBacked, 1);
    assert.equal(result.summary.traceCoverage, 1);
    assert.equal(result.summary.toolTraceCoverage, 1);
    assert.equal(result.summary.guardrailTraceCoverage, 0.5);
    assert.equal(result.summary.handoffTraceCoverage, 0.5);
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

test('buildErrorTaxonomy extracts failure categories and recurring signatures', () => {
    const summary = summarizeOutcomes([
        ...sampleOutcomes(),
        { taskId: '6', target: 'agent:a', status: 'timed_out', attempts: 2, createdAt: 600, closedAt: 700, request: { priority: 'high' } }
    ]);
    const taxonomy = buildErrorTaxonomy(summary);

    assert.equal(taxonomy.totalFailures, 4);
    assert.ok(taxonomy.categories.some((item) => item.category === 'timeout'));
    assert.ok(taxonomy.recurringSignatures >= 1);
    assert.ok(taxonomy.topSignatures.length > 0);
});

test('buildSkillGrowthPlan maps failure pressure to focus areas and skill candidates', () => {
    const summary = summarizeOutcomes([
        { taskId: '1', target: 'agent:a', status: 'timed_out', attempts: 2, request: { priority: 'critical' } },
        { taskId: '2', target: 'agent:b', status: 'timed_out', attempts: 2, request: { priority: 'high' } },
        { taskId: '3', target: 'agent:b', status: 'failed', attempts: 1, request: { priority: 'normal' } },
        { taskId: '4', target: 'agent:b', status: 'completed', attempts: 1, request: { priority: 'normal' } }
    ]);
    const taxonomy = buildErrorTaxonomy(summary);
    const plan = buildSkillGrowthPlan(summary, taxonomy, {
        skillCatalog: [
            { id: 1, name: 'u0015-epistemic-auto-retry-and-backoff-coordinator', archetype: 'general-capability' },
            { id: 2, name: 'u0016-epistemic-failure-root-cause-miner', archetype: 'general-capability' }
        ]
    });

    assert.ok(plan.focusAreas.length > 0);
    assert.ok(plan.topSkillCandidates.some((candidate) => candidate.name.includes('auto-retry')));
    assert.ok(plan.learningPressure > 0);
});

test('buildSkillGrowthPlan bootstraps telemetry focus when outcomes are empty', () => {
    const summary = summarizeOutcomes([]);
    const taxonomy = buildErrorTaxonomy(summary);
    const plan = buildSkillGrowthPlan(summary, taxonomy, {
        skillCatalog: [
            { id: 1, name: 'u0156-tooling-kpi-dashboard-publisher', archetype: 'general-capability' }
        ]
    });

    assert.ok(plan.focusAreas.some((area) => area.focus === 'outcome_telemetry_bootstrap'));
    assert.ok(plan.topSkillCandidates.length > 0);
    assert.ok(plan.learningPressure > 0);
});

test('updateLearningState increments run counters and tracks recurring error streaks', () => {
    const summary = summarizeOutcomes([
        { taskId: '1', target: 'agent:a', status: 'timed_out', attempts: 2, request: { priority: 'high' } },
        { taskId: '2', target: 'agent:a', status: 'timed_out', attempts: 2, request: { priority: 'high' } },
        { taskId: '3', target: 'agent:b', status: 'completed', attempts: 1, request: { priority: 'normal' } }
    ]);
    const taxonomy = buildErrorTaxonomy(summary);
    const skillGrowthPlan = buildSkillGrowthPlan(summary, taxonomy);
    const state1 = updateLearningState(null, { summary: summary.summary, taxonomy, skillGrowthPlan });
    const state2 = updateLearningState(state1, { summary: summary.summary, taxonomy, skillGrowthPlan });

    assert.equal(state1.runCount, 1);
    assert.equal(state2.runCount, 2);
    const recurring = Object.values(state2.recurringErrors);
    assert.ok(recurring.length > 0);
    assert.ok(recurring.some((item) => item.streak >= 2));
});

test('evaluateLearningLoop bundles summary, replay, and recommendations', () => {
    const result = evaluateLearningLoop(sampleOutcomes());

    assert.ok(result.summary);
    assert.ok(result.replay.best);
    assert.ok(Array.isArray(result.recommendations));
    assert.ok(result.recommendations.length > 0);
    assert.ok(result.errorTaxonomy);
    assert.ok(result.skillGrowthPlan);
    assert.ok(result.state);
    assert.equal(result.state.runCount, 1);
});
