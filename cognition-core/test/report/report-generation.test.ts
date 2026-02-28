import test from 'node:test';
import assert from 'node:assert/strict';
import { runFeedbackLoop } from '../../src/learning/feedback-loop.js';
import { buildScoreboard } from '../../src/report/scoreboard.js';
import { buildDailyJsonReport } from '../../src/report/json.js';
import { renderDailyMarkdownReport } from '../../src/report/markdown.js';
import { buildDeterministicBenchmarkDeltas } from '../../scripts/productivity-scorecard.js';
import { buildRemediationTaskArtifacts } from '../../scripts/plan-remediation-tasks.js';

test('daily report builders produce JSON and markdown artifacts', () => {
    const loop = runFeedbackLoop(
        [
            { recommendationId: 'rec-1', owner: 'agent:a', confidence: 0.8 },
            { recommendationId: 'rec-2', owner: 'agent:b', confidence: 0.7 }
        ],
        [
            { taskId: 't1', recommendationId: 'rec-1', status: 'completed' },
            { taskId: 't2', recommendationId: 'rec-2', status: 'failed' }
        ],
        {
            generatedAt: '2026-02-28T00:00:00.000Z',
            thresholds: { minSampleSize: 1 }
        }
    );

    const scoreboard = buildScoreboard(loop);
    const report = buildDailyJsonReport(loop, scoreboard, {
        evaluationStatePath: 'skills/state/cognition-evaluation.json',
        jsonReportPath: 'cognition-core/reports/cognition-daily.json',
        markdownReportPath: 'cognition-core/reports/cognition-daily.md'
    });

    const markdown = renderDailyMarkdownReport(report);

    assert.equal(report.generatedAt, '2026-02-28T00:00:00.000Z');
    assert.equal(report.summary.outcomes, 2);
    assert.ok(Array.isArray(report.scoreboard.rows));
    assert.ok(markdown.includes('# Cognition Daily Report'));
    assert.ok(markdown.includes('## Scoreboard'));
    assert.ok(markdown.includes('skills/state/cognition-evaluation.json'));
});

test('scorecard benchmark deltas are deterministic and comparator-aware', () => {
    const actuals = {
        productivityIndex: 80,
        cycleTimeSec: 150,
        automationCoverage: 72.5,
        cognitionSuccessRate: 55,
        swarmSimSuccessRate: 78,
        skillUtilityComposite: 84
    };

    const first = buildDeterministicBenchmarkDeltas(actuals);
    const second = buildDeterministicBenchmarkDeltas(actuals);

    assert.deepEqual(first, second);

    assert.deepEqual(first.productivityIndex, {
        before: 75,
        after: 80,
        delta: 5
    });

    assert.deepEqual(first.cycleTimeSec, {
        before: 120,
        after: 150,
        delta: -30
    });

    assert.deepEqual(first.automationCoverage, {
        before: 70,
        after: 72.5,
        delta: 2.5
    });
});

test('remediation artifact bundle maps breached metrics to explicit tasks', () => {
    const sourceReport = '/tmp/productivity-scorecard.latest.json';
    const bundle = buildRemediationTaskArtifacts(
        {
            generatedAt: '2026-02-28T08:00:00.000Z',
            thresholdBreaches: [
                {
                    metric: 'automationCoverage',
                    priority: 'P1',
                    threshold: 70,
                    actual: 54,
                    gap: 16,
                    comparison: 'gte',
                    title: 'Increase automation coverage',
                    rationale: 'below threshold',
                    action: 'reduce manual steps'
                },
                {
                    metric: 'cognitionSuccessRate',
                    priority: 'P2',
                    threshold: 60,
                    actual: 50,
                    gap: 10,
                    comparison: 'gte',
                    title: 'Improve cognition outcome success',
                    rationale: 'below threshold',
                    action: 'retune evaluator'
                }
            ],
            remediationPlan: [
                {
                    metric: 'automationCoverage',
                    priority: 'P1',
                    title: 'Increase automation coverage',
                    rationale: 'below threshold',
                    action: 'reduce manual steps'
                },
                {
                    metric: 'cognitionSuccessRate',
                    priority: 'P2',
                    title: 'Improve cognition outcome success',
                    rationale: 'below threshold',
                    action: 'retune evaluator'
                }
            ]
        },
        {
            reportPath: sourceReport,
            fromAgentId: 'agent:test',
            defaultTarget: 'agent:ops'
        }
    );

    assert.equal(bundle.count, 2);
    assert.equal(bundle.tasks.length, 2);
    assert.equal(bundle.artifacts.length, 2);
    assert.equal(bundle.artifacts[0].metric, 'automationCoverage');
    assert.equal(bundle.artifacts[0].sourceReport, sourceReport);
    assert.ok(bundle.artifacts[0].taskId);
    assert.ok(bundle.artifacts[0].task.includes('Increase automation coverage'));
    assert.equal(bundle.artifacts[1].metric, 'cognitionSuccessRate');
});
