import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildOperatorDecisionReplay,
    decisionReplayToTasks,
    OperatorDecisionReplayStudio
} from '../index.js';

function baseInput() {
    return {
        decisions: [
            {
                decisionId: 'd1',
                taskId: 'task-1',
                operatorId: 'human:ops-1',
                action: 'approve_release',
                at: 1_000,
                rationale: 'Hotfix addresses active production incident.',
                policyRefs: ['policy.release.hotfix'],
                evidenceRefs: ['incident:3421'],
                outcome: 'approved',
                confidence: 86
            },
            {
                decisionId: 'd2',
                taskId: 'task-1',
                operatorId: 'human:ops-1',
                action: 'override_guardrail',
                at: 2_500,
                rationale: '',
                policyRefs: [],
                evidenceRefs: [],
                outcome: 'manual_override',
                confidence: 64
            },
            {
                decisionId: 'd3',
                taskId: 'task-2',
                operatorId: 'human:ops-2',
                action: 'deny_escalation',
                at: 1_500,
                rationale: 'Escalation scope exceeded approved safety boundary.',
                policyRefs: ['policy.safety.boundary'],
                evidenceRefs: ['audit:991'],
                outcome: 'denied',
                confidence: 82
            }
        ]
    };
}

test('buildOperatorDecisionReplay flags blocked/review chains and missing rationale alerts', () => {
    const report = buildOperatorDecisionReplay(baseInput(), {
        now: () => 300_000
    });

    assert.equal(report.summary.chainCount, 2);
    assert.equal(report.summary.blockedCount >= 1 || report.summary.reviewRequiredCount >= 1, true);
    assert.equal(report.alerts.includes('missing_decision_rationale'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'fill_decision_rationale'), true);
});

test('buildOperatorDecisionReplay returns auditable posture for complete decision chains', () => {
    const report = buildOperatorDecisionReplay({
        decisions: [
            {
                decisionId: 'd-good-1',
                taskId: 'task-good',
                operatorId: 'human:ops-1',
                action: 'approve_change',
                at: 10_000,
                rationale: 'Evidence confirms mitigation readiness and policy alignment.',
                policyRefs: ['policy.change.readiness'],
                evidenceRefs: ['briefing:88', 'readiness:12'],
                outcome: 'approved',
                confidence: 90
            },
            {
                decisionId: 'd-good-2',
                taskId: 'task-good',
                operatorId: 'human:ops-1',
                action: 'confirm_dispatch',
                at: 12_000,
                rationale: 'Dispatch confirmation recorded with owner and rollback path.',
                policyRefs: ['policy.dispatch.confirmation'],
                evidenceRefs: ['dispatch:19'],
                outcome: 'completed',
                confidence: 92
            }
        ]
    }, {
        now: () => 301_000
    });

    assert.equal(report.summary.blockedCount, 0);
    assert.equal(report.summary.reviewRequiredCount, 0);
    assert.equal(report.summary.posture, 'healthy');
    assert.equal(report.chains[0].posture, 'auditable');
});

test('decisionReplayToTasks and class wrapper emit schema-valid tasks and history', () => {
    const studio = new OperatorDecisionReplayStudio({
        localAgentId: 'agent:replay-local',
        now: () => 302_000
    });

    const report = studio.evaluate(baseInput());
    const tasks = decisionReplayToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = studio.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:replay-local');
    assert.equal(studio.listHistory({ limit: 5 }).length, 1);
});
