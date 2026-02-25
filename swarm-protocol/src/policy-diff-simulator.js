import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';
import { runCounterfactualPolicyLab } from './counterfactual-policy-lab.js';

const RecommendationTargetMap = {
    align_policy_to_variant: 'agent:policy',
    investigate_large_policy_gap: 'agent:analysis',
    converge_policy_parameters: 'agent:governance'
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

function canonicalVariantSet(report) {
    const baseline = report?.baseline && typeof report.baseline === 'object'
        ? report.baseline
        : null;
    const variants = Array.isArray(report?.variants)
        ? report.variants
        : [];

    const entries = [];
    if (baseline) {
        entries.push({
            id: baseline.policy?.id || 'baseline',
            name: baseline.policy?.name || 'Baseline',
            policy: baseline.policy || {},
            overallScore: safeNumber(baseline.overallScore, 0),
            riskScore: safeNumber(baseline.riskScore, 0),
            outcomes: baseline.outcomes || {}
        });
    }

    for (const variant of variants) {
        entries.push({
            id: variant.policy?.id || `variant-${entries.length}`,
            name: variant.policy?.name || `Variant ${entries.length}`,
            policy: variant.policy || {},
            overallScore: safeNumber(variant.overallScore, 0),
            riskScore: safeNumber(variant.riskScore, 0),
            outcomes: variant.outcomes || {}
        });
    }

    return entries;
}

function policyDistance(a, b) {
    const keys = ['strictness', 'safetyBudget', 'evidenceThreshold', 'autonomyLevel', 'humanReviewDepth'];
    const values = keys.map((key) => Math.abs(safeNumber(a.policy?.[key], 0) - safeNumber(b.policy?.[key], 0)));
    return Number((values.reduce((acc, value) => acc + value, 0) / keys.length).toFixed(2));
}

function outcomeDelta(from, to, key) {
    return Number((safeNumber(to.outcomes?.[key], 0) - safeNumber(from.outcomes?.[key], 0)).toFixed(2));
}

function buildDiffMatrix(entries) {
    const matrix = [];
    for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
            const from = entries[i];
            const to = entries[j];
            matrix.push({
                id: `diff-${randomUUID().slice(0, 8)}`,
                fromId: from.id,
                toId: to.id,
                fromName: from.name,
                toName: to.name,
                parameterDistance: policyDistance(from, to),
                deltaOverallScore: Number((to.overallScore - from.overallScore).toFixed(2)),
                deltaRiskScore: Number((to.riskScore - from.riskScore).toFixed(2)),
                deltaSafety: outcomeDelta(from, to, 'safetyOutcome'),
                deltaThroughput: outcomeDelta(from, to, 'throughputOutcome'),
                deltaEquity: outcomeDelta(from, to, 'equityOutcome'),
                deltaTrust: outcomeDelta(from, to, 'trustOutcome')
            });
        }
    }

    return matrix.sort((a, b) => {
        const magnitudeA = Math.abs(a.deltaOverallScore) + Math.abs(a.deltaRiskScore) + a.parameterDistance;
        const magnitudeB = Math.abs(b.deltaOverallScore) + Math.abs(b.deltaRiskScore) + b.parameterDistance;
        return magnitudeB - magnitudeA;
    });
}

function dominanceRanking(entries) {
    return [...entries]
        .map((entry) => {
            const score = (
                entry.overallScore * 0.56
                + safeNumber(entry.outcomes?.safetyOutcome, 0) * 0.2
                + safeNumber(entry.outcomes?.equityOutcome, 0) * 0.14
                - entry.riskScore * 0.2
            );
            return {
                id: entry.id,
                name: entry.name,
                score: Number(score.toFixed(2)),
                overallScore: entry.overallScore,
                riskScore: entry.riskScore
            };
        })
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.overallScore !== a.overallScore) return b.overallScore - a.overallScore;
            return a.riskScore - b.riskScore;
        });
}

function buildAlerts(diffMatrix, ranked) {
    const alerts = [];
    if (diffMatrix.some((diff) => diff.parameterDistance >= 30)) {
        alerts.push('policy_parameter_divergence_high');
    }
    if (diffMatrix.some((diff) => Math.abs(diff.deltaRiskScore) >= 15)) {
        alerts.push('policy_risk_delta_high');
    }
    if (ranked.length >= 2 && Math.abs(ranked[0].score - ranked[1].score) <= 3) {
        alerts.push('policy_choice_margin_narrow');
    }
    return alerts;
}

function buildRecommendations({
    ranked,
    diffMatrix,
    alerts
}) {
    const recommendations = [];
    const best = ranked[0] || null;
    if (best) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'align_policy_to_variant',
            policyId: best.id,
            title: `Align baseline toward top variant ${best.name}`,
            description: `Top variant score ${best.score} with overall ${best.overallScore} and risk ${best.riskScore}.`,
            priority: best.score >= 65 ? 'P1' : 'P2'
        });
    }

    const largeGap = diffMatrix.find((diff) => (
        diff.parameterDistance >= 30 || Math.abs(diff.deltaRiskScore) >= 15
    ));
    if (largeGap) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'investigate_large_policy_gap',
            title: `Investigate large policy gap: ${largeGap.fromName} -> ${largeGap.toName}`,
            description: `Parameter distance ${largeGap.parameterDistance} with risk delta ${largeGap.deltaRiskScore}.`,
            priority: Math.abs(largeGap.deltaRiskScore) >= 20 ? 'P1' : 'P2'
        });
    }

    if (alerts.includes('policy_choice_margin_narrow')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'converge_policy_parameters',
            title: 'Converge policy parameters across close-performing variants',
            description: 'Top variants are close in score; synthesize a converged policy profile.',
            priority: 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

export function simulatePolicyDiffs(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const counterfactual = runCounterfactualPolicyLab(inputPayload || {}, { now: () => at });
    const entries = canonicalVariantSet(counterfactual);
    const diffMatrix = buildDiffMatrix(entries);
    const ranked = dominanceRanking(entries);
    const alerts = buildAlerts(diffMatrix, ranked);
    const recommendations = buildRecommendations({
        ranked,
        diffMatrix,
        alerts
    });

    return {
        at,
        baseline: clone(counterfactual.baseline),
        variants: counterfactual.variants.map((variant) => clone(variant)),
        diffMatrix,
        ranked,
        summary: {
            variantCount: entries.length,
            topVariantId: ranked[0]?.id || null,
            topVariantScore: ranked[0]?.score || 0,
            maxParameterDistance: diffMatrix.length > 0
                ? Math.max(...diffMatrix.map((entry) => entry.parameterDistance))
                : 0,
            maxRiskDelta: diffMatrix.length > 0
                ? Math.max(...diffMatrix.map((entry) => Math.abs(entry.deltaRiskScore)))
                : 0
        },
        alerts,
        recommendations
    };
}

export function policyDiffRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:policy-diff',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('policyDiffRecommendationsToTasks requires report payload');
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
            policyId: recommendation.policyId || null,
            topVariantId: reportPayload.summary?.topVariantId || null
        },
        createdAt: nowMs + index
    }));
}

export class PolicyDiffSimulator {
    constructor({
        localAgentId = 'agent:policy-diff',
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
        const report = simulatePolicyDiffs(inputPayload, {
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
        return policyDiffRecommendationsToTasks(reportPayload, {
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

export const __policyDiffSimulatorInternals = {
    canonicalVariantSet,
    policyDistance,
    buildDiffMatrix,
    dominanceRanking,
    buildAlerts,
    buildRecommendations
};
