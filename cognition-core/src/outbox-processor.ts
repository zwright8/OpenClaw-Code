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

function parsePositiveInt(value, fallback) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric <= 0) return fallback;
    return numeric;
}

function parseNonNegativeInt(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 0) return fallback;
    return numeric;
}

function normalizeRetryJitter(value, fallback = 0.2) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeRetryBudgetRatio(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeCircuitBreakerFailureThreshold(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 0) return fallback;
    return numeric;
}

function normalizeCircuitBreakerCooldownMs(value, fallback = 30_000) {
    return parseNonNegativeInt(value, fallback);
}

function normalizeCircuitBreakerHalfOpenMaxProbes(value, fallback = 1) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerHalfOpenSuccessThreshold(value, fallback = 1) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerFailureRateThreshold(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return clamp(numeric, 0, 1);
}

function normalizeCircuitBreakerFailureRateWindow(value, fallback = 20) {
    return parsePositiveInt(value, fallback);
}

function normalizeCircuitBreakerFailureRateMinSamples(value, fallback = 8) {
    return parsePositiveInt(value, fallback);
}

function updateFailureRateObservations(observations, value, windowSize) {
    const next = Array.isArray(observations) ? observations.slice() : [];
    next.push(value ? 1 : 0);
    const normalizedWindowSize = Math.max(1, parsePositiveInt(windowSize, 20));
    if (next.length > normalizedWindowSize) {
        next.splice(0, next.length - normalizedWindowSize);
    }
    return next;
}

function computeFailureRate(observations) {
    if (!Array.isArray(observations) || observations.length === 0) return 0;
    const failures = observations.reduce((sum, sample) => sum + (Number(sample) >= 1 ? 1 : 0), 0);
    return failures / observations.length;
}

function isTransientBotFailure(execution) {
    if (!execution || typeof execution !== 'object') return false;
    if (execution.status !== 'failure') return false;
    if (Number(execution.metrics?.retryable) >= 1 || Number(execution.metrics?.transientFailure) >= 1) {
        return true;
    }
    const output = typeof execution.output === 'string' ? execution.output.toLowerCase() : '';
    if (!output) return false;
    return /timed?\s*out|timeout|transport|rate\s*limit|too many requests|throttl|econn|eai_again|enotfound|temporar|unavailable|502|503|504/.test(output);
}

function computeRetryDelayMs({
    baseDelayMs,
    maxDelayMs,
    attempt,
    jitter,
    rng = Math.random
}) {
    const normalizedBase = Math.max(0, parseNonNegativeInt(baseDelayMs, 200));
    const normalizedMax = Math.max(normalizedBase, parseNonNegativeInt(maxDelayMs, 5_000));
    const exponent = Math.max(0, parseNonNegativeInt(attempt, 1) - 1);
    const uncapped = normalizedBase * Math.pow(2, exponent);
    const capped = Math.min(normalizedMax, uncapped);
    const jitterRatio = normalizeRetryJitter(jitter, 0.2);
    if (capped <= 0 || jitterRatio <= 0) return capped;
    const random = typeof rng === 'function' ? clamp(Number(rng()) || 0, 0, 1) : 0.5;
    const offset = ((random * 2) - 1) * jitterRatio;
    return Math.max(0, Math.round(capped * (1 + offset)));
}

async function sleep(ms) {
    const duration = parseNonNegativeInt(ms, 0);
    if (duration <= 0) return;
    await new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

function createBotFailureExecution({
    output,
    metrics = {}
}) {
    return {
        mode: 'generic',
        status: 'failure',
        output,
        metrics,
        artifacts: [],
        followupTasks: []
    };
}

async function executeBotTaskWithTimeout({
    request,
    bot,
    attempt,
    executeBotTask,
    timeoutMs,
    nowFactory = Date.now
}) {
    const startedAt = safeNow(nowFactory);
    const invoke = async () => {
        try {
            return await executeBotTask(request, bot, attempt);
        } catch (error) {
            return createBotFailureExecution({
                output: `Task execution failed: ${error?.message || 'bot execution error'}`,
                metrics: {
                    executionError: 1
                }
            });
        }
    };

    if (parseNonNegativeInt(timeoutMs, 0) <= 0) {
        const execution = await invoke();
        if (execution && typeof execution === 'object') {
            return execution;
        }
        return createBotFailureExecution({
            output: 'Task execution failed: invalid execution response.',
            metrics: {
                executionError: 1
            }
        });
    }

    let timeoutHandle;
    const timeoutResult = new Promise((resolve) => {
        timeoutHandle = setTimeout(() => {
            resolve(createBotFailureExecution({
                output: `Task execution failed: bot attempt timed out after ${timeoutMs}ms.`,
                metrics: {
                    timedOut: 1,
                    transientFailure: 1,
                    retryable: 1,
                    durationMs: timeoutMs
                }
            }));
        }, parseNonNegativeInt(timeoutMs, 0));
    });

    const execution = await Promise.race([invoke(), timeoutResult]);
    if (timeoutHandle) {
        clearTimeout(timeoutHandle);
    }

    const resolvedExecution = execution && typeof execution === 'object'
        ? execution
        : createBotFailureExecution({
            output: 'Task execution failed: invalid execution response.',
            metrics: {
                executionError: 1
            }
        });

    if (resolvedExecution?.metrics?.durationMs === undefined) {
        const durationMs = clamp(safeNow(nowFactory) - startedAt, 0, Number.MAX_SAFE_INTEGER);
        resolvedExecution.metrics = {
            ...(resolvedExecution.metrics || {}),
            durationMs
        };
    }

    return resolvedExecution;
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
    botMaxAttempts = 2,
    botRetryBaseDelayMs = 200,
    botRetryMaxDelayMs = 5_000,
    botRetryJitter = 0.2,
    botAttemptTimeoutMs = 120_000,
    botRetryBudgetRatio = 0,
    botCircuitBreakerFailureThreshold = 0,
    botCircuitBreakerCooldownMs = 30_000,
    botCircuitBreakerHalfOpenMaxProbes = 1,
    botCircuitBreakerHalfOpenSuccessThreshold = 1,
    botCircuitBreakerFailureRateThreshold = 0,
    botCircuitBreakerFailureRateWindow = 20,
    botCircuitBreakerFailureRateMinSamples = 8,
    botExecute = null,
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
    const normalizedBotMaxAttempts = parsePositiveInt(botMaxAttempts, 2);
    const normalizedBotRetryBaseDelayMs = parseNonNegativeInt(botRetryBaseDelayMs, 200);
    const normalizedBotRetryMaxDelayMs = Math.max(
        normalizedBotRetryBaseDelayMs,
        parseNonNegativeInt(botRetryMaxDelayMs, 5_000)
    );
    const normalizedBotRetryJitter = normalizeRetryJitter(botRetryJitter, 0.2);
    const normalizedBotAttemptTimeoutMs = parseNonNegativeInt(botAttemptTimeoutMs, 120_000);
    const normalizedBotRetryBudgetRatio = normalizeRetryBudgetRatio(botRetryBudgetRatio, 0);
    const normalizedBotCircuitBreakerFailureThreshold = normalizeCircuitBreakerFailureThreshold(
        botCircuitBreakerFailureThreshold,
        0
    );
    const normalizedBotCircuitBreakerCooldownMs = normalizeCircuitBreakerCooldownMs(
        botCircuitBreakerCooldownMs,
        30_000
    );
    const normalizedBotCircuitBreakerHalfOpenMaxProbes = normalizeCircuitBreakerHalfOpenMaxProbes(
        botCircuitBreakerHalfOpenMaxProbes,
        1
    );
    const normalizedBotCircuitBreakerHalfOpenSuccessThreshold = Math.min(
        normalizedBotCircuitBreakerHalfOpenMaxProbes,
        normalizeCircuitBreakerHalfOpenSuccessThreshold(
            botCircuitBreakerHalfOpenSuccessThreshold,
            1
        )
    );
    const normalizedBotCircuitBreakerFailureRateThreshold = normalizeCircuitBreakerFailureRateThreshold(
        botCircuitBreakerFailureRateThreshold,
        0
    );
    const normalizedBotCircuitBreakerFailureRateWindow = normalizeCircuitBreakerFailureRateWindow(
        botCircuitBreakerFailureRateWindow,
        20
    );
    const normalizedBotCircuitBreakerFailureRateMinSamples = Math.min(
        normalizedBotCircuitBreakerFailureRateWindow,
        normalizeCircuitBreakerFailureRateMinSamples(
            botCircuitBreakerFailureRateMinSamples,
            8
        )
    );
    const circuitBreakerFailureRateEnabled = normalizedBotCircuitBreakerFailureRateThreshold > 0;
    const retryBudgetEnabled = normalizedBotRetryBudgetRatio > 0;
    const circuitBreakerEnabled = normalizedBotCircuitBreakerFailureThreshold > 0 || circuitBreakerFailureRateEnabled;
    let retryBudgetTokens = 0;
    let consecutiveTransientBotFailures = 0;
    let transientFailureRateObservations = [];
    let circuitBreakerOpenUntilMs = 0;
    let circuitBreakerHalfOpenProbeCount = 0;
    let circuitBreakerHalfOpenSuccessCount = 0;
    const executeBotTask = typeof botExecute === 'function'
        ? botExecute
        : async (request, runtimeBot) => runtimeBot.executeTask(request);
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
        botRetriesAttempted: 0,
        botRetriesRecovered: 0,
        botRetriesExhausted: 0,
        botRetriesBudgetExhausted: 0,
        botAttemptTimeouts: 0,
        botCircuitBreakerOpened: 0,
        botCircuitBreakerOpenSkips: 0,
        botCircuitBreakerHalfOpenProbes: 0,
        botCircuitBreakerClosed: 0,
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
                let execution = null;
                let attempts = 0;
                let transientFailureRetried = false;
                let retryBudgetBlocked = false;
                const startedInCircuitHalfOpen = circuitBreakerEnabled
                    && circuitBreakerOpenUntilMs > 0
                    && safeNow(now) >= circuitBreakerOpenUntilMs;
                if (circuitBreakerEnabled && circuitBreakerOpenUntilMs > 0 && !startedInCircuitHalfOpen) {
                    const remainingMs = Math.max(0, circuitBreakerOpenUntilMs - safeNow(now));
                    execution = createBotFailureExecution({
                        output: `Task execution skipped: circuit breaker is open for another ${remainingMs}ms after consecutive transient failures.`,
                        metrics: {
                            circuitBreakerOpen: 1,
                            circuitBreakerRemainingMs: remainingMs,
                            retryable: 1
                        }
                    });
                    stats.botCircuitBreakerOpenSkips++;
                }
                if (
                    !execution
                    && startedInCircuitHalfOpen
                    && circuitBreakerHalfOpenProbeCount >= normalizedBotCircuitBreakerHalfOpenMaxProbes
                ) {
                    execution = createBotFailureExecution({
                        output: 'Task execution skipped: half-open probe limit reached before circuit could close; reopening cooldown window.',
                        metrics: {
                            circuitBreakerOpen: 1,
                            circuitBreakerHalfOpenProbeLimitReached: 1,
                            retryable: 1
                        }
                    });
                    circuitBreakerOpenUntilMs = safeNow(now) + normalizedBotCircuitBreakerCooldownMs;
                    circuitBreakerHalfOpenProbeCount = 0;
                    circuitBreakerHalfOpenSuccessCount = 0;
                    consecutiveTransientBotFailures = 0;
                    transientFailureRateObservations = [];
                    stats.botCircuitBreakerOpened++;
                    stats.botCircuitBreakerOpenSkips++;
                }
                if (retryBudgetEnabled) {
                    retryBudgetTokens += normalizedBotRetryBudgetRatio;
                }
                while (!execution && attempts < normalizedBotMaxAttempts) {
                    attempts++;
                    // eslint-disable-next-line no-await-in-loop
                    execution = await executeBotTaskWithTimeout({
                        request,
                        bot,
                        attempt: attempts,
                        executeBotTask,
                        timeoutMs: normalizedBotAttemptTimeoutMs,
                        nowFactory: now
                    });
                    if (Number(execution?.metrics?.timedOut) >= 1) {
                        stats.botAttemptTimeouts++;
                    }
                    const shouldRetry = isTransientBotFailure(execution) && attempts < normalizedBotMaxAttempts;
                    if (!shouldRetry) break;
                    if (retryBudgetEnabled && retryBudgetTokens < 1) {
                        retryBudgetBlocked = true;
                        stats.botRetriesBudgetExhausted++;
                        execution = {
                            ...execution,
                            output: `${execution.output} Retry budget exhausted; skipping additional retries.`,
                            metrics: {
                                ...(execution.metrics || {}),
                                retryBudgetExhausted: 1
                            }
                        };
                        break;
                    }
                    transientFailureRetried = true;
                    stats.botRetriesAttempted++;
                    if (retryBudgetEnabled) {
                        retryBudgetTokens = Math.max(0, retryBudgetTokens - 1);
                    }
                    // eslint-disable-next-line no-await-in-loop
                    await sleep(computeRetryDelayMs({
                        baseDelayMs: normalizedBotRetryBaseDelayMs,
                        maxDelayMs: normalizedBotRetryMaxDelayMs,
                        attempt: attempts,
                        jitter: normalizedBotRetryJitter,
                        rng
                    }));
                }
                if (!execution) {
                    execution = {
                        mode: 'generic',
                        status: 'failure',
                        output: 'Task execution failed: empty execution response.',
                        metrics: {},
                        artifacts: [],
                        followupTasks: []
                    };
                }
                stats.botTasksExecuted++;
                stats[botModeToStatField(execution.mode)]++;
                if (attempts > 1 && execution.status !== 'failure') {
                    stats.botRetriesRecovered++;
                } else if (execution.status === 'failure' && (transientFailureRetried || retryBudgetBlocked)) {
                    stats.botRetriesExhausted++;
                }
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

                const transientBotFailure = isTransientBotFailure(execution);
                const skippedByCircuitBreaker = Number(execution?.metrics?.circuitBreakerOpen) >= 1;
                if (!circuitBreakerEnabled || skippedByCircuitBreaker) {
                    consecutiveTransientBotFailures = 0;
                    if (!circuitBreakerEnabled) {
                        circuitBreakerOpenUntilMs = 0;
                        transientFailureRateObservations = [];
                    }
                } else if (startedInCircuitHalfOpen) {
                    stats.botCircuitBreakerHalfOpenProbes++;
                    if (execution.status === 'failure') {
                        consecutiveTransientBotFailures = normalizedBotCircuitBreakerFailureThreshold;
                        circuitBreakerOpenUntilMs = safeNow(now) + normalizedBotCircuitBreakerCooldownMs;
                        circuitBreakerHalfOpenProbeCount = 0;
                        circuitBreakerHalfOpenSuccessCount = 0;
                        transientFailureRateObservations = [];
                        stats.botCircuitBreakerOpened++;
                        execution = {
                            ...execution,
                            output: `${execution.output} Circuit breaker reopened after failed half-open probe.`,
                            metrics: {
                                ...(execution.metrics || {}),
                                circuitBreakerOpened: 1
                            }
                        };
                    } else {
                        circuitBreakerHalfOpenProbeCount += 1;
                        circuitBreakerHalfOpenSuccessCount += 1;
                        if (circuitBreakerHalfOpenSuccessCount >= normalizedBotCircuitBreakerHalfOpenSuccessThreshold) {
                            consecutiveTransientBotFailures = 0;
                            circuitBreakerOpenUntilMs = 0;
                            circuitBreakerHalfOpenProbeCount = 0;
                            circuitBreakerHalfOpenSuccessCount = 0;
                            transientFailureRateObservations = [];
                            stats.botCircuitBreakerClosed++;
                        } else if (circuitBreakerHalfOpenProbeCount >= normalizedBotCircuitBreakerHalfOpenMaxProbes) {
                            consecutiveTransientBotFailures = 0;
                            circuitBreakerOpenUntilMs = safeNow(now) + normalizedBotCircuitBreakerCooldownMs;
                            circuitBreakerHalfOpenProbeCount = 0;
                            circuitBreakerHalfOpenSuccessCount = 0;
                            transientFailureRateObservations = [];
                            stats.botCircuitBreakerOpened++;
                            execution = {
                                ...execution,
                                output: `${execution.output} Circuit breaker reopened after half-open probe limit without meeting success threshold.`,
                                metrics: {
                                    ...(execution.metrics || {}),
                                    circuitBreakerOpened: 1,
                                    circuitBreakerHalfOpenProbeLimitReached: 1
                                }
                            };
                        }
                    }
                } else {
                    transientFailureRateObservations = updateFailureRateObservations(
                        transientFailureRateObservations,
                        execution.status === 'failure' && transientBotFailure,
                        normalizedBotCircuitBreakerFailureRateWindow
                    );

                    if (execution.status === 'failure' && transientBotFailure) {
                        consecutiveTransientBotFailures += 1;
                    } else {
                        consecutiveTransientBotFailures = 0;
                    }

                    const shouldOpenByConsecutiveFailures =
                        normalizedBotCircuitBreakerFailureThreshold > 0
                        && consecutiveTransientBotFailures >= normalizedBotCircuitBreakerFailureThreshold;
                    const failureRate = computeFailureRate(transientFailureRateObservations);
                    const hasEnoughFailureRateSamples =
                        transientFailureRateObservations.length >= normalizedBotCircuitBreakerFailureRateMinSamples;
                    const shouldOpenByFailureRate =
                        circuitBreakerFailureRateEnabled
                        && hasEnoughFailureRateSamples
                        && failureRate >= normalizedBotCircuitBreakerFailureRateThreshold;

                    if (shouldOpenByConsecutiveFailures || shouldOpenByFailureRate) {
                        const failureRateSampleCount = transientFailureRateObservations.length;
                        const reason = shouldOpenByConsecutiveFailures
                            ? `transient-failure threshold`
                            : `transient failure-rate threshold (${failureRate.toFixed(3)} >= ${normalizedBotCircuitBreakerFailureRateThreshold.toFixed(3)} over ${failureRateSampleCount} samples)`;
                        circuitBreakerOpenUntilMs = safeNow(now) + normalizedBotCircuitBreakerCooldownMs;
                        consecutiveTransientBotFailures = 0;
                        circuitBreakerHalfOpenProbeCount = 0;
                        circuitBreakerHalfOpenSuccessCount = 0;
                        transientFailureRateObservations = [];
                        stats.botCircuitBreakerOpened++;
                        execution = {
                            ...execution,
                            output: `${execution.output} Circuit breaker opened for ${normalizedBotCircuitBreakerCooldownMs}ms after ${reason}.`,
                            metrics: {
                                ...(execution.metrics || {}),
                                circuitBreakerOpened: 1,
                                ...(shouldOpenByFailureRate
                                    ? {
                                        circuitBreakerFailureRate: failureRate,
                                        circuitBreakerFailureRateSamples: failureRateSampleCount
                                    }
                                    : {})
                            }
                        };
                    }
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
