import test from 'node:test';
import assert from 'node:assert/strict';
import {
    assertCognitionRecommendation,
    assertCognitionTask,
    normalizeRecommendationPriority,
    validateCognitionRecommendation,
    validateCognitionTask
} from '../../src/contracts/recommendations.js';

const REASON_PAYLOAD_MARKER = ' reason_payload=';

type RecommendationReasonPayload = {
    code: string;
    path: string;
    contract: string;
};

function parseRecommendationReasonPayload(message: string): RecommendationReasonPayload {
    const markerIndex = message.indexOf(REASON_PAYLOAD_MARKER);
    assert.notEqual(markerIndex, -1, `expected machine-readable reason payload marker in: ${message}`);

    return JSON.parse(
        message.slice(markerIndex + REASON_PAYLOAD_MARKER.length)
    ) as RecommendationReasonPayload;
}

function assertReasonPayload(
    message: string,
    expectedCode: string,
    expectedPath: string
): void {
    assert.equal(message.startsWith(`[${expectedCode}]`), true);

    const payload = parseRecommendationReasonPayload(message);
    assert.equal(payload.code, expectedCode);
    assert.equal(payload.path, expectedPath);
    assert.equal(payload.contract, 'recommendation_fail_closed');
}

test('normalizeRecommendationPriority maps legacy labels', () => {
    assert.equal(normalizeRecommendationPriority('high'), 'P0');
    assert.equal(normalizeRecommendationPriority('medium'), 'P2');
    assert.equal(normalizeRecommendationPriority('P3'), 'P3');
});

test('validateCognitionRecommendation accepts valid recommendation payload', () => {
    const result = validateCognitionRecommendation({
        recommendationId: 'rec-1',
        title: 'Stabilize gateway',
        reasoning: 'Gateway reconnect failures increased 45% over baseline.',
        evidence: [
            {
                evidenceId: 'e-1',
                type: 'event',
                reference: 'evt-1',
                confidence: 0.9
            }
        ],
        priority: 'P1',
        riskTier: 'high',
        requiresHumanApproval: true,
        estimatedImpact: {
            metric: 'error_rate',
            unit: 'percent',
            expectedDelta: -20,
            confidence: 0.75
        },
        verificationPlan: {
            owner: 'agent:nexus',
            dueAt: Date.now(),
            steps: [
                {
                    stepId: 'verify-1',
                    description: 'Confirm reconnect errors drop below 1%.'
                }
            ]
        },
        metadata: {
            requiredApprovers: ['security-ops'],
            rollbackPlan: {
                trigger: 'Verification failed',
                steps: ['Revert gateway policy to last-known-good state']
            }
        }
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.value.evidence.length, 1);
    assert.equal(result.value.verificationPlan.steps.length, 1);
});

test('validateCognitionRecommendation fails closed for high-risk recommendation missing approval and rollback metadata', () => {
    const result = validateCognitionRecommendation({
        recommendationId: 'rec-high-missing-contract',
        title: 'Patch production gateway',
        reasoning: 'A high-risk change requires strict release controls.',
        evidence: [
            {
                evidenceId: 'e-contract-1',
                type: 'event',
                reference: 'evt-contract-1',
                confidence: 0.91
            }
        ],
        priority: 'P0',
        riskTier: 'critical',
        requiresHumanApproval: true,
        estimatedImpact: {
            metric: 'incident_rate',
            unit: 'count',
            expectedDelta: -2,
            confidence: 0.73
        },
        verificationPlan: {
            owner: 'agent:nexus',
            steps: [
                {
                    stepId: 'verify-contract-1',
                    description: 'Confirm no regression in gateway error budget.'
                }
            ]
        }
    });

    assert.equal(result.ok, false);
    if (result.ok) return;

    const diagnosticsByPath = Object.fromEntries(result.errors.map((issue) => [issue.path, issue.message]));

    assertReasonPayload(
        diagnosticsByPath['metadata.requiredApprovers'],
        'required_approvers_missing',
        'metadata.requiredApprovers'
    );

    assertReasonPayload(
        diagnosticsByPath['metadata.rollbackPlan'],
        'rollback_metadata_missing',
        'metadata.rollbackPlan'
    );
});


test('validateCognitionRecommendation fails closed when high-risk recommendation sets requiresHumanApproval=false', () => {
    const result = validateCognitionRecommendation({
        recommendationId: 'rec-high-approval-flag-missing',
        title: 'Roll key material in production',
        reasoning: 'Critical risk requires explicit human approval gating.',
        evidence: [
            {
                evidenceId: 'e-high-approval-flag',
                type: 'event',
                reference: 'evt-high-approval-flag',
                confidence: 0.9
            }
        ],
        priority: 'P0',
        riskTier: 'critical',
        requiresHumanApproval: false,
        estimatedImpact: {
            metric: 'credential_risk_window',
            unit: 'minutes',
            expectedDelta: -30,
            confidence: 0.8
        },
        verificationPlan: {
            steps: [
                {
                    stepId: 'verify-high-approval-flag',
                    description: 'Confirm controlled rollout verification checks.'
                }
            ]
        },
        metadata: {
            requiredApprovers: ['security-ops', 'executive-ops'],
            rollbackPlan: {
                trigger: 'Rollback gate triggered',
                steps: ['Revert key material to previous version.']
            }
        }
    });

    assert.equal(result.ok, false);
    if (result.ok) return;

    const requiresApprovalDiagnostic = result.errors.find((issue) => issue.path === 'requiresHumanApproval')?.message;
    assert.ok(requiresApprovalDiagnostic, 'expected high-risk approval diagnostic');
    assertReasonPayload(
        requiresApprovalDiagnostic,
        'high_risk_human_approval_required',
        'requiresHumanApproval'
    );
});


test('validateCognitionRecommendation fails closed for high-risk recommendation with incomplete rollback metadata', () => {
    const result = validateCognitionRecommendation({
        recommendationId: 'rec-high-incomplete-rollback',
        title: 'Rotate production credentials',
        reasoning: 'Critical change needs deterministic rollback controls.',
        evidence: [
            {
                evidenceId: 'e-contract-rollback',
                type: 'event',
                reference: 'evt-contract-rollback',
                confidence: 0.82
            }
        ],
        priority: 'P0',
        riskTier: 'critical',
        requiresHumanApproval: true,
        estimatedImpact: {
            metric: 'credential_exposure_window',
            unit: 'minutes',
            expectedDelta: -45,
            confidence: 0.78
        },
        verificationPlan: {
            steps: [
                {
                    stepId: 'verify-rollback-contract',
                    description: 'Ensure new credential path remains stable for one release window.'
                }
            ]
        },
        metadata: {
            requiredApprovers: ['security-ops', 'executive-ops'],
            rollbackPlan: {
                trigger: '   ',
                steps: []
            }
        }
    });

    assert.equal(result.ok, false);
    if (result.ok) return;

    const rollbackDiagnostics = result.errors
        .filter((issue) => issue.path.startsWith('metadata.rollbackPlan'));

    assert.equal(rollbackDiagnostics.length, 2);

    const rollbackTriggerDiagnostic = rollbackDiagnostics.find((issue) => issue.path === 'metadata.rollbackPlan.trigger');
    assert.ok(rollbackTriggerDiagnostic, 'expected rollback trigger diagnostic');
    assertReasonPayload(
        rollbackTriggerDiagnostic.message,
        'rollback_trigger_missing',
        'metadata.rollbackPlan.trigger'
    );

    const rollbackStepsDiagnostic = rollbackDiagnostics.find((issue) => issue.path === 'metadata.rollbackPlan.steps');
    assert.ok(rollbackStepsDiagnostic, 'expected rollback steps diagnostic');
    assertReasonPayload(
        rollbackStepsDiagnostic.message,
        'rollback_steps_missing',
        'metadata.rollbackPlan.steps'
    );
});

test('validateCognitionRecommendation preserves non-high-risk compatibility without contract metadata', () => {
    const result = validateCognitionRecommendation({
        recommendationId: 'rec-low-compatible',
        title: 'Adjust dashboard threshold',
        reasoning: 'Low-risk tuning change.',
        evidence: [
            {
                evidenceId: 'e-low-1',
                type: 'metric',
                reference: 'metric-low-1',
                confidence: 0.66
            }
        ],
        priority: 'P3',
        riskTier: 'low',
        requiresHumanApproval: false,
        estimatedImpact: {
            metric: 'alert_noise',
            unit: 'percent',
            expectedDelta: -5,
            confidence: 0.6
        },
        verificationPlan: {
            steps: [
                {
                    stepId: 'verify-low-1',
                    description: 'Confirm alert volume decreases over baseline.'
                }
            ]
        }
    });

    assert.equal(result.ok, true);
});

test('validateCognitionTask supports commands/actions compatibility aliases', () => {
    const result = validateCognitionTask({
        id: 'task-1',
        owner: 'agent:nexus',
        dependencies: ['task-0'],
        actions: ['npm run restart:gateway'],
        successCriteria: ['No disconnects for 10 minutes'],
        rollbackPlan: 'Revert gateway config to previous stable version'
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.deepEqual(result.value.commands, ['npm run restart:gateway']);
    assert.equal(result.value.rollbackPlan.length, 1);
});

test('assert helpers throw for invalid recommendation/task payloads', () => {
    assert.throws(() => assertCognitionRecommendation({}), /Invalid CognitionRecommendation/);
    assert.throws(() => assertCognitionTask({}), /Invalid CognitionTask/);
});


test('validateCognitionTask fails closed when rollback readiness is missing', () => {
    const result = validateCognitionTask({
        taskId: 'task-no-rollback',
        owner: 'agent:nexus',
        dependencies: [],
        commands: ['echo run'],
        actions: ['echo run'],
        successCriteria: ['done'],
        rollbackPlan: []
    });

    assert.equal(result.ok, false);
    if (result.ok) return;

    const errorPaths = result.errors.map((issue) => issue.path);
    assert.equal(errorPaths.includes('rollbackPlan'), true);
    assert.equal(
        result.errors.some((issue) => issue.message.includes('fail-closed rollback readiness')),
        true
    );
});

test('validateCognitionTask fails closed when required approvers are missing for human approval', () => {
    const result = validateCognitionTask({
        taskId: 'task-missing-approvers',
        owner: 'agent:nexus',
        dependencies: [],
        commands: ['echo run'],
        actions: ['echo run'],
        successCriteria: ['done'],
        rollbackPlan: ['undo change'],
        metadata: {
            policyGate: {
                requiresHumanApproval: true,
                passthrough: {}
            }
        }
    });

    assert.equal(result.ok, false);
    if (result.ok) return;

    assert.equal(result.errors.some((issue) => issue.path === 'metadata.requiredApprovers'), true);
    assert.equal(
        result.errors.some((issue) => issue.message.includes('fail-closed approval contract')),
        true
    );
});
