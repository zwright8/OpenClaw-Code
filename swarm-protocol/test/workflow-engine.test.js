import test from 'node:test';
import assert from 'node:assert/strict';
import {
    WorkflowEngine,
    buildTaskResult,
    validateWorkflowDefinition
} from '../index.js';

function createMockOrchestrator() {
    const dispatched = [];
    let counter = 0;
    const toUuid = (index) => `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`;

    return {
        dispatched,
        async dispatchTask({ target, task, priority, context }) {
            counter++;
            const taskId = toUuid(counter);
            dispatched.push({ taskId, target, task, priority, context });
            return {
                taskId,
                target,
                status: 'dispatched'
            };
        }
    };
}

test('validateWorkflowDefinition rejects cycles and missing dependencies', () => {
    assert.throws(
        () => validateWorkflowDefinition({
            id: 'bad-deps',
            nodes: [
                { id: 'a', task: 'A', dependencies: ['missing'] }
            ]
        }),
        /unknown node/
    );

    assert.throws(
        () => validateWorkflowDefinition({
            id: 'cycle',
            nodes: [
                { id: 'a', task: 'A', dependencies: ['b'] },
                { id: 'b', task: 'B', dependencies: ['a'] }
            ]
        }),
        /cycle detected/
    );
});

test('linear workflow runs nodes in dependency order to completion', async () => {
    const mock = createMockOrchestrator();
    const engine = new WorkflowEngine({ orchestrator: mock, now: () => 1_000 });

    const workflow = await engine.startWorkflow({
        id: 'wf-linear',
        nodes: [
            { id: 'extract', task: 'Extract records' },
            { id: 'transform', task: 'Transform records', dependencies: ['extract'] },
            { id: 'publish', task: 'Publish report', dependencies: ['transform'] }
        ]
    });

    assert.equal(workflow.status, 'running');
    assert.equal(mock.dispatched.length, 1);
    assert.equal(mock.dispatched[0].task, 'Extract records');

    await engine.ingestResult(buildTaskResult({
        taskId: '00000000-0000-4000-8000-000000000001',
        from: 'agent:worker',
        status: 'success',
        output: 'done',
        completedAt: 1_100
    }));

    assert.equal(mock.dispatched.length, 2);
    assert.equal(mock.dispatched[1].task, 'Transform records');

    await engine.ingestResult(buildTaskResult({
        taskId: '00000000-0000-4000-8000-000000000002',
        from: 'agent:worker',
        status: 'success',
        output: 'done',
        completedAt: 1_200
    }));

    assert.equal(mock.dispatched.length, 3);
    assert.equal(mock.dispatched[2].task, 'Publish report');

    await engine.ingestResult(buildTaskResult({
        taskId: '00000000-0000-4000-8000-000000000003',
        from: 'agent:worker',
        status: 'success',
        output: 'done',
        completedAt: 1_300
    }));

    const finalState = engine.getWorkflow('wf-linear');
    assert.equal(finalState.status, 'completed');
    assert.equal(finalState.nodes.extract.status, 'completed');
    assert.equal(finalState.nodes.transform.status, 'completed');
    assert.equal(finalState.nodes.publish.status, 'completed');
});

test('branching workflow waits for all dependencies before fan-in node', async () => {
    const mock = createMockOrchestrator();
    const engine = new WorkflowEngine({ orchestrator: mock, now: () => 2_000 });

    await engine.startWorkflow({
        id: 'wf-branch',
        nodes: [
            { id: 'root', task: 'Root' },
            { id: 'left', task: 'Left branch', dependencies: ['root'] },
            { id: 'right', task: 'Right branch', dependencies: ['root'] },
            { id: 'join', task: 'Join branch', dependencies: ['left', 'right'] }
        ]
    });

    await engine.ingestResult(buildTaskResult({
        taskId: '00000000-0000-4000-8000-000000000001',
        from: 'agent:worker',
        status: 'success',
        output: 'done',
        completedAt: 2_100
    }));

    assert.equal(mock.dispatched.length, 3); // root + left + right

    await engine.ingestResult(buildTaskResult({
        taskId: '00000000-0000-4000-8000-000000000002',
        from: 'agent:worker',
        status: 'success',
        output: 'done',
        completedAt: 2_200
    }));

    assert.equal(mock.dispatched.length, 3); // join should not run yet

    await engine.ingestResult(buildTaskResult({
        taskId: '00000000-0000-4000-8000-000000000003',
        from: 'agent:worker',
        status: 'success',
        output: 'done',
        completedAt: 2_300
    }));

    assert.equal(mock.dispatched.length, 4);
    assert.equal(mock.dispatched[3].task, 'Join branch');
});

test('node failure fails the workflow', async () => {
    const mock = createMockOrchestrator();
    const engine = new WorkflowEngine({ orchestrator: mock, now: () => 3_000 });

    await engine.startWorkflow({
        id: 'wf-fail',
        nodes: [
            { id: 'a', task: 'Task A' },
            { id: 'b', task: 'Task B', dependencies: ['a'] }
        ]
    });

    await engine.ingestResult(buildTaskResult({
        taskId: '00000000-0000-4000-8000-000000000001',
        from: 'agent:worker',
        status: 'failure',
        output: 'boom',
        completedAt: 3_100
    }));

    const state = engine.getWorkflow('wf-fail');
    assert.equal(state.status, 'failed');
    assert.equal(state.failedNodeId, 'a');
    assert.equal(mock.dispatched.length, 1);

    const metrics = engine.getMetrics();
    assert.equal(metrics.failed, 1);
});
