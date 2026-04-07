import fs from 'fs/promises';
import path from 'path';
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
        followupTasksSkipped: 0
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

            if (bot) {
                // eslint-disable-next-line no-await-in-loop
                const execution = await bot.executeTask(request);
                stats.botTasksExecuted++;
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

            const resultAccepted = orchestrator.ingestResult(buildTaskResult({
                taskId,
                from: target,
                status: resultStatus,
                output: resultOutput,
                artifacts: resultArtifacts,
                metrics: resultMetrics,
                completedAt: safeNow(now) + Math.max(0, Number(resultDelayMs) || 0)
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
    }

    return stats;
}
