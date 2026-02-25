import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const DefaultWeights = {
    humanity: 0.45,
    truth: 0.25,
    curiosity: 0.15,
    reliability: 0.15
};

const InterventionTargetMap = {
    adopt: 'agent:ops',
    review: 'agent:review'
};

const InterventionPriorityMap = {
    adopt: 'high',
    review: 'normal'
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

function clamp100(value) {
    return Math.max(0, Math.min(100, value));
}

function normalizeWeights(weights) {
    const humanity = safeNumber(weights?.humanity, DefaultWeights.humanity);
    const truth = safeNumber(weights?.truth, DefaultWeights.truth);
    const curiosity = safeNumber(weights?.curiosity, DefaultWeights.curiosity);
    const reliability = safeNumber(weights?.reliability, DefaultWeights.reliability);
    const sum = humanity + truth + curiosity + reliability;
    if (sum <= 0) return { ...DefaultWeights };

    return {
        humanity: humanity / sum,
        truth: truth / sum,
        curiosity: curiosity / sum,
        reliability: reliability / sum
    };
}

function societalScore(scores, weights) {
    return (
        scores.humanity * weights.humanity
        + scores.truth * weights.truth
        + scores.curiosity * weights.curiosity
        + scores.reliability * weights.reliability
    );
}

function normalizeBaseline(inputPayload) {
    const baseline = inputPayload?.baseline && typeof inputPayload.baseline === 'object'
        ? inputPayload.baseline
        : {};
    const constitutionMetrics = inputPayload?.constitutionReport?.metrics || {};
    const humanitySummary = inputPayload?.humanityReport?.summary || {};
    const readinessSummary = inputPayload?.readinessReport?.summary || {};
    const curiositySummary = inputPayload?.curiosityAgenda?.summary || {};

    const humanityFromReport = 100
        - safeNumber(humanitySummary.blockedCount, 0) * 25
        - safeNumber(humanitySummary.reviewRequiredCount, 0) * 10;

    const reliabilityFromReadiness = 100
        - safeNumber(readinessSummary.missingCapabilityCount, 0) * 14
        - safeNumber(readinessSummary.sandboxGapCount, 0) * 12
        - safeNumber(readinessSummary.approvalErrorCount, 0) * 10;

    return {
        humanity: clamp100(safeNumber(
            baseline.humanity,
            constitutionMetrics?.proHumanity?.score ?? humanityFromReport
        )),
        truth: clamp100(safeNumber(
            baseline.truth,
            constitutionMetrics?.truthSeeking?.score ?? 70
        )),
        curiosity: clamp100(safeNumber(
            baseline.curiosity,
            constitutionMetrics?.curiosity?.score
            ?? safeNumber(curiositySummary.avgCuriosityScore, 55)
        )),
        reliability: clamp100(safeNumber(
            baseline.reliability,
            reliabilityFromReadiness
        ))
    };
}

function normalizeInterventions(inputPayload) {
    const items = Array.isArray(inputPayload?.interventions)
        ? inputPayload.interventions
        : [];

    return items.map((item, index) => ({
        id: item?.id || `intervention-${index + 1}`,
        name: item?.name || `Intervention ${index + 1}`,
        type: item?.type || 'general',
        rolloutDays: Math.max(1, Math.floor(safeNumber(item?.rolloutDays, 7))),
        effects: {
            humanity: safeNumber(item?.effects?.humanity, 0),
            truth: safeNumber(item?.effects?.truth, 0),
            curiosity: safeNumber(item?.effects?.curiosity, 0),
            reliability: safeNumber(item?.effects?.reliability, 0)
        },
        riskScore: clamp100(safeNumber(item?.riskScore, 20)),
        costUsd: Math.max(0, safeNumber(item?.costUsd, 0))
    }));
}

function normalizeHorizonDays(inputPayload) {
    const input = Array.isArray(inputPayload?.horizonDays) ? inputPayload.horizonDays : [1, 7, 30];
    const normalized = [...new Set(input
        .map((value) => Math.floor(Number(value)))
        .filter((value) => Number.isFinite(value) && value > 0)
    )].sort((a, b) => a - b);

    return normalized.length > 0 ? normalized : [1, 7, 30];
}

function projectionForDay(day, baseline, interventions, weights, maxDay) {
    const projected = { ...baseline };
    let aggregateRisk = 0;
    let aggregateCost = 0;

    for (const intervention of interventions) {
        const adoption = Math.min(1, day / intervention.rolloutDays);
        const decay = Math.max(0.55, 1 - (day / Math.max(1, maxDay * 2)));
        const factor = adoption * decay;
        projected.humanity += intervention.effects.humanity * factor;
        projected.truth += intervention.effects.truth * factor;
        projected.curiosity += intervention.effects.curiosity * factor;
        projected.reliability += intervention.effects.reliability * factor;
        aggregateRisk += intervention.riskScore * adoption * 0.8;
        aggregateCost += intervention.costUsd * adoption;
    }

    projected.humanity = clamp100(projected.humanity);
    projected.truth = clamp100(projected.truth);
    projected.curiosity = clamp100(projected.curiosity);
    projected.reliability = clamp100(projected.reliability);

    return {
        day,
        projectedScores: projected,
        societalScore: Number(societalScore(projected, weights).toFixed(2)),
        aggregateRiskScore: Number(clamp100(aggregateRisk).toFixed(2)),
        aggregateCostUsd: Number(aggregateCost.toFixed(2))
    };
}

function evaluateInterventionRecommendations(interventions, weights) {
    return interventions.map((intervention) => {
        const benefitScore = (
            intervention.effects.humanity * weights.humanity
            + intervention.effects.truth * weights.truth
            + intervention.effects.curiosity * weights.curiosity
            + intervention.effects.reliability * weights.reliability
        ) * 10;
        const riskPenalty = intervention.riskScore * 0.42;
        const recommendationScore = Number((benefitScore - riskPenalty).toFixed(2));

        let recommendation = 'review';
        if (recommendationScore >= 8) recommendation = 'adopt';
        if (recommendationScore < 0) recommendation = 'review';

        return {
            id: intervention.id,
            name: intervention.name,
            type: intervention.type,
            recommendationScore,
            expectedBenefitScore: Number(benefitScore.toFixed(2)),
            riskScore: intervention.riskScore,
            recommendation
        };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
}

function trajectoryFromDelta(delta) {
    if (delta >= 2) return 'improving';
    if (delta <= -2) return 'declining';
    return 'stable';
}

export function simulateSocietalOutcomes(inputPayload, {
    now = Date.now,
    weights = null
} = {}) {
    const at = safeNow(now);
    const normalizedWeights = normalizeWeights(weights);
    const baseline = normalizeBaseline(inputPayload || {});
    const interventions = normalizeInterventions(inputPayload || {});
    const horizonDays = normalizeHorizonDays(inputPayload || {});
    const maxDay = horizonDays[horizonDays.length - 1];

    const baselineScore = Number(societalScore(baseline, normalizedWeights).toFixed(2));
    const projections = horizonDays.map((day) => projectionForDay(
        day,
        baseline,
        interventions,
        normalizedWeights,
        maxDay
    ));
    const finalProjection = projections[projections.length - 1];
    const delta = Number((finalProjection.societalScore - baselineScore).toFixed(2));
    const trajectory = trajectoryFromDelta(delta);
    const interventionRecommendations = evaluateInterventionRecommendations(interventions, normalizedWeights);

    const alerts = [];
    if (finalProjection.projectedScores.humanity < 45) {
        alerts.push('humanity_score_low');
    }
    if (finalProjection.aggregateRiskScore > 45) {
        alerts.push('intervention_risk_high');
    }
    if (trajectory === 'declining') {
        alerts.push('societal_trajectory_declining');
    }

    return {
        at,
        weights: normalizedWeights,
        baseline: {
            scores: baseline,
            societalScore: baselineScore
        },
        projections,
        interventions: interventionRecommendations,
        summary: {
            interventionCount: interventions.length,
            projectedSocietalScore: finalProjection.societalScore,
            baselineSocietalScore: baselineScore,
            delta,
            trajectory,
            alertCount: alerts.length
        },
        alerts
    };
}

export function societalOutcomeToTasks(reportPayload, {
    fromAgentId = 'agent:societal-sim',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('societalOutcomeToTasks requires report payload');
    }

    const interventions = Array.isArray(reportPayload.interventions)
        ? reportPayload.interventions
        : [];
    const targets = {
        ...InterventionTargetMap,
        ...(targetMap || {})
    };
    const nowMs = safeNow(Date.now);

    return interventions
        .filter((item) => item.recommendation === 'adopt' || item.recommendation === 'review')
        .map((item, index) => {
            const recommendation = item.recommendation;
            const priority = InterventionPriorityMap[recommendation] || 'normal';
            return buildTaskRequest({
                id: randomUUID(),
                from: fromAgentId,
                target: targets[recommendation] || defaultTarget,
                priority: recommendation === 'adopt' && item.recommendationScore >= 14
                    ? 'critical'
                    : priority,
                task: recommendation === 'adopt'
                    ? `Adopt intervention: ${item.name}`
                    : `Review intervention risk: ${item.name}`,
                context: {
                    interventionId: item.id,
                    interventionType: item.type,
                    recommendation,
                    recommendationScore: item.recommendationScore,
                    riskScore: item.riskScore
                },
                createdAt: nowMs + index
            });
        });
}

export class SocietalOutcomeSimulator {
    constructor({
        localAgentId = 'agent:societal-sim',
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
        const report = simulateSocietalOutcomes(inputPayload, {
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
        return societalOutcomeToTasks(reportPayload, {
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

export const __societalOutcomeInternals = {
    normalizeBaseline,
    normalizeInterventions,
    projectionForDay,
    evaluateInterventionRecommendations,
    trajectoryFromDelta
};
