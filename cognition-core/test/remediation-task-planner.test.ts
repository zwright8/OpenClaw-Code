import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildRemediationTasks,
    mapPriorityToTaskPriority,
    resolveTarget
} from '../src/remediation-task-planner.js';

test('maps remediation priorities to swarm task priorities', () => {
    assert.equal(mapPriorityToTaskPriority('P1'), 'critical');
    assert.equal(mapPriorityToTaskPriority('P2'), 'high');
    assert.equal(mapPriorityToTaskPriority('P3'), 'normal');
    assert.equal(mapPriorityToTaskPriority('UNKNOWN'), 'normal');
});

test('resolves targets with overrides and default fallback', () => {
    const targets = { P1: 'agent:red', P2: 'agent:amber' };
    assert.equal(resolveTarget('P1', targets, 'agent:default'), 'agent:red');
    assert.equal(resolveTarget('P2', targets, 'agent:default'), 'agent:amber');
    assert.equal(resolveTarget('P3', targets, 'agent:default'), 'agent:default');
});

test('builds schema-valid task requests from remediation plan', () => {
    const plan = [
        {
            priority: 'P1',
            title: 'Mitigate critical outages',
            rationale: 'Error rate is spiking',
            action: 'Introduce guarded retries and alerting.'
        },
        {
            priority: 'P3',
            title: 'Improve docs',
            rationale: 'Onboarding friction reported',
            action: 'Publish setup walkthrough.'
        }
    ];

    const tasks = buildRemediationTasks(plan, {
        fromAgentId: 'agent:main',
        sourceReport: '/tmp/report.json',
        targetMap: { P1: 'agent:incident', P3: 'agent:docs' },
        defaultTarget: 'agent:ops',
        idFactory: (index) => `00000000-0000-4000-8000-00000000000${index + 1}`,
        nowFactory: () => 1_000
    });

    assert.equal(tasks.length, 2);

    assert.equal(tasks[0].priority, 'critical');
    assert.equal(tasks[0].target, 'agent:incident');
    assert.equal(tasks[0].from, 'agent:main');
    assert.equal(tasks[0].context.sourceReport, '/tmp/report.json');
    assert.equal(tasks[0].createdAt, 1_000);
    assert.ok(tasks[0].task.includes('Mitigate critical outages'));

    assert.equal(tasks[1].priority, 'normal');
    assert.equal(tasks[1].target, 'agent:docs');
    assert.equal(tasks[1].createdAt, 1_001);
});

test('supports maxItems cap and rejects invalid remediation entries', () => {
    const plan = [
        {
            priority: 'P2',
            title: 'Fix flaky transport',
            rationale: 'Intermittent failures',
            action: 'Add timeout and retry instrumentation.'
        },
        {
            priority: 'P3',
            title: 'Polish dashboards',
            rationale: 'UX confusion',
            action: 'Refactor status labels.'
        }
    ];

    const capped = buildRemediationTasks(plan, {
        maxItems: 1,
        idFactory: () => '11111111-1111-4111-8111-111111111111',
        nowFactory: () => 2_000
    });
    assert.equal(capped.length, 1);

    assert.throws(
        () => buildRemediationTasks([{ priority: 'P1', title: 'Missing action' }]),
        /Missing remediation action/
    );
});


test('buildRemediationTaskArtifacts is deterministic across generatedAt churn', () => {
    const baseReport = {
        remediationPlan: [
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Regression gate failed for automationCoverage.',
                action: 'Auto-dispatch more eligible tasks.'
            }
        ],
        thresholdBreaches: [
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Regression gate failed for automationCoverage: expected gte 70 percent, actual 42 percent, miss 28 percent.',
                action: 'Auto-dispatch more eligible tasks.',
                threshold: 70,
                actual: 42,
                gap: 28,
                comparison: 'gte'
            }
        ]
    };

    const first = buildRemediationTaskArtifacts({
        ...baseReport,
        generatedAt: '2026-03-01T00:00:00.000Z'
    }, {
        reportPath: '/tmp/productivity-scorecard.latest.json'
    });

    const second = buildRemediationTaskArtifacts({
        ...baseReport,
        generatedAt: '2026-03-02T00:00:00.000Z'
    }, {
        reportPath: '/tmp/productivity-scorecard.latest.json'
    });

    assert.deepEqual(first.tasks, second.tasks);
    assert.deepEqual(first.artifacts, second.artifacts);
    assert.equal(first.generatedAt, second.generatedAt);
    assert.match(first.artifacts[0].regressionReason, /Threshold breach for automationCoverage/);
    assert.match(first.artifacts[0].regressionReason, /expected gte 70 percent/);
    assert.match(first.artifacts[0].regressionReason, /actual 42 percent/);
    assert.deepEqual(first.artifacts[0].regressionReasonPayload, {
        code: 'THRESHOLD_BREACH',
        metric: 'automationCoverage',
        comparison: 'gte',
        threshold: 70,
        actual: 42,
        miss: 28,
        unit: 'percent'
    });
});

test('buildRegressionGateSummary emits explicit failure reasons', () => {
    const regression = buildRegressionGateSummary({
        productivityIndex: {
            comparison: 'gte',
            threshold: 75,
            actual: 50,
            distance: -25,
            breached: true,
            unit: 'index'
        },
        cycleTimeSec: {
            comparison: 'lte',
            threshold: 120,
            actual: 90,
            distance: 30,
            breached: false,
            unit: 'seconds'
        },
        automationCoverage: {
            comparison: 'gte',
            threshold: 70,
            actual: 80,
            distance: 10,
            breached: false,
            unit: 'percent'
        },
        cognitionSuccessRate: {
            comparison: 'gte',
            threshold: 60,
            actual: 55,
            distance: -5,
            breached: true,
            unit: 'percent'
        },
        swarmSimSuccessRate: {
            comparison: 'gte',
            threshold: 75,
            actual: 85,
            distance: 10,
            breached: false,
            unit: 'percent'
        },
        skillUtilityComposite: {
            comparison: 'gte',
            threshold: 80,
            actual: 82,
            distance: 2,
            breached: false,
            unit: 'percent'
        }
    }, [
        {
            metric: 'productivityIndex',
            comparison: 'gte',
            threshold: 75,
            actual: 50,
            gap: 25,
            priority: 'P1',
            title: 'Recover productivity index baseline',
            rationale: 'Regression gate failed for productivityIndex: expected gte 75 index, actual 50 index, miss 25 index.',
            reasonPayload: {
                code: 'THRESHOLD_BREACH',
                metric: 'productivityIndex',
                comparison: 'gte',
                threshold: 75,
                actual: 50,
                miss: 25,
                unit: 'index'
            },
            action: 'Recover the productivity baseline.'
        },
        {
            metric: 'cognitionSuccessRate',
            comparison: 'gte',
            threshold: 60,
            actual: 55,
            gap: 5,
            priority: 'P3',
            title: 'Improve cognition outcome success',
            rationale: 'Regression gate failed for cognitionSuccessRate: expected gte 60 percent, actual 55 percent, miss 5 percent.',
            reasonPayload: {
                code: 'THRESHOLD_BREACH',
                metric: 'cognitionSuccessRate',
                comparison: 'gte',
                threshold: 60,
                actual: 55,
                miss: 5,
                unit: 'percent'
            },
            action: 'Tune recommendation quality.'
        }
    ]);

    assert.equal(regression.passed, false);
    assert.equal(regression.failureCount, 2);
    assert.match(regression.failures[0].reason, /Threshold breach for productivityIndex/);
    assert.deepEqual(regression.failures[0].reasonPayload, {
        code: 'THRESHOLD_BREACH',
        metric: 'productivityIndex',
        comparison: 'gte',
        threshold: 75,
        actual: 50,
        miss: 25,
        unit: 'index'
    });
    assert.match(regression.checks.cycleTimeSec.reason, /No threshold breach for cycleTimeSec/);
    assert.equal(regression.checks.cycleTimeSec.reasonPayload, null);
});


test('buildRemediationTaskArtifacts remains deterministic when remediation arrays are reordered', () => {
    const reportA = {
        remediationPlan: [
            {
                metric: 'cognitionSuccessRate',
                priority: 'P2',
                title: 'Improve cognition outcome success',
                rationale: 'Regression gate failed for cognitionSuccessRate.',
                action: 'Tune recommendation quality.'
            },
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Regression gate failed for automationCoverage.',
                action: 'Auto-dispatch more eligible tasks.'
            }
        ],
        thresholdBreaches: [
            {
                metric: 'cognitionSuccessRate',
                priority: 'P2',
                title: 'Improve cognition outcome success',
                rationale: 'Regression gate failed for cognitionSuccessRate: expected gte 60 percent, actual 54 percent, miss 6 percent.',
                action: 'Tune recommendation quality.',
                threshold: 60,
                actual: 54,
                gap: 6,
                comparison: 'gte'
            },
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Regression gate failed for automationCoverage: expected gte 70 percent, actual 42 percent, miss 28 percent.',
                action: 'Auto-dispatch more eligible tasks.',
                threshold: 70,
                actual: 42,
                gap: 28,
                comparison: 'gte'
            }
        ]
    };

    const reportB = {
        remediationPlan: [...reportA.remediationPlan].reverse(),
        thresholdBreaches: [...reportA.thresholdBreaches].reverse()
    };

    const first = buildRemediationTaskArtifacts(reportA, {
        reportPath: '/tmp/productivity-scorecard.latest.json'
    });
    const second = buildRemediationTaskArtifacts(reportB, {
        reportPath: '/tmp/productivity-scorecard.latest.json'
    });

    assert.deepEqual(first.tasks, second.tasks);
    assert.deepEqual(first.artifacts, second.artifacts);
    assert.equal(first.generatedAt, second.generatedAt);
});


test('buildRemediationTaskArtifacts keeps deterministic identifiers across report path changes', () => {
    const payload = {
        remediationPlan: [
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Coverage dropped.',
                action: 'Auto-dispatch more eligible tasks.'
            }
        ],
        thresholdBreaches: [
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Needs improvement.',
                action: 'Auto-dispatch more eligible tasks.',
                threshold: 70,
                actual: 42,
                gap: 28,
                comparison: 'gte'
            }
        ]
    };

    const first = buildRemediationTaskArtifacts(payload, {
        reportPath: '/tmp/productivity-scorecard.latest.json'
    });
    const second = buildRemediationTaskArtifacts(payload, {
        reportPath: '/var/tmp/another-productivity-scorecard.latest.json'
    });

    assert.notEqual(first.sourceReport, second.sourceReport);
    assert.deepEqual(first.tasks.map((task) => task.id), second.tasks.map((task) => task.id));
    assert.deepEqual(first.tasks.map((task) => task.createdAt), second.tasks.map((task) => task.createdAt));
    assert.deepEqual(first.artifacts.map((artifact) => artifact.taskId), second.artifacts.map((artifact) => artifact.taskId));
    assert.deepEqual(first.artifacts.map((artifact) => artifact.regressionReason), second.artifacts.map((artifact) => artifact.regressionReason));
    assert.deepEqual(first.artifacts.map((artifact) => artifact.regressionReasonPayload), second.artifacts.map((artifact) => artifact.regressionReasonPayload));
    assert.equal(first.generatedAt, second.generatedAt);
});

test('buildRegressionGateSummary synthesizes explicit failure reason when breach metadata is missing', () => {
    const regression = buildRegressionGateSummary({
        productivityIndex: {
            comparison: 'gte',
            threshold: 75,
            actual: 76,
            distance: 1,
            breached: false,
            unit: 'index'
        },
        cycleTimeSec: {
            comparison: 'lte',
            threshold: 120,
            actual: 141,
            distance: -21,
            breached: true,
            unit: 'seconds'
        },
        automationCoverage: {
            comparison: 'gte',
            threshold: 70,
            actual: 75,
            distance: 5,
            breached: false,
            unit: 'percent'
        },
        cognitionSuccessRate: {
            comparison: 'gte',
            threshold: 60,
            actual: 61,
            distance: 1,
            breached: false,
            unit: 'percent'
        },
        swarmSimSuccessRate: {
            comparison: 'gte',
            threshold: 75,
            actual: 76,
            distance: 1,
            breached: false,
            unit: 'percent'
        },
        skillUtilityComposite: {
            comparison: 'gte',
            threshold: 80,
            actual: 81,
            distance: 1,
            breached: false,
            unit: 'percent'
        }
    }, []);

    assert.equal(regression.passed, false);
    assert.equal(regression.failureCount, 1);
    assert.match(regression.checks.cycleTimeSec.reason, /Threshold breach for cycleTimeSec/);
    assert.deepEqual(regression.checks.cycleTimeSec.reasonPayload, {
        code: 'THRESHOLD_BREACH',
        metric: 'cycleTimeSec',
        comparison: 'lte',
        threshold: 120,
        actual: 141,
        miss: 21,
        unit: 'seconds'
    });
    assert.doesNotMatch(regression.checks.cycleTimeSec.reason, /regression gate passed/i);
});


test('buildRegressionGateSummary rewrites non-explicit breach rationale into threshold-specific diagnostics', () => {
    const regression = buildRegressionGateSummary({
        productivityIndex: {
            comparison: 'gte',
            threshold: 75,
            actual: 74,
            distance: -1,
            breached: true,
            unit: 'index'
        },
        cycleTimeSec: {
            comparison: 'lte',
            threshold: 120,
            actual: 100,
            distance: 20,
            breached: false,
            unit: 'seconds'
        },
        automationCoverage: {
            comparison: 'gte',
            threshold: 70,
            actual: 80,
            distance: 10,
            breached: false,
            unit: 'percent'
        },
        cognitionSuccessRate: {
            comparison: 'gte',
            threshold: 60,
            actual: 65,
            distance: 5,
            breached: false,
            unit: 'percent'
        },
        swarmSimSuccessRate: {
            comparison: 'gte',
            threshold: 75,
            actual: 80,
            distance: 5,
            breached: false,
            unit: 'percent'
        },
        skillUtilityComposite: {
            comparison: 'gte',
            threshold: 80,
            actual: 90,
            distance: 10,
            breached: false,
            unit: 'percent'
        }
    }, [
        {
            metric: 'productivityIndex',
            comparison: 'gte',
            threshold: 75,
            actual: 74,
            gap: 1,
            priority: 'P3',
            title: 'Recover productivity index baseline',
            rationale: 'Metric dropped.',
            reasonPayload: {
                code: 'THRESHOLD_BREACH',
                metric: 'productivityIndex',
                comparison: 'gte',
                threshold: 75,
                actual: 74,
                miss: 1,
                unit: 'index'
            },
            action: 'Recover baseline.'
        }
    ]);

    assert.match(regression.checks.productivityIndex.reason, /expected gte 75 index/i);
    assert.match(regression.checks.productivityIndex.reason, /actual 74 index/i);
    assert.match(regression.checks.productivityIndex.reason, /miss 1 index/i);
    assert.deepEqual(regression.checks.productivityIndex.reasonPayload, {
        code: 'THRESHOLD_BREACH',
        metric: 'productivityIndex',
        comparison: 'gte',
        threshold: 75,
        actual: 74,
        miss: 1,
        unit: 'index'
    });
});

test('buildRemediationTaskArtifacts synthesizes explicit regression reason when breach rationale is generic', () => {
    const bundle = buildRemediationTaskArtifacts({
        remediationPlan: [
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Coverage dropped.',
                action: 'Automate more tasks.'
            }
        ],
        thresholdBreaches: [
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Needs improvement.',
                action: 'Automate more tasks.',
                threshold: 70,
                actual: 42,
                gap: 28,
                comparison: 'gte'
            }
        ]
    }, {
        reportPath: '/tmp/productivity-scorecard.latest.json'
    });

    assert.equal(bundle.artifacts.length, 1);
    assert.match(bundle.artifacts[0].regressionReason, /expected gte 70/i);
    assert.match(bundle.artifacts[0].regressionReason, /actual 42/i);
    assert.match(bundle.artifacts[0].regressionReason, /miss 28/i);
    assert.deepEqual(bundle.artifacts[0].regressionReasonPayload, {
        code: 'THRESHOLD_BREACH',
        metric: 'automationCoverage',
        comparison: 'gte',
        threshold: 70,
        actual: 42,
        miss: 28,
        unit: 'percent'
    });
});


test('buildRemediationTaskArtifacts rounds breach diagnostics for stable reason strings', () => {
    const bundle = buildRemediationTaskArtifacts({
        remediationPlan: [
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Needs improvement.',
                action: 'Automate more tasks.'
            }
        ],
        thresholdBreaches: [
            {
                metric: 'automationCoverage',
                priority: 'P1',
                title: 'Increase automation coverage',
                rationale: 'Needs improvement.',
                action: 'Automate more tasks.',
                threshold: 70.004,
                actual: 42.129,
                gap: 27.874,
                comparison: 'gte'
            }
        ]
    }, {
        reportPath: '/tmp/productivity-scorecard.latest.json'
    });

    assert.equal(bundle.artifacts.length, 1);
    assert.match(bundle.artifacts[0].regressionReason, /expected gte 70 percent/i);
    assert.match(bundle.artifacts[0].regressionReason, /actual 42\.13 percent/i);
    assert.match(bundle.artifacts[0].regressionReason, /miss 27\.87 percent/i);
    assert.deepEqual(bundle.artifacts[0].regressionReasonPayload, {
        code: 'THRESHOLD_BREACH',
        metric: 'automationCoverage',
        comparison: 'gte',
        threshold: 70,
        actual: 42.13,
        miss: 27.87,
        unit: 'percent'
    });
});


test('buildRegressionGateSummary orders failures by priority then metric', () => {
    const regression = buildRegressionGateSummary({
        productivityIndex: {
            comparison: 'gte',
            threshold: 75,
            actual: 74,
            distance: -1,
            breached: true,
            unit: 'index'
        },
        cycleTimeSec: {
            comparison: 'lte',
            threshold: 120,
            actual: 100,
            distance: 20,
            breached: false,
            unit: 'seconds'
        },
        automationCoverage: {
            comparison: 'gte',
            threshold: 70,
            actual: 70,
            distance: 0,
            breached: false,
            unit: 'percent'
        },
        cognitionSuccessRate: {
            comparison: 'gte',
            threshold: 60,
            actual: 60,
            distance: 0,
            breached: false,
            unit: 'percent'
        },
        swarmSimSuccessRate: {
            comparison: 'gte',
            threshold: 75,
            actual: 50,
            distance: -25,
            breached: true,
            unit: 'percent'
        },
        skillUtilityComposite: {
            comparison: 'gte',
            threshold: 80,
            actual: 80,
            distance: 0,
            breached: false,
            unit: 'percent'
        }
    }, [
        {
            metric: 'productivityIndex',
            comparison: 'gte',
            threshold: 75,
            actual: 74,
            gap: 1,
            priority: 'P3',
            title: 'Recover productivity index baseline',
            rationale: 'Metric dropped.',
            reasonPayload: {
                code: 'THRESHOLD_BREACH',
                metric: 'productivityIndex',
                comparison: 'gte',
                threshold: 75,
                actual: 74,
                miss: 1,
                unit: 'index'
            },
            action: 'Recover baseline.'
        },
        {
            metric: 'swarmSimSuccessRate',
            comparison: 'gte',
            threshold: 75,
            actual: 50,
            gap: 25,
            priority: 'P1',
            title: 'Raise swarm simulation success rate',
            rationale: 'Metric dropped.',
            reasonPayload: {
                code: 'THRESHOLD_BREACH',
                metric: 'swarmSimSuccessRate',
                comparison: 'gte',
                threshold: 75,
                actual: 50,
                miss: 25,
                unit: 'percent'
            },
            action: 'Rerun simulations.'
        }
    ]);

    assert.equal(regression.failureCount, 2);
    assert.equal(regression.failures[0].metric, 'swarmSimSuccessRate');
    assert.equal(regression.failures[0].priority, 'P1');
    assert.deepEqual(regression.failures[0].reasonPayload, {
        code: 'THRESHOLD_BREACH',
        metric: 'swarmSimSuccessRate',
        comparison: 'gte',
        threshold: 75,
        actual: 50,
        miss: 25,
        unit: 'percent'
    });
    assert.equal(regression.failures[1].metric, 'productivityIndex');
    assert.equal(regression.failures[1].priority, 'P3');
    assert.deepEqual(regression.failures[1].reasonPayload, {
        code: 'THRESHOLD_BREACH',
        metric: 'productivityIndex',
        comparison: 'gte',
        threshold: 75,
        actual: 74,
        miss: 1,
        unit: 'index'
    });
});
