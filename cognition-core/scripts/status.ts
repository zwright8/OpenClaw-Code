import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    FileTaskStore,
    listQueue,
    summarizeTaskRecords
} from '../../swarm-protocol/index.js';

interface CliOptions {
    runManifestPath: string;
    ingestPath: string;
    planReportPath: string;
    packagePath: string;
    dispatchReportPath: string;
    dailyReportPath: string;
    storePath: string;
    json: boolean;
    help: boolean;
}

type JsonObject = Record<string, unknown>;

function printHelp(): void {
    console.log(`Show a concise cognition-core + swarm status snapshot

Usage:
  tsx scripts/status.ts [options]

Options:
  --run <path>       Run manifest path (default: cognition-core/reports/cognition-run.json)
  --ingest <path>    Latest ingest artifact path (default: cognition-core/reports/normalized-event-stream.latest.json)
  --plan <path>      Plan report path (default: reports/cognition-plan.report.json)
  --package <path>   Task package path (default: reports/cognition-task-package.json)
  --dispatch <path>  Dispatch report path (default: cognition-core/reports/cognition-dispatch.report.json)
  --daily <path>     Daily report JSON path (default: cognition-core/reports/cognition-daily.json)
  --store <path>     Swarm task journal path (default: swarm-protocol/state/tasks.journal.jsonl)
  --json             Emit machine-readable JSON
  -h, --help         Show help
`);
}

function parseArgs(argv: string[], defaults: Omit<CliOptions, 'help' | 'json'>): CliOptions {
    const options: CliOptions = {
        ...defaults,
        help: false,
        json: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }

        if (token === '--json') {
            options.json = true;
            continue;
        }

        const value = argv[i + 1];
        if (!value) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--run') {
            options.runManifestPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        if (token === '--ingest') {
            options.ingestPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        if (token === '--plan') {
            options.planReportPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        if (token === '--package') {
            options.packagePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        if (token === '--dispatch') {
            options.dispatchReportPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        if (token === '--daily') {
            options.dailyReportPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        if (token === '--store') {
            options.storePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function readJsonIfExists(filePath: string): JsonObject | null {
    if (!fs.existsSync(filePath)) return null;

    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObject;
    } catch {
        return null;
    }
}

function getNumber(value: unknown, fallback = 0): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function getString(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value : fallback;
}

(async () => {
    try {
        const scriptDir = path.dirname(fileURLToPath(import.meta.url));
        const repoRoot = path.resolve(scriptDir, '../..');

        const defaults: Omit<CliOptions, 'help' | 'json'> = {
            runManifestPath: path.join(repoRoot, 'cognition-core/reports/cognition-run.json'),
            ingestPath: path.join(repoRoot, 'cognition-core/reports/normalized-event-stream.latest.json'),
            planReportPath: path.join(repoRoot, 'reports/cognition-plan.report.json'),
            packagePath: path.join(repoRoot, 'reports/cognition-task-package.json'),
            dispatchReportPath: path.join(repoRoot, 'cognition-core/reports/cognition-dispatch.report.json'),
            dailyReportPath: path.join(repoRoot, 'cognition-core/reports/cognition-daily.json'),
            storePath: path.join(repoRoot, 'swarm-protocol/state/tasks.journal.jsonl')
        };

        const options = parseArgs(process.argv.slice(2), defaults);
        if (options.help) {
            printHelp();
            return;
        }

        const runManifest = readJsonIfExists(options.runManifestPath);
        const ingest = readJsonIfExists(options.ingestPath);
        const planReport = readJsonIfExists(options.planReportPath);
        const packaged = readJsonIfExists(options.packagePath);
        const dispatchReport = readJsonIfExists(options.dispatchReportPath);
        const dailyReport = readJsonIfExists(options.dailyReportPath);

        const runResults = Array.isArray(runManifest?.results)
            ? (runManifest?.results as Array<Record<string, unknown>>)
            : [];

        const stageSummary = runResults.map((item) => ({
            stage: getString(item.name, 'unknown'),
            status: getString(item.status, 'unknown')
        }));

        const ingestCounts = ingest?.counts && typeof ingest.counts === 'object'
            ? ingest.counts as Record<string, unknown>
            : {};

        const packagedStats = packaged?.stats && typeof packaged.stats === 'object'
            ? packaged.stats as Record<string, unknown>
            : {};

        const plannerBlocked = Array.isArray(packaged?.blocked) ? packaged.blocked.length : 0;

        const dispatchStats = dispatchReport?.stats && typeof dispatchReport.stats === 'object'
            ? dispatchReport.stats as Record<string, unknown>
            : {};

        const dispatchCount = getNumber(dispatchStats.dispatchCount, getNumber(dispatchStats.dispatched));
        const blockedByDispatch = getNumber(dispatchStats.blockedCount, getNumber(dispatchStats.blockedByPlanner));
        const appendedEntries = getNumber(dispatchStats.appendedEntries);

        const dailySummary = dailyReport?.summary && typeof dailyReport.summary === 'object'
            ? dailyReport.summary as Record<string, unknown>
            : {};

        const taskStore = new FileTaskStore({ filePath: options.storePath });
        const taskRecords = await taskStore.loadRecords();
        const queueSummary = summarizeTaskRecords(taskRecords);
        const approvalQueue = listQueue(taskRecords, {
            approvalsOnly: true,
            limit: 10
        });

        const output = {
            generatedAt: new Date().toISOString(),
            run: {
                generatedAt: runManifest?.generatedAt ?? null,
                stages: stageSummary
            },
            ingest: {
                generatedAt: ingest?.generatedAt ?? null,
                raw: getNumber(ingestCounts.raw),
                deduped: getNumber(ingestCounts.deduped),
                duplicatesRemoved: getNumber(ingestCounts.duplicatesRemoved)
            },
            plan: {
                generatedAt: planReport?.generatedAt ?? null,
                recommendationCount: getNumber((planReport?.stats as Record<string, unknown> | undefined)?.recommendationCount),
                taskCount: getNumber((planReport?.stats as Record<string, unknown> | undefined)?.taskCount),
                packagedTasks: getNumber(packagedStats.packagedTasks),
                blockedTasks: getNumber(packagedStats.blockedTasks),
                blockedApprovals: plannerBlocked
            },
            dispatch: {
                generatedAt: dispatchReport?.generatedAt ?? null,
                dispatched: dispatchCount,
                blocked: blockedByDispatch,
                appendedEntries
            },
            evaluation: {
                generatedAt: dailyReport?.generatedAt ?? null,
                overall: getString(dailySummary.overall, 'unknown'),
                successRate: getNumber(dailySummary.successRate),
                outcomes: getNumber(dailySummary.outcomes)
            },
            swarmQueue: {
                total: queueSummary.total,
                open: queueSummary.open,
                terminal: queueSummary.terminal,
                pendingApprovals: queueSummary.pendingApprovals,
                samplePendingApprovals: approvalQueue.map((item) => ({
                    taskId: item.taskId,
                    target: item.target,
                    updatedAt: item.updatedAt,
                    reason: item.approval?.reason ?? null
                }))
            }
        };

        if (options.json) {
            console.log(JSON.stringify(output, null, 2));
            return;
        }

        console.log('Cognition Core + Swarm Status');
        console.log(`Run: ${output.run.generatedAt ?? 'missing'} | stages=${output.run.stages.length}`);
        if (output.run.stages.length > 0) {
            console.log(`  ${output.run.stages.map((stage) => `${stage.stage}:${stage.status}`).join(' | ')}`);
        }

        console.log(
            `Ingest: raw=${output.ingest.raw} deduped=${output.ingest.deduped} duplicatesRemoved=${output.ingest.duplicatesRemoved}`
        );

        console.log(
            `Plan: recommendations=${output.plan.recommendationCount} tasks=${output.plan.taskCount} packaged=${output.plan.packagedTasks} blocked=${output.plan.blockedTasks}`
        );

        console.log(
            `Dispatch: dispatched=${output.dispatch.dispatched} blocked=${output.dispatch.blocked} appendedEntries=${output.dispatch.appendedEntries}`
        );

        console.log(
            `Evaluation: overall=${output.evaluation.overall} successRate=${output.evaluation.successRate.toFixed(2)} outcomes=${output.evaluation.outcomes}`
        );

        console.log(
            `Blocked approvals: plannerBlocked=${output.plan.blockedApprovals} queuePending=${output.swarmQueue.pendingApprovals}`
        );

        if (output.swarmQueue.samplePendingApprovals.length > 0) {
            console.log('Pending approval sample:');
            for (const pending of output.swarmQueue.samplePendingApprovals) {
                console.log(`  - ${pending.taskId} -> ${pending.target} reason=${pending.reason ?? 'n/a'}`);
            }
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Status failed: ${message}`);
        process.exit(1);
    }
})();
