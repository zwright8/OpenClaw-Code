import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    triage_critical_queue: 'agent:ops',
    assign_operator_oncall: 'agent:ops-lead',
    request_missing_context: 'agent:planner',
    rebalance_operator_load: 'agent:ops-lead',
    run_operator_handoff_brief: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const PriorityWeight = {
    critical: 95,
    high: 75,
    normal: 52,
    low: 32
};

const InterventionStatuses = new Set([
    'awaiting_approval',
    'failed',
    'timed_out',
    'transport_error',
    'paused_drain'
]);

const TerminalStatuses = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

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

function normalizeTaskRecords(inputPayload, nowMs) {
    const records = Array.isArray(inputPayload?.taskRecords)
        ? inputPayload.taskRecords
        : [];

    return records
        .filter((record) => record && typeof record === 'object')
        .map((record, index) => {
            const createdAt = safeNumber(record.createdAt, nowMs);
            const updatedAt = safeNumber(record.updatedAt, createdAt);
            const priorityInput = record?.request?.priority;
            const priority = typeof priorityInput === 'string' && PriorityWeight[priorityInput]
                ? priorityInput
                : 'normal';
            const ageMinutes = Math.max(0, (nowMs - updatedAt) / 60_000);
            const riskScore = clamp(safeNumber(
                record?.riskScore ?? record?.request?.context?.riskScore,
                PriorityWeight[priority] * 0.75
            ));

            return {
                taskId: typeof record.taskId === 'string' && record.taskId.trim()
                    ? record.taskId.trim()
                    : `task-${index + 1}`,
                status: typeof record.status === 'string' && record.status.trim()
                    ? record.status.trim()
                    : 'created',
                target: typeof record.target === 'string' && record.target.trim()
                    ? record.target.trim()
                    : (typeof record?.request?.target === 'string' && record.request.target.trim()
                        ? record.request.target.trim()
                        : 'unassigned'),
                priority,
                createdAt,
                updatedAt,
                ageMinutes: Number(ageMinutes.toFixed(2)),
                taskText: typeof record?.request?.task === 'string'
                    ? record.request.task
                    : '',
                context: record?.request?.context && typeof record.request.context === 'object'
                    ? record.request.context
                    : {},
                approval: record?.approval && typeof record.approval === 'object'
                    ? record.approval
                    : null,
                assignedOperatorId: typeof record?.assignedOperatorId === 'string' && record.assignedOperatorId.trim()
                    ? record.assignedOperatorId.trim()
                    : null,
                riskScore
            };
        });
}

function normalizeOperators(inputPayload) {
    const operators = Array.isArray(inputPayload?.operators)
        ? inputPayload.operators
        : [];
    return operators
        .filter((operator) => operator && typeof operator === 'object')
        .map((operator, index) => ({
            id: typeof operator.id === 'string' && operator.id.trim()
                ? operator.id.trim()
                : `human:operator-${index + 1}`,
            name: typeof operator.name === 'string' && operator.name.trim()
                ? operator.name.trim()
                : `Operator ${index + 1}`,
            maxConcurrent: Math.max(1, Math.floor(safeNumber(operator.maxConcurrent, 4))),
            shiftStatus: typeof operator.shiftStatus === 'string' && operator.shiftStatus.trim()
                ? operator.shiftStatus.trim()
                : 'active'
        }));
}

function contextClarityScore(taskRecord) {
    const hasTaskText = taskRecord.taskText.trim().length >= 8;
    const contextKeys = Object.keys(taskRecord.context || {});
    const hasContext = contextKeys.length > 0;
    const hasRisk = taskRecord.riskScore > 0;
    const hasApprovalReason = !!(taskRecord.approval && typeof taskRecord.approval.reason === 'string' && taskRecord.approval.reason.trim());
    return clamp(Math.round(
        (hasTaskText ? 36 : 0)
        + (hasContext ? 32 : 0)
        + (hasRisk ? 18 : 0)
        + (hasApprovalReason ? 14 : 0)
    ));
}

function recommendedAction(taskRecord, urgencyScore) {
    if (taskRecord.status === 'awaiting_approval') return 'decide_approval';
    if (taskRecord.status === 'failed' || taskRecord.status === 'transport_error') return 'reroute_or_retry';
    if (taskRecord.status === 'timed_out') return 'unblock_and_retry';
    if (taskRecord.status === 'paused_drain') return 'resume_or_reroute';
    if (!TerminalStatuses.has(taskRecord.status) && urgencyScore >= 70) return 'check_execution_progress';
    return 'monitor';
}

function buildInterventionQueue(taskRecords) {
    const queue = taskRecords.map((taskRecord) => {
        const basePriority = PriorityWeight[taskRecord.priority] || PriorityWeight.normal;
        const agePressure = clamp(taskRecord.ageMinutes / 2.5, 0, 35);
        const statusPressure = InterventionStatuses.has(taskRecord.status)
            ? 18
            : (TerminalStatuses.has(taskRecord.status) ? -20 : 4);
        const urgencyScore = clamp(Math.round(
            basePriority * 0.52
            + taskRecord.riskScore * 0.3
            + agePressure
            + statusPressure
        ));
        const clarityScore = contextClarityScore(taskRecord);
        const interventionRequired = InterventionStatuses.has(taskRecord.status) || urgencyScore >= 68;

        return {
            taskId: taskRecord.taskId,
            target: taskRecord.target,
            status: taskRecord.status,
            priority: taskRecord.priority,
            ageMinutes: taskRecord.ageMinutes,
            riskScore: taskRecord.riskScore,
            urgencyScore,
            clarityScore,
            interventionRequired,
            recommendedAction: recommendedAction(taskRecord, urgencyScore),
            assignedOperatorId: taskRecord.assignedOperatorId
        };
    });

    return queue.sort((a, b) => {
        if (Number(b.interventionRequired) !== Number(a.interventionRequired)) {
            return Number(b.interventionRequired) - Number(a.interventionRequired);
        }
        if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
        return b.ageMinutes - a.ageMinutes;
    });
}

function buildOperatorLoad(operators, queue) {
    if (operators.length === 0) return [];

    const activeByOperator = new Map();
    const urgencyByOperator = new Map();

    for (const entry of queue) {
        if (!entry.assignedOperatorId) continue;
        activeByOperator.set(entry.assignedOperatorId, (activeByOperator.get(entry.assignedOperatorId) || 0) + 1);
        urgencyByOperator.set(entry.assignedOperatorId, (urgencyByOperator.get(entry.assignedOperatorId) || 0) + entry.urgencyScore);
    }

    return operators.map((operator) => {
        const activeAssignments = activeByOperator.get(operator.id) || 0;
        const urgencyBacklog = urgencyByOperator.get(operator.id) || 0;
        const utilization = clamp((activeAssignments / operator.maxConcurrent) * 100);
        const overloaded = utilization >= 90 || (utilization >= 75 && urgencyBacklog >= 190);

        return {
            operatorId: operator.id,
            operatorName: operator.name,
            shiftStatus: operator.shiftStatus,
            maxConcurrent: operator.maxConcurrent,
            activeAssignments,
            utilization: Number(utilization.toFixed(2)),
            urgencyBacklog,
            overloaded
        };
    }).sort((a, b) => {
        if (Number(b.overloaded) !== Number(a.overloaded)) {
            return Number(b.overloaded) - Number(a.overloaded);
        }
        return b.utilization - a.utilization;
    });
}

function summarize(queue, taskRecords, operatorLoad) {
    const openCount = taskRecords.filter((taskRecord) => !TerminalStatuses.has(taskRecord.status)).length;
    const interventionCount = queue.filter((entry) => entry.interventionRequired).length;
    const criticalCount = queue.filter((entry) => entry.interventionRequired && entry.urgencyScore >= 85).length;
    const approvalCount = taskRecords.filter((taskRecord) => taskRecord.status === 'awaiting_approval').length;
    const avgClarityScore = queue.length > 0
        ? Number((queue.reduce((acc, entry) => acc + entry.clarityScore, 0) / queue.length).toFixed(2))
        : 0;
    const avgUrgencyScore = queue.length > 0
        ? Number((queue.reduce((acc, entry) => acc + entry.urgencyScore, 0) / queue.length).toFixed(2))
        : 0;
    const overloadedOperators = operatorLoad.filter((entry) => entry.overloaded).length;

    let posture = 'stable';
    if (criticalCount > 0 || overloadedOperators > 0) posture = 'critical';
    else if (interventionCount > 0 || avgClarityScore < 70) posture = 'review_required';

    return {
        taskCount: taskRecords.length,
        openCount,
        interventionCount,
        approvalCount,
        criticalCount,
        avgClarityScore,
        avgUrgencyScore,
        overloadedOperators,
        posture
    };
}

function buildAlerts(summary, queue) {
    const alerts = [];
    if (summary.approvalCount > 0) alerts.push('pending_approvals_backlog');
    if (summary.criticalCount > 0) alerts.push('critical_operator_interventions');
    if (summary.avgClarityScore < 65) alerts.push('operator_context_clarity_low');
    if (summary.overloadedOperators > 0) alerts.push('operator_capacity_overload');
    if (summary.interventionCount >= 8) alerts.push('operator_intervention_backlog_high');
    if (queue.some((entry) => entry.urgencyScore >= 90 && entry.ageMinutes >= 30)) alerts.push('stale_critical_task_detected');
    return alerts;
}

function buildRecommendations(summary, queue, alerts, operatorLoad) {
    const recommendations = [];
    const topCritical = queue.filter((entry) => entry.interventionRequired && entry.urgencyScore >= 85)
        .slice(0, 5);

    for (const entry of topCritical) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'triage_critical_queue',
            taskId: entry.taskId,
            title: `Triage critical task ${entry.taskId}`,
            description: `Urgency ${entry.urgencyScore} with status ${entry.status}.`,
            priority: 'P0'
        });
    }

    if (summary.approvalCount > 0 || summary.criticalCount > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'assign_operator_oncall',
            title: 'Assign focused on-call operator coverage',
            description: `${summary.approvalCount} approvals and ${summary.criticalCount} critical interventions pending.`,
            priority: summary.criticalCount > 0 ? 'P0' : 'P1'
        });
    }

    if (alerts.includes('operator_context_clarity_low')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'request_missing_context',
            title: 'Request missing execution context for operator queue',
            description: 'Low-context tasks are slowing operator decision speed and increasing risk.',
            priority: 'P1'
        });
    }

    if (alerts.includes('operator_capacity_overload')) {
        const overloaded = operatorLoad.filter((entry) => entry.overloaded).slice(0, 3);
        for (const operator of overloaded) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'rebalance_operator_load',
                operatorId: operator.operatorId,
                title: `Rebalance workload for ${operator.operatorName}`,
                description: `Utilization ${operator.utilization}% with urgency backlog ${operator.urgencyBacklog}.`,
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'run_operator_handoff_brief',
            title: 'Run operator handoff briefing',
            description: 'Create a concise intervention brief with owners and deadlines for active risks.',
            priority: alerts.includes('critical_operator_interventions') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.taskId || a.operatorId || '').localeCompare(String(b.taskId || b.operatorId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.taskId || '') === String(entry.taskId || '')
            && String(other.operatorId || '') === String(entry.operatorId || '')
        )) === index);
}

export function buildHumanOversightWorkbench(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const taskRecords = normalizeTaskRecords(inputPayload || {}, at);
    const operators = normalizeOperators(inputPayload || {});
    const interventionQueue = buildInterventionQueue(taskRecords);
    const operatorLoad = buildOperatorLoad(operators, interventionQueue);
    const summary = summarize(interventionQueue, taskRecords, operatorLoad);
    const alerts = buildAlerts(summary, interventionQueue);
    const recommendations = buildRecommendations(summary, interventionQueue, alerts, operatorLoad);

    return {
        at,
        summary,
        interventionQueue,
        operatorLoad,
        alerts,
        recommendations
    };
}

export function oversightWorkbenchToTasks(reportPayload, {
    fromAgentId = 'agent:oversight',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('oversightWorkbenchToTasks requires report payload');
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
            taskId: recommendation.taskId || null,
            operatorId: recommendation.operatorId || null,
            posture: reportPayload.summary?.posture || null,
            criticalCount: reportPayload.summary?.criticalCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class HumanOversightWorkbench {
    constructor({
        localAgentId = 'agent:oversight',
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
        const report = buildHumanOversightWorkbench(inputPayload, {
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
        return oversightWorkbenchToTasks(reportPayload, {
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

export const __humanOversightWorkbenchInternals = {
    normalizeTaskRecords,
    normalizeOperators,
    buildInterventionQueue,
    buildOperatorLoad,
    buildRecommendations
};
