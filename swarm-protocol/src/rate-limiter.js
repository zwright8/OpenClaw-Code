function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

/**
 * Token-bucket rate limiter.
 * Each bucket refills at `refillRate` tokens per `refillIntervalMs`.
 * A request is allowed when at least 1 token is available, otherwise rejected
 * with a `retryAfterMs` hint.
 */
class TokenBucket {
    constructor({ capacity, refillRate, refillIntervalMs, now }) {
        this.capacity = Math.max(1, safeNumber(capacity, 10));
        this.refillRate = Math.max(1, safeNumber(refillRate, 1));
        this.refillIntervalMs = Math.max(1, safeNumber(refillIntervalMs, 1000));
        this.now = typeof now === 'function' ? now : Date.now;
        this.tokens = this.capacity;
        this.lastRefillAt = safeNow(this.now);
    }

    _refill(nowMs) {
        const elapsed = nowMs - this.lastRefillAt;
        if (elapsed <= 0) return;

        const intervals = Math.floor(elapsed / this.refillIntervalMs);
        if (intervals > 0) {
            this.tokens = Math.min(this.capacity, this.tokens + intervals * this.refillRate);
            this.lastRefillAt += intervals * this.refillIntervalMs;
        }
    }

    tryConsume(nowMs) {
        if (!Number.isFinite(nowMs)) nowMs = safeNow(this.now);
        this._refill(nowMs);

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return { allowed: true, remainingTokens: this.tokens, retryAfterMs: 0 };
        }

        const deficit = 1 - this.tokens;
        const intervalsNeeded = Math.ceil(deficit / this.refillRate);
        const retryAfterMs = Math.max(1, intervalsNeeded * this.refillIntervalMs - (nowMs - this.lastRefillAt));
        return { allowed: false, remainingTokens: this.tokens, retryAfterMs };
    }

    peek(nowMs) {
        if (!Number.isFinite(nowMs)) nowMs = safeNow(this.now);
        this._refill(nowMs);
        return { tokens: this.tokens, capacity: this.capacity };
    }
}

export class RateLimiter {
    constructor({
        globalCapacity = 50,
        globalRefillRate = 10,
        globalRefillIntervalMs = 1000,
        perAgentCapacity = 10,
        perAgentRefillRate = 2,
        perAgentRefillIntervalMs = 1000,
        backpressureThreshold = 0.2,
        now = Date.now,
        logger = console
    } = {}) {
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
        this.backpressureThreshold = Math.max(0, Math.min(1, safeNumber(backpressureThreshold, 0.2)));

        this._globalBucketConfig = {
            capacity: globalCapacity,
            refillRate: globalRefillRate,
            refillIntervalMs: globalRefillIntervalMs,
            now: this.now
        };
        this._perAgentBucketConfig = {
            capacity: perAgentCapacity,
            refillRate: perAgentRefillRate,
            refillIntervalMs: perAgentRefillIntervalMs,
            now: this.now
        };

        this.globalBucket = new TokenBucket(this._globalBucketConfig);
        this.agentBuckets = new Map();
        this.metrics = {
            totalRequests: 0,
            allowed: 0,
            denied: 0,
            backpressureEvents: 0
        };
    }

    _getAgentBucket(agentId) {
        if (!this.agentBuckets.has(agentId)) {
            this.agentBuckets.set(agentId, new TokenBucket(this._perAgentBucketConfig));
        }
        return this.agentBuckets.get(agentId);
    }

    /**
     * Check whether a task dispatch to `agentId` is allowed.
     * Returns { allowed, agentId, retryAfterMs, reason, global, agent }.
     */
    check(agentId, nowMs) {
        if (!Number.isFinite(nowMs)) nowMs = safeNow(this.now);
        this.metrics.totalRequests++;

        const globalResult = this.globalBucket.tryConsume(nowMs);
        if (!globalResult.allowed) {
            this.metrics.denied++;
            return {
                allowed: false,
                agentId,
                retryAfterMs: globalResult.retryAfterMs,
                reason: 'global_rate_limit',
                global: globalResult,
                agent: null
            };
        }

        const agentBucket = this._getAgentBucket(agentId);
        const agentResult = agentBucket.tryConsume(nowMs);
        if (!agentResult.allowed) {
            // Return the global token since the per-agent limit blocked it
            this.globalBucket.tokens = Math.min(
                this.globalBucket.capacity,
                this.globalBucket.tokens + 1
            );
            this.metrics.denied++;
            return {
                allowed: false,
                agentId,
                retryAfterMs: agentResult.retryAfterMs,
                reason: 'agent_rate_limit',
                global: { allowed: true, remainingTokens: this.globalBucket.tokens, retryAfterMs: 0 },
                agent: agentResult
            };
        }

        this.metrics.allowed++;
        return {
            allowed: true,
            agentId,
            retryAfterMs: 0,
            reason: null,
            global: globalResult,
            agent: agentResult
        };
    }

    /**
     * Evaluate backpressure status.
     * Returns { backpressure: boolean, level, signals[] }.
     * `level` is 0–1, where >= backpressureThreshold triggers the flag.
     */
    getBackpressure(nowMs) {
        if (!Number.isFinite(nowMs)) nowMs = safeNow(this.now);
        const globalPeek = this.globalBucket.peek(nowMs);
        const globalUtilization = 1 - (globalPeek.tokens / globalPeek.capacity);

        const signals = [];
        let maxLevel = globalUtilization;

        if (globalUtilization >= (1 - this.backpressureThreshold)) {
            signals.push({
                source: 'global',
                utilization: globalUtilization,
                remainingTokens: globalPeek.tokens,
                capacity: globalPeek.capacity
            });
        }

        for (const [agentId, bucket] of this.agentBuckets.entries()) {
            const peek = bucket.peek(nowMs);
            const utilization = 1 - (peek.tokens / peek.capacity);
            if (utilization > maxLevel) maxLevel = utilization;
            if (utilization >= (1 - this.backpressureThreshold)) {
                signals.push({
                    source: agentId,
                    utilization,
                    remainingTokens: peek.tokens,
                    capacity: peek.capacity
                });
            }
        }

        const backpressure = maxLevel >= (1 - this.backpressureThreshold);
        if (backpressure) {
            this.metrics.backpressureEvents++;
        }

        return {
            backpressure,
            level: Number(maxLevel.toFixed(4)),
            signals
        };
    }

    /**
     * Return a snapshot of rate limiter metrics.
     */
    getMetrics() {
        return clone(this.metrics);
    }

    /**
     * Reset all per-agent buckets (e.g. after a fleet topology change).
     */
    resetAgentBuckets() {
        this.agentBuckets.clear();
    }

    /**
     * Reset a single agent's bucket.
     */
    resetAgentBucket(agentId) {
        this.agentBuckets.delete(agentId);
    }
}

export const __rateLimiterInternals = {
    TokenBucket,
    safeNumber
};
