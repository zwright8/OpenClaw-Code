import test from 'node:test';
import assert from 'node:assert/strict';

import { evaluatePolicyBatch, evaluateRecommendationPolicy } from '../src/policy/policy-engine.js';
import { validateRiskMetadata } from '../src/policy/fail-closed.js';
import { determineApprovalRequirement, isApprovalSatisfied } from '../src/policy/approval-gates.js';
import type { CognitionRecommendation } from '../src/reasoning/anomaly.js';

const REASON_PAYLOAD_MARKER = ' reason_payload=';

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

function parseFailClosedReasonPayload(reason: string): {
    code?: string;
    path?: string;
    contract?: string;
    missingFields?: string[];
} {
    const markerIndex = reason.indexOf(REASON_PAYLOAD_MARKER);
    assert.notEqual(markerIndex, -1, `expected machine-readable reason payload marker in: ${reason}`);

    return JSON.parse(reason.slice(markerIndex + REASON_PAYLOAD_MARKER.length)) as {
        code?: string;
        path?: string;
        contract?: string;
        missingFields?: string[];
    };
}

function assertFailClosedReasonPayload(
    payload: unknown,
    expectedCode: string,
    expectedPath: string
): void {
    assert.ok(payload && typeof payload === 'object', 'expected reason payload object');

    const parsed = payload as {
        code?: string;
        path?: string;
        contract?: string;
        missingFields?: string[];
    };

    assert.equal(parsed.code, expectedCode);
    assert.equal(parsed.path, expectedPath);
    assert.equal(parsed.contract, 'risk_metadata_fail_closed');
}

function assertFailClosedReason(
    reason: string,
    expectedCode: string,
    expectedPath: string,
    expectedDetail: string
): void {
    assert.equal(reason.startsWith(`[${expectedCode}] ${expectedDetail}`), true);

    const parsed = parseFailClosedReasonPayload(reason);
    assertFailClosedReasonPayload(parsed, expectedCode, expectedPath);
}

test('fail-closed validation emits machine-parseable deterministic diagnostics', () => {
    const missingTier = validateRiskMetadata({ confidence: 0.6, evidence: [{ source: 'x', detail: 'y' }] });
    assert.equal(missingTier.ok, false);
    assert.equal(missingTier.code, 'missing_risk_tier');
    assertFailClosedReason(
        missingTier.reason || '',
        'missing_risk_tier',
        'riskTier',
        'Missing risk tier (fail-closed).'
    );
    assertFailClosedReasonPayload(missingTier.reasonPayload, 'missing_risk_tier', 'riskTier');

    const unknownTier = validateRiskMetadata({ riskTier: 'severe', confidence: 0.8, evidence: [{ source: 'x', detail: 'y' }] });
    assert.equal(unknownTier.ok, false);
    assert.equal(unknownTier.code, 'unknown_risk_tier');
    assertFailClosedReason(
        unknownTier.reason || '',
        'unknown_risk_tier',
        'riskTier',
        'Unknown risk tier "severe" (fail-closed).'
    );
    assertFailClosedReasonPayload(unknownTier.reasonPayload, 'unknown_risk_tier', 'riskTier');

    const missingEvidence = validateRiskMetadata({ riskTier: 'low', confidence: 0.8, evidence: [] });
    assert.equal(missingEvidence.ok, false);
    assert.equal(missingEvidence.code, 'missing_evidence');
    assertFailClosedReason(
        missingEvidence.reason || '',
        'missing_evidence',
        'evidence',
        'Missing evidence payload (fail-closed).'
    );
    assertFailClosedReasonPayload(missingEvidence.reasonPayload, 'missing_evidence', 'evidence');
});


test('fail-closed validation blocks high-risk recommendations missing approval/rollback contracts', () => {
    const missingApprovalContract = validateRiskMetadata({
        riskTier: 'high',
        confidence: 0.88,
        evidence: [{ source: 'x', detail: 'y' }]
    });

    assert.equal(missingApprovalContract.ok, false);
    assert.equal(missingApprovalContract.code, 'missing_required_approvers');
    assertFailClosedReason(
        missingApprovalContract.reason || '',
        'missing_required_approvers',
        'metadata.requiredApprovers',
        'High-risk recommendations must include requiredApprovers metadata (fail-closed).'
    );
    assertFailClosedReasonPayload(
        missingApprovalContract.reasonPayload,
        'missing_required_approvers',
        'metadata.requiredApprovers'
    );
    assert.deepEqual(missingApprovalContract.reasonPayload?.missingFields, ['requiredApprovers', 'rollbackPlan']);

    const missingRollbackMetadata = validateRiskMetadata({
        riskTier: 'critical',
        confidence: 0.93,
        evidence: [{ source: 'x', detail: 'y' }],
        requiresHumanApproval: true,
        metadata: {
            requiredApprovers: ['security-ops', 'executive-ops']
        }
    });

    assert.equal(missingRollbackMetadata.ok, false);
    assert.equal(missingRollbackMetadata.code, 'missing_rollback_metadata');
    assertFailClosedReason(
        missingRollbackMetadata.reason || '',
        'missing_rollback_metadata',
        'metadata.rollbackPlan',
        'High-risk recommendations must include rollbackPlan metadata (fail-closed).'
    );
    assertFailClosedReasonPayload(
        missingRollbackMetadata.reasonPayload,
        'missing_rollback_metadata',
        'metadata.rollbackPlan'
    );
    assert.deepEqual(missingRollbackMetadata.reasonPayload?.missingFields, ['rollbackPlan']);

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
    assertFailClosedReason(
        missingRollbackTrigger.reason || '',
        'missing_rollback_trigger',
        'metadata.rollbackPlan.trigger',
        'High-risk recommendations must include rollbackPlan.trigger (fail-closed).'
    );
    assertFailClosedReasonPayload(
        missingRollbackTrigger.reasonPayload,
        'missing_rollback_trigger',
        'metadata.rollbackPlan.trigger'
    );
    assert.deepEqual(missingRollbackTrigger.reasonPayload?.missingFields, ['rollbackPlan.trigger']);
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
    assertFailClosedReason(
        nullConfidence.reason || '',
        'missing_confidence',
        'confidence',
        'Missing confidence score (fail-closed).'
    );
    assertFailClosedReasonPayload(nullConfidence.reasonPayload, 'missing_confidence', 'confidence');
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
    const reasonPayload = parseFailClosedReasonPayload(decision.reason);
    assert.equal(reasonPayload.contract, 'risk_metadata_fail_closed');
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
    assertFailClosedReason(
        decision.reason,
        'missing_required_approvers',
        'metadata.requiredApprovers',
        'High-risk recommendations must include requiredApprovers metadata (fail-closed).'
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
    assertFailClosedReason(
        highDecision?.reason || '',
        'missing_required_approvers',
        'metadata.requiredApprovers',
        'High-risk recommendations must include requiredApprovers metadata (fail-closed).'
    );
});
