import test from 'node:test';
import assert from 'node:assert/strict';
import {
    assertCognitionState,
    createEmptyCognitionState,
    validateCognitionState,
    validateIncidentSnapshot
} from '../../src/contracts/state.js';

test('createEmptyCognitionState returns deterministic baseline shape', () => {
    const state = createEmptyCognitionState(123);

    assert.equal(state.version, 1);
    assert.equal(state.updatedAt, 123);
    assert.deepEqual(state.timelineEventIds, []);
    assert.deepEqual(state.memory, { nodeCount: 0, edgeCount: 0 });
});

test('validateIncidentSnapshot accepts valid incident contract', () => {
    const result = validateIncidentSnapshot({
        incidentId: 'inc-1',
        title: 'Gateway instability',
        status: 'open',
        severity: 'error',
        riskTier: 'high',
        openedAt: Date.now(),
        updatedAt: Date.now(),
        relatedEventIds: ['evt-1'],
        relatedRecommendationIds: ['rec-1']
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.value.status, 'open');
    assert.equal(result.value.relatedEventIds.length, 1);
});

test('validateCognitionState rejects invalid nested content', () => {
    const state = createEmptyCognitionState(100);
    const result = validateCognitionState({
        ...state,
        incidents: {
            foo: {
                incidentId: 'foo',
                title: 'Invalid incident',
                status: 'not-a-status',
                severity: 'error',
                riskTier: 'high',
                openedAt: 1,
                updatedAt: 2,
                relatedEventIds: [],
                relatedRecommendationIds: []
            }
        }
    });

    assert.equal(result.ok, false);
    if (result.ok) return;

    assert.ok(result.errors.some((issue) => issue.path.includes('incidents.foo.status')));
});

test('assertCognitionState throws for malformed state', () => {
    assert.throws(() => {
        assertCognitionState({ version: 0 });
    }, /Invalid CognitionState/);
});
