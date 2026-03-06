import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    verify_low_trust_claim: 'agent:analysis',
    resolve_contradictory_evidence: 'agent:review',
    strengthen_source_coverage: 'agent:research'
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

function normalizeClaims(inputPayload) {
    const entries = Array.isArray(inputPayload?.claims)
        ? inputPayload.claims
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `claim-${index + 1}`,
        statement: typeof entry?.statement === 'string' && entry.statement.trim()
            ? entry.statement.trim()
            : `Claim ${index + 1}`,
        sourceId: typeof entry?.sourceId === 'string' && entry.sourceId.trim()
            ? entry.sourceId.trim()
            : `source-${index + 1}`,
        sourceType: typeof entry?.sourceType === 'string' && entry.sourceType.trim()
            ? entry.sourceType.trim().toLowerCase()
            : 'unknown',
        confidence: clamp(safeNumber(entry?.confidence, 55)),
        evidenceIds: Array.isArray(entry?.evidenceIds)
            ? entry.evidenceIds.filter((id) => typeof id === 'string')
            : [],
        derivedFromClaimIds: Array.isArray(entry?.derivedFromClaimIds)
            ? entry.derivedFromClaimIds.filter((id) => typeof id === 'string')
            : [],
        timestamp: Number.isFinite(Number(entry?.timestamp))
            ? Number(entry.timestamp)
            : Date.now()
    }));
}

function normalizeEvidence(inputPayload) {
    const entries = Array.isArray(inputPayload?.evidence)
        ? inputPayload.evidence
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `evidence-${index + 1}`,
        label: typeof entry?.label === 'string' && entry.label.trim()
            ? entry.label.trim()
            : `Evidence ${index + 1}`,
        type: typeof entry?.type === 'string' && entry.type.trim()
            ? entry.type.trim().toLowerCase()
            : 'unknown',
        sourceId: typeof entry?.sourceId === 'string' && entry.sourceId.trim()
            ? entry.sourceId.trim()
            : `source-${index + 1}`,
        reliabilityScore: clamp(safeNumber(entry?.reliabilityScore, 55)),
        supportsClaimIds: Array.isArray(entry?.supportsClaimIds)
            ? entry.supportsClaimIds.filter((id) => typeof id === 'string')
            : [],
        contradictsClaimIds: Array.isArray(entry?.contradictsClaimIds)
            ? entry.contradictsClaimIds.filter((id) => typeof id === 'string')
            : [],
        timestamp: Number.isFinite(Number(entry?.timestamp))
            ? Number(entry.timestamp)
            : Date.now()
    }));
}

function buildGraph(claims, evidence) {
    const nodes = [];
    const edges = [];

    for (const claim of claims) {
        nodes.push({
            id: claim.id,
            kind: 'claim',
            label: claim.statement
        });
        for (const parentId of claim.derivedFromClaimIds) {
            edges.push({
                id: `edge-${randomUUID().slice(0, 8)}`,
                from: claim.id,
                to: parentId,
                relation: 'derived_from'
            });
        }
    }

    for (const piece of evidence) {
        nodes.push({
            id: piece.id,
            kind: 'evidence',
            label: piece.label
        });
        for (const claimId of piece.supportsClaimIds) {
            edges.push({
                id: `edge-${randomUUID().slice(0, 8)}`,
                from: piece.id,
                to: claimId,
                relation: 'supports'
            });
        }
        for (const claimId of piece.contradictsClaimIds) {
            edges.push({
                id: `edge-${randomUUID().slice(0, 8)}`,
                from: piece.id,
                to: claimId,
                relation: 'contradicts'
            });
        }
    }

    return {
        nodes,
        edges
    };
}

function claimMetrics(claim, evidenceById, claimsById) {
    const evidenceItems = claim.evidenceIds
        .map((id) => evidenceById.get(id))
        .filter(Boolean);

    let supportScore = 0;
    let contradictionScore = 0;
    for (const item of evidenceItems) {
        if (item.supportsClaimIds.includes(claim.id)) {
            supportScore += item.reliabilityScore * 0.72;
        }
        if (item.contradictsClaimIds.includes(claim.id)) {
            contradictionScore += item.reliabilityScore * 0.74;
        }
    }

    const derivationPenalty = claim.derivedFromClaimIds.length * 3.2;
    const parentTrustInfluence = claim.derivedFromClaimIds
        .map((id) => claimsById.get(id))
        .filter(Boolean)
        .reduce((acc, parent) => acc + safeNumber(parent._trustScoreSeed, 50), 0);
    const parentTrustBonus = claim.derivedFromClaimIds.length > 0
        ? (parentTrustInfluence / claim.derivedFromClaimIds.length - 50) * 0.35
        : 0;

    const trustScore = clamp(Math.round(
        claim.confidence * 0.45
        + supportScore * 0.42
        - contradictionScore * 0.46
        + parentTrustBonus
        - derivationPenalty
    ));

    return {
        trustScore,
        supportScore: Number(supportScore.toFixed(2)),
        contradictionScore: Number(contradictionScore.toFixed(2)),
        evidenceCount: evidenceItems.length
    };
}

function evaluateClaims(claims, evidence) {
    const claimsById = new Map(claims.map((claim) => [claim.id, { ...claim, _trustScoreSeed: claim.confidence }]));
    const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));

    const evaluated = [];
    for (let pass = 0; pass < 2; pass++) {
        evaluated.length = 0;
        for (const claim of claims) {
            const metrics = claimMetrics(claim, evidenceById, claimsById);
            const tier = metrics.trustScore >= 75
                ? 'trusted'
                : metrics.trustScore >= 50
                    ? 'needs_validation'
                    : 'low_trust';

            const evaluatedClaim = {
                ...claim,
                ...metrics,
                trustTier: tier
            };
            evaluated.push(evaluatedClaim);
            const record = claimsById.get(claim.id);
            if (record) {
                record._trustScoreSeed = metrics.trustScore;
            }
        }
    }

    return evaluated.sort((a, b) => a.trustScore - b.trustScore);
}

function lineageForClaim(claimId, evaluatedClaims, graph) {
    const claimMap = new Map(evaluatedClaims.map((claim) => [claim.id, claim]));
    const outgoing = graph.edges.filter((edge) => edge.to === claimId || edge.from === claimId);

    return {
        claimId,
        claim: claimMap.get(claimId) || null,
        relations: outgoing.map((edge) => clone(edge))
    };
}

function buildAlerts(evaluatedClaims) {
    const alerts = [];
    if (evaluatedClaims.some((claim) => claim.trustTier === 'low_trust')) {
        alerts.push('low_trust_claim_detected');
    }
    if (evaluatedClaims.some((claim) => claim.contradictionScore >= 35)) {
        alerts.push('claim_contradiction_detected');
    }
    if (evaluatedClaims.filter((claim) => claim.trustTier === 'needs_validation').length >= 3) {
        alerts.push('validation_backlog_high');
    }
    return alerts;
}

function buildRecommendations(evaluatedClaims, alerts) {
    const recommendations = [];
    const lowTrust = evaluatedClaims.filter((claim) => claim.trustTier === 'low_trust').slice(0, 4);
    const contradictory = evaluatedClaims.filter((claim) => claim.contradictionScore >= 35).slice(0, 4);
    const weakCoverage = evaluatedClaims.filter((claim) => claim.evidenceCount === 0).slice(0, 4);

    for (const claim of lowTrust) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'verify_low_trust_claim',
            claimId: claim.id,
            title: `Verify low-trust claim ${claim.id}`,
            description: `Claim trust score is ${claim.trustScore} with limited reliable support.`,
            priority: claim.trustScore < 30 ? 'P0' : 'P1'
        });
    }

    for (const claim of contradictory) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'resolve_contradictory_evidence',
            claimId: claim.id,
            title: `Resolve contradictory evidence for claim ${claim.id}`,
            description: `Contradiction score ${claim.contradictionScore} indicates conflicting evidence.`,
            priority: 'P1'
        });
    }

    for (const claim of weakCoverage) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'strengthen_source_coverage',
            claimId: claim.id,
            title: `Strengthen evidence coverage for claim ${claim.id}`,
            description: 'Claim has no attached evidence and needs source expansion.',
            priority: 'P2'
        });
    }

    if (alerts.includes('validation_backlog_high')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'strengthen_source_coverage',
            title: 'Reduce claim validation backlog',
            description: 'Multiple claims require validation; increase verification capacity.',
            priority: 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.claimId || '').localeCompare(String(b.claimId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.claimId || '') === String(entry.claimId || '')
        )) === index);
}

export function buildEvidenceProvenanceGraph(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const claims = normalizeClaims(inputPayload || {});
    const evidence = normalizeEvidence(inputPayload || {});
    const graph = buildGraph(claims, evidence);
    const evaluatedClaims = evaluateClaims(claims, evidence);
    const alerts = buildAlerts(evaluatedClaims);
    const recommendations = buildRecommendations(evaluatedClaims, alerts);
    const avgTrustScore = evaluatedClaims.length > 0
        ? Number((evaluatedClaims.reduce((acc, claim) => acc + claim.trustScore, 0) / evaluatedClaims.length).toFixed(2))
        : 0;

    return {
        at,
        graph,
        claims: evaluatedClaims.map((claim) => clone(claim)),
        evidence: evidence.map((entry) => clone(entry)),
        summary: {
            claimCount: claims.length,
            evidenceCount: evidence.length,
            avgTrustScore,
            lowTrustCount: evaluatedClaims.filter((claim) => claim.trustTier === 'low_trust').length,
            contradictionCount: evaluatedClaims.filter((claim) => claim.contradictionScore >= 35).length
        },
        alerts,
        recommendations
    };
}

export function provenanceClaimLineage(reportPayload, claimId) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('provenanceClaimLineage requires report payload');
    }
    if (typeof claimId !== 'string' || claimId.trim().length === 0) {
        throw new Error('provenanceClaimLineage requires claimId');
    }
    const claims = Array.isArray(reportPayload.claims) ? reportPayload.claims : [];
    const graph = reportPayload.graph && typeof reportPayload.graph === 'object'
        ? reportPayload.graph
        : { nodes: [], edges: [] };
    return lineageForClaim(claimId, claims, graph);
}

export function provenanceRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:provenance',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('provenanceRecommendationsToTasks requires report payload');
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
            claimId: recommendation.claimId || null,
            lowTrustCount: reportPayload.summary?.lowTrustCount ?? 0
        },
        createdAt: nowMs + index
    }));
}

export class EvidenceProvenanceGraph {
    constructor({
        localAgentId = 'agent:provenance',
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
        const report = buildEvidenceProvenanceGraph(inputPayload, {
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
        return provenanceRecommendationsToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    claimLineage(reportPayload, claimId) {
        return provenanceClaimLineage(reportPayload, claimId);
    }

    listHistory({ limit = 20 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 20))
            .map((entry) => clone(entry));
    }
}

export const __evidenceProvenanceInternals = {
    normalizeClaims,
    normalizeEvidence,
    buildGraph,
    evaluateClaims,
    lineageForClaim,
    buildAlerts,
    buildRecommendations
};
