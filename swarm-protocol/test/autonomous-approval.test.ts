import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AutonomousApprovalEngine,
    autoApproveQueue,
    buildAutoApprovalFollowupTasks,
    buildAutonomousApprovalAuditEntry,
    buildTaskRequest,
    createAutonomousApprovalPolicy,
    evaluateAutonomousApproval
} from '../index.js';

test('evaluateAutonomousApproval bypasses human review in bypass_all mode', () => {
    const taskRequest = buildTaskRequest({
        id: '11111111-1111-4111-8111-111111111111',
        from: 'agent:planner',
        priority: 'critical',
        task: 'Deploy production migration',
        context: {
            riskTags: ['production'],
            requiredCapabilities: ['deploy']
        },
        createdAt: 1_000
    });

    const evaluation = evaluateAutonomousApproval(taskRequest, {
        mode: 'bypass_all',
        baseApprovalPolicy: () => ({
            required: true,
            reviewerGroup: 'ops-review',
            reason: 'critical_priority',
            matchedRules: ['critical_priority']
        }),
        now: () => 2_000
    });

    assert.equal(evaluation.outcome, 'auto_approved');
    assert.equal(evaluation.decision.required, false);
    assert.equal(evaluation.decision.autoApproved, true);
    assert.equal(evaluation.baselineDecision.required, true);
    assert.equal(evaluation.approvalPatch.status, 'approved');
});

test('disabled mode preserves human approval requirement', () => {
    const taskRequest = buildTaskRequest({
        id: '22222222-2222-4222-8222-222222222222',
        from: 'agent:planner',
        priority: 'high',
        task: 'Run security review',
        context: {
            riskTags: ['security']
        },
        createdAt: 1_000
    });

    const evaluation = evaluateAutonomousApproval(taskRequest, {
        mode: 'disabled',
        baseApprovalPolicy: () => ({
            required: true,
            reviewerGroup: 'security-review',
            reason: 'high_risk_tag',
            matchedRules: ['high_risk_tag']
        }),
        now: () => 2_000
    });

    assert.equal(evaluation.outcome, 'requires_human');
    assert.equal(evaluation.decision.required, true);
    assert.equal(evaluation.decision.autoApproved, false);
    assert.equal(evaluation.approvalPatch.status, 'pending');
});

test('hard blocks deny autonomous approval even in bypass mode', () => {
    const taskRequest = buildTaskRequest({
        id: '33333333-3333-4333-8333-333333333333',
        from: 'agent:planner',
        priority: 'normal',
        task: 'Operate restricted capability',
        context: {
            requiredCapabilities: ['credential_access']
        },
        createdAt: 1_000
    });

    const evaluation = evaluateAutonomousApproval(taskRequest, {
        mode: 'bypass_all',
        blockedCapabilities: ['credential_access'],
        now: () => 2_000
    });

    assert.equal(evaluation.outcome, 'denied');
    assert.equal(evaluation.decision.required, true);
    assert.ok(evaluation.decision.reason.includes('hard_block:capability:credential_access'));
});

test('createAutonomousApprovalPolicy returns orchestrator-compatible policy decisions', () => {
    const policy = createAutonomousApprovalPolicy({
        mode: 'policy_assisted',
        baseApprovalPolicy: () => ({
            required: true,
            reviewerGroup: 'ops-review',
            reason: 'critical_priority',
            matchedRules: ['critical_priority']
        })
    });

    const taskRequest = buildTaskRequest({
        id: '44444444-4444-4444-8444-444444444444',
        from: 'agent:planner',
        priority: 'critical',
        task: 'Critical rollout',
        createdAt: 2_000
    });
    const decision = policy(taskRequest);

    assert.equal(decision.required, false);
    assert.equal(decision.autoApproved, true);
    assert.equal(decision.bypassedHumanReview, true);
});

test('autoApproveQueue and engine history produce summaries and follow-up tasks', () => {
    const queueRecords = [
        {
            taskId: '55555555-5555-4555-8555-555555555555',
            status: 'awaiting_approval',
            createdAt: 1_000,
            request: {
                kind: 'task_request',
                id: '55555555-5555-4555-8555-555555555555',
                from: 'agent:planner',
                priority: 'critical',
                task: 'Launch incident mitigation',
                createdAt: 1_000
            }
        },
        {
            taskId: '66666666-6666-4666-8666-666666666666',
            status: 'awaiting_approval',
            createdAt: 1_200,
            request: {
                kind: 'task_request',
                id: '66666666-6666-4666-8666-666666666666',
                from: 'agent:planner',
                priority: 'high',
                task: 'Access restricted credential store',
                context: {
                    requiredCapabilities: ['credential_access']
                },
                createdAt: 1_200
            }
        }
    ];

    const summary = autoApproveQueue(queueRecords, {
        mode: 'bypass_all',
        blockedCapabilities: ['credential_access'],
        now: () => 2_000
    });

    assert.equal(summary.scanned, 2);
    assert.equal(summary.autoApproved, 1);
    assert.equal(summary.denied, 1);

    const followups = buildAutoApprovalFollowupTasks(summary, {
        fromAgentId: 'agent:auto'
    });
    assert.equal(followups.length, 1);
    assert.equal(followups[0].from, 'agent:auto');

    const engine = new AutonomousApprovalEngine({
        localAgentId: 'agent:auto-engine',
        now: () => 3_000
    });
    const engineSummary = engine.autoApproveQueue(queueRecords, {
        mode: 'bypass_all',
        blockedCapabilities: ['credential_access']
    });

    const audit = buildAutonomousApprovalAuditEntry(engineSummary.evaluations[0]);
    assert.equal(engineSummary.scanned, 2);
    assert.equal(typeof audit.payload.taskId, 'string');
    assert.equal(engine.listHistory({ limit: 10 }).length, 2);
});
