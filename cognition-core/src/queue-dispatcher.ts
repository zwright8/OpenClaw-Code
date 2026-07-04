import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';
import {
    createApprovalPolicy,
    FileTaskStore,
    TaskOrchestrator,
    TaskRequest
} from '../../swarm-protocol/runtime.js';

function normalizeText(input) {
    if (typeof input !== 'string') return '';
    return input.trim().toLowerCase();
}

function safeNow(nowFactory = Date.now) {
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function sanitizeTargetForFile(target) {
    return target.replace(/[^a-z0-9._-]+/gi, '_');
}

function stableHex(value, length) {
    const hex = createHash('sha256')
        .update(String(value))
        .digest('hex')
        .slice(0, length);
    return /^0+$/.test(hex) ? `1${hex.slice(1)}` : hex;
}

function isTraceparent(value) {
    return typeof value === 'string'
        && /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/i.test(value.trim());
}

function traceparentForRecord(record) {
    const existing = record?.request?.traceparent || record?.request?.context?.traceparent;
    if (isTraceparent(existing)) return existing.trim().toLowerCase();

    const taskId = typeof record?.taskId === 'string' ? record.taskId : record?.request?.id;
    const createdAt = Number(record?.createdAt || record?.request?.createdAt || 0);
    const traceId = stableHex(`openclaw-task:${taskId}`, 32);
    const spanId = stableHex(`openclaw-task-dispatch:${taskId}:${createdAt}`, 16);
    return `00-${traceId}-${spanId}-01`;
}

function traceparentForMessage(message) {
    const existing = message?.traceparent || message?.context?.traceparent;
    if (isTraceparent(existing)) return existing.trim().toLowerCase();

    const taskId = typeof message?.id === 'string' ? message.id : null;
    if (!taskId) return null;
    const createdAt = Number(message?.createdAt || 0);
    const traceId = stableHex(`openclaw-task:${taskId}`, 32);
    const spanId = stableHex(`openclaw-task-dispatch:${taskId}:${createdAt}`, 16);
    return `00-${traceId}-${spanId}-01`;
}

function buildDispatchEnvelopeTrace({
    target,
    message,
    sentAt
}) {
    const taskId = typeof message?.id === 'string' ? message.id : null;
    const traceparent = traceparentForMessage(message);
    const context = message?.context && typeof message.context === 'object'
        ? message.context
        : {};

    return {
        schemaVersion: 'openclaw.task_dispatch.trace.v1',
        traceparent,
        taskId,
        target,
        priority: typeof message?.priority === 'string' ? message.priority : null,
        planner: typeof context.planner === 'string' ? context.planner : null,
        createdAt: Number.isFinite(Number(message?.createdAt)) ? Number(message.createdAt) : null,
        sentAt,
        idempotencyKey: taskId ? `task:${taskId}` : null
    };
}

function sortByCreatedAtAsc(records) {
    return [...records].sort((a, b) => {
        const left = Number(a?.createdAt || 0);
        const right = Number(b?.createdAt || 0);
        return left - right;
    });
}

export function isCognitionPlannedRecord(record) {
    const planner = normalizeText(record?.request?.context?.planner);
    return planner.startsWith('cognition-core/');
}

export function buildDispatchPayload(record) {
    if (!record || typeof record !== 'object') {
        throw new Error('buildDispatchPayload expects a record object');
    }
    const request = TaskRequest.parse(record.request);
    const traceparent = traceparentForRecord(record);
    return {
        id: request.id,
        createdAt: request.createdAt,
        target: request.target,
        task: request.task,
        priority: request.priority,
        context: {
            ...(request.context || {}),
            traceparent
        },
        constraints: request.constraints,
        traceparent
    };
}

export function selectCreatedDispatchCandidates(
    records,
    {
        target = null,
        limit = 50,
        includeAllCreated = false
    } = {}
) {
    const list = Array.isArray(records) ? records : [];
    const selected = [];
    const skipped = {
        invalid: 0,
        nonCognition: 0
    };

    for (const record of sortByCreatedAtAsc(list)) {
        if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') {
            skipped.invalid++;
            continue;
        }
        if (record.status !== 'created') {
            continue;
        }
        if (target && record.target !== target) {
            continue;
        }
        if (!record.request || typeof record.request !== 'object') {
            skipped.invalid++;
            continue;
        }
        if (!includeAllCreated && !isCognitionPlannedRecord(record)) {
            skipped.nonCognition++;
            continue;
        }
        selected.push(record);
        if (selected.length >= Math.max(1, Number(limit) || 50)) {
            break;
        }
    }

    return {
        selected,
        skipped
    };
}

export function createFileOutboxTransport({
    outboxDir,
    nowFactory = Date.now
}) {
    if (!outboxDir || typeof outboxDir !== 'string') {
        throw new Error('outboxDir is required for file outbox transport');
    }
    const resolvedOutboxDir = path.resolve(outboxDir);

    return {
        async send(target, message) {
            if (!target || typeof target !== 'string') {
                throw new Error('transport send target must be a string');
            }
            const fileName = `${sanitizeTargetForFile(target)}.jsonl`;
            const filePath = path.join(resolvedOutboxDir, fileName);
            const sentAt = safeNow(nowFactory);
            const envelope = {
                kind: 'task_dispatch_envelope',
                target,
                sentAt,
                trace: buildDispatchEnvelopeTrace({
                    target,
                    message,
                    sentAt
                }),
                message
            };

            await fs.mkdir(resolvedOutboxDir, { recursive: true });
            await fs.appendFile(filePath, `${JSON.stringify(envelope)}\n`, 'utf8');
        }
    };
}

export async function runQueueMaintenance({
    storePath,
    outboxDir,
    localAgentId = 'agent:main',
    nowFactory = Date.now
}) {
    if (!storePath || typeof storePath !== 'string') {
        throw new Error('storePath is required');
    }
    if (!outboxDir || typeof outboxDir !== 'string') {
        throw new Error('outboxDir is required');
    }

    const now = typeof nowFactory === 'function' ? nowFactory : Date.now;
    const store = new FileTaskStore({ filePath: storePath, now });
    const transport = createFileOutboxTransport({ outboxDir, nowFactory: now });
    const orchestrator = new TaskOrchestrator({
        localAgentId,
        transport,
        store,
        approvalPolicy: createApprovalPolicy(),
        now
    });

    const hydration = await orchestrator.hydrate();
    const maintenance = await orchestrator.runMaintenance(safeNow(now));
    await orchestrator.flush();

    return {
        loaded: hydration.loaded,
        ...maintenance
    };
}

export async function dispatchCreatedQueueTasks({
    storePath,
    outboxDir,
    localAgentId = 'agent:main',
    target = null,
    limit = 50,
    includeAllCreated = false,
    dryRun = false,
    nowFactory = Date.now
}) {
    if (!storePath || typeof storePath !== 'string') {
        throw new Error('storePath is required');
    }
    if (!outboxDir || typeof outboxDir !== 'string') {
        throw new Error('outboxDir is required');
    }

    const now = typeof nowFactory === 'function' ? nowFactory : Date.now;
    const store = new FileTaskStore({ filePath: storePath, now });
    const transport = createFileOutboxTransport({ outboxDir, nowFactory: now });
    const orchestrator = new TaskOrchestrator({
        localAgentId,
        transport,
        store,
        approvalPolicy: createApprovalPolicy()
    });

    const hydration = await orchestrator.hydrate();
    const allTasks = orchestrator.listTasks();
    const candidates = selectCreatedDispatchCandidates(allTasks, {
        target,
        limit,
        includeAllCreated
    });

    const result = {
        stats: {
            loaded: hydration.loaded,
            selected: candidates.selected.length,
            dispatched: 0,
            awaitingApproval: 0,
            failed: 0,
            skippedInvalid: candidates.skipped.invalid,
            skippedNonCognition: candidates.skipped.nonCognition,
            dryRun
        },
        selectedTaskIds: candidates.selected.map((record) => record.taskId),
        dispatchedTaskIds: [],
        awaitingApprovalTaskIds: [],
        failed: []
    };

    if (dryRun) {
        return result;
    }

    for (const record of candidates.selected) {
        try {
            const payload = buildDispatchPayload(record);
            // eslint-disable-next-line no-await-in-loop
            const dispatched = await orchestrator.dispatchTask(payload);
            if (dispatched?.status === 'awaiting_approval') {
                result.stats.awaitingApproval++;
                result.awaitingApprovalTaskIds.push(record.taskId);
            } else if (dispatched?.status === 'dispatched' || dispatched?.status === 'acknowledged') {
                result.stats.dispatched++;
                result.dispatchedTaskIds.push(record.taskId);
            } else {
                result.stats.failed++;
                result.failed.push({
                    taskId: record.taskId,
                    reason: `unexpected_status:${dispatched?.status || 'unknown'}`
                });
            }
        } catch (error) {
            result.stats.failed++;
            result.failed.push({
                taskId: record.taskId,
                reason: error.message
            });
        }
    }

    await orchestrator.flush();
    return result;
}
