import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    promote_memory_cluster: 'agent:memory',
    resolve_memory_conflict: 'agent:review',
    archive_low_signal_memories: 'agent:ops'
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

function normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim().toLowerCase())
    )];
}

function normalizeEpisodes(inputPayload) {
    const source = Array.isArray(inputPayload?.episodicMemories)
        ? inputPayload.episodicMemories
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            memoryId: typeof entry.memoryId === 'string' && entry.memoryId.trim()
                ? entry.memoryId.trim()
                : `episode-${index + 1}`,
            topic: typeof entry.topic === 'string' && entry.topic.trim()
                ? entry.topic.trim().toLowerCase()
                : 'general',
            tags: normalizeStringArray(entry.tags),
            confidence: clamp(safeNumber(entry.confidence, 58)),
            novelty: clamp(safeNumber(entry.novelty, 52)),
            retentionValue: clamp(safeNumber(entry.retentionValue, 60)),
            contradictionRisk: clamp(safeNumber(entry.contradictionRisk, 20)),
            facts: Array.isArray(entry.facts)
                ? entry.facts
                    .filter((fact) => typeof fact === 'string' && fact.trim())
                    .map((fact) => fact.trim())
                : []
        }));
}

function normalizeDurableKnowledge(inputPayload) {
    const source = Array.isArray(inputPayload?.durableKnowledge)
        ? inputPayload.durableKnowledge
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            knowledgeId: typeof entry.knowledgeId === 'string' && entry.knowledgeId.trim()
                ? entry.knowledgeId.trim()
                : `knowledge-${index + 1}`,
            topic: typeof entry.topic === 'string' && entry.topic.trim()
                ? entry.topic.trim().toLowerCase()
                : 'general',
            supportCount: Math.max(0, Math.floor(safeNumber(entry.supportCount, 1))),
            confidence: clamp(safeNumber(entry.confidence, 64))
        }));
}

function clusterEpisodes(episodes) {
    const clusters = new Map();

    for (const episode of episodes) {
        const key = episode.topic || 'general';
        const cluster = clusters.get(key) || {
            topic: key,
            episodeIds: [],
            supportCount: 0,
            confidenceSum: 0,
            noveltySum: 0,
            retentionValueSum: 0,
            contradictionRiskSum: 0,
            facts: new Set(),
            tags: new Set()
        };

        cluster.episodeIds.push(episode.memoryId);
        cluster.supportCount += 1;
        cluster.confidenceSum += episode.confidence;
        cluster.noveltySum += episode.novelty;
        cluster.retentionValueSum += episode.retentionValue;
        cluster.contradictionRiskSum += episode.contradictionRisk;

        for (const fact of episode.facts) cluster.facts.add(fact);
        for (const tag of episode.tags) cluster.tags.add(tag);

        clusters.set(key, cluster);
    }

    return Array.from(clusters.values()).map((cluster) => {
        const confidence = cluster.supportCount > 0
            ? cluster.confidenceSum / cluster.supportCount
            : 0;
        const novelty = cluster.supportCount > 0
            ? cluster.noveltySum / cluster.supportCount
            : 0;
        const retentionValue = cluster.supportCount > 0
            ? cluster.retentionValueSum / cluster.supportCount
            : 0;
        const contradictionRisk = cluster.supportCount > 0
            ? cluster.contradictionRiskSum / cluster.supportCount
            : 0;

        const durabilityScore = clamp(Math.round(
            confidence * 0.36
            + retentionValue * 0.28
            + Math.min(20, cluster.supportCount * 5)
            + (100 - contradictionRisk) * 0.16
            + (100 - novelty) * 0.2
        ));

        return {
            topic: cluster.topic,
            episodeIds: cluster.episodeIds,
            supportCount: cluster.supportCount,
            confidence: Number(confidence.toFixed(2)),
            novelty: Number(novelty.toFixed(2)),
            retentionValue: Number(retentionValue.toFixed(2)),
            contradictionRisk: Number(contradictionRisk.toFixed(2)),
            durabilityScore,
            facts: Array.from(cluster.facts),
            tags: Array.from(cluster.tags),
            unstable: durabilityScore < 55 || contradictionRisk >= 45
        };
    }).sort((a, b) => b.durabilityScore - a.durabilityScore);
}

function compareWithDurableKnowledge(clusters, durableKnowledge) {
    const byTopic = new Map(durableKnowledge.map((entry) => [entry.topic, entry]));

    return clusters.map((cluster) => {
        const existing = byTopic.get(cluster.topic);
        const existingConfidence = existing ? existing.confidence : 0;
        const delta = Number((cluster.confidence - existingConfidence).toFixed(2));

        return {
            ...cluster,
            existingKnowledgeId: existing?.knowledgeId || null,
            existingSupportCount: existing?.supportCount || 0,
            confidenceDelta: delta,
            conflictFlag: cluster.contradictionRisk >= 50 && existing && existing.confidence >= 60
        };
    });
}

function summarizeConsolidation(clusters) {
    const unstableCount = clusters.filter((cluster) => cluster.unstable).length;
    const conflictCount = clusters.filter((cluster) => cluster.conflictFlag).length;
    const avgDurabilityScore = clusters.length > 0
        ? Number((clusters.reduce((acc, cluster) => acc + cluster.durabilityScore, 0) / clusters.length).toFixed(2))
        : 0;

    let posture = 'durable';
    if (unstableCount > 0 || avgDurabilityScore < 66) posture = 'review_required';
    if (conflictCount > 0 || avgDurabilityScore < 52) posture = 'conflicted';

    return {
        clusterCount: clusters.length,
        unstableCount,
        conflictCount,
        avgDurabilityScore,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.unstableCount > 0) alerts.push('memory_clusters_unstable');
    if (summary.conflictCount > 0) alerts.push('memory_cluster_conflicts_detected');
    if (summary.avgDurabilityScore < 60) alerts.push('memory_durability_low');
    return alerts;
}

function buildRecommendations(clusters, summary, alerts) {
    const recommendations = [];

    for (const cluster of clusters.slice(0, 8)) {
        if (!cluster.unstable && cluster.durabilityScore >= 60) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'promote_memory_cluster',
                topic: cluster.topic,
                title: `Promote memory cluster for ${cluster.topic}`,
                description: `Durability score ${cluster.durabilityScore} with support count ${cluster.supportCount}.`,
                priority: cluster.durabilityScore >= 80 ? 'P1' : 'P2'
            });
        }

        if (cluster.conflictFlag || cluster.contradictionRisk >= 45) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'resolve_memory_conflict',
                topic: cluster.topic,
                title: `Resolve memory conflict for ${cluster.topic}`,
                description: `Contradiction risk ${cluster.contradictionRisk} requires conflict adjudication.`,
                priority: cluster.conflictFlag ? 'P1' : 'P2'
            });
        }

        if (cluster.novelty >= 72 && cluster.retentionValue < 45) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'archive_low_signal_memories',
                topic: cluster.topic,
                title: `Archive low-signal episodic memories for ${cluster.topic}`,
                description: 'High novelty with weak retention value is inflating memory noise.',
                priority: 'P2'
            });
        }
    }

    if (alerts.length > 0 && !recommendations.some((entry) => entry.type === 'archive_low_signal_memories')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'archive_low_signal_memories',
            title: 'Archive low-signal episodic memory backlog',
            description: 'Reduce noisy episodes before promoting consolidated memory clusters.',
            priority: summary.posture === 'conflicted' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.topic || '').localeCompare(String(b.topic || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.topic || '') === String(entry.topic || '')
        )) === index);
}

export function consolidateLongTermMemory(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const episodes = normalizeEpisodes(inputPayload || {});
    const durableKnowledge = normalizeDurableKnowledge(inputPayload || {});
    const clusters = compareWithDurableKnowledge(clusterEpisodes(episodes), durableKnowledge);
    const summary = summarizeConsolidation(clusters);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(clusters, summary, alerts);

    return {
        at,
        summary,
        memoryClusters: clusters,
        alerts,
        recommendations
    };
}

export function memoryConsolidationToTasks(reportPayload, {
    fromAgentId = 'agent:memory-consolidator',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('memoryConsolidationToTasks requires report payload');
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
            topic: recommendation.topic || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class LongTermMemoryConsolidator {
    constructor({
        localAgentId = 'agent:memory-consolidator',
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
        const report = consolidateLongTermMemory(inputPayload, {
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
        return memoryConsolidationToTasks(reportPayload, {
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

export const __longTermMemoryConsolidatorInternals = {
    normalizeEpisodes,
    clusterEpisodes,
    compareWithDurableKnowledge,
    summarizeConsolidation,
    buildRecommendations
};
