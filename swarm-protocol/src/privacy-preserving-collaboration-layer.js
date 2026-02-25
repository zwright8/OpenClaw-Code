import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    apply_privacy_anonymization: 'agent:privacy',
    request_additional_consent: 'agent:governance',
    block_noncompliant_collaboration: 'agent:ops'
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
    return [...new Set(value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim().toLowerCase())
    )];
}

function normalizePolicies(inputPayload) {
    const source = Array.isArray(inputPayload?.privacyPolicies)
        ? inputPayload.privacyPolicies
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            policyId: typeof entry.policyId === 'string' && entry.policyId.trim()
                ? entry.policyId.trim()
                : `policy-${index + 1}`,
            field: typeof entry.field === 'string' && entry.field.trim()
                ? entry.field.trim().toLowerCase()
                : `field-${index + 1}`,
            allowedPurposes: normalizeStringArray(entry.allowedPurposes),
            requireConsent: Boolean(entry.requireConsent),
            anonymizationRequired: Boolean(entry.anonymizationRequired),
            sensitivity: clamp(safeNumber(entry.sensitivity, 55))
        }));
}

function normalizeRequests(inputPayload) {
    const source = Array.isArray(inputPayload?.collaborationRequests)
        ? inputPayload.collaborationRequests
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            requestId: typeof entry.requestId === 'string' && entry.requestId.trim()
                ? entry.requestId.trim()
                : `request-${index + 1}`,
            fields: normalizeStringArray(entry.fields),
            purpose: typeof entry.purpose === 'string' && entry.purpose.trim()
                ? entry.purpose.trim().toLowerCase()
                : 'general',
            participantCount: Math.max(1, Math.floor(safeNumber(entry.participantCount, 1))),
            hasConsent: Boolean(entry.hasConsent),
            hasAnonymization: Boolean(entry.hasAnonymization)
        }));
}

function evaluateRequest(request, policiesByField) {
    let denied = false;
    let requireAnonymization = false;
    let requireConsent = false;
    let privacyRisk = 0;

    for (const field of request.fields) {
        const policy = policiesByField.get(field);
        if (!policy) {
            privacyRisk += 24;
            continue;
        }

        if (policy.allowedPurposes.length > 0 && !policy.allowedPurposes.includes(request.purpose)) {
            denied = true;
            privacyRisk += 36;
        }

        if (policy.requireConsent && !request.hasConsent) {
            requireConsent = true;
            privacyRisk += 24;
        }

        if (policy.anonymizationRequired && !request.hasAnonymization) {
            requireAnonymization = true;
            privacyRisk += 22;
        }

        privacyRisk += policy.sensitivity * 0.18;
    }

    privacyRisk = clamp(Math.round(
        privacyRisk
        + request.participantCount * 1.8
    ));

    let decision = 'allow';
    if (denied) decision = 'deny';
    else if (requireConsent || requireAnonymization) decision = 'allow_with_controls';

    return {
        requestId: request.requestId,
        fields: request.fields,
        purpose: request.purpose,
        participantCount: request.participantCount,
        decision,
        requireConsent,
        requireAnonymization,
        privacyRisk
    };
}

function evaluateCollaboration(requests, policies) {
    const policiesByField = new Map(policies.map((policy) => [policy.field, policy]));

    return requests
        .map((request) => evaluateRequest(request, policiesByField))
        .sort((a, b) => b.privacyRisk - a.privacyRisk);
}

function summarizePrivacy(evaluations) {
    const decisionCounts = evaluations.reduce((acc, evaluation) => {
        acc[evaluation.decision] = (acc[evaluation.decision] || 0) + 1;
        return acc;
    }, {
        allow: 0,
        allow_with_controls: 0,
        deny: 0
    });

    const avgPrivacyRisk = evaluations.length > 0
        ? Number((evaluations.reduce((acc, evaluation) => acc + evaluation.privacyRisk, 0) / evaluations.length).toFixed(2))
        : 0;

    let posture = 'compliant';
    if (decisionCounts.allow_with_controls > 0 || avgPrivacyRisk >= 55) posture = 'guarded';
    if (decisionCounts.deny > 0 || avgPrivacyRisk >= 72) posture = 'restricted';

    return {
        requestCount: evaluations.length,
        decisionCounts,
        avgPrivacyRisk,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.decisionCounts.deny > 0) alerts.push('privacy_denials_present');
    if (summary.decisionCounts.allow_with_controls > 0) alerts.push('privacy_controls_required');
    if (summary.avgPrivacyRisk >= 65) alerts.push('privacy_risk_elevated');
    return alerts;
}

function buildRecommendations(evaluations, summary) {
    const recommendations = [];

    for (const evaluation of evaluations) {
        if (evaluation.requireAnonymization) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'apply_privacy_anonymization',
                requestId: evaluation.requestId,
                title: `Apply anonymization for ${evaluation.requestId}`,
                description: `Collaboration request requires anonymization controls.`,
                priority: evaluation.privacyRisk >= 70 ? 'P1' : 'P2'
            });
        }

        if (evaluation.requireConsent) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'request_additional_consent',
                requestId: evaluation.requestId,
                title: `Request additional consent for ${evaluation.requestId}`,
                description: 'Consent requirement not satisfied for one or more sensitive fields.',
                priority: evaluation.privacyRisk >= 70 ? 'P1' : 'P2'
            });
        }

        if (evaluation.decision === 'deny') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'block_noncompliant_collaboration',
                requestId: evaluation.requestId,
                title: `Block noncompliant collaboration ${evaluation.requestId}`,
                description: 'Request violates policy purpose or control requirements.',
                priority: 'P1'
            });
        }
    }

    if (summary.posture === 'restricted' && !recommendations.some((entry) => entry.type === 'block_noncompliant_collaboration')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'block_noncompliant_collaboration',
            title: 'Block high-risk collaboration batch',
            description: 'Privacy posture is restricted pending control remediation.',
            priority: 'P1'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.requestId || '').localeCompare(String(b.requestId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.requestId || '') === String(entry.requestId || '')
        )) === index);
}

export function buildPrivacyPreservingCollaboration(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const policies = normalizePolicies(inputPayload || {});
    const requests = normalizeRequests(inputPayload || {});
    const evaluations = evaluateCollaboration(requests, policies);
    const summary = summarizePrivacy(evaluations);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(evaluations, summary);

    return {
        at,
        summary,
        evaluations,
        alerts,
        recommendations
    };
}

export function privacyCollaborationToTasks(reportPayload, {
    fromAgentId = 'agent:privacy-collaboration',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('privacyCollaborationToTasks requires report payload');
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
            requestId: recommendation.requestId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class PrivacyPreservingCollaborationLayer {
    constructor({
        localAgentId = 'agent:privacy-collaboration',
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
        const report = buildPrivacyPreservingCollaboration(inputPayload, {
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
        return privacyCollaborationToTasks(reportPayload, {
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

export const __privacyPreservingCollaborationLayerInternals = {
    normalizePolicies,
    normalizeRequests,
    evaluateRequest,
    summarizePrivacy,
    buildRecommendations
};
