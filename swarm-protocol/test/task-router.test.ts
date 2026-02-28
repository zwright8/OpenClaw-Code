import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildTaskRequest,
    rankAgentsForTask,
    routeTaskRequest,
    selectBestAgentForTask
} from '../index.js';

test('ranks and selects best agent using status/load/capabilities', () => {
    const task = buildTaskRequest({
        id: '11111111-1111-4111-8111-111111111111',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Investigate infra incident',
        priority: 'critical',
        context: {
            requiredCapabilities: ['incident-response', 'logs']
        },
        createdAt: 10_000
    });

    const agents = [
        {
            id: 'agent:ops-a',
            status: 'busy',
            load: 0.6,
            capabilities: ['incident-response', 'logs'],
            timestamp: 10_000
        },
        {
            id: 'agent:ops-b',
            status: 'idle',
            load: 0.2,
            capabilities: ['incident-response', 'logs', 'deploy'],
            timestamp: 10_000
        }
    ];

    const ranked = rankAgentsForTask(task, agents, { nowMs: 10_100 });
    assert.equal(ranked[0].agentId, 'agent:ops-b');
    assert.equal(ranked[0].eligible, true);

    const selected = selectBestAgentForTask(task, agents, { nowMs: 10_100 });
    assert.equal(selected.selectedAgentId, 'agent:ops-b');
});

test('returns unrouted when no eligible agents exist', () => {
    const task = buildTaskRequest({
        id: '22222222-2222-4222-8222-222222222222',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Process billing report',
        priority: 'high',
        context: {
            requiredCapabilities: ['billing']
        },
        createdAt: 20_000
    });

    const agents = [
        {
            id: 'agent:ops-a',
            status: 'offline',
            load: 0.1,
            capabilities: ['billing'],
            timestamp: 20_000
        },
        {
            id: 'agent:ops-b',
            status: 'idle',
            load: 0.1,
            capabilities: ['search'],
            timestamp: 20_000
        }
    ];

    const routed = routeTaskRequest(task, agents, { nowMs: 20_050 });
    assert.equal(routed.routed, false);
    assert.equal(routed.selectedAgentId, null);
});

test('filters stale heartbeats based on max staleness', () => {
    const task = buildTaskRequest({
        id: '33333333-3333-4333-8333-333333333333',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Run compliance checks',
        priority: 'normal',
        createdAt: 30_000
    });

    const agents = [
        {
            id: 'agent:fresh',
            status: 'idle',
            load: 0.4,
            capabilities: ['compliance'],
            timestamp: 30_900
        },
        {
            id: 'agent:stale',
            status: 'idle',
            load: 0.1,
            capabilities: ['compliance'],
            timestamp: 20_000
        }
    ];

    const selected = selectBestAgentForTask(task, agents, {
        nowMs: 31_000,
        maxStalenessMs: 2_000
    });

    assert.equal(selected.selectedAgentId, 'agent:fresh');
    const staleEntry = selected.ranked.find((entry) => entry.agentId === 'agent:stale');
    assert.equal(staleEntry.eligible, false);
    assert.equal(staleEntry.reason, 'stale_heartbeat');
});

test('applies benchmark-aware weighting when base routing signals are tied', () => {
    const task = buildTaskRequest({
        id: '44444444-4444-4444-8444-444444444444',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Summarize benchmark regressions',
        priority: 'normal',
        createdAt: 40_000
    });

    const agents = [
        {
            id: 'agent:slow-risky',
            status: 'idle',
            load: 0.3,
            capabilities: ['analysis'],
            timestamp: 40_000,
            benchmark: {
                samples: 80,
                successRate: 0.66,
                timeoutRate: 0.24,
                failureRate: 0.2,
                avgLatencyMs: 470,
                p95LatencyMs: 860
            }
        },
        {
            id: 'agent:fast-reliable',
            status: 'idle',
            load: 0.3,
            capabilities: ['analysis'],
            timestamp: 40_000,
            benchmark: {
                samples: 80,
                successRate: 0.95,
                timeoutRate: 0.03,
                failureRate: 0.02,
                avgLatencyMs: 130,
                p95LatencyMs: 240
            }
        }
    ];

    const ranked = rankAgentsForTask(task, agents, { nowMs: 40_010 });
    assert.equal(ranked[0].agentId, 'agent:fast-reliable');
    assert.ok(ranked[0].benchmarkAdjustment > ranked[1].benchmarkAdjustment);

    const selected = selectBestAgentForTask(task, agents, { nowMs: 40_010 });
    assert.equal(selected.selectedAgentId, 'agent:fast-reliable');
});

test('uses deterministic tie-breakers when scores are equal', () => {
    const task = buildTaskRequest({
        id: '55555555-5555-4555-8555-555555555555',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Resolve deterministic ordering',
        priority: 'normal',
        createdAt: 50_000
    });

    const agents = [
        {
            id: 'agent:zeta',
            status: 'idle',
            load: 0.4,
            capabilities: ['analysis'],
            timestamp: 50_000
        },
        {
            id: 'agent:alpha',
            status: 'idle',
            load: 0.4,
            capabilities: ['analysis'],
            timestamp: 50_000
        }
    ];

    const ranked = rankAgentsForTask(task, agents, { nowMs: 50_000 });
    assert.deepEqual(ranked.map((entry) => entry.agentId), ['agent:alpha', 'agent:zeta']);

    const selected = selectBestAgentForTask(task, agents, { nowMs: 50_000 });
    assert.equal(selected.selectedAgentId, 'agent:alpha');
});

test('applies a score penalty for older but still-eligible heartbeats', () => {
    const task = buildTaskRequest({
        id: '77777777-7777-4777-8777-777777777777',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Prioritize freshest worker',
        priority: 'normal',
        createdAt: 70_000
    });

    const agents = [
        {
            id: 'agent:fresher',
            status: 'idle',
            load: 0.2,
            capabilities: ['analysis'],
            timestamp: 69_950
        },
        {
            id: 'agent:older',
            status: 'idle',
            load: 0.2,
            capabilities: ['analysis'],
            timestamp: 69_000
        }
    ];

    const ranked = rankAgentsForTask(task, agents, {
        nowMs: 70_000,
        maxStalenessMs: 2_000
    });

    assert.equal(ranked[0].agentId, 'agent:fresher');
    assert.ok(ranked[0].stalenessPenalty < ranked[1].stalenessPenalty);
    assert.ok(ranked[0].score > ranked[1].score);
});

test('penalizes load and failure history when choosing between otherwise-compatible agents', () => {
    const task = buildTaskRequest({
        id: '88888888-8888-4888-8888-888888888888',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Choose resilient low-load analyst',
        priority: 'high',
        createdAt: 80_000
    });

    const agents = [
        {
            id: 'agent:heavy-risky',
            status: 'idle',
            load: 0.85,
            capabilities: ['analysis'],
            timestamp: 80_000,
            failureRate: 0.4,
            timeoutRate: 0.3,
            successRate: 0.55
        },
        {
            id: 'agent:light-reliable',
            status: 'idle',
            load: 0.15,
            capabilities: ['analysis'],
            timestamp: 80_000,
            failureRate: 0.03,
            timeoutRate: 0.02,
            successRate: 0.96
        }
    ];

    const ranked = rankAgentsForTask(task, agents, { nowMs: 80_020 });
    assert.equal(ranked[0].agentId, 'agent:light-reliable');
    assert.ok(ranked[0].loadPenalty < ranked[1].loadPenalty);
    assert.ok(ranked[0].reliabilityPenalty < ranked[1].reliabilityPenalty);

    const selected = selectBestAgentForTask(task, agents, { nowMs: 80_020 });
    assert.equal(selected.selectedAgentId, 'agent:light-reliable');
});

test('hardens invalid and future heartbeat handling while keeping missing-heartbeat agents eligible', () => {
    const task = buildTaskRequest({
        id: '66666666-6666-4666-8666-666666666666',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Evaluate heartbeat hygiene',
        priority: 'normal',
        createdAt: 60_000
    });

    const agents = [
        {
            id: 'agent:missing-heartbeat',
            status: 'idle',
            load: 0.2,
            capabilities: ['analysis']
        },
        {
            id: 'agent:future-heartbeat',
            status: 'idle',
            load: 0.2,
            capabilities: ['analysis'],
            timestamp: 120_000
        },
        {
            id: 'agent:invalid-heartbeat',
            status: 'idle',
            load: 0.2,
            capabilities: ['analysis'],
            timestamp: 'not-a-number'
        }
    ];

    const ranked = rankAgentsForTask(task, agents, {
        nowMs: 60_000,
        maxFutureSkewMs: 2_000
    });

    const missing = ranked.find((entry) => entry.agentId === 'agent:missing-heartbeat');
    const future = ranked.find((entry) => entry.agentId === 'agent:future-heartbeat');
    const invalid = ranked.find((entry) => entry.agentId === 'agent:invalid-heartbeat');

    assert.equal(missing.eligible, true);
    assert.equal(future.eligible, false);
    assert.equal(future.reason, 'invalid_heartbeat');
    assert.equal(invalid.eligible, false);
    assert.equal(invalid.reason, 'invalid_heartbeat');

    const selected = selectBestAgentForTask(task, agents, {
        nowMs: 60_000,
        maxFutureSkewMs: 2_000
    });
    assert.equal(selected.selectedAgentId, 'agent:missing-heartbeat');
});
