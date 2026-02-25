import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    trigger_data_backfill: 'agent:data-eng',
    launch_drift_investigation: 'agent:ml-ops',
    enforce_schema_guardrails: 'agent:platform',
    publish_data_quality_brief: 'agent:ops'
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

function normalizeDatasets(inputPayload) {
    const datasets = Array.isArray(inputPayload?.datasets)
        ? inputPayload.datasets
        : [];

    return datasets
        .filter((dataset) => dataset && typeof dataset === 'object')
        .map((dataset, index) => ({
            datasetId: typeof dataset.datasetId === 'string' && dataset.datasetId.trim()
                ? dataset.datasetId.trim()
                : `dataset-${index + 1}`,
            name: typeof dataset.name === 'string' && dataset.name.trim()
                ? dataset.name.trim()
                : `Dataset ${index + 1}`,
            freshnessHours: Math.max(0, Math.floor(safeNumber(dataset.freshnessHours, 6))),
            completeness: clamp(safeNumber(dataset.completeness, 78)),
            validity: clamp(safeNumber(dataset.validity, 80)),
            driftRisk: clamp(safeNumber(dataset.driftRisk, 34)),
            schemaStability: clamp(safeNumber(dataset.schemaStability, 74)),
            labelQuality: clamp(safeNumber(dataset.labelQuality, 76)),
            anomalyRate: clamp(safeNumber(dataset.anomalyRate, 18))
        }));
}

function qualityScore(dataset) {
    const freshnessScore = clamp(100 - dataset.freshnessHours * 2.8);
    return clamp(Math.round(
        freshnessScore * 0.16
        + dataset.completeness * 0.2
        + dataset.validity * 0.2
        + (100 - dataset.driftRisk) * 0.16
        + dataset.schemaStability * 0.12
        + dataset.labelQuality * 0.1
        + (100 - dataset.anomalyRate) * 0.06
    ));
}

function qualityTier(score) {
    if (score >= 82) return 'healthy';
    if (score >= 65) return 'watch';
    return 'degraded';
}

function evaluateDatasets(datasets) {
    return datasets
        .map((dataset) => {
            const score = qualityScore(dataset);
            const riskPressure = clamp(Math.round(
                (100 - score) * 0.7
                + dataset.driftRisk * 0.2
                + (dataset.freshnessHours > 24 ? 12 : 0)
            ));

            return {
                datasetId: dataset.datasetId,
                datasetName: dataset.name,
                qualityScore: score,
                qualityTier: qualityTier(score),
                freshnessHours: dataset.freshnessHours,
                completeness: dataset.completeness,
                validity: dataset.validity,
                driftRisk: dataset.driftRisk,
                schemaStability: dataset.schemaStability,
                labelQuality: dataset.labelQuality,
                anomalyRate: dataset.anomalyRate,
                riskPressure
            };
        })
        .sort((a, b) => {
            const tierRank = { degraded: 0, watch: 1, healthy: 2 };
            const tierDiff = tierRank[a.qualityTier] - tierRank[b.qualityTier];
            if (tierDiff !== 0) return tierDiff;
            return a.qualityScore - b.qualityScore;
        });
}

function summarizeEvaluations(evaluations) {
    const avgQualityScore = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.qualityScore, 0) / evaluations.length).toFixed(2))
        : 0;
    const avgRiskPressure = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.riskPressure, 0) / evaluations.length).toFixed(2))
        : 0;

    const tierCounts = evaluations.reduce((acc, entry) => {
        acc[entry.qualityTier] = (acc[entry.qualityTier] || 0) + 1;
        return acc;
    }, { healthy: 0, watch: 0, degraded: 0 });

    let posture = 'healthy';
    if (tierCounts.degraded > 0 || avgQualityScore < 60 || avgRiskPressure > 62) posture = 'critical';
    else if (tierCounts.watch > 0 || avgQualityScore < 74 || avgRiskPressure > 45) posture = 'review_required';

    return {
        datasetCount: evaluations.length,
        tierCounts,
        avgQualityScore,
        avgRiskPressure,
        posture
    };
}

function buildAlerts(summary, evaluations) {
    const alerts = [];
    if (summary.tierCounts.degraded > 0) alerts.push('data_quality_degraded_present');
    if (evaluations.some((entry) => entry.freshnessHours > 24 || entry.completeness < 65)) alerts.push('data_backfill_required');
    if (evaluations.some((entry) => entry.driftRisk > 55)) alerts.push('data_drift_risk_high');
    if (evaluations.some((entry) => entry.schemaStability < 60)) alerts.push('data_schema_stability_low');
    return alerts;
}

function buildRecommendations(evaluations, summary, alerts) {
    const recommendations = [];
    for (const entry of evaluations) {
        if (entry.freshnessHours > 24 || entry.completeness < 70 || entry.validity < 70) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'trigger_data_backfill',
                datasetId: entry.datasetId,
                title: `Trigger data backfill for ${entry.datasetName}`,
                description: `Freshness ${entry.freshnessHours}h with completeness ${entry.completeness}.`,
                priority: entry.qualityTier === 'degraded' ? 'P0' : 'P1'
            });
        }
        if (entry.driftRisk > 50 || entry.anomalyRate > 35) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'launch_drift_investigation',
                datasetId: entry.datasetId,
                title: `Launch drift investigation for ${entry.datasetName}`,
                description: `Drift risk ${entry.driftRisk} and anomaly rate ${entry.anomalyRate}.`,
                priority: entry.driftRisk > 65 ? 'P1' : 'P2'
            });
        }
        if (entry.schemaStability < 65 || entry.qualityTier === 'degraded') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'enforce_schema_guardrails',
                datasetId: entry.datasetId,
                title: `Enforce schema guardrails for ${entry.datasetName}`,
                description: `Schema stability ${entry.schemaStability} requires stronger validation gates.`,
                priority: entry.qualityTier === 'degraded' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_data_quality_brief',
            title: 'Publish data quality sentinel brief',
            description: 'Publish dataset posture, drift pressure, and corrective action ownership.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.datasetId || '').localeCompare(String(b.datasetId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.datasetId || '') === String(entry.datasetId || '')
        )) === index);
}

export function runDataQualitySentinel(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const datasets = normalizeDatasets(inputPayload || {});
    const evaluations = evaluateDatasets(datasets);
    const summary = summarizeEvaluations(evaluations);
    const alerts = buildAlerts(summary, evaluations);
    const recommendations = buildRecommendations(evaluations, summary, alerts);

    return {
        at,
        summary,
        evaluations,
        alerts,
        recommendations
    };
}

export function dataQualityToTasks(reportPayload, {
    fromAgentId = 'agent:data-quality',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('dataQualityToTasks requires report payload');
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
            datasetId: recommendation.datasetId || null,
            posture: reportPayload.summary?.posture || null,
            degradedCount: reportPayload.summary?.tierCounts?.degraded || 0
        },
        createdAt: nowMs + index
    }));
}

export class DataQualitySentinel {
    constructor({
        localAgentId = 'agent:data-quality',
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
        const report = runDataQualitySentinel(inputPayload, {
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
        return dataQualityToTasks(reportPayload, {
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

export const __dataQualitySentinelInternals = {
    normalizeDatasets,
    evaluateDatasets,
    summarizeEvaluations,
    buildRecommendations
};
