import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    apply_tool_autopatch: 'agent:ops',
    quarantine_flaky_tool: 'agent:reliability',
    add_tool_regression_test: 'agent:quality'
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

function normalizeToolRuns(inputPayload) {
    const source = Array.isArray(inputPayload?.toolRuns)
        ? inputPayload.toolRuns
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            runId: typeof entry.runId === 'string' && entry.runId.trim()
                ? entry.runId.trim()
                : `run-${index + 1}`,
            tool: typeof entry.tool === 'string' && entry.tool.trim()
                ? entry.tool.trim()
                : 'tool:unknown',
            success: Boolean(entry.success),
            latencyMs: Math.max(0, Math.floor(safeNumber(entry.latencyMs, 0))),
            errorCode: typeof entry.errorCode === 'string' && entry.errorCode.trim()
                ? entry.errorCode.trim()
                : null,
            severity: clamp(safeNumber(entry.severity, 50))
        }));
}

function normalizePatchLibrary(inputPayload) {
    const source = Array.isArray(inputPayload?.patchLibrary)
        ? inputPayload.patchLibrary
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            patchId: typeof entry.patchId === 'string' && entry.patchId.trim()
                ? entry.patchId.trim()
                : `patch-${index + 1}`,
            tool: typeof entry.tool === 'string' && entry.tool.trim()
                ? entry.tool.trim()
                : null,
            errorCode: typeof entry.errorCode === 'string' && entry.errorCode.trim()
                ? entry.errorCode.trim()
                : null,
            estimatedFixRate: clamp(safeNumber(entry.estimatedFixRate, 60)),
            risk: clamp(safeNumber(entry.risk, 35))
        }));
}

function groupByTool(toolRuns) {
    const grouped = new Map();

    for (const run of toolRuns) {
        const existing = grouped.get(run.tool) || {
            tool: run.tool,
            runCount: 0,
            failureCount: 0,
            latencyTotalMs: 0,
            errorCodes: new Map(),
            severityTotal: 0
        };

        existing.runCount += 1;
        existing.latencyTotalMs += run.latencyMs;
        existing.severityTotal += run.severity;
        if (!run.success) {
            existing.failureCount += 1;
            const code = run.errorCode || 'unknown_error';
            existing.errorCodes.set(code, (existing.errorCodes.get(code) || 0) + 1);
        }

        grouped.set(run.tool, existing);
    }

    return Array.from(grouped.values());
}

function choosePatch(toolRow, patchLibrary) {
    const ranked = patchLibrary
        .map((patch) => {
            const toolMatch = patch.tool === null || patch.tool === toolRow.tool;
            const topError = toolRow.errorCodes.length > 0 ? toolRow.errorCodes[0].code : null;
            const errorMatch = patch.errorCode === null || patch.errorCode === topError;
            if (!toolMatch || !errorMatch) return null;

            const fitScore = clamp(Math.round(
                patch.estimatedFixRate * 0.62
                + (100 - patch.risk) * 0.38
            ));

            return {
                patchId: patch.patchId,
                fitScore,
                estimatedFixRate: patch.estimatedFixRate,
                risk: patch.risk
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.fitScore - a.fitScore);

    return ranked[0] || null;
}

function buildReliabilityReport(toolRuns, patchLibrary) {
    const grouped = groupByTool(toolRuns).map((row) => {
        const failureRate = row.runCount > 0 ? row.failureCount / row.runCount : 0;
        const avgLatencyMs = row.runCount > 0 ? row.latencyTotalMs / row.runCount : 0;
        const avgSeverity = row.runCount > 0 ? row.severityTotal / row.runCount : 0;
        const topErrors = Array.from(row.errorCodes.entries())
            .map(([code, count]) => ({ code, count }))
            .sort((a, b) => b.count - a.count);

        const reliabilityScore = clamp(Math.round(
            (100 - failureRate * 100) * 0.64
            + (100 - Math.min(100, avgLatencyMs / 20)) * 0.16
            + (100 - avgSeverity) * 0.2
        ));

        const patch = choosePatch({ ...row, errorCodes: topErrors }, patchLibrary);

        return {
            tool: row.tool,
            runCount: row.runCount,
            failureCount: row.failureCount,
            failureRate: Number(failureRate.toFixed(4)),
            avgLatencyMs: Number(avgLatencyMs.toFixed(2)),
            avgSeverity: Number(avgSeverity.toFixed(2)),
            topErrors,
            reliabilityScore,
            patch,
            flaky: row.runCount >= 3 && (failureRate >= 0.25 || reliabilityScore < 70)
        };
    }).sort((a, b) => a.reliabilityScore - b.reliabilityScore);

    return grouped;
}

function summarizeReliability(rows) {
    const flakyCount = rows.filter((row) => row.flaky).length;
    const unpatchableCount = rows.filter((row) => row.flaky && !row.patch).length;
    const avgReliabilityScore = rows.length > 0
        ? Number((rows.reduce((acc, row) => acc + row.reliabilityScore, 0) / rows.length).toFixed(2))
        : 0;

    let posture = 'stable';
    if (flakyCount > 0 || avgReliabilityScore < 72) posture = 'degraded';
    if (unpatchableCount > 0 || avgReliabilityScore < 55) posture = 'critical';

    return {
        toolCount: rows.length,
        flakyCount,
        unpatchableCount,
        avgReliabilityScore,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.flakyCount > 0) alerts.push('flaky_tools_detected');
    if (summary.unpatchableCount > 0) alerts.push('flaky_tools_without_patches');
    if (summary.avgReliabilityScore < 60) alerts.push('tool_reliability_low');
    return alerts;
}

function buildRecommendations(rows, summary, alerts) {
    const recommendations = [];

    for (const row of rows) {
        if (!row.flaky) continue;

        if (row.patch) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'apply_tool_autopatch',
                tool: row.tool,
                patchId: row.patch.patchId,
                title: `Apply autopatch ${row.patch.patchId} to ${row.tool}`,
                description: `Reliability score ${row.reliabilityScore} with failure rate ${row.failureRate}.`,
                priority: row.reliabilityScore < 55 ? 'P1' : 'P2'
            });
        }

        if (!row.patch || row.failureRate >= 0.45) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'quarantine_flaky_tool',
                tool: row.tool,
                title: `Quarantine flaky tool ${row.tool}`,
                description: 'Tool remains unreliable or lacks a viable patch candidate.',
                priority: row.failureRate >= 0.45 ? 'P0' : 'P1'
            });
        }

        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'add_tool_regression_test',
            tool: row.tool,
            title: `Add regression tests for ${row.tool}`,
            description: 'Persist discovered failure signature as a repeatable reliability test.',
            priority: row.failureRate >= 0.35 ? 'P1' : 'P2'
        });
    }

    if (alerts.length === 0 && rows.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'add_tool_regression_test',
            title: 'Expand reliability regression coverage',
            description: 'Add preventative tests while tool reliability posture remains stable.',
            priority: 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.tool || '').localeCompare(String(b.tool || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.tool || '') === String(entry.tool || '')
            && String(other.patchId || '') === String(entry.patchId || '')
        )) === index);
}

export function runToolReliabilityAutopatcher(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const toolRuns = normalizeToolRuns(inputPayload || {});
    const patchLibrary = normalizePatchLibrary(inputPayload || {});
    const toolReports = buildReliabilityReport(toolRuns, patchLibrary);
    const summary = summarizeReliability(toolReports);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(toolReports, summary, alerts);

    return {
        at,
        summary,
        toolReports,
        alerts,
        recommendations
    };
}

export function autopatcherToTasks(reportPayload, {
    fromAgentId = 'agent:autopatcher',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('autopatcherToTasks requires report payload');
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
            tool: recommendation.tool || null,
            patchId: recommendation.patchId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class ToolReliabilityAutopatcher {
    constructor({
        localAgentId = 'agent:autopatcher',
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
        const report = runToolReliabilityAutopatcher(inputPayload, {
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
        return autopatcherToTasks(reportPayload, {
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

export const __toolReliabilityAutopatcherInternals = {
    normalizeToolRuns,
    normalizePatchLibrary,
    buildReliabilityReport,
    summarizeReliability,
    buildRecommendations
};
