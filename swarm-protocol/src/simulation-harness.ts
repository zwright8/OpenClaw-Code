import { z } from 'zod';
import { TaskPriority } from './schemas.js';
import {
    TaskOrchestrator,
    buildTaskReceipt,
    buildTaskResult
} from './task-orchestrator.js';
import { routeTaskRequest } from './task-router.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

const ROUTING_BEHAVIOR_PRIOR_SAMPLES = 14;
const ROUTING_BEHAVIOR_PRIOR_RISK_SAMPLE_BOOST = 8;
const ROUTING_BEHAVIOR_PRIOR_LOAD_SAMPLE_BOOST = 4;
const ROUTING_RETRY_TIMEOUT_SIGNAL_WEIGHT = 0.85;
const ROUTING_OVERDUE_TIMEOUT_SIGNAL_WEIGHT = 0.5;
const ROUTING_CONSECUTIVE_FAILURE_TIMEOUT_WEIGHT = 0.2;
const ROUTING_DISPATCH_FAILURE_SIGNAL_WEIGHT = 0.45;
const ROUTING_TRANSPORT_FAILURE_SIGNAL_WEIGHT = 0.65;
const ROUTING_ACTIVE_LOAD_TIMEOUT_SIGNAL_WEIGHT = 0.18;

const AgentStatus = z.enum(['idle', 'busy', 'error', 'offline']);

const SimulationTaskSchema = z.object({
    task: z.string().min(1),
    target: z.string().optional(),
    priority: TaskPriority.default('normal'),
    context: z.record(z.any()).optional(),
    constraints: z.array(z.string()).optional(),
    requiredCapabilities: z.array(z.string()).optional()
});

const AgentBehaviorSchema = z.object({
    acceptRate: z.number().min(0).max(1).default(1),
    failureRate: z.number().min(0).max(1).default(0),
    timeoutRate: z.number().min(0).max(1).default(0),
    minReceiptDelayMs: z.number().int().nonnegative().default(5),
    maxReceiptDelayMs: z.number().int().nonnegative().default(40),
    minResultDelayMs: z.number().int().nonnegative().default(25),
    maxResultDelayMs: z.number().int().nonnegative().default(180),
    overloadThreshold: z.number().min(0).max(1).default(0.95),
    loadIncreasePerTask: z.number().min(0).max(1).default(0.12),
    recoveryPerTick: z.number().min(0).max(1).default(0.03)
}).default({});

const SimulationAgentSchema = z.object({
    id: z.string().min(1),
    status: AgentStatus.default('idle'),
    load: z.number().min(0).max(1).default(0.2),
    capabilities: z.array(z.string()).default([]),
    timestamp: z.number().int().optional(),
    behavior: AgentBehaviorSchema.default({})
});

const SimulationScenarioSchema = z.object({
    name: z.string().min(1).default('simulation'),
    seed: z.union([z.number().int(), z.string()]).optional(),
    startMs: z.number().int().default(1_000_000),
    maintenanceIntervalMs: z.number().int().positive().default(25),
    defaultTimeoutMs: z.number().int().positive().default(300),
    maxRetries: z.number().int().nonnegative().default(1),
    retryDelayMs: z.number().int().nonnegative().default(40),
    maxTicks: z.number().int().positive().default(10_000),
    maxStalenessMs: z.number().int().positive().default(60_000),
    localAgentId: z.string().min(1).default('agent:sim:main'),
    tasks: z.array(SimulationTaskSchema).nonempty(),
    agents: z.array(SimulationAgentSchema).nonempty()
});

const BenchmarkThresholdsSchema = z.object({
    minSuccessRate: z.number().min(0).max(1).optional(),
    maxTimeoutRate: z.number().min(0).max(1).optional(),
    maxFailureRate: z.number().min(0).max(1).optional(),
    maxAvgLatencyMs: z.number().nonnegative().optional(),
    maxP95LatencyMs: z.number().nonnegative().optional()
});

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function mean(values) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function percentile(values, p) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const rank = Math.ceil((p / 100) * sorted.length) - 1;
    const index = clamp(rank, 0, sorted.length - 1);
    return sorted[index];
}

function normalizeSeed(seed) {
    if (Number.isInteger(seed)) {
        return seed >>> 0;
    }

    if (typeof seed !== 'string' || !seed.trim()) {
        return 0x9e3779b9; // deterministic default
    }

    // FNV-1a 32-bit hash.
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

export function createSeededRng(seedInput) {
    let state = normalizeSeed(seedInput);
    if (state === 0) state = 1;

    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

function randomIntInclusive(rng, min, max) {
    const lo = Number.isFinite(min) ? Math.floor(min) : 0;
    const hi = Number.isFinite(max) ? Math.floor(max) : lo;
    if (hi <= lo) return lo;
    return lo + Math.floor(rng() * (hi - lo + 1));
}

function createClock(startMs) {
    let nowMs = Number.isFinite(startMs) ? Number(startMs) : Date.now();
    return {
        now: () => nowMs,
        set: (value) => {
            const next = Number(value);
            if (Number.isFinite(next) && next >= nowMs) {
                nowMs = next;
            }
        }
    };
}

function assertUniqueAgentIds(agents) {
    const seen = new Set();
    for (const agent of agents) {
        if (seen.has(agent.id)) {
            throw new Error(`Duplicate simulation agent id: ${agent.id}`);
        }
        seen.add(agent.id);
    }
}

function makeAgentRuntime(agent, startMs) {
    return {
        id: agent.id,
        status: agent.status,
        load: clamp(agent.load, 0, 1),
        capabilities: [...new Set(agent.capabilities)],
        timestamp: Number.isFinite(agent.timestamp) ? agent.timestamp : startMs,
        behavior: AgentBehaviorSchema.parse(agent.behavior || {}),
        activeTasks: 0,
        dispatchedAttempts: 0
    };
}

function toAgentSnapshot(agentRuntime, nowMs) {
    return {
        id: agentRuntime.id,
        status: agentRuntime.status,
        load: Number(agentRuntime.load.toFixed(4)),
        capabilities: [...agentRuntime.capabilities],
        timestamp: Number.isFinite(agentRuntime.timestamp)
            ? agentRuntime.timestamp
            : nowMs
    };
}

function compareSnapshotIds(a, b) {
    const idA = typeof a?.id === 'string' ? a.id : '';
    const idB = typeof b?.id === 'string' ? b.id : '';
    if (idA === idB) return 0;
    return idA < idB ? -1 : 1;
}

function summarizeTasks(tasks) {
    const byStatus = {};
    const latencies = [];

    for (const task of tasks) {
        byStatus[task.status] = (byStatus[task.status] || 0) + 1;
        if (Number.isFinite(task.closedAt) && Number.isFinite(task.createdAt)) {
            latencies.push(Math.max(0, task.closedAt - task.createdAt));
        }
    }

    const totalTasks = tasks.length;
    const completed = byStatus.completed || 0;
    const partial = byStatus.partial || 0;
    const failed = (byStatus.failed || 0) + (byStatus.transport_error || 0);
    const timedOut = byStatus.timed_out || 0;
    const rejected = byStatus.rejected || 0;

    return {
        totalTasks,
        terminalTasks: tasks.filter((task) => TERMINAL_STATUSES.has(task.status)).length,
        completed,
        partial,
        failed,
        timedOut,
        rejected,
        successRate: totalTasks > 0 ? Number((completed / totalTasks).toFixed(4)) : 0,
        completionRate: totalTasks > 0 ? Number(((completed + partial) / totalTasks).toFixed(4)) : 0,
        failureRate: totalTasks > 0 ? Number((failed / totalTasks).toFixed(4)) : 0,
        timeoutRate: totalTasks > 0 ? Number((timedOut / totalTasks).toFixed(4)) : 0,
        avgLatencyMs: latencies.length > 0 ? Number(mean(latencies).toFixed(2)) : 0,
        latencyP95Ms: latencies.length > 0 ? Number(percentile(latencies, 95).toFixed(2)) : 0,
        byStatus
    };
}

function summarizeAgents(tasks, runtimeById) {
    const summaryById = new Map();

    for (const runtime of runtimeById.values()) {
        summaryById.set(runtime.id, {
            agentId: runtime.id,
            status: runtime.status,
            load: Number(runtime.load.toFixed(4)),
            capabilities: [...runtime.capabilities],
            tasks: 0,
            completed: 0,
            partial: 0,
            failed: 0,
            timedOut: 0,
            rejected: 0,
            attempts: 0
        });
    }

    for (const task of tasks) {
        const row = summaryById.get(task.target);
        if (!row) continue;

        row.tasks++;
        row.attempts += Number(task.attempts) || 0;
        if (task.status === 'completed') row.completed++;
        if (task.status === 'partial') row.partial++;
        if (task.status === 'failed' || task.status === 'transport_error') row.failed++;
        if (task.status === 'timed_out') row.timedOut++;
        if (task.status === 'rejected') row.rejected++;
    }

    return [...summaryById.values()].sort((a, b) => a.agentId.localeCompare(b.agentId));
}

function deriveBehaviorPriorSamples(runtime) {
    const acceptRate = clamp(runtime?.behavior?.acceptRate ?? 1, 0, 1);
    const timeoutRate = clamp(runtime?.behavior?.timeoutRate ?? 0, 0, 1);
    const failureRate = clamp(runtime?.behavior?.failureRate ?? 0, 0, 1);
    const rejectionRate = clamp(1 - acceptRate, 0, 1);

    const riskScore = clamp(
        (timeoutRate * 1.35)
        + (failureRate * 1.05)
        + (rejectionRate * 0.8),
        0,
        2
    );
    const riskRatio = clamp(riskScore / 1.2, 0, 1);

    const overloadThreshold = clamp(runtime?.behavior?.overloadThreshold ?? 0.95, 0, 1);
    const load = clamp(runtime?.load ?? 0, 0, 1);
    const loadPressure = overloadThreshold <= 0
        ? 1
        : clamp(load / overloadThreshold, 0, 1.25);
    const loadRatio = clamp((loadPressure - 0.6) / 0.65, 0, 1);

    const priorSamples = ROUTING_BEHAVIOR_PRIOR_SAMPLES
        + (riskRatio * ROUTING_BEHAVIOR_PRIOR_RISK_SAMPLE_BOOST)
        + (loadRatio * ROUTING_BEHAVIOR_PRIOR_LOAD_SAMPLE_BOOST);

    return Number(priorSamples.toFixed(4));
}

function buildRoutingBenchmarkByAgent(tasks, runtimeById = null, nowMs = null) {
    const aggregateByAgent = new Map();

    const ensureAggregate = (agentId) => {
        if (!aggregateByAgent.has(agentId)) {
            aggregateByAgent.set(agentId, {
                samples: 0,
                successes: 0,
                timeouts: 0,
                failures: 0,
                latencies: []
            });
        }

        return aggregateByAgent.get(agentId);
    };

    if (runtimeById instanceof Map) {
        for (const runtime of runtimeById.values()) {
            if (!runtime || typeof runtime.id !== 'string') continue;

            const acceptRate = clamp(runtime.behavior?.acceptRate ?? 1, 0, 1);
            const timeoutRate = clamp(runtime.behavior?.timeoutRate ?? 0, 0, 1);
            const behaviorFailureRate = clamp(runtime.behavior?.failureRate ?? 0, 0, 1);
            const rejectionRate = clamp(1 - acceptRate, 0, 1);
            const failureRate = clamp(rejectionRate + (behaviorFailureRate * (1 - timeoutRate)), 0, 1);
            const successRate = clamp(1 - timeoutRate - failureRate, 0, 1);

            const priorSamples = deriveBehaviorPriorSamples(runtime);
            const aggregate = ensureAggregate(runtime.id);
            aggregate.samples += priorSamples;
            aggregate.successes += successRate * priorSamples;
            aggregate.timeouts += timeoutRate * priorSamples;
            aggregate.failures += failureRate * priorSamples;

            const activeLoadSignals = Math.max(0, (Number(runtime.activeTasks) || 0) - 1)
                * ROUTING_ACTIVE_LOAD_TIMEOUT_SIGNAL_WEIGHT;
            if (activeLoadSignals > 0) {
                aggregate.samples += activeLoadSignals;
                aggregate.timeouts += activeLoadSignals;
            }
        }
    }

    for (const task of tasks) {
        if (!task || typeof task.target !== 'string' || !task.target.trim()) continue;

        const aggregate = ensureAggregate(task.target);

        if (TERMINAL_STATUSES.has(task.status)) {
            aggregate.samples += 1;

            if (task.status === 'completed' || task.status === 'partial') {
                aggregate.successes += 1;
            } else if (task.status === 'timed_out') {
                aggregate.timeouts += 1;
            } else if (task.status === 'failed' || task.status === 'transport_error' || task.status === 'rejected') {
                aggregate.failures += 1;
            }

            if (Number.isFinite(task.closedAt) && Number.isFinite(task.createdAt)) {
                aggregate.latencies.push(Math.max(0, task.closedAt - task.createdAt));
            }
            continue;
        }

        let timeoutSignals = 0;
        let failureSignals = 0;

        if (task.status === 'retry_scheduled') {
            timeoutSignals += ROUTING_RETRY_TIMEOUT_SIGNAL_WEIGHT;
        }

        if ((task.status === 'dispatched' || task.status === 'acknowledged')
            && Number.isFinite(nowMs)
            && Number.isFinite(task.deadlineAt)
            && Number(task.deadlineAt) <= Number(nowMs)) {
            timeoutSignals += ROUTING_OVERDUE_TIMEOUT_SIGNAL_WEIGHT;
        }

        const lifecycle = task.retryLifecycle && typeof task.retryLifecycle === 'object'
            ? task.retryLifecycle
            : null;

        const consecutiveFailures = lifecycle
            ? Math.max(0, Number(lifecycle.consecutiveFailures) || 0)
            : 0;
        if (consecutiveFailures > 0) {
            timeoutSignals += Math.min(1, consecutiveFailures * ROUTING_CONSECUTIVE_FAILURE_TIMEOUT_WEIGHT);
        }

        const history = Array.isArray(task.history) ? task.history : [];
        for (const entry of history) {
            if (!entry || typeof entry !== 'object') continue;

            if (entry.event === 'send_failed') {
                failureSignals += ROUTING_DISPATCH_FAILURE_SIGNAL_WEIGHT;
            }

            if (entry.event === 'transport_error') {
                failureSignals += ROUTING_TRANSPORT_FAILURE_SIGNAL_WEIGHT;
            }

            if (entry.event === 'timed_out') {
                timeoutSignals += ROUTING_RETRY_TIMEOUT_SIGNAL_WEIGHT;
            }
        }

        const signalSamples = timeoutSignals + failureSignals;
        if (signalSamples > 0) {
            aggregate.samples += signalSamples;
            aggregate.timeouts += timeoutSignals;
            aggregate.failures += failureSignals;
        }
    }

    const benchmarkByAgent = {};
    for (const [agentId, aggregate] of aggregateByAgent.entries()) {
        const samples = aggregate.samples;
        if (!samples) continue;

        benchmarkByAgent[agentId] = {
            samples: Number(samples.toFixed(4)),
            successRate: Number((aggregate.successes / samples).toFixed(4)),
            timeoutRate: Number((aggregate.timeouts / samples).toFixed(4)),
            failureRate: Number((aggregate.failures / samples).toFixed(4)),
            avgLatencyMs: aggregate.latencies.length > 0
                ? Number(mean(aggregate.latencies).toFixed(2))
                : null,
            p95LatencyMs: aggregate.latencies.length > 0
                ? Number(percentile(aggregate.latencies, 95).toFixed(2))
                : null
        };
    }

    return benchmarkByAgent;
}

function applyRecovery(runtimeById) {
    for (const runtime of runtimeById.values()) {
        const recovery = clamp(runtime.behavior.recoveryPerTick, 0, 1);
        runtime.load = clamp(runtime.load - recovery, 0, 1);

        if (runtime.status === 'busy' && runtime.activeTasks === 0 && runtime.load < 0.65) {
            runtime.status = 'idle';
        }
    }
}

function deriveRunSeed(baseSeed, offset) {
    if (offset <= 0) return baseSeed;
    return `${String(baseSeed)}:${offset}`;
}

export function validateSimulationScenario(scenarioPayload) {
    const scenario = SimulationScenarioSchema.parse(scenarioPayload);
    assertUniqueAgentIds(scenario.agents);
    return scenario;
}

export async function runSimulationScenario(scenarioPayload, options = {}) {
    const scenario = validateSimulationScenario(scenarioPayload);
    const seedInput = options.seed ?? scenario.seed ?? 1;
    const rng = createSeededRng(seedInput);

    const clock = createClock(scenario.startMs);
    const runtimeById = new Map(
        scenario.agents.map((agent) => [agent.id, makeAgentRuntime(agent, scenario.startMs)])
    );

    const eventQueue = [];
    let eventSequence = 0;
    let nextMaintenanceAt = clock.now() + scenario.maintenanceIntervalMs;
    const maintenanceHistory = [];
    const dispatchErrors = [];

    let orchestrator = null;

    const routeTask = async (taskRequest) => {
        const nowMs = clock.now();
        const snapshots = [...runtimeById.values()]
            .map((runtime) => toAgentSnapshot(runtime, nowMs))
            .sort(compareSnapshotIds);
        const benchmarkByAgent = orchestrator
            ? buildRoutingBenchmarkByAgent(orchestrator.listTasks(), runtimeById, nowMs)
            : buildRoutingBenchmarkByAgent([], runtimeById, nowMs);

        const strictRouteOptions = {
            nowMs,
            maxStalenessMs: scenario.maxStalenessMs,
            benchmarkByAgent,
            benchmarkThresholds: {
                minSuccessRate: 0.72,
                maxTimeoutRate: 0.24,
                maxFailureRate: 0.2,
                maxP95LatencyMs: 650
            },
            benchmarkWeights: {
                successRate: 26,
                timeoutRate: 18,
                failureRate: 15,
                avgLatencyMs: 8,
                p95LatencyMs: 7
            },
            minSamplesForFullConfidence: 12,
            statusWeights: {
                idle: 100,
                busy: 92,
                degraded: 70,
                error: 18,
                offline: 0
            },
            loadPenaltyWeight: 2,
            surgeLoadPenaltyWeight: 12,
            timeoutPenaltyWeight: 22,
            failurePenaltyWeight: 24,
            timeoutPressureWeight: 24,
            timeoutPressureTriggerRatio: 0.3,
            timeoutPressureExponent: 2.35,
            timeoutPressureFullConfidenceSamples: 12,
            p95TimeoutPressureWeight: 8,
            p95TimeoutPressureTriggerRatio: 0.58,
            p95TimeoutPressureExponent: 2.2,
            reliabilityFloorMinSamples: 6,
            reliabilityFloorSuccessRatio: 0.95,
            reliabilityFloorOverageRatio: 1.02
        };

        const strictRoute = routeTaskRequest(taskRequest, snapshots, strictRouteOptions);

        if (strictRoute.selectedAgentId) {
            return strictRoute.selectedAgentId;
        }

        const degradedRoute = routeTaskRequest(taskRequest, snapshots, {
            ...strictRouteOptions,
            allowDegradedFallback: true,
            allowHighReliabilityFallback: false,
            allowCriticalReliabilityFallback: false,
            degradedFallbackReasons: ['stale_heartbeat', 'reliability_floor_breach']
        });

        return degradedRoute.selectedAgentId;
    };

    function scheduleEvent(event) {
        eventQueue.push({ ...event, seq: eventSequence++ });
        eventQueue.sort((a, b) => {
            if (a.at !== b.at) return a.at - b.at;
            return a.seq - b.seq;
        });
    }

    function scheduleAgentBehavior(target, request) {
        const runtime = runtimeById.get(target);
        if (!runtime) {
            throw new Error(`Unknown target agent: ${target}`);
        }

        const behavior = runtime.behavior;
        const nowMs = clock.now();
        runtime.dispatchedAttempts++;
        runtime.timestamp = nowMs;

        const overloaded = runtime.load >= behavior.overloadThreshold;
        const statusBlocked = runtime.status === 'offline' || runtime.status === 'error';
        const acceptedByRate = rng() <= behavior.acceptRate;
        const accepted = !overloaded && !statusBlocked && acceptedByRate;
        const silentTimeout = rng() < behavior.timeoutRate;

        const receiptAt = nowMs + randomIntInclusive(
            rng,
            behavior.minReceiptDelayMs,
            behavior.maxReceiptDelayMs
        );

        if (accepted) {
            runtime.activeTasks += 1;
            runtime.load = clamp(runtime.load + behavior.loadIncreasePerTask, 0, 1);
            if (runtime.status !== 'offline' && runtime.status !== 'error') {
                runtime.status = runtime.load >= 0.65 ? 'busy' : runtime.status;
            }
        }

        if (!silentTimeout) {
            scheduleEvent({
                kind: 'receipt',
                at: receiptAt,
                taskId: request.id,
                from: target,
                accepted,
                reason: accepted
                    ? null
                    : overloaded
                        ? 'worker_overloaded'
                        : statusBlocked
                            ? 'worker_unavailable'
                            : 'worker_rejected',
                etaMs: accepted
                    ? randomIntInclusive(rng, behavior.minResultDelayMs, behavior.maxResultDelayMs)
                    : null
            });
        }

        if (!accepted || silentTimeout) {
            return;
        }

        const resultDelay = randomIntInclusive(
            rng,
            behavior.minResultDelayMs,
            behavior.maxResultDelayMs
        );
        const resultStatus = rng() < behavior.failureRate ? 'failure' : 'success';

        scheduleEvent({
            kind: 'result',
            at: receiptAt + resultDelay,
            taskId: request.id,
            from: target,
            status: resultStatus,
            output: resultStatus === 'success'
                ? `Completed: ${request.task}`
                : `Failed: ${request.task}`,
            loadDelta: behavior.loadIncreasePerTask
        });
    }

    orchestrator = new TaskOrchestrator({
        localAgentId: scenario.localAgentId,
        transport: {
            async send(target, request) {
                scheduleAgentBehavior(target, request);
            }
        },
        routeTask,
        defaultTimeoutMs: scenario.defaultTimeoutMs,
        maxRetries: scenario.maxRetries,
        retryDelayMs: scenario.retryDelayMs,
        now: clock.now,
        logger: {
            warn: () => {}
        }
    });

    for (const task of scenario.tasks) {
        try {
            await orchestrator.dispatchTask({
                target: task.target,
                task: task.task,
                priority: task.priority,
                context: {
                    ...(task.context || {}),
                    requiredCapabilities: task.requiredCapabilities || task.context?.requiredCapabilities
                },
                constraints: task.constraints
            });
        } catch (error) {
            dispatchErrors.push({
                task: task.task,
                priority: task.priority,
                reason: error.message
            });
        }
    }

    let maintenanceTicks = 0;
    let processedEvents = 0;

    while (maintenanceTicks < scenario.maxTicks) {
        const openTaskCount = orchestrator.listTasks({ openOnly: true }).length;
        if (openTaskCount === 0 && eventQueue.length === 0) {
            break;
        }

        const nextEventAt = eventQueue.length > 0
            ? eventQueue[0].at
            : Number.POSITIVE_INFINITY;
        const nextAt = Math.min(nextEventAt, nextMaintenanceAt);
        if (!Number.isFinite(nextAt)) {
            break;
        }

        clock.set(nextAt);

        while (eventQueue.length > 0 && eventQueue[0].at <= clock.now()) {
            const event = eventQueue.shift();
            processedEvents++;

            if (event.kind === 'receipt') {
                orchestrator.ingestReceipt(buildTaskReceipt({
                    taskId: event.taskId,
                    from: event.from,
                    accepted: event.accepted,
                    reason: event.reason || undefined,
                    etaMs: Number.isFinite(event.etaMs) ? event.etaMs : undefined,
                    timestamp: event.at
                }));
                continue;
            }

            if (event.kind === 'result') {
                const runtime = runtimeById.get(event.from);
                if (runtime) {
                    runtime.activeTasks = Math.max(0, runtime.activeTasks - 1);
                    runtime.load = clamp(runtime.load - clamp(event.loadDelta, 0, 1), 0, 1);
                    if (runtime.status !== 'offline' && runtime.status !== 'error') {
                        if (runtime.activeTasks === 0 && runtime.load < 0.65) {
                            runtime.status = 'idle';
                        }
                    }
                }

                orchestrator.ingestResult(buildTaskResult({
                    taskId: event.taskId,
                    from: event.from,
                    status: event.status,
                    output: event.output,
                    completedAt: event.at
                }));
            }
        }

        if (clock.now() >= nextMaintenanceAt) {
            applyRecovery(runtimeById);
            const maintenance = await orchestrator.runMaintenance(clock.now());
            maintenanceHistory.push({ at: clock.now(), ...maintenance });
            maintenanceTicks++;
            nextMaintenanceAt += scenario.maintenanceIntervalMs;
        }
    }

    const exhausted = maintenanceTicks >= scenario.maxTicks;
    const tasks = orchestrator.listTasks();
    const metrics = summarizeTasks(tasks);

    return {
        scenario: {
            name: scenario.name,
            seed: seedInput,
            startMs: scenario.startMs,
            taskCount: scenario.tasks.length,
            agentCount: scenario.agents.length
        },
        exhausted,
        maintenanceTicks,
        processedEvents,
        dispatchErrors,
        maintenanceHistory,
        orchestratorMetrics: orchestrator.getMetrics(),
        metrics: {
            ...metrics,
            dispatchErrorCount: dispatchErrors.length
        },
        agentSummary: summarizeAgents(tasks, runtimeById),
        tasks: clone(tasks)
    };
}

function aggregateBenchmarkRuns(runResults) {
    const successRates = runResults.map((run) => run.metrics.successRate);
    const timeoutRates = runResults.map((run) => run.metrics.timeoutRate);
    const failureRates = runResults.map((run) => run.metrics.failureRate);
    const avgLatencies = runResults.map((run) => run.metrics.avgLatencyMs);
    const p95Latencies = runResults.map((run) => run.metrics.latencyP95Ms);

    return {
        runCount: runResults.length,
        successRateAvg: Number(mean(successRates).toFixed(4)),
        successRateMin: Number((Math.min(...successRates) || 0).toFixed(4)),
        timeoutRateAvg: Number(mean(timeoutRates).toFixed(4)),
        timeoutRateMax: Number((Math.max(...timeoutRates) || 0).toFixed(4)),
        failureRateAvg: Number(mean(failureRates).toFixed(4)),
        avgLatencyMs: Number(mean(avgLatencies).toFixed(2)),
        p95LatencyMs: Number(percentile(p95Latencies, 95).toFixed(2))
    };
}

export function evaluateBenchmarkThresholds(aggregateMetrics, thresholdsPayload = {}) {
    const thresholds = BenchmarkThresholdsSchema.parse(thresholdsPayload);
    const breaches = [];

    function maxRule(name, actual, maxAllowed) {
        if (!Number.isFinite(maxAllowed)) return;
        if (actual <= maxAllowed) return;
        breaches.push({
            metric: name,
            expected: `<= ${maxAllowed}`,
            actual
        });
    }

    function minRule(name, actual, minAllowed) {
        if (!Number.isFinite(minAllowed)) return;
        if (actual >= minAllowed) return;
        breaches.push({
            metric: name,
            expected: `>= ${minAllowed}`,
            actual
        });
    }

    minRule('successRateAvg', aggregateMetrics.successRateAvg, thresholds.minSuccessRate);
    maxRule('timeoutRateAvg', aggregateMetrics.timeoutRateAvg, thresholds.maxTimeoutRate);
    maxRule('failureRateAvg', aggregateMetrics.failureRateAvg, thresholds.maxFailureRate);
    maxRule('avgLatencyMs', aggregateMetrics.avgLatencyMs, thresholds.maxAvgLatencyMs);
    maxRule('p95LatencyMs', aggregateMetrics.p95LatencyMs, thresholds.maxP95LatencyMs);

    return {
        ok: breaches.length === 0,
        breaches
    };
}

export async function runSimulationBenchmark({
    scenario,
    runs = 10,
    seeds = null,
    startSeed = null,
    thresholds = null
} = {}) {
    if (!scenario || typeof scenario !== 'object') {
        throw new Error('scenario is required for benchmark runs');
    }

    const validatedScenario = validateSimulationScenario(scenario);
    const runCount = Number.isInteger(runs) && runs > 0 ? runs : 10;
    const runResults = [];

    const seedPool = Array.isArray(seeds) && seeds.length > 0
        ? [...seeds]
        : [];

    const baseSeed = startSeed ?? validatedScenario.seed ?? 1;
    while (seedPool.length < runCount) {
        seedPool.push(deriveRunSeed(baseSeed, seedPool.length));
    }

    for (let index = 0; index < runCount; index++) {
        const seed = seedPool[index];
        const result = await runSimulationScenario(
            {
                ...validatedScenario,
                seed
            },
            {
                seed
            }
        );

        runResults.push({
            run: index + 1,
            seed,
            metrics: result.metrics,
            exhausted: result.exhausted,
            dispatchErrorCount: result.dispatchErrors.length
        });
    }

    const aggregate = aggregateBenchmarkRuns(runResults);
    const thresholdEvaluation = thresholds
        ? evaluateBenchmarkThresholds(aggregate, thresholds)
        : null;

    return {
        scenario: {
            name: validatedScenario.name,
            taskCount: validatedScenario.tasks.length,
            agentCount: validatedScenario.agents.length
        },
        runCount,
        runs: runResults,
        aggregate,
        thresholds: thresholdEvaluation
    };
}

export const __simulationHarnessInternals = {
    SimulationScenarioSchema,
    BenchmarkThresholdsSchema,
    aggregateBenchmarkRuns,
    normalizeSeed,
    percentile,
    mean
};
