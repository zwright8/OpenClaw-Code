import test from 'node:test';
import assert from 'node:assert/strict';
import { TaskRequest } from '../../swarm-protocol/runtime.js';
import {
    buildQueueRecordFromTaskRequest,
    planTaskEnqueue
} from '../src/task-bundle-enqueuer.js';

function makeRequest(id, overrides = {}) {
    return TaskRequest.parse({
        kind: 'task_request',
        id,
        from: 'agent:main',
        target: 'agent:ops',
        priority: 'high',
        task: 'Repair memory-learning drift',
        context: {
            planner: 'cognition-core/remediation-task-planner'
        },
        createdAt: 10_000,
        ...overrides
    });
}

test('planTaskEnqueue skips duplicate open fingerprint', () => {
    const existingRequest = makeRequest('00000000-0000-4000-8000-000000000001');
    const existingRecord = buildQueueRecordFromTaskRequest(existingRequest, {
        nowFactory: () => 10_010,
        source: 'existing-bundle'
    });

    const incomingRequest = makeRequest('00000000-0000-4000-8000-000000000002');
    const plan = planTaskEnqueue(
        [{ source: 'incoming', request: incomingRequest }],
        [existingRecord]
    );

    assert.equal(plan.stats.accepted, 0);
    assert.equal(plan.stats.skippedDuplicateOpenFingerprint, 1);
    assert.equal(plan.skipped[0].reason, 'duplicate_open_fingerprint');
});

test('planTaskEnqueue allows fingerprint reuse when existing task is terminal', () => {
    const existingRequest = makeRequest('00000000-0000-4000-8000-000000000011');
    const existingRecord = buildQueueRecordFromTaskRequest(existingRequest, {
        nowFactory: () => 10_010,
        source: 'existing-bundle'
    });
    existingRecord.status = 'completed';
    existingRecord.closedAt = 10_020;
    existingRecord.updatedAt = 10_020;

    const incomingRequest = makeRequest('00000000-0000-4000-8000-000000000012');
    const plan = planTaskEnqueue(
        [{ source: 'incoming', request: incomingRequest }],
        [existingRecord]
    );

    assert.equal(plan.stats.accepted, 1);
    assert.equal(plan.stats.skippedDuplicateOpenFingerprint, 0);
});

test('planTaskEnqueue skips duplicate ids regardless of fingerprint policy', () => {
    const existingRequest = makeRequest('00000000-0000-4000-8000-000000000101');
    const existingRecord = buildQueueRecordFromTaskRequest(existingRequest, {
        nowFactory: () => 10_010
    });

    const incomingRequest = makeRequest('00000000-0000-4000-8000-000000000101', {
        task: 'Different task text'
    });
    const plan = planTaskEnqueue(
        [{ source: 'incoming', request: incomingRequest }],
        [existingRecord],
        { allowDuplicates: true }
    );

    assert.equal(plan.stats.accepted, 0);
    assert.equal(plan.stats.skippedDuplicateId, 1);
    assert.equal(plan.skipped[0].reason, 'duplicate_id');
});

test('buildQueueRecordFromTaskRequest creates orchestrator-compatible created record', () => {
    const request = makeRequest('00000000-0000-4000-8000-000000000201', {
        createdAt: 55_000,
        priority: 'critical',
        target: 'agent:cognition:critical'
    });
    const record = buildQueueRecordFromTaskRequest(request, {
        actor: 'agent:cognition-core',
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 56_000,
        defaultTimeoutMs: 90_000,
        maxRetries: 2
    });

    assert.equal(record.taskId, request.id);
    assert.equal(record.status, 'created');
    assert.equal(record.target, 'agent:cognition:critical');
    assert.equal(record.attempts, 0);
    assert.equal(record.maxRetries, 2);
    assert.equal(record.deadlineAt, 145_000);
    assert.equal(record.history.length, 2);
    assert.equal(record.history[0].event, 'created');
    assert.equal(record.history[1].event, 'cognition_enqueued');
    assert.equal(record.history[1].actor, 'agent:cognition-core');
    assert.equal(record.history[1].bundle, 'reports/remediation-tasks.json');
});
