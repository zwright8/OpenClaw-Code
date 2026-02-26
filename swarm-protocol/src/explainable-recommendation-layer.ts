import { createHash, randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    backfill_recommendation_evidence: 'agent:analysis',
    open_recommendation_audit: 'agent:governance',
    publish_recommendation_explanation: 'agent:ops'
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

function normalizeArray(value) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim());
}

function normalizeRecommendations(inputPayload) {
    const source = Array.isArray(inputPayload?.recommendations)
        ? inputPayload.recommendations
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => {
            const reasons = Array.isArray(entry.reasons)
                ? entry.reasons
                    .filter((reason) => reason && typeof reason === 'object')
                    .map((reason, reasonIndex) => ({
                        id: typeof reason.id === 'string' && reason.id.trim()
                            ? reason.id.trim()
                            : `reason-${index + 1}-${reasonIndex + 1}`,
                        label: typeof reason.label === 'string' && reason.label.trim()
                            ? reason.label.trim()
                            : `Reason ${reasonIndex + 1}`,
                        evidence: typeof reason.evidence === 'string' && reason.evidence.trim()
                            ? reason.evidence.trim()
                            : '',
                        weight: clamp(safeNumber(reason.weight, 55))
                    }))
                : [];

            return {
                recommendationId: typeof entry.recommendationId === 'string' && entry.recommendationId.trim()
                    ? entry.recommendationId.trim()
                    : `recommendation-${index + 1}`,
                title: typeof entry.title === 'string' && entry.title.trim()
                    ? entry.title.trim()
                    : `Recommendation ${index + 1}`,
                category: typeof entry.category === 'string' && entry.category.trim()
                    ? entry.category.trim()
                    : 'general',
                confidence: clamp(safeNumber(entry.confidence, 62)),
                impactScore: clamp(safeNumber(entry.impactScore, 58)),
                riskScore: clamp(safeNumber(entry.riskScore, 36)),
                reasons,
                evidenceRefs: normalizeArray(entry.evidenceRefs),
                sourceSystems: normalizeArray(entry.sourceSystems)
            };
        });
}

function reasonCoverageScore(recommendation) {
    if (recommendation.reasons.length === 0) return 0;

    const weighted = recommendation.reasons.reduce((acc, reason) => {
        const evidenceBonus = reason.evidence.length > 0 ? 16 : 0;
        return acc + clamp(reason.weight * 0.7 + evidenceBonus);
    }, 0);

    return clamp(Math.round(weighted / recommendation.reasons.length));
}

function evidenceCoverageScore(recommendation) {
    const reasonCount = recommendation.reasons.length;
    const evidenceCount = recommendation.evidenceRefs.length;
    const sourceCount = recommendation.sourceSystems.length;

    const ratio = reasonCount > 0
        ? evidenceCount / reasonCount
        : (evidenceCount > 0 ? 1 : 0);

    return clamp(Math.round(
        ratio * 62
        + Math.min(18, sourceCount * 4)
        + (evidenceCount > 0 ? 20 : 0)
    ));
}

function buildAuditFingerprint(recommendation) {
    const payload = {
        recommendationId: recommendation.recommendationId,
        title: recommendation.title,
        confidence: recommendation.confidence,
        impactScore: recommendation.impactScore,
        riskScore: recommendation.riskScore,
        reasons: recommendation.reasons.map((reason) => ({
            id: reason.id,
            label: reason.label,
            evidence: reason.evidence,
            weight: reason.weight
        })),
        evidenceRefs: [...recommendation.evidenceRefs].sort(),
        sourceSystems: [...recommendation.sourceSystems].sort()
    };

    return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

function evaluateTransparency(recommendations) {
    return recommendations.map((recommendation) => {
        const reasonScore = reasonCoverageScore(recommendation);
        const evidenceScore = evidenceCoverageScore(recommendation);
        const auditabilityScore = clamp(Math.round(
            reasonScore * 0.44
            + evidenceScore * 0.36
            + recommendation.confidence * 0.12
            + (100 - recommendation.riskScore) * 0.08
        ));

        return {
            recommendationId: recommendation.recommendationId,
            title: recommendation.title,
            category: recommendation.category,
            confidence: recommendation.confidence,
            impactScore: recommendation.impactScore,
            riskScore: recommendation.riskScore,
            reasonCoverageScore: reasonScore,
            evidenceCoverageScore: evidenceScore,
            auditabilityScore,
            auditFingerprint: buildAuditFingerprint(recommendation),
            opaque: auditabilityScore < 58 || reasonScore < 45 || evidenceScore < 40,
            recommendation
        };
    }).sort((a, b) => {
        if (Number(b.opaque) !== Number(a.opaque)) {
            return Number(b.opaque) - Number(a.opaque);
        }
        return b.auditabilityScore - a.auditabilityScore;
    });
}

function summarizeEvaluations(evaluations) {
    const avgAuditabilityScore = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.auditabilityScore, 0) / evaluations.length).toFixed(2))
        : 0;
    const opaqueCount = evaluations.filter((entry) => entry.opaque).length;
    const highRiskOpaqueCount = evaluations.filter((entry) => entry.opaque && entry.riskScore >= 65).length;

    let posture = 'transparent';
    if (highRiskOpaqueCount > 0 || avgAuditabilityScore < 55) posture = 'critical';
    else if (opaqueCount > 0 || avgAuditabilityScore < 70) posture = 'review_required';

    return {
        recommendationCount: evaluations.length,
        avgAuditabilityScore,
        opaqueCount,
        highRiskOpaqueCount,
        posture
    };
}

function buildAlerts(summary, evaluations) {
    const alerts = [];
    if (summary.opaqueCount > 0) alerts.push('opaque_recommendations_present');
    if (summary.highRiskOpaqueCount > 0) alerts.push('high_risk_opaque_recommendations');
    if (evaluations.some((entry) => entry.evidenceCoverageScore < 45)) alerts.push('recommendation_evidence_gaps');
    if (evaluations.some((entry) => entry.reasonCoverageScore < 45)) alerts.push('recommendation_reasoning_gaps');
    return alerts;
}

function buildRecommendations(summary, evaluations, alerts) {
    const recommendations = [];

    for (const entry of evaluations) {
        if (entry.evidenceCoverageScore < 50) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'backfill_recommendation_evidence',
                recommendationId: entry.recommendationId,
                title: `Backfill evidence for ${entry.title}`,
                description: `Evidence coverage score ${entry.evidenceCoverageScore} is below threshold.`,
                priority: entry.riskScore >= 65 ? 'P1' : 'P2'
            });
        }

        if (entry.opaque) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'open_recommendation_audit',
                recommendationId: entry.recommendationId,
                title: `Open audit for ${entry.title}`,
                description: `Auditability score ${entry.auditabilityScore} indicates low transparency.`,
                priority: entry.riskScore >= 70 ? 'P0' : 'P1'
            });
        }
    }

    if (alerts.length > 0 || summary.posture !== 'transparent') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_recommendation_explanation',
            title: 'Publish recommendation explainability bundle',
            description: 'Share audit fingerprints, ranked reasons, and evidence references with operators.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.recommendationId || '').localeCompare(String(b.recommendationId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.recommendationId || '') === String(entry.recommendationId || '')
        )) === index);
}

export function buildExplainableRecommendationLayer(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const sourceRecommendations = normalizeRecommendations(inputPayload || {});
    const evaluations = evaluateTransparency(sourceRecommendations);
    const summary = summarizeEvaluations(evaluations);
    const alerts = buildAlerts(summary, evaluations);
    const recommendations = buildRecommendations(summary, evaluations, alerts);

    return {
        at,
        summary,
        evaluations,
        alerts,
        recommendations
    };
}

export function explainableRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:recommendation-explainability',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('explainableRecommendationsToTasks requires report payload');
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
            recommendationId: recommendation.recommendationId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class ExplainableRecommendationLayer {
    constructor({
        localAgentId = 'agent:recommendation-explainability',
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
        const report = buildExplainableRecommendationLayer(inputPayload, {
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
        return explainableRecommendationsToTasks(reportPayload, {
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

export const __explainableRecommendationLayerInternals = {
    normalizeRecommendations,
    evaluateTransparency,
    summarizeEvaluations,
    buildRecommendations
};
