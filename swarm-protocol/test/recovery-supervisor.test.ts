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

function seedSaturationSupervisor({ lowTraffic = false } = {}) {
    let now = 200_000;
    const supervisor = new RecoverySupervisor({
        localAgentId: 'agent:supervisor',
        now: () => now
    });

    const totals = lowTraffic ? [12, 14, 10, 9, 11, 13] : [220, 230, 210, 225, 235, 240];
    const open = lowTraffic ? [6, 7, 5, 5, 6, 7] : [90, 96, 92, 130, 142, 150];
    const latencies = [120, 130, 140, 330, 360, 390];

    for (let i = 0; i < totals.length; i++) {
        supervisor.ingestSnapshot({
            at: now + i,
            orchestrator: {
                total: totals[i],
                open: open[i],
                terminal: Math.max(0, totals[i] - open[i]),
                avgAttempts: 1.4,
                byStatus: { dispatched: 20, retry_scheduled: 6, timed_out: 4 }
            },
            simulation: {
                successRate: 0.78,
                timeoutRate: 0.11,
                failureRate: 0.12,
                avgLatencyMs: latencies[i],
                dispatchErrorCount: 1
            },
            agents: [
                {
                    agentId: 'agent:alpha',
                    status: 'busy',
                    load: 0.72,
                    tasks: 85,
                    successRate: 0.8,
                    timeoutRate: 0.12
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
    assert.ok(detected.incidents.some((item) => item.code === 'error_budget_burn'));
    assert.ok(detected.incidents.some((item) => item.code === 'timeout_spike'));
    assert.ok(detected.incidents.some((item) => item.code === 'retry_budget_exhausted'));
    assert.ok(detected.incidents.some((item) => item.code === 'agent_overloaded'));
    assert.ok(detected.incidents.some((item) => item.code === 'agent_low_success'));
});

test('detectIncidents flags concurrency saturation during queue and tail-latency pressure', () => {
    const supervisor = seedSaturationSupervisor();
    const detected = supervisor.detectIncidents({
        lookback: 6,
        openQueueRatioThreshold: 0.4,
        latencyInflationThreshold: 1.8,
        minRequestsForConcurrencySaturation: 100
    });

    assert.ok(detected.incidents.some((item) => item.code === 'concurrency_saturation'));
});

test('detectIncidents suppresses concurrency saturation under low traffic', () => {
    const supervisor = seedSaturationSupervisor({ lowTraffic: true });
    const detected = supervisor.detectIncidents({
        lookback: 6,
        openQueueRatioThreshold: 0.4,
        latencyInflationThreshold: 1.8,
        minRequestsForConcurrencySaturation: 100
    });

    assert.ok(!detected.incidents.some((item) => item.code === 'concurrency_saturation'));
});

test('proposeActions converts incidents into remediation actions', () => {
    const supervisor = seedSupervisor();
    const detected = supervisor.detectIncidents({ lookback: 6 });
    const actions = supervisor.proposeActions(detected.incidents);

    assert.ok(actions.length > 0);
    assert.ok(actions.some((item) => item.actionType === 'drain_agent'));
    assert.ok(actions.some((item) => item.actionType === 'route_to_stable_pool'));
    assert.ok(actions.some((item) => item.actionType === 'enforce_retry_budget'));
});

test('proposeActions emits adaptive-concurrency actions for saturation incidents', () => {
    const supervisor = seedSupervisor();
    const actions = supervisor.proposeActions([
        {
            code: 'concurrency_saturation',
            priority: 'P0',
            severity: 'critical',
            target: 'global',
            summary: 'saturation detected'
        }
    ]);

    assert.ok(actions.some((item) => item.actionType === 'enforce_adaptive_concurrency_limit'));
    assert.ok(actions.some((item) => item.actionType === 'enable_load_shedding'));
    assert.ok(actions.some((item) => item.actionType === 'isolate_dependency_bulkhead'));
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

test('detectIncidents suppresses retry budget incident for low request volume', () => {
    let now = 200_000;
    const supervisor = new RecoverySupervisor({
        localAgentId: 'agent:supervisor',
        now: () => now
    });

    for (let i = 0; i < 5; i++) {
        supervisor.ingestSnapshot({
            at: now + i,
            orchestrator: {
                total: 12,
                open: 3,
                terminal: 9,
                avgAttempts: 2.3,
                byStatus: { dispatched: 4, retry_scheduled: 3, timed_out: 1 }
            },
            simulation: {
                successRate: 0.8,
                timeoutRate: 0.05,
                failureRate: 0.09,
                avgLatencyMs: 220,
                dispatchErrorCount: 0
            },
            agents: []
        });
    }

    const detected = supervisor.detectIncidents({
        lookback: 5,
        retryBudgetRateThreshold: 0.15,
        minRequestsForRetryBudget: 50
    });

    assert.ok(!detected.incidents.some((item) => item.code === 'retry_budget_exhausted'));
});
