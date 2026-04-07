import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const RecommendationTargetMap = {
    strengthen_truth_process: 'agent:analysis',
    apply_humanity_safeguards: 'agent:safety',
    expand_curiosity_pipeline: 'agent:research',
    pause_autonomy: 'agent:ops',
    redesign_for_human_safety: 'agent:safety',
    add_humanity_safeguards: 'agent:review',
    document_human_benefit: 'agent:analysis'
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

function normalizeLaunches(inputPayload, {
    fromAgentId = 'agent:constitution-controller',
    defaultTarget = 'agent:ops',
    at = Date.now()
} = {}) {
    const launches = Array.isArray(inputPayload?.launchBatch?.launches)
        ? inputPayload.launchBatch.launches
        : [];

    return launches
        .filter((row) => row && typeof row === 'object')
        .map((row, index) => {
            let taskRequest = row.taskRequest;
            if (!taskRequest || typeof taskRequest !== 'object' || !taskRequest.kind) {
                taskRequest = buildTaskRequest({
                    id: row?.taskId || randomUUID(),
                    from: fromAgentId,
                    target: row?.target || defaultTarget,
                    priority: row?.priority || 'normal',
                    task: row?.objective
                        ? `Launch mission ${row.missionId}: ${row.objective}`
                        : `Launch ${row.missionId || `item-${index + 1}`}`,
                    context: row?.context || {},
                    createdAt: at + index
                });
            }

            return {
                missionId: row?.missionId || row?.id || `mission-${index + 1}`,
                objective: row?.objective || row?.taskRequest?.task || '',
                score: safeNumber(row?.score, 0),
                launchDecision: row?.launchDecision || 'deferred',
                reason: row?.reason || null,
                taskRequest
            };
        });
}

function normalizeConstitution(inputPayload) {
    const report = inputPayload?.constitutionReport && typeof inputPayload.constitutionReport === 'object'
        ? inputPayload.constitutionReport
        : {};
    const recommendations = Array.isArray(report.recommendations) ? report.recommendations : [];
    const blockingReasons = Array.isArray(report.blockingReasons) ? report.blockingReasons : [];

    return {
        tier: report.tier || 'aligned',
        overallScore: safeNumber(report.overallScore, 100),
        recommendations,
        blockingReasons
    };
}

function normalizeHumanity(inputPayload) {
    const report = inputPayload?.humanityReport && typeof inputPayload.humanityReport === 'object'
        ? inputPayload.humanityReport
        : {};
    const recommendations = Array.isArray(report.recommendations) ? report.recommendations : [];

    return {
        posture: report.posture || 'aligned',
        recommendations
    };
}

function determineMode(constitutionTier, humanityPosture) {
    if (constitutionTier === 'non_compliant' || humanityPosture === 'blocked') {
        return 'paused';
    }

    if (constitutionTier === 'caution' || humanityPosture === 'review_required') {
        return 'caution';
    }

    return 'active';
}

function mergeRecommendations(constitution, humanity) {
    const all = [];
    for (const item of constitution.recommendations || []) {
        all.push({
            source: 'constitution',
            type: item.type || 'constitution_action',
            title: item.title || 'Constitution remediation',
            description: item.description || '',
            priority: item.priority || 'P2'
        });
    }

    for (const item of humanity.recommendations || []) {
        all.push({
            source: 'humanity',
            type: item.type || 'humanity_action',
            title: item.title || 'Humanity remediation',
            description: item.description || '',
            priority: item.priority || 'P2'
        });
    }

    const dedup = new Map();
    for (const item of all) {
        const key = `${item.source}|${item.type}|${item.title}`;
        if (!dedup.has(key)) {
            dedup.set(key, item);
        }
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return [...dedup.values()].sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.title).localeCompare(String(b.title));
    });
}

export function computeConstitutionalExecutionPlan(inputPayload, {
    now = Date.now,
    maxActiveLaunches = null,
    cautionThrottleFactor = 0.5,
    allowLaunchWhenReviewRequired = false
} = {}) {
    const at = safeNow(now);
    const constitution = normalizeConstitution(inputPayload || {});
    const humanity = normalizeHumanity(inputPayload || {});
    const mode = determineMode(constitution.tier, humanity.posture);
    const launches = normalizeLaunches(inputPayload || {}, { at });

    const immediate = launches
        .filter((row) => row.launchDecision === 'immediate')
        .sort((a, b) => b.score - a.score);
    const recommendations = mergeRecommendations(constitution, humanity);

    let limit = immediate.length;
    if (mode === 'paused') {
        limit = 0;
    } else if (mode === 'caution') {
        const throttle = Math.max(0, Math.min(1, Number(cautionThrottleFactor)));
        limit = Math.floor(immediate.length * throttle);
        if (immediate.length > 0 && limit === 0 && allowLaunchWhenReviewRequired) {
            limit = 1;
        }
    } else if (Number.isFinite(Number(maxActiveLaunches))) {
        limit = Math.max(0, Math.floor(Number(maxActiveLaunches)));
    }

    const launchActions = [];
    let dispatchCount = 0;
    let deferredByConstitutionCount = 0;
    let blockedCount = 0;

    for (let index = 0; index < launches.length; index++) {
        const row = launches[index];
        let action = row.launchDecision === 'blocked' ? 'block' : 'defer';
        let reason = row.reason || 'not_immediate';

        if (row.launchDecision === 'blocked') {
            action = 'block';
            reason = row.reason || 'launch_blocked';
            blockedCount++;
        } else if (row.launchDecision === 'immediate') {
            if (dispatchCount < limit) {
                action = 'dispatch';
                reason = mode === 'active' ? 'constitution_active' : 'constitution_caution_allowed';
                dispatchCount++;
            } else {
                action = mode === 'paused' ? 'block' : 'defer';
                reason = mode === 'paused'
                    ? 'constitution_paused'
                    : 'constitution_throttled';
                deferredByConstitutionCount++;
                if (action === 'block') blockedCount++;
            }
        } else {
            action = 'defer';
            reason = row.reason || 'launch_not_ready';
        }

        launchActions.push({
            missionId: row.missionId,
            objective: row.objective,
            score: row.score,
            action,
            reason,
            taskRequest: clone(row.taskRequest)
        });
    }

    const dispatchTasks = launchActions
        .filter((row) => row.action === 'dispatch')
        .map((row) => clone(row.taskRequest));

    const blockingReasons = [
        ...constitution.blockingReasons,
        ...(humanity.posture === 'blocked' ? ['humanity_blocked'] : []),
        ...(mode === 'paused' ? ['constitution_paused'] : [])
    ];

    return {
        at,
        mode,
        constitutionTier: constitution.tier,
        humanityPosture: humanity.posture,
        summary: {
            launchCount: launches.length,
            immediateRequested: immediate.length,
            dispatchCount,
            deferredByConstitutionCount,
            blockedCount,
            recommendationCount: recommendations.length
        },
        blockingReasons: [...new Set(blockingReasons)],
        launchActions,
        dispatchTasks,
        recommendations
    };
}

export function constitutionalPlanToDispatchTasks(planPayload) {
    if (!planPayload || typeof planPayload !== 'object') {
        throw new Error('constitutionalPlanToDispatchTasks requires plan payload');
    }

    return Array.isArray(planPayload.dispatchTasks)
        ? planPayload.dispatchTasks.map((task) => clone(task))
        : [];
}

export function constitutionalPlanToMitigationTasks(planPayload, {
    fromAgentId = 'agent:constitution-controller',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!planPayload || typeof planPayload !== 'object') {
        throw new Error('constitutionalPlanToMitigationTasks requires plan payload');
    }

    const recommendations = Array.isArray(planPayload.recommendations)
        ? planPayload.recommendations
        : [];
    const nowMs = safeNow(Date.now);
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityTaskMap[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            mode: planPayload.mode,
            constitutionTier: planPayload.constitutionTier,
            humanityPosture: planPayload.humanityPosture,
            recommendationType: recommendation.type,
            source: recommendation.source,
            description: recommendation.description
        },
        createdAt: nowMs + index
    }));
}

export class ConstitutionalExecutionController {
    constructor({
        localAgentId = 'agent:constitution-controller',
        now = Date.now,
        maxHistory = 150
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 150;
        this.history = [];
    }

    plan(inputPayload, options = {}) {
        const plan = computeConstitutionalExecutionPlan(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(plan);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(plan);
    }

    buildDispatchTasks(planPayload) {
        return constitutionalPlanToDispatchTasks(planPayload);
    }

    buildMitigationTasks(planPayload, options = {}) {
        return constitutionalPlanToMitigationTasks(planPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 25 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 25))
            .map((entry) => clone(entry));
    }
}

export const __constitutionalControllerInternals = {
    normalizeLaunches,
    determineMode,
    mergeRecommendations
};
