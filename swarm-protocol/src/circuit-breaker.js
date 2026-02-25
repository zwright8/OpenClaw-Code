import { randomUUID } from 'crypto';

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

const STATE_CLOSED = 'closed';
const STATE_OPEN = 'open';
const STATE_HALF_OPEN = 'half_open';

class CircuitState {
    constructor({
        failureThreshold = 5,
        resetTimeoutMs = 30_000,
        halfOpenMaxProbes = 2,
        now = Date.now
    } = {}) {
        this.failureThreshold = Math.max(1, safeNumber(failureThreshold, 5));
        this.resetTimeoutMs = Math.max(1000, safeNumber(resetTimeoutMs, 30_000));
        this.halfOpenMaxProbes = Math.max(1, safeNumber(halfOpenMaxProbes, 2));
        this.now = typeof now === 'function' ? now : Date.now;

        this.state = STATE_CLOSED;
        this.failures = 0;
        this.successes = 0;
        this.lastFailureAt = 0;
        this.lastStateChangeAt = safeNow(this.now);
        this.probeSuccesses = 0;
        this.totalTrips = 0;
    }

    get allowed() {
        if (this.state === STATE_CLOSED) return true;
        if (this.state === STATE_OPEN) {
            const elapsed = safeNow(this.now) - this.lastStateChangeAt;
            if (elapsed >= this.resetTimeoutMs) {
                this._transition(STATE_HALF_OPEN);
                return true;
            }
            return false;
        }
        return true;
    }

    recordSuccess() {
        if (this.state === STATE_HALF_OPEN) {
            this.probeSuccesses += 1;
            if (this.probeSuccesses >= this.halfOpenMaxProbes) {
                this._transition(STATE_CLOSED);
                this.failures = 0;
                this.probeSuccesses = 0;
            }
        } else if (this.state === STATE_CLOSED) {
            this.successes += 1;
        }
    }

    recordFailure() {
        this.lastFailureAt = safeNow(this.now);
        if (this.state === STATE_HALF_OPEN) {
            this._transition(STATE_OPEN);
            this.probeSuccesses = 0;
            return;
        }
        this.failures += 1;
        if (this.failures >= this.failureThreshold) {
            this._transition(STATE_OPEN);
            this.totalTrips += 1;
        }
    }

    reset() {
        this.state = STATE_CLOSED;
        this.failures = 0;
        this.successes = 0;
        this.probeSuccesses = 0;
        this.lastFailureAt = 0;
        this.lastStateChangeAt = safeNow(this.now);
    }

    snapshot() {
        return {
            state: this.state,
            failures: this.failures,
            successes: this.successes,
            totalTrips: this.totalTrips,
            probeSuccesses: this.probeSuccesses,
            lastFailureAt: this.lastFailureAt,
            lastStateChangeAt: this.lastStateChangeAt
        };
    }

    _transition(nextState) {
        this.state = nextState;
        this.lastStateChangeAt = safeNow(this.now);
    }
}

export class CircuitBreakerRegistry {
    constructor({
        failureThreshold = 5,
        resetTimeoutMs = 30_000,
        halfOpenMaxProbes = 2,
        now = Date.now
    } = {}) {
        this.defaults = {
            failureThreshold: Math.max(1, safeNumber(failureThreshold, 5)),
            resetTimeoutMs: Math.max(1000, safeNumber(resetTimeoutMs, 30_000)),
            halfOpenMaxProbes: Math.max(1, safeNumber(halfOpenMaxProbes, 2))
        };
        this.now = typeof now === 'function' ? now : Date.now;
        this.circuits = new Map();
    }

    _getOrCreate(agentId) {
        if (!this.circuits.has(agentId)) {
            this.circuits.set(agentId, new CircuitState({
                ...this.defaults,
                now: this.now
            }));
        }
        return this.circuits.get(agentId);
    }

    isAllowed(agentId) {
        return this._getOrCreate(agentId).allowed;
    }

    recordSuccess(agentId) {
        this._getOrCreate(agentId).recordSuccess();
    }

    recordFailure(agentId) {
        this._getOrCreate(agentId).recordFailure();
    }

    reset(agentId) {
        if (this.circuits.has(agentId)) {
            this.circuits.get(agentId).reset();
        }
    }

    getState(agentId) {
        return this._getOrCreate(agentId).state;
    }

    snapshot() {
        const entries = {};
        for (const [agentId, circuit] of this.circuits) {
            entries[agentId] = circuit.snapshot();
        }
        return {
            at: safeNow(this.now),
            agents: entries
        };
    }

    listOpen() {
        const result = [];
        for (const [agentId, circuit] of this.circuits) {
            if (circuit.state === STATE_OPEN || circuit.state === STATE_HALF_OPEN) {
                result.push({
                    agentId,
                    state: circuit.state,
                    failures: circuit.failures,
                    totalTrips: circuit.totalTrips,
                    lastFailureAt: circuit.lastFailureAt
                });
            }
        }
        return result;
    }

    createRouteFilter() {
        return (agents) => agents.filter((agent) => {
            const id = agent?.agentId || agent?.id;
            return id ? this.isAllowed(id) : true;
        });
    }
}

export { STATE_CLOSED, STATE_OPEN, STATE_HALF_OPEN };
