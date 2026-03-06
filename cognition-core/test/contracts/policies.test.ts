import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createDefaultCognitionPolicySet,
    evaluateCognitionPolicy,
    normalizePolicyInput,
    validateCognitionPolicySet
} from '../../src/contracts/policies.js';

test('validateCognitionPolicySet accepts default policy', () => {
    const policy = createDefaultCognitionPolicySet(1000);
    const result = validateCognitionPolicySet(policy);

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.value.policyId, 'cognition-default-policy');
    assert.equal(result.value.updatedAt, 1000);
});

test('evaluateCognitionPolicy fail-closes when risk metadata is missing', () => {
    const policy = createDefaultCognitionPolicySet();
    const evaluation = evaluateCognitionPolicy(policy, {
        confidence: 0.9,
        priority: 'P2'
    });

    assert.equal(evaluation.allowed, false);
    assert.equal(evaluation.decision, 'deny');
    assert.equal(evaluation.requiresHumanApproval, true);
});

test('evaluateCognitionPolicy requires approval for high-risk recommendation', () => {
    const policy = createDefaultCognitionPolicySet();
    const evaluation = evaluateCognitionPolicy(policy, {
        riskTier: 'high',
        confidence: 0.95,
        priority: 'P2',
        estimatedImpact: 5
    });

    assert.equal(evaluation.allowed, false);
    assert.equal(evaluation.decision, 'require_approval');
});

test('evaluateCognitionPolicy allows low-risk recommendation when all constraints pass', () => {
    const policy = createDefaultCognitionPolicySet();
    const evaluation = evaluateCognitionPolicy(policy, {
        riskTier: 'low',
        confidence: 0.95,
        priority: 'P3',
        estimatedImpact: 10
    });

    assert.equal(evaluation.allowed, true);
    assert.equal(evaluation.decision, 'allow');
});

test('normalizePolicyInput normalizes incoming unknown payload safely', () => {
    const normalized = normalizePolicyInput({
        riskTier: 'MEDIUM',
        confidence: '0.7',
        priority: 'p2',
        estimatedImpact: '42'
    });

    assert.equal(normalized.riskTier, 'medium');
    assert.equal(normalized.confidence, 0.7);
    assert.equal(normalized.priority, 'P2');
    assert.equal(normalized.estimatedImpact, 42);
});
