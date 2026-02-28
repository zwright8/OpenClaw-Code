import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CognitionMemoryIndex,
    createEmptyMemoryIndexData,
    validateMemoryIndexData
} from '../../src/state/memory-index.js';

test('validateMemoryIndexData accepts empty baseline index', () => {
    const result = validateMemoryIndexData(createEmptyMemoryIndexData(100));

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.value.updatedAt, 100);
    assert.equal(Object.keys(result.value.nodes).length, 0);
});

test('CognitionMemoryIndex supports node and edge lifecycle operations', () => {
    const index = new CognitionMemoryIndex(createEmptyMemoryIndexData(1));

    const nodeA = index.upsertNode({
        nodeId: 'node-a',
        kind: 'incident',
        title: 'Gateway timeout surge',
        tags: ['gateway', 'incident'],
        entityRefs: ['agent:nexus'],
        ts: 1
    }, 10);

    const nodeB = index.upsertNode({
        nodeId: 'node-b',
        kind: 'recommendation',
        title: 'Restart gateway service',
        tags: ['gateway', 'recommendation'],
        entityRefs: ['agent:nexus'],
        ts: 2
    }, 11);

    index.upsertEdge({
        edgeId: 'edge-1',
        from: nodeA.nodeId,
        to: nodeB.nodeId,
        relation: 'suggests',
        weight: 1,
        ts: 3
    }, 12);

    assert.equal(index.getStats().nodeCount, 2);
    assert.equal(index.getStats().edgeCount, 1);

    assert.equal(index.findNodesByTag('gateway').length, 2);
    assert.equal(index.findNodesByEntity('agent:nexus').length, 2);
    assert.equal(index.getNeighbors('node-a').length, 1);

    const didRemoveNode = index.removeNode('node-b', 20);
    assert.equal(didRemoveNode, true);
    assert.equal(index.getStats().nodeCount, 1);
    assert.equal(index.getStats().edgeCount, 0);
});

test('CognitionMemoryIndex.toJSON emits validation-safe structure', () => {
    const index = new CognitionMemoryIndex();
    index.upsertNode({
        nodeId: 'node-1',
        kind: 'event',
        title: 'Gateway restarted',
        tags: ['gateway'],
        entityRefs: [],
        ts: 5
    }, 30);

    const json = index.toJSON();
    const result = validateMemoryIndexData(json);

    assert.equal(result.ok, true);
});
