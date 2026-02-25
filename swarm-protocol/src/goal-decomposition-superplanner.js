import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    execute_superplan_wave: 'agent:ops',
    mitigate_superplan_blocker: 'agent:planner',
    publish_superplan_brief: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const StageTemplates = [
    { key: 'scope', label: 'Scope Goal', baseEffort: 16, capability: 'analysis' },
    { key: 'design', label: 'Design Approach', baseEffort: 22, capability: 'planning' },
    { key: 'execute', label: 'Execute Milestone', baseEffort: 34, capability: 'operations' },
    { key: 'verify', label: 'Verify Outcome', baseEffort: 18, capability: 'analysis' }
];

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
        .map((entry) => entry.trim())
    )];
}

function normalizeGoals(inputPayload) {
    const source = Array.isArray(inputPayload?.goals)
        ? inputPayload.goals
        : [];

    return source
        .filter((goal) => goal && typeof goal === 'object')
        .map((goal, index) => ({
            goalId: typeof goal.goalId === 'string' && goal.goalId.trim()
                ? goal.goalId.trim()
                : `goal-${index + 1}`,
            title: typeof goal.title === 'string' && goal.title.trim()
                ? goal.title.trim()
                : `Goal ${index + 1}`,
            urgency: clamp(safeNumber(goal.urgency, 60)),
            complexity: clamp(safeNumber(goal.complexity, 62)),
            riskScore: clamp(safeNumber(goal.riskScore, 38)),
            dependencies: normalizeStringArray(goal.dependencies),
            requiredCapabilities: normalizeStringArray(goal.requiredCapabilities)
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};

    return {
        maxParallelWaves: Math.max(1, Math.floor(safeNumber(capacity.maxParallelWaves, 3))),
        executionBudget: Math.max(1, Math.floor(safeNumber(capacity.executionBudget, 240)))
    };
}

function goalPriority(goal) {
    return clamp(Math.round(
        goal.urgency * 0.38
        + goal.complexity * 0.34
        + goal.riskScore * 0.28
    ));
}

function stageEffort(goal, stage) {
    return Math.max(6, Math.round(
        stage.baseEffort
        + goal.complexity * 0.24
        + goal.riskScore * 0.16
    ));
}

function stagePriority(goal, stageKey) {
    if (stageKey === 'execute') {
        return goal.riskScore >= 70 || goal.urgency >= 75 ? 'critical' : 'high';
    }
    if (stageKey === 'scope' || stageKey === 'design') {
        return goal.riskScore >= 65 ? 'high' : 'normal';
    }
    return goal.riskScore >= 75 ? 'high' : 'normal';
}

function decomposeGoals(goals, capacity) {
    const sorted = goals
        .map((goal) => ({
            ...goal,
            priorityScore: goalPriority(goal)
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

    const nodes = [];
    const blockers = [];
    let totalEffort = 0;

    for (const goal of sorted) {
        let previousNodeId = null;
        for (const stage of StageTemplates) {
            const nodeId = `${goal.goalId}:${stage.key}`;
            const dependencies = previousNodeId ? [previousNodeId] : [];
            if (!previousNodeId && goal.dependencies.length > 0) {
                for (const depGoalId of goal.dependencies) {
                    dependencies.push(`${depGoalId}:verify`);
                }
            }

            const effort = stageEffort(goal, stage);
            totalEffort += effort;

            nodes.push({
                nodeId,
                goalId: goal.goalId,
                goalTitle: goal.title,
                stage: stage.key,
                label: `${stage.label} - ${goal.title}`,
                dependencies,
                requiredCapabilities: [...new Set([
                    stage.capability,
                    ...goal.requiredCapabilities
                ])],
                effort,
                priority: stagePriority(goal, stage.key),
                riskScore: goal.riskScore,
                wave: 0
            });

            previousNodeId = nodeId;
        }

        if (goal.dependencies.length > 0) {
            blockers.push({
                goalId: goal.goalId,
                dependencyCount: goal.dependencies.length,
                dependencies: [...goal.dependencies]
            });
        }
    }

    let waveCursor = 0;
    for (const node of nodes) {
        node.wave = waveCursor;
        waveCursor = (waveCursor + 1) % capacity.maxParallelWaves;
    }

    return {
        nodes,
        blockers,
        totalEffort
    };
}

function summarizePlan(plan, capacity) {
    const waveCount = plan.nodes.length > 0
        ? Math.max(...plan.nodes.map((node) => node.wave)) + 1
        : 0;
    const criticalNodeCount = plan.nodes.filter((node) => node.priority === 'critical').length;
    const budgetPressure = clamp(Math.round((plan.totalEffort / capacity.executionBudget) * 100));

    let posture = 'ready';
    if (budgetPressure > 100 || plan.blockers.length > 0) posture = 'constrained';
    if (budgetPressure > 135 || criticalNodeCount > 4) posture = 'overloaded';

    return {
        goalCount: new Set(plan.nodes.map((node) => node.goalId)).size,
        nodeCount: plan.nodes.length,
        waveCount,
        criticalNodeCount,
        totalEffort: plan.totalEffort,
        budgetPressure,
        blockerCount: plan.blockers.length,
        posture
    };
}

function buildAlerts(summary) {
    const alerts = [];
    if (summary.blockerCount > 0) alerts.push('superplan_dependency_blockers');
    if (summary.budgetPressure > 100) alerts.push('superplan_budget_pressure_high');
    if (summary.criticalNodeCount > 0) alerts.push('superplan_critical_waves_present');
    return alerts;
}

function buildRecommendations(plan, summary, alerts) {
    const recommendations = [];

    const groupedByWave = new Map();
    for (const node of plan.nodes) {
        const rows = groupedByWave.get(node.wave) || [];
        rows.push(node);
        groupedByWave.set(node.wave, rows);
    }

    for (const [wave, nodes] of groupedByWave.entries()) {
        const hasCritical = nodes.some((node) => node.priority === 'critical');
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'execute_superplan_wave',
            wave,
            title: `Execute superplan wave ${wave + 1}`,
            description: `Wave includes ${nodes.length} nodes${hasCritical ? ' and critical workstreams' : ''}.`,
            priority: hasCritical ? 'P1' : 'P2'
        });
    }

    for (const blocker of plan.blockers) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'mitigate_superplan_blocker',
            goalId: blocker.goalId,
            title: `Mitigate blockers for ${blocker.goalId}`,
            description: `${blocker.dependencyCount} upstream dependencies are gating execution.`,
            priority: blocker.dependencyCount >= 2 ? 'P1' : 'P2'
        });
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_superplan_brief',
            title: 'Publish decomposition superplan brief',
            description: 'Share wave plan, blocker map, and budget pressure before execution.',
            priority: summary.posture === 'overloaded' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return safeNumber(a.wave, 99) - safeNumber(b.wave, 99);
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && safeNumber(other.wave, -1) === safeNumber(entry.wave, -1)
            && String(other.goalId || '') === String(entry.goalId || '')
        )) === index);
}

export function decomposeGoalSuperplan(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const goals = normalizeGoals(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const decomposition = decomposeGoals(goals, capacity);
    const summary = summarizePlan(decomposition, capacity);
    const alerts = buildAlerts(summary);
    const recommendations = buildRecommendations(decomposition, summary, alerts);

    return {
        at,
        summary,
        planNodes: decomposition.nodes,
        blockers: decomposition.blockers,
        recommendations,
        alerts
    };
}

export function superplanToTasks(reportPayload, {
    fromAgentId = 'agent:superplanner',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('superplanToTasks requires report payload');
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
            wave: recommendation.wave ?? null,
            goalId: recommendation.goalId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class GoalDecompositionSuperplanner {
    constructor({
        localAgentId = 'agent:superplanner',
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
        const report = decomposeGoalSuperplan(inputPayload, {
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
        return superplanToTasks(reportPayload, {
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

export const __goalDecompositionSuperplannerInternals = {
    normalizeGoals,
    decomposeGoals,
    summarizePlan,
    buildRecommendations
};
