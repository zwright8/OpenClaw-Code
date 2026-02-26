import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    launch_opportunity: 'agent:planner',
    validate_opportunity: 'agent:research',
    unblock_opportunity: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const LaneOrder = {
    now: 0,
    next: 1,
    backlog: 2
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

function normalizeOpportunities(inputPayload) {
    const entries = Array.isArray(inputPayload?.opportunities)
        ? inputPayload.opportunities
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `opportunity-${index + 1}`,
        title: typeof entry?.title === 'string' && entry.title.trim()
            ? entry.title.trim()
            : `Opportunity ${index + 1}`,
        domain: typeof entry?.domain === 'string' && entry.domain.trim()
            ? entry.domain.trim().toLowerCase()
            : 'general',
        affectedPopulation: Math.max(1, Math.floor(safeNumber(entry?.affectedPopulation, 10_000))),
        expectedBenefitScore: clamp(safeNumber(entry?.expectedBenefitScore, 50)),
        feasibilityScore: clamp(safeNumber(entry?.feasibilityScore, 55)),
        urgencyScore: clamp(safeNumber(entry?.urgencyScore, 45)),
        equityBoostScore: clamp(safeNumber(entry?.equityBoostScore, 40)),
        evidenceStrengthScore: clamp(safeNumber(entry?.evidenceStrengthScore, 45)),
        timeToImpactDays: Math.max(1, Math.floor(safeNumber(entry?.timeToImpactDays, 45))),
        estimatedCostUsd: Math.max(0, safeNumber(entry?.estimatedCostUsd, 0)),
        riskScore: clamp(safeNumber(entry?.riskScore, 20))
    }));
}

function normalizeConstraints(inputPayload) {
    return {
        budgetUsd: Math.max(0, safeNumber(inputPayload?.constraints?.budgetUsd, 50_000)),
        maxNow: Math.max(1, Math.floor(safeNumber(inputPayload?.constraints?.maxNow, 3))),
        maxNext: Math.max(1, Math.floor(safeNumber(inputPayload?.constraints?.maxNext, 5))),
        maxRiskScore: clamp(safeNumber(inputPayload?.constraints?.maxRiskScore, 60)),
        minEvidenceScore: clamp(safeNumber(inputPayload?.constraints?.minEvidenceScore, 35))
    };
}

function urgencyTimeBoost(timeToImpactDays) {
    if (timeToImpactDays <= 7) return 15;
    if (timeToImpactDays <= 21) return 10;
    if (timeToImpactDays <= 45) return 6;
    if (timeToImpactDays <= 90) return 2;
    return 0;
}

function scoreOpportunity(opportunity) {
    const scaleScore = clamp(Math.log10(opportunity.affectedPopulation + 1) * 20, 0, 100);
    const costPenalty = Math.min(25, opportunity.estimatedCostUsd / 4_000);
    const riskPenalty = opportunity.riskScore * 0.32;
    const timeBoost = urgencyTimeBoost(opportunity.timeToImpactDays);

    const leverageScore = clamp(Math.round(
        opportunity.expectedBenefitScore * 0.26
        + opportunity.feasibilityScore * 0.2
        + opportunity.urgencyScore * 0.17
        + opportunity.equityBoostScore * 0.17
        + opportunity.evidenceStrengthScore * 0.14
        + scaleScore * 0.1
        + timeBoost
        - costPenalty
        - riskPenalty
    ));

    const confidenceScore = clamp(Math.round(
        opportunity.evidenceStrengthScore * 0.55
        + opportunity.feasibilityScore * 0.25
        + (100 - opportunity.riskScore) * 0.2
    ));

    return {
        leverageScore,
        confidenceScore,
        scoreBreakdown: {
            scaleScore: Number(scaleScore.toFixed(2)),
            costPenalty: Number(costPenalty.toFixed(2)),
            riskPenalty: Number(riskPenalty.toFixed(2)),
            timeBoost
        }
    };
}

function initialLane(opportunity, scores, constraints) {
    if (opportunity.riskScore > constraints.maxRiskScore) {
        return 'backlog';
    }
    if (opportunity.evidenceStrengthScore < constraints.minEvidenceScore) {
        return 'backlog';
    }
    if (scores.leverageScore >= 72 && scores.confidenceScore >= 60) {
        return 'now';
    }
    if (scores.leverageScore >= 52) {
        return 'next';
    }
    return 'backlog';
}

function assignLanes(ranked, constraints) {
    let remainingBudget = constraints.budgetUsd;
    let nowCount = 0;
    let nextCount = 0;

    const enriched = ranked.map((entry) => ({ ...entry, scheduledLane: entry.lane, deferredReason: null }));

    for (const entry of enriched) {
        const cost = entry.estimatedCostUsd;
        if (entry.lane === 'now') {
            const blockedByBudget = cost > remainingBudget;
            const blockedByCapacity = nowCount >= constraints.maxNow;
            if (blockedByBudget || blockedByCapacity) {
                entry.scheduledLane = 'next';
                entry.deferredReason = blockedByBudget ? 'budget_limited' : 'now_capacity_limited';
            } else {
                remainingBudget -= cost;
                nowCount++;
            }
        }

        if (entry.scheduledLane === 'next') {
            const blockedByBudget = cost > remainingBudget;
            const blockedByCapacity = nextCount >= constraints.maxNext;
            if (blockedByBudget || blockedByCapacity) {
                entry.scheduledLane = 'backlog';
                entry.deferredReason = blockedByBudget ? 'budget_limited' : 'next_capacity_limited';
            } else {
                remainingBudget -= cost;
                nextCount++;
            }
        }
    }

    return {
        opportunities: enriched,
        remainingBudget: Number(remainingBudget.toFixed(2))
    };
}

function buildRecommendations(ranked) {
    const recommendations = [];
    for (const entry of ranked) {
        if (entry.scheduledLane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'launch_opportunity',
                opportunityId: entry.id,
                title: `Launch public-benefit opportunity: ${entry.title}`,
                description: `Leverage score ${entry.leverageScore} with confidence ${entry.confidenceScore}.`,
                priority: entry.leverageScore >= 85 ? 'P0' : 'P1'
            });
        } else if (entry.scheduledLane === 'next') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'validate_opportunity',
                opportunityId: entry.id,
                title: `Validate opportunity before near-term launch: ${entry.title}`,
                description: 'Opportunity is promising but currently queued for next lane.',
                priority: 'P2'
            });
        } else if (entry.deferredReason) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'unblock_opportunity',
                opportunityId: entry.id,
                title: `Unblock deferred opportunity: ${entry.title}`,
                description: `Opportunity deferred due to ${entry.deferredReason}.`,
                priority: entry.deferredReason === 'budget_limited' ? 'P1' : 'P2'
            });
        }
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.opportunityId).localeCompare(String(b.opportunityId));
    });
}

export function minePublicBenefitOpportunities(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const constraints = normalizeConstraints(inputPayload || {});
    const opportunities = normalizeOpportunities(inputPayload || {});

    const scored = opportunities.map((entry) => {
        const scoredEntry = scoreOpportunity(entry);
        const lane = initialLane(entry, scoredEntry, constraints);
        return {
            ...entry,
            ...scoredEntry,
            lane
        };
    }).sort((a, b) => {
        const laneCmp = LaneOrder[a.lane] - LaneOrder[b.lane];
        if (laneCmp !== 0) return laneCmp;
        if (b.leverageScore !== a.leverageScore) return b.leverageScore - a.leverageScore;
        return String(a.id).localeCompare(String(b.id));
    });

    const scheduled = assignLanes(scored, constraints);
    const ranked = scheduled.opportunities;
    const recommendations = buildRecommendations(ranked);

    return {
        at,
        constraints,
        summary: {
            opportunityCount: ranked.length,
            nowCount: ranked.filter((item) => item.scheduledLane === 'now').length,
            nextCount: ranked.filter((item) => item.scheduledLane === 'next').length,
            backlogCount: ranked.filter((item) => item.scheduledLane === 'backlog').length,
            remainingBudgetUsd: scheduled.remainingBudget
        },
        opportunities: ranked.map((entry) => clone(entry)),
        recommendations
    };
}

export function publicBenefitRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:benefit-miner',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('publicBenefitRecommendationsToTasks requires report payload');
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
            opportunityId: recommendation.opportunityId,
            description: recommendation.description
        },
        createdAt: nowMs + index
    }));
}

export class PublicBenefitOpportunityMiner {
    constructor({
        localAgentId = 'agent:benefit-miner',
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
        const report = minePublicBenefitOpportunities(inputPayload, {
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
        return publicBenefitRecommendationsToTasks(reportPayload, {
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

export const __publicBenefitOpportunityInternals = {
    normalizeOpportunities,
    normalizeConstraints,
    scoreOpportunity,
    initialLane,
    assignLanes,
    buildRecommendations
};
