import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { buildTaskRequest } from '../../swarm-protocol/runtime.js';
import {
    enqueueTaskEntries,
    extractTaskEntriesFromBundle
} from '../src/task-bundle-enqueuer.js';
import {
    buildAutopilotFocusBundleSpecs,
    buildAutopilotCycleSnapshot,
    createAutopilotProfileMemory,
    detectPersistentStagnation,
    deriveAutopilotExecutionProfile,
    buildAutopilotSummary,
    recordAutopilotProfileObservation,
    renderAutopilotMarkdown,
    shouldStopAutopilot
} from '../src/autopilot-loop.js';

function printHelp() {
    console.log(`Run multi-cycle cognition autopilot until pass/plateau

Usage:
  tsx scripts/autopilot-loop.ts [options]

Options:
  --cycles <n>               Max cycles (default: 5)
  --patience <n>             Plateau patience cycles (default: 2)
  --min-gain <n>             Minimum readiness score gain per cycle (default: 0.005)
  --min-outcome-gain <n>     Minimum outcome gain per cycle before plateau (default: 1)
  --adaptive-factor <0-1>    Adaptive threshold scaling from baseline (default: 0.5)
  --no-adaptive-thresholds   Disable adaptive threshold scaling
  --no-adaptive-task-mix     Disable dynamic per-cycle task mix tuning
  --target-status <status>   Stop target status: pass|warn|fail (default: pass)
  --reports-dir <path>       Build reports directory (default: ./reports)
  --queue-store <path>       Queue store path (default: ./reports/autopilot/queue.journal.jsonl)
  --outbox-dir <path>        Outbox dir (default: ./reports/autopilot/outbox)
  --outbox-archive <path>    Outbox archive dir (default: ./reports/autopilot/outbox-processed)
  --profile-memory <path>    Profile memory JSON path (default: ./reports/autopilot/profile-memory.json)
  --focus-bundle-log <path>  Focus bundle JSONL audit path (default: ./reports/autopilot/focus-bundles.jsonl)
  --focus-window <n>         Stagnation persistence window before focus bundle enqueue (default: 2)
  --focus-max <n>            Max focus tasks generated per trigger (default: 2)
  --no-focus-bundles         Disable auto-enqueue of focus bundle tasks
  --dispatch-limit <n>       Dispatch limit per cycle (default: 50)
  --max-remediation-tasks <n> Override remediation task cap for each cycle
  --max-skill-growth-tasks <n> Override skill-growth task cap for each cycle
  --max-iteration-tasks <n>  Override cognition iteration task cap for each cycle
  --worker-failure-rate <0-1> Worker failure rate for outbox processing (default: 0)
  --no-auto-review           Disable auto-review stage
  --json <path>              Output JSON report (default: ./reports/autopilot-report.json)
  --markdown <path>          Output markdown report (default: ./reports/autopilot-report.md)
  --snapshot-dir <path>      Per-cycle snapshot dir (default: ./reports/autopilot/cycles)
  --quiet                    Reduce subprocess output
  -h, --help                 Show help
`);
}

function parsePositiveInt(raw, flag) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${flag} must be a positive integer`);
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
    const reportsDir = path.resolve(process.cwd(), 'reports');
    const autopilotDir = path.join(reportsDir, 'autopilot');
    const defaultPaths = {
        queueStorePath: path.join(autopilotDir, 'queue.journal.jsonl'),
        outboxDir: path.join(autopilotDir, 'outbox'),
        outboxArchiveDir: path.join(autopilotDir, 'outbox-processed'),
        jsonPath: path.join(reportsDir, 'autopilot-report.json'),
        markdownPath: path.join(reportsDir, 'autopilot-report.md'),
        snapshotDir: path.join(autopilotDir, 'cycles')
    };
    const options = {
        maxCycles: 5,
        plateauPatience: 2,
        minReadinessGain: 0.005,
        minOutcomeGain: 1,
        adaptiveThresholds: true,
        adaptiveThresholdFactor: 0.5,
        adaptiveTaskMix: true,
        targetStatus: 'pass',
        reportsDir,
        queueStorePath: defaultPaths.queueStorePath,
        outboxDir: defaultPaths.outboxDir,
        outboxArchiveDir: defaultPaths.outboxArchiveDir,
        profileMemoryPath: path.join(autopilotDir, 'profile-memory.json'),
        focusBundleLogPath: path.join(autopilotDir, 'focus-bundles.jsonl'),
        focusBundlesEnabled: true,
        focusPersistenceWindow: 2,
        focusMaxTasks: 2,
        dispatchLimit: 50,
        maxRemediationTasks: null,
        maxSkillGrowthTasks: null,
        maxIterationTasks: null,
        workerFailureRate: 0,
        autoReviewApprovals: true,
        jsonPath: defaultPaths.jsonPath,
        markdownPath: defaultPaths.markdownPath,
        snapshotDir: defaultPaths.snapshotDir,
        quiet: false,
        help: false
    };
    const customizedPaths = {
        queueStorePath: false,
        outboxDir: false,
        outboxArchiveDir: false,
        profileMemoryPath: false,
        focusBundleLogPath: false,
        jsonPath: false,
        markdownPath: false,
        snapshotDir: false
    };
    const customizedExecution = {
        dispatchLimit: false,
        maxRemediationTasks: false,
        maxSkillGrowthTasks: false,
        maxIterationTasks: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--quiet') {
            options.quiet = true;
            continue;
        }
        if (token === '--no-auto-review') {
            options.autoReviewApprovals = false;
            continue;
        }
        if (token === '--no-adaptive-thresholds') {
            options.adaptiveThresholds = false;
            continue;
        }
        if (token === '--no-adaptive-task-mix') {
            options.adaptiveTaskMix = false;
            continue;
        }
        if (token === '--no-focus-bundles') {
            options.focusBundlesEnabled = false;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--cycles') {
            options.maxCycles = parsePositiveInt(value, '--cycles');
            i++;
            continue;
        }
        if (token === '--patience') {
            options.plateauPatience = parsePositiveInt(value, '--patience');
            i++;
            continue;
        }
        if (token === '--min-gain') {
            options.minReadinessGain = parseFloatInRange(value, '--min-gain', 0, 1);
            i++;
            continue;
        }
        if (token === '--min-outcome-gain') {
            options.minOutcomeGain = parseFloatInRange(value, '--min-outcome-gain', 0, Number.MAX_SAFE_INTEGER);
            i++;
            continue;
        }
        if (token === '--adaptive-factor') {
            options.adaptiveThresholdFactor = parseFloatInRange(value, '--adaptive-factor', 0, 1);
            i++;
            continue;
        }
        if (token === '--target-status') {
            options.targetStatus = value;
            i++;
            continue;
        }
        if (token === '--reports-dir') {
            options.reportsDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--queue-store') {
            options.queueStorePath = path.resolve(process.cwd(), value);
            customizedPaths.queueStorePath = true;
            i++;
            continue;
        }
        if (token === '--outbox-dir') {
            options.outboxDir = path.resolve(process.cwd(), value);
            customizedPaths.outboxDir = true;
            i++;
            continue;
        }
        if (token === '--outbox-archive') {
            options.outboxArchiveDir = path.resolve(process.cwd(), value);
            customizedPaths.outboxArchiveDir = true;
            i++;
            continue;
        }
        if (token === '--profile-memory') {
            options.profileMemoryPath = path.resolve(process.cwd(), value);
            customizedPaths.profileMemoryPath = true;
            i++;
            continue;
        }
        if (token === '--focus-bundle-log') {
            options.focusBundleLogPath = path.resolve(process.cwd(), value);
            customizedPaths.focusBundleLogPath = true;
            i++;
            continue;
        }
        if (token === '--focus-window') {
            options.focusPersistenceWindow = parsePositiveInt(value, '--focus-window');
            i++;
            continue;
        }
        if (token === '--focus-max') {
            options.focusMaxTasks = parsePositiveInt(value, '--focus-max');
            i++;
            continue;
        }
        if (token === '--dispatch-limit') {
            options.dispatchLimit = parsePositiveInt(value, '--dispatch-limit');
            customizedExecution.dispatchLimit = true;
            i++;
            continue;
        }
        if (token === '--max-remediation-tasks') {
            options.maxRemediationTasks = parsePositiveInt(value, '--max-remediation-tasks');
            customizedExecution.maxRemediationTasks = true;
            i++;
            continue;
        }
        if (token === '--max-skill-growth-tasks') {
            options.maxSkillGrowthTasks = parsePositiveInt(value, '--max-skill-growth-tasks');
            customizedExecution.maxSkillGrowthTasks = true;
            i++;
            continue;
        }
        if (token === '--max-iteration-tasks') {
            options.maxIterationTasks = parsePositiveInt(value, '--max-iteration-tasks');
            customizedExecution.maxIterationTasks = true;
            i++;
            continue;
        }
        if (token === '--worker-failure-rate') {
            options.workerFailureRate = parseFloatInRange(value, '--worker-failure-rate', 0, 1);
            i++;
            continue;
        }
        if (token === '--json') {
            options.jsonPath = path.resolve(process.cwd(), value);
            customizedPaths.jsonPath = true;
            i++;
            continue;
        }
        if (token === '--markdown') {
            options.markdownPath = path.resolve(process.cwd(), value);
            customizedPaths.markdownPath = true;
            i++;
            continue;
        }
        if (token === '--snapshot-dir') {
            options.snapshotDir = path.resolve(process.cwd(), value);
            customizedPaths.snapshotDir = true;
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    if (options.reportsDir !== reportsDir) {
        const reportsAutopilotDir = path.join(options.reportsDir, 'autopilot');
        if (!customizedPaths.queueStorePath) {
            options.queueStorePath = path.join(reportsAutopilotDir, 'queue.journal.jsonl');
        }
        if (!customizedPaths.outboxDir) {
            options.outboxDir = path.join(reportsAutopilotDir, 'outbox');
        }
        if (!customizedPaths.outboxArchiveDir) {
            options.outboxArchiveDir = path.join(reportsAutopilotDir, 'outbox-processed');
        }
        if (!customizedPaths.snapshotDir) {
            options.snapshotDir = path.join(reportsAutopilotDir, 'cycles');
        }
        if (!customizedPaths.profileMemoryPath) {
            options.profileMemoryPath = path.join(reportsAutopilotDir, 'profile-memory.json');
        }
        if (!customizedPaths.focusBundleLogPath) {
            options.focusBundleLogPath = path.join(reportsAutopilotDir, 'focus-bundles.jsonl');
        }
        if (!customizedPaths.jsonPath) {
            options.jsonPath = path.join(options.reportsDir, 'autopilot-report.json');
        }
        if (!customizedPaths.markdownPath) {
            options.markdownPath = path.join(options.reportsDir, 'autopilot-report.md');
        }
    }

    return {
        ...options,
        customizedExecution
    };
}

function ensureDirForFile(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function resolveTsxBinary(cwd) {
    const localTsx = path.join(cwd, 'node_modules', '.bin', 'tsx');
    if (fs.existsSync(localTsx)) return localTsx;
    return 'tsx';
}

function runFullBuild({
    cwd,
    quiet,
    reportsDir,
    queueStorePath,
    outboxDir,
    outboxArchiveDir,
    dispatchLimit,
    maxRemediationTasks = null,
    maxSkillGrowthTasks = null,
    maxIterationTasks = null,
    workerFailureRate,
    autoReviewApprovals
}) {
    const tsxBinary = resolveTsxBinary(cwd);
    const args = [
        'scripts/full-build.ts',
        '--reports-dir', reportsDir,
        '--queue-store', queueStorePath,
        '--dispatch-outbox', outboxDir,
        '--outbox-archive', outboxArchiveDir,
        '--dispatch-limit', String(dispatchLimit),
        '--worker-failure-rate', String(workerFailureRate),
        '--process-outbox'
    ];

    if (Number.isInteger(maxRemediationTasks) && maxRemediationTasks > 0) {
        args.push('--max-remediation-tasks', String(maxRemediationTasks));
    }
    if (Number.isInteger(maxSkillGrowthTasks) && maxSkillGrowthTasks > 0) {
        args.push('--max-skill-growth-tasks', String(maxSkillGrowthTasks));
    }
    if (Number.isInteger(maxIterationTasks) && maxIterationTasks > 0) {
        args.push('--max-iteration-tasks', String(maxIterationTasks));
    }

    if (autoReviewApprovals) {
        args.push('--auto-review-approvals');
    }

    const result = spawnSync(tsxBinary, args, {
        cwd,
        encoding: 'utf8',
        shell: false
    });

    if (!quiet) {
        if (result.stdout) process.stdout.write(result.stdout);
        if (result.stderr) process.stderr.write(result.stderr);
    }

    const code = Number(result.status);
    if (code !== 0 && code !== 2) {
        const stderr = result.stderr?.trim() || '';
        const stdout = result.stdout?.trim() || '';
        const details = [stderr, stdout].filter(Boolean).join('\n');
        throw new Error(`full-build failed with exit code ${code}${details ? `:\n${details}` : ''}`);
    }

    return code;
}

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function copyIfExists(sourcePath, targetPath) {
    if (!fs.existsSync(sourcePath)) return false;
    ensureDirForFile(targetPath);
    fs.copyFileSync(sourcePath, targetPath);
    return true;
}

function writeReport(report, options) {
    ensureDirForFile(options.jsonPath);
    fs.writeFileSync(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);

    if (options.markdownPath) {
        ensureDirForFile(options.markdownPath);
        fs.writeFileSync(options.markdownPath, renderAutopilotMarkdown(report));
    }
}

function loadProfileMemory(filePath) {
    if (!fs.existsSync(filePath)) {
        return createAutopilotProfileMemory();
    }
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return createAutopilotProfileMemory(parsed);
}

function saveProfileMemory(filePath, profileMemory) {
    ensureDirForFile(filePath);
    fs.writeFileSync(filePath, `${JSON.stringify(createAutopilotProfileMemory(profileMemory), null, 2)}\n`);
}

function appendJsonl(filePath, payload) {
    ensureDirForFile(filePath);
    fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`);
}

function buildFocusTaskBundlePayload({
    specs,
    cycle,
    sourceReport,
    generatedAt = Date.now()
}) {
    const createdAt = Number.isFinite(Number(generatedAt)) ? Number(generatedAt) : Date.now();
    const tasks = (Array.isArray(specs) ? specs : []).map((spec, index) => buildTaskRequest({
        from: 'agent:cognition-core',
        target: spec.target,
        priority: spec.priority,
        task: spec.task,
        context: {
            sourceReport,
            planner: 'cognition-core/autopilot-focus-bundle',
            focusSpec: spec
        },
        createdAt: createdAt + index
    }));

    return {
        generatedAt: new Date(createdAt).toISOString(),
        cycle,
        sourceReport,
        count: tasks.length,
        tasks
    };
}

function summarizeProfileMemory(profileMemory) {
    const memory = createAutopilotProfileMemory(profileMemory);
    const profiles = Object.entries(memory.profiles || {})
        .map(([focus, stats]) => ({
            focus,
            observations: Number(stats?.observations) || 0,
            avgScore: Number(stats?.avgScore) || 0,
            avgReadinessGain: Number(stats?.avgReadinessGain) || 0,
            avgOutcomeGain: Number(stats?.avgOutcomeGain) || 0
        }))
        .sort((a, b) => {
            if (a.avgScore !== b.avgScore) return b.avgScore - a.avgScore;
            return b.observations - a.observations;
        });

    return {
        version: memory.version,
        totalObservations: memory.totalObservations,
        updatedAt: memory.updatedAt,
        profiles
    };
}

(async function main() {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        ensureDir(options.snapshotDir);
        ensureDir(path.dirname(options.queueStorePath));
        ensureDir(path.dirname(options.outboxDir));
        ensureDir(path.dirname(options.outboxArchiveDir));

        const cwd = process.cwd();
        const cycles = [];
        const focusBundles = [];
        let profileMemory = loadProfileMemory(options.profileMemoryPath);
        saveProfileMemory(options.profileMemoryPath, profileMemory);
        let stopDecision = {
            stop: false,
            reason: 'max_cycles_reached'
        };

        const readinessPath = path.join(options.reportsDir, 'readiness.json');
        const learningPath = path.join(options.reportsDir, 'learning-loop.json');
        const analysisPath = path.join(options.reportsDir, 'cognition-report.json');

        for (let cycle = 1; cycle <= options.maxCycles; cycle++) {
            const derivedExecutionProfile = options.adaptiveTaskMix
                ? deriveAutopilotExecutionProfile(cycles, stopDecision, {
                    profileMemory
                })
                : null;
            const cycleExecutionProfile = {
                focus: derivedExecutionProfile?.focus || 'static',
                readinessStatus: derivedExecutionProfile?.readinessStatus || 'unknown',
                stagnationCause: derivedExecutionProfile?.stagnationCause || 'none',
                rationale: Array.isArray(derivedExecutionProfile?.rationale)
                    ? derivedExecutionProfile.rationale
                    : [],
                adaptiveTaskMixApplied: options.adaptiveTaskMix
                    && (derivedExecutionProfile !== null)
                    && !options.customizedExecution.dispatchLimit,
                dispatchLimit: options.customizedExecution.dispatchLimit
                    ? options.dispatchLimit
                    : (derivedExecutionProfile?.dispatchLimit ?? options.dispatchLimit),
                maxRemediationTasks: options.customizedExecution.maxRemediationTasks
                    ? options.maxRemediationTasks
                    : (derivedExecutionProfile?.remediationMax ?? options.maxRemediationTasks),
                maxSkillGrowthTasks: options.customizedExecution.maxSkillGrowthTasks
                    ? options.maxSkillGrowthTasks
                    : (derivedExecutionProfile?.skillGrowthMax ?? options.maxSkillGrowthTasks),
                maxIterationTasks: options.customizedExecution.maxIterationTasks
                    ? options.maxIterationTasks
                    : (derivedExecutionProfile?.iterationMax ?? options.maxIterationTasks),
                adaptiveThresholdsConfirmed: Boolean(derivedExecutionProfile?.adaptiveApplied),
                memoryRecommendation: derivedExecutionProfile?.memoryRecommendation || null
            };

            const startedAt = Date.now();
            const exitCode = runFullBuild({
                cwd,
                quiet: options.quiet,
                reportsDir: options.reportsDir,
                queueStorePath: options.queueStorePath,
                outboxDir: options.outboxDir,
                outboxArchiveDir: options.outboxArchiveDir,
                dispatchLimit: cycleExecutionProfile.dispatchLimit,
                maxRemediationTasks: cycleExecutionProfile.maxRemediationTasks,
                maxSkillGrowthTasks: cycleExecutionProfile.maxSkillGrowthTasks,
                maxIterationTasks: cycleExecutionProfile.maxIterationTasks,
                workerFailureRate: options.workerFailureRate,
                autoReviewApprovals: options.autoReviewApprovals
            });
            const finishedAt = Date.now();

            const readiness = readJsonFile(readinessPath);
            const learning = readJsonFile(learningPath);
            const analysis = readJsonFile(analysisPath);
            const snapshot = buildAutopilotCycleSnapshot({
                cycle,
                buildExitCode: exitCode,
                startedAt,
                finishedAt,
                readiness,
                learning,
                analysis
            });
            cycles.push(snapshot);
            snapshot.executionProfile = cycleExecutionProfile;

            const cycleDir = path.join(options.snapshotDir, `cycle-${String(cycle).padStart(2, '0')}`);
            ensureDir(cycleDir);
            copyIfExists(readinessPath, path.join(cycleDir, 'readiness.json'));
            copyIfExists(learningPath, path.join(cycleDir, 'learning-loop.json'));
            copyIfExists(analysisPath, path.join(cycleDir, 'cognition-report.json'));

            stopDecision = shouldStopAutopilot(cycles, {
                targetStatus: options.targetStatus,
                plateauPatience: options.plateauPatience,
                minReadinessGain: options.minReadinessGain,
                minOutcomeGain: options.minOutcomeGain,
                adaptiveThresholds: options.adaptiveThresholds,
                adaptiveThresholdFactor: options.adaptiveThresholdFactor
            });
            snapshot.stopReason = stopDecision.reason;
            snapshot.stagnationCause = stopDecision.stagnationCause || 'none';
            if (stopDecision.thresholds) {
                snapshot.thresholds = stopDecision.thresholds;
            }
            const persistence = detectPersistentStagnation(cycles, {
                window: options.focusPersistenceWindow
            });
            snapshot.stagnationPersistence = persistence;

            if (cycles.length >= 2) {
                profileMemory = recordAutopilotProfileObservation(profileMemory, {
                    executionProfile: cycleExecutionProfile,
                    previousCycle: cycles[cycles.length - 2],
                    currentCycle: snapshot,
                    stopDecision
                });
                saveProfileMemory(options.profileMemoryPath, profileMemory);
            }

            const focusBundleEvent = {
                cycle,
                persisted: false,
                cause: persistence.cause,
                generated: 0,
                accepted: 0,
                saved: 0,
                skipped: 0,
                bundlePath: null
            };
            if (options.focusBundlesEnabled && persistence.persisted) {
                const focusSpecs = buildAutopilotFocusBundleSpecs(
                    {
                        executionProfile: cycleExecutionProfile,
                        stopDecision,
                        persistence,
                        cycle
                    },
                    {
                        maxItems: options.focusMaxTasks
                    }
                );

                if (focusSpecs.length > 0) {
                    const bundlePayload = buildFocusTaskBundlePayload({
                        specs: focusSpecs,
                        cycle,
                        sourceReport: options.jsonPath,
                        generatedAt: finishedAt + 1
                    });
                    const bundlePath = path.join(cycleDir, 'focus-bundle.json');
                    fs.writeFileSync(bundlePath, `${JSON.stringify(bundlePayload, null, 2)}\n`);
                    const enqueueResult = await enqueueTaskEntries({
                        storePath: options.queueStorePath,
                        entries: extractTaskEntriesFromBundle(bundlePayload, bundlePath),
                        actor: 'agent:cognition-core:autopilot-focus'
                    });

                    focusBundleEvent.persisted = true;
                    focusBundleEvent.generated = bundlePayload.count;
                    focusBundleEvent.accepted = enqueueResult.stats.accepted;
                    focusBundleEvent.saved = enqueueResult.stats.saved;
                    focusBundleEvent.skipped = enqueueResult.skipped.length;
                    focusBundleEvent.bundlePath = bundlePath;
                    appendJsonl(options.focusBundleLogPath, {
                        at: new Date().toISOString(),
                        cycle,
                        focus: cycleExecutionProfile.focus,
                        stagnationCause: stopDecision.stagnationCause || 'none',
                        persistence,
                        bundlePath,
                        enqueue: {
                            accepted: enqueueResult.stats.accepted,
                            saved: enqueueResult.stats.saved,
                            skipped: enqueueResult.skipped.length
                        }
                    });
                }
            }
            snapshot.focusBundle = focusBundleEvent;
            focusBundles.push(focusBundleEvent);

            if (stopDecision.stop) {
                break;
            }
        }

        const report = {
            generatedAt: new Date().toISOString(),
            config: {
                maxCycles: options.maxCycles,
                plateauPatience: options.plateauPatience,
                minReadinessGain: options.minReadinessGain,
                minOutcomeGain: options.minOutcomeGain,
                adaptiveThresholds: options.adaptiveThresholds,
                adaptiveThresholdFactor: options.adaptiveThresholdFactor,
                adaptiveTaskMix: options.adaptiveTaskMix,
                targetStatus: options.targetStatus,
                reportsDir: options.reportsDir,
                queueStorePath: options.queueStorePath,
                outboxDir: options.outboxDir,
                outboxArchiveDir: options.outboxArchiveDir,
                dispatchLimit: options.dispatchLimit,
                maxRemediationTasks: options.maxRemediationTasks,
                maxSkillGrowthTasks: options.maxSkillGrowthTasks,
                maxIterationTasks: options.maxIterationTasks,
                profileMemoryPath: options.profileMemoryPath,
                focusBundleLogPath: options.focusBundleLogPath,
                focusBundlesEnabled: options.focusBundlesEnabled,
                focusPersistenceWindow: options.focusPersistenceWindow,
                focusMaxTasks: options.focusMaxTasks,
                workerFailureRate: options.workerFailureRate,
                autoReviewApprovals: options.autoReviewApprovals
            },
            stopDecision,
            cycles,
            focusBundles,
            profileMemory: summarizeProfileMemory(profileMemory),
            summary: buildAutopilotSummary(cycles, stopDecision)
        };

        writeReport(report, options);
        console.log(`Autopilot cycles: ${report.summary.cycles}`);
        console.log(`Final readiness: ${report.summary.finalReadinessStatus} (${report.summary.finalReadinessScore ?? 'n/a'})`);
        console.log(`Stop reason: ${report.summary.stopReason}`);
        console.log(`JSON report: ${options.jsonPath}`);
        if (options.markdownPath) {
            console.log(`Markdown report: ${options.markdownPath}`);
        }
    } catch (error) {
        console.error(`autopilot-loop failed: ${error.message}`);
        process.exit(1);
    }
})();
