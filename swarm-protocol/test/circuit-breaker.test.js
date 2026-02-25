import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CircuitBreakerRegistry,
    STATE_CLOSED,
    STATE_OPEN,
    STATE_HALF_OPEN
} from '../index.js';

test('circuit starts closed and allows requests', () => {
    const registry = new CircuitBreakerRegistry();
    assert.equal(registry.getState('agent:a'), STATE_CLOSED);
    assert.equal(registry.isAllowed('agent:a'), true);
});

test('circuit opens after failure threshold', () => {
    const registry = new CircuitBreakerRegistry({ failureThreshold: 3 });
    registry.recordFailure('agent:a');
    registry.recordFailure('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_CLOSED);
    registry.recordFailure('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_OPEN);
    assert.equal(registry.isAllowed('agent:a'), false);
});

test('circuit transitions to half-open after reset timeout', () => {
    let time = 1000;
    const registry = new CircuitBreakerRegistry({
        failureThreshold: 2,
        resetTimeoutMs: 5000,
        now: () => time
    });

    registry.recordFailure('agent:a');
    registry.recordFailure('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_OPEN);

    time += 5000;
    assert.equal(registry.isAllowed('agent:a'), true);
    assert.equal(registry.getState('agent:a'), STATE_HALF_OPEN);
});

test('half-open circuit closes after enough probe successes', () => {
    let time = 1000;
    const registry = new CircuitBreakerRegistry({
        failureThreshold: 2,
        resetTimeoutMs: 5000,
        halfOpenMaxProbes: 2,
        now: () => time
    });

    registry.recordFailure('agent:a');
    registry.recordFailure('agent:a');
    time += 5000;
    registry.isAllowed('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_HALF_OPEN);

    registry.recordSuccess('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_HALF_OPEN);
    registry.recordSuccess('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_CLOSED);
});

test('half-open circuit re-opens on failure', () => {
    let time = 1000;
    const registry = new CircuitBreakerRegistry({
        failureThreshold: 2,
        resetTimeoutMs: 5000,
        now: () => time
    });

    registry.recordFailure('agent:a');
    registry.recordFailure('agent:a');
    time += 5000;
    registry.isAllowed('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_HALF_OPEN);

    registry.recordFailure('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_OPEN);
});

test('snapshot returns per-agent state', () => {
    const registry = new CircuitBreakerRegistry({ failureThreshold: 2 });
    registry.recordFailure('agent:a');
    registry.recordSuccess('agent:b');

    const snap = registry.snapshot();
    assert.ok(snap.at > 0);
    assert.equal(snap.agents['agent:a'].failures, 1);
    assert.equal(snap.agents['agent:a'].state, STATE_CLOSED);
    assert.equal(snap.agents['agent:b'].successes, 1);
});

test('listOpen returns only open and half-open circuits', () => {
    const registry = new CircuitBreakerRegistry({ failureThreshold: 1 });
    registry.recordSuccess('agent:healthy');
    registry.recordFailure('agent:failing');

    const openList = registry.listOpen();
    assert.equal(openList.length, 1);
    assert.equal(openList[0].agentId, 'agent:failing');
    assert.equal(openList[0].state, STATE_OPEN);
});

test('reset restores circuit to closed', () => {
    const registry = new CircuitBreakerRegistry({ failureThreshold: 1 });
    registry.recordFailure('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_OPEN);

    registry.reset('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_CLOSED);
    assert.equal(registry.isAllowed('agent:a'), true);
});

test('createRouteFilter excludes open circuits', () => {
    const registry = new CircuitBreakerRegistry({ failureThreshold: 1 });
    registry.recordFailure('agent:bad');
    registry.recordSuccess('agent:good');

    const filter = registry.createRouteFilter();
    const agents = [
        { agentId: 'agent:bad' },
        { agentId: 'agent:good' },
        { agentId: 'agent:unknown' }
    ];

    const allowed = filter(agents);
    assert.equal(allowed.length, 2);
    assert.ok(allowed.some((a) => a.agentId === 'agent:good'));
    assert.ok(allowed.some((a) => a.agentId === 'agent:unknown'));
});

test('totalTrips increments each time circuit opens', () => {
    let time = 1000;
    const registry = new CircuitBreakerRegistry({
        failureThreshold: 1,
        resetTimeoutMs: 1000,
        halfOpenMaxProbes: 1,
        now: () => time
    });

    registry.recordFailure('agent:a');
    assert.equal(registry.snapshot().agents['agent:a'].totalTrips, 1);

    time += 1000;
    registry.isAllowed('agent:a');
    registry.recordSuccess('agent:a');
    assert.equal(registry.getState('agent:a'), STATE_CLOSED);

    registry.recordFailure('agent:a');
    assert.equal(registry.snapshot().agents['agent:a'].totalTrips, 2);
});
