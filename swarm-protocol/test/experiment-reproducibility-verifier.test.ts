import test from 'node:test';
import assert from 'node:assert/strict';
import {
    verifyExperimentReproducibility,
    reproducibilityToTasks,
    ExperimentReproducibilityVerifier
} from '../index.js';

function baseInput() {
    return {
        experiments: [
            {
                experimentId: 'exp-causal-1',
                replicationRuns: 5,
                successfulReplications: 2,
                envParity: 58,
                dataVersionLocked: 52,
                seedControl: 46,
                protocolCompleteness: 62,
                effectStability: 54
            },
            {
                experimentId: 'exp-causal-2',
                replicationRuns: 4,
                successfulReplications: 4,
                envParity: 84,
                dataVersionLocked: 86,
                seedControl: 82,
                protocolCompleteness: 80,
                effectStability: 78
            }
        ]
    };
}

test('verifyExperimentReproducibility flags low replication and protocol-control risks', () => {
    const report = verifyExperimentReproducibility(baseInput(), {
        now: () => 2_100_000
    });

    assert.equal(report.summary.experimentCount, 2);
    assert.equal(report.summary.tierCounts.non_reproducible + report.summary.tierCounts.fragile + report.summary.tierCounts.reproducible, 2);
    assert.equal(
        report.alerts.includes('reproducibility_failure_present')
        || report.alerts.includes('reproducibility_replication_rate_low')
        || report.alerts.includes('reproducibility_protocol_control_gap'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'run_replication_suite' || entry.type === 'lock_experiment_protocol'
    )), true);
});

test('verifyExperimentReproducibility returns verified posture for highly reproducible experiments', () => {
    const report = verifyExperimentReproducibility({
        experiments: [
            {
                experimentId: 'exp-ok',
                replicationRuns: 6,
                successfulReplications: 6,
                envParity: 96,
                dataVersionLocked: 94,
                seedControl: 92,
                protocolCompleteness: 90,
                effectStability: 88
            }
        ]
    }, {
        now: () => 2_101_000
    });

    assert.equal(report.summary.posture, 'verified');
    assert.equal(report.summary.tierCounts.non_reproducible, 0);
});

test('reproducibilityToTasks and class wrapper emit schema-valid tasks and history', () => {
    const verifier = new ExperimentReproducibilityVerifier({
        localAgentId: 'agent:repro-local',
        now: () => 2_102_000
    });

    const report = verifier.evaluate(baseInput());
    const tasks = reproducibilityToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = verifier.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:repro-local');
    assert.equal(verifier.listHistory({ limit: 5 }).length, 1);
});
