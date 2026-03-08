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

export class AgentRegistry {
    constructor({
        now = Date.now,
        maxStalenessMs = 60_000
    } = {}) {
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxStalenessMs = Number.isFinite(maxStalenessMs) && maxStalenessMs > 0
            ? Number(maxStalenessMs)
            : 60_000;
        this.agents = new Map();
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
        return record ? clone(record) : null;
    }

    listAgents() {
        return [...this.agents.values()].map((record) => clone(record));
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

    routeTask(taskRequest, options = {}) {
        const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : safeNow(this.now);
        const maxStalenessMs = Number.isFinite(options.maxStalenessMs)
            ? Number(options.maxStalenessMs)
            : this.maxStalenessMs;

        return routeTaskRequest(taskRequest, this.listAgents(), {
            nowMs,
            maxStalenessMs
        });
    }

    createRouteTaskFn(options = {}) {
        return async (taskRequest) => {
            const routed = this.routeTask(taskRequest, options);
            return routed.selectedAgentId;
        };
    }
}
