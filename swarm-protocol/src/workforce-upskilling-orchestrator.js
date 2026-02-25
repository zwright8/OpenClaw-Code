import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    launch_upskilling_pathway: 'agent:learning',
    assign_mentor_capacity: 'agent:workforce',
    secure_training_budget: 'agent:finance',
    publish_upskilling_brief: 'agent:ops'
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

function normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim());
}

function normalizeRoles(inputPayload) {
    const roles = Array.isArray(inputPayload?.roles)
        ? inputPayload.roles
        : [];

    return roles
        .filter((role) => role && typeof role === 'object')
        .map((role, index) => ({
            roleId: typeof role.roleId === 'string' && role.roleId.trim()
                ? role.roleId.trim()
                : `role-${index + 1}`,
            name: typeof role.name === 'string' && role.name.trim()
                ? role.name.trim()
                : `Role ${index + 1}`,
            headcount: Math.max(1, Math.floor(safeNumber(role.headcount, 8))),
            skillCoverage: clamp(safeNumber(role.skillCoverage, 58)),
            automationExposure: clamp(safeNumber(role.automationExposure, 64)),
            criticality: clamp(safeNumber(role.criticality, 72)),
            attritionRisk: clamp(safeNumber(role.attritionRisk, 45)),
            learningReadiness: clamp(safeNumber(role.learningReadiness, 62)),
            domains: normalizeStringArray(role.domains)
        }));
}

function normalizePrograms(inputPayload) {
    const programs = Array.isArray(inputPayload?.learningPrograms)
        ? inputPayload.learningPrograms
        : [];

    return programs
        .filter((program) => program && typeof program === 'object')
        .map((program, index) => ({
            programId: typeof program.programId === 'string' && program.programId.trim()
                ? program.programId.trim()
                : `program-${index + 1}`,
            name: typeof program.name === 'string' && program.name.trim()
                ? program.name.trim()
                : `Program ${index + 1}`,
            domains: normalizeStringArray(program.domains),
            expectedSkillGain: clamp(safeNumber(program.expectedSkillGain, 28)),
            deliveryComplexity: clamp(safeNumber(program.deliveryComplexity, 40)),
            mentorIntensity: clamp(safeNumber(program.mentorIntensity, 22)),
            budgetCost: Math.max(1, Math.floor(safeNumber(program.budgetCost, 2))),
            slotCost: Math.max(1, Math.floor(safeNumber(program.slotCost, 1)))
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};

    return {
        trainingSlots: Math.max(0, Math.floor(safeNumber(capacity.trainingSlots, 6))),
        mentorHours: Math.max(0, Math.floor(safeNumber(capacity.mentorHours, 40))),
        budgetUnits: Math.max(0, Math.floor(safeNumber(capacity.budgetUnits, 12)))
    };
}

function rolePriority(role) {
    return clamp(Math.round(
        (100 - role.skillCoverage) * 0.26
        + role.automationExposure * 0.18
        + role.criticality * 0.22
        + role.attritionRisk * 0.17
        + (100 - role.learningReadiness) * 0.11
        + clamp(role.headcount * 1.2, 0, 18)
    ));
}

function programFit(program, role) {
    const overlapRatio = program.domains.length === 0
        ? 0.25
        : program.domains.filter((domain) => role.domains.includes(domain)).length / program.domains.length;

    return clamp(Math.round(
        overlapRatio * 46
        + program.expectedSkillGain * 0.38
        + (100 - program.deliveryComplexity) * 0.16
        + (100 - program.mentorIntensity) * 0.12
        - program.slotCost * 3
    ));
}

function orchestratePlans(roles, programs, capacity) {
    let trainingSlots = capacity.trainingSlots;
    let mentorHours = capacity.mentorHours;
    let budgetUnits = capacity.budgetUnits;

    const prioritized = roles
        .map((role) => ({
            ...role,
            priorityScore: rolePriority(role)
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

    const plans = [];
    for (const role of prioritized) {
        const rankedPrograms = programs
            .map((program) => ({
                programId: program.programId,
                name: program.name,
                fitScore: programFit(program, role),
                mentorIntensity: program.mentorIntensity,
                deliveryComplexity: program.deliveryComplexity,
                budgetCost: program.budgetCost,
                slotCost: program.slotCost,
                domains: [...program.domains]
            }))
            .sort((a, b) => b.fitScore - a.fitScore);

        const selectedPrograms = [];
        for (const candidate of rankedPrograms) {
            if (selectedPrograms.length >= 2) break;
            if (trainingSlots <= 0) break;
            if (candidate.slotCost > trainingSlots) continue;
            if (candidate.budgetCost > budgetUnits) continue;
            selectedPrograms.push(candidate);
            trainingSlots -= candidate.slotCost;
            budgetUnits -= candidate.budgetCost;
        }

        const mentorNeed = Math.max(0, Math.round(
            role.priorityScore * 0.28
            + selectedPrograms.reduce((acc, program) => acc + Math.max(2, Math.round(program.mentorIntensity * 0.3)), 0)
        ));
        const mentorAllocated = Math.min(mentorHours, mentorNeed);
        mentorHours -= mentorAllocated;

        const budgetNeed = Math.max(0, Math.round(
            selectedPrograms.reduce((acc, program) => acc + program.budgetCost, 0)
            + role.priorityScore * 0.04
        ));
        const budgetAllocated = Math.min(capacity.budgetUnits, budgetNeed);

        const projectedCoverageGain = clamp(Math.round(
            selectedPrograms.reduce((acc, program) => acc + program.fitScore, 0) * 0.07
            + mentorAllocated * 0.22
            + role.learningReadiness * 0.1
        ));
        const upskillingGap = clamp(Math.round(
            role.priorityScore * 0.62
            - projectedCoverageGain * 0.55
            + (selectedPrograms.length === 0 ? 20 : 0)
            + (mentorAllocated < mentorNeed ? 12 : 0)
            + (budgetAllocated < budgetNeed ? 8 : 0)
        ));

        let lane = 'now';
        if (selectedPrograms.length === 0 || upskillingGap > 72) lane = 'hold';
        else if (upskillingGap > 44) lane = 'next';

        plans.push({
            roleId: role.roleId,
            roleName: role.name,
            priorityScore: role.priorityScore,
            selectedPrograms,
            mentorNeed,
            mentorAllocated,
            budgetNeed,
            budgetAllocated,
            projectedCoverageGain,
            upskillingGap,
            lane
        });
    }

    return {
        plans: plans.sort((a, b) => {
            const laneRank = { now: 0, next: 1, hold: 2 };
            const laneDiff = laneRank[a.lane] - laneRank[b.lane];
            if (laneDiff !== 0) return laneDiff;
            return b.priorityScore - a.priorityScore;
        }),
        remainingCapacity: {
            trainingSlots,
            mentorHours,
            budgetUnits
        }
    };
}

function summarizePlans(plans, remainingCapacity) {
    const avgUpskillingGap = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.upskillingGap, 0) / plans.length).toFixed(2))
        : 0;
    const avgProjectedCoverageGain = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.projectedCoverageGain, 0) / plans.length).toFixed(2))
        : 0;

    const laneCounts = plans.reduce((acc, plan) => {
        acc[plan.lane] = (acc[plan.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    let posture = 'upskilling_ready';
    if (laneCounts.hold > 0 || avgUpskillingGap > 60) posture = 'critical';
    else if (laneCounts.next > 0 || avgUpskillingGap > 42) posture = 'review_required';

    return {
        roleCount: plans.length,
        laneCounts,
        avgUpskillingGap,
        avgProjectedCoverageGain,
        remainingCapacity,
        posture
    };
}

function buildAlerts(summary, plans) {
    const alerts = [];
    if (summary.laneCounts.hold > 0) alerts.push('workforce_upskilling_hold_queue_present');
    if (summary.avgUpskillingGap > 55) alerts.push('workforce_upskilling_gap_high');
    if (plans.some((plan) => plan.mentorAllocated < plan.mentorNeed)) alerts.push('workforce_mentor_capacity_gap');
    if (plans.some((plan) => plan.budgetAllocated < plan.budgetNeed)) alerts.push('workforce_training_budget_gap');
    if (plans.some((plan) => plan.selectedPrograms.length === 0)) alerts.push('workforce_program_coverage_gap');
    return alerts;
}

function buildRecommendations(plans, summary, alerts) {
    const recommendations = [];
    for (const plan of plans) {
        if (plan.selectedPrograms.length > 0 && plan.lane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'launch_upskilling_pathway',
                roleId: plan.roleId,
                title: `Launch upskilling pathway for ${plan.roleName}`,
                description: `Projected skill coverage gain ${plan.projectedCoverageGain}.`,
                priority: plan.priorityScore >= 80 ? 'P1' : 'P2'
            });
        }
        if (plan.mentorAllocated < plan.mentorNeed) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'assign_mentor_capacity',
                roleId: plan.roleId,
                title: `Assign mentor capacity for ${plan.roleName}`,
                description: `Mentor capacity gap ${plan.mentorNeed - plan.mentorAllocated} hours.`,
                priority: plan.lane === 'hold' ? 'P0' : 'P1'
            });
        }
        if (plan.budgetAllocated < plan.budgetNeed || plan.upskillingGap > 56) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'secure_training_budget',
                roleId: plan.roleId,
                title: `Secure training budget for ${plan.roleName}`,
                description: `Upskilling gap ${plan.upskillingGap} with budget allocation ${plan.budgetAllocated}/${plan.budgetNeed}.`,
                priority: plan.lane === 'hold' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_upskilling_brief',
            title: 'Publish workforce upskilling brief',
            description: 'Share role lanes, training assignments, mentor gaps, and budget constraints.',
            priority: alerts.includes('workforce_upskilling_hold_queue_present') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.roleId || '').localeCompare(String(b.roleId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.roleId || '') === String(entry.roleId || '')
        )) === index);
}

export function orchestrateWorkforceUpskilling(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const roles = normalizeRoles(inputPayload || {});
    const programs = normalizePrograms(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const planning = orchestratePlans(roles, programs, capacity);
    const summary = summarizePlans(planning.plans, planning.remainingCapacity);
    const alerts = buildAlerts(summary, planning.plans);
    const recommendations = buildRecommendations(planning.plans, summary, alerts);

    return {
        at,
        summary,
        plans: planning.plans,
        alerts,
        recommendations
    };
}

export function upskillingPlanToTasks(reportPayload, {
    fromAgentId = 'agent:workforce-upskilling',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('upskillingPlanToTasks requires report payload');
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
            roleId: recommendation.roleId || null,
            posture: reportPayload.summary?.posture || null,
            holdCount: reportPayload.summary?.laneCounts?.hold || 0
        },
        createdAt: nowMs + index
    }));
}

export class WorkforceUpskillingOrchestrator {
    constructor({
        localAgentId = 'agent:workforce-upskilling',
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
        const report = orchestrateWorkforceUpskilling(inputPayload, {
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
        return upskillingPlanToTasks(reportPayload, {
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

export const __workforceUpskillingOrchestratorInternals = {
    normalizeRoles,
    normalizePrograms,
    orchestratePlans,
    summarizePlans,
    buildRecommendations
};
