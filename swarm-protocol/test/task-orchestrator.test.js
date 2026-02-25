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
        reason: 'worker_overloaded',
        timestamp: clock.now()
    }));

    const current = orchestrator.getTask(task.taskId);
    assert.equal(current.status, 'rejected');
    assert.equal(current.closedAt, clock.now());

    const maintenance = await orchestrator.runMaintenance(clock.now() + 10_000);
    assert.equal(maintenance.checked, 0);
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
