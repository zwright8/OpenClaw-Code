import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'crypto';
import { TaskRequest, TaskResult } from '../src/schemas.js';

test('task schemas parse record fields under Zod 3 and Zod 4', () => {
    const task = TaskRequest.parse({
        kind: 'task_request',
        id: randomUUID(),
        from: 'agent:source',
        target: 'agent:target',
        priority: 'high',
        task: 'Validate capability smoke task',
        context: {
            capabilityId: 'intervention_portfolio',
            nested: {
                residualGap: 12
            }
        },
        createdAt: 1_000_000
    });

    assert.equal(task.context?.capabilityId, 'intervention_portfolio');
    assert.deepEqual(task.context?.nested, { residualGap: 12 });

    const result = TaskResult.parse({
        kind: 'task_result',
        taskId: task.id,
        from: 'agent:target',
        status: 'success',
        output: 'Capability task validated',
        metrics: {
            latencyMs: 42,
            retryCount: 0
        },
        completedAt: 1_000_100
    });

    assert.equal(result.metrics?.latencyMs, 42);
});
