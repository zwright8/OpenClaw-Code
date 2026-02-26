import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    assign_cross_org_initiative: 'agent:federation',
    resolve_cross_org_policy_conflict: 'agent:governance',
    establish_federation_mou: 'agent:ops'
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

function normalizeOrgs(inputPayload) {
    const source = Array.isArray(inputPayload?.organizations)
        ? inputPayload.organizations
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            orgId: typeof entry.orgId === 'string' && entry.orgId.trim()
                ? entry.orgId.trim()
                : `org-${index + 1}`,
            trustScore: clamp(safeNumber(entry.trustScore, 66)),
            capabilities: normalizeStringArray(entry.capabilities),
            dataPolicies: normalizeStringArray(entry.dataPolicies),
            capacity: clamp(safeNumber(entry.capacity, 65))
        }));
}

function normalizeInitiatives(inputPayload) {
    const source = Array.isArray(inputPayload?.initiatives)
        ? inputPayload.initiatives
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            initiativeId: typeof entry.initiativeId === 'string' && entry.initiativeId.trim()
                ? entry.initiativeId.trim()
                : `initiative-${index + 1}`,
            requiredCapabilities: normalizeStringArray(entry.requiredCapabilities),
            requiredDataPolicies: normalizeStringArray(entry.requiredDataPolicies),
            urgency: clamp(safeNumber(entry.urgency, 58)),
            criticality: clamp(safeNumber(entry.criticality, 62))
        }));
}

function scoreOrgForInitiative(org, initiative) {
    const capabilityCoverage = initiative.requiredCapabilities.length > 0
        ? initiative.requiredCapabilities.filter((capability) => org.capabilities.includes(capability)).length / initiative.requiredCapabilities.length
        : 1;

    const policyCoverage = initiative.requiredDataPolicies.length > 0
        ? initiative.requiredDataPolicies.filter((policy) => org.dataPolicies.includes(policy)).length / initiative.requiredDataPolicies.length
        : 1;

    const suitabilityScore = clamp(Math.round(
        capabilityCoverage * 42
        + policyCoverage * 24
        + org.trustScore * 0.2
        + org.capacity * 0.14
    ));

    return {
        orgId: org.orgId,
        suitabilityScore,
        capabilityCoverage: Number(capabilityCoverage.toFixed(4)),
        policyCoverage: Number(policyCoverage.toFixed(4)),
        trustScore: org.trustScore,
        capacity: org.capacity
    };
}

function coordinateInitiatives(organizations, initiatives) {
    return initiatives.map((initiative) => {
        const rankedOrgs = organizations
            .map((org) => scoreOrgForInitiative(org, initiative))
            .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

        const selected = rankedOrgs.slice(0, Math.min(3, rankedOrgs.length));
        const best = selected[0] || null;

        const federationRisk = clamp(Math.round(
            (best ? (100 - best.suitabilityScore) : 90) * 0.5
            + initiative.criticality * 0.2
            + initiative.urgency * 0.18
            + (selected.length < 2 ? 14 : 0)
        ));

        const policyConflict = selected.some((org) => org.policyCoverage < 0.75);
        const underCovered = !best || best.capabilityCoverage < 0.75;

        return {
            initiativeId: initiative.initiativeId,
            selectedOrganizations: selected,
            federationRisk,
            policyConflict,
            underCovered,
            requiredCapabilities: initiative.requiredCapabilities,
            requiredDataPolicies: initiative.requiredDataPolicies,
            urgency: initiative.urgency,
            criticality: initiative.criticality
        };
    }).sort((a, b) => b.federationRisk - a.federationRisk);
}

function summarizeFederation(assignments) {
    const underCoveredCount = assignments.filter((assignment) => assignment.underCovered).length;
    const policyConflictCount = assignments.filter((assignment) => assignment.policyConflict).length;
    const avgFederationRisk = assignments.length > 0
        ? Number((assignments.reduce((acc, assignment) => acc + assignment.federationRisk, 0) / assignments.length).toFixed(2))
        : 0;

    let posture = 'coordinated';
    if (underCoveredCount > 0 || policyConflictCount > 0 || avgFederationRisk >= 58) posture = 'review_required';
    if (underCoveredCount > 0 && policyConflictCount > 0) posture = 'blocked';

    return {
        initiativeCount: assignments.length,
        underCoveredCount,
        policyConflictCount,
        avgFederationRisk,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.underCoveredCount > 0) alerts.push('federation_capability_gaps');
    if (summary.policyConflictCount > 0) alerts.push('federation_policy_conflicts');
    if (summary.avgFederationRisk >= 65) alerts.push('federation_risk_high');
    return alerts;
}

function buildRecommendations(assignments, summary) {
    const recommendations = [];

    for (const assignment of assignments) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'assign_cross_org_initiative',
            initiativeId: assignment.initiativeId,
            title: `Assign cross-org initiative ${assignment.initiativeId}`,
            description: `${assignment.selectedOrganizations.length} organizations selected with federation risk ${assignment.federationRisk}.`,
            priority: assignment.criticality >= 75 ? 'P1' : 'P2'
        });

        if (assignment.policyConflict) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'resolve_cross_org_policy_conflict',
                initiativeId: assignment.initiativeId,
                title: `Resolve policy conflict for ${assignment.initiativeId}`,
                description: 'Data policy mismatch detected across selected organizations.',
                priority: assignment.criticality >= 70 ? 'P1' : 'P2'
            });
        }

        if (assignment.underCovered) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'establish_federation_mou',
                initiativeId: assignment.initiativeId,
                title: `Establish federation MOU for ${assignment.initiativeId}`,
                description: 'Capability coverage is insufficient and needs formal collaboration commitments.',
                priority: assignment.urgency >= 70 ? 'P1' : 'P2'
            });
        }
    }

    if (summary.posture === 'blocked') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'resolve_cross_org_policy_conflict',
            title: 'Run federation conflict resolution council',
            description: 'Resolve capability and policy deadlocks across participating organizations.',
            priority: 'P1'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.initiativeId || '').localeCompare(String(b.initiativeId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.initiativeId || '') === String(entry.initiativeId || '')
        )) === index);
}

export function coordinateCrossOrgFederation(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const organizations = normalizeOrgs(inputPayload || {});
    const initiatives = normalizeInitiatives(inputPayload || {});
    const assignments = coordinateInitiatives(organizations, initiatives);
    const summary = summarizeFederation(assignments);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(assignments, summary);

    return {
        at,
        summary,
        assignments,
        alerts,
        recommendations
    };
}

export function crossOrgCoordinationToTasks(reportPayload, {
    fromAgentId = 'agent:federation-coordinator',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('crossOrgCoordinationToTasks requires report payload');
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
            initiativeId: recommendation.initiativeId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class CrossOrgFederationCoordinator {
    constructor({
        localAgentId = 'agent:federation-coordinator',
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
        const report = coordinateCrossOrgFederation(inputPayload, {
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
        return crossOrgCoordinationToTasks(reportPayload, {
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

export const __crossOrgFederationCoordinatorInternals = {
    normalizeOrgs,
    normalizeInitiatives,
    scoreOrgForInitiative,
    summarizeFederation,
    buildRecommendations
};
