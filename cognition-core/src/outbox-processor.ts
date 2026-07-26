import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';
import {
    buildTaskReceipt,
    buildTaskResult,
    FileTaskStore,
    TaskOrchestrator
} from '../../swarm-protocol/runtime.js';
import { enqueueTaskEntries } from './task-bundle-enqueuer.js';
import { OpenClawBot } from './openclaw-bot.js';

const TERMINAL_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

function safeNow(nowFactory = Date.now) {
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function normalizeFailureRate(value) {
    return clamp(Number(value) || 0, 0, 1);
}

function isTraceparent(value) {
    return typeof value === 'string'
        && /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/i.test(value.trim());
}

function traceparentFromRequest(request, envelope) {
    const candidates = [
        request?.traceparent,
        request?.context?.traceparent,
        envelope?.trace?.traceparent,
        envelope?.traceparent,
        envelope?.message?.traceparent,
        envelope?.message?.context?.traceparent
    ];
    const found = candidates.find((value) => isTraceparent(value));
    return found ? found.trim().toLowerCase() : undefined;
}

function parseTraceparent(traceparent) {
    if (!isTraceparent(traceparent)) return null;
    const [, traceId, parentSpanId, traceFlags] = traceparent.trim().toLowerCase().split('-');
    return {
        traceId,
        parentSpanId,
        traceFlags
    };
}

function stableSpanId(value) {
    const hex = createHash('sha256')
        .update(String(value))
        .digest('hex')
        .slice(0, 16);
    return /^0+$/.test(hex) ? `1${hex.slice(1)}` : hex;
}

function buildOutboxTraceEvents({ taskId, target, traceparent, sentAt, completedAt, resultStatus }) {
    const parsed = parseTraceparent(traceparent);
    if (!parsed) return undefined;
    const receivedSpanId = stableSpanId(`outbox-received:${taskId}:${sentAt}`);
    const resultSpanId = stableSpanId(`outbox-result:${taskId}:${completedAt}:${resultStatus}`);

    const baseAttributes = {
        'gen_ai.agent.name': target,
        'openclaw.workflow.name': 'outbox_processor',
        trace_id: parsed.traceId,
        parent_span_id: parsed.parentSpanId,
        traceparent
    };

    return [
        {
            at: sentAt,
            taskId,
            name: 'outbox_processor.task_received',
            kind: 'handoff',
            traceparent,
            spanContext: {
                traceId: parsed.traceId,
                spanId: receivedSpanId,
                parentSpanId: parsed.parentSpanId,
                traceFlags: parsed.traceFlags
            },
            attributes: {
                ...baseAttributes,
                span_id: receivedSpanId,
                'gen_ai.operation.name': 'handoff',
                'openclaw.workflow.phase': 'task_received'
            }
        },
        {
            at: completedAt,
            taskId,
            name: 'outbox_processor.task_result',
            kind: resultStatus === 'failure' ? 'guardrail' : 'tool',
            traceparent,
            spanContext: {
                traceId: parsed.traceId,
                spanId: resultSpanId,
                parentSpanId: receivedSpanId,
                traceFlags: parsed.traceFlags
            },
            attributes: {
                ...baseAttributes,
                span_id: resultSpanId,
                parent_span_id: receivedSpanId,
                'gen_ai.operation.name': resultStatus === 'failure' ? 'invoke_workflow' : 'execute_tool',
                'openclaw.workflow.phase': 'task_result',
                'openclaw.task.status': resultStatus
            }
        }
    ];
}

function sanitizeEnvelopeTrajectoryEvents(envelope, { taskId, traceparent }) {
    const events = Array.isArray(envelope?.trajectoryEvents) ? envelope.trajectoryEvents : [];
    return events
        .filter((event) => event && typeof event === 'object')
        .filter((event) => (
            event.taskId === taskId
            && event.traceparent === traceparent
        ))
        .map((event) => ({ ...event }));
}

function buildResultTraceEvents({ envelope, taskId, target, traceparent, sentAt, completedAt, resultStatus }) {
    const outboxEvents = buildOutboxTraceEvents({
        taskId,
        target,
        traceparent,
        sentAt,
        completedAt,
        resultStatus
    }) || [];
    const trajectoryEvents = sanitizeEnvelopeTrajectoryEvents(envelope, {
        taskId,
        traceparent
    });
    const merged = [
        ...trajectoryEvents,
        ...outboxEvents
    ];
    return merged.length > 0 ? merged : undefined;
}

function chooseResultStatus(failureRate, rng = Math.random) {
    if (normalizeFailureRate(failureRate) <= 0) return 'success';
    return rng() < normalizeFailureRate(failureRate) ? 'failure' : 'success';
}

function isTaskDispatchEnvelope(payload) {
    return payload
        && typeof payload === 'object'
        && payload.kind === 'task_dispatch_envelope'
        && payload.message
        && typeof payload.message === 'object'
        && payload.message.kind === 'task_request';
}

function parseEnvelopeLines(raw, filePath) {
    const lines = raw.split('\n').filter((line) => line.trim());
    const envelopes = [];
    let invalid = 0;

    for (let i = 0; i < lines.length; i++) {
        try {
            const parsed = JSON.parse(lines[i]);
            if (!isTaskDispatchEnvelope(parsed)) {
                invalid++;
                continue;
            }
            envelopes.push(parsed);
        } catch {
            invalid++;
        }
    }

    return {
        filePath,
        lineCount: lines.length,
        invalid,
        envelopes
    };
}

async function listOutboxFiles(outboxDir) {
    try {
        const entries = await fs.readdir(outboxDir, { withFileTypes: true });
        return entries
            .filter((entry) => entry.isFile() && entry.name.endsWith('.jsonl'))
            .map((entry) => path.join(outboxDir, entry.name))
            .sort();
    } catch (error) {
        if (error?.code === 'ENOENT') return [];
        throw error;
    }
}

function archiveFilePath(filePath, archiveDir, nowFactory) {
    const base = path.basename(filePath, '.jsonl');
    const stamp = safeNow(nowFactory);
    return path.join(archiveDir, `${base}.${stamp}.processed.jsonl`);
}

function executionLedgerPath(executionLedgerDir, taskId, attempt) {
    const key = createHash('sha256')
        .update(`task:${taskId}:attempt:${attempt}`)
        .digest('hex');
    return path.join(executionLedgerDir, `${key}.json`);
}

async function readExecutionMarker(executionLedgerDir, taskId, attempt) {
    try {
        const raw = await fs.readFile(executionLedgerPath(executionLedgerDir, taskId, attempt), 'utf8');
        const marker = JSON.parse(raw);
        if (
            !marker
            || marker.schemaVersion !== 'openclaw.bot_execution_marker.v1'
            || marker.taskId !== taskId
            || marker.attempt !== attempt
            || typeof marker.resultStatus !== 'string'
        ) {
            return null;
        }
        return marker;
    } catch (error) {
        if (error?.code === 'ENOENT') return null;
        return null;
    }
}

async function writeExecutionMarker(executionLedgerDir, marker) {
    const markerPath = executionLedgerPath(executionLedgerDir, marker.taskId, marker.attempt);
    const tempPath = `${markerPath}.${process.pid}.tmp`;
    await fs.mkdir(executionLedgerDir, { recursive: true });
    await fs.writeFile(tempPath, `${JSON.stringify(marker)}\n`, 'utf8');
    await fs.rename(tempPath, markerPath);
}

async function cleanupExecutionMarkers({
    executionLedgerDir,
    records,
    nowFactory,
    retentionMs
}) {
    if (!executionLedgerDir || !Number.isFinite(retentionMs) || retentionMs < 0) {
        return { removed: 0, retained: 0 };
    }

    let entries;
    try {
        entries = await fs.readdir(executionLedgerDir, { withFileTypes: true });
    } catch (error) {
        if (error?.code === 'ENOENT') return { removed: 0, retained: 0 };
        throw error;
    }

    const recordsById = new Map(
        (Array.isArray(records) ? records : [])
            .filter((record) => record && typeof record.taskId === 'string')
            .map((record) => [record.taskId, record])
    );
    const now = safeNow(nowFactory);
    let removed = 0;
    let retained = 0;

    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
        const markerPath = path.join(executionLedgerDir, entry.name);
        let marker;
        try {
            marker = JSON.parse(await fs.readFile(markerPath, 'utf8'));
        } catch {
            retained++;
            continue;
        }

        const record = recordsById.get(marker?.taskId);
        const completedAt = Number(marker?.completedAt);
        const followupTasks = Array.isArray(marker?.followupTasks) ? marker.followupTasks : [];
        const followupsPersisted = followupTasks.every((request) => (
            request
            && typeof request.id === 'string'
            && recordsById.has(request.id)
        ));
        const eligible = marker?.schemaVersion === 'openclaw.bot_execution_marker.v1'
            && record
            && TERMINAL_STATUSES.has(record.status)
            && followupsPersisted
            && Number.isFinite(completedAt)
            && now - completedAt >= retentionMs;

        if (!eligible) {
            retained++;
            continue;
        }

        await fs.unlink(markerPath);
        removed++;
    }

    return { removed, retained };
}

function sanitizeMetrics(rawMetrics) {
    if (!rawMetrics || typeof rawMetrics !== 'object') return undefined;
    const metrics = {};
    for (const [key, value] of Object.entries(rawMetrics)) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) continue;
        metrics[key] = numeric;
    }
    return Object.keys(metrics).length > 0 ? metrics : undefined;
}

function sanitizeArtifacts(rawArtifacts) {
    if (!Array.isArray(rawArtifacts)) return undefined;

    const artifacts = rawArtifacts
        .filter((artifact) => artifact && typeof artifact === 'object')
        .map((artifact) => ({
            name: typeof artifact.name === 'string' && artifact.name.trim()
                ? artifact.name.trim()
                : null,
            path: typeof artifact.path === 'string' && artifact.path.trim()
                ? artifact.path.trim()
                : null,
            type: typeof artifact.type === 'string' && artifact.type.trim()
                ? artifact.type.trim()
                : undefined
        }))
        .filter((artifact) => artifact.name && artifact.path)
        .map((artifact) => ({
            name: artifact.name,
            path: artifact.path,
            type: artifact.type
        }));

    return artifacts.length > 0 ? artifacts : undefined;
}

function normalizeBotResultStatus(status) {
    if (status === 'failure') return 'failure';
    if (status === 'partial') return 'partial';
    return 'success';
}

function botModeToStatField(mode) {
    if (mode === 'skill') return 'botSkillTasks';
    if (mode === 'skill_action') return 'botSkillActionTasks';
    if (mode === 'skill_blueprint') return 'botSkillBlueprintTasks';
    if (mode === 'capability') return 'botCapabilityTasks';
    if (mode === 'capability_action') return 'botCapabilityActionTasks';
    return 'botGenericTasks';
}

export async function processOutboxEnvelopes({
    storePath,
    outboxDir,
    archiveDir = path.join(outboxDir, 'processed'),
    executionLedgerDir = path.join(outboxDir, 'executions'),
    executionMarkerRetentionMs = 24 * 60 * 60 * 1_000,
    localAgentId = 'agent:main',
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
    dryRun = false,
    nowFactory = Date.now,
    rng = Math.random
}) {
    if (!storePath || typeof storePath !== 'string') {
        throw new Error('storePath is required');
    }
    if (!outboxDir || typeof outboxDir !== 'string') {
        throw new Error('outboxDir is required');
    }

    const now = typeof nowFactory === 'function' ? nowFactory : Date.now;
    const store = new FileTaskStore({ filePath: storePath, now });
    const orchestrator = new TaskOrchestrator({
        localAgentId,
        transport: {
            async send() {}
        },
        store,
        now
    });
    const bot = botRuntime
        ? new OpenClawBot({
            agentId: botAgentId,
            repoRoot: botRepoRoot || undefined,
            skillHardeningPolicy,
            skillHardeningMinScore,
            skillDeployabilityIndexPath,
            skillHardeningProfilePath,
            nowFactory: now
        })
        : null;

    const hydration = await orchestrator.hydrate();
    const files = await listOutboxFiles(outboxDir);
    const followupEntries = [];

    const stats = {
        loaded: hydration.loaded,
        filesFound: files.length,
        filesArchived: 0,
        envelopesSeen: 0,
        envelopesInvalid: 0,
        receiptsAccepted: 0,
        resultsAccepted: 0,
        skippedUnknownTask: 0,
        skippedTerminal: 0,
        dryRun,
        botRuntime,
        botTasksReplayed: 0,
        botTasksExecuted: 0,
        botTasksFailed: 0,
        botSkillTasks: 0,
        botSkillHardeningBlocked: 0,
        botSkillActionTasks: 0,
        botSkillBlueprintTasks: 0,
        botCapabilityTasks: 0,
        botCapabilityActionTasks: 0,
        botGenericTasks: 0,
        followupTasksGenerated: 0,
        followupTasksAccepted: 0,
        followupTasksSaved: 0,
        followupTasksSkipped: 0,
        executionMarkersRemoved: 0,
        executionMarkersRetained: 0
    };

    for (const filePath of files) {
        // eslint-disable-next-line no-await-in-loop
        const raw = await fs.readFile(filePath, 'utf8');
        const parsed = parseEnvelopeLines(raw, filePath);
        stats.envelopesSeen += parsed.envelopes.length;
        stats.envelopesInvalid += parsed.invalid;

        for (const envelope of parsed.envelopes) {
            const request = envelope.message;
            const taskId = request.id;
            const target = request.target || envelope.target || 'agent:worker';
            const record = orchestrator.getTask(taskId);
            if (!record) {
                stats.skippedUnknownTask++;
                continue;
            }
            if (TERMINAL_STATUSES.has(record.status)) {
                stats.skippedTerminal++;
                continue;
            }
            if (dryRun) {
                continue;
            }

            const accepted = orchestrator.ingestReceipt(buildTaskReceipt({
                taskId,
                from: target,
                accepted: true,
                etaMs,
                timestamp: safeNow(now)
            }));
            if (accepted) {
                stats.receiptsAccepted++;
            }

            let resultStatus = 'success';
            let resultOutput = `Processed by outbox worker: ${request.task}`;
            let resultArtifacts;
            let resultMetrics;
            const traceparent = traceparentFromRequest(request, envelope);
            const dispatchAttempt = Number(request.context?.openclawDispatch?.attempt);
            const attempt = Number.isInteger(dispatchAttempt) && dispatchAttempt > 0
                ? dispatchAttempt
                : 0;
            let markerCompletedAt;

            if (bot) {
                // A marker is written before the task result is persisted so a crash
                // after bot side effects can replay the outcome without re-running them.
                // eslint-disable-next-line no-await-in-loop
                const marker = await readExecutionMarker(executionLedgerDir, taskId, attempt);
                let execution;
                if (marker) {
                    markerCompletedAt = Number.isFinite(Number(marker.completedAt))
                        ? Number(marker.completedAt)
                        : undefined;
                    execution = {
                        mode: marker.mode,
                        status: marker.status,
                        output: marker.output,
                        artifacts: marker.artifacts,
                        metrics: marker.metrics,
                        followupTasks: marker.followupTasks
                    };
                    stats.botTasksReplayed++;
                } else {
                    // eslint-disable-next-line no-await-in-loop
                    execution = await bot.executeTask(request);
                    // The marker must include all generated work so replay cannot
                    // create a different set of follow-up task ids.
                    // eslint-disable-next-line no-await-in-loop
                    await writeExecutionMarker(executionLedgerDir, {
                        schemaVersion: 'openclaw.bot_execution_marker.v1',
                        taskId,
                        attempt,
                        mode: execution.mode,
                        status: execution.status,
                        output: execution.output,
                        artifacts: execution.artifacts,
                        metrics: execution.metrics,
                        followupTasks: execution.followupTasks,
                        resultStatus: normalizeBotResultStatus(execution.status),
                        completedAt: safeNow(now) + Math.max(0, Number(resultDelayMs) || 0)
                    });
                    stats.botTasksExecuted++;
                }
                stats[botModeToStatField(execution.mode)]++;
                if (
                    execution.mode === 'skill'
                    && execution.status === 'partial'
                    && Number(execution.metrics?.hardeningDeployable) === 0
                ) {
                    stats.botSkillHardeningBlocked++;
                }

                if (execution.status === 'failure') {
                    stats.botTasksFailed++;
                }

                resultStatus = normalizeBotResultStatus(execution.status);
                resultOutput = execution.output;
                resultArtifacts = sanitizeArtifacts(execution.artifacts);
                resultMetrics = sanitizeMetrics({
                    ...execution.metrics,
                    followupTaskCount: Array.isArray(execution.followupTasks)
                        ? execution.followupTasks.length
                        : 0
                });

                if (enqueueFollowupTasks && Array.isArray(execution.followupTasks) && execution.followupTasks.length > 0) {
                    for (let i = 0; i < execution.followupTasks.length; i++) {
                        followupEntries.push({
                            source: `openclaw-bot:${taskId}`,
                            request: execution.followupTasks[i]
                        });
                    }
                    stats.followupTasksGenerated += execution.followupTasks.length;
                }

                if (resultStatus !== 'failure' && chooseResultStatus(failureRate, rng) === 'failure') {
                    resultStatus = 'failure';
                    resultOutput = `Injected worker failure after bot execution: ${request.task}`;
                    resultMetrics = sanitizeMetrics({
                        ...(resultMetrics || {}),
                        chaosInjected: 1
                    });
                }
            } else {
                resultStatus = chooseResultStatus(failureRate, rng);
                resultOutput = resultStatus === 'success'
                    ? `Processed by outbox worker: ${request.task}`
                    : `Failed by outbox worker: ${request.task}`;
            }

            const completedAt = markerCompletedAt || (safeNow(now) + Math.max(0, Number(resultDelayMs) || 0));
            const resultAccepted = orchestrator.ingestResult(buildTaskResult({
                taskId,
                from: target,
                attempt: attempt > 0 ? attempt : undefined,
                status: resultStatus,
                output: resultOutput,
                artifacts: resultArtifacts,
                metrics: resultMetrics,
                traceparent,
                traceEvents: buildResultTraceEvents({
                    envelope,
                    taskId,
                    target,
                    traceparent,
                    sentAt: safeNow(now),
                    completedAt,
                    resultStatus
                }),
                completedAt
            }));
            if (resultAccepted) {
                stats.resultsAccepted++;
            }
        }

        if (dryRun) continue;

        // Only archive after successful processing of file contents.
        const archivedPath = archiveFilePath(filePath, archiveDir, now);
        // eslint-disable-next-line no-await-in-loop
        await fs.mkdir(path.dirname(archivedPath), { recursive: true });
        // eslint-disable-next-line no-await-in-loop
        await fs.rename(filePath, archivedPath);
        stats.filesArchived++;
    }

    if (!dryRun) {
        await orchestrator.flush();

        if (bot && enqueueFollowupTasks && followupEntries.length > 0) {
            const enqueueResult = await enqueueTaskEntries({
                storePath,
                entries: followupEntries,
                actor: botAgentId,
                nowFactory: now
            });

            stats.followupTasksAccepted = enqueueResult.stats.accepted;
            stats.followupTasksSaved = enqueueResult.stats.saved;
            stats.followupTasksSkipped = enqueueResult.skipped.length;
        }

        const markerCleanup = await cleanupExecutionMarkers({
            executionLedgerDir,
            records: await store.loadRecords(),
            nowFactory: now,
            retentionMs: Number(executionMarkerRetentionMs)
        });
        stats.executionMarkersRemoved = markerCleanup.removed;
        stats.executionMarkersRetained = markerCleanup.retained;
    }

    return stats;
}
