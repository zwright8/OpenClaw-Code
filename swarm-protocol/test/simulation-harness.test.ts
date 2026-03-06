import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
    evaluateBenchmarkThresholds,
    runSimulationBenchmark,
    runSimulationScenario,
    validateSimulationScenario
} from '../index.js';

function makeBaseScenario() {
    return {
        name: 'deterministic-smoke',
        seed: 1337,
        startMs: 50_000,
        maintenanceIntervalMs: 10,
        defaultTimeoutMs: 120,
        maxRetries: 1,
        retryDelayMs: 10,
        maxTicks: 1_000,
        tasks: [
            {
                task: 'Summarize reliability incidents',
                priority: 'high',
                requiredCapabilities: ['analysis']
            },
            {
                task: 'Create follow-up action list',
                priority: 'normal',
                requiredCapabilities: ['analysis']
            },
            {
                task: 'Draft operator checklist',
                priority: 'normal',
                requiredCapabilities: ['operations']
            },
            {
                task: 'Validate rollback plan',
                priority: 'high',
                requiredCapabilities: ['operations']
            }
        ],
        agents: [
            {
                id: 'agent:analysis',
                status: 'idle',
                load: 0.2,
                capabilities: ['analysis'],
                behavior: {
                    failureRate: 0.1,
                    timeoutRate: 0.05,
                    minResultDelayMs: 20,
                    maxResultDelayMs: 60
                }
            },
            {
                id: 'agent:ops',
                status: 'idle',
                load: 0.25,
                capabilities: ['operations'],
                behavior: {
                    failureRate: 0.05,
                    timeoutRate: 0.05,
                    minResultDelayMs: 25,
                    maxResultDelayMs: 80
                }
            }
        ]
    };
}

test('validateSimulationScenario rejects duplicate agent ids', () => {
    const scenario = makeBaseScenario();
    scenario.agents.push({
        ...scenario.agents[0],
        capabilities: ['analysis', 'docs']
    });

    assert.throws(
        () => validateSimulationScenario(scenario),
        /Duplicate simulation agent id/
    );
});

test('runSimulationScenario is deterministic for same seed + scenario', async () => {
    const scenario = makeBaseScenario();

    const runA = await runSimulationScenario(scenario);
    const runB = await runSimulationScenario(scenario);

    assert.deepEqual(runA.metrics, runB.metrics);
    assert.equal(runA.metrics.totalTasks, scenario.tasks.length);
    assert.equal(runA.dispatchErrors.length, 0);
});

test('timeout-heavy scenario drives timeout rate', async () => {
    const scenario = {
        name: 'timeout-heavy',
        seed: 42,
        startMs: 10_000,
        maintenanceIntervalMs: 5,
        defaultTimeoutMs: 30,
        maxRetries: 0,
        retryDelayMs: 5,
        maxTicks: 2_000,
        tasks: [
            { task: 't1', target: 'agent:flaky', priority: 'normal' },
            { task: 't2', target: 'agent:flaky', priority: 'normal' },
            { task: 't3', target: 'agent:flaky', priority: 'normal' },
            { task: 't4', target: 'agent:flaky', priority: 'normal' }
        ],
        agents: [
            {
                id: 'agent:flaky',
                status: 'idle',
                load: 0.1,
                capabilities: ['general'],
                behavior: {
                    timeoutRate: 1,
                    failureRate: 0,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 2,
                    minResultDelayMs: 3,
                    maxResultDelayMs: 5
                }
            }
        ]
    };

    const run = await runSimulationScenario(scenario);
    assert.equal(run.metrics.totalTasks, 4);
    assert.equal(run.metrics.timedOut, 4);
    assert.equal(run.metrics.timeoutRate, 1);
    assert.equal(run.metrics.successRate, 0);
});

test('simulation exposes retry lifecycle states for timeout retries', async () => {
    const scenario = {
        name: 'retry-lifecycle-observable',
        seed: 77,
        startMs: 30_000,
        maintenanceIntervalMs: 5,
        defaultTimeoutMs: 20,
        maxRetries: 1,
        retryDelayMs: 5,
        maxTicks: 1_000,
        tasks: [
            { task: 'timeout-task', target: 'agent:slow', priority: 'normal' }
        ],
        agents: [
            {
                id: 'agent:slow',
                status: 'idle',
                load: 0.1,
                capabilities: ['general'],
                behavior: {
                    timeoutRate: 1,
                    failureRate: 0,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            }
        ]
    };

    const run = await runSimulationScenario(scenario);
    const [task] = run.tasks;

    assert.equal(task.status, 'timed_out');
    assert.ok(task.retryLifecycle);
    assert.equal(task.retryLifecycle.state, 'terminalized');

    const retryStateEvents = task.history.filter((entry) => entry.event === 'retry_state');
    assert.ok(retryStateEvents.some((entry) => entry.state === 'scheduled'));
    assert.ok(retryStateEvents.some((entry) => entry.state === 'dispatching'));
    assert.ok(retryStateEvents.some((entry) => entry.state === 'terminalized'));
});


test('runSimulationBenchmark aggregates runs and evaluates thresholds', async () => {
    const scenario = makeBaseScenario();

    const benchmark = await runSimulationBenchmark({
        scenario,
        runs: 4,
        startSeed: 900,
        thresholds: {
            minSuccessRate: 0.2,
            maxTimeoutRate: 0.8,
            maxFailureRate: 0.8,
            maxAvgLatencyMs: 1_000,
            maxP95LatencyMs: 2_000
        }
    });

    assert.equal(benchmark.runCount, 4);
    assert.equal(benchmark.runs.length, 4);
    assert.equal(typeof benchmark.aggregate.successRateAvg, 'number');
    assert.equal(benchmark.thresholds.ok, true);

    const strict = evaluateBenchmarkThresholds(benchmark.aggregate, {
        minSuccessRate: 0.99,
        maxTimeoutRate: 0.01
    });

    assert.equal(strict.ok, false);
    assert.ok(strict.breaches.length > 0);
});


test('benchmark script emits metadata contract fields without threshold input', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'simulation-benchmark-contract-'));
    const jsonPath = path.join(tempDir, 'simulation-benchmark.json');
    const markdownPath = path.join(tempDir, 'simulation-benchmark.md');

    try {
        const scriptPath = path.resolve(process.cwd(), 'scripts/run-simulation-benchmark.ts');
        const scenarioPath = path.resolve(process.cwd(), 'scenarios/baseline.json');
        const tsxPath = path.resolve(process.cwd(), 'node_modules/.bin/tsx');

        const run = spawnSync(
            tsxPath,
            [
                scriptPath,
                '--scenario',
                scenarioPath,
                '--runs',
                '1',
                '--json',
                jsonPath,
                '--markdown',
                markdownPath
            ],
            {
                cwd: process.cwd(),
                encoding: 'utf8'
            }
        );

        assert.equal(run.status, 0, `stdout:\n${run.stdout}\nstderr:\n${run.stderr}`);

        const benchmark = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        assert.equal(typeof benchmark.generatedAt, 'string');
        assert.ok(benchmark.generatedAt.length > 0);

        assert.equal(typeof benchmark.thresholdCheck, 'object');
        assert.equal(benchmark.thresholdCheck.requested, false);
        assert.equal(benchmark.thresholdCheck.ok, true);
        assert.equal(benchmark.thresholdCheck.breachCount, 0);
        assert.deepEqual(benchmark.thresholdCheck.breaches, []);

        const markdown = fs.readFileSync(markdownPath, 'utf8');
        assert.match(markdown, /^Generated At: /m);
        assert.match(markdown, /^Threshold Check: NOT_REQUESTED$/m);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});


test('runSimulationScenario uses degraded fallback when all healthy agents are stale', async () => {
    const scenario = {
        name: 'stale-only-degraded-fallback',
        seed: 1001,
        startMs: 20_000,
        maintenanceIntervalMs: 5,
        defaultTimeoutMs: 120,
        maxRetries: 0,
        retryDelayMs: 5,
        maxTicks: 2_000,
        maxStalenessMs: 2_000,
        tasks: [
            { task: 'stale-fallback-1', priority: 'normal', requiredCapabilities: ['analysis'] },
            { task: 'stale-fallback-2', priority: 'normal', requiredCapabilities: ['analysis'] }
        ],
        agents: [
            {
                id: 'agent:zeta',
                status: 'idle',
                load: 0.3,
                capabilities: ['analysis'],
                timestamp: 10_000,
                behavior: {
                    timeoutRate: 0,
                    failureRate: 0,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            },
            {
                id: 'agent:alpha',
                status: 'idle',
                load: 0.3,
                capabilities: ['analysis'],
                timestamp: 10_000,
                behavior: {
                    timeoutRate: 0,
                    failureRate: 0,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            }
        ]
    };

    const runForward = await runSimulationScenario(scenario);
    const runReverse = await runSimulationScenario({
        ...scenario,
        agents: [...scenario.agents].reverse()
    });

    assert.equal(runForward.dispatchErrors.length, 0);
    assert.equal(runForward.metrics.completed, 2);
    assert.ok(runForward.tasks.every((task) => task.target === 'agent:alpha'));

    assert.equal(runReverse.dispatchErrors.length, 0);
    assert.equal(runReverse.metrics.completed, 2);
    assert.ok(runReverse.tasks.every((task) => task.target === 'agent:alpha'));
    assert.equal(runReverse.metrics.successRate, runForward.metrics.successRate);
});


test('runSimulationScenario prefers reliable stale fallback under adversarial timeout priors', async () => {
    const scenario = {
        name: 'stale-timeout-adversarial-floor',
        seed: 7331,
        startMs: 70_000,
        maintenanceIntervalMs: 5,
        defaultTimeoutMs: 120,
        maxRetries: 0,
        retryDelayMs: 5,
        maxTicks: 2_000,
        maxStalenessMs: 2_000,
        tasks: Array.from({ length: 6 }, (_, idx) => ({
            task: `stale-adversarial-task-${idx + 1}`,
            priority: 'normal',
            requiredCapabilities: ['analysis']
        })),
        agents: [
            {
                id: 'agent:alpha-timeout-prone',
                status: 'idle',
                load: 0.2,
                capabilities: ['analysis'],
                timestamp: 10_000,
                behavior: {
                    timeoutRate: 1,
                    failureRate: 0,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            },
            {
                id: 'agent:zeta-reliable',
                status: 'idle',
                load: 0.2,
                capabilities: ['analysis'],
                timestamp: 10_000,
                behavior: {
                    timeoutRate: 0,
                    failureRate: 0,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            }
        ]
    };

    const run = await runSimulationScenario(scenario);

    assert.equal(run.dispatchErrors.length, 0);
    assert.equal(run.metrics.timeoutRate, 0);
    assert.ok(run.tasks.every((task) => task.target === 'agent:zeta-reliable'));

    const timeoutProne = run.agentSummary.find((entry) => entry.agentId === 'agent:alpha-timeout-prone');
    const reliable = run.agentSummary.find((entry) => entry.agentId === 'agent:zeta-reliable');

    assert.equal(timeoutProne.tasks, 0);
    assert.equal(reliable.tasks, scenario.tasks.length);
});



test('runSimulationScenario prioritizes stale degraded fallback over reliability breaches', async () => {
    const scenario = {
        name: 'stale-over-breach-degraded-fallback',
        seed: 3030,
        startMs: 50_000,
        maintenanceIntervalMs: 5,
        defaultTimeoutMs: 120,
        maxRetries: 0,
        retryDelayMs: 5,
        maxTicks: 2_000,
        maxStalenessMs: 2_000,
        tasks: Array.from({ length: 4 }, (_, idx) => ({
            task: `stale-floor-task-${idx + 1}`,
            priority: 'normal',
            requiredCapabilities: ['analysis']
        })),
        agents: [
            {
                id: 'agent:fresh-breach',
                status: 'idle',
                load: 0.2,
                capabilities: ['analysis'],
                timestamp: 50_000,
                behavior: {
                    timeoutRate: 0,
                    failureRate: 1,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            },
            {
                id: 'agent:stale-reliable',
                status: 'idle',
                load: 0.2,
                capabilities: ['analysis'],
                timestamp: 10_000,
                behavior: {
                    timeoutRate: 0,
                    failureRate: 0,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            }
        ]
    };

    const run = await runSimulationScenario(scenario);

    assert.equal(run.dispatchErrors.length, 0);
    assert.equal(run.metrics.completed, 4);
    assert.ok(run.tasks.every((task) => task.target === 'agent:stale-reliable'));
    assert.ok(run.metrics.successRate >= 1);
});


test('runSimulationScenario keeps high-priority reliability breaches fail-closed under degraded routing', async () => {
    const scenario = {
        name: 'high-priority-reliability-fail-closed',
        seed: 9090,
        startMs: 55_000,
        maintenanceIntervalMs: 5,
        defaultTimeoutMs: 120,
        maxRetries: 0,
        retryDelayMs: 5,
        maxTicks: 2_000,
        tasks: [
            { task: 'high-fail-closed-1', priority: 'high', requiredCapabilities: ['analysis'] },
            { task: 'high-fail-closed-2', priority: 'high', requiredCapabilities: ['analysis'] },
            { task: 'normal-control', priority: 'normal', requiredCapabilities: ['analysis'] }
        ],
        agents: [
            {
                id: 'agent:high-breach',
                status: 'idle',
                load: 0.2,
                capabilities: ['analysis'],
                timestamp: 55_000,
                behavior: {
                    timeoutRate: 0,
                    failureRate: 1,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            }
        ]
    };

    const run = await runSimulationScenario(scenario);

    assert.equal(run.dispatchErrors.length, 2);
    assert.ok(run.dispatchErrors.every((entry) => entry.priority === 'high'));
    assert.equal(run.metrics.totalTasks, 1);
    assert.equal(run.metrics.completed, 0);
    assert.equal(run.metrics.failed, 1);
    assert.equal(run.tasks.length, 1);
    assert.equal(run.tasks[0].request.priority, 'normal');
    assert.equal(run.tasks[0].target, 'agent:high-breach');
});


test('runSimulationScenario uses routing benchmark feedback to raise deterministic success floor', async () => {
    const scenario = {
        name: 'routing-feedback-success-floor',
        seed: 2026,
        startMs: 40_000,
        maintenanceIntervalMs: 5,
        defaultTimeoutMs: 120,
        maxRetries: 0,
        retryDelayMs: 5,
        maxTicks: 2_000,
        tasks: Array.from({ length: 8 }, (_, idx) => ({
            task: `feedback-task-${idx + 1}`,
            priority: 'normal',
            requiredCapabilities: ['analysis']
        })),
        agents: [
            {
                id: 'agent:alpha-flaky',
                status: 'idle',
                load: 0.2,
                capabilities: ['analysis'],
                behavior: {
                    timeoutRate: 0,
                    failureRate: 1,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            },
            {
                id: 'agent:zeta-reliable',
                status: 'idle',
                load: 0.2,
                capabilities: ['analysis'],
                behavior: {
                    timeoutRate: 0,
                    failureRate: 0,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 1,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 2
                }
            }
        ]
    };

    const run = await runSimulationScenario(scenario);

    const flaky = run.agentSummary.find((entry) => entry.agentId === 'agent:alpha-flaky');
    const reliable = run.agentSummary.find((entry) => entry.agentId === 'agent:zeta-reliable');

    assert.equal(run.dispatchErrors.length, 0);
    assert.ok(flaky.tasks <= 1);
    assert.ok(reliable.tasks >= 7);
    assert.ok(run.metrics.successRate >= 0.875);
});


test('runSimulationBenchmark reduces timeout variance under adverse seeds while keeping replay deterministic', async () => {
    const scenario = {
        name: 'adverse-timeout-variance-floor',
        seed: 5151,
        startMs: 65_000,
        maintenanceIntervalMs: 5,
        defaultTimeoutMs: 140,
        maxRetries: 0,
        retryDelayMs: 5,
        maxTicks: 3_000,
        tasks: Array.from({ length: 10 }, (_, idx) => ({
            task: `timeout-variance-task-${idx + 1}`,
            priority: 'normal',
            requiredCapabilities: ['analysis']
        })),
        agents: [
            {
                id: 'agent:timeout-prone',
                status: 'idle',
                load: 0.35,
                capabilities: ['analysis'],
                behavior: {
                    timeoutRate: 0.42,
                    failureRate: 0.02,
                    overloadThreshold: 0.7,
                    loadIncreasePerTask: 0.2,
                    recoveryPerTick: 0.04,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 2,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 4
                }
            },
            {
                id: 'agent:timeout-stable',
                status: 'idle',
                load: 0.1,
                capabilities: ['analysis'],
                behavior: {
                    timeoutRate: 0.03,
                    failureRate: 0.01,
                    loadIncreasePerTask: 0.04,
                    recoveryPerTick: 0.12,
                    minReceiptDelayMs: 1,
                    maxReceiptDelayMs: 2,
                    minResultDelayMs: 2,
                    maxResultDelayMs: 4
                }
            }
        ]
    };

    const benchmark = await runSimulationBenchmark({
        scenario,
        runs: 6,
        startSeed: scenario.seed
    });

    assert.equal(typeof benchmark.aggregate.successRateMin, 'number');
    assert.equal(typeof benchmark.aggregate.timeoutRateMax, 'number');
    assert.ok(benchmark.aggregate.successRateMin >= 0.8);
    assert.ok(benchmark.aggregate.timeoutRateMax <= 0.2);

    const replayA = await runSimulationScenario(scenario);
    const replayB = await runSimulationScenario(scenario);

    assert.deepEqual(replayA.metrics, replayB.metrics);
    assert.deepEqual(
        replayA.tasks.map((task) => task.target),
        replayB.tasks.map((task) => task.target)
    );
});
