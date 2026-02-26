import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    adopt_consensus_option: 'agent:policy',
    mediate_preference_divergence: 'agent:review',
    collect_missing_preferences: 'agent:community'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const DefaultAxes = ['safety', 'equity', 'cost_efficiency', 'speed', 'autonomy', 'privacy'];

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

function normalizeAxes(inputPayload) {
    const configured = Array.isArray(inputPayload?.axes)
        ? inputPayload.axes.filter((axis) => typeof axis === 'string' && axis.trim())
        : [];
    const list = configured.length > 0 ? configured : DefaultAxes;
    return [...new Set(list.map((axis) => axis.trim().toLowerCase()))];
}

function normalizeStakeholders(inputPayload, axes) {
    const entries = Array.isArray(inputPayload?.stakeholders)
        ? inputPayload.stakeholders
        : [];

    return entries.map((entry, index) => {
        const preferences = {};
        for (const axis of axes) {
            preferences[axis] = clamp(safeNumber(entry?.preferences?.[axis], 50));
        }
        return {
            id: typeof entry?.id === 'string' && entry.id.trim()
                ? entry.id.trim()
                : `stakeholder-${index + 1}`,
            name: typeof entry?.name === 'string' && entry.name.trim()
                ? entry.name.trim()
                : `Stakeholder ${index + 1}`,
            role: typeof entry?.role === 'string' && entry.role.trim()
                ? entry.role.trim()
                : 'stakeholder',
            influenceWeight: clamp(safeNumber(entry?.influenceWeight, 50)),
            participationScore: clamp(safeNumber(entry?.participationScore, 70)),
            riskTolerance: clamp(safeNumber(entry?.riskTolerance, 45)),
            preferences
        };
    });
}

function normalizeOptions(inputPayload, axes) {
    const entries = Array.isArray(inputPayload?.options)
        ? inputPayload.options
        : [];

    return entries.map((entry, index) => {
        const outcomes = {};
        for (const axis of axes) {
            outcomes[axis] = clamp(safeNumber(entry?.outcomes?.[axis], 50));
        }
        return {
            id: typeof entry?.id === 'string' && entry.id.trim()
                ? entry.id.trim()
                : `option-${index + 1}`,
            name: typeof entry?.name === 'string' && entry.name.trim()
                ? entry.name.trim()
                : `Option ${index + 1}`,
            outcomes,
            riskScore: clamp(safeNumber(entry?.riskScore, 30)),
            costScore: clamp(safeNumber(entry?.costScore, 40))
        };
    });
}

function stakeholderUtility(stakeholder, option, axes) {
    let weightedMatch = 0;
    let totalWeight = 0;

    for (const axis of axes) {
        const preference = stakeholder.preferences[axis];
        const outcome = option.outcomes[axis];
        const axisWeight = Math.max(5, preference);
        const distance = Math.abs(preference - outcome);
        const alignment = clamp(100 - distance);
        weightedMatch += alignment * axisWeight;
        totalWeight += axisWeight;
    }

    const fitScore = totalWeight > 0 ? weightedMatch / totalWeight : 0;
    const riskPenalty = Math.max(0, option.riskScore - stakeholder.riskTolerance) * 0.6;
    const utilityScore = clamp(Math.round(
        fitScore * 0.78
        + stakeholder.participationScore * 0.12
        + stakeholder.influenceWeight * 0.1
        - riskPenalty
    ));

    return {
        utilityScore,
        fitScore: Number(fitScore.toFixed(2)),
        riskPenalty: Number(riskPenalty.toFixed(2))
    };
}

function evaluateOptions(stakeholders, options, axes) {
    const influenceTotal = stakeholders.reduce((acc, stakeholder) => acc + stakeholder.influenceWeight, 0);
    const denominator = influenceTotal > 0 ? influenceTotal : Math.max(1, stakeholders.length);

    return options.map((option) => {
        const perStakeholder = stakeholders.map((stakeholder) => {
            const utility = stakeholderUtility(stakeholder, option, axes);
            return {
                stakeholderId: stakeholder.id,
                stakeholderName: stakeholder.name,
                influenceWeight: stakeholder.influenceWeight,
                ...utility
            };
        });

        const weightedUtility = perStakeholder.reduce((acc, entry) => (
            acc + entry.utilityScore * entry.influenceWeight
        ), 0) / denominator;
        const spread = perStakeholder.length > 0
            ? Math.max(...perStakeholder.map((entry) => entry.utilityScore))
                - Math.min(...perStakeholder.map((entry) => entry.utilityScore))
            : 0;
        const consensusScore = clamp(Math.round(
            weightedUtility
            - spread * 0.35
            - option.riskScore * 0.1
            - option.costScore * 0.06
        ));

        return {
            optionId: option.id,
            optionName: option.name,
            option,
            consensusScore,
            weightedUtility: Number(weightedUtility.toFixed(2)),
            utilitySpread: Number(spread.toFixed(2)),
            perStakeholder
        };
    }).sort((a, b) => {
        if (b.consensusScore !== a.consensusScore) return b.consensusScore - a.consensusScore;
        if (a.utilitySpread !== b.utilitySpread) return a.utilitySpread - b.utilitySpread;
        return String(a.optionId).localeCompare(String(b.optionId));
    });
}

function stakeholderDivergence(stakeholders, axes) {
    const rows = [];
    for (let i = 0; i < stakeholders.length; i++) {
        for (let j = i + 1; j < stakeholders.length; j++) {
            const left = stakeholders[i];
            const right = stakeholders[j];
            const avgDistance = axes.reduce((acc, axis) => (
                acc + Math.abs(left.preferences[axis] - right.preferences[axis])
            ), 0) / Math.max(1, axes.length);

            rows.push({
                id: `divergence-${randomUUID().slice(0, 8)}`,
                leftStakeholderId: left.id,
                rightStakeholderId: right.id,
                leftStakeholderName: left.name,
                rightStakeholderName: right.name,
                divergenceScore: Number(avgDistance.toFixed(2))
            });
        }
    }

    return rows.sort((a, b) => b.divergenceScore - a.divergenceScore);
}

function buildAlerts(bestOption, divergenceRows, stakeholders) {
    const alerts = [];
    if (safeNumber(bestOption?.consensusScore, 0) < 55) {
        alerts.push('low_consensus_score');
    }
    if (divergenceRows.some((row) => row.divergenceScore >= 35)) {
        alerts.push('high_stakeholder_divergence');
    }
    if (stakeholders.some((stakeholder) => stakeholder.participationScore < 40)) {
        alerts.push('low_stakeholder_participation');
    }
    return alerts;
}

function buildRecommendations(bestOption, alerts) {
    const recommendations = [];
    if (bestOption) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'adopt_consensus_option',
            optionId: bestOption.optionId,
            title: `Adopt consensus option: ${bestOption.optionName}`,
            description: `Consensus score ${bestOption.consensusScore} with weighted utility ${bestOption.weightedUtility}.`,
            priority: bestOption.consensusScore >= 75 ? 'P1' : 'P2'
        });
    }

    if (alerts.includes('high_stakeholder_divergence')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'mediate_preference_divergence',
            optionId: bestOption?.optionId || null,
            title: 'Mediate high stakeholder preference divergence',
            description: 'Preference divergence is high across key stakeholders and requires reconciliation.',
            priority: 'P1'
        });
    }

    if (alerts.includes('low_stakeholder_participation')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'collect_missing_preferences',
            optionId: bestOption?.optionId || null,
            title: 'Collect missing stakeholder preference signals',
            description: 'Participation from one or more stakeholder groups is below acceptable threshold.',
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

export function modelStakeholderPreferences(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const axes = normalizeAxes(inputPayload || {});
    const stakeholders = normalizeStakeholders(inputPayload || {}, axes);
    const options = normalizeOptions(inputPayload || {}, axes);
    const evaluatedOptions = evaluateOptions(stakeholders, options, axes);
    const divergence = stakeholderDivergence(stakeholders, axes);
    const bestOption = evaluatedOptions[0] || null;
    const alerts = buildAlerts(bestOption, divergence, stakeholders);
    const recommendations = buildRecommendations(bestOption, alerts);

    return {
        at,
        axes,
        stakeholders: stakeholders.map((entry) => clone(entry)),
        options: evaluatedOptions.map((entry) => clone(entry)),
        divergence,
        summary: {
            stakeholderCount: stakeholders.length,
            optionCount: options.length,
            topOptionId: bestOption?.optionId || null,
            topConsensusScore: bestOption?.consensusScore || 0,
            maxDivergenceScore: divergence.length > 0
                ? divergence[0].divergenceScore
                : 0
        },
        alerts,
        recommendations
    };
}

export function stakeholderPreferencesToTasks(reportPayload, {
    fromAgentId = 'agent:preference-modeler',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('stakeholderPreferencesToTasks requires report payload');
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
            optionId: recommendation.optionId || null,
            topOptionId: reportPayload.summary?.topOptionId || null
        },
        createdAt: nowMs + index
    }));
}

export class MultiStakeholderPreferenceModeler {
    constructor({
        localAgentId = 'agent:preference-modeler',
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
        const report = modelStakeholderPreferences(inputPayload, {
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
        return stakeholderPreferencesToTasks(reportPayload, {
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

export const __stakeholderPreferenceInternals = {
    normalizeAxes,
    normalizeStakeholders,
    normalizeOptions,
    stakeholderUtility,
    evaluateOptions,
    stakeholderDivergence,
    buildRecommendations
};
