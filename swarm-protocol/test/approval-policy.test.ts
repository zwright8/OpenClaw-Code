import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildTaskRequest,
    createApprovalPolicy,
    evaluateApprovalPolicy
} from '../index.js';

test('critical priority requires approval by default', () => {
    const task = buildTaskRequest({
        id: '11111111-1111-4111-8111-111111111111',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Deploy production hotfix',
        priority: 'critical',
        createdAt: 1_000
    });

    const decision = evaluateApprovalPolicy(task);
    assert.equal(decision.required, true);
    assert.ok(decision.matchedRules.includes('critical_priority'));
});

test('high risk tags require approval', () => {
    const task = buildTaskRequest({
        id: '22222222-2222-4222-8222-222222222222',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Update legal notice',
        priority: 'normal',
        context: {
            riskTags: ['legal']
        },
        createdAt: 2_000
    });

    const decision = evaluateApprovalPolicy(task, {
        highRiskTags: ['legal', 'security']
    });

    assert.equal(decision.required, true);
    assert.ok(decision.matchedRules.includes('high_risk_tag'));
});

test('manual override forces approval and custom reviewer group', () => {
    const task = buildTaskRequest({
        id: '33333333-3333-4333-8333-333333333333',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Publish draft blog post',
        priority: 'normal',
        context: {
            requiresHumanApproval: true
        },
        createdAt: 3_000
    });

    const policy = createApprovalPolicy({ reviewerGroup: 'editorial-review' });
    const decision = policy(task);

    assert.equal(decision.required, true);
    assert.equal(decision.reviewerGroup, 'editorial-review');
    assert.ok(decision.matchedRules.includes('manual_override'));
});

test('low-risk task does not require approval', () => {
    const task = buildTaskRequest({
        id: '44444444-4444-4444-8444-444444444444',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Summarize sprint notes',
        priority: 'normal',
        createdAt: 4_000
    });

    const decision = evaluateApprovalPolicy(task, {
        criticalRequiresApproval: false,
        highPriorityRequiresApproval: false,
        highRiskTags: [],
        sensitiveCapabilities: []
    });

    assert.equal(decision.required, false);
    assert.equal(decision.reason, null);
});

test('side-effect intent in task text requires approval by default', () => {
    const task = buildTaskRequest({
        id: '55555555-5555-4555-8555-555555555555',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Delete stale production cache entries after validation',
        priority: 'normal',
        createdAt: 5_000
    });

    const decision = evaluateApprovalPolicy(task);

    assert.equal(decision.required, true);
    assert.ok(decision.matchedRules.includes('side_effect_intent'));
});

test('declared side effects in context require approval even without keywords', () => {
    const task = buildTaskRequest({
        id: '66666666-6666-4666-8666-666666666666',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Apply the approved customer account correction',
        priority: 'normal',
        context: {
            sideEffects: ['customer_record_mutation']
        },
        createdAt: 6_000
    });

    const decision = evaluateApprovalPolicy(task);

    assert.equal(decision.required, true);
    assert.ok(decision.matchedRules.includes('side_effect_intent'));
});

test('side-effect approval can be disabled for compatibility adapters', () => {
    const task = buildTaskRequest({
        id: '77777777-7777-4777-8777-777777777777',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Publish internal readiness report',
        priority: 'normal',
        createdAt: 7_000
    });

    const decision = evaluateApprovalPolicy(task, {
        sideEffectRequiresApproval: false
    });

    assert.equal(decision.required, false);
});

test('negative constraints alone do not create side-effect approval intent', () => {
    const task = buildTaskRequest({
        id: '88888888-8888-4888-8888-888888888888',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Summarize the queue health report',
        priority: 'normal',
        constraints: ['Do not delete, publish, or send anything.'],
        createdAt: 8_000
    });

    const decision = evaluateApprovalPolicy(task);

    assert.equal(decision.required, false);
});
