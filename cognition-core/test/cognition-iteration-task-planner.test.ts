import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildCognitionIterationTasks,
    mapIterationPriorityToTaskPriority,
    resolveIterationTarget
} from '../src/cognition-iteration-task-planner.js';

test('maps iteration priorities to task priorities', () => {
    assert.equal(mapIterationPriorityToTaskPriority('P1'), 'critical');
    assert.equal(mapIterationPriorityToTaskPriority('P2'), 'high');
    assert.equal(mapIterationPriorityToTaskPriority('P3'), 'normal');
    assert.equal(mapIterationPriorityToTaskPriority('x'), 'normal');
});

test('resolves iteration targets with overrides', () => {
    const targets = { P1: 'agent:cognition:critical', P2: 'agent:cognition:ops' };
    assert.equal(resolveIterationTarget('P1', targets, 'agent:cognition:default'), 'agent:cognition:critical');
    assert.equal(resolveIterationTarget('P3', targets, 'agent:cognition:default'), 'agent:cognition:default');
});

test('builds task requests from cognition iteration hypotheses', () => {
    const plan = {
        hypotheses: [
            {
                id: 'h1',
                priority: 'P1',
                title: 'Extinguish recurring failure signatures',
                question: 'Which signature should we target?',
                metric: 'recurringSignatures',
                target: '<= 1',
                experiment: 'Patch top failure mode',
                stopCondition: 'Stop if no improvement in 2 runs'
            },
            {
                id: 'h2',
                priority: 'P3',
                title: 'Frontier curiosity probe',
                question: 'What new skill should be tested?',
                experiment: 'Run weekly frontier experiment'
            }
        ]
    };

    const tasks = buildCognitionIterationTasks(plan, {
        fromAgentId: 'agent:main',
        sourceReport: '/tmp/cognition-iteration-plan.json',
        targetMap: { P1: 'agent:cognition:critical' },
        defaultTarget: 'agent:cognition:ops',
        idFactory: (index) => `20000000-0000-4000-8000-00000000000${index + 1}`,
        nowFactory: () => 3_000
    });

    assert.equal(tasks.length, 2);
    assert.equal(tasks[0].priority, 'critical');
    assert.equal(tasks[0].target, 'agent:cognition:critical');
    assert.equal(tasks[0].createdAt, 3_000);
    assert.ok(tasks[0].task.includes('Extinguish recurring failure signatures'));
    assert.equal(tasks[1].priority, 'normal');
    assert.equal(tasks[1].target, 'agent:cognition:ops');
});
