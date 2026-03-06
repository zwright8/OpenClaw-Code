import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildTaskRequest,
    createDispatchPolicy,
    evaluateDispatchPolicy
} from '../index.js';

test('blocked risk tag denies dispatch', () => {
    const task = buildTaskRequest({
        id: '66666666-6666-4666-8666-666666666666',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Generate exploit guidance',
        context: {
            riskTags: ['malware']
        },
        createdAt: 6_000
    });

    const decision = evaluateDispatchPolicy(task);
    assert.equal(decision.allowed, false);
    assert.ok(decision.reasons.some((reason) => reason.code === 'blocked_risk_tag'));
});

test('blocked capability denies dispatch', () => {
    const task = buildTaskRequest({
        id: '77777777-7777-4777-8777-777777777777',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Run restricted action',
        context: {
            requiredCapabilities: ['destructive_shell']
        },
        createdAt: 7_000
    });

    const decision = evaluateDispatchPolicy(task);
    assert.equal(decision.allowed, false);
    assert.ok(decision.reasons.some((reason) => reason.code === 'blocked_capability'));
});

test('sensitive values are redacted in task/context/constraints', () => {
    const task = buildTaskRequest({
        id: '88888888-8888-4888-8888-888888888888',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Send update with api_key=sk-abcdefghijklmnopqrstuvwxyz and owner test@example.com',
        context: {
            ownerEmail: 'operator@example.com',
            notes: 'token: topsecret12345'
        },
        constraints: ['Do not expose secret=abcdef12345'],
        createdAt: 8_000
    });

    const decision = evaluateDispatchPolicy(task, {
        blockedRiskTags: [],
        blockedCapabilities: [],
        blockedTaskPatterns: []
    });

    assert.equal(decision.allowed, true);
    assert.ok(decision.redactions.length >= 3);
    assert.match(decision.taskRequest.task, /\[REDACTED/);
    assert.match(decision.taskRequest.context.ownerEmail, /\[REDACTED:EMAIL\]/);
    assert.match(decision.taskRequest.constraints[0], /\[REDACTED\]/);
});

test('custom rules can deny critical tasks', () => {
    const policy = createDispatchPolicy({
        blockedRiskTags: [],
        blockedCapabilities: [],
        blockedTaskPatterns: [],
        customRules: [
            (taskRequest) => {
                if (taskRequest.priority === 'critical') {
                    return {
                        deny: true,
                        code: 'critical_blocked',
                        reason: 'critical tasks disabled in simulation'
                    };
                }
                return null;
            }
        ]
    });

    const task = buildTaskRequest({
        id: '99999999-9999-4999-8999-999999999999',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Run release cutover',
        priority: 'critical',
        createdAt: 9_000
    });

    const decision = policy(task);
    assert.equal(decision.allowed, false);
    assert.ok(decision.reasons.some((reason) => reason.code === 'critical_blocked'));
});
