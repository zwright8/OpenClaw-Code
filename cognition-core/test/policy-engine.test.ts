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


test('fail-closed validation normalizes tier tokens and treats null confidence as missing', () => {
    const normalizedTier = validateRiskMetadata({
        riskTier: '  HIGH  ',
        confidence: '0.88',
        evidence: [{ source: 'x', detail: 'y' }]
    });

    assert.equal(normalizedTier.ok, true);
    if (!normalizedTier.ok) return;
    assert.equal(normalizedTier.riskTier, 'high');
    assert.equal(normalizedTier.confidence, 0.88);

    const nullConfidence = validateRiskMetadata({
        riskTier: 'high',
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

test('policy engine requires approvals for high-risk recommendations', () => {
    const recommendation = makeRecommendation({
        recommendationId: 'rec-high',
        riskTier: 'high',
        confidence: 0.88
    });

    const pending = evaluateRecommendationPolicy({ recommendation });
    assert.equal(pending.status, 'requires_human_approval');
    assert.equal(pending.requiredApprovalLevel, 'security');
    assert.equal(pending.requiresHumanApproval, true);

    const approved = evaluateRecommendationPolicy({
        recommendation,
        grantedApprovals: ['security']
    });
    assert.equal(approved.status, 'approved');
});

test('policy batch routing separates approved, blocked, and pending recommendations', () => {
    const low = makeRecommendation({ recommendationId: 'rec-low', riskTier: 'low', confidence: 0.92 });
    const high = makeRecommendation({ recommendationId: 'rec-high-2', riskTier: 'high', confidence: 0.8 });
    const broken = makeRecommendation({ recommendationId: 'rec-broken', evidence: [] });

    const result = evaluatePolicyBatch(
        [low, high, broken],
        { 'rec-high-2': ['security'] }
    );

    assert.equal(result.approved.length, 2);
    assert.equal(result.blocked.length, 1);
    assert.equal(result.pendingApproval.length, 0);

    const brokenDecision = result.decisions.find((decision) => decision.recommendationId === 'rec-broken');
    assert.equal(brokenDecision?.status, 'blocked');
});
