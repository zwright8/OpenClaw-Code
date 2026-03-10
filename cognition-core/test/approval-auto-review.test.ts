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
    autoReviewAwaitingApprovals,
    evaluateAutoApprovalDecision
} from '../src/approval-auto-review.js';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-approval-review-'));
}

function targetToFile(target) {
    return `${target.replace(/[^a-z0-9._-]+/gi, '_')}.jsonl`;
}

function makeAwaitingRecord({
    id,
    target = 'agent:ops',
    planner = 'cognition-core/remediation-task-planner',
    matchedRules = ['critical_priority']
}) {
    const request = buildTaskRequest({
        id,
        from: 'agent:main',
        target,
        priority: 'critical',
        task: `Task ${id}`,
        context: {
            planner
        },
        createdAt: 100_000
    });
    const record = buildQueueRecordFromTaskRequest(request, {
        nowFactory: () => 100_001,
        source: 'reports/remediation-tasks.json'
    });
    record.status = 'awaiting_approval';
    record.approval = {
        status: 'pending',
        reviewerGroup: 'human-review',
        reason: `approval_required:${matchedRules.join(',')}`,
        matchedRules,
        requestedAt: 100_002,
        reviewedAt: null,
        reviewer: null,
        reviewReason: null
    };
    record.history.push({
        at: 100_002,
        event: 'approval_requested',
        reason: record.approval.reason
    });
    return record;
}

test('evaluateAutoApprovalDecision approves strict cognition critical rule and skips blocked rules', () => {
    const approved = evaluateAutoApprovalDecision(makeAwaitingRecord({
        id: '00000000-0000-4000-8000-000000000601',
        matchedRules: ['critical_priority']
    }));
    assert.equal(approved.action, 'approve');

    const skipped = evaluateAutoApprovalDecision(makeAwaitingRecord({
        id: '00000000-0000-4000-8000-000000000602',
        matchedRules: ['high_risk_tag']
    }));
    assert.equal(skipped.action, 'skip');
    assert.ok(skipped.reason.startsWith('blocked_rule:'));

    const denied = evaluateAutoApprovalDecision(makeAwaitingRecord({
        id: '00000000-0000-4000-8000-000000000603',
        matchedRules: ['high_risk_tag']
    }), {
        denyUnsupported: true
    });
    assert.equal(denied.action, 'deny');
});

test('autoReviewAwaitingApprovals approves allowed cognition tasks and dispatches to outbox', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const store = new FileTaskStore({ filePath: queuePath });

    const record = makeAwaitingRecord({
        id: '00000000-0000-4000-8000-000000000701',
        target: 'agent:ops',
        matchedRules: ['critical_priority']
    });
    await store.saveRecord(record);

    const result = await autoReviewAwaitingApprovals({
        storePath: queuePath,
        outboxDir
    });

    assert.equal(result.stats.pendingTotal, 1);
    assert.equal(result.stats.approved, 1);
    assert.equal(result.stats.denied, 0);
    assert.equal(result.stats.dispatchedAfterApproval, 1);

    const records = await store.loadRecords();
    assert.equal(records.length, 1);
    assert.equal(records[0].status, 'dispatched');

    const outboxFile = path.join(outboxDir, targetToFile('agent:ops'));
    assert.equal(fs.existsSync(outboxFile), true);
    const lines = fs.readFileSync(outboxFile, 'utf8').trim().split('\n');
    assert.equal(lines.length, 1);
});

test('autoReviewAwaitingApprovals skips unsupported by default and can deny when configured', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const store = new FileTaskStore({ filePath: queuePath });

    const record = makeAwaitingRecord({
        id: '00000000-0000-4000-8000-000000000801',
        target: 'agent:ops',
        matchedRules: ['high_risk_tag']
    });
    await store.saveRecord(record);

    const skipped = await autoReviewAwaitingApprovals({
        storePath: queuePath,
        outboxDir
    });
    assert.equal(skipped.stats.skipped, 1);
    assert.equal(skipped.stats.denied, 0);

    const denied = await autoReviewAwaitingApprovals({
        storePath: queuePath,
        outboxDir,
        denyUnsupported: true
    });
    assert.equal(denied.stats.denied, 1);
    assert.equal(denied.stats.skipped, 0);

    const records = await store.loadRecords();
    assert.equal(records[0].status, 'rejected');
});
