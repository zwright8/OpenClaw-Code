import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    run_bias_mitigation_experiment: 'agent:model-safety',
    increase_representative_sampling: 'agent:data-eng',
    enforce_bias_release_gate: 'agent:governance',
    publish_bias_audit: 'agent:ops'
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

function normalizeEvaluations(inputPayload) {
    const evaluations = Array.isArray(inputPayload?.evaluations)
        ? inputPayload.evaluations
        : [];

    return evaluations
        .filter((evaluation) => evaluation && typeof evaluation === 'object')
        .map((evaluation, index) => ({
            sliceId: typeof evaluation.sliceId === 'string' && evaluation.sliceId.trim()
                ? evaluation.sliceId.trim()
                : `slice-${index + 1}`,
            modelName: typeof evaluation.modelName === 'string' && evaluation.modelName.trim()
                ? evaluation.modelName.trim()
                : `Model ${index + 1}`,
            groupDisparity: clamp(safeNumber(evaluation.groupDisparity, 32)),
            errorRate: clamp(safeNumber(evaluation.errorRate, 24)),
            coverageGap: clamp(safeNumber(evaluation.coverageGap, 28)),
            harmSignals: clamp(safeNumber(evaluation.harmSignals, 18)),
            mitigationCoverage: clamp(safeNumber(evaluation.mitigationCoverage, 58)),
            sampleAdequacy: clamp(safeNumber(evaluation.sampleAdequacy, 64))
        }));
}

function biasRiskScore(evaluation) {
    return clamp(Math.round(
        evaluation.groupDisparity * 0.28
        + evaluation.errorRate * 0.18
        + evaluation.coverageGap * 0.16
        + evaluation.harmSignals * 0.24
        + (100 - evaluation.mitigationCoverage) * 0.08
        + (100 - evaluation.sampleAdequacy) * 0.06
    ));
}

function biasTier(score) {
    if (score >= 70) return 'severe';
    if (score >= 48) return 'elevated';
    return 'controlled';
}

function evaluateBias(evaluations) {
    return evaluations
        .map((evaluation) => {
            const biasRisk = biasRiskScore(evaluation);
            const mitigationEffectiveness = clamp(Math.round(
                evaluation.mitigationCoverage * 0.6
                + evaluation.sampleAdequacy * 0.2
                + (100 - evaluation.groupDisparity) * 0.2
            ));
            const residualRisk = clamp(Math.round(
                biasRisk * 0.72
                - mitigationEffectiveness * 0.3
                + (evaluation.harmSignals > 50 ? 12 : 0)
            ));

            return {
                sliceId: evaluation.sliceId,
                modelName: evaluation.modelName,
                groupDisparity: evaluation.groupDisparity,
                errorRate: evaluation.errorRate,
                coverageGap: evaluation.coverageGap,
                harmSignals: evaluation.harmSignals,
                mitigationCoverage: evaluation.mitigationCoverage,
                sampleAdequacy: evaluation.sampleAdequacy,
                biasRisk,
                mitigationEffectiveness,
                residualRisk,
                biasTier: biasTier(biasRisk)
            };
        })
        .sort((a, b) => {
            const tierRank = { severe: 0, elevated: 1, controlled: 2 };
            const tierDiff = tierRank[a.biasTier] - tierRank[b.biasTier];
            if (tierDiff !== 0) return tierDiff;
            return b.biasRisk - a.biasRisk;
        });
}

function summarizeEvaluations(evaluations) {
    const avgBiasRisk = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.biasRisk, 0) / evaluations.length).toFixed(2))
        : 0;
    const avgResidualRisk = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.residualRisk, 0) / evaluations.length).toFixed(2))
        : 0;

    const tierCounts = evaluations.reduce((acc, entry) => {
        acc[entry.biasTier] = (acc[entry.biasTier] || 0) + 1;
        return acc;
    }, { severe: 0, elevated: 0, controlled: 0 });

    let posture = 'aligned';
    if (tierCounts.severe > 0 || avgResidualRisk > 58) posture = 'critical';
    else if (tierCounts.elevated > 0 || avgResidualRisk > 38) posture = 'review_required';

    return {
        sliceCount: evaluations.length,
        tierCounts,
        avgBiasRisk,
        avgResidualRisk,
        posture
    };
}

function buildAlerts(summary, evaluations) {
    const alerts = [];
    if (summary.tierCounts.severe > 0) alerts.push('bias_severe_present');
    if (evaluations.some((entry) => entry.groupDisparity > 55 || entry.coverageGap > 50)) alerts.push('bias_disparity_gap_high');
    if (evaluations.some((entry) => entry.sampleAdequacy < 55)) alerts.push('bias_sampling_adequacy_low');
    if (evaluations.some((entry) => entry.harmSignals > 45)) alerts.push('bias_harm_signal_high');
    return alerts;
}

function buildRecommendations(evaluations, summary, alerts) {
    const recommendations = [];
    for (const entry of evaluations) {
        if (entry.biasTier !== 'controlled') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_bias_mitigation_experiment',
                sliceId: entry.sliceId,
                title: `Run bias mitigation experiment for ${entry.modelName}`,
                description: `Bias risk ${entry.biasRisk} with residual risk ${entry.residualRisk}.`,
                priority: entry.biasTier === 'severe' ? 'P0' : 'P1'
            });
        }
        if (entry.sampleAdequacy < 65 || entry.coverageGap > 45) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'increase_representative_sampling',
                sliceId: entry.sliceId,
                title: `Increase representative sampling for ${entry.modelName}`,
                description: `Sample adequacy ${entry.sampleAdequacy} with coverage gap ${entry.coverageGap}.`,
                priority: entry.biasTier === 'severe' ? 'P1' : 'P2'
            });
        }
        if (entry.biasTier === 'severe' || entry.harmSignals > 45) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'enforce_bias_release_gate',
                sliceId: entry.sliceId,
                title: `Enforce bias release gate for ${entry.modelName}`,
                description: 'Block rollout until disparity and harm signal thresholds are remediated.',
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_bias_audit',
            title: 'Publish bias mitigation audit',
            description: 'Publish slice-level disparities, residual risk, and mitigation ownership.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.sliceId || '').localeCompare(String(b.sliceId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.sliceId || '') === String(entry.sliceId || '')
        )) === index);
}

export function runBiasMitigationLoop(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const evaluations = normalizeEvaluations(inputPayload || {});
    const assessments = evaluateBias(evaluations);
    const summary = summarizeEvaluations(assessments);
    const alerts = buildAlerts(summary, assessments);
    const recommendations = buildRecommendations(assessments, summary, alerts);

    return {
        at,
        summary,
        evaluations: assessments,
        alerts,
        recommendations
    };
}

export function biasMitigationToTasks(reportPayload, {
    fromAgentId = 'agent:bias-mitigation',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('biasMitigationToTasks requires report payload');
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
            sliceId: recommendation.sliceId || null,
            posture: reportPayload.summary?.posture || null,
            severeCount: reportPayload.summary?.tierCounts?.severe || 0
        },
        createdAt: nowMs + index
    }));
}

export class BiasMitigationLoop {
    constructor({
        localAgentId = 'agent:bias-mitigation',
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
        const report = runBiasMitigationLoop(inputPayload, {
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
        return biasMitigationToTasks(reportPayload, {
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

export const __biasMitigationLoopInternals = {
    normalizeEvaluations,
    evaluateBias,
    summarizeEvaluations,
    buildRecommendations
};
