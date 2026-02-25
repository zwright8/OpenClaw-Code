import test from 'node:test';
import assert from 'node:assert/strict';
import {
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
