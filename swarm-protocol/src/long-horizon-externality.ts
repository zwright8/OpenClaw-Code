import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    reinforce_positive_externalities: 'agent:strategy',
    mitigate_negative_externalities: 'agent:safety',
    commission_longitudinal_study: 'agent:research'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const DefaultWeights = {
    humanity: 0.4,
    truth: 0.25,
    curiosity: 0.15,
    reliability: 0.2
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

    return {
        humanity: clamp(safeNumber(baseline.humanity, 65)),
        truth: clamp(safeNumber(baseline.truth, 60)),
        curiosity: clamp(safeNumber(baseline.curiosity, 55)),
        reliability: clamp(safeNumber(baseline.reliability, 62))
    };
}

function normalizeInterventions(inputPayload) {
    const entries = Array.isArray(inputPayload?.interventions)
        ? inputPayload.interventions
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' ? entry.id : `intervention-${index + 1}`,
        name: typeof entry?.name === 'string' ? entry.name : `Intervention ${index + 1}`,
        rolloutYears: Math.max(1, Math.floor(safeNumber(entry?.rolloutYears, 2))),
        persistenceYears: Math.max(1, Math.floor(safeNumber(entry?.persistenceYears, 6))),
        volatility: clamp(safeNumber(entry?.volatility, 22)),
        effects: {
            humanity: safeNumber(entry?.effects?.humanity, 0),
            truth: safeNumber(entry?.effects?.truth, 0),
            curiosity: safeNumber(entry?.effects?.curiosity, 0),
            reliability: safeNumber(entry?.effects?.reliability, 0)
        }
    }));
}

function normalizeExternalities(inputPayload) {
    const entries = Array.isArray(inputPayload?.externalities)
        ? inputPayload.externalities
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' ? entry.id : `externality-${index + 1}`,
        name: typeof entry?.name === 'string' ? entry.name : `Externality ${index + 1}`,
        direction: typeof entry?.direction === 'string' && entry.direction.toLowerCase() === 'tailwind'
            ? 'tailwind'
            : 'headwind',
        onsetYear: Math.max(1, Math.floor(safeNumber(entry?.onsetYear, 1))),
        durationYears: Math.max(1, Math.floor(safeNumber(entry?.durationYears, 3))),
        intensity: clamp(safeNumber(entry?.intensity, 35)),
        spread: clamp(safeNumber(entry?.spread, 55)),
        effects: {
            humanity: safeNumber(entry?.effects?.humanity, 0),
            truth: safeNumber(entry?.effects?.truth, 0),
            curiosity: safeNumber(entry?.effects?.curiosity, 0),
            reliability: safeNumber(entry?.effects?.reliability, 0)
        }
    }));
}

function normalizeFeedbackLoops(inputPayload) {
    const entries = Array.isArray(inputPayload?.feedbackLoops)
        ? inputPayload.feedbackLoops
        : [];
    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' ? entry.id : `feedback-${index + 1}`,
        name: typeof entry?.name === 'string' ? entry.name : `Feedback ${index + 1}`,
        triggerMetric: ['humanity', 'truth', 'curiosity', 'reliability'].includes(entry?.triggerMetric)
            ? entry.triggerMetric
            : 'humanity',
        triggerThreshold: clamp(safeNumber(entry?.triggerThreshold, 70)),
        polarity: entry?.polarity === 'balancing' ? 'balancing' : 'reinforcing',
        gain: clamp(safeNumber(entry?.gain, 20), 0, 60)
    }));
}

function normalizeHorizonYears(inputPayload) {
    const values = Array.isArray(inputPayload?.horizonYears)
        ? inputPayload.horizonYears
        : [1, 3, 5, 10];
    const normalized = [...new Set(values
        .map((value) => Math.floor(Number(value)))
        .filter((value) => Number.isFinite(value) && value > 0)
    )].sort((a, b) => a - b);

    return normalized.length > 0 ? normalized : [1, 3, 5, 10];
}

function effectKeys() {
    return ['humanity', 'truth', 'curiosity', 'reliability'];
}

function emptyEffectSet() {
    return {
        humanity: 0,
        truth: 0,
        curiosity: 0,
        reliability: 0
    };
}

function interventionEffectForYear(intervention, year) {
    const adopted = Math.min(1, year / intervention.rolloutYears);
    const decayYears = Math.max(0, year - intervention.rolloutYears);
    const decayFactor = Math.max(0.35, 1 - (decayYears / (intervention.persistenceYears + 1)));
    const volatilityPenalty = intervention.volatility * 0.002;
    const factor = Math.max(0, adopted * decayFactor - volatilityPenalty);
    const effects = emptyEffectSet();
    for (const key of effectKeys()) {
        effects[key] = intervention.effects[key] * factor;
    }
    return effects;
}

function externalityEffectForYear(externality, year) {
    if (year < externality.onsetYear) {
        return emptyEffectSet();
    }
    if (year > externality.onsetYear + externality.durationYears - 1) {
        return emptyEffectSet();
    }

    const elapsed = year - externality.onsetYear;
    const spreadFactor = Math.max(0.2, 1 - (elapsed / Math.max(1, externality.durationYears * 1.5)));
    const baseFactor = (externality.intensity / 100) * (externality.spread / 100) * spreadFactor;
    const signedFactor = externality.direction === 'tailwind' ? baseFactor : -baseFactor;
    const effects = emptyEffectSet();
    for (const key of effectKeys()) {
        effects[key] = externality.effects[key] * signedFactor;
    }
    return effects;
}

function feedbackEffects(scores, loops) {
    const effects = emptyEffectSet();
    for (const loop of loops) {
        const signal = safeNumber(scores[loop.triggerMetric], 0);
        const distance = Math.abs(signal - loop.triggerThreshold);
        const strength = (distance / 100) * (loop.gain / 100) * 8;
        const isActivated = loop.polarity === 'reinforcing'
            ? signal >= loop.triggerThreshold
            : signal < loop.triggerThreshold;
        if (!isActivated) continue;

        for (const key of effectKeys()) {
            const direction = loop.polarity === 'reinforcing' ? 1 : -1;
            effects[key] += direction * strength * (key === loop.triggerMetric ? 0.55 : 0.2);
        }
    }
    return effects;
}

function sumEffects(...effectSets) {
    const total = emptyEffectSet();
    for (const set of effectSets) {
        for (const key of effectKeys()) {
            total[key] += safeNumber(set[key], 0);
        }
    }
    return total;
}

function trajectoryFromDelta(delta, riskScore) {
    if (delta >= 6 && riskScore < 35) return 'regenerative';
    if (delta <= -5 || riskScore >= 70) return 'fragile';
    if (delta >= 1) return 'improving';
    if (delta <= -1) return 'declining';
    return 'stable';
}

function buildRecommendations({
    trajectory,
    finalProjection,
    alerts
}) {
    const recommendations = [];
    if (trajectory === 'regenerative' || trajectory === 'improving') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'reinforce_positive_externalities',
            title: 'Reinforce positive long-horizon externalities',
            description: `Year-${finalProjection.year} projection is ${trajectory}; lock in gains with durable investments.`,
            priority: trajectory === 'regenerative' ? 'P1' : 'P2'
        });
    }

    if (alerts.includes('externality_risk_high') || trajectory === 'fragile' || trajectory === 'declining') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'mitigate_negative_externalities',
            title: 'Mitigate emerging negative externalities',
            description: `Risk score ${finalProjection.riskScore} indicates likely harmful second-order effects.`,
            priority: finalProjection.riskScore >= 75 ? 'P0' : 'P1'
        });
    }

    recommendations.push({
        id: `recommendation-${randomUUID().slice(0, 8)}`,
        type: 'commission_longitudinal_study',
        title: 'Commission longitudinal outcome study',
        description: 'Establish ongoing measurement across years to validate forecast assumptions.',
        priority: alerts.length > 0 ? 'P1' : 'P2'
    });

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

export function forecastLongHorizonExternalities(inputPayload, {
    now = Date.now,
    weights = null
} = {}) {
    const at = safeNow(now);
    const baseline = normalizeBaseline(inputPayload || {});
    const interventions = normalizeInterventions(inputPayload || {});
    const externalities = normalizeExternalities(inputPayload || {});
    const feedbackLoops = normalizeFeedbackLoops(inputPayload || {});
    const horizonYears = normalizeHorizonYears(inputPayload || {});
    const scoringWeights = normalizeWeights(weights);

    let runningScores = { ...baseline };
    const yearlyProjections = [];

    for (const year of horizonYears) {
        const interventionEffects = interventions
            .map((entry) => interventionEffectForYear(entry, year))
            .reduce((acc, effects) => sumEffects(acc, effects), emptyEffectSet());
        const externalityEffects = externalities
            .map((entry) => externalityEffectForYear(entry, year))
            .reduce((acc, effects) => sumEffects(acc, effects), emptyEffectSet());
        const feedbackEffect = feedbackEffects(runningScores, feedbackLoops);
        const netEffects = sumEffects(interventionEffects, externalityEffects, feedbackEffect);

        runningScores = {
            humanity: clamp(runningScores.humanity + netEffects.humanity),
            truth: clamp(runningScores.truth + netEffects.truth),
            curiosity: clamp(runningScores.curiosity + netEffects.curiosity),
            reliability: clamp(runningScores.reliability + netEffects.reliability)
        };

        const riskScore = clamp(
            externalities.reduce((acc, entry) => {
                const isActive = year >= entry.onsetYear && year <= entry.onsetYear + entry.durationYears - 1;
                if (!isActive || entry.direction === 'tailwind') return acc;
                return acc + (entry.intensity * (entry.spread / 100)) * 0.65;
            }, 0)
            + interventions.reduce((acc, entry) => acc + entry.volatility * 0.15, 0)
        );

        const resilienceScore = clamp(100 - riskScore + (runningScores.reliability - 60) * 0.25);

        yearlyProjections.push({
            year,
            scores: clone(runningScores),
            societalScore: Number(societalScore(runningScores, scoringWeights).toFixed(2)),
            riskScore: Number(riskScore.toFixed(2)),
            resilienceScore: Number(resilienceScore.toFixed(2)),
            directEffects: Object.fromEntries(effectKeys().map((key) => [
                key,
                Number(interventionEffects[key].toFixed(3))
            ])),
            secondOrderEffects: Object.fromEntries(effectKeys().map((key) => [
                key,
                Number((externalityEffects[key] + feedbackEffect[key]).toFixed(3))
            ]))
        });
    }

    const baselineScore = Number(societalScore(baseline, scoringWeights).toFixed(2));
    const finalProjection = yearlyProjections[yearlyProjections.length - 1] || {
        year: 0,
        societalScore: baselineScore,
        riskScore: 0,
        resilienceScore: 0,
        scores: baseline
    };
    const delta = Number((finalProjection.societalScore - baselineScore).toFixed(2));
    const trajectory = trajectoryFromDelta(delta, finalProjection.riskScore);

    const alerts = [];
    if (finalProjection.riskScore >= 60) {
        alerts.push('externality_risk_high');
    }
    if (finalProjection.scores.humanity < 45) {
        alerts.push('humanity_projection_low');
    }
    if (trajectory === 'fragile' || trajectory === 'declining') {
        alerts.push('long_horizon_decline');
    }

    const recommendations = buildRecommendations({
        trajectory,
        finalProjection,
        alerts
    });

    return {
        at,
        baseline: {
            scores: baseline,
            societalScore: baselineScore
        },
        weights: scoringWeights,
        yearlyProjections,
        summary: {
            horizonYears,
            delta,
            trajectory,
            finalSocietalScore: finalProjection.societalScore,
            finalRiskScore: finalProjection.riskScore,
            finalResilienceScore: finalProjection.resilienceScore,
            alertCount: alerts.length
        },
        alerts,
        recommendations
    };
}

export function longHorizonRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:externality-forecast',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('longHorizonRecommendationsToTasks requires report payload');
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
            trajectory: reportPayload.summary?.trajectory || 'unknown',
            horizonYears: reportPayload.summary?.horizonYears || []
        },
        createdAt: nowMs + index
    }));
}

export class LongHorizonExternalityForecaster {
    constructor({
        localAgentId = 'agent:externality-forecast',
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
        const report = forecastLongHorizonExternalities(inputPayload, {
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
        return longHorizonRecommendationsToTasks(reportPayload, {
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

export const __longHorizonExternalityInternals = {
    normalizeBaseline,
    normalizeInterventions,
    normalizeExternalities,
    normalizeFeedbackLoops,
    interventionEffectForYear,
    externalityEffectForYear,
    feedbackEffects,
    trajectoryFromDelta
};
