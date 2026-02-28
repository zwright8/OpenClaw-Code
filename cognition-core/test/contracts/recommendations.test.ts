import test from 'node:test';
import assert from 'node:assert/strict';
import {
    assertCognitionRecommendation,
    assertCognitionTask,
    normalizeRecommendationPriority,
    validateCognitionRecommendation,
    validateCognitionTask
} from '../../src/contracts/recommendations.js';

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
        }
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.value.evidence.length, 1);
    assert.equal(result.value.verificationPlan.steps.length, 1);
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
