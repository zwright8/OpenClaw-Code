import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import {
    evaluateCognitionCoreReadiness,
    renderCognitionCoreReadinessMarkdown
} from '../src/readiness-gate.js';
import {
    enqueueTaskEntries,
    extractTaskEntriesFromBundle
} from '../src/task-bundle-enqueuer.js';

function printHelp() {
    console.log(`Cognition Core full build runner

Usage:
  tsx scripts/full-build.ts [options]

Options:
  --days <n>              Window size for analysis (default: 7)
  --sessions-file <path>  Override sessions file path
  --memory-root <path>    Override memory root path
  --memory-template <path> Write/maintain a memory template file during build
  --store <path>          Override task journal path
  --queue-store <path>    Queue store path for generated tasks (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --dispatch-outbox <path> Outbox directory for dispatched envelopes (default: ../swarm-protocol/state/outbox)
  --max-remediation-tasks <n> Cap remediation tasks generated this run
  --max-skill-growth-tasks <n> Cap skill-growth tasks generated this run
  --max-iteration-tasks <n> Cap cognition-iteration tasks generated this run
  --auto-review-approvals Auto-review awaiting approvals using strict allowlist policy
  --auto-review-max <n>   Max awaiting approvals reviewed per run (default: 25)
  --auto-review-deny-unsupported Deny unsupported approval rules instead of skipping
  --auto-review-include-non-cognition Include non-cognition awaiting approvals
  --auto-review-allow-unmatched Allow approvals when matchedRules metadata is missing
  --process-outbox        Process outbox envelopes into task receipts/results
  --outbox-archive <path> Archive directory for processed outbox files (default: <dispatch-outbox>/processed)
  --worker-failure-rate <0-1> Failure injection probability after execution (default: 0)
  --drain-queue           Keep dispatching/processing until queue converges
  --drain-cycles <n>      Max drain loop cycles when --drain-queue (default: 12)
  --drain-idle-cycles <n> Idle cycles before drain loop stop (default: 2)
  --drain-all-created     Drain loop dispatches all created tasks (not only cognition-core planned)
  --no-outbox-bot-runtime Disable OpenClaw bot runtime for outbox processing
  --outbox-bot-agent <id> Agent id for bot-generated follow-up tasks (default: agent:openclaw-bot)
  --outbox-repo-root <path> Repo root for skills/capabilities loading (default: ..)
  --no-outbox-followups   Disable enqueueing bot-generated follow-up tasks
  --skills-catalog <path> Override skill catalog path
  --reports-dir <path>    Output directory (default: ./reports)
  --no-enqueue            Skip enqueueing generated tasks into queue store
  --no-dispatch           Skip dispatching created cognition tasks
  --dispatch-limit <n>    Max created tasks dispatched per run (default: 50)
  --strict                Exit non-zero on readiness warn (default only fail is non-zero)
  --quiet                 Reduce step logging
  -h, --help              Show help
`);
}

function parsePositiveInt(raw, flag) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${flag} must be a positive integer`);
    }
    return value;
}

function parseArgs(argv) {
    const options = {
        days: 7,
        sessionsFile: null,
        memoryRoot: null,
        memoryTemplatePath: null,
        storePath: null,
        queueStorePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
        dispatchOutboxDir: path.resolve(process.cwd(), '../swarm-protocol/state/outbox'),
        maxRemediationTasks: null,
        maxSkillGrowthTasks: null,
        maxIterationTasks: null,
        autoReviewApprovals: false,
        autoReviewMax: 25,
        autoReviewDenyUnsupported: false,
        autoReviewIncludeNonCognition: false,
        autoReviewAllowUnmatched: false,
        processOutbox: false,
        outboxArchiveDir: null,
        workerFailureRate: 0,
        drainQueue: false,
        drainCycles: 12,
        drainIdleCycles: 2,
        drainAllCreated: false,
        outboxBotRuntime: true,
        outboxBotAgentId: 'agent:openclaw-bot',
        outboxRepoRoot: path.resolve(process.cwd(), '..'),
        outboxEnqueueFollowups: true,
        skillsCatalogPath: null,
        reportsDir: path.resolve(process.cwd(), 'reports'),
        enqueue: true,
        dispatchCreated: true,
        dispatchLimit: 50,
        strict: false,
        quiet: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--strict') {
            options.strict = true;
            continue;
        }
        if (token === '--quiet') {
            options.quiet = true;
            continue;
        }
        if (token === '--no-enqueue') {
            options.enqueue = false;
            continue;
        }
        if (token === '--no-dispatch') {
            options.dispatchCreated = false;
            continue;
        }
        if (token === '--process-outbox') {
            options.processOutbox = true;
            continue;
        }
        if (token === '--auto-review-approvals') {
            options.autoReviewApprovals = true;
            continue;
        }
        if (token === '--auto-review-deny-unsupported') {
            options.autoReviewDenyUnsupported = true;
            continue;
        }
        if (token === '--auto-review-include-non-cognition') {
            options.autoReviewIncludeNonCognition = true;
            continue;
        }
        if (token === '--auto-review-allow-unmatched') {
            options.autoReviewAllowUnmatched = true;
            continue;
        }
        if (token === '--drain-queue') {
            options.drainQueue = true;
            continue;
        }
        if (token === '--drain-all-created') {
            options.drainAllCreated = true;
            continue;
        }
        if (token === '--no-outbox-bot-runtime') {
            options.outboxBotRuntime = false;
            continue;
        }
        if (token === '--no-outbox-followups') {
            options.outboxEnqueueFollowups = false;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--days') {
            options.days = parsePositiveInt(value, '--days');
            i++;
            continue;
        }
        if (token === '--sessions-file') {
            options.sessionsFile = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--memory-root') {
            options.memoryRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--memory-template') {
            options.memoryTemplatePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--store') {
            options.storePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--queue-store') {
            options.queueStorePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--dispatch-outbox') {
            options.dispatchOutboxDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--max-remediation-tasks') {
            options.maxRemediationTasks = parsePositiveInt(value, '--max-remediation-tasks');
            i++;
            continue;
        }
        if (token === '--max-skill-growth-tasks') {
            options.maxSkillGrowthTasks = parsePositiveInt(value, '--max-skill-growth-tasks');
            i++;
            continue;
        }
        if (token === '--max-iteration-tasks') {
            options.maxIterationTasks = parsePositiveInt(value, '--max-iteration-tasks');
            i++;
            continue;
        }
        if (token === '--outbox-archive') {
            options.outboxArchiveDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--skills-catalog') {
            options.skillsCatalogPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--reports-dir') {
            options.reportsDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--dispatch-limit') {
            options.dispatchLimit = parsePositiveInt(value, '--dispatch-limit');
            i++;
            continue;
        }
        if (token === '--auto-review-max') {
            options.autoReviewMax = parsePositiveInt(value, '--auto-review-max');
            i++;
            continue;
        }
        if (token === '--worker-failure-rate') {
            const failureRate = Number(value);
            if (!Number.isFinite(failureRate) || failureRate < 0 || failureRate > 1) {
                throw new Error('--worker-failure-rate must be between 0 and 1');
            }
            options.workerFailureRate = failureRate;
            i++;
            continue;
        }
        if (token === '--drain-cycles') {
            options.drainCycles = parsePositiveInt(value, '--drain-cycles');
            i++;
            continue;
        }
        if (token === '--drain-idle-cycles') {
            options.drainIdleCycles = parsePositiveInt(value, '--drain-idle-cycles');
            i++;
            continue;
        }
        if (token === '--outbox-bot-agent') {
            options.outboxBotAgentId = value;
            i++;
            continue;
        }
        if (token === '--outbox-repo-root') {
            options.outboxRepoRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing required file: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveTsxBinary(cwd) {
    const localTsx = path.join(cwd, 'node_modules', '.bin', 'tsx');
    if (fs.existsSync(localTsx)) return localTsx;
    return 'tsx';
}

function runTsxScript(scriptPath, args = [], { cwd, quiet = false } = {}) {
    const tsxBinary = resolveTsxBinary(cwd);
    const result = spawnSync(tsxBinary, [scriptPath, ...args], {
        cwd,
        encoding: 'utf8',
        shell: false
    });

    if (!quiet) {
        if (result.stdout) process.stdout.write(result.stdout);
        if (result.stderr) process.stderr.write(result.stderr);
    }

    if (result.status !== 0) {
        const stderr = result.stderr?.trim() || '';
        const stdout = result.stdout?.trim() || '';
        const details = [stderr, stdout].filter(Boolean).join('\n');
        throw new Error(`Step ${scriptPath} failed${details ? `:\n${details}` : ''}`);
    }
}

function extractTasks(payload) {
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.tasks)) return payload.tasks;
    return [];
}

(async function main() {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        ensureDir(options.reportsDir);
        const cwd = process.cwd();

        const cognitionReportJson = path.join(options.reportsDir, 'cognition-report.json');
        const cognitionReportMd = path.join(options.reportsDir, 'cognition-report.md');
        const remediationTasksJson = path.join(options.reportsDir, 'remediation-tasks.json');
        const learningLoopJson = path.join(options.reportsDir, 'learning-loop.json');
        const learningLoopMd = path.join(options.reportsDir, 'learning-loop.md');
        const learningStateJson = path.join(options.reportsDir, 'learning-state.json');
        const skillGrowthTasksJson = path.join(options.reportsDir, 'skill-growth-tasks.json');
        const memoryGuardrailsJson = path.join(options.reportsDir, 'memory-guardrails.json');
        const memoryGuardrailsMd = path.join(options.reportsDir, 'memory-guardrails.md');
        const readinessJson = path.join(options.reportsDir, 'readiness.json');
        const readinessMd = path.join(options.reportsDir, 'readiness.md');
        const iterationPlanJson = path.join(options.reportsDir, 'cognition-iteration-plan.json');
        const iterationPlanMd = path.join(options.reportsDir, 'cognition-iteration-plan.md');
        const iterationTasksJson = path.join(options.reportsDir, 'cognition-iteration-tasks.json');
        const iterationHistoryJsonl = path.join(options.reportsDir, 'iteration-history.jsonl');

        const analyzeArgs = [
            '--days', String(options.days),
            '--json', cognitionReportJson,
            '--markdown', cognitionReportMd
        ];
        if (options.sessionsFile) {
            analyzeArgs.push('--sessions-file', options.sessionsFile);
        }
        if (options.memoryRoot) {
            analyzeArgs.push('--memory-root', options.memoryRoot);
        }
        analyzeArgs.push('--quiet');
        runTsxScript('scripts/analyze-history.ts', analyzeArgs, { cwd, quiet: options.quiet });

        const memoryGuardrailArgs = [
            '--days', String(options.days),
            '--json', memoryGuardrailsJson,
            '--markdown', memoryGuardrailsMd
        ];
        if (options.memoryRoot) {
            memoryGuardrailArgs.push('--memory-root', options.memoryRoot);
        }
        if (options.memoryTemplatePath) {
            memoryGuardrailArgs.push('--template-out', options.memoryTemplatePath);
        }
        runTsxScript('scripts/memory-guardrails.ts', memoryGuardrailArgs, { cwd, quiet: options.quiet });

        const remediationArgs = [
            '--report', cognitionReportJson,
            '--out', remediationTasksJson
        ];
        if (Number.isInteger(options.maxRemediationTasks) && options.maxRemediationTasks > 0) {
            remediationArgs.push('--max', String(options.maxRemediationTasks));
        }
        runTsxScript('scripts/plan-remediation-tasks.ts', remediationArgs, { cwd, quiet: options.quiet });

        const learnArgs = [
            '--json', learningLoopJson,
            '--markdown', learningLoopMd,
            '--state-in', learningStateJson,
            '--state-out', learningStateJson
        ];
        const learningStorePath = options.storePath || options.queueStorePath;
        learnArgs.push('--store', learningStorePath);
        if (options.skillsCatalogPath) {
            learnArgs.push('--skills-catalog', options.skillsCatalogPath);
        }
        runTsxScript('scripts/learn-from-outcomes.ts', learnArgs, { cwd, quiet: options.quiet });

        const skillGrowthArgs = [
            '--report', learningLoopJson,
            '--out', skillGrowthTasksJson
        ];
        if (Number.isInteger(options.maxSkillGrowthTasks) && options.maxSkillGrowthTasks > 0) {
            skillGrowthArgs.push('--max', String(options.maxSkillGrowthTasks));
        }
        runTsxScript('scripts/plan-skill-growth-tasks.ts', skillGrowthArgs, { cwd, quiet: options.quiet });

        const analysisReport = readJsonFile(cognitionReportJson);
        const learningReport = readJsonFile(learningLoopJson);
        const memoryGuardrailsReport = readJsonFile(memoryGuardrailsJson);
        const remediationTasksPayload = readJsonFile(remediationTasksJson);
        const skillGrowthTasksPayload = readJsonFile(skillGrowthTasksJson);

        const readiness = evaluateCognitionCoreReadiness({
            analysisReport,
            learningReport,
            memoryGuardrailsReport,
            remediationTasks: extractTasks(remediationTasksPayload),
            skillGrowthTasks: extractTasks(skillGrowthTasksPayload)
        });

        fs.writeFileSync(readinessJson, `${JSON.stringify(readiness, null, 2)}\n`);
        fs.writeFileSync(readinessMd, `${renderCognitionCoreReadinessMarkdown(readiness)}\n`);

        const iterateArgs = [
            '--analysis', cognitionReportJson,
            '--learning', learningLoopJson,
            '--readiness', readinessJson,
            '--memory-guardrails', memoryGuardrailsJson,
            '--history', iterationHistoryJsonl,
            '--json', iterationPlanJson,
            '--markdown', iterationPlanMd,
            '--tasks-out', iterationTasksJson
        ];
        if (Number.isInteger(options.maxIterationTasks) && options.maxIterationTasks > 0) {
            iterateArgs.push('--max-tasks', String(options.maxIterationTasks));
        }
        runTsxScript('scripts/iterate-cognition.ts', iterateArgs, { cwd, quiet: options.quiet });

        if (options.enqueue) {
            const iterationTasksPayload = readJsonFile(iterationTasksJson);
            const entries = [
                ...extractTaskEntriesFromBundle(remediationTasksPayload, remediationTasksJson),
                ...extractTaskEntriesFromBundle(skillGrowthTasksPayload, skillGrowthTasksJson),
                ...extractTaskEntriesFromBundle(iterationTasksPayload, iterationTasksJson)
            ];

            const enqueueResult = await enqueueTaskEntries({
                storePath: options.queueStorePath,
                entries,
                actor: 'agent:cognition-core'
            });

            if (!options.quiet) {
                console.log(`Enqueue summary: accepted=${enqueueResult.stats.accepted} saved=${enqueueResult.stats.saved} skipped=${enqueueResult.skipped.length}`);
            }
        }

        if (options.dispatchCreated) {
            runTsxScript('scripts/dispatch-created-tasks.ts', [
                '--store', options.queueStorePath,
                '--outbox-dir', options.dispatchOutboxDir,
                '--limit', String(options.dispatchLimit)
            ], { cwd, quiet: options.quiet });
        }

        if (options.autoReviewApprovals) {
            const approvalArgs = [
                '--store', options.queueStorePath,
                '--outbox-dir', options.dispatchOutboxDir,
                '--limit', String(options.autoReviewMax)
            ];
            if (options.autoReviewDenyUnsupported) {
                approvalArgs.push('--deny-unsupported');
            }
            if (options.autoReviewIncludeNonCognition) {
                approvalArgs.push('--include-non-cognition');
            }
            if (options.autoReviewAllowUnmatched) {
                approvalArgs.push('--allow-unmatched');
            }
            runTsxScript('scripts/auto-review-approvals.ts', approvalArgs, {
                cwd,
                quiet: options.quiet
            });
        }

        if (options.processOutbox) {
            const outboxArchiveDir = options.outboxArchiveDir
                ? options.outboxArchiveDir
                : path.join(options.dispatchOutboxDir, 'processed');
            if (options.drainQueue) {
                const drainArgs = [
                    '--store', options.queueStorePath,
                    '--outbox-dir', options.dispatchOutboxDir,
                    '--archive-dir', outboxArchiveDir,
                    '--dispatch-limit', String(options.dispatchLimit),
                    '--cycles', String(options.drainCycles),
                    '--idle-cycles', String(options.drainIdleCycles),
                    '--failure-rate', String(options.workerFailureRate),
                    '--bot-agent', options.outboxBotAgentId,
                    '--repo-root', options.outboxRepoRoot
                ];
                if (options.drainAllCreated) {
                    drainArgs.push('--all-created');
                }
                if (!options.outboxBotRuntime) {
                    drainArgs.push('--no-bot-runtime');
                }
                if (!options.outboxEnqueueFollowups) {
                    drainArgs.push('--no-enqueue-followups');
                }
                runTsxScript('scripts/run-bot-worker-loop.ts', drainArgs, { cwd, quiet: options.quiet });
            } else {
                const processOutboxArgs = [
                    '--store', options.queueStorePath,
                    '--outbox-dir', options.dispatchOutboxDir,
                    '--archive-dir', outboxArchiveDir,
                    '--failure-rate', String(options.workerFailureRate),
                    '--bot-agent', options.outboxBotAgentId,
                    '--repo-root', options.outboxRepoRoot
                ];
                if (!options.outboxBotRuntime) {
                    processOutboxArgs.push('--no-bot-runtime');
                }
                if (!options.outboxEnqueueFollowups) {
                    processOutboxArgs.push('--no-enqueue-followups');
                }
                runTsxScript('scripts/process-outbox.ts', processOutboxArgs, { cwd, quiet: options.quiet });
            }
        }

        console.log(`Readiness status: ${readiness.status} (score ${readiness.readinessScore})`);
        console.log(`Readiness report: ${readinessJson}`);

        if (readiness.status === 'fail' || (options.strict && readiness.status === 'warn')) {
            process.exit(2);
        }
    } catch (error) {
        console.error(`Full build failed: ${error.message}`);
        process.exit(1);
    }
})();
