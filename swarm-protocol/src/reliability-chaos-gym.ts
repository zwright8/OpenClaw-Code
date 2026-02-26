import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    patch_resilience_gap: 'agent:reliability',
    run_targeted_chaos_drill: 'agent:qa',
    add_observability_guard: 'agent:monitoring',
    expand_rollback_automation: 'agent:platform',
    publish_chaos_report: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const FaultTypeIntensity = {
    latency_spike: 42,
    service_outage: 78,
    dependency_loss: 66,
    packet_loss: 48,
    queue_backlog: 56,
    cpu_throttle: 52
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

function normalizeSystems(inputPayload) {
    const systems = Array.isArray(inputPayload?.systems)
        ? inputPayload.systems
        : [];

    return systems
        .filter((system) => system && typeof system === 'object')
        .map((system, index) => ({
            id: typeof system.id === 'string' && system.id.trim()
                ? system.id.trim()
                : `system-${index + 1}`,
            name: typeof system.name === 'string' && system.name.trim()
                ? system.name.trim()
                : `System ${index + 1}`,
            baselineAvailability: clamp(safeNumber(system.baselineAvailability, 99.5)),
            baselineLatencyMs: Math.max(1, safeNumber(system.baselineLatencyMs, 120)),
            errorBudgetRemaining: clamp(safeNumber(system.errorBudgetRemaining, 70)),
            dependencyCriticality: clamp(safeNumber(system.dependencyCriticality, 55)),
            observabilityCoverage: clamp(safeNumber(system.observabilityCoverage, 62)),
            rollbackAutomation: clamp(safeNumber(system.rollbackAutomation, 58))
        }));
}

function normalizeExperiments(inputPayload) {
    const experiments = Array.isArray(inputPayload?.experiments)
        ? inputPayload.experiments
        : [];

    return experiments
        .filter((experiment) => experiment && typeof experiment === 'object')
        .map((experiment, index) => ({
            id: typeof experiment.id === 'string' && experiment.id.trim()
                ? experiment.id.trim()
                : `experiment-${index + 1}`,
            systemId: typeof experiment.systemId === 'string' && experiment.systemId.trim()
                ? experiment.systemId.trim()
                : null,
            faultType: typeof experiment.faultType === 'string' && experiment.faultType.trim()
                ? experiment.faultType.trim()
                : 'latency_spike',
            blastRadius: clamp(safeNumber(experiment.blastRadius, 30)),
            durationMinutes: Math.max(1, Math.floor(safeNumber(experiment.durationMinutes, 20))),
            safeguards: clamp(safeNumber(experiment.safeguards, 60)),
            rollbackReady: experiment.rollbackReady !== false
        }));
}

function simulateExperiment(experiment, system) {
    const baseFaultIntensity = FaultTypeIntensity[experiment.faultType] || 50;
    const availabilityDrop = clamp(Math.round(
        baseFaultIntensity * 0.08
        + experiment.blastRadius * 0.11
        + (100 - experiment.safeguards) * 0.09
        + system.dependencyCriticality * 0.05
        - system.rollbackAutomation * 0.04
    ), 0, 85);
    const projectedAvailability = clamp(system.baselineAvailability - availabilityDrop, 0, 100);

    const latencyIncrease = Math.round(
        baseFaultIntensity * 1.8
        + experiment.blastRadius * 1.3
        + (100 - system.observabilityCoverage) * 0.9
        + experiment.durationMinutes * 0.8
    );
    const projectedLatencyMs = Math.max(system.baselineLatencyMs, Math.round(system.baselineLatencyMs + latencyIncrease));

    const errorBudgetBurn = clamp(Math.round(
        availabilityDrop * 0.8
        + experiment.durationMinutes * 0.45
        + experiment.blastRadius * 0.25
    ));
    const remainingBudget = clamp(system.errorBudgetRemaining - errorBudgetBurn);

    const resilienceScore = clamp(Math.round(
        projectedAvailability * 0.36
        + (100 - clamp((projectedLatencyMs / system.baselineLatencyMs) * 20, 0, 100)) * 0.16
        + remainingBudget * 0.22
        + system.observabilityCoverage * 0.14
        + system.rollbackAutomation * 0.12
        - (experiment.rollbackReady ? 0 : 8)
    ));

    let posture = 'resilient';
    if (resilienceScore < 45 || projectedAvailability < 90 || remainingBudget < 20) posture = 'fragile';
    else if (resilienceScore < 65 || projectedAvailability < 95 || remainingBudget < 40) posture = 'review_required';

    return {
        experimentId: experiment.id,
        systemId: system.id,
        systemName: system.name,
        faultType: experiment.faultType,
        blastRadius: experiment.blastRadius,
        durationMinutes: experiment.durationMinutes,
        availabilityDrop,
        projectedAvailability,
        projectedLatencyMs,
        errorBudgetBurn,
        remainingBudget,
        resilienceScore,
        posture,
        observabilityCoverage: system.observabilityCoverage,
        rollbackAutomation: system.rollbackAutomation
    };
}

function summarizeSimulations(simulations) {
    const avgResilienceScore = simulations.length > 0
        ? Number((simulations.reduce((acc, simulation) => acc + simulation.resilienceScore, 0) / simulations.length).toFixed(2))
        : 0;
    const maxErrorBudgetBurn = simulations.length > 0
        ? Math.max(...simulations.map((simulation) => simulation.errorBudgetBurn))
        : 0;
    const fragileCount = simulations.filter((simulation) => simulation.posture === 'fragile').length;
    const reviewRequiredCount = simulations.filter((simulation) => simulation.posture === 'review_required').length;

    let posture = 'ready';
    if (fragileCount > 0 || avgResilienceScore < 55) posture = 'critical';
    else if (reviewRequiredCount > 0 || avgResilienceScore < 70) posture = 'review_required';

    return {
        simulationCount: simulations.length,
        resilientCount: simulations.filter((simulation) => simulation.posture === 'resilient').length,
        reviewRequiredCount,
        fragileCount,
        avgResilienceScore,
        maxErrorBudgetBurn,
        posture
    };
}

function buildAlerts(summary, simulations) {
    const alerts = [];
    if (summary.fragileCount > 0) alerts.push('chaos_fragile_surface_detected');
    if (summary.avgResilienceScore < 60) alerts.push('chaos_resilience_score_low');
    if (simulations.some((simulation) => simulation.remainingBudget < 20)) alerts.push('chaos_error_budget_depletion_risk');
    if (simulations.some((simulation) => simulation.observabilityCoverage < 60)) alerts.push('chaos_observability_gap');
    if (simulations.some((simulation) => simulation.rollbackAutomation < 55)) alerts.push('chaos_rollback_automation_gap');
    return alerts;
}

function buildRecommendations(simulations, summary, alerts) {
    const recommendations = [];
    for (const simulation of simulations) {
        if (simulation.posture === 'fragile') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'patch_resilience_gap',
                systemId: simulation.systemId,
                experimentId: simulation.experimentId,
                title: `Patch resilience gap on ${simulation.systemName}`,
                description: `Resilience ${simulation.resilienceScore} under ${simulation.faultType}.`,
                priority: 'P0'
            });
        } else if (simulation.posture === 'review_required') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'run_targeted_chaos_drill',
                systemId: simulation.systemId,
                experimentId: simulation.experimentId,
                title: `Run targeted chaos drill for ${simulation.systemName}`,
                description: `Resilience ${simulation.resilienceScore} requires validation hardening.`,
                priority: 'P1'
            });
        }

        if (simulation.observabilityCoverage < 65) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_observability_guard',
                systemId: simulation.systemId,
                experimentId: simulation.experimentId,
                title: `Add observability guardrails for ${simulation.systemName}`,
                description: `Observability coverage ${simulation.observabilityCoverage} is below target.`,
                priority: 'P1'
            });
        }
        if (simulation.rollbackAutomation < 60 || simulation.remainingBudget < 30) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'expand_rollback_automation',
                systemId: simulation.systemId,
                experimentId: simulation.experimentId,
                title: `Expand rollback automation for ${simulation.systemName}`,
                description: `Rollback automation ${simulation.rollbackAutomation}, budget remaining ${simulation.remainingBudget}.`,
                priority: simulation.posture === 'fragile' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_chaos_report',
            title: 'Publish chaos resilience report',
            description: 'Share experiment outcomes, resilience gaps, and hardening owners.',
            priority: alerts.includes('chaos_fragile_surface_detected') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.systemId || '').localeCompare(String(b.systemId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.systemId || '') === String(entry.systemId || '')
            && String(other.experimentId || '') === String(entry.experimentId || '')
        )) === index);
}

export function runReliabilityChaosGym(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const systems = normalizeSystems(inputPayload || {});
    const experiments = normalizeExperiments(inputPayload || {});
    const systemMap = new Map(systems.map((system) => [system.id, system]));

    const simulations = experiments
        .filter((experiment) => experiment.systemId && systemMap.has(experiment.systemId))
        .map((experiment) => simulateExperiment(experiment, systemMap.get(experiment.systemId)))
        .sort((a, b) => {
            const postureRank = { fragile: 0, review_required: 1, resilient: 2 };
            const p = postureRank[a.posture] - postureRank[b.posture];
            if (p !== 0) return p;
            return a.resilienceScore - b.resilienceScore;
        });

    const summary = summarizeSimulations(simulations);
    const alerts = buildAlerts(summary, simulations);
    const recommendations = buildRecommendations(simulations, summary, alerts);

    return {
        at,
        summary,
        simulations,
        alerts,
        recommendations
    };
}

export function chaosGymToTasks(reportPayload, {
    fromAgentId = 'agent:chaos-gym',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('chaosGymToTasks requires report payload');
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
            systemId: recommendation.systemId || null,
            experimentId: recommendation.experimentId || null,
            posture: reportPayload.summary?.posture || null,
            fragileCount: reportPayload.summary?.fragileCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class ReliabilityChaosGym {
    constructor({
        localAgentId = 'agent:chaos-gym',
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
        const report = runReliabilityChaosGym(inputPayload, {
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
        return chaosGymToTasks(reportPayload, {
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

export const __reliabilityChaosGymInternals = {
    normalizeSystems,
    normalizeExperiments,
    simulateExperiment,
    summarizeSimulations,
    buildRecommendations
};
