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
