import fs from 'fs';
import path from 'path';
import { FileTaskStore } from '../../swarm-protocol/runtime.js';
import { dispatchCreatedQueueTasks } from './queue-dispatcher.js';
import { processOutboxEnvelopes } from './outbox-processor.js';

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

async function sleep(ms) {
    const duration = parseNonNegativeInt(ms, 0);
    if (duration <= 0) return;
    await new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

function summarizeQueueRecords(records) {
    const byStatus = {};
    let open = 0;
    let terminal = 0;
    let created = 0;
    let dispatched = 0;
    let acknowledged = 0;
    let retryScheduled = 0;
    let awaitingApproval = 0;

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
        if (status === 'dispatched') dispatched++;
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
        acknowledged,
        retryScheduled,
        awaitingApproval,
        byStatus
    };
}

async function loadQueueSummary({ storePath, nowFactory }) {
    const store = new FileTaskStore({
        filePath: storePath,
        now: nowFactory
    });
    const records = await store.loadRecords();
    return summarizeQueueRecords(records);
}

function normalizeStopReason(reason) {
    const value = typeof reason === 'string' ? reason.trim().toLowerCase() : '';
    if (!value) return 'max_cycles_reached';
    return value;
}

function pushTraceEvent(events, event) {
    if (!Array.isArray(events) || !event || typeof event !== 'object') return;
    const at = Number(event.at);
    events.push({
        ...event,
        at: Number.isFinite(at) ? at : Date.now()
    });
}

function buildCycleTraceEvents({
    cycle,
    startedAt,
    finishedAt,
    dispatchResult,
    processResult,
    queueBefore,
    queueAfter,
    idleStreak
}) {
    const events = [];
    const selected = dispatchResult?.stats?.selected || 0;
    const dispatched = dispatchResult?.stats?.dispatched || 0;
    const awaitingApproval = dispatchResult?.stats?.awaitingApproval || 0;
    const failedDispatch = dispatchResult?.stats?.failed || 0;
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
        queueAwaitingApproval: queueBefore?.awaitingApproval || 0
    });

    pushTraceEvent(events, {
        at: startedAt,
        cycle,
        phase: 'dispatch',
        selected,
        dispatched,
        awaitingApproval,
        failedDispatch,
        skippedNonCognition: dispatchResult?.stats?.skippedNonCognition || 0
    });

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
    });

    if (failedDispatch > 0) {
        pushTraceEvent(events, {
            at: finishedAt,
            cycle,
            phase: 'dispatch_failure',
            failedDispatch,
            failures: Array.isArray(dispatchResult?.failed)
                ? dispatchResult.failed.slice(0, 5)
                : []
        });
    }

    if (botTasksFailed > 0 || hardeningBlocked > 0) {
        pushTraceEvent(events, {
            at: finishedAt,
            cycle,
            phase: 'bot_runtime_attention',
            botTasksFailed,
            botSkillHardeningBlocked: hardeningBlocked
        });
    }

    pushTraceEvent(events, {
        at: finishedAt,
        cycle,
        phase: 'queue_after',
        queueOpen: queueAfter?.open || 0,
        queueCreated: queueAfter?.created || 0,
        queueDispatched: queueAfter?.dispatched || 0,
        queueAwaitingApproval: queueAfter?.awaitingApproval || 0,
        idleStreak
    });

    return events;
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
    if ((totalValues.botTasksFailed || 0) > 0) attentionReasons.push('bot_task_failures');
    if ((totalValues.botSkillHardeningBlocked || 0) > 0) attentionReasons.push('skill_hardening_blocks');
    if (normalizedStopReason === 'max_cycles_reached') attentionReasons.push('cycle_budget_exhausted');

    let nextAction = 'rerun_when_new_work_arrives';
    if (normalizedStopReason === 'queue_drained' && (queue.open || 0) === 0) {
        nextAction = 'no_resume_needed';
    } else if ((queue.awaitingApproval || 0) > 0 && (queue.open || 0) === (queue.awaitingApproval || 0)) {
        nextAction = 'review_pending_approvals';
    } else if ((queue.created || 0) > 0) {
        nextAction = 'rerun_dispatcher';
    } else if ((queue.dispatched || 0) > 0) {
        nextAction = 'process_outbox_results';
    } else if ((totalValues.botSkillHardeningBlocked || 0) > 0) {
        nextAction = 'refresh_skill_hardening_inputs';
    } else if ((totalValues.botTasksFailed || 0) > 0) {
        nextAction = 'review_bot_runtime_failures';
    } else if (normalizedStopReason === 'max_cycles_reached') {
        nextAction = 'increase_cycle_budget_or_rerun';
    }

    return {
        schemaVersion: 'bot-worker-loop.lifecycle.v1',
        stopReason: normalizedStopReason,
        cyclesRun: cycleList.length,
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
            open: queue.open || 0,
            created: queue.created || 0,
            dispatched: queue.dispatched || 0,
            awaitingApproval: queue.awaitingApproval || 0
        },
        runtimeAttention: {
            botTasksFailed: totalValues.botTasksFailed || 0,
            botSkillHardeningBlocked: totalValues.botSkillHardeningBlocked || 0,
            dispatchFailures: cycleList.reduce((sum, cycle) => sum + (cycle.failedDispatch || 0), 0)
        },
        attentionReasons,
        resumeRecommended: nextAction !== 'no_resume_needed' && nextAction !== 'rerun_when_new_work_arrives',
        nextAction
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
        `- attentionReasons: ${lifecycleCheckpoint.attentionReasons.length > 0 ? lifecycleCheckpoint.attentionReasons.join(', ') : 'none'}`,
        `- queue.open: ${lifecycleCheckpoint.queue.open}`,
        `- queue.awaitingApproval: ${lifecycleCheckpoint.queue.awaitingApproval}`,
        '',
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

    const cycles = [];
    const totals = {
        dispatched: 0,
        awaitingApproval: 0,
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

    for (let cycleIndex = 1; cycleIndex <= normalizedMaxCycles; cycleIndex++) {
        const cycleStartedAt = safeNow(now);
        // eslint-disable-next-line no-await-in-loop
        const queueBefore = await loadQueueSummary({
            storePath: resolvedStorePath,
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
            nowFactory: now
        });

        const progressUnits =
            dispatchResult.stats.dispatched
            + processResult.resultsAccepted
            + processResult.followupTasksSaved;
        const noProgress = progressUnits === 0;
        const noPendingDispatch = queueAfter.created === 0 && queueAfter.dispatched === 0;
        const noOutboxFiles = processResult.filesFound === 0;
        const onlyAwaitingApprovals = queueAfter.open > 0 && queueAfter.open === queueAfter.awaitingApproval;

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
            dispatchResult,
            processResult,
            queueBefore,
            queueAfter,
            idleStreak
        }));

        totals.dispatched += dispatchResult.stats.dispatched;
        totals.awaitingApproval += dispatchResult.stats.awaitingApproval;
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
        nowFactory: now
    });
    const lifecycleCheckpoint = buildLifecycleCheckpoint({
        stopReason,
        cycles,
        totals,
        finalQueue
    });
    pushTraceEvent(traceEvents, {
        at: safeNow(now),
        cycle: cycles.length,
        phase: 'lifecycle_checkpoint',
        stopReason: lifecycleCheckpoint.stopReason,
        nextAction: lifecycleCheckpoint.nextAction,
        resumeRecommended: lifecycleCheckpoint.resumeRecommended,
        attentionReasons: lifecycleCheckpoint.attentionReasons,
        queueOpen: lifecycleCheckpoint.queue.open,
        queueAwaitingApproval: lifecycleCheckpoint.queue.awaitingApproval
    });

    return {
        stopReason: normalizeStopReason(stopReason),
        cyclesRun: cycles.length,
        maxCycles: normalizedMaxCycles,
        idleCyclesToStop: normalizedIdleCycles,
        includeAllCreated,
        botRuntime,
        totals,
        finalQueue,
        cycles,
        lifecycleCheckpoint,
        traceEvents
    };
}

export async function writeBotWorkerLoopReport({
    report,
    jsonPath = null,
    markdownPath = null
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
}
