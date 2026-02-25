import test from 'node:test';
import assert from 'node:assert/strict';
import {
    runBiasMitigationLoop,
    biasMitigationToTasks,
    BiasMitigationLoop
} from '../index.js';

function baseInput() {
    return {
        evaluations: [
            {
                sliceId: 'slice-income-low',
                modelName: 'benefits-eligibility-v2',
                groupDisparity: 68,
                errorRate: 44,
                coverageGap: 62,
                harmSignals: 58,
                mitigationCoverage: 36,
                sampleAdequacy: 42
            },
            {
                sliceId: 'slice-income-mid',
                modelName: 'benefits-eligibility-v2',
                groupDisparity: 22,
                errorRate: 18,
                coverageGap: 20,
                harmSignals: 12,
                mitigationCoverage: 78,
                sampleAdequacy: 82
            }
        ]
    };
}

test('runBiasMitigationLoop flags severe bias slices and mitigation deficits', () => {
    const report = runBiasMitigationLoop(baseInput(), {
        now: () => 2_300_000
    });

    assert.equal(report.summary.sliceCount, 2);
    assert.equal(report.summary.tierCounts.severe + report.summary.tierCounts.elevated + report.summary.tierCounts.controlled, 2);
    assert.equal(
        report.alerts.includes('bias_severe_present')
        || report.alerts.includes('bias_disparity_gap_high')
        || report.alerts.includes('bias_sampling_adequacy_low'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'run_bias_mitigation_experiment' || entry.type === 'increase_representative_sampling'
    )), true);
});

test('runBiasMitigationLoop reports aligned posture for low-disparity high-coverage evaluations', () => {
    const report = runBiasMitigationLoop({
        evaluations: [
            {
                sliceId: 'slice-ok',
                modelName: 'assistant-v1',
                groupDisparity: 12,
                errorRate: 10,
                coverageGap: 14,
                harmSignals: 8,
                mitigationCoverage: 92,
                sampleAdequacy: 94
            }
        ]
    }, {
        now: () => 2_301_000
    });

    assert.equal(report.summary.posture, 'aligned');
    assert.equal(report.summary.tierCounts.severe, 0);
});

test('biasMitigationToTasks and class wrapper emit schema-valid tasks and history', () => {
    const loop = new BiasMitigationLoop({
        localAgentId: 'agent:bias-local',
        now: () => 2_302_000
    });

    const report = loop.evaluate(baseInput());
    const tasks = biasMitigationToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = loop.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:bias-local');
    assert.equal(loop.listHistory({ limit: 5 }).length, 1);
});
