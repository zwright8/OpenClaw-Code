import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { FileTaskStore } from '../../swarm-protocol/runtime.js';
import { dispatchCreatedQueueTasks, runQueueMaintenance } from './queue-dispatcher.js';
import { processOutboxEnvelopes } from './outbox-processor.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

const TRACE_SCHEMA_VERSION = 'bot-worker-loop.trace.v2';
const OTEL_JSONL_SCHEMA_VERSION = 'bot-worker-loop.otel-jsonl.v1';
const TRACE_SEMCONV = 'otel.gen_ai.experimental';
const DEFAULT_STALE_DISPATCH_MS = 30 * 60 * 1000;
const MAX_STALE_TASK_IDS = 10;
const MAX_RECOVERY_PLAN_TASKS = 20;
const OTEL_SPAN_KIND = {
    INTERNAL: 1,
    SERVER: 2,
    CLIENT: 3,
    PRODUCER: 4,
    CONSUMER: 5
};

function safeNow(nowFactory = Date.now) {
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function parsePositiveInt(value, fallback, minimum = 1) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < minimum) return fallback;
    return numeric;
}

function parseNonNegativeInt(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 0) return fallback;
    return numeric;
}

function normalizeFailureRate(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(1, numeric));
}

function isTraceparent(value) {
    return typeof value === 'string'
        && /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/i.test(value.trim());
}

function isW3cTraceId(value) {
    return typeof value === 'string'
        && /^[0-9a-f]{32}$/i.test(value.trim())
        && !/^0{32}$/i.test(value.trim());
}

function isW3cSpanId(value) {
    return typeof value === 'string'
        && /^[0-9a-f]{16}$/i.test(value.trim())
        && !/^0{16}$/i.test(value.trim());
}

async function sleep(ms) {
    const duration = parseNonNegativeInt(ms, 0);
    if (duration <= 0) return;
    await new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

function getRecordUpdatedAt(record) {
    const value = Number(record?.updatedAt ?? record?.createdAt ?? record?.request?.createdAt);
    return Number.isFinite(value) ? value : null;
}

function getLatestHistoryEvent(record) {
    const history = Array.isArray(record?.history) ? record.history : [];
    if (history.length === 0) return null;
    const latest = history
        .filter((item) => item && typeof item === 'object')
        .sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0))[0];
    if (!latest) return null;
    return {
        at: Number(latest.at) || null,
        event: typeof latest.event === 'string' ? latest.event : 'unknown'
    };
}

function getRecordTraceparent(record) {
    const candidates = [
        record?.request?.traceparent,
        record?.request?.context?.traceparent,
        record?.traceparent
    ];
    const found = candidates.find((value) => isTraceparent(value));
    return found ? found.trim().toLowerCase() : null;
}

function buildRecoveryEvidenceChecklist({ taskId, traceparent }) {
    const correlation = traceparent || taskId;
    return [
        {
            id: 'replay_timeline_reviewed',
            description: `Review operator replay for task ${taskId}.`,
            command: `npm --prefix swarm-protocol run ops -- replay ${taskId}`
        },
        {
            id: 'external_runtime_result_checked',
            description: `Search the external OpenClaw runtime for result or receipt records correlated by ${correlation}.`
        },
        {
            id: 'side_effect_ledger_checked',
            description: `Confirm no durable external side effect was committed for task ${taskId}.`
        },
        {
            id: 'operator_decision_recorded',
            description: 'Record the recovery decision in task history before requeueing or closing the task.'
        }
    ];
}

function buildRecoveryDecisionRecordTemplate({ taskId, traceparent, idempotencyKey }) {
    const correlation = traceparent || taskId;
    return {
        schemaVersion: 'bot-worker-loop.stale-dispatch-decision.v1',
        taskId,
        correlation,
        idempotencyKey,
        decision: 'pending',
        allowedDecisions: [
            'close_completed',
            'requeue_no_side_effect',
            'fail_side_effect_unknown',
            'escalate_manual_review'
        ],
        requiredBeforeDecision: [
            'replay_timeline_reviewed',
            'external_runtime_result_checked',
            'side_effect_ledger_checked'
        ],
        requiredFields: [
            'decision',
            'operator',
            'decidedAt',
            'evidenceReviewed',
            'externalRuntimeCorrelation',
            'sideEffectStatus',
            'notes'
        ],
        defaults: {
            operator: null,
            decidedAt: null,
            evidenceReviewed: [],
            externalRuntimeCorrelation: correlation,
            sideEffectStatus: 'unknown',
            notes: null
        }
    };
}

function summarizeQueueRecords(records, {
    nowMs = Date.now(),
    staleDispatchMs = DEFAULT_STALE_DISPATCH_MS
} = {}) {
    const byStatus = {};
    let open = 0;
    let terminal = 0;
    let created = 0;
    let dispatched = 0;
    let dispatchedStale = 0;
    let oldestDispatchedAgeMs = 0;
    let acknowledged = 0;
    let retryScheduled = 0;
    let awaitingApproval = 0;
    const staleDispatchedTaskIds = [];
    const observedNowMs = Number.isFinite(Number(nowMs)) ? Number(nowMs) : Date.now();
    const staleThresholdMs = parseNonNegativeInt(staleDispatchMs, DEFAULT_STALE_DISPATCH_MS);

    const list = Array.isArray(records) ? records : [];
    for (const record of list) {
        const status = typeof record?.status === 'string' && record.status.trim()
            ? record.status.trim()
            : 'unknown';
        byStatus[status] = (byStatus[status] || 0) + 1;

        if (TERMINAL_STATUSES.has(status)) {
            terminal++;
        } else {
            open++;
        }

        if (status === 'created') created++;
        if (status === 'dispatched') {
            dispatched++;
            const updatedAt = getRecordUpdatedAt(record);
            const ageMs = updatedAt === null ? 0 : Math.max(0, observedNowMs - updatedAt);
            oldestDispatchedAgeMs = Math.max(oldestDispatchedAgeMs, ageMs);
            if (staleThresholdMs > 0 && ageMs >= staleThresholdMs) {
                dispatchedStale++;
                if (staleDispatchedTaskIds.length < MAX_STALE_TASK_IDS && typeof record.taskId === 'string') {
                    staleDispatchedTaskIds.push(record.taskId);
                }
            }
        }
        if (status === 'acknowledged') acknowledged++;
        if (status === 'retry_scheduled') retryScheduled++;
        if (status === 'awaiting_approval') awaitingApproval++;
    }

    return {
        total: list.length,
        open,
        terminal,
        created,
        dispatched,
        dispatchedStale,
        oldestDispatchedAgeMs,
        staleDispatchedTaskIds,
        acknowledged,
        retryScheduled,
        awaitingApproval,
        byStatus
    };
}

async function loadQueueSummary({ storePath, nowFactory, staleDispatchMs }) {
    const now = typeof nowFactory === 'function' ? nowFactory : Date.now;
    const store = new FileTaskStore({
        filePath: storePath,
        now
    });
    const records = await store.loadRecords();
    return summarizeQueueRecords(records, {
        nowMs: safeNow(now),
        staleDispatchMs
    });
}

export function buildStaleDispatchRecoveryPlan(records, {
    nowMs = Date.now(),
    staleDispatchMs = DEFAULT_STALE_DISPATCH_MS,
    limit = MAX_RECOVERY_PLAN_TASKS
} = {}) {
    const observedNowMs = Number.isFinite(Number(nowMs)) ? Number(nowMs) : Date.now();
    const staleThresholdMs = parseNonNegativeInt(staleDispatchMs, DEFAULT_STALE_DISPATCH_MS);
    const maxCandidates = parsePositiveInt(limit, MAX_RECOVERY_PLAN_TASKS);
    const candidates = [];

    for (const record of Array.isArray(records) ? records : []) {
        if (!record || typeof record !== 'object' || record.status !== 'dispatched') continue;
        const updatedAt = getRecordUpdatedAt(record);
        const ageMs = updatedAt === null ? 0 : Math.max(0, observedNowMs - updatedAt);
        if (staleThresholdMs > 0 && ageMs < staleThresholdMs) continue;

        const traceparent = getRecordTraceparent(record);
        const idempotencyKey = `task:${record.taskId}:attempt:${record.attempts || 0}`;
        candidates.push({
            taskId: record.taskId,
            target: record.target || record.request?.target || 'unknown',
            ageMs,
            updatedAt,
            attempts: record.attempts || 0,
            traceparent,
            idempotencyKey,
            recoveryDecisionRequired: true,
            recoveryDecisionRecord: buildRecoveryDecisionRecordTemplate({
                taskId: record.taskId,
                traceparent,
                idempotencyKey
            }),
            latestHistoryEvent: getLatestHistoryEvent(record),
            recommendedAction: 'inspect_external_runtime_before_requeue',
            evidenceRequired: buildRecoveryEvidenceChecklist({
                taskId: record.taskId,
                traceparent
            }),
            operatorCommands: [
                `npm --prefix swarm-protocol run ops -- replay ${record.taskId}`,
                `npm --prefix swarm-protocol run ops -- queue --limit ${maxCandidates}`
            ]
        });
    }

    candidates.sort((a, b) => b.ageMs - a.ageMs || String(a.taskId).localeCompare(String(b.taskId)));

    return {
        schemaVersion: 'bot-worker-loop.stale-dispatch-recovery.v1',
        generatedAt: observedNowMs,
        staleDispatchMs: staleThresholdMs,
        totalCandidates: candidates.length,
        dryRun: true,
        mutatesQueue: false,
        defaultAction: 'inspect_external_runtime_before_requeue',
        rationale: 'Dispatched records may already have side effects in the external OpenClaw runtime, so recovery is planned but not applied automatically.',
        candidates: candidates.slice(0, maxCandidates),
        nextSteps: candidates.length > 0
            ? [
                'Inspect each replay timeline and external runtime result store for a late completion.',
                'Only requeue a task after confirming the previous dispatch produced no durable side effect.',
                'Record the operator decision in task history before rerunning the worker loop.'
            ]
            : [
                'No stale dispatched tasks met the configured threshold.'
            ]
    };
}

async function loadStaleDispatchRecoveryPlan({
    storePath,
    nowFactory,
    staleDispatchMs
}) {
    const now = typeof nowFactory === 'function' ? nowFactory : Date.now;
    const store = new FileTaskStore({
        filePath: storePath,
        now
    });
    const records = await store.loadRecords();
    return buildStaleDispatchRecoveryPlan(records, {
        nowMs: safeNow(now),
        staleDispatchMs
    });
}

function normalizeStopReason(reason) {
    const value = typeof reason === 'string' ? reason.trim().toLowerCase() : '';
    if (!value) return 'max_cycles_reached';
    return value;
}

function normalizeTraceToken(value) {
    const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
    return normalized.replace(/[^a-z0-9_./:-]+/g, '_').replace(/^_+|_+$/g, '') || 'unknown';
}

function stableStringify(value) {
    if (Array.isArray(value)) {
        return `[${value.map((item) => stableStringify(item)).join(',')}]`;
    }
    if (value && typeof value === 'object') {
        return `{${Object.keys(value).sort().map((key) => (
            `${JSON.stringify(key)}:${stableStringify(value[key])}`
        )).join(',')}}`;
    }
    return JSON.stringify(value);
}

function buildStableHash(value) {
    return createHash('sha256')
        .update(stableStringify(value))
        .digest('hex')
        .slice(0, 16);
}

function buildStableHex(value, length) {
    const hex = createHash('sha256')
        .update(stableStringify(value))
        .digest('hex')
        .slice(0, length);
    return /^0+$/.test(hex) ? `1${hex.slice(1)}` : hex;
}

function buildTraceContext({
    workflowTraceId,
    phase = 'root',
    cycle = 0,
    parentSpanId = null
}) {
    const normalizedWorkflowTraceId = normalizeTraceToken(workflowTraceId || 'bot-worker-loop');
    const traceId = buildStableHex({
        workflowTraceId: normalizedWorkflowTraceId
    }, 32);
    const spanId = buildStableHex({
        workflowTraceId: normalizedWorkflowTraceId,
        phase: normalizeTraceToken(phase),
        cycle: parseNonNegativeInt(cycle, 0)
    }, 16);
    const parentId = parentSpanId || buildStableHex({
        workflowTraceId: normalizedWorkflowTraceId,
        phase: 'root',
        cycle: 0
    }, 16);

    return {
        traceId,
        spanId,
        parentSpanId: parentId,
        traceparent: `00-${traceId}-${spanId}-01`
    };
}

function buildTraceSpanId(traceId, phase, cycle = 0) {
    return `${normalizeTraceToken(traceId)}.${parseNonNegativeInt(cycle, 0)}.${normalizeTraceToken(phase)}`;
}

function getTraceOperationName(phase) {
    if (phase === 'dispatch' || phase === 'outbox_process') return 'execute_tool';
    return 'invoke_workflow';
}

function getTraceKind(phase) {
    if (phase === 'dispatch' || phase === 'outbox_process') return 'tool';
    if (phase === 'bot_runtime_attention' || phase === 'dispatch_failure') return 'guardrail';
    return 'workflow';
}

function enrichTraceEvent(event, traceContext = {}) {
    const phase = normalizeTraceToken(event?.phase);
    const cycle = parseNonNegativeInt(event?.cycle, 0);
    const traceId = normalizeTraceToken(traceContext.traceId || event?.traceId || 'bot-worker-loop');
    const parentSpanId = traceContext.parentSpanId || event?.parentSpanId || `${traceId}.root`;
    const w3cTrace = buildTraceContext({
        workflowTraceId: traceId,
        phase,
        cycle,
        parentSpanId: traceContext.w3cParentSpanId || event?.spanContext?.parentSpanId || null
    });
    const operationName = getTraceOperationName(phase);
    const eventName = `bot_worker_loop.${phase}`;
    const spanName = `${operationName} ${eventName}`;
    const generatedAttributes = {
        'gen_ai.operation.name': operationName,
        'gen_ai.agent.name': 'openclaw-bot-worker-loop',
        'openclaw.workflow.name': 'bot_worker_loop',
        'openclaw.workflow.phase': phase,
        trace_id: w3cTrace.traceId,
        span_id: w3cTrace.spanId,
        parent_span_id: w3cTrace.parentSpanId,
        traceparent: event?.traceparent || w3cTrace.traceparent,
        ...(cycle > 0 ? { 'openclaw.workflow.cycle': cycle } : {})
    };
    const generatedSpanContext = {
        traceId: w3cTrace.traceId,
        spanId: w3cTrace.spanId,
        parentSpanId: w3cTrace.parentSpanId,
        traceFlags: '01'
    };

    return {
        schemaVersion: TRACE_SCHEMA_VERSION,
        traceId,
        spanId: event?.spanId || buildTraceSpanId(traceId, phase, cycle),
        parentSpanId,
        name: event?.name || eventName,
        kind: event?.kind || getTraceKind(phase),
        spanKind: event?.spanKind || 'INTERNAL',
        semconv: TRACE_SEMCONV,
        ...event,
        traceparent: event?.traceparent || w3cTrace.traceparent,
        spanContext: {
            ...generatedSpanContext,
            ...(event?.spanContext || {})
        },
        attributes: {
            ...generatedAttributes,
            ...(event?.attributes || {})
        }
    };
}

function pushTraceEvent(events, event, traceContext = {}) {
    if (!Array.isArray(events) || !event || typeof event !== 'object') return;
    const at = Number(event.at);
    events.push({
        ...enrichTraceEvent(event, traceContext),
        at: Number.isFinite(at) ? at : Date.now()
    });
}

function buildCycleTraceEvents({
    cycle,
    startedAt,
    finishedAt,
    maintenanceResult,
    dispatchResult,
    processResult,
    queueBefore,
    queueAfter,
    idleStreak,
    staleDispatchMs,
    traceContext
}) {
    const events = [];
    const selected = dispatchResult?.stats?.selected || 0;
    const dispatched = dispatchResult?.stats?.dispatched || 0;
    const awaitingApproval = dispatchResult?.stats?.awaitingApproval || 0;
    const failedDispatch = dispatchResult?.stats?.failed || 0;
    const scheduledRetries = maintenanceResult?.scheduledRetries || 0;
    const maintenanceRetried = maintenanceResult?.retried || 0;
    const maintenanceTimedOut = maintenanceResult?.timedOut || 0;
    const maintenanceTransportFailures = maintenanceResult?.transportFailures || 0;
    const resultsAccepted = processResult?.resultsAccepted || 0;
    const botTasksExecuted = processResult?.botTasksExecuted || 0;
    const botTasksFailed = processResult?.botTasksFailed || 0;
    const hardeningBlocked = processResult?.botSkillHardeningBlocked || 0;
    const followupTasksSaved = processResult?.followupTasksSaved || 0;
    const filesFound = processResult?.filesFound || 0;
    const filesArchived = processResult?.filesArchived || 0;

    pushTraceEvent(events, {
        at: startedAt,
        cycle,
        phase: 'queue_before',
        queueOpen: queueBefore?.open || 0,
        queueCreated: queueBefore?.created || 0,
        queueDispatched: queueBefore?.dispatched || 0,
        queueRetryScheduled: queueBefore?.retryScheduled || 0,
        queueDispatchedStale: queueBefore?.dispatchedStale || 0,
        queueAwaitingApproval: queueBefore?.awaitingApproval || 0
    }, traceContext);

    pushTraceEvent(events, {
        at: startedAt,
        cycle,
        phase: 'maintenance',
        checked: maintenanceResult?.checked || 0,
        scheduledRetries,
        retried: maintenanceRetried,
        timedOut: maintenanceTimedOut,
        transportFailures: maintenanceTransportFailures
    }, traceContext);

    pushTraceEvent(events, {
        at: startedAt,
        cycle,
        phase: 'dispatch',
        selected,
        dispatched,
        awaitingApproval,
        failedDispatch,
        skippedNonCognition: dispatchResult?.stats?.skippedNonCognition || 0
    }, traceContext);

    pushTraceEvent(events, {
        at: finishedAt,
        cycle,
        phase: 'outbox_process',
        filesFound,
        filesArchived,
        resultsAccepted,
        botTasksExecuted,
        botTasksFailed,
        botSkillHardeningBlocked: hardeningBlocked,
        followupTasksSaved
    }, traceContext);

    if (failedDispatch > 0) {
        pushTraceEvent(events, {
            at: finishedAt,
            cycle,
            phase: 'dispatch_failure',
            failedDispatch,
            failures: Array.isArray(dispatchResult?.failed)
                ? dispatchResult.failed.slice(0, 5)
                : []
        }, traceContext);
    }

    if (botTasksFailed > 0 || hardeningBlocked > 0 || (queueAfter?.dispatchedStale || 0) > 0) {
        pushTraceEvent(events, {
            at: finishedAt,
            cycle,
            phase: 'bot_runtime_attention',
            botTasksFailed,
            botSkillHardeningBlocked: hardeningBlocked,
            staleDispatches: queueAfter?.dispatchedStale || 0,
            oldestDispatchedAgeMs: queueAfter?.oldestDispatchedAgeMs || 0,
            staleDispatchMs,
            staleDispatchedTaskIds: Array.isArray(queueAfter?.staleDispatchedTaskIds)
                ? queueAfter.staleDispatchedTaskIds
                : []
        }, traceContext);
    }

    pushTraceEvent(events, {
        at: finishedAt,
        cycle,
        phase: 'queue_after',
        queueOpen: queueAfter?.open || 0,
        queueCreated: queueAfter?.created || 0,
        queueDispatched: queueAfter?.dispatched || 0,
        queueRetryScheduled: queueAfter?.retryScheduled || 0,
        queueDispatchedStale: queueAfter?.dispatchedStale || 0,
        queueAwaitingApproval: queueAfter?.awaitingApproval || 0,
        idleStreak
    }, traceContext);

    return events;
}

function toUnixNano(value) {
    const numeric = Number(value);
    const millis = Number.isFinite(numeric) ? numeric : Date.now();
    return String(Math.max(0, Math.round(millis)) * 1_000_000);
}

function normalizeOtelValue(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string' || typeof value === 'boolean') return value;
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : String(value);
    }
    if (Array.isArray(value)) {
        return value
            .map((item) => normalizeOtelValue(item))
            .filter((item) => item !== null);
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}

function buildOtelAttributes(source) {
    const entries = Object.entries(source || {})
        .map(([key, value]) => [key, normalizeOtelValue(value)])
        .filter(([, value]) => value !== null);
    return Object.fromEntries(entries);
}

function otelSpanKind(value) {
    const normalized = typeof value === 'string' ? value.trim().toUpperCase() : '';
    return OTEL_SPAN_KIND[normalized] || OTEL_SPAN_KIND.INTERNAL;
}

function otelStatusForEvent(event) {
    const status = String(event?.status || event?.resultStatus || '').toLowerCase();
    const failed = event?.failedDispatch > 0
        || event?.botTasksFailed > 0
        || event?.botSkillHardeningBlocked > 0
        || status === 'fail'
        || status === 'failed'
        || status === 'error';
    return {
        code: failed ? 2 : 1,
        message: failed ? 'error' : 'ok'
    };
}

export function buildBotWorkerLoopOtelSpans(report) {
    const events = Array.isArray(report?.traceEvents) ? report.traceEvents : [];
    return events
        .filter((event) => (
            isW3cTraceId(event?.spanContext?.traceId)
            && isW3cSpanId(event?.spanContext?.spanId)
            && (event?.traceparent === undefined || isTraceparent(event.traceparent))
        ))
        .map((event) => {
            const attributes = buildOtelAttributes({
                schemaVersion: event.schemaVersion || TRACE_SCHEMA_VERSION,
                semconv: event.semconv || TRACE_SEMCONV,
                'openclaw.trace.schema_version': event.schemaVersion || TRACE_SCHEMA_VERSION,
                'openclaw.trace.event_name': event.name,
                'openclaw.trace.event_kind': event.kind,
                'openclaw.trace.traceparent': event.traceparent,
                ...event.attributes,
                ...(event.cycle === undefined ? {} : { 'openclaw.workflow.cycle': event.cycle }),
                ...(event.phase === undefined ? {} : { 'openclaw.workflow.phase': event.phase })
            });
            return {
                schemaVersion: OTEL_JSONL_SCHEMA_VERSION,
                traceId: event.spanContext.traceId,
                spanId: event.spanContext.spanId,
                parentSpanId: event.spanContext.parentSpanId || '',
                traceState: '',
                name: event.name || 'bot_worker_loop.event',
                kind: otelSpanKind(event.spanKind),
                startTimeUnixNano: toUnixNano(event.at),
                endTimeUnixNano: toUnixNano(event.finishedAt || event.at),
                attributes,
                status: otelStatusForEvent(event)
            };
        });
}

export function buildBotWorkerLoopTraceExportDiagnostics(report) {
    const events = Array.isArray(report?.traceEvents) ? report.traceEvents : [];
    const droppedEvents = [];
    let missingSpanContext = 0;
    let missingTraceId = 0;
    let missingSpanId = 0;
    let invalidTraceId = 0;
    let invalidSpanId = 0;
    let invalidTraceparent = 0;

    for (const [index, event] of events.entries()) {
        const spanContext = event?.spanContext && typeof event.spanContext === 'object'
            ? event.spanContext
            : null;
        const reasons = [];
        if (!spanContext) {
            missingSpanContext++;
            reasons.push('missing_span_context');
        }
        if (!spanContext?.traceId) {
            missingTraceId++;
            reasons.push('missing_trace_id');
        }
        if (!spanContext?.spanId) {
            missingSpanId++;
            reasons.push('missing_span_id');
        }
        if (spanContext?.traceId && !isW3cTraceId(spanContext.traceId)) {
            invalidTraceId++;
            reasons.push('invalid_trace_id');
        }
        if (spanContext?.spanId && !isW3cSpanId(spanContext.spanId)) {
            invalidSpanId++;
            reasons.push('invalid_span_id');
        }
        if (event?.traceparent !== undefined && !isTraceparent(event.traceparent)) {
            invalidTraceparent++;
            reasons.push('invalid_traceparent');
        }
        if (reasons.length > 0) {
            droppedEvents.push({
                index,
                phase: typeof event?.phase === 'string' ? event.phase : 'unknown',
                reasons
            });
        }
    }

    const exportedSpanCount = events.length - droppedEvents.length;
    return {
        schemaVersion: 'bot-worker-loop.trace-export-diagnostics.v1',
        traceEventCount: events.length,
        exportedSpanCount,
        droppedEventCount: droppedEvents.length,
        missingSpanContext,
        missingTraceId,
        missingSpanId,
        invalidTraceId,
        invalidSpanId,
        invalidTraceparent,
        exportCoverage: events.length === 0
            ? 1
            : Number((exportedSpanCount / events.length).toFixed(4)),
        status: droppedEvents.length === 0 ? 'pass' : 'warn',
        droppedEvents: droppedEvents.slice(0, 10)
    };
}

function buildLifecycleCheckpoint({
    stopReason,
    cycles,
    totals,
    finalQueue
}) {
    const normalizedStopReason = normalizeStopReason(stopReason);
    const cycleList = Array.isArray(cycles) ? cycles : [];
    const lastCycle = cycleList.length > 0 ? cycleList[cycleList.length - 1] : null;
    const queue = finalQueue && typeof finalQueue === 'object' ? finalQueue : {};
    const totalValues = totals && typeof totals === 'object' ? totals : {};
    const attentionReasons = [];

    if ((queue.awaitingApproval || 0) > 0) attentionReasons.push('pending_approval');
    if ((queue.created || 0) > 0) attentionReasons.push('pending_created_tasks');
    if ((queue.dispatched || 0) > 0) attentionReasons.push('pending_dispatched_tasks');
    if ((queue.retryScheduled || 0) > 0) attentionReasons.push('pending_retry_scheduled');
    if ((queue.dispatchedStale || 0) > 0) attentionReasons.push('stale_dispatched_tasks');
    if ((totalValues.botTasksFailed || 0) > 0) attentionReasons.push('bot_task_failures');
    if ((totalValues.botSkillHardeningBlocked || 0) > 0) attentionReasons.push('skill_hardening_blocks');
    if (normalizedStopReason === 'max_cycles_reached') attentionReasons.push('cycle_budget_exhausted');

    let nextAction = 'rerun_when_new_work_arrives';
    if (normalizedStopReason === 'queue_drained' && (queue.open || 0) === 0) {
        nextAction = 'no_resume_needed';
    } else if ((queue.dispatchedStale || 0) > 0) {
        nextAction = 'recover_stale_dispatches';
    } else if ((queue.awaitingApproval || 0) > 0 && (queue.open || 0) === (queue.awaitingApproval || 0)) {
        nextAction = 'review_pending_approvals';
    } else if ((queue.created || 0) > 0) {
        nextAction = 'rerun_dispatcher';
    } else if ((queue.retryScheduled || 0) > 0) {
        nextAction = 'rerun_after_retry_backoff';
    } else if ((queue.dispatched || 0) > 0) {
        nextAction = 'process_outbox_results';
    } else if ((totalValues.botSkillHardeningBlocked || 0) > 0) {
        nextAction = 'refresh_skill_hardening_inputs';
    } else if ((totalValues.botTasksFailed || 0) > 0) {
        nextAction = 'review_bot_runtime_failures';
    } else if (normalizedStopReason === 'max_cycles_reached') {
        nextAction = 'increase_cycle_budget_or_rerun';
    }

    const resumeState = {
        stopReason: normalizedStopReason,
        nextAction,
        attentionReasons,
        queue: {
            open: queue.open || 0,
            created: queue.created || 0,
            dispatched: queue.dispatched || 0,
            retryScheduled: queue.retryScheduled || 0,
            dispatchedStale: queue.dispatchedStale || 0,
            oldestDispatchedAgeMs: queue.oldestDispatchedAgeMs || 0,
            staleDispatchedTaskIds: Array.isArray(queue.staleDispatchedTaskIds)
                ? queue.staleDispatchedTaskIds
                : [],
            awaitingApproval: queue.awaitingApproval || 0
        },
        runtimeAttention: {
            botTasksFailed: totalValues.botTasksFailed || 0,
            botSkillHardeningBlocked: totalValues.botSkillHardeningBlocked || 0,
            dispatchFailures: cycleList.reduce((sum, cycle) => sum + (cycle.failedDispatch || 0), 0)
        }
    };
    const stateFingerprint = buildStableHash(resumeState);
    const resumeKey = `${normalizeTraceToken(nextAction)}:${stateFingerprint}`;

    return {
        schemaVersion: 'bot-worker-loop.lifecycle.v1',
        stopReason: normalizedStopReason,
        cyclesRun: cycleList.length,
        resumeKey,
        stateFingerprint,
        lastCycle: lastCycle
            ? {
                cycle: lastCycle.cycle,
                startedAt: lastCycle.startedAt,
                finishedAt: lastCycle.finishedAt,
                durationMs: lastCycle.durationMs,
                idleStreak: lastCycle.idleStreak
            }
            : null,
        queue: {
            ...resumeState.queue
        },
        runtimeAttention: {
            ...resumeState.runtimeAttention
        },
        attentionReasons,
        resumeRecommended: nextAction !== 'no_resume_needed' && nextAction !== 'rerun_when_new_work_arrives',
        nextAction
    };
}

function clampScore(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(100, Math.round(numeric)));
}

function buildRunEvaluation({
    stopReason,
    cycles,
    totals,
    finalQueue,
    lifecycleCheckpoint
}) {
    const normalizedStopReason = normalizeStopReason(stopReason);
    const cycleList = Array.isArray(cycles) ? cycles : [];
    const queue = finalQueue && typeof finalQueue === 'object' ? finalQueue : {};
    const totalValues = totals && typeof totals === 'object' ? totals : {};
    const checkpoint = lifecycleCheckpoint && typeof lifecycleCheckpoint === 'object'
        ? lifecycleCheckpoint
        : buildLifecycleCheckpoint({
            stopReason: normalizedStopReason,
            cycles: cycleList,
            totals: totalValues,
            finalQueue: queue
        });
    const dispatchFailures = cycleList.reduce((sum, cycle) => sum + (cycle.failedDispatch || 0), 0);
    const signals = {
        stopReason: normalizedStopReason,
        queueOpen: queue.open || 0,
        queueCreated: queue.created || 0,
        queueDispatched: queue.dispatched || 0,
        queueRetryScheduled: queue.retryScheduled || 0,
        queueDispatchedStale: queue.dispatchedStale || 0,
        queueAwaitingApproval: queue.awaitingApproval || 0,
        botTasksFailed: totalValues.botTasksFailed || 0,
        botSkillHardeningBlocked: totalValues.botSkillHardeningBlocked || 0,
        dispatchFailures,
        resumeRecommended: checkpoint.resumeRecommended === true,
        nextAction: checkpoint.nextAction || 'unknown'
    };
    const penalties = [];
    const addPenalty = (reason, points, count = null) => {
        if (points <= 0) return;
        penalties.push({
            reason,
            points: clampScore(points),
            ...(count === null ? {} : { count })
        });
    };

    addPenalty('stale_dispatched_tasks', Math.min(40, signals.queueDispatchedStale * 25), signals.queueDispatchedStale);
    addPenalty('bot_task_failures', Math.min(30, signals.botTasksFailed * 15), signals.botTasksFailed);
    addPenalty('skill_hardening_blocks', Math.min(25, signals.botSkillHardeningBlocked * 12), signals.botSkillHardeningBlocked);
    addPenalty('dispatch_failures', Math.min(20, signals.dispatchFailures * 10), signals.dispatchFailures);
    addPenalty('pending_created_tasks', Math.min(15, signals.queueCreated * 5), signals.queueCreated);
    addPenalty('cycle_budget_exhausted', normalizedStopReason === 'max_cycles_reached' ? 15 : 0);

    const score = clampScore(100 - penalties.reduce((sum, penalty) => sum + penalty.points, 0));
    let status = 'pass';
    if (score < 70 || signals.queueDispatchedStale > 0 || signals.botTasksFailed > 0) {
        status = 'fail';
    } else if (
        score < 90
        || signals.resumeRecommended
        || signals.queueAwaitingApproval > 0
        || signals.botSkillHardeningBlocked > 0
        || signals.dispatchFailures > 0
    ) {
        status = 'warn';
    }

    return {
        schemaVersion: 'bot-worker-loop.evaluation.v1',
        score,
        status,
        signals,
        penalties,
        passed: status === 'pass'
    };
}

export function renderBotWorkerLoopMarkdown(report) {
    if (!report || typeof report !== 'object') {
        return '# Bot Worker Loop\n\nNo report available.';
    }

    const lines = [
        '# Bot Worker Loop',
        '',
        `- stopReason: ${report.stopReason}`,
        `- cyclesRun: ${report.cyclesRun}`,
        `- maxCycles: ${report.maxCycles}`,
        `- totals.dispatched: ${report.totals?.dispatched || 0}`,
        `- totals.resultsAccepted: ${report.totals?.resultsAccepted || 0}`,
        `- totals.botTasksFailed: ${report.totals?.botTasksFailed || 0}`,
        `- totals.botSkillHardeningBlocked: ${report.totals?.botSkillHardeningBlocked || 0}`,
        `- totals.followupTasksSaved: ${report.totals?.followupTasksSaved || 0}`,
        `- finalQueue.open: ${report.finalQueue?.open || 0}`,
        `- finalQueue.dispatchedStale: ${report.finalQueue?.dispatchedStale || 0}`,
        `- finalQueue.awaitingApproval: ${report.finalQueue?.awaitingApproval || 0}`,
        '',
        '## Lifecycle Checkpoint',
        ''
    ];

    const lifecycleCheckpoint = report.lifecycleCheckpoint && typeof report.lifecycleCheckpoint === 'object'
        ? report.lifecycleCheckpoint
        : buildLifecycleCheckpoint({
            stopReason: report.stopReason,
            cycles: report.cycles,
            totals: report.totals,
            finalQueue: report.finalQueue
        });

    lines.push(
        `- schemaVersion: ${lifecycleCheckpoint.schemaVersion}`,
        `- nextAction: ${lifecycleCheckpoint.nextAction}`,
        `- resumeRecommended: ${lifecycleCheckpoint.resumeRecommended}`,
        `- resumeKey: ${lifecycleCheckpoint.resumeKey || 'unavailable'}`,
        `- stateFingerprint: ${lifecycleCheckpoint.stateFingerprint || 'unavailable'}`,
        `- attentionReasons: ${lifecycleCheckpoint.attentionReasons.length > 0 ? lifecycleCheckpoint.attentionReasons.join(', ') : 'none'}`,
        `- queue.open: ${lifecycleCheckpoint.queue.open}`,
        `- queue.dispatchedStale: ${lifecycleCheckpoint.queue.dispatchedStale || 0}`,
        `- queue.retryScheduled: ${lifecycleCheckpoint.queue.retryScheduled || 0}`,
        `- queue.oldestDispatchedAgeMs: ${lifecycleCheckpoint.queue.oldestDispatchedAgeMs || 0}`,
        `- queue.awaitingApproval: ${lifecycleCheckpoint.queue.awaitingApproval}`,
        '',
        '## Run Evaluation',
        ''
    );

    const runEvaluation = report.runEvaluation && typeof report.runEvaluation === 'object'
        ? report.runEvaluation
        : buildRunEvaluation({
            stopReason: report.stopReason,
            cycles: report.cycles,
            totals: report.totals,
            finalQueue: report.finalQueue,
            lifecycleCheckpoint
        });
    const traceExportDiagnostics = report.traceExportDiagnostics && typeof report.traceExportDiagnostics === 'object'
        ? report.traceExportDiagnostics
        : buildBotWorkerLoopTraceExportDiagnostics(report);

    lines.push(
        `- schemaVersion: ${runEvaluation.schemaVersion}`,
        `- status: ${runEvaluation.status}`,
        `- score: ${runEvaluation.score}`,
        `- passed: ${runEvaluation.passed}`,
        `- nextAction: ${runEvaluation.signals?.nextAction || 'unknown'}`,
        `- penalties: ${Array.isArray(runEvaluation.penalties) && runEvaluation.penalties.length > 0
            ? runEvaluation.penalties.map((penalty) => `${penalty.reason}:${penalty.points}`).join(', ')
            : 'none'}`,
        '',
        '## Trace Export',
        '',
        `- schemaVersion: ${traceExportDiagnostics.schemaVersion}`,
        `- status: ${traceExportDiagnostics.status}`,
        `- traceEventCount: ${traceExportDiagnostics.traceEventCount}`,
        `- exportedSpanCount: ${traceExportDiagnostics.exportedSpanCount}`,
        `- droppedEventCount: ${traceExportDiagnostics.droppedEventCount}`,
        `- exportCoverage: ${traceExportDiagnostics.exportCoverage}`,
        `- droppedEvents: ${Array.isArray(traceExportDiagnostics.droppedEvents) && traceExportDiagnostics.droppedEvents.length > 0
            ? traceExportDiagnostics.droppedEvents.map((event) => `${event.phase}:${event.reasons.join('+')}`).join(', ')
            : 'none'}`,
        '',
        '## Recovery Plan',
        ''
    );

    const recoveryPlan = report.staleDispatchRecoveryPlan && typeof report.staleDispatchRecoveryPlan === 'object'
        ? report.staleDispatchRecoveryPlan
        : null;
    if (!recoveryPlan) {
        lines.push('- none', '');
    } else {
        lines.push(
            `- schemaVersion: ${recoveryPlan.schemaVersion}`,
            `- dryRun: ${recoveryPlan.dryRun}`,
            `- mutatesQueue: ${recoveryPlan.mutatesQueue}`,
            `- totalCandidates: ${recoveryPlan.totalCandidates}`,
            `- defaultAction: ${recoveryPlan.defaultAction}`
        );
        const candidates = Array.isArray(recoveryPlan.candidates) ? recoveryPlan.candidates : [];
        if (candidates.length === 0) {
            lines.push('- candidates: none');
        } else {
            for (const candidate of candidates) {
                lines.push(
                    `- candidate ${candidate.taskId}: target=${candidate.target} ageMs=${candidate.ageMs} attempts=${candidate.attempts} action=${candidate.recommendedAction}`
                );
                if (candidate.traceparent) {
                    lines.push(`  - traceparent: ${candidate.traceparent}`);
                }
                if (candidate.idempotencyKey) {
                    lines.push(`  - idempotencyKey: ${candidate.idempotencyKey}`);
                }
                const decisionRecord = candidate.recoveryDecisionRecord && typeof candidate.recoveryDecisionRecord === 'object'
                    ? candidate.recoveryDecisionRecord
                    : null;
                if (decisionRecord) {
                    lines.push(
                        `  - recoveryDecisionRequired: ${candidate.recoveryDecisionRequired === true}`,
                        `  - decisionRecordSchema: ${decisionRecord.schemaVersion}`,
                        `  - allowedDecisions: ${Array.isArray(decisionRecord.allowedDecisions) ? decisionRecord.allowedDecisions.join(', ') : 'none'}`,
                        `  - requiredFields: ${Array.isArray(decisionRecord.requiredFields) ? decisionRecord.requiredFields.join(', ') : 'none'}`
                    );
                }
                const evidence = Array.isArray(candidate.evidenceRequired)
                    ? candidate.evidenceRequired
                    : [];
                if (evidence.length > 0) {
                    lines.push(`  - evidenceRequired: ${evidence.map((item) => item.id).join(', ')}`);
                }
            }
        }
        lines.push('');
    }

    lines.push(
        '## Cycles',
        ''
    );

    const cycles = Array.isArray(report.cycles) ? report.cycles : [];
    if (cycles.length === 0) {
        lines.push('- none');
    } else {
        for (const cycle of cycles) {
            lines.push(
                `- cycle ${cycle.cycle}: dispatched=${cycle.dispatched} results=${cycle.resultsAccepted} followupsSaved=${cycle.followupTasksSaved} queueOpen=${cycle.queueAfter?.open || 0} idleStreak=${cycle.idleStreak}`
            );
        }
    }

    const events = Array.isArray(report.traceEvents) ? report.traceEvents : [];
    lines.push('', '## Trace Events', '');
    if (events.length === 0) {
        lines.push('- none');
    } else {
        for (const event of events) {
            const fields = [];
            for (const [key, value] of Object.entries(event)) {
                if (key === 'at' || key === 'cycle' || key === 'phase') continue;
                if (value === undefined || value === null) continue;
                if (Array.isArray(value) && value.length === 0) continue;
                fields.push(`${key}=${Array.isArray(value) || typeof value === 'object'
                    ? JSON.stringify(value)
                    : value}`);
            }
            lines.push(`- ${event.at} cycle=${event.cycle} phase=${event.phase}${fields.length > 0 ? ` ${fields.join(' ')}` : ''}`);
        }
    }

    return lines.join('\n');
}

export async function runBotWorkerLoop({
    storePath,
    outboxDir,
    archiveDir = path.join(outboxDir, 'processed'),
    localAgentId = 'agent:main',
    dispatchLimit = 100,
    includeAllCreated = false,
    maxCycles = 20,
    idleCyclesToStop = 2,
    stopWhenOnlyApprovals = true,
    stopWhenStaleDispatch = true,
    staleDispatchMs = DEFAULT_STALE_DISPATCH_MS,
    sleepMs = 0,
    etaMs = 1_000,
    resultDelayMs = 500,
    failureRate = 0,
    botRuntime = true,
    botAgentId = 'agent:openclaw-bot',
    botRepoRoot = null,
    skillHardeningPolicy = 'enforce',
    skillHardeningMinScore = 82,
    skillDeployabilityIndexPath = null,
    skillHardeningProfilePath = null,
    enqueueFollowupTasks = true,
    nowFactory = Date.now
} = {}) {
    if (!storePath || typeof storePath !== 'string') {
        throw new Error('storePath is required');
    }
    if (!outboxDir || typeof outboxDir !== 'string') {
        throw new Error('outboxDir is required');
    }

    const resolvedStorePath = path.resolve(storePath);
    const resolvedOutboxDir = path.resolve(outboxDir);
    const resolvedArchiveDir = path.resolve(archiveDir);

    const now = typeof nowFactory === 'function' ? nowFactory : Date.now;
    const normalizedMaxCycles = parsePositiveInt(maxCycles, 20);
    const normalizedIdleCycles = parsePositiveInt(idleCyclesToStop, 2);
    const normalizedDispatchLimit = parsePositiveInt(dispatchLimit, 100);
    const normalizedStaleDispatchMs = parseNonNegativeInt(staleDispatchMs, DEFAULT_STALE_DISPATCH_MS);

    const cycles = [];
    const totals = {
        dispatched: 0,
        awaitingApproval: 0,
        maintenanceScheduledRetries: 0,
        maintenanceRetried: 0,
        maintenanceTimedOut: 0,
        maintenanceTransportFailures: 0,
        resultsAccepted: 0,
        botTasksExecuted: 0,
        botTasksFailed: 0,
        botSkillHardeningBlocked: 0,
        followupTasksGenerated: 0,
        followupTasksSaved: 0,
        followupTasksSkipped: 0,
        filesProcessed: 0
    };

    let idleStreak = 0;
    let stopReason = 'max_cycles_reached';
    const traceEvents = [];
    const runStartedAt = safeNow(now);
    const traceId = `bot-worker-loop:${runStartedAt}`;
    const rootSpanId = `${normalizeTraceToken(traceId)}.root`;
    const rootTraceContext = buildTraceContext({
        workflowTraceId: traceId,
        phase: 'root',
        cycle: 0
    });

    for (let cycleIndex = 1; cycleIndex <= normalizedMaxCycles; cycleIndex++) {
        const cycleStartedAt = safeNow(now);
        // eslint-disable-next-line no-await-in-loop
        const queueBefore = await loadQueueSummary({
            storePath: resolvedStorePath,
            nowFactory: now,
            staleDispatchMs: normalizedStaleDispatchMs
        });

        const maintenanceResult = queueBefore.created > 0 || queueBefore.dispatchedStale > 0
            ? {
                loaded: queueBefore.total,
                checked: 0,
                scheduledRetries: 0,
                retried: 0,
                timedOut: 0,
                transportFailures: 0
            }
            // Exercise protocol-native retry/timeout handling before dispatching new work,
            // but never mutate stale dispatched tasks that require operator inspection.
            // eslint-disable-next-line no-await-in-loop
            : await runQueueMaintenance({
                storePath: resolvedStorePath,
                outboxDir: resolvedOutboxDir,
                localAgentId,
                nowFactory: now
            });

        // eslint-disable-next-line no-await-in-loop
        const dispatchResult = await dispatchCreatedQueueTasks({
            storePath: resolvedStorePath,
            outboxDir: resolvedOutboxDir,
            localAgentId,
            limit: normalizedDispatchLimit,
            includeAllCreated,
            nowFactory: now
        });

        // eslint-disable-next-line no-await-in-loop
        const processResult = await processOutboxEnvelopes({
            storePath: resolvedStorePath,
            outboxDir: resolvedOutboxDir,
            archiveDir: resolvedArchiveDir,
            localAgentId,
            etaMs,
            resultDelayMs,
            failureRate: normalizeFailureRate(failureRate),
            botRuntime,
            botAgentId,
            botRepoRoot,
            skillHardeningPolicy,
            skillHardeningMinScore,
            skillDeployabilityIndexPath,
            skillHardeningProfilePath,
            enqueueFollowupTasks,
            nowFactory: now
        });

        // eslint-disable-next-line no-await-in-loop
        const queueAfter = await loadQueueSummary({
            storePath: resolvedStorePath,
            nowFactory: now,
            staleDispatchMs: normalizedStaleDispatchMs
        });

        const progressUnits =
            maintenanceResult.scheduledRetries
            + maintenanceResult.retried
            + maintenanceResult.timedOut
            dispatchResult.stats.dispatched
            + processResult.resultsAccepted
            + processResult.followupTasksSaved;
        const noProgress = progressUnits === 0;
        const noPendingDispatch = queueAfter.created === 0 && queueAfter.dispatched === 0;
        const noOutboxFiles = processResult.filesFound === 0;
        const onlyAwaitingApprovals = queueAfter.open > 0 && queueAfter.open === queueAfter.awaitingApproval;
        const staleDispatchDetected = (queueAfter.dispatchedStale || 0) > 0 && noOutboxFiles;

        if (noProgress && noPendingDispatch && noOutboxFiles) {
            idleStreak++;
        } else {
            idleStreak = 0;
        }

        const cycleFinishedAt = safeNow(now);
        const cycleSnapshot = {
            cycle: cycleIndex,
            startedAt: cycleStartedAt,
            finishedAt: cycleFinishedAt,
            durationMs: Math.max(0, cycleFinishedAt - cycleStartedAt),
            queueBefore,
            queueAfter,
            maintenanceResult,
            selected: dispatchResult.stats.selected,
            dispatched: dispatchResult.stats.dispatched,
            awaitingApproval: dispatchResult.stats.awaitingApproval,
            failedDispatch: dispatchResult.stats.failed,
            filesFound: processResult.filesFound,
            filesArchived: processResult.filesArchived,
            resultsAccepted: processResult.resultsAccepted,
            botTasksExecuted: processResult.botTasksExecuted,
            botTasksFailed: processResult.botTasksFailed,
            botSkillHardeningBlocked: processResult.botSkillHardeningBlocked,
            followupTasksGenerated: processResult.followupTasksGenerated,
            followupTasksSaved: processResult.followupTasksSaved,
            followupTasksSkipped: processResult.followupTasksSkipped,
            idleStreak
        };
        cycles.push(cycleSnapshot);
        traceEvents.push(...buildCycleTraceEvents({
            cycle: cycleIndex,
            startedAt: cycleStartedAt,
            finishedAt: cycleFinishedAt,
            maintenanceResult,
            dispatchResult,
            processResult,
            queueBefore,
            queueAfter,
            idleStreak,
            traceContext: {
                traceId,
                parentSpanId: rootSpanId,
                w3cParentSpanId: rootTraceContext.spanId
            },
            staleDispatchMs: normalizedStaleDispatchMs
        }));

        totals.dispatched += dispatchResult.stats.dispatched;
        totals.awaitingApproval += dispatchResult.stats.awaitingApproval;
        totals.maintenanceScheduledRetries += maintenanceResult.scheduledRetries;
        totals.maintenanceRetried += maintenanceResult.retried;
        totals.maintenanceTimedOut += maintenanceResult.timedOut;
        totals.maintenanceTransportFailures += maintenanceResult.transportFailures;
        totals.resultsAccepted += processResult.resultsAccepted;
        totals.botTasksExecuted += processResult.botTasksExecuted;
        totals.botTasksFailed += processResult.botTasksFailed;
        totals.botSkillHardeningBlocked += processResult.botSkillHardeningBlocked;
        totals.followupTasksGenerated += processResult.followupTasksGenerated;
        totals.followupTasksSaved += processResult.followupTasksSaved;
        totals.followupTasksSkipped += processResult.followupTasksSkipped;
        totals.filesProcessed += processResult.filesArchived;

        if (queueAfter.open === 0 && noOutboxFiles && dispatchResult.stats.selected === 0) {
            stopReason = 'queue_drained';
            break;
        }

        if (stopWhenOnlyApprovals && onlyAwaitingApprovals && idleStreak >= normalizedIdleCycles) {
            stopReason = 'awaiting_approval_only';
            break;
        }

        if (stopWhenStaleDispatch && staleDispatchDetected) {
            stopReason = 'stale_dispatch_detected';
            break;
        }

        if (idleStreak >= normalizedIdleCycles) {
            stopReason = 'idle_convergence';
            break;
        }

        if (cycleIndex < normalizedMaxCycles) {
            // eslint-disable-next-line no-await-in-loop
            await sleep(sleepMs);
        }
    }

    const finalQueue = await loadQueueSummary({
        storePath: resolvedStorePath,
        nowFactory: now,
        staleDispatchMs: normalizedStaleDispatchMs
    });
    const lifecycleCheckpoint = buildLifecycleCheckpoint({
        stopReason,
        cycles,
        totals,
        finalQueue
    });
    const runEvaluation = buildRunEvaluation({
        stopReason,
        cycles,
        totals,
        finalQueue,
        lifecycleCheckpoint
    });
    const staleDispatchRecoveryPlan = finalQueue.dispatchedStale > 0
        ? await loadStaleDispatchRecoveryPlan({
            storePath: resolvedStorePath,
            nowFactory: now,
            staleDispatchMs: normalizedStaleDispatchMs
        })
        : null;
    pushTraceEvent(traceEvents, {
        at: safeNow(now),
        cycle: cycles.length,
        phase: 'lifecycle_checkpoint',
        stopReason: lifecycleCheckpoint.stopReason,
        nextAction: lifecycleCheckpoint.nextAction,
        resumeRecommended: lifecycleCheckpoint.resumeRecommended,
        resumeKey: lifecycleCheckpoint.resumeKey,
        stateFingerprint: lifecycleCheckpoint.stateFingerprint,
        attentionReasons: lifecycleCheckpoint.attentionReasons,
        queueOpen: lifecycleCheckpoint.queue.open,
        queueDispatchedStale: lifecycleCheckpoint.queue.dispatchedStale || 0,
        oldestDispatchedAgeMs: lifecycleCheckpoint.queue.oldestDispatchedAgeMs || 0,
        queueAwaitingApproval: lifecycleCheckpoint.queue.awaitingApproval
    }, {
        traceId,
        parentSpanId: rootSpanId,
        w3cParentSpanId: rootTraceContext.spanId
    });
    pushTraceEvent(traceEvents, {
        at: safeNow(now),
        cycle: cycles.length,
        phase: 'run_evaluation',
        score: runEvaluation.score,
        status: runEvaluation.status,
        passed: runEvaluation.passed,
        nextAction: runEvaluation.signals.nextAction,
        penalties: runEvaluation.penalties
    }, {
        traceId,
        parentSpanId: rootSpanId,
        w3cParentSpanId: rootTraceContext.spanId
    });
    if (staleDispatchRecoveryPlan) {
        pushTraceEvent(traceEvents, {
            at: staleDispatchRecoveryPlan.generatedAt,
            cycle: cycles.length,
            phase: 'stale_dispatch_recovery_plan',
            totalCandidates: staleDispatchRecoveryPlan.totalCandidates,
            dryRun: staleDispatchRecoveryPlan.dryRun,
            mutatesQueue: staleDispatchRecoveryPlan.mutatesQueue,
            defaultAction: staleDispatchRecoveryPlan.defaultAction,
            candidateTaskIds: staleDispatchRecoveryPlan.candidates.map((candidate) => candidate.taskId),
            candidateTraceparents: staleDispatchRecoveryPlan.candidates
                .map((candidate) => candidate.traceparent)
                .filter(Boolean)
        }, {
            traceId,
            parentSpanId: rootSpanId,
            w3cParentSpanId: rootTraceContext.spanId
        });
    }
    const traceExportDiagnostics = buildBotWorkerLoopTraceExportDiagnostics({
        traceEvents
    });

    return {
        traceId,
        traceparent: rootTraceContext.traceparent,
        traceContext: {
            traceId: rootTraceContext.traceId,
            spanId: rootTraceContext.spanId,
            traceFlags: '01'
        },
        stopReason: normalizeStopReason(stopReason),
        cyclesRun: cycles.length,
        maxCycles: normalizedMaxCycles,
        idleCyclesToStop: normalizedIdleCycles,
        staleDispatchMs: normalizedStaleDispatchMs,
        includeAllCreated,
        botRuntime,
        totals,
        finalQueue,
        cycles,
        lifecycleCheckpoint,
        runEvaluation,
        staleDispatchRecoveryPlan,
        traceExportDiagnostics,
        traceEvents
    };
}

export async function writeBotWorkerLoopReport({
    report,
    jsonPath = null,
    markdownPath = null,
    otelJsonlPath = null
}) {
    const output = report && typeof report === 'object' ? report : {};

    if (typeof jsonPath === 'string' && jsonPath.trim()) {
        const resolvedJsonPath = path.resolve(jsonPath);
        fs.mkdirSync(path.dirname(resolvedJsonPath), { recursive: true });
        fs.writeFileSync(resolvedJsonPath, `${JSON.stringify(output, null, 2)}\n`);
    }

    if (typeof markdownPath === 'string' && markdownPath.trim()) {
        const resolvedMarkdownPath = path.resolve(markdownPath);
        fs.mkdirSync(path.dirname(resolvedMarkdownPath), { recursive: true });
        fs.writeFileSync(resolvedMarkdownPath, `${renderBotWorkerLoopMarkdown(output)}\n`);
    }

    if (typeof otelJsonlPath === 'string' && otelJsonlPath.trim()) {
        const resolvedOtelPath = path.resolve(otelJsonlPath);
        fs.mkdirSync(path.dirname(resolvedOtelPath), { recursive: true });
        const spans = buildBotWorkerLoopOtelSpans(output);
        fs.writeFileSync(
            resolvedOtelPath,
            spans.length > 0
                ? `${spans.map((span) => JSON.stringify(span)).join('\n')}\n`
                : ''
        );
    }
}
