import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    prioritize_high_roi_intervention: 'agent:strategy',
    redesign_negative_npv_intervention: 'agent:planning',
    run_economic_sensitivity_analysis: 'agent:analysis'
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

function normalizeInterventions(inputPayload) {
    const source = Array.isArray(inputPayload?.interventions)
        ? inputPayload.interventions
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            interventionId: typeof entry.interventionId === 'string' && entry.interventionId.trim()
                ? entry.interventionId.trim()
                : `intervention-${index + 1}`,
            upfrontCost: Math.max(0, safeNumber(entry.upfrontCost, 0)),
            annualBenefit: Math.max(0, safeNumber(entry.annualBenefit, 0)),
            annualCost: Math.max(0, safeNumber(entry.annualCost, 0)),
            probabilityOfSuccess: clamp(safeNumber(entry.probabilityOfSuccess, 65)),
            horizonYears: Math.max(1, Math.floor(safeNumber(entry.horizonYears, 3))),
            externalityImpact: safeNumber(entry.externalityImpact, 0)
        }));
}

function simulateIntervention(intervention, discountRate) {
    const rate = Math.max(0, discountRate / 100);
    let discountedNet = -intervention.upfrontCost;

    for (let year = 1; year <= intervention.horizonYears; year++) {
        const annualNet = (intervention.annualBenefit - intervention.annualCost) * (intervention.probabilityOfSuccess / 100);
        discountedNet += annualNet / Math.pow(1 + rate, year);
    }

    discountedNet += intervention.externalityImpact;

    const roi = intervention.upfrontCost > 0
        ? (discountedNet / intervention.upfrontCost) * 100
        : discountedNet > 0
            ? 100
            : 0;

    const confidenceAdjustedValue = discountedNet * (0.5 + (intervention.probabilityOfSuccess / 200));

    return {
        interventionId: intervention.interventionId,
        npv: Number(discountedNet.toFixed(2)),
        roi: Number(roi.toFixed(2)),
        confidenceAdjustedValue: Number(confidenceAdjustedValue.toFixed(2)),
        probabilityOfSuccess: intervention.probabilityOfSuccess,
        horizonYears: intervention.horizonYears,
        externalityImpact: intervention.externalityImpact,
        viability: discountedNet > 0
    };
}

function summarizeSimulation(rows) {
    const viableCount = rows.filter((row) => row.viability).length;
    const negativeNpvCount = rows.filter((row) => row.npv <= 0).length;
    const avgRoi = rows.length > 0
        ? Number((rows.reduce((acc, row) => acc + row.roi, 0) / rows.length).toFixed(2))
        : 0;

    let posture = 'favorable';
    if (negativeNpvCount > 0 || avgRoi < 15) posture = 'mixed';
    if (viableCount === 0 || avgRoi < 0) posture = 'unfavorable';

    return {
        interventionCount: rows.length,
        viableCount,
        negativeNpvCount,
        avgRoi,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.negativeNpvCount > 0) alerts.push('negative_npv_interventions_present');
    if (summary.avgRoi < 10) alerts.push('portfolio_roi_low');
    if (summary.viableCount === 0 && summary.interventionCount > 0) alerts.push('no_viable_interventions');
    return alerts;
}

function buildRecommendations(rows, summary) {
    const recommendations = [];

    for (const row of rows) {
        if (row.viability && row.roi >= 10) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'prioritize_high_roi_intervention',
                interventionId: row.interventionId,
                title: `Prioritize ${row.interventionId}`,
                description: `NPV ${row.npv} with ROI ${row.roi}%.`,
                priority: row.roi >= 30 ? 'P1' : 'P2'
            });
        }

        if (!row.viability || row.npv < 0) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'redesign_negative_npv_intervention',
                interventionId: row.interventionId,
                title: `Redesign ${row.interventionId}`,
                description: `Intervention has non-positive NPV (${row.npv}).`,
                priority: row.npv < -50_000 ? 'P1' : 'P2'
            });
        }
    }

    if (summary.interventionCount > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'run_economic_sensitivity_analysis',
            title: 'Run economic sensitivity analysis',
            description: 'Stress test outcomes against discount rate and success probability shifts.',
            priority: summary.posture === 'unfavorable' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.interventionId || '').localeCompare(String(b.interventionId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.interventionId || '') === String(entry.interventionId || '')
        )) === index);
}

export function simulateEconomicCostBenefit(inputPayload, {
    now = Date.now,
    discountRate = 9
} = {}) {
    const at = safeNow(now);
    const interventions = normalizeInterventions(inputPayload || {});
    const simulationRows = interventions
        .map((intervention) => simulateIntervention(intervention, discountRate))
        .sort((a, b) => b.npv - a.npv);
    const summary = summarizeSimulation(simulationRows);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(simulationRows, summary);

    return {
        at,
        summary,
        simulationRows,
        alerts,
        recommendations
    };
}

export function economicSimulationToTasks(reportPayload, {
    fromAgentId = 'agent:economic-simulator',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('economicSimulationToTasks requires report payload');
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
            interventionId: recommendation.interventionId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class EconomicCostBenefitSimulator {
    constructor({
        localAgentId = 'agent:economic-simulator',
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
        const report = simulateEconomicCostBenefit(inputPayload, {
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
        return economicSimulationToTasks(reportPayload, {
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

export const __economicCostBenefitSimulatorInternals = {
    normalizeInterventions,
    simulateIntervention,
    summarizeSimulation,
    buildRecommendations
};
