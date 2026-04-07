import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    adopt_team_topology: 'agent:ops',
    fill_team_capability_gap: 'agent:skills',
    rebalance_team_capacity: 'agent:ops-lead'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const MissionTypeTopologyMap = {
    incident: 'swat_cell',
    delivery: 'pod_mesh',
    research: 'hub_spoke',
    governance: 'matrix'
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
    return [...new Set(value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim().toLowerCase())
    )];
}

function normalizeAgents(inputPayload) {
    const source = Array.isArray(inputPayload?.agents)
        ? inputPayload.agents
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            agentId: typeof entry.agentId === 'string' && entry.agentId.trim()
                ? entry.agentId.trim()
                : `agent-${index + 1}`,
            skills: normalizeStringArray(entry.skills),
            reliability: clamp(safeNumber(entry.reliability, 70)),
            throughput: clamp(safeNumber(entry.throughput, 65)),
            coordinationCost: clamp(safeNumber(entry.coordinationCost, 35)),
            availability: clamp(safeNumber(entry.availability, 78))
        }));
}

function normalizeMissions(inputPayload) {
    const source = Array.isArray(inputPayload?.missions)
        ? inputPayload.missions
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            missionId: typeof entry.missionId === 'string' && entry.missionId.trim()
                ? entry.missionId.trim()
                : `mission-${index + 1}`,
            missionType: typeof entry.missionType === 'string' && entry.missionType.trim()
                ? entry.missionType.trim().toLowerCase()
                : 'delivery',
            requiredSkills: normalizeStringArray(entry.requiredSkills),
            riskScore: clamp(safeNumber(entry.riskScore, 48)),
            urgency: clamp(safeNumber(entry.urgency, 56)),
            coordinationComplexity: clamp(safeNumber(entry.coordinationComplexity, 50))
        }));
}

function topologyForMission(mission) {
    return MissionTypeTopologyMap[mission.missionType] || 'pod_mesh';
}

function selectTeam(mission, agents) {
    const scored = agents.map((agent) => {
        const skillOverlap = mission.requiredSkills.length > 0
            ? mission.requiredSkills.filter((skill) => agent.skills.includes(skill)).length / mission.requiredSkills.length
            : 0.5;

        const fitScore = clamp(Math.round(
            skillOverlap * 45
            + agent.reliability * 0.24
            + agent.throughput * 0.16
            + agent.availability * 0.15
            - agent.coordinationCost * 0.18
        ));

        return {
            agentId: agent.agentId,
            fitScore,
            skillOverlap: Number(skillOverlap.toFixed(4)),
            reliability: agent.reliability,
            availability: agent.availability
        };
    }).sort((a, b) => b.fitScore - a.fitScore);

    const teamSize = mission.riskScore >= 75 ? 4 : mission.coordinationComplexity >= 65 ? 3 : 2;
    const selectedAgents = scored.slice(0, Math.min(teamSize, scored.length));
    const coverage = mission.requiredSkills.length > 0
        ? mission.requiredSkills.filter((skill) => selectedAgents.some((agent) => agent.skillOverlap > 0 && agents.find((row) => row.agentId === agent.agentId)?.skills.includes(skill))).length / mission.requiredSkills.length
        : 1;

    const topology = topologyForMission(mission);
    const cohesionScore = clamp(Math.round(
        selectedAgents.reduce((acc, agent) => acc + agent.fitScore, 0) / Math.max(1, selectedAgents.length)
        - mission.coordinationComplexity * 0.18
        + coverage * 28
    ));

    return {
        missionId: mission.missionId,
        missionType: mission.missionType,
        topology,
        selectedAgents,
        requiredSkills: mission.requiredSkills,
        coverage: Number(coverage.toFixed(4)),
        cohesionScore,
        riskScore: mission.riskScore,
        urgency: mission.urgency,
        capabilityGap: coverage < 0.75
    };
}

function optimizeTopology(missions, agents) {
    return missions
        .map((mission) => selectTeam(mission, agents))
        .sort((a, b) => {
            if (Number(b.capabilityGap) !== Number(a.capabilityGap)) {
                return Number(b.capabilityGap) - Number(a.capabilityGap);
            }
            return b.riskScore - a.riskScore;
        });
}

function summarizeTopology(assignments) {
    const topologyCounts = assignments.reduce((acc, assignment) => {
        acc[assignment.topology] = (acc[assignment.topology] || 0) + 1;
        return acc;
    }, {
        swat_cell: 0,
        pod_mesh: 0,
        hub_spoke: 0,
        matrix: 0
    });

    const capabilityGapCount = assignments.filter((assignment) => assignment.capabilityGap).length;
    const avgCohesionScore = assignments.length > 0
        ? Number((assignments.reduce((acc, assignment) => acc + assignment.cohesionScore, 0) / assignments.length).toFixed(2))
        : 0;

    let posture = 'optimized';
    if (capabilityGapCount > 0 || avgCohesionScore < 68) posture = 'review_required';
    if (capabilityGapCount >= Math.ceil(Math.max(1, assignments.length * 0.4)) || avgCohesionScore < 52) {
        posture = 'understaffed';
    }

    return {
        missionCount: assignments.length,
        topologyCounts,
        capabilityGapCount,
        avgCohesionScore,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.capabilityGapCount > 0) alerts.push('team_capability_gaps_detected');
    if (summary.avgCohesionScore < 60) alerts.push('team_cohesion_low');
    if (summary.topologyCounts.swat_cell > 0) alerts.push('high_intensity_topology_allocated');
    return alerts;
}

function buildRecommendations(assignments, summary, alerts) {
    const recommendations = [];

    for (const assignment of assignments) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'adopt_team_topology',
            missionId: assignment.missionId,
            topology: assignment.topology,
            title: `Adopt ${assignment.topology} for ${assignment.missionId}`,
            description: `Cohesion score ${assignment.cohesionScore} with coverage ${assignment.coverage}.`,
            priority: assignment.riskScore >= 75 ? 'P1' : 'P2'
        });

        if (assignment.capabilityGap) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'fill_team_capability_gap',
                missionId: assignment.missionId,
                topology: assignment.topology,
                title: `Fill capability gaps for ${assignment.missionId}`,
                description: `Skill coverage ${assignment.coverage} is below minimum threshold.`,
                priority: assignment.riskScore >= 70 ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'rebalance_team_capacity',
            title: 'Rebalance cross-mission team capacity',
            description: 'Adjust topology allocation and staffing levels to resolve mission pressure.',
            priority: summary.posture === 'understaffed' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.missionId || '').localeCompare(String(b.missionId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.missionId || '') === String(entry.missionId || '')
        )) === index);
}

export function optimizeAgentTeamTopology(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const agents = normalizeAgents(inputPayload || {});
    const missions = normalizeMissions(inputPayload || {});
    const assignments = optimizeTopology(missions, agents);
    const summary = summarizeTopology(assignments);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(assignments, summary, alerts);

    return {
        at,
        summary,
        assignments,
        alerts,
        recommendations
    };
}

export function teamTopologyToTasks(reportPayload, {
    fromAgentId = 'agent:team-topology',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('teamTopologyToTasks requires report payload');
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
            missionId: recommendation.missionId || null,
            topology: recommendation.topology || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class AgentTeamTopologyOptimizer {
    constructor({
        localAgentId = 'agent:team-topology',
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
        const report = optimizeAgentTeamTopology(inputPayload, {
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
        return teamTopologyToTasks(reportPayload, {
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

export const __agentTeamTopologyOptimizerInternals = {
    normalizeAgents,
    normalizeMissions,
    selectTeam,
    summarizeTopology,
    buildRecommendations
};
