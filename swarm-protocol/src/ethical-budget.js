import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    approve_ethical_portfolio: 'agent:finance',
    review_budget_tradeoff: 'agent:review',
    de_risk_initiative: 'agent:safety',
    request_budget_adjustment: 'agent:finance',
    publish_budget_ethics_brief: 'agent:ops'
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

function normalizeInitiatives(inputPayload) {
    const entries = Array.isArray(inputPayload?.initiatives)
        ? inputPayload.initiatives
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `initiative-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Initiative ${index + 1}`,
        costUsd: Math.max(0, safeNumber(entry?.costUsd, 0)),
        benefitScore: clamp(safeNumber(entry?.benefitScore, 55)),
        equityScore: clamp(safeNumber(entry?.equityScore, 55)),
        urgencyScore: clamp(safeNumber(entry?.urgencyScore, 55)),
        riskScore: clamp(safeNumber(entry?.riskScore, 35)),
        complianceConfidence: clamp(safeNumber(entry?.complianceConfidence, 70))
    }));
}

function normalizeBudget(inputPayload) {
    const budget = inputPayload?.budget && typeof inputPayload.budget === 'object'
        ? inputPayload.budget
        : {};
    const totalBudgetUsd = Math.max(0, safeNumber(budget.totalBudgetUsd, 0));
    const reservePercent = clamp(safeNumber(budget.reservePercent, 0), 0, 60);
    const reserveUsdInput = Math.max(0, safeNumber(budget.reserveUsd, totalBudgetUsd * (reservePercent / 100)));
    const reserveUsd = Math.min(totalBudgetUsd, reserveUsdInput);

    return {
        totalBudgetUsd: Number(totalBudgetUsd.toFixed(2)),
        reserveUsd: Number(reserveUsd.toFixed(2)),
        availableBudgetUsd: Number(Math.max(0, totalBudgetUsd - reserveUsd).toFixed(2))
    };
}

function normalizePolicy(inputPayload) {
    const policy = inputPayload?.policy && typeof inputPayload.policy === 'object'
        ? inputPayload.policy
        : {};

    return {
        benefitWeight: clamp(safeNumber(policy.benefitWeight, 0.32), 0, 1),
        equityWeight: clamp(safeNumber(policy.equityWeight, 0.24), 0, 1),
        urgencyWeight: clamp(safeNumber(policy.urgencyWeight, 0.16), 0, 1),
        complianceWeight: clamp(safeNumber(policy.complianceWeight, 0.12), 0, 1),
        riskPenaltyWeight: clamp(safeNumber(policy.riskPenaltyWeight, 0.18), 0, 1),
        costPenaltyWeight: clamp(safeNumber(policy.costPenaltyWeight, 0.1), 0, 1),
        minEthicalScore: clamp(safeNumber(policy.minEthicalScore, 55), 1, 100),
        maxAverageRisk: clamp(safeNumber(policy.maxAverageRisk, 68), 1, 100),
        minPortfolioSize: Math.max(1, Math.floor(safeNumber(policy.minPortfolioSize, 1))),
        maxPortfolioSize: Math.max(1, Math.floor(safeNumber(policy.maxPortfolioSize, 4)))
    };
}

function evaluateInitiative(initiative) {
    const valueScore = clamp(Math.round(
        initiative.benefitScore * 0.4
        + initiative.equityScore * 0.3
        + initiative.urgencyScore * 0.2
        + initiative.complianceConfidence * 0.1
    ));
    const riskAdjustedValue = clamp(Math.round(
        valueScore - initiative.riskScore * 0.3
    ));
    const valuePer1kUsd = initiative.costUsd > 0
        ? Number((riskAdjustedValue / (initiative.costUsd / 1_000)).toFixed(4))
        : riskAdjustedValue;

    return {
        ...initiative,
        valueScore,
        riskAdjustedValue,
        valuePer1kUsd
    };
}

function subsetFromMask(items, mask) {
    const subset = [];
    for (let i = 0; i < items.length; i++) {
        if ((mask & (1 << i)) !== 0) subset.push(items[i]);
    }
    return subset;
}

function buildPortfolioCandidates(initiatives, policy) {
    const evaluated = initiatives.map((initiative) => evaluateInitiative(initiative));
    if (evaluated.length === 0) return [];

    if (evaluated.length > 14) {
        const ranked = [...evaluated].sort((a, b) => {
            if (b.valuePer1kUsd !== a.valuePer1kUsd) return b.valuePer1kUsd - a.valuePer1kUsd;
            return b.riskAdjustedValue - a.riskAdjustedValue;
        });
        const selected = ranked.slice(0, policy.maxPortfolioSize);
        if (selected.length < policy.minPortfolioSize) return [];
        return [selected];
    }

    const subsets = [];
    const totalMasks = 1 << evaluated.length;
    for (let mask = 1; mask < totalMasks; mask++) {
        const subset = subsetFromMask(evaluated, mask);
        if (subset.length < policy.minPortfolioSize || subset.length > policy.maxPortfolioSize) continue;
        subsets.push(subset);
    }
    return subsets;
}

function evaluatePortfolio(portfolio, budget, policy, rank) {
    const totalCostUsd = Number(portfolio.reduce((acc, entry) => acc + entry.costUsd, 0).toFixed(2));
    const avgBenefit = Number((portfolio.reduce((acc, entry) => acc + entry.benefitScore, 0) / portfolio.length).toFixed(2));
    const avgEquity = Number((portfolio.reduce((acc, entry) => acc + entry.equityScore, 0) / portfolio.length).toFixed(2));
    const avgUrgency = Number((portfolio.reduce((acc, entry) => acc + entry.urgencyScore, 0) / portfolio.length).toFixed(2));
    const avgCompliance = Number((portfolio.reduce((acc, entry) => acc + entry.complianceConfidence, 0) / portfolio.length).toFixed(2));
    const avgRisk = Number((portfolio.reduce((acc, entry) => acc + entry.riskScore, 0) / portfolio.length).toFixed(2));
    const avgRiskAdjustedValue = Number((portfolio.reduce((acc, entry) => acc + entry.riskAdjustedValue, 0) / portfolio.length).toFixed(2));
    const budgetPressure = budget.availableBudgetUsd > 0
        ? clamp((totalCostUsd / budget.availableBudgetUsd) * 100)
        : (totalCostUsd > 0 ? 100 : 0);

    const ethicalScore = clamp(Math.round(
        avgBenefit * policy.benefitWeight
        + avgEquity * policy.equityWeight
        + avgUrgency * policy.urgencyWeight
        + avgCompliance * policy.complianceWeight
        - avgRisk * policy.riskPenaltyWeight
        - budgetPressure * policy.costPenaltyWeight
        + (avgRisk <= policy.maxAverageRisk ? 6 : 0)
    ));

    const utilityScore = clamp(Math.round(
        ethicalScore * 0.6
        + (100 - budgetPressure) * 0.2
        + avgRiskAdjustedValue * 0.2
    ));

    const violations = [];
    if (totalCostUsd > budget.availableBudgetUsd) violations.push('budget_exceeded');
    if (avgRisk > policy.maxAverageRisk) violations.push('risk_above_policy');
    if (ethicalScore < policy.minEthicalScore) violations.push('ethical_score_below_threshold');

    let posture = 'viable';
    if (violations.length > 0) {
        const severe = (
            totalCostUsd > budget.availableBudgetUsd * 1.2
            || avgRisk > policy.maxAverageRisk + 10
            || ethicalScore < policy.minEthicalScore - 10
        );
        posture = severe ? 'blocked' : 'review_required';
    }

    return {
        portfolioId: `portfolio-${rank + 1}`,
        posture,
        initiativeIds: portfolio.map((entry) => entry.id),
        initiatives: portfolio.map((entry) => ({
            id: entry.id,
            name: entry.name,
            costUsd: entry.costUsd,
            benefitScore: entry.benefitScore,
            equityScore: entry.equityScore,
            urgencyScore: entry.urgencyScore,
            riskScore: entry.riskScore,
            complianceConfidence: entry.complianceConfidence,
            riskAdjustedValue: entry.riskAdjustedValue
        })),
        totalCostUsd,
        budgetPressure: Number(budgetPressure.toFixed(2)),
        avgBenefit,
        avgEquity,
        avgUrgency,
        avgCompliance,
        avgRisk,
        ethicalScore,
        utilityScore,
        violations
    };
}

function rankPortfolios(initiatives, budget, policy) {
    const candidates = buildPortfolioCandidates(initiatives, policy);
    const evaluated = candidates.map((portfolio, index) => (
        evaluatePortfolio(portfolio, budget, policy, index)
    ));

    const postureRank = { viable: 0, review_required: 1, blocked: 2 };
    return evaluated.sort((a, b) => {
        const p = postureRank[a.posture] - postureRank[b.posture];
        if (p !== 0) return p;
        if (b.utilityScore !== a.utilityScore) return b.utilityScore - a.utilityScore;
        return a.totalCostUsd - b.totalCostUsd;
    });
}

function summarizePortfolios(portfolios, selected) {
    return {
        portfolioCount: portfolios.length,
        viableCount: portfolios.filter((entry) => entry.posture === 'viable').length,
        reviewRequiredCount: portfolios.filter((entry) => entry.posture === 'review_required').length,
        blockedCount: portfolios.filter((entry) => entry.posture === 'blocked').length,
        selectedPortfolioId: selected?.portfolioId || null,
        selectedPosture: selected?.posture || 'none',
        selectedEthicalScore: selected?.ethicalScore ?? 0,
        selectedUtilityScore: selected?.utilityScore ?? 0,
        selectedTotalCostUsd: selected?.totalCostUsd ?? 0
    };
}

function buildAlerts(selected, summary, policy, budget) {
    const alerts = [];
    if (summary.viableCount === 0) alerts.push('no_feasible_ethical_portfolio');
    if (!selected) {
        alerts.push('no_portfolio_candidates');
        return alerts;
    }
    if (selected.totalCostUsd > budget.availableBudgetUsd) alerts.push('budget_exceeded');
    if (selected.avgRisk > policy.maxAverageRisk) alerts.push('risk_above_policy');
    if (selected.ethicalScore < policy.minEthicalScore) alerts.push('ethical_score_below_threshold');
    if (selected.initiatives.some((entry) => entry.riskScore >= 85)) alerts.push('high_risk_initiative_selected');
    if (budget.availableBudgetUsd <= 0) alerts.push('no_budget_available');
    return alerts;
}

function buildRecommendations(selected, alerts, summary) {
    const recommendations = [];
    if (!selected) return recommendations;

    if (selected.posture === 'viable') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'approve_ethical_portfolio',
            portfolioId: selected.portfolioId,
            title: 'Approve ethical portfolio for execution',
            description: `Ethical score ${selected.ethicalScore} within risk and budget thresholds.`,
            priority: 'P1'
        });
    } else {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'review_budget_tradeoff',
            portfolioId: selected.portfolioId,
            title: 'Run budget-vs-ethics tradeoff review',
            description: 'Selected portfolio requires policy review before approval.',
            priority: selected.posture === 'blocked' ? 'P0' : 'P1'
        });
    }

    if (alerts.includes('risk_above_policy') || alerts.includes('high_risk_initiative_selected')) {
        for (const initiative of selected.initiatives.filter((entry) => entry.riskScore >= 70)) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'de_risk_initiative',
                portfolioId: selected.portfolioId,
                initiativeId: initiative.id,
                title: `De-risk initiative ${initiative.name}`,
                description: `Risk score ${initiative.riskScore} exceeds comfort threshold.`,
                priority: initiative.riskScore >= 85 ? 'P0' : 'P1'
            });
        }
    }

    if (alerts.includes('budget_exceeded') || alerts.includes('no_feasible_ethical_portfolio')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'request_budget_adjustment',
            portfolioId: selected.portfolioId,
            title: 'Request ethical budget adjustment',
            description: `Current budget cannot support a compliant portfolio posture (unmet viability count: ${summary.viableCount}).`,
            priority: alerts.includes('no_feasible_ethical_portfolio') ? 'P0' : 'P1'
        });
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_budget_ethics_brief',
            portfolioId: selected.portfolioId,
            title: 'Publish budget ethics brief',
            description: 'Share selected portfolio rationale, constraints, and remediation plan.',
            priority: alerts.includes('no_feasible_ethical_portfolio') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.initiativeId || '').localeCompare(String(b.initiativeId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.portfolioId || '') === String(entry.portfolioId || '')
            && String(other.initiativeId || '') === String(entry.initiativeId || '')
        )) === index);
}

export function optimizeEthicalBudget(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const initiatives = normalizeInitiatives(inputPayload || {});
    const budget = normalizeBudget(inputPayload || {});
    const policy = normalizePolicy(inputPayload || {});
    const portfolios = rankPortfolios(initiatives, budget, policy);
    const selectedPortfolio = portfolios[0] || null;
    const summary = summarizePortfolios(portfolios, selectedPortfolio);
    const alerts = buildAlerts(selectedPortfolio, summary, policy, budget);
    const recommendations = buildRecommendations(selectedPortfolio, alerts, summary);

    return {
        at,
        budget,
        policy,
        summary,
        selectedPortfolio,
        topPortfolios: portfolios.slice(0, 10),
        alerts,
        recommendations
    };
}

export function ethicalBudgetToTasks(reportPayload, {
    fromAgentId = 'agent:budget',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('ethicalBudgetToTasks requires report payload');
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
            portfolioId: recommendation.portfolioId || null,
            initiativeId: recommendation.initiativeId || null,
            selectedEthicalScore: reportPayload.summary?.selectedEthicalScore ?? null
        },
        createdAt: nowMs + index
    }));
}

export class EthicalBudgetOptimizer {
    constructor({
        localAgentId = 'agent:budget',
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
        const report = optimizeEthicalBudget(inputPayload, {
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
        return ethicalBudgetToTasks(reportPayload, {
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

export const __ethicalBudgetInternals = {
    normalizeInitiatives,
    normalizeBudget,
    normalizePolicy,
    evaluateInitiative,
    rankPortfolios,
    buildRecommendations
};
