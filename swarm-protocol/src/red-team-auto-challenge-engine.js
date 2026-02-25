import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    execute_red_team_probe: 'agent:red-team',
    harden_guardrail_surface: 'agent:security',
    schedule_manual_red_team_review: 'agent:governance',
    publish_red_team_digest: 'agent:ops'
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

function normalizeSurfaces(inputPayload) {
    const surfaces = Array.isArray(inputPayload?.surfaces)
        ? inputPayload.surfaces
        : [];

    return surfaces
        .filter((surface) => surface && typeof surface === 'object')
        .map((surface, index) => ({
            surfaceId: typeof surface.surfaceId === 'string' && surface.surfaceId.trim()
                ? surface.surfaceId.trim()
                : `surface-${index + 1}`,
            name: typeof surface.name === 'string' && surface.name.trim()
                ? surface.name.trim()
                : `Surface ${index + 1}`,
            domains: normalizeStringArray(surface.domains),
            privilegeLevel: clamp(safeNumber(surface.privilegeLevel, 58)),
            guardrailStrength: clamp(safeNumber(surface.guardrailStrength, 62)),
            historicalFailures: clamp(safeNumber(surface.historicalFailures, 24)),
            attackComplexity: clamp(safeNumber(surface.attackComplexity, 48)),
            sensitivity: clamp(safeNumber(surface.sensitivity, 70))
        }));
}

function normalizeProbes(inputPayload) {
    const probes = Array.isArray(inputPayload?.probes)
        ? inputPayload.probes
        : [];

    return probes
        .filter((probe) => probe && typeof probe === 'object')
        .map((probe, index) => ({
            probeId: typeof probe.probeId === 'string' && probe.probeId.trim()
                ? probe.probeId.trim()
                : `probe-${index + 1}`,
            name: typeof probe.name === 'string' && probe.name.trim()
                ? probe.name.trim()
                : `Probe ${index + 1}`,
            domains: normalizeStringArray(probe.domains),
            potency: clamp(safeNumber(probe.potency, 72)),
            coverage: clamp(safeNumber(probe.coverage, 70)),
            complexityCost: clamp(safeNumber(probe.complexityCost, 34)),
            analysisCost: Math.max(1, Math.floor(safeNumber(probe.analysisCost, 4)))
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};

    return {
        runSlots: Math.max(0, Math.floor(safeNumber(capacity.runSlots, 6))),
        analysisHours: Math.max(0, Math.floor(safeNumber(capacity.analysisHours, 24))),
        manualReviewSlots: Math.max(0, Math.floor(safeNumber(capacity.manualReviewSlots, 3)))
    };
}

function surfaceRisk(surface) {
    return clamp(Math.round(
        surface.privilegeLevel * 0.26
        + (100 - surface.guardrailStrength) * 0.24
        + surface.historicalFailures * 0.22
        + surface.sensitivity * 0.2
        + (100 - surface.attackComplexity) * 0.08
    ));
}

function probeFit(probe, surface) {
    const overlap = probe.domains.length === 0
        ? 0.25
        : probe.domains.filter((domain) => surface.domains.includes(domain)).length / probe.domains.length;

    return clamp(Math.round(
        overlap * 46
        + probe.potency * 0.22
        + probe.coverage * 0.2
        + (100 - probe.complexityCost) * 0.12
    ));
}

function autoChallenge(surfaces, probes, capacity) {
    let runSlots = capacity.runSlots;
    let analysisHours = capacity.analysisHours;
    let manualReviewSlots = capacity.manualReviewSlots;

    const prioritized = surfaces
        .map((surface) => ({
            ...surface,
            riskScore: surfaceRisk(surface)
        }))
        .sort((a, b) => b.riskScore - a.riskScore);

    const challenges = [];
    for (const surface of prioritized) {
        const rankedProbes = probes
            .map((probe) => ({
                probeId: probe.probeId,
                name: probe.name,
                fitScore: probeFit(probe, surface),
                potency: probe.potency,
                complexityCost: probe.complexityCost,
                analysisCost: probe.analysisCost,
                coverage: probe.coverage,
                domains: [...probe.domains]
            }))
            .sort((a, b) => b.fitScore - a.fitScore);

        let selectedProbe = null;
        for (const candidate of rankedProbes) {
            if (runSlots <= 0) continue;
            if (candidate.analysisCost > analysisHours) continue;
            selectedProbe = candidate;
            runSlots -= 1;
            analysisHours -= candidate.analysisCost;
            break;
        }

        let manualReviewAllocated = 0;
        if ((surface.riskScore >= 75 || !selectedProbe) && manualReviewSlots > 0) {
            manualReviewAllocated = 1;
            manualReviewSlots -= 1;
        }

        const challengeCoverage = selectedProbe
            ? clamp(Math.round(selectedProbe.fitScore * 0.46 + selectedProbe.coverage * 0.24 + selectedProbe.potency * 0.2))
            : 0;
        const unresolvedRisk = clamp(Math.round(
            surface.riskScore * 0.7
            - challengeCoverage * 0.52
            + (selectedProbe ? 0 : 18)
            + (manualReviewAllocated === 0 && surface.riskScore > 72 ? 10 : 0)
        ));

        let lane = 'now';
        if (!selectedProbe || unresolvedRisk > 72) lane = 'hold';
        else if (unresolvedRisk > 44) lane = 'next';

        challenges.push({
            surfaceId: surface.surfaceId,
            surfaceName: surface.name,
            riskScore: surface.riskScore,
            selectedProbe,
            manualReviewAllocated,
            challengeCoverage,
            unresolvedRisk,
            lane
        });
    }

    return {
        challenges: challenges.sort((a, b) => {
            const laneRank = { now: 0, next: 1, hold: 2 };
            const laneDiff = laneRank[a.lane] - laneRank[b.lane];
            if (laneDiff !== 0) return laneDiff;
            return b.riskScore - a.riskScore;
        }),
        remainingCapacity: {
            runSlots,
            analysisHours,
            manualReviewSlots
        }
    };
}

function summarizeChallenges(challenges, remainingCapacity) {
    const avgUnresolvedRisk = challenges.length > 0
        ? Number((challenges.reduce((acc, entry) => acc + entry.unresolvedRisk, 0) / challenges.length).toFixed(2))
        : 0;
    const avgCoverage = challenges.length > 0
        ? Number((challenges.reduce((acc, entry) => acc + entry.challengeCoverage, 0) / challenges.length).toFixed(2))
        : 0;

    const laneCounts = challenges.reduce((acc, entry) => {
        acc[entry.lane] = (acc[entry.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    let posture = 'hardened';
    if (laneCounts.hold > 0 || avgUnresolvedRisk > 60) posture = 'critical';
    else if (laneCounts.next > 0 || avgUnresolvedRisk > 42) posture = 'review_required';

    return {
        surfaceCount: challenges.length,
        laneCounts,
        avgUnresolvedRisk,
        avgCoverage,
        remainingCapacity,
        posture
    };
}

function buildAlerts(summary, challenges) {
    const alerts = [];
    if (summary.laneCounts.hold > 0) alerts.push('red_team_hold_queue_present');
    if (summary.avgUnresolvedRisk > 55) alerts.push('red_team_unresolved_risk_high');
    if (challenges.some((entry) => !entry.selectedProbe)) alerts.push('red_team_probe_coverage_gap');
    if (challenges.some((entry) => entry.manualReviewAllocated === 0 && entry.riskScore > 75)) alerts.push('red_team_manual_review_gap');
    return alerts;
}

function buildRecommendations(challenges, summary, alerts) {
    const recommendations = [];
    for (const entry of challenges) {
        if (entry.selectedProbe && entry.lane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'execute_red_team_probe',
                surfaceId: entry.surfaceId,
                title: `Execute red-team probes for ${entry.surfaceName}`,
                description: `Coverage ${entry.challengeCoverage} with unresolved risk ${entry.unresolvedRisk}.`,
                priority: entry.riskScore > 80 ? 'P1' : 'P2'
            });
        }
        if (!entry.selectedProbe || entry.unresolvedRisk > 56) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'harden_guardrail_surface',
                surfaceId: entry.surfaceId,
                title: `Harden guardrails for ${entry.surfaceName}`,
                description: `Unresolved risk ${entry.unresolvedRisk} requires hardening before expansion.`,
                priority: entry.lane === 'hold' ? 'P0' : 'P1'
            });
        }
        if (entry.manualReviewAllocated === 0 && entry.riskScore > 72) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'schedule_manual_red_team_review',
                surfaceId: entry.surfaceId,
                title: `Schedule manual red-team review for ${entry.surfaceName}`,
                description: 'High-risk surface requires manual adversarial review coverage.',
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_red_team_digest',
            title: 'Publish red-team auto-challenge digest',
            description: 'Publish challenge lanes, unresolved risk posture, and remediation owners.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.surfaceId || '').localeCompare(String(b.surfaceId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.surfaceId || '') === String(entry.surfaceId || '')
        )) === index);
}

export function runRedTeamAutoChallenge(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const surfaces = normalizeSurfaces(inputPayload || {});
    const probes = normalizeProbes(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const challenges = autoChallenge(surfaces, probes, capacity);
    const summary = summarizeChallenges(challenges.challenges, challenges.remainingCapacity);
    const alerts = buildAlerts(summary, challenges.challenges);
    const recommendations = buildRecommendations(challenges.challenges, summary, alerts);

    return {
        at,
        summary,
        challenges: challenges.challenges,
        alerts,
        recommendations
    };
}

export function redTeamChallengesToTasks(reportPayload, {
    fromAgentId = 'agent:red-team-auto',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('redTeamChallengesToTasks requires report payload');
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
            surfaceId: recommendation.surfaceId || null,
            posture: reportPayload.summary?.posture || null,
            holdCount: reportPayload.summary?.laneCounts?.hold || 0
        },
        createdAt: nowMs + index
    }));
}

export class RedTeamAutoChallengeEngine {
    constructor({
        localAgentId = 'agent:red-team-auto',
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
        const report = runRedTeamAutoChallenge(inputPayload, {
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
        return redTeamChallengesToTasks(reportPayload, {
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

export const __redTeamAutoChallengeEngineInternals = {
    normalizeSurfaces,
    normalizeProbes,
    autoChallenge,
    summarizeChallenges,
    buildRecommendations
};
