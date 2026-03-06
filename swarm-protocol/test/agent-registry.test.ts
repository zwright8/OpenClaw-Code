import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AgentRegistry,
    buildTaskRequest
} from '../index.js';

function heartbeat({ from, status = 'idle', load = 0, timestamp }) {
    return {
        kind: 'signal_heartbeat',
        from,
        status,
        load,
        timestamp
    };
}

test('ingestHeartbeat stores presence and capabilities', () => {
    const registry = new AgentRegistry();

    registry.ingestHeartbeat(heartbeat({
        from: 'agent:a',
        status: 'idle',
        load: 0.1,
        timestamp: 1_000
    }), {
        capabilities: ['analysis', 'ops']
    });

    const agent = registry.getAgent('agent:a');
    assert.equal(agent.id, 'agent:a');
    assert.equal(agent.status, 'idle');
    assert.deepEqual(agent.capabilities, ['analysis', 'ops']);
});

test('routeTask selects best healthy capability-compatible agent', () => {
    const registry = new AgentRegistry({ maxStalenessMs: 5_000, now: () => 10_000 });

    registry.ingestHeartbeat(heartbeat({
        from: 'agent:alpha',
        status: 'idle',
        load: 0.7,
        timestamp: 9_500
    }), { capabilities: ['analysis'] });

    registry.ingestHeartbeat(heartbeat({
        from: 'agent:beta',
        status: 'idle',
        load: 0.1,
        timestamp: 9_600
    }), { capabilities: ['analysis', 'reporting'] });

    const task = buildTaskRequest({
        id: '11111111-1111-4111-8111-111111111111',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Generate weekly insights',
        priority: 'high',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 10_000
    });

    const routed = registry.routeTask(task, { nowMs: 10_000 });
    assert.equal(routed.routed, true);
    assert.equal(routed.selectedAgentId, 'agent:beta');
    assert.equal(routed.taskRequest.target, 'agent:beta');
});

test('pruneStale removes old agents and health summary reflects staleness', () => {
    const registry = new AgentRegistry({ maxStalenessMs: 1_000, now: () => 20_000 });

    registry.ingestHeartbeat(heartbeat({
        from: 'agent:fresh',
        status: 'busy',
        load: 0.3,
        timestamp: 19_500
    }), { capabilities: ['ops'] });

    registry.ingestHeartbeat(heartbeat({
        from: 'agent:old',
        status: 'idle',
        load: 0.2,
        timestamp: 15_000
    }), { capabilities: ['ops'] });

    const before = registry.getHealthSummary(20_000, 1_000);
    assert.equal(before.total, 2);
    assert.equal(before.stale, 1);

    const removed = registry.pruneStale(20_000, 1_000);
    assert.equal(removed, 1);

    const after = registry.getHealthSummary(20_000, 1_000);
    assert.equal(after.total, 1);
    assert.equal(after.stale, 0);
    assert.equal(after.healthy, 1);
});

test('createRouteTaskFn works with orchestrator-style callback expectations', async () => {
    const registry = new AgentRegistry({ now: () => 30_000, maxStalenessMs: 2_000 });
    registry.ingestHeartbeat(heartbeat({
        from: 'agent:router-target',
        status: 'idle',
        load: 0.2,
        timestamp: 29_900
    }), { capabilities: ['routing'] });

    const routeTask = registry.createRouteTaskFn({ nowMs: 30_000 });

    const selected = await routeTask(buildTaskRequest({
        id: '22222222-2222-4222-8222-222222222222',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route this task',
        context: { requiredCapabilities: ['routing'] },
        createdAt: 30_000
    }));

    assert.equal(selected, 'agent:router-target');
});
