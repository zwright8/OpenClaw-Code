import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const LaneOrder = {
    now: 0,
    next: 1,
    backlog: 2
};

const CriticalityWeight = {
    critical: 24,
    high: 14,
    normal: 6,
    low: 2
};

const RecommendationTargetMap = {
    gather_evidence: 'agent:analysis',
    run_experiment: 'agent:research',
    falsify_hypothesis: 'agent:research',
    prepare_experiment: 'agent:planning'
};

const RecommendationTaskPriorityMap = {
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

function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

function clamp100(value) {
    return Math.max(0, Math.min(100, value));
}

function normalizeStringList(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function normalizeCriticality(value) {
    const normalized = typeof value === 'string' ? value.trim().toLowerCase() : 'normal';
    return Object.prototype.hasOwnProperty.call(CriticalityWeight, normalized)
        ? normalized
        : 'normal';
}

function normalizeStatus(value) {
    const normalized = typeof value === 'string' ? value.trim().toLowerCase() : 'uncertain';
    if (['supported', 'uncertain', 'unlikely'].includes(normalized)) {
        return normalized;
    }
    return 'uncertain';
}

function mapPriority(score, criticality) {
    if (score >= 88 || (criticality === 'critical' && score >= 75)) return 'P1';
    if (score >= 60) return 'P2';
    return 'P3';
}

function laneFromScore(score) {
    if (score >= 70) return 'now';
    if (score >= 40) return 'next';
    return 'backlog';
}

function normalizeHypothesisResults(inputPayload) {
    const truthResults = Array.isArray(inputPayload?.truthReport?.results)
        ? inputPayload.truthReport.results
        : [];
    const fallbackResults = Array.isArray(inputPayload?.hypothesisResults)
        ? inputPayload.hypothesisResults
        : [];
    const source = truthResults.length > 0 ? truthResults : fallbackResults;

    return source.map((row, index) => ({
        id: row?.id || `hypothesis-${index + 1}`,
        statement: row?.statement || `Hypothesis ${index + 1}`,
        priorConfidence: clamp(safeNumber(row?.priorConfidence, 0.5)),
        posteriorConfidence: clamp(safeNumber(row?.posteriorConfidence, row?.priorConfidence ?? 0.5)),
        confidenceDelta: safeNumber(row?.confidenceDelta, 0),
        supportScore: safeNumber(row?.supportScore, 0),
        contradictionScore: safeNumber(row?.contradictionScore, 0),
        status: normalizeStatus(row?.status),
        criticality: normalizeCriticality(row?.criticality),
        relatedMissionIds: normalizeStringList(row?.relatedMissionIds)
    }));
}

function buildMissionScoreMap(inputPayload) {
    const missions = Array.isArray(inputPayload?.missionPortfolio?.rankedMissions)
        ? inputPayload.missionPortfolio.rankedMissions
        : [];
    const map = new Map();
    for (const mission of missions) {
        const missionId = typeof mission?.missionId === 'string' ? mission.missionId : null;
        if (!missionId) continue;
        map.set(missionId, safeNumber(mission?.score, 0));
    }
    return map;
}

function missionCouplingScore(relatedMissionIds, missionScoreMap) {
    if (!Array.isArray(relatedMissionIds) || relatedMissionIds.length === 0) return 0;
    const scores = relatedMissionIds
        .map((id) => missionScoreMap.get(id))
        .filter((value) => Number.isFinite(value));
    if (scores.length === 0) return 0;
    const avg = scores.reduce((acc, value) => acc + value, 0) / scores.length;
    return Number((avg / 100).toFixed(4));
}

function scoreHypothesisItem(item, missionScoreMap) {
    const uncertainty = 1 - item.posteriorConfidence;
    const missionCoupling = missionCouplingScore(item.relatedMissionIds, missionScoreMap);
    const criticalityWeight = CriticalityWeight[item.criticality] ?? 6;

    let score = 0;
    score += uncertainty * 52;
    score += item.contradictionScore * 18;
    score += item.supportScore * 6;
    score += missionCoupling * 14;
    score += criticalityWeight;

    if (item.status === 'unlikely') {
        score += 10;
    } else if (item.status === 'uncertain') {
        score += 5;
    } else if (item.status === 'supported') {
        score -= 5;
    }

    if (item.criticality === 'critical' && item.posteriorConfidence >= 0.75) {
        score += 6;
    }

    const curiosityScore = Math.round(clamp100(score));
    return {
        curiosityScore,
        uncertainty: Number(uncertainty.toFixed(4)),
        missionCoupling: Number(missionCoupling.toFixed(4))
    };
}

function buildRecommendations(items) {
    const recommendations = [];
    for (const item of items) {
        const basePriority = mapPriority(item.curiosityScore, item.criticality);

        if (item.status === 'uncertain') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'gather_evidence',
                hypothesisId: item.id,
                title: `Gather additional evidence for ${item.id}`,
                description: `Hypothesis remains uncertain at confidence ${item.posteriorConfidence}.`,
                priority: basePriority
            });
        }

        if (item.status === 'unlikely') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'falsify_hypothesis',
                hypothesisId: item.id,
                title: `Challenge or replace ${item.id}`,
                description: `Hypothesis confidence is low (${item.posteriorConfidence}); run falsification workflow.`,
                priority: basePriority === 'P3' ? 'P2' : basePriority
            });
        }

        if (item.status === 'supported' && item.criticality === 'critical') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_experiment',
                hypothesisId: item.id,
                title: `Run confirmation experiment for ${item.id}`,
                description: 'Critical supported hypothesis should be validated before scaling.',
                priority: 'P2'
            });
        }

        if (item.capacityDeferred === true) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'prepare_experiment',
                hypothesisId: item.id,
                title: `Prepare deferred experiment for ${item.id}`,
                description: 'Item was in the now lane but deferred due to experiment capacity limits.',
                priority: 'P2'
            });
        }
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.hypothesisId).localeCompare(String(b.hypothesisId));
    });
}

export function compileCuriosityAgenda(inputPayload, {
    now = Date.now,
    maxConcurrentExperiments = 3
} = {}) {
    const at = safeNow(now);
    const hypotheses = normalizeHypothesisResults(inputPayload || {});
    const missionScoreMap = buildMissionScoreMap(inputPayload || {});

    const ranked = hypotheses.map((item) => {
        const scored = scoreHypothesisItem(item, missionScoreMap);
        const lane = laneFromScore(scored.curiosityScore);
        return {
            ...item,
            ...scored,
            lane,
            scheduledLane: lane,
            capacityDeferred: false,
            priority: mapPriority(scored.curiosityScore, item.criticality)
        };
    }).sort((a, b) => {
        const laneCmp = LaneOrder[a.lane] - LaneOrder[b.lane];
        if (laneCmp !== 0) return laneCmp;
        if (b.curiosityScore !== a.curiosityScore) return b.curiosityScore - a.curiosityScore;
        return String(a.id).localeCompare(String(b.id));
    });

    const limit = Math.max(1, Math.floor(safeNumber(maxConcurrentExperiments, 3)));
    const nowLane = ranked.filter((item) => item.lane === 'now');
    for (let i = 0; i < nowLane.length; i++) {
        if (i >= limit) {
            nowLane[i].scheduledLane = 'next';
            nowLane[i].capacityDeferred = true;
        }
    }

    const lanes = {
        now: ranked.filter((item) => item.scheduledLane === 'now').map((item) => item.id),
        next: ranked.filter((item) => item.scheduledLane === 'next').map((item) => item.id),
        backlog: ranked.filter((item) => item.scheduledLane === 'backlog').map((item) => item.id)
    };
    const recommendations = buildRecommendations(ranked);

    return {
        at,
        summary: {
            hypothesisCount: ranked.length,
            nowCount: lanes.now.length,
            nextCount: lanes.next.length,
            backlogCount: lanes.backlog.length,
            maxConcurrentExperiments: limit,
            avgCuriosityScore: ranked.length > 0
                ? Number((ranked.reduce((acc, item) => acc + item.curiosityScore, 0) / ranked.length).toFixed(2))
                : 0
        },
        lanes,
        rankedAgenda: ranked.map((item) => clone(item)),
        recommendations
    };
}

export function curiosityAgendaToTaskRequests(agendaPayload, {
    fromAgentId = 'agent:curiosity',
    defaultTarget = 'agent:analysis',
    targetMap = {}
} = {}) {
    if (!agendaPayload || typeof agendaPayload !== 'object') {
        throw new Error('curiosityAgendaToTaskRequests requires agenda payload');
    }

    const rankedAgenda = Array.isArray(agendaPayload.rankedAgenda)
        ? agendaPayload.rankedAgenda
        : [];
    const recommendations = Array.isArray(agendaPayload.recommendations)
        ? agendaPayload.recommendations
        : [];
    const tasks = [];
    const nowMs = safeNow(Date.now);

    const active = rankedAgenda.filter((item) => item.scheduledLane === 'now');
    for (let index = 0; index < active.length; index++) {
        const hypothesis = active[index];
        tasks.push(buildTaskRequest({
            id: randomUUID(),
            from: fromAgentId,
            target: defaultTarget,
            priority: RecommendationTaskPriorityMap[hypothesis.priority] || 'normal',
            task: `Investigate hypothesis ${hypothesis.id}: ${hypothesis.statement}`,
            context: {
                hypothesisId: hypothesis.id,
                curiosityScore: hypothesis.curiosityScore,
                uncertainty: hypothesis.uncertainty,
                status: hypothesis.status,
                criticality: hypothesis.criticality
            },
            createdAt: nowMs + index
        }));
    }

    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };
    for (let i = 0; i < recommendations.length; i++) {
        const recommendation = recommendations[i];
        tasks.push(buildTaskRequest({
            id: randomUUID(),
            from: fromAgentId,
            target: targets[recommendation.type] || defaultTarget,
            priority: RecommendationTaskPriorityMap[recommendation.priority] || 'normal',
            task: `[${recommendation.priority}] ${recommendation.title}`,
            context: {
                hypothesisId: recommendation.hypothesisId,
                recommendationType: recommendation.type,
                description: recommendation.description
            },
            createdAt: nowMs + active.length + i
        }));
    }

    return tasks;
}

export class CuriosityAgendaPlanner {
    constructor({
        localAgentId = 'agent:curiosity',
        now = Date.now,
        maxHistory = 180
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 180;
        this.history = [];
    }

    compile(inputPayload, options = {}) {
        const agenda = compileCuriosityAgenda(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(agenda);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(agenda);
    }

    buildTaskRequests(agendaPayload, options = {}) {
        return curiosityAgendaToTaskRequests(agendaPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 30 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 30))
            .map((entry) => clone(entry));
    }
}

export const __curiosityAgendaInternals = {
    normalizeHypothesisResults,
    buildMissionScoreMap,
    scoreHypothesisItem,
    buildRecommendations,
    laneFromScore
};
