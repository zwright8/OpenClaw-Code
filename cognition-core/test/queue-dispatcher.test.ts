import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
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
        outboxDir
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
    assert.equal(envelope.message.kind, 'task_request');
    assert.equal(envelope.message.id, '00000000-0000-4000-8000-000000000201');
    assert.match(envelope.message.traceparent, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
    assert.equal(envelope.message.context.traceparent, envelope.message.traceparent);
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
