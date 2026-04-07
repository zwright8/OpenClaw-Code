import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    run_drift_correction_checkpoint: 'agent:strategy',
    rebalance_objective_weights: 'agent:planning',
    publish_drift_correction_brief: 'agent:ops'
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

function normalizeObjectives(inputPayload) {
    const source = Array.isArray(inputPayload?.baselineObjectives)
        ? inputPayload.baselineObjectives
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            objectiveId: typeof entry.objectiveId === 'string' && entry.objectiveId.trim()
                ? entry.objectiveId.trim()
                : `objective-${index + 1}`,
            title: typeof entry.title === 'string' && entry.title.trim()
                ? entry.title.trim().toLowerCase()
                : `objective ${index + 1}`,
            weight: clamp(safeNumber(entry.weight, 60))
        }));
}

function normalizeDecisions(inputPayload) {
    const source = Array.isArray(inputPayload?.recentDecisions)
        ? inputPayload.recentDecisions
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            decisionId: typeof entry.decisionId === 'string' && entry.decisionId.trim()
                ? entry.decisionId.trim()
                : `decision-${index + 1}`,
            summary: typeof entry.summary === 'string' && entry.summary.trim()
                ? entry.summary.trim().toLowerCase()
                : '',
            strategicNovelty: clamp(safeNumber(entry.strategicNovelty, 48)),
            executionPressure: clamp(safeNumber(entry.executionPressure, 52)),
            riskScore: clamp(safeNumber(entry.riskScore, 40))
        }));
}

function objectiveAlignment(decision, objectives) {
    if (objectives.length === 0) {
        return {
            alignmentScore: 50,
            matchedObjectiveIds: []
        };
    }

    const matchedObjectiveIds = [];
    let weightedHits = 0;
    let totalWeights = 0;

    for (const objective of objectives) {
        const weight = Math.max(1, objective.weight);
        totalWeights += weight;

        if (decision.summary.includes(objective.title)) {
            weightedHits += weight;
            matchedObjectiveIds.push(objective.objectiveId);
        }
    }

    const hitScore = totalWeights > 0 ? (weightedHits / totalWeights) * 100 : 0;
    const driftPenalty = clamp(Math.round(
        decision.strategicNovelty * 0.28
        + decision.executionPressure * 0.24
        + decision.riskScore * 0.18
    ));

    const alignmentScore = clamp(Math.round(
        hitScore * 0.7
        + (100 - driftPenalty) * 0.3
    ));

    return {
        alignmentScore,
        matchedObjectiveIds
    };
}

function evaluateDrift(objectives, decisions) {
    return decisions.map((decision) => {
        const alignment = objectiveAlignment(decision, objectives);
        const driftScore = clamp(Math.round(
            (100 - alignment.alignmentScore) * 0.62
            + decision.strategicNovelty * 0.2
            + decision.executionPressure * 0.18
        ));

        return {
            decisionId: decision.decisionId,
            summary: decision.summary,
            alignmentScore: alignment.alignmentScore,
            driftScore,
            matchedObjectiveIds: alignment.matchedObjectiveIds,
            strategicNovelty: decision.strategicNovelty,
            executionPressure: decision.executionPressure,
            riskScore: decision.riskScore,
            outOfBounds: driftScore >= 65 || alignment.alignmentScore < 45
        };
    }).sort((a, b) => b.driftScore - a.driftScore);
}

function summarizeEvaluations(evaluations) {
    const avgDriftScore = evaluations.length > 0
        ? Number((evaluations.reduce((acc, entry) => acc + entry.driftScore, 0) / evaluations.length).toFixed(2))
        : 0;
    const outOfBoundsCount = evaluations.filter((entry) => entry.outOfBounds).length;
    const lowAlignmentCount = evaluations.filter((entry) => entry.alignmentScore < 50).length;

    let posture = 'aligned';
    if (outOfBoundsCount > 0 || avgDriftScore >= 58) posture = 'watch';
    if (avgDriftScore >= 72 || lowAlignmentCount >= Math.ceil(Math.max(1, evaluations.length * 0.4))) {
        posture = 'critical';
    }

    return {
        decisionCount: evaluations.length,
        avgDriftScore,
        outOfBoundsCount,
        lowAlignmentCount,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.outOfBoundsCount > 0) alerts.push('strategic_drift_out_of_bounds');
    if (summary.lowAlignmentCount > 0) alerts.push('objective_alignment_drop');
    if (summary.avgDriftScore >= 70) alerts.push('strategic_drift_high');
    return alerts;
}

function buildRecommendations(evaluations, summary, alerts) {
    const recommendations = [];

    for (const entry of evaluations.slice(0, 5)) {
        if (entry.outOfBounds) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_drift_correction_checkpoint',
                decisionId: entry.decisionId,
                title: `Run drift checkpoint for ${entry.decisionId}`,
                description: `Drift score ${entry.driftScore} with alignment ${entry.alignmentScore}.`,
                priority: entry.driftScore >= 75 ? 'P1' : 'P2'
            });
        }

        if (entry.alignmentScore < 55) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'rebalance_objective_weights',
                decisionId: entry.decisionId,
                title: `Rebalance objectives for ${entry.decisionId}`,
                description: `Low alignment detected across mapped objective set.`,
                priority: entry.driftScore >= 70 ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_drift_correction_brief',
            title: 'Publish cognitive drift correction brief',
            description: 'Share drift trends, alignment gaps, and correction checkpoints.',
            priority: summary.posture === 'critical' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.decisionId || '').localeCompare(String(b.decisionId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.decisionId || '') === String(entry.decisionId || '')
        )) === index);
}

export function correctCognitiveDrift(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const objectives = normalizeObjectives(inputPayload || {});
    const decisions = normalizeDecisions(inputPayload || {});
    const evaluations = evaluateDrift(objectives, decisions);
    const summary = summarizeEvaluations(evaluations);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(evaluations, summary, alerts);

    return {
        at,
        summary,
        evaluations,
        alerts,
        recommendations
    };
}

export function cognitiveDriftToTasks(reportPayload, {
    fromAgentId = 'agent:drift-corrector',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('cognitiveDriftToTasks requires report payload');
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
            decisionId: recommendation.decisionId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class CognitiveDriftCorrector {
    constructor({
        localAgentId = 'agent:drift-corrector',
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
        const report = correctCognitiveDrift(inputPayload, {
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
        return cognitiveDriftToTasks(reportPayload, {
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

export const __cognitiveDriftCorrectorInternals = {
    normalizeObjectives,
    normalizeDecisions,
    objectiveAlignment,
    evaluateDrift,
    summarizeEvaluations
};
