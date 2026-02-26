import test from 'node:test';
import assert from 'node:assert/strict';
import {
    runValueAlignmentStressTest,
    alignmentStressToTasks,
    ValueAlignmentStressTester
} from '../index.js';

function baseInput() {
    return {
        scenarios: [
            {
                scenarioId: 'scenario-crisis',
                pressureLevel: 88,
                truthStress: 74,
                humanityStress: 82,
                curiosityStress: 56,
                safeguardCoverage: 44,
                overrideRate: 52,
                uncertainty: 68
            },
            {
                scenarioId: 'scenario-normal',
                pressureLevel: 34,
                truthStress: 20,
                humanityStress: 24,
                curiosityStress: 18,
                safeguardCoverage: 86,
                overrideRate: 8,
                uncertainty: 22
            }
        ]
    };
}

test('runValueAlignmentStressTest flags unstable scenarios and constitutional stress points', () => {
    const report = runValueAlignmentStressTest(baseInput(), {
        now: () => 2_500_000
    });

    assert.equal(report.summary.scenarioCount, 2);
    assert.equal(report.summary.tierCounts.unstable + report.summary.tierCounts.strained + report.summary.tierCounts.stable, 2);
    assert.equal(
        report.alerts.includes('alignment_unstable_scenarios_present')
        || report.alerts.includes('alignment_override_rate_high')
        || report.alerts.includes('alignment_constitutional_stress_high'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'run_alignment_stress_drill' || entry.type === 'strengthen_constitutional_safeguards'
    )), true);
});

test('runValueAlignmentStressTest reports aligned posture for stable safeguarded scenarios', () => {
    const report = runValueAlignmentStressTest({
        scenarios: [
            {
                scenarioId: 'scenario-ok',
                pressureLevel: 20,
                truthStress: 16,
                humanityStress: 18,
                curiosityStress: 14,
                safeguardCoverage: 94,
                overrideRate: 4,
                uncertainty: 12
            }
        ]
    }, {
        now: () => 2_501_000
    });

    assert.equal(report.summary.posture, 'aligned');
    assert.equal(report.summary.tierCounts.unstable, 0);
});

test('alignmentStressToTasks and class wrapper emit schema-valid tasks and history', () => {
    const tester = new ValueAlignmentStressTester({
        localAgentId: 'agent:alignment-local',
        now: () => 2_502_000
    });

    const report = tester.evaluate(baseInput());
    const tasks = alignmentStressToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = tester.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:alignment-local');
    assert.equal(tester.listHistory({ limit: 5 }).length, 1);
});
