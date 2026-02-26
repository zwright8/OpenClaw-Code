import { randomUUID } from 'crypto';
import type {
    SkillExecutionInput,
    SkillExecutionOutput,
    SkillExecutionSignals,
    SkillExecutionTask,
    SkillExecutionTaskOptions,
    SkillImplementation,
    SkillPosture,
    SkillPriority,
    SkillScoringWeights
} from './types.js';

const DEFAULT_FROM_AGENT = 'agent:skills-runtime';

function clamp(value: number, min = 0, max = 100): number {
    return Math.max(min, Math.min(max, value));
}

function safeNumber(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function hashNumber(value: string): number {
    let hash = 2_166_136_261;
    for (const ch of value) {
        hash ^= ch.charCodeAt(0);
        hash = Math.imul(hash, 16_777_619);
    }
    return hash >>> 0;
}

function pseudo(seed: number, offset: number): number {
    let state = (seed + Math.imul(offset + 1, 1_013_904_223)) >>> 0;
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_295;
}

function defaultMetric(seed: number, offset: number, min: number, max: number): number {
    const ratio = pseudo(seed, offset);
    return Math.round(min + ratio * (max - min));
}

function normalizeWeights(weights: SkillScoringWeights): SkillScoringWeights {
    const raw = [
        Math.max(0.0001, safeNumber(weights.truth, 0.25)),
        Math.max(0.0001, safeNumber(weights.execution, 0.25)),
        Math.max(0.0001, safeNumber(weights.safety, 0.25)),
        Math.max(0.0001, safeNumber(weights.impact, 0.25))
    ];
    const total = raw.reduce((sum, value) => sum + value, 0);
    const scaled = raw.map((value) => Number((value / total).toFixed(4)));
    const drift = Number((1 - scaled.reduce((sum, value) => sum + value, 0)).toFixed(4));
    scaled[scaled.length - 1] = Number((scaled[scaled.length - 1] + drift).toFixed(4));
    return {
        truth: scaled[0],
        execution: scaled[1],
        safety: scaled[2],
        impact: scaled[3]
    };
}

function roundScore(value: number): number {
    return clamp(Math.round(value), 0, 100);
}

function resolveSignals(
    implementation: SkillImplementation,
    input: SkillExecutionInput = {}
): SkillExecutionSignals {
    const seed = hashNumber(`${implementation.skillId}:${implementation.skillName}:${implementation.runtimeProfile.scoringSeed}`);
    return {
        signalQuality: roundScore(clamp(
            safeNumber(input.signalQuality, defaultMetric(seed, 0, 52, 90))
        )),
        evidenceCoverage: roundScore(clamp(
            safeNumber(input.evidenceCoverage, defaultMetric(seed, 1, 48, 92))
        )),
        confidenceHealth: roundScore(clamp(
            safeNumber(input.confidenceHealth, defaultMetric(seed, 2, 45, 89))
        )),
        operationalReadiness: roundScore(clamp(
            safeNumber(input.operationalReadiness, defaultMetric(seed, 3, 40, 88))
        )),
        harmPotential: roundScore(clamp(
            safeNumber(input.harmPotential, defaultMetric(seed, 4, 12, 68))
        )),
        resourcePressure: roundScore(clamp(
            safeNumber(input.resourcePressure, defaultMetric(seed, 5, 10, 72))
        )),
        urgency: roundScore(clamp(
            safeNumber(input.urgency, defaultMetric(seed, 6, 30, 85))
        )),
        impactPotential: roundScore(clamp(
            safeNumber(input.impactPotential, defaultMetric(seed, 7, 45, 95))
        )),
        humanApprovalLatency: roundScore(clamp(
            safeNumber(input.humanApprovalLatency, defaultMetric(seed, 8, 5, 62))
        ))
    };
}

function derivePosture(
    overallScore: number,
    riskScore: number,
    thresholds: SkillImplementation['runtimeProfile']['postureThresholds']
): SkillPosture {
    if (riskScore >= thresholds.criticalRisk || overallScore < thresholds.reviewMin) {
        return 'critical';
    }
    if (riskScore >= thresholds.reviewRisk || overallScore < thresholds.readyMin) {
        return 'review_required';
    }
    return 'ready';
}

function deriveActions(
    implementation: SkillImplementation,
    posture: SkillPosture
): string[] {
    const actions = [
        `validate-contract:${implementation.runtimeProfile.requiredSignals.join('+')}`,
        `compute-score:${implementation.runtimeProfile.coreMethod}`,
        `route:${implementation.runtimeProfile.orchestration.routingTag}`
    ];

    if (posture === 'critical') {
        actions.push(`rollback:${implementation.runtimeProfile.orchestration.rollbackStrategy}`);
        actions.push('open-incident:human-oversight');
    } else if (posture === 'review_required') {
        actions.push(`run-validation:${implementation.runtimeProfile.validation.suites.join('+')}`);
        actions.push('queue-approval:human-approval-router');
    } else {
        actions.push(`deploy-flag:${implementation.runtimeProfile.rollout.featureFlag}`);
        actions.push('publish-telemetry:runtime-dashboard');
    }

    return actions;
}

function deriveDeliverables(
    implementation: SkillImplementation,
    posture: SkillPosture,
    overallScore: number
): string[] {
    return [
        `artifact:${implementation.runtimeProfile.primaryArtifact}`,
        `scorecard:overall=${overallScore}`,
        `posture:${posture}`,
        `telemetry:${implementation.runtimeProfile.rollout.featureFlag}`,
        `kpi-focus:${implementation.runtimeProfile.kpiFocus.join(';')}`
    ];
}

function derivePriority(posture: SkillPosture): SkillPriority {
    if (posture === 'critical') return 'P0';
    if (posture === 'review_required') return 'P1';
    return 'P2';
}

export function executeSkillImplementation(
    implementation: SkillImplementation,
    input: SkillExecutionInput = {}
): SkillExecutionOutput {
    const profile = implementation.runtimeProfile;
    const weights = normalizeWeights(profile.scoringWeights);
    const signals = resolveSignals(implementation, input);

    const truthScore = roundScore(
        signals.signalQuality * 0.4
        + signals.evidenceCoverage * 0.35
        + signals.confidenceHealth * 0.25
    );
    const executionScore = roundScore(
        signals.operationalReadiness * 0.45
        + (100 - signals.resourcePressure) * 0.35
        + signals.urgency * 0.2
    );
    const safetyScore = roundScore(
        (100 - signals.harmPotential) * 0.55
        + signals.confidenceHealth * 0.2
        + (100 - signals.humanApprovalLatency) * 0.25
    );
    const impactScore = roundScore(
        signals.impactPotential * 0.6
        + signals.operationalReadiness * 0.2
        + signals.signalQuality * 0.2
    );
    const riskScore = roundScore(
        signals.harmPotential * 0.45
        + signals.resourcePressure * 0.3
        + (100 - signals.signalQuality) * 0.15
        + signals.humanApprovalLatency * 0.1
    );

    const overallScore = roundScore(
        truthScore * weights.truth
        + executionScore * weights.execution
        + safetyScore * weights.safety
        + impactScore * weights.impact
    );

    const posture = derivePosture(overallScore, riskScore, profile.postureThresholds);
    const runId = randomUUID();
    const missionId = input.missionId || `mission-${implementation.skillId}`;
    const generatedAt = new Date().toISOString();

    return {
        runId,
        missionId,
        skillId: implementation.skillId,
        skillName: implementation.skillName,
        title: implementation.title,
        domain: implementation.domain,
        domainSlug: implementation.domainSlug,
        archetype: profile.archetype,
        posture,
        scores: {
            truthScore,
            executionScore,
            safetyScore,
            impactScore,
            riskScore,
            overallScore
        },
        signals,
        kpiFocus: profile.kpiFocus,
        deliverables: deriveDeliverables(implementation, posture, overallScore),
        actions: deriveActions(implementation, posture),
        approvalGates: profile.orchestration.approvalGates,
        routingTag: profile.orchestration.routingTag,
        rollbackStrategy: profile.orchestration.rollbackStrategy,
        generatedAt
    };
}

export function skillExecutionToTasks(
    execution: SkillExecutionOutput,
    options: SkillExecutionTaskOptions = {}
): SkillExecutionTask[] {
    const from = options.fromAgentId || DEFAULT_FROM_AGENT;
    const to = options.toAgentId || `agent:${execution.domainSlug}-swarm`;
    const priority = derivePriority(execution.posture);

    const tasks: SkillExecutionTask[] = [
        {
            kind: 'task_request',
            id: `${execution.runId}:contract`,
            from,
            to,
            task: `Validate runtime contract for ${execution.title}`,
            priority,
            context: {
                skillId: execution.skillId,
                requiredSignals: execution.signals,
                kpiFocus: execution.kpiFocus
            }
        },
        {
            kind: 'task_request',
            id: `${execution.runId}:execution`,
            from,
            to,
            task: `Execute ${execution.archetype} workflow`,
            priority,
            context: {
                score: execution.scores.overallScore,
                posture: execution.posture,
                actions: execution.actions
            }
        },
        {
            kind: 'task_request',
            id: `${execution.runId}:report`,
            from,
            to,
            task: `Publish deliverables for ${execution.title}`,
            priority,
            context: {
                deliverables: execution.deliverables,
                routingTag: execution.routingTag,
                approvalGates: execution.approvalGates
            }
        }
    ];

    if (execution.posture !== 'ready') {
        tasks.push({
            kind: 'task_request',
            id: `${execution.runId}:oversight`,
            from,
            to: 'agent:human-oversight',
            task: `Escalate ${execution.title} posture ${execution.posture}`,
            priority: 'P0',
            context: {
                skillId: execution.skillId,
                score: execution.scores,
                rollbackStrategy: execution.rollbackStrategy
            }
        });
    }

    return tasks;
}
