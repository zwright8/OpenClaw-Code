import test from 'node:test';
import assert from 'node:assert/strict';
import {
    assertCognitionEvent,
    validateCognitionEvent,
    validateCognitionEvents
} from '../../src/contracts/events.js';

test('validateCognitionEvent accepts canonical event payload', () => {
    const result = validateCognitionEvent({
        eventId: 'evt-1',
        ts: 1_717_171_717_000,
        source: 'gateway',
        type: 'gateway.disconnect',
        severity: 'warning',
        entities: [{ kind: 'agent', id: 'agent:nexus' }],
        payload: { reason: 'socket_closed' },
        confidence: 0.94,
        riskTier: 'medium'
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.value.eventId, 'evt-1');
    assert.equal(result.value.entities.length, 1);
});

test('validateCognitionEvent supports backward-compatible aliases', () => {
    const result = validateCognitionEvent({
        id: 'evt-legacy',
        timestamp: '2025-01-01T00:00:00.000Z',
        source: 'runtime',
        eventType: 'task.completed',
        severity: 'warn',
        entities: [],
        payload: { taskId: 'task-1' },
        confidence: '0.8',
        riskTier: 'p2'
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.value.eventId, 'evt-legacy');
    assert.equal(result.value.severity, 'warning');
    assert.equal(result.value.riskTier, 'medium');
});

test('validateCognitionEvent fails when required fields are missing', () => {
    const result = validateCognitionEvent({
        eventId: '',
        entities: 'oops'
    });

    assert.equal(result.ok, false);
    if (result.ok) return;

    assert.ok(result.errors.some((issue) => issue.path === 'eventId'));
    assert.ok(result.errors.some((issue) => issue.path === 'entities'));
});

test('assertCognitionEvent throws on invalid event', () => {
    assert.throws(() => {
        assertCognitionEvent({ eventId: 'bad-event' });
    }, /Invalid CognitionEvent/);
});

test('validateCognitionEvents validates an array payload', () => {
    const result = validateCognitionEvents([
        {
            eventId: 'evt-1',
            ts: Date.now(),
            source: 'gateway',
            type: 'gateway.restart',
            severity: 'info',
            entities: [],
            payload: {},
            confidence: 1,
            riskTier: 'low'
        },
        {
            eventId: 'evt-2',
            ts: Date.now(),
            source: 'gateway',
            type: 'gateway.disconnect',
            severity: 'critical',
            entities: [],
            payload: {},
            confidence: 0.6,
            riskTier: 'critical'
        }
    ]);

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.value.length, 2);
});
