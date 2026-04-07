import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CollaborationUxEngine,
    buildInterventionActions,
    buildTaskTimeline,
    createInterventionAuditEntry,
    explainDecision
} from '../index.js';

function sampleTask() {
    return {
        taskId: 'task-ux-1',
        target: 'agent:ops',
        status: 'awaiting_approval',
        request: {
            priority: 'critical',
            task: 'Deploy urgent patch'
        },
        history: [
            { at: 100, event: 'created' },
            { at: 120, event: 'approval_requested', reason: 'critical_priority' },
            { at: 150, event: 'approval_approved' },
            { at: 170, event: 'send_attempt', attempt: 1 },
            { at: 180, event: 'send_success', attempt: 1 },
            { at: 260, event: 'retry_scheduled', nextRetryAt: 300 }
        ]
    };
}

test('buildTaskTimeline emits ordered entries with causal links', () => {
    const timeline = buildTaskTimeline(sampleTask());

    assert.equal(timeline.taskId, 'task-ux-1');
    assert.equal(timeline.timeline.length, 6);

    const sendSuccess = timeline.timeline.find((item) => item.event === 'send_success');
    assert.ok(sendSuccess.causedBy);

    const hasCausal = timeline.causalLinks.some(
        (edge) => edge.to === sendSuccess.id
    );
    assert.equal(hasCausal, true);
});

test('explainDecision returns summary with telemetry factors', () => {
    const explanation = explainDecision({
        taskRequest: {
            priority: 'critical'
        },
        routeSelection: {
            selectedAgentId: 'agent:ops',
            ranked: [{ agentId: 'agent:ops', score: 92.5 }]
        },
        approvalDecision: {
            required: true,
            reason: 'critical_priority'
        },
        policyDecision: {
            allowed: true,
            redactions: [{ path: 'task' }]
        },
        sandboxPlan: {
            profileId: 'privileged-controlled',
            escalationRequired: true
        }
    });

    assert.ok(explanation.summary.includes('agent:ops'));
    assert.ok(explanation.factors.length >= 4);
    assert.ok(explanation.confidence > 0.5);
});

test('buildInterventionActions includes approval actions for awaiting_approval tasks', () => {
    const actions = buildInterventionActions(sampleTask(), {
        actor: 'human:ops'
    });

    const ids = new Set(actions.map((action) => action.id));
    assert.equal(ids.has('approve_task'), true);
    assert.equal(ids.has('deny_task'), true);
    assert.equal(ids.has('view_timeline'), true);
});

test('createInterventionAuditEntry builds audit payload for one-click action', () => {
    const action = buildInterventionActions(sampleTask())[0];
    const entry = createInterventionAuditEntry(action, {
        actor: 'human:ops',
        reason: 'manual review',
        now: () => 500
    });

    assert.equal(entry.eventType, 'ux_intervention_triggered');
    assert.equal(entry.actor, 'human:ops');
    assert.equal(entry.at, 500);
    assert.equal(entry.payload.actionId, action.id);
});

test('CollaborationUxEngine wraps top-level UX helpers', () => {
    const engine = new CollaborationUxEngine();
    const task = sampleTask();

    const timeline = engine.buildTaskTimeline(task);
    const actions = engine.buildInterventionActions(task);

    assert.equal(timeline.timeline.length > 0, true);
    assert.equal(actions.length > 0, true);
});
