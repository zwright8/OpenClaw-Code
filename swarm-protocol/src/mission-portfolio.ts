import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const LaneOrder = {
    now: 0,
    next: 1,
    hold: 2
};

const ModePenalty = {
    normal: 0,
    degraded: 8,
    restricted: 18,
    halted: 35
};

const StatusAdjustment = {
    ready: 8,
    needs_attention: -8,
    blocked: -35
};

const RecommendationPriority = {
    unblock_mission: 'P1',
    prepare_mission: 'P2'
};

const RecommendationTargetMap = {
    unblock_mission: 'agent:planner',
    prepare_mission: 'agent:planner'
};

const PriorityToTaskPriority = {
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

function normalizeMode(mode) {
    const normalized = typeof mode === 'string' ? mode.trim().toLowerCase() : 'normal';
    return ['normal', 'degraded', 'restricted', 'halted'].includes(normalized)
        ? normalized
        : 'normal';
}

function normalizeStatus(status) {
    const normalized = typeof status === 'string' ? status.trim().toLowerCase() : 'ready';
    return ['ready', 'needs_attention', 'blocked'].includes(normalized)
        ? normalized
        : 'ready';
}

function mapTaskPriority(score) {
    if (score >= 85) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 50) return 'normal';
    return 'low';
}

function deadlineBoost(deadlineAt, nowMs) {
    if (!Number.isFinite(Number(deadlineAt))) return 0;
    const deltaMs = Number(deadlineAt) - Number(nowMs);
    if (deltaMs <= 0) return 15;
    const hours = deltaMs / 3_600_000;
    if (hours <= 24) return 12;
    if (hours <= 72) return 6;
    if (hours <= 168) return 2;
    return 0;
}

function normalizeMissionEntry(item, index) {
    const missionPlan = item?.missionPlan && typeof item.missionPlan === 'object'
        ? item.missionPlan
        : {};
    const readinessReport = item?.readinessReport && typeof item.readinessReport === 'object'
        ? item.readinessReport
        : {};
    const governorDecision = item?.governorDecision && typeof item.governorDecision === 'object'
        ? item.governorDecision
        : {};

    const missionId = missionPlan.missionId || item?.missionId || `mission-${index + 1}`;
    const objective = missionPlan.objective || item?.objective || missionId;
    const preferredTarget = item?.preferredTarget
        || missionPlan.preferredTarget
        || (Array.isArray(missionPlan.nodes)
            ? (missionPlan.nodes.find((node) => typeof node?.target === 'string')?.target || null)
            : null);
    const impactScore = clamp(safeNumber(item?.impactScore, 50));
    const urgencyScore = clamp(safeNumber(item?.urgencyScore, 50));
    const readinessStatus = normalizeStatus(readinessReport.status);
    const readinessScore = clamp(safeNumber(readinessReport.readinessScore, 80));
    const governorMode = normalizeMode(governorDecision.mode);
    const governorRiskScore = clamp(safeNumber(governorDecision.riskScore, 0));
    const estimatedDurationMs = Number.isFinite(Number(missionPlan.estimatedDurationMs))
        ? Number(missionPlan.estimatedDurationMs)
        : safeNumber(item?.estimatedDurationMs, 60_000);
    const deadlineAt = Number.isFinite(Number(item?.deadlineAt))
        ? Number(item.deadlineAt)
        : null;

    return {
        missionId,
        objective,
        preferredTarget,
        impactScore,
        urgencyScore,
        readinessStatus,
        readinessScore,
        governorMode,
        governorRiskScore,
        estimatedDurationMs,
        deadlineAt
    };
}

function scoreMission(entry, nowMs, weights) {
    const impactContribution = entry.impactScore * weights.impact;
    const urgencyContribution = entry.urgencyScore * weights.urgency;
    const readinessContribution = (entry.readinessScore - 70) * weights.readinessScore;
    const statusContribution = StatusAdjustment[entry.readinessStatus] ?? 0;
    const modePenalty = ModePenalty[entry.governorMode] ?? 0;
    const riskPenalty = entry.governorRiskScore * weights.governorRiskScore;
    const deadlineContribution = deadlineBoost(entry.deadlineAt, nowMs);

    const total = clamp(Math.round(
        impactContribution
        + urgencyContribution
        + readinessContribution
        + statusContribution
        + deadlineContribution
        - modePenalty
        - riskPenalty
    ));

    return {
        score: total,
        breakdown: {
            impactContribution: Number(impactContribution.toFixed(2)),
            urgencyContribution: Number(urgencyContribution.toFixed(2)),
            readinessContribution: Number(readinessContribution.toFixed(2)),
            statusContribution,
            deadlineContribution,
            modePenalty,
            riskPenalty: Number(riskPenalty.toFixed(2))
        }
    };
}

function initialLaneFor(entry, score) {
    if (entry.readinessStatus === 'blocked' || entry.governorMode === 'halted') {
        return 'hold';
    }
    if (score >= 70) return 'now';
    if (score >= 45) return 'next';
    return 'hold';
}

function buildRecommendations(rankedEntries) {
    const recommendations = [];

    for (const entry of rankedEntries) {
        if (entry.scheduledLane === 'hold' && entry.readinessStatus === 'blocked') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'unblock_mission',
                missionId: entry.missionId,
                title: `Unblock mission ${entry.missionId}`,
                description: `Mission is blocked and cannot be scheduled: ${entry.objective}`,
                priority: RecommendationPriority.unblock_mission
            });
        }

        if (entry.capacityDeferred === true) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'prepare_mission',
                missionId: entry.missionId,
                title: `Prepare mission ${entry.missionId} for next execution slot`,
                description: `Mission scored for immediate execution but was deferred due to capacity limits.`,
                priority: RecommendationPriority.prepare_mission
            });
        }
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.missionId).localeCompare(String(b.missionId));
    });
}

export function planMissionPortfolio(inputPayload, {
    now = Date.now,
    maxConcurrentMissions = 3,
    weights = {}
} = {}) {
    const nowMs = safeNow(now);
    const missions = Array.isArray(inputPayload?.missions)
        ? inputPayload.missions
        : [];
    const normalized = missions.map((mission, index) => normalizeMissionEntry(mission, index));

    const mergedWeights = {
        impact: safeNumber(weights.impact, 0.45),
        urgency: safeNumber(weights.urgency, 0.35),
        readinessScore: safeNumber(weights.readinessScore, 0.2),
        governorRiskScore: safeNumber(weights.governorRiskScore, 0.1)
    };

    const ranked = normalized.map((entry) => {
        const scored = scoreMission(entry, nowMs, mergedWeights);
        const lane = initialLaneFor(entry, scored.score);
        return {
            ...entry,
            score: scored.score,
            scoreBreakdown: scored.breakdown,
            lane,
            scheduledLane: lane,
            capacityDeferred: false,
            launchPriority: mapTaskPriority(scored.score)
        };
    }).sort((a, b) => {
        const laneCmp = LaneOrder[a.lane] - LaneOrder[b.lane];
        if (laneCmp !== 0) return laneCmp;
        if (b.score !== a.score) return b.score - a.score;
        return String(a.missionId).localeCompare(String(b.missionId));
    });

    const immediate = ranked.filter((entry) => entry.lane === 'now');
    const limit = Math.max(1, Math.floor(safeNumber(maxConcurrentMissions, 3)));
    for (let i = 0; i < immediate.length; i++) {
        if (i >= limit) {
            immediate[i].scheduledLane = 'next';
            immediate[i].capacityDeferred = true;
        }
    }

    const lanes = {
        now: ranked.filter((entry) => entry.scheduledLane === 'now').map((entry) => entry.missionId),
        next: ranked.filter((entry) => entry.scheduledLane === 'next').map((entry) => entry.missionId),
        hold: ranked.filter((entry) => entry.scheduledLane === 'hold').map((entry) => entry.missionId)
    };
    const recommendations = buildRecommendations(ranked);

    return {
        at: nowMs,
        summary: {
            missionCount: ranked.length,
            scheduledNowCount: lanes.now.length,
            scheduledNextCount: lanes.next.length,
            holdCount: lanes.hold.length,
            maxConcurrentMissions: limit
        },
        lanes,
        rankedMissions: ranked.map((entry) => clone(entry)),
        recommendations
    };
}

export function portfolioToTaskRequests(portfolioPayload, {
    fromAgentId = 'agent:mission-portfolio',
    defaultTarget = 'agent:ops',
    targetMap = {},
    includeRecommendations = true
} = {}) {
    if (!portfolioPayload || typeof portfolioPayload !== 'object') {
        throw new Error('portfolioToTaskRequests requires portfolio payload');
    }

    const rankedMissions = Array.isArray(portfolioPayload.rankedMissions)
        ? portfolioPayload.rankedMissions
        : [];
    const nowMissions = rankedMissions.filter((entry) => entry.scheduledLane === 'now');
    const recommendations = includeRecommendations && Array.isArray(portfolioPayload.recommendations)
        ? portfolioPayload.recommendations
        : [];
    const nowMs = safeNow(Date.now);
    const tasks = [];

    for (let index = 0; index < nowMissions.length; index++) {
        const mission = nowMissions[index];
        tasks.push(buildTaskRequest({
            id: randomUUID(),
            from: fromAgentId,
            target: mission.preferredTarget || defaultTarget,
            priority: mission.launchPriority || 'normal',
            task: `Launch mission ${mission.missionId}: ${mission.objective}`,
            context: {
                missionId: mission.missionId,
                objective: mission.objective,
                portfolioScore: mission.score,
                lane: mission.scheduledLane,
                scoreBreakdown: clone(mission.scoreBreakdown || {})
            },
            createdAt: nowMs + index
        }));
    }

    const recommendationTargets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };
    for (let i = 0; i < recommendations.length; i++) {
        const recommendation = recommendations[i];
        tasks.push(buildTaskRequest({
            id: randomUUID(),
            from: fromAgentId,
            target: recommendationTargets[recommendation.type] || defaultTarget,
            priority: PriorityToTaskPriority[recommendation.priority] || 'normal',
            task: `[${recommendation.priority}] Portfolio recommendation: ${recommendation.title}`,
            context: {
                missionId: recommendation.missionId,
                recommendationType: recommendation.type,
                description: recommendation.description
            },
            createdAt: nowMs + nowMissions.length + i
        }));
    }

    return tasks;
}

export class MissionPortfolioManager {
    constructor({
        localAgentId = 'agent:mission-portfolio',
        now = Date.now,
        maxHistory = 200
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 200;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = planMissionPortfolio(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(report);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(report);
    }

    buildTaskRequests(portfolioPayload, options = {}) {
        return portfolioToTaskRequests(portfolioPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 50 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 50))
            .map((entry) => clone(entry));
    }
}

export const __missionPortfolioInternals = {
    normalizeMissionEntry,
    scoreMission,
    initialLaneFor,
    deadlineBoost,
    mapTaskPriority
};
