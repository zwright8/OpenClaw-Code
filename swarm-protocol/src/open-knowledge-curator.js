import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    publish_open_knowledge_artifact: 'agent:knowledge',
    run_quality_verification: 'agent:research',
    close_domain_coverage_gap: 'agent:community',
    publish_curation_digest: 'agent:ops'
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

function normalizeArtifacts(inputPayload) {
    const artifacts = Array.isArray(inputPayload?.artifacts)
        ? inputPayload.artifacts
        : [];

    return artifacts
        .filter((artifact) => artifact && typeof artifact === 'object')
        .map((artifact, index) => ({
            artifactId: typeof artifact.artifactId === 'string' && artifact.artifactId.trim()
                ? artifact.artifactId.trim()
                : `artifact-${index + 1}`,
            title: typeof artifact.title === 'string' && artifact.title.trim()
                ? artifact.title.trim()
                : `Artifact ${index + 1}`,
            domains: normalizeStringArray(artifact.domains),
            sourceTrust: clamp(safeNumber(artifact.sourceTrust, 70)),
            freshnessDays: Math.max(0, Math.floor(safeNumber(artifact.freshnessDays, 10))),
            reusability: clamp(safeNumber(artifact.reusability, 66)),
            licenseClarity: clamp(safeNumber(artifact.licenseClarity, 68)),
            evidenceDepth: clamp(safeNumber(artifact.evidenceDepth, 64)),
            duplicationRisk: clamp(safeNumber(artifact.duplicationRisk, 30))
        }));
}

function normalizeNeeds(inputPayload) {
    const needs = Array.isArray(inputPayload?.communityNeeds)
        ? inputPayload.communityNeeds
        : [];

    return needs
        .filter((need) => need && typeof need === 'object')
        .map((need, index) => ({
            needId: typeof need.needId === 'string' && need.needId.trim()
                ? need.needId.trim()
                : `need-${index + 1}`,
            domain: typeof need.domain === 'string' && need.domain.trim()
                ? need.domain.trim()
                : 'general',
            priorityImpact: clamp(safeNumber(need.priorityImpact, 70)),
            urgency: clamp(safeNumber(need.urgency, 62))
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};

    return {
        curationSlots: Math.max(0, Math.floor(safeNumber(capacity.curationSlots, 6))),
        reviewerHours: Math.max(0, Math.floor(safeNumber(capacity.reviewerHours, 36))),
        publicationSlots: Math.max(0, Math.floor(safeNumber(capacity.publicationSlots, 4)))
    };
}

function artifactQuality(artifact) {
    const freshnessScore = clamp(100 - artifact.freshnessDays * 2.2);
    return clamp(Math.round(
        artifact.sourceTrust * 0.24
        + artifact.reusability * 0.2
        + artifact.licenseClarity * 0.18
        + artifact.evidenceDepth * 0.2
        + freshnessScore * 0.12
        + (100 - artifact.duplicationRisk) * 0.06
    ));
}

function needPriority(need) {
    return clamp(Math.round(
        need.priorityImpact * 0.58
        + need.urgency * 0.42
    ));
}

function artifactNeedFit(artifact, need) {
    const domainMatch = artifact.domains.includes(need.domain) ? 1 : (artifact.domains.length === 0 ? 0.2 : 0);
    return clamp(Math.round(
        domainMatch * 48
        + artifactQuality(artifact) * 0.42
        - artifact.duplicationRisk * 0.18
    ));
}

function curateKnowledge(artifacts, needs, capacity) {
    let curationSlots = capacity.curationSlots;
    let reviewerHours = capacity.reviewerHours;
    let publicationSlots = capacity.publicationSlots;

    const prioritizedNeeds = needs
        .map((need) => ({
            ...need,
            priorityScore: needPriority(need)
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

    const usedArtifacts = new Set();
    const plans = [];

    for (const need of prioritizedNeeds) {
        const rankedArtifacts = artifacts
            .map((artifact) => ({
                artifactId: artifact.artifactId,
                title: artifact.title,
                qualityScore: artifactQuality(artifact),
                fitScore: artifactNeedFit(artifact, need),
                licenseClarity: artifact.licenseClarity,
                domains: [...artifact.domains]
            }))
            .filter((artifact) => !usedArtifacts.has(artifact.artifactId))
            .sort((a, b) => b.fitScore - a.fitScore);

        let selectedArtifact = null;
        for (const candidate of rankedArtifacts) {
            const reviewNeed = Math.max(2, Math.round((100 - candidate.qualityScore) * 0.16));
            if (curationSlots <= 0) continue;
            if (publicationSlots <= 0) continue;
            if (reviewNeed > reviewerHours) continue;
            selectedArtifact = {
                ...candidate,
                reviewNeed
            };
            usedArtifacts.add(candidate.artifactId);
            curationSlots -= 1;
            publicationSlots -= 1;
            reviewerHours -= reviewNeed;
            break;
        }

        const reviewNeed = selectedArtifact
            ? selectedArtifact.reviewNeed
            : Math.max(2, Math.round(need.priorityScore * 0.1));
        const reviewAllocated = selectedArtifact
            ? selectedArtifact.reviewNeed
            : Math.min(reviewerHours, reviewNeed);

        const projectedCoverageLift = selectedArtifact
            ? clamp(Math.round(
                selectedArtifact.fitScore * 0.42
                + selectedArtifact.qualityScore * 0.2
            ))
            : 0;

        const knowledgeGap = clamp(Math.round(
            need.priorityScore * 0.64
            - projectedCoverageLift * 0.56
            + (selectedArtifact ? 0 : 20)
            + (reviewAllocated < reviewNeed ? 10 : 0)
        ));

        let lane = 'now';
        if (!selectedArtifact || knowledgeGap > 70) lane = 'hold';
        else if (knowledgeGap > 44) lane = 'next';

        plans.push({
            needId: need.needId,
            domain: need.domain,
            priorityScore: need.priorityScore,
            selectedArtifact,
            reviewNeed,
            reviewAllocated,
            projectedCoverageLift,
            knowledgeGap,
            lane
        });
    }

    return {
        plans: plans.sort((a, b) => {
            const laneRank = { now: 0, next: 1, hold: 2 };
            const laneDiff = laneRank[a.lane] - laneRank[b.lane];
            if (laneDiff !== 0) return laneDiff;
            return b.priorityScore - a.priorityScore;
        }),
        remainingCapacity: {
            curationSlots,
            reviewerHours,
            publicationSlots
        }
    };
}

function summarizePlans(plans, remainingCapacity) {
    const avgKnowledgeGap = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.knowledgeGap, 0) / plans.length).toFixed(2))
        : 0;
    const avgCoverageLift = plans.length > 0
        ? Number((plans.reduce((acc, plan) => acc + plan.projectedCoverageLift, 0) / plans.length).toFixed(2))
        : 0;

    const laneCounts = plans.reduce((acc, plan) => {
        acc[plan.lane] = (acc[plan.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    let posture = 'curation_ready';
    if (laneCounts.hold > 0 || avgKnowledgeGap > 60) posture = 'critical';
    else if (laneCounts.next > 0 || avgKnowledgeGap > 42) posture = 'review_required';

    return {
        needCount: plans.length,
        laneCounts,
        avgKnowledgeGap,
        avgCoverageLift,
        remainingCapacity,
        posture
    };
}

function buildAlerts(summary, plans) {
    const alerts = [];
    if (summary.laneCounts.hold > 0) alerts.push('knowledge_curation_hold_queue_present');
    if (summary.avgKnowledgeGap > 55) alerts.push('knowledge_gap_high');
    if (plans.some((plan) => plan.reviewAllocated < plan.reviewNeed)) alerts.push('knowledge_reviewer_capacity_gap');
    if (plans.some((plan) => !plan.selectedArtifact)) alerts.push('knowledge_domain_coverage_gap');
    if (plans.some((plan) => plan.selectedArtifact && plan.selectedArtifact.licenseClarity < 60)) {
        alerts.push('knowledge_license_clarity_gap');
    }
    return alerts;
}

function buildRecommendations(plans, summary, alerts) {
    const recommendations = [];
    for (const plan of plans) {
        if (plan.selectedArtifact && plan.lane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'publish_open_knowledge_artifact',
                needId: plan.needId,
                title: `Publish curated artifact for ${plan.domain}`,
                description: `Coverage lift ${plan.projectedCoverageLift} with quality score ${plan.selectedArtifact.qualityScore}.`,
                priority: plan.priorityScore >= 80 ? 'P1' : 'P2'
            });
        }
        if (plan.reviewAllocated < plan.reviewNeed || (plan.selectedArtifact && plan.selectedArtifact.qualityScore < 70)) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_quality_verification',
                needId: plan.needId,
                title: `Run quality verification for ${plan.domain}`,
                description: `Review allocation ${plan.reviewAllocated}/${plan.reviewNeed}.`,
                priority: plan.lane === 'hold' ? 'P1' : 'P2'
            });
        }
        if (!plan.selectedArtifact || plan.knowledgeGap > 56) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'close_domain_coverage_gap',
                needId: plan.needId,
                title: `Close domain coverage gap for ${plan.domain}`,
                description: `Knowledge gap ${plan.knowledgeGap} requires additional open resources.`,
                priority: plan.lane === 'hold' ? 'P0' : 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_curation_digest',
            title: 'Publish open knowledge curation digest',
            description: 'Share coverage lanes, quality posture, and domain-level gaps with owners.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.needId || '').localeCompare(String(b.needId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.needId || '') === String(entry.needId || '')
        )) === index);
}

export function curateOpenKnowledge(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const artifacts = normalizeArtifacts(inputPayload || {});
    const needs = normalizeNeeds(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const planning = curateKnowledge(artifacts, needs, capacity);
    const summary = summarizePlans(planning.plans, planning.remainingCapacity);
    const alerts = buildAlerts(summary, planning.plans);
    const recommendations = buildRecommendations(planning.plans, summary, alerts);

    return {
        at,
        summary,
        plans: planning.plans,
        alerts,
        recommendations
    };
}

export function openKnowledgeToTasks(reportPayload, {
    fromAgentId = 'agent:open-knowledge',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('openKnowledgeToTasks requires report payload');
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
            needId: recommendation.needId || null,
            posture: reportPayload.summary?.posture || null,
            holdCount: reportPayload.summary?.laneCounts?.hold || 0
        },
        createdAt: nowMs + index
    }));
}

export class OpenKnowledgeCurator {
    constructor({
        localAgentId = 'agent:open-knowledge',
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
        const report = curateOpenKnowledge(inputPayload, {
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
        return openKnowledgeToTasks(reportPayload, {
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

export const __openKnowledgeCuratorInternals = {
    normalizeArtifacts,
    normalizeNeeds,
    curateKnowledge,
    summarizePlans,
    buildRecommendations
};
