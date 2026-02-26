import type {
    SkillExecutionTask,
    SkillRolloutPromotionPolicy,
    SkillRolloutPromotionPolicyAdjustment,
    SkillRolloutPromotionPolicyDriftReport,
    SkillRolloutPromotionPolicyHistory,
    SkillRolloutPromotionPolicyLabRun,
    SkillRolloutPromotionPolicyLabVariant
} from './types.js';

type PolicyLabOptions = {
    sampleSize?: number;
};

type PolicyLabTaskOptions = {
    fromAgentId?: string;
    maxAlternatives?: number;
};

const DEFAULT_POLICY_LAB_OPTIONS: Required<PolicyLabOptions> = {
    sampleSize: 16
};

const DEFAULT_POLICY_LAB_TASK_OPTIONS: Required<PolicyLabTaskOptions> = {
    fromAgentId: 'agent:skills-rollout-promotion-policy-lab',
    maxAlternatives: 3
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

function clampPolicy(policy: SkillRolloutPromotionPolicy): SkillRolloutPromotionPolicy {
    return {
        minCandidateWinRate: roundRate(clamp(policy.minCandidateWinRate, 0.45, 0.78)),
        maxWeightedScoreDelta: roundMetric(clamp(policy.maxWeightedScoreDelta, 0.1, 14)),
        maxWorstScoreDelta: roundMetric(clamp(policy.maxWorstScoreDelta, 20, 260)),
        maxAvgFailureRateDelta: roundRate(clamp(policy.maxAvgFailureRateDelta, 0.003, 0.06)),
        maxAvgCriticalWaveDelta: roundRate(clamp(policy.maxAvgCriticalWaveDelta, 0.05, 0.45))
    };
}

function policyKey(policy: SkillRolloutPromotionPolicy): string {
    return [
        policy.minCandidateWinRate,
        policy.maxWeightedScoreDelta,
        policy.maxWorstScoreDelta,
        policy.maxAvgFailureRateDelta,
        policy.maxAvgCriticalWaveDelta
    ].join(':');
}

function samePolicy(a: SkillRolloutPromotionPolicy, b: SkillRolloutPromotionPolicy): boolean {
    return policyKey(a) === policyKey(b);
}

function policyDelta(base: SkillRolloutPromotionPolicy, target: SkillRolloutPromotionPolicy) {
    return {
        minCandidateWinRateDelta: roundMetric(target.minCandidateWinRate - base.minCandidateWinRate),
        maxWeightedScoreDeltaDelta: roundMetric(target.maxWeightedScoreDelta - base.maxWeightedScoreDelta),
        maxWorstScoreDeltaDelta: roundMetric(target.maxWorstScoreDelta - base.maxWorstScoreDelta),
        maxAvgFailureRateDeltaDelta: roundMetric(target.maxAvgFailureRateDelta - base.maxAvgFailureRateDelta),
        maxAvgCriticalWaveDeltaDelta: roundMetric(target.maxAvgCriticalWaveDelta - base.maxAvgCriticalWaveDelta)
    };
}

function policyDeltaRationale(base: SkillRolloutPromotionPolicy, target: SkillRolloutPromotionPolicy): string[] {
    const delta = policyDelta(base, target);
    const lines: string[] = [];

    if (delta.minCandidateWinRateDelta !== 0) {
        lines.push(`minCandidateWinRate ${delta.minCandidateWinRateDelta > 0 ? '+' : ''}${delta.minCandidateWinRateDelta}`);
    }
    if (delta.maxWeightedScoreDeltaDelta !== 0) {
        lines.push(`maxWeightedScoreDelta ${delta.maxWeightedScoreDeltaDelta > 0 ? '+' : ''}${delta.maxWeightedScoreDeltaDelta}`);
    }
    if (delta.maxWorstScoreDeltaDelta !== 0) {
        lines.push(`maxWorstScoreDelta ${delta.maxWorstScoreDeltaDelta > 0 ? '+' : ''}${delta.maxWorstScoreDeltaDelta}`);
    }
    if (delta.maxAvgFailureRateDeltaDelta !== 0) {
        lines.push(`maxAvgFailureRateDelta ${delta.maxAvgFailureRateDeltaDelta > 0 ? '+' : ''}${delta.maxAvgFailureRateDeltaDelta}`);
    }
    if (delta.maxAvgCriticalWaveDeltaDelta !== 0) {
        lines.push(`maxAvgCriticalWaveDelta ${delta.maxAvgCriticalWaveDeltaDelta > 0 ? '+' : ''}${delta.maxAvgCriticalWaveDeltaDelta}`);
    }

    if (lines.length === 0) {
        lines.push('no policy threshold changes vs baseline');
    }

    return lines;
}

type RecentMetrics = {
    failureRate: number;
    approvalPendingRate: number;
    successRate: number;
    candidateWinRate: number;
    rejectionRate: number;
    sampleSize: number;
};

function average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function deriveRecentMetrics(history: SkillRolloutPromotionPolicyHistory, sampleSize: number): RecentMetrics {
    const scoped = history.entries.slice(-Math.max(2, Math.floor(sampleSize)));
    if (scoped.length === 0) {
        return {
            failureRate: 0.06,
            approvalPendingRate: 0.12,
            successRate: 0.78,
            candidateWinRate: 0.5,
            rejectionRate: 0.5,
            sampleSize: 0
        };
    }

    return {
        failureRate: roundRate(average(scoped.map((entry) => entry.metrics.failureRate))),
        approvalPendingRate: roundRate(average(scoped.map((entry) => entry.metrics.approvalPendingRate))),
        successRate: roundRate(average(scoped.map((entry) => entry.metrics.successRate))),
        candidateWinRate: roundRate(average(scoped.map((entry) => entry.metrics.candidateWinRate))),
        rejectionRate: roundRate(average(scoped.map((entry) => (entry.promotionStatus === 'rejected' ? 1 : 0)))),
        sampleSize: scoped.length
    };
}

function tightnessDelta(base: SkillRolloutPromotionPolicy, target: SkillRolloutPromotionPolicy): number {
    const delta = policyDelta(base, target);
    return roundMetric(
        delta.minCandidateWinRateDelta * 6
        - delta.maxWeightedScoreDeltaDelta * 0.34
        - delta.maxWorstScoreDeltaDelta * 0.012
        - delta.maxAvgFailureRateDeltaDelta * 34
        - delta.maxAvgCriticalWaveDeltaDelta * 2.2
    );
}

function driftBias(drift: SkillRolloutPromotionPolicyDriftReport): {
    failure: number;
    pending: number;
    win: number;
    rejection: number;
} {
    if (drift.driftLevel === 'critical') {
        return { failure: 0.03, pending: 0.045, win: -0.03, rejection: 0.06 };
    }
    if (drift.driftLevel === 'watch') {
        return { failure: 0.014, pending: 0.022, win: -0.015, rejection: 0.025 };
    }
    return { failure: 0, pending: 0, win: 0, rejection: 0 };
}

function projectVariant(args: {
    name: string;
    basePolicy: SkillRolloutPromotionPolicy;
    targetPolicy: SkillRolloutPromotionPolicy;
    recent: RecentMetrics;
    drift: SkillRolloutPromotionPolicyDriftReport;
}): SkillRolloutPromotionPolicyLabVariant {
    const { name, basePolicy, targetPolicy, recent, drift } = args;
    const tightness = tightnessDelta(basePolicy, targetPolicy);
    const bias = driftBias(drift);

    const projectedFailureRate = roundRate(
        recent.failureRate - tightness * 0.012 + bias.failure + Math.max(0, -tightness) * 0.008
    );
    const projectedApprovalPendingRate = roundRate(
        recent.approvalPendingRate + tightness * 0.016 + bias.pending
    );
    const projectedSuccessRate = roundRate(
        recent.successRate - projectedFailureRate * 0.32 - projectedApprovalPendingRate * 0.15 + 0.035
    );
    const projectedCandidateWinRate = roundRate(
        recent.candidateWinRate + tightness * 0.008 + bias.win
    );
    const projectedRejectionRate = roundRate(
        recent.rejectionRate + tightness * 0.12 + bias.rejection
    );

    let score =
        projectedFailureRate * 440
        + projectedApprovalPendingRate * 180
        + (1 - projectedSuccessRate) * 130
        + Math.max(0, 0.55 - projectedCandidateWinRate) * 180
        + projectedRejectionRate * 90;

    if (drift.driftLevel === 'critical' && tightness < 0) {
        score += Math.abs(tightness) * 95;
    }
    if (drift.driftLevel === 'stable' && tightness > 0.65) {
        score += (tightness - 0.65) * 45;
    }
    if (projectedApprovalPendingRate >= 0.28) {
        score += 40;
    }

    const rationale = [
        ...policyDeltaRationale(basePolicy, targetPolicy),
        `projected failure=${projectedFailureRate}, pending=${projectedApprovalPendingRate}, success=${projectedSuccessRate}`,
        `projected candidateWinRate=${projectedCandidateWinRate}, rejectionRate=${projectedRejectionRate}`
    ];

    return {
        name,
        policy: targetPolicy,
        score: roundScore(score),
        projectedFailureRate,
        projectedApprovalPendingRate,
        projectedSuccessRate,
        projectedCandidateWinRate,
        projectedRejectionRate,
        rationale
    };
}

function buildPolicyCandidates(args: {
    baseline: SkillRolloutPromotionPolicy;
    adjustmentRecommended: SkillRolloutPromotionPolicy;
    drift: SkillRolloutPromotionPolicyDriftReport;
}): Array<{ name: string; policy: SkillRolloutPromotionPolicy; }> {
    const { baseline, adjustmentRecommended, drift } = args;
    const candidates: Array<{ name: string; policy: SkillRolloutPromotionPolicy; }> = [
        { name: 'baseline', policy: baseline },
        { name: 'adjustment_recommended', policy: adjustmentRecommended },
        {
            name: 'tighten_small',
            policy: clampPolicy({
                minCandidateWinRate: baseline.minCandidateWinRate + 0.01,
                maxWeightedScoreDelta: baseline.maxWeightedScoreDelta - 0.12,
                maxWorstScoreDelta: baseline.maxWorstScoreDelta - 2,
                maxAvgFailureRateDelta: baseline.maxAvgFailureRateDelta - 0.001,
                maxAvgCriticalWaveDelta: baseline.maxAvgCriticalWaveDelta - 0.008
            })
        },
        {
            name: 'tighten_medium',
            policy: clampPolicy({
                minCandidateWinRate: baseline.minCandidateWinRate + 0.025,
                maxWeightedScoreDelta: baseline.maxWeightedScoreDelta - 0.32,
                maxWorstScoreDelta: baseline.maxWorstScoreDelta - 6,
                maxAvgFailureRateDelta: baseline.maxAvgFailureRateDelta - 0.002,
                maxAvgCriticalWaveDelta: baseline.maxAvgCriticalWaveDelta - 0.016
            })
        },
        {
            name: 'relax_small',
            policy: clampPolicy({
                minCandidateWinRate: baseline.minCandidateWinRate - 0.008,
                maxWeightedScoreDelta: baseline.maxWeightedScoreDelta + 0.2,
                maxWorstScoreDelta: baseline.maxWorstScoreDelta + 3,
                maxAvgFailureRateDelta: baseline.maxAvgFailureRateDelta + 0.001,
                maxAvgCriticalWaveDelta: baseline.maxAvgCriticalWaveDelta + 0.009
            })
        },
        {
            name: 'relax_medium',
            policy: clampPolicy({
                minCandidateWinRate: baseline.minCandidateWinRate - 0.018,
                maxWeightedScoreDelta: baseline.maxWeightedScoreDelta + 0.45,
                maxWorstScoreDelta: baseline.maxWorstScoreDelta + 7,
                maxAvgFailureRateDelta: baseline.maxAvgFailureRateDelta + 0.002,
                maxAvgCriticalWaveDelta: baseline.maxAvgCriticalWaveDelta + 0.017
            })
        },
        {
            name: 'quality_focus',
            policy: clampPolicy({
                minCandidateWinRate: baseline.minCandidateWinRate + 0.02,
                maxWeightedScoreDelta: baseline.maxWeightedScoreDelta - 0.22,
                maxWorstScoreDelta: baseline.maxWorstScoreDelta - 5,
                maxAvgFailureRateDelta: baseline.maxAvgFailureRateDelta - 0.002,
                maxAvgCriticalWaveDelta: baseline.maxAvgCriticalWaveDelta - 0.012
            })
        },
        {
            name: 'throughput_focus',
            policy: clampPolicy({
                minCandidateWinRate: baseline.minCandidateWinRate - 0.012,
                maxWeightedScoreDelta: baseline.maxWeightedScoreDelta + 0.34,
                maxWorstScoreDelta: baseline.maxWorstScoreDelta + 5,
                maxAvgFailureRateDelta: baseline.maxAvgFailureRateDelta + 0.001,
                maxAvgCriticalWaveDelta: baseline.maxAvgCriticalWaveDelta + 0.013
            })
        }
    ];

    if (drift.driftLevel === 'critical') {
        candidates.push({
            name: 'critical_stabilize',
            policy: clampPolicy({
                minCandidateWinRate: baseline.minCandidateWinRate + 0.035,
                maxWeightedScoreDelta: baseline.maxWeightedScoreDelta - 0.46,
                maxWorstScoreDelta: baseline.maxWorstScoreDelta - 9,
                maxAvgFailureRateDelta: baseline.maxAvgFailureRateDelta - 0.003,
                maxAvgCriticalWaveDelta: baseline.maxAvgCriticalWaveDelta - 0.02
            })
        });
    }

    const unique = new Map<string, { name: string; policy: SkillRolloutPromotionPolicy; }>();
    for (const candidate of candidates) {
        const key = policyKey(candidate.policy);
        if (!unique.has(key)) {
            unique.set(key, candidate);
        }
    }

    return Array.from(unique.values());
}

export function runSkillRolloutPromotionPolicyLab(args: {
    history: SkillRolloutPromotionPolicyHistory;
    drift: SkillRolloutPromotionPolicyDriftReport;
    adjustment: SkillRolloutPromotionPolicyAdjustment;
    options?: PolicyLabOptions;
}): SkillRolloutPromotionPolicyLabRun {
    const options = {
        ...DEFAULT_POLICY_LAB_OPTIONS,
        ...(args.options || {}),
        sampleSize: Math.max(2, Math.floor(Number(args.options?.sampleSize ?? DEFAULT_POLICY_LAB_OPTIONS.sampleSize)))
    };

    const latestPolicy = args.history.entries.length > 0
        ? args.history.entries[args.history.entries.length - 1].policy
        : args.adjustment.currentPolicy;
    const baselinePolicy = clampPolicy(latestPolicy);
    const adjustmentRecommended = clampPolicy(args.adjustment.recommendedPolicy);
    const recent = deriveRecentMetrics(args.history, options.sampleSize);

    const variants = buildPolicyCandidates({
        baseline: baselinePolicy,
        adjustmentRecommended,
        drift: args.drift
    }).map((candidate) => projectVariant({
        name: candidate.name,
        basePolicy: baselinePolicy,
        targetPolicy: candidate.policy,
        recent,
        drift: args.drift
    }));

    variants.sort((a, b) => {
        const scoreDelta = a.score - b.score;
        if (scoreDelta !== 0) return scoreDelta;
        const failureDelta = a.projectedFailureRate - b.projectedFailureRate;
        if (failureDelta !== 0) return failureDelta;
        return a.projectedApprovalPendingRate - b.projectedApprovalPendingRate;
    });

    const recommended = variants[0];
    const baselineVariant = variants.find((variant) => variant.name === 'baseline') || recommended;

    const assumptions = [
        'projections are derived from recent promotion history averages and deterministic policy deltas',
        'drift level acts as a directional bias and not as a deterministic future guarantee',
        'lower lab score indicates a better tradeoff between reliability, governance load, and adoption risk'
    ];

    return {
        generatedAt: new Date().toISOString(),
        sampleSize: recent.sampleSize,
        driftLevel: args.drift.driftLevel,
        baselinePolicy,
        recommendedPolicy: recommended.policy,
        baselineScore: baselineVariant.score,
        recommendedScore: recommended.score,
        scoreDelta: roundScore(recommended.score - baselineVariant.score),
        variants,
        assumptions
    };
}

export function promotionPolicyLabToTasks(
    labRun: SkillRolloutPromotionPolicyLabRun,
    options: PolicyLabTaskOptions = {}
): SkillExecutionTask[] {
    const config = {
        ...DEFAULT_POLICY_LAB_TASK_OPTIONS,
        ...options,
        maxAlternatives: Math.max(1, Math.floor(Number(options.maxAlternatives ?? DEFAULT_POLICY_LAB_TASK_OPTIONS.maxAlternatives)))
    };

    const tasks: SkillExecutionTask[] = [
        {
            kind: 'task_request',
            id: 'promotion-policy-lab-publish',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: `Publish promotion policy lab recommendation (${labRun.driftLevel})`,
            priority: labRun.driftLevel === 'critical' ? 'P0' : 'P1',
            context: {
                driftLevel: labRun.driftLevel,
                baselinePolicy: labRun.baselinePolicy,
                recommendedPolicy: labRun.recommendedPolicy,
                baselineScore: labRun.baselineScore,
                recommendedScore: labRun.recommendedScore,
                scoreDelta: labRun.scoreDelta,
                assumptions: labRun.assumptions
            }
        }
    ];

    if (samePolicy(labRun.baselinePolicy, labRun.recommendedPolicy)) {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-policy-lab-maintain',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Maintain current promotion policy from lab outcome and continue telemetry collection',
            priority: 'P1',
            context: {
                driftLevel: labRun.driftLevel,
                scoreDelta: labRun.scoreDelta
            }
        });
    } else {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-policy-lab-canary',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Run canary rollout with lab-recommended promotion policy thresholds',
            priority: labRun.driftLevel === 'critical' ? 'P0' : 'P1',
            context: {
                baselinePolicy: labRun.baselinePolicy,
                recommendedPolicy: labRun.recommendedPolicy,
                scoreDelta: labRun.scoreDelta
            }
        });
    }

    const alternatives = labRun.variants
        .slice(1, 1 + config.maxAlternatives)
        .filter((variant) => !samePolicy(variant.policy, labRun.recommendedPolicy));

    for (const variant of alternatives) {
        tasks.push({
            kind: 'task_request',
            id: `promotion-policy-lab-alt-${variant.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: `Evaluate alternative promotion policy variant ${variant.name}`,
            priority: 'P1',
            context: {
                variant: variant.name,
                policy: variant.policy,
                projectedFailureRate: variant.projectedFailureRate,
                projectedApprovalPendingRate: variant.projectedApprovalPendingRate,
                projectedSuccessRate: variant.projectedSuccessRate,
                score: variant.score
            }
        });
    }

    if (labRun.driftLevel === 'critical') {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-policy-lab-critical-review',
            from: config.fromAgentId,
            to: 'agent:human-oversight',
            task: 'Run critical governance review for promotion policy lab decision',
            priority: 'P0',
            context: {
                recommendedPolicy: labRun.recommendedPolicy,
                baselinePolicy: labRun.baselinePolicy,
                scoreDelta: labRun.scoreDelta
            }
        });
    }

    tasks.push({
        kind: 'task_request',
        id: 'promotion-policy-lab-audit',
        from: config.fromAgentId,
        to: 'agent:rollout-controller',
        task: 'Archive promotion policy lab analysis and threshold decision diff',
        priority: labRun.driftLevel === 'critical' ? 'P0' : 'P1',
        context: {
            driftLevel: labRun.driftLevel,
            recommendedPolicy: labRun.recommendedPolicy,
            baselinePolicy: labRun.baselinePolicy,
            sampleSize: labRun.sampleSize
        }
    });

    return tasks;
}
