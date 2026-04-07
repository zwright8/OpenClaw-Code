import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    fund_hypothesis_experiment: 'agent:research',
    allocate_evidence_resource: 'agent:resource-planning',
    run_peer_review: 'agent:science-review',
    publish_marketplace_brief: 'agent:ops'
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

function normalizeHypotheses(inputPayload) {
    const hypotheses = Array.isArray(inputPayload?.hypotheses)
        ? inputPayload.hypotheses
        : [];

    return hypotheses
        .filter((hypothesis) => hypothesis && typeof hypothesis === 'object')
        .map((hypothesis, index) => ({
            hypothesisId: typeof hypothesis.hypothesisId === 'string' && hypothesis.hypothesisId.trim()
                ? hypothesis.hypothesisId.trim()
                : `hypothesis-${index + 1}`,
            title: typeof hypothesis.title === 'string' && hypothesis.title.trim()
                ? hypothesis.title.trim()
                : `Hypothesis ${index + 1}`,
            domains: normalizeStringArray(hypothesis.domains),
            expectedImpact: clamp(safeNumber(hypothesis.expectedImpact, 72)),
            novelty: clamp(safeNumber(hypothesis.novelty, 66)),
            falsifiability: clamp(safeNumber(hypothesis.falsifiability, 64)),
            evidenceSupport: clamp(safeNumber(hypothesis.evidenceSupport, 42)),
            resourceNeed: Math.max(1, Math.floor(safeNumber(hypothesis.resourceNeed, 2))),
            budgetNeed: Math.max(1, Math.floor(safeNumber(hypothesis.budgetNeed, 2))),
            risk: clamp(safeNumber(hypothesis.risk, 46))
        }));
}

function normalizeResources(inputPayload) {
    const resources = Array.isArray(inputPayload?.resources)
        ? inputPayload.resources
        : [];

    return resources
        .filter((resource) => resource && typeof resource === 'object')
        .map((resource, index) => ({
            resourceId: typeof resource.resourceId === 'string' && resource.resourceId.trim()
                ? resource.resourceId.trim()
                : `resource-${index + 1}`,
            name: typeof resource.name === 'string' && resource.name.trim()
                ? resource.name.trim()
                : `Resource ${index + 1}`,
            domains: normalizeStringArray(resource.domains),
            capacityUnits: Math.max(1, Math.floor(safeNumber(resource.capacityUnits, 2))),
            quality: clamp(safeNumber(resource.quality, 74)),
            availability: clamp(safeNumber(resource.availability, 70)),
            costEfficiency: clamp(safeNumber(resource.costEfficiency, 68))
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};

    return {
        experimentSlots: Math.max(0, Math.floor(safeNumber(capacity.experimentSlots, 5))),
        budgetUnits: Math.max(0, Math.floor(safeNumber(capacity.budgetUnits, 10))),
        reviewHours: Math.max(0, Math.floor(safeNumber(capacity.reviewHours, 30)))
    };
}

function hypothesisPriority(hypothesis) {
    return clamp(Math.round(
        hypothesis.expectedImpact * 0.3
        + hypothesis.novelty * 0.2
        + hypothesis.falsifiability * 0.18
        + (100 - hypothesis.evidenceSupport) * 0.14
        + (100 - hypothesis.risk) * 0.08
        + clamp(hypothesis.resourceNeed * 4, 0, 10)
    ));
}

function resourceFit(resource, hypothesis) {
    const overlap = resource.domains.length === 0
        ? 0.2
        : resource.domains.filter((domain) => hypothesis.domains.includes(domain)).length / resource.domains.length;

    return clamp(Math.round(
        overlap * 48
        + resource.quality * 0.24
        + resource.availability * 0.2
        + resource.costEfficiency * 0.16
        - Math.abs(resource.capacityUnits - hypothesis.resourceNeed) * 4
    ));
}

function buildMarketplace(hypotheses, resources, capacity) {
    let experimentSlots = capacity.experimentSlots;
    let budgetUnits = capacity.budgetUnits;
    let reviewHours = capacity.reviewHours;

    const prioritized = hypotheses
        .map((hypothesis) => ({
            ...hypothesis,
            priorityScore: hypothesisPriority(hypothesis)
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

    const remainingResourceUnits = new Map(resources.map((resource) => [resource.resourceId, resource.capacityUnits]));
    const market = [];

    for (const hypothesis of prioritized) {
        const rankedResources = resources
            .map((resource) => ({
                resourceId: resource.resourceId,
                name: resource.name,
                fitScore: resourceFit(resource, hypothesis),
                quality: resource.quality,
                availability: resource.availability,
                costEfficiency: resource.costEfficiency,
                domains: [...resource.domains]
            }))
            .sort((a, b) => b.fitScore - a.fitScore);

        let selectedResource = null;
        for (const candidate of rankedResources) {
            const availableUnits = remainingResourceUnits.get(candidate.resourceId) || 0;
            if (experimentSlots <= 0) continue;
            if (hypothesis.budgetNeed > budgetUnits) continue;
            if (hypothesis.resourceNeed > availableUnits) continue;
            selectedResource = {
                ...candidate,
                allocatedUnits: hypothesis.resourceNeed
            };
            remainingResourceUnits.set(candidate.resourceId, availableUnits - hypothesis.resourceNeed);
            experimentSlots -= 1;
            budgetUnits -= hypothesis.budgetNeed;
            break;
        }

        const peerReviewNeed = Math.max(2, Math.round(
            hypothesis.risk * 0.16
            + (100 - hypothesis.falsifiability) * 0.08
        ));
        const peerReviewAllocated = Math.min(reviewHours, peerReviewNeed);
        reviewHours -= peerReviewAllocated;

        const projectedEvidenceGain = selectedResource
            ? clamp(Math.round(
                selectedResource.fitScore * 0.38
                + hypothesis.falsifiability * 0.18
                + peerReviewAllocated * 1.3
            ))
            : clamp(Math.round(peerReviewAllocated * 1.4));

        const marketGap = clamp(Math.round(
            hypothesis.priorityScore * 0.64
            - projectedEvidenceGain * 0.55
            + (selectedResource ? 0 : 22)
            + (peerReviewAllocated < peerReviewNeed ? 10 : 0)
        ));

        let lane = 'now';
        if (!selectedResource || marketGap > 72) lane = 'hold';
        else if (marketGap > 44) lane = 'next';

        market.push({
            hypothesisId: hypothesis.hypothesisId,
            hypothesisTitle: hypothesis.title,
            priorityScore: hypothesis.priorityScore,
            selectedResource,
            risk: hypothesis.risk,
            budgetNeed: hypothesis.budgetNeed,
            peerReviewNeed,
            peerReviewAllocated,
            projectedEvidenceGain,
            marketGap,
            lane
        });
    }

    return {
        market: market.sort((a, b) => {
            const laneRank = { now: 0, next: 1, hold: 2 };
            const laneDiff = laneRank[a.lane] - laneRank[b.lane];
            if (laneDiff !== 0) return laneDiff;
            return b.priorityScore - a.priorityScore;
        }),
        remainingCapacity: {
            experimentSlots,
            budgetUnits,
            reviewHours
        },
        remainingResourceUnits: Object.fromEntries(remainingResourceUnits)
    };
}

function summarizeMarketplace(market, remainingCapacity) {
    const avgMarketGap = market.length > 0
        ? Number((market.reduce((acc, entry) => acc + entry.marketGap, 0) / market.length).toFixed(2))
        : 0;
    const avgEvidenceGain = market.length > 0
        ? Number((market.reduce((acc, entry) => acc + entry.projectedEvidenceGain, 0) / market.length).toFixed(2))
        : 0;

    const laneCounts = market.reduce((acc, entry) => {
        acc[entry.lane] = (acc[entry.lane] || 0) + 1;
        return acc;
    }, { now: 0, next: 0, hold: 0 });

    let posture = 'market_ready';
    if (laneCounts.hold > 0 || avgMarketGap > 60) posture = 'critical';
    else if (laneCounts.next > 0 || avgMarketGap > 42) posture = 'review_required';

    return {
        hypothesisCount: market.length,
        laneCounts,
        avgMarketGap,
        avgEvidenceGain,
        remainingCapacity,
        posture
    };
}

function buildAlerts(summary, market) {
    const alerts = [];
    if (summary.laneCounts.hold > 0) alerts.push('hypothesis_market_hold_queue_present');
    if (summary.avgMarketGap > 55) alerts.push('hypothesis_market_gap_high');
    if (market.some((entry) => !entry.selectedResource)) alerts.push('hypothesis_resource_shortage');
    if (market.some((entry) => entry.peerReviewAllocated < entry.peerReviewNeed)) alerts.push('hypothesis_peer_review_capacity_gap');
    if (market.some((entry) => entry.risk > 74)) alerts.push('hypothesis_high_risk_present');
    return alerts;
}

function buildRecommendations(market, summary, alerts) {
    const recommendations = [];
    for (const entry of market) {
        if (entry.selectedResource && entry.lane === 'now') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'fund_hypothesis_experiment',
                hypothesisId: entry.hypothesisId,
                title: `Fund experiment for ${entry.hypothesisTitle}`,
                description: `Projected evidence gain ${entry.projectedEvidenceGain} with market gap ${entry.marketGap}.`,
                priority: entry.priorityScore >= 80 ? 'P1' : 'P2'
            });
        }
        if (!entry.selectedResource || entry.marketGap > 56) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'allocate_evidence_resource',
                hypothesisId: entry.hypothesisId,
                title: `Allocate evidence resource for ${entry.hypothesisTitle}`,
                description: `Resource allocation needed to close market gap ${entry.marketGap}.`,
                priority: entry.lane === 'hold' ? 'P0' : 'P1'
            });
        }
        if (entry.peerReviewAllocated < entry.peerReviewNeed || entry.risk > 70) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_peer_review',
                hypothesisId: entry.hypothesisId,
                title: `Run peer review for ${entry.hypothesisTitle}`,
                description: `Peer review allocation ${entry.peerReviewAllocated}/${entry.peerReviewNeed} with risk ${entry.risk}.`,
                priority: entry.risk > 75 ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_marketplace_brief',
            title: 'Publish scientific hypothesis marketplace brief',
            description: 'Share lane status, resource constraints, and review posture across hypotheses.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.hypothesisId || '').localeCompare(String(b.hypothesisId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.hypothesisId || '') === String(entry.hypothesisId || '')
        )) === index);
}

export function runScientificHypothesisMarketplace(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const hypotheses = normalizeHypotheses(inputPayload || {});
    const resources = normalizeResources(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const marketplace = buildMarketplace(hypotheses, resources, capacity);
    const summary = summarizeMarketplace(marketplace.market, marketplace.remainingCapacity);
    const alerts = buildAlerts(summary, marketplace.market);
    const recommendations = buildRecommendations(marketplace.market, summary, alerts);

    return {
        at,
        summary,
        market: marketplace.market,
        remainingResourceUnits: marketplace.remainingResourceUnits,
        alerts,
        recommendations
    };
}

export function hypothesisMarketplaceToTasks(reportPayload, {
    fromAgentId = 'agent:hypothesis-marketplace',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('hypothesisMarketplaceToTasks requires report payload');
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
            hypothesisId: recommendation.hypothesisId || null,
            posture: reportPayload.summary?.posture || null,
            holdCount: reportPayload.summary?.laneCounts?.hold || 0
        },
        createdAt: nowMs + index
    }));
}

export class ScientificHypothesisMarketplace {
    constructor({
        localAgentId = 'agent:hypothesis-marketplace',
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
        const report = runScientificHypothesisMarketplace(inputPayload, {
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
        return hypothesisMarketplaceToTasks(reportPayload, {
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

export const __scientificHypothesisMarketplaceInternals = {
    normalizeHypotheses,
    normalizeResources,
    buildMarketplace,
    summarizeMarketplace,
    buildRecommendations
};
