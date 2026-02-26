import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    diversify_supply_node: 'agent:supply-chain',
    increase_buffer_stock: 'agent:logistics',
    run_supply_contingency_drill: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
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

function normalizeNodes(inputPayload) {
    const source = Array.isArray(inputPayload?.nodes)
        ? inputPayload.nodes
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            nodeId: typeof entry.nodeId === 'string' && entry.nodeId.trim()
                ? entry.nodeId.trim()
                : `node-${index + 1}`,
            tier: Math.max(1, Math.floor(safeNumber(entry.tier, 1))),
            leadTimeDays: Math.max(0, Math.floor(safeNumber(entry.leadTimeDays, 10))),
            singleSource: Boolean(entry.singleSource),
            disruptionRisk: clamp(safeNumber(entry.disruptionRisk, 42)),
            capacityScore: clamp(safeNumber(entry.capacityScore, 64)),
            substitutionScore: clamp(safeNumber(entry.substitutionScore, 48)),
            inventoryBufferDays: Math.max(0, Math.floor(safeNumber(entry.inventoryBufferDays, 14)))
        }));
}

function evaluateNodes(nodes) {
    return nodes.map((node) => {
        const fragilityScore = clamp(Math.round(
            node.disruptionRisk * 0.34
            + (node.singleSource ? 24 : 0)
            + clamp(node.leadTimeDays * 1.5) * 0.16
            + (100 - node.capacityScore) * 0.24
            + (100 - node.substitutionScore) * 0.18
            + clamp((21 - node.inventoryBufferDays) * 2.2, 0, 22) * 0.08
        ));

        const resilienceScore = clamp(Math.round(
            (100 - fragilityScore) * 0.7
            + node.capacityScore * 0.16
            + node.substitutionScore * 0.14
        ));

        return {
            nodeId: node.nodeId,
            tier: node.tier,
            leadTimeDays: node.leadTimeDays,
            singleSource: node.singleSource,
            disruptionRisk: node.disruptionRisk,
            capacityScore: node.capacityScore,
            substitutionScore: node.substitutionScore,
            inventoryBufferDays: node.inventoryBufferDays,
            fragilityScore,
            resilienceScore,
            criticalFragility: fragilityScore >= 72
        };
    }).sort((a, b) => b.fragilityScore - a.fragilityScore);
}

function summarizeNetwork(rows) {
    const criticalFragilityCount = rows.filter((row) => row.criticalFragility).length;
    const singleSourceCount = rows.filter((row) => row.singleSource).length;
    const avgResilienceScore = rows.length > 0
        ? Number((rows.reduce((acc, row) => acc + row.resilienceScore, 0) / rows.length).toFixed(2))
        : 0;

    let posture = 'resilient';
    if (criticalFragilityCount > 0 || avgResilienceScore < 68) posture = 'watch';
    if (criticalFragilityCount > 0 && singleSourceCount > 0) posture = 'fragile';

    return {
        nodeCount: rows.length,
        criticalFragilityCount,
        singleSourceCount,
        avgResilienceScore,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.criticalFragilityCount > 0) alerts.push('supply_chain_fragility_critical');
    if (summary.singleSourceCount > 0) alerts.push('single_source_dependencies_present');
    if (summary.avgResilienceScore < 60) alerts.push('network_resilience_low');
    return alerts;
}

function buildRecommendations(rows, summary) {
    const recommendations = [];

    for (const row of rows) {
        if (row.singleSource || row.substitutionScore < 45) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'diversify_supply_node',
                nodeId: row.nodeId,
                title: `Diversify sourcing for ${row.nodeId}`,
                description: `Single-source or weak substitution detected with fragility score ${row.fragilityScore}.`,
                priority: row.criticalFragility ? 'P1' : 'P2'
            });
        }

        if (row.inventoryBufferDays < 14 || row.leadTimeDays > 18) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'increase_buffer_stock',
                nodeId: row.nodeId,
                title: `Increase buffer stock for ${row.nodeId}`,
                description: `Buffer ${row.inventoryBufferDays} days is insufficient for lead time ${row.leadTimeDays}.`,
                priority: row.criticalFragility ? 'P1' : 'P2'
            });
        }
    }

    if (summary.posture !== 'resilient') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'run_supply_contingency_drill',
            title: 'Run supply chain contingency drill',
            description: 'Validate failover readiness for high-fragility supply nodes.',
            priority: summary.posture === 'fragile' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.nodeId || '').localeCompare(String(b.nodeId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.nodeId || '') === String(entry.nodeId || '')
        )) === index);
}

export function planSupplyChainResilience(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const nodes = normalizeNodes(inputPayload || {});
    const nodeAssessments = evaluateNodes(nodes);
    const summary = summarizeNetwork(nodeAssessments);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(nodeAssessments, summary);

    return {
        at,
        summary,
        nodeAssessments,
        alerts,
        recommendations
    };
}

export function supplyChainResilienceToTasks(reportPayload, {
    fromAgentId = 'agent:supply-resilience',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('supplyChainResilienceToTasks requires report payload');
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
            nodeId: recommendation.nodeId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class SupplyChainResiliencePlanner {
    constructor({
        localAgentId = 'agent:supply-resilience',
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
        const report = planSupplyChainResilience(inputPayload, {
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
        return supplyChainResilienceToTasks(reportPayload, {
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

export const __supplyChainResiliencePlannerInternals = {
    normalizeNodes,
    evaluateNodes,
    summarizeNetwork,
    buildRecommendations
};
