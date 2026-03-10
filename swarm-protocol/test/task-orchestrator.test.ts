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

test('transient rejected receipt schedules retry using eta hint', async () => {
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
        retryJitter: 'none'
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
    assert.equal(current.nextRetryAt, clock.now() + 200);

    clock.set(current.nextRetryAt);
    const summary = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(summary.retried, 1);
    assert.equal(current.status, 'dispatched');
    assert.equal(current.attempts, 2);
    assert.equal(sent.length, 2);
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

test('maintenance uses exponential backoff with deterministic jitter', async () => {
    const clock = createClock(7_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: { async send() {} },
        now: clock.now,
        random: () => 0.5,
        defaultTimeoutMs: 100,
        maxRetries: 3,
        retryDelayMs: 100,
        retryBackoffMultiplier: 2,
        maxRetryDelayMs: 5_000
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-backoff',
        task: 'Exercise retry backoff'
    });

    clock.set(7_150);
    await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(current.nextRetryAt, 7_200); // 0.5 * 100ms

    clock.set(current.nextRetryAt);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.attempts, 2);

    clock.set(7_350);
    await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'retry_scheduled');
    assert.equal(current.nextRetryAt, 7_450); // 0.5 * 200ms
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

test('dispatchTask rejects duplicate task ids', async () => {
    const clock = createClock(6_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        },
        now: clock.now
    });

    await orchestrator.dispatchTask({
        id: 'task:dup-1',
        target: 'agent:worker-dup',
        task: 'First dispatch'
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            id: 'task:dup-1',
            target: 'agent:worker-dup',
            task: 'Second dispatch'
        }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'DUPLICATE_TASK_ID');
            return true;
        }
    );
});

test('circuit breaker opens after repeated send failures and recovers after cooldown', async () => {
    const clock = createClock(7_000);
    let shouldFail = true;

    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                if (shouldFail) {
                    throw new Error('transport down');
                }
            }
        },
        now: clock.now,
        maxRetries: 1,
        retryDelayMs: 10,
        defaultTimeoutMs: 50,
        circuitBreaker: {
            failureThreshold: 2,
            cooldownMs: 100
        }
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-cb',
        task: 'Trigger breaker'
    });

    clock.set(7_100);
    await orchestrator.runMaintenance(clock.now());
    clock.set(7_120);
    await orchestrator.runMaintenance(clock.now());

    const healthOpen = orchestrator.getCircuitHealth();
    const workerCircuit = healthOpen.circuits.find((entry) => entry.target === 'agent:worker-cb');
    assert.ok(workerCircuit);
    assert.equal(workerCircuit.state, 'open');
    assert.equal(orchestrator.getTask(task.taskId)?.status, 'retry_scheduled');

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-cb',
            task: 'Blocked by open circuit'
        }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'CIRCUIT_OPEN');
            return true;
        }
    );

    shouldFail = false;
    clock.set(7_240);
    await orchestrator.runMaintenance(clock.now());

    const afterRecover = orchestrator.getTask(task.taskId);
    assert.ok(afterRecover);
    assert.equal(afterRecover.status, 'dispatched');

    const healthClosed = orchestrator.getCircuitHealth();
    const closedCircuit = healthClosed.circuits.find((entry) => entry.target === 'agent:worker-cb');
    assert.ok(closedCircuit);
    assert.equal(closedCircuit.state, 'closed');
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

test('drain mode rejects new dispatches with DRAINING error', async () => {
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {}
        }
    });

    orchestrator.setDrainMode({
        enabled: true,
        reason: 'rolling_restart'
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-drain',
            task: 'Should be rejected while draining'
        }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'DRAINING');
            return true;
        }
    );
});

test('drain mode still coalesces duplicate dispatches to existing open task', async () => {
    const sent = [];
    const clock = createClock(91_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now,
        dispatchDeduplication: {
            windowMs: 30_000,
            openOnly: true
        }
    });

    const first = await orchestrator.dispatchTask({
        target: 'agent:worker-drain-coalesce',
        task: 'Long in-flight task',
        context: { run: 1 }
    });

    orchestrator.setDrainMode({
        enabled: true,
        reason: 'graceful_shutdown'
    });

    clock.advance(100);
    const duplicate = await orchestrator.dispatchTask({
        target: 'agent:worker-drain-coalesce',
        task: 'Long in-flight task',
        context: { run: 1 }
    });

    assert.equal(duplicate.taskId, first.taskId);
    assert.equal(sent.length, 1);
});

test('drain mode force-cancels lingering open tasks after grace timeout', async () => {
    const sent = [];
    const clock = createClock(92_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-drain-force',
        task: 'Task that should be cancelled after drain grace'
    });

    orchestrator.setDrainMode({
        enabled: true,
        reason: 'deploy_shutdown',
        rejectNewDispatches: true,
        forceCancelAfterMs: 1_000
    });

    clock.advance(900);
    const beforeGrace = await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(beforeGrace.drainForceCancelled, 0);
    assert.equal(current.status, 'dispatched');

    clock.advance(200);
    const afterGrace = await orchestrator.runMaintenance(clock.now());
    current = orchestrator.getTask(task.taskId);
    assert.equal(afterGrace.drainForceCancelled, 1);
    assert.equal(current.status, 'cancelled');
    assert.equal(current.history.some((entry) => entry.event === 'cancel_signal_sent'), true);

    assert.equal(sent.length, 2);
    assert.equal(sent[1].target, 'agent:worker-drain-force');
    assert.equal(sent[1].message.kind, 'task_cancel');
    assert.equal(sent[1].message.taskId, task.taskId);
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

test('dispatchTask fails with SEND_TIMEOUT when transport send hangs', async () => {
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                return new Promise(() => {});
            }
        },
        transportSendTimeoutMs: 25
    });

    await assert.rejects(
        () => orchestrator.dispatchTask({
            target: 'agent:worker-timeout-send',
            task: 'Timeout hung send'
        }),
        (error) => {
            assert.equal(error instanceof TaskOrchestratorError, true);
            assert.equal(error.code, 'SEND_TIMEOUT');
            assert.match(error.message, /timed out/i);
            return true;
        }
    );
});

test('maintenance converts hung retry sends into bounded transport failures', async () => {
    const clock = createClock(80_000);
    let sendCount = 0;
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send() {
                sendCount += 1;
                if (sendCount >= 2) {
                    return new Promise(() => {});
                }
            }
        },
        now: clock.now,
        defaultTimeoutMs: 40,
        maxRetries: 2,
        retryDelayMs: 15,
        transportSendTimeoutMs: 25
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-timeout-retry',
        task: 'Bound hung retry sends'
    });

    clock.set(80_050);
    const pass1 = await orchestrator.runMaintenance(clock.now());
    let current = orchestrator.getTask(task.taskId);
    assert.equal(pass1.scheduledRetries, 1);
    assert.equal(current.status, 'retry_scheduled');

    clock.set(current.nextRetryAt);
    const startedAt = Date.now();
    const pass2 = await orchestrator.runMaintenance(clock.now());
    const elapsedMs = Date.now() - startedAt;
    current = orchestrator.getTask(task.taskId);

    assert.equal(pass2.transportFailures, 1);
    assert.equal(current.status, 'retry_scheduled');
    assert.ok(current.lastError.includes('timed out'));
    assert.ok(elapsedMs < 500);
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

test('cancelTask marks open task as cancelled and propagates cancel signal', async () => {
    const sent = [];
    const clock = createClock(88_000);
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-cancel',
        task: 'Long running analysis'
    });

    clock.advance(250);
    const cancelled = await orchestrator.cancelTask(task.taskId, {
        reason: 'superseded_by_new_plan',
        cancelledBy: 'agent:planner',
        timestamp: clock.now()
    });

    assert.equal(cancelled.status, 'cancelled');
    assert.equal(cancelled.closedAt, clock.now());
    assert.equal(cancelled.history.some((entry) => entry.event === 'cancelled'), true);
    assert.equal(cancelled.history.some((entry) => entry.event === 'cancel_signal_sent'), true);

    assert.equal(sent.length, 2);
    assert.equal(sent[1].target, 'agent:worker-cancel');
    assert.equal(sent[1].message.kind, 'task_cancel');
    assert.equal(sent[1].message.taskId, task.taskId);
});

test('cancelTask blocks later terminal replay dedupe and allows fresh dispatch', async () => {
    const clock = createClock(89_000);
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        now: clock.now,
        dispatchDeduplication: {
            windowMs: 1_000,
            terminalWindowMs: 30_000,
            openOnly: false
        }
    });

    const first = await orchestrator.dispatchTask({
        target: 'agent:worker-cancel-replay',
        task: 'Generate roadmap draft'
    });
    await orchestrator.cancelTask(first.taskId, {
        reason: 'operator_abort',
        timestamp: clock.now()
    });

    clock.advance(10);
    const second = await orchestrator.dispatchTask({
        target: 'agent:worker-cancel-replay',
        task: 'Generate roadmap draft'
    });

    assert.notEqual(second.taskId, first.taskId);
    assert.equal(sent.length, 3);
    assert.equal(sent[1].message.kind, 'task_cancel');
    assert.equal(sent[2].message.kind, 'task_request');
});

test('cancelTask without prior dispatch does not attempt propagation', async () => {
    const sent = [];
    const orchestrator = new TaskOrchestrator({
        localAgentId: 'agent:main',
        transport: {
            async send(target, message) {
                sent.push({ target, message });
            }
        },
        approvalPolicy: () => ({ required: true, reason: 'manual_review' })
    });

    const task = await orchestrator.dispatchTask({
        target: 'agent:worker-cancel-awaiting',
        task: 'Needs approval before send'
    });

    const cancelled = await orchestrator.cancelTask(task.taskId, {
        reason: 'approval_withdrawn'
    });
    assert.equal(cancelled.status, 'cancelled');
    assert.equal(sent.length, 0);
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
