import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    fund_program_allocation: 'agent:finance',
    hold_program_for_review: 'agent:strategy',
    rebalance_funding_reserve: 'agent:finance'
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

function normalizePrograms(inputPayload) {
    const source = Array.isArray(inputPayload?.programs)
        ? inputPayload.programs
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            programId: typeof entry.programId === 'string' && entry.programId.trim()
                ? entry.programId.trim()
                : `program-${index + 1}`,
            requestedFunding: Math.max(0, safeNumber(entry.requestedFunding, 0)),
            impactScore: clamp(safeNumber(entry.impactScore, 65)),
            equityScore: clamp(safeNumber(entry.equityScore, 62)),
            urgency: clamp(safeNumber(entry.urgency, 58)),
            executionRisk: clamp(safeNumber(entry.executionRisk, 42))
        }));
}

function allocateFunding(programs, budget, reserveRatio) {
    const reserve = budget * reserveRatio;
    let available = Math.max(0, budget - reserve);

    const ranked = programs
        .map((program) => {
            const priorityScore = clamp(Math.round(
                program.impactScore * 0.4
                + program.equityScore * 0.24
                + program.urgency * 0.2
                + (100 - program.executionRisk) * 0.16
            ));
            return {
                ...program,
                priorityScore
            };
        })
        .sort((a, b) => b.priorityScore - a.priorityScore);

    const allocations = [];
    for (const program of ranked) {
        const allocation = Math.min(available, program.requestedFunding);
        available -= allocation;

        const coverage = program.requestedFunding > 0
            ? allocation / program.requestedFunding
            : 1;

        allocations.push({
            programId: program.programId,
            requestedFunding: program.requestedFunding,
            allocatedFunding: Number(allocation.toFixed(2)),
            coverage: Number(coverage.toFixed(4)),
            priorityScore: program.priorityScore,
            impactScore: program.impactScore,
            equityScore: program.equityScore,
            urgency: program.urgency,
            executionRisk: program.executionRisk,
            fullyFunded: coverage >= 0.999,
            unfunded: allocation <= 0
        });
    }

    return {
        allocations,
        reserve: Number(reserve.toFixed(2)),
        remainingBudget: Number(available.toFixed(2))
    };
}

function summarizeAllocations(result, budget) {
    const fundedCount = result.allocations.filter((entry) => !entry.unfunded).length;
    const fullyFundedCount = result.allocations.filter((entry) => entry.fullyFunded).length;
    const unfundedCount = result.allocations.filter((entry) => entry.unfunded).length;
    const allocatedTotal = result.allocations.reduce((acc, entry) => acc + entry.allocatedFunding, 0);

    let posture = 'balanced';
    if (unfundedCount > 0 || fullyFundedCount < result.allocations.length) posture = 'constrained';
    if (fundedCount === 0 && result.allocations.length > 0) posture = 'blocked';

    return {
        programCount: result.allocations.length,
        fundedCount,
        fullyFundedCount,
        unfundedCount,
        allocatedTotal: Number(allocatedTotal.toFixed(2)),
        reserve: result.reserve,
        remainingBudget: result.remainingBudget,
        allocationRate: budget > 0 ? Number((allocatedTotal / budget).toFixed(4)) : 0,
        posture
    };
}

function buildAlerts(summary, allocations) {
    const alerts = [];
    if (summary.unfundedCount > 0) alerts.push('programs_unfunded');
    if (allocations.some((entry) => entry.unfunded && entry.priorityScore >= 70)) alerts.push('high_priority_program_unfunded');
    if (summary.remainingBudget < summary.reserve * 0.2) alerts.push('funding_reserve_thin');
    return alerts;
}

function buildRecommendations(allocations, summary) {
    const recommendations = [];

    for (const allocation of allocations) {
        if (!allocation.unfunded) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'fund_program_allocation',
                programId: allocation.programId,
                title: `Fund ${allocation.programId}`,
                description: `Allocated ${allocation.allocatedFunding} of ${allocation.requestedFunding}.`,
                priority: allocation.priorityScore >= 75 ? 'P1' : 'P2'
            });
        }

        if (allocation.unfunded || allocation.coverage < 0.6) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'hold_program_for_review',
                programId: allocation.programId,
                title: `Hold ${allocation.programId} for review`,
                description: `Funding coverage ${allocation.coverage} requires scope or financing review.`,
                priority: allocation.priorityScore >= 70 ? 'P1' : 'P2'
            });
        }
    }

    if (summary.remainingBudget < summary.reserve * 0.2 || summary.posture === 'blocked') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'rebalance_funding_reserve',
            title: 'Rebalance funding reserve strategy',
            description: 'Adjust reserve posture to stabilize funding continuity.',
            priority: summary.posture === 'blocked' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.programId || '').localeCompare(String(b.programId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.programId || '') === String(entry.programId || '')
        )) === index);
}

export function adviseFundingAllocation(inputPayload, {
    now = Date.now,
    budget = 1_000_000,
    reserveRatio = 0.12
} = {}) {
    const at = safeNow(now);
    const programs = normalizePrograms(inputPayload || {});
    const result = allocateFunding(programs, Math.max(0, budget), clamp(reserveRatio * 100, 0, 95) / 100);
    const summary = summarizeAllocations(result, Math.max(0, budget));
    const alerts = buildAlerts(summary, result.allocations);
    const recommendations = buildRecommendations(result.allocations, summary);

    return {
        at,
        summary,
        allocations: result.allocations,
        alerts,
        recommendations
    };
}

export function fundingAllocationToTasks(reportPayload, {
    fromAgentId = 'agent:funding-advisor',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('fundingAllocationToTasks requires report payload');
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
            programId: recommendation.programId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class FundingAllocationAdvisor {
    constructor({
        localAgentId = 'agent:funding-advisor',
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
        const report = adviseFundingAllocation(inputPayload, {
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
        return fundingAllocationToTasks(reportPayload, {
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

export const __fundingAllocationAdvisorInternals = {
    normalizePrograms,
    allocateFunding,
    summarizeAllocations,
    buildRecommendations
};
