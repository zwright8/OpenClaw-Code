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

test('penalizes elevated timeout pressure before hard reliability-floor breaches', () => {
    const task = buildTaskRequest({
        id: '45454545-4545-4454-8454-454545454545',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route away from timeout-prone worker',
        priority: 'normal',
        createdAt: 45_000
    });

    const agents = [
        {
            id: 'agent:timeout-heavy',
            status: 'idle',
            load: 0.25,
            capabilities: ['analysis'],
            timestamp: 45_000,
            benchmark: {
                samples: 64,
                successRate: 0.74,
                timeoutRate: 0.24,
                failureRate: 0.02,
                avgLatencyMs: 180,
                p95LatencyMs: 350
            }
        },
        {
            id: 'agent:timeout-light',
            status: 'idle',
            load: 0.25,
            capabilities: ['analysis'],
            timestamp: 45_000,
            benchmark: {
                samples: 64,
                successRate: 0.92,
                timeoutRate: 0.06,
                failureRate: 0.02,
                avgLatencyMs: 180,
                p95LatencyMs: 350
            }
        }
    ];

    const ranked = rankAgentsForTask(task, agents, { nowMs: 45_005 });

    const heavy = ranked.find((entry) => entry.agentId === 'agent:timeout-heavy');
    const light = ranked.find((entry) => entry.agentId === 'agent:timeout-light');

    assert.equal(ranked[0].agentId, 'agent:timeout-light');
    assert.ok(heavy.timeoutPressurePenalty > light.timeoutPressurePenalty);

    const reversed = rankAgentsForTask(task, [...agents].reverse(), { nowMs: 45_005 });
    assert.equal(reversed[0].agentId, 'agent:timeout-light');
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


test('produces stable tie-break ordering regardless of input array order', () => {
    const task = buildTaskRequest({
        id: '56565656-5656-4565-8565-565656565656',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Verify route determinism across permutations',
        priority: 'normal',
        createdAt: 56_000
    });

    const alpha = {
        id: 'agent:alpha',
        status: 'idle',
        load: 0.35,
        capabilities: ['analysis', 'triage'],
        timestamp: 56_000,
        benchmark: {
            samples: 50,
            successRate: 0.9,
            timeoutRate: 0.05,
            failureRate: 0.03,
            avgLatencyMs: 180,
            p95LatencyMs: 320
        }
    };

    const zeta = {
        id: 'agent:zeta',
        status: 'idle',
        load: 0.35,
        capabilities: ['triage', 'analysis'],
        timestamp: 56_000,
        benchmark: {
            samples: 50,
            successRate: 0.9,
            timeoutRate: 0.05,
            failureRate: 0.03,
            avgLatencyMs: 180,
            p95LatencyMs: 320
        }
    };

    const rankedForward = rankAgentsForTask(task, [zeta, alpha], { nowMs: 56_010 });
    const rankedReverse = rankAgentsForTask(task, [alpha, zeta], { nowMs: 56_010 });

    assert.deepEqual(rankedForward.map((entry) => entry.agentId), ['agent:alpha', 'agent:zeta']);
    assert.deepEqual(rankedReverse.map((entry) => entry.agentId), ['agent:alpha', 'agent:zeta']);

    assert.equal(selectBestAgentForTask(task, [zeta, alpha], { nowMs: 56_010 }).selectedAgentId, 'agent:alpha');
    assert.equal(selectBestAgentForTask(task, [alpha, zeta], { nowMs: 56_010 }).selectedAgentId, 'agent:alpha');
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


test('applies surge load and staleness penalties near saturation', () => {
    const task = buildTaskRequest({
        id: '89898989-8989-4898-8898-898989898989',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Stress load and staleness surge penalties',
        priority: 'normal',
        createdAt: 89_000
    });

    const ranked = rankAgentsForTask(task, [
        {
            id: 'agent:surgey',
            status: 'idle',
            load: 0.95,
            capabilities: ['analysis'],
            timestamp: 88_010,
            benchmark: {
                samples: 40,
                successRate: 0.95,
                timeoutRate: 0.02,
                failureRate: 0.02
            }
        },
        {
            id: 'agent:steady',
            status: 'idle',
            load: 0.68,
            capabilities: ['analysis'],
            timestamp: 88_850,
            benchmark: {
                samples: 40,
                successRate: 0.95,
                timeoutRate: 0.02,
                failureRate: 0.02
            }
        }
    ], {
        nowMs: 89_000,
        maxStalenessMs: 1_000
    });

    const steady = ranked.find((entry) => entry.agentId === 'agent:steady');
    const surgey = ranked.find((entry) => entry.agentId === 'agent:surgey');

    assert.equal(ranked[0].agentId, 'agent:steady');
    assert.ok(surgey.loadPenalty > 0.95 * 60, 'expected superlinear high-load penalty');
    assert.ok(surgey.stalenessPenalty > 10 * 0.9, 'expected staleness surge near max window');
    assert.ok(steady.loadPenalty < surgey.loadPenalty);
    assert.ok(steady.stalenessPenalty < surgey.stalenessPenalty);
});

test('amplifies reliability penalties when failure and timeout rates exceed thresholds', () => {
    const task = buildTaskRequest({
        id: '90909090-9090-4909-8909-909090909090',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Enforce reliability floor under over-threshold errors',
        priority: 'normal',
        createdAt: 90_000
    });

    const ranked = rankAgentsForTask(task, [
        {
            id: 'agent:within-floor',
            status: 'idle',
            load: 0.4,
            capabilities: ['analysis'],
            timestamp: 90_000,
            benchmark: {
                samples: 80,
                successRate: 0.91,
                timeoutRate: 0.18,
                failureRate: 0.18,
                avgLatencyMs: 180,
                p95LatencyMs: 320
            }
        },
        {
            id: 'agent:breach-floor',
            status: 'idle',
            load: 0.4,
            capabilities: ['analysis'],
            timestamp: 90_000,
            benchmark: {
                samples: 80,
                successRate: 0.58,
                timeoutRate: 0.36,
                failureRate: 0.35,
                avgLatencyMs: 180,
                p95LatencyMs: 320
            }
        }
    ], { nowMs: 90_020, reliabilityFloorMinSamples: 500 });

    const within = ranked.find((entry) => entry.agentId === 'agent:within-floor');
    const breach = ranked.find((entry) => entry.agentId === 'agent:breach-floor');

    const breachBasePenalty = (0.35 * 18) + (0.36 * 12);
    assert.equal(ranked[0].agentId, 'agent:within-floor');
    assert.ok(breach.reliabilityPenalty > breachBasePenalty, 'expected over-threshold amplification');
    assert.ok(within.reliabilityPenalty < breach.reliabilityPenalty);
    assert.ok(within.score > breach.score);
});

test('increases reliability overage penalties when breach evidence is low-sample', () => {
    const task = buildTaskRequest({
        id: '91919191-9191-4919-8919-919191919191',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Gate low-confidence high-error workers',
        priority: 'normal',
        createdAt: 91_000
    });

    const ranked = rankAgentsForTask(task, [
        {
            id: 'agent:high-sample-breach',
            status: 'idle',
            load: 0.3,
            capabilities: ['analysis'],
            timestamp: 91_000,
            benchmark: {
                samples: 120,
                successRate: 0.55,
                timeoutRate: 0.34,
                failureRate: 0.34
            }
        },
        {
            id: 'agent:low-sample-breach',
            status: 'idle',
            load: 0.3,
            capabilities: ['analysis'],
            timestamp: 91_000,
            benchmark: {
                samples: 4,
                successRate: 0.55,
                timeoutRate: 0.34,
                failureRate: 0.34
            }
        }
    ], { nowMs: 91_020, reliabilityFloorMinSamples: 500 });

    const highSample = ranked.find((entry) => entry.agentId === 'agent:high-sample-breach');
    const lowSample = ranked.find((entry) => entry.agentId === 'agent:low-sample-breach');

    assert.ok(lowSample.reliabilityPenalty > highSample.reliabilityPenalty);
    assert.ok(highSample.score > lowSample.score);
});


test('applies priority-aware reliability floor gating with deterministic breach reasons', () => {
    const normalTask = buildTaskRequest({
        id: '93434343-3434-4934-8934-343434343434',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route normal-priority analytical follow-up',
        priority: 'normal',
        createdAt: 93_000
    });

    const criticalTask = buildTaskRequest({
        id: '94444444-4444-4944-8944-444444444444',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route critical-priority analytical follow-up',
        priority: 'critical',
        createdAt: 94_000
    });

    const agents = [
        {
            id: 'agent:mild-breach',
            status: 'idle',
            load: 0.08,
            capabilities: ['analysis'],
            timestamp: 94_000,
            benchmark: {
                samples: 120,
                successRate: 0.59,
                timeoutRate: 0.31,
                failureRate: 0.31
            }
        },
        {
            id: 'agent:healthy',
            status: 'idle',
            load: 0.35,
            capabilities: ['analysis'],
            timestamp: 94_000,
            benchmark: {
                samples: 120,
                successRate: 0.94,
                timeoutRate: 0.03,
                failureRate: 0.03
            }
        }
    ];

    const rankedNormal = rankAgentsForTask(normalTask, agents, { nowMs: 94_010 });
    const rankedCritical = rankAgentsForTask(criticalTask, agents, { nowMs: 94_010 });

    const mildNormal = rankedNormal.find((entry) => entry.agentId === 'agent:mild-breach');
    const mildCritical = rankedCritical.find((entry) => entry.agentId === 'agent:mild-breach');

    assert.equal(mildNormal.eligible, true);
    assert.equal(mildNormal.reason, 'ok');
    assert.ok(mildNormal.reliabilityPenalty > 0);

    assert.equal(mildCritical.eligible, false);
    assert.equal(mildCritical.reason, 'reliability_floor_breach');
    assert.equal(rankedCritical[0].agentId, 'agent:healthy');
    assert.equal(selectBestAgentForTask(criticalTask, agents, { nowMs: 94_010 }).selectedAgentId, 'agent:healthy');
});


test('blocks severe reliability breaches for normal priority once sample floor is met', () => {
    const task = buildTaskRequest({
        id: '95454545-4545-4954-8954-545454545454',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Prefer non-severe reliability profile for normal priority',
        priority: 'normal',
        createdAt: 95_000
    });

    const agents = [
        {
            id: 'agent:severe-breach',
            status: 'idle',
            load: 0.05,
            capabilities: ['analysis'],
            timestamp: 95_000,
            benchmark: {
                samples: 60,
                successRate: 0.5,
                timeoutRate: 0.36,
                failureRate: 0.35
            }
        },
        {
            id: 'agent:stable',
            status: 'idle',
            load: 0.45,
            capabilities: ['analysis'],
            timestamp: 95_000,
            benchmark: {
                samples: 60,
                successRate: 0.9,
                timeoutRate: 0.04,
                failureRate: 0.04
            }
        }
    ];

    const ranked = rankAgentsForTask(task, agents, { nowMs: 95_020 });

    const severe = ranked.find((entry) => entry.agentId === 'agent:severe-breach');

    assert.equal(severe.eligible, false);
    assert.equal(severe.reason, 'reliability_floor_breach');
    assert.equal(ranked[0].agentId, 'agent:stable');
    assert.equal(selectBestAgentForTask(task, agents, { nowMs: 95_020 }).selectedAgentId, 'agent:stable');
});


test('keeps ineligible heartbeat ordering deterministic across input permutations', () => {
    const task = buildTaskRequest({
        id: '92929292-9292-4929-8929-929292929292',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Sort invalid heartbeat reasons deterministically',
        priority: 'normal',
        createdAt: 92_000
    });

    const stale = {
        status: 'idle',
        load: 0.2,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const invalid = {
        status: 'idle',
        load: 0.2,
        capabilities: ['analysis'],
        timestamp: 'bad-heartbeat'
    };

    const rankedForward = rankAgentsForTask(task, [stale, invalid], {
        nowMs: 92_000,
        maxStalenessMs: 2_000
    });
    const rankedReverse = rankAgentsForTask(task, [invalid, stale], {
        nowMs: 92_000,
        maxStalenessMs: 2_000
    });

    assert.deepEqual(rankedForward.map((entry) => entry.reason), ['invalid_heartbeat', 'stale_heartbeat']);
    assert.deepEqual(rankedReverse.map((entry) => entry.reason), ['invalid_heartbeat', 'stale_heartbeat']);
});


test('applies additional critical-priority penalty for missing heartbeats', () => {
    const normalTask = buildTaskRequest({
        id: '93939393-9393-4939-8939-939393939393',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Choose best analyst for normal request',
        priority: 'normal',
        createdAt: 93_000
    });

    const criticalTask = buildTaskRequest({
        id: '94949494-9494-4949-8949-949494949494',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Choose best analyst for critical request',
        priority: 'critical',
        createdAt: 94_000
    });

    const agents = [
        {
            id: 'agent:missing-heartbeat',
            status: 'idle',
            load: 0.05,
            capabilities: ['analysis']
        },
        {
            id: 'agent:fresh-heartbeat',
            status: 'idle',
            load: 0.2,
            capabilities: ['analysis'],
            timestamp: 94_000
        }
    ];

    const rankedNormal = rankAgentsForTask(normalTask, agents, { nowMs: 94_000 });
    const rankedCritical = rankAgentsForTask(criticalTask, agents, { nowMs: 94_000 });

    const normalMissing = rankedNormal.find((entry) => entry.agentId === 'agent:missing-heartbeat');
    const criticalMissing = rankedCritical.find((entry) => entry.agentId === 'agent:missing-heartbeat');

    assert.equal(rankedNormal[0].agentId, 'agent:missing-heartbeat');
    assert.equal(rankedCritical[0].agentId, 'agent:fresh-heartbeat');
    assert.equal(normalMissing.missingHeartbeatPriorityPenalty, 0);
    assert.ok(criticalMissing.missingHeartbeatPriorityPenalty > 0);
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


test('supports deterministic degraded fallback routing for stale-only availability', () => {
    const task = buildTaskRequest({
        id: '96969696-9696-4969-8969-969696969696',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route through stale-only degraded pool',
        priority: 'normal',
        context: {
            requiredCapabilities: ['analysis']
        },
        createdAt: 96_000
    });

    const alpha = {
        id: 'agent:alpha',
        status: 'idle',
        load: 0.3,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const zeta = {
        id: 'agent:zeta',
        status: 'idle',
        load: 0.3,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const strictForward = routeTaskRequest(task, [zeta, alpha], {
        nowMs: 96_000,
        maxStalenessMs: 2_000
    });
    const strictReverse = routeTaskRequest(task, [alpha, zeta], {
        nowMs: 96_000,
        maxStalenessMs: 2_000
    });

    assert.equal(strictForward.routed, false);
    assert.equal(strictReverse.routed, false);

    const degradedForward = routeTaskRequest(task, [zeta, alpha], {
        nowMs: 96_000,
        maxStalenessMs: 2_000,
        allowDegradedFallback: true
    });
    const degradedReverse = routeTaskRequest(task, [alpha, zeta], {
        nowMs: 96_000,
        maxStalenessMs: 2_000,
        allowDegradedFallback: true
    });

    assert.equal(degradedForward.routed, true);
    assert.equal(degradedForward.fallbackUsed, true);
    assert.equal(degradedForward.fallbackReason, 'stale_heartbeat');
    assert.equal(degradedForward.selectedAgentId, 'agent:alpha');

    assert.equal(degradedReverse.routed, true);
    assert.equal(degradedReverse.fallbackUsed, true);
    assert.equal(degradedReverse.selectedAgentId, 'agent:alpha');
});


test('degraded fallback reasons are case-insensitive and deduplicated', () => {
    const task = buildTaskRequest({
        id: '9a0a9a0a-9a0a-49a0-89a0-9a0a9a0a9a0a',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Respect fallback reason aliases while keeping deterministic stale routing',
        priority: 'normal',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 96_500
    });

    const alpha = {
        id: 'agent:alpha',
        status: 'idle',
        load: 0.3,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const zeta = {
        id: 'agent:zeta',
        status: 'idle',
        load: 0.3,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const degraded = routeTaskRequest(task, [zeta, alpha], {
        nowMs: 96_500,
        maxStalenessMs: 2_000,
        allowDegradedFallback: true,
        degradedFallbackReasons: [
            'STALE_HEARTBEAT',
            'stale_heartbeat',
            'RELIABILITY_FLOOR_BREACH'
        ]
    });

    assert.equal(degraded.routed, true);
    assert.equal(degraded.fallbackUsed, true);
    assert.equal(degraded.fallbackReason, 'stale_heartbeat');
    assert.equal(degraded.selectedAgentId, 'agent:alpha');
});


test('degraded fallback ignores unknown reason config and keeps default floor behavior', () => {
    const task = buildTaskRequest({
        id: '9a1a9a1a-9a1a-49a1-89a1-9a1a9a1a9a1a',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Avoid disabling degraded routing with invalid reason overrides',
        priority: 'normal',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 96_750
    });

    const alpha = {
        id: 'agent:alpha',
        status: 'idle',
        load: 0.3,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const zeta = {
        id: 'agent:zeta',
        status: 'idle',
        load: 0.3,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const degraded = routeTaskRequest(task, [zeta, alpha], {
        nowMs: 96_750,
        maxStalenessMs: 2_000,
        allowDegradedFallback: true,
        degradedFallbackReasons: ['unknown_reason']
    });

    assert.equal(degraded.routed, true);
    assert.equal(degraded.fallbackUsed, true);
    assert.equal(degraded.fallbackReason, 'stale_heartbeat');
    assert.equal(degraded.selectedAgentId, 'agent:alpha');
});


test('degraded fallback ranks stale candidates by reliability severity before deterministic id tie-breaks', () => {
    const task = buildTaskRequest({
        id: '9a9a9a9a-9a9a-49a9-89a9-9a9a9a9a9a9a',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Prefer reliable stale fallback under adversarial timeout priors',
        priority: 'normal',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 97_000
    });

    const staleReliable = {
        id: 'agent:zeta-reliable',
        status: 'idle',
        load: 0.25,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const staleTimeoutProne = {
        id: 'agent:alpha-timeout-prone',
        status: 'idle',
        load: 0.25,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const benchmarkByAgent = {
        'agent:alpha-timeout-prone': {
            samples: 60,
            successRate: 0.2,
            timeoutRate: 0.75,
            failureRate: 0.05
        },
        'agent:zeta-reliable': {
            samples: 60,
            successRate: 0.97,
            timeoutRate: 0.02,
            failureRate: 0.01
        }
    };

    const strict = routeTaskRequest(task, [staleTimeoutProne, staleReliable], {
        nowMs: 97_000,
        maxStalenessMs: 2_000,
        benchmarkByAgent
    });
    assert.equal(strict.routed, false);

    const degradedForward = routeTaskRequest(task, [staleTimeoutProne, staleReliable], {
        nowMs: 97_000,
        maxStalenessMs: 2_000,
        allowDegradedFallback: true,
        benchmarkByAgent
    });

    const degradedReverse = routeTaskRequest(task, [staleReliable, staleTimeoutProne], {
        nowMs: 97_000,
        maxStalenessMs: 2_000,
        allowDegradedFallback: true,
        benchmarkByAgent
    });

    assert.equal(degradedForward.routed, true);
    assert.equal(degradedForward.fallbackUsed, true);
    assert.equal(degradedForward.fallbackReason, 'stale_heartbeat');
    assert.equal(degradedForward.selectedAgentId, 'agent:zeta-reliable');

    assert.equal(degradedReverse.routed, true);
    assert.equal(degradedReverse.fallbackUsed, true);
    assert.equal(degradedReverse.fallbackReason, 'stale_heartbeat');
    assert.equal(degradedReverse.selectedAgentId, 'agent:zeta-reliable');
});



test('degraded fallback prioritizes stale candidates before reliability-floor breaches', () => {
    const task = buildTaskRequest({
        id: 'a1111111-1111-4111-8111-111111111111',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Keep degraded routing success floor stable',
        priority: 'normal',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 99_000
    });

    const stale = {
        id: 'agent:stale',
        status: 'idle',
        load: 0.15,
        capabilities: ['analysis'],
        timestamp: 10_000
    };

    const breached = {
        id: 'agent:breached',
        status: 'idle',
        load: 0.05,
        capabilities: ['analysis'],
        timestamp: 99_000,
        benchmark: {
            samples: 120,
            successRate: 0.25,
            timeoutRate: 0.42,
            failureRate: 0.34
        }
    };

    const strict = routeTaskRequest(task, [breached, stale], {
        nowMs: 99_000,
        maxStalenessMs: 2_000
    });
    assert.equal(strict.routed, false);

    const degradedForward = routeTaskRequest(task, [breached, stale], {
        nowMs: 99_000,
        maxStalenessMs: 2_000,
        allowDegradedFallback: true
    });
    const degradedReverse = routeTaskRequest(task, [stale, breached], {
        nowMs: 99_000,
        maxStalenessMs: 2_000,
        allowDegradedFallback: true
    });

    assert.equal(degradedForward.routed, true);
    assert.equal(degradedForward.selectedAgentId, 'agent:stale');
    assert.equal(degradedForward.fallbackReason, 'stale_heartbeat');

    assert.equal(degradedReverse.routed, true);
    assert.equal(degradedReverse.selectedAgentId, 'agent:stale');
    assert.equal(degradedReverse.fallbackReason, 'stale_heartbeat');
});


test('degraded fallback selects least-severe reliability breach deterministically', () => {
    const task = buildTaskRequest({
        id: 'b2222222-2222-4222-8222-222222222222',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Choose least-bad degraded reliability fallback',
        priority: 'normal',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 99_500
    });

    const mildBreach = {
        id: 'agent:mild-breach',
        status: 'idle',
        load: 0.2,
        capabilities: ['analysis'],
        timestamp: 99_500,
        benchmark: {
            samples: 150,
            successRate: 0.54,
            timeoutRate: 0.33,
            failureRate: 0.31
        }
    };

    const severeBreach = {
        id: 'agent:severe-breach',
        status: 'idle',
        load: 0.05,
        capabilities: ['analysis'],
        timestamp: 99_500,
        benchmark: {
            samples: 150,
            successRate: 0.2,
            timeoutRate: 0.55,
            failureRate: 0.5
        }
    };

    const degradedForward = routeTaskRequest(task, [severeBreach, mildBreach], {
        nowMs: 99_500,
        allowDegradedFallback: true
    });
    const degradedReverse = routeTaskRequest(task, [mildBreach, severeBreach], {
        nowMs: 99_500,
        allowDegradedFallback: true
    });

    assert.equal(degradedForward.routed, true);
    assert.equal(degradedForward.selectedAgentId, 'agent:mild-breach');
    assert.equal(degradedForward.fallbackReason, 'reliability_floor_breach');

    assert.equal(degradedReverse.routed, true);
    assert.equal(degradedReverse.selectedAgentId, 'agent:mild-breach');
    assert.equal(degradedReverse.fallbackReason, 'reliability_floor_breach');
});


test('critical/high routing keeps reliability-floor breaches unrouted unless explicitly allowed', () => {
    const criticalTask = buildTaskRequest({
        id: '97979797-9797-4979-8979-979797979797',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route critical incident under degraded reliability',
        priority: 'critical',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 97_000
    });

    const highTask = buildTaskRequest({
        id: '97979797-9797-4979-8979-979797979798',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route high-priority incident under degraded reliability',
        priority: 'high',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 97_500
    });

    const normalTask = buildTaskRequest({
        id: '98989898-9898-4989-8989-989898989898',
        from: 'agent:main',
        target: 'agent:placeholder',
        task: 'Route normal follow-up under degraded reliability',
        priority: 'normal',
        context: { requiredCapabilities: ['analysis'] },
        createdAt: 98_000
    });

    const agents = [
        {
            id: 'agent:breach',
            status: 'idle',
            load: 0.2,
            capabilities: ['analysis'],
            timestamp: 98_000,
            benchmark: {
                samples: 120,
                successRate: 0.42,
                timeoutRate: 0.4,
                failureRate: 0.35
            }
        }
    ];

    const criticalRoute = routeTaskRequest(criticalTask, agents, {
        nowMs: 98_000,
        allowDegradedFallback: true
    });
    assert.equal(criticalRoute.routed, false);
    assert.equal(criticalRoute.selectedAgentId, null);

    const highRoute = routeTaskRequest(highTask, agents, {
        nowMs: 98_000,
        allowDegradedFallback: true
    });
    assert.equal(highRoute.routed, false);
    assert.equal(highRoute.selectedAgentId, null);

    const highOptInRoute = routeTaskRequest(highTask, agents, {
        nowMs: 98_000,
        allowDegradedFallback: true,
        allowHighReliabilityFallback: true
    });
    assert.equal(highOptInRoute.routed, true);
    assert.equal(highOptInRoute.selectedAgentId, 'agent:breach');
    assert.equal(highOptInRoute.fallbackUsed, true);
    assert.equal(highOptInRoute.fallbackReason, 'reliability_floor_breach');

    const normalRoute = routeTaskRequest(normalTask, agents, {
        nowMs: 98_000,
        allowDegradedFallback: true
    });
    assert.equal(normalRoute.routed, true);
    assert.equal(normalRoute.selectedAgentId, 'agent:breach');
    assert.equal(normalRoute.fallbackUsed, true);
    assert.equal(normalRoute.fallbackReason, 'reliability_floor_breach');
});
