import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AgentPerformanceTracker,
    buildTaskRequest,
    createOptimizedRouteTaskFn,
    optimizeAgentSelection
} from '../index.js';

test('AgentPerformanceTracker summarizes rolling outcomes', () => {
    const tracker = new AgentPerformanceTracker({ maxSamplesPerAgent: 3 });

    tracker.recordOutcome({ agentId: 'agent:a', success: true, latencyMs: 100, costUsd: 2.1, quality: 0.9 });
    tracker.recordOutcome({ agentId: 'agent:a', success: false, latencyMs: 180, costUsd: 2.6, quality: 0.2 });
    tracker.recordOutcome({ agentId: 'agent:a', success: true, latencyMs: 90, costUsd: 1.9, quality: 0.95 });
    tracker.recordOutcome({ agentId: 'agent:a', success: true, latencyMs: 80, costUsd: 1.8, quality: 0.9 });

    const stats = tracker.getAgentStats('agent:a');
    assert.equal(stats.samples, 3);
    assert.equal(stats.successRate, 0.6667);
    assert.equal(stats.avgLatencyMs, 116.67);
    assert.equal(stats.avgCostUsd, 2.1);
});

test('optimizeAgentSelection prefers lower cost under tight budget', () => {
    const task = buildTaskRequest({
        id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        from: 'agent:main',
        task: 'Generate weekly spend report',
        priority: 'normal',
        createdAt: 1_000,
        context: {
            budgetUsd: 3,
            optimizationMode: 'cost'
        }
    });

    const agents = [
        { id: 'agent:cheap', status: 'idle', load: 0.3, capabilities: ['analysis'], timestamp: 1_000 },
        { id: 'agent:fast', status: 'idle', load: 0.3, capabilities: ['analysis'], timestamp: 1_000 }
    ];

    const performance = {
        'agent:cheap': { samples: 10, successRate: 0.95, avgLatencyMs: 180, avgCostUsd: 2.2, avgQuality: 0.9 },
        'agent:fast': { samples: 10, successRate: 0.97, avgLatencyMs: 80, avgCostUsd: 8.5, avgQuality: 0.92 }
    };

    const optimized = optimizeAgentSelection(task, agents, performance, {
        nowMs: 1_000
    });

    assert.equal(optimized.selectedAgentId, 'agent:cheap');
});

test('optimizeAgentSelection prefers lower latency under strict SLA', () => {
    const task = buildTaskRequest({
        id: 'bbbbbbbb-cccc-4ddd-8eee-ffffffffffff',
        from: 'agent:main',
        task: 'Run real-time anomaly triage',
        priority: 'high',
        createdAt: 2_000,
        context: {
            maxLatencyMs: 90,
            optimizationMode: 'latency'
        }
    });

    const agents = [
        { id: 'agent:cheap', status: 'idle', load: 0.3, capabilities: ['analysis'], timestamp: 2_000 },
        { id: 'agent:fast', status: 'idle', load: 0.3, capabilities: ['analysis'], timestamp: 2_000 }
    ];

    const performance = {
        'agent:cheap': { samples: 20, successRate: 0.95, avgLatencyMs: 230, avgCostUsd: 1.5, avgQuality: 0.88 },
        'agent:fast': { samples: 20, successRate: 0.94, avgLatencyMs: 70, avgCostUsd: 6.2, avgQuality: 0.91 }
    };

    const optimized = optimizeAgentSelection(task, agents, performance, {
        nowMs: 2_000
    });

    assert.equal(optimized.selectedAgentId, 'agent:fast');
    const fast = optimized.ranked.find((row) => row.agentId === 'agent:fast');
    assert.ok(fast.optimization.reasons.length > 0);
});

test('createOptimizedRouteTaskFn returns ranked explainable decision', async () => {
    const tracker = new AgentPerformanceTracker();
    tracker.recordOutcome({ agentId: 'agent:a', success: true, latencyMs: 80, costUsd: 4.5, quality: 0.95 });
    tracker.recordOutcome({ agentId: 'agent:b', success: true, latencyMs: 140, costUsd: 1.5, quality: 0.9 });

    const routeTask = createOptimizedRouteTaskFn({
        listAgents: () => [
            { id: 'agent:a', status: 'idle', load: 0.3, capabilities: ['analysis'], timestamp: 3_000 },
            { id: 'agent:b', status: 'idle', load: 0.3, capabilities: ['analysis'], timestamp: 3_000 }
        ],
        tracker,
        options: { nowMs: 3_000 }
    });

    const task = buildTaskRequest({
        id: 'cccccccc-dddd-4eee-8fff-000000000000',
        from: 'agent:main',
        task: 'Fast path analysis',
        createdAt: 3_000,
        context: {
            maxLatencyMs: 100,
            optimizationMode: 'latency'
        }
    });

    const decision = await routeTask(task);
    assert.ok(decision.selectedAgentId);
    assert.ok(Array.isArray(decision.ranked));
    assert.ok(decision.ranked[0].optimization.reasons.length > 0);
});
