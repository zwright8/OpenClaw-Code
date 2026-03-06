import type {
    SkillExecutionInput,
    SkillExecutionTask,
    SkillImplementation,
    SkillPriority,
    SkillRolloutLane,
    SkillRolloutPlan,
    SkillRolloutPlanEntry,
    SkillRolloutScenario
} from './types.js';
import { executeSkillImplementation } from './engine.js';

type PlannerOptions = {
    scenarios?: SkillRolloutScenario[];
};

type TaskOptions = {
    fromAgentId?: string;
};

const DEFAULT_FROM_AGENT = 'agent:skills-rollout-planner';

const BASELINE_INPUT: Required<Omit<SkillExecutionInput, 'missionId'>> = {
    signalQuality: 68,
    evidenceCoverage: 70,
    confidenceHealth: 66,
    operationalReadiness: 64,
    harmPotential: 34,
    resourcePressure: 42,
    urgency: 58,
    impactPotential: 70,
    humanApprovalLatency: 28
};

export const DEFAULT_SKILL_ROLLOUT_SCENARIOS: SkillRolloutScenario[] = [
    {
        name: 'stability',
        weight: 0.35,
        input: {
            ...BASELINE_INPUT,
            signalQuality: 82,
            evidenceCoverage: 84,
            confidenceHealth: 79,
            operationalReadiness: 76,
            harmPotential: 24,
            resourcePressure: 30,
            urgency: 50,
            impactPotential: 79,
            humanApprovalLatency: 18
        }
    },
    {
        name: 'baseline',
        weight: 0.4,
        input: {
            ...BASELINE_INPUT
        }
    },
    {
        name: 'stress',
        weight: 0.25,
        input: {
            ...BASELINE_INPUT,
            signalQuality: 54,
            evidenceCoverage: 52,
            confidenceHealth: 50,
            operationalReadiness: 48,
            harmPotential: 56,
            resourcePressure: 64,
            urgency: 74,
            impactPotential: 60,
            humanApprovalLatency: 44
        }
    }
];

function clamp(value: number, min = 0, max = 100): number {
    return Math.max(min, Math.min(max, value));
}

function roundScore(value: number): number {
    return clamp(Math.round(value), 0, 100);
}

function normalizeScenarios(scenarios: SkillRolloutScenario[]): SkillRolloutScenario[] {
    const scoped = scenarios.length > 0 ? scenarios : DEFAULT_SKILL_ROLLOUT_SCENARIOS;
    const totalWeight = scoped.reduce((sum, scenario) => sum + Math.max(0.001, scenario.weight), 0);

    return scoped.map((scenario, index) => ({
        name: scenario.name || `scenario-${index + 1}`,
        weight: Number((Math.max(0.001, scenario.weight) / totalWeight).toFixed(4)),
        input: {
            signalQuality: clamp(Number(scenario.input.signalQuality)),
            evidenceCoverage: clamp(Number(scenario.input.evidenceCoverage)),
            confidenceHealth: clamp(Number(scenario.input.confidenceHealth)),
            operationalReadiness: clamp(Number(scenario.input.operationalReadiness)),
            harmPotential: clamp(Number(scenario.input.harmPotential)),
            resourcePressure: clamp(Number(scenario.input.resourcePressure)),
            urgency: clamp(Number(scenario.input.urgency)),
            impactPotential: clamp(Number(scenario.input.impactPotential)),
            humanApprovalLatency: clamp(Number(scenario.input.humanApprovalLatency))
        }
    }));
}

function scenarioInputForSkill(
    skillId: number,
    scenario: SkillRolloutScenario,
    scenarioIndex: number
): Required<Omit<SkillExecutionInput, 'missionId'>> {
    const applyJitter = (base: number, offset: number) => {
        const raw = ((skillId * (offset + 3) * (scenarioIndex + 5)) % 13) - 6;
        return clamp(base + raw);
    };

    return {
        signalQuality: applyJitter(scenario.input.signalQuality, 0),
        evidenceCoverage: applyJitter(scenario.input.evidenceCoverage, 1),
        confidenceHealth: applyJitter(scenario.input.confidenceHealth, 2),
        operationalReadiness: applyJitter(scenario.input.operationalReadiness, 3),
        harmPotential: applyJitter(scenario.input.harmPotential, 4),
        resourcePressure: applyJitter(scenario.input.resourcePressure, 5),
        urgency: applyJitter(scenario.input.urgency, 6),
        impactPotential: applyJitter(scenario.input.impactPotential, 7),
        humanApprovalLatency: applyJitter(scenario.input.humanApprovalLatency, 8)
    };
}

function deriveLane(args: {
    weightedOverall: number;
    weightedRisk: number;
    readyCount: number;
    reviewCount: number;
    criticalCount: number;
    scenarioCount: number;
}): { lane: SkillRolloutLane; reasons: string[]; } {
    const reasons: string[] = [];
    const {
        weightedOverall,
        weightedRisk,
        readyCount,
        reviewCount,
        criticalCount,
        scenarioCount
    } = args;

    if (criticalCount > 0) {
        reasons.push('critical posture reached in at least one scenario');
    }
    if (weightedRisk >= 64) {
        reasons.push(`weighted risk index ${weightedRisk} exceeds hold threshold`);
    }
    if (weightedOverall < 58) {
        reasons.push(`weighted readiness index ${weightedOverall} below minimum viable threshold`);
    }

    if (reasons.length > 0) {
        return { lane: 'hold', reasons };
    }

    if (
        weightedOverall >= 67
        && weightedRisk <= 36
        && readyCount >= 1
        && reviewCount <= Math.max(2, scenarioCount - 1)
    ) {
        return {
            lane: 'now',
            reasons: ['high weighted readiness with low aggregate risk']
        };
    }

    return {
        lane: 'next',
        reasons: ['requires additional verification before immediate rollout']
    };
}

function laneToPriority(lane: SkillRolloutLane): SkillPriority {
    if (lane === 'hold') return 'P0';
    if (lane === 'next') return 'P1';
    return 'P2';
}

function sortByLane(entries: SkillRolloutPlanEntry[]): SkillRolloutPlanEntry[] {
    const laneRank: Record<SkillRolloutLane, number> = {
        hold: 0,
        next: 1,
        now: 2
    };
    return entries.slice().sort((a, b) => {
        const rankDelta = laneRank[a.lane] - laneRank[b.lane];
        if (rankDelta !== 0) return rankDelta;
        if (a.lane === 'hold') return b.riskIndex - a.riskIndex;
        if (a.lane === 'next') return b.readinessIndex - a.readinessIndex;
        return b.readinessIndex - a.readinessIndex;
    });
}

export function buildSkillRolloutPlan(
    implementations: SkillImplementation[],
    options: PlannerOptions = {}
): SkillRolloutPlan {
    const scenarios = normalizeScenarios(options.scenarios || DEFAULT_SKILL_ROLLOUT_SCENARIOS);
    const entries: SkillRolloutPlanEntry[] = [];
    const domainCounts = new Map<string, number>();
    const archetypeCounts = new Map<string, number>();

    for (const implementation of implementations) {
        const assessments = scenarios.map((scenario, scenarioIndex) => {
            const execution = executeSkillImplementation(
                implementation,
                {
                    ...scenarioInputForSkill(implementation.skillId, scenario, scenarioIndex),
                    missionId: `rollout-${scenario.name}-${String(implementation.skillId).padStart(4, '0')}`
                }
            );
            return {
                scenario: scenario.name,
                posture: execution.posture,
                overallScore: execution.scores.overallScore,
                riskScore: execution.scores.riskScore
            };
        });

        const weightedOverall = roundScore(
            assessments.reduce((sum, assessment, index) => sum + assessment.overallScore * scenarios[index].weight, 0)
        );
        const weightedRisk = roundScore(
            assessments.reduce((sum, assessment, index) => sum + assessment.riskScore * scenarios[index].weight, 0)
        );
        const postureDistribution = {
            ready: assessments.filter((assessment) => assessment.posture === 'ready').length,
            review_required: assessments.filter((assessment) => assessment.posture === 'review_required').length,
            critical: assessments.filter((assessment) => assessment.posture === 'critical').length
        };

        const { lane, reasons } = deriveLane({
            weightedOverall,
            weightedRisk,
            readyCount: postureDistribution.ready,
            reviewCount: postureDistribution.review_required,
            criticalCount: postureDistribution.critical,
            scenarioCount: scenarios.length
        });

        const requiredApprovalGates = Array.from(new Set([
            ...implementation.runtimeProfile.orchestration.approvalGates,
            ...(lane !== 'now' ? ['human-oversight-workbench'] : [])
        ]));

        entries.push({
            skillId: implementation.skillId,
            skillName: implementation.skillName,
            title: implementation.title,
            domain: implementation.domain,
            domainSlug: implementation.domainSlug,
            archetype: implementation.runtimeProfile.archetype,
            lane,
            priority: laneToPriority(lane),
            readinessIndex: weightedOverall,
            riskIndex: weightedRisk,
            postureDistribution,
            requiredApprovalGates,
            featureFlag: implementation.runtimeProfile.rollout.featureFlag,
            reasons,
            assessments
        });

        domainCounts.set(implementation.domain, (domainCounts.get(implementation.domain) || 0) + 1);
        archetypeCounts.set(
            implementation.runtimeProfile.archetype,
            (archetypeCounts.get(implementation.runtimeProfile.archetype) || 0) + 1
        );
    }

    const ordered = sortByLane(entries);
    const laneCounts = {
        now: ordered.filter((entry) => entry.lane === 'now').length,
        next: ordered.filter((entry) => entry.lane === 'next').length,
        hold: ordered.filter((entry) => entry.lane === 'hold').length
    };

    const topDomains = Array.from(domainCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25)
        .map(([domain, count]) => ({ domain, count }));
    const topArchetypes = Array.from(archetypeCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25)
        .map(([archetype, count]) => ({ archetype, count }));

    return {
        generatedAt: new Date().toISOString(),
        totalSkills: ordered.length,
        scenarios,
        summary: {
            laneCounts,
            topDomains,
            topArchetypes
        },
        entries: ordered
    };
}

export function rolloutPlanToTasks(
    plan: SkillRolloutPlan,
    options: TaskOptions = {}
): SkillExecutionTask[] {
    const fromAgentId = options.fromAgentId || DEFAULT_FROM_AGENT;

    return plan.entries.map((entry) => {
        const taskAction = entry.lane === 'now'
            ? 'Deploy skill runtime profile to production lane'
            : entry.lane === 'next'
                ? 'Stage skill runtime profile for next release with additional validation'
                : 'Open remediation and oversight workflow before deployment';
        const target = entry.lane === 'hold'
            ? 'agent:human-oversight'
            : `agent:${entry.domainSlug}-swarm`;

        return {
            kind: 'task_request',
            id: `rollout-${String(entry.skillId).padStart(4, '0')}`,
            from: fromAgentId,
            to: target,
            task: `${taskAction}: ${entry.title}`,
            priority: entry.priority,
            context: {
                skillId: entry.skillId,
                skillName: entry.skillName,
                lane: entry.lane,
                readinessIndex: entry.readinessIndex,
                riskIndex: entry.riskIndex,
                featureFlag: entry.featureFlag,
                reasons: entry.reasons,
                requiredApprovalGates: entry.requiredApprovalGates,
                postureDistribution: entry.postureDistribution,
                assessments: entry.assessments
            }
        };
    });
}
