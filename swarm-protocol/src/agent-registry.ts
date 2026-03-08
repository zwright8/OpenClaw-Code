import { HeartbeatSignal } from './schemas.js';
import { routeTaskRequest } from './task-router.js';

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeCapabilities(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
}

function normalizeRoutingPolicy(policy = {}) {
    const overloadThreshold = Number(policy.overloadThreshold);
    const ewmaAlpha = Number(policy.ewmaAlpha);
    return {
        failureThreshold: Number.isFinite(policy.failureThreshold) && policy.failureThreshold > 0
            ? Number(policy.failureThreshold)
            : 3,
        cooldownMs: Number.isFinite(policy.cooldownMs) && policy.cooldownMs > 0
            ? Number(policy.cooldownMs)
            : 30_000,
        minSamplesForReliability: Number.isFinite(policy.minSamplesForReliability) && policy.minSamplesForReliability > 0
            ? Number(policy.minSamplesForReliability)
            : 3,
        latencyPenaltyStartMs: Number.isFinite(policy.latencyPenaltyStartMs) && policy.latencyPenaltyStartMs > 0
            ? Number(policy.latencyPenaltyStartMs)
            : 1_500,
        latencyPenaltyCapMs: Number.isFinite(policy.latencyPenaltyCapMs) && policy.latencyPenaltyCapMs > 0
            ? Number(policy.latencyPenaltyCapMs)
            : 15_000,
        overloadThreshold: Number.isFinite(overloadThreshold) ? clamp(overloadThreshold, 0.5, 1) : 0.92,
        ewmaAlpha: Number.isFinite(ewmaAlpha) ? clamp(ewmaAlpha, 0.05, 0.95) : 0.3
    };
}

function createOutcomeRecord(nowMs) {
    return {
        attempts: 0,
        successes: 0,
        failures: 0,
        partials: 0,
        consecutiveFailures: 0,
        ewmaLatencyMs: null,
        cooldownUntilMs: 0,
        lastOutcomeAt: nowMs
    };
}

export class AgentRegistry {
    constructor({
        now = Date.now,
        maxStalenessMs = 60_000,
        routingPolicy = {}
    } = {}) {
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxStalenessMs = Number.isFinite(maxStalenessMs) && maxStalenessMs > 0
            ? Number(maxStalenessMs)
            : 60_000;
        this.routingPolicy = normalizeRoutingPolicy(routingPolicy);
        this.agents = new Map();
        this.outcomes = new Map();
    }

    ingestHeartbeat(signalPayload, metadata = {}) {
        const signal = HeartbeatSignal.parse(signalPayload);
        const existing = this.agents.get(signal.from) || {};
        const capabilities = normalizeCapabilities(
            metadata.capabilities ?? existing.capabilities ?? []
        );

        const record = {
            id: signal.from,
            status: signal.status,
            load: Number.isFinite(signal.load) ? signal.load : 0,
            timestamp: signal.timestamp,
            capabilities
        };

        this.agents.set(signal.from, record);
        return clone(record);
    }

    updateCapabilities(agentId, capabilities) {
        const existing = this.agents.get(agentId) || {
            id: agentId,
            status: 'offline',
            load: 1,
            timestamp: safeNow(this.now),
            capabilities: []
        };

        const updated = {
            ...existing,
            capabilities: normalizeCapabilities(capabilities)
        };

        this.agents.set(agentId, updated);
        return clone(updated);
    }

    getAgent(agentId) {
        const record = this.agents.get(agentId);
        if (!record) return null;
        return clone({
            ...record,
            routingHints: this.getRoutingHints(agentId)
        });
    }

    listAgents() {
        return [...this.agents.values()].map((record) => clone({
            ...record,
            routingHints: this.getRoutingHints(record.id)
        }));
    }

    pruneStale(nowMs = safeNow(this.now), maxStalenessMs = this.maxStalenessMs) {
        let removed = 0;
        for (const [agentId, record] of this.agents.entries()) {
            const ts = Number(record.timestamp);
            if (Number.isFinite(ts) && nowMs - ts > maxStalenessMs) {
                this.agents.delete(agentId);
                removed++;
            }
        }
        return removed;
    }

    getHealthSummary(nowMs = safeNow(this.now), maxStalenessMs = this.maxStalenessMs) {
        const summary = {
            total: 0,
            healthy: 0,
            stale: 0,
            byStatus: {}
        };

        for (const record of this.agents.values()) {
            summary.total++;
            summary.byStatus[record.status] = (summary.byStatus[record.status] || 0) + 1;

            const ts = Number(record.timestamp);
            const stale = Number.isFinite(ts) && nowMs - ts > maxStalenessMs;
            if (stale) {
                summary.stale++;
            } else if (record.status === 'idle' || record.status === 'busy') {
                summary.healthy++;
            }
        }

        return summary;
    }

    getRoutingHints(agentId, nowMs = safeNow(this.now)) {
        const stats = this.outcomes.get(agentId) || createOutcomeRecord(nowMs);
        const attempts = Number(stats.attempts || 0);
        const successes = Number(stats.successes || 0);
        const successRate = attempts > 0 ? successes / attempts : 1;
        const cooldownUntilMs = Number(stats.cooldownUntilMs || 0);
        const circuitState = nowMs < cooldownUntilMs ? 'open' : 'closed';
        return {
            attempts,
            successes,
            failures: Number(stats.failures || 0),
            partials: Number(stats.partials || 0),
            consecutiveFailures: Number(stats.consecutiveFailures || 0),
            ewmaLatencyMs: Number.isFinite(Number(stats.ewmaLatencyMs)) ? Number(stats.ewmaLatencyMs) : null,
            successRate: Number(successRate.toFixed(4)),
            cooldownUntilMs,
            circuitState,
            lastOutcomeAt: Number(stats.lastOutcomeAt || 0)
        };
    }

    observeTaskOutcome(agentId, outcome = {}, options = {}) {
        if (typeof agentId !== 'string' || !agentId.trim()) {
            throw new Error('agentId is required');
        }

        const nowMs = Number.isFinite(options.nowMs) ? Number(options.nowMs) : safeNow(this.now);
        const status = typeof outcome.status === 'string' ? outcome.status : 'success';
        const latencyMs = Number(outcome.latencyMs);
        const key = agentId.trim();
        const existing = this.outcomes.get(key) || createOutcomeRecord(nowMs);
        const updated = { ...existing };

        updated.attempts += 1;
        updated.lastOutcomeAt = nowMs;

        if (status === 'failure') {
            updated.failures += 1;
            updated.consecutiveFailures += 1;
            if (updated.consecutiveFailures >= this.routingPolicy.failureThreshold) {
                updated.cooldownUntilMs = nowMs + this.routingPolicy.cooldownMs;
            }
        } else if (status === 'partial') {
            updated.partials += 1;
            updated.consecutiveFailures = 0;
            if (updated.cooldownUntilMs && nowMs >= updated.cooldownUntilMs) {
                updated.cooldownUntilMs = 0;
            }
        } else {
            updated.successes += 1;
            updated.consecutiveFailures = 0;
            if (updated.cooldownUntilMs && nowMs >= updated.cooldownUntilMs) {
                updated.cooldownUntilMs = 0;
            }
        }

        if (Number.isFinite(latencyMs) && latencyMs >= 0) {
            const sample = Math.round(latencyMs);
            if (!Number.isFinite(Number(updated.ewmaLatencyMs))) {
                updated.ewmaLatencyMs = sample;
            } else {
                const alpha = this.routingPolicy.ewmaAlpha;
                updated.ewmaLatencyMs = Number((alpha * sample + (1 - alpha) * Number(updated.ewmaLatencyMs)).toFixed(2));
            }
        }

        this.outcomes.set(key, updated);
        return clone(this.getRoutingHints(key, nowMs));
    }

    routeTask(taskRequest, options = {}) {
        const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : safeNow(this.now);
        const maxStalenessMs = Number.isFinite(options.maxStalenessMs)
            ? Number(options.maxStalenessMs)
            : this.maxStalenessMs;
        const { nowMs: _ignoredNow, maxStalenessMs: _ignoredMax, routingPolicy: optionRoutingPolicy, ...routeOptions } = options;
        const routingPolicy = normalizeRoutingPolicy({
            ...this.routingPolicy,
            ...(optionRoutingPolicy || {})
        });

        return routeTaskRequest(taskRequest, this.listAgents(), {
            nowMs,
            maxStalenessMs,
            routingPolicy,
            ...routeOptions
        });
    }

    createRouteTaskFn(options = {}) {
        return async (taskRequest) => {
            const routed = this.routeTask(taskRequest, options);
            return routed.selectedAgentId;
        };
    }
}
