import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    FileTaskStore,
    SignedAuditLog,
    TaskOrchestrator,
    TaskOrchestratorError,
    buildTaskReceipt,
    buildTaskRequest,
    buildTaskResult
} from '../index.js';

function createClock(startMs = 1_000) {
    let nowMs = startMs;
    return {
        now: () => nowMs,
        set: (value) => {
            nowMs = value;
        },
        advance: (delta) => {
            nowMs += delta;
        }
    };
}

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'swarm-orchestrator-'));
}

test('dispatchTask sends validated request and tracks state', async () => {
    const sent = [];
    const clock = createClock(10_000);

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now,
        defaultTimeoutMs: 500
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-1',
        task: 'Generate a release summary',
        context: { sprint: '2026-W09' }
    });

    assert.equal(sent.length, 1);
    assert.equal(sent[0].target, 'agent:worker-1');
    assert.equal(sent[0].message.kind, 'task_request');
    assert.equal(task.status, 'dispatched');
    assert.equal(task.attempts, 1);
    assert.equal(task.deadlineAt, 10_500);
});

test('dispatchTask applies per-task timeout override from context within bounds', async () => {
    const clock = createClock(12_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 500,
        minTaskTimeoutMs: 100,
        maxTaskTimeoutMs: 2_000
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-timeout',
        task: 'Use explicit timeout budget',
        context: { timeoutMs: 1_500 }
    });

    assert.equal(task.taskTimeoutMs, 1_500);
    assert.equal(task.deadlineAt, 13_500);
});

test('task timeout constraints are clamped and cap acknowledgement eta deadlines', async () => {
    const clock = createClock(13_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 2_000,
        minTaskTimeoutMs: 100,
        maxTaskTimeoutMs: 1_000
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-timeout-constraint',
        task: 'Clamp timeout and eta',
        constraints: ['timeout=5s']
    });

    assert.equal(task.taskTimeoutMs, 1_000);
    assert.equal(task.deadlineAt, 14_000);

    clock.advance(25);
    const ingested = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-timeout-constraint',
        accepted: true,
        etaMs: 5_000,
        timestamp: clock.now()
    }));

    assert.equal(ingested, true);
    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.deadlineAt, 14_025);
});

test('receipt + result complete a task lifecycle', async () => {
    const clock = createClock(2_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-2',
        task: 'Analyze onboarding funnel'
    });

    clock.advance(50);
    const receiptAccepted = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-2',
        accepted: true,
        etaMs: 400,
        timestamp: clock.now()
    }));

    assert.equal(receiptAccepted, true);
    let current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'acknowledged');
    assert.equal(current.deadlineAt, 2_450);

    clock.advance(100);
    const resultAccepted = orchestrator.ingestResult(buildTaskResult({
        taskId: task.taskId,
        from: 'agent:worker-2',
        status: 'success',
        output: 'Delivered dashboard notes',
        completedAt: clock.now()
    }));

    assert.equal(resultAccepted, true);
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'completed');
    assert.equal(current.closedAt, clock.now());
});

test('non-transient rejected receipt terminates task', async () => {
    const clock = createClock(3_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-3',
        task: 'Run customer sentiment clustering'
    });

    clock.advance(10);
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-3',
        accepted: false,
        reason: 'policy_denied',
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'rejected');
    assert.equal(current.closedAt, clock.now());

    const maintenance = await orchestrator.runMaintenance(clock.now() + 10_000);
    assert.equal(maintenance.checked, 0);
});

test('transient rejected receipt schedules retry with eta hint', async () => {
    const clock = createClock(3_500);
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message, at: clock.now() });
            }
        },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 50,
        maxRetryDelayMs: 5_000,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-3b',
        task: 'Handle burst traffic'
    });

    clock.advance(10);
    const accepted = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-3b',
        accepted: false,
        reason: 'worker_overloaded',
        etaMs: 200,
        timestamp: clock.now()
    }));

    assert.equal(accepted, true);

    let current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.retryLifecycle.lastReasonCode, 'worker_transient_rejection');
    assert.equal(current.nextRetryAt, 3_710);

    clock.set(current.nextRetryAt);
    const maintenance = await orchestrator.runMaintenance(clock.now());
    assert.equal(maintenance.retried, 1);

    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 2);
    assert.equal(sent.length, 2);
});

test('retry hint is clamped to maxRetryHintMs to avoid unbounded delay', async () => {
    const clock = createClock(3_550);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 50,
        maxRetryDelayMs: 5_000,
        maxRetryHintMs: 250,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-hint-clamp',
        task: 'Protect queue from oversized retry hints'
    });

    clock.advance(10);
    const accepted = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-hint-clamp',
        accepted: false,
        reason: 'retry_after_ms:5000',
        timestamp: clock.now()
    }));

    assert.equal(accepted, true);
    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 3_810);

    const retryEvents = current.history.filter((entry) => entry.event === 'retry_scheduled');
    const lastRetryEvent = retryEvents[retryEvents.length - 1];
    assert.equal(lastRetryEvent.retryHintOriginalMs, 5_000);
    assert.equal(lastRetryEvent.retryHintMs, 250);
    assert.equal(lastRetryEvent.retryHintClamped, true);

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.retryHint.maxHintMs, 250);
    assert.equal(metrics.retryHint.clampCount, 1);
});

test('transient rejection uses the larger of etaMs and retry_after hint', async () => {
    const clock = createClock(3_580);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 50,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-hint-merge',
        task: 'Prefer safer retry hint when receipt provides multiple delays'
    });

    clock.advance(10);
    const accepted = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-hint-merge',
        accepted: false,
        reason: 'HTTP 429 retry_after_ms:2000',
        etaMs: 100,
        timestamp: clock.now()
    }));

    assert.equal(accepted, true);
    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 5_590);

    const retryEvents = current.history.filter((entry) => entry.event === 'retry_scheduled');
    const lastRetryEvent = retryEvents[retryEvents.length - 1];
    assert.equal(lastRetryEvent.retryHintOriginalMs, 2_000);
    assert.equal(lastRetryEvent.retryHintMs, 2_000);
    assert.equal(lastRetryEvent.retryHintClamped, false);
});

test('RateLimit-Reset delta seconds is parsed as retry hint', async () => {
    const clock = createClock(3_620);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 50,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-ratelimit-reset-delta',
        task: 'Respect RateLimit-Reset hints'
    });

    clock.advance(10);
    const accepted = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-ratelimit-reset-delta',
        accepted: false,
        reason: 'HTTP 429; RateLimit-Reset: 30',
        timestamp: clock.now()
    }));

    assert.equal(accepted, true);
    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 33_630);
});

test('X-RateLimit-Reset epoch seconds is parsed as retry hint', async () => {
    const clock = createClock(2_000_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 50,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-ratelimit-reset-epoch',
        task: 'Respect X-RateLimit-Reset epoch'
    });

    clock.advance(10);
    const accepted = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-ratelimit-reset-epoch',
        accepted: false,
        reason: 'HTTP 429 Too Many Requests; X-RateLimit-Reset=2005',
        timestamp: clock.now()
    }));

    assert.equal(accepted, true);
    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 2_005_000);
});

test('HTTP 429 rejected receipt is treated as transient and schedules retry', async () => {
    const clock = createClock(3_720);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 50,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-429',
        task: 'Handle upstream quota response'
    });

    clock.advance(10);
    const accepted = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-429',
        accepted: false,
        reason: 'HTTP 429 Too Many Requests',
        timestamp: clock.now()
    }));

    assert.equal(accepted, true);
    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.retryLifecycle.lastReasonCode, 'worker_transient_rejection');
});

test('repeated transient rejected receipts open target circuit and block immediate retry dispatch', async () => {
    const clock = createClock(3_900);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 4,
        retryDelayMs: 0,
        retryJitterRatio: 0,
        circuitFailureThreshold: 2,
        circuitCooldownMs: 120
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-rejection-circuit',
        task: 'Backpressure-aware transient rejection handling'
    });

    clock.advance(5);
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-rejection-circuit',
        accepted: false,
        reason: 'service_unavailable',
        timestamp: clock.now()
    }));

    let current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');

    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 2);

    clock.advance(5);
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-rejection-circuit',
        accepted: false,
        reason: 'HTTP 503 Service Unavailable',
        timestamp: clock.now()
    }));

    const blockedPass = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(blockedPass.blockedRetries, 1);
    assert.equal(blockedPass.blockedByCircuit, 1);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.retryLifecycle.lastReasonCode, 'target_circuit_open');
    assert.equal(orchestrator.getMetrics().circuits.open, 1);
});

test('auto retry safety mode blocks retries for explicitly non-idempotent tasks', async () => {
    const clock = createClock(3_800);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 50,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-non-idempotent',
        task: 'Charge customer card',
        context: {
            idempotent: false
        }
    });

    clock.set(3_950);
    const maintenance = await orchestrator.runMaintenance(clock.now());
    const current = orchestrator.getTask(task.taskId);

    assert.equal(maintenance.retrySafetyDrops, 1);
    assert.equal(current.status, 'failed');
    assert.equal(current.retryLifecycle.state, 'terminalized');
    assert.equal(current.retryLifecycle.terminalReason, 'failed:retry_unsafe_non_idempotent');
});

test('strict retry safety mode requires explicit idempotency declaration', async () => {
    const clock = createClock(4_200);
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message, at: clock.now() });
            }
        },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 20,
        retryJitterRatio: 0,
        retrySafetyMode: 'require_explicit_idempotency'
    });

    const blocked = await orchestrator.dispatchTask({
        target: 'agent:worker-strict-blocked',
        task: 'Run payment reconciliation'
    });
    const allowed = await orchestrator.dispatchTask({
        target: 'agent:worker-strict-allowed',
        task: 'Rebuild search index',
        context: {
            idempotent: true
        }
    });

    clock.set(4_350);
    const pass1 = await orchestrator.runMaintenance(clock.now());

    const blockedCurrent = orchestrator.getTask(blocked.taskId);
    const allowedCurrent = orchestrator.getTask(allowed.taskId);
    assert.equal(pass1.retrySafetyDrops, 1);
    assert.equal(pass1.scheduledRetries, 1);
    assert.equal(blockedCurrent.status, 'failed');
    assert.equal(allowedCurrent.status, 'retry_scheduled');

    clock.set(allowedCurrent.nextRetryAt);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    const retriedAllowed = orchestrator.getTask(allowed.taskId);
    assert.equal(pass2.retried, 1);
    assert.equal(retriedAllowed.status, 'dispatched');
    assert.equal(sent.length, 3);
});

test('maintenance schedules retry, retries, and times out when budget exhausted', async () => {
    const clock = createClock(4_000);
    const sent = [];

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message, at: clock.now() });
            }
        },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 1,
        retryDelayMs: 10,
        maxRetryDelayMs: 10,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-4',
        task: 'Compile usage analytics'
    });

    clock.set(4_150);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(pass1.scheduledRetries, 1);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.retryLifecycle.state, 'scheduled');
    assert.equal(current.retryLifecycle.scheduledCount, 1);

    clock.set(4_170);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass2.retried, 1);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 2);
    assert.equal(current.retryLifecycle.state, 'idle');

    clock.set(4_300);
    const pass3 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass3.timedOut, 1);
    assert.equal(current.status, 'timed_out');
    assert.equal(current.retryLifecycle.state, 'terminalized');
    assert.match(current.retryLifecycle.terminalReason, /retry_budget_exhausted/);
    assert.equal(sent.length, 2);
});

test('global retry budget terminalizes retries when window budget is exhausted', async () => {
    const clock = createClock(6_000);
    const sent = [];

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message, at: clock.now() });
            }
        },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 2,
        retryDelayMs: 10,
        retryJitterRatio: 0,
        globalRetryBudgetRatio: 0,
        globalRetryBudgetMinBaseRequests: 0,
        globalRetryBudgetMinRetries: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-budget-window',
        task: 'Guard global retry window budget'
    });

    clock.set(6_150);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    assert.equal(pass1.scheduledRetries, 1);

    clock.set(6_170);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    const current = orchestrator.getTask(task.taskId);
    assert.equal(pass2.globalRetryBudgetDrops, 1);
    assert.equal(pass2.timedOut, 1);
    assert.equal(current.status, 'timed_out');
    assert.match(current.retryLifecycle.terminalReason, /retry_budget_exhausted:global_window/);
    assert.equal(sent.length, 1);
});

test('per-target retry throttle delays retries after repeated send failures', async () => {
    const clock = createClock(6_500);
    const sent = [];
    let failSends = true;

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message, at: clock.now() });
                if (failSends) {
                    throw new Error('target overloaded');
                }
            }
        },
        now: clock.now,
        defaultTimeoutMs: 100,
        maxRetries: 4,
        retryDelayMs: 10,
        retryJitterRatio: 0,
        retryThrottleEnabled: true,
        retryThrottleMaxTokens: 1,
        retryThrottleTokenRatio: 0.5,
        retryThrottleThresholdRatio: 0.5
    });

    failSends = false;
    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-throttle',
        task: 'Exercise retry throttle'
    });

    clock.set(6_650);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    assert.equal(pass1.scheduledRetries, 1);

    failSends = true;
    clock.set(6_660);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    const afterFailure = orchestrator.getTask(task.taskId);
    assert.equal(pass2.transportFailures, 1);
    assert.equal(pass2.scheduledRetries, 1);
    assert.equal(afterFailure.status, 'retry_scheduled');

    clock.set(afterFailure.nextRetryAt);
    const pass3 = await orchestrator.runMaintenance(clock.now());
    const throttled = orchestrator.getTask(task.taskId);
    assert.equal(pass3.blockedRetries, 1);
    assert.equal(pass3.blockedByRetryThrottle, 1);
    assert.equal(throttled.status, 'retry_scheduled');
    assert.equal(throttled.retryLifecycle.lastReasonCode, 'target_retry_throttled');

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.retryThrottle.enabled, true);
    assert.equal(metrics.retryThrottle.trackedTargets, 1);
    assert.equal(metrics.retryThrottle.throttledTargets, 1);
});


test('retry scheduling uses bounded exponential backoff with jitter', async () => {
    const clock = createClock(70_000);

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        defaultTimeoutMs: 50,
        maxRetries: 3,
        retryDelayMs: 20,
        maxRetryDelayMs: 60,
        retryJitterRatio: 0.25
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-backoff',
        task: 'Exercise retry timing'
    });

    clock.set(70_100);
    await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    const delay1 = current.nextRetryAt - clock.now();
    assert.equal(current.status, 'retry_scheduled');
    assert.ok(delay1 >= 15 && delay1 <= 25);

    clock.set(current.nextRetryAt);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 2);

    clock.set(current.deadlineAt + 1);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    const delay2 = current.nextRetryAt - clock.now();
    assert.ok(delay2 >= 30 && delay2 <= 50);

    clock.set(current.nextRetryAt);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.attempts, 3);

    clock.set(current.deadlineAt + 1);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    const delay3 = current.nextRetryAt - clock.now();
    assert.ok(delay3 >= 45 && delay3 <= 60);
});

test('fixed retry strategy keeps scheduling delay stable', async () => {
    const clock = createClock(71_000);

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        defaultTimeoutMs: 50,
        maxRetries: 3,
        retryDelayMs: 20,
        retryStrategy: 'fixed',
        retryBackoffMultiplier: 3,
        maxRetryDelayMs: 200,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-fixed-backoff',
        task: 'Exercise fixed retry strategy'
    });

    clock.set(71_100);
    await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    const firstDelay = current.nextRetryAt - clock.now();
    assert.equal(firstDelay, 20);

    clock.set(current.nextRetryAt);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'dispatched');

    clock.set(current.deadlineAt + 1);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    const secondDelay = current.nextRetryAt - clock.now();
    assert.equal(secondDelay, 20);
});

test('retry failures terminate and stay terminal without looping', async () => {
    const clock = createClock(80_000);
    let attempts = 0;

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                attempts += 1;
                if (attempts > 1) {
                    throw new Error('transient outage');
                }
            }
        },
        now: clock.now,
        defaultTimeoutMs: 25,
        maxRetries: 1,
        retryDelayMs: 0,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-loop-guard',
        task: 'Ensure finite retries'
    });

    clock.set(80_050);
    await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.retryLifecycle.state, 'scheduled');

    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'transport_error');
    assert.equal(current.retryLifecycle.state, 'terminalized');
    assert.match(current.retryLifecycle.terminalReason, /retry_budget_exhausted/);

    const terminalPass = await orchestrator.runMaintenance(clock.now() + 1_000);
    assert.equal(terminalPass.checked, 0);
    assert.equal(orchestrator.getTask(task.taskId).status, 'transport_error');
});

test('retry cycle guard terminalizes malformed retry lifecycle and prevents loops', async () => {
    const clock = createClock(90_000);

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        defaultTimeoutMs: 20,
        maxRetries: 5,
        retryDelayMs: 1,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-cycle-guard',
        task: 'Guard against malformed retry state'
    });

    clock.set(90_100);
    await orchestrator.runMaintenance(clock.now());

    const mutableRecord = orchestrator.tasks.get(task.taskId);
    mutableRecord.status = 'retry_scheduled';
    mutableRecord.deadlineAt = clock.now() - 1;
    mutableRecord.nextRetryAt = null;
    mutableRecord.retryLifecycle.scheduledCount = mutableRecord.retryLifecycle.maxCycles;

    const cycleGuardPass = await orchestrator.runMaintenance(clock.now());
    const current = orchestrator.getTask(task.taskId);

    assert.equal(cycleGuardPass.timedOut, 1);
    assert.equal(current.status, 'timed_out');
    assert.equal(current.retryLifecycle.state, 'terminalized');
    assert.match(current.retryLifecycle.terminalReason, /retry_cycle_guard/);

    const postTerminalPass = await orchestrator.runMaintenance(clock.now() + 1_000);
    assert.equal(postTerminalPass.checked, 0);
});


test('retry_state emits canonical retry/backoff payloads', async () => {
    const clock = createClock(12_000);

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        defaultTimeoutMs: 25,
        maxRetries: 2,
        retryDelayMs: 5,
        maxRetryDelayMs: 5,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-transition',
        task: 'Exercise retry transition payload schema'
    });

    clock.set(12_050);
    await orchestrator.runMaintenance(clock.now());

    let current = orchestrator.getTask(task.taskId);
    let retryStateEvents = current.history.filter((entry) => entry.event === 'retry_state');
    const scheduledTransition = retryStateEvents[retryStateEvents.length - 1];
    assert.equal(scheduledTransition.state, 'scheduled');
    assert.equal(scheduledTransition.reasonCode, 'timeout');
    assert.equal(scheduledTransition.retryTransition.version, 2);
    assert.equal(scheduledTransition.retryTransition.reason.code, 'timeout');
    assert.equal(scheduledTransition.retryTransition.attemptCounters.scheduledRetries, 1);
    assert.equal(scheduledTransition.terminalClassification, 'non_terminal');

    clock.set(current.nextRetryAt);
    await orchestrator.runMaintenance(clock.now());

    current = orchestrator.getTask(task.taskId);
    retryStateEvents = current.history.filter((entry) => entry.event === 'retry_state');
    const dispatchTransition = retryStateEvents[retryStateEvents.length - 2];
    assert.equal(dispatchTransition.state, 'dispatching');
    assert.equal(dispatchTransition.reasonCode, 'timeout_retry');
    assert.equal(dispatchTransition.retryTransition.reason.code, 'timeout_retry');
    assert.equal(dispatchTransition.retryTransition.attemptCounters.retryDispatches, 1);
});

test('hydrate normalizes legacy terminal reason aliases into stable taxonomy', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const store = new FileTaskStore({ filePath: path.join(dir, 'tasks.jsonl') });
    const clock = createClock(13_000);

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        store,
        now: clock.now,
        defaultTimeoutMs: 20,
        maxRetries: 0,
        retryDelayMs: 0,
        retryJitterRatio: 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-hydrate',
        task: 'Hydrate retry taxonomy'
    });

    const mutable = orchestrator.tasks.get(task.taskId);
    mutable.status = 'transport_error';
    mutable.updatedAt = clock.now();
    mutable.closedAt = clock.now();
    mutable.retryLifecycle.state = 'terminalized';
    mutable.retryLifecycle.terminalReason = 'retry_exhausted:transport_error';
    mutable.retryLifecycle.terminalReasonCode = null;
    mutable.retryLifecycle.terminalReasonContext = null;

    await orchestrator.flush();
    await store.saveRecord(mutable);

    const restored = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        store,
        now: clock.now
    });

    const hydrated = await restored.hydrate();
    assert.equal(hydrated.loaded, 1);

    const loadedTask = restored.getTask(task.taskId);
    assert.equal(loadedTask.retryLifecycle.terminalReason, 'retry_budget_exhausted:transport_failure');
    assert.equal(loadedTask.retryLifecycle.terminalReasonCode, 'retry_budget_exhausted');
    assert.equal(loadedTask.retryLifecycle.terminalReasonContext, 'transport_failure');
    assert.equal(loadedTask.retryLifecycle.terminalClassification, 'transport_error');

    const metrics = restored.getMetrics();
    assert.equal(metrics.terminalReasonCounts['retry_budget_exhausted:transport_failure'], 1);
});

test('dispatchTask fails fast and does not keep orphaned record when send fails', async () => {
    const clock = createClock(5_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                throw new Error('network unreachable');
            }
        },
        now: clock.now
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-5',
            task: 'Generate incident postmortem'
        }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'SEND_FAILED');
            return true;
        }
    );

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.total, 0);
});

test('helper builders emit schema-valid messages', () => {
    const request = buildTaskRequest({
        from: 'agent:main',
        target: 'agent:worker-6',
        task: 'Prepare roadmap brief'
    });

    const receipt = buildTaskReceipt({
        taskId: request.id,
        from: 'agent:worker-6',
        accepted: true
    });

    const result = buildTaskResult({
        taskId: request.id,
        from: 'agent:worker-6',
        status: 'partial',
        output: 'Drafted initial outline'
    });

    assert.equal(request.kind, 'task_request');
    assert.equal(receipt.kind, 'task_receipt');
    assert.equal(result.kind, 'task_result');
});

test('dispatchTask can resolve target through routeTask callback', async () => {
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        routeTask: async () => ({ selectedAgentId: 'agent:routed' })
    });

    const task = await orchestrator.dispatchTask({
        task: 'Route me automatically'
    });

    assert.equal(task.target, 'agent:routed');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].target, 'agent:routed');
});

test('dispatchTask throws when target missing and no routeTask provided', async () => {
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        }
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({ task: 'No route available' }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'MISSING_TARGET');
            return true;
        }
    );
});

test('persists task state and hydrates after restart', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const filePath = path.join(dir, 'tasks.journal.jsonl');
    const clock = createClock(40_000);
    const store = new FileTaskStore({ filePath, now: clock.now });

    const orchestratorA = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        store
    });

    const task = await orchestratorA.dispatchTask({
        target: 'agent:worker-persist',
        task: 'Persist this task'
    });

    clock.advance(50);
    orchestratorA.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-persist',
        accepted: true,
        timestamp: clock.now()
    }));

    await orchestratorA.flush();

    const orchestratorB = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        store
    });

    const hydration = await orchestratorB.hydrate();
    assert.equal(hydration.loaded, 1);

    const reloaded = orchestratorB.getTask(task.taskId);
    assert.ok(reloaded);
    assert.equal(reloaded.status, 'acknowledged');
    assert.equal(reloaded.attempts, 1);
});

test('failed initial send deletes persisted record after flush', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const filePath = path.join(dir, 'tasks.journal.jsonl');
    const clock = createClock(50_000);
    const store = new FileTaskStore({ filePath, now: clock.now });

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                throw new Error('send failed');
            }
        },
        now: clock.now,
        store
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-fail',
            task: 'This should fail'
        }),
        /send failed/
    );

    await orchestrator.flush();
    const records = await store.loadRecords();
    assert.equal(records.length, 0);
});

test('approval policy can gate dispatch until review is approved', async () => {
    const sent = [];
    const clock = createClock(60_000);

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now,
        approvalPolicy: () => ({
            required: true,
            reason: 'policy_gate',
            reviewerGroup: 'ops-review'
        })
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-approval',
        task: 'Run production migration',
        priority: 'critical'
    });

    assert.equal(task.status, 'awaiting_approval');
    assert.equal(sent.length, 0);
    assert.equal(orchestrator.listPendingApprovals().length, 1);

    const reviewed = await orchestrator.reviewTask(task.taskId, {
        approved: true,
        reviewer: 'human:ops',
        reason: 'approved'
    });

    assert.equal(reviewed.status, 'dispatched');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].target, 'agent:worker-approval');
});

test('denied approval rejects task without dispatch', async () => {
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        approvalPolicy: () => ({
            required: true,
            reason: 'manual_review'
        })
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-approval-2',
        task: 'Publish legal statement'
    });

    const denied = await orchestrator.reviewTask(task.taskId, {
        approved: false,
        reviewer: 'human:legal',
        reason: 'needs rewrite'
    });

    assert.equal(denied.status, 'rejected');
    assert.equal(sent.length, 0);
});

test('dispatch policy can deny task before send', async () => {
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        dispatchPolicy: () => ({
            allowed: false,
            reasons: [{ code: 'blocked_capability', reason: 'destructive_shell' }]
        })
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-policy',
            task: 'Attempt blocked action'
        }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'POLICY_DENIED');
            return true;
        }
    );

    assert.equal(orchestrator.getMetrics().total, 0);
});

test('dispatch policy can sanitize request before dispatch', async () => {
    let sent = null;
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent = { target, message };
            }
        },
        dispatchPolicy: () => ({
            allowed: true,
            redactions: [{ path: 'task', pattern: 'api_key_assignment', count: 1 }],
            taskRequest: {
                task: 'Sanitized task content',
                context: { safe: true }
            }
        })
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-policy',
        task: 'Leaked api_key=super-secret'
    });

    assert.ok(sent);
    assert.equal(sent.message.task, 'Sanitized task content');
    assert.equal(task.request.task, 'Sanitized task content');
    assert.equal(task.policy.redactions.length, 1);
});

test('audit log records signed lifecycle entries', async () => {
    const auditLog = new SignedAuditLog({
        secret: 'audit-secret',
        now: () => 77_000
    });

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        auditLog
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-audit',
        task: 'Track audit lifecycle'
    });

    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-audit',
        accepted: true,
        timestamp: 77_010
    }));

    orchestrator.ingestResult(buildTaskResult({
        taskId: task.taskId,
        from: 'agent:worker-audit',
        status: 'success',
        output: 'done',
        completedAt: 77_050
    }));

    const entries = auditLog.listEntries();
    assert.ok(entries.length >= 4);
    assert.equal(auditLog.verifyChain(entries).ok, true);
});

test('circuit breaker opens after repeated transport failures and closes after recovery', async () => {
    const clock = createClock(80_000);
    let sendCount = 0;

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                sendCount += 1;
                if (sendCount === 2 || sendCount === 3) {
                    throw new Error('downstream unavailable');
                }
            }
        },
        now: clock.now,
        defaultTimeoutMs: 50,
        maxRetries: 4,
        retryDelayMs: 5,
        maxRetryDelayMs: 5,
        retryJitterRatio: 0,
        circuitFailureThreshold: 2,
        circuitCooldownMs: 100
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-circuit',
        task: 'Exercise circuit breaker behavior'
    });

    clock.set(80_060);
    await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 80_065);

    clock.set(80_070);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 80_075);

    clock.set(80_080);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 80_180);
    assert.equal(orchestrator.getMetrics().circuits.open, 1);

    clock.set(80_185);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.nextRetryAt, null);
    assert.equal(orchestrator.getMetrics().circuits.open, 0);
    assert.equal(orchestrator.getMetrics().circuits.closed, 1);
});

test('circuit breaker can be disabled to keep classic fixed-delay retries', async () => {
    const clock = createClock(90_000);
    let sendCount = 0;

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                sendCount += 1;
                if (sendCount >= 2) {
                    throw new Error('always failing');
                }
            }
        },
        now: clock.now,
        defaultTimeoutMs: 50,
        maxRetries: 3,
        retryDelayMs: 7,
        maxRetryDelayMs: 7,
        retryJitterRatio: 0,
        circuitBreakerEnabled: false,
        circuitFailureThreshold: 1,
        circuitCooldownMs: 120
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-classic-retry',
        task: 'Disable breaker and use fixed delay retries'
    });

    clock.set(90_060);
    await orchestrator.runMaintenance(clock.now());

    clock.set(90_070);
    await orchestrator.runMaintenance(clock.now());
    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 90_077);

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.circuits.tracked, 0);
    assert.equal(metrics.circuits.open, 0);
});

test('bulkhead limits queue new tasks instead of failing dispatch', async () => {
    const clock = createClock(100_000);
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now,
        defaultTimeoutMs: 200,
        retryDelayMs: 10,
        maxRetryDelayMs: 10,
        retryJitterRatio: 0,
        maxInFlightPerTarget: 1
    });

    const first = await orchestrator.dispatchTask({
        target: 'agent:worker-bulkhead',
        task: 'Hold one slot open'
    });
    const second = await orchestrator.dispatchTask({
        target: 'agent:worker-bulkhead',
        task: 'Queue behind the first slot'
    });

    assert.equal(sent.length, 1);
    assert.equal(first.status, 'dispatched');
    assert.equal(second.status, 'retry_scheduled');
    assert.equal(second.attempts, 1);
    assert.equal(second.retryLifecycle.lastReasonCode, 'bulkhead_limit');
});

test('maintenance retries bulkhead-blocked tasks when in-flight slot frees up', async () => {
    const clock = createClock(110_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        defaultTimeoutMs: 200,
        retryDelayMs: 5,
        maxRetryDelayMs: 5,
        retryJitterRatio: 0,
        maxInFlightPerTarget: 1
    });

    const blocker = await orchestrator.dispatchTask({
        target: 'agent:worker-bulkhead-maintenance',
        task: 'Keep target busy'
    });
    const queued = await orchestrator.dispatchTask({
        target: 'agent:worker-bulkhead-maintenance',
        task: 'Wait for maintenance retry'
    });

    clock.set(110_005);
    const blockedPass = await orchestrator.runMaintenance(clock.now());
    let queuedCurrent = orchestrator.getTask(queued.taskId);
    assert.equal(blockedPass.blockedByBulkhead, 1);
    assert.equal(blockedPass.transportFailures, 0);
    assert.equal(queuedCurrent.status, 'retry_scheduled');

    clock.set(110_006);
    orchestrator.ingestResult(buildTaskResult({
        taskId: blocker.taskId,
        from: 'agent:worker-bulkhead-maintenance',
        status: 'success',
        output: 'slot released',
        completedAt: clock.now()
    }));

    clock.set(110_010);
    const recoveredPass = await orchestrator.runMaintenance(clock.now());
    queuedCurrent = orchestrator.getTask(queued.taskId);
    assert.equal(recoveredPass.retried, 1);
    assert.equal(queuedCurrent.status, 'dispatched');

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.inFlight.current, 1);
    assert.equal(metrics.inFlight.saturatedTargets, 1);
});
