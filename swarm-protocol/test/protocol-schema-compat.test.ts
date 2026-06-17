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
            traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
            nested: {
                residualGap: 12
            }
        },
        traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
        createdAt: 1_000_000
    });

    assert.equal(task.context?.capabilityId, 'intervention_portfolio');
    assert.equal(task.traceparent, '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');
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
        traceparent: task.traceparent,
        traceEvents: [
            {
                kind: 'tool',
                traceparent: task.traceparent,
                spanContext: {
                    traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
                    spanId: '1111111111111111',
                    parentSpanId: '00f067aa0ba902b7'
                }
            }
        ],
        completedAt: 1_000_100
    });

    assert.equal(result.metrics?.latencyMs, 42);
    assert.equal(result.traceparent, task.traceparent);
    assert.equal(result.traceEvents?.length, 1);
});
