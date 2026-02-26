const STAGE_BY_EVENT = {
    created: 'creation',
    approval_requested: 'approval',
    approval_approved: 'approval',
    approval_denied: 'approval',
    send_attempt: 'dispatch',
    send_success: 'dispatch',
    send_failed: 'dispatch',
    acknowledged: 'receipt',
    retry_scheduled: 'retry',
    timed_out: 'timeout',
    result: 'result',
    rejected: 'result',
    transport_error: 'result',
    operator_reroute: 'intervention',
    operator_drain_pause: 'intervention',
    operator_drain_reroute: 'intervention',
    operator_override_approved: 'intervention',
    operator_override_denied: 'intervention'
};

const CAUSAL_RULES = [
    {
        event: 'approval_approved',
        causedBy: ['approval_requested']
    },
    {
        event: 'approval_denied',
        causedBy: ['approval_requested']
    },
    {
        event: 'send_success',
        causedBy: ['send_attempt']
    },
    {
        event: 'send_failed',
        causedBy: ['send_attempt']
    },
    {
        event: 'retry_scheduled',
        causedBy: ['send_failed', 'timed_out']
    },
    {
        event: 'result',
        causedBy: ['send_success', 'acknowledged']
    },
    {
        event: 'transport_error',
        causedBy: ['send_failed', 'retry_scheduled']
    }
];

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function stageForEvent(event) {
    return STAGE_BY_EVENT[event] || 'other';
}

function causalCandidates(eventName) {
    const rule = CAUSAL_RULES.find((item) => item.event === eventName);
    return rule ? rule.causedBy : [];
}

function sortByTimeAsc(events) {
    return [...events].sort((a, b) => {
        const left = safeNumber(a.at);
        const right = safeNumber(b.at);
        if (left !== right) return left - right;
        return safeNumber(a._index) - safeNumber(b._index);
    });
}

export function buildTaskTimeline(taskRecord, {
    includeCausal = true
} = {}) {
    if (!taskRecord || typeof taskRecord !== 'object') {
        throw new Error('buildTaskTimeline requires a task record');
    }

    const taskId = taskRecord.taskId || 'unknown';
    const history = Array.isArray(taskRecord.history)
        ? taskRecord.history.map((item, index) => ({ ...item, _index: index }))
        : [];

    const sorted = sortByTimeAsc(history);
    const timeline = sorted.map((item, index) => ({
        id: `${taskId}:${index + 1}`,
        at: safeNumber(item.at),
        event: item.event || 'unknown',
        stage: stageForEvent(item.event),
        details: clone(item),
        causedBy: null
    }));

    const causalLinks = [];
    if (includeCausal) {
        for (let i = 0; i < timeline.length; i++) {
            const entry = timeline[i];
            const candidates = causalCandidates(entry.event);
            if (candidates.length === 0) continue;

            for (let j = i - 1; j >= 0; j--) {
                if (!candidates.includes(timeline[j].event)) continue;
                entry.causedBy = timeline[j].id;
                causalLinks.push({
                    from: timeline[j].id,
                    to: entry.id,
                    relation: 'caused_by'
                });
                break;
            }
        }
    }

    return {
        taskId,
        status: taskRecord.status || null,
        target: taskRecord.target || null,
        timeline,
        causalLinks
    };
}

export function explainDecision({
    taskRequest = null,
    routeSelection = null,
    approvalDecision = null,
    policyDecision = null,
    sandboxPlan = null
} = {}) {
    const factors = [];

    if (routeSelection?.selectedAgentId) {
        const winner = Array.isArray(routeSelection.ranked)
            ? routeSelection.ranked.find((row) => row.agentId === routeSelection.selectedAgentId || row.endpointAgentId === routeSelection.selectedAgentId)
            : null;

        factors.push({
            factor: 'routing',
            impact: 'positive',
            detail: winner
                ? `Selected ${routeSelection.selectedAgentId} with score ${winner.score}`
                : `Selected ${routeSelection.selectedAgentId}`
        });
    }

    if (policyDecision) {
        if (policyDecision.allowed === false || policyDecision.decision === 'deny') {
            factors.push({
                factor: 'policy',
                impact: 'negative',
                detail: `Dispatch denied by policy (${(policyDecision.reasons || []).map((item) => item.code || item.reason).join(', ') || 'rule'})`
            });
        } else {
            const redactionCount = Array.isArray(policyDecision.redactions)
                ? policyDecision.redactions.length
                : 0;
            factors.push({
                factor: 'policy',
                impact: 'neutral',
                detail: redactionCount > 0
                    ? `Policy allowed with ${redactionCount} redactions`
                    : 'Policy allowed without redactions'
            });
        }
    }

    if (approvalDecision) {
        if (approvalDecision.required === true) {
            factors.push({
                factor: 'approval',
                impact: 'neutral',
                detail: `Human approval required (${approvalDecision.reason || 'policy'})`
            });
        } else {
            factors.push({
                factor: 'approval',
                impact: 'positive',
                detail: 'No approval gate required'
            });
        }
    }

    if (sandboxPlan) {
        factors.push({
            factor: 'sandbox',
            impact: sandboxPlan.escalationRequired ? 'neutral' : 'positive',
            detail: sandboxPlan.escalationRequired
                ? `Sandbox ${sandboxPlan.profileId} requires escalation`
                : `Sandbox ${sandboxPlan.profileId} selected`
        });
    }

    if (taskRequest?.priority) {
        factors.push({
            factor: 'priority',
            impact: 'neutral',
            detail: `Task priority ${taskRequest.priority}`
        });
    }

    const confidence = factors.length > 0
        ? Number(Math.min(1, 0.45 + (factors.length * 0.08)).toFixed(2))
        : 0.3;

    const summary = factors.length > 0
        ? factors.map((item) => item.detail).join(' | ')
        : 'No decision telemetry available';

    return {
        summary,
        confidence,
        factors
    };
}

function actionTemplate({
    id,
    label,
    intent,
    taskId,
    actor,
    payload = {},
    enabled = true,
    reason = null
}) {
    return {
        id,
        label,
        intent,
        enabled,
        reason,
        payload: {
            taskId,
            ...payload
        },
        auditTrail: {
            eventType: 'ux_intervention_triggered',
            actor,
            payload: {
                actionId: id,
                taskId,
                intent,
                ...payload
            }
        }
    };
}

export function buildInterventionActions(taskRecord, {
    actor = 'human:ops'
} = {}) {
    if (!taskRecord || typeof taskRecord !== 'object') {
        throw new Error('buildInterventionActions requires task record');
    }

    const taskId = taskRecord.taskId;
    const status = taskRecord.status || 'unknown';
    const actions = [];

    actions.push(actionTemplate({
        id: 'view_timeline',
        label: 'View Timeline',
        intent: 'inspect',
        taskId,
        actor
    }));

    if (status === 'awaiting_approval') {
        actions.push(actionTemplate({
            id: 'approve_task',
            label: 'Approve',
            intent: 'approval',
            taskId,
            actor,
            payload: { approved: true }
        }));
        actions.push(actionTemplate({
            id: 'deny_task',
            label: 'Deny',
            intent: 'approval',
            taskId,
            actor,
            payload: { approved: false }
        }));
    }

    if (['dispatched', 'acknowledged', 'retry_scheduled', 'created'].includes(status)) {
        actions.push(actionTemplate({
            id: 'force_retry',
            label: 'Force Retry',
            intent: 'retry',
            taskId,
            actor
        }));
        actions.push(actionTemplate({
            id: 'reroute_task',
            label: 'Reroute',
            intent: 'reroute',
            taskId,
            actor,
            payload: { fromTarget: taskRecord.target || null }
        }));
        actions.push(actionTemplate({
            id: 'pause_drain',
            label: 'Drain Target',
            intent: 'drain',
            taskId,
            actor,
            payload: { target: taskRecord.target || null }
        }));
    }

    if (['failed', 'timed_out', 'transport_error', 'rejected'].includes(status)) {
        actions.push(actionTemplate({
            id: 'replay_task',
            label: 'Replay',
            intent: 'replay',
            taskId,
            actor
        }));
        actions.push(actionTemplate({
            id: 'reroute_and_retry',
            label: 'Reroute + Retry',
            intent: 'reroute_retry',
            taskId,
            actor,
            payload: { fromTarget: taskRecord.target || null }
        }));
    }

    return actions;
}

export function createInterventionAuditEntry(action, {
    actor = null,
    reason = null,
    now = Date.now
} = {}) {
    if (!action || typeof action !== 'object') {
        throw new Error('createInterventionAuditEntry requires action');
    }

    const at = safeNumber(now());
    return {
        at,
        eventType: 'ux_intervention_triggered',
        actor: actor || action.auditTrail?.actor || 'human:ops',
        payload: {
            actionId: action.id,
            intent: action.intent,
            taskId: action.payload?.taskId || null,
            reason,
            ...clone(action.payload || {})
        }
    };
}

export class CollaborationUxEngine {
    buildTaskTimeline(taskRecord, options = {}) {
        return buildTaskTimeline(taskRecord, options);
    }

    explainDecision(context) {
        return explainDecision(context);
    }

    buildInterventionActions(taskRecord, options = {}) {
        return buildInterventionActions(taskRecord, options);
    }

    createInterventionAuditEntry(action, options = {}) {
        return createInterventionAuditEntry(action, options);
    }
}

export const __uxInternals = {
    STAGE_BY_EVENT,
    CAUSAL_RULES
};
