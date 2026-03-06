import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const EscalationLevels = ['normal', 'watch', 'warning', 'severe', 'critical'];

const RecommendationTargetMap = {
    activate_harm_containment: 'agent:safety',
    launch_rapid_response_review: 'agent:review',
    protect_vulnerable_groups: 'agent:community',
    increase_monitoring: 'agent:ops'
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

function normalizeIncidents(inputPayload) {
    const entries = Array.isArray(inputPayload?.incidents)
        ? inputPayload.incidents
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `incident-${index + 1}`,
        harmType: typeof entry?.harmType === 'string' && entry.harmType.trim()
            ? entry.harmType.trim().toLowerCase()
            : 'general',
        severity: clamp(safeNumber(entry?.severity, 40)),
        growthRate: clamp(safeNumber(entry?.growthRate, 0)),
        affectedPopulation: Math.max(1, Math.floor(safeNumber(entry?.affectedPopulation, 1_000))),
        confidence: clamp(safeNumber(entry?.confidence, 60)),
        containmentCoverage: clamp(safeNumber(entry?.containmentCoverage, 35)),
        timestamp: Number.isFinite(Number(entry?.timestamp))
            ? Number(entry.timestamp)
            : Date.now()
    }));
}

function normalizeOptions(options) {
    return {
        now: typeof options?.now === 'function' ? options.now : Date.now,
        horizonHours: Math.max(1, Math.floor(safeNumber(options?.horizonHours, 72)))
    };
}

function aggregateIncidentSignals(incidents) {
    if (incidents.length === 0) {
        return {
            incidentCount: 0,
            avgSeverity: 0,
            avgGrowthRate: 0,
            aggregateAffectedPopulation: 0,
            weightedContainmentGap: 0,
            weightedConfidence: 0
        };
    }

    const incidentCount = incidents.length;
    const avgSeverity = incidents.reduce((acc, incident) => acc + incident.severity, 0) / incidentCount;
    const avgGrowthRate = incidents.reduce((acc, incident) => acc + incident.growthRate, 0) / incidentCount;
    const aggregateAffectedPopulation = incidents.reduce(
        (acc, incident) => acc + incident.affectedPopulation,
        0
    );

    const weightedContainmentGap = incidents.reduce(
        (acc, incident) => acc + ((100 - incident.containmentCoverage) * (incident.severity / 100)),
        0
    ) / incidentCount;

    const weightedConfidence = incidents.reduce(
        (acc, incident) => acc + incident.confidence,
        0
    ) / incidentCount;

    return {
        incidentCount,
        avgSeverity: Number(avgSeverity.toFixed(2)),
        avgGrowthRate: Number(avgGrowthRate.toFixed(2)),
        aggregateAffectedPopulation,
        weightedContainmentGap: Number(weightedContainmentGap.toFixed(2)),
        weightedConfidence: Number(weightedConfidence.toFixed(2))
    };
}

function externalSignalSnapshot(inputPayload) {
    const communitySummary = inputPayload?.communityReport?.summary || {};
    const equitySummary = inputPayload?.equityReport?.summary || {};
    const societalSummary = inputPayload?.societalReport?.summary || {};
    const externalitySummary = inputPayload?.externalityReport?.summary || {};
    const humanitySummary = inputPayload?.humanityReport?.summary || {};

    return {
        communityHighRiskCount: Math.max(0, Math.floor(safeNumber(communitySummary.highRiskCount, 0))),
        communityUrgentCount: Math.max(0, Math.floor(safeNumber(communitySummary.urgentCount, 0))),
        equityPosture: typeof equitySummary.posture === 'string'
            ? equitySummary.posture
            : 'aligned',
        equityDisparityGap: clamp(safeNumber(equitySummary.disparityGap, 0)),
        highVulnerabilityHarm: clamp(safeNumber(equitySummary.highVulnerabilityHarm, 0)),
        societalTrajectory: typeof societalSummary.trajectory === 'string'
            ? societalSummary.trajectory
            : 'stable',
        societalAlerts: Math.max(0, Math.floor(safeNumber(societalSummary.alertCount, 0))),
        externalityTrajectory: typeof externalitySummary.trajectory === 'string'
            ? externalitySummary.trajectory
            : 'stable',
        externalityRisk: clamp(safeNumber(externalitySummary.finalRiskScore, 0)),
        blockedHumanityCount: Math.max(0, Math.floor(safeNumber(humanitySummary.blockedCount, 0)))
    };
}

function computeRiskScores(incidentSignals, externalSignals, horizonHours) {
    const populationScale = clamp(Math.log10(incidentSignals.aggregateAffectedPopulation + 1) * 18, 0, 100);
    const incidentPressure = clamp(
        incidentSignals.avgSeverity * 0.42
        + incidentSignals.avgGrowthRate * 0.36
        + incidentSignals.weightedContainmentGap * 0.22
        + populationScale * 0.18
    );

    const socialPressure = clamp(
        externalSignals.communityHighRiskCount * 17
        + externalSignals.communityUrgentCount * 9
        + externalSignals.equityDisparityGap * 0.35
        + externalSignals.highVulnerabilityHarm * 0.42
        + externalSignals.societalAlerts * 8
        + externalSignals.externalityRisk * 0.18
        + externalSignals.blockedHumanityCount * 12
    );

    const trajectoryPenalty = (
        (externalSignals.societalTrajectory === 'declining' ? 18 : 0)
        + (externalSignals.externalityTrajectory === 'fragile' ? 14 : 0)
        + (externalSignals.externalityTrajectory === 'declining' ? 12 : 0)
        + (externalSignals.equityPosture === 'blocked' ? 22 : 0)
        + (externalSignals.equityPosture === 'review_required' ? 10 : 0)
    );

    const horizonMultiplier = horizonHours <= 24
        ? 1.2
        : horizonHours <= 72
            ? 1
            : 0.86;

    const currentRiskScore = clamp(Math.round(
        incidentPressure * 0.62
        + socialPressure * 0.28
        + trajectoryPenalty * 0.1
    ));

    const trajectoryRiskScore = clamp(Math.round(
        (incidentPressure * 0.46
        + socialPressure * 0.24
        + trajectoryPenalty * 0.3) * horizonMultiplier
    ));

    return {
        currentRiskScore,
        trajectoryRiskScore,
        incidentPressure: Number(incidentPressure.toFixed(2)),
        socialPressure: Number(socialPressure.toFixed(2)),
        trajectoryPenalty
    };
}

function escalationLevelFromScores(currentRiskScore, trajectoryRiskScore) {
    const combined = Math.round(currentRiskScore * 0.55 + trajectoryRiskScore * 0.45);
    if (combined >= 85) return 'critical';
    if (combined >= 68) return 'severe';
    if (combined >= 50) return 'warning';
    if (combined >= 34) return 'watch';
    return 'normal';
}

function escalationWindowHours(level) {
    if (level === 'critical') return 6;
    if (level === 'severe') return 12;
    if (level === 'warning') return 24;
    if (level === 'watch') return 48;
    return 72;
}

function buildAlerts(level, signals, scores) {
    const alerts = [];
    if (scores.currentRiskScore >= 70) alerts.push('harm_pressure_high');
    if (scores.trajectoryRiskScore >= 70) alerts.push('harm_trajectory_high');
    if (signals.communityHighRiskCount > 0) alerts.push('community_harm_signals_present');
    if (signals.highVulnerabilityHarm >= 45) alerts.push('vulnerable_population_harm_high');
    if (signals.equityPosture === 'blocked') alerts.push('equity_guardrail_blocked');
    if (level === 'critical' || level === 'severe') alerts.push('broad_harm_escalation_likely');
    return alerts;
}

function buildRecommendations({
    level,
    alerts,
    scores
}) {
    const recommendations = [];

    if (level === 'critical' || level === 'severe') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'activate_harm_containment',
            title: 'Activate immediate harm containment protocol',
            description: `Current risk ${scores.currentRiskScore} and trajectory risk ${scores.trajectoryRiskScore} require immediate containment.`,
            priority: 'P0'
        });
    }

    if (alerts.includes('vulnerable_population_harm_high') || alerts.includes('equity_guardrail_blocked')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'protect_vulnerable_groups',
            title: 'Deploy safeguards for vulnerable groups',
            description: 'Vulnerable populations are experiencing elevated projected harm.',
            priority: level === 'critical' ? 'P0' : 'P1'
        });
    }

    if (level !== 'normal') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'launch_rapid_response_review',
            title: 'Launch cross-functional rapid response review',
            description: 'Initiate immediate review to confirm root causes and mitigation path.',
            priority: level === 'watch' ? 'P2' : 'P1'
        });
    }

    recommendations.push({
        id: `recommendation-${randomUUID().slice(0, 8)}`,
        type: 'increase_monitoring',
        title: 'Increase harm signal monitoring cadence',
        description: 'Increase telemetry and community-signal sampling frequency.',
        priority: level === 'normal' ? 'P3' : 'P2'
    });

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

export function evaluateHarmEscalation(inputPayload, options = {}) {
    const normalizedOptions = normalizeOptions(options);
    const at = safeNow(normalizedOptions.now);
    const incidents = normalizeIncidents(inputPayload || {});
    const incidentSignals = aggregateIncidentSignals(incidents);
    const externalSignals = externalSignalSnapshot(inputPayload || {});
    const riskScores = computeRiskScores(
        incidentSignals,
        externalSignals,
        normalizedOptions.horizonHours
    );

    const escalationLevel = escalationLevelFromScores(
        riskScores.currentRiskScore,
        riskScores.trajectoryRiskScore
    );
    const escalationWindow = escalationWindowHours(escalationLevel);
    const alerts = buildAlerts(escalationLevel, externalSignals, riskScores);
    const recommendations = buildRecommendations({
        level: escalationLevel,
        alerts,
        scores: riskScores
    });

    return {
        at,
        horizonHours: normalizedOptions.horizonHours,
        escalationLevel,
        escalationWindowHours: escalationWindow,
        incidents: incidents.map((entry) => clone(entry)),
        signals: {
            incident: incidentSignals,
            external: externalSignals
        },
        scores: riskScores,
        summary: {
            incidentCount: incidents.length,
            alertCount: alerts.length,
            escalationLevel,
            escalationWindowHours: escalationWindow
        },
        alerts,
        recommendations
    };
}

export function harmEscalationToTasks(reportPayload, {
    fromAgentId = 'agent:harm-escalation',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('harmEscalationToTasks requires report payload');
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
            escalationLevel: reportPayload.escalationLevel,
            escalationWindowHours: reportPayload.escalationWindowHours
        },
        createdAt: nowMs + index
    }));
}

export class HarmEscalationEarlyWarning {
    constructor({
        localAgentId = 'agent:harm-escalation',
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

    evaluate(inputPayload, options = {}) {
        const report = evaluateHarmEscalation(inputPayload, {
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
        return harmEscalationToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 25 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 25))
            .map((entry) => clone(entry));
    }
}

export const __harmEscalationInternals = {
    normalizeIncidents,
    aggregateIncidentSignals,
    externalSignalSnapshot,
    computeRiskScores,
    escalationLevelFromScores,
    escalationWindowHours,
    buildAlerts,
    buildRecommendations,
    EscalationLevels
};
