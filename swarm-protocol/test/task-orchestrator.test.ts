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

test('rejected receipt terminates task', async () => {
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
        reason: 'invalid_task_contract',
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'rejected');
    assert.equal(current.closedAt, clock.now());

    const maintenance = await orchestrator.runMaintenance(clock.now() + 10_000);
    assert.equal(maintenance.checked, 0);
});

test('transient rejected receipt schedules retry and honors retry_after hint', async () => {
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
        maxRetries: 1,
        retryDelayMs: 25
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-transient',
        task: 'Retry when worker is overloaded'
    });

    clock.advance(5);
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-transient',
        accepted: false,
        reason: 'worker_overloaded retry_after=2',
        timestamp: clock.now()
    }));

    let current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, clock.now() + 2_000);

    clock.advance(1_999);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass1.retried, 0);
    assert.equal(current.status, 'retry_scheduled');

    clock.advance(1);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass2.retried, 1);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 2);
    assert.equal(sent.length, 2);
});

test('transient rejection honors Retry-After HTTP-date hints', async () => {
    const clock = createClock(1_700_000_000_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 25
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-http-date',
        task: 'Respect retry-after dates'
    });

    const retryAt = new Date(clock.now() + 8_000).toUTCString();
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-http-date',
        accepted: false,
        reason: `service_unavailable Retry-After: ${retryAt}`,
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, clock.now() + 8_000);
});

test('transient rejection honors x-ratelimit-reset epoch hints', async () => {
    const clock = createClock(1_700_000_010_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 25
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-epoch-reset',
        task: 'Respect reset epoch'
    });

    const resetEpochSeconds = Math.floor((clock.now() + 5_000) / 1_000);
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-epoch-reset',
        accepted: false,
        reason: `rate_limited x-ratelimit-reset=${resetEpochSeconds}`,
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, clock.now() + 5_000);
});

test('transient rejection honors ratelimit-reset delta-second hints', async () => {
    const clock = createClock(1_700_000_020_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 25
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-delta-reset',
        task: 'Respect reset delta'
    });

    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-delta-reset',
        accepted: false,
        reason: 'rate_limited ratelimit-reset=6',
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, clock.now() + 6_000);
});

test('maintenance retry scheduling uses exponential backoff with jitter', async () => {
    const clock = createClock(9_000);
    let sendCount = 0;

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                sendCount += 1;
                if (sendCount >= 2) {
                    throw new Error('retry send failed');
                }
            }
        },
        now: clock.now,
        defaultTimeoutMs: 50,
        maxRetries: 2,
        retryDelayMs: 100,
        retryBackoffStrategy: 'exponential',
        retryJitter: 'full',
        random: () => 0.5
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-backoff',
        task: 'Exercise retry jitter'
    });

    clock.set(9_051);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(pass1.scheduledRetries, 1);
    assert.equal(current.nextRetryAt, 9_101);

    clock.set(9_101);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass2.transportFailures, 1);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 9_201);
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
        retryDelayMs: 10
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

    clock.set(4_170);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass2.retried, 1);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 2);

    clock.set(4_300);
    const pass3 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass3.timedOut, 1);
    assert.equal(current.status, 'timed_out');
    assert.equal(sent.length, 2);
});

test('retry token bucket delays scheduling when tokens are exhausted', async () => {
    const clock = createClock(12_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        defaultTimeoutMs: 20,
        maxRetries: 2,
        retryDelayMs: 5,
        retryTokenBucketCapacity: 1,
        retryTokenRefillPerSecond: 0.5,
        retryTokenCost: 1
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-throttle',
        task: 'Exercise retry throttle scheduling'
    });

    clock.set(12_025);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(pass1.scheduledRetries, 1);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 12_030);

    clock.set(12_030);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass2.retried, 1);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 2);

    clock.set(12_055);
    const pass3 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass3.scheduledRetries, 1);
    assert.equal(current.status, 'retry_scheduled');

    const lastEvent = current.history[current.history.length - 1];
    assert.equal(lastEvent.retryTokenGranted, false);
    assert.ok(lastEvent.retryTokenRecoveryDelayMs >= 1_900);
    assert.equal(current.nextRetryAt, clock.now() + lastEvent.retryDelayMs);
});

test('dispatchTask reuses active task for matching idempotency key', async () => {
    const clock = createClock(14_000);
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now,
        idempotencyKeyTtlMs: 60_000
    });

    const first = await orchestrator.dispatchTask({
        target: 'agent:worker-idempotent',
        task: 'Generate changelog',
        context: { release: '2026.03.1' },
        idempotencyKey: 'release-changelog-2026.03.1'
    });

    clock.advance(250);
    const replay = await orchestrator.dispatchTask({
        target: 'agent:worker-idempotent',
        task: 'Generate changelog',
        context: { release: '2026.03.1' },
        idempotencyKey: 'release-changelog-2026.03.1'
    });

    assert.equal(first.taskId, replay.taskId);
    assert.equal(sent.length, 1);
});

test('dispatchTask rejects reused idempotency key when payload changes', async () => {
    const clock = createClock(15_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now
    });

    await orchestrator.dispatchTask({
        target: 'agent:worker-idempotent-mismatch',
        task: 'Summarize customer interviews',
        context: { quarter: 'Q1' },
        idempotencyKey: 'customer-summary-q1'
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-idempotent-mismatch',
            task: 'Summarize customer interviews',
            context: { quarter: 'Q2' },
            idempotencyKey: 'customer-summary-q1'
        }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'IDEMPOTENCY_KEY_REUSED');
            return true;
        }
    );
});

test('dispatchTask idempotency cache expires after ttl', async () => {
    const clock = createClock(16_000);
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now,
        idempotencyKeyTtlMs: 500
    });

    const first = await orchestrator.dispatchTask({
        target: 'agent:worker-idempotent-ttl',
        task: 'Compile weekly status',
        idempotencyKey: 'weekly-status'
    });

    clock.advance(501);
    const second = await orchestrator.dispatchTask({
        target: 'agent:worker-idempotent-ttl',
        task: 'Compile weekly status',
        idempotencyKey: 'weekly-status'
    });

    assert.notEqual(first.taskId, second.taskId);
    assert.equal(sent.length, 2);
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

test('metrics expose retry token bucket state', async () => {
    const clock = createClock(20_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        retryTokenBucketCapacity: 3,
        retryTokenRefillPerSecond: 2,
        retryTokenCost: 1.5
    });

    await orchestrator.dispatchTask({
        target: 'agent:worker-metrics',
        task: 'Inspect retry metrics'
    });

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.retry.tokenBucket.capacity, 3);
    assert.equal(metrics.retry.tokenBucket.refillPerSecond, 2);
    assert.equal(metrics.retry.tokenBucket.tokenCost, 1.5);
    assert.equal(metrics.retry.tokenBucket.tokensAvailable, 3);
});

test('bulkhead defers dispatch when target in-flight limit is reached', async () => {
    const clock = createClock(25_000);
    let sendCount = 0;
    let releaseFirstSend = null;
    const firstSendGate = new Promise((resolve) => {
        releaseFirstSend = resolve;
    });

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                sendCount += 1;
                if (sendCount === 1) {
                    await firstSendGate;
                }
            }
        },
        now: clock.now,
        maxRetries: 2,
        retryDelayMs: 10,
        bulkheadMaxInFlightPerTarget: 1,
        bulkheadRetryDelayMs: 200
    });

    const firstDispatchPromise = orchestrator.dispatchTask({
        target: 'agent:worker-bulkhead',
        task: 'Long-running task'
    });

    await Promise.resolve();

    const deferred = await orchestrator.dispatchTask({
        target: 'agent:worker-bulkhead',
        task: 'Should be deferred by bulkhead'
    });

    assert.equal(deferred.status, 'retry_scheduled');
    assert.equal(deferred.attempts, 0);
    assert.equal(deferred.nextRetryAt, clock.now() + 200);
    assert.equal(sendCount, 1);

    releaseFirstSend();
    const first = await firstDispatchPromise;
    assert.equal(first.status, 'dispatched');
    assert.equal(first.attempts, 1);
});

test('metrics expose bulkhead in-flight state per target', async () => {
    const clock = createClock(26_000);
    let releaseSend = null;
    const sendGate = new Promise((resolve) => {
        releaseSend = resolve;
    });
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                await sendGate;
            }
        },
        now: clock.now,
        bulkheadMaxInFlightPerTarget: 1,
        bulkheadRetryDelayMs: 100
    });

    const dispatchPromise = orchestrator.dispatchTask({
        target: 'agent:worker-bulkhead-metrics',
        task: 'Hold in flight for metrics'
    });

    await Promise.resolve();

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.retry.bulkhead.maxInFlightPerTarget, 1);
    assert.equal(metrics.retry.bulkhead.retryDelayMs, 100);
    assert.equal(metrics.retry.bulkhead.activeTargets, 1);
    assert.equal(metrics.retry.bulkhead.targets['agent:worker-bulkhead-metrics'].inFlight, 1);
    assert.equal(metrics.retry.bulkhead.targets['agent:worker-bulkhead-metrics'].saturated, true);

    releaseSend();
    await dispatchPromise;
});

test('circuit breaker defers dispatch when target is open', async () => {
    const clock = createClock(30_000);
    let sends = 0;
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                sends += 1;
                throw new Error('worker unavailable');
            }
        },
        now: clock.now,
        circuitBreakerFailureThreshold: 2,
        circuitBreakerCooldownMs: 1_000,
        retryDelayMs: 10
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-circuit',
            task: 'Trigger failure 1'
        }),
        /worker unavailable/
    );
    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-circuit',
            task: 'Trigger failure 2'
        }),
        /worker unavailable/
    );

    const deferred = await orchestrator.dispatchTask({
        target: 'agent:worker-circuit',
        task: 'Should be deferred by open circuit'
    });

    assert.equal(deferred.status, 'retry_scheduled');
    assert.equal(deferred.attempts, 0);
    assert.equal(deferred.nextRetryAt, clock.now() + 1_000);
    assert.equal(sends, 2);

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.retry.circuitBreaker.openTargets, 1);
});

test('circuit breaker closes after half-open probe succeeds', async () => {
    const clock = createClock(31_000);
    let sends = 0;
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                sends += 1;
                if (sends === 1) {
                    throw new Error('temporary outage');
                }
            }
        },
        now: clock.now,
        defaultTimeoutMs: 50,
        maxRetries: 2,
        retryDelayMs: 10,
        circuitBreakerFailureThreshold: 1,
        circuitBreakerCooldownMs: 500
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-circuit-recovery',
            task: 'Open breaker on first failure'
        }),
        /temporary outage/
    );

    const deferred = await orchestrator.dispatchTask({
        target: 'agent:worker-circuit-recovery',
        task: 'Wait for half-open probe'
    });
    assert.equal(deferred.status, 'retry_scheduled');

    clock.advance(500);
    const pass = await orchestrator.runMaintenance(clock.now());
    const current = orchestrator.getTask(deferred.taskId);
    assert.equal(pass.retried, 1);
    assert.equal(current.status, 'dispatched');

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.retry.circuitBreaker.openTargets, 0);
    assert.equal(metrics.retry.circuitBreaker.halfOpenTargets, 0);
    assert.equal(sends, 2);
});

test('failed results are captured in dead-letter metrics and listing', async () => {
    const clock = createClock(35_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        deadLetterMaxEntries: 10
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-dead-letter',
        task: 'Produce terminal failure'
    });

    clock.advance(20);
    orchestrator.ingestResult(buildTaskResult({
        taskId: task.taskId,
        from: 'agent:worker-dead-letter',
        status: 'failed',
        output: 'Unable to complete task',
        completedAt: clock.now()
    }));

    const deadLetters = orchestrator.listDeadLetters();
    assert.equal(deadLetters.length, 1);
    assert.equal(deadLetters[0].taskId, task.taskId);
    assert.equal(deadLetters[0].status, 'failed');
    assert.equal(deadLetters[0].deadLetter.reason, 'result_status:failed');

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.deadLetter.total, 1);
    assert.equal(metrics.deadLetter.byStatus.failed, 1);
    assert.equal(metrics.deadLetter.byReason['result_status:failed'], 1);
});

test('dead-letter retention evicts oldest entries when over capacity', async () => {
    const clock = createClock(36_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        deadLetterMaxEntries: 1
    });

    const taskA = await orchestrator.dispatchTask({
        target: 'agent:worker-evict',
        task: 'Old failed task'
    });
    clock.advance(5);
    orchestrator.ingestResult(buildTaskResult({
        taskId: taskA.taskId,
        from: 'agent:worker-evict',
        status: 'failed',
        output: 'first failure',
        completedAt: clock.now()
    }));

    const taskB = await orchestrator.dispatchTask({
        target: 'agent:worker-evict',
        task: 'New failed task'
    });
    clock.advance(5);
    orchestrator.ingestResult(buildTaskResult({
        taskId: taskB.taskId,
        from: 'agent:worker-evict',
        status: 'failed',
        output: 'second failure',
        completedAt: clock.now()
    }));

    const deadLetters = orchestrator.listDeadLetters();
    assert.equal(deadLetters.length, 1);
    assert.equal(deadLetters[0].taskId, taskB.taskId);
    assert.equal(orchestrator.getTask(taskA.taskId).deadLetter, undefined);
});

test('redriveDeadLetter reopens terminal task and schedules retry', async () => {
    const clock = createClock(37_000);
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message, at: clock.now() });
            }
        },
        now: clock.now,
        deadLetterMaxEntries: 5
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-redrive',
        task: 'Fail then redrive'
    });

    clock.advance(10);
    orchestrator.ingestResult(buildTaskResult({
        taskId: task.taskId,
        from: 'agent:worker-redrive',
        status: 'failed',
        output: 'failure before redrive',
        completedAt: clock.now()
    }));

    clock.advance(10);
    const redriven = await orchestrator.redriveDeadLetter(task.taskId, {
        delayMs: 50,
        reason: 'operator_redrive',
        resetAttempts: true
    });
    assert.equal(redriven.status, 'retry_scheduled');
    assert.equal(redriven.attempts, 0);
    assert.equal(redriven.nextRetryAt, clock.now() + 50);

    clock.advance(49);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    assert.equal(pass1.retried, 0);

    clock.advance(1);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    const current = orchestrator.getTask(task.taskId);
    assert.equal(pass2.retried, 1);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 1);
    assert.equal(orchestrator.listDeadLetters().length, 0);
    assert.equal(sent.length, 2);
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

test('adaptive timeout learns per-target latency and updates future deadlines', async () => {
    const clock = createClock(80_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        defaultTimeoutMs: 1_000,
        adaptiveTimeoutEnabled: true,
        adaptiveTimeoutMinMs: 100,
        adaptiveTimeoutMaxMs: 10_000,
        adaptiveTimeoutSafetyMarginMs: 0
    });

    const first = await orchestrator.dispatchTask({
        target: 'agent:worker-adaptive',
        task: 'Warm up timeout model'
    });
    assert.equal(first.deadlineAt, 81_000);

    clock.advance(300);
    orchestrator.ingestResult(buildTaskResult({
        taskId: first.taskId,
        from: 'agent:worker-adaptive',
        status: 'success',
        output: 'ok',
        completedAt: clock.now()
    }));

    const second = await orchestrator.dispatchTask({
        target: 'agent:worker-adaptive',
        task: 'Use learned timeout model'
    });

    // First RTT sample (300ms) => timeout ~= srtt + 4*rttvar = 300 + 600 = 900ms.
    assert.equal(second.deadlineAt, clock.now() + 900);
    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.retry.adaptiveTimeout.targets['agent:worker-adaptive'].samples, 1);
    assert.equal(metrics.retry.adaptiveTimeout.targets['agent:worker-adaptive'].timeoutMs, 900);
});

test('adaptive timeout can be disabled to keep fixed deadlines', async () => {
    const clock = createClock(90_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        defaultTimeoutMs: 750,
        adaptiveTimeoutEnabled: false
    });

    const first = await orchestrator.dispatchTask({
        target: 'agent:worker-fixed-timeout',
        task: 'Dispatch one'
    });
    assert.equal(first.deadlineAt, 90_750);

    clock.advance(400);
    orchestrator.ingestResult(buildTaskResult({
        taskId: first.taskId,
        from: 'agent:worker-fixed-timeout',
        status: 'success',
        output: 'done',
        completedAt: clock.now()
    }));

    const second = await orchestrator.dispatchTask({
        target: 'agent:worker-fixed-timeout',
        task: 'Dispatch two'
    });
    assert.equal(second.deadlineAt, clock.now() + 750);
    assert.equal(orchestrator.getMetrics().retry.adaptiveTimeout.enabled, false);
});

test('cancelTask marks open tasks terminal and blocks late receipt/result updates', async () => {
    const clock = createClock(95_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-cancel',
        task: 'Long running task'
    });

    clock.advance(10);
    const cancelled = orchestrator.cancelTask(task.taskId, {
        reason: 'superseded_task',
        actor: 'human:ops',
        cancelledAt: clock.now()
    });
    assert.equal(cancelled.status, 'cancelled');
    assert.equal(cancelled.closedAt, clock.now());
    assert.equal(cancelled.history.at(-1).event, 'cancelled');

    const receiptAccepted = orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-cancel',
        accepted: true,
        timestamp: clock.now() + 5
    }));
    const resultAccepted = orchestrator.ingestResult(buildTaskResult({
        taskId: task.taskId,
        from: 'agent:worker-cancel',
        status: 'success',
        output: 'late completion',
        completedAt: clock.now() + 20
    }));

    assert.equal(receiptAccepted, false);
    assert.equal(resultAccepted, false);
    assert.equal(orchestrator.getTask(task.taskId).status, 'cancelled');
});

test('cancelTask clears idempotency key so replacement task can be dispatched', async () => {
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        maxRetries: 0
    });

    const first = await orchestrator.dispatchTask({
        target: 'agent:worker-idempotent',
        task: 'Run with idempotency key',
        idempotencyKey: 'replaceable-key'
    });
    assert.equal(first.status, 'dispatched');

    const cancelled = orchestrator.cancelTask(first.taskId, {
        reason: 'replace_with_new_context'
    });
    assert.equal(cancelled.status, 'cancelled');

    const replacement = await orchestrator.dispatchTask({
        target: 'agent:worker-idempotent',
        task: 'Run with idempotency key',
        context: { version: 2 },
        idempotencyKey: 'replaceable-key'
    });

    assert.notEqual(replacement.taskId, first.taskId);
    assert.equal(replacement.status, 'dispatched');
});

test('cancelTask rejects attempts to cancel non-cancelled terminal tasks', async () => {
    const clock = createClock(96_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-terminal',
        task: 'Will fail'
    });

    clock.advance(5);
    orchestrator.ingestResult(buildTaskResult({
        taskId: task.taskId,
        from: 'agent:worker-terminal',
        status: 'failure',
        output: 'failed',
        completedAt: clock.now()
    }));

    assert.throws(
        () => orchestrator.cancelTask(task.taskId),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'NOT_CANCELLABLE');
            return true;
        }
    );
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
