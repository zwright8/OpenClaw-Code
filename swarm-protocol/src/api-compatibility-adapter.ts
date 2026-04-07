import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    implement_api_adapter: 'agent:platform',
    launch_adapter_canary: 'agent:ops',
    schedule_legacy_client_migration: 'agent:client'
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

function normalizeChanges(inputPayload) {
    const source = Array.isArray(inputPayload?.apiChanges)
        ? inputPayload.apiChanges
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            apiId: typeof entry.apiId === 'string' && entry.apiId.trim()
                ? entry.apiId.trim()
                : `api-${index + 1}`,
            fromVersion: typeof entry.fromVersion === 'string' && entry.fromVersion.trim()
                ? entry.fromVersion.trim()
                : 'v1',
            toVersion: typeof entry.toVersion === 'string' && entry.toVersion.trim()
                ? entry.toVersion.trim()
                : 'v2',
            trafficShare: clamp(safeNumber(entry.trafficShare, 20)),
            criticality: clamp(safeNumber(entry.criticality, 60)),
            breakingChanges: Array.isArray(entry.breakingChanges)
                ? entry.breakingChanges
                    .filter((change) => change && typeof change === 'object')
                    .map((change, changeIndex) => ({
                        type: typeof change.type === 'string' && change.type.trim()
                            ? change.type.trim()
                            : 'unknown',
                        path: typeof change.path === 'string' && change.path.trim()
                            ? change.path.trim()
                            : `field-${changeIndex + 1}`,
                        severity: clamp(safeNumber(change.severity, 55))
                    }))
                : []
        }));
}

function normalizeExistingAdapters(inputPayload) {
    const source = Array.isArray(inputPayload?.existingAdapters)
        ? inputPayload.existingAdapters
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            adapterId: typeof entry.adapterId === 'string' && entry.adapterId.trim()
                ? entry.adapterId.trim()
                : `adapter-${index + 1}`,
            apiId: typeof entry.apiId === 'string' && entry.apiId.trim()
                ? entry.apiId.trim()
                : null,
            coverage: clamp(safeNumber(entry.coverage, 50)),
            stability: clamp(safeNumber(entry.stability, 68))
        }));
}

function evaluateCompatibility(apiChanges, adapters) {
    return apiChanges.map((change) => {
        const relevantAdapters = adapters.filter((adapter) => adapter.apiId === change.apiId);
        const adapterCoverage = relevantAdapters.length > 0
            ? Math.max(...relevantAdapters.map((adapter) => adapter.coverage))
            : 0;
        const adapterStability = relevantAdapters.length > 0
            ? Math.max(...relevantAdapters.map((adapter) => adapter.stability))
            : 0;

        const breakSeverity = change.breakingChanges.length > 0
            ? change.breakingChanges.reduce((acc, item) => acc + item.severity, 0) / change.breakingChanges.length
            : 0;

        const compatibilityRisk = clamp(Math.round(
            breakSeverity * 0.44
            + (100 - adapterCoverage) * 0.24
            + (100 - adapterStability) * 0.16
            + change.trafficShare * 0.16
        ));

        const readinessScore = clamp(Math.round(
            adapterCoverage * 0.4
            + adapterStability * 0.28
            + (100 - breakSeverity) * 0.2
            + (100 - change.trafficShare) * 0.12
        ));

        return {
            apiId: change.apiId,
            fromVersion: change.fromVersion,
            toVersion: change.toVersion,
            trafficShare: change.trafficShare,
            criticality: change.criticality,
            breakingChangeCount: change.breakingChanges.length,
            breakSeverity: Number(breakSeverity.toFixed(2)),
            adapterCoverage,
            adapterStability,
            compatibilityRisk,
            readinessScore,
            requiresAdapter: adapterCoverage < 75 || breakSeverity >= 55,
            canaryRequired: change.trafficShare >= 25 || change.criticality >= 70
        };
    }).sort((a, b) => b.compatibilityRisk - a.compatibilityRisk);
}

function summarizeCompatibility(rows) {
    const requiresAdapterCount = rows.filter((row) => row.requiresAdapter).length;
    const highRiskCount = rows.filter((row) => row.compatibilityRisk >= 70).length;
    const avgReadinessScore = rows.length > 0
        ? Number((rows.reduce((acc, row) => acc + row.readinessScore, 0) / rows.length).toFixed(2))
        : 0;

    let posture = 'compatible';
    if (requiresAdapterCount > 0 || avgReadinessScore < 68) posture = 'needs_adapters';
    if (highRiskCount > 0 || avgReadinessScore < 52) posture = 'critical';

    return {
        apiCount: rows.length,
        requiresAdapterCount,
        highRiskCount,
        avgReadinessScore,
        posture
    };
}

function buildAlerts(summary, rows) {
    const alerts = [];
    if (summary.requiresAdapterCount > 0) alerts.push('api_adapter_gaps_detected');
    if (summary.highRiskCount > 0) alerts.push('api_compatibility_high_risk');
    if (rows.some((row) => row.breakingChangeCount >= 3)) alerts.push('api_breaking_change_density_high');
    return alerts;
}

function buildRecommendations(rows, summary, alerts) {
    const recommendations = [];

    for (const row of rows) {
        if (row.requiresAdapter) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'implement_api_adapter',
                apiId: row.apiId,
                title: `Implement adapter for ${row.apiId}`,
                description: `Compatibility risk ${row.compatibilityRisk} with readiness ${row.readinessScore}.`,
                priority: row.compatibilityRisk >= 75 ? 'P1' : 'P2'
            });
        }

        if (row.canaryRequired) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'launch_adapter_canary',
                apiId: row.apiId,
                title: `Launch canary for ${row.apiId} adapter`,
                description: 'Canary rollout required due to traffic share/criticality constraints.',
                priority: row.compatibilityRisk >= 70 ? 'P1' : 'P2'
            });
        }

        if (row.compatibilityRisk >= 60 || row.breakingChangeCount >= 2) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'schedule_legacy_client_migration',
                apiId: row.apiId,
                title: `Schedule legacy client migration for ${row.apiId}`,
                description: 'Reduce long-tail compatibility burden from old API contracts.',
                priority: row.compatibilityRisk >= 75 ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length === 0 && rows.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'launch_adapter_canary',
            title: 'Run proactive compatibility canary sweep',
            description: 'Continuously validate backward compatibility before customer impact.',
            priority: 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.apiId || '').localeCompare(String(b.apiId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.apiId || '') === String(entry.apiId || '')
        )) === index);
}

export function buildApiCompatibilityAdapter(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const apiChanges = normalizeChanges(inputPayload || {});
    const existingAdapters = normalizeExistingAdapters(inputPayload || {});
    const compatibilityRows = evaluateCompatibility(apiChanges, existingAdapters);
    const summary = summarizeCompatibility(compatibilityRows);
    const alerts = buildAlerts(summary, compatibilityRows);
    const recommendations = buildRecommendations(compatibilityRows, summary, alerts);

    return {
        at,
        summary,
        compatibilityRows,
        alerts,
        recommendations
    };
}

export function apiCompatibilityToTasks(reportPayload, {
    fromAgentId = 'agent:api-compatibility',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('apiCompatibilityToTasks requires report payload');
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
            apiId: recommendation.apiId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class APICompatibilityAdapter {
    constructor({
        localAgentId = 'agent:api-compatibility',
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
        const report = buildApiCompatibilityAdapter(inputPayload, {
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
        return apiCompatibilityToTasks(reportPayload, {
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

export const __apiCompatibilityAdapterInternals = {
    normalizeChanges,
    normalizeExistingAdapters,
    evaluateCompatibility,
    summarizeCompatibility,
    buildRecommendations
};
