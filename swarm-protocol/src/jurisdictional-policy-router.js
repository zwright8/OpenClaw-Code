import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    add_jurisdiction_policy: 'agent:policy',
    resolve_jurisdiction_conflict: 'agent:review',
    enforce_data_residency: 'agent:security',
    publish_jurisdiction_route_brief: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const DecisionRank = {
    deny: 4,
    require_approval: 3,
    allow_with_sandbox: 2,
    allow: 1
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

function normalizePolicies(inputPayload) {
    const policies = Array.isArray(inputPayload?.policies)
        ? inputPayload.policies
        : [];

    return policies
        .filter((policy) => policy && typeof policy === 'object')
        .map((policy, index) => ({
            id: typeof policy.id === 'string' && policy.id.trim()
                ? policy.id.trim()
                : `policy-${index + 1}`,
            name: typeof policy.name === 'string' && policy.name.trim()
                ? policy.name.trim()
                : `Policy ${index + 1}`,
            jurisdictions: normalizeStringArray(policy.jurisdictions),
            priority: clamp(safeNumber(policy.priority, 50)),
            decision: typeof policy.decision === 'string' && DecisionRank[policy.decision.trim()]
                ? policy.decision.trim()
                : 'require_approval',
            condition: {
                riskTagsAny: normalizeStringArray(policy?.condition?.riskTagsAny),
                capabilitiesAny: normalizeStringArray(policy?.condition?.capabilitiesAny),
                dataClassesAny: normalizeStringArray(policy?.condition?.dataClassesAny),
                prioritiesAny: normalizeStringArray(policy?.condition?.prioritiesAny)
            },
            dataResidency: typeof policy.dataResidency === 'string' && policy.dataResidency.trim()
                ? policy.dataResidency.trim()
                : null
        }));
}

function normalizeRequests(inputPayload) {
    const requests = Array.isArray(inputPayload?.requests)
        ? inputPayload.requests
        : [];

    return requests
        .filter((request) => request && typeof request === 'object')
        .map((request, index) => ({
            requestId: typeof request.requestId === 'string' && request.requestId.trim()
                ? request.requestId.trim()
                : `request-${index + 1}`,
            jurisdiction: typeof request.jurisdiction === 'string' && request.jurisdiction.trim()
                ? request.jurisdiction.trim()
                : 'global',
            priority: typeof request.priority === 'string' && request.priority.trim()
                ? request.priority.trim()
                : 'normal',
            riskTags: normalizeStringArray(request.riskTags),
            capabilities: normalizeStringArray(request.capabilities),
            dataClasses: normalizeStringArray(request.dataClasses),
            dataResidence: typeof request.dataResidence === 'string' && request.dataResidence.trim()
                ? request.dataResidence.trim()
                : null,
            task: typeof request.task === 'string' && request.task.trim()
                ? request.task.trim()
                : 'unspecified_task'
        }));
}

function policyMatchesRequest(policy, request) {
    const jurisdictionMatch = policy.jurisdictions.length === 0
        || policy.jurisdictions.includes('global')
        || policy.jurisdictions.includes(request.jurisdiction);

    const condition = policy.condition || {};
    const riskMatch = condition.riskTagsAny.length === 0
        || condition.riskTagsAny.some((tag) => request.riskTags.includes(tag));
    const capabilityMatch = condition.capabilitiesAny.length === 0
        || condition.capabilitiesAny.some((capability) => request.capabilities.includes(capability));
    const dataClassMatch = condition.dataClassesAny.length === 0
        || condition.dataClassesAny.some((dataClass) => request.dataClasses.includes(dataClass));
    const priorityMatch = condition.prioritiesAny.length === 0
        || condition.prioritiesAny.includes(request.priority);

    return jurisdictionMatch && riskMatch && capabilityMatch && dataClassMatch && priorityMatch;
}

function precedenceScore(policy, request) {
    const jurisdictionSpecificity = policy.jurisdictions.includes(request.jurisdiction)
        ? 16
        : (policy.jurisdictions.includes('global') ? 4 : 0);
    const conditionDensity = clamp(
        policy.condition.riskTagsAny.length * 7
        + policy.condition.capabilitiesAny.length * 6
        + policy.condition.dataClassesAny.length * 6
        + policy.condition.prioritiesAny.length * 4,
        0,
        30
    );
    return clamp(Math.round(
        policy.priority * 0.7
        + DecisionRank[policy.decision] * 6
        + jurisdictionSpecificity
        + conditionDensity
    ));
}

function evaluateRequest(request, policies) {
    const matchedPolicies = policies
        .filter((policy) => policyMatchesRequest(policy, request))
        .map((policy) => ({
            policyId: policy.id,
            policyName: policy.name,
            decision: policy.decision,
            precedence: precedenceScore(policy, request),
            dataResidency: policy.dataResidency,
            priority: policy.priority
        }))
        .sort((a, b) => {
            if (b.precedence !== a.precedence) return b.precedence - a.precedence;
            return String(a.policyId).localeCompare(String(b.policyId));
        });

    const selectedPolicy = matchedPolicies[0] || null;
    const selectedDecision = selectedPolicy?.decision || 'require_approval';
    const decisionSet = new Set(matchedPolicies.map((entry) => entry.decision));
    const conflictDetected = decisionSet.size > 1;
    const dataResidencyRequired = matchedPolicies
        .map((entry) => entry.dataResidency)
        .find((entry) => entry && typeof entry === 'string') || null;
    const dataResidencyViolation = !!(
        dataResidencyRequired
        && request.dataResidence
        && request.dataResidence !== dataResidencyRequired
    );

    let posture = 'routed';
    if (selectedDecision === 'deny' || dataResidencyViolation) posture = 'blocked';
    else if (conflictDetected || matchedPolicies.length === 0 || selectedDecision === 'require_approval') posture = 'review_required';

    return {
        requestId: request.requestId,
        jurisdiction: request.jurisdiction,
        task: request.task,
        selectedDecision,
        selectedPolicyId: selectedPolicy?.policyId || null,
        matchedPolicyCount: matchedPolicies.length,
        conflictDetected,
        dataResidencyRequired,
        dataResidencyViolation,
        posture,
        matchedPolicies
    };
}

function summarizeRoutes(routes) {
    const decisionCounts = routes.reduce((acc, route) => {
        acc[route.selectedDecision] = (acc[route.selectedDecision] || 0) + 1;
        return acc;
    }, {});
    const jurisdictionCounts = routes.reduce((acc, route) => {
        acc[route.jurisdiction] = (acc[route.jurisdiction] || 0) + 1;
        return acc;
    }, {});

    return {
        requestCount: routes.length,
        routedCount: routes.filter((route) => route.posture === 'routed').length,
        reviewRequiredCount: routes.filter((route) => route.posture === 'review_required').length,
        blockedCount: routes.filter((route) => route.posture === 'blocked').length,
        conflictCount: routes.filter((route) => route.conflictDetected).length,
        residencyViolationCount: routes.filter((route) => route.dataResidencyViolation).length,
        decisionCounts,
        jurisdictionCounts
    };
}

function buildAlerts(summary, routes) {
    const alerts = [];
    if (summary.reviewRequiredCount > 0) alerts.push('jurisdiction_review_required');
    if (summary.blockedCount > 0) alerts.push('jurisdiction_route_blocked');
    if (summary.conflictCount > 0) alerts.push('jurisdiction_policy_conflict');
    if (summary.residencyViolationCount > 0) alerts.push('data_residency_violation');
    if (routes.some((route) => route.matchedPolicyCount === 0)) alerts.push('jurisdiction_policy_missing');
    return alerts;
}

function buildRecommendations(routes, summary, alerts) {
    const recommendations = [];

    for (const route of routes) {
        if (route.matchedPolicyCount === 0) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_jurisdiction_policy',
                requestId: route.requestId,
                jurisdiction: route.jurisdiction,
                title: `Add policy coverage for ${route.jurisdiction}`,
                description: `No policy matched request ${route.requestId}.`,
                priority: 'P1'
            });
        }
        if (route.conflictDetected) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'resolve_jurisdiction_conflict',
                requestId: route.requestId,
                jurisdiction: route.jurisdiction,
                title: `Resolve conflicting policies for ${route.requestId}`,
                description: `Conflicting decisions detected for ${route.jurisdiction}.`,
                priority: 'P0'
            });
        }
        if (route.dataResidencyViolation) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'enforce_data_residency',
                requestId: route.requestId,
                jurisdiction: route.jurisdiction,
                title: `Enforce data residency for ${route.requestId}`,
                description: `Required residency ${route.dataResidencyRequired} but got ${route.dataResidence || 'unknown'}.`,
                priority: 'P0'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_jurisdiction_route_brief',
            title: 'Publish jurisdiction routing brief',
            description: `Route posture: ${summary.routedCount} routed, ${summary.reviewRequiredCount} review, ${summary.blockedCount} blocked.`,
            priority: alerts.includes('jurisdiction_route_blocked') ? 'P1' : 'P2'
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

export function routeJurisdictionalPolicies(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const policies = normalizePolicies(inputPayload || {});
    const requests = normalizeRequests(inputPayload || {});
    const routes = requests.map((request) => evaluateRequest(request, policies))
        .sort((a, b) => {
            const postureRank = { blocked: 0, review_required: 1, routed: 2 };
            const p = postureRank[a.posture] - postureRank[b.posture];
            if (p !== 0) return p;
            return String(a.requestId).localeCompare(String(b.requestId));
        });
    const summary = summarizeRoutes(routes);
    const alerts = buildAlerts(summary, routes);
    const recommendations = buildRecommendations(routes, summary, alerts);

    return {
        at,
        summary,
        routes,
        alerts,
        recommendations
    };
}

export function jurisdictionRoutesToTasks(reportPayload, {
    fromAgentId = 'agent:jurisdiction',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('jurisdictionRoutesToTasks requires report payload');
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
            jurisdiction: recommendation.jurisdiction || null,
            blockedCount: reportPayload.summary?.blockedCount || 0,
            conflictCount: reportPayload.summary?.conflictCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class JurisdictionalPolicyRouter {
    constructor({
        localAgentId = 'agent:jurisdiction',
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
        const report = routeJurisdictionalPolicies(inputPayload, {
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
        return jurisdictionRoutesToTasks(reportPayload, {
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

export const __jurisdictionalPolicyRouterInternals = {
    normalizePolicies,
    normalizeRequests,
    evaluateRequest,
    summarizeRoutes,
    buildRecommendations
};
