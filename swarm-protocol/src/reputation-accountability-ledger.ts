import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    open_accountability_review: 'agent:governance',
    request_missing_evidence: 'agent:compliance',
    schedule_reputation_rebuild_plan: 'agent:leadership',
    publish_accountability_ledger: 'agent:ops'
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

function normalizeEvents(inputPayload) {
    const events = Array.isArray(inputPayload?.events)
        ? inputPayload.events
        : [];

    return events
        .filter((event) => event && typeof event === 'object')
        .map((event, index) => ({
            eventId: typeof event.eventId === 'string' && event.eventId.trim()
                ? event.eventId.trim()
                : `event-${index + 1}`,
            actorId: typeof event.actorId === 'string' && event.actorId.trim()
                ? event.actorId.trim()
                : 'actor:unknown',
            actorName: typeof event.actorName === 'string' && event.actorName.trim()
                ? event.actorName.trim()
                : null,
            actionType: typeof event.actionType === 'string' && event.actionType.trim()
                ? event.actionType.trim()
                : 'operation',
            outcomeQuality: clamp(safeNumber(event.outcomeQuality, 68)),
            policyCompliance: clamp(safeNumber(event.policyCompliance, 70)),
            evidenceCompleteness: clamp(safeNumber(event.evidenceCompleteness, 58)),
            responseLatencyMinutes: Math.max(0, Math.floor(safeNumber(event.responseLatencyMinutes, 15))),
            impactCriticality: clamp(safeNumber(event.impactCriticality, 60)),
            incidentFlag: Boolean(event.incidentFlag),
            remediationComplete: Boolean(event.remediationComplete)
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};

    return {
        reviewHours: Math.max(0, Math.floor(safeNumber(capacity.reviewHours, 36))),
        evidenceHours: Math.max(0, Math.floor(safeNumber(capacity.evidenceHours, 24))),
        coachingSlots: Math.max(0, Math.floor(safeNumber(capacity.coachingSlots, 5)))
    };
}

function eventAccountabilityScore(event) {
    const latencyPenalty = clamp(event.responseLatencyMinutes * 1.8);
    const incidentPenalty = event.incidentFlag
        ? clamp(35 + event.impactCriticality * 0.45)
        : 0;

    return clamp(Math.round(
        event.outcomeQuality * 0.24
        + event.policyCompliance * 0.3
        + event.evidenceCompleteness * 0.2
        + (100 - latencyPenalty) * 0.1
        + (100 - incidentPenalty) * 0.16
    ));
}

function reputationTier(score) {
    if (score >= 82) return 'exemplary';
    if (score >= 68) return 'trusted';
    if (score >= 52) return 'watch';
    return 'at_risk';
}

function buildLedger(events, capacity) {
    let reviewHours = capacity.reviewHours;
    let evidenceHours = capacity.evidenceHours;
    let coachingSlots = capacity.coachingSlots;

    const grouped = new Map();
    for (const event of events) {
        const accountabilityScore = eventAccountabilityScore(event);
        const existing = grouped.get(event.actorId) || {
            actorId: event.actorId,
            actorName: event.actorName || event.actorId,
            totalEvents: 0,
            accountabilityScores: [],
            incidentCount: 0,
            unresolvedIncidents: 0,
            missingEvidenceCount: 0,
            avgImpactCriticality: 0,
            actionTypes: new Set()
        };

        existing.totalEvents += 1;
        existing.accountabilityScores.push(accountabilityScore);
        existing.avgImpactCriticality += event.impactCriticality;
        existing.actionTypes.add(event.actionType);
        if (event.incidentFlag) existing.incidentCount += 1;
        if (event.incidentFlag && !event.remediationComplete) existing.unresolvedIncidents += 1;
        if (event.evidenceCompleteness < 60) existing.missingEvidenceCount += 1;

        grouped.set(event.actorId, existing);
    }

    const entries = Array.from(grouped.values())
        .map((actor) => {
            const baseScore = actor.accountabilityScores.length > 0
                ? actor.accountabilityScores.reduce((acc, score) => acc + score, 0) / actor.accountabilityScores.length
                : 0;
            const confidenceBoost = clamp(actor.totalEvents * 2.2, 0, 8);
            const incidentPenalty = clamp(actor.unresolvedIncidents * 8 + actor.incidentCount * 4, 0, 26);
            const evidencePenalty = clamp(actor.missingEvidenceCount * 5, 0, 20);
            const reputationScore = clamp(Math.round(baseScore + confidenceBoost - incidentPenalty - evidencePenalty));

            const riskPressure = clamp(Math.round(
                (100 - reputationScore) * 0.66
                + actor.unresolvedIncidents * 9
                + actor.missingEvidenceCount * 6
            ));

            const reviewNeed = Math.max(0, Math.round(riskPressure * 0.26 + actor.incidentCount * 2));
            const evidenceNeed = Math.max(0, Math.round(actor.missingEvidenceCount * 2.5));

            const reviewAllocated = Math.min(reviewHours, reviewNeed);
            reviewHours -= reviewAllocated;

            const evidenceAllocated = Math.min(evidenceHours, evidenceNeed);
            evidenceHours -= evidenceAllocated;

            let coachingAllocated = 0;
            if (coachingSlots > 0 && (reputationScore < 60 || actor.unresolvedIncidents > 0)) {
                coachingAllocated = 1;
                coachingSlots -= 1;
            }

            const accountabilityGap = clamp(Math.round(
                riskPressure * 0.58
                - reviewAllocated * 1.8
                - evidenceAllocated * 1.4
                - coachingAllocated * 8
            ));

            let lane = 'now';
            if (accountabilityGap > 70 || (reputationScore < 52 && reviewAllocated < reviewNeed)) lane = 'hold';
            else if (accountabilityGap > 45) lane = 'next';

            return {
                actorId: actor.actorId,
                actorName: actor.actorName,
                totalEvents: actor.totalEvents,
                reputationScore,
                reputationTier: reputationTier(reputationScore),
                incidentCount: actor.incidentCount,
                unresolvedIncidents: actor.unresolvedIncidents,
                missingEvidenceCount: actor.missingEvidenceCount,
                avgImpactCriticality: Number((actor.avgImpactCriticality / actor.totalEvents).toFixed(2)),
                reviewNeed,
                reviewAllocated,
                evidenceNeed,
                evidenceAllocated,
                coachingAllocated,
                riskPressure,
                accountabilityGap,
                lane,
                actionTypes: Array.from(actor.actionTypes)
            };
        })
        .sort((a, b) => {
            const laneRank = { hold: 0, next: 1, now: 2 };
            const laneDiff = laneRank[a.lane] - laneRank[b.lane];
            if (laneDiff !== 0) return laneDiff;
            return a.reputationScore - b.reputationScore;
        });

    return {
        entries,
        remainingCapacity: {
            reviewHours,
            evidenceHours,
            coachingSlots
        }
    };
}

function summarizeLedger(entries, remainingCapacity) {
    const avgReputationScore = entries.length > 0
        ? Number((entries.reduce((acc, entry) => acc + entry.reputationScore, 0) / entries.length).toFixed(2))
        : 0;
    const avgAccountabilityGap = entries.length > 0
        ? Number((entries.reduce((acc, entry) => acc + entry.accountabilityGap, 0) / entries.length).toFixed(2))
        : 0;

    const laneCounts = entries.reduce((acc, entry) => {
        acc[entry.lane] = (acc[entry.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    const tierCounts = entries.reduce((acc, entry) => {
        acc[entry.reputationTier] = (acc[entry.reputationTier] || 0) + 1;
        return acc;
    }, { exemplary: 0, trusted: 0, watch: 0, at_risk: 0 });

    let posture = 'accountable';
    if (laneCounts.hold > 0 || tierCounts.at_risk > 0 || avgAccountabilityGap > 60) posture = 'critical';
    else if (laneCounts.next > 0 || tierCounts.watch > 0 || avgAccountabilityGap > 42) posture = 'review_required';

    return {
        actorCount: entries.length,
        laneCounts,
        tierCounts,
        avgReputationScore,
        avgAccountabilityGap,
        remainingCapacity,
        posture
    };
}

function buildAlerts(summary, entries) {
    const alerts = [];
    if (summary.laneCounts.hold > 0) alerts.push('accountability_hold_queue_present');
    if (entries.some((entry) => entry.unresolvedIncidents > 0)) alerts.push('accountability_unresolved_incidents_present');
    if (entries.some((entry) => entry.missingEvidenceCount > 0)) alerts.push('accountability_evidence_gap_present');
    if (summary.avgReputationScore < 60) alerts.push('reputation_score_low');
    return alerts;
}

function buildRecommendations(entries, summary, alerts) {
    const recommendations = [];
    for (const entry of entries) {
        if (entry.reputationTier === 'at_risk' || entry.accountabilityGap > 50) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'open_accountability_review',
                actorId: entry.actorId,
                title: `Open accountability review for ${entry.actorName}`,
                description: `Reputation score ${entry.reputationScore} with accountability gap ${entry.accountabilityGap}.`,
                priority: entry.reputationTier === 'at_risk' ? 'P0' : 'P1'
            });
        }
        if (entry.missingEvidenceCount > 0) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'request_missing_evidence',
                actorId: entry.actorId,
                title: `Request missing evidence from ${entry.actorName}`,
                description: `${entry.missingEvidenceCount} events require stronger evidence completeness.`,
                priority: entry.missingEvidenceCount >= 2 ? 'P1' : 'P2'
            });
        }
        if (entry.reputationTier === 'at_risk' || entry.unresolvedIncidents > 0) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'schedule_reputation_rebuild_plan',
                actorId: entry.actorId,
                title: `Schedule reputation rebuild plan for ${entry.actorName}`,
                description: `Unresolved incidents ${entry.unresolvedIncidents} with risk pressure ${entry.riskPressure}.`,
                priority: entry.reputationTier === 'at_risk' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_accountability_ledger',
            title: 'Publish accountability and reputation ledger',
            description: 'Publish lane status, reputation tiers, and evidence/remediation ownership.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.actorId || '').localeCompare(String(b.actorId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.actorId || '') === String(entry.actorId || '')
        )) === index);
}

export function buildReputationAccountabilityLedger(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const events = normalizeEvents(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const ledger = buildLedger(events, capacity);
    const summary = summarizeLedger(ledger.entries, ledger.remainingCapacity);
    const alerts = buildAlerts(summary, ledger.entries);
    const recommendations = buildRecommendations(ledger.entries, summary, alerts);

    return {
        at,
        summary,
        entries: ledger.entries,
        alerts,
        recommendations
    };
}

export function accountabilityLedgerToTasks(reportPayload, {
    fromAgentId = 'agent:accountability-ledger',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('accountabilityLedgerToTasks requires report payload');
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
            actorId: recommendation.actorId || null,
            posture: reportPayload.summary?.posture || null,
            holdCount: reportPayload.summary?.laneCounts?.hold || 0
        },
        createdAt: nowMs + index
    }));
}

export class ReputationAccountabilityLedger {
    constructor({
        localAgentId = 'agent:accountability-ledger',
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
        const report = buildReputationAccountabilityLedger(inputPayload, {
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
        return accountabilityLedgerToTasks(reportPayload, {
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

export const __reputationAccountabilityLedgerInternals = {
    normalizeEvents,
    buildLedger,
    summarizeLedger,
    buildRecommendations
};
