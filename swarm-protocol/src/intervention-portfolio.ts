import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';
import { simulateSocietalOutcomes } from './societal-outcome.js';

const RecommendationTargetMap = {
    adopt_portfolio: 'agent:ops',
    review_portfolio: 'agent:review',
    rebalance_portfolio: 'agent:planner'
};

const RecommendationPriorityMap = {
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

function clamp100(value) {
    return Math.max(0, Math.min(100, value));
}

function normalizeInterventions(inputPayload) {
    const entries = Array.isArray(inputPayload?.interventions)
        ? inputPayload.interventions
        : [];

    return entries.map((entry, index) => {
        const id = typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `intervention-${index + 1}`;
        return {
            id,
            name: typeof entry?.name === 'string' && entry.name.trim()
                ? entry.name.trim()
                : `Intervention ${index + 1}`,
            type: typeof entry?.type === 'string' && entry.type.trim()
                ? entry.type.trim().toLowerCase()
                : 'general',
            costUsd: Math.max(0, safeNumber(entry?.costUsd, 0)),
            riskScore: clamp100(safeNumber(entry?.riskScore, 20)),
            rolloutDays: Math.max(1, Math.floor(safeNumber(entry?.rolloutDays, 7))),
            effects: {
                humanity: safeNumber(entry?.effects?.humanity, 0),
                truth: safeNumber(entry?.effects?.truth, 0),
                curiosity: safeNumber(entry?.effects?.curiosity, 0),
                reliability: safeNumber(entry?.effects?.reliability, 0)
            }
        };
    });
}

function normalizeConstraints(inputPayload) {
    const interventionCount = Array.isArray(inputPayload?.interventions)
        ? inputPayload.interventions.length
        : 0;

    const budgetUsd = safeNumber(inputPayload?.constraints?.budgetUsd, Infinity);
    const maxRiskScore = clamp100(safeNumber(inputPayload?.constraints?.maxRiskScore, 100));
    const maxInterventions = Math.max(
        1,
        Math.floor(safeNumber(inputPayload?.constraints?.maxInterventions, Math.max(1, interventionCount)))
    );
    const minProjectedHumanity = clamp100(
        safeNumber(inputPayload?.constraints?.minProjectedHumanity, 0)
    );

    return {
        budgetUsd,
        maxRiskScore,
        maxInterventions,
        minProjectedHumanity
    };
}

function normalizeOptions(options) {
    return {
        maxCandidates: Math.max(1, Math.floor(safeNumber(options?.maxCandidates, 5))),
        searchLimit: Math.max(50, Math.floor(safeNumber(options?.searchLimit, 5000))),
        now: typeof options?.now === 'function' ? options.now : Date.now,
        objectiveWeights: {
            societalDelta: safeNumber(options?.objectiveWeights?.societalDelta, 0.55),
            projectedScore: safeNumber(options?.objectiveWeights?.projectedScore, 0.25),
            costEfficiency: safeNumber(options?.objectiveWeights?.costEfficiency, 0.12),
            diversity: safeNumber(options?.objectiveWeights?.diversity, 0.08)
        }
    };
}

function combinationIds(interventions, mask) {
    const ids = [];
    for (let i = 0; i < interventions.length; i++) {
        if ((mask & (1 << i)) !== 0) {
            ids.push(interventions[i].id);
        }
    }
    return ids.sort();
}

function evaluatePortfolio({
    baseline,
    horizonDays,
    interventionMap,
    selectedIds,
    constraints,
    objectiveWeights,
    at
}) {
    const selectedInterventions = selectedIds.map((id) => interventionMap.get(id)).filter(Boolean);
    const totalCostUsd = Number(selectedInterventions
        .reduce((acc, item) => acc + safeNumber(item.costUsd, 0), 0)
        .toFixed(2));
    const averageRiskScore = selectedInterventions.length > 0
        ? selectedInterventions.reduce((acc, item) => acc + safeNumber(item.riskScore, 0), 0) / selectedInterventions.length
        : 0;

    const societal = simulateSocietalOutcomes({
        baseline,
        interventions: selectedInterventions,
        horizonDays
    }, {
        now: () => at
    });

    const finalProjection = societal.projections[societal.projections.length - 1] || {
        projectedScores: { humanity: 0 },
        aggregateRiskScore: 0
    };

    const projectedHumanity = safeNumber(finalProjection.projectedScores?.humanity, 0);
    const aggregateRiskScore = safeNumber(finalProjection.aggregateRiskScore, 0);
    const societalDelta = safeNumber(societal.summary?.delta, 0);
    const projectedSocietalScore = safeNumber(societal.summary?.projectedSocietalScore, 0);

    const uniqueTypes = new Set(selectedInterventions.map((item) => item.type));
    const diversityScore = selectedInterventions.length > 0
        ? (uniqueTypes.size / selectedInterventions.length) * 100
        : 0;
    const costEfficiency = totalCostUsd > 0
        ? societalDelta / (totalCostUsd / 1000)
        : (societalDelta > 0 ? societalDelta * 3 : societalDelta);

    const objectiveScore = Number((
        societalDelta * objectiveWeights.societalDelta * 20
        + projectedSocietalScore * objectiveWeights.projectedScore
        + costEfficiency * objectiveWeights.costEfficiency
        + diversityScore * objectiveWeights.diversity
        - aggregateRiskScore * 0.18
        - averageRiskScore * 0.08
    ).toFixed(2));

    const violations = [];
    if (totalCostUsd > constraints.budgetUsd) {
        violations.push('budget_exceeded');
    }
    if (aggregateRiskScore > constraints.maxRiskScore) {
        violations.push('risk_exceeded');
    }
    if (selectedInterventions.length > constraints.maxInterventions) {
        violations.push('intervention_limit_exceeded');
    }
    if (projectedHumanity < constraints.minProjectedHumanity) {
        violations.push('humanity_floor_unmet');
    }

    return {
        portfolioId: `portfolio-${randomUUID().slice(0, 8)}`,
        interventionIds: [...selectedIds],
        interventionCount: selectedInterventions.length,
        totals: {
            costUsd: totalCostUsd,
            averageRiskScore: Number(averageRiskScore.toFixed(2)),
            aggregateRiskScore: Number(aggregateRiskScore.toFixed(2)),
            projectedHumanity: Number(projectedHumanity.toFixed(2)),
            diversityScore: Number(diversityScore.toFixed(2))
        },
        metrics: {
            societalDelta: Number(societalDelta.toFixed(2)),
            projectedSocietalScore: Number(projectedSocietalScore.toFixed(2)),
            costEfficiency: Number(costEfficiency.toFixed(4)),
            objectiveScore
        },
        feasible: violations.length === 0,
        violations,
        simulation: societal
    };
}

function enumeratePortfolios(interventions, maxInterventions, searchLimit) {
    if (interventions.length === 0) {
        return [[]];
    }

    const ids = interventions.map((entry) => entry.id);

    if (interventions.length <= 18) {
        const maxMask = 1 << interventions.length;
        const result = [];
        for (let mask = 1; mask < maxMask; mask++) {
            const bitCount = mask.toString(2).replaceAll('0', '').length;
            if (bitCount > maxInterventions) continue;
            result.push(combinationIds(interventions, mask));
            if (result.length >= searchLimit) break;
        }
        if (result.length === 0) {
            return [[]];
        }
        return result;
    }

    // Beam-style fallback for larger portfolios.
    const scored = [...interventions].sort((a, b) => {
        const aSignal = (
            a.effects.humanity
            + a.effects.truth
            + a.effects.curiosity
            + a.effects.reliability
        ) - (a.riskScore * 0.2) - (a.costUsd / 1500);
        const bSignal = (
            b.effects.humanity
            + b.effects.truth
            + b.effects.curiosity
            + b.effects.reliability
        ) - (b.riskScore * 0.2) - (b.costUsd / 1500);
        return bSignal - aSignal;
    });

    const width = Math.min(20, scored.length);
    const candidateIds = scored.slice(0, width).map((item) => item.id);
    const combinations = [[]];
    for (const id of candidateIds) {
        const currentLength = combinations.length;
        for (let i = 0; i < currentLength; i++) {
            const next = [...combinations[i], id];
            if (next.length <= maxInterventions) {
                combinations.push(next.sort());
            }
            if (combinations.length >= searchLimit) {
                return combinations;
            }
        }
    }
    return combinations;
}

function rankPortfolios(portfolios) {
    return [...portfolios].sort((a, b) => {
        if (b.feasible !== a.feasible) {
            return (b.feasible ? 1 : 0) - (a.feasible ? 1 : 0);
        }
        if (b.metrics.objectiveScore !== a.metrics.objectiveScore) {
            return b.metrics.objectiveScore - a.metrics.objectiveScore;
        }
        if (b.metrics.societalDelta !== a.metrics.societalDelta) {
            return b.metrics.societalDelta - a.metrics.societalDelta;
        }
        if (a.totals.aggregateRiskScore !== b.totals.aggregateRiskScore) {
            return a.totals.aggregateRiskScore - b.totals.aggregateRiskScore;
        }
        if (a.totals.costUsd !== b.totals.costUsd) {
            return a.totals.costUsd - b.totals.costUsd;
        }
        return a.interventionIds.join(',').localeCompare(b.interventionIds.join(','));
    });
}

function buildRecommendations({
    recommendedPortfolio,
    topFeasible,
    constraints
}) {
    if (!recommendedPortfolio) {
        return [{
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'review_portfolio',
            title: 'No feasible intervention portfolio found',
            description: 'Current constraints reject all candidate portfolios. Review budget, risk, or intervention mix.',
            priority: 'P1'
        }];
    }

    const recommendations = [];
    if (recommendedPortfolio.metrics.societalDelta > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'adopt_portfolio',
            title: 'Adopt recommended intervention portfolio',
            description: `Recommended bundle improves societal score by ${recommendedPortfolio.metrics.societalDelta}.`,
            priority: recommendedPortfolio.metrics.societalDelta >= 8 ? 'P0' : 'P1'
        });
    } else {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'review_portfolio',
            title: 'Review low-impact intervention portfolio',
            description: 'Best feasible bundle does not materially improve societal outcomes.',
            priority: 'P2'
        });
    }

    if (topFeasible.length > 1) {
        const alternative = topFeasible[1];
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'rebalance_portfolio',
            title: 'Compare top portfolio alternatives',
            description: `Alternative bundle differs by ${Math.abs(
                recommendedPortfolio.metrics.objectiveScore - alternative.metrics.objectiveScore
            ).toFixed(2)} objective score points.`,
            priority: 'P2'
        });
    }

    if (Number.isFinite(constraints.budgetUsd) && constraints.budgetUsd < 1_000) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'review_portfolio',
            title: 'Budget constraint may be too restrictive',
            description: 'Budget is below $1,000 and may block meaningful interventions.',
            priority: 'P3'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

export function optimizeInterventionPortfolio(inputPayload, options = {}) {
    const normalizedOptions = normalizeOptions(options);
    const at = safeNow(normalizedOptions.now);
    const interventions = normalizeInterventions(inputPayload || {});
    const constraints = normalizeConstraints({
        ...inputPayload,
        interventions
    });
    const baseline = inputPayload?.baseline && typeof inputPayload.baseline === 'object'
        ? clone(inputPayload.baseline)
        : {};
    const horizonDays = Array.isArray(inputPayload?.horizonDays)
        ? inputPayload.horizonDays
        : [1, 7, 30, 90];
    const interventionMap = new Map(interventions.map((entry) => [entry.id, entry]));
    const candidateIds = enumeratePortfolios(
        interventions,
        constraints.maxInterventions,
        normalizedOptions.searchLimit
    );

    const evaluated = candidateIds.map((selectedIds) => evaluatePortfolio({
        baseline,
        horizonDays,
        interventionMap,
        selectedIds,
        constraints,
        objectiveWeights: normalizedOptions.objectiveWeights,
        at
    }));
    const ranked = rankPortfolios(evaluated);
    const topFeasible = ranked.filter((entry) => entry.feasible).slice(0, normalizedOptions.maxCandidates);
    const recommendedPortfolio = topFeasible[0] || null;

    const infeasibleCount = ranked.length - ranked.filter((entry) => entry.feasible).length;
    const recommendations = buildRecommendations({
        recommendedPortfolio,
        topFeasible,
        constraints
    });

    return {
        at,
        constraints,
        summary: {
            interventionCount: interventions.length,
            candidateCount: ranked.length,
            feasibleCount: ranked.length - infeasibleCount,
            infeasibleCount,
            recommendedPortfolioId: recommendedPortfolio?.portfolioId || null
        },
        recommendedPortfolio: recommendedPortfolio ? clone(recommendedPortfolio) : null,
        topFeasiblePortfolios: topFeasible.map((entry) => clone(entry)),
        rejectedPortfolios: ranked
            .filter((entry) => !entry.feasible)
            .slice(0, normalizedOptions.maxCandidates)
            .map((entry) => ({
                portfolioId: entry.portfolioId,
                interventionIds: entry.interventionIds,
                violations: entry.violations,
                totals: entry.totals,
                metrics: entry.metrics
            })),
        recommendations
    };
}

export function interventionPortfolioToTasks(reportPayload, {
    fromAgentId = 'agent:portfolio-optimizer',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('interventionPortfolioToTasks requires report payload');
    }

    const recommendations = Array.isArray(reportPayload.recommendations)
        ? reportPayload.recommendations
        : [];
    const nowMs = safeNow(Date.now);
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityMap[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            recommendationType: recommendation.type,
            description: recommendation.description,
            portfolioId: reportPayload.summary?.recommendedPortfolioId || null
        },
        createdAt: nowMs + index
    }));
}

export class InterventionPortfolioOptimizer {
    constructor({
        localAgentId = 'agent:portfolio-optimizer',
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
        const report = optimizeInterventionPortfolio(inputPayload, {
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
        return interventionPortfolioToTasks(reportPayload, {
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

export const __interventionPortfolioInternals = {
    normalizeInterventions,
    normalizeConstraints,
    enumeratePortfolios,
    evaluatePortfolio,
    rankPortfolios,
    buildRecommendations
};
