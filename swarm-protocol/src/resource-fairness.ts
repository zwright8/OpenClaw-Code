import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    reallocate_to_critical_group: 'agent:ops',
    request_additional_resources: 'agent:finance',
    rebalance_allocation_plan: 'agent:planning',
    schedule_fairness_review: 'agent:review',
    publish_allocation_transparency: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const PriorityWeightMap = {
    critical: 1,
    high: 0.78,
    normal: 0.56,
    low: 0.36
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

function normalizeDemands(inputPayload) {
    const entries = Array.isArray(inputPayload?.demands)
        ? inputPayload.demands
        : [];

    return entries.map((entry, index) => {
        const requestedUnits = Math.max(0, safeNumber(entry?.requestedUnits, 0));
        return {
            id: typeof entry?.id === 'string' && entry.id.trim()
                ? entry.id.trim()
                : `group-${index + 1}`,
            name: typeof entry?.name === 'string' && entry.name.trim()
                ? entry.name.trim()
                : `Group ${index + 1}`,
            requestedUnits,
            minimumNeedUnits: clamp(safeNumber(entry?.minimumNeedUnits, requestedUnits * 0.5), 0, requestedUnits || 0),
            vulnerabilityIndex: clamp(safeNumber(entry?.vulnerabilityIndex, 50)),
            currentCoverage: clamp(safeNumber(entry?.currentCoverage, 50)),
            historicalUnderserved: clamp(safeNumber(entry?.historicalUnderserved, 45)),
            populationSize: Math.max(1, Math.floor(safeNumber(entry?.populationSize, 1_000))),
            priority: typeof entry?.priority === 'string' && PriorityWeightMap[entry.priority.trim()]
                ? entry.priority.trim()
                : 'normal'
        };
    });
}

function normalizeSupply(inputPayload) {
    const supply = inputPayload?.supply && typeof inputPayload.supply === 'object'
        ? inputPayload.supply
        : {};
    const totalUnits = Math.max(0, safeNumber(supply.totalUnits, 0));
    const reserveUnits = clamp(safeNumber(supply.reserveUnits, 0), 0, totalUnits);

    return {
        totalUnits,
        reserveUnits,
        availableUnits: Number((totalUnits - reserveUnits).toFixed(2))
    };
}

function normalizePolicy(inputPayload) {
    const policy = inputPayload?.policy && typeof inputPayload.policy === 'object'
        ? inputPayload.policy
        : {};
    return {
        vulnerabilityWeight: clamp(safeNumber(policy.vulnerabilityWeight, 0.38), 0, 1),
        coverageWeight: clamp(safeNumber(policy.coverageWeight, 0.32), 0, 1),
        priorityWeight: clamp(safeNumber(policy.priorityWeight, 0.2), 0, 1),
        underservedWeight: clamp(safeNumber(policy.underservedWeight, 0.1), 0, 1),
        criticalShortfallTolerance: clamp(safeNumber(policy.criticalShortfallTolerance, 0.75), 0.1, 1),
        reviewCoverageFloor: clamp(safeNumber(policy.reviewCoverageFloor, 60), 1, 100)
    };
}

function weightedBaselineNeed(demand) {
    return demand.minimumNeedUnits * (
        1
        + demand.vulnerabilityIndex / 100
        + demand.historicalUnderserved / 120
    );
}

function fairnessScore(demand, policy) {
    const priorityWeight = PriorityWeightMap[demand.priority] ?? PriorityWeightMap.normal;
    return (
        demand.vulnerabilityIndex * policy.vulnerabilityWeight
        + (100 - demand.currentCoverage) * policy.coverageWeight
        + (priorityWeight * 100) * policy.priorityWeight
        + demand.historicalUnderserved * policy.underservedWeight
    );
}

function allocateBaseline(demands, availableUnits) {
    const totalWeightedNeed = demands.reduce((acc, demand) => acc + weightedBaselineNeed(demand), 0);
    if (totalWeightedNeed <= 0 || availableUnits <= 0) {
        return demands.map((demand) => ({
            demandId: demand.id,
            baselineUnits: 0
        }));
    }

    return demands.map((demand) => {
        const share = weightedBaselineNeed(demand) / totalWeightedNeed;
        const baselineUnits = Math.min(demand.minimumNeedUnits, availableUnits * share);
        return {
            demandId: demand.id,
            baselineUnits: Number(baselineUnits.toFixed(2))
        };
    });
}

function allocateRemainder(demands, baselineAllocations, remainderUnits, policy) {
    if (remainderUnits <= 0) {
        return demands.map((demand) => ({
            demandId: demand.id,
            remainderUnits: 0
        }));
    }

    const baselineMap = new Map(baselineAllocations.map((entry) => [entry.demandId, entry.baselineUnits]));
    const scored = demands.map((demand) => {
        const baseline = baselineMap.get(demand.id) || 0;
        const unmet = Math.max(0, demand.requestedUnits - baseline);
        return {
            demandId: demand.id,
            unmet,
            score: fairnessScore(demand, policy)
        };
    });

    const scoreSum = scored.reduce((acc, row) => acc + (row.unmet > 0 ? row.score * row.unmet : 0), 0);
    if (scoreSum <= 0) {
        return demands.map((demand) => ({
            demandId: demand.id,
            remainderUnits: 0
        }));
    }

    return scored.map((row) => {
        const weighted = row.unmet > 0 ? row.score * row.unmet : 0;
        const share = weighted / scoreSum;
        const allocation = Math.min(row.unmet, remainderUnits * share);
        return {
            demandId: row.demandId,
            remainderUnits: Number(allocation.toFixed(2))
        };
    });
}

function postureForAllocation(demand, allocatedUnits, policy) {
    if (demand.requestedUnits <= 0) {
        return {
            posture: 'fair',
            coveragePercent: 100,
            unmetNeedUnits: 0,
            minimumNeedGapUnits: 0
        };
    }

    const coveragePercent = clamp((allocatedUnits / demand.requestedUnits) * 100);
    const unmetNeedUnits = Math.max(0, demand.requestedUnits - allocatedUnits);
    const minimumNeedGapUnits = Math.max(0, demand.minimumNeedUnits - allocatedUnits);
    const criticalThreshold = demand.minimumNeedUnits * policy.criticalShortfallTolerance;

    let posture = 'fair';
    if (
        allocatedUnits < criticalThreshold
        && demand.vulnerabilityIndex >= 70
    ) {
        posture = 'blocked';
    } else if (
        allocatedUnits < demand.minimumNeedUnits
        || coveragePercent < policy.reviewCoverageFloor
    ) {
        posture = 'review_required';
    }

    return {
        posture,
        coveragePercent: Number(coveragePercent.toFixed(2)),
        unmetNeedUnits: Number(unmetNeedUnits.toFixed(2)),
        minimumNeedGapUnits: Number(minimumNeedGapUnits.toFixed(2))
    };
}

function buildAllocations(demands, supply, policy) {
    const baselineAllocations = allocateBaseline(demands, supply.availableUnits);
    const baselineTotal = baselineAllocations.reduce((acc, row) => acc + row.baselineUnits, 0);
    const remainderCapacity = Math.max(0, supply.availableUnits - baselineTotal);
    const remainderAllocations = allocateRemainder(demands, baselineAllocations, remainderCapacity, policy);

    const baselineMap = new Map(baselineAllocations.map((entry) => [entry.demandId, entry.baselineUnits]));
    const remainderMap = new Map(remainderAllocations.map((entry) => [entry.demandId, entry.remainderUnits]));

    return demands.map((demand) => {
        const baselineUnits = baselineMap.get(demand.id) || 0;
        const remainderUnits = remainderMap.get(demand.id) || 0;
        const allocatedUnits = Number(Math.min(
            demand.requestedUnits,
            baselineUnits + remainderUnits
        ).toFixed(2));
        const postureState = postureForAllocation(demand, allocatedUnits, policy);

        return {
            groupId: demand.id,
            groupName: demand.name,
            priority: demand.priority,
            requestedUnits: demand.requestedUnits,
            minimumNeedUnits: demand.minimumNeedUnits,
            allocatedUnits,
            baselineUnits: Number(baselineUnits.toFixed(2)),
            remainderUnits: Number(remainderUnits.toFixed(2)),
            vulnerabilityIndex: demand.vulnerabilityIndex,
            historicalUnderserved: demand.historicalUnderserved,
            populationSize: demand.populationSize,
            currentCoverage: demand.currentCoverage,
            fairnessScore: Number(fairnessScore(demand, policy).toFixed(2)),
            ...postureState
        };
    }).sort((a, b) => {
        const postureRank = { blocked: 0, review_required: 1, fair: 2 };
        const p = postureRank[a.posture] - postureRank[b.posture];
        if (p !== 0) return p;
        return b.fairnessScore - a.fairnessScore;
    });
}

function summarizeAllocations(allocations, supply) {
    const totalRequestedUnits = Number(allocations.reduce((acc, row) => acc + row.requestedUnits, 0).toFixed(2));
    const totalAllocatedUnits = Number(allocations.reduce((acc, row) => acc + row.allocatedUnits, 0).toFixed(2));
    const totalUnmetUnits = Number(Math.max(0, totalRequestedUnits - totalAllocatedUnits).toFixed(2));
    const coverages = allocations.map((row) => row.coveragePercent);
    const avgCoverage = coverages.length > 0
        ? Number((coverages.reduce((acc, value) => acc + value, 0) / coverages.length).toFixed(2))
        : 0;
    const maxCoverage = coverages.length > 0 ? Math.max(...coverages) : 0;
    const minCoverage = coverages.length > 0 ? Math.min(...coverages) : 0;
    const coverageRange = Number((maxCoverage - minCoverage).toFixed(2));
    const variance = coverages.length > 0
        ? coverages.reduce((acc, value) => acc + ((value - avgCoverage) ** 2), 0) / coverages.length
        : 0;
    const standardDeviation = Number(Math.sqrt(variance).toFixed(2));

    const weightedVulnerabilityGapNumerator = allocations.reduce((acc, row) => {
        const gap = Math.max(0, row.minimumNeedUnits - row.allocatedUnits);
        return acc + gap * row.vulnerabilityIndex;
    }, 0);
    const weightedVulnerabilityGapDenominator = allocations.reduce((acc, row) => (
        acc + row.minimumNeedUnits * row.vulnerabilityIndex
    ), 0);
    const vulnerabilityGap = weightedVulnerabilityGapDenominator > 0
        ? clamp((weightedVulnerabilityGapNumerator / weightedVulnerabilityGapDenominator) * 100)
        : 0;

    const fairnessIndex = clamp(Math.round(
        avgCoverage * 0.6
        + (100 - standardDeviation) * 0.25
        + (100 - vulnerabilityGap) * 0.15
    ));

    let portfolioPosture = 'fair';
    const blockedCount = allocations.filter((row) => row.posture === 'blocked').length;
    const reviewRequiredCount = allocations.filter((row) => row.posture === 'review_required').length;
    if (blockedCount > 0 || fairnessIndex < 45) {
        portfolioPosture = 'blocked';
    } else if (reviewRequiredCount > 0 || fairnessIndex < 65) {
        portfolioPosture = 'review_required';
    }

    return {
        groupCount: allocations.length,
        fairCount: allocations.filter((row) => row.posture === 'fair').length,
        reviewRequiredCount,
        blockedCount,
        totalRequestedUnits,
        totalAllocatedUnits,
        totalUnmetUnits,
        avgCoverage,
        coverageRange,
        fairnessIndex,
        portfolioPosture,
        availableUnits: supply.availableUnits
    };
}

function buildAlerts(summary, allocations, supply) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('critical_need_unmet');
    if (summary.totalAllocatedUnits < summary.totalRequestedUnits) alerts.push('supply_shortfall_detected');
    if (summary.coverageRange > 40) alerts.push('fairness_imbalance_high');
    if (allocations.some((row) => row.vulnerabilityIndex >= 70 && row.posture !== 'fair')) {
        alerts.push('vulnerable_groups_underserved');
    }
    if (supply.availableUnits <= 0) alerts.push('no_available_supply');
    return alerts;
}

function buildRecommendations(summary, allocations, alerts) {
    const recommendations = [];
    for (const row of allocations) {
        if (row.posture === 'blocked') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'reallocate_to_critical_group',
                groupId: row.groupId,
                title: `Reallocate supply to critical group ${row.groupName}`,
                description: `Allocated ${row.allocatedUnits}/${row.minimumNeedUnits} minimum-need units.`,
                priority: 'P0'
            });
        } else if (row.posture === 'review_required') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'schedule_fairness_review',
                groupId: row.groupId,
                title: `Schedule fairness review for ${row.groupName}`,
                description: 'Current allocation is below fairness floor and needs policy review.',
                priority: 'P1'
            });
        }
    }

    if (alerts.includes('supply_shortfall_detected')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'request_additional_resources',
            title: 'Request additional resource capacity',
            description: `Unmet demand is ${summary.totalUnmetUnits} units across active groups.`,
            priority: summary.blockedCount > 0 ? 'P0' : 'P1'
        });
    }

    if (alerts.includes('fairness_imbalance_high') || summary.portfolioPosture !== 'fair') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'rebalance_allocation_plan',
            title: 'Rebalance allocation plan by fairness score',
            description: `Coverage range ${summary.coverageRange}, fairness index ${summary.fairnessIndex}.`,
            priority: summary.portfolioPosture === 'blocked' ? 'P1' : 'P2'
        });
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_allocation_transparency',
            title: 'Publish allocation transparency update',
            description: 'Share allocation rationale, shortfalls, and mitigation ownership.',
            priority: alerts.includes('critical_need_unmet') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.groupId || '').localeCompare(String(b.groupId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.groupId || '') === String(entry.groupId || '')
        )) === index);
}

export function allocateResourcesFairly(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const demands = normalizeDemands(inputPayload || {});
    const supply = normalizeSupply(inputPayload || {});
    const policy = normalizePolicy(inputPayload || {});

    const allocations = buildAllocations(demands, supply, policy);
    const summary = summarizeAllocations(allocations, supply);
    const alerts = buildAlerts(summary, allocations, supply);
    const recommendations = buildRecommendations(summary, allocations, alerts);

    return {
        at,
        supply,
        policy,
        allocations,
        summary,
        alerts,
        recommendations
    };
}

export function resourceFairnessToTasks(reportPayload, {
    fromAgentId = 'agent:fairness',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('resourceFairnessToTasks requires report payload');
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
            groupId: recommendation.groupId || null,
            fairnessIndex: reportPayload.summary?.fairnessIndex ?? null,
            totalUnmetUnits: reportPayload.summary?.totalUnmetUnits ?? 0
        },
        createdAt: nowMs + index
    }));
}

export class ResourceFairnessAllocator {
    constructor({
        localAgentId = 'agent:fairness',
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
        const report = allocateResourcesFairly(inputPayload, {
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
        return resourceFairnessToTasks(reportPayload, {
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

export const __resourceFairnessInternals = {
    normalizeDemands,
    normalizeSupply,
    normalizePolicy,
    buildAllocations,
    summarizeAllocations,
    buildRecommendations
};
