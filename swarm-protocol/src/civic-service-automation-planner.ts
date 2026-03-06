import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    launch_service_automation: 'agent:civic-ops',
    add_human_assist_fallback: 'agent:service-desk',
    digitize_intake_channel: 'agent:product',
    publish_civic_service_plan: 'agent:ops'
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

function normalizeServices(inputPayload) {
    const services = Array.isArray(inputPayload?.services)
        ? inputPayload.services
        : [];
    return services
        .filter((service) => service && typeof service === 'object')
        .map((service, index) => ({
            serviceId: typeof service.serviceId === 'string' && service.serviceId.trim()
                ? service.serviceId.trim()
                : `service-${index + 1}`,
            name: typeof service.name === 'string' && service.name.trim()
                ? service.name.trim()
                : `Service ${index + 1}`,
            requestVolume: Math.max(0, Math.floor(safeNumber(service.requestVolume, 100))),
            backlog: Math.max(0, Math.floor(safeNumber(service.backlog, 20))),
            avgProcessingMinutes: Math.max(1, safeNumber(service.avgProcessingMinutes, 30)),
            manualEffort: clamp(safeNumber(service.manualEffort, 65)),
            citizenImpact: clamp(safeNumber(service.citizenImpact, 70)),
            digitalAccess: clamp(safeNumber(service.digitalAccess, 58)),
            equitySensitivity: clamp(safeNumber(service.equitySensitivity, 66)),
            domains: normalizeStringArray(service.domains)
        }));
}

function normalizeAutomations(inputPayload) {
    const automations = Array.isArray(inputPayload?.automations)
        ? inputPayload.automations
        : [];
    return automations
        .filter((automation) => automation && typeof automation === 'object')
        .map((automation, index) => ({
            automationId: typeof automation.automationId === 'string' && automation.automationId.trim()
                ? automation.automationId.trim()
                : `automation-${index + 1}`,
            name: typeof automation.name === 'string' && automation.name.trim()
                ? automation.name.trim()
                : `Automation ${index + 1}`,
            domains: normalizeStringArray(automation.domains),
            throughputGain: clamp(safeNumber(automation.throughputGain, 25)),
            complexityCost: clamp(safeNumber(automation.complexityCost, 45)),
            equityGuardrail: clamp(safeNumber(automation.equityGuardrail, 60)),
            capacityCost: Math.max(1, Math.floor(safeNumber(automation.capacityCost, 1)))
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};
    return {
        implementationSlots: Math.max(0, Math.floor(safeNumber(capacity.implementationSlots, 5))),
        engineeringHours: Math.max(0, Math.floor(safeNumber(capacity.engineeringHours, 80))),
        serviceDeskHours: Math.max(0, Math.floor(safeNumber(capacity.serviceDeskHours, 30)))
    };
}

function servicePriority(service) {
    return clamp(Math.round(
        clamp(service.requestVolume / 25, 0, 35)
        + clamp(service.backlog / 4, 0, 25)
        + service.manualEffort * 0.18
        + service.citizenImpact * 0.22
        + service.equitySensitivity * 0.15
        + (100 - service.digitalAccess) * 0.1
    ));
}

function automationFit(automation, service) {
    const domainOverlap = automation.domains.length === 0
        ? 0.3
        : automation.domains.filter((domain) => service.domains.includes(domain)).length / automation.domains.length;
    return clamp(Math.round(
        domainOverlap * 50
        + automation.throughputGain * 0.35
        + automation.equityGuardrail * 0.2
        - automation.complexityCost * 0.25
    ));
}

function planAutomation(services, automations, capacity) {
    let slots = capacity.implementationSlots;
    let engineeringHours = capacity.engineeringHours;
    let serviceDeskHours = capacity.serviceDeskHours;

    const prioritized = services.map((service) => ({
        ...service,
        priorityScore: servicePriority(service)
    })).sort((a, b) => b.priorityScore - a.priorityScore);

    const plans = [];
    for (const service of prioritized) {
        const rankedAutomations = automations.map((automation) => ({
            automationId: automation.automationId,
            name: automation.name,
            fitScore: automationFit(automation, service),
            capacityCost: automation.capacityCost,
            complexityCost: automation.complexityCost,
            equityGuardrail: automation.equityGuardrail
        })).sort((a, b) => b.fitScore - a.fitScore);

        let selected = null;
        for (const candidate of rankedAutomations) {
            const estimatedEngineering = Math.max(6, Math.round(candidate.complexityCost * 0.9));
            if (slots <= 0) continue;
            if (candidate.capacityCost > slots) continue;
            if (estimatedEngineering > engineeringHours) continue;
            selected = {
                ...candidate,
                estimatedEngineering
            };
            slots -= candidate.capacityCost;
            engineeringHours -= estimatedEngineering;
            break;
        }

        const fallbackNeed = clamp(Math.round(
            (100 - service.digitalAccess) * 0.45
            + service.equitySensitivity * 0.35
            + (selected ? 10 : 22)
        ));
        const fallbackAllocated = Math.min(serviceDeskHours, Math.round(fallbackNeed * 0.5));
        serviceDeskHours -= fallbackAllocated;

        const projectedBacklogReduction = selected
            ? clamp(Math.round(
                selected.fitScore * 0.35
                + selected.equityGuardrail * 0.25
                + (100 - service.manualEffort) * 0.1
            ))
            : 0;
        const automationGap = clamp(Math.round(
            service.priorityScore * 0.65
            - projectedBacklogReduction * 0.55
            + (selected ? 0 : 18)
            + (fallbackAllocated < fallbackNeed ? 12 : 0)
        ));

        let lane = 'now';
        if (!selected && automationGap > 70) lane = 'hold';
        else if (automationGap > 45) lane = 'next';

        plans.push({
            serviceId: service.serviceId,
            serviceName: service.name,
            priorityScore: service.priorityScore,
            selectedAutomation: selected,
            projectedBacklogReduction,
            fallbackNeed,
            fallbackAllocated,
            automationGap,
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
            implementationSlots: slots,
            engineeringHours,
            serviceDeskHours
        }
    };
}

function summarizePlans(plans, remainingCapacity) {
    const avgAutomationGap = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.automationGap, 0) / plans.length).toFixed(2))
        : 0;
    const avgBacklogReduction = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.projectedBacklogReduction, 0) / plans.length).toFixed(2))
        : 0;
    const laneCounts = plans.reduce((acc, plan) => {
        acc[plan.lane] = (acc[plan.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    let posture = 'deploy_ready';
    if (laneCounts.hold > 0 || avgAutomationGap > 60) posture = 'critical';
    else if (laneCounts.next > 0 || avgAutomationGap > 42) posture = 'review_required';

    return {
        serviceCount: plans.length,
        laneCounts,
        avgAutomationGap,
        avgBacklogReduction,
        remainingCapacity,
        posture
    };
}

function buildAlerts(summary, plans) {
    const alerts = [];
    if (summary.laneCounts.hold > 0) alerts.push('civic_service_hold_queue_present');
    if (summary.avgAutomationGap > 55) alerts.push('civic_automation_gap_high');
    if (plans.some((plan) => plan.fallbackAllocated < plan.fallbackNeed)) alerts.push('civic_human_assist_gap');
    if (plans.some((plan) => !plan.selectedAutomation)) alerts.push('civic_automation_coverage_gap');
    return alerts;
}

function buildRecommendations(plans, summary, alerts) {
    const recommendations = [];
    for (const plan of plans) {
        if (plan.selectedAutomation && plan.lane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'launch_service_automation',
                serviceId: plan.serviceId,
                title: `Launch automation for ${plan.serviceName}`,
                description: `Projected backlog reduction ${plan.projectedBacklogReduction}.`,
                priority: plan.priorityScore >= 80 ? 'P1' : 'P2'
            });
        }
        if (plan.fallbackAllocated < plan.fallbackNeed) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_human_assist_fallback',
                serviceId: plan.serviceId,
                title: `Add human assist fallback for ${plan.serviceName}`,
                description: `Fallback allocation ${plan.fallbackAllocated}/${plan.fallbackNeed}.`,
                priority: plan.lane === 'hold' ? 'P0' : 'P1'
            });
        }
        if (!plan.selectedAutomation || plan.automationGap > 58) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'digitize_intake_channel',
                serviceId: plan.serviceId,
                title: `Digitize intake channel for ${plan.serviceName}`,
                description: `Automation gap ${plan.automationGap} requires intake modernization.`,
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_civic_service_plan',
            title: 'Publish civic service automation plan',
            description: 'Share lane assignments, automation decisions, and assistive fallback commitments.',
            priority: alerts.includes('civic_service_hold_queue_present') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.serviceId || '').localeCompare(String(b.serviceId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.serviceId || '') === String(entry.serviceId || '')
        )) === index);
}

export function planCivicServiceAutomation(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const services = normalizeServices(inputPayload || {});
    const automations = normalizeAutomations(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const planning = planAutomation(services, automations, capacity);
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

export function civicAutomationToTasks(reportPayload, {
    fromAgentId = 'agent:civic-automation',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('civicAutomationToTasks requires report payload');
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
            serviceId: recommendation.serviceId || null,
            posture: reportPayload.summary?.posture || null,
            holdCount: reportPayload.summary?.laneCounts?.hold || 0
        },
        createdAt: nowMs + index
    }));
}

export class CivicServiceAutomationPlanner {
    constructor({
        localAgentId = 'agent:civic-automation',
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
        const report = planCivicServiceAutomation(inputPayload, {
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
        return civicAutomationToTasks(reportPayload, {
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

export const __civicServiceAutomationPlannerInternals = {
    normalizeServices,
    normalizeAutomations,
    planAutomation,
    summarizePlans,
    buildRecommendations
};
