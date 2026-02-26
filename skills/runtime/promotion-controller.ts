import type {
    SkillExecutionTask,
    SkillRolloutOptimizationRun,
    SkillRolloutPromotionControlRun,
    SkillRolloutPromotionPolicyDriftReport,
    SkillRolloutPromotionPolicyHistory,
    SkillRolloutPromotionPolicyHistoryEntry,
    SkillRolloutPromotionPolicy,
    SkillRolloutPromotionPolicyAdjustment,
    SkillRolloutPromotionTaskCategory,
    SkillRolloutPromotionTaskResult,
    SkillRolloutPromotionTaskStatus
} from './types.js';

type PromotionControlOptions = {
    seed?: string;
    failBias?: number;
    approvalBias?: number;
};

type PromotionAdjustmentTaskOptions = {
    fromAgentId?: string;
    maxTasks?: number;
};

const DEFAULT_CONTROL_OPTIONS: Required<PromotionControlOptions> = {
    seed: 'openclaw-promotion-control',
    failBias: 0,
    approvalBias: 0
};

const DEFAULT_ADJUSTMENT_TASK_OPTIONS: Required<PromotionAdjustmentTaskOptions> = {
    fromAgentId: 'agent:skills-rollout-promotion-control',
    maxTasks: 120
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

function roundInt(value: number): number {
    return Math.max(0, Math.round(value));
}

function hashNumber(value: string): number {
    let hash = 2_166_136_261;
    for (const ch of value) {
        hash ^= ch.charCodeAt(0);
        hash = Math.imul(hash, 16_777_619);
    }
    return hash >>> 0;
}

function randomRatio(seed: string): number {
    return hashNumber(seed) / 4_294_967_295;
}

function classifyPromotionTask(taskId: string): SkillRolloutPromotionTaskCategory {
    if (taskId.startsWith('promotion-decision-')) return 'decision';
    if (taskId.startsWith('promotion-apply-') || taskId.startsWith('promotion-retain-')) return 'config_change';
    if (taskId.startsWith('promotion-policy-investigation')) return 'investigation';
    if (taskId.startsWith('promotion-verify-')) return 'verification';
    if (taskId.startsWith('promotion-shadow-')) return 'shadow_validation';
    if (taskId.startsWith('promotion-audit-')) return 'audit';
    return 'unknown';
}

function baseRates(category: SkillRolloutPromotionTaskCategory): { failRate: number; approvalRate: number; } {
    if (category === 'decision') return { failRate: 0.018, approvalRate: 0.03 };
    if (category === 'config_change') return { failRate: 0.045, approvalRate: 0.055 };
    if (category === 'investigation') return { failRate: 0.07, approvalRate: 0.5 };
    if (category === 'verification') return { failRate: 0.055, approvalRate: 0.08 };
    if (category === 'shadow_validation') return { failRate: 0.075, approvalRate: 0.09 };
    if (category === 'audit') return { failRate: 0.022, approvalRate: 0.035 };
    return { failRate: 0.11, approvalRate: 0.085 };
}

function statusReason(category: SkillRolloutPromotionTaskCategory, status: SkillRolloutPromotionTaskStatus): string {
    if (status === 'success') {
        if (category === 'decision') return 'promotion decision published to rollout control plane';
        if (category === 'config_change') return 'promotion config transition completed successfully';
        if (category === 'investigation') return 'policy investigation completed with actionable findings';
        if (category === 'verification') return 'promotion verification checks passed in production lane';
        if (category === 'shadow_validation') return 'shadow validation completed with acceptable divergence';
        if (category === 'audit') return 'promotion audit evidence written and signed';
        return 'promotion task completed';
    }
    if (status === 'failed') {
        if (category === 'verification' || category === 'shadow_validation') {
            return 'promotion validation failed acceptance thresholds';
        }
        if (category === 'config_change') return 'policy/config update failed rollout safeguards';
        if (category === 'investigation') return 'investigation pipeline failed evidence synthesis';
        return 'promotion task failed execution checks';
    }
    if (status === 'approval_pending') {
        if (category === 'investigation') return 'investigation outcome pending human oversight adjudication';
        return 'task waiting for approval gate completion';
    }
    return 'task skipped by promotion control throttling';
}

function computeLatencyMs(
    category: SkillRolloutPromotionTaskCategory,
    status: SkillRolloutPromotionTaskStatus,
    seed: string
): number {
    const roll = randomRatio(seed);

    if (category === 'decision') {
        const baseline = 1_200 + roll * 4_000;
        return roundInt(status === 'failed' ? baseline + 1_200 : baseline);
    }
    if (category === 'config_change') {
        const baseline = 4_500 + roll * 10_000;
        if (status === 'approval_pending') return roundInt(baseline + 3_500);
        return roundInt(status === 'failed' ? baseline + 2_000 : baseline);
    }
    if (category === 'investigation') {
        const baseline = 7_500 + roll * 28_000;
        if (status === 'approval_pending') return roundInt(baseline + 8_000);
        return roundInt(status === 'failed' ? baseline + 4_500 : baseline);
    }

    const baseline = 2_000 + roll * 14_000;
    if (status === 'approval_pending') return roundInt(baseline + 4_200);
    if (status === 'failed') return roundInt(baseline + 2_400);
    if (status === 'skipped') return roundInt(500 + roll * 1_400);
    return roundInt(baseline);
}

function selectStatus(roll: number, failRate: number, approvalRate: number): SkillRolloutPromotionTaskStatus {
    if (roll < failRate) return 'failed';
    if (roll < failRate + approvalRate) return 'approval_pending';
    if (roll > 0.988) return 'skipped';
    return 'success';
}

function evaluateTask(
    task: SkillExecutionTask,
    options: Required<PromotionControlOptions>
): SkillRolloutPromotionTaskResult {
    const category = classifyPromotionTask(task.id);
    const base = baseRates(category);
    const priorityModifier = task.priority === 'P0' ? 0.025 : task.priority === 'P1' ? 0.01 : 0;

    const failRate = clamp(base.failRate + priorityModifier + options.failBias * 0.35, 0.005, 0.85);
    const approvalRate = clamp(base.approvalRate + priorityModifier * 0.6 + options.approvalBias * 0.4, 0, 0.9 - failRate);

    const roll = randomRatio(`${options.seed}:${task.id}:${task.to}:${task.priority}`);
    const status = selectStatus(roll, failRate, approvalRate);

    return {
        taskId: task.id,
        category,
        status,
        reason: statusReason(category, status),
        retryable: status === 'failed' && category !== 'investigation',
        latencyMs: computeLatencyMs(category, status, `${task.id}:latency:${options.seed}`),
        priority: task.priority
    };
}

function emptyCategoryRecord(): Record<SkillRolloutPromotionTaskCategory, number> {
    return {
        decision: 0,
        config_change: 0,
        investigation: 0,
        verification: 0,
        shadow_validation: 0,
        audit: 0,
        unknown: 0
    };
}

export function runSkillRolloutPromotionControlLoop(
    optimization: SkillRolloutOptimizationRun,
    tasks: SkillExecutionTask[],
    options: PromotionControlOptions = {}
): SkillRolloutPromotionControlRun {
    const effectiveOptions = {
        ...DEFAULT_CONTROL_OPTIONS,
        ...options,
        failBias: clamp(Number(options.failBias ?? DEFAULT_CONTROL_OPTIONS.failBias), -0.5, 0.5),
        approvalBias: clamp(Number(options.approvalBias ?? DEFAULT_CONTROL_OPTIONS.approvalBias), -0.5, 0.5)
    };

    const taskResults = tasks.map((task) => evaluateTask(task, effectiveOptions));

    const categoryCounts = emptyCategoryRecord();
    const categoryFailureCounts = emptyCategoryRecord();
    const categoryPendingCounts = emptyCategoryRecord();

    for (const result of taskResults) {
        categoryCounts[result.category] += 1;
        if (result.status === 'failed') categoryFailureCounts[result.category] += 1;
        if (result.status === 'approval_pending') categoryPendingCounts[result.category] += 1;
    }

    const summary = {
        totalTasks: taskResults.length,
        successCount: taskResults.filter((result) => result.status === 'success').length,
        failedCount: taskResults.filter((result) => result.status === 'failed').length,
        approvalPendingCount: taskResults.filter((result) => result.status === 'approval_pending').length,
        skippedCount: taskResults.filter((result) => result.status === 'skipped').length,
        categoryCounts,
        categoryFailureCounts,
        categoryPendingCounts,
        overallPosture: 'stable' as const
    };

    const failureRate = summary.totalTasks === 0 ? 0 : summary.failedCount / summary.totalTasks;
    const pendingRate = summary.totalTasks === 0 ? 0 : summary.approvalPendingCount / summary.totalTasks;

    if (failureRate >= 0.16 || summary.failedCount >= Math.max(5, Math.round(summary.totalTasks * 0.12))) {
        summary.overallPosture = 'critical';
    } else if (failureRate >= 0.08 || pendingRate >= 0.24) {
        summary.overallPosture = 'degraded';
    }

    return {
        generatedAt: new Date().toISOString(),
        sourcePromotionGeneratedAt: optimization.promotion.generatedAt,
        sourceTaskCount: tasks.length,
        summary,
        taskResults
    };
}

function clampPolicy(policy: SkillRolloutPromotionPolicy): SkillRolloutPromotionPolicy {
    return {
        minCandidateWinRate: roundRate(clamp(policy.minCandidateWinRate, 0.45, 0.75)),
        maxWeightedScoreDelta: roundMetric(clamp(policy.maxWeightedScoreDelta, 0.1, 12)),
        maxWorstScoreDelta: roundMetric(clamp(policy.maxWorstScoreDelta, 20, 200)),
        maxAvgFailureRateDelta: roundRate(clamp(policy.maxAvgFailureRateDelta, 0.003, 0.05)),
        maxAvgCriticalWaveDelta: roundRate(clamp(policy.maxAvgCriticalWaveDelta, 0.05, 0.4))
    };
}

function rateForCategory(taskResults: SkillRolloutPromotionTaskResult[], category: SkillRolloutPromotionTaskCategory): number {
    const scoped = taskResults.filter((result) => result.category === category);
    if (scoped.length === 0) return 0;
    const failed = scoped.filter((result) => result.status === 'failed').length;
    return failed / scoped.length;
}

export function recommendSkillRolloutPromotionPolicyAdjustment(
    optimization: SkillRolloutOptimizationRun,
    controlRun: SkillRolloutPromotionControlRun
): SkillRolloutPromotionPolicyAdjustment {
    const currentPolicy = optimization.promotion.policy;
    const total = Math.max(1, controlRun.summary.totalTasks);

    const failureRate = controlRun.summary.failedCount / total;
    const approvalPendingRate = controlRun.summary.approvalPendingCount / total;
    const successRate = controlRun.summary.successCount / total;
    const verificationFailureRate = rateForCategory(controlRun.taskResults, 'verification');
    const shadowFailureRate = rateForCategory(controlRun.taskResults, 'shadow_validation');

    let strategy: SkillRolloutPromotionPolicyAdjustment['strategy'] = 'maintain';
    let recommended: SkillRolloutPromotionPolicy = { ...currentPolicy };
    const reasons: string[] = [];

    if (
        controlRun.summary.overallPosture === 'critical'
        || failureRate >= 0.1
        || verificationFailureRate >= 0.12
    ) {
        strategy = 'tighten';
        recommended = {
            minCandidateWinRate: currentPolicy.minCandidateWinRate + 0.03,
            maxWeightedScoreDelta: currentPolicy.maxWeightedScoreDelta - 0.4,
            maxWorstScoreDelta: currentPolicy.maxWorstScoreDelta - 8,
            maxAvgFailureRateDelta: currentPolicy.maxAvgFailureRateDelta - 0.002,
            maxAvgCriticalWaveDelta: currentPolicy.maxAvgCriticalWaveDelta - 0.02
        };
        reasons.push('critical or elevated failure conditions detected in promotion task execution');
    } else if (approvalPendingRate >= 0.28) {
        strategy = 'tighten';
        recommended = {
            minCandidateWinRate: currentPolicy.minCandidateWinRate + 0.02,
            maxWeightedScoreDelta: currentPolicy.maxWeightedScoreDelta - 0.2,
            maxWorstScoreDelta: currentPolicy.maxWorstScoreDelta - 4,
            maxAvgFailureRateDelta: currentPolicy.maxAvgFailureRateDelta,
            maxAvgCriticalWaveDelta: currentPolicy.maxAvgCriticalWaveDelta
        };
        reasons.push('approval queue pressure indicates governance overload during promotion handling');
    } else if (
        optimization.promotion.status === 'rejected'
        && shadowFailureRate <= 0.04
        && successRate >= 0.82
        && approvalPendingRate <= 0.12
    ) {
        strategy = 'relax';
        recommended = {
            minCandidateWinRate: currentPolicy.minCandidateWinRate - 0.01,
            maxWeightedScoreDelta: currentPolicy.maxWeightedScoreDelta + 0.25,
            maxWorstScoreDelta: currentPolicy.maxWorstScoreDelta + 4,
            maxAvgFailureRateDelta: currentPolicy.maxAvgFailureRateDelta + 0.001,
            maxAvgCriticalWaveDelta: currentPolicy.maxAvgCriticalWaveDelta + 0.01
        };
        reasons.push('rejected candidate shadow-validation appears healthy; policy may be overly strict');
    } else if (successRate >= 0.9 && failureRate <= 0.03 && approvalPendingRate <= 0.06) {
        strategy = 'relax';
        recommended = {
            minCandidateWinRate: currentPolicy.minCandidateWinRate - 0.02,
            maxWeightedScoreDelta: currentPolicy.maxWeightedScoreDelta + 0.5,
            maxWorstScoreDelta: currentPolicy.maxWorstScoreDelta + 8,
            maxAvgFailureRateDelta: currentPolicy.maxAvgFailureRateDelta + 0.002,
            maxAvgCriticalWaveDelta: currentPolicy.maxAvgCriticalWaveDelta + 0.02
        };
        reasons.push('promotion task execution was consistently healthy; measured policy expansion is viable');
    } else {
        reasons.push('promotion control metrics are mixed; maintain current policy thresholds');
    }

    const recommendedPolicy = clampPolicy(recommended);

    const confidence = roundRate(
        clamp(
            0.45
            + Math.min(0.35, controlRun.summary.totalTasks / 200)
            + (controlRun.summary.overallPosture === 'stable' ? 0.08 : controlRun.summary.overallPosture === 'degraded' ? 0.02 : -0.05),
            0.25,
            0.92
        )
    );

    return {
        generatedAt: new Date().toISOString(),
        strategy,
        currentPolicy: clampPolicy(currentPolicy),
        recommendedPolicy,
        confidence,
        reasons,
        observedMetrics: {
            failureRate: roundRate(failureRate),
            approvalPendingRate: roundRate(approvalPendingRate),
            successRate: roundRate(successRate),
            verificationFailureRate: roundRate(verificationFailureRate),
            shadowFailureRate: roundRate(shadowFailureRate)
        }
    };
}

function parseSkillId(taskId: string): number | undefined {
    const match = taskId.match(/-(\d{4})$/);
    if (!match) return undefined;
    return Number(match[1]);
}

export function rolloutPromotionPolicyAdjustmentToTasks(
    adjustment: SkillRolloutPromotionPolicyAdjustment,
    controlRun: SkillRolloutPromotionControlRun,
    options: PromotionAdjustmentTaskOptions = {}
): SkillExecutionTask[] {
    const config = {
        ...DEFAULT_ADJUSTMENT_TASK_OPTIONS,
        ...options,
        maxTasks: Math.max(20, Math.floor(Number(options.maxTasks ?? DEFAULT_ADJUSTMENT_TASK_OPTIONS.maxTasks)))
    };

    const tasks: SkillExecutionTask[] = [
        {
            kind: 'task_request',
            id: 'promotion-adjustment-publish',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: `Publish promotion policy adjustment (${adjustment.strategy})`,
            priority: adjustment.strategy === 'tighten' ? 'P0' : 'P1',
            context: {
                strategy: adjustment.strategy,
                confidence: adjustment.confidence,
                currentPolicy: adjustment.currentPolicy,
                recommendedPolicy: adjustment.recommendedPolicy,
                reasons: adjustment.reasons,
                observedMetrics: adjustment.observedMetrics
            }
        }
    ];

    if (adjustment.strategy === 'tighten') {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-adjustment-apply-tighten',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Apply tightened promotion thresholds and increase pre-promotion checks',
            priority: 'P0',
            context: {
                recommendedPolicy: adjustment.recommendedPolicy,
                observedMetrics: adjustment.observedMetrics
            }
        });
    } else if (adjustment.strategy === 'relax') {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-adjustment-canary-relax',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Run canary with relaxed promotion thresholds under enhanced telemetry',
            priority: 'P1',
            context: {
                recommendedPolicy: adjustment.recommendedPolicy,
                observedMetrics: adjustment.observedMetrics
            }
        });
    } else {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-adjustment-maintain-policy',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Maintain current promotion policy and continue monitoring',
            priority: 'P1',
            context: {
                currentPolicy: adjustment.currentPolicy,
                observedMetrics: adjustment.observedMetrics
            }
        });
    }

    const failed = controlRun.taskResults
        .filter((result) => result.status === 'failed')
        .slice(0, Math.max(0, config.maxTasks - tasks.length - 1));

    for (const result of failed) {
        const skillId = parseSkillId(result.taskId);
        tasks.push({
            kind: 'task_request',
            id: `promotion-adjustment-remediate-${skillId ? String(skillId).padStart(4, '0') : hashNumber(result.taskId).toString(16).slice(0, 6)}`,
            from: config.fromAgentId,
            to: result.category === 'investigation' ? 'agent:human-oversight' : 'agent:rollout-controller',
            task: `Remediate failed promotion task ${result.taskId}`,
            priority: result.priority === 'P0' ? 'P0' : 'P1',
            context: {
                sourceTaskId: result.taskId,
                category: result.category,
                reason: result.reason,
                retryable: result.retryable,
                latencyMs: result.latencyMs
            }
        });
    }

    tasks.push({
        kind: 'task_request',
        id: 'promotion-adjustment-audit',
        from: config.fromAgentId,
        to: 'agent:rollout-controller',
        task: 'Write promotion policy-adjustment audit report and threshold diff',
        priority: adjustment.strategy === 'tighten' ? 'P0' : 'P1',
        context: {
            strategy: adjustment.strategy,
            confidence: adjustment.confidence,
            failedCount: controlRun.summary.failedCount,
            pendingCount: controlRun.summary.approvalPendingCount
        }
    });

    return tasks;
}

type PromotionHistoryOptions = {
    maxEntries?: number;
};

type PromotionDriftTaskOptions = {
    fromAgentId?: string;
};

const DEFAULT_HISTORY_OPTIONS: Required<PromotionHistoryOptions> = {
    maxEntries: 180
};

const DEFAULT_DRIFT_TASK_OPTIONS: Required<PromotionDriftTaskOptions> = {
    fromAgentId: 'agent:skills-rollout-promotion-history'
};

function normalizePolicyHistory(
    history: SkillRolloutPromotionPolicyHistory | undefined
): SkillRolloutPromotionPolicyHistory {
    if (!history) {
        return {
            generatedAt: new Date().toISOString(),
            entryCount: 0,
            entries: []
        };
    }
    return {
        generatedAt: history.generatedAt,
        entryCount: history.entries.length,
        entries: history.entries.slice()
    };
}

function toHistoryEntry(args: {
    optimization: SkillRolloutOptimizationRun;
    controlRun: SkillRolloutPromotionControlRun;
    adjustment: SkillRolloutPromotionPolicyAdjustment;
}): SkillRolloutPromotionPolicyHistoryEntry {
    const { optimization, controlRun, adjustment } = args;
    return {
        recordedAt: new Date().toISOString(),
        promotionStatus: optimization.promotion.status,
        controlPosture: controlRun.summary.overallPosture,
        adjustmentStrategy: adjustment.strategy,
        policy: adjustment.recommendedPolicy,
        metrics: {
            failureRate: adjustment.observedMetrics.failureRate,
            approvalPendingRate: adjustment.observedMetrics.approvalPendingRate,
            successRate: adjustment.observedMetrics.successRate,
            verificationFailureRate: adjustment.observedMetrics.verificationFailureRate,
            shadowFailureRate: adjustment.observedMetrics.shadowFailureRate,
            candidateWinRate: optimization.promotion.robustness.candidateWinRate,
            weightedScoreDelta: optimization.promotion.robustness.weightedScoreDelta
        }
    };
}

export function updateSkillRolloutPromotionPolicyHistory(args: {
    history?: SkillRolloutPromotionPolicyHistory;
    optimization: SkillRolloutOptimizationRun;
    controlRun: SkillRolloutPromotionControlRun;
    adjustment: SkillRolloutPromotionPolicyAdjustment;
    options?: PromotionHistoryOptions;
}): SkillRolloutPromotionPolicyHistory {
    const options = {
        ...DEFAULT_HISTORY_OPTIONS,
        ...(args.options || {}),
        maxEntries: Math.max(20, Math.floor(Number(args.options?.maxEntries ?? DEFAULT_HISTORY_OPTIONS.maxEntries)))
    };
    const base = normalizePolicyHistory(args.history);
    base.entries.push(
        toHistoryEntry({
            optimization: args.optimization,
            controlRun: args.controlRun,
            adjustment: args.adjustment
        })
    );
    if (base.entries.length > options.maxEntries) {
        base.entries = base.entries.slice(base.entries.length - options.maxEntries);
    }
    return {
        generatedAt: new Date().toISOString(),
        entryCount: base.entries.length,
        entries: base.entries
    };
}

export function evaluateSkillRolloutPromotionPolicyDrift(
    history: SkillRolloutPromotionPolicyHistory,
    sampleSize = 12
): SkillRolloutPromotionPolicyDriftReport {
    const scoped = history.entries.slice(-Math.max(2, Math.floor(sampleSize)));
    if (scoped.length < 2) {
        return {
            generatedAt: new Date().toISOString(),
            sampleSize: scoped.length,
            driftLevel: 'stable',
            trend: {
                failureRateDelta: 0,
                approvalPendingRateDelta: 0,
                successRateDelta: 0,
                minCandidateWinRateDelta: 0,
                maxWeightedScoreDeltaDelta: 0,
                candidateWinRateDelta: 0
            },
            reasons: ['insufficient history; policy drift evaluation requires at least two entries'],
            recommendedActions: ['continue collecting promotion history before applying drift-driven policy changes']
        };
    }

    const first = scoped[0];
    const last = scoped[scoped.length - 1];
    const trend = {
        failureRateDelta: roundMetric(last.metrics.failureRate - first.metrics.failureRate),
        approvalPendingRateDelta: roundMetric(last.metrics.approvalPendingRate - first.metrics.approvalPendingRate),
        successRateDelta: roundMetric(last.metrics.successRate - first.metrics.successRate),
        minCandidateWinRateDelta: roundMetric(last.policy.minCandidateWinRate - first.policy.minCandidateWinRate),
        maxWeightedScoreDeltaDelta: roundMetric(last.policy.maxWeightedScoreDelta - first.policy.maxWeightedScoreDelta),
        candidateWinRateDelta: roundMetric(last.metrics.candidateWinRate - first.metrics.candidateWinRate)
    };

    let driftLevel: SkillRolloutPromotionPolicyDriftReport['driftLevel'] = 'stable';
    const reasons: string[] = [];
    const recommendedActions: string[] = [];

    if (trend.failureRateDelta >= 0.03 || trend.approvalPendingRateDelta >= 0.06 || trend.successRateDelta <= -0.05) {
        driftLevel = 'watch';
        reasons.push('promotion execution quality is trending negatively across recent history');
    }
    if (Math.abs(trend.minCandidateWinRateDelta) >= 0.05 || Math.abs(trend.maxWeightedScoreDeltaDelta) >= 0.8) {
        driftLevel = driftLevel === 'stable' ? 'watch' : driftLevel;
        reasons.push('policy thresholds show meaningful movement and require governance review');
    }
    if (trend.failureRateDelta >= 0.07 || trend.successRateDelta <= -0.1 || trend.candidateWinRateDelta <= -0.1) {
        driftLevel = 'critical';
        reasons.push('promotion system drift reached critical thresholds across reliability and robustness metrics');
    }

    if (reasons.length === 0) {
        reasons.push('promotion policy and execution metrics are stable within expected tolerance');
    }

    if (driftLevel === 'critical') {
        recommendedActions.push('immediately tighten promotion thresholds and run incident-style policy review');
        recommendedActions.push('pause relax-style policy adjustments until drift returns to watch/stable');
    } else if (driftLevel === 'watch') {
        recommendedActions.push('run focused review on recent threshold changes and failed promotion tasks');
        recommendedActions.push('increase shadow-validation sample size for the next promotion cycles');
    } else {
        recommendedActions.push('continue monitoring with existing policy cadence');
        recommendedActions.push('maintain current thresholds unless new failure signals emerge');
    }

    return {
        generatedAt: new Date().toISOString(),
        sampleSize: scoped.length,
        driftLevel,
        trend,
        reasons,
        recommendedActions
    };
}

export function rolloutPromotionPolicyDriftToTasks(
    drift: SkillRolloutPromotionPolicyDriftReport,
    options: PromotionDriftTaskOptions = {}
): SkillExecutionTask[] {
    const config = {
        ...DEFAULT_DRIFT_TASK_OPTIONS,
        ...options
    };
    const tasks: SkillExecutionTask[] = [
        {
            kind: 'task_request',
            id: 'promotion-drift-publish',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: `Publish promotion policy drift report (${drift.driftLevel})`,
            priority: drift.driftLevel === 'critical' ? 'P0' : 'P1',
            context: {
                driftLevel: drift.driftLevel,
                sampleSize: drift.sampleSize,
                trend: drift.trend,
                reasons: drift.reasons,
                recommendedActions: drift.recommendedActions
            }
        }
    ];

    if (drift.driftLevel === 'critical') {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-drift-critical-response',
            from: config.fromAgentId,
            to: 'agent:human-oversight',
            task: 'Run critical response review for promotion policy drift',
            priority: 'P0',
            context: {
                driftLevel: drift.driftLevel,
                reasons: drift.reasons,
                trend: drift.trend
            }
        });
    } else if (drift.driftLevel === 'watch') {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-drift-watch-review',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Run watch-level promotion policy drift review and verification expansion',
            priority: 'P1',
            context: {
                driftLevel: drift.driftLevel,
                reasons: drift.reasons,
                trend: drift.trend
            }
        });
    } else {
        tasks.push({
            kind: 'task_request',
            id: 'promotion-drift-stable-monitor',
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: 'Continue routine monitoring for promotion policy drift',
            priority: 'P2',
            context: {
                driftLevel: drift.driftLevel,
                trend: drift.trend
            }
        });
    }

    tasks.push({
        kind: 'task_request',
        id: 'promotion-drift-audit',
        from: config.fromAgentId,
        to: 'agent:rollout-controller',
        task: 'Append promotion policy drift report to governance audit trail',
        priority: drift.driftLevel === 'critical' ? 'P0' : 'P1',
        context: {
            driftLevel: drift.driftLevel,
            sampleSize: drift.sampleSize
        }
    });

    return tasks;
}
