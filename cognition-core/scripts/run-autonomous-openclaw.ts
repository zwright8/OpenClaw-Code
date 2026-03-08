import path from 'path';
import {
    runAutonomousOpenClaw,
    writeAutonomousRunReport
} from '../src/autonomous-openclaw.js';

function printHelp() {
    console.log(`Run autonomous OpenClaw skill/capability waves

Usage:
  tsx scripts/run-autonomous-openclaw.ts [options]

Options:
  --repo-root <path>           Repo root for skill/capability catalogs (default: ..)
  --skill-catalog <path>       Optional external skill catalog markdown/JSON list
  --store <path>               Queue store path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --outbox-dir <path>          Outbox directory path (default: ../swarm-protocol/state/outbox)
  --archive-dir <path>         Processed outbox archive dir (default: <outbox-dir>/processed)
  --state <path>               Persistent autonomy state path (default: reports/autonomous-openclaw/state.json)
  --waves <n>                  Number of autonomous waves to run (default: 1)
  --skills-per-wave <n>        Skill tasks to plan per wave (default: 25)
  --capabilities-per-wave <n>  Capability tasks to plan per wave (default: 12)
  --failure-streak-threshold <n> Failure streak count before cooldown starts (default: 2)
  --failure-cooldown-waves <n> Base cooldown waves once threshold is reached (default: 2)
  --failure-cooldown-backoff-multiplier <n> Exponential cooldown multiplier after threshold (default: 2)
  --failure-cooldown-max-waves <n> Max cooldown waves cap (default: 16)
  --failure-cooldown-jitter-ratio <0-1> Deterministic jitter ratio applied to cooldown waves (default: 0.2)
  --quarantine-failure-streak-threshold <n> Failure streak at which an id is quarantined (default: 6)
  --error-budget-window-waves <n> Recent wave window for failure-pressure averaging (default: 4)
  --error-budget-failure-threshold <0-1> Failure-rate threshold that triggers throttling (default: 0.4)
  --error-budget-throttle-scale <0-1> Scaling factor for per-wave task counts under pressure (default: 0.5)
  --error-budget-min-tasks-per-lane <n> Minimum tasks per lane when throttled (default: 1)
  --dispatch-limit <n>         Dispatch limit per worker cycle (default: 100)
  --worker-cycles <n>          Max worker cycles per wave (default: 12)
  --worker-idle-cycles <n>     Idle cycles before worker stop (default: 2)
  --sleep-ms <n>               Delay between waves in milliseconds (default: 0)
  --failure-rate <0-1>         Failure injection probability after execution (default: 0)
  --no-stop-full-coverage      Continue waves even after full skill/capability coverage
  --no-bot-runtime             Disable bot runtime execution in worker loop
  --bot-agent <id>             Bot agent id for execution/followups (default: agent:openclaw-bot)
  --skill-hardening <mode>     Skill hardening policy: off|report|enforce (default: enforce)
  --skill-min-score <n>        Minimum hardening score for deployability (default: 82)
  --deploy-index <path>        Optional skill deployability index JSON path
  --hardening-profile <path>   Optional skill hardening profile JSON path
  --no-enqueue-followups       Disable enqueueing generated follow-up tasks
  --json <path>                Optional JSON report output
  --markdown <path>            Optional markdown report output
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

function parseUnitInterval(raw, flag) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0 || value > 1) {
        throw new Error(`${flag} must be between 0 and 1`);
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
        repoRoot: path.resolve(process.cwd(), '..'),
        skillCatalogPath: null,
        storePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
        outboxDir: defaultOutbox,
        archiveDir: path.join(defaultOutbox, 'processed'),
        statePath: path.resolve(process.cwd(), 'reports/autonomous-openclaw/state.json'),
        waves: 1,
        skillsPerWave: 25,
        capabilitiesPerWave: 12,
        failureStreakThreshold: 2,
        failureCooldownWaves: 2,
        failureCooldownBackoffMultiplier: 2,
        failureCooldownMaxWaves: 16,
        failureCooldownJitterRatio: 0.2,
        quarantineFailureStreakThreshold: 6,
        errorBudgetWindowWaves: 4,
        errorBudgetFailureThreshold: 0.4,
        errorBudgetThrottleScale: 0.5,
        errorBudgetMinTasksPerLane: 1,
        dispatchLimit: 100,
        workerCycles: 12,
        workerIdleCycles: 2,
        sleepMs: 0,
        failureRate: 0,
        stopOnFullCoverage: true,
        botRuntime: true,
        botAgentId: 'agent:openclaw-bot',
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
        if (token === '--no-stop-full-coverage') {
            options.stopOnFullCoverage = false;
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

        if (token === '--repo-root') {
            options.repoRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--skill-catalog') {
            options.skillCatalogPath = path.resolve(process.cwd(), value);
            i++;
            continue;
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
        if (token === '--state') {
            options.statePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--waves') {
            options.waves = parsePositiveInt(value, '--waves');
            i++;
            continue;
        }
        if (token === '--skills-per-wave') {
            options.skillsPerWave = parsePositiveInt(value, '--skills-per-wave', true);
            i++;
            continue;
        }
        if (token === '--capabilities-per-wave') {
            options.capabilitiesPerWave = parsePositiveInt(value, '--capabilities-per-wave', true);
            i++;
            continue;
        }
        if (token === '--dispatch-limit') {
            options.dispatchLimit = parsePositiveInt(value, '--dispatch-limit');
            i++;
            continue;
        }
        if (token === '--failure-streak-threshold') {
            options.failureStreakThreshold = parsePositiveInt(value, '--failure-streak-threshold');
            i++;
            continue;
        }
        if (token === '--failure-cooldown-waves') {
            options.failureCooldownWaves = parsePositiveInt(value, '--failure-cooldown-waves', true);
            i++;
            continue;
        }
        if (token === '--failure-cooldown-backoff-multiplier') {
            const parsed = Number(value);
            if (!Number.isFinite(parsed) || parsed <= 0) {
                throw new Error('--failure-cooldown-backoff-multiplier must be a number > 0');
            }
            options.failureCooldownBackoffMultiplier = parsed;
            i++;
            continue;
        }
        if (token === '--failure-cooldown-max-waves') {
            options.failureCooldownMaxWaves = parsePositiveInt(value, '--failure-cooldown-max-waves', true);
            i++;
            continue;
        }
        if (token === '--failure-cooldown-jitter-ratio') {
            options.failureCooldownJitterRatio = parseUnitInterval(value, '--failure-cooldown-jitter-ratio');
            i++;
            continue;
        }
        if (token === '--quarantine-failure-streak-threshold') {
            options.quarantineFailureStreakThreshold = parsePositiveInt(value, '--quarantine-failure-streak-threshold');
            i++;
            continue;
        }
        if (token === '--error-budget-window-waves') {
            options.errorBudgetWindowWaves = parsePositiveInt(value, '--error-budget-window-waves');
            i++;
            continue;
        }
        if (token === '--error-budget-failure-threshold') {
            options.errorBudgetFailureThreshold = parseUnitInterval(value, '--error-budget-failure-threshold');
            i++;
            continue;
        }
        if (token === '--error-budget-throttle-scale') {
            const parsed = parseUnitInterval(value, '--error-budget-throttle-scale');
            if (parsed <= 0) {
                throw new Error('--error-budget-throttle-scale must be > 0 and <= 1');
            }
            options.errorBudgetThrottleScale = parsed;
            i++;
            continue;
        }
        if (token === '--error-budget-min-tasks-per-lane') {
            options.errorBudgetMinTasksPerLane = parsePositiveInt(value, '--error-budget-min-tasks-per-lane', true);
            i++;
            continue;
        }
        if (token === '--worker-cycles') {
            options.workerCycles = parsePositiveInt(value, '--worker-cycles');
            i++;
            continue;
        }
        if (token === '--worker-idle-cycles') {
            options.workerIdleCycles = parsePositiveInt(value, '--worker-idle-cycles');
            i++;
            continue;
        }
        if (token === '--sleep-ms') {
            options.sleepMs = parsePositiveInt(value, '--sleep-ms', true);
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
    console.log(`Waves run: ${report.wavesRun}`);
    console.log(`Skill catalog source: ${report.config.skillCatalogSource}`);
    console.log(`Skill catalog path: ${report.config.skillCatalogPath}`);
    console.log(`Skill coverage: ${(report.coverage.skills.coverage * 100).toFixed(2)}% (${report.coverage.skills.successful}/${report.coverage.skills.total})`);
    console.log(`Capability coverage: ${(report.coverage.capabilities.coverage * 100).toFixed(2)}% (${report.coverage.capabilities.successful}/${report.coverage.capabilities.total})`);
    console.log(`Hardening profile: ${report.config.skillHardeningProfilePath}`);
    console.log(`Planned skill tasks: ${report.totals.plannedSkillTasks}`);
    console.log(`Planned capability tasks: ${report.totals.plannedCapabilityTasks}`);
    console.log(`Dispatched: ${report.totals.dispatched}`);
    console.log(`Results accepted: ${report.totals.resultsAccepted}`);
    console.log(`Follow-up tasks saved: ${report.totals.followupTasksSaved}`);
    console.log(`Bot skill hardening blocked: ${report.totals.botSkillHardeningBlocked}`);
    console.log(`Newly quarantined skills: ${report.totals.skillQuarantinedNew}`);
    console.log(`Newly quarantined capabilities: ${report.totals.capabilityQuarantinedNew}`);
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const report = await runAutonomousOpenClaw({
            repoRoot: options.repoRoot,
            skillCatalogPath: options.skillCatalogPath,
            storePath: options.storePath,
            outboxDir: options.outboxDir,
            archiveDir: options.archiveDir,
            statePath: options.statePath,
            waves: options.waves,
            skillsPerWave: options.skillsPerWave,
            capabilitiesPerWave: options.capabilitiesPerWave,
            failureStreakThreshold: options.failureStreakThreshold,
            failureCooldownWaves: options.failureCooldownWaves,
            failureCooldownBackoffMultiplier: options.failureCooldownBackoffMultiplier,
            failureCooldownMaxWaves: options.failureCooldownMaxWaves,
            failureCooldownJitterRatio: options.failureCooldownJitterRatio,
            quarantineFailureStreakThreshold: options.quarantineFailureStreakThreshold,
            errorBudgetWindowWaves: options.errorBudgetWindowWaves,
            errorBudgetFailureThreshold: options.errorBudgetFailureThreshold,
            errorBudgetThrottleScale: options.errorBudgetThrottleScale,
            errorBudgetMinTasksPerLane: options.errorBudgetMinTasksPerLane,
            dispatchLimit: options.dispatchLimit,
            workerCycles: options.workerCycles,
            workerIdleCycles: options.workerIdleCycles,
            sleepMs: options.sleepMs,
            stopOnFullCoverage: options.stopOnFullCoverage,
            failureRate: options.failureRate,
            botRuntime: options.botRuntime,
            botAgentId: options.botAgentId,
            skillHardeningPolicy: options.skillHardeningPolicy,
            skillHardeningMinScore: options.skillHardeningMinScore,
            skillDeployabilityIndexPath: options.skillDeployabilityIndexPath,
            skillHardeningProfilePath: options.skillHardeningProfilePath,
            enqueueFollowupTasks: options.enqueueFollowupTasks
        });

        await writeAutonomousRunReport({
            report,
            jsonPath: options.jsonPath,
            markdownPath: options.markdownPath
        });

        printSummary(report);
    } catch (error) {
        console.error(`run-autonomous-openclaw failed: ${error.message}`);
        process.exit(1);
    }
})();
