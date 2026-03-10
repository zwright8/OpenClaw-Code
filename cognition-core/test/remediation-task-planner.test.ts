import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildRemediationTasks,
    mapPriorityToTaskPriority,
    resolveTarget
} from '../src/remediation-task-planner.js';

test('maps remediation priorities to swarm task priorities', () => {
    assert.equal(mapPriorityToTaskPriority('P1'), 'critical');
    assert.equal(mapPriorityToTaskPriority('P2'), 'high');
    assert.equal(mapPriorityToTaskPriority('P3'), 'normal');
    assert.equal(mapPriorityToTaskPriority('UNKNOWN'), 'normal');
});

test('resolves targets with overrides and default fallback', () => {
    const targets = { P1: 'agent:red', P2: 'agent:amber' };
    assert.equal(resolveTarget('P1', targets, 'agent:default'), 'agent:red');
    assert.equal(resolveTarget('P2', targets, 'agent:default'), 'agent:amber');
    assert.equal(resolveTarget('P3', targets, 'agent:default'), 'agent:default');
});

test('builds schema-valid task requests from remediation plan', () => {
    const plan = [
        {
            priority: 'P1',
            title: 'Mitigate critical outages',
            rationale: 'Error rate is spiking',
            action: 'Introduce guarded retries and alerting.'
        },
        {
            priority: 'P3',
            title: 'Improve docs',
            rationale: 'Onboarding friction reported',
            action: 'Publish setup walkthrough.'
        }
    ];

    const tasks = buildRemediationTasks(plan, {
        fromAgentId: 'agent:main',
        sourceReport: '/tmp/report.json',
        targetMap: { P1: 'agent:incident', P3: 'agent:docs' },
        defaultTarget: 'agent:ops',
        idFactory: (index) => `00000000-0000-4000-8000-00000000000${index + 1}`,
        nowFactory: () => 1_000
    });

    assert.equal(tasks.length, 2);

    assert.equal(tasks[0].priority, 'critical');
    assert.equal(tasks[0].target, 'agent:incident');
    assert.equal(tasks[0].from, 'agent:main');
    assert.equal(tasks[0].context.sourceReport, '/tmp/report.json');
    assert.equal(tasks[0].createdAt, 1_000);
    assert.ok(tasks[0].task.includes('Mitigate critical outages'));

    assert.equal(tasks[1].priority, 'normal');
    assert.equal(tasks[1].target, 'agent:docs');
    assert.equal(tasks[1].createdAt, 1_001);
});

test('supports maxItems cap and rejects invalid remediation entries', () => {
    const plan = [
        {
            priority: 'P2',
            title: 'Fix flaky transport',
            rationale: 'Intermittent failures',
            action: 'Add timeout and retry instrumentation.'
        },
        {
            priority: 'P3',
            title: 'Polish dashboards',
            rationale: 'UX confusion',
            action: 'Refactor status labels.'
        }
    ];

    const capped = buildRemediationTasks(plan, {
        maxItems: 1,
        idFactory: () => '11111111-1111-4111-8111-111111111111',
        nowFactory: () => 2_000
    });
    assert.equal(capped.length, 1);

    assert.throws(
        () => buildRemediationTasks([{ priority: 'P1', title: 'Missing action' }]),
        /Missing remediation action/
    );
});
