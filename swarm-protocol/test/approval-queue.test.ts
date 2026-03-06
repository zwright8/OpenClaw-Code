import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApprovalQueue, formatApprovalQueueMarkdown } from '../index.js';

test('buildApprovalQueue selects and sorts pending approvals', () => {
    const queue = buildApprovalQueue([
        {
            taskId: 'a',
            status: 'awaiting_approval',
            createdAt: 1_000,
            request: { priority: 'normal', task: 'Task A' },
            approval: { status: 'pending', reviewerGroup: 'ops', requestedAt: 1_000, reason: 'manual' }
        },
        {
            taskId: 'b',
            status: 'awaiting_approval',
            createdAt: 1_000,
            request: { priority: 'critical', task: 'Task B' },
            approval: { status: 'pending', reviewerGroup: 'legal', requestedAt: 900, reason: 'critical' }
        },
        {
            taskId: 'c',
            status: 'completed',
            request: { priority: 'high', task: 'Task C' }
        },
        {
            taskId: 'd',
            status: 'awaiting_approval',
            request: { priority: 'high', task: 'Task D' },
            approval: { status: 'approved', requestedAt: 1_100 }
        }
    ], { nowMs: 2_000 });

    assert.equal(queue.total, 2);
    assert.equal(queue.items[0].taskId, 'b'); // critical first
    assert.equal(queue.items[1].taskId, 'a');
    assert.equal(queue.byPriority.critical, 1);
    assert.equal(queue.byPriority.normal, 1);
});

test('formatApprovalQueueMarkdown renders a table', () => {
    const markdown = formatApprovalQueueMarkdown({
        generatedAt: '2026-02-25T00:00:00.000Z',
        total: 1,
        items: [
            {
                priority: 'high',
                taskId: 't-1',
                reviewerGroup: 'ops-review',
                ageMs: 3_500,
                task: 'Deploy fix',
                reason: 'critical_priority'
            }
        ]
    });

    assert.ok(markdown.includes('# Approval Queue'));
    assert.ok(markdown.includes('| Priority | Task ID |'));
    assert.ok(markdown.includes('t-1'));
});
