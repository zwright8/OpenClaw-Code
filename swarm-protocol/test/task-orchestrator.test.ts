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

test('transient rejection honors Retry-After HTTP-date hint', async () => {
    const clock = createClock(10_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 10
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-retry-after-date',
        task: 'Respect Retry-After date'
    });

    const retryAt = new Date(clock.now() + 2_000).toUTCString();
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-retry-after-date',
        accepted: false,
        reason: `service_unavailable retry-after: ${retryAt}`,
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, clock.now() + 2_000);
});

test('transient rejection honors X-RateLimit-Reset Unix epoch seconds hint', async () => {
    const clock = createClock(1_700_000_000_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 10
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-ratelimit-epoch-seconds',
        task: 'Respect X-RateLimit-Reset epoch seconds'
    });

    const retryAtEpochSeconds = Math.floor((clock.now() + 2_500) / 1_000);
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-ratelimit-epoch-seconds',
        accepted: false,
        reason: `service_unavailable x-ratelimit-reset: ${retryAtEpochSeconds}`,
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, (retryAtEpochSeconds * 1_000));
});

test('transient rejection honors X-RateLimit-Reset Unix epoch milliseconds hint', async () => {
    const clock = createClock(25_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 10
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-ratelimit-epoch-millis',
        task: 'Respect X-RateLimit-Reset epoch milliseconds'
    });

    const retryAtEpochMs = clock.now() + 2_000;
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-ratelimit-epoch-millis',
        accepted: false,
        reason: `service_unavailable x-ratelimit-reset=${retryAtEpochMs}`,
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, retryAtEpochMs);
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

test('maintenance retry scheduling supports decorrelated jitter progression', async () => {
    const clock = createClock(13_000);
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
        retryJitter: 'decorrelated',
        random: () => 0.5
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-decorrelated',
        task: 'Exercise decorrelated jitter'
    });

    clock.set(13_051);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(pass1.scheduledRetries, 1);
    assert.equal(current.nextRetryAt, 13_151);
    assert.equal(current.lastRetryDelayMs, 100);

    clock.set(13_151);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(pass2.transportFailures, 1);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 13_301);
    assert.equal(current.lastRetryDelayMs, 150);
});

test('decorrelated jitter does not randomize explicit retry-after hints', async () => {
    const clock = createClock(14_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 10,
        retryJitter: 'decorrelated',
        random: () => 0
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-decorrelated-hint',
        task: 'Honor explicit retry hint'
    });

    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-decorrelated-hint',
        accepted: false,
        reason: 'service_unavailable retry_after=2',
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 16_000);
    assert.equal(current.lastRetryDelayMs, 2_000);
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

test('transient rejection is terminal when retry throttle budget is exhausted', async () => {
    const clock = createClock(8_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        maxRetries: 3,
        retryDelayMs: 25,
        retryThrottling: {
            maxTokens: 1,
            retryCost: 1,
            threshold: 1,
            tokenRatio: 0
        }
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-throttle',
        task: 'Retry should be throttled'
    });

    clock.advance(10);
    orchestrator.ingestReceipt(buildTaskReceipt({
        taskId: task.taskId,
        from: 'agent:worker-throttle',
        accepted: false,
        reason: 'worker_overloaded retry_after=1',
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'rejected');
    assert.equal(current.history.at(-1)?.event, 'retry_throttled');
});

test('maintenance marks timeout when retry throttling blocks retry schedule', async () => {
    const clock = createClock(12_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now,
        defaultTimeoutMs: 50,
        maxRetries: 1,
        retryDelayMs: 10,
        retryThrottling: {
            maxTokens: 1,
            retryCost: 1,
            threshold: 1,
            tokenRatio: 0
        }
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-timeout-throttle',
        task: 'Timeout should not retry when throttled'
    });

    clock.set(12_051);
    const summary = await orchestrator.runMaintenance(clock.now());
    const current = orchestrator.getTask(task.taskId);
    assert.equal(summary.scheduledRetries, 0);
    assert.equal(summary.timedOut, 1);
    assert.equal(current.status, 'timed_out');
    assert.equal(current.history.at(-1)?.event, 'timed_out_retry_throttled');
});

test('target-scoped retry throttling isolates budgets by target', async () => {
    const clock = createClock(20_000);
    const sendCountByTarget = new Map();

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target) {
                const count = (sendCountByTarget.get(target) || 0) + 1;
                sendCountByTarget.set(target, count);
                if (target === 'agent:worker-target-a' && count > 1) {
                    throw new Error('target-a retry failed');
                }
            }
        },
        now: clock.now,
        defaultTimeoutMs: 50,
        maxRetries: 2,
        retryDelayMs: 0,
        retryThrottling: {
            scope: 'target',
            maxTokens: 2,
            retryCost: 1,
            threshold: 1,
            tokenRatio: 0
        }
    });

    const taskA = await orchestrator.dispatchTask({
        target: 'agent:worker-target-a',
        task: 'Task A'
    });

    clock.advance(40);
    await orchestrator.dispatchTask({
        target: 'agent:worker-target-b',
        task: 'Task B'
    });

    clock.set(20_060);
    await orchestrator.runMaintenance(clock.now());
    let currentA = orchestrator.getTask(taskA.taskId);
    assert.equal(currentA.status, 'retry_scheduled');

    clock.set(20_061);
    const pass2 = await orchestrator.runMaintenance(clock.now());
    currentA = orchestrator.getTask(taskA.taskId);
    assert.equal(pass2.transportFailures, 1);
    assert.equal(currentA.status, 'transport_error');
    assert.equal(currentA.history.at(-1)?.event, 'transport_error_retry_throttled');

    clock.set(20_120);
    await orchestrator.runMaintenance(clock.now());
    const taskB = orchestrator.listTasks({ target: 'agent:worker-target-b' })[0];
    assert.equal(taskB.status, 'retry_scheduled');

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.retry.throttling.scope, 'target');
    assert.ok(metrics.retry.throttling.activeTargetBuckets >= 2);
});

test('dispatchTask schedules retry when target circuit is open', async () => {
    const clock = createClock(30_000);
    let failSends = true;

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                if (failSends) {
                    throw new Error('upstream unavailable');
                }
            }
        },
        now: clock.now,
        retryDelayMs: 10,
        circuitBreaker: {
            failureThreshold: 1,
            cooldownMs: 100
        }
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:circuit-worker',
            task: 'Warm up breaker'
        }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'SEND_FAILED');
            return true;
        }
    );

    const deferred = await orchestrator.dispatchTask({
        target: 'agent:circuit-worker',
        task: 'Should defer while open'
    });

    assert.equal(deferred.status, 'retry_scheduled');
    assert.equal(deferred.history.at(-1)?.event, 'initial_dispatch_circuit_open_retry_scheduled');
    assert.equal(deferred.nextRetryAt, clock.now() + 100);

    failSends = false;
});

test('target circuit transitions from open to half-open and closes on success', async () => {
    const clock = createClock(40_000);
    let failSends = true;

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                if (failSends) {
                    throw new Error('worker unreachable');
                }
            }
        },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 5,
        circuitBreaker: {
            failureThreshold: 1,
            cooldownMs: 50,
            halfOpenMaxAttempts: 1,
            successThreshold: 1
        }
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:circuit-recover',
            task: 'Open breaker'
        }),
        /worker unreachable/
    );

    const queued = await orchestrator.dispatchTask({
        target: 'agent:circuit-recover',
        task: 'Defer while breaker open'
    });
    assert.equal(queued.status, 'retry_scheduled');

    clock.advance(50);
    failSends = false;

    const summary = await orchestrator.runMaintenance(clock.now());
    const current = orchestrator.getTask(queued.taskId);
    assert.equal(summary.retried, 1);
    assert.equal(current.status, 'dispatched');

    const metrics = orchestrator.getMetrics();
    assert.equal(metrics.circuitBreaker.targets.open, 0);
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
