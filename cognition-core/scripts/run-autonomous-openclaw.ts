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
  --selection-policy <mode>    Selection policy: ucb|kl_ucb|epsilon_ts|sw_ucb|sw_kl_ucb|sw_epsilon_ts|d_ucb|d_epsilon_ts|cd_ucb|corral_exp3 (default: ucb)
  --thompson-exploration <n>   Thompson posterior sampling weight 0-1 (default: 0.2)
  --thompson-prior-alpha <n>   Thompson prior alpha (>0, default: 1)
  --thompson-prior-beta <n>    Thompson prior beta (>0, default: 1)
  --discount-factor <n>        Exponential forgetting factor for d_* policies (0.5-1, default: 0.97)
  --kl-ucb-confidence <n>      Confidence multiplier for kl_ucb* policies (default: 3)
  --window-size <n>            Sliding-window size for sw_* policies (default: 12)
  --cd-min-samples <n>         Min outcomes before change detection in cd_ucb (default: 8)
  --cd-threshold <n>           Drift threshold for cd_ucb Page-Hinkley detector (default: 1.5)
  --cd-delta <n>               Mean slack delta for cd_ucb detector (default: 0.02)
  --corral-gamma <n>           Exploration mix for corral_exp3 (0-0.8, default: 0.12)
  --corral-eta <n>             Exponential reward scaling for corral_exp3 (>0 to 5, default: 0.8)
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

function parseFloatInRange(raw, flag, min, max) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min || value > max) {
        throw new Error(`${flag} must be a number between ${min} and ${max}`);
    }
    return value;
}

function parsePositiveFloat(raw, flag) {
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`${flag} must be a positive number`);
    }
    return value;
}

function parseSelectionPolicy(raw) {
    const value = String(raw || '').trim().toLowerCase();
    if (value !== 'ucb'
        && value !== 'kl_ucb'
        && value !== 'epsilon_ts'
        && value !== 'sw_ucb'
        && value !== 'sw_kl_ucb'
        && value !== 'sw_epsilon_ts'
        && value !== 'd_ucb'
        && value !== 'd_epsilon_ts'
        && value !== 'cd_ucb'
        && value !== 'corral_exp3') {
        throw new Error('--selection-policy must be one of: ucb, kl_ucb, epsilon_ts, sw_ucb, sw_kl_ucb, sw_epsilon_ts, d_ucb, d_epsilon_ts, cd_ucb, corral_exp3');
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
        selectionPolicyConfig: {
            mode: 'ucb',
            thompsonExploration: 0.2,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1,
            discountFactor: 0.97,
            klUcbConfidence: 3,
            slidingWindowSize: 12,
            changeDetectionMinSamples: 8,
            changeDetectionThreshold: 1.5,
            changeDetectionDelta: 0.02,
            corralGamma: 0.12,
            corralEta: 0.8
        },
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
        if (token === '--selection-policy') {
            options.selectionPolicyConfig.mode = parseSelectionPolicy(value);
            i++;
            continue;
        }
        if (token === '--thompson-exploration') {
            options.selectionPolicyConfig.thompsonExploration = parseFloatInRange(value, '--thompson-exploration', 0, 1);
            i++;
            continue;
        }
        if (token === '--thompson-prior-alpha') {
            options.selectionPolicyConfig.thompsonPriorAlpha = parsePositiveFloat(value, '--thompson-prior-alpha');
            i++;
            continue;
        }
        if (token === '--thompson-prior-beta') {
            options.selectionPolicyConfig.thompsonPriorBeta = parsePositiveFloat(value, '--thompson-prior-beta');
            i++;
            continue;
        }
        if (token === '--discount-factor') {
            options.selectionPolicyConfig.discountFactor = parseFloatInRange(value, '--discount-factor', 0.5, 1);
            i++;
            continue;
        }
        if (token === '--kl-ucb-confidence') {
            options.selectionPolicyConfig.klUcbConfidence = parseFloatInRange(value, '--kl-ucb-confidence', 0, 20);
            i++;
            continue;
        }
        if (token === '--window-size') {
            options.selectionPolicyConfig.slidingWindowSize = parsePositiveInt(value, '--window-size');
            i++;
            continue;
        }
        if (token === '--cd-min-samples') {
            options.selectionPolicyConfig.changeDetectionMinSamples = parsePositiveInt(value, '--cd-min-samples');
            i++;
            continue;
        }
        if (token === '--cd-threshold') {
            options.selectionPolicyConfig.changeDetectionThreshold = parseFloatInRange(value, '--cd-threshold', Number.EPSILON, 10);
            i++;
            continue;
        }
        if (token === '--cd-delta') {
            options.selectionPolicyConfig.changeDetectionDelta = parseFloatInRange(value, '--cd-delta', 0, 0.5);
            i++;
            continue;
        }
        if (token === '--corral-gamma') {
            options.selectionPolicyConfig.corralGamma = parseFloatInRange(value, '--corral-gamma', 0, 0.8);
            i++;
            continue;
        }
        if (token === '--corral-eta') {
            options.selectionPolicyConfig.corralEta = parseFloatInRange(value, '--corral-eta', Number.EPSILON, 5);
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
    console.log(`Selection policy: ${report.config.selectionPolicy?.mode || 'unknown'}`);
    console.log(`Hardening profile: ${report.config.skillHardeningProfilePath}`);
    console.log(`Planned skill tasks: ${report.totals.plannedSkillTasks}`);
    console.log(`Planned capability tasks: ${report.totals.plannedCapabilityTasks}`);
    console.log(`Dispatched: ${report.totals.dispatched}`);
    console.log(`Results accepted: ${report.totals.resultsAccepted}`);
    console.log(`Follow-up tasks saved: ${report.totals.followupTasksSaved}`);
    console.log(`Bot skill hardening blocked: ${report.totals.botSkillHardeningBlocked}`);
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
            enqueueFollowupTasks: options.enqueueFollowupTasks,
            selectionPolicyConfig: options.selectionPolicyConfig
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
