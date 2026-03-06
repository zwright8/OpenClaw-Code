import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    launch_targeted_support: 'agent:education-ops',
    assign_tutor_capacity: 'agent:workforce',
    add_family_outreach: 'agent:community',
    publish_education_support_brief: 'agent:ops'
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

function normalizeCohorts(inputPayload) {
    const cohorts = Array.isArray(inputPayload?.cohorts)
        ? inputPayload.cohorts
        : [];

    return cohorts
        .filter((cohort) => cohort && typeof cohort === 'object')
        .map((cohort, index) => ({
            cohortId: typeof cohort.cohortId === 'string' && cohort.cohortId.trim()
                ? cohort.cohortId.trim()
                : `cohort-${index + 1}`,
            name: typeof cohort.name === 'string' && cohort.name.trim()
                ? cohort.name.trim()
                : `Cohort ${index + 1}`,
            learnerCount: Math.max(1, Math.floor(safeNumber(cohort.learnerCount, 30))),
            performanceIndex: clamp(safeNumber(cohort.performanceIndex, 60)),
            attendanceRate: clamp(safeNumber(cohort.attendanceRate, 75)),
            resourceAccess: clamp(safeNumber(cohort.resourceAccess, 65)),
            supportCoverage: clamp(safeNumber(cohort.supportCoverage, 55)),
            riskFactors: normalizeStringArray(cohort.riskFactors),
            region: typeof cohort.region === 'string' && cohort.region.trim()
                ? cohort.region.trim()
                : 'general'
        }));
}

function normalizeInterventions(inputPayload) {
    const interventions = Array.isArray(inputPayload?.interventions)
        ? inputPayload.interventions
        : [];

    return interventions
        .filter((intervention) => intervention && typeof intervention === 'object')
        .map((intervention, index) => ({
            interventionId: typeof intervention.interventionId === 'string' && intervention.interventionId.trim()
                ? intervention.interventionId.trim()
                : `intervention-${index + 1}`,
            name: typeof intervention.name === 'string' && intervention.name.trim()
                ? intervention.name.trim()
                : `Intervention ${index + 1}`,
            domains: normalizeStringArray(intervention.domains),
            intensity: clamp(safeNumber(intervention.intensity, 60)),
            capacityCost: Math.max(1, Math.floor(safeNumber(intervention.capacityCost, 1))),
            expectedGain: clamp(safeNumber(intervention.expectedGain, 18))
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};
    return {
        tutorHours: Math.max(0, Math.floor(safeNumber(capacity.tutorHours, 40))),
        outreachHours: Math.max(0, Math.floor(safeNumber(capacity.outreachHours, 20))),
        interventionSlots: Math.max(0, Math.floor(safeNumber(capacity.interventionSlots, 6)))
    };
}

function cohortPriorityScore(cohort) {
    return clamp(Math.round(
        (100 - cohort.performanceIndex) * 0.32
        + (100 - cohort.attendanceRate) * 0.24
        + (100 - cohort.resourceAccess) * 0.18
        + (100 - cohort.supportCoverage) * 0.14
        + Math.min(cohort.riskFactors.length * 8, 16)
        + clamp(cohort.learnerCount / 5, 0, 12)
    ));
}

function interventionFit(intervention, cohort) {
    const domainBoost = intervention.domains.reduce((acc, domain) => {
        if (domain === 'attendance') return acc + (100 - cohort.attendanceRate) * 0.3;
        if (domain === 'performance') return acc + (100 - cohort.performanceIndex) * 0.35;
        if (domain === 'resource_access') return acc + (100 - cohort.resourceAccess) * 0.25;
        if (domain === 'family_outreach') return acc + (cohort.riskFactors.length > 0 ? 12 : 4);
        return acc + 3;
    }, 0);

    return clamp(Math.round(
        intervention.expectedGain * 1.6
        + intervention.intensity * 0.35
        + domainBoost * 0.45
        - intervention.capacityCost * 1.2
    ));
}

function planSupport(cohorts, interventions, capacity) {
    let remainingSlots = capacity.interventionSlots;
    let remainingTutorHours = capacity.tutorHours;
    let remainingOutreachHours = capacity.outreachHours;

    const prioritized = cohorts.map((cohort) => ({
        ...cohort,
        priorityScore: cohortPriorityScore(cohort)
    })).sort((a, b) => b.priorityScore - a.priorityScore);

    const plans = [];
    for (const cohort of prioritized) {
        const rankedInterventions = interventions.map((intervention) => ({
            interventionId: intervention.interventionId,
            name: intervention.name,
            capacityCost: intervention.capacityCost,
            fitScore: interventionFit(intervention, cohort),
            domains: [...intervention.domains]
        })).sort((a, b) => b.fitScore - a.fitScore);

        const selected = [];
        for (const intervention of rankedInterventions) {
            if (selected.length >= 2) break;
            if (remainingSlots <= 0) break;
            if (intervention.capacityCost > remainingSlots) continue;
            selected.push(intervention);
            remainingSlots -= intervention.capacityCost;
        }

        const tutorNeed = Math.max(0, Math.round((100 - cohort.performanceIndex) * 0.18 + cohort.learnerCount * 0.4));
        const outreachNeed = Math.max(0, Math.round((100 - cohort.attendanceRate) * 0.12 + cohort.riskFactors.length * 2.5));
        const tutorAllocated = Math.min(remainingTutorHours, tutorNeed);
        const outreachAllocated = Math.min(remainingOutreachHours, outreachNeed);
        remainingTutorHours -= tutorAllocated;
        remainingOutreachHours -= outreachAllocated;

        const projectedImprovement = clamp(Math.round(
            selected.reduce((acc, intervention) => acc + intervention.fitScore, 0) * 0.08
            + tutorAllocated * 0.12
            + outreachAllocated * 0.15
        ));
        const supportGap = clamp(Math.round(
            cohort.priorityScore * 0.6
            - projectedImprovement * 0.55
            + (selected.length === 0 ? 18 : 0)
            + (tutorAllocated < tutorNeed ? 12 : 0)
            + (outreachAllocated < outreachNeed ? 8 : 0)
        ));

        let lane = 'now';
        if (selected.length === 0 || supportGap > 70) lane = 'hold';
        else if (supportGap > 40) lane = 'next';

        plans.push({
            cohortId: cohort.cohortId,
            cohortName: cohort.name,
            learnerCount: cohort.learnerCount,
            region: cohort.region,
            priorityScore: cohort.priorityScore,
            selectedInterventions: selected,
            tutorNeed,
            tutorAllocated,
            outreachNeed,
            outreachAllocated,
            projectedImprovement,
            supportGap,
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
            interventionSlots: remainingSlots,
            tutorHours: remainingTutorHours,
            outreachHours: remainingOutreachHours
        }
    };
}

function summarizeSupport(plans, remainingCapacity) {
    const avgSupportGap = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.supportGap, 0) / plans.length).toFixed(2))
        : 0;
    const avgProjectedImprovement = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.projectedImprovement, 0) / plans.length).toFixed(2))
        : 0;

    const laneCounts = plans.reduce((acc, plan) => {
        acc[plan.lane] = (acc[plan.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    let posture = 'deploy_ready';
    if (laneCounts.hold > 0 || avgSupportGap > 60) posture = 'critical';
    else if (laneCounts.next > 0 || avgSupportGap > 40) posture = 'review_required';

    return {
        cohortCount: plans.length,
        laneCounts,
        avgSupportGap,
        avgProjectedImprovement,
        remainingCapacity,
        posture
    };
}

function buildAlerts(summary, plans) {
    const alerts = [];
    if (summary.laneCounts.hold > 0) alerts.push('education_support_hold_queue_present');
    if (summary.avgSupportGap > 55) alerts.push('education_support_gap_high');
    if (plans.some((plan) => plan.tutorAllocated < plan.tutorNeed)) alerts.push('education_tutor_capacity_gap');
    if (plans.some((plan) => plan.outreachAllocated < plan.outreachNeed)) alerts.push('education_outreach_capacity_gap');
    return alerts;
}

function buildRecommendations(plans, summary, alerts) {
    const recommendations = [];
    for (const plan of plans) {
        if (plan.lane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'launch_targeted_support',
                cohortId: plan.cohortId,
                title: `Launch support plan for ${plan.cohortName}`,
                description: `Projected improvement ${plan.projectedImprovement} with support gap ${plan.supportGap}.`,
                priority: plan.priorityScore >= 80 ? 'P1' : 'P2'
            });
        }
        if (plan.tutorAllocated < plan.tutorNeed) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'assign_tutor_capacity',
                cohortId: plan.cohortId,
                title: `Assign tutor capacity for ${plan.cohortName}`,
                description: `Tutor gap ${plan.tutorNeed - plan.tutorAllocated} hours.`,
                priority: plan.lane === 'hold' ? 'P0' : 'P1'
            });
        }
        if (plan.outreachAllocated < plan.outreachNeed || plan.priorityScore >= 75) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_family_outreach',
                cohortId: plan.cohortId,
                title: `Expand family outreach for ${plan.cohortName}`,
                description: `Outreach allocation ${plan.outreachAllocated}/${plan.outreachNeed}.`,
                priority: plan.lane === 'hold' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_education_support_brief',
            title: 'Publish education support rollout brief',
            description: 'Share cohort prioritization, intervention lanes, and capacity gaps.',
            priority: alerts.includes('education_support_hold_queue_present') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.cohortId || '').localeCompare(String(b.cohortId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.cohortId || '') === String(entry.cohortId || '')
        )) === index);
}

export function planEducationSupport(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const cohorts = normalizeCohorts(inputPayload || {});
    const interventions = normalizeInterventions(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const planning = planSupport(cohorts, interventions, capacity);
    const summary = summarizeSupport(planning.plans, planning.remainingCapacity);
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

export function educationSupportToTasks(reportPayload, {
    fromAgentId = 'agent:education-support',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('educationSupportToTasks requires report payload');
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
            cohortId: recommendation.cohortId || null,
            posture: reportPayload.summary?.posture || null,
            holdCount: reportPayload.summary?.laneCounts?.hold || 0
        },
        createdAt: nowMs + index
    }));
}

export class EducationSupportPlanner {
    constructor({
        localAgentId = 'agent:education-support',
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
        const report = planEducationSupport(inputPayload, {
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
        return educationSupportToTasks(reportPayload, {
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

export const __educationSupportPlannerInternals = {
    normalizeCohorts,
    normalizeInterventions,
    planSupport,
    summarizeSupport,
    buildRecommendations
};
