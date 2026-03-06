import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CognitionTaskDag, CognitionTaskNode } from '../src/planner/dag-compiler.js';
import type { PackagedTaskDag } from '../src/planner/task-packager.js';
import { buildTaskRequest } from '../../swarm-protocol/index.js';

type DispatchRequest = PackagedTaskDag['requests'][number];

type DispatchBlockedSource = 'dispatch_request' | 'task_package_blocked';

type DispatchApprovalFollowUpRequest = DispatchRequest;

type DispatchApprovalFlowMetadata = {
    requiresHumanApproval: boolean;
    approvalStatus: string | null;
    gatePassed: boolean | null;
    approvalMarkerPresent: boolean | null;
    riskTier: string | null;
    requiredApprovers: string[];
};

type DispatchTraceabilityMetadata = {
    blockedTraceId: string;
    releaseKey: string;
    releaseReady: boolean;
    releaseTemplatePresent: boolean;
    releaseRequestId: string;
};

type DispatchFollowUpMetadata = {
    requiredApprovers: string[];
    approverTargets: string[];
    ticket: string | null;
};

type DispatchBlockedJournalEntry = {
    kind: 'task_blocked';
    taskId: string;
    recommendationId: string | null;
    from: string;
    target: string | null;
    reason: string;
    blockedSource: DispatchBlockedSource;
    approvalFlow: DispatchApprovalFlowMetadata;
    followUp: DispatchFollowUpMetadata;
    traceability: DispatchTraceabilityMetadata;
    policyGate: Record<string, unknown> | null;
    context: Record<string, unknown>;
    createdAt: number;
};

export type DispatchBuildResult = {
    dispatchEntries: DispatchRequest[];
    approvalFollowUpEntries: DispatchApprovalFollowUpRequest[];
    blockedEntries: DispatchBlockedJournalEntry[];
    releasedAfterApprovalTaskIds: string[];
    stats: {
        requestCount: number;
        dispatchCount: number;
        approvalFollowUpCount: number;
        blockedCount: number;
        blockedPendingCount: number;
        blockedByReason: Record<string, number>;
        blockedByApprovalStatus: Record<string, number>;
        blockedBySource: Record<string, number>;
        blockedApprovalRequiredCount: number;
        releasedAfterApprovalCount: number;
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

function normalizeOptionalString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

function extractPolicyPassthrough(policyGate: Record<string, unknown> | null): Record<string, unknown> | null {
    if (!policyGate || !isRecord(policyGate.passthrough)) {
        return null;
    }

    return policyGate.passthrough;
}

function extractRequiredApprovers(policyGate: Record<string, unknown> | null): string[] {
    const passthrough = extractPolicyPassthrough(policyGate);
    if (!passthrough) return [];

    const requiredApprovers = passthrough.requiredApprovers;
    if (!Array.isArray(requiredApprovers)) return [];

    return Array.from(new Set(
        requiredApprovers
            .map((value) => normalizeOptionalString(value))
            .filter((value): value is string => Boolean(value))
    )).sort((left, right) => left.localeCompare(right));
}

function extractApprovalTicket(policyGate: Record<string, unknown> | null): string | null {
    const passthrough = extractPolicyPassthrough(policyGate);
    if (!passthrough) return null;
    return normalizeOptionalString(passthrough.ticket);
}

function normalizeStringList(values: unknown): string[] {
    if (!Array.isArray(values)) return [];

    return Array.from(new Set(
        values
            .map((value) => normalizeOptionalString(value))
            .filter((value): value is string => Boolean(value))
    )).sort((left, right) => left.localeCompare(right));
}

function toApprovalFlowMetadata(
    policyGate: Record<string, unknown> | null,
    reason: string
): DispatchApprovalFlowMetadata {
    const normalizedStatus = normalizeApprovalStatus(policyGate?.approvalStatus);
    const fallbackStatus = reason === 'awaiting_human_approval' ? 'pending' : null;

    return {
        requiresHumanApproval: policyGate?.requiresHumanApproval === true,
        approvalStatus: normalizedStatus ?? fallbackStatus,
        gatePassed: policyGate && typeof policyGate.gatePassed === 'boolean'
            ? policyGate.gatePassed
            : null,
        approvalMarkerPresent: policyGate && typeof policyGate.approvalMarkerPresent === 'boolean'
            ? policyGate.approvalMarkerPresent
            : null,
        riskTier: normalizeOptionalString(policyGate?.riskTier),
        requiredApprovers: extractRequiredApprovers(policyGate)
    };
}

function isApprovalReleaseReady(policyGate: Record<string, unknown> | null): boolean {
    if (!policyGate) return false;
    if (policyGate.requiresHumanApproval !== true) return false;

    const approvalStatus = normalizeApprovalStatus(policyGate.approvalStatus);
    const gatePassed = policyGate.gatePassed === true;

    return gatePassed && approvalStatus === 'approved';
}

function incrementCount(counter: Record<string, number>, key: string) {
    counter[key] = (counter[key] ?? 0) + 1;
}

function sortCounter(counter: Record<string, number>): Record<string, number> {
    return Object.fromEntries(
        Object.entries(counter).sort(([left], [right]) => left.localeCompare(right))
    );
}

function deterministicUuid(seed: string): string {
    const hash = crypto.createHash('sha1').update(seed).digest();
    const bytes = Uint8Array.from(hash.subarray(0, 16));
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = [...bytes].map((part) => part.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function normalizeApproverTarget(approver: string): string {
    const trimmed = approver.trim();
    if (!trimmed) return 'agent:ops';
    if (trimmed.startsWith('agent:')) return trimmed;

    const slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9:_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    if (slug.startsWith('agent:')) return slug;
    return `agent:${slug || 'ops'}`;
}

type BlockedEntriesSummary = {
    byReason: Record<string, number>;
    byApprovalStatus: Record<string, number>;
    bySource: Record<string, number>;
    approvalRequiredCount: number;
    pendingTaskIds: string[];
    requiredApprovers: Array<{
        approver: string;
        blockedTaskCount: number;
    }>;
};

function summarizeBlockedEntries(blockedEntries: DispatchBlockedJournalEntry[]): BlockedEntriesSummary {
    const byReason: Record<string, number> = {};
    const byApprovalStatus: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const pendingTaskIds: string[] = [];
    const requiredApprovers: Record<string, number> = {};

    let approvalRequiredCount = 0;

    for (const entry of blockedEntries) {
        incrementCount(byReason, entry.reason || 'unknown');
        incrementCount(bySource, entry.blockedSource || 'unknown');

        const approvalStatus = entry.approvalFlow.approvalStatus ?? 'unknown';
        incrementCount(byApprovalStatus, approvalStatus);

        if (entry.approvalFlow.requiresHumanApproval) {
            approvalRequiredCount += 1;
        }

        if (entry.reason === 'awaiting_human_approval' || approvalStatus === 'pending') {
            pendingTaskIds.push(entry.taskId);
        }

        for (const approver of entry.approvalFlow.requiredApprovers) {
            incrementCount(requiredApprovers, approver);
        }
    }

    return {
        byReason: sortCounter(byReason),
        byApprovalStatus: sortCounter(byApprovalStatus),
        bySource: sortCounter(bySource),
        approvalRequiredCount,
        pendingTaskIds: Array.from(new Set(pendingTaskIds)).sort((left, right) => left.localeCompare(right)),
        requiredApprovers: Object.entries(requiredApprovers)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([approver, blockedTaskCount]) => ({ approver, blockedTaskCount }))
    };
}

function resolveFollowUpAssignments(blocked: DispatchBlockedJournalEntry): Array<{ approver: string; target: string }> {
    const assignments: Array<{ approver: string; target: string }> = [];

    const approverLabels = blocked.followUp.requiredApprovers.length > 0
        ? blocked.followUp.requiredApprovers
        : blocked.approvalFlow.requiredApprovers;

    for (let index = 0; index < approverLabels.length; index += 1) {
        const approver = approverLabels[index];
        const target = blocked.followUp.approverTargets[index] ?? normalizeApproverTarget(approver);
        assignments.push({ approver, target });
    }

    if (assignments.length === 0 && blocked.followUp.approverTargets.length > 0) {
        for (const target of blocked.followUp.approverTargets) {
            assignments.push({
                approver: target.startsWith('agent:') ? target.slice('agent:'.length) : target,
                target
            });
        }
    }

    if (assignments.length === 0) {
        assignments.push({ approver: 'team-lead', target: 'agent:team-lead' });
    }

    const seen = new Set<string>();
    return assignments.filter((assignment) => {
        const key = `${assignment.approver}:${assignment.target}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function buildApprovalFollowUpRequests(
    blockedEntries: DispatchBlockedJournalEntry[],
    createdAtBase: number
): DispatchApprovalFollowUpRequest[] {
    const requests: DispatchApprovalFollowUpRequest[] = [];
    const seen = new Set<string>();

    for (const blocked of blockedEntries) {
        if (!blocked.approvalFlow.requiresHumanApproval) continue;
        if (blocked.approvalFlow.approvalStatus !== 'pending') continue;

        const assignments = resolveFollowUpAssignments(blocked);

        for (const assignment of assignments) {
            const key = `${blocked.taskId}:${assignment.target}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const recommendationLabel = blocked.recommendationId ?? blocked.taskId;
            const riskTier = blocked.approvalFlow.riskTier ?? 'unknown';

            requests.push(buildTaskRequest({
                id: deterministicUuid(`approval-followup:${blocked.taskId}:${assignment.target}`),
                from: 'agent:cognition-core',
                target: assignment.target,
                priority: riskTier === 'critical' || riskTier === 'high' ? 'high' : 'normal',
                task: `[APPROVAL] Review ${recommendationLabel} (${blocked.taskId})`,
                context: {
                    planner: 'cognition-core/dispatch-approval-followup',
                    recommendationId: blocked.recommendationId,
                    blockedTaskId: blocked.taskId,
                    approvalFlow: blocked.approvalFlow,
                    blockedReason: blocked.reason,
                    approver: assignment.approver,
                    approvalTicket: blocked.followUp.ticket,
                    followUp: blocked.followUp,
                    traceability: blocked.traceability
                },
                constraints: ['approval-review-only', 'no-execution-without-approval'],
                createdAt: createdAtBase + requests.length
            }));
        }
    }

    return requests;
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

    const requestPolicyGate = isRecord(originalContext.policyGate)
        ? cloneValue(originalContext.policyGate)
        : null;
    const taskPolicyGate = isRecord(taskNode?.policyGate)
        ? cloneValue(taskNode.policyGate)
        : null;

    const policyGate = requestPolicyGate || taskPolicyGate
        ? {
            ...(taskPolicyGate ?? {}),
            ...(requestPolicyGate ?? {})
        }
        : null;

    return {
        ...originalContext,
        recommendationId,
        successCriteria,
        rollbackPlan,
        policyGate
    };
}

function getBlockedMetadataRecord(blocked: PackagedTaskDag['blocked'][number] | null): Record<string, unknown> | null {
    if (!blocked || !isRecord((blocked as { metadata?: unknown }).metadata)) {
        return null;
    }

    return (blocked as { metadata: Record<string, unknown> }).metadata;
}

function getBlockedMetadataSection(
    blocked: PackagedTaskDag['blocked'][number] | null,
    key: 'followUp' | 'traceability' | 'releaseTemplate'
): Record<string, unknown> | null {
    const metadata = getBlockedMetadataRecord(blocked);
    if (!metadata || !isRecord(metadata[key])) {
        return null;
    }

    return metadata[key] as Record<string, unknown>;
}

function hasBlockedReleaseTemplate(blocked: PackagedTaskDag['blocked'][number] | null): boolean {
    return Boolean(getBlockedMetadataSection(blocked, 'releaseTemplate'));
}

function extractFollowUpMetadata(
    policyGate: Record<string, unknown> | null,
    approvalFlow: DispatchApprovalFlowMetadata,
    blocked: PackagedTaskDag['blocked'][number] | null
): DispatchFollowUpMetadata {
    const metadata = getBlockedMetadataSection(blocked, 'followUp');

    const requiredApprovers = metadata
        ? normalizeStringList(metadata.requiredApprovers)
        : [];

    const approverTargets = metadata
        ? normalizeStringList(metadata.approverTargets)
        : [];

    return {
        requiredApprovers: requiredApprovers.length > 0
            ? requiredApprovers
            : approvalFlow.requiredApprovers,
        approverTargets: approverTargets.length > 0
            ? approverTargets
            : approvalFlow.requiredApprovers.map((approver) => normalizeApproverTarget(approver)),
        ticket: metadata
            ? normalizeOptionalString(metadata.ticket) ?? extractApprovalTicket(policyGate)
            : extractApprovalTicket(policyGate)
    };
}

function extractTraceabilityMetadata(input: {
    taskId: string;
    recommendationId: string | null;
    reason: string;
    policyGate: Record<string, unknown> | null;
    blocked: PackagedTaskDag['blocked'][number] | null;
}): DispatchTraceabilityMetadata {
    const metadata = getBlockedMetadataSection(input.blocked, 'traceability');
    const releaseTemplatePresent = hasBlockedReleaseTemplate(input.blocked);

    const defaultReleaseKey = `release:${input.taskId}:${input.recommendationId ?? 'unknown'}`;
    const releaseKey = metadata
        ? normalizeOptionalString(metadata.releaseKey) ?? defaultReleaseKey
        : defaultReleaseKey;

    const blockedTraceId = metadata
        ? normalizeOptionalString(metadata.blockedTraceId) ?? `blocked:${input.taskId}`
        : `blocked:${input.taskId}`;

    const releaseReady = metadata && typeof metadata.releaseReady === 'boolean'
        ? metadata.releaseReady
        : input.reason === 'awaiting_human_approval' && isApprovalReleaseReady(input.policyGate);

    return {
        blockedTraceId,
        releaseKey,
        releaseReady,
        releaseTemplatePresent,
        releaseRequestId: deterministicUuid(`${releaseKey}:dispatch`)
    };
}

function toDispatchPriority(
    value: unknown,
    fallback: DispatchRequest['priority']
): DispatchRequest['priority'] {
    if (value === 'critical' || value === 'high' || value === 'normal' || value === 'low') {
        return value;
    }

    return fallback;
}

function defaultTargetForTask(taskNode: CognitionTaskNode | null): string {
    if (!taskNode) return 'agent:ops';
    if (taskNode.riskTier === 'critical') return 'agent:ops:critical';
    if (taskNode.riskTier === 'high') return 'agent:ops:high-risk';
    return 'agent:ops';
}

function defaultPriorityForTask(taskNode: CognitionTaskNode | null): DispatchRequest['priority'] {
    if (!taskNode) return 'normal';
    if (taskNode.priority === 'P0') return 'critical';
    if (taskNode.priority === 'P1') return 'high';
    if (taskNode.priority === 'P2') return 'normal';
    return 'low';
}

function buildDispatchEntryFromBlockedTemplate(input: {
    blocked: PackagedTaskDag['blocked'][number];
    taskNode: CognitionTaskNode | null;
    policyGate: Record<string, unknown> | null;
    createdAt: number;
}): DispatchRequest {
    const releaseTemplate = getBlockedMetadataSection(input.blocked, 'releaseTemplate');

    const fallbackPriority = defaultPriorityForTask(input.taskNode);
    const from = releaseTemplate
        ? normalizeOptionalString(releaseTemplate.from) ?? 'agent:cognition-core'
        : 'agent:cognition-core';
    const target = releaseTemplate
        ? normalizeOptionalString(releaseTemplate.target) ?? defaultTargetForTask(input.taskNode)
        : defaultTargetForTask(input.taskNode);
    const priority = releaseTemplate
        ? toDispatchPriority(releaseTemplate.priority, fallbackPriority)
        : fallbackPriority;
    const task = releaseTemplate
        ? normalizeOptionalString(releaseTemplate.task) ?? `[APPROVED] ${input.blocked.recommendationId}`
        : `[APPROVED] ${input.blocked.recommendationId}`;

    const releaseContext = releaseTemplate && isRecord(releaseTemplate.context)
        ? cloneValue(releaseTemplate.context)
        : {};

    const traceability = extractTraceabilityMetadata({
        taskId: input.blocked.taskId,
        recommendationId: input.blocked.recommendationId,
        reason: input.blocked.reason,
        policyGate: input.policyGate,
        blocked: input.blocked
    });

    const context = {
        ...releaseContext,
        recommendationId: typeof releaseContext.recommendationId === 'string'
            ? releaseContext.recommendationId
            : input.blocked.recommendationId,
        policyGate: input.policyGate ?? releaseContext.policyGate ?? null,
        approvalRelease: {
            releasedFromBlocked: true,
            blockedReason: input.blocked.reason,
            blockedSource: 'task_package_blocked',
            blockedTraceId: traceability.blockedTraceId,
            releaseKey: traceability.releaseKey,
            releaseRequestId: traceability.releaseRequestId
        }
    };

    const constraints = releaseTemplate && Array.isArray(releaseTemplate.constraints)
        ? releaseTemplate.constraints
            .filter((value) => typeof value === 'string')
            .map((value) => value.trim())
            .filter(Boolean)
        : [];

    return buildTaskRequest({
        id: input.blocked.taskId,
        from,
        target,
        priority,
        task,
        context,
        constraints: constraints.length > 0 ? constraints : undefined,
        createdAt: input.createdAt
    });
}

function buildBlockedEntry(input: {
    taskId: string;
    recommendationId: string | null;
    from: string;
    target: string | null;
    reason: string;
    blockedSource: DispatchBlockedSource;
    policyGate: Record<string, unknown> | null;
    taskNode: CognitionTaskNode | null;
    requestContext: Record<string, unknown> | null;
    packagedBlocked: PackagedTaskDag['blocked'][number] | null;
    createdAt: number;
}): DispatchBlockedJournalEntry {
    const approvalFlow = toApprovalFlowMetadata(input.policyGate, input.reason);
    const followUp = extractFollowUpMetadata(input.policyGate, approvalFlow, input.packagedBlocked);
    const traceability = extractTraceabilityMetadata({
        taskId: input.taskId,
        recommendationId: input.recommendationId,
        reason: input.reason,
        policyGate: input.policyGate,
        blocked: input.packagedBlocked
    });

    const context = {
        planner: 'cognition-core/dispatch',
        blockedSource: input.blockedSource,
        recommendationId: input.recommendationId,
        dependencies: cloneValue(input.taskNode?.dependencies ?? input.packagedBlocked?.dependencies ?? []),
        successCriteria: cloneValue(input.taskNode?.successCriteria ?? input.requestContext?.successCriteria ?? []),
        rollbackPlan: cloneValue(input.taskNode?.rollbackPlan ?? input.requestContext?.rollbackPlan ?? null),
        policyGate: cloneValue(input.policyGate),
        approvalFlow: cloneValue(approvalFlow),
        followUp: cloneValue(followUp),
        traceability: cloneValue(traceability)
    };

    return {
        kind: 'task_blocked',
        taskId: input.taskId,
        recommendationId: input.recommendationId,
        from: input.from,
        target: input.target,
        reason: input.reason,
        blockedSource: input.blockedSource,
        approvalFlow,
        followUp,
        traceability,
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
        approvalFollowUpCreatedAtBase?: number;
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
    const dispatchedTaskIds = new Set<string>();
    const releasedAfterApprovalTaskIds: string[] = [];

    for (const request of taskPackage.requests) {
        if (dispatchedTaskIds.has(request.id)) continue;

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
                blockedSource: 'dispatch_request',
                policyGate,
                taskNode,
                requestContext: enrichedContext,
                packagedBlocked: null,
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
        dispatchedTaskIds.add(request.id);
    }

    for (const blocked of taskPackage.blocked) {
        if (blockedTaskIds.has(blocked.taskId) || dispatchedTaskIds.has(blocked.taskId)) {
            continue;
        }

        const taskNode = tasksById.get(blocked.taskId) ?? null;
        const policyGate = toPolicyGateRecord(blocked.policyGate ?? taskNode?.policyGate ?? null);

        const approvalReleased = blocked.reason === 'awaiting_human_approval' && isApprovalReleaseReady(policyGate);
        if (approvalReleased) {
            const releaseRequest = buildDispatchEntryFromBlockedTemplate({
                blocked,
                taskNode,
                policyGate,
                createdAt: blockedCreatedAtBase + dispatchEntries.length
            });

            const enrichedReleaseContext = enrichRequestContext(releaseRequest, taskNode);
            dispatchEntries.push({
                ...releaseRequest,
                context: enrichedReleaseContext
            });
            dispatchedTaskIds.add(blocked.taskId);
            releasedAfterApprovalTaskIds.push(blocked.taskId);
            continue;
        }

        const blockedEntry = buildBlockedEntry({
            taskId: blocked.taskId,
            recommendationId: blocked.recommendationId,
            from: 'agent:cognition-core',
            target: null,
            reason: blocked.reason,
            blockedSource: 'task_package_blocked',
            policyGate,
            taskNode,
            requestContext: null,
            packagedBlocked: blocked,
            createdAt: blockedCreatedAtBase + blockedEntries.length
        });

        blockedEntries.push(blockedEntry);
        blockedTaskIds.add(blocked.taskId);
    }

    const blockedSummary = summarizeBlockedEntries(blockedEntries);
    const approvalFollowUpCreatedAtBase = Number.isFinite(Number(options.approvalFollowUpCreatedAtBase))
        ? Number(options.approvalFollowUpCreatedAtBase)
        : blockedCreatedAtBase + 10_000;
    const approvalFollowUpEntries = buildApprovalFollowUpRequests(
        blockedEntries,
        approvalFollowUpCreatedAtBase
    );

    return {
        dispatchEntries,
        approvalFollowUpEntries,
        blockedEntries,
        releasedAfterApprovalTaskIds,
        stats: {
            requestCount: taskPackage.requests.length,
            dispatchCount: dispatchEntries.length,
            approvalFollowUpCount: approvalFollowUpEntries.length,
            blockedCount: blockedEntries.length,
            blockedPendingCount: blockedEntries.filter((entry) => entry.reason === 'awaiting_human_approval').length,
            blockedByReason: blockedSummary.byReason,
            blockedByApprovalStatus: blockedSummary.byApprovalStatus,
            blockedBySource: blockedSummary.bySource,
            blockedApprovalRequiredCount: blockedSummary.approvalRequiredCount,
            releasedAfterApprovalCount: releasedAfterApprovalTaskIds.length
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

    const blockedCreatedAtBase = now();
    const buildResult = buildDispatchJournalEntries(taskDag, taskPackage, {
        blockedCreatedAtBase,
        approvalFollowUpCreatedAtBase: blockedCreatedAtBase + 10_000
    });

    const journalEntries = [
        ...buildResult.dispatchEntries,
        ...buildResult.approvalFollowUpEntries,
        ...buildResult.blockedEntries
    ];

    appendJsonl(input.journalPath, journalEntries);

    const blockedSummary = summarizeBlockedEntries(buildResult.blockedEntries);

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
            approvalFollowUpCount: buildResult.stats.approvalFollowUpCount,
            blockedCount: buildResult.stats.blockedCount,
            blockedPendingCount: buildResult.stats.blockedPendingCount,
            blockedApprovalRequiredCount: buildResult.stats.blockedApprovalRequiredCount,
            releasedAfterApprovalCount: buildResult.stats.releasedAfterApprovalCount,
            blockedByReason: buildResult.stats.blockedByReason,
            blockedByApprovalStatus: buildResult.stats.blockedByApprovalStatus,
            blockedBySource: buildResult.stats.blockedBySource,
            appendedEntries: journalEntries.length
        },
        compatibility: {
            artifactSchemaVersion: 1,
            backwardCompatibleWith: [1],
            notes: [
                'Existing version-1 fields are preserved; new lane04 metadata is additive.',
                'blockedEntries now include followUp + traceability contracts for approval routing and release traceability.'
            ]
        },
        dispatchedTaskIds: buildResult.dispatchEntries.map((entry) => entry.id),
        blockedTaskIds: buildResult.blockedEntries.map((entry) => entry.taskId),
        releasedAfterApprovalTaskIds: buildResult.releasedAfterApprovalTaskIds,
        approvalFlow: {
            pendingTaskIds: blockedSummary.pendingTaskIds,
            pendingCount: blockedSummary.pendingTaskIds.length,
            approvalRequiredCount: blockedSummary.approvalRequiredCount,
            byApprovalStatus: blockedSummary.byApprovalStatus,
            requiredApprovers: blockedSummary.requiredApprovers,
            followUpRequestCount: buildResult.approvalFollowUpEntries.length,
            followUpTargets: Array.from(new Set(buildResult.approvalFollowUpEntries.map((entry) => entry.target))).sort((left, right) => left.localeCompare(right)),
            releasedAfterApprovalTaskIds: buildResult.releasedAfterApprovalTaskIds,
            releasedAfterApprovalCount: buildResult.releasedAfterApprovalTaskIds.length
        },
        approvalFollowUpEntries: buildResult.approvalFollowUpEntries.map((entry) => ({
            taskId: entry.id,
            target: entry.target,
            recommendationId: (isRecord(entry.context) && typeof entry.context.recommendationId === 'string')
                ? entry.context.recommendationId
                : null,
            blockedTaskId: (isRecord(entry.context) && typeof entry.context.blockedTaskId === 'string')
                ? entry.context.blockedTaskId
                : null,
            blockedTraceId: (isRecord(entry.context) && isRecord(entry.context.traceability) && typeof entry.context.traceability.blockedTraceId === 'string')
                ? entry.context.traceability.blockedTraceId
                : null,
            releaseRequestId: (isRecord(entry.context) && isRecord(entry.context.traceability) && typeof entry.context.traceability.releaseRequestId === 'string')
                ? entry.context.traceability.releaseRequestId
                : null
        })),
        blockedEntries: buildResult.blockedEntries.map((entry) => ({
            taskId: entry.taskId,
            recommendationId: entry.recommendationId,
            reason: entry.reason,
            blockedSource: entry.blockedSource,
            approvalFlow: entry.approvalFlow,
            followUp: entry.followUp,
            traceability: entry.traceability
        }))
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
