import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    block_unconsented_action: 'agent:safety',
    request_explicit_consent: 'agent:community',
    scope_action_to_consent: 'agent:policy',
    establish_revocation_channel: 'agent:ops'
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

function normalizeStatus(value) {
    const normalized = typeof value === 'string' ? value.trim().toLowerCase() : 'unknown';
    if (['granted', 'denied', 'conditional', 'unknown'].includes(normalized)) {
        return normalized;
    }
    return 'unknown';
}

function normalizeParticipants(inputPayload) {
    const entries = Array.isArray(inputPayload?.participants)
        ? inputPayload.participants
        : [];
    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `participant-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Participant ${index + 1}`,
        consentStatus: normalizeStatus(entry?.consentStatus),
        grantedScopes: Array.isArray(entry?.grantedScopes)
            ? entry.grantedScopes.filter((scope) => typeof scope === 'string')
            : [],
        requiredNoticeHours: Math.max(0, Math.floor(safeNumber(entry?.requiredNoticeHours, 0))),
        revocationEnabled: entry?.revocationEnabled !== false,
        agencyScore: clamp(safeNumber(entry?.agencyScore, 70)),
        vulnerabilityIndex: clamp(safeNumber(entry?.vulnerabilityIndex, 30))
    }));
}

function normalizeActions(inputPayload) {
    const entries = Array.isArray(inputPayload?.actions)
        ? inputPayload.actions
        : [];
    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `action-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Action ${index + 1}`,
        targetParticipantIds: Array.isArray(entry?.targetParticipantIds)
            ? entry.targetParticipantIds.filter((id) => typeof id === 'string')
            : [],
        requiredScopes: Array.isArray(entry?.requiredScopes)
            ? entry.requiredScopes.filter((scope) => typeof scope === 'string')
            : [],
        riskScore: clamp(safeNumber(entry?.riskScore, 35)),
        urgencyScore: clamp(safeNumber(entry?.urgencyScore, 50)),
        fallbackActionId: typeof entry?.fallbackActionId === 'string'
            ? entry.fallbackActionId
            : null
    }));
}

function normalizePolicy(inputPayload) {
    const policy = inputPayload?.policy && typeof inputPayload.policy === 'object'
        ? inputPayload.policy
        : {};
    return {
        conditionalRiskLimit: clamp(safeNumber(policy.conditionalRiskLimit, 45)),
        unknownConsentBlocks: policy.unknownConsentBlocks !== false,
        requireRevocationForRiskAbove: clamp(safeNumber(policy.requireRevocationForRiskAbove, 55))
    };
}

function scopeCoverage(grantedScopes, requiredScopes) {
    if (!Array.isArray(requiredScopes) || requiredScopes.length === 0) return 100;
    const granted = new Set(Array.isArray(grantedScopes) ? grantedScopes : []);
    const covered = requiredScopes.filter((scope) => granted.has(scope)).length;
    return Number(((covered / requiredScopes.length) * 100).toFixed(2));
}

function evaluateParticipantForAction(participant, action, policy) {
    const coverage = scopeCoverage(participant.grantedScopes, action.requiredScopes);
    const violations = [];

    if (participant.consentStatus === 'denied') {
        violations.push('consent_denied');
    }

    if (participant.consentStatus === 'unknown' && policy.unknownConsentBlocks) {
        violations.push('consent_unknown');
    }

    if (participant.consentStatus === 'conditional' && action.riskScore > policy.conditionalRiskLimit) {
        violations.push('conditional_limit_exceeded');
    }

    if (coverage < 100) {
        violations.push('scope_not_covered');
    }

    if (participant.requiredNoticeHours > 0 && action.urgencyScore >= 70) {
        violations.push('notice_window_not_met');
    }

    if (action.riskScore >= policy.requireRevocationForRiskAbove && participant.revocationEnabled !== true) {
        violations.push('revocation_channel_missing');
    }

    const status = violations.some((violation) => violation === 'consent_denied' || violation === 'consent_unknown')
        ? 'blocked'
        : (violations.length > 0 ? 'review_required' : 'allowed');

    const consentScore = clamp(Math.round(
        (participant.consentStatus === 'granted' ? 85 : participant.consentStatus === 'conditional' ? 60 : 30)
        + coverage * 0.2
        + participant.agencyScore * 0.15
        - participant.vulnerabilityIndex * 0.1
        - violations.length * 12
    ));

    return {
        participantId: participant.id,
        participantName: participant.name,
        consentStatus: participant.consentStatus,
        scopeCoverage: coverage,
        revocationEnabled: participant.revocationEnabled,
        status,
        consentScore,
        violations
    };
}

function evaluateActions(actions, participants, policy) {
    const participantMap = new Map(participants.map((participant) => [participant.id, participant]));

    return actions.map((action) => {
        const targets = action.targetParticipantIds
            .map((id) => participantMap.get(id))
            .filter(Boolean);
        const participantEvaluations = targets.map((participant) => (
            evaluateParticipantForAction(participant, action, policy)
        ));

        const blockedCount = participantEvaluations.filter((entry) => entry.status === 'blocked').length;
        const reviewCount = participantEvaluations.filter((entry) => entry.status === 'review_required').length;
        const allowedCount = participantEvaluations.filter((entry) => entry.status === 'allowed').length;
        const total = participantEvaluations.length;
        const avgConsentScore = total > 0
            ? participantEvaluations.reduce((acc, entry) => acc + entry.consentScore, 0) / total
            : 0;
        const avgScopeCoverage = total > 0
            ? participantEvaluations.reduce((acc, entry) => acc + entry.scopeCoverage, 0) / total
            : 0;

        const posture = blockedCount > 0
            ? 'blocked'
            : (reviewCount > 0 ? 'review_required' : 'allowed');

        return {
            actionId: action.id,
            actionName: action.name,
            riskScore: action.riskScore,
            urgencyScore: action.urgencyScore,
            fallbackActionId: action.fallbackActionId,
            posture,
            summary: {
                targetCount: total,
                blockedCount,
                reviewCount,
                allowedCount,
                avgConsentScore: Number(avgConsentScore.toFixed(2)),
                avgScopeCoverage: Number(avgScopeCoverage.toFixed(2))
            },
            participants: participantEvaluations
        };
    }).sort((a, b) => {
        const postureRank = { blocked: 0, review_required: 1, allowed: 2 };
        const p = postureRank[a.posture] - postureRank[b.posture];
        if (p !== 0) return p;
        if (a.summary.avgConsentScore !== b.summary.avgConsentScore) {
            return a.summary.avgConsentScore - b.summary.avgConsentScore;
        }
        return String(a.actionId).localeCompare(String(b.actionId));
    });
}

function buildAlerts(actions) {
    const alerts = [];
    if (actions.some((action) => action.posture === 'blocked')) {
        alerts.push('unconsented_action_detected');
    }
    if (actions.some((action) => action.participants.some((participant) => participant.violations.includes('scope_not_covered')))) {
        alerts.push('consent_scope_gap_detected');
    }
    if (actions.some((action) => action.participants.some((participant) => participant.violations.includes('revocation_channel_missing')))) {
        alerts.push('revocation_path_missing');
    }
    return alerts;
}

function buildRecommendations(actions, alerts) {
    const recommendations = [];

    for (const action of actions) {
        const hasDenied = action.participants.some((participant) => participant.violations.includes('consent_denied'));
        const hasUnknown = action.participants.some((participant) => participant.violations.includes('consent_unknown'));
        const hasScopeGap = action.participants.some((participant) => participant.violations.includes('scope_not_covered'));
        const hasRevocationGap = action.participants.some((participant) => participant.violations.includes('revocation_channel_missing'));

        if (hasDenied || hasUnknown) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'block_unconsented_action',
                actionId: action.actionId,
                title: `Block action lacking valid consent: ${action.actionName}`,
                description: 'Action includes participants without explicit consent coverage.',
                priority: 'P0'
            });
        }

        if (hasUnknown) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'request_explicit_consent',
                actionId: action.actionId,
                title: `Request explicit consent for ${action.actionName}`,
                description: 'One or more participants have unknown consent status.',
                priority: 'P1'
            });
        }

        if (hasScopeGap) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'scope_action_to_consent',
                actionId: action.actionId,
                title: `Scope action to consent boundaries: ${action.actionName}`,
                description: 'Required scopes exceed granted participant consent scopes.',
                priority: 'P1'
            });
        }

        if (hasRevocationGap) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'establish_revocation_channel',
                actionId: action.actionId,
                title: `Establish revocation channel for ${action.actionName}`,
                description: 'High-risk action requires revocation mechanism for impacted participants.',
                priority: 'P1'
            });
        }
    }

    if (alerts.includes('consent_scope_gap_detected') && recommendations.every((entry) => entry.type !== 'scope_action_to_consent')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'scope_action_to_consent',
            title: 'Resolve global consent scope gaps',
            description: 'At least one action exceeds participant scope grants.',
            priority: 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.actionId || '').localeCompare(String(b.actionId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.actionId || '') === String(entry.actionId || '')
        )) === index);
}

export function mapConsentAndAgency(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const participants = normalizeParticipants(inputPayload || {});
    const actions = normalizeActions(inputPayload || {});
    const policy = normalizePolicy(inputPayload || {});
    const evaluatedActions = evaluateActions(actions, participants, policy);
    const alerts = buildAlerts(evaluatedActions);
    const recommendations = buildRecommendations(evaluatedActions, alerts);

    return {
        at,
        policy,
        participants: participants.map((participant) => clone(participant)),
        actions: evaluatedActions.map((action) => clone(action)),
        summary: {
            participantCount: participants.length,
            actionCount: actions.length,
            blockedActionCount: evaluatedActions.filter((action) => action.posture === 'blocked').length,
            reviewRequiredActionCount: evaluatedActions.filter((action) => action.posture === 'review_required').length,
            allowedActionCount: evaluatedActions.filter((action) => action.posture === 'allowed').length
        },
        alerts,
        recommendations
    };
}

export function consentAgencyToTasks(reportPayload, {
    fromAgentId = 'agent:consent-mapper',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('consentAgencyToTasks requires report payload');
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
            actionId: recommendation.actionId || null,
            blockedActionCount: reportPayload.summary?.blockedActionCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class ConsentAgencyMapper {
    constructor({
        localAgentId = 'agent:consent-mapper',
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
        const report = mapConsentAndAgency(inputPayload, {
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
        return consentAgencyToTasks(reportPayload, {
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

export const __consentAgencyInternals = {
    normalizeParticipants,
    normalizeActions,
    normalizePolicy,
    scopeCoverage,
    evaluateParticipantForAction,
    evaluateActions,
    buildRecommendations
};
