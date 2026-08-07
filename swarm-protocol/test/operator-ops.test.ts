import test from 'node:test';
import assert from 'node:assert/strict';
import {
    collectLifecycleEvents,
    buildTaskDispatchFingerprint,
    drainTarget,
    listQueue,
    overrideApproval,
    recoverStaleDispatchRecord,
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
    assert.equal(replay.dispatchFingerprint, buildTaskDispatchFingerprint(sampleRecords()[0]));
});

test('recoverStaleDispatchRecord rejects a decision for a changed dispatch candidate', () => {
    const records = sampleRecords();
    records[0].dispatchFingerprint = 'current-fingerprint';

    assert.throws(
        () => recoverStaleDispatchRecord(records, 'task-a', 'escalate_manual_review', {
            expectedDispatchFingerprint: 'old-fingerprint',
            now: () => 1_800_120
        }),
        /dispatch fingerprint mismatch/
    );

    assert.throws(
        () => recoverStaleDispatchRecord(records, 'task-a', 'escalate_manual_review', {
            now: () => 1_800_120
        }),
        /recovery requires expectedDispatchFingerprint/
    );
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

test('recoverStaleDispatchRecord records decision and safely requeues only no-side-effect tasks', () => {
    const result = recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'requeue_no_side_effect', {
        actor: 'human:ops',
        reason: 'external_runtime_empty',
        sideEffectStatus: 'none',
        externalRuntimeCorrelation: '00-11111111111111111111111111111111-2222222222222222-01',
        evidenceReviewed: [
            'replay_timeline_reviewed',
            'external_runtime_result_checked',
            'side_effect_ledger_checked'
        ],
        now: () => 1_800_120
    });

    assert.equal(result.previousStatus, 'dispatched');
    assert.equal(result.updated.status, 'created');
    assert.equal(result.updated.updatedAt, 1_800_120);
    assert.equal(result.updated.deadlineAt, 1_800_120);
    assert.equal(result.updated.nextRetryAt, null);
    assert.equal(result.updated.recoveryDecision.schemaVersion, 'swarm-protocol.stale-dispatch-recovery-decision.v1');
    assert.equal(result.updated.recoveryDecision.decision, 'requeue_no_side_effect');
    assert.equal(result.updated.recoveryDecision.sideEffectStatus, 'none');
    assert.equal(
        result.updated.recoveryDecision.externalRuntimeCorrelation,
        '00-11111111111111111111111111111111-2222222222222222-01'
    );
    assert.equal(
        result.updated.history[result.updated.history.length - 1].event,
        'operator_stale_dispatch_recovery_decision'
    );

    assert.throws(
        () => recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'requeue_no_side_effect', {
            sideEffectStatus: 'unknown'
        }),
        /requires sideEffectStatus=none/
    );

    assert.throws(
        () => recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'requeue_no_side_effect', {
            sideEffectStatus: 'none',
            evidenceReviewed: ['replay_timeline_reviewed']
        }),
        /requeue_no_side_effect requires evidence: external_runtime_result_checked, side_effect_ledger_checked/
    );
});

test('recoverStaleDispatchRecord closes, fails, or pauses stale dispatches with audit context', () => {
    const completed = recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'close_completed', {
        sideEffectStatus: 'completed',
        evidenceReviewed: [
            'replay_timeline_reviewed',
            'external_runtime_result_checked',
            'side_effect_ledger_checked'
        ],
        now: () => 1_800_120
    });
    assert.equal(completed.updated.status, 'completed');
    assert.equal(completed.updated.closedAt, 1_800_120);

    assert.throws(
        () => recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'close_completed'),
        /close_completed requires evidence: replay_timeline_reviewed, external_runtime_result_checked, side_effect_ledger_checked/
    );

    assert.throws(
        () => recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'close_completed', {
            sideEffectStatus: 'unknown',
            evidenceReviewed: [
                'replay_timeline_reviewed',
                'external_runtime_result_checked',
                'side_effect_ledger_checked'
            ]
        }),
        /close_completed requires sideEffectStatus=completed/
    );

    const failed = recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'fail_side_effect_unknown', {
        reason: 'side_effect_ambiguous',
        sideEffectStatus: 'unknown',
        now: () => 1_800_220
    });
    assert.equal(failed.updated.status, 'failed');
    assert.equal(failed.updated.closedAt, 1_800_220);
    assert.equal(failed.updated.lastError, 'side_effect_ambiguous');

    const escalated = recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'escalate_manual_review', {
        sideEffectStatus: 'unknown',
        now: () => 1_800_320
    });
    assert.equal(escalated.updated.status, 'paused_recovery');
    assert.equal(escalated.updated.closedAt, undefined);

    assert.throws(
        () => recoverStaleDispatchRecord(sampleRecords(), 'task-a', 'escalate_manual_review', {
            now: () => 500
        }),
        /Task task-a is not stale \(age=380ms threshold=1800000ms\)/
    );

    assert.throws(
        () => recoverStaleDispatchRecord(sampleRecords(), 'task-b', 'escalate_manual_review'),
        /not dispatched/
    );
});

test('collectLifecycleEvents merges and sorts task history', () => {
    const events = collectLifecycleEvents(sampleRecords(), { limit: 3 });
    assert.equal(events.length, 3);
    assert.ok(events[0].at >= events[1].at);

    const filtered = collectLifecycleEvents(sampleRecords(), { taskId: 'task-a' });
    assert.equal(filtered.length, 2);
    assert.equal(filtered[0].taskId, 'task-a');
});
