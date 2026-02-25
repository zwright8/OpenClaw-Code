import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    deploy_nonprofit_copilot: 'agent:nonprofit-ops',
    configure_grant_reporting_flow: 'agent:finance',
    strengthen_volunteer_coordination: 'agent:community',
    publish_nonprofit_ops_brief: 'agent:ops'
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

function normalizePrograms(inputPayload) {
    const programs = Array.isArray(inputPayload?.programs)
        ? inputPayload.programs
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
            adminLoad: clamp(safeNumber(program.adminLoad, 65)),
            fundingVolatility: clamp(safeNumber(program.fundingVolatility, 52)),
            volunteerDependence: clamp(safeNumber(program.volunteerDependence, 60)),
            complianceBurden: clamp(safeNumber(program.complianceBurden, 58)),
            impactCriticality: clamp(safeNumber(program.impactCriticality, 72)),
            operationalDomains: normalizeStringArray(program.operationalDomains)
        }));
}

function normalizeCopilotCapabilities(inputPayload) {
    const capabilities = Array.isArray(inputPayload?.copilotCapabilities)
        ? inputPayload.copilotCapabilities
        : [];
    return capabilities
        .filter((capability) => capability && typeof capability === 'object')
        .map((capability, index) => ({
            capabilityId: typeof capability.capabilityId === 'string' && capability.capabilityId.trim()
                ? capability.capabilityId.trim()
                : `capability-${index + 1}`,
            name: typeof capability.name === 'string' && capability.name.trim()
                ? capability.name.trim()
                : `Capability ${index + 1}`,
            domains: normalizeStringArray(capability.domains),
            quality: clamp(safeNumber(capability.quality, 72)),
            reliability: clamp(safeNumber(capability.reliability, 74)),
            setupCost: clamp(safeNumber(capability.setupCost, 35)),
            governanceReadiness: clamp(safeNumber(capability.governanceReadiness, 68))
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};
    return {
        onboardingSlots: Math.max(0, Math.floor(safeNumber(capacity.onboardingSlots, 4))),
        implementationHours: Math.max(0, Math.floor(safeNumber(capacity.implementationHours, 60))),
        governanceReviewHours: Math.max(0, Math.floor(safeNumber(capacity.governanceReviewHours, 24)))
    };
}

function programPriority(program) {
    return clamp(Math.round(
        program.adminLoad * 0.22
        + program.complianceBurden * 0.2
        + program.fundingVolatility * 0.14
        + program.volunteerDependence * 0.16
        + program.impactCriticality * 0.28
    ));
}

function capabilityFit(capability, program) {
    const domainOverlap = capability.domains.length === 0
        ? 0.25
        : capability.domains.filter((domain) => program.operationalDomains.includes(domain)).length / capability.domains.length;
    return clamp(Math.round(
        domainOverlap * 48
        + capability.quality * 0.26
        + capability.reliability * 0.22
        + capability.governanceReadiness * 0.18
        - capability.setupCost * 0.2
    ));
}

function bridgePrograms(programs, capabilities, capacity) {
    let onboardingSlots = capacity.onboardingSlots;
    let implementationHours = capacity.implementationHours;
    let governanceReviewHours = capacity.governanceReviewHours;

    const prioritized = programs.map((program) => ({
        ...program,
        priorityScore: programPriority(program)
    })).sort((a, b) => b.priorityScore - a.priorityScore);

    const bridges = [];
    for (const program of prioritized) {
        const rankedCapabilities = capabilities.map((capability) => ({
            capabilityId: capability.capabilityId,
            name: capability.name,
            fitScore: capabilityFit(capability, program),
            setupCost: capability.setupCost,
            governanceReadiness: capability.governanceReadiness,
            domains: [...capability.domains]
        })).sort((a, b) => b.fitScore - a.fitScore);

        let selected = null;
        for (const candidate of rankedCapabilities) {
            const implementationNeed = Math.max(6, Math.round(candidate.setupCost * 1.2));
            const governanceNeed = Math.max(3, Math.round((100 - candidate.governanceReadiness) * 0.2));
            if (onboardingSlots <= 0) continue;
            if (implementationNeed > implementationHours) continue;
            if (governanceNeed > governanceReviewHours) continue;
            selected = {
                ...candidate,
                implementationNeed,
                governanceNeed
            };
            onboardingSlots -= 1;
            implementationHours -= implementationNeed;
            governanceReviewHours -= governanceNeed;
            break;
        }

        const projectedAdminReduction = selected
            ? clamp(Math.round(
                selected.fitScore * 0.32
                + (100 - program.adminLoad) * 0.1
                + selected.governanceReadiness * 0.16
            ))
            : 0;
        const opsGap = clamp(Math.round(
            program.priorityScore * 0.62
            - projectedAdminReduction * 0.55
            + (selected ? 0 : 20)
            + (program.fundingVolatility > 70 ? 10 : 0)
        ));

        let lane = 'now';
        if (!selected && opsGap > 72) lane = 'hold';
        else if (opsGap > 45) lane = 'next';

        bridges.push({
            programId: program.programId,
            programName: program.name,
            priorityScore: program.priorityScore,
            selectedCapability: selected,
            projectedAdminReduction,
            opsGap,
            lane
        });
    }

    return {
        bridges: bridges.sort((a, b) => {
            const laneRank = { now: 0, next: 1, hold: 2 };
            const laneDiff = laneRank[a.lane] - laneRank[b.lane];
            if (laneDiff !== 0) return laneDiff;
            return b.priorityScore - a.priorityScore;
        }),
        remainingCapacity: {
            onboardingSlots,
            implementationHours,
            governanceReviewHours
        }
    };
}

function summarizeBridges(bridges, remainingCapacity) {
    const avgOpsGap = bridges.length > 0
        ? Number((bridges.reduce((acc, bridge) => acc + bridge.opsGap, 0) / bridges.length).toFixed(2))
        : 0;
    const avgAdminReduction = bridges.length > 0
        ? Number((bridges.reduce((acc, bridge) => acc + bridge.projectedAdminReduction, 0) / bridges.length).toFixed(2))
        : 0;
    const laneCounts = bridges.reduce((acc, bridge) => {
        acc[bridge.lane] = (acc[bridge.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    let posture = 'bridge_ready';
    if (laneCounts.hold > 0 || avgOpsGap > 60) posture = 'critical';
    else if (laneCounts.next > 0 || avgOpsGap > 42) posture = 'review_required';

    return {
        programCount: bridges.length,
        laneCounts,
        avgOpsGap,
        avgAdminReduction,
        remainingCapacity,
        posture
    };
}

function buildAlerts(summary, bridges) {
    const alerts = [];
    if (summary.laneCounts.hold > 0) alerts.push('nonprofit_ops_hold_queue_present');
    if (summary.avgOpsGap > 55) alerts.push('nonprofit_ops_gap_high');
    if (bridges.some((bridge) => !bridge.selectedCapability)) alerts.push('nonprofit_copilot_coverage_gap');
    if (bridges.some((bridge) => bridge.selectedCapability && bridge.selectedCapability.governanceReadiness < 60)) {
        alerts.push('nonprofit_governance_readiness_gap');
    }
    return alerts;
}

function buildRecommendations(bridges, summary, alerts) {
    const recommendations = [];
    for (const bridge of bridges) {
        if (bridge.selectedCapability && bridge.lane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'deploy_nonprofit_copilot',
                programId: bridge.programId,
                title: `Deploy copilot for ${bridge.programName}`,
                description: `Projected admin reduction ${bridge.projectedAdminReduction}.`,
                priority: bridge.priorityScore >= 80 ? 'P1' : 'P2'
            });
        }
        if (!bridge.selectedCapability || bridge.opsGap > 55) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'configure_grant_reporting_flow',
                programId: bridge.programId,
                title: `Configure grant reporting flow for ${bridge.programName}`,
                description: `Operations gap ${bridge.opsGap} requires reporting automation.`,
                priority: bridge.lane === 'hold' ? 'P0' : 'P1'
            });
        }
        if (bridge.priorityScore >= 70 || bridge.opsGap > 50) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'strengthen_volunteer_coordination',
                programId: bridge.programId,
                title: `Strengthen volunteer coordination for ${bridge.programName}`,
                description: 'Program requires stronger volunteer scheduling and communications support.',
                priority: bridge.lane === 'hold' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_nonprofit_ops_brief',
            title: 'Publish nonprofit ops copilot brief',
            description: 'Share bridge lanes, deployment choices, and operations-risk gaps.',
            priority: alerts.includes('nonprofit_ops_hold_queue_present') ? 'P1' : 'P2'
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

export function bridgeNonprofitOpsCopilot(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const programs = normalizePrograms(inputPayload || {});
    const capabilities = normalizeCopilotCapabilities(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const planning = bridgePrograms(programs, capabilities, capacity);
    const summary = summarizeBridges(planning.bridges, planning.remainingCapacity);
    const alerts = buildAlerts(summary, planning.bridges);
    const recommendations = buildRecommendations(planning.bridges, summary, alerts);

    return {
        at,
        summary,
        bridges: planning.bridges,
        alerts,
        recommendations
    };
}

export function nonprofitOpsToTasks(reportPayload, {
    fromAgentId = 'agent:nonprofit-copilot',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('nonprofitOpsToTasks requires report payload');
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
            posture: reportPayload.summary?.posture || null,
            holdCount: reportPayload.summary?.laneCounts?.hold || 0
        },
        createdAt: nowMs + index
    }));
}

export class NonprofitOpsCopilotBridge {
    constructor({
        localAgentId = 'agent:nonprofit-copilot',
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
        const report = bridgeNonprofitOpsCopilot(inputPayload, {
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
        return nonprofitOpsToTasks(reportPayload, {
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

export const __nonprofitOpsCopilotBridgeInternals = {
    normalizePrograms,
    normalizeCopilotCapabilities,
    bridgePrograms,
    summarizeBridges,
    buildRecommendations
};
