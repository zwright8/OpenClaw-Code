import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createCognitionStateSnapshot,
    verifyCognitionStateSnapshot,
    hashCognitionState,
    stableStringify
} from '../../src/state/snapshots.js';
import { createEmptyCognitionState } from '../../src/contracts/state.js';

test('createCognitionStateSnapshot creates verifiable hash and summary', () => {
    const state = createEmptyCognitionState(123);
    state.timelineEventIds.push('evt-1');

    const snapshot = createCognitionStateSnapshot(state, {
        snapshotId: 'snapshot-1',
        createdAt: 456
    });

    assert.equal(snapshot.snapshotId, 'snapshot-1');
    assert.equal(snapshot.summary.timelineEventCount, 1);
    assert.equal(snapshot.stateHash, hashCognitionState(state));

    const verification = verifyCognitionStateSnapshot(snapshot);
    assert.equal(verification.ok, true);
});

test('verifyCognitionStateSnapshot fails when state hash is tampered', () => {
    const state = createEmptyCognitionState(1);
    const snapshot = createCognitionStateSnapshot(state, {
        snapshotId: 'snapshot-2',
        createdAt: 2
    });

    const tampered = {
        ...snapshot,
        stateHash: 'bad-hash'
    };

    const verification = verifyCognitionStateSnapshot(tampered);
    assert.equal(verification.ok, false);
    if (verification.ok) return;

    assert.ok(verification.errors.some((issue) => issue.path === 'stateHash'));
});

test('stableStringify is deterministic for key order', () => {
    const a = { b: 1, a: { d: 1, c: 2 } };
    const b = { a: { c: 2, d: 1 }, b: 1 };

    assert.equal(stableStringify(a), stableStringify(b));
});
