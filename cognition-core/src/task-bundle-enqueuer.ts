import { FileTaskStore, TaskRequest } from '../../swarm-protocol/runtime.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

function normalizeText(input) {
    if (typeof input !== 'string') return '';
    return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

function safeNow(nowFactory = Date.now) {
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function safeTimeout(defaultTimeoutMs) {
    const value = Number(defaultTimeoutMs);
    if (!Number.isFinite(value) || value < 0) {
        return 30_000;
    }
    return value;
}

export function isTerminalTaskStatus(status) {
    return TERMINAL_STATUSES.has(normalizeText(status));
}

export function buildTaskRequestFingerprint(taskRequest) {
    const request = TaskRequest.parse(taskRequest);
    const planner = normalizeText(request?.context?.planner || '');
    const target = normalizeText(request.target || '');
    const priority = normalizeText(request.priority || 'normal');
    const task = normalizeText(request.task || '');
    if (!task) return '';
    return [planner, target, priority, task].join('|');
}

export function buildQueueRecordFromTaskRequest(
    taskRequest,
    {
        actor = 'agent:cognition-core',
        source = null,
        nowFactory = Date.now,
        defaultTimeoutMs = 30_000,
        maxRetries = 1
    } = {}
) {
    const request = TaskRequest.parse(taskRequest);
    const createdAt = Number(request.createdAt);
    const enqueuedAt = safeNow(nowFactory);
    const timeoutMs = safeTimeout(defaultTimeoutMs);

    const history = [
        { at: createdAt, event: 'created' },
        {
            at: enqueuedAt,
            event: 'cognition_enqueued',
            actor,
            bundle: source || null
        }
    ];

    return {
        taskId: request.id,
        target: request.target,
        request,
        status: 'created',
        approval: null,
        policy: null,
        attempts: 0,
        maxRetries: Number.isInteger(maxRetries) && maxRetries >= 0 ? maxRetries : 1,
        createdAt,
        updatedAt: enqueuedAt,
        deadlineAt: createdAt + timeoutMs,
        nextRetryAt: null,
        closedAt: null,
        lastError: null,
        receipts: [],
        result: null,
        history
    };
}

export function extractTaskEntriesFromBundle(bundlePayload, source = 'bundle') {
    if (!bundlePayload || typeof bundlePayload !== 'object') {
        throw new Error(`Invalid bundle payload for ${source}`);
    }
    if (!Array.isArray(bundlePayload.tasks)) {
        throw new Error(`Bundle ${source} is missing a tasks array`);
    }
    return bundlePayload.tasks.map((request) => ({
        source,
        request
    }));
}

function buildExistingIndex(existingRecords, allowDuplicates) {
    const taskIds = new Set();
    const openFingerprints = new Set();
    const records = Array.isArray(existingRecords) ? existingRecords : [];

    for (const record of records) {
        if (!record || typeof record !== 'object') continue;
        const taskId = typeof record.taskId === 'string' ? record.taskId : null;
        if (taskId) taskIds.add(taskId);
        if (allowDuplicates) continue;
        if (isTerminalTaskStatus(record.status)) continue;
        if (!record.request || typeof record.request !== 'object') continue;
        try {
            const fingerprint = buildTaskRequestFingerprint(record.request);
            if (fingerprint) openFingerprints.add(fingerprint);
        } catch {
            // Ignore malformed legacy records during dedupe index build.
        }
    }

    return { taskIds, openFingerprints };
}

export function planTaskEnqueue(
    entries,
    existingRecords = [],
    {
        allowDuplicates = false,
        actor = 'agent:cognition-core',
        nowFactory = Date.now,
        defaultTimeoutMs = 30_000,
        maxRetries = 1
    } = {}
) {
    const queueEntries = Array.isArray(entries) ? entries : [];
    const accepted = [];
    const skipped = [];
    const stats = {
        total: queueEntries.length,
        accepted: 0,
        skippedDuplicateId: 0,
        skippedDuplicateOpenFingerprint: 0
    };

    const index = buildExistingIndex(existingRecords, allowDuplicates);
    const plannedIds = new Set();
    const plannedFingerprints = new Set();

    for (let i = 0; i < queueEntries.length; i++) {
        const entry = queueEntries[i];
        if (!entry || typeof entry !== 'object') {
            throw new Error(`Invalid enqueue entry at index ${i}`);
        }

        const source = typeof entry.source === 'string' && entry.source.trim()
            ? entry.source
            : `entry:${i + 1}`;
        const request = TaskRequest.parse(entry.request);
        const taskId = request.id;
        const fingerprint = buildTaskRequestFingerprint(request);

        if (index.taskIds.has(taskId) || plannedIds.has(taskId)) {
            skipped.push({
                source,
                taskId,
                reason: 'duplicate_id',
                fingerprint
            });
            stats.skippedDuplicateId++;
            continue;
        }

        const shouldSkipOpenDuplicate = !allowDuplicates
            && fingerprint
            && (index.openFingerprints.has(fingerprint) || plannedFingerprints.has(fingerprint));
        if (shouldSkipOpenDuplicate) {
            skipped.push({
                source,
                taskId,
                reason: 'duplicate_open_fingerprint',
                fingerprint
            });
            stats.skippedDuplicateOpenFingerprint++;
            continue;
        }

        const record = buildQueueRecordFromTaskRequest(request, {
            actor,
            source,
            nowFactory,
            defaultTimeoutMs,
            maxRetries
        });

        accepted.push({
            source,
            taskId,
            fingerprint,
            request,
            record
        });
        plannedIds.add(taskId);
        if (!allowDuplicates && fingerprint) {
            plannedFingerprints.add(fingerprint);
        }
    }

    stats.accepted = accepted.length;
    return {
        accepted,
        skipped,
        stats
    };
}

export async function enqueueTaskEntries({
    storePath,
    entries,
    allowDuplicates = false,
    dryRun = false,
    actor = 'agent:cognition-core',
    nowFactory = Date.now,
    defaultTimeoutMs = 30_000,
    maxRetries = 1
}) {
    if (!storePath || typeof storePath !== 'string') {
        throw new Error('storePath is required');
    }

    const store = new FileTaskStore({ filePath: storePath, now: nowFactory });
    const existingRecords = await store.loadRecords();

    const plan = planTaskEnqueue(entries, existingRecords, {
        allowDuplicates,
        actor,
        nowFactory,
        defaultTimeoutMs,
        maxRetries
    });

    if (!dryRun) {
        for (const item of plan.accepted) {
            // Serialize writes to preserve deterministic journal ordering.
            // eslint-disable-next-line no-await-in-loop
            await store.saveRecord(item.record);
        }
    }

    return {
        ...plan,
        stats: {
            ...plan.stats,
            existing: Array.isArray(existingRecords) ? existingRecords.length : 0,
            saved: dryRun ? 0 : plan.accepted.length,
            dryRun
        }
    };
}
