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
  --stale-dispatch-ms <n>      Dispatched-task age before recovery planning (default: 1800000)
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
        staleDispatchMs: 30 * 60 * 1000,
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
        if (token === '--stale-dispatch-ms') {
            options.staleDispatchMs = parsePositiveInt(value, '--stale-dispatch-ms', true);
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
    console.log(`Follow-up tasks saved: ${report.totals.followupTasksSaved}`);
    console.log(`Final queue open: ${report.finalQueue.open}`);
    console.log(`Final queue awaiting approval: ${report.finalQueue.awaitingApproval}`);
    console.log(`Final stale dispatched: ${report.finalQueue.dispatchedStale || 0}`);
    if (report.staleDispatchRecoveryPlan?.totalCandidates > 0) {
        console.log(`Recovery plan: ${report.staleDispatchRecoveryPlan.totalCandidates} stale dispatched task(s), dry-run only`);
        for (const candidate of report.staleDispatchRecoveryPlan.candidates.slice(0, 5)) {
            console.log(`- ${candidate.taskId} target=${candidate.target} ageMs=${candidate.ageMs} action=${candidate.recommendedAction}`);
        }
    }
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
            staleDispatchMs: options.staleDispatchMs,
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
