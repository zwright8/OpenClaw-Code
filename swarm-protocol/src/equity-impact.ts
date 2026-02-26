import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    proceed_equitable_rollout: 'agent:ops',
    reweight_interventions: 'agent:planner',
    protect_vulnerable_groups: 'agent:safety',
    targeted_access_program: 'agent:community'
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

function normalizeGroups(inputPayload) {
    const entries = Array.isArray(inputPayload?.groups)
        ? inputPayload.groups
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `group-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Group ${index + 1}`,
        population: Math.max(1, Math.floor(safeNumber(entry?.population, 1_000))),
        region: typeof entry?.region === 'string' && entry.region.trim()
            ? entry.region.trim()
            : 'unspecified',
        vulnerabilityIndex: clamp(safeNumber(entry?.vulnerabilityIndex, 50)),
        baseline: {
            benefitScore: clamp(safeNumber(entry?.baseline?.benefitScore, 45)),
            harmScore: clamp(safeNumber(entry?.baseline?.harmScore, 20)),
            accessScore: clamp(safeNumber(entry?.baseline?.accessScore, 50))
        }
    }));
}

function normalizeInterventions(inputPayload) {
    const entries = Array.isArray(inputPayload?.interventions)
        ? inputPayload.interventions
        : [];
    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `intervention-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Intervention ${index + 1}`,
        coverage: clamp(safeNumber(entry?.coverage, 70)),
        groupEffects: entry?.groupEffects && typeof entry.groupEffects === 'object'
            ? entry.groupEffects
            : {}
    }));
}

function normalizeThresholds(inputPayload) {
    return {
        maxDisparityGap: clamp(safeNumber(inputPayload?.thresholds?.maxDisparityGap, 28)),
        maxHighVulnerabilityHarm: clamp(safeNumber(inputPayload?.thresholds?.maxHighVulnerabilityHarm, 40)),
        minFairnessIndex: clamp(safeNumber(inputPayload?.thresholds?.minFairnessIndex, 55))
    };
}

function projectGroupImpact(group, interventions) {
    let benefitDelta = 0;
    let harmDelta = 0;
    let accessDelta = 0;

    for (const intervention of interventions) {
        const effect = intervention.groupEffects[group.id] && typeof intervention.groupEffects[group.id] === 'object'
            ? intervention.groupEffects[group.id]
            : {};
        const factor = intervention.coverage / 100;
        benefitDelta += safeNumber(effect.benefitDelta, 0) * factor;
        harmDelta += safeNumber(effect.harmDelta, 0) * factor;
        accessDelta += safeNumber(effect.accessDelta, 0) * factor;
    }

    const projected = {
        benefitScore: clamp(group.baseline.benefitScore + benefitDelta),
        harmScore: clamp(group.baseline.harmScore + harmDelta),
        accessScore: clamp(group.baseline.accessScore + accessDelta)
    };

    const vulnerabilityPenalty = group.vulnerabilityIndex * 0.08;
    const netImpact = Number((
        projected.benefitScore * 0.9
        - projected.harmScore * 1.1
        + projected.accessScore * 0.35
        - vulnerabilityPenalty
    ).toFixed(3));

    return {
        groupId: group.id,
        groupName: group.name,
        region: group.region,
        population: group.population,
        vulnerabilityIndex: group.vulnerabilityIndex,
        baseline: clone(group.baseline),
        projected,
        deltas: {
            benefitDelta: Number(benefitDelta.toFixed(3)),
            harmDelta: Number(harmDelta.toFixed(3)),
            accessDelta: Number(accessDelta.toFixed(3))
        },
        netImpact
    };
}

function summarizeEquity(groupImpacts, thresholds) {
    const totalPopulation = groupImpacts.reduce((acc, group) => acc + group.population, 0);
    const weightedNetImpact = totalPopulation > 0
        ? groupImpacts.reduce((acc, group) => acc + group.netImpact * group.population, 0) / totalPopulation
        : 0;

    const netValues = groupImpacts.map((group) => group.netImpact);
    const minNetImpact = netValues.length > 0 ? Math.min(...netValues) : 0;
    const maxNetImpact = netValues.length > 0 ? Math.max(...netValues) : 0;
    const disparityGap = Number((maxNetImpact - minNetImpact).toFixed(3));
    const negativeImpactGroups = groupImpacts.filter((group) => group.netImpact < 0);
    const highVulnerabilityGroups = groupImpacts.filter((group) => group.vulnerabilityIndex >= 70);
    const highVulnerabilityHarm = highVulnerabilityGroups.length > 0
        ? highVulnerabilityGroups.reduce((acc, group) => acc + group.projected.harmScore, 0) / highVulnerabilityGroups.length
        : 0;
    const lowAccessGroups = groupImpacts.filter((group) => group.projected.accessScore < 45);

    const fairnessIndex = clamp(
        100
        - (disparityGap * 1.1)
        - (highVulnerabilityHarm * 0.5)
        - (negativeImpactGroups.length * 6)
    );

    let posture = 'aligned';
    if (
        fairnessIndex < thresholds.minFairnessIndex
        || disparityGap > thresholds.maxDisparityGap
        || highVulnerabilityHarm > thresholds.maxHighVulnerabilityHarm
        || negativeImpactGroups.length >= Math.ceil(groupImpacts.length / 2)
    ) {
        posture = 'blocked';
    } else if (
        fairnessIndex < thresholds.minFairnessIndex + 12
        || disparityGap > thresholds.maxDisparityGap * 0.75
        || lowAccessGroups.length > 0
    ) {
        posture = 'review_required';
    }

    return {
        totalPopulation,
        weightedNetImpact: Number(weightedNetImpact.toFixed(3)),
        minNetImpact: Number(minNetImpact.toFixed(3)),
        maxNetImpact: Number(maxNetImpact.toFixed(3)),
        disparityGap,
        fairnessIndex: Number(fairnessIndex.toFixed(2)),
        negativeImpactGroupCount: negativeImpactGroups.length,
        highVulnerabilityGroupCount: highVulnerabilityGroups.length,
        highVulnerabilityHarm: Number(highVulnerabilityHarm.toFixed(3)),
        lowAccessGroupCount: lowAccessGroups.length,
        posture
    };
}

function buildAlerts(summary, thresholds) {
    const alerts = [];
    if (summary.disparityGap > thresholds.maxDisparityGap) {
        alerts.push('equity_disparity_high');
    }
    if (summary.highVulnerabilityHarm > thresholds.maxHighVulnerabilityHarm) {
        alerts.push('vulnerable_group_harm_high');
    }
    if (summary.lowAccessGroupCount > 0) {
        alerts.push('access_gap_detected');
    }
    if (summary.negativeImpactGroupCount > 0) {
        alerts.push('negative_impact_group_detected');
    }
    if (summary.posture === 'blocked') {
        alerts.push('equity_posture_blocked');
    }
    return alerts;
}

function buildRecommendations(summary, alerts) {
    const recommendations = [];

    if (summary.posture === 'aligned') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'proceed_equitable_rollout',
            title: 'Proceed with equitable rollout',
            description: `Fairness index ${summary.fairnessIndex} indicates balanced distribution of benefits.`,
            priority: 'P2'
        });
    }

    if (alerts.includes('equity_disparity_high')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'reweight_interventions',
            title: 'Reweight intervention mix to reduce disparity',
            description: `Disparity gap ${summary.disparityGap} exceeds acceptable thresholds.`,
            priority: summary.posture === 'blocked' ? 'P1' : 'P2'
        });
    }

    if (alerts.includes('vulnerable_group_harm_high') || summary.posture === 'blocked') {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'protect_vulnerable_groups',
            title: 'Introduce safeguards for vulnerable groups',
            description: 'Projected harm for high-vulnerability groups is above policy tolerance.',
            priority: 'P0'
        });
    }

    if (alerts.includes('access_gap_detected')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'targeted_access_program',
            title: 'Launch targeted access support program',
            description: 'One or more groups remain below minimum access levels.',
            priority: 'P1'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

export function evaluateEquityImpact(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const groups = normalizeGroups(inputPayload || {});
    const interventions = normalizeInterventions(inputPayload || {});
    const thresholds = normalizeThresholds(inputPayload || {});

    const groupImpacts = groups.map((group) => projectGroupImpact(group, interventions));
    const summary = summarizeEquity(groupImpacts, thresholds);
    const alerts = buildAlerts(summary, thresholds);
    const recommendations = buildRecommendations(summary, alerts);

    return {
        at,
        thresholds,
        groups: groupImpacts,
        summary,
        alerts,
        recommendations
    };
}

export function equityRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:equity',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('equityRecommendationsToTasks requires report payload');
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
            equityPosture: reportPayload.summary?.posture || 'unknown',
            recommendationType: recommendation.type,
            fairnessIndex: reportPayload.summary?.fairnessIndex ?? null
        },
        createdAt: nowMs + index
    }));
}

export class EquityImpactAnalyzer {
    constructor({
        localAgentId = 'agent:equity',
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
        const report = evaluateEquityImpact(inputPayload, {
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
        return equityRecommendationsToTasks(reportPayload, {
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

export const __equityImpactInternals = {
    normalizeGroups,
    normalizeInterventions,
    normalizeThresholds,
    projectGroupImpact,
    summarizeEquity,
    buildAlerts,
    buildRecommendations
};
