import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    enact_negotiated_allocation: 'agent:ops',
    trigger_negotiation_arbitration: 'agent:governance',
    defer_low_priority_claims: 'agent:planner'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const PriorityWeight = {
    P0: 1.4,
    P1: 1.18,
    P2: 1,
    P3: 0.82
};

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

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

function normalizeString(value, fallback = '') {
    if (typeof value === 'string' && value.trim()) return value.trim();
    return fallback;
}

function normalizeProposals(inputPayload) {
    const source = Array.isArray(inputPayload?.proposals)
        ? inputPayload.proposals
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            proposalId: normalizeString(entry.proposalId, `proposal-${index + 1}`),
            agentId: normalizeString(entry.agentId, `agent-${index + 1}`),
            resource: normalizeString(entry.resource, 'general'),
            requestedUnits: Math.max(1, Math.floor(safeNumber(entry.requestedUnits, 1))),
            priority: ['P0', 'P1', 'P2', 'P3'].includes(normalizeString(entry.priority).toUpperCase())
                ? normalizeString(entry.priority).toUpperCase()
                : 'P2',
            justificationQuality: clamp(safeNumber(entry.justificationQuality, 60)),
            missionCriticality: clamp(safeNumber(entry.missionCriticality, 58))
        }));
}

function normalizeResourcePool(inputPayload) {
    const source = inputPayload?.availableResources && typeof inputPayload.availableResources === 'object'
        ? inputPayload.availableResources
        : {};

    const resources = [];
    for (const [resource, units] of Object.entries(source)) {
        resources.push({
            resource,
            availableUnits: Math.max(0, Math.floor(safeNumber(units, 0)))
        });
    }

    return resources;
}

function scoreProposal(proposal) {
    return clamp(Math.round(
        proposal.missionCriticality * 0.42
        + proposal.justificationQuality * 0.28
        + PriorityWeight[proposal.priority] * 20
    ));
}

function negotiateResource(resource, proposals, availableUnits) {
    const scored = proposals
        .map((proposal) => ({
            ...proposal,
            negotiationScore: scoreProposal(proposal)
        }))
        .sort((a, b) => b.negotiationScore - a.negotiationScore);

    const allocations = [];
    let remaining = availableUnits;

    for (const proposal of scored) {
        const allocatedUnits = Math.max(0, Math.min(remaining, proposal.requestedUnits));
        remaining -= allocatedUnits;

        allocations.push({
            proposalId: proposal.proposalId,
            agentId: proposal.agentId,
            resource,
            requestedUnits: proposal.requestedUnits,
            allocatedUnits,
            negotiationScore: proposal.negotiationScore,
            priority: proposal.priority,
            contested: allocatedUnits < proposal.requestedUnits
        });
    }

    return {
        resource,
        availableUnits,
        remainingUnits: remaining,
        allocations
    };
}

function runNegotiation(proposals, resources) {
    const byResource = new Map();

    for (const proposal of proposals) {
        const rows = byResource.get(proposal.resource) || [];
        rows.push(proposal);
        byResource.set(proposal.resource, rows);
    }

    const outcomes = [];
    for (const resourceRow of resources) {
        const proposalsForResource = byResource.get(resourceRow.resource) || [];
        outcomes.push(negotiateResource(resourceRow.resource, proposalsForResource, resourceRow.availableUnits));
    }

    const allocations = outcomes.flatMap((row) => row.allocations)
        .sort((a, b) => {
            if (Number(b.contested) !== Number(a.contested)) {
                return Number(b.contested) - Number(a.contested);
            }
            return b.negotiationScore - a.negotiationScore;
        });

    return {
        resourceOutcomes: outcomes,
        allocations
    };
}

function summarizeNegotiation(result) {
    const contestedCount = result.allocations.filter((allocation) => allocation.contested).length;
    const deniedCount = result.allocations.filter((allocation) => allocation.allocatedUnits === 0).length;
    const highPriorityDenied = result.allocations.filter((allocation) => allocation.allocatedUnits === 0 && (allocation.priority === 'P0' || allocation.priority === 'P1')).length;

    let posture = 'settled';
    if (contestedCount > 0 || deniedCount > 0) posture = 'contested';
    if (highPriorityDenied > 0) posture = 'escalated';

    return {
        allocationCount: result.allocations.length,
        contestedCount,
        deniedCount,
        highPriorityDenied,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.contestedCount > 0) alerts.push('resource_contention_detected');
    if (summary.deniedCount > 0) alerts.push('resource_claims_denied');
    if (summary.highPriorityDenied > 0) alerts.push('high_priority_resource_denials');
    return alerts;
}

function buildRecommendations(result, summary) {
    const recommendations = [];

    for (const outcome of result.resourceOutcomes) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'enact_negotiated_allocation',
            resource: outcome.resource,
            title: `Enact negotiated allocation for ${outcome.resource}`,
            description: `${outcome.allocations.length} claims negotiated with ${outcome.remainingUnits} units remaining.`,
            priority: outcome.allocations.some((entry) => entry.priority === 'P0' || entry.priority === 'P1') ? 'P1' : 'P2'
        });

        const deniedLowPriority = outcome.allocations.filter((entry) => entry.contested && (entry.priority === 'P2' || entry.priority === 'P3'));
        if (deniedLowPriority.length > 0) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'defer_low_priority_claims',
                resource: outcome.resource,
                title: `Defer low-priority claims on ${outcome.resource}`,
                description: `${deniedLowPriority.length} low-priority claims should be deferred or rescheduled.`,
                priority: 'P2'
            });
        }
    }

    if (summary.posture === 'escalated') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'trigger_negotiation_arbitration',
            title: 'Trigger arbitration for unresolved high-priority conflicts',
            description: 'High-priority denials require governance arbitration.',
            priority: 'P1'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.resource || '').localeCompare(String(b.resource || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.resource || '') === String(entry.resource || '')
        )) === index);
}

export function runMultiAgentNegotiation(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const proposals = normalizeProposals(inputPayload || {});
    const resources = normalizeResourcePool(inputPayload || {});
    const result = runNegotiation(proposals, resources);
    const summary = summarizeNegotiation(result);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(result, summary);

    return {
        at,
        summary,
        resourceOutcomes: result.resourceOutcomes,
        allocations: result.allocations,
        alerts,
        recommendations
    };
}

export function negotiationToTasks(reportPayload, {
    fromAgentId = 'agent:negotiation-protocol',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('negotiationToTasks requires report payload');
    }

    const recommendations = Array.isArray(reportPayload.recommendations)
        ? reportPayload.recommendations
        : [];
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };
    const nowMs = safeNow(Date.now);

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityTaskMap[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            recommendationType: recommendation.type,
            resource: recommendation.resource || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class MultiAgentNegotiationProtocol {
    constructor({
        localAgentId = 'agent:negotiation-protocol',
        now = Date.now,
        maxHistory = 120
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 120;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = runMultiAgentNegotiation(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(report);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(report);
    }

    buildTasks(reportPayload, options = {}) {
        return negotiationToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 20 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 20))
            .map((entry) => clone(entry));
    }
}

export const __multiAgentNegotiationProtocolInternals = {
    normalizeProposals,
    normalizeResourcePool,
    negotiateResource,
    summarizeNegotiation,
    buildRecommendations
};
