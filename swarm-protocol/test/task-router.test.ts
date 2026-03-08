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

test('supports power-of-two-choices selection strategy to reduce router herd bias', () => {
    const task = buildTaskRequest({
        id: '44444444-4444-4444-8444-444444444444',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Distribute indexing workload',
        priority: 'normal',
        context: {
            requiredCapabilities: ['indexing']
        },
        createdAt: 40_000
    });

    const agents = [
        {
            id: 'agent:a',
            status: 'idle',
            load: 0.95,
            capabilities: ['indexing'],
            timestamp: 40_000
        },
        {
            id: 'agent:b',
            status: 'idle',
            load: 0.4,
            capabilities: ['indexing'],
            timestamp: 40_000
        },
        {
            id: 'agent:c',
            status: 'idle',
            load: 0.1,
            capabilities: ['indexing'],
            timestamp: 40_000
        }
    ];

    const sequence = [0.0, 0.49, 0.9]; // pick agent:a and agent:b, tie-break value ignored
    const random = () => sequence.shift() ?? 0;

    const selected = selectBestAgentForTask(task, agents, {
        nowMs: 40_001,
        selectionStrategy: 'p2c',
        random
    });

    assert.equal(selected.selectedAgentId, 'agent:b');
});

test('panic mode can fail open to stale-capable agents when healthy pool collapses', () => {
    const task = buildTaskRequest({
        id: '55555555-5555-4555-8555-555555555555',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Handle urgent failover orchestration',
        priority: 'critical',
        context: {
            requiredCapabilities: ['failover']
        },
        createdAt: 50_000
    });

    const agents = [
        {
            id: 'agent:stale-failover',
            status: 'idle',
            load: 0.2,
            capabilities: ['failover'],
            timestamp: 40_000
        }
    ];

    const routed = routeTaskRequest(task, agents, {
        nowMs: 50_000,
        maxStalenessMs: 2_000,
        enablePanicMode: true
    });

    assert.equal(routed.routed, true);
    assert.equal(routed.degraded, true);
    assert.equal(routed.selectedAgentId, 'agent:stale-failover');
    assert.equal(routed.panicMode.triggered, true);
});

test('outlier detection excludes ejected agents and surfaces action hints', () => {
    const task = buildTaskRequest({
        id: '66666666-6666-4666-8666-666666666666',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Handle customer escalation',
        priority: 'high',
        context: {
            requiredCapabilities: ['support']
        },
        createdAt: 60_000
    });

    const agents = [
        {
            id: 'agent:healthy',
            status: 'idle',
            load: 0.35,
            capabilities: ['support'],
            timestamp: 60_000
        },
        {
            id: 'agent:ejected',
            status: 'idle',
            load: 0.05,
            capabilities: ['support'],
            timestamp: 60_000,
            outlier: {
                ejectedUntilMs: 120_000
            }
        },
        {
            id: 'agent:degrading',
            status: 'idle',
            load: 0.1,
            capabilities: ['support'],
            timestamp: 60_000,
            outlier: {
                consecutiveFailures: 6,
                ejectionCount: 1
            }
        }
    ];

    const routed = routeTaskRequest(task, agents, {
        nowMs: 60_001,
        outlierDetection: {
            enabled: true
        }
    });

    assert.equal(routed.routed, true);
    assert.equal(routed.selectedAgentId, 'agent:healthy');
    const ejected = routed.ranked.find((entry) => entry.agentId === 'agent:ejected');
    assert.equal(ejected.reason, 'outlier_ejected');
    const detected = routed.ranked.find((entry) => entry.agentId === 'agent:degrading');
    assert.equal(detected.reason, 'outlier_detected');
    assert.equal(Array.isArray(routed.outlierActions), true);
    assert.equal(routed.outlierActions[0].agentId, 'agent:degrading');
});

test('panic mode can fail open to outlier-ejected agents when no healthy candidates remain', () => {
    const task = buildTaskRequest({
        id: '77777777-7777-4777-8777-777777777777',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route emergency incident command',
        priority: 'critical',
        context: {
            requiredCapabilities: ['incident-response']
        },
        createdAt: 70_000
    });

    const agents = [
        {
            id: 'agent:ejected-a',
            status: 'idle',
            load: 0.3,
            capabilities: ['incident-response'],
            timestamp: 70_000,
            outlier: {
                ejectedUntilMs: 90_000
            }
        }
    ];

    const routed = routeTaskRequest(task, agents, {
        nowMs: 70_001,
        outlierDetection: {
            enabled: true
        },
        enablePanicMode: true
    });

    assert.equal(routed.routed, true);
    assert.equal(routed.degraded, true);
    assert.equal(routed.selectedAgentId, 'agent:ejected-a');
    assert.equal(routed.panicMode.triggered, true);
});

test('overload protection can exclude saturated agents when enforcement is enabled', () => {
    const task = buildTaskRequest({
        id: '88888888-8888-4888-8888-888888888888',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route heavy indexing batch',
        priority: 'high',
        context: {
            requiredCapabilities: ['indexing']
        },
        createdAt: 80_000
    });

    const agents = [
        {
            id: 'agent:saturated',
            status: 'idle',
            load: 0.1,
            capabilities: ['indexing'],
            timestamp: 80_000,
            routing: {
                inFlight: 8,
                maxInFlight: 8
            }
        },
        {
            id: 'agent:available',
            status: 'idle',
            load: 0.4,
            capabilities: ['indexing'],
            timestamp: 80_000,
            routing: {
                inFlight: 3,
                maxInFlight: 8
            }
        }
    ];

    const routed = routeTaskRequest(task, agents, {
        nowMs: 80_001,
        overloadProtection: {
            enabled: true
        }
    });

    assert.equal(routed.routed, true);
    assert.equal(routed.selectedAgentId, 'agent:available');
    const saturated = routed.ranked.find((entry) => entry.agentId === 'agent:saturated');
    assert.equal(saturated.reason, 'concurrency_saturated');
    assert.equal(saturated.eligible, false);
});

test('slow-start weights recently recovered agents to prevent instant full traffic', () => {
    const task = buildTaskRequest({
        id: '99999999-9999-4999-8999-999999999999',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route post-recovery workload',
        priority: 'normal',
        context: {
            requiredCapabilities: ['analysis']
        },
        createdAt: 90_000
    });

    const agents = [
        {
            id: 'agent:recovered',
            status: 'idle',
            load: 0.1,
            capabilities: ['analysis'],
            timestamp: 90_000,
            routing: {
                recoveredAtMs: 89_500
            }
        },
        {
            id: 'agent:steady',
            status: 'idle',
            load: 0.2,
            capabilities: ['analysis'],
            timestamp: 90_000
        }
    ];

    const routed = routeTaskRequest(task, agents, {
        nowMs: 90_000,
        slowStart: {
            enabled: true,
            windowMs: 10_000,
            minWeight: 0.2
        }
    });

    assert.equal(routed.routed, true);
    assert.equal(routed.selectedAgentId, 'agent:steady');
    const recovered = routed.ranked.find((entry) => entry.agentId === 'agent:recovered');
    assert.equal(recovered.reason, 'ok');
    assert.equal(recovered.slowStart.weight < 1, true);
});

test('adaptive concurrency can exclude agents at their concurrency limit', () => {
    const task = buildTaskRequest({
        id: 'abababab-abab-4bab-8bab-abababababab',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route low-latency analysis',
        priority: 'high',
        context: {
            requiredCapabilities: ['analysis']
        },
        createdAt: 100_000
    });

    const agents = [
        {
            id: 'agent:saturated',
            status: 'idle',
            load: 0.05,
            capabilities: ['analysis'],
            timestamp: 100_000,
            routing: {
                inFlight: 10,
                concurrencyLimit: 10
            }
        },
        {
            id: 'agent:headroom',
            status: 'busy',
            load: 0.3,
            capabilities: ['analysis'],
            timestamp: 100_000,
            routing: {
                inFlight: 2,
                concurrencyLimit: 10
            }
        }
    ];

    const routed = routeTaskRequest(task, agents, {
        nowMs: 100_001,
        adaptiveConcurrency: {
            enabled: true,
            enforce: true
        }
    });

    assert.equal(routed.routed, true);
    assert.equal(routed.selectedAgentId, 'agent:headroom');
    const saturated = routed.ranked.find((entry) => entry.agentId === 'agent:saturated');
    assert.equal(saturated.reason, 'adaptive_concurrency_limited');
});

test('adaptive concurrency penalizes queueing latency even before saturation', () => {
    const task = buildTaskRequest({
        id: 'cdcdcdcd-cdcd-4dcd-8dcd-cdcdcdcdcdcd',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Select steady endpoint',
        priority: 'normal',
        context: {
            requiredCapabilities: ['analysis']
        },
        createdAt: 110_000
    });

    const agents = [
        {
            id: 'agent:queueing',
            status: 'idle',
            load: 0.1,
            capabilities: ['analysis'],
            timestamp: 110_000,
            routing: {
                inFlight: 2,
                concurrencyLimit: 20,
                minRttMs: 40,
                sampleRttMs: 140
            }
        },
        {
            id: 'agent:steady',
            status: 'busy',
            load: 0.2,
            capabilities: ['analysis'],
            timestamp: 110_000,
            routing: {
                inFlight: 3,
                concurrencyLimit: 20,
                minRttMs: 40,
                sampleRttMs: 50
            }
        }
    ];

    const ranked = rankAgentsForTask(task, agents, {
        nowMs: 110_001,
        adaptiveConcurrency: {
            enabled: true
        }
    });

    assert.equal(ranked[0].agentId, 'agent:steady');
    assert.equal(ranked[1].agentId, 'agent:queueing');
});

test('locality routing prefers same-zone agents for latency-sensitive traffic', () => {
    const task = buildTaskRequest({
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route zone-sensitive workload',
        priority: 'high',
        context: {
            requiredCapabilities: ['routing'],
            routing: {
                clientZone: 'us-east-1a'
            }
        },
        createdAt: 140_000
    });

    const agents = [
        {
            id: 'agent:local-zone',
            status: 'busy',
            load: 0.35,
            capabilities: ['routing'],
            zone: 'us-east-1a',
            timestamp: 140_000
        },
        {
            id: 'agent:remote-zone',
            status: 'idle',
            load: 0.1,
            capabilities: ['routing'],
            zone: 'us-east-1b',
            timestamp: 140_000
        }
    ];

    const routed = routeTaskRequest(task, agents, {
        nowMs: 140_005,
        locality: {
            enabled: true,
            localZoneBoost: 35,
            crossZonePenalty: 8
        }
    });

    assert.equal(routed.routed, true);
    assert.equal(routed.selectedAgentId, 'agent:local-zone');
    assert.equal(routed.localityFallbackApplied, false);
});

test('strict locality can fail open to cluster-wide routing when local zone is unavailable', () => {
    const task = buildTaskRequest({
        id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Fallback on zone depletion',
        priority: 'normal',
        context: {
            requiredCapabilities: ['routing'],
            routing: {
                clientZone: 'us-west-2a',
                strictZoneAffinity: true
            }
        },
        createdAt: 150_000
    });

    const agents = [
        {
            id: 'agent:remote-a',
            status: 'idle',
            load: 0.25,
            capabilities: ['routing'],
            zone: 'us-west-2b',
            timestamp: 150_000
        },
        {
            id: 'agent:remote-b',
            status: 'idle',
            load: 0.15,
            capabilities: ['routing'],
            zone: 'us-west-2c',
            timestamp: 150_000
        }
    ];

    const routed = routeTaskRequest(task, agents, {
        nowMs: 150_005,
        locality: {
            enabled: true
        }
    });

    assert.equal(routed.routed, true);
    assert.equal(routed.selectedAgentId, 'agent:remote-b');
    assert.equal(routed.localityFallbackApplied, true);
    assert.equal(routed.localityFallbackReason, 'strict_zone_affinity');
});
