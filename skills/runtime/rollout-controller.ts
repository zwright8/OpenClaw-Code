import type {
    SkillExecutionTask,
    SkillPriority,
    SkillRolloutControlRun,
    SkillRolloutTaskCategory,
    SkillRolloutTaskResult,
    SkillRolloutTaskStatus,
    SkillRolloutWaveExecutionSummary,
    SkillRolloutWavePlan,
    SkillRolloutWavePosture
} from './types.js';

type SkillRolloutControlOptions = {
    seed?: string;
    failBias?: number;
    approvalBias?: number;
};

type FollowUpTaskOptions = {
    fromAgentId?: string;
    maxTasks?: number;
};

const DEFAULT_CONTROL_OPTIONS: Required<SkillRolloutControlOptions> = {
    seed: 'openclaw-rollout-control',
    failBias: 0,
    approvalBias: 0
};

const DEFAULT_FOLLOW_UP_OPTIONS: Required<FollowUpTaskOptions> = {
    fromAgentId: 'agent:skills-rollout-control',
    maxTasks: 400
};

function clamp(value: number, min = 0, max = 1): number {
    return Math.max(min, Math.min(max, value));
}

function roundInt(value: number): number {
    return Math.max(0, Math.round(value));
}

function roundRate(value: number): number {
    return Number(Math.max(0, Math.min(1, value)).toFixed(4));
}

function toNumber(value: unknown, fallback = 0): number {
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

function randomRatio(seed: string): number {
    const hash = hashNumber(seed);
    return hash / 4_294_967_295;
}

function parseWaveId(taskId: string): string | undefined {
    const kickoff = taskId.match(/^wave-kickoff-([a-z]+-\d{2})$/);
    if (kickoff) return kickoff[1];
    const entry = taskId.match(/^wave-([a-z]+-\d{2})-\d{4}$/);
    if (entry) return entry[1];
    return undefined;
}

function parseSkillId(task: SkillExecutionTask): number | undefined {
    const fromContext = toNumber((task.context as Record<string, unknown>)?.skillId, NaN);
    if (Number.isFinite(fromContext) && fromContext >= 1) return Math.floor(fromContext);

    const fromTaskId = task.id.match(/(\d{4})$/);
    if (!fromTaskId) return undefined;
    return Number(fromTaskId[1]);
}

function parseLane(task: SkillExecutionTask): 'now' | 'next' | undefined {
    const waveId = parseWaveId(task.id);
    if (waveId?.startsWith('now-')) return 'now';
    if (waveId?.startsWith('next-')) return 'next';

    const lane = String((task.context as Record<string, unknown>)?.lane || '').toLowerCase();
    if (lane === 'now' || lane === 'next') return lane;
    return undefined;
}

function classifyTask(task: SkillExecutionTask): SkillRolloutTaskCategory {
    if (task.id.startsWith('wave-kickoff-')) return 'kickoff';
    if (task.id.startsWith('wave-')) return 'skill';
    if (task.id.startsWith('oversight-')) return 'oversight';
    return 'unknown';
}

function selectStatus(roll: number, failRate: number, approvalRate: number): SkillRolloutTaskStatus {
    if (roll < failRate) return 'failed';
    if (roll < failRate + approvalRate) return 'approval_pending';
    if (roll > 0.986) return 'skipped';
    return 'success';
}

function statusReason(
    category: SkillRolloutTaskCategory,
    status: SkillRolloutTaskStatus
): string {
    if (status === 'success') {
        if (category === 'kickoff') return 'wave kickoff acknowledged and execution started';
        if (category === 'skill') return 'skill rollout completed within guardrails';
        if (category === 'oversight') return 'oversight queue item resolved';
        return 'task completed';
    }
    if (status === 'approval_pending') {
        if (category === 'oversight') return 'awaiting reviewer assignment and case adjudication';
        return 'approval gates not yet cleared';
    }
    if (status === 'failed') {
        if (category === 'kickoff') return 'wave kickoff failed controller preflight';
        if (category === 'skill') return 'deployment workflow failed runtime checks';
        if (category === 'oversight') return 'oversight escalation processing failed';
        return 'task execution failed';
    }
    return 'task skipped due to controller throttling';
}

function computeLatencyMs(
    category: SkillRolloutTaskCategory,
    status: SkillRolloutTaskStatus,
    seed: string
): number {
    const roll = randomRatio(seed);

    if (category === 'kickoff') {
        const baseline = 2_000 + roll * 8_000;
        return roundInt(status === 'failed' ? baseline + 1_500 : baseline);
    }
    if (category === 'oversight') {
        const baseline = 8_000 + roll * 42_000;
        if (status === 'approval_pending') return roundInt(baseline + 6_000);
        return roundInt(baseline);
    }

    const baseline = 4_000 + roll * 24_000;
    if (status === 'approval_pending') return roundInt(baseline + 7_000);
    if (status === 'failed') return roundInt(baseline + 3_000);
    if (status === 'skipped') return roundInt(500 + roll * 2_000);
    return roundInt(baseline);
}

function evaluateTaskResult(
    task: SkillExecutionTask,
    options: Required<SkillRolloutControlOptions>
): SkillRolloutTaskResult {
    const category = classifyTask(task);
    const lane = parseLane(task);
    const skillId = parseSkillId(task);
    const context = task.context as Record<string, unknown>;
    const riskIndex = toNumber(context.riskIndex, lane === 'next' ? 55 : 45);
    const gateCount = Array.isArray(context.requiredApprovalGates)
        ? context.requiredApprovalGates.length
        : 2;
    const roll = randomRatio(`${options.seed}:${task.id}:${task.to}:${task.priority}`);

    let failRate = 0.05;
    let approvalRate = 0.06;

    if (category === 'kickoff') {
        failRate = clamp(0.015 + options.failBias * 0.5, 0.001, 0.2);
        approvalRate = clamp(0.01 + options.approvalBias * 0.2, 0, 0.15);
    } else if (category === 'oversight') {
        failRate = clamp(0.09 + options.failBias * 0.35, 0.01, 0.4);
        approvalRate = clamp(0.62 + options.approvalBias * 0.25, 0.25, 0.9);
    } else if (category === 'skill') {
        failRate = clamp(
            0.03 + (riskIndex / 100) * 0.22 + (lane === 'next' ? 0.03 : 0) + options.failBias * 0.4,
            0.01,
            0.85
        );
        approvalRate = clamp(
            0.04 + gateCount * 0.03 + (riskIndex >= 60 ? 0.05 : 0) + options.approvalBias * 0.4,
            0.01,
            0.85
        );
    } else {
        failRate = clamp(0.12 + options.failBias * 0.35, 0.01, 0.7);
        approvalRate = clamp(0.08 + options.approvalBias * 0.3, 0.01, 0.6);
    }

    const normalizedApprovalRate = clamp(approvalRate, 0, Math.max(0, 0.95 - failRate));
    const status = selectStatus(roll, failRate, normalizedApprovalRate);
    const reason = statusReason(category, status);
    const latencyMs = computeLatencyMs(category, status, `${task.id}:latency:${options.seed}`);
    const retryable = status === 'failed' && category !== 'oversight';

    return {
        taskId: task.id,
        waveId: parseWaveId(task.id),
        lane,
        category,
        skillId,
        status,
        reason,
        retryable,
        latencyMs,
        priority: task.priority
    };
}

function computeWavePosture(summary: Omit<SkillRolloutWaveExecutionSummary, 'posture'>): SkillRolloutWavePosture {
    if (summary.taskCount === 0) return 'stable';
    if (summary.failureRate >= 0.18 || summary.failedCount >= 5) return 'critical';
    if (
        summary.failureRate >= 0.08
        || summary.approvalPendingCount >= Math.max(2, Math.round(summary.taskCount * 0.12))
    ) {
        return 'degraded';
    }
    return 'stable';
}

export function runSkillRolloutControlLoop(
    wavePlan: SkillRolloutWavePlan,
    tasks: SkillExecutionTask[],
    options: SkillRolloutControlOptions = {}
): SkillRolloutControlRun {
    const effectiveOptions = {
        ...DEFAULT_CONTROL_OPTIONS,
        ...options,
        failBias: clamp(toNumber(options.failBias, DEFAULT_CONTROL_OPTIONS.failBias), -0.5, 0.5),
        approvalBias: clamp(toNumber(options.approvalBias, DEFAULT_CONTROL_OPTIONS.approvalBias), -0.5, 0.5)
    };

    const taskResults = tasks.map((task) => evaluateTaskResult(task, effectiveOptions));

    const waveAccumulator = new Map<string, {
        waveId: string;
        lane: 'now' | 'next';
        taskCount: number;
        successCount: number;
        failedCount: number;
        approvalPendingCount: number;
        skippedCount: number;
        totalLatencyMs: number;
        failedSkillIds: number[];
        approvalPendingSkillIds: number[];
    }>();

    for (const wave of wavePlan.waves) {
        waveAccumulator.set(wave.waveId, {
            waveId: wave.waveId,
            lane: wave.lane,
            taskCount: 0,
            successCount: 0,
            failedCount: 0,
            approvalPendingCount: 0,
            skippedCount: 0,
            totalLatencyMs: 0,
            failedSkillIds: [],
            approvalPendingSkillIds: []
        });
    }

    for (const result of taskResults) {
        if (!result.waveId || !waveAccumulator.has(result.waveId)) continue;
        const bucket = waveAccumulator.get(result.waveId);
        if (!bucket) continue;

        bucket.taskCount += 1;
        bucket.totalLatencyMs += result.latencyMs;

        if (result.status === 'success') bucket.successCount += 1;
        if (result.status === 'failed') {
            bucket.failedCount += 1;
            if (result.skillId) bucket.failedSkillIds.push(result.skillId);
        }
        if (result.status === 'approval_pending') {
            bucket.approvalPendingCount += 1;
            if (result.skillId) bucket.approvalPendingSkillIds.push(result.skillId);
        }
        if (result.status === 'skipped') bucket.skippedCount += 1;
    }

    const waveSummaries: SkillRolloutWaveExecutionSummary[] = Array.from(waveAccumulator.values())
        .map((entry) => {
            const successRate = entry.taskCount === 0 ? 0 : roundRate(entry.successCount / entry.taskCount);
            const failureRate = entry.taskCount === 0 ? 0 : roundRate(entry.failedCount / entry.taskCount);
            const avgLatencyMs = entry.taskCount === 0 ? 0 : roundInt(entry.totalLatencyMs / entry.taskCount);
            const base = {
                waveId: entry.waveId,
                lane: entry.lane,
                taskCount: entry.taskCount,
                successCount: entry.successCount,
                failedCount: entry.failedCount,
                approvalPendingCount: entry.approvalPendingCount,
                skippedCount: entry.skippedCount,
                successRate,
                failureRate,
                avgLatencyMs,
                failedSkillIds: Array.from(new Set(entry.failedSkillIds)),
                approvalPendingSkillIds: Array.from(new Set(entry.approvalPendingSkillIds))
            };

            return {
                ...base,
                posture: computeWavePosture(base)
            };
        })
        .sort((a, b) => a.waveId.localeCompare(b.waveId));

    const summary = {
        totalTasks: taskResults.length,
        successCount: taskResults.filter((entry) => entry.status === 'success').length,
        failedCount: taskResults.filter((entry) => entry.status === 'failed').length,
        approvalPendingCount: taskResults.filter((entry) => entry.status === 'approval_pending').length,
        skippedCount: taskResults.filter((entry) => entry.status === 'skipped').length,
        wavePostureCounts: {
            stable: waveSummaries.filter((entry) => entry.posture === 'stable').length,
            degraded: waveSummaries.filter((entry) => entry.posture === 'degraded').length,
            critical: waveSummaries.filter((entry) => entry.posture === 'critical').length
        },
        overallPosture: 'stable' as SkillRolloutWavePosture
    };

    const failedRate = summary.totalTasks === 0 ? 0 : summary.failedCount / summary.totalTasks;
    if (summary.wavePostureCounts.critical > 0 || failedRate >= 0.15) {
        summary.overallPosture = 'critical';
    } else if (summary.wavePostureCounts.degraded > 0 || summary.approvalPendingCount >= 80) {
        summary.overallPosture = 'degraded';
    }

    return {
        generatedAt: new Date().toISOString(),
        sourceWavePlanGeneratedAt: wavePlan.generatedAt,
        sourceTaskCount: tasks.length,
        summary,
        waveSummaries,
        taskResults
    };
}

export function rolloutControlToFollowUpTasks(
    controlRun: SkillRolloutControlRun,
    wavePlan: SkillRolloutWavePlan,
    options: FollowUpTaskOptions = {}
): SkillExecutionTask[] {
    const config = {
        ...DEFAULT_FOLLOW_UP_OPTIONS,
        ...options,
        maxTasks: Math.max(20, Math.floor(toNumber(options.maxTasks, DEFAULT_FOLLOW_UP_OPTIONS.maxTasks)))
    };

    const skillMap = new Map<number, {
        skillId: number;
        skillName: string;
        title: string;
        domainSlug: string;
        riskIndex: number;
    }>();
    for (const wave of wavePlan.waves) {
        for (const entry of wave.entries) {
            skillMap.set(entry.skillId, {
                skillId: entry.skillId,
                skillName: entry.skillName,
                title: entry.title,
                domainSlug: entry.domainSlug,
                riskIndex: entry.riskIndex
            });
        }
    }
    for (const entry of wavePlan.oversightQueue) {
        skillMap.set(entry.skillId, {
            skillId: entry.skillId,
            skillName: entry.skillName,
            title: entry.title,
            domainSlug: entry.domain.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            riskIndex: entry.riskIndex
        });
    }

    const followUps: SkillExecutionTask[] = [];

    for (const wave of controlRun.waveSummaries.filter((entry) => entry.posture === 'critical')) {
        followUps.push({
            kind: 'task_request',
            id: `control-wave-${wave.waveId}`,
            from: config.fromAgentId,
            to: 'agent:rollout-controller',
            task: `Pause and remediate critical rollout wave ${wave.waveId}`,
            priority: 'P0',
            context: {
                waveId: wave.waveId,
                posture: wave.posture,
                failedCount: wave.failedCount,
                approvalPendingCount: wave.approvalPendingCount,
                failureRate: wave.failureRate
            }
        });
    }

    const candidateResults = controlRun.taskResults
        .filter((entry) => entry.status === 'failed' || entry.status === 'approval_pending')
        .sort((a, b) => {
            const statusWeight = (value: SkillRolloutTaskStatus) => (value === 'failed' ? 0 : 1);
            const priorityWeight = (value: SkillPriority) => (value === 'P0' ? 0 : value === 'P1' ? 1 : 2);
            const statusDelta = statusWeight(a.status) - statusWeight(b.status);
            if (statusDelta !== 0) return statusDelta;
            const priorityDelta = priorityWeight(a.priority) - priorityWeight(b.priority);
            if (priorityDelta !== 0) return priorityDelta;
            return a.taskId.localeCompare(b.taskId);
        });

    for (const result of candidateResults) {
        if (followUps.length >= config.maxTasks) break;
        const skillId = result.skillId;
        if (!skillId) continue;
        const skill = skillMap.get(skillId);
        if (!skill) continue;

        if (result.status === 'failed') {
            const priority: SkillPriority = (skill.riskIndex >= 65 || result.priority === 'P0') ? 'P0' : 'P1';
            followUps.push({
                kind: 'task_request',
                id: `remediate-${String(skillId).padStart(4, '0')}`,
                from: config.fromAgentId,
                to: `agent:${skill.domainSlug}-swarm`,
                task: `Remediate rollout failure for ${skill.title}`,
                priority,
                context: {
                    skillId,
                    sourceTaskId: result.taskId,
                    waveId: result.waveId,
                    reason: result.reason,
                    retryable: result.retryable
                }
            });
            continue;
        }

        followUps.push({
            kind: 'task_request',
            id: `approval-${String(skillId).padStart(4, '0')}`,
            from: config.fromAgentId,
            to: 'agent:human-oversight',
            task: `Expedite approval for ${skill.title}`,
            priority: result.priority === 'P0' ? 'P0' : 'P1',
            context: {
                skillId,
                sourceTaskId: result.taskId,
                waveId: result.waveId,
                reason: result.reason
            }
        });
    }

    followUps.push({
        kind: 'task_request',
        id: 'control-report-publish',
        from: config.fromAgentId,
        to: 'agent:rollout-controller',
        task: 'Publish rollout control telemetry and incident digest',
        priority: controlRun.summary.overallPosture === 'critical' ? 'P0' : 'P1',
        context: {
            overallPosture: controlRun.summary.overallPosture,
            failedCount: controlRun.summary.failedCount,
            approvalPendingCount: controlRun.summary.approvalPendingCount,
            generatedAt: controlRun.generatedAt
        }
    });

    return followUps;
}
