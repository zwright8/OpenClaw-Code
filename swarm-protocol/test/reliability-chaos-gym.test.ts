import test from 'node:test';
import assert from 'node:assert/strict';
import {
    runReliabilityChaosGym,
    chaosGymToTasks,
    ReliabilityChaosGym
} from '../index.js';

function baseInput() {
    return {
        systems: [
            {
                id: 'system-api',
                baselineAvailability: 99.6,
                baselineLatencyMs: 130,
                errorBudgetRemaining: 55,
                dependencyCriticality: 78,
                observabilityCoverage: 58,
                rollbackAutomation: 52
            },
            {
                id: 'system-worker',
                baselineAvailability: 99.8,
                baselineLatencyMs: 90,
                errorBudgetRemaining: 82,
                dependencyCriticality: 45,
                observabilityCoverage: 82,
                rollbackAutomation: 76
            }
        ],
        experiments: [
            {
                id: 'exp-api-outage',
                systemId: 'system-api',
                faultType: 'service_outage',
                blastRadius: 80,
                durationMinutes: 35,
                safeguards: 45,
                rollbackReady: false
            },
            {
                id: 'exp-worker-latency',
                systemId: 'system-worker',
                faultType: 'latency_spike',
                blastRadius: 30,
                durationMinutes: 18,
                safeguards: 78,
                rollbackReady: true
            }
        ]
    };
}

test('runReliabilityChaosGym surfaces fragile simulations and hardening recommendations', () => {
    const report = runReliabilityChaosGym(baseInput(), {
        now: () => 900_000
    });

    assert.equal(report.summary.simulationCount, 2);
    assert.equal(report.summary.fragileCount >= 1, true);
    assert.equal(report.alerts.includes('chaos_fragile_surface_detected'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'patch_resilience_gap'), true);
});

test('runReliabilityChaosGym reports ready posture for low-intensity well-protected experiments', () => {
    const report = runReliabilityChaosGym({
        systems: [
            {
                id: 'system-ok',
                baselineAvailability: 99.95,
                baselineLatencyMs: 70,
                errorBudgetRemaining: 92,
                dependencyCriticality: 30,
                observabilityCoverage: 90,
                rollbackAutomation: 88
            }
        ],
        experiments: [
            {
                id: 'exp-ok',
                systemId: 'system-ok',
                faultType: 'latency_spike',
                blastRadius: 12,
                durationMinutes: 8,
                safeguards: 92,
                rollbackReady: true
            }
        ]
    }, {
        now: () => 901_000
    });

    assert.equal(report.summary.posture, 'ready');
    assert.equal(report.summary.fragileCount, 0);
});

test('chaosGymToTasks and class wrapper emit schema-valid tasks and history', () => {
    const gym = new ReliabilityChaosGym({
        localAgentId: 'agent:chaos-local',
        now: () => 902_000
    });

    const report = gym.evaluate(baseInput());
    const tasks = chaosGymToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = gym.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:chaos-local');
    assert.equal(gym.listHistory({ limit: 5 }).length, 1);
});
