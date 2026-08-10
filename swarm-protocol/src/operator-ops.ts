import { buildTaskDispatchFingerprint } from './task-orchestrator.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);
const DEFAULT_STALE_DISPATCH_MS = 30 * 60 * 1000;

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

function percentile(values, percentileRank) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.min(
        sorted.length - 1,
        Math.max(0, Math.ceil(sorted.length * percentileRank) - 1)
    );
    return sorted[index];
}

export function summarizeTaskRecords(records, { now = Date.now } = {}) {
    const list = Array.isArray(records) ? records : [];
    const at = nowMs(now);
    const summary = {
        total: list.length,
        open: 0,
        terminal: 0,
        pendingApprovals: 0,
        openAgeMs: {
            oldest: 0,
            average: 0,
            p95: 0
        },
        oldestOpenTaskId: null,
        byStatus: {},
        byTarget: {}
    };

    const openAges = [];
    let oldestOpenAgeMs = -1;
    for (const record of list) {
        const status = record?.status || 'unknown';
        summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;

        const target = record?.target || 'unassigned';
        summary.byTarget[target] = (summary.byTarget[target] || 0) + 1;

        if (status === 'awaiting_approval') summary.pendingApprovals++;
        if (TERMINAL_STATUSES.has(status)) summary.terminal++;
        else {
            summary.open++;
            const createdAt = Number(record?.createdAt);
            if (Number.isFinite(createdAt)) {
                const ageMs = Math.max(0, at - createdAt);
                openAges.push(ageMs);
                if (ageMs > oldestOpenAgeMs) {
                    oldestOpenAgeMs = ageMs;
                    summary.oldestOpenTaskId = record?.taskId || null;
                }
            }
        }
    }

    if (openAges.length > 0) {
        summary.openAgeMs.oldest = Math.max(...openAges);
        summary.openAgeMs.average = Number(
            (openAges.reduce((total, ageMs) => total + ageMs, 0) / openAges.length).toFixed(2)
        );
        summary.openAgeMs.p95 = percentile(openAges, 0.95);
    }

    return summary;
}

export function listQueue(
    records,
    {
        approvalsOnly = false,
        target = null,
        limit = 50,
        now = Date.now
    } = {}
) {
    const list = Array.isArray(records) ? records : [];
    const filtered = [];
    const at = nowMs(now);

    for (const record of list) {
        if (!record || typeof record !== 'object') continue;
        if (approvalsOnly && record.status !== 'awaiting_approval') continue;
        if (!approvalsOnly && TERMINAL_STATUSES.has(record.status)) continue;
        if (target && record.target !== target) continue;

        const updatedAt = Number(record.updatedAt ?? record.createdAt);
        const deadlineAt = Number(record.deadlineAt);
        const nextRetryAt = Number(record.nextRetryAt);

        filtered.push({
            taskId: record.taskId,
            status: record.status,
            target: record.target,
            priority: record.request?.priority || 'normal',
            task: record.request?.task || '',
            attempts: record.attempts || 0,
            updatedAt: record.updatedAt,
            ageMs: Number.isFinite(updatedAt) ? Math.max(0, at - updatedAt) : null,
            deadlineAt: Number.isFinite(deadlineAt) ? deadlineAt : null,
            deadlineInMs: Number.isFinite(deadlineAt) ? deadlineAt - at : null,
            overdue: Number.isFinite(deadlineAt) && deadlineAt < at,
            nextRetryAt: Number.isFinite(nextRetryAt) ? nextRetryAt : null,
            retryInMs: Number.isFinite(nextRetryAt) ? nextRetryAt - at : null,
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
        dispatchFingerprint: record.dispatchFingerprint || buildTaskDispatchFingerprint(record.request),
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
    record.dispatchFingerprint = buildTaskDispatchFingerprint(record.request);

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
            record.dispatchFingerprint = buildTaskDispatchFingerprint(record.request);
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

export function recoverStaleDispatchRecord(
    records,
    taskId,
    decision,
    {
        actor = 'human:ops',
        reason = 'operator_stale_dispatch_recovery',
        sideEffectStatus = 'unknown',
        externalRuntimeCorrelation = null,
        evidenceReviewed = [],
        notes = null,
        expectedDispatchFingerprint = null,
        staleDispatchMs = DEFAULT_STALE_DISPATCH_MS,
        now = Date.now
    } = {}
) {
    const normalizedDecision = typeof decision === 'string' ? decision.trim() : '';
    const allowedDecisions = new Set([
        'close_completed',
        'requeue_no_side_effect',
        'fail_side_effect_unknown',
        'escalate_manual_review'
    ]);
    if (!allowedDecisions.has(normalizedDecision)) {
        throw new Error(`Unsupported stale dispatch recovery decision: ${decision}`);
    }

    const index = buildIndex(records);
    const record = index.get(taskId);
    if (!record) {
        throw new Error(`Unknown taskId: ${taskId}`);
    }

    if (record.status !== 'dispatched') {
        throw new Error(`Task ${taskId} is not dispatched`);
    }

    const thresholdMs = Number(staleDispatchMs);
    if (!Number.isFinite(thresholdMs) || thresholdMs <= 0) {
        throw new Error('staleDispatchMs must be a positive number');
    }
    const updatedAt = Number(record.updatedAt ?? record.createdAt);
    const at = nowMs(now);
    if (!Number.isFinite(updatedAt)) {
        throw new Error(`Task ${taskId} cannot be recovered without a dispatch timestamp`);
    }
    const ageMs = Math.max(0, at - updatedAt);
    if (ageMs < thresholdMs) {
        throw new Error(`Task ${taskId} is not stale (age=${ageMs}ms threshold=${thresholdMs}ms)`);
    }

    const currentDispatchFingerprint = typeof record.dispatchFingerprint === 'string' && record.dispatchFingerprint
        ? record.dispatchFingerprint
        : buildTaskDispatchFingerprint(record.request);
    if (record.dispatchFingerprint && !expectedDispatchFingerprint) {
        throw new Error(`Task ${taskId} recovery requires expectedDispatchFingerprint`);
    }
    if (expectedDispatchFingerprint && expectedDispatchFingerprint !== currentDispatchFingerprint) {
        throw new Error(`Task ${taskId} dispatch fingerprint mismatch`);
    }

    const normalizedSideEffectStatus = typeof sideEffectStatus === 'string' && sideEffectStatus.trim()
        ? sideEffectStatus.trim()
        : 'unknown';
    if (normalizedDecision === 'requeue_no_side_effect' && normalizedSideEffectStatus !== 'none') {
        throw new Error('requeue_no_side_effect requires sideEffectStatus=none');
    }

    const evidence = Array.isArray(evidenceReviewed)
        ? evidenceReviewed.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
        : [];
    const requiredEvidenceByDecision = {
        close_completed: [
            'replay_timeline_reviewed',
            'external_runtime_result_checked',
            'side_effect_ledger_checked'
        ],
        requeue_no_side_effect: [
            'replay_timeline_reviewed',
            'external_runtime_result_checked',
            'side_effect_ledger_checked'
        ]
    };
    const requiredEvidence = requiredEvidenceByDecision[normalizedDecision] || [];
    if (requiredEvidence.length > 0) {
        const missingEvidence = requiredEvidence.filter((item) => !evidence.includes(item));
        if (missingEvidence.length > 0) {
            throw new Error(`${normalizedDecision} requires evidence: ${missingEvidence.join(', ')}`);
        }
    }
    if (normalizedDecision === 'close_completed' && normalizedSideEffectStatus !== 'completed') {
        throw new Error('close_completed requires sideEffectStatus=completed');
    }
    const correlation = typeof externalRuntimeCorrelation === 'string' && externalRuntimeCorrelation.trim()
        ? externalRuntimeCorrelation.trim()
        : record.request?.traceparent || record.request?.context?.traceparent || record.taskId;
    const previousStatus = record.status;

    record.history = Array.isArray(record.history) ? record.history : [];
    record.recoveryDecision = {
        schemaVersion: 'swarm-protocol.stale-dispatch-recovery-decision.v1',
        decidedAt: at,
        actor,
        decision: normalizedDecision,
        reason,
        sideEffectStatus: normalizedSideEffectStatus,
        externalRuntimeCorrelation: correlation,
        evidenceReviewed: evidence,
        notes,
        dispatchFingerprint: currentDispatchFingerprint
    };
    record.history.push({
        at,
        event: 'operator_stale_dispatch_recovery_decision',
        actor,
        decision: normalizedDecision,
        reason,
        sideEffectStatus: normalizedSideEffectStatus,
        externalRuntimeCorrelation: correlation,
        evidenceReviewed: evidence,
        notes,
        dispatchFingerprint: currentDispatchFingerprint
    });

    record.updatedAt = at;
    record.nextRetryAt = null;

    if (normalizedDecision === 'close_completed') {
        record.status = 'completed';
        record.closedAt = at;
    } else if (normalizedDecision === 'requeue_no_side_effect') {
        record.status = 'created';
        record.deadlineAt = at;
        record.lastError = null;
    } else if (normalizedDecision === 'fail_side_effect_unknown') {
        record.status = 'failed';
        record.closedAt = at;
        record.lastError = reason;
    } else {
        record.status = 'paused_recovery';
    }

    index.set(taskId, record);
    return {
        records: toArray(index),
        updated: clone(record),
        decision: normalizedDecision,
        previousStatus
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
