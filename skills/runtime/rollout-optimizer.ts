import type {
    SkillExecutionTask,
    SkillPriority,
    SkillRolloutControlSummary,
    SkillRolloutControlRun,
    SkillRolloutOptimizationCandidate,
    SkillRolloutOptimizationRecommendation,
    SkillRolloutOptimizationRun,
    SkillRolloutOptimizationStrategy,
    SkillRolloutPromotionDecision,
    SkillRolloutPromotionPolicy,
    SkillRolloutPromotionRobustness,
    SkillRolloutPromotionRobustnessScenario,
    SkillRolloutWaveConfig,
    SkillRolloutWaveEntry,
    SkillRolloutWavePlan
} from './types.js';

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function roundRate(value: number): number {
    return Number(clamp(value, 0, 1).toFixed(4));
}

function roundMetric(value: number): number {
    return Number(value.toFixed(4));
}

function toInt(value: number): number {
    return Math.floor(Number(value));
}

function normalizeConfig(config: SkillRolloutWaveConfig): SkillRolloutWaveConfig {
    return {
        nowWaveCapacity: Math.max(8, toInt(config.nowWaveCapacity)),
        nextWaveCapacity: Math.max(8, toInt(config.nextWaveCapacity)),
        maxPerDomainPerWave: Math.max(1, toInt(config.maxPerDomainPerWave))
    };
}

function posturePenalty(posture: SkillRolloutControlSummary['overallPosture']): number {
    if (posture === 'critical') return 1_000;
    if (posture === 'degraded') return 400;
    return 0;
}

export function scoreRolloutControlForOptimization(controlRun: SkillRolloutControlRun): number {
    const summary = controlRun.summary;
    return Number((
        posturePenalty(summary.overallPosture)
        + summary.wavePostureCounts.critical * 220
        + summary.wavePostureCounts.degraded * 70
        + summary.failedCount * 10
        + summary.approvalPendingCount * 2.5
        + summary.skippedCount * 0.8
        + summary.totalTasks * 0.02
    ).toFixed(3));
}

export type SkillRolloutPromotionScenarioInput = {
    name: string;
    failBias: number;
    approvalBias: number;
    trials: number;
    weight: number;
};

export function defaultRolloutPromotionScenarios(): SkillRolloutPromotionScenarioInput[] {
    return [
        {
            name: 'nominal',
            failBias: 0,
            approvalBias: 0,
            trials: 4,
            weight: 0.3
        },
        {
            name: 'failure_spike',
            failBias: 0.16,
            approvalBias: 0.04,
            trials: 4,
            weight: 0.25
        },
        {
            name: 'approval_backlog',
            failBias: 0.04,
            approvalBias: 0.2,
            trials: 4,
            weight: 0.2
        },
        {
            name: 'mixed_pressure',
            failBias: 0.1,
            approvalBias: 0.14,
            trials: 4,
            weight: 0.15
        },
        {
            name: 'recovery_bias',
            failBias: -0.08,
            approvalBias: -0.05,
            trials: 3,
            weight: 0.1
        }
    ];
}

function normalizeRobustnessScenarios(
    scenarios: SkillRolloutPromotionRobustnessScenario[]
): SkillRolloutPromotionRobustnessScenario[] {
    if (scenarios.length === 0) return [];
    const totalWeight = scenarios.reduce((sum, scenario) => sum + Math.max(0.001, scenario.weight), 0);
    return scenarios.map((scenario) => ({
        ...scenario,
        weight: roundMetric(Math.max(0.001, scenario.weight) / totalWeight)
    }));
}

export function buildRolloutPromotionPolicy(
    strategy: SkillRolloutOptimizationStrategy
): SkillRolloutPromotionPolicy {
    if (strategy === 'stabilize') {
        return {
            minCandidateWinRate: 0.55,
            maxWeightedScoreDelta: 0.5,
            maxWorstScoreDelta: 45,
            maxAvgFailureRateDelta: 0.01,
            maxAvgCriticalWaveDelta: 0.15
        };
    }
    if (strategy === 'expand') {
        return {
            minCandidateWinRate: 0.58,
            maxWeightedScoreDelta: 4,
            maxWorstScoreDelta: 90,
            maxAvgFailureRateDelta: 0.02,
            maxAvgCriticalWaveDelta: 0.25
        };
    }
    return {
        minCandidateWinRate: 0.5,
        maxWeightedScoreDelta: 2,
        maxWorstScoreDelta: 65,
        maxAvgFailureRateDelta: 0.015,
        maxAvgCriticalWaveDelta: 0.2
    };
}

export function decideRolloutPromotion(args: {
    recommendation: SkillRolloutOptimizationRecommendation;
    selectedConfig: SkillRolloutWaveConfig;
    baselineConfig: SkillRolloutWaveConfig;
    robustness: SkillRolloutPromotionRobustness;
    policy?: SkillRolloutPromotionPolicy;
    forcePromote?: boolean;
}): SkillRolloutPromotionDecision {
    const policy = args.policy || buildRolloutPromotionPolicy(args.recommendation.strategy);
    const robustness = {
        ...args.robustness,
        candidateWinRate: roundRate(args.robustness.candidateWinRate),
        weightedScoreDelta: roundMetric(args.robustness.weightedScoreDelta),
        worstScoreDelta: roundMetric(args.robustness.worstScoreDelta),
        avgFailureRateDelta: roundMetric(args.robustness.avgFailureRateDelta),
        avgApprovalPendingRateDelta: roundMetric(args.robustness.avgApprovalPendingRateDelta),
        avgCriticalWaveDelta: roundMetric(args.robustness.avgCriticalWaveDelta),
        scenarios: normalizeRobustnessScenarios(args.robustness.scenarios)
    };

    const violations: string[] = [];
    if (robustness.candidateWinRate < policy.minCandidateWinRate) {
        violations.push(
            `candidate win-rate ${robustness.candidateWinRate} below required ${policy.minCandidateWinRate}`
        );
    }
    if (robustness.weightedScoreDelta > policy.maxWeightedScoreDelta) {
        violations.push(
            `weighted score delta ${robustness.weightedScoreDelta} exceeds max ${policy.maxWeightedScoreDelta}`
        );
    }
    if (robustness.worstScoreDelta > policy.maxWorstScoreDelta) {
        violations.push(
            `worst-case score delta ${robustness.worstScoreDelta} exceeds max ${policy.maxWorstScoreDelta}`
        );
    }
    if (robustness.avgFailureRateDelta > policy.maxAvgFailureRateDelta) {
        violations.push(
            `avg failure-rate delta ${robustness.avgFailureRateDelta} exceeds max ${policy.maxAvgFailureRateDelta}`
        );
    }
    if (robustness.avgCriticalWaveDelta > policy.maxAvgCriticalWaveDelta) {
        violations.push(
            `avg critical-wave delta ${robustness.avgCriticalWaveDelta} exceeds max ${policy.maxAvgCriticalWaveDelta}`
        );
    }

    const forcePromote = args.forcePromote === true;
    const status = (violations.length === 0 || forcePromote) ? 'approved' : 'rejected';

    const rationale = [
        `strategy=${args.recommendation.strategy}`,
        `robustness trials=${robustness.evaluatedTrials} across ${robustness.scenarioCount} scenarios`,
        `weightedScoreDelta=${robustness.weightedScoreDelta}, winRate=${robustness.candidateWinRate}`
    ];
    if (forcePromote && violations.length > 0) {
        rationale.push('promotion forced by operator override despite policy violations');
    } else if (status === 'approved') {
        rationale.push('candidate satisfies promotion policy thresholds');
    } else {
        rationale.push('candidate rejected by promotion policy; baseline config retained');
    }

    return {
        generatedAt: new Date().toISOString(),
        status,
        selectedConfig: normalizeConfig(args.selectedConfig),
        baselineConfig: normalizeConfig(args.baselineConfig),
        effectiveConfig: normalizeConfig(status === 'approved' ? args.selectedConfig : args.baselineConfig),
        policy,
        robustness,
        violations,
        rationale
    };
}

export function recommendRolloutWaveConfig(
    controlRun: SkillRolloutControlRun,
    wavePlan: SkillRolloutWavePlan
): SkillRolloutOptimizationRecommendation {
    const currentConfig = normalizeConfig(wavePlan.config);
    const totalTasks = Math.max(1, controlRun.summary.totalTasks);
    const failureRate = controlRun.summary.failedCount / totalTasks;
    const approvalPendingRate = controlRun.summary.approvalPendingCount / totalTasks;
    const criticalWaves = controlRun.summary.wavePostureCounts.critical;
    const degradedWaves = controlRun.summary.wavePostureCounts.degraded;
    const avgWaveFillRate = wavePlan.summary.avgWaveFillRate;

    let strategy: SkillRolloutOptimizationStrategy = 'balance';
    let recommended: SkillRolloutWaveConfig = { ...currentConfig };
    const reasons: string[] = [];

    if (criticalWaves > 0 || failureRate >= 0.12) {
        strategy = 'stabilize';
        recommended.nowWaveCapacity = Math.max(8, currentConfig.nowWaveCapacity - 6);
        recommended.nextWaveCapacity = Math.max(8, currentConfig.nextWaveCapacity - 10);
        recommended.maxPerDomainPerWave = Math.max(1, currentConfig.maxPerDomainPerWave - 1);
        reasons.push('critical waves and/or elevated failure rate indicate excessive rollout blast radius');
    } else if (approvalPendingRate >= 0.26) {
        strategy = 'stabilize';
        recommended.nowWaveCapacity = Math.max(8, currentConfig.nowWaveCapacity - 4);
        recommended.nextWaveCapacity = Math.max(8, currentConfig.nextWaveCapacity - 6);
        recommended.maxPerDomainPerWave = Math.max(1, currentConfig.maxPerDomainPerWave - 1);
        reasons.push('approval backlog indicates reviewer saturation; reduce concurrent rollout pressure');
    } else if (failureRate <= 0.04 && approvalPendingRate <= 0.14 && avgWaveFillRate >= 0.8) {
        strategy = 'expand';
        recommended.nowWaveCapacity = currentConfig.nowWaveCapacity + 4;
        recommended.nextWaveCapacity = currentConfig.nextWaveCapacity + 6;
        recommended.maxPerDomainPerWave = currentConfig.maxPerDomainPerWave + 1;
        reasons.push('healthy rollout metrics support measured capacity expansion');
    } else {
        strategy = 'balance';
        if (degradedWaves > 0) {
            recommended.nextWaveCapacity = Math.max(8, currentConfig.nextWaveCapacity - 2);
            reasons.push('degraded waves suggest slight reduction in next-lane concurrency');
        }
        if (avgWaveFillRate < 0.68) {
            recommended.nowWaveCapacity = currentConfig.nowWaveCapacity + 2;
            reasons.push('low fill-rate indicates wave fragmentation; increase now-lane packing efficiency');
        } else {
            recommended.nowWaveCapacity = Math.max(8, currentConfig.nowWaveCapacity - 2);
            reasons.push('maintain stricter now-lane gates while preserving throughput');
        }
    }

    recommended = normalizeConfig(recommended);
    if (
        recommended.nowWaveCapacity === currentConfig.nowWaveCapacity
        && recommended.nextWaveCapacity === currentConfig.nextWaveCapacity
        && recommended.maxPerDomainPerWave === currentConfig.maxPerDomainPerWave
    ) {
        if (strategy === 'expand') {
            recommended.nowWaveCapacity += 2;
        } else {
            recommended.nextWaveCapacity = Math.max(8, recommended.nextWaveCapacity - 2);
        }
        reasons.push('applied tie-breaker config adjustment to force a measurable optimization attempt');
    }

    const targetFailureRate = strategy === 'stabilize'
        ? roundRate(Math.max(0, failureRate - 0.02))
        : strategy === 'expand'
            ? roundRate(Math.min(1, failureRate + 0.005))
            : roundRate(Math.max(0, failureRate - 0.01));
    const targetApprovalRate = strategy === 'stabilize'
        ? roundRate(Math.max(0, approvalPendingRate - 0.08))
        : strategy === 'expand'
            ? roundRate(Math.min(1, approvalPendingRate + 0.01))
            : roundRate(Math.max(0, approvalPendingRate - 0.03));
    const targetFill = strategy === 'stabilize'
        ? roundRate(Math.max(0, avgWaveFillRate - 0.03))
        : strategy === 'expand'
            ? roundRate(Math.min(1, avgWaveFillRate + 0.06))
            : roundRate(Math.min(1, avgWaveFillRate + 0.02));

    return {
        generatedAt: new Date().toISOString(),
        strategy,
        currentConfig,
        recommendedConfig: recommended,
        reasons,
        observedMetrics: {
            failureRate: roundRate(failureRate),
            approvalPendingRate: roundRate(approvalPendingRate),
            criticalWaves,
            degradedWaves,
            avgWaveFillRate: roundRate(avgWaveFillRate)
        },
        targetMetrics: {
            failureRate: targetFailureRate,
            approvalPendingRate: targetApprovalRate,
            avgWaveFillRate: targetFill
        }
    };
}

export function buildRolloutOptimizationRun(args: {
    recommendation: SkillRolloutOptimizationRecommendation;
    baselineWavePlan: SkillRolloutWavePlan;
    baselineControlRun: SkillRolloutControlRun;
    candidateWavePlan: SkillRolloutWavePlan;
    candidateControlRun: SkillRolloutControlRun;
    search: {
        baselineScore: number;
        selectedScore: number;
        selectedConfig: SkillRolloutWaveConfig;
        candidates: SkillRolloutOptimizationCandidate[];
    };
    promotion: SkillRolloutPromotionDecision;
}): SkillRolloutOptimizationRun {
    const {
        recommendation,
        baselineWavePlan,
        baselineControlRun,
        candidateWavePlan,
        candidateControlRun,
        search,
        promotion
    } = args;

    return {
        generatedAt: new Date().toISOString(),
        recommendation,
        baseline: {
            wavePlanGeneratedAt: baselineWavePlan.generatedAt,
            controlGeneratedAt: baselineControlRun.generatedAt,
            waveSummary: baselineWavePlan.summary,
            controlSummary: baselineControlRun.summary
        },
        candidate: {
            wavePlanGeneratedAt: candidateWavePlan.generatedAt,
            controlGeneratedAt: candidateControlRun.generatedAt,
            waveSummary: candidateWavePlan.summary,
            controlSummary: candidateControlRun.summary
        },
        delta: {
            waveCountDelta: candidateWavePlan.waves.length - baselineWavePlan.waves.length,
            taskCountDelta: candidateControlRun.summary.totalTasks - baselineControlRun.summary.totalTasks,
            failureDelta: candidateControlRun.summary.failedCount - baselineControlRun.summary.failedCount,
            approvalPendingDelta: candidateControlRun.summary.approvalPendingCount - baselineControlRun.summary.approvalPendingCount,
            skippedDelta: candidateControlRun.summary.skippedCount - baselineControlRun.summary.skippedCount,
            criticalWavesDelta: candidateControlRun.summary.wavePostureCounts.critical - baselineControlRun.summary.wavePostureCounts.critical,
            degradedWavesDelta: candidateControlRun.summary.wavePostureCounts.degraded - baselineControlRun.summary.wavePostureCounts.degraded,
            stableWavesDelta: candidateControlRun.summary.wavePostureCounts.stable - baselineControlRun.summary.wavePostureCounts.stable
        },
        search: {
            baselineScore: search.baselineScore,
            selectedScore: search.selectedScore,
            scoreDelta: Number((search.selectedScore - search.baselineScore).toFixed(3)),
            selectedConfig: search.selectedConfig,
            evaluatedCount: search.candidates.length,
            candidates: search.candidates
        },
        promotion
    };
}

type PromotionTaskOptions = {
    fromAgentId?: string;
    maxSkillTasks?: number;
};

const DEFAULT_PROMOTION_TASK_OPTIONS: Required<PromotionTaskOptions> = {
    fromAgentId: 'agent:skills-rollout-promotion',
    maxSkillTasks: 80
};

function normalizeTaskLimit(value: number): number {
    return Math.max(20, Math.floor(Number(value)));
}

function priorityForPromotionEntry(entry: SkillRolloutWaveEntry): SkillPriority {
    if (entry.riskIndex >= 65) return 'P0';
    if (entry.riskIndex >= 50) return 'P1';
    return 'P2';
}

function topRiskEntries(wavePlan: SkillRolloutWavePlan, limit: number): SkillRolloutWaveEntry[] {
    return wavePlan.waves
        .flatMap((wave) => wave.entries)
        .slice()
        .sort((a, b) => {
            const riskDelta = b.riskIndex - a.riskIndex;
            if (riskDelta !== 0) return riskDelta;
            const readinessDelta = b.readinessIndex - a.readinessIndex;
            if (readinessDelta !== 0) return readinessDelta;
            return a.skillId - b.skillId;
        })
        .slice(0, limit);
}

export function rolloutPromotionToTasks(args: {
    optimization: SkillRolloutOptimizationRun;
    baselineWavePlan: SkillRolloutWavePlan;
    selectedWavePlan: SkillRolloutWavePlan;
    options?: PromotionTaskOptions;
}): SkillExecutionTask[] {
    const options = {
        ...DEFAULT_PROMOTION_TASK_OPTIONS,
        ...(args.options || {}),
        maxSkillTasks: normalizeTaskLimit(
            Number(args.options?.maxSkillTasks ?? DEFAULT_PROMOTION_TASK_OPTIONS.maxSkillTasks)
        )
    };
    const tasks: SkillExecutionTask[] = [];
    const promotion = args.optimization.promotion;

    tasks.push({
        kind: 'task_request',
        id: 'promotion-decision-publish',
        from: options.fromAgentId,
        to: 'agent:rollout-controller',
        task: `Publish rollout promotion decision (${promotion.status})`,
        priority: promotion.status === 'approved' ? 'P1' : 'P0',
        context: {
            status: promotion.status,
            strategy: args.optimization.recommendation.strategy,
            selectedConfig: promotion.selectedConfig,
            effectiveConfig: promotion.effectiveConfig,
            policy: promotion.policy,
            violations: promotion.violations,
            rationale: promotion.rationale
        }
    });

    if (promotion.status === 'approved') {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-apply-selected-config',
            from: options.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Apply selected rollout config and schedule production promotion wave',
            priority: 'P1',
            context: {
                selectedConfig: promotion.selectedConfig,
                effectiveConfig: promotion.effectiveConfig,
                robustness: promotion.robustness
            }
        });

        for (const entry of topRiskEntries(args.selectedWavePlan, options.maxSkillTasks)) {
            tasks.push({
                kind: 'task_request',
                id: `promotion-verify-${String(entry.skillId).padStart(4, '0')}`,
                from: options.fromAgentId,
                to: `agent:${entry.domainSlug}-swarm`,
                task: `Verify promoted rollout guardrails for ${entry.title}`,
                priority: priorityForPromotionEntry(entry),
                context: {
                    skillId: entry.skillId,
                    skillName: entry.skillName,
                    waveId: entry.waveId,
                    readinessIndex: entry.readinessIndex,
                    riskIndex: entry.riskIndex,
                    effectiveConfig: promotion.effectiveConfig
                }
            });
        }
    } else {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-retain-baseline-config',
            from: options.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Retain baseline rollout config and freeze promotion',
            priority: 'P0',
            context: {
                baselineConfig: promotion.baselineConfig,
                selectedConfig: promotion.selectedConfig,
                violations: promotion.violations
            }
        });
        tasks.push({
            kind: 'task_request',
            id: 'promotion-policy-investigation',
            from: options.fromAgentId,
            to: 'agent:human-oversight',
            task: 'Investigate rollout promotion policy violations and propose remediations',
            priority: 'P0',
            context: {
                strategy: args.optimization.recommendation.strategy,
                violations: promotion.violations,
                robustness: promotion.robustness
            }
        });

        for (const entry of topRiskEntries(args.selectedWavePlan, options.maxSkillTasks)) {
            tasks.push({
                kind: 'task_request',
                id: `promotion-shadow-${String(entry.skillId).padStart(4, '0')}`,
                from: options.fromAgentId,
                to: `agent:${entry.domainSlug}-swarm`,
                task: `Run shadow validation for rejected promotion candidate on ${entry.title}`,
                priority: priorityForPromotionEntry(entry),
                context: {
                    skillId: entry.skillId,
                    skillName: entry.skillName,
                    waveId: entry.waveId,
                    readinessIndex: entry.readinessIndex,
                    riskIndex: entry.riskIndex,
                    baselineConfig: promotion.baselineConfig,
                    selectedConfig: promotion.selectedConfig
                }
            });
        }
    }

    tasks.push({
        kind: 'task_request',
        id: 'promotion-audit-log',
        from: options.fromAgentId,
        to: 'agent:rollout-controller',
        task: 'Write promotion decision audit trail and compliance evidence bundle',
        priority: promotion.status === 'approved' ? 'P1' : 'P0',
        context: {
            status: promotion.status,
            policy: promotion.policy,
            robustness: promotion.robustness,
            baselineWaveCount: args.baselineWavePlan.waves.length,
            selectedWaveCount: args.selectedWavePlan.waves.length
        }
    });

    return tasks;
}
