import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'node:url';
import {
    buildTaskRequest,
    FileTaskStore
} from '../../swarm-protocol/runtime.js';
import { buildQueueRecordFromTaskRequest } from '../src/task-bundle-enqueuer.js';
import {
    dispatchCreatedQueueTasks,
    runQueueMaintenance,
    selectCreatedDispatchCandidates
} from '../src/queue-dispatcher.js';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-dispatch-'));
}

function targetToFile(target) {
    return `${target.replace(/[^a-z0-9._-]+/gi, '_')}.jsonl`;
}

const MAINTAIN_QUEUE_SCRIPT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../scripts/maintain-queue.ts'
);

function makeRequest(id, { priority = 'high', planner = 'cognition-core/remediation-task-planner', target = 'agent:ops' } = {}) {
    return buildTaskRequest({
        id,
        from: 'agent:main',
        target,
        priority,
        task: `Execute ${id}`,
        context: {
            planner
        },
        createdAt: 100_000
    });
}

test('selectCreatedDispatchCandidates filters non-cognition tasks by default', () => {
    const records = [
        {
            taskId: 'task-1',
            status: 'created',
            target: 'agent:ops',
            request: {
                kind: 'task_request',
                id: '00000000-0000-4000-8000-000000000001',
                from: 'agent:main',
                target: 'agent:ops',
                priority: 'high',
                task: 'A',
                context: { planner: 'cognition-core/skill-growth-task-planner' },
                createdAt: 1
            },
            createdAt: 1
        },
        {
            taskId: 'task-2',
            status: 'created',
            target: 'agent:ops',
            request: {
                kind: 'task_request',
                id: '00000000-0000-4000-8000-000000000002',
                from: 'agent:main',
                target: 'agent:ops',
                priority: 'high',
                task: 'B',
                context: { planner: 'external/manual-planner' },
                createdAt: 2
            },
            createdAt: 2
        }
    ];

    const defaultSelection = selectCreatedDispatchCandidates(records);
    assert.equal(defaultSelection.selected.length, 1);
    assert.equal(defaultSelection.skipped.nonCognition, 1);

    const allSelection = selectCreatedDispatchCandidates(records, {
        includeAllCreated: true
    });
    assert.equal(allSelection.selected.length, 2);
    assert.equal(allSelection.skipped.nonCognition, 0);
});

test('dispatchCreatedQueueTasks routes critical cognition tasks to awaiting approval', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const store = new FileTaskStore({ filePath: queuePath, now: () => 100_001 });

    const request = makeRequest('00000000-0000-4000-8000-000000000101', {
        priority: 'critical',
        target: 'agent:critical'
    });
    await store.saveRecord(buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 100_002
    }));

    const result = await dispatchCreatedQueueTasks({
        storePath: queuePath,
        outboxDir
    });

    assert.equal(result.stats.selected, 1);
    assert.equal(result.stats.awaitingApproval, 1);
    assert.equal(result.stats.dispatched, 0);

    const records = await store.loadRecords();
    assert.equal(records.length, 1);
    assert.equal(records[0].status, 'awaiting_approval');

    const expectedOutbox = path.join(outboxDir, targetToFile('agent:critical'));
    assert.equal(fs.existsSync(expectedOutbox), false);
});

test('dispatchCreatedQueueTasks dispatches high-priority cognition tasks to outbox', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const store = new FileTaskStore({ filePath: queuePath, now: () => 200_001 });

    const cognitionRequest = makeRequest('00000000-0000-4000-8000-000000000201', {
        priority: 'high',
        planner: 'cognition-core/cognition-iteration-task-planner',
        target: 'agent:cognition:ops'
    });
    const externalRequest = makeRequest('00000000-0000-4000-8000-000000000202', {
        priority: 'high',
        planner: 'external/manual-planner',
        target: 'agent:other'
    });

    await store.saveRecord(buildQueueRecordFromTaskRequest(cognitionRequest, {
        source: 'reports/cognition-iteration-tasks.json',
        nowFactory: () => 200_002
    }));
    await store.saveRecord(buildQueueRecordFromTaskRequest(externalRequest, {
        source: 'reports/manual-tasks.json',
        nowFactory: () => 200_003
    }));

    const result = await dispatchCreatedQueueTasks({
        storePath: queuePath,
        outboxDir,
        nowFactory: () => 200_001
    });

    assert.equal(result.stats.selected, 1);
    assert.equal(result.stats.dispatched, 1);
    assert.equal(result.stats.awaitingApproval, 0);
    assert.equal(result.stats.skippedNonCognition, 1);

    const outboxFile = path.join(outboxDir, targetToFile('agent:cognition:ops'));
    assert.equal(fs.existsSync(outboxFile), true);
    const lines = fs.readFileSync(outboxFile, 'utf8').trim().split('\n');
    assert.equal(lines.length, 1);
    const envelope = JSON.parse(lines[0]);
    assert.equal(envelope.kind, 'task_dispatch_envelope');
    assert.deepEqual(envelope.trace, {
        schemaVersion: 'openclaw.task_dispatch.trace.v1',
        traceparent: envelope.message.traceparent,
        taskId: '00000000-0000-4000-8000-000000000201',
        target: 'agent:cognition:ops',
        dispatchAttempt: 1,
        dispatchReason: 'initial_dispatch',
        priority: 'high',
        planner: 'cognition-core/cognition-iteration-task-planner',
        createdAt: 100_000,
        sentAt: envelope.sentAt,
        idempotencyKey: 'task:00000000-0000-4000-8000-000000000201',
        taskIdempotencyKey: 'task:00000000-0000-4000-8000-000000000201',
        dispatchIdempotencyKey: 'task:00000000-0000-4000-8000-000000000201:attempt:1',
        trajectoryEventCount: 2
    });
    assert.deepEqual(envelope.trajectoryEvents.map((event) => event.event), [
        'task_dispatch_selected',
        'task_dispatch_outbox_enqueued'
    ]);
    assert.deepEqual(envelope.trajectoryEvents.map((event) => event.sequence), [1, 2]);
    assert.ok(envelope.trajectoryEvents.every((event) => (
        event.schemaVersion === 'openclaw.task_dispatch.trajectory_event.v1'
            && event.traceparent === envelope.trace.traceparent
            && event.taskId === envelope.trace.taskId
            && event.actor === 'cognition-core/queue-dispatcher'
            && event.phase === 'dispatch'
            && event.idempotencyKey === envelope.trace.idempotencyKey
            && event.taskIdempotencyKey === envelope.trace.taskIdempotencyKey
            && event.dispatchIdempotencyKey === envelope.trace.dispatchIdempotencyKey
            && event.dispatchAttempt === 1
            && event.dispatchReason === 'initial_dispatch'
    )));
    assert.equal(envelope.message.kind, 'task_request');
    assert.equal(envelope.message.id, '00000000-0000-4000-8000-000000000201');
    assert.match(envelope.message.traceparent, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
    assert.equal(envelope.message.context.traceparent, envelope.message.traceparent);
    assert.deepEqual(envelope.message.context.openclawDispatch, {
        schemaVersion: 'openclaw.task_dispatch.context.v1',
        taskId: '00000000-0000-4000-8000-000000000201',
        attempt: 1,
        reason: 'initial_dispatch',
        idempotencyKey: 'task:00000000-0000-4000-8000-000000000201:attempt:1',
        taskIdempotencyKey: 'task:00000000-0000-4000-8000-000000000201',
        sentAt: 200_001
    });
});

test('runQueueMaintenance re-dispatches retry-scheduled tasks through the file outbox', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const store = new FileTaskStore({ filePath: queuePath, now: () => 300_000 });
    const request = makeRequest('00000000-0000-4000-8000-000000000301', {
        priority: 'high',
        planner: 'cognition-core/cognition-iteration-task-planner',
        target: 'agent:retry-worker'
    });

    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/cognition-iteration-tasks.json',
        nowFactory: () => 250_000,
        maxRetries: 2
    });
    record.status = 'retry_scheduled';
    record.attempts = 1;
    record.nextRetryAt = 260_000;
    record.updatedAt = 250_100;
    await store.saveRecord(record);

    const result = await runQueueMaintenance({
        storePath: queuePath,
        outboxDir,
        nowFactory: () => 300_000
    });

    assert.equal(result.checked, 1);
    assert.equal(result.retried, 1);
    assert.equal(result.scheduledRetries, 0);
    assert.equal(result.timedOut, 0);

    const records = await store.loadRecords();
    assert.equal(records[0].status, 'dispatched');
    assert.equal(records[0].attempts, 2);
    assert.equal(records[0].nextRetryAt, null);

    const outboxFile = path.join(outboxDir, targetToFile('agent:retry-worker'));
    assert.equal(fs.existsSync(outboxFile), true);
    const lines = fs.readFileSync(outboxFile, 'utf8').trim().split('\n');
    assert.equal(lines.length, 1);
    const envelope = JSON.parse(lines[0]);
    assert.equal(envelope.message.id, request.id);
    assert.equal(envelope.message.kind, 'task_request');
    assert.equal(envelope.trace.schemaVersion, 'openclaw.task_dispatch.trace.v1');
    assert.equal(envelope.trace.taskId, request.id);
    assert.equal(envelope.trace.target, 'agent:retry-worker');
    assert.equal(envelope.trace.dispatchAttempt, 2);
    assert.equal(envelope.trace.dispatchReason, 'scheduled_retry');
    assert.equal(envelope.trace.idempotencyKey, `task:${request.id}`);
    assert.equal(envelope.trace.taskIdempotencyKey, `task:${request.id}`);
    assert.equal(envelope.trace.dispatchIdempotencyKey, `task:${request.id}:attempt:2`);
    assert.equal(envelope.trace.trajectoryEventCount, 2);
    assert.equal(envelope.message.context.openclawDispatch.attempt, 2);
    assert.equal(envelope.message.context.openclawDispatch.reason, 'scheduled_retry');
    assert.equal(envelope.message.context.openclawDispatch.idempotencyKey, `task:${request.id}:attempt:2`);
    assert.deepEqual(envelope.trajectoryEvents.map((event) => event.event), [
        'task_dispatch_selected',
        'task_dispatch_outbox_enqueued'
    ]);
    assert.match(envelope.trace.traceparent, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
});

test('maintain-queue CLI exposes retry maintenance for operators', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const store = new FileTaskStore({ filePath: queuePath, now: () => 500_000 });
    const request = makeRequest('00000000-0000-4000-8000-000000000501', {
        priority: 'high',
        planner: 'cognition-core/cognition-iteration-task-planner',
        target: 'agent:cli-retry-worker'
    });

    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/cognition-iteration-tasks.json',
        nowFactory: () => 450_000,
        maxRetries: 2
    });
    record.status = 'retry_scheduled';
    record.attempts = 1;
    record.nextRetryAt = 450_100;
    record.updatedAt = 450_000;
    await store.saveRecord(record);

    const result = spawnSync('npx', [
        'tsx',
        MAINTAIN_QUEUE_SCRIPT,
        '--store',
        queuePath,
        '--outbox-dir',
        outboxDir
    ], {
        cwd: path.dirname(MAINTAIN_QUEUE_SCRIPT),
        encoding: 'utf8'
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Loaded: 1/);
    assert.match(result.stdout, /Retried: 1/);

    const records = await store.loadRecords();
    assert.equal(records[0].status, 'dispatched');
    assert.equal(records[0].attempts, 2);

    const outboxFile = path.join(outboxDir, targetToFile('agent:cli-retry-worker'));
    assert.equal(fs.existsSync(outboxFile), true);
    const [line] = fs.readFileSync(outboxFile, 'utf8').trim().split('\n');
    assert.equal(JSON.parse(line).message.id, request.id);
});

test('runQueueMaintenance times out overdue dispatched tasks after retry budget is exhausted', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const store = new FileTaskStore({ filePath: queuePath, now: () => 400_000 });
    const request = makeRequest('00000000-0000-4000-8000-000000000401', {
        priority: 'high',
        planner: 'cognition-core/cognition-iteration-task-planner',
        target: 'agent:timeout-worker'
    });

    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/cognition-iteration-tasks.json',
        nowFactory: () => 350_000,
        maxRetries: 1
    });
    record.status = 'dispatched';
    record.attempts = 2;
    record.deadlineAt = 360_000;
    record.updatedAt = 350_100;
    await store.saveRecord(record);

    const result = await runQueueMaintenance({
        storePath: queuePath,
        outboxDir,
        nowFactory: () => 400_000
    });

    assert.equal(result.checked, 1);
    assert.equal(result.timedOut, 1);
    assert.equal(result.retried, 0);

    const records = await store.loadRecords();
    assert.equal(records[0].status, 'timed_out');
    assert.equal(records[0].closedAt, 400_000);

    const outboxFile = path.join(outboxDir, targetToFile('agent:timeout-worker'));
    assert.equal(fs.existsSync(outboxFile), false);
});
