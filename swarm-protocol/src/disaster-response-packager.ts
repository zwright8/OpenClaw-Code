import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    launch_disaster_mission: 'agent:ops',
    secure_logistics_corridor: 'agent:logistics',
    fill_resource_gap: 'agent:operations',
    publish_humanitarian_brief: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const SeverityRank = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
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

function normalizeDisasters(inputPayload) {
    const disasters = Array.isArray(inputPayload?.disasters)
        ? inputPayload.disasters
        : [];
    return disasters
        .filter((disaster) => disaster && typeof disaster === 'object')
        .map((disaster, index) => ({
            disasterId: typeof disaster.disasterId === 'string' && disaster.disasterId.trim()
                ? disaster.disasterId.trim()
                : `disaster-${index + 1}`,
            type: typeof disaster.type === 'string' && disaster.type.trim()
                ? disaster.type.trim()
                : 'general',
            region: typeof disaster.region === 'string' && disaster.region.trim()
                ? disaster.region.trim()
                : 'global',
            severity: typeof disaster.severity === 'string' && SeverityRank[disaster.severity.trim()]
                ? disaster.severity.trim()
                : 'high',
            impactedPopulation: Math.max(0, Math.floor(safeNumber(disaster.impactedPopulation, 0))),
            urgencyHours: Math.max(1, Math.floor(safeNumber(disaster.urgencyHours, 24))),
            requiredCapabilities: normalizeStringArray(disaster.requiredCapabilities),
            logisticsConstraints: normalizeStringArray(disaster.logisticsConstraints),
            criticalNeeds: normalizeStringArray(disaster.criticalNeeds)
        }));
}

function normalizeResources(inputPayload) {
    const resources = Array.isArray(inputPayload?.resources)
        ? inputPayload.resources
        : [];
    return resources
        .filter((resource) => resource && typeof resource === 'object')
        .map((resource, index) => ({
            id: typeof resource.id === 'string' && resource.id.trim()
                ? resource.id.trim()
                : `resource-${index + 1}`,
            type: typeof resource.type === 'string' && resource.type.trim()
                ? resource.type.trim()
                : 'team',
            regionCoverage: normalizeStringArray(resource.regionCoverage),
            capabilities: normalizeStringArray(resource.capabilities),
            quantity: Math.max(0, Math.floor(safeNumber(resource.quantity, 1))),
            readiness: clamp(safeNumber(resource.readiness, 65)),
            availableHours: Math.max(1, Math.floor(safeNumber(resource.availableHours, 48)))
        }));
}

function resourceMatch(resource, disaster) {
    const regionMatch = resource.regionCoverage.length === 0
        || resource.regionCoverage.includes('global')
        || resource.regionCoverage.includes(disaster.region);
    const capabilityMatches = disaster.requiredCapabilities.filter((capability) => (
        resource.capabilities.includes(capability)
    )).length;
    const capabilityCoverage = disaster.requiredCapabilities.length > 0
        ? capabilityMatches / disaster.requiredCapabilities.length
        : 0.2;
    return {
        regionMatch,
        capabilityCoverage,
        score: clamp(Math.round(
            (regionMatch ? 35 : 8)
            + capabilityCoverage * 45
            + resource.readiness * 0.2
            + Math.min(resource.quantity * 2, 10)
        ))
    };
}

function createMissionPackage(disaster, resources) {
    const resourceMatches = resources
        .map((resource) => ({
            resourceId: resource.id,
            resourceType: resource.type,
            quantity: resource.quantity,
            readiness: resource.readiness,
            availableHours: resource.availableHours,
            capabilities: [...resource.capabilities],
            ...resourceMatch(resource, disaster)
        }))
        .filter((entry) => entry.score >= 40)
        .sort((a, b) => b.score - a.score);

    const capabilityCoverage = disaster.requiredCapabilities.length > 0
        ? Number((disaster.requiredCapabilities.reduce((acc, capability) => {
            const hasCapability = resourceMatches.some((resource) => resource.capabilities.includes(capability));
            return acc + (hasCapability ? 1 : 0);
        }, 0) / disaster.requiredCapabilities.length * 100).toFixed(2))
        : 100;
    const avgReadiness = resourceMatches.length > 0
        ? Number((resourceMatches.reduce((acc, resource) => acc + resource.readiness, 0) / resourceMatches.length).toFixed(2))
        : 0;
    const logisticsRisk = clamp(Math.round(
        disaster.logisticsConstraints.length * 14
        + (100 - capabilityCoverage) * 0.45
        + (100 - avgReadiness) * 0.35
        + (disaster.urgencyHours <= 12 ? 12 : 0)
    ));

    const readinessScore = clamp(Math.round(
        capabilityCoverage * 0.45
        + avgReadiness * 0.3
        + (100 - logisticsRisk) * 0.25
    ));

    let posture = 'launch_ready';
    if (readinessScore < 45 || capabilityCoverage < 50) posture = 'blocked';
    else if (readinessScore < 70 || logisticsRisk > 55) posture = 'review_required';

    const missionSteps = {
        assess: [
            `Validate impact in ${disaster.region} and confirm top needs: ${disaster.criticalNeeds.join(', ') || 'shelter, medical, food'}.`,
            `Map affected population segments (${disaster.impactedPopulation} estimated).`
        ],
        mobilize: [
            `Deploy initial response cell within ${Math.max(1, Math.round(disaster.urgencyHours * 0.3))} hours.`,
            `Allocate resources: ${resourceMatches.slice(0, 4).map((resource) => resource.resourceId).join(', ') || 'none mapped'}.`
        ],
        deliver: [
            `Execute relief lanes while monitoring constraints: ${disaster.logisticsConstraints.join(', ') || 'none'}.`,
            `Prioritize critical needs by vulnerability and access risk.`
        ],
        stabilize: [
            `Track mission KPIs for 24h stabilization window.`,
            `Adjust resource mix if readiness drops below 65.`
        ],
        report: [
            'Publish humanitarian status brief and next operational milestones.',
            'Capture lessons learned for future disaster package updates.'
        ]
    };

    return {
        missionId: `mission-${disaster.disasterId}`,
        disasterId: disaster.disasterId,
        disasterType: disaster.type,
        region: disaster.region,
        severity: disaster.severity,
        impactedPopulation: disaster.impactedPopulation,
        urgencyHours: disaster.urgencyHours,
        posture,
        readinessScore,
        capabilityCoverage,
        avgResourceReadiness: avgReadiness,
        logisticsRisk,
        mappedResourceCount: resourceMatches.length,
        resourceMatches,
        missionSteps
    };
}

function summarizePackages(packages) {
    const avgReadinessScore = packages.length > 0
        ? Number((packages.reduce((acc, pkg) => acc + pkg.readinessScore, 0) / packages.length).toFixed(2))
        : 0;
    const avgLogisticsRisk = packages.length > 0
        ? Number((packages.reduce((acc, pkg) => acc + pkg.logisticsRisk, 0) / packages.length).toFixed(2))
        : 0;

    let posture = 'ready';
    const blockedCount = packages.filter((pkg) => pkg.posture === 'blocked').length;
    const reviewRequiredCount = packages.filter((pkg) => pkg.posture === 'review_required').length;
    if (blockedCount > 0 || avgReadinessScore < 50) posture = 'critical';
    else if (reviewRequiredCount > 0 || avgReadinessScore < 70) posture = 'review_required';

    return {
        missionCount: packages.length,
        launchReadyCount: packages.filter((pkg) => pkg.posture === 'launch_ready').length,
        reviewRequiredCount,
        blockedCount,
        avgReadinessScore,
        avgLogisticsRisk,
        posture
    };
}

function buildAlerts(summary, packages) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('disaster_mission_blocked');
    if (summary.reviewRequiredCount > 0) alerts.push('disaster_mission_review_required');
    if (summary.avgLogisticsRisk > 60) alerts.push('disaster_logistics_risk_high');
    if (packages.some((pkg) => pkg.capabilityCoverage < 60)) alerts.push('disaster_capability_gap');
    return alerts;
}

function buildRecommendations(packages, summary, alerts) {
    const recommendations = [];
    for (const pkg of packages) {
        if (pkg.posture === 'launch_ready') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'launch_disaster_mission',
                missionId: pkg.missionId,
                title: `Launch disaster mission ${pkg.missionId}`,
                description: `Readiness ${pkg.readinessScore} for ${pkg.region}.`,
                priority: pkg.severity === 'critical' ? 'P0' : 'P1'
            });
        } else {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'fill_resource_gap',
                missionId: pkg.missionId,
                title: `Fill resource gaps for ${pkg.missionId}`,
                description: `Capability coverage ${pkg.capabilityCoverage} with posture ${pkg.posture}.`,
                priority: pkg.posture === 'blocked' ? 'P0' : 'P1'
            });
        }

        if (pkg.logisticsRisk >= 55) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'secure_logistics_corridor',
                missionId: pkg.missionId,
                title: `Secure logistics corridor for ${pkg.missionId}`,
                description: `Logistics risk ${pkg.logisticsRisk} requires route and access controls.`,
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_humanitarian_brief',
            title: 'Publish humanitarian mission brief',
            description: 'Share mission package readiness, constraints, and ownership.',
            priority: alerts.includes('disaster_mission_blocked') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.missionId || '').localeCompare(String(b.missionId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.missionId || '') === String(entry.missionId || '')
        )) === index);
}

export function packageDisasterResponseMissions(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const disasters = normalizeDisasters(inputPayload || {});
    const resources = normalizeResources(inputPayload || {});
    const missionPackages = disasters.map((disaster) => createMissionPackage(disaster, resources))
        .sort((a, b) => {
            const postureRank = { blocked: 0, review_required: 1, launch_ready: 2 };
            const p = postureRank[a.posture] - postureRank[b.posture];
            if (p !== 0) return p;
            return b.logisticsRisk - a.logisticsRisk;
        });
    const summary = summarizePackages(missionPackages);
    const alerts = buildAlerts(summary, missionPackages);
    const recommendations = buildRecommendations(missionPackages, summary, alerts);

    return {
        at,
        summary,
        missionPackages,
        alerts,
        recommendations
    };
}

export function disasterMissionPackagesToTasks(reportPayload, {
    fromAgentId = 'agent:disaster-packager',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('disasterMissionPackagesToTasks requires report payload');
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
            missionId: recommendation.missionId || null,
            posture: reportPayload.summary?.posture || null,
            blockedCount: reportPayload.summary?.blockedCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class DisasterResponseMissionPackager {
    constructor({
        localAgentId = 'agent:disaster-packager',
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
        const report = packageDisasterResponseMissions(inputPayload, {
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
        return disasterMissionPackagesToTasks(reportPayload, {
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

export const __disasterResponsePackagerInternals = {
    normalizeDisasters,
    normalizeResources,
    createMissionPackage,
    summarizePackages,
    buildRecommendations
};
