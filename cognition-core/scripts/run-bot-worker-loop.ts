import path from 'path';
import {
    runBotWorkerLoop,
    writeBotWorkerLoopReport
} from '../src/bot-worker-loop.js';

function printHelp() {
    console.log(`Run continuous OpenClaw bot worker loop until queue convergence

Usage:
  tsx scripts/run-bot-worker-loop.ts [options]

Options:
  --store <path>               Queue store path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --outbox-dir <path>          Outbox directory path (default: ../swarm-protocol/state/outbox)
  --archive-dir <path>         Processed outbox archive dir (default: <outbox-dir>/processed)
  --from-agent <id>            Local dispatcher/orchestrator id (default: agent:main)
  --dispatch-limit <n>         Max created tasks dispatched per cycle (default: 100)
  --all-created                Dispatch all created tasks (not only cognition-core planned)
  --cycles <n>                 Max worker cycles (default: 20)
  --idle-cycles <n>            Consecutive idle cycles before stopping (default: 2)
  --no-stop-approvals          Do not stop when only awaiting approvals remain
  --sleep-ms <n>               Delay between cycles in milliseconds (default: 0)
  --eta-ms <n>                 Receipt ETA milliseconds (default: 1000)
  --result-delay-ms <n>        Result completedAt delay milliseconds (default: 500)
  --failure-rate <0-1>         Failure injection probability after execution (default: 0)
  --no-bot-runtime             Disable OpenClaw bot execution and use simulation mode
  --bot-agent <id>             Bot agent id for runtime and follow-up enqueueing (default: agent:openclaw-bot)
  --repo-root <path>           Repo root for skill/capability loading (default: ..)
  --skill-hardening <mode>     Skill hardening policy: off|report|enforce (default: enforce)
  --skill-min-score <n>        Minimum hardening score for deployability (default: 82)
  --deploy-index <path>        Optional skill deployability index JSON path
  --hardening-profile <path>   Optional skill hardening profile JSON path
  --bot-max-attempts <n>       Max bot execution attempts for transient failures (default: 2)
  --bot-retry-base-ms <n>      Base backoff delay in milliseconds for retries (default: 200)
  --bot-retry-max-ms <n>       Max backoff delay in milliseconds for retries (default: 5000)
  --bot-retry-jitter <0-1>     Retry delay jitter ratio (default: 0.2)
  --bot-attempt-timeout-ms <n> Max milliseconds per bot attempt before timeout failure/retry (default: 120000; 0 disables)
  --bot-retry-budget-ratio <0-1> Retry budget tokens earned per task to prevent retry storms (default: 0; disabled)
  --bot-circuit-breaker-failures <n> Open breaker after this many consecutive transient failures (default: 0; disabled)
  --bot-circuit-breaker-failure-rate-threshold <0-1> Open breaker when rolling transient failure rate crosses threshold (default: 0; disabled)
  --bot-circuit-breaker-failure-rate-window <n> Rolling sample window used for failure-rate thresholding (default: 20)
  --bot-circuit-breaker-failure-rate-min-samples <n> Min rolling samples before failure-rate threshold can open breaker (default: 8)
  --bot-circuit-breaker-cooldown-ms <n> Circuit-breaker cooldown before half-open probe (default: 30000)
  --bot-circuit-breaker-cooldown-backoff-multiplier <n> Circuit-breaker cooldown growth multiplier per consecutive reopen (1-10, default: 1)
  --bot-circuit-breaker-max-cooldown-ms <n> Max cooldown cap after repeated reopens (default: 180000)
  --bot-circuit-breaker-half-open-max-probes <n> Max probes allowed while half-open before reopening (default: 1)
  --bot-circuit-breaker-half-open-successes <n> Successful half-open probes required to close breaker (default: 1)
  --no-enqueue-followups       Disable enqueueing bot-generated follow-up tasks
  --json <path>                Optional JSON report output path
  --markdown <path>            Optional markdown report output path
  -h, --help                   Show help
`);
}

function parsePositiveInt(raw, flag, allowZero = false) {
    const value = Number(raw);
    const minimum = allowZero ? 0 : 1;
    if (!Number.isInteger(value) || value < minimum) {
        throw new Error(`${flag} must be an integer >= ${minimum}`);
    }
    return value;
}

function parseFailureRate(raw) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0 || value > 1) {
        throw new Error('--failure-rate must be between 0 and 1');
    }
    return value;
}

function parseHardeningPolicy(raw) {
    const value = String(raw || '').trim().toLowerCase();
    if (value !== 'off' && value !== 'report' && value !== 'enforce') {
        throw new Error('--skill-hardening must be one of: off, report, enforce');
    }
    return value;
}

function parseHardeningScore(raw) {
    const value = Number(raw);
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 1 || value > 100) {
        throw new Error('--skill-min-score must be an integer between 1 and 100');
    }
    return value;
}

function parseRatio(raw, flag) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0 || value > 1) {
        throw new Error(`${flag} must be between 0 and 1`);
    }
    return value;
}

function parseFloatInRange(raw, flag, min, max) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min || value > max) {
        throw new Error(`${flag} must be between ${min} and ${max}`);
    }
    return value;
}

function parseArgs(argv) {
    const defaultOutbox = path.resolve(process.cwd(), '../swarm-protocol/state/outbox');
    const options = {
        storePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
        outboxDir: defaultOutbox,
        archiveDir: path.join(defaultOutbox, 'processed'),
        localAgentId: 'agent:main',
        dispatchLimit: 100,
        includeAllCreated: false,
        maxCycles: 20,
        idleCyclesToStop: 2,
        stopWhenOnlyApprovals: true,
        sleepMs: 0,
        etaMs: 1_000,
        resultDelayMs: 500,
        failureRate: 0,
        botRuntime: true,
        botAgentId: 'agent:openclaw-bot',
        botRepoRoot: path.resolve(process.cwd(), '..'),
        skillHardeningPolicy: 'enforce',
        skillHardeningMinScore: 82,
        skillDeployabilityIndexPath: null,
        skillHardeningProfilePath: null,
        botMaxAttempts: 2,
        botRetryBaseDelayMs: 200,
        botRetryMaxDelayMs: 5_000,
        botRetryJitter: 0.2,
        botAttemptTimeoutMs: 120_000,
        botRetryBudgetRatio: 0,
        botCircuitBreakerFailureThreshold: 0,
        botCircuitBreakerFailureRateThreshold: 0,
        botCircuitBreakerFailureRateWindow: 20,
        botCircuitBreakerFailureRateMinSamples: 8,
        botCircuitBreakerCooldownMs: 30_000,
        botCircuitBreakerCooldownBackoffMultiplier: 1,
        botCircuitBreakerMaxCooldownMs: 180_000,
        botCircuitBreakerHalfOpenMaxProbes: 1,
        botCircuitBreakerHalfOpenSuccessThreshold: 1,
        enqueueFollowupTasks: true,
        jsonPath: null,
        markdownPath: null,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--all-created') {
            options.includeAllCreated = true;
            continue;
        }
        if (token === '--no-stop-approvals') {
            options.stopWhenOnlyApprovals = false;
            continue;
        }
        if (token === '--no-bot-runtime') {
            options.botRuntime = false;
            continue;
        }
        if (token === '--no-enqueue-followups') {
            options.enqueueFollowupTasks = false;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--store') {
            options.storePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--outbox-dir') {
            options.outboxDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--archive-dir') {
            options.archiveDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--from-agent') {
            options.localAgentId = value;
            i++;
            continue;
        }
        if (token === '--dispatch-limit') {
            options.dispatchLimit = parsePositiveInt(value, '--dispatch-limit');
            i++;
            continue;
        }
        if (token === '--cycles') {
            options.maxCycles = parsePositiveInt(value, '--cycles');
            i++;
            continue;
        }
        if (token === '--idle-cycles') {
            options.idleCyclesToStop = parsePositiveInt(value, '--idle-cycles');
            i++;
            continue;
        }
        if (token === '--sleep-ms') {
            options.sleepMs = parsePositiveInt(value, '--sleep-ms', true);
            i++;
            continue;
        }
        if (token === '--eta-ms') {
            options.etaMs = parsePositiveInt(value, '--eta-ms', true);
            i++;
            continue;
        }
        if (token === '--result-delay-ms') {
            options.resultDelayMs = parsePositiveInt(value, '--result-delay-ms', true);
            i++;
            continue;
        }
        if (token === '--failure-rate') {
            options.failureRate = parseFailureRate(value);
            i++;
            continue;
        }
        if (token === '--bot-agent') {
            options.botAgentId = value;
            i++;
            continue;
        }
        if (token === '--repo-root') {
            options.botRepoRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--skill-hardening') {
            options.skillHardeningPolicy = parseHardeningPolicy(value);
            i++;
            continue;
        }
        if (token === '--skill-min-score') {
            options.skillHardeningMinScore = parseHardeningScore(value);
            i++;
            continue;
        }
        if (token === '--deploy-index') {
            options.skillDeployabilityIndexPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--hardening-profile') {
            options.skillHardeningProfilePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--bot-max-attempts') {
            options.botMaxAttempts = parsePositiveInt(value, '--bot-max-attempts');
            i++;
            continue;
        }
        if (token === '--bot-retry-base-ms') {
            options.botRetryBaseDelayMs = parsePositiveInt(value, '--bot-retry-base-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-retry-max-ms') {
            options.botRetryMaxDelayMs = parsePositiveInt(value, '--bot-retry-max-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-retry-jitter') {
            options.botRetryJitter = parseRatio(value, '--bot-retry-jitter');
            i++;
            continue;
        }
        if (token === '--bot-attempt-timeout-ms') {
            options.botAttemptTimeoutMs = parsePositiveInt(value, '--bot-attempt-timeout-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-retry-budget-ratio') {
            options.botRetryBudgetRatio = parseRatio(value, '--bot-retry-budget-ratio');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-failures') {
            options.botCircuitBreakerFailureThreshold = parsePositiveInt(value, '--bot-circuit-breaker-failures', true);
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-failure-rate-threshold') {
            options.botCircuitBreakerFailureRateThreshold = parseRatio(value, '--bot-circuit-breaker-failure-rate-threshold');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-failure-rate-window') {
            options.botCircuitBreakerFailureRateWindow = parsePositiveInt(value, '--bot-circuit-breaker-failure-rate-window');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-failure-rate-min-samples') {
            options.botCircuitBreakerFailureRateMinSamples = parsePositiveInt(value, '--bot-circuit-breaker-failure-rate-min-samples');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-cooldown-ms') {
            options.botCircuitBreakerCooldownMs = parsePositiveInt(value, '--bot-circuit-breaker-cooldown-ms', true);
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-cooldown-backoff-multiplier') {
            options.botCircuitBreakerCooldownBackoffMultiplier = parseFloatInRange(
                value,
                '--bot-circuit-breaker-cooldown-backoff-multiplier',
                1,
                10
            );
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-max-cooldown-ms') {
            options.botCircuitBreakerMaxCooldownMs = parsePositiveInt(value, '--bot-circuit-breaker-max-cooldown-ms');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-half-open-max-probes') {
            options.botCircuitBreakerHalfOpenMaxProbes = parsePositiveInt(value, '--bot-circuit-breaker-half-open-max-probes');
            i++;
            continue;
        }
        if (token === '--bot-circuit-breaker-half-open-successes') {
            options.botCircuitBreakerHalfOpenSuccessThreshold = parsePositiveInt(value, '--bot-circuit-breaker-half-open-successes');
            i++;
            continue;
        }
        if (token === '--json') {
            options.jsonPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--markdown') {
            options.markdownPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    if (!argv.includes('--archive-dir')) {
        options.archiveDir = path.join(options.outboxDir, 'processed');
    }

    return options;
}

function printSummary(report) {
    console.log(`Stop reason: ${report.stopReason}`);
    console.log(`Cycles run: ${report.cyclesRun}`);
    console.log(`Dispatched: ${report.totals.dispatched}`);
    console.log(`Results accepted: ${report.totals.resultsAccepted}`);
    console.log(`Bot tasks executed: ${report.totals.botTasksExecuted}`);
    console.log(`Bot task failures: ${report.totals.botTasksFailed}`);
    console.log(`Bot skill hardening blocked: ${report.totals.botSkillHardeningBlocked}`);
    console.log(`Bot retries attempted: ${report.totals.botRetriesAttempted}`);
    console.log(`Bot retries recovered: ${report.totals.botRetriesRecovered}`);
    console.log(`Bot retries exhausted: ${report.totals.botRetriesExhausted}`);
    console.log(`Bot retries budget exhausted: ${report.totals.botRetriesBudgetExhausted}`);
    console.log(`Bot attempt timeouts: ${report.totals.botAttemptTimeouts}`);
    console.log(`Bot circuit-breaker opened: ${report.totals.botCircuitBreakerOpened}`);
    console.log(`Bot circuit-breaker open skips: ${report.totals.botCircuitBreakerOpenSkips}`);
    console.log(`Bot circuit-breaker half-open probes: ${report.totals.botCircuitBreakerHalfOpenProbes}`);
    console.log(`Bot circuit-breaker closed: ${report.totals.botCircuitBreakerClosed}`);
    console.log(`Follow-up tasks saved: ${report.totals.followupTasksSaved}`);
    console.log(`Final queue open: ${report.finalQueue.open}`);
    console.log(`Final queue awaiting approval: ${report.finalQueue.awaitingApproval}`);
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const report = await runBotWorkerLoop({
            storePath: options.storePath,
            outboxDir: options.outboxDir,
            archiveDir: options.archiveDir,
            localAgentId: options.localAgentId,
            dispatchLimit: options.dispatchLimit,
            includeAllCreated: options.includeAllCreated,
            maxCycles: options.maxCycles,
            idleCyclesToStop: options.idleCyclesToStop,
            stopWhenOnlyApprovals: options.stopWhenOnlyApprovals,
            sleepMs: options.sleepMs,
            etaMs: options.etaMs,
            resultDelayMs: options.resultDelayMs,
            failureRate: options.failureRate,
            botRuntime: options.botRuntime,
            botAgentId: options.botAgentId,
            botRepoRoot: options.botRepoRoot,
            skillHardeningPolicy: options.skillHardeningPolicy,
            skillHardeningMinScore: options.skillHardeningMinScore,
            skillDeployabilityIndexPath: options.skillDeployabilityIndexPath,
            skillHardeningProfilePath: options.skillHardeningProfilePath,
            botMaxAttempts: options.botMaxAttempts,
            botRetryBaseDelayMs: options.botRetryBaseDelayMs,
            botRetryMaxDelayMs: options.botRetryMaxDelayMs,
            botRetryJitter: options.botRetryJitter,
            botAttemptTimeoutMs: options.botAttemptTimeoutMs,
            botRetryBudgetRatio: options.botRetryBudgetRatio,
            botCircuitBreakerFailureThreshold: options.botCircuitBreakerFailureThreshold,
            botCircuitBreakerFailureRateThreshold: options.botCircuitBreakerFailureRateThreshold,
            botCircuitBreakerFailureRateWindow: options.botCircuitBreakerFailureRateWindow,
            botCircuitBreakerFailureRateMinSamples: options.botCircuitBreakerFailureRateMinSamples,
            botCircuitBreakerCooldownMs: options.botCircuitBreakerCooldownMs,
            botCircuitBreakerCooldownBackoffMultiplier: options.botCircuitBreakerCooldownBackoffMultiplier,
            botCircuitBreakerMaxCooldownMs: options.botCircuitBreakerMaxCooldownMs,
            botCircuitBreakerHalfOpenMaxProbes: options.botCircuitBreakerHalfOpenMaxProbes,
            botCircuitBreakerHalfOpenSuccessThreshold: options.botCircuitBreakerHalfOpenSuccessThreshold,
            enqueueFollowupTasks: options.enqueueFollowupTasks
        });

        await writeBotWorkerLoopReport({
            report,
            jsonPath: options.jsonPath,
            markdownPath: options.markdownPath
        });

        printSummary(report);
    } catch (error) {
        console.error(`run-bot-worker-loop failed: ${error.message}`);
        process.exit(1);
    }
})();
