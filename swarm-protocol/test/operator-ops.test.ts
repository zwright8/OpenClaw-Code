import test from 'node:test';
import assert from 'node:assert/strict';
import {
    collectLifecycleEvents,
    drainTarget,
    listQueue,
    overrideApproval,
    replayTask,
    rerouteTaskRecord,
    summarizeTaskRecords
} from '../index.js';

function sampleRecords() {
    return [
        {
            taskId: 'task-a',
            target: 'agent:alpha',
            status: 'dispatched',
            attempts: 1,
            createdAt: 100,
            updatedAt: 120,
            request: {
                priority: 'high',
                task: 'Analyze metrics',
                target: 'agent:alpha'
            },
            history: [{ at: 100, event: 'created' }, { at: 120, event: 'send_success' }]
        },
        {
            taskId: 'task-b',
            target: 'agent:beta',
            status: 'awaiting_approval',
            attempts: 0,
            createdAt: 200,
            updatedAt: 220,
            request: {
                priority: 'critical',
                task: 'Deploy release',
                target: 'agent:beta'
            },
            approval: {
                status: 'pending'
            },
            history: [{ at: 200, event: 'created' }, { at: 220, event: 'approval_requested' }]
        },
        {
            taskId: 'task-c',
            target: 'agent:alpha',
            status: 'completed',
            attempts: 1,
            createdAt: 50,
            updatedAt: 90,
            closedAt: 90,
            request: {
                priority: 'normal',
                task: 'Done task',
                target: 'agent:alpha'
            },
            history: [{ at: 50, event: 'created' }, { at: 90, event: 'result' }]
        }
    ];
}

test('summarizeTaskRecords and listQueue produce operator views', () => {
    const records = sampleRecords();
    const summary = summarizeTaskRecords(records);
    assert.equal(summary.total, 3);
    assert.equal(summary.terminal, 1);
    assert.equal(summary.pendingApprovals, 1);

    const queue = listQueue(records);
    assert.equal(queue.length, 2);
    assert.equal(queue[0].taskId, 'task-b');

    const approvals = listQueue(records, { approvalsOnly: true });
    assert.equal(approvals.length, 1);
    assert.equal(approvals[0].taskId, 'task-b');
});

test('replayTask returns task history timeline', () => {
    const replay = replayTask(sampleRecords(), 'task-a');
    assert.ok(replay);
    assert.equal(replay.taskId, 'task-a');
    assert.equal(replay.history.length, 2);
});

test('rerouteTaskRecord updates target and appends operator history', () => {
    const result = rerouteTaskRecord(sampleRecords(), 'task-a', 'agent:gamma', {
        actor: 'human:ops',
        now: () => 999
    });

    assert.equal(result.updated.target, 'agent:gamma');
    assert.equal(result.updated.request.target, 'agent:gamma');
    assert.equal(result.updated.status, 'created');
    assert.equal(result.updated.history[result.updated.history.length - 1].event, 'operator_reroute');
});

test('drainTarget reroutes or pauses matching open tasks', () => {
    const redirected = drainTarget(sampleRecords(), 'agent:alpha', {
        redirectTarget: 'agent:delta',
        now: () => 1_200
    });
    assert.equal(redirected.updated.length, 1);
    assert.equal(redirected.updated[0].target, 'agent:delta');

    const paused = drainTarget(sampleRecords(), 'agent:alpha', {
        now: () => 1_300
    });
    assert.equal(paused.updated.length, 1);
    assert.equal(paused.updated[0].status, 'paused_drain');
});

test('overrideApproval updates review status with explicit decision', () => {
    const approved = overrideApproval(sampleRecords(), 'task-b', {
        approved: true,
        actor: 'human:ops',
        now: () => 2_000
    });
    assert.equal(approved.updated.status, 'created');
    assert.equal(approved.updated.approval.status, 'approved');

    const denied = overrideApproval(sampleRecords(), 'task-b', {
        approved: false,
        actor: 'human:ops',
        now: () => 2_100
    });
    assert.equal(denied.updated.status, 'rejected');
    assert.equal(denied.updated.approval.status, 'denied');
});

test('collectLifecycleEvents merges and sorts task history', () => {
    const events = collectLifecycleEvents(sampleRecords(), { limit: 3 });
    assert.equal(events.length, 3);
    assert.ok(events[0].at >= events[1].at);

    const filtered = collectLifecycleEvents(sampleRecords(), { taskId: 'task-a' });
    assert.equal(filtered.length, 2);
    assert.equal(filtered[0].taskId, 'task-a');
});
