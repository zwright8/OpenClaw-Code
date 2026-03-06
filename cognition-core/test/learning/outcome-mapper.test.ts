import test from 'node:test';
import assert from 'node:assert/strict';
import {
    outcomesFromGenericPayload,
    outcomesFromJournalEntries,
    outcomesFromTaskPackage
} from '../../src/learning/outcome-mapper.js';

test('outcomesFromJournalEntries replays task-store events and task_result updates', () => {
    const entries = [
        {
            type: 'upsert',
            taskId: 't1',
            record: {
                taskId: 't1',
                status: 'completed',
                attempts: 1,
                createdAt: 10,
                closedAt: 20,
                request: {
                    context: { recommendationId: 'rec-1' }
                }
            }
        },
        {
            type: 'upsert',
            taskId: 't2',
            record: {
                taskId: 't2',
                status: 'dispatched',
                createdAt: 15,
                request: {
                    context: { recommendationId: 'rec-2' },
                    target: 'agent:ops'
                }
            }
        },
        {
            kind: 'task_result',
            taskId: 't2',
            from: 'agent:ops',
            status: 'success',
            completedAt: 40
        },
        {
            type: 'delete',
            taskId: 't1'
        },
        {
            type: 'upsert',
            taskId: 't3',
            record: {
                taskId: 't3',
                status: 'failure',
                attempts: 2,
                createdAt: 100,
                closedAt: 180,
                request: {
                    target: 'agent:queue'
                }
            }
        }
    ];

    const outcomes = outcomesFromJournalEntries(entries, new Map([['t3', 'rec-3']]));

    assert.equal(outcomes.length, 2);

    const t2 = outcomes.find((item) => item.taskId === 't2');
    assert.ok(t2);
    assert.equal(t2?.status, 'completed');
    assert.equal(t2?.recommendationId, 'rec-2');
    assert.equal(t2?.owner, 'agent:ops');
    assert.equal(t2?.closedAt, 40);

    const t3 = outcomes.find((item) => item.taskId === 't3');
    assert.ok(t3);
    assert.equal(t3?.status, 'failed');
    assert.equal(t3?.recommendationId, 'rec-3');
});

test('outcomesFromTaskPackage maps packaged requests and blocked tasks', () => {
    const payload = {
        requests: [
            {
                id: 'task-1',
                target: 'agent:ops',
                createdAt: 100,
                context: {
                    recommendationId: 'rec-1'
                }
            }
        ],
        blocked: [
            {
                taskId: 'task-2',
                recommendationId: 'rec-2',
                reason: 'awaiting_human_approval'
            }
        ]
    };

    const outcomes = outcomesFromTaskPackage(payload);

    assert.equal(outcomes.length, 2);

    const request = outcomes.find((item) => item.taskId === 'task-1');
    assert.ok(request);
    assert.equal(request?.status, 'dispatched');
    assert.equal(request?.recommendationId, 'rec-1');

    const blocked = outcomes.find((item) => item.taskId === 'task-2');
    assert.ok(blocked);
    assert.equal(blocked?.status, 'awaiting_approval');
    assert.equal(blocked?.recommendationId, 'rec-2');
});

test('outcomesFromGenericPayload supports nested arrays and recommendation fallback mapping', () => {
    const payload = {
        outcomes: [
            {
                taskId: 'task-a',
                status: 'completed',
                attempts: 1,
                createdAt: 0,
                closedAt: 10
            },
            {
                id: 'task-b',
                result: {
                    status: 'failure',
                    completedAt: 120,
                    from: 'agent:worker'
                },
                request: {
                    target: 'agent:worker',
                    createdAt: 20
                }
            }
        ]
    };

    const outcomes = outcomesFromGenericPayload(payload, new Map([['task-a', 'rec-a']]));

    assert.equal(outcomes.length, 2);

    const first = outcomes.find((item) => item.taskId === 'task-a');
    assert.ok(first);
    assert.equal(first?.recommendationId, 'rec-a');
    assert.equal(first?.status, 'completed');

    const second = outcomes.find((item) => item.taskId === 'task-b');
    assert.ok(second);
    assert.equal(second?.status, 'failed');
    assert.equal(second?.owner, 'agent:worker');
    assert.equal(second?.createdAt, 20);
    assert.equal(second?.closedAt, 120);
});
