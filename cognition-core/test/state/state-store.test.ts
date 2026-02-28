import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CognitionStateStore } from '../../src/state/state-store.js';

test('CognitionStateStore creates default state when file is missing', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cognition-state-store-'));
    const filePath = path.join(dir, 'state.json');

    const store = new CognitionStateStore({ filePath, now: () => 111 });
    const state = await store.load();

    assert.equal(state.version, 1);
    assert.equal(state.updatedAt, 111);

    await fs.rm(dir, { recursive: true, force: true });
});

test('CognitionStateStore update persists timeline IDs uniquely', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cognition-state-store-'));
    const filePath = path.join(dir, 'state.json');

    const store = new CognitionStateStore({ filePath, now: () => 222 });
    await store.load();
    await store.appendTimelineEventIds(['evt-1', 'evt-2', 'evt-1']);

    const state = await store.load();
    assert.deepEqual(state.timelineEventIds, ['evt-1', 'evt-2']);
    assert.equal(state.updatedAt, 222);

    await fs.rm(dir, { recursive: true, force: true });
});

test('CognitionStateStore upsertIncident validates and writes incident state', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cognition-state-store-'));
    const filePath = path.join(dir, 'state.json');

    const store = new CognitionStateStore({ filePath, now: () => 333 });
    await store.load();
    await store.upsertIncident({
        incidentId: 'inc-42',
        title: 'Runtime timeout surge',
        status: 'open',
        severity: 'error',
        riskTier: 'high',
        openedAt: 1,
        updatedAt: 1,
        relatedEventIds: ['evt-1'],
        relatedRecommendationIds: ['rec-1']
    });

    const state = await store.load();
    assert.ok(state.incidents['inc-42']);
    assert.equal(state.incidents['inc-42']?.title, 'Runtime timeout surge');

    await fs.rm(dir, { recursive: true, force: true });
});
