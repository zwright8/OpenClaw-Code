import test from 'node:test';
import assert from 'node:assert/strict';
import { runFeedbackLoop } from '../../src/learning/feedback-loop.js';
import { buildScoreboard } from '../../src/report/scoreboard.js';
import { buildDailyJsonReport } from '../../src/report/json.js';
import { renderDailyMarkdownReport } from '../../src/report/markdown.js';
import { buildDeterministicBenchmarkDeltas, generateProductivityScorecard } from '../../scripts/productivity-scorecard.js';
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

test('productivity scorecard emits contract-safe generatedAt and deterministic threshold diagnostics', async () => {
    const first = await generateProductivityScorecard();
    const second = await generateProductivityScorecard();

    const year = Number(String(first.generatedAt).slice(0, 4));
    assert.ok(Number.isInteger(year));
    assert.ok(year >= 2024 && year <= 2100);
    assert.equal(first.generatedAt, second.generatedAt);
    assert.ok(first.thresholdChecks);
    assert.ok(first.freshness);
    assert.equal(first.generatedAt, first.freshness.freshestTimestamp);
    assert.match(first.freshness.generatedFrom, /source_timestamp|deterministic_fallback/);
    assert.ok(Array.isArray(first.freshness.sources));
    assert.ok(Array.isArray(first.freshness.missingSources));
    assert.deepEqual(first.thresholdChecks, second.thresholdChecks);
    assert.deepEqual(first.regressionGates, second.regressionGates);
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

test('scoreboard surfaces deterministic calibration suppression diagnostics', () => {
    const loop = runFeedbackLoop(
        [{ recommendationId: 'rec-1', owner: 'agent:a', confidence: 1 }],
        [
            { taskId: 't1', recommendationId: 'rec-1', status: 'failed' },
            { taskId: 't2', status: 'completed' },
            { taskId: 't3', status: 'completed' },
            { taskId: 't4', status: 'completed' },
            { taskId: 't5', status: 'completed' },
            { taskId: 't6', status: 'completed' },
            { taskId: 't7', status: 'completed' },
            { taskId: 't8', status: 'completed' },
            { taskId: 't9', status: 'completed' },
            { taskId: 't10', status: 'completed' }
        ],
        {
            generatedAt: '2026-03-01T00:00:00.000Z',
            thresholds: { minSampleSize: 1 }
        }
    );

    const scoreboard = buildScoreboard(loop);
    const brierRow = scoreboard.rows.find((row) => row.metric === 'brier_score');
    const calibrationRow = scoreboard.rows.find((row) => row.metric === 'calibration_gap');

    assert.ok(brierRow);
    assert.ok(calibrationRow);
    assert.equal(brierRow.status, 'n/a');
    assert.equal(calibrationRow.status, 'n/a');
    assert.match(
        brierRow.detail,
        /calibration_gate: readiness=insufficient_sample_size;mapped_outcomes=1;terminal_outcomes=10;mapping_rate=1;min_sample_size=3;min_mapping_rate=0\.35;sample_size_ready=false;mapping_rate_ready=true;sample_size_shortfall=2;mapping_rate_shortfall=0;reason=reason_code=insufficient_sample_size;terminal_outcomes=10;mapped_outcomes=1;mapping_rate=1;minimum_sample_size=3;minimum_mapping_rate=0\.35;sample_size_shortfall=2;mapping_rate_shortfall=0;readiness_flags\(sample_size_ready=false,mapping_rate_ready=true,sample_size_shortfall=2,mapping_rate_shortfall=0\)\./
    );
    assert.match(
        calibrationRow.detail,
        /calibration_gate: readiness=insufficient_sample_size;mapped_outcomes=1;terminal_outcomes=10;mapping_rate=1;min_sample_size=3;min_mapping_rate=0\.35;sample_size_ready=false;mapping_rate_ready=true;sample_size_shortfall=2;mapping_rate_shortfall=0;reason=reason_code=insufficient_sample_size;terminal_outcomes=10;mapped_outcomes=1;mapping_rate=1;minimum_sample_size=3;minimum_mapping_rate=0\.35;sample_size_shortfall=2;mapping_rate_shortfall=0;readiness_flags\(sample_size_ready=false,mapping_rate_ready=true,sample_size_shortfall=2,mapping_rate_shortfall=0\)\./
    );
    assert.match(brierRow.detail, /confidence_envelope: confidence_level=0\.95;method=hoeffding;sample_size=1;/);
    assert.match(calibrationRow.detail, /calibration_gap_lower=0;calibration_gap_upper=1\./);
    assert.doesNotMatch(brierRow.detail, /\.\.\s+confidence_envelope:/);

    const report = buildDailyJsonReport(loop, scoreboard, {
        evaluationStatePath: 'skills/state/cognition-evaluation.json',
        jsonReportPath: 'cognition-core/reports/cognition-daily.json',
        markdownReportPath: 'cognition-core/reports/cognition-daily.md'
    });

    const markdown = renderDailyMarkdownReport(report);
    assert.ok(markdown.includes('reason_code=insufficient_sample_size'));
    assert.ok(markdown.includes('calibration_gate: readiness=insufficient_sample_size;mapped_outcomes=1;terminal_outcomes=10;'));
});


test('scoreboard reports deterministic confidence envelope when calibration is active', () => {
    const loop = runFeedbackLoop(
        [{ recommendationId: 'rec-1', owner: 'agent:a', confidence: 0.8 }],
        [
            { taskId: 't1', recommendationId: 'rec-1', status: 'completed' },
            { taskId: 't2', recommendationId: 'rec-1', status: 'failed' },
            { taskId: 't3', recommendationId: 'rec-1', status: 'completed' }
        ],
        {
            generatedAt: '2026-03-01T00:00:00.000Z',
            thresholds: { minSampleSize: 1 }
        }
    );

    const scoreboard = buildScoreboard(loop);
    const brierRow = scoreboard.rows.find((row) => row.metric === 'brier_score');
    const calibrationRow = scoreboard.rows.find((row) => row.metric === 'calibration_gap');

    assert.ok(brierRow);
    assert.ok(calibrationRow);
    assert.equal(loop.evaluation.metrics.calibrationDiagnostics?.readiness, 'ready');
    assert.equal(loop.evaluation.metrics.brierScore, 0.24);
    assert.equal(loop.evaluation.metrics.calibrationGap, 0.1333);
    assert.equal(brierRow.status, 'warn');
    assert.equal(calibrationRow.status, 'pass');
    assert.match(
        brierRow.detail,
        /calibration_gate: readiness=ready;mapped_outcomes=3;terminal_outcomes=3;mapping_rate=1;min_sample_size=3;min_mapping_rate=0\.35;sample_size_ready=true;mapping_rate_ready=true;sample_size_shortfall=0;mapping_rate_shortfall=0;reason=reason_code=ready;terminal_outcomes=3;mapped_outcomes=3;mapping_rate=1;minimum_sample_size=3;minimum_mapping_rate=0\.35;sample_size_shortfall=0;mapping_rate_shortfall=0;readiness_flags\(sample_size_ready=true,mapping_rate_ready=true,sample_size_shortfall=0,mapping_rate_shortfall=0\)\./
    );
    assert.match(
        brierRow.detail,
        /readiness_flags\(sample_size_ready=true,mapping_rate_ready=true,sample_size_shortfall=0,mapping_rate_shortfall=0\)\./
    );
    assert.match(
        brierRow.detail,
        /confidence_envelope: confidence_level=0\.95;method=hoeffding;sample_size=3;predicted_success_mean=0\.8;observed_success_mean=0\.6667;/
    );
    assert.match(calibrationRow.detail, /calibration_gap_lower=0;calibration_gap_upper=0\.8\./);
});

test('scoreboard keeps calibration readiness detail text stable across reruns', () => {
    const loop = runFeedbackLoop(
        [{ recommendationId: 'rec-1', owner: 'agent:a', confidence: 1 }],
        [
            { taskId: 't1', recommendationId: 'rec-1', status: 'failed' },
            { taskId: 't2', status: 'completed' },
            { taskId: 't3', status: 'completed' },
            { taskId: 't4', status: 'completed' },
            { taskId: 't5', status: 'completed' },
            { taskId: 't6', status: 'completed' },
            { taskId: 't7', status: 'completed' },
            { taskId: 't8', status: 'completed' },
            { taskId: 't9', status: 'completed' },
            { taskId: 't10', status: 'completed' }
        ],
        {
            generatedAt: '2026-03-01T00:00:00.000Z',
            thresholds: { minSampleSize: 1 }
        }
    );

    const first = buildScoreboard(loop);
    const second = buildScoreboard(loop);

    assert.deepEqual(first, second);
});

test('scoreboard keeps sample-gated metrics n/a with machine-parsable details when no terminal outcomes exist', () => {
    const loop = runFeedbackLoop(
        [{ recommendationId: 'rec-1', owner: 'agent:a', confidence: 0.8 }],
        [
            { taskId: 't1', recommendationId: 'rec-1', status: 'awaiting_approval' },
            { taskId: 't2', status: 'awaiting_approval' }
        ],
        {
            generatedAt: '2026-03-01T00:00:00.000Z',
            thresholds: { minSampleSize: 1 }
        }
    );

    const scoreboard = buildScoreboard(loop);
    const brierRow = scoreboard.rows.find((row) => row.metric === 'brier_score');
    const calibrationRow = scoreboard.rows.find((row) => row.metric === 'calibration_gap');

    assert.ok(brierRow);
    assert.ok(calibrationRow);
    assert.equal(brierRow.status, 'n/a');
    assert.equal(calibrationRow.status, 'n/a');
    assert.match(
        brierRow.detail,
        /calibration_gate: readiness=no_terminal_outcomes;mapped_outcomes=0;terminal_outcomes=0;mapping_rate=0;min_sample_size=3;min_mapping_rate=0\.35;sample_size_ready=false;mapping_rate_ready=false;sample_size_shortfall=3;mapping_rate_shortfall=0\.35;reason=reason_code=no_terminal_outcomes;terminal_outcomes=0;mapped_outcomes=0;mapping_rate=0;minimum_sample_size=3;minimum_mapping_rate=0\.35;sample_size_shortfall=3;mapping_rate_shortfall=0\.35;readiness_flags\(sample_size_ready=false,mapping_rate_ready=false,sample_size_shortfall=3,mapping_rate_shortfall=0\.35\)\./
    );
    assert.match(
        brierRow.detail,
        /readiness_flags\(sample_size_ready=false,mapping_rate_ready=false,sample_size_shortfall=3,mapping_rate_shortfall=0\.35\)\./
    );
    assert.match(
        calibrationRow.detail,
        /confidence_envelope: confidence_level=0\.95;method=hoeffding;sample_size=0;predicted_success_mean=n\/a;observed_success_mean=n\/a;observed_success_lower=n\/a;observed_success_upper=n\/a;calibration_gap_lower=n\/a;calibration_gap_upper=n\/a\./
    );
});


test('scoreboard backfills confidence-envelope shape for legacy diagnostics without envelope fields', () => {
    const loop = runFeedbackLoop(
        [{ recommendationId: 'rec-1', owner: 'agent:a', confidence: 0.8 }],
        [
            { taskId: 't1', recommendationId: 'rec-1', status: 'awaiting_approval' },
            { taskId: 't2', status: 'awaiting_approval' }
        ],
        {
            generatedAt: '2026-03-01T00:00:00.000Z',
            thresholds: { minSampleSize: 1 }
        }
    );

    const legacyLikeLoop = {
        ...loop,
        evaluation: {
            ...loop.evaluation,
            metrics: {
                ...loop.evaluation.metrics,
                calibrationDiagnostics: {
                    ...loop.evaluation.metrics.calibrationDiagnostics
                }
            }
        }
    };

    if (legacyLikeLoop.evaluation.metrics.calibrationDiagnostics) {
        delete (legacyLikeLoop.evaluation.metrics.calibrationDiagnostics as { confidenceEnvelope?: unknown }).confidenceEnvelope;
    }

    const scoreboard = buildScoreboard(legacyLikeLoop);
    const brierRow = scoreboard.rows.find((row) => row.metric === 'brier_score');

    assert.ok(brierRow);
    assert.match(
        brierRow.detail,
        /confidence_envelope: confidence_level=n\/a;method=hoeffding;sample_size=0;predicted_success_mean=n\/a;observed_success_mean=n\/a;observed_success_lower=n\/a;observed_success_upper=n\/a;calibration_gap_lower=n\/a;calibration_gap_upper=n\/a\./
    );
    assert.doesNotMatch(brierRow.detail, /method=undefined/);
    assert.doesNotMatch(brierRow.detail, /sample_size=NaN/);
});

