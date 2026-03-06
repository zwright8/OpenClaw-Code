import type {
    SkillExecutionTask,
    SkillRolloutPromotionPolicy,
    SkillRolloutPromotionPolicyCanaryDecision,
    SkillRolloutPromotionPolicyCanaryRun,
    SkillRolloutPromotionPolicyCanaryScenario,
    SkillRolloutPromotionPolicyDriftReport,
    SkillRolloutPromotionPolicyHistory,
    SkillRolloutPromotionPolicyLabRun
} from './types.js';

type CanaryOptions = {
    sampleSize?: number;
};

type CanaryTaskOptions = {
    fromAgentId?: string;
    maxScenarioTasks?: number;
};

const DEFAULT_CANARY_OPTIONS: Required<CanaryOptions> = {
    sampleSize: 14
};

const DEFAULT_CANARY_TASK_OPTIONS: Required<CanaryTaskOptions> = {
    fromAgentId: 'agent:skills-rollout-promotion-canary',
    maxScenarioTasks: 4
};

function clamp(value: number, min = 0, max = 1): number {
    return Math.max(min, Math.min(max, value));
}

function roundRate(value: number): number {
    return Number(clamp(value).toFixed(4));
}

function roundMetric(value: number): number {
    return Number(value.toFixed(4));
}

function roundScore(value: number): number {
    return Number(value.toFixed(3));
}

function average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizePolicy(policy: SkillRolloutPromotionPolicy): SkillRolloutPromotionPolicy {
    return {
        minCandidateWinRate: roundRate(clamp(policy.minCandidateWinRate, 0.45, 0.8)),
        maxWeightedScoreDelta: roundMetric(clamp(policy.maxWeightedScoreDelta, 0.1, 20)),
        maxWorstScoreDelta: roundMetric(clamp(policy.maxWorstScoreDelta, 20, 280)),
        maxAvgFailureRateDelta: roundRate(clamp(policy.maxAvgFailureRateDelta, 0.003, 0.08)),
        maxAvgCriticalWaveDelta: roundRate(clamp(policy.maxAvgCriticalWaveDelta, 0.05, 0.5))
    };
}

function policyTightness(policy: SkillRolloutPromotionPolicy): number {
    return roundMetric(
        policy.minCandidateWinRate * 6.5
        - policy.maxWeightedScoreDelta * 0.36
        - policy.maxWorstScoreDelta * 0.015
        - policy.maxAvgFailureRateDelta * 38
        - policy.maxAvgCriticalWaveDelta * 2.4
    );
}

function baseMetrics(history: SkillRolloutPromotionPolicyHistory, sampleSize: number) {
    const scoped = history.entries.slice(-Math.max(2, Math.floor(sampleSize)));
    if (scoped.length === 0) {
        return {
            failureRate: 0.06,
            approvalPendingRate: 0.12,
            successRate: 0.8,
            candidateWinRate: 0.5,
            sampleSize: 0
        };
    }

    return {
        failureRate: roundRate(average(scoped.map((entry) => entry.metrics.failureRate))),
        approvalPendingRate: roundRate(average(scoped.map((entry) => entry.metrics.approvalPendingRate))),
        successRate: roundRate(average(scoped.map((entry) => entry.metrics.successRate))),
        candidateWinRate: roundRate(average(scoped.map((entry) => entry.metrics.candidateWinRate))),
        sampleSize: scoped.length
    };
}

function driftPenalty(driftLevel: SkillRolloutPromotionPolicyDriftReport['driftLevel']): {
    failure: number;
    pending: number;
    success: number;
    win: number;
} {
    if (driftLevel === 'critical') {
        return { failure: 0.03, pending: 0.04, success: -0.025, win: -0.03 };
    }
    if (driftLevel === 'watch') {
        return { failure: 0.015, pending: 0.02, success: -0.012, win: -0.015 };
    }
    return { failure: 0, pending: 0, success: 0, win: 0 };
}

function scoreMetrics(metrics: {
    failureRate: number;
    approvalPendingRate: number;
    successRate: number;
    candidateWinRate: number;
}): number {
    return roundScore(
        metrics.failureRate * 440
        + metrics.approvalPendingRate * 180
        + (1 - metrics.successRate) * 150
        + Math.max(0, 0.55 - metrics.candidateWinRate) * 210
    );
}

function evaluateScenario(args: {
    name: string;
    weight: number;
    severityBias: number;
    baselinePolicy: SkillRolloutPromotionPolicy;
    candidatePolicy: SkillRolloutPromotionPolicy;
    base: {
        failureRate: number;
        approvalPendingRate: number;
        successRate: number;
        candidateWinRate: number;
    };
    drift: SkillRolloutPromotionPolicyDriftReport;
}): SkillRolloutPromotionPolicyCanaryScenario {
    const { name, weight, severityBias, baselinePolicy, candidatePolicy, base, drift } = args;
    const baselineTightness = policyTightness(baselinePolicy);
    const candidateTightness = policyTightness(candidatePolicy);
    const tightnessDelta = roundMetric(candidateTightness - baselineTightness);
    const driftBias = driftPenalty(drift.driftLevel);

    const baseline = {
        failureRate: roundRate(base.failureRate + severityBias * 0.012 + driftBias.failure),
        approvalPendingRate: roundRate(base.approvalPendingRate + severityBias * 0.015 + driftBias.pending),
        successRate: roundRate(base.successRate - severityBias * 0.012 + driftBias.success),
        candidateWinRate: roundRate(base.candidateWinRate - severityBias * 0.009 + driftBias.win)
    };

    const candidate = {
        failureRate: roundRate(
            baseline.failureRate - tightnessDelta * 0.012 + Math.max(0, -tightnessDelta) * 0.008
        ),
        approvalPendingRate: roundRate(
            baseline.approvalPendingRate + tightnessDelta * 0.017
        ),
        successRate: 0,
        candidateWinRate: roundRate(
            baseline.candidateWinRate + tightnessDelta * 0.01
        )
    };
    candidate.successRate = roundRate(
        baseline.successRate - candidate.failureRate * 0.14 - candidate.approvalPendingRate * 0.08 + 0.03
    );

    const baselineScore = scoreMetrics(baseline);
    const candidateScore = scoreMetrics(candidate);

    const guardrailBreaches: string[] = [];
    if (candidate.failureRate > baseline.failureRate + 0.01) {
        guardrailBreaches.push('failure_rate_regression');
    }
    if (candidate.approvalPendingRate > baseline.approvalPendingRate + 0.03) {
        guardrailBreaches.push('approval_pending_regression');
    }
    if (candidate.successRate < baseline.successRate - 0.02) {
        guardrailBreaches.push('success_rate_regression');
    }
    if (candidate.candidateWinRate < baseline.candidateWinRate - 0.02) {
        guardrailBreaches.push('candidate_win_rate_regression');
    }

    return {
        name,
        weight,
        baseline,
        candidate,
        scoreDelta: roundScore(candidateScore - baselineScore),
        guardrailBreaches
    };
}

function normalizeWeights(scenarios: SkillRolloutPromotionPolicyCanaryScenario[]): SkillRolloutPromotionPolicyCanaryScenario[] {
    const total = scenarios.reduce((sum, scenario) => sum + Math.max(0.001, scenario.weight), 0);
    return scenarios.map((scenario) => ({
        ...scenario,
        weight: roundRate(Math.max(0.001, scenario.weight) / total)
    }));
}

function canaryDecision(args: {
    drift: SkillRolloutPromotionPolicyDriftReport;
    scoreDelta: number;
    guardrailBreaches: string[];
    weightedFailureDelta: number;
    weightedPendingDelta: number;
    weightedSuccessDelta: number;
}): {
    decision: SkillRolloutPromotionPolicyCanaryDecision;
    reasons: string[];
} {
    const reasons: string[] = [];

    if (args.guardrailBreaches.length >= 3 || args.weightedFailureDelta >= 0.02 || args.weightedSuccessDelta <= -0.03) {
        reasons.push('canary detected severe quality regression against baseline guardrails');
        return { decision: args.drift.driftLevel === 'critical' ? 'rollback' : 'defer', reasons };
    }

    if (args.guardrailBreaches.length > 0) {
        reasons.push('canary exposed at least one guardrail breach; defer adoption for remediation');
        return { decision: 'defer', reasons };
    }

    if (args.scoreDelta <= -0.8 && args.weightedFailureDelta <= 0.005 && args.weightedPendingDelta <= 0.02) {
        reasons.push('candidate policy improves canary score with no meaningful guardrail regressions');
        return { decision: 'adopt', reasons };
    }

    if (args.drift.driftLevel === 'critical' && args.scoreDelta >= 0) {
        reasons.push('critical drift with non-improving canary outcome requires rollback posture');
        return { decision: 'rollback', reasons };
    }

    reasons.push('canary signal is inconclusive; defer adoption and collect more evidence');
    return { decision: 'defer', reasons };
}

export function runSkillRolloutPromotionPolicyCanary(args: {
    labRun: SkillRolloutPromotionPolicyLabRun;
    history: SkillRolloutPromotionPolicyHistory;
    drift: SkillRolloutPromotionPolicyDriftReport;
    options?: CanaryOptions;
}): SkillRolloutPromotionPolicyCanaryRun {
    const options = {
        ...DEFAULT_CANARY_OPTIONS,
        ...(args.options || {}),
        sampleSize: Math.max(2, Math.floor(Number(args.options?.sampleSize ?? DEFAULT_CANARY_OPTIONS.sampleSize)))
    };

    const base = baseMetrics(args.history, options.sampleSize);
    const baselinePolicy = normalizePolicy(args.labRun.baselinePolicy);
    const candidatePolicy = normalizePolicy(args.labRun.recommendedPolicy);

    const scenarios = normalizeWeights([
        evaluateScenario({
            name: 'nominal',
            weight: 0.32,
            severityBias: 0,
            baselinePolicy,
            candidatePolicy,
            base,
            drift: args.drift
        }),
        evaluateScenario({
            name: 'traffic_spike',
            weight: 0.22,
            severityBias: 1,
            baselinePolicy,
            candidatePolicy,
            base,
            drift: args.drift
        }),
        evaluateScenario({
            name: 'approval_burst',
            weight: 0.2,
            severityBias: 0.6,
            baselinePolicy,
            candidatePolicy,
            base: {
                ...base,
                approvalPendingRate: roundRate(base.approvalPendingRate + 0.06)
            },
            drift: args.drift
        }),
        evaluateScenario({
            name: 'incident_backpressure',
            weight: 0.18,
            severityBias: 1.3,
            baselinePolicy,
            candidatePolicy,
            base,
            drift: args.drift
        }),
        evaluateScenario({
            name: 'recovery_window',
            weight: 0.08,
            severityBias: -0.8,
            baselinePolicy,
            candidatePolicy,
            base,
            drift: args.drift
        })
    ]);

    const weighted = scenarios.reduce((acc, scenario) => {
        acc.failure += (scenario.candidate.failureRate - scenario.baseline.failureRate) * scenario.weight;
        acc.pending += (scenario.candidate.approvalPendingRate - scenario.baseline.approvalPendingRate) * scenario.weight;
        acc.success += (scenario.candidate.successRate - scenario.baseline.successRate) * scenario.weight;
        acc.win += (scenario.candidate.candidateWinRate - scenario.baseline.candidateWinRate) * scenario.weight;
        acc.score += scenario.scoreDelta * scenario.weight;
        return acc;
    }, { failure: 0, pending: 0, success: 0, win: 0, score: 0 });

    const guardrailBreaches = Array.from(new Set(scenarios.flatMap((scenario) => scenario.guardrailBreaches))).sort();
    const decision = canaryDecision({
        drift: args.drift,
        scoreDelta: roundScore(weighted.score),
        guardrailBreaches,
        weightedFailureDelta: roundMetric(weighted.failure),
        weightedPendingDelta: roundMetric(weighted.pending),
        weightedSuccessDelta: roundMetric(weighted.success)
    });

    const baselineScore = roundScore(
        scenarios.reduce((sum, scenario) => sum + scoreMetrics(scenario.baseline) * scenario.weight, 0)
    );
    const candidateScore = roundScore(
        scenarios.reduce((sum, scenario) => sum + scoreMetrics(scenario.candidate) * scenario.weight, 0)
    );

    const confidence = roundRate(
        clamp(
            0.45
            + Math.min(0.3, base.sampleSize / 20)
            + (args.drift.driftLevel === 'stable' ? 0.1 : args.drift.driftLevel === 'watch' ? 0.03 : -0.04)
            - (guardrailBreaches.length * 0.04),
            0.25,
            0.92
        )
    );

    const reasons = [
        ...decision.reasons,
        `weighted deltas failure=${roundMetric(weighted.failure)}, pending=${roundMetric(weighted.pending)}, success=${roundMetric(weighted.success)}`,
        `weighted score delta=${roundScore(weighted.score)} across ${scenarios.length} canary scenarios`
    ];

    return {
        generatedAt: new Date().toISOString(),
        sampleSize: base.sampleSize,
        driftLevel: args.drift.driftLevel,
        baselinePolicy,
        candidatePolicy,
        decision: decision.decision,
        confidence,
        baselineScore,
        candidateScore,
        scoreDelta: roundScore(candidateScore - baselineScore),
        scenarioCount: scenarios.length,
        weightedFailureDelta: roundMetric(weighted.failure),
        weightedApprovalPendingDelta: roundMetric(weighted.pending),
        weightedSuccessDelta: roundMetric(weighted.success),
        weightedCandidateWinDelta: roundMetric(weighted.win),
        guardrailBreaches,
        reasons,
        scenarios
    };
}

export function promotionPolicyCanaryToTasks(
    canary: SkillRolloutPromotionPolicyCanaryRun,
    options: CanaryTaskOptions = {}
): SkillExecutionTask[] {
    const config = {
        ...DEFAULT_CANARY_TASK_OPTIONS,
        ...options,
        maxScenarioTasks: Math.max(1, Math.floor(Number(options.maxScenarioTasks ?? DEFAULT_CANARY_TASK_OPTIONS.maxScenarioTasks)))
    };

    const tasks: SkillExecutionTask[] = [
        {
            kind: 'task_request',
            id: 'promotion-policy-canary-publish',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: `Publish promotion policy canary decision (${canary.decision})`,
            priority: canary.decision === 'adopt' ? 'P1' : 'P0',
            context: {
                decision: canary.decision,
                confidence: canary.confidence,
                baselinePolicy: canary.baselinePolicy,
                candidatePolicy: canary.candidatePolicy,
                scoreDelta: canary.scoreDelta,
                guardrailBreaches: canary.guardrailBreaches,
                reasons: canary.reasons
            }
        }
    ];

    if (canary.decision === 'adopt') {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-policy-canary-adopt',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Adopt candidate promotion policy and begin staged rollout',
            priority: 'P1',
            context: {
                candidatePolicy: canary.candidatePolicy,
                baselinePolicy: canary.baselinePolicy,
                confidence: canary.confidence
            }
        });
    } else if (canary.decision === 'rollback') {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-policy-canary-rollback',
            from: config.fromAgentId,
            to: 'agent:human-oversight',
            task: 'Rollback to baseline promotion policy and trigger incident review',
            priority: 'P0',
            context: {
                baselinePolicy: canary.baselinePolicy,
                candidatePolicy: canary.candidatePolicy,
                guardrailBreaches: canary.guardrailBreaches,
                scoreDelta: canary.scoreDelta
            }
        });
    } else {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-policy-canary-defer',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Defer promotion policy adoption and collect additional canary evidence',
            priority: 'P0',
            context: {
                baselinePolicy: canary.baselinePolicy,
                candidatePolicy: canary.candidatePolicy,
                reasons: canary.reasons
            }
        });
    }

    const breachScenarios = canary.scenarios
        .filter((scenario) => scenario.guardrailBreaches.length > 0)
        .slice(0, config.maxScenarioTasks);

    for (const scenario of breachScenarios) {
        tasks.push({
            kind: 'task_request',
            id: `promotion-policy-canary-scenario-${scenario.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: `Investigate canary scenario breach: ${scenario.name}`,
            priority: 'P1',
            context: {
                scenario: scenario.name,
                guardrailBreaches: scenario.guardrailBreaches,
                scoreDelta: scenario.scoreDelta,
                baseline: scenario.baseline,
                candidate: scenario.candidate
            }
        });
    }

    tasks.push({
        kind: 'task_request',
        id: 'promotion-policy-canary-audit',
        from: config.fromAgentId,
        to: 'agent:rollout-controller',
        task: 'Archive canary decision evidence and scenario-level guardrail outcomes',
        priority: canary.decision === 'adopt' ? 'P1' : 'P0',
        context: {
            decision: canary.decision,
            confidence: canary.confidence,
            scenarioCount: canary.scenarioCount,
            guardrailBreaches: canary.guardrailBreaches
        }
    });

    return tasks;
}
