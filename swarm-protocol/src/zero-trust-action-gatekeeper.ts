import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    enforce_step_up_authentication: 'agent:security',
    narrow_action_privileges: 'agent:governance',
    deny_high_risk_action: 'agent:ops'
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

function normalizeRequests(inputPayload) {
    const source = Array.isArray(inputPayload?.actionRequests)
        ? inputPayload.actionRequests
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            actionId: typeof entry.actionId === 'string' && entry.actionId.trim()
                ? entry.actionId.trim()
                : `action-${index + 1}`,
            actorId: typeof entry.actorId === 'string' && entry.actorId.trim()
                ? entry.actorId.trim()
                : `actor-${index + 1}`,
            requestedCapabilities: normalizeStringArray(entry.requestedCapabilities),
            riskScore: clamp(safeNumber(entry.riskScore, 48)),
            dataSensitivity: clamp(safeNumber(entry.dataSensitivity, 40)),
            blastRadius: clamp(safeNumber(entry.blastRadius, 36)),
            mfaPresent: Boolean(entry.mfaPresent),
            sessionAssurance: clamp(safeNumber(entry.sessionAssurance, entry.mfaPresent ? 72 : 42))
        }));
}

function normalizePolicies(inputPayload) {
    const source = Array.isArray(inputPayload?.capabilityPolicies)
        ? inputPayload.capabilityPolicies
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            policyId: typeof entry.policyId === 'string' && entry.policyId.trim()
                ? entry.policyId.trim()
                : `policy-${index + 1}`,
            capability: typeof entry.capability === 'string' && entry.capability.trim()
                ? entry.capability.trim().toLowerCase()
                : `capability-${index + 1}`,
            maxRisk: clamp(safeNumber(entry.maxRisk, 60)),
            requiresMfa: Boolean(entry.requiresMfa),
            privileged: Boolean(entry.privileged)
        }));
}

function evaluateAction(request, policyByCapability) {
    const capabilityDecisions = request.requestedCapabilities.map((capability) => {
        const policy = policyByCapability.get(capability);

        const policyMissing = !policy;
        const exceedsRisk = policy ? request.riskScore > policy.maxRisk : true;
        const mfaViolation = policy ? policy.requiresMfa && !request.mfaPresent : !request.mfaPresent;
        const privilegedCapability = policy ? policy.privileged : false;

        const capabilityRisk = clamp(Math.round(
            request.riskScore * 0.44
            + request.dataSensitivity * 0.2
            + request.blastRadius * 0.2
            + (mfaViolation ? 18 : 0)
            + (policyMissing ? 14 : 0)
            + (privilegedCapability ? 10 : 0)
        ));

        let decision = 'allow';
        if (policyMissing || exceedsRisk || capabilityRisk >= 78) decision = 'deny';
        else if (mfaViolation || privilegedCapability || capabilityRisk >= 62) decision = 'step_up';

        return {
            capability,
            decision,
            policyMissing,
            exceedsRisk,
            mfaViolation,
            privilegedCapability,
            capabilityRisk
        };
    });

    const highestRisk = capabilityDecisions.length > 0
        ? Math.max(...capabilityDecisions.map((entry) => entry.capabilityRisk))
        : 0;

    let finalDecision = 'allow';
    if (capabilityDecisions.some((entry) => entry.decision === 'deny')) finalDecision = 'deny';
    else if (capabilityDecisions.some((entry) => entry.decision === 'step_up')) finalDecision = 'step_up';

    return {
        actionId: request.actionId,
        actorId: request.actorId,
        finalDecision,
        highestRisk,
        capabilityDecisions,
        riskScore: request.riskScore,
        dataSensitivity: request.dataSensitivity,
        blastRadius: request.blastRadius,
        mfaPresent: request.mfaPresent,
        sessionAssurance: request.sessionAssurance
    };
}

function gateActions(requests, policies) {
    const policyByCapability = new Map(policies.map((policy) => [policy.capability, policy]));

    return requests
        .map((request) => evaluateAction(request, policyByCapability))
        .sort((a, b) => b.highestRisk - a.highestRisk);
}

function summarizeGate(rows) {
    const decisionCounts = rows.reduce((acc, row) => {
        acc[row.finalDecision] = (acc[row.finalDecision] || 0) + 1;
        return acc;
    }, {
        allow: 0,
        step_up: 0,
        deny: 0
    });

    const avgRisk = rows.length > 0
        ? Number((rows.reduce((acc, row) => acc + row.highestRisk, 0) / rows.length).toFixed(2))
        : 0;

    let posture = 'open';
    if (decisionCounts.step_up > 0 || avgRisk >= 55) posture = 'guarded';
    if (decisionCounts.deny > 0 || avgRisk >= 72) posture = 'restricted';

    return {
        actionCount: rows.length,
        decisionCounts,
        avgRisk,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.decisionCounts.step_up > 0) alerts.push('step_up_auth_required');
    if (summary.decisionCounts.deny > 0) alerts.push('high_risk_actions_denied');
    if (summary.avgRisk >= 65) alerts.push('zero_trust_risk_elevated');
    return alerts;
}

function buildRecommendations(rows, summary) {
    const recommendations = [];

    for (const row of rows) {
        if (row.finalDecision === 'step_up') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'enforce_step_up_authentication',
                actionId: row.actionId,
                title: `Enforce step-up auth for ${row.actionId}`,
                description: `Action requires stronger authentication controls.`,
                priority: row.highestRisk >= 70 ? 'P1' : 'P2'
            });
        }

        const privilegeHotspots = row.capabilityDecisions.filter((entry) => entry.privilegedCapability || entry.exceedsRisk);
        if (privilegeHotspots.length > 0) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'narrow_action_privileges',
                actionId: row.actionId,
                title: `Narrow privileges for ${row.actionId}`,
                description: `${privilegeHotspots.length} capabilities exceed zero-trust least privilege policy.`,
                priority: row.highestRisk >= 72 ? 'P1' : 'P2'
            });
        }

        if (row.finalDecision === 'deny') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'deny_high_risk_action',
                actionId: row.actionId,
                title: `Deny high-risk action ${row.actionId}`,
                description: 'Action violates zero-trust policy constraints.',
                priority: 'P1'
            });
        }
    }

    if (summary.posture === 'restricted' && !recommendations.some((entry) => entry.type === 'deny_high_risk_action')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'deny_high_risk_action',
            title: 'Deny elevated risk action batch',
            description: 'Zero-trust posture is restricted pending remediation.',
            priority: 'P1'
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

export function enforceZeroTrustActionGate(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const requests = normalizeRequests(inputPayload || {});
    const policies = normalizePolicies(inputPayload || {});
    const decisions = gateActions(requests, policies);
    const summary = summarizeGate(decisions);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(decisions, summary);

    return {
        at,
        summary,
        decisions,
        alerts,
        recommendations
    };
}

export function zeroTrustGateToTasks(reportPayload, {
    fromAgentId = 'agent:zero-trust',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('zeroTrustGateToTasks requires report payload');
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
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class ZeroTrustActionGatekeeper {
    constructor({
        localAgentId = 'agent:zero-trust',
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
        const report = enforceZeroTrustActionGate(inputPayload, {
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
        return zeroTrustGateToTasks(reportPayload, {
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

export const __zeroTrustActionGatekeeperInternals = {
    normalizeRequests,
    normalizePolicies,
    evaluateAction,
    summarizeGate,
    buildRecommendations
};
