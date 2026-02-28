import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CognitionTaskDag, CognitionTaskNode } from '../src/planner/dag-compiler.js';
import type { PackagedTaskDag } from '../src/planner/task-packager.js';

type DispatchRequest = PackagedTaskDag['requests'][number];

type DispatchBlockedJournalEntry = {
    kind: 'task_blocked';
    taskId: string;
    recommendationId: string | null;
    from: string;
    target: string | null;
    reason: string;
    policyGate: Record<string, unknown> | null;
    context: Record<string, unknown>;
    createdAt: number;
};

export type DispatchBuildResult = {
    dispatchEntries: DispatchRequest[];
    blockedEntries: DispatchBlockedJournalEntry[];
    stats: {
        requestCount: number;
        dispatchCount: number;
        blockedCount: number;
        blockedPendingCount: number;
    };
};

type DispatchArtifactsInput = {
    taskDagPath: string;
    taskPackagePath: string;
    journalPath: string;
    reportPath: string;
    now?: () => number;
};

type DispatchArtifactsResult = {
    report: Record<string, unknown>;
    dispatchCount: number;
    blockedCount: number;
    appendedEntries: number;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');

const DEFAULT_DAG_PATH = path.join(REPO_ROOT, 'skills', 'state', 'cognition-task-dag.json');
const DEFAULT_PACKAGE_PATH = path.join(REPO_ROOT, 'reports', 'cognition-task-package.json');
const DEFAULT_JOURNAL_PATH = path.join(REPO_ROOT, 'swarm-protocol', 'state', 'tasks.journal.jsonl');
const DEFAULT_REPORT_PATH = path.join(REPO_ROOT, 'cognition-core', 'reports', 'cognition-dispatch.report.json');

function printHelp() {
    console.log(`Cognition Core swarm dispatch bridge

Usage:
  tsx cognition-core/scripts/dispatch.ts [options]

Options:
  --task-dag <path>       Task DAG JSON path (default: skills/state/cognition-task-dag.json)
  --package <path>        Task package JSON path (default: reports/cognition-task-package.json)
  --journal <path>        Task journal JSONL path (default: swarm-protocol/state/tasks.journal.jsonl)
  --report <path>         Dispatch report output path (default: cognition-core/reports/cognition-dispatch.report.json)
  -h, --help              Show help
`);
}

function parseArgs(argv: string[]) {
    const parsed = {
        help: false,
        taskDagPath: DEFAULT_DAG_PATH,
        taskPackagePath: DEFAULT_PACKAGE_PATH,
        journalPath: DEFAULT_JOURNAL_PATH,
        reportPath: DEFAULT_REPORT_PATH
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];

        if (token === '--help' || token === '-h') {
            parsed.help = true;
            continue;
        }

        const value = argv[index + 1];
        if (!value || value.startsWith('--')) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--task-dag') {
            parsed.taskDagPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }

        if (token === '--package') {
            parsed.taskPackagePath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }

        if (token === '--journal') {
            parsed.journalPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }

        if (token === '--report') {
            parsed.reportPath = path.resolve(process.cwd(), value);
            index += 1;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return parsed;
}

function ensureDir(filePath: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJson(filePath: string): unknown {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath: string, payload: unknown) {
    ensureDir(filePath);
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function appendJsonl(filePath: string, entries: unknown[]) {
    if (entries.length === 0) return;
    ensureDir(filePath);
    const lines = entries.map((entry) => JSON.stringify(entry)).join('\n');
    fs.appendFileSync(filePath, `${lines}\n`, 'utf8');
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

function normalizeApprovalStatus(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    return normalized || null;
}

function toPolicyGateRecord(value: unknown): Record<string, unknown> | null {
    if (!isRecord(value)) return null;
    return cloneValue(value);
}

function isPendingApproval(policyGate: Record<string, unknown> | null): boolean {
    if (!policyGate) return false;

    const requiresHumanApproval = policyGate.requiresHumanApproval === true;
    if (!requiresHumanApproval) return false;

    const approvalStatus = normalizeApprovalStatus(policyGate.approvalStatus);
    if (approvalStatus === 'pending' || approvalStatus === 'required' || approvalStatus === 'awaiting_approval') {
        return true;
    }

    const gatePassed = policyGate.gatePassed === true;
    return !gatePassed && approvalStatus !== 'approved' && approvalStatus !== 'not_required';
}

function enrichRequestContext(
    request: DispatchRequest,
    taskNode: CognitionTaskNode | null
): Record<string, unknown> {
    const originalContext = isRecord(request.context) ? cloneValue(request.context) : {};

    const recommendationId = typeof originalContext.recommendationId === 'string'
        ? originalContext.recommendationId
        : taskNode?.recommendationId ?? null;

    const successCriteria = Array.isArray(originalContext.successCriteria)
        ? cloneValue(originalContext.successCriteria)
        : cloneValue(taskNode?.successCriteria ?? []);

    const rollbackPlan = isRecord(originalContext.rollbackPlan)
        ? cloneValue(originalContext.rollbackPlan)
        : cloneValue(taskNode?.rollbackPlan ?? null);

    const policyGate = isRecord(originalContext.policyGate)
        ? cloneValue(originalContext.policyGate)
        : cloneValue(taskNode?.policyGate ?? null);

    return {
        ...originalContext,
        recommendationId,
        successCriteria,
        rollbackPlan,
        policyGate
    };
}

function buildBlockedEntry(input: {
    taskId: string;
    recommendationId: string | null;
    from: string;
    target: string | null;
    reason: string;
    policyGate: Record<string, unknown> | null;
    taskNode: CognitionTaskNode | null;
    requestContext: Record<string, unknown> | null;
    createdAt: number;
}): DispatchBlockedJournalEntry {
    const context = {
        planner: 'cognition-core/dispatch',
        recommendationId: input.recommendationId,
        dependencies: cloneValue(input.taskNode?.dependencies ?? []),
        successCriteria: cloneValue(input.taskNode?.successCriteria ?? input.requestContext?.successCriteria ?? []),
        rollbackPlan: cloneValue(input.taskNode?.rollbackPlan ?? input.requestContext?.rollbackPlan ?? null),
        policyGate: cloneValue(input.policyGate)
    };

    return {
        kind: 'task_blocked',
        taskId: input.taskId,
        recommendationId: input.recommendationId,
        from: input.from,
        target: input.target,
        reason: input.reason,
        policyGate: cloneValue(input.policyGate),
        context,
        createdAt: input.createdAt
    };
}

export function buildDispatchJournalEntries(
    taskDag: CognitionTaskDag,
    taskPackage: PackagedTaskDag,
    options: {
        blockedCreatedAtBase?: number;
    } = {}
): DispatchBuildResult {
    if (!Array.isArray(taskDag.tasks)) {
        throw new Error('Task DAG is missing tasks[]');
    }

    if (!Array.isArray(taskPackage.requests) || !Array.isArray(taskPackage.blocked)) {
        throw new Error('Task package is missing requests[]/blocked[]');
    }

    const tasksById = new Map<string, CognitionTaskNode>(
        taskDag.tasks.map((task) => [task.taskId, task])
    );

    const blockedCreatedAtBase = Number.isFinite(Number(options.blockedCreatedAtBase))
        ? Number(options.blockedCreatedAtBase)
        : Date.now();

    const dispatchEntries: DispatchRequest[] = [];
    const blockedEntries: DispatchBlockedJournalEntry[] = [];
    const blockedTaskIds = new Set<string>();

    for (const request of taskPackage.requests) {
        const taskNode = tasksById.get(request.id) ?? null;
        const enrichedContext = enrichRequestContext(request, taskNode);
        const policyGate = toPolicyGateRecord(enrichedContext.policyGate);

        if (isPendingApproval(policyGate)) {
            const blocked = buildBlockedEntry({
                taskId: request.id,
                recommendationId: typeof enrichedContext.recommendationId === 'string'
                    ? enrichedContext.recommendationId
                    : taskNode?.recommendationId ?? null,
                from: request.from,
                target: request.target ?? null,
                reason: 'awaiting_human_approval',
                policyGate,
                taskNode,
                requestContext: enrichedContext,
                createdAt: blockedCreatedAtBase + blockedEntries.length
            });
            blockedEntries.push(blocked);
            blockedTaskIds.add(request.id);
            continue;
        }

        dispatchEntries.push({
            ...request,
            context: enrichedContext
        });
    }

    for (const blocked of taskPackage.blocked) {
        if (blockedTaskIds.has(blocked.taskId)) {
            continue;
        }

        const taskNode = tasksById.get(blocked.taskId) ?? null;
        const policyGate = toPolicyGateRecord(blocked.policyGate ?? taskNode?.policyGate ?? null);

        const blockedEntry = buildBlockedEntry({
            taskId: blocked.taskId,
            recommendationId: blocked.recommendationId,
            from: 'agent:cognition-core',
            target: null,
            reason: blocked.reason,
            policyGate,
            taskNode,
            requestContext: null,
            createdAt: blockedCreatedAtBase + blockedEntries.length
        });

        blockedEntries.push(blockedEntry);
        blockedTaskIds.add(blocked.taskId);
    }

    return {
        dispatchEntries,
        blockedEntries,
        stats: {
            requestCount: taskPackage.requests.length,
            dispatchCount: dispatchEntries.length,
            blockedCount: blockedEntries.length,
            blockedPendingCount: blockedEntries.filter((entry) => entry.reason === 'awaiting_human_approval').length
        }
    };
}

function sha256(filePath: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(fs.readFileSync(filePath));
    return hash.digest('hex');
}

export function dispatchArtifacts(input: DispatchArtifactsInput): DispatchArtifactsResult {
    const now = typeof input.now === 'function' ? input.now : Date.now;

    const taskDagRaw = readJson(input.taskDagPath);
    const taskPackageRaw = readJson(input.taskPackagePath);

    const taskDag = taskDagRaw as CognitionTaskDag;
    const taskPackage = taskPackageRaw as PackagedTaskDag;

    const buildResult = buildDispatchJournalEntries(taskDag, taskPackage, {
        blockedCreatedAtBase: now()
    });

    const journalEntries = [
        ...buildResult.dispatchEntries,
        ...buildResult.blockedEntries
    ];

    appendJsonl(input.journalPath, journalEntries);

    const report = {
        version: 1,
        generatedAt: new Date(now()).toISOString(),
        command: 'cognition-core/scripts/dispatch.ts',
        inputs: {
            taskDagPath: input.taskDagPath,
            taskDagSha256: sha256(input.taskDagPath),
            taskPackagePath: input.taskPackagePath,
            taskPackageSha256: sha256(input.taskPackagePath)
        },
        outputs: {
            journalPath: input.journalPath,
            reportPath: input.reportPath
        },
        stats: {
            dagTaskCount: Array.isArray(taskDag.tasks) ? taskDag.tasks.length : 0,
            packageRequestCount: buildResult.stats.requestCount,
            dispatchCount: buildResult.stats.dispatchCount,
            blockedCount: buildResult.stats.blockedCount,
            blockedPendingCount: buildResult.stats.blockedPendingCount,
            appendedEntries: journalEntries.length
        },
        dispatchedTaskIds: buildResult.dispatchEntries.map((entry) => entry.id),
        blockedTaskIds: buildResult.blockedEntries.map((entry) => entry.taskId)
    };

    writeJson(input.reportPath, report);

    return {
        report,
        dispatchCount: buildResult.stats.dispatchCount,
        blockedCount: buildResult.stats.blockedCount,
        appendedEntries: journalEntries.length
    };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    try {
        const args = parseArgs(process.argv.slice(2));

        if (args.help) {
            printHelp();
            process.exit(0);
        }

        const result = dispatchArtifacts({
            taskDagPath: args.taskDagPath,
            taskPackagePath: args.taskPackagePath,
            journalPath: args.journalPath,
            reportPath: args.reportPath
        });

        console.log(
            `[cognition-dispatch] dispatched=${result.dispatchCount} blocked=${result.blockedCount} appended=${result.appendedEntries}`
        );
    } catch (error) {
        console.error(`[cognition-dispatch] failed: ${(error as Error).message}`);
        process.exit(1);
    }
}
