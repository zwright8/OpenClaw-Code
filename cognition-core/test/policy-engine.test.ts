import test from 'node:test';
import assert from 'node:assert/strict';

import { evaluatePolicyBatch, evaluateRecommendationPolicy } from '../src/policy/policy-engine.js';
import { validateRiskMetadata } from '../src/policy/fail-closed.js';
import { determineApprovalRequirement, isApprovalSatisfied } from '../src/policy/approval-gates.js';
import type { CognitionRecommendation } from '../src/reasoning/anomaly.js';

function makeRecommendation(overrides: Partial<CognitionRecommendation> = {}): CognitionRecommendation {
    return {
        recommendationId: 'rec-1',
        title: 'Default recommendation',
        reasoning: 'default reasoning',
        evidence: [{ source: 'unit-test', detail: 'baseline evidence' }],
        confidence: 0.74,
        riskTier: 'medium',
        requiresHumanApproval: false,
        verificationPlan: ['Validate post-change metrics.'],
        ...overrides
    };
}

test('fail-closed validation emits machine-parseable deterministic diagnostics', () => {
    const missingTier = validateRiskMetadata({ confidence: 0.6, evidence: [{ source: 'x', detail: 'y' }] });
    assert.equal(missingTier.ok, false);
    assert.equal(missingTier.code, 'missing_risk_tier');
    assert.equal(missingTier.reason, '[missing_risk_tier] Missing risk tier (fail-closed).');

    const unknownTier = validateRiskMetadata({ riskTier: 'severe', confidence: 0.8, evidence: [{ source: 'x', detail: 'y' }] });
    assert.equal(unknownTier.ok, false);
    assert.equal(unknownTier.code, 'unknown_risk_tier');
    assert.equal(unknownTier.reason, '[unknown_risk_tier] Unknown risk tier "severe" (fail-closed).');

    const missingEvidence = validateRiskMetadata({ riskTier: 'low', confidence: 0.8, evidence: [] });
    assert.equal(missingEvidence.ok, false);
    assert.equal(missingEvidence.code, 'missing_evidence');
    assert.equal(missingEvidence.reason, '[missing_evidence] Missing evidence payload (fail-closed).');
});


test('fail-closed validation blocks high-risk recommendations missing approval/rollback contracts', () => {
    const missingApprovalContract = validateRiskMetadata({
        riskTier: 'high',
        confidence: 0.88,
        evidence: [{ source: 'x', detail: 'y' }]
    });

    assert.equal(missingApprovalContract.ok, false);
    assert.equal(missingApprovalContract.code, 'high_risk_requires_approval');
    assert.equal(
        missingApprovalContract.reason,
        '[high_risk_requires_approval] High-risk recommendations must set requiresHumanApproval=true (fail-closed).'
    );

    const missingRollbackTrigger = validateRiskMetadata({
        riskTier: 'critical',
        confidence: 0.93,
        evidence: [{ source: 'x', detail: 'y' }],
        requiresHumanApproval: true,
        metadata: {
            requiredApprovers: ['security-ops', 'executive-ops'],
            rollbackPlan: {
                trigger: '   ',
                steps: ['Revert policy state to last-known-good release key']
            }
        }
    });

    assert.equal(missingRollbackTrigger.ok, false);
    assert.equal(missingRollbackTrigger.code, 'missing_rollback_trigger');
    assert.equal(
        missingRollbackTrigger.reason,
        '[missing_rollback_trigger] High-risk recommendations must include rollbackPlan.trigger (fail-closed).'
    );
});


test('fail-closed validation accepts high-risk recommendation with complete approval/rollback metadata', () => {
    const validated = validateRiskMetadata({
        riskTier: '  HIGH  ',
        confidence: '0.88',
        evidence: [{ source: 'x', detail: 'y' }],
        requiresHumanApproval: true,
        metadata: {
            requiredApprovers: ['security-ops'],
            rollbackPlan: {
                trigger: 'Verification failure or policy breach',
                steps: ['Revert remediation policy', 'Restore previous deployment shard']
            }
        }
    });

    assert.equal(validated.ok, true);
    if (!validated.ok) return;
    assert.equal(validated.riskTier, 'high');
    assert.equal(validated.confidence, 0.88);

    const nullConfidence = validateRiskMetadata({
        riskTier: 'low',
        confidence: null,
        evidence: [{ source: 'x', detail: 'y' }]
    });

    assert.equal(nullConfidence.ok, false);
    assert.equal(nullConfidence.code, 'missing_confidence');
    assert.equal(nullConfidence.reason, '[missing_confidence] Missing confidence score (fail-closed).');
});

test('approval gates compute expected requirements', () => {
    const critical = determineApprovalRequirement('critical', 0.9, true);
    assert.equal(critical.required, true);
    assert.equal(critical.level, 'executive');

    const mediumLowConfidence = determineApprovalRequirement('medium', 0.5, true);
    assert.equal(mediumLowConfidence.required, true);
    assert.equal(mediumLowConfidence.level, 'team-lead');

    assert.equal(isApprovalSatisfied('security', ['team-lead']), false);
    assert.equal(isApprovalSatisfied('security', ['executive']), true);
});

test('policy engine blocks unknown or missing risk tiers (fail-closed)', () => {
    const invalid = makeRecommendation({ riskTier: 'unknown' as never });
    const decision = evaluateRecommendationPolicy({ recommendation: invalid });

    assert.equal(decision.status, 'blocked');
    assert.match(decision.reason, /fail-closed/i);
});

test('policy engine blocks high-risk recommendations without contract metadata (fail-closed)', () => {
    const recommendation = makeRecommendation({
        recommendationId: 'rec-high',
        riskTier: 'high',
        confidence: 0.88,
        requiresHumanApproval: true
    });

    const decision = evaluateRecommendationPolicy({ recommendation });
    assert.equal(decision.status, 'blocked');
    assert.equal(
        decision.reason,
        '[high_risk_requires_approval] High-risk recommendations must set requiresHumanApproval=true (fail-closed).'
    );
});

test('policy engine keeps approval workflow for medium-risk recommendations', () => {
    const recommendation = makeRecommendation({
        recommendationId: 'rec-medium-approved',
        riskTier: 'medium',
        confidence: 0.74,
        requiresHumanApproval: true
    });

    const pending = evaluateRecommendationPolicy({ recommendation });
    assert.equal(pending.status, 'requires_human_approval');
    assert.equal(pending.requiredApprovalLevel, 'team-lead');

    const approved = evaluateRecommendationPolicy({
        recommendation,
        grantedApprovals: ['team-lead']
    });

    assert.equal(approved.status, 'approved');
});

test('policy batch routing separates approved and blocked recommendations deterministically', () => {
    const low = makeRecommendation({ recommendationId: 'rec-low', riskTier: 'low', confidence: 0.92 });
    const high = makeRecommendation({ recommendationId: 'rec-high-2', riskTier: 'high', confidence: 0.8, requiresHumanApproval: true });
    const broken = makeRecommendation({ recommendationId: 'rec-broken', evidence: [] });

    const result = evaluatePolicyBatch(
        [low, high, broken],
        { 'rec-high-2': ['security'] }
    );

    assert.equal(result.approved.length, 1);
    assert.equal(result.blocked.length, 2);
    assert.equal(result.pendingApproval.length, 0);

    const highDecision = result.decisions.find((decision) => decision.recommendationId === 'rec-high-2');
    assert.equal(highDecision?.status, 'blocked');
    assert.equal(highDecision?.reason, '[high_risk_requires_approval] High-risk recommendations must set requiresHumanApproval=true (fail-closed).');
});
