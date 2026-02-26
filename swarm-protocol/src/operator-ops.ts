const TERMINAL_STATUSES = new Set([
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

function nowMs(now) {
    const value = Number(now());
    return Number.isFinite(value) ? value : Date.now();
}

function sortByUpdatedDesc(records) {
    return [...records].sort((a, b) => {
        const left = Number(a.updatedAt ?? a.createdAt ?? 0);
        const right = Number(b.updatedAt ?? b.createdAt ?? 0);
        return right - left;
    });
}

function buildIndex(records) {
    const map = new Map();
    for (const record of records || []) {
        if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') continue;
        map.set(record.taskId, clone(record));
    }
    return map;
}

function toArray(index) {
    return [...index.values()];
}

export function summarizeTaskRecords(records) {
    const list = Array.isArray(records) ? records : [];
    const summary = {
        total: list.length,
        open: 0,
        terminal: 0,
        pendingApprovals: 0,
        byStatus: {},
        byTarget: {}
    };

    for (const record of list) {
        const status = record?.status || 'unknown';
        summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;

        const target = record?.target || 'unassigned';
        summary.byTarget[target] = (summary.byTarget[target] || 0) + 1;

        if (status === 'awaiting_approval') summary.pendingApprovals++;
        if (TERMINAL_STATUSES.has(status)) summary.terminal++;
        else summary.open++;
    }

    return summary;
}

export function listQueue(
    records,
    {
        approvalsOnly = false,
        target = null,
        limit = 50
    } = {}
) {
    const list = Array.isArray(records) ? records : [];
    const filtered = [];

    for (const record of list) {
        if (!record || typeof record !== 'object') continue;
        if (approvalsOnly && record.status !== 'awaiting_approval') continue;
        if (!approvalsOnly && TERMINAL_STATUSES.has(record.status)) continue;
        if (target && record.target !== target) continue;

        filtered.push({
            taskId: record.taskId,
            status: record.status,
            target: record.target,
            priority: record.request?.priority || 'normal',
            task: record.request?.task || '',
            attempts: record.attempts || 0,
            updatedAt: record.updatedAt,
            approval: record.approval || null
        });
    }

    const capped = sortByUpdatedDesc(filtered)
        .slice(0, Math.max(1, Number(limit) || 50));
    return capped;
}

export function replayTask(records, taskId) {
    const index = buildIndex(records);
    const record = index.get(taskId);
    if (!record) return null;

    return {
        taskId: record.taskId,
        status: record.status,
        target: record.target,
        attempts: record.attempts,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        closedAt: record.closedAt,
        history: Array.isArray(record.history) ? [...record.history] : []
    };
}

export function rerouteTaskRecord(
    records,
    taskId,
    newTarget,
    {
        actor = 'human:ops',
        reason = 'operator_reroute',
        now = Date.now
    } = {}
) {
    if (!newTarget || typeof newTarget !== 'string') {
        throw new Error('newTarget is required');
    }

    const index = buildIndex(records);
    const record = index.get(taskId);
    if (!record) {
        throw new Error(`Unknown taskId: ${taskId}`);
    }

    if (TERMINAL_STATUSES.has(record.status)) {
        throw new Error(`Cannot reroute terminal task ${taskId} (${record.status})`);
    }

    const at = nowMs(now);
    const fromTarget = record.target;

    record.target = newTarget;
    if (record.request && typeof record.request === 'object') {
        record.request.target = newTarget;
    }

    record.updatedAt = at;
    record.status = 'created';
    record.nextRetryAt = null;
    record.deadlineAt = at;
    record.history = Array.isArray(record.history) ? record.history : [];
    record.history.push({
        at,
        event: 'operator_reroute',
        actor,
        reason,
        fromTarget,
        toTarget: newTarget
    });

    index.set(taskId, record);
    return {
        records: toArray(index),
        updated: clone(record)
    };
}

export function drainTarget(
    records,
    target,
    {
        redirectTarget = null,
        actor = 'human:ops',
        reason = 'operator_drain',
        now = Date.now
    } = {}
) {
    if (!target || typeof target !== 'string') {
        throw new Error('target is required for drain');
    }

    const index = buildIndex(records);
    const at = nowMs(now);
    const updated = [];

    for (const record of index.values()) {
        if (!record || record.target !== target) continue;
        if (TERMINAL_STATUSES.has(record.status)) continue;

        record.history = Array.isArray(record.history) ? record.history : [];

        if (redirectTarget && typeof redirectTarget === 'string') {
            const fromTarget = record.target;
            record.target = redirectTarget;
            if (record.request && typeof record.request === 'object') {
                record.request.target = redirectTarget;
            }
            record.status = 'created';
            record.nextRetryAt = null;
            record.deadlineAt = at;
            record.updatedAt = at;
            record.history.push({
                at,
                event: 'operator_drain_reroute',
                actor,
                reason,
                fromTarget,
                toTarget: redirectTarget
            });
        } else {
            record.status = 'paused_drain';
            record.updatedAt = at;
            record.history.push({
                at,
                event: 'operator_drain_pause',
                actor,
                reason,
                target
            });
        }

        updated.push(clone(record));
        index.set(record.taskId, record);
    }

    return {
        records: toArray(index),
        updated
    };
}

export function overrideApproval(
    records,
    taskId,
    {
        approved,
        actor = 'human:ops',
        reason = approved ? 'operator_override_approve' : 'operator_override_deny',
        now = Date.now
    } = {}
) {
    const index = buildIndex(records);
    const record = index.get(taskId);
    if (!record) {
        throw new Error(`Unknown taskId: ${taskId}`);
    }

    if (record.status !== 'awaiting_approval') {
        throw new Error(`Task ${taskId} is not awaiting approval`);
    }

    const at = nowMs(now);
    const decision = approved === true;

    record.approval = {
        ...(record.approval || {}),
        status: decision ? 'approved' : 'denied',
        reviewedAt: at,
        reviewer: actor,
        reviewReason: reason
    };

    record.history = Array.isArray(record.history) ? record.history : [];
    record.history.push({
        at,
        event: decision ? 'operator_override_approved' : 'operator_override_denied',
        actor,
        reason
    });

    record.updatedAt = at;
    if (decision) {
        record.status = 'created';
    } else {
        record.status = 'rejected';
        record.closedAt = at;
    }

    index.set(taskId, record);
    return {
        records: toArray(index),
        updated: clone(record)
    };
}

export function collectLifecycleEvents(
    records,
    {
        taskId = null,
        target = null,
        limit = 100
    } = {}
) {
    const events = [];

    for (const record of records || []) {
        if (!record || typeof record !== 'object') continue;
        if (taskId && record.taskId !== taskId) continue;
        if (target && record.target !== target) continue;

        for (const item of record.history || []) {
            if (!item || typeof item !== 'object') continue;
            events.push({
                at: Number(item.at) || 0,
                taskId: record.taskId,
                target: record.target,
                status: record.status,
                event: item.event,
                details: clone(item)
            });
        }
    }

    return events
        .sort((a, b) => b.at - a.at)
        .slice(0, Math.max(1, Number(limit) || 100));
}

export const __operatorOpsInternals = {
    TERMINAL_STATUSES,
    buildIndex
};
