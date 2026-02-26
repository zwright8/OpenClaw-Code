import test from 'node:test';
import assert from 'node:assert/strict';
import {
    SocietalOutcomeSimulator,
    simulateSocietalOutcomes,
    societalOutcomeToTasks
} from '../index.js';

function baselineInput() {
    return {
        baseline: {
            humanity: 72,
            truth: 68,
            curiosity: 61,
            reliability: 70
        }
    };
}

test('simulateSocietalOutcomes is stable with no interventions', () => {
    const report = simulateSocietalOutcomes({
        ...baselineInput(),
        interventions: []
    });

    assert.equal(report.summary.interventionCount, 0);
    assert.equal(report.summary.delta, 0);
    assert.equal(report.summary.trajectory, 'stable');
    assert.equal(report.projections.length > 0, true);
});

test('positive interventions improve projected societal score', () => {
    const report = simulateSocietalOutcomes({
        ...baselineInput(),
        interventions: [
            {
                id: 'intervention-a',
                name: 'Expand reliability safeguards',
                type: 'safety',
                effects: {
                    humanity: 10,
                    truth: 4,
                    curiosity: 2,
                    reliability: 12
                },
                riskScore: 12,
                rolloutDays: 5
            }
        ]
    });

    assert.ok(report.summary.delta > 0);
    assert.equal(report.summary.trajectory, 'improving');
    assert.equal(report.interventions[0].recommendation, 'adopt');
});

test('high-risk interventions trigger alerts and review recommendations', () => {
    const report = simulateSocietalOutcomes({
        ...baselineInput(),
        interventions: [
            {
                id: 'intervention-risky',
                name: 'Aggressive automation without safeguards',
                type: 'automation',
                effects: {
                    humanity: 1,
                    truth: 1,
                    curiosity: 0,
                    reliability: 2
                },
                riskScore: 92,
                rolloutDays: 2
            }
        ]
    });

    assert.ok(report.alerts.includes('intervention_risk_high'));
    assert.equal(report.interventions[0].recommendation, 'review');
});

test('societalOutcomeToTasks and simulator class emit schema-valid tasks and history', () => {
    const simulator = new SocietalOutcomeSimulator({
        localAgentId: 'agent:societal',
        now: () => 30_000
    });

    const report = simulator.evaluate({
        ...baselineInput(),
        interventions: [
            {
                id: 'intervention-a',
                name: 'Targeted learning-loop expansion',
                type: 'research',
                effects: {
                    humanity: 4,
                    truth: 6,
                    curiosity: 8,
                    reliability: 3
                },
                riskScore: 24
            }
        ]
    });

    const tasks = societalOutcomeToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const simulatorTasks = simulator.buildTasks(report);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].context.interventionId, 'string');

    assert.ok(simulatorTasks.length > 0);
    assert.equal(simulatorTasks[0].from, 'agent:societal');
    assert.equal(simulator.listHistory({ limit: 5 }).length, 1);
});
