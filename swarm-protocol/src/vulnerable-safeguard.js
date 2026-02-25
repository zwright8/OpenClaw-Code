import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    deploy_targeted_safeguard: 'agent:safety',
    pause_high_harm_rollout: 'agent:ops',
    expand_support_coverage: 'agent:community',
    monitor_vulnerable_outcomes: 'agent:monitoring'
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

function normalizePopulations(inputPayload) {
    const entries = Array.isArray(inputPayload?.populations)
        ? inputPayload.populations
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `population-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Population ${index + 1}`,
        vulnerabilityIndex: clamp(safeNumber(entry?.vulnerabilityIndex, 55)),
        populationSize: Math.max(1, Math.floor(safeNumber(entry?.populationSize, 1_000))),
        currentHarmExposure: clamp(safeNumber(entry?.currentHarmExposure, 35)),
        accessCoverage: clamp(safeNumber(entry?.accessCoverage, 60)),
        safeguardCoverage: clamp(safeNumber(entry?.safeguardCoverage, 55))
    }));
}

function normalizeInterventions(inputPayload) {
    const entries = Array.isArray(inputPayload?.interventions)
        ? inputPayload.interventions
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `intervention-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Intervention ${index + 1}`,
        rolloutCoverage: clamp(safeNumber(entry?.rolloutCoverage, 70)),
        riskScore: clamp(safeNumber(entry?.riskScore, 25)),
        effects: entry?.effects && typeof entry.effects === 'object'
            ? entry.effects
            : {}
    }));
}

function normalizeThresholds(inputPayload) {
    const thresholds = inputPayload?.thresholds && typeof inputPayload.thresholds === 'object'
        ? inputPayload.thresholds
        : {};

    return {
        maxProjectedHarm: clamp(safeNumber(thresholds.maxProjectedHarm, 48)),
        minSafeguardCoverage: clamp(safeNumber(thresholds.minSafeguardCoverage, 62)),
        minAccessCoverage: clamp(safeNumber(thresholds.minAccessCoverage, 58)),
        maxVulnerabilityWeightedRisk: clamp(safeNumber(thresholds.maxVulnerabilityWeightedRisk, 56))
    };
}

function evaluatePopulation(population, interventions, thresholds) {
    let harmDelta = 0;
    let accessDelta = 0;
    let safeguardDelta = 0;
    let interventionRisk = 0;

    for (const intervention of interventions) {
        const effect = intervention.effects?.[population.id] && typeof intervention.effects[population.id] === 'object'
            ? intervention.effects[population.id]
            : {};
        const factor = intervention.rolloutCoverage / 100;
        harmDelta += safeNumber(effect.harmDelta, 0) * factor;
        accessDelta += safeNumber(effect.accessDelta, 0) * factor;
        safeguardDelta += safeNumber(effect.safeguardDelta, 0) * factor;
        interventionRisk += intervention.riskScore * factor * 0.12;
    }

    const projectedHarm = clamp(population.currentHarmExposure + harmDelta);
    const projectedAccess = clamp(population.accessCoverage + accessDelta);
    const projectedSafeguard = clamp(population.safeguardCoverage + safeguardDelta);

    const vulnerabilityWeightedRisk = clamp(Math.round(
        projectedHarm * (population.vulnerabilityIndex / 100)
        + (100 - projectedSafeguard) * 0.34
        + (100 - projectedAccess) * 0.22
        + interventionRisk
    ));

    let posture = 'protected';
    if (
        projectedHarm > thresholds.maxProjectedHarm
        || vulnerabilityWeightedRisk > thresholds.maxVulnerabilityWeightedRisk
    ) {
        posture = 'blocked';
    } else if (
        projectedSafeguard < thresholds.minSafeguardCoverage
        || projectedAccess < thresholds.minAccessCoverage
    ) {
        posture = 'review_required';
    }

    return {
        populationId: population.id,
        populationName: population.name,
        populationSize: population.populationSize,
        vulnerabilityIndex: population.vulnerabilityIndex,
        current: {
            harmExposure: population.currentHarmExposure,
            accessCoverage: population.accessCoverage,
            safeguardCoverage: population.safeguardCoverage
        },
        projected: {
            harmExposure: Number(projectedHarm.toFixed(2)),
            accessCoverage: Number(projectedAccess.toFixed(2)),
            safeguardCoverage: Number(projectedSafeguard.toFixed(2))
        },
        deltas: {
            harmDelta: Number(harmDelta.toFixed(2)),
            accessDelta: Number(accessDelta.toFixed(2)),
            safeguardDelta: Number(safeguardDelta.toFixed(2))
        },
        vulnerabilityWeightedRisk,
        posture
    };
}

function summarizePopulationEvaluations(evaluations) {
    const weightedRisk = evaluations.reduce((acc, row) => (
        acc + row.vulnerabilityWeightedRisk * row.populationSize
    ), 0);
    const totalPopulation = evaluations.reduce((acc, row) => acc + row.populationSize, 0);
    const avgWeightedRisk = totalPopulation > 0
        ? Number((weightedRisk / totalPopulation).toFixed(2))
        : 0;

    return {
        populationCount: evaluations.length,
        totalPopulation,
        blockedCount: evaluations.filter((row) => row.posture === 'blocked').length,
        reviewRequiredCount: evaluations.filter((row) => row.posture === 'review_required').length,
        protectedCount: evaluations.filter((row) => row.posture === 'protected').length,
        avgWeightedRisk
    };
}

function buildAlerts(evaluations, summary) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('vulnerable_population_harm_blocked');
    if (summary.reviewRequiredCount > 0) alerts.push('vulnerable_population_review_required');
    if (evaluations.some((row) => row.projected.accessCoverage < 50)) alerts.push('vulnerable_access_gap');
    if (evaluations.some((row) => row.projected.safeguardCoverage < 55)) alerts.push('safeguard_coverage_gap');
    return alerts;
}

function buildRecommendations(evaluations, alerts) {
    const recommendations = [];
    for (const row of evaluations) {
        if (row.posture === 'blocked') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'pause_high_harm_rollout',
                populationId: row.populationId,
                title: `Pause rollout for vulnerable population ${row.populationName}`,
                description: `Projected harm ${row.projected.harmExposure} with weighted risk ${row.vulnerabilityWeightedRisk}.`,
                priority: 'P0'
            });

            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'deploy_targeted_safeguard',
                populationId: row.populationId,
                title: `Deploy targeted safeguards for ${row.populationName}`,
                description: 'Immediate safeguards required before any additional rollout.',
                priority: 'P1'
            });
        } else if (row.posture === 'review_required') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'deploy_targeted_safeguard',
                populationId: row.populationId,
                title: `Strengthen safeguards for ${row.populationName}`,
                description: 'Population requires improved safeguards prior to full approval.',
                priority: 'P2'
            });
        }

        if (row.projected.accessCoverage < 58 || row.projected.safeguardCoverage < 62) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'expand_support_coverage',
                populationId: row.populationId,
                title: `Expand support coverage for ${row.populationName}`,
                description: 'Projected access or safeguard coverage is below target threshold.',
                priority: row.posture === 'blocked' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'monitor_vulnerable_outcomes',
            title: 'Increase monitoring for vulnerable population outcomes',
            description: 'Continuous monitoring required while safeguards and support interventions are applied.',
            priority: alerts.includes('vulnerable_population_harm_blocked') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.populationId || '').localeCompare(String(b.populationId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.populationId || '') === String(entry.populationId || '')
        )) === index);
}

export function evaluateVulnerablePopulationSafeguards(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const populations = normalizePopulations(inputPayload || {});
    const interventions = normalizeInterventions(inputPayload || {});
    const thresholds = normalizeThresholds(inputPayload || {});

    const evaluations = populations.map((population) => (
        evaluatePopulation(population, interventions, thresholds)
    )).sort((a, b) => {
        const postureRank = { blocked: 0, review_required: 1, protected: 2 };
        const p = postureRank[a.posture] - postureRank[b.posture];
        if (p !== 0) return p;
        return b.vulnerabilityWeightedRisk - a.vulnerabilityWeightedRisk;
    });

    const summary = summarizePopulationEvaluations(evaluations);
    const alerts = buildAlerts(evaluations, summary);
    const recommendations = buildRecommendations(evaluations, alerts);

    return {
        at,
        thresholds,
        populations: evaluations,
        interventions: interventions.map((entry) => clone(entry)),
        summary,
        alerts,
        recommendations
    };
}

export function vulnerableSafeguardToTasks(reportPayload, {
    fromAgentId = 'agent:vulnerable-safeguard',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('vulnerableSafeguardToTasks requires report payload');
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
            populationId: recommendation.populationId || null,
            blockedCount: reportPayload.summary?.blockedCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class VulnerablePopulationSafeguard {
    constructor({
        localAgentId = 'agent:vulnerable-safeguard',
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
        const report = evaluateVulnerablePopulationSafeguards(inputPayload, {
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
        return vulnerableSafeguardToTasks(reportPayload, {
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

export const __vulnerableSafeguardInternals = {
    normalizePopulations,
    normalizeInterventions,
    normalizeThresholds,
    evaluatePopulation,
    summarizePopulationEvaluations,
    buildRecommendations
};
