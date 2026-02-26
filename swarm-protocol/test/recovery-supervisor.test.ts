import test from 'node:test';
import assert from 'node:assert/strict';
import { RecoverySupervisor } from '../index.js';

function seedSupervisor() {
    let now = 100_000;
    const supervisor = new RecoverySupervisor({
        localAgentId: 'agent:supervisor',
        now: () => now
    });

    for (let i = 0; i < 6; i++) {
        supervisor.ingestSnapshot({
            at: now + i,
            orchestrator: {
                total: 200,
                open: 40,
                terminal: 160,
                avgAttempts: 1.9,
                byStatus: { dispatched: 20, retry_scheduled: 10, timed_out: 15 }
            },
            simulation: {
                successRate: 0.62,
                timeoutRate: 0.24,
                failureRate: 0.27,
                avgLatencyMs: 480,
                dispatchErrorCount: 2
            },
            agents: [
                {
                    agentId: 'agent:alpha',
                    status: 'busy',
                    load: 0.94,
                    tasks: 60,
                    successRate: 0.52,
                    timeoutRate: 0.31
                },
                {
                    agentId: 'agent:beta',
                    status: 'idle',
                    load: 0.35,
                    tasks: 40,
                    successRate: 0.88,
                    timeoutRate: 0.04
                }
            ]
        });
    }

    return supervisor;
}

test('detectIncidents identifies global and per-agent reliability issues', () => {
    const supervisor = seedSupervisor();
    const detected = supervisor.detectIncidents({
        lookback: 6,
        timeoutRateThreshold: 0.2,
        failureRateThreshold: 0.2,
        avgAttemptsThreshold: 1.6,
        dispatchErrorThreshold: 8
    });

    assert.ok(detected.incidents.length >= 4);
    assert.ok(detected.incidents.some((item) => item.code === 'timeout_spike'));
    assert.ok(detected.incidents.some((item) => item.code === 'agent_overloaded'));
    assert.ok(detected.incidents.some((item) => item.code === 'agent_low_success'));
});

test('proposeActions converts incidents into remediation actions', () => {
    const supervisor = seedSupervisor();
    const detected = supervisor.detectIncidents({ lookback: 6 });
    const actions = supervisor.proposeActions(detected.incidents);

    assert.ok(actions.length > 0);
    assert.ok(actions.some((item) => item.actionType === 'drain_agent'));
    assert.ok(actions.some((item) => item.actionType === 'route_to_stable_pool'));
});

test('buildRecoveryTasks emits schema-valid task requests', () => {
    const supervisor = seedSupervisor();
    const actions = [
        {
            incidentCode: 'agent_overloaded',
            priority: 'P1',
            actionType: 'drain_agent',
            target: 'agent:alpha',
            title: 'Drain and reroute load from agent:alpha',
            description: 'agent overloaded'
        }
    ];

    const tasks = supervisor.buildRecoveryTasks(actions);
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].priority, 'high');
    assert.equal(tasks[0].from, 'agent:supervisor');
});

test('evaluateAndPlan records incident history', () => {
    const supervisor = seedSupervisor();
    const plan = supervisor.evaluateAndPlan({
        thresholds: { lookback: 6 }
    });

    assert.ok(plan.incidents.length > 0);
    assert.ok(plan.actions.length > 0);
    assert.ok(plan.tasks.length > 0);

    const history = supervisor.listIncidentHistory();
    assert.equal(history.length, 1);
    assert.equal(history[0].taskCount, plan.tasks.length);
});
