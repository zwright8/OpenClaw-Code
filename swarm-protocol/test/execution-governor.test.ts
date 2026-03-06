import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ExecutionGovernor,
    buildGovernorTasks,
    evaluateExecutionGovernor
} from '../index.js';

test('evaluateExecutionGovernor returns normal mode for healthy signals', () => {
    const decision = evaluateExecutionGovernor({
        readinessReport: {
            status: 'ready',
            readinessScore: 96,
            summary: {
                missingCapabilityCount: 0,
                sandboxGapCount: 0,
                approvalRequiredCount: 0,
                approvalErrorCount: 0
            }
        },
        driftReport: { alerts: [] },
        incidents: [],
        queueSummary: {
            open: 3,
            pendingApproval: 0,
            retryScheduled: 0,
            timedOut: 0
        },
        agentHealth: {
            total: 10,
            healthy: 9,
            stale: 0
        }
    });

    assert.equal(decision.mode, 'normal');
    assert.ok(decision.riskScore < 25);
    assert.equal(decision.dispatchPolicy.throttleFactor, 1);
    assert.equal(decision.dispatchPolicy.maxConcurrentTasks > 0, true);
});

test('evaluateExecutionGovernor enters degraded mode on moderate pressure', () => {
    const decision = evaluateExecutionGovernor({
        readinessReport: {
            status: 'needs_attention',
            readinessScore: 82,
            summary: {
                missingCapabilityCount: 0,
                sandboxGapCount: 0,
                approvalRequiredCount: 4,
                approvalErrorCount: 0
            }
        },
        driftAlerts: [
            {
                code: 'optimizer_timeout_regression',
                priority: 'P2'
            }
        ],
        incidents: [],
        queueSummary: {
            open: 28,
            pendingApproval: 3,
            retryScheduled: 2,
            timedOut: 1
        },
        agentHealth: {
            total: 12,
            healthy: 8,
            stale: 2
        }
    });

    assert.equal(decision.mode, 'degraded');
    assert.equal(decision.dispatchPolicy.throttleFactor, 0.75);
    assert.ok(decision.dispatchPolicy.forceApprovalPriorities.includes('high'));
});

test('evaluateExecutionGovernor enters halted mode on severe multi-signal risk', () => {
    const decision = evaluateExecutionGovernor({
        readinessReport: {
            status: 'blocked',
            readinessScore: 41,
            summary: {
                missingCapabilityCount: 3,
                sandboxGapCount: 2,
                approvalRequiredCount: 9,
                approvalErrorCount: 1
            }
        },
        driftReport: {
            alerts: [
                { code: 'skill_success_rate_drop', priority: 'P1' },
                { code: 'optimizer_latency_regression', priority: 'P1' }
            ]
        },
        incidents: [
            { code: 'timeout_spike', priority: 'P1' },
            { code: 'dispatch_error_cluster', priority: 'P1' }
        ],
        queueSummary: {
            open: 95,
            pendingApproval: 22,
            retryScheduled: 10,
            timedOut: 5
        },
        agentHealth: {
            total: 10,
            healthy: 2,
            stale: 5
        }
    });

    assert.equal(decision.mode, 'halted');
    assert.ok(decision.riskScore >= 75);
    assert.equal(decision.dispatchPolicy.throttleFactor, 0);
    assert.equal(decision.dispatchPolicy.maxConcurrentTasks, 0);
    assert.ok(decision.recommendedActions.some((action) => action.type === 'emergency_freeze'));
    assert.ok(decision.recommendedActions.some((action) => action.type === 'invoke_recovery_supervisor'));
});

test('buildGovernorTasks and ExecutionGovernor class produce schema-valid tasks and history', () => {
    const governor = new ExecutionGovernor({
        localAgentId: 'agent:governor',
        now: () => 7_000
    });

    const decision = governor.evaluate({
        readinessReport: {
            status: 'blocked',
            readinessScore: 39,
            summary: {
                missingCapabilityCount: 2,
                sandboxGapCount: 1,
                approvalRequiredCount: 8,
                approvalErrorCount: 0
            }
        },
        driftReport: {
            alerts: [{ code: 'world_state_entity_confidence_drop', priority: 'P1' }]
        },
        incidents: [{ code: 'agent_timeout_hotspot', priority: 'P1' }],
        queueSummary: {
            open: 62,
            pendingApproval: 9,
            retryScheduled: 4,
            timedOut: 6
        },
        agentHealth: {
            total: 8,
            healthy: 3,
            stale: 3
        }
    });

    const tasks = buildGovernorTasks(decision, {
        fromAgentId: 'agent:planner'
    });
    const governorTasks = governor.buildActionTasks(decision);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].context.actionType, 'string');

    assert.ok(governorTasks.length > 0);
    assert.equal(governorTasks[0].from, 'agent:governor');
    assert.equal(governor.listHistory({ limit: 3 }).length, 1);
});
