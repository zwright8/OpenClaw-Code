import type {
    SkillRolloutControlSummary,
    SkillRolloutControlRun,
    SkillRolloutOptimizationCandidate,
    SkillRolloutOptimizationRecommendation,
    SkillRolloutOptimizationRun,
    SkillRolloutOptimizationStrategy,
    SkillRolloutWaveConfig,
    SkillRolloutWavePlan
} from './types.js';

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function roundRate(value: number): number {
    return Number(clamp(value, 0, 1).toFixed(4));
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
}): SkillRolloutOptimizationRun {
    const {
        recommendation,
        baselineWavePlan,
        baselineControlRun,
        candidateWavePlan,
        candidateControlRun,
        search
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
        }
    };
}
