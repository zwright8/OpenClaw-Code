import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    run_replication_suite: 'agent:research',
    lock_experiment_protocol: 'agent:platform',
    investigate_reproducibility_failure: 'agent:science-review',
    publish_reproducibility_report: 'agent:ops'
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

function normalizeExperiments(inputPayload) {
    const experiments = Array.isArray(inputPayload?.experiments)
        ? inputPayload.experiments
        : [];

    return experiments
        .filter((experiment) => experiment && typeof experiment === 'object')
        .map((experiment, index) => ({
            experimentId: typeof experiment.experimentId === 'string' && experiment.experimentId.trim()
                ? experiment.experimentId.trim()
                : `experiment-${index + 1}`,
            name: typeof experiment.name === 'string' && experiment.name.trim()
                ? experiment.name.trim()
                : `Experiment ${index + 1}`,
            replicationRuns: Math.max(1, Math.floor(safeNumber(experiment.replicationRuns, 3))),
            successfulReplications: Math.max(0, Math.floor(safeNumber(experiment.successfulReplications, 2))),
            envParity: clamp(safeNumber(experiment.envParity, 72)),
            dataVersionLocked: clamp(safeNumber(experiment.dataVersionLocked, 70)),
            seedControl: clamp(safeNumber(experiment.seedControl, 66)),
            protocolCompleteness: clamp(safeNumber(experiment.protocolCompleteness, 68)),
            effectStability: clamp(safeNumber(experiment.effectStability, 64))
        }));
}

function reproducibilityScore(experiment) {
    const replicationRate = clamp((experiment.successfulReplications / Math.max(experiment.replicationRuns, 1)) * 100);
    return clamp(Math.round(
        replicationRate * 0.4
        + experiment.envParity * 0.14
        + experiment.dataVersionLocked * 0.14
        + experiment.seedControl * 0.14
        + experiment.protocolCompleteness * 0.1
        + experiment.effectStability * 0.08
    ));
}

function reproducibilityTier(score) {
    if (score >= 82) return 'reproducible';
    if (score >= 64) return 'fragile';
    return 'non_reproducible';
}

function evaluateExperiments(experiments) {
    return experiments
        .map((experiment) => {
            const score = reproducibilityScore(experiment);
            const replicationRate = clamp((experiment.successfulReplications / Math.max(experiment.replicationRuns, 1)) * 100);
            const riskPressure = clamp(Math.round(
                (100 - score) * 0.72
                + (replicationRate < 50 ? 14 : 0)
                + (experiment.seedControl < 60 ? 8 : 0)
            ));

            return {
                experimentId: experiment.experimentId,
                experimentName: experiment.name,
                replicationRuns: experiment.replicationRuns,
                successfulReplications: experiment.successfulReplications,
                replicationRate,
                reproducibilityScore: score,
                reproducibilityTier: reproducibilityTier(score),
                envParity: experiment.envParity,
                dataVersionLocked: experiment.dataVersionLocked,
                seedControl: experiment.seedControl,
                protocolCompleteness: experiment.protocolCompleteness,
                effectStability: experiment.effectStability,
                riskPressure
            };
        })
        .sort((a, b) => {
            const tierRank = { non_reproducible: 0, fragile: 1, reproducible: 2 };
            const tierDiff = tierRank[a.reproducibilityTier] - tierRank[b.reproducibilityTier];
            if (tierDiff !== 0) return tierDiff;
            return a.reproducibilityScore - b.reproducibilityScore;
        });
}

function summarizeEvaluations(evaluations) {
    const avgReproducibilityScore = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.reproducibilityScore, 0) / evaluations.length).toFixed(2))
        : 0;
    const avgRiskPressure = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.riskPressure, 0) / evaluations.length).toFixed(2))
        : 0;

    const tierCounts = evaluations.reduce((acc, entry) => {
        acc[entry.reproducibilityTier] = (acc[entry.reproducibilityTier] || 0) + 1;
        return acc;
    }, { reproducible: 0, fragile: 0, non_reproducible: 0 });

    let posture = 'verified';
    if (tierCounts.non_reproducible > 0 || avgReproducibilityScore < 58 || avgRiskPressure > 62) posture = 'critical';
    else if (tierCounts.fragile > 0 || avgReproducibilityScore < 74 || avgRiskPressure > 46) posture = 'review_required';

    return {
        experimentCount: evaluations.length,
        tierCounts,
        avgReproducibilityScore,
        avgRiskPressure,
        posture
    };
}

function buildAlerts(summary, evaluations) {
    const alerts = [];
    if (summary.tierCounts.non_reproducible > 0) alerts.push('reproducibility_failure_present');
    if (evaluations.some((entry) => entry.replicationRate < 60)) alerts.push('reproducibility_replication_rate_low');
    if (evaluations.some((entry) => entry.seedControl < 60 || entry.dataVersionLocked < 60)) {
        alerts.push('reproducibility_protocol_control_gap');
    }
    if (summary.avgRiskPressure > 55) alerts.push('reproducibility_risk_pressure_high');
    return alerts;
}

function buildRecommendations(evaluations, summary, alerts) {
    const recommendations = [];
    for (const entry of evaluations) {
        if (entry.reproducibilityTier !== 'reproducible') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_replication_suite',
                experimentId: entry.experimentId,
                title: `Run replication suite for ${entry.experimentName}`,
                description: `Reproducibility score ${entry.reproducibilityScore} with replication rate ${entry.replicationRate}.`,
                priority: entry.reproducibilityTier === 'non_reproducible' ? 'P0' : 'P1'
            });
        }
        if (entry.seedControl < 70 || entry.dataVersionLocked < 70 || entry.protocolCompleteness < 70) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'lock_experiment_protocol',
                experimentId: entry.experimentId,
                title: `Lock experiment protocol for ${entry.experimentName}`,
                description: 'Improve seed, data-version, and protocol controls for deterministic replay.',
                priority: entry.reproducibilityTier === 'non_reproducible' ? 'P1' : 'P2'
            });
        }
        if (entry.reproducibilityTier === 'non_reproducible' || entry.riskPressure > 60) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'investigate_reproducibility_failure',
                experimentId: entry.experimentId,
                title: `Investigate reproducibility failure for ${entry.experimentName}`,
                description: `Risk pressure ${entry.riskPressure} indicates unresolved reproducibility instability.`,
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_reproducibility_report',
            title: 'Publish experiment reproducibility report',
            description: 'Share reproducibility tiers, protocol controls, and unresolved verification risks.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.experimentId || '').localeCompare(String(b.experimentId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.experimentId || '') === String(entry.experimentId || '')
        )) === index);
}

export function verifyExperimentReproducibility(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const experiments = normalizeExperiments(inputPayload || {});
    const evaluations = evaluateExperiments(experiments);
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

export function reproducibilityToTasks(reportPayload, {
    fromAgentId = 'agent:reproducibility',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('reproducibilityToTasks requires report payload');
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
            experimentId: recommendation.experimentId || null,
            posture: reportPayload.summary?.posture || null,
            nonReproducibleCount: reportPayload.summary?.tierCounts?.non_reproducible || 0
        },
        createdAt: nowMs + index
    }));
}

export class ExperimentReproducibilityVerifier {
    constructor({
        localAgentId = 'agent:reproducibility',
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
        const report = verifyExperimentReproducibility(inputPayload, {
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
        return reproducibilityToTasks(reportPayload, {
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

export const __experimentReproducibilityVerifierInternals = {
    normalizeExperiments,
    evaluateExperiments,
    summarizeEvaluations,
    buildRecommendations
};
