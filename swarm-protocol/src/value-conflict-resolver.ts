import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    adopt_balanced_action: 'agent:policy',
    mediate_value_conflict: 'agent:review',
    gather_missing_value_signal: 'agent:analysis'
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
    const entries = Array.isArray(inputPayload?.objectives)
        ? inputPayload.objectives
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `objective-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Objective ${index + 1}`,
        weight: clamp(safeNumber(entry?.weight, 25), 0, 100),
        currentScore: clamp(safeNumber(entry?.currentScore, 55)),
        minimumThreshold: clamp(safeNumber(entry?.minimumThreshold, 45)),
        volatility: clamp(safeNumber(entry?.volatility, 20))
    }));
}

function normalizeActions(inputPayload) {
    const entries = Array.isArray(inputPayload?.actions)
        ? inputPayload.actions
        : [];
    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `action-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Action ${index + 1}`,
        effects: entry?.effects && typeof entry.effects === 'object'
            ? entry.effects
            : {},
        riskScore: clamp(safeNumber(entry?.riskScore, 25)),
        costScore: clamp(safeNumber(entry?.costScore, 35)),
        reversibility: clamp(safeNumber(entry?.reversibility, 50))
    }));
}

function normalizeObjectiveWeights(objectives) {
    const total = objectives.reduce((acc, objective) => acc + objective.weight, 0);
    if (total <= 0) {
        const equalWeight = objectives.length > 0 ? 1 / objectives.length : 0;
        return new Map(objectives.map((objective) => [objective.id, equalWeight]));
    }
    return new Map(objectives.map((objective) => [objective.id, objective.weight / total]));
}

function objectiveConflictMatrix(objectives) {
    const matrix = [];
    for (let i = 0; i < objectives.length; i++) {
        for (let j = i + 1; j < objectives.length; j++) {
            const left = objectives[i];
            const right = objectives[j];
            const scoreGap = Math.abs(left.currentScore - right.currentScore);
            const thresholdGap = Math.abs(left.minimumThreshold - right.minimumThreshold);
            const volatilityPressure = (left.volatility + right.volatility) / 2;
            const conflictScore = clamp(Math.round(
                scoreGap * 0.42
                + thresholdGap * 0.26
                + volatilityPressure * 0.32
            ));
            matrix.push({
                id: `conflict-${randomUUID().slice(0, 8)}`,
                leftObjectiveId: left.id,
                rightObjectiveId: right.id,
                leftObjectiveName: left.name,
                rightObjectiveName: right.name,
                conflictScore
            });
        }
    }
    return matrix.sort((a, b) => b.conflictScore - a.conflictScore);
}

function evaluateAction(action, objectives, weightMap) {
    let weightedUtility = 0;
    let thresholdViolations = 0;
    const objectiveEffects = [];

    for (const objective of objectives) {
        const effectDelta = safeNumber(action.effects[objective.id], 0);
        const projected = clamp(objective.currentScore + effectDelta);
        const belowThreshold = projected < objective.minimumThreshold;
        if (belowThreshold) thresholdViolations++;
        const objectiveWeight = weightMap.get(objective.id) || 0;
        weightedUtility += projected * objectiveWeight;
        objectiveEffects.push({
            objectiveId: objective.id,
            objectiveName: objective.name,
            currentScore: objective.currentScore,
            projectedScore: projected,
            delta: Number(effectDelta.toFixed(2)),
            belowThreshold
        });
    }

    const fairnessPenalty = thresholdViolations * 14;
    const utilityScore = clamp(Math.round(
        weightedUtility
        - action.riskScore * 0.24
        - action.costScore * 0.18
        + action.reversibility * 0.12
        - fairnessPenalty
    ));

    const conflictPressure = clamp(Math.round(
        thresholdViolations * 24
        + action.riskScore * 0.36
        + (100 - action.reversibility) * 0.16
    ));

    return {
        actionId: action.id,
        actionName: action.name,
        utilityScore,
        conflictPressure,
        thresholdViolations,
        objectiveEffects,
        riskScore: action.riskScore,
        costScore: action.costScore,
        reversibility: action.reversibility
    };
}

function summarizeActions(actions) {
    return [...actions].sort((a, b) => {
        if (b.utilityScore !== a.utilityScore) return b.utilityScore - a.utilityScore;
        if (a.conflictPressure !== b.conflictPressure) return a.conflictPressure - b.conflictPressure;
        return String(a.actionId).localeCompare(String(b.actionId));
    });
}

function overallConflictLevel(conflictMatrix, bestAction) {
    const maxPairConflict = conflictMatrix.length > 0
        ? conflictMatrix[0].conflictScore
        : 0;
    const blended = Math.round(
        maxPairConflict * 0.55
        + safeNumber(bestAction?.conflictPressure, 0) * 0.45
    );

    if (blended >= 75) return 'high';
    if (blended >= 50) return 'moderate';
    if (blended >= 30) return 'low';
    return 'minimal';
}

function buildAlerts(level, bestAction) {
    const alerts = [];
    if (level === 'high') alerts.push('value_conflict_high');
    if (safeNumber(bestAction?.thresholdViolations, 0) > 0) alerts.push('objective_threshold_violation');
    if (safeNumber(bestAction?.riskScore, 0) >= 70) alerts.push('selected_action_risk_high');
    return alerts;
}

function buildRecommendations(level, rankedActions, alerts) {
    const recommendations = [];
    const best = rankedActions[0] || null;
    if (!best) return recommendations;

    recommendations.push({
        id: `recommendation-${randomUUID().slice(0, 8)}`,
        type: 'adopt_balanced_action',
        actionId: best.actionId,
        title: `Adopt balanced action: ${best.actionName}`,
        description: `Utility ${best.utilityScore} with conflict pressure ${best.conflictPressure}.`,
        priority: best.utilityScore >= 70 ? 'P1' : 'P2'
    });

    if (level === 'high' || alerts.includes('objective_threshold_violation')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'mediate_value_conflict',
            actionId: best.actionId,
            title: 'Run value-conflict mediation session',
            description: 'Competing objectives remain in conflict and require explicit mediation.',
            priority: level === 'high' ? 'P1' : 'P2'
        });
    }

    if (best.thresholdViolations > 0 || best.utilityScore < 60) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'gather_missing_value_signal',
            actionId: best.actionId,
            title: 'Gather missing value signals before final policy commit',
            description: 'Decision quality is constrained by objective threshold pressure or low utility margin.',
            priority: 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

export function resolveValueConflicts(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const objectives = normalizeObjectives(inputPayload || {});
    const actions = normalizeActions(inputPayload || {});
    const weightMap = normalizeObjectiveWeights(objectives);
    const conflictMatrix = objectiveConflictMatrix(objectives);
    const evaluatedActions = actions.map((action) => evaluateAction(action, objectives, weightMap));
    const rankedActions = summarizeActions(evaluatedActions);
    const bestAction = rankedActions[0] || null;
    const conflictLevel = overallConflictLevel(conflictMatrix, bestAction);
    const alerts = buildAlerts(conflictLevel, bestAction);
    const recommendations = buildRecommendations(conflictLevel, rankedActions, alerts);

    return {
        at,
        objectives: objectives.map((objective) => clone(objective)),
        actions: rankedActions.map((action) => clone(action)),
        conflictMatrix,
        summary: {
            objectiveCount: objectives.length,
            actionCount: actions.length,
            topActionId: bestAction?.actionId || null,
            topActionUtility: bestAction?.utilityScore || 0,
            conflictLevel
        },
        alerts,
        recommendations
    };
}

export function valueConflictRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:value-resolver',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('valueConflictRecommendationsToTasks requires report payload');
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
            conflictLevel: reportPayload.summary?.conflictLevel || 'minimal'
        },
        createdAt: nowMs + index
    }));
}

export class ValueConflictResolver {
    constructor({
        localAgentId = 'agent:value-resolver',
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
        const report = resolveValueConflicts(inputPayload, {
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
        return valueConflictRecommendationsToTasks(reportPayload, {
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

export const __valueConflictResolverInternals = {
    normalizeObjectives,
    normalizeActions,
    objectiveConflictMatrix,
    evaluateAction,
    summarizeActions,
    overallConflictLevel,
    buildRecommendations
};
