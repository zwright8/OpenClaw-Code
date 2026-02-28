import test from 'node:test';
import assert from 'node:assert/strict';
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
