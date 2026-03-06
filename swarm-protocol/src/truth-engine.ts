import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationPriorityToTaskPriority = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const RecommendationTargetMap = {
    gather_evidence: 'agent:analysis',
    run_experiment: 'agent:research',
    falsify_hypothesis: 'agent:research'
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

function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

function normalizeStringList(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function normalizeHypothesis(hypothesisPayload, index) {
    const payload = hypothesisPayload && typeof hypothesisPayload === 'object'
        ? hypothesisPayload
        : {};
    const prior = clamp(safeNumber(payload.priorConfidence, 0.5));

    return {
        id: payload.id || `hypothesis-${index + 1}`,
        statement: payload.statement || `Hypothesis ${index + 1}`,
        priorConfidence: prior,
        supportSignals: normalizeStringList(payload.supportSignals),
        contradictSignals: normalizeStringList(payload.contradictSignals),
        owner: payload.owner || null,
        criticality: payload.criticality || 'normal'
    };
}

function evidenceStrengthFromPriority(priority) {
    const normalized = typeof priority === 'string' ? priority.trim().toUpperCase() : 'P2';
    if (normalized === 'P0') return 0.95;
    if (normalized === 'P1') return 0.8;
    if (normalized === 'P2') return 0.55;
    return 0.35;
}

function normalizeEvidenceSignals(inputPayload) {
    const explicitSignals = Array.isArray(inputPayload?.evidenceSignals)
        ? inputPayload.evidenceSignals
        : [];
    const signals = explicitSignals.map((signal, index) => ({
        id: signal?.id || `signal-explicit-${index + 1}`,
        code: signal?.code || signal?.type || 'signal',
        strength: clamp(safeNumber(signal?.strength, 0.5)),
        source: signal?.source || 'explicit'
    }));

    const readiness = inputPayload?.readinessReport;
    if (readiness?.status === 'blocked') {
        signals.push({
            id: `signal-readiness-blocked`,
            code: 'readiness_blocked',
            strength: 0.9,
            source: 'readiness'
        });
    } else if (readiness?.status === 'needs_attention') {
        signals.push({
            id: `signal-readiness-attention`,
            code: 'readiness_attention',
            strength: 0.65,
            source: 'readiness'
        });
    } else if (readiness?.status === 'ready') {
        signals.push({
            id: `signal-readiness-ready`,
            code: 'readiness_ready',
            strength: 0.6,
            source: 'readiness'
        });
    }

    const driftAlerts = Array.isArray(inputPayload?.driftReport?.alerts)
        ? inputPayload.driftReport.alerts
        : (Array.isArray(inputPayload?.driftAlerts) ? inputPayload.driftAlerts : []);
    for (let i = 0; i < driftAlerts.length; i++) {
        const alert = driftAlerts[i];
        signals.push({
            id: alert?.id || `signal-drift-${i + 1}`,
            code: alert?.code || 'drift_alert',
            strength: evidenceStrengthFromPriority(alert?.priority),
            source: 'drift'
        });
    }

    const incidents = Array.isArray(inputPayload?.incidents)
        ? inputPayload.incidents
        : [];
    for (let i = 0; i < incidents.length; i++) {
        const incident = incidents[i];
        signals.push({
            id: incident?.id || `signal-incident-${i + 1}`,
            code: incident?.code || 'incident',
            strength: evidenceStrengthFromPriority(incident?.priority),
            source: 'incident'
        });
    }

    const governorReasons = Array.isArray(inputPayload?.governorDecision?.reasons)
        ? inputPayload.governorDecision.reasons
        : [];
    for (let i = 0; i < governorReasons.length; i++) {
        const reason = governorReasons[i];
        signals.push({
            id: reason?.id || `signal-governor-${i + 1}`,
            code: reason?.code || 'governor_reason',
            strength: clamp(safeNumber(reason?.weight, 5) / 20),
            source: 'governor'
        });
    }

    return signals;
}

function scoreHypothesis(hypothesis, evidenceSignals) {
    let supportScore = 0;
    let contradictScore = 0;
    const matchedSupport = [];
    const matchedContradictions = [];

    for (const signal of evidenceSignals) {
        if (hypothesis.supportSignals.includes(signal.code)) {
            supportScore += signal.strength;
            matchedSupport.push(signal.code);
        }

        if (hypothesis.contradictSignals.includes(signal.code)) {
            contradictScore += signal.strength;
            matchedContradictions.push(signal.code);
        }
    }

    const supportDelta = supportScore * 0.22;
    const contradictionDelta = contradictScore * 0.28;
    const posterior = clamp(hypothesis.priorConfidence + supportDelta - contradictionDelta);
    const delta = Number((posterior - hypothesis.priorConfidence).toFixed(4));

    let status = 'uncertain';
    if (posterior >= 0.75) status = 'supported';
    else if (posterior < 0.35) status = 'unlikely';

    return {
        posteriorConfidence: Number(posterior.toFixed(4)),
        confidenceDelta: delta,
        supportScore: Number(supportScore.toFixed(4)),
        contradictionScore: Number(contradictScore.toFixed(4)),
        matchedSupport,
        matchedContradictions,
        status
    };
}

function recommendationPriority(hypothesisResult) {
    if (hypothesisResult.criticality === 'critical') return 'P1';
    if (hypothesisResult.status === 'unlikely') return 'P1';
    return 'P2';
}

function buildRecommendations(results) {
    const recommendations = [];
    for (const row of results) {
        if (row.status === 'uncertain') {
            recommendations.push({
                id: `rec-${randomUUID().slice(0, 8)}`,
                type: 'gather_evidence',
                hypothesisId: row.id,
                title: `Gather more evidence for ${row.id}`,
                description: `Confidence remains uncertain at ${row.posteriorConfidence}.`,
                priority: recommendationPriority(row)
            });
        }

        if (row.status === 'unlikely') {
            recommendations.push({
                id: `rec-${randomUUID().slice(0, 8)}`,
                type: 'falsify_hypothesis',
                hypothesisId: row.id,
                title: `Falsify or replace ${row.id}`,
                description: `Confidence dropped to ${row.posteriorConfidence}; challenge assumptions and test alternatives.`,
                priority: recommendationPriority(row)
            });
        }

        if (row.status === 'supported' && row.criticality === 'critical') {
            recommendations.push({
                id: `rec-${randomUUID().slice(0, 8)}`,
                type: 'run_experiment',
                hypothesisId: row.id,
                title: `Run confirming experiment for ${row.id}`,
                description: `High-confidence critical hypothesis should be validated before scaling action.`,
                priority: 'P2'
            });
        }
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.hypothesisId).localeCompare(String(b.hypothesisId));
    });
}

export function evaluateTruthHypotheses(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const hypotheses = Array.isArray(inputPayload?.hypotheses)
        ? inputPayload.hypotheses.map((hypothesis, index) => normalizeHypothesis(hypothesis, index))
        : [];
    const evidenceSignals = normalizeEvidenceSignals(inputPayload || {});

    const results = hypotheses.map((hypothesis) => {
        const scored = scoreHypothesis(hypothesis, evidenceSignals);
        return {
            ...hypothesis,
            ...scored
        };
    }).sort((a, b) => b.posteriorConfidence - a.posteriorConfidence);

    const recommendations = buildRecommendations(results);
    const avgConfidence = results.length > 0
        ? Number((results.reduce((acc, row) => acc + row.posteriorConfidence, 0) / results.length).toFixed(4))
        : 0;

    return {
        at,
        summary: {
            hypothesisCount: results.length,
            evidenceCount: evidenceSignals.length,
            avgConfidence,
            supportedCount: results.filter((row) => row.status === 'supported').length,
            uncertainCount: results.filter((row) => row.status === 'uncertain').length,
            unlikelyCount: results.filter((row) => row.status === 'unlikely').length
        },
        evidenceSignals,
        results,
        recommendations
    };
}

export function truthRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:truth-engine',
    defaultTarget = 'agent:analysis',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('truthRecommendationsToTasks requires report payload');
    }

    const recommendations = Array.isArray(reportPayload.recommendations)
        ? reportPayload.recommendations
        : [];
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };
    const at = safeNow(Date.now);

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityToTaskPriority[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            hypothesisId: recommendation.hypothesisId,
            recommendationType: recommendation.type,
            description: recommendation.description
        },
        createdAt: at + index
    }));
}

export class TruthSeekingEngine {
    constructor({
        localAgentId = 'agent:truth-engine',
        now = Date.now,
        maxHistory = 180
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 180;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = evaluateTruthHypotheses(inputPayload, {
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
        return truthRecommendationsToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 30 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 30))
            .map((entry) => clone(entry));
    }
}

export const __truthEngineInternals = {
    normalizeHypothesis,
    normalizeEvidenceSignals,
    scoreHypothesis,
    buildRecommendations
};
