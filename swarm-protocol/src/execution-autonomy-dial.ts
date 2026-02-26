import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    lower_action_autonomy: 'agent:governance',
    raise_action_autonomy: 'agent:ops',
    publish_autonomy_policy_update: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const AutonomyLevels = ['manual_only', 'human_approval', 'supervised_auto', 'bounded_auto', 'full_auto'];

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

function normalizeActions(inputPayload) {
    const source = Array.isArray(inputPayload?.actions)
        ? inputPayload.actions
        : [];

    return source
        .filter((action) => action && typeof action === 'object')
        .map((action, index) => ({
            actionId: typeof action.actionId === 'string' && action.actionId.trim()
                ? action.actionId.trim()
                : `action-${index + 1}`,
            description: typeof action.description === 'string' && action.description.trim()
                ? action.description.trim()
                : `Action ${index + 1}`,
            riskScore: clamp(safeNumber(action.riskScore, 40)),
            confidenceScore: clamp(safeNumber(action.confidenceScore, 64)),
            reversibility: clamp(safeNumber(action.reversibility, 58)),
            blastRadius: clamp(safeNumber(action.blastRadius, 34)),
            dataSensitivity: clamp(safeNumber(action.dataSensitivity, 28)),
            currentAutonomy: AutonomyLevels.includes(action.currentAutonomy)
                ? action.currentAutonomy
                : 'supervised_auto'
        }));
}

function normalizeCapacity(inputPayload) {
    const capacity = inputPayload?.capacity && typeof inputPayload.capacity === 'object'
        ? inputPayload.capacity
        : {};

    return {
        operatorReviewSlots: Math.max(0, Math.floor(safeNumber(capacity.operatorReviewSlots, 8))),
        maxAutonomousConcurrency: Math.max(1, Math.floor(safeNumber(capacity.maxAutonomousConcurrency, 12)))
    };
}

function autonomyIndex(level) {
    return Math.max(0, AutonomyLevels.indexOf(level));
}

function recommendedLevel(action) {
    const riskPressure = clamp(Math.round(
        action.riskScore * 0.4
        + action.blastRadius * 0.26
        + action.dataSensitivity * 0.2
        + (100 - action.reversibility) * 0.14
    ));

    if (riskPressure >= 82 || action.confidenceScore < 45) {
        return { level: 'manual_only', riskPressure };
    }
    if (riskPressure >= 68 || action.confidenceScore < 58) {
        return { level: 'human_approval', riskPressure };
    }
    if (riskPressure >= 54) {
        return { level: 'supervised_auto', riskPressure };
    }
    if (riskPressure >= 38) {
        return { level: 'bounded_auto', riskPressure };
    }
    return { level: 'full_auto', riskPressure };
}

function dialAutonomy(actions, capacity) {
    let autonomousRemaining = capacity.maxAutonomousConcurrency;
    let reviewSlots = capacity.operatorReviewSlots;

    const decisions = actions.map((action) => {
        const recommendation = recommendedLevel(action);
        let level = recommendation.level;

        if (autonomyIndex(level) >= autonomyIndex('bounded_auto')) {
            if (autonomousRemaining <= 0) {
                level = 'supervised_auto';
            } else {
                autonomousRemaining -= 1;
            }
        }

        let escalationRequired = false;
        if (level === 'manual_only' || level === 'human_approval') {
            escalationRequired = true;
            if (reviewSlots > 0) reviewSlots -= 1;
        }

        const delta = autonomyIndex(level) - autonomyIndex(action.currentAutonomy);

        return {
            actionId: action.actionId,
            description: action.description,
            currentAutonomy: action.currentAutonomy,
            recommendedAutonomy: level,
            autonomyDelta: delta,
            riskScore: action.riskScore,
            confidenceScore: action.confidenceScore,
            riskPressure: recommendation.riskPressure,
            escalationRequired,
            guardrails: [
                level === 'manual_only' ? 'human_execution_only' : null,
                level === 'human_approval' ? 'pre_execution_approval' : null,
                level === 'bounded_auto' ? 'bounded_scope_limits' : null,
                level === 'full_auto' ? 'post_execution_sampling' : null
            ].filter(Boolean)
        };
    }).sort((a, b) => b.riskPressure - a.riskPressure);

    return {
        decisions,
        remainingCapacity: {
            autonomousRemaining,
            reviewSlots
        }
    };
}

function summarizeDialing(result) {
    const levelCounts = result.decisions.reduce((acc, decision) => {
        acc[decision.recommendedAutonomy] = (acc[decision.recommendedAutonomy] || 0) + 1;
        return acc;
    }, {
        manual_only: 0,
        human_approval: 0,
        supervised_auto: 0,
        bounded_auto: 0,
        full_auto: 0
    });

    const avgRiskPressure = result.decisions.length > 0
        ? Number((result.decisions.reduce((acc, decision) => acc + decision.riskPressure, 0) / result.decisions.length).toFixed(2))
        : 0;
    const elevatedCount = result.decisions.filter((decision) => decision.recommendedAutonomy === 'manual_only' || decision.recommendedAutonomy === 'human_approval').length;

    let posture = 'balanced';
    if (elevatedCount > 0 || avgRiskPressure > 62) posture = 'guarded';
    if (levelCounts.manual_only > 0 || avgRiskPressure > 78) posture = 'restricted';

    return {
        actionCount: result.decisions.length,
        levelCounts,
        elevatedCount,
        avgRiskPressure,
        posture,
        remainingCapacity: result.remainingCapacity
    };
}

function buildAlerts(summary, decisions) {
    const alerts = [];
    if (summary.levelCounts.manual_only > 0) alerts.push('manual_only_actions_present');
    if (summary.remainingCapacity.reviewSlots === 0 && summary.elevatedCount > 0) alerts.push('review_capacity_exhausted');
    if (decisions.some((decision) => decision.autonomyDelta >= 2 && decision.riskPressure >= 60)) {
        alerts.push('autonomy_raise_under_elevated_risk');
    }
    return alerts;
}

function buildRecommendations(summary, decisions, alerts) {
    const recommendations = [];

    for (const decision of decisions) {
        if (decision.autonomyDelta < 0) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'lower_action_autonomy',
                actionId: decision.actionId,
                title: `Lower autonomy for ${decision.actionId}`,
                description: `Recommended autonomy ${decision.recommendedAutonomy} from ${decision.currentAutonomy}.`,
                priority: decision.recommendedAutonomy === 'manual_only' ? 'P0' : 'P1'
            });
        }

        if (decision.autonomyDelta > 0 && decision.riskPressure <= 45) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'raise_action_autonomy',
                actionId: decision.actionId,
                title: `Raise autonomy for ${decision.actionId}`,
                description: `Risk pressure ${decision.riskPressure} allows higher automation with guardrails.`,
                priority: 'P2'
            });
        }
    }

    if (alerts.length > 0 || summary.posture !== 'balanced') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_autonomy_policy_update',
            title: 'Publish autonomy dial policy update',
            description: 'Publish level assignments, review loads, and guardrails for all actions.',
            priority: summary.posture === 'restricted' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.actionId || '').localeCompare(String(b.actionId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.actionId || '') === String(entry.actionId || '')
        )) === index);
}

export function tuneExecutionAutonomy(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const actions = normalizeActions(inputPayload || {});
    const capacity = normalizeCapacity(inputPayload || {});
    const result = dialAutonomy(actions, capacity);
    const summary = summarizeDialing(result);
    const alerts = buildAlerts(summary, result.decisions);
    const recommendations = buildRecommendations(summary, result.decisions, alerts);

    return {
        at,
        summary,
        decisions: result.decisions,
        alerts,
        recommendations
    };
}

export function autonomyDialToTasks(reportPayload, {
    fromAgentId = 'agent:autonomy-dial',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('autonomyDialToTasks requires report payload');
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
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class ExecutionAutonomyDial {
    constructor({
        localAgentId = 'agent:autonomy-dial',
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
        const report = tuneExecutionAutonomy(inputPayload, {
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
        return autonomyDialToTasks(reportPayload, {
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

export const __executionAutonomyDialInternals = {
    normalizeActions,
    recommendedLevel,
    dialAutonomy,
    summarizeDialing,
    buildRecommendations
};
