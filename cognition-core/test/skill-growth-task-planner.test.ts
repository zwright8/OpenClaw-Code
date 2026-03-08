import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildSkillGrowthTasks,
    mapSkillPriorityToTaskPriority,
    resolveSkillGrowthTarget
} from '../src/skill-growth-task-planner.js';

test('maps skill priorities to task priorities', () => {
    assert.equal(mapSkillPriorityToTaskPriority('P1'), 'critical');
    assert.equal(mapSkillPriorityToTaskPriority('P2'), 'high');
    assert.equal(mapSkillPriorityToTaskPriority('P3'), 'normal');
    assert.equal(mapSkillPriorityToTaskPriority('UNKNOWN'), 'normal');
});

test('resolves skill growth targets with overrides and default fallback', () => {
    const targets = { P1: 'agent:learning:urgent', P2: 'agent:learning:normal' };
    assert.equal(resolveSkillGrowthTarget('P1', targets, 'agent:learning'), 'agent:learning:urgent');
    assert.equal(resolveSkillGrowthTarget('P2', targets, 'agent:learning'), 'agent:learning:normal');
    assert.equal(resolveSkillGrowthTarget('P3', targets, 'agent:learning'), 'agent:learning');
});

test('builds schema-valid task requests from skill growth plan', () => {
    const plan = {
        focusAreas: [
            {
                priority: 'P1',
                focus: 'timeout_resilience',
                label: 'Timeout resilience',
                rationale: 'timeouts increased',
                learningAction: 'Tune retries and timeouts',
                suggestedSkills: [{ name: 'auto-retry-and-backoff-coordinator' }]
            },
            {
                priority: 'P2',
                focus: 'failure_root_cause',
                label: 'Failure root-cause mining',
                rationale: 'failures recurring',
                learningAction: 'Cluster failures and patch top mode',
                suggestedSkills: [{ name: 'failure-root-cause-miner' }]
            }
        ]
    };

    const tasks = buildSkillGrowthTasks(plan, {
        fromAgentId: 'agent:main',
        sourceReport: '/tmp/learning-loop.json',
        targetMap: { P1: 'agent:learning:urgent', P2: 'agent:learning' },
        defaultTarget: 'agent:learning',
        idFactory: (index) => `10000000-0000-4000-8000-00000000000${index + 1}`,
        nowFactory: () => 2_000
    });

    assert.equal(tasks.length, 2);
    assert.equal(tasks[0].priority, 'critical');
    assert.equal(tasks[0].target, 'agent:learning:urgent');
    assert.equal(tasks[0].from, 'agent:main');
    assert.equal(tasks[0].createdAt, 2_000);
    assert.ok(tasks[0].task.includes('Timeout resilience'));
    assert.ok(tasks[0].task.includes('auto-retry-and-backoff-coordinator'));

    assert.equal(tasks[1].priority, 'high');
    assert.equal(tasks[1].target, 'agent:learning');
    assert.equal(tasks[1].createdAt, 2_001);
});

test('supports maxItems cap and rejects invalid focus entries', () => {
    const plan = {
        focusAreas: [
            {
                priority: 'P2',
                focus: 'routing_and_constraints',
                label: 'Routing and constraints',
                learningAction: 'Improve matching'
            },
            {
                priority: 'P3',
                focus: 'error_observability',
                label: 'Error observability',
                learningAction: 'Add telemetry'
            }
        ]
    };

    const capped = buildSkillGrowthTasks(plan, {
        maxItems: 1,
        idFactory: () => '11111111-1111-4111-8111-111111111111',
        nowFactory: () => 3_000
    });
    assert.equal(capped.length, 1);

    assert.throws(
        () => buildSkillGrowthTasks({ focusAreas: [{ priority: 'P1', focus: 'timeout' }] }),
        /Missing skill learningAction/
    );
});
