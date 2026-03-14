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
        `- totals.followupTasksSaved: ${report.totals?.followupTasksSaved || 0}`,
        `- totals.botRetriesAttempted: ${report.totals?.botRetriesAttempted || 0}`,
        `- totals.botRetriesRecovered: ${report.totals?.botRetriesRecovered || 0}`,
        `- totals.botRetriesExhausted: ${report.totals?.botRetriesExhausted || 0}`,
        `- totals.botRetriesBudgetExhausted: ${report.totals?.botRetriesBudgetExhausted || 0}`,
        `- totals.botAttemptTimeouts: ${report.totals?.botAttemptTimeouts || 0}`,
        `- finalQueue.open: ${report.finalQueue?.open || 0}`,
        `- finalQueue.awaitingApproval: ${report.finalQueue?.awaitingApproval || 0}`,
        '',
        '## Cycles',
        ''
    ];

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
    botMaxAttempts = 2,
    botRetryBaseDelayMs = 200,
    botRetryMaxDelayMs = 5_000,
    botRetryJitter = 0.2,
    botAttemptTimeoutMs = 120_000,
    botRetryBudgetRatio = 0,
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
        botRetriesAttempted: 0,
        botRetriesRecovered: 0,
        botRetriesExhausted: 0,
        botRetriesBudgetExhausted: 0,
        botAttemptTimeouts: 0,
        followupTasksGenerated: 0,
        followupTasksSaved: 0,
        followupTasksSkipped: 0,
        filesProcessed: 0
    };

    let idleStreak = 0;
    let stopReason = 'max_cycles_reached';

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
            botMaxAttempts,
            botRetryBaseDelayMs,
            botRetryMaxDelayMs,
            botRetryJitter,
            botAttemptTimeoutMs,
            botRetryBudgetRatio,
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
            botRetriesAttempted: processResult.botRetriesAttempted,
            botRetriesRecovered: processResult.botRetriesRecovered,
            botRetriesExhausted: processResult.botRetriesExhausted,
            botRetriesBudgetExhausted: processResult.botRetriesBudgetExhausted,
            botAttemptTimeouts: processResult.botAttemptTimeouts,
            followupTasksGenerated: processResult.followupTasksGenerated,
            followupTasksSaved: processResult.followupTasksSaved,
            followupTasksSkipped: processResult.followupTasksSkipped,
            idleStreak
        };
        cycles.push(cycleSnapshot);

        totals.dispatched += dispatchResult.stats.dispatched;
        totals.awaitingApproval += dispatchResult.stats.awaitingApproval;
        totals.resultsAccepted += processResult.resultsAccepted;
        totals.botTasksExecuted += processResult.botTasksExecuted;
        totals.botTasksFailed += processResult.botTasksFailed;
        totals.botSkillHardeningBlocked += processResult.botSkillHardeningBlocked;
        totals.botRetriesAttempted += processResult.botRetriesAttempted;
        totals.botRetriesRecovered += processResult.botRetriesRecovered;
        totals.botRetriesExhausted += processResult.botRetriesExhausted;
        totals.botRetriesBudgetExhausted += processResult.botRetriesBudgetExhausted;
        totals.botAttemptTimeouts += processResult.botAttemptTimeouts;
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

    return {
        stopReason: normalizeStopReason(stopReason),
        cyclesRun: cycles.length,
        maxCycles: normalizedMaxCycles,
        idleCyclesToStop: normalizedIdleCycles,
        includeAllCreated,
        botRuntime,
        totals,
        finalQueue,
        cycles
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
