import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildHumanOversightWorkbench,
    HumanOversightWorkbench,
    oversightWorkbenchToTasks
} from '../index.js';

function baseInput() {
    return {
        taskRecords: [
            {
                taskId: 'task-approve-1',
                status: 'awaiting_approval',
                target: 'agent:deploy',
                updatedAt: 100_000,
                request: {
                    priority: 'critical',
                    task: 'Deploy production hotfix',
                    context: { riskScore: 82, releaseId: 'rel-123' }
                },
                approval: {
                    status: 'pending',
                    reason: 'critical_release'
                },
                assignedOperatorId: 'human:ops-1'
            },
            {
                taskId: 'task-failed-1',
                status: 'failed',
                target: 'agent:worker-a',
                updatedAt: 90_000,
                request: {
                    priority: 'high',
                    task: 'Backfill analytics tables',
                    context: { riskScore: 72 }
                },
                assignedOperatorId: 'human:ops-2'
            },
            {
                taskId: 'task-open-1',
                status: 'dispatched',
                target: 'agent:worker-b',
                updatedAt: 110_000,
                request: {
                    priority: 'normal',
                    task: 'Generate weekly digest',
                    context: { riskScore: 40 }
                },
                assignedOperatorId: 'human:ops-2'
            }
        ],
        operators: [
            { id: 'human:ops-1', name: 'Alex', maxConcurrent: 1 },
            { id: 'human:ops-2', name: 'Jordan', maxConcurrent: 2 }
        ]
    };
}

test('buildHumanOversightWorkbench prioritizes critical interventions and operator load', () => {
    const report = buildHumanOversightWorkbench(baseInput(), {
        now: () => 120_000
    });

    assert.equal(report.summary.taskCount, 3);
    assert.equal(report.summary.interventionCount >= 1, true);
    assert.equal(report.alerts.includes('pending_approvals_backlog'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'triage_critical_queue'), true);
    assert.equal(report.interventionQueue[0].urgencyScore >= report.interventionQueue[1].urgencyScore, true);
});

test('buildHumanOversightWorkbench returns stable posture for low-risk clear queue', () => {
    const report = buildHumanOversightWorkbench({
        taskRecords: [
            {
                taskId: 'task-stable',
                status: 'dispatched',
                target: 'agent:analysis',
                updatedAt: 119_500,
                request: {
                    priority: 'low',
                    task: 'Run low-priority report',
                    context: { riskScore: 8 }
                }
            }
        ],
        operators: [
            { id: 'human:ops-1', name: 'Alex', maxConcurrent: 3 }
        ]
    }, {
        now: () => 120_000
    });

    assert.equal(report.summary.posture, 'stable');
    assert.equal(report.summary.criticalCount, 0);
    assert.equal(report.alerts.length, 0);
});

test('oversightWorkbenchToTasks and class wrapper emit schema-valid tasks and history', () => {
    const workbench = new HumanOversightWorkbench({
        localAgentId: 'agent:oversight-local',
        now: () => 130_000
    });

    const report = workbench.evaluate(baseInput());
    const tasks = oversightWorkbenchToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = workbench.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:oversight-local');
    assert.equal(workbench.listHistory({ limit: 5 }).length, 1);
});
