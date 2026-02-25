import test from 'node:test';
import assert from 'node:assert/strict';
import { RateLimiter, __rateLimiterInternals } from '../index.js';

const { TokenBucket } = __rateLimiterInternals;

test('TokenBucket allows requests up to capacity', () => {
    let time = 1000;
    const bucket = new TokenBucket({
        capacity: 3,
        refillRate: 1,
        refillIntervalMs: 1000,
        now: () => time
    });

    assert.deepStrictEqual(bucket.tryConsume(time).allowed, true);
    assert.deepStrictEqual(bucket.tryConsume(time).allowed, true);
    assert.deepStrictEqual(bucket.tryConsume(time).allowed, true);
    assert.deepStrictEqual(bucket.tryConsume(time).allowed, false);
});

test('TokenBucket refills tokens over time', () => {
    let time = 1000;
    const bucket = new TokenBucket({
        capacity: 2,
        refillRate: 1,
        refillIntervalMs: 500,
        now: () => time
    });

    bucket.tryConsume(time);
    bucket.tryConsume(time);
    assert.deepStrictEqual(bucket.tryConsume(time).allowed, false);

    time += 500;
    const result = bucket.tryConsume(time);
    assert.deepStrictEqual(result.allowed, true);
});

test('TokenBucket peek does not consume tokens', () => {
    let time = 1000;
    const bucket = new TokenBucket({
        capacity: 5,
        refillRate: 1,
        refillIntervalMs: 1000,
        now: () => time
    });

    const peek1 = bucket.peek(time);
    const peek2 = bucket.peek(time);
    assert.equal(peek1.tokens, 5);
    assert.equal(peek2.tokens, 5);
});

test('RateLimiter allows requests within limits', () => {
    let time = 1000;
    const limiter = new RateLimiter({
        globalCapacity: 10,
        globalRefillRate: 5,
        globalRefillIntervalMs: 1000,
        perAgentCapacity: 3,
        perAgentRefillRate: 1,
        perAgentRefillIntervalMs: 1000,
        now: () => time
    });

    const r1 = limiter.check('agent:a', time);
    assert.equal(r1.allowed, true);
    assert.equal(r1.agentId, 'agent:a');
    assert.equal(r1.reason, null);
});

test('RateLimiter enforces per-agent limit', () => {
    let time = 1000;
    const limiter = new RateLimiter({
        globalCapacity: 100,
        globalRefillRate: 10,
        globalRefillIntervalMs: 1000,
        perAgentCapacity: 2,
        perAgentRefillRate: 1,
        perAgentRefillIntervalMs: 1000,
        now: () => time
    });

    assert.equal(limiter.check('agent:a', time).allowed, true);
    assert.equal(limiter.check('agent:a', time).allowed, true);

    const denied = limiter.check('agent:a', time);
    assert.equal(denied.allowed, false);
    assert.equal(denied.reason, 'agent_rate_limit');
    assert.ok(denied.retryAfterMs > 0);

    // Different agent should still be allowed
    assert.equal(limiter.check('agent:b', time).allowed, true);
});

test('RateLimiter enforces global limit', () => {
    let time = 1000;
    const limiter = new RateLimiter({
        globalCapacity: 2,
        globalRefillRate: 1,
        globalRefillIntervalMs: 1000,
        perAgentCapacity: 10,
        perAgentRefillRate: 5,
        perAgentRefillIntervalMs: 1000,
        now: () => time
    });

    assert.equal(limiter.check('agent:a', time).allowed, true);
    assert.equal(limiter.check('agent:b', time).allowed, true);

    const denied = limiter.check('agent:c', time);
    assert.equal(denied.allowed, false);
    assert.equal(denied.reason, 'global_rate_limit');
});

test('RateLimiter returns global token when per-agent limit blocks', () => {
    let time = 1000;
    const limiter = new RateLimiter({
        globalCapacity: 5,
        globalRefillRate: 1,
        globalRefillIntervalMs: 1000,
        perAgentCapacity: 1,
        perAgentRefillRate: 1,
        perAgentRefillIntervalMs: 1000,
        now: () => time
    });

    limiter.check('agent:a', time); // consumes 1 global + 1 per-agent
    limiter.check('agent:a', time); // per-agent blocked, global token returned

    // Global should still have 4 tokens (5 - 1 consumed)
    const peek = limiter.globalBucket.peek(time);
    assert.equal(peek.tokens, 4);
});

test('getBackpressure reports pressure when tokens are depleted', () => {
    let time = 1000;
    const limiter = new RateLimiter({
        globalCapacity: 3,
        globalRefillRate: 1,
        globalRefillIntervalMs: 1000,
        perAgentCapacity: 5,
        perAgentRefillRate: 1,
        perAgentRefillIntervalMs: 1000,
        backpressureThreshold: 0.2,
        now: () => time
    });

    // No backpressure initially
    const bp1 = limiter.getBackpressure(time);
    assert.equal(bp1.backpressure, false);
    assert.equal(bp1.level, 0);

    // Consume most tokens
    limiter.check('agent:a', time);
    limiter.check('agent:b', time);
    limiter.check('agent:c', time);

    const bp2 = limiter.getBackpressure(time);
    assert.equal(bp2.backpressure, true);
    assert.ok(bp2.level > 0);
    assert.ok(bp2.signals.length > 0);
});

test('getMetrics tracks allow/deny counts', () => {
    let time = 1000;
    const limiter = new RateLimiter({
        globalCapacity: 2,
        globalRefillRate: 1,
        globalRefillIntervalMs: 1000,
        perAgentCapacity: 10,
        perAgentRefillRate: 5,
        perAgentRefillIntervalMs: 1000,
        now: () => time
    });

    limiter.check('agent:a', time);
    limiter.check('agent:b', time);
    limiter.check('agent:c', time); // denied

    const metrics = limiter.getMetrics();
    assert.equal(metrics.totalRequests, 3);
    assert.equal(metrics.allowed, 2);
    assert.equal(metrics.denied, 1);
});

test('resetAgentBuckets clears per-agent state', () => {
    let time = 1000;
    const limiter = new RateLimiter({
        globalCapacity: 100,
        globalRefillRate: 10,
        globalRefillIntervalMs: 1000,
        perAgentCapacity: 1,
        perAgentRefillRate: 1,
        perAgentRefillIntervalMs: 1000,
        now: () => time
    });

    limiter.check('agent:a', time);
    assert.equal(limiter.check('agent:a', time).allowed, false);

    limiter.resetAgentBuckets();
    assert.equal(limiter.check('agent:a', time).allowed, true);
});

test('resetAgentBucket clears a single agent', () => {
    let time = 1000;
    const limiter = new RateLimiter({
        globalCapacity: 100,
        globalRefillRate: 10,
        globalRefillIntervalMs: 1000,
        perAgentCapacity: 1,
        perAgentRefillRate: 1,
        perAgentRefillIntervalMs: 1000,
        now: () => time
    });

    limiter.check('agent:a', time);
    limiter.check('agent:b', time);

    limiter.resetAgentBucket('agent:a');
    assert.equal(limiter.check('agent:a', time).allowed, true);
    assert.equal(limiter.check('agent:b', time).allowed, false);
});
