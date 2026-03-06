import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    assign_crisis_lead: 'agent:ops-lead',
    open_joint_war_room: 'agent:ops',
    request_mutual_aid: 'agent:federation',
    sync_cross_team_timeline: 'agent:ops',
    publish_coordination_plan: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const SeverityRank = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
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

function normalizeTeams(inputPayload) {
    const teams = Array.isArray(inputPayload?.teams)
        ? inputPayload.teams
        : [];
    return teams
        .filter((team) => team && typeof team === 'object')
        .map((team, index) => ({
            id: typeof team.id === 'string' && team.id.trim()
                ? team.id.trim()
                : `team-${index + 1}`,
            name: typeof team.name === 'string' && team.name.trim()
                ? team.name.trim()
                : `Team ${index + 1}`,
            specialties: normalizeStringArray(team.specialties),
            regionCoverage: normalizeStringArray(team.regionCoverage),
            capacity: Math.max(1, Math.floor(safeNumber(team.capacity, 4))),
            activeLoad: Math.max(0, Math.floor(safeNumber(team.activeLoad, 0))),
            shiftStatus: typeof team.shiftStatus === 'string' && team.shiftStatus.trim()
                ? team.shiftStatus.trim()
                : 'active'
        }));
}

function normalizeCrises(inputPayload) {
    const crises = Array.isArray(inputPayload?.crises)
        ? inputPayload.crises
        : [];
    return crises
        .filter((crisis) => crisis && typeof crisis === 'object')
        .map((crisis, index) => ({
            crisisId: typeof crisis.crisisId === 'string' && crisis.crisisId.trim()
                ? crisis.crisisId.trim()
                : `crisis-${index + 1}`,
            title: typeof crisis.title === 'string' && crisis.title.trim()
                ? crisis.title.trim()
                : `Crisis ${index + 1}`,
            severity: typeof crisis.severity === 'string' && SeverityRank[crisis.severity.trim()]
                ? crisis.severity.trim()
                : 'high',
            region: typeof crisis.region === 'string' && crisis.region.trim()
                ? crisis.region.trim()
                : 'global',
            requiredCapabilities: normalizeStringArray(crisis.requiredCapabilities),
            impactedPopulation: Math.max(0, Math.floor(safeNumber(crisis.impactedPopulation, 0))),
            deadlineMinutes: Math.max(10, Math.floor(safeNumber(crisis.deadlineMinutes, 90))),
            communicationRequired: crisis.communicationRequired !== false
        }));
}

function teamSuitability(team, crisis) {
    const specialtyHits = crisis.requiredCapabilities.filter((capability) => (
        team.specialties.includes(capability)
    )).length;
    const capabilityCoverage = crisis.requiredCapabilities.length > 0
        ? specialtyHits / crisis.requiredCapabilities.length
        : 0.25;
    const regionMatch = team.regionCoverage.length === 0
        || team.regionCoverage.includes('global')
        || team.regionCoverage.includes(crisis.region);
    const loadUtilization = team.activeLoad / team.capacity;
    const capacityScore = clamp((1 - loadUtilization) * 100);

    return clamp(Math.round(
        capabilityCoverage * 58
        + (regionMatch ? 22 : 5)
        + capacityScore * 0.2
        + (team.shiftStatus === 'active' ? 8 : 0)
    ));
}

function assignRoles(crisis, teams) {
    const ranked = teams.map((team) => ({
        teamId: team.id,
        teamName: team.name,
        suitability: teamSuitability(team, crisis),
        loadUtilization: Number((team.activeLoad / team.capacity).toFixed(2)),
        specialties: [...team.specialties]
    })).sort((a, b) => b.suitability - a.suitability);

    const lead = ranked[0] || null;
    const mitigation = ranked[1] || lead;
    const communications = crisis.communicationRequired
        ? (ranked.find((entry) => entry.specialties.includes('communications')) || ranked[2] || lead)
        : null;
    const logistics = ranked.find((entry) => entry.specialties.includes('logistics')) || ranked[3] || mitigation;

    const assigned = [lead, mitigation, communications, logistics]
        .filter(Boolean)
        .map((entry) => entry.teamId);
    const uniqueAssignments = new Set(assigned);
    const roleCoverage = {
        lead: !!lead,
        mitigation: !!mitigation,
        communications: !crisis.communicationRequired || !!communications,
        logistics: !!logistics
    };
    const missingRoles = Object.entries(roleCoverage)
        .filter(([, covered]) => !covered)
        .map(([role]) => role);

    const avgSuitability = ranked.length > 0
        ? Number((ranked.slice(0, 4).reduce((acc, entry) => acc + entry.suitability, 0) / Math.min(4, ranked.length)).toFixed(2))
        : 0;
    const coordinationRisk = clamp(Math.round(
        (100 - avgSuitability) * 0.5
        + missingRoles.length * 22
        + (uniqueAssignments.size <= 1 ? 14 : 0)
        + (crisis.deadlineMinutes < 45 ? 10 : 0)
    ));

    let posture = 'coordinated';
    if (coordinationRisk >= 75 || missingRoles.length > 1) posture = 'critical';
    else if (coordinationRisk >= 45 || missingRoles.length > 0) posture = 'review_required';

    return {
        crisisId: crisis.crisisId,
        title: crisis.title,
        severity: crisis.severity,
        region: crisis.region,
        deadlineMinutes: crisis.deadlineMinutes,
        impactedPopulation: crisis.impactedPopulation,
        requiredCapabilities: [...crisis.requiredCapabilities],
        assignments: {
            leadTeamId: lead?.teamId || null,
            mitigationTeamId: mitigation?.teamId || null,
            communicationsTeamId: communications?.teamId || null,
            logisticsTeamId: logistics?.teamId || null
        },
        roleCoverage,
        missingRoles,
        avgSuitability,
        coordinationRisk,
        posture,
        rankedTeams: ranked
    };
}

function summarizePlans(plans) {
    const avgCoordinationRisk = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.coordinationRisk, 0) / plans.length).toFixed(2))
        : 0;
    const missingRoleCount = plans.reduce((acc, plan) => acc + plan.missingRoles.length, 0);
    const criticalCount = plans.filter((plan) => plan.posture === 'critical').length;
    const reviewRequiredCount = plans.filter((plan) => plan.posture === 'review_required').length;

    let posture = 'ready';
    if (criticalCount > 0 || avgCoordinationRisk >= 70) posture = 'critical';
    else if (reviewRequiredCount > 0 || missingRoleCount > 0 || avgCoordinationRisk >= 50) posture = 'review_required';

    return {
        crisisCount: plans.length,
        coordinatedCount: plans.filter((plan) => plan.posture === 'coordinated').length,
        reviewRequiredCount,
        criticalCount,
        avgCoordinationRisk,
        missingRoleCount,
        posture
    };
}

function buildAlerts(summary, plans) {
    const alerts = [];
    if (summary.criticalCount > 0) alerts.push('crisis_coordination_critical');
    if (summary.missingRoleCount > 0) alerts.push('crisis_role_gap_detected');
    if (summary.avgCoordinationRisk >= 60) alerts.push('crisis_coordination_risk_high');
    if (plans.some((plan) => plan.deadlineMinutes <= 30 && plan.posture !== 'coordinated')) {
        alerts.push('crisis_deadline_at_risk');
    }
    return alerts;
}

function buildRecommendations(summary, plans, alerts) {
    const recommendations = [];

    for (const plan of plans) {
        if (!plan.assignments.leadTeamId) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'assign_crisis_lead',
                crisisId: plan.crisisId,
                title: `Assign crisis lead for ${plan.title}`,
                description: 'No lead team is currently assigned.',
                priority: 'P0'
            });
        }
        if (plan.posture !== 'coordinated') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'open_joint_war_room',
                crisisId: plan.crisisId,
                title: `Open war room for ${plan.title}`,
                description: `Coordination risk ${plan.coordinationRisk} with missing roles: ${plan.missingRoles.join(', ') || 'none'}.`,
                priority: plan.posture === 'critical' ? 'P0' : 'P1'
            });
        }
        if (plan.missingRoles.length > 0 || plan.avgSuitability < 60) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'request_mutual_aid',
                crisisId: plan.crisisId,
                title: `Request mutual aid for ${plan.title}`,
                description: 'Internal team coverage is insufficient for required crisis roles.',
                priority: 'P1'
            });
        }
        if (plan.posture !== 'coordinated') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'sync_cross_team_timeline',
                crisisId: plan.crisisId,
                title: `Synchronize cross-team timeline for ${plan.title}`,
                description: 'Create shared milestones and handoff windows across assigned teams.',
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_coordination_plan',
            title: 'Publish crisis coordination plan',
            description: 'Share current assignments, role gaps, and escalation ownership.',
            priority: alerts.includes('crisis_coordination_critical') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.crisisId || '').localeCompare(String(b.crisisId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.crisisId || '') === String(entry.crisisId || '')
        )) === index);
}

export function coordinateCrisisMesh(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const teams = normalizeTeams(inputPayload || {});
    const crises = normalizeCrises(inputPayload || {});
    const plans = crises.map((crisis) => assignRoles(crisis, teams))
        .sort((a, b) => {
            const postureRank = { critical: 0, review_required: 1, coordinated: 2 };
            const p = postureRank[a.posture] - postureRank[b.posture];
            if (p !== 0) return p;
            return b.coordinationRisk - a.coordinationRisk;
        });
    const summary = summarizePlans(plans);
    const alerts = buildAlerts(summary, plans);
    const recommendations = buildRecommendations(summary, plans, alerts);

    return {
        at,
        summary,
        plans,
        alerts,
        recommendations
    };
}

export function crisisCoordinationToTasks(reportPayload, {
    fromAgentId = 'agent:crisis-mesh',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('crisisCoordinationToTasks requires report payload');
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
            crisisId: recommendation.crisisId || null,
            posture: reportPayload.summary?.posture || null,
            criticalCount: reportPayload.summary?.criticalCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class CrisisCoordinationMesh {
    constructor({
        localAgentId = 'agent:crisis-mesh',
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
        const report = coordinateCrisisMesh(inputPayload, {
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
        return crisisCoordinationToTasks(reportPayload, {
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

export const __crisisCoordinationMeshInternals = {
    normalizeTeams,
    normalizeCrises,
    assignRoles,
    summarizePlans,
    buildRecommendations
};
