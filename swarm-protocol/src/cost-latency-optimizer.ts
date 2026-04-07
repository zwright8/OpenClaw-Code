import { TaskRequest } from './schemas.js';
import { rankAgentsForTask } from './task-router.js';

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function percentile(values, p) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const rank = Math.ceil((p / 100) * sorted.length) - 1;
    const index = Math.max(0, Math.min(sorted.length - 1, rank));
    return sorted[index];
}

function normalizeMode(mode) {
    if (typeof mode !== 'string') return 'balanced';
    const normalized = mode.trim().toLowerCase();
    if (['cost', 'latency', 'quality', 'balanced'].includes(normalized)) {
        return normalized;
    }
    return 'balanced';
}

function extractObjective(taskRequest) {
    const context = taskRequest.context || {};
    const budgetRaw = context.budgetUsd ?? context.budget?.usd;
    const latencyRaw = context.maxLatencyMs ?? context.latencyBudgetMs;

    const budgetUsd = Number.isFinite(Number(budgetRaw)) ? Number(budgetRaw) : null;
    const maxLatencyMs = Number.isFinite(Number(latencyRaw)) ? Number(latencyRaw) : null;
    const optimizationMode = normalizeMode(context.optimizationMode);

    return {
        budgetUsd,
        maxLatencyMs,
        optimizationMode
    };
}

function summarizeSamples(samples) {
    if (!Array.isArray(samples) || samples.length === 0) {
        return {
            samples: 0,
            successRate: 0,
            avgLatencyMs: 0,
            p95LatencyMs: 0,
            avgCostUsd: 0,
            avgQuality: 0
        };
    }

    let successCount = 0;
    let latencyTotal = 0;
    let costTotal = 0;
    let qualityTotal = 0;
    const latencies = [];

    for (const sample of samples) {
        if (sample.success === true) successCount++;
        const latency = Number.isFinite(sample.latencyMs) ? sample.latencyMs : 0;
        const cost = Number.isFinite(sample.costUsd) ? sample.costUsd : 0;
        const quality = Number.isFinite(sample.quality) ? sample.quality : (sample.success ? 1 : 0);
        latencyTotal += latency;
        costTotal += cost;
        qualityTotal += quality;
        latencies.push(latency);
    }

    return {
        samples: samples.length,
        successRate: Number((successCount / samples.length).toFixed(4)),
        avgLatencyMs: Number((latencyTotal / samples.length).toFixed(2)),
        p95LatencyMs: Number(percentile(latencies, 95).toFixed(2)),
        avgCostUsd: Number((costTotal / samples.length).toFixed(4)),
        avgQuality: Number((qualityTotal / samples.length).toFixed(4))
    };
}

function scoreWithObjectives(base, stats, objective, options = {}) {
    const reasons = [];
    let score = Number(base.score);
    const mode = objective.optimizationMode;

    if (!stats || stats.samples === 0) {
        const unknownPenalty = Number.isFinite(options.unknownPenalty) ? options.unknownPenalty : 2;
        score -= unknownPenalty;
        reasons.push({ type: 'unknown_performance_penalty', delta: -unknownPenalty });
        return {
            score: Number(score.toFixed(4)),
            reasons
        };
    }

    const qualityBoost = (stats.successRate - 0.8) * 35 + (stats.avgQuality - 0.75) * 20;
    score += qualityBoost;
    reasons.push({ type: 'quality_adjustment', delta: Number(qualityBoost.toFixed(4)) });

    const latencyWeight = mode === 'latency' ? 1.35 : mode === 'cost' ? 0.45 : 0.85;
    const costWeight = mode === 'cost' ? 1.35 : mode === 'latency' ? 0.45 : 0.85;

    if (objective.maxLatencyMs !== null) {
        const delta = stats.avgLatencyMs - objective.maxLatencyMs;
        if (delta > 0) {
            const penalty = (delta / Math.max(1, objective.maxLatencyMs)) * 65 * latencyWeight;
            score -= penalty;
            reasons.push({ type: 'latency_over_budget_penalty', delta: Number((-penalty).toFixed(4)) });
        } else {
            const bonus = (Math.abs(delta) / Math.max(1, objective.maxLatencyMs)) * 18 * latencyWeight;
            score += bonus;
            reasons.push({ type: 'latency_under_budget_bonus', delta: Number(bonus.toFixed(4)) });
        }
    } else {
        const baselinePenalty = (stats.avgLatencyMs / 1_000) * 10 * latencyWeight;
        score -= baselinePenalty;
        reasons.push({ type: 'latency_baseline_penalty', delta: Number((-baselinePenalty).toFixed(4)) });
    }

    if (objective.budgetUsd !== null) {
        const delta = stats.avgCostUsd - objective.budgetUsd;
        if (delta > 0) {
            const penalty = (delta / Math.max(1, objective.budgetUsd)) * 55 * costWeight;
            score -= penalty;
            reasons.push({ type: 'cost_over_budget_penalty', delta: Number((-penalty).toFixed(4)) });
        } else {
            const bonus = (Math.abs(delta) / Math.max(1, objective.budgetUsd)) * 14 * costWeight;
            score += bonus;
            reasons.push({ type: 'cost_under_budget_bonus', delta: Number(bonus.toFixed(4)) });
        }
    } else {
        const baselinePenalty = stats.avgCostUsd * 6 * costWeight;
        score -= baselinePenalty;
        reasons.push({ type: 'cost_baseline_penalty', delta: Number((-baselinePenalty).toFixed(4)) });
    }

    return {
        score: Number(score.toFixed(4)),
        reasons
    };
}

export class AgentPerformanceTracker {
    constructor({
        maxSamplesPerAgent = 200
    } = {}) {
        this.maxSamplesPerAgent = Number.isInteger(maxSamplesPerAgent) && maxSamplesPerAgent > 0
            ? maxSamplesPerAgent
            : 200;
        this.samplesByAgent = new Map();
    }

    recordOutcome({
        agentId,
        success,
        latencyMs,
        costUsd = 0,
        quality = null,
        timestamp = Date.now()
    }) {
        if (!agentId || typeof agentId !== 'string') {
            throw new Error('recordOutcome requires a string agentId');
        }

        const bucket = this.samplesByAgent.get(agentId) || [];
        bucket.push({
            success: success === true,
            latencyMs: Number.isFinite(Number(latencyMs)) ? Number(latencyMs) : 0,
            costUsd: Number.isFinite(Number(costUsd)) ? Number(costUsd) : 0,
            quality: Number.isFinite(Number(quality)) ? Number(quality) : null,
            timestamp: Number.isFinite(Number(timestamp)) ? Number(timestamp) : Date.now()
        });

        if (bucket.length > this.maxSamplesPerAgent) {
            bucket.splice(0, bucket.length - this.maxSamplesPerAgent);
        }

        this.samplesByAgent.set(agentId, bucket);
        return this.getAgentStats(agentId);
    }

    ingestTaskRecord(taskRecord, { costUsd = 0, quality = null } = {}) {
        if (!taskRecord || typeof taskRecord !== 'object') return null;
        if (!taskRecord.target || typeof taskRecord.target !== 'string') return null;

        const success = taskRecord.status === 'completed';
        const latencyMs = Number.isFinite(taskRecord.closedAt) && Number.isFinite(taskRecord.createdAt)
            ? Math.max(0, taskRecord.closedAt - taskRecord.createdAt)
            : 0;

        return this.recordOutcome({
            agentId: taskRecord.target,
            success,
            latencyMs,
            costUsd,
            quality,
            timestamp: taskRecord.closedAt ?? taskRecord.updatedAt ?? Date.now()
        });
    }

    getAgentStats(agentId) {
        const samples = this.samplesByAgent.get(agentId) || [];
        return summarizeSamples(samples);
    }

    snapshot() {
        const output = {};
        for (const [agentId, samples] of this.samplesByAgent.entries()) {
            output[agentId] = summarizeSamples(samples);
        }
        return output;
    }
}

export function optimizeAgentSelection(
    taskRequestPayload,
    agents,
    performanceSnapshot = {},
    options = {}
) {
    const taskRequest = TaskRequest.parse(taskRequestPayload);
    const objective = extractObjective(taskRequest);
    const ranked = rankAgentsForTask(taskRequest, agents, options).map((candidate) => {
        const stats = performanceSnapshot[candidate.agentId] || {
            samples: 0
        };

        if (!candidate.eligible) {
            return {
                ...candidate,
                optimization: {
                    score: candidate.score,
                    reasons: [{ type: 'ineligible', reason: candidate.reason }],
                    stats
                }
            };
        }

        const optimized = scoreWithObjectives(candidate, stats, objective, options);

        return {
            ...candidate,
            optimization: {
                score: optimized.score,
                reasons: optimized.reasons,
                stats,
                objective
            }
        };
    }).sort((a, b) => b.optimization.score - a.optimization.score);

    const selected = ranked.find((candidate) => candidate.eligible && candidate.agentId);
    return {
        selectedAgentId: selected?.agentId || null,
        objective,
        ranked
    };
}

export function createOptimizedRouteTaskFn({
    listAgents,
    tracker = null,
    staticSnapshot = null,
    options = {}
} = {}) {
    if (typeof listAgents !== 'function') {
        throw new Error('createOptimizedRouteTaskFn requires listAgents()');
    }

    return async (taskRequest) => {
        const agents = await listAgents(taskRequest);
        const snapshot = tracker && typeof tracker.snapshot === 'function'
            ? tracker.snapshot()
            : (staticSnapshot || {});

        const selection = optimizeAgentSelection(taskRequest, agents, snapshot, options);
        return {
            selectedAgentId: selection.selectedAgentId,
            ranked: selection.ranked,
            objective: selection.objective
        };
    };
}

export const __optimizerInternals = {
    summarizeSamples,
    scoreWithObjectives,
    extractObjective,
    normalizeMode
};
