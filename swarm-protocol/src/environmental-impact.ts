import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    reduce_carbon_intensity: 'agent:sustainability',
    improve_water_efficiency: 'agent:ops',
    minimize_material_waste: 'agent:supply',
    publish_environmental_disclosure: 'agent:ops'
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

function normalizeActivities(inputPayload) {
    const entries = Array.isArray(inputPayload?.activities)
        ? inputPayload.activities
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `activity-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Activity ${index + 1}`,
        region: typeof entry?.region === 'string' && entry.region.trim()
            ? entry.region.trim()
            : 'global',
        energyKwh: clamp(safeNumber(entry?.energyKwh, 0), 0, 1_000_000_000),
        renewableShare: clamp(safeNumber(entry?.renewableShare, 0)),
        travelKm: clamp(safeNumber(entry?.travelKm, 0), 0, 1_000_000_000),
        cloudComputeHours: clamp(safeNumber(entry?.cloudComputeHours, 0), 0, 1_000_000_000),
        waterLiters: clamp(safeNumber(entry?.waterLiters, 0), 0, 1_000_000_000),
        wasteKg: clamp(safeNumber(entry?.wasteKg, 0), 0, 1_000_000_000),
        materialCircularity: clamp(safeNumber(entry?.materialCircularity, 45)),
        biodiversityRisk: clamp(safeNumber(entry?.biodiversityRisk, 30))
    }));
}

function normalizeFactors(inputPayload) {
    const factors = inputPayload?.factors && typeof inputPayload.factors === 'object'
        ? inputPayload.factors
        : {};

    const regionalStressInput = factors.regionalStress && typeof factors.regionalStress === 'object'
        ? factors.regionalStress
        : {};

    const regionalStress = {};
    for (const [region, multiplier] of Object.entries(regionalStressInput)) {
        if (typeof region !== 'string' || !region.trim()) continue;
        regionalStress[region.trim()] = clamp(safeNumber(multiplier, 1), 0.5, 3);
    }

    return {
        kgCo2PerKwh: clamp(safeNumber(factors.kgCo2PerKwh, 0.42), 0, 3),
        kgCo2PerTravelKm: clamp(safeNumber(factors.kgCo2PerTravelKm, 0.19), 0, 3),
        kgCo2PerComputeHour: clamp(safeNumber(factors.kgCo2PerComputeHour, 0.08), 0, 3),
        kgCo2PerWasteKg: clamp(safeNumber(factors.kgCo2PerWasteKg, 1.2), 0, 6),
        waterStressMultiplier: clamp(safeNumber(factors.waterStressMultiplier, 1), 0.5, 3),
        regionalStress
    };
}

function normalizeThresholds(inputPayload) {
    const thresholds = inputPayload?.thresholds && typeof inputPayload.thresholds === 'object'
        ? inputPayload.thresholds
        : {};

    return {
        maxCarbonKg: clamp(safeNumber(thresholds.maxCarbonKg, 900), 1, 1_000_000_000),
        maxWaterLiters: clamp(safeNumber(thresholds.maxWaterLiters, 10_000), 1, 1_000_000_000),
        maxWasteKg: clamp(safeNumber(thresholds.maxWasteKg, 100), 1, 1_000_000_000),
        maxImpactScore: clamp(safeNumber(thresholds.maxImpactScore, 64), 1, 100),
        maxPortfolioCarbonKg: clamp(safeNumber(thresholds.maxPortfolioCarbonKg, 1_400), 1, 1_000_000_000)
    };
}

function getWaterStressMultiplier(factors, region) {
    if (typeof region === 'string' && region.trim() && factors.regionalStress[region.trim()] !== undefined) {
        return factors.regionalStress[region.trim()];
    }
    return factors.waterStressMultiplier;
}

function evaluateActivity(activity, factors, thresholds) {
    const renewableRatio = clamp(activity.renewableShare, 0, 100) / 100;
    const effectiveEnergyKwh = activity.energyKwh * (1 - renewableRatio);
    const wasteMultiplier = clamp(1 - (activity.materialCircularity / 140), 0.25, 1);
    const waterStress = getWaterStressMultiplier(factors, activity.region);

    const carbon = {
        energyKg: Number((effectiveEnergyKwh * factors.kgCo2PerKwh).toFixed(2)),
        travelKg: Number((activity.travelKm * factors.kgCo2PerTravelKm).toFixed(2)),
        computeKg: Number((activity.cloudComputeHours * factors.kgCo2PerComputeHour).toFixed(2)),
        wasteKg: Number((activity.wasteKg * factors.kgCo2PerWasteKg * wasteMultiplier).toFixed(2))
    };
    carbon.totalKg = Number((carbon.energyKg + carbon.travelKg + carbon.computeKg + carbon.wasteKg).toFixed(2));

    const adjustedWaterLiters = Number((activity.waterLiters * waterStress).toFixed(2));

    const carbonPressure = clamp((carbon.totalKg / thresholds.maxCarbonKg) * 100);
    const waterPressure = clamp((adjustedWaterLiters / thresholds.maxWaterLiters) * 100);
    const wastePressure = clamp((activity.wasteKg / thresholds.maxWasteKg) * 100);

    const impactScore = clamp(Math.round(
        carbonPressure * 0.44
        + waterPressure * 0.24
        + wastePressure * 0.17
        + activity.biodiversityRisk * 0.15
    ));

    const exceedances = [];
    if (carbon.totalKg > thresholds.maxCarbonKg) exceedances.push('carbon_limit_exceeded');
    if (adjustedWaterLiters > thresholds.maxWaterLiters) exceedances.push('water_limit_exceeded');
    if (activity.wasteKg > thresholds.maxWasteKg) exceedances.push('waste_limit_exceeded');
    if (impactScore > thresholds.maxImpactScore) exceedances.push('impact_score_exceeded');

    let posture = 'sustainable';
    const severe = (
        carbon.totalKg > thresholds.maxCarbonKg * 1.2
        || adjustedWaterLiters > thresholds.maxWaterLiters * 1.2
        || activity.wasteKg > thresholds.maxWasteKg * 1.4
        || impactScore > thresholds.maxImpactScore + 15
    );
    if (severe) {
        posture = 'blocked';
    } else if (exceedances.length > 0) {
        posture = 'review_required';
    }

    return {
        activityId: activity.id,
        activityName: activity.name,
        region: activity.region,
        inputs: clone(activity),
        waterStressMultiplier: waterStress,
        carbonKg: carbon,
        adjustedWaterLiters,
        impactScore,
        exceedances,
        posture
    };
}

function summarizeEvaluations(evaluations) {
    const totalCarbonKg = Number(evaluations.reduce((acc, row) => (
        acc + row.carbonKg.totalKg
    ), 0).toFixed(2));
    const totalAdjustedWaterLiters = Number(evaluations.reduce((acc, row) => (
        acc + row.adjustedWaterLiters
    ), 0).toFixed(2));
    const totalWasteKg = Number(evaluations.reduce((acc, row) => (
        acc + row.inputs.wasteKg
    ), 0).toFixed(2));
    const avgImpactScore = evaluations.length > 0
        ? Number((evaluations.reduce((acc, row) => acc + row.impactScore, 0) / evaluations.length).toFixed(2))
        : 0;

    return {
        activityCount: evaluations.length,
        sustainableCount: evaluations.filter((row) => row.posture === 'sustainable').length,
        reviewRequiredCount: evaluations.filter((row) => row.posture === 'review_required').length,
        blockedCount: evaluations.filter((row) => row.posture === 'blocked').length,
        totalCarbonKg,
        totalAdjustedWaterLiters,
        totalWasteKg,
        avgImpactScore
    };
}

function buildAlerts(summary, evaluations, thresholds) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('environmental_blockers_detected');
    if (summary.totalCarbonKg > thresholds.maxPortfolioCarbonKg) alerts.push('portfolio_carbon_budget_exceeded');
    if (evaluations.some((row) => row.adjustedWaterLiters > thresholds.maxWaterLiters)) alerts.push('water_stress_detected');
    if (evaluations.some((row) => row.inputs.biodiversityRisk >= 80)) alerts.push('biodiversity_risk_high');
    if (summary.avgImpactScore > thresholds.maxImpactScore) alerts.push('portfolio_impact_elevated');
    return alerts;
}

function buildRecommendations(evaluations, alerts, thresholds) {
    const recommendations = [];
    for (const row of evaluations) {
        if (row.posture === 'blocked') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'reduce_carbon_intensity',
                activityId: row.activityId,
                title: `Reduce environmental load for ${row.activityName}`,
                description: `Impact ${row.impactScore} with ${row.carbonKg.totalKg} kgCO2e total carbon.`,
                priority: 'P0'
            });
        } else if (row.posture === 'review_required') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'reduce_carbon_intensity',
                activityId: row.activityId,
                title: `Run carbon reduction plan for ${row.activityName}`,
                description: 'Activity exceeds at least one environmental threshold and needs mitigation.',
                priority: 'P1'
            });
        }

        if (row.adjustedWaterLiters > thresholds.maxWaterLiters || row.waterStressMultiplier > 1.2) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'improve_water_efficiency',
                activityId: row.activityId,
                title: `Improve water efficiency in ${row.activityName}`,
                description: `Adjusted water usage is ${row.adjustedWaterLiters} liters.`,
                priority: row.posture === 'blocked' ? 'P1' : 'P2'
            });
        }

        if (row.inputs.wasteKg > thresholds.maxWasteKg || row.inputs.materialCircularity < 50) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'minimize_material_waste',
                activityId: row.activityId,
                title: `Minimize material waste for ${row.activityName}`,
                description: 'Waste profile or circularity score is below sustainability target.',
                priority: row.posture === 'blocked' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_environmental_disclosure',
            title: 'Publish environmental impact disclosure update',
            description: 'Share current environmental posture, mitigation status, and ownership.',
            priority: alerts.includes('environmental_blockers_detected') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.activityId || '').localeCompare(String(b.activityId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.activityId || '') === String(entry.activityId || '')
        )) === index);
}

export function estimateEnvironmentalImpact(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const activities = normalizeActivities(inputPayload || {});
    const factors = normalizeFactors(inputPayload || {});
    const thresholds = normalizeThresholds(inputPayload || {});

    const evaluations = activities.map((activity) => (
        evaluateActivity(activity, factors, thresholds)
    )).sort((a, b) => {
        const postureRank = { blocked: 0, review_required: 1, sustainable: 2 };
        const p = postureRank[a.posture] - postureRank[b.posture];
        if (p !== 0) return p;
        return b.impactScore - a.impactScore;
    });

    const summary = summarizeEvaluations(evaluations);
    const alerts = buildAlerts(summary, evaluations, thresholds);
    const recommendations = buildRecommendations(evaluations, alerts, thresholds);

    return {
        at,
        factors,
        thresholds,
        activities: evaluations,
        summary,
        alerts,
        recommendations
    };
}

export function environmentalRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:environment',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('environmentalRecommendationsToTasks requires report payload');
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
            activityId: recommendation.activityId || null,
            totalCarbonKg: reportPayload.summary?.totalCarbonKg || 0
        },
        createdAt: nowMs + index
    }));
}

export class EnvironmentalImpactEstimator {
    constructor({
        localAgentId = 'agent:environment',
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
        const report = estimateEnvironmentalImpact(inputPayload, {
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
        return environmentalRecommendationsToTasks(reportPayload, {
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

export const __environmentalImpactInternals = {
    normalizeActivities,
    normalizeFactors,
    normalizeThresholds,
    evaluateActivity,
    summarizeEvaluations,
    buildRecommendations
};
