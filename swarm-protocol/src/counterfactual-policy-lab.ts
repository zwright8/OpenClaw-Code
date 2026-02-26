import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    adopt_policy_variant: 'agent:policy',
    run_policy_pilot: 'agent:ops',
    investigate_policy_tradeoff: 'agent:analysis'
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

function normalizePolicy(entry, fallbackName) {
    const policy = entry && typeof entry === 'object' ? entry : {};
    return {
        id: typeof policy.id === 'string' && policy.id.trim()
            ? policy.id.trim()
            : `policy-${randomUUID().slice(0, 8)}`,
        name: typeof policy.name === 'string' && policy.name.trim()
            ? policy.name.trim()
            : fallbackName,
        strictness: clamp(safeNumber(policy.strictness, 55)),
        safetyBudget: clamp(safeNumber(policy.safetyBudget, 50)),
        evidenceThreshold: clamp(safeNumber(policy.evidenceThreshold, 50)),
        autonomyLevel: clamp(safeNumber(policy.autonomyLevel, 55)),
        humanReviewDepth: clamp(safeNumber(policy.humanReviewDepth, 45))
    };
}

function normalizeContext(inputPayload) {
    const context = inputPayload?.context && typeof inputPayload.context === 'object'
        ? inputPayload.context
        : {};

    return {
        harmRisk: clamp(safeNumber(context.harmRisk, 35)),
        misuseThreat: clamp(safeNumber(context.misuseThreat, 30)),
        equityGap: clamp(safeNumber(context.equityGap, 25)),
        readinessScore: clamp(safeNumber(context.readinessScore, 70)),
        missionUrgency: clamp(safeNumber(context.missionUrgency, 60)),
        costPressure: clamp(safeNumber(context.costPressure, 45))
    };
}

function applyOverrides(basePolicy, variant) {
    const override = variant?.changes && typeof variant.changes === 'object'
        ? variant.changes
        : {};
    return {
        ...basePolicy,
        id: typeof variant?.id === 'string' && variant.id.trim()
            ? variant.id.trim()
            : `variant-${randomUUID().slice(0, 8)}`,
        name: typeof variant?.name === 'string' && variant.name.trim()
            ? variant.name.trim()
            : `Variant ${randomUUID().slice(0, 5)}`,
        strictness: clamp(safeNumber(override.strictness, basePolicy.strictness)),
        safetyBudget: clamp(safeNumber(override.safetyBudget, basePolicy.safetyBudget)),
        evidenceThreshold: clamp(safeNumber(override.evidenceThreshold, basePolicy.evidenceThreshold)),
        autonomyLevel: clamp(safeNumber(override.autonomyLevel, basePolicy.autonomyLevel)),
        humanReviewDepth: clamp(safeNumber(override.humanReviewDepth, basePolicy.humanReviewDepth))
    };
}

function evaluatePolicy(policy, context) {
    const safetyOutcome = clamp(Math.round(
        policy.strictness * 0.36
        + policy.safetyBudget * 0.28
        + policy.humanReviewDepth * 0.2
        + policy.evidenceThreshold * 0.16
        - context.harmRisk * 0.32
        - context.misuseThreat * 0.26
    ));

    const throughputOutcome = clamp(Math.round(
        policy.autonomyLevel * 0.46
        + context.readinessScore * 0.24
        + context.missionUrgency * 0.18
        - policy.strictness * 0.22
        - policy.humanReviewDepth * 0.18
    ));

    const equityOutcome = clamp(Math.round(
        policy.evidenceThreshold * 0.22
        + policy.humanReviewDepth * 0.23
        + policy.safetyBudget * 0.2
        + policy.strictness * 0.14
        - context.equityGap * 0.35
    ));

    const costOutcome = clamp(Math.round(
        100
        - policy.safetyBudget * 0.4
        - policy.humanReviewDepth * 0.22
        - policy.evidenceThreshold * 0.12
        + policy.autonomyLevel * 0.2
        - context.costPressure * 0.2
    ));

    const trustOutcome = clamp(Math.round(
        safetyOutcome * 0.4
        + equityOutcome * 0.32
        + policy.evidenceThreshold * 0.15
        - context.misuseThreat * 0.12
    ));

    const riskScore = clamp(Math.round(
        context.harmRisk * 0.42
        + context.misuseThreat * 0.26
        + context.equityGap * 0.2
        + (100 - safetyOutcome) * 0.12
        + (100 - trustOutcome) * 0.1
        - policy.strictness * 0.14
    ));

    const overallScore = clamp(Math.round(
        safetyOutcome * 0.28
        + throughputOutcome * 0.22
        + equityOutcome * 0.2
        + trustOutcome * 0.2
        + costOutcome * 0.1
        - riskScore * 0.14
    ));

    return {
        outcomes: {
            safetyOutcome,
            throughputOutcome,
            equityOutcome,
            costOutcome,
            trustOutcome
        },
        riskScore,
        overallScore
    };
}

function evaluateVariants(basePolicy, variants, context) {
    const baselineEval = evaluatePolicy(basePolicy, context);
    const evaluated = variants.map((variant) => {
        const policy = applyOverrides(basePolicy, variant);
        const evaluation = evaluatePolicy(policy, context);
        return {
            policy,
            ...evaluation,
            deltas: {
                overallScore: Number((evaluation.overallScore - baselineEval.overallScore).toFixed(2)),
                riskScore: Number((evaluation.riskScore - baselineEval.riskScore).toFixed(2)),
                safetyOutcome: Number((evaluation.outcomes.safetyOutcome - baselineEval.outcomes.safetyOutcome).toFixed(2)),
                throughputOutcome: Number((evaluation.outcomes.throughputOutcome - baselineEval.outcomes.throughputOutcome).toFixed(2)),
                equityOutcome: Number((evaluation.outcomes.equityOutcome - baselineEval.outcomes.equityOutcome).toFixed(2)),
                trustOutcome: Number((evaluation.outcomes.trustOutcome - baselineEval.outcomes.trustOutcome).toFixed(2))
            }
        };
    }).sort((a, b) => {
        if (b.overallScore !== a.overallScore) return b.overallScore - a.overallScore;
        if (a.riskScore !== b.riskScore) return a.riskScore - b.riskScore;
        return String(a.policy.id).localeCompare(String(b.policy.id));
    });

    return {
        baseline: {
            policy: basePolicy,
            ...baselineEval
        },
        variants: evaluated
    };
}

function uncertaintyForVariant(variant, context) {
    const tension = Math.abs(variant.deltas.throughputOutcome - variant.deltas.safetyOutcome);
    const riskInstability = Math.abs(variant.deltas.riskScore);
    return clamp(Math.round(
        tension * 0.38
        + riskInstability * 0.42
        + context.missionUrgency * 0.08
        + context.costPressure * 0.08
    ));
}

function buildRecommendations(evaluation, context) {
    const recommendations = [];
    const best = evaluation.variants[0] || null;
    if (!best) {
        return recommendations;
    }

    const uncertainty = uncertaintyForVariant(best, context);
    const adoptable = best.deltas.overallScore >= 3 && best.riskScore <= evaluation.baseline.riskScore + 5;
    const needsPilot = uncertainty >= 55 || Math.abs(best.deltas.riskScore) >= 8;

    if (adoptable) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'adopt_policy_variant',
            policyId: best.policy.id,
            title: `Adopt policy variant ${best.policy.name}`,
            description: `Variant improves overall score by ${best.deltas.overallScore} with risk ${best.riskScore}.`,
            priority: best.deltas.overallScore >= 10 ? 'P1' : 'P2'
        });
    }

    if (needsPilot) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'run_policy_pilot',
            policyId: best.policy.id,
            title: `Run pilot for policy variant ${best.policy.name}`,
            description: `Uncertainty score ${uncertainty} suggests validating in pilot before full rollout.`,
            priority: uncertainty >= 70 ? 'P1' : 'P2'
        });
    }

    if (!adoptable || uncertainty >= 50) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'investigate_policy_tradeoff',
            policyId: best.policy.id,
            title: 'Investigate policy tradeoffs before commitment',
            description: 'Top variant has meaningful tradeoffs between safety, throughput, or risk.',
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

export function runCounterfactualPolicyLab(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const basePolicy = normalizePolicy(inputPayload?.baselinePolicy, 'baseline');
    const variants = Array.isArray(inputPayload?.variants)
        ? inputPayload.variants
        : [];
    const context = normalizeContext(inputPayload || {});
    const evaluation = evaluateVariants(basePolicy, variants, context);
    const recommendations = buildRecommendations(evaluation, context);
    const bestVariant = evaluation.variants[0] || null;

    const alerts = [];
    if (bestVariant && bestVariant.riskScore >= 70) alerts.push('variant_risk_high');
    if (bestVariant && bestVariant.deltas.overallScore < 0) alerts.push('no_positive_variant_found');
    if (bestVariant && uncertaintyForVariant(bestVariant, context) >= 60) alerts.push('policy_uncertainty_high');

    return {
        at,
        context,
        baseline: clone(evaluation.baseline),
        variants: evaluation.variants.map((variant) => clone(variant)),
        summary: {
            variantCount: evaluation.variants.length,
            bestVariantId: bestVariant?.policy.id || null,
            bestVariantName: bestVariant?.policy.name || null,
            bestOverallScore: bestVariant?.overallScore ?? evaluation.baseline.overallScore,
            baselineOverallScore: evaluation.baseline.overallScore
        },
        alerts,
        recommendations
    };
}

export function policyLabRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:policy-lab',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('policyLabRecommendationsToTasks requires report payload');
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
            bestVariantId: reportPayload.summary?.bestVariantId || null
        },
        createdAt: nowMs + index
    }));
}

export class CounterfactualPolicyLab {
    constructor({
        localAgentId = 'agent:policy-lab',
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
        const report = runCounterfactualPolicyLab(inputPayload, {
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
        return policyLabRecommendationsToTasks(reportPayload, {
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

export const __counterfactualPolicyLabInternals = {
    normalizePolicy,
    normalizeContext,
    applyOverrides,
    evaluatePolicy,
    evaluateVariants,
    uncertaintyForVariant,
    buildRecommendations
};
