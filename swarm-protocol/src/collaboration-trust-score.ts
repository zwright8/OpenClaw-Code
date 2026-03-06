import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    initiate_trust_repair: 'agent:collaboration',
    schedule_joint_retrospective: 'agent:ops',
    add_evidence_transparency: 'agent:governance',
    publish_trust_dashboard: 'agent:ops'
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

function normalizeCollaborations(inputPayload) {
    const collaborations = Array.isArray(inputPayload?.collaborations)
        ? inputPayload.collaborations
        : [];

    return collaborations
        .filter((collaboration) => collaboration && typeof collaboration === 'object')
        .map((collaboration, index) => ({
            collaborationId: typeof collaboration.collaborationId === 'string' && collaboration.collaborationId.trim()
                ? collaboration.collaborationId.trim()
                : `collaboration-${index + 1}`,
            name: typeof collaboration.name === 'string' && collaboration.name.trim()
                ? collaboration.name.trim()
                : `Collaboration ${index + 1}`,
            participants: normalizeStringArray(collaboration.participants),
            sharedObjectiveClarity: clamp(safeNumber(collaboration.sharedObjectiveClarity, 65)),
            commitmentReliability: clamp(safeNumber(collaboration.commitmentReliability, 62)),
            transparency: clamp(safeNumber(collaboration.transparency, 58)),
            evidenceTraceability: clamp(safeNumber(collaboration.evidenceTraceability, 55)),
            coordinationLatency: Math.max(0, Math.floor(safeNumber(collaboration.coordinationLatency, 24))),
            resolutionRate: clamp(safeNumber(collaboration.resolutionRate, 63)),
            incidentRate: clamp(safeNumber(collaboration.incidentRate, 22)),
            reviewCadenceDays: Math.max(1, Math.floor(safeNumber(collaboration.reviewCadenceDays, 21)))
        }));
}

function trustScore(collaboration) {
    const latencyPenalty = clamp(collaboration.coordinationLatency * 1.7);
    return clamp(Math.round(
        collaboration.sharedObjectiveClarity * 0.14
        + collaboration.commitmentReliability * 0.24
        + collaboration.transparency * 0.16
        + collaboration.evidenceTraceability * 0.14
        + collaboration.resolutionRate * 0.16
        + (100 - latencyPenalty) * 0.08
        + (100 - collaboration.incidentRate) * 0.08
    ));
}

function trustTier(score) {
    if (score >= 80) return 'high';
    if (score >= 65) return 'moderate';
    if (score >= 50) return 'low';
    return 'critical';
}

function evaluateCollaborations(collaborations) {
    return collaborations
        .map((collaboration) => {
            const score = trustScore(collaboration);
            const cadencePenalty = clamp((collaboration.reviewCadenceDays - 14) * 2, 0, 24);
            const riskPressure = clamp(Math.round(
                (100 - score) * 0.68
                + collaboration.incidentRate * 0.18
                + cadencePenalty
            ));

            return {
                collaborationId: collaboration.collaborationId,
                name: collaboration.name,
                participants: [...collaboration.participants],
                trustScore: score,
                trustTier: trustTier(score),
                riskPressure,
                transparency: collaboration.transparency,
                evidenceTraceability: collaboration.evidenceTraceability,
                resolutionRate: collaboration.resolutionRate,
                coordinationLatency: collaboration.coordinationLatency,
                incidentRate: collaboration.incidentRate,
                reviewCadenceDays: collaboration.reviewCadenceDays
            };
        })
        .sort((a, b) => {
            const tierRank = { critical: 0, low: 1, moderate: 2, high: 3 };
            const tierDiff = tierRank[a.trustTier] - tierRank[b.trustTier];
            if (tierDiff !== 0) return tierDiff;
            return a.trustScore - b.trustScore;
        });
}

function summarizeEvaluations(evaluations) {
    const avgTrustScore = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.trustScore, 0) / evaluations.length).toFixed(2))
        : 0;
    const avgRiskPressure = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.riskPressure, 0) / evaluations.length).toFixed(2))
        : 0;

    const tierCounts = evaluations.reduce((acc, entry) => {
        acc[entry.trustTier] = (acc[entry.trustTier] || 0) + 1;
        return acc;
    }, { high: 0, moderate: 0, low: 0, critical: 0 });

    let posture = 'trusted';
    if (tierCounts.critical > 0 || avgTrustScore < 55 || avgRiskPressure > 62) posture = 'critical';
    else if (tierCounts.low > 0 || avgTrustScore < 68 || avgRiskPressure > 48) posture = 'review_required';

    return {
        collaborationCount: evaluations.length,
        tierCounts,
        avgTrustScore,
        avgRiskPressure,
        posture
    };
}

function buildAlerts(summary, evaluations) {
    const alerts = [];
    if (summary.tierCounts.critical > 0) alerts.push('collaboration_trust_critical_present');
    if (evaluations.some((entry) => entry.incidentRate >= 55)) alerts.push('collaboration_incident_rate_high');
    if (evaluations.some((entry) => entry.transparency < 55 || entry.evidenceTraceability < 55)) {
        alerts.push('collaboration_transparency_gap');
    }
    if (evaluations.some((entry) => entry.reviewCadenceDays > 35)) alerts.push('collaboration_review_cadence_stale');
    return alerts;
}

function buildRecommendations(evaluations, summary, alerts) {
    const recommendations = [];
    for (const entry of evaluations) {
        if (entry.trustTier === 'critical' || entry.trustTier === 'low') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'initiate_trust_repair',
                collaborationId: entry.collaborationId,
                title: `Initiate trust repair for ${entry.name}`,
                description: `Trust score ${entry.trustScore} with risk pressure ${entry.riskPressure}.`,
                priority: entry.trustTier === 'critical' ? 'P0' : 'P1'
            });
        }
        if (entry.transparency < 65 || entry.evidenceTraceability < 65) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_evidence_transparency',
                collaborationId: entry.collaborationId,
                title: `Improve evidence transparency for ${entry.name}`,
                description: `Transparency ${entry.transparency} and evidence traceability ${entry.evidenceTraceability}.`,
                priority: entry.trustTier === 'critical' ? 'P1' : 'P2'
            });
        }
        if (entry.resolutionRate < 65 || entry.coordinationLatency > 40 || entry.reviewCadenceDays > 28) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'schedule_joint_retrospective',
                collaborationId: entry.collaborationId,
                title: `Schedule joint retrospective for ${entry.name}`,
                description: 'Address response latency, issue closure performance, and review cadence.',
                priority: entry.trustTier === 'critical' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_trust_dashboard',
            title: 'Publish collaboration trust dashboard',
            description: 'Publish trust tiers, pressure points, and remediation owners across collaborations.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.collaborationId || '').localeCompare(String(b.collaborationId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.collaborationId || '') === String(entry.collaborationId || '')
        )) === index);
}

export function scoreCollaborationTrust(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const collaborations = normalizeCollaborations(inputPayload || {});
    const evaluations = evaluateCollaborations(collaborations);
    const summary = summarizeEvaluations(evaluations);
    const alerts = buildAlerts(summary, evaluations);
    const recommendations = buildRecommendations(evaluations, summary, alerts);

    return {
        at,
        summary,
        evaluations,
        alerts,
        recommendations
    };
}

export function collaborationTrustToTasks(reportPayload, {
    fromAgentId = 'agent:collaboration-trust',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('collaborationTrustToTasks requires report payload');
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
            collaborationId: recommendation.collaborationId || null,
            posture: reportPayload.summary?.posture || null,
            criticalCount: reportPayload.summary?.tierCounts?.critical || 0
        },
        createdAt: nowMs + index
    }));
}

export class CollaborationTrustScoreEngine {
    constructor({
        localAgentId = 'agent:collaboration-trust',
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
        const report = scoreCollaborationTrust(inputPayload, {
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
        return collaborationTrustToTasks(reportPayload, {
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

export const __collaborationTrustScoreInternals = {
    normalizeCollaborations,
    evaluateCollaborations,
    summarizeEvaluations,
    buildRecommendations
};
