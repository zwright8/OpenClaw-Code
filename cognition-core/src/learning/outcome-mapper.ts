import type { EvaluationStatus, ExecutionOutcome } from './evaluator.js';

const TERMINAL_OUTCOME_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'timed_out',
    'rejected',
    'transport_error'
]);

type RecommendationLookup = Map<string, string>;

type SourceHint = 'journal' | 'package' | 'generic';

function asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }
    return value as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

function asFiniteNumber(value: unknown): number | undefined {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeStatus(value: unknown, sourceHint: SourceHint): EvaluationStatus {
    const normalized = String(value ?? '').trim().toLowerCase();

    if (!normalized) {
        return sourceHint === 'package' ? 'dispatched' : 'failed';
    }

    if (normalized === 'success') return 'completed';
    if (normalized === 'failure') return 'failed';
    if (normalized === 'timeout' || normalized === 'timedout') return 'timed_out';
    if (normalized === 'approval_pending' || normalized === 'awaiting_human_approval') {
        return 'awaiting_approval';
    }

    return normalized;
}

function recommendationIdFromRow(row: Record<string, unknown>, taskId: string | undefined, recommendationByTaskId: RecommendationLookup): string | undefined {
    const request = asRecord(row.request);
    const requestContext = asRecord(request.context);

    return asString(row.recommendationId)
        ?? asString(requestContext.recommendationId)
        ?? asString(requestContext.sourceRecommendationId)
        ?? (taskId ? recommendationByTaskId.get(taskId) : undefined);
}

function ownerFromRow(row: Record<string, unknown>): string | undefined {
    const request = asRecord(row.request);
    const result = asRecord(row.result);

    return asString(row.owner)
        ?? asString(row.target)
        ?? asString(request.target)
        ?? asString(result.from);
}

function toExecutionOutcome(
    row: Record<string, unknown>,
    recommendationByTaskId: RecommendationLookup,
    sourceHint: SourceHint = 'generic'
): ExecutionOutcome | null {
    const result = asRecord(row.result);

    const taskId = asString(row.taskId)
        ?? asString(row.id)
        ?? asString(result.taskId);

    const recommendationId = recommendationIdFromRow(row, taskId, recommendationByTaskId);

    const rawStatus = row.status
        ?? row.resultStatus
        ?? row.reason
        ?? result.status
        ?? row.result;

    const status = normalizeStatus(rawStatus, sourceHint);

    return {
        taskId,
        recommendationId,
        status,
        owner: ownerFromRow(row),
        attempts: asFiniteNumber(row.attempts),
        createdAt: asFiniteNumber(row.createdAt) ?? asFiniteNumber(asRecord(row.request).createdAt),
        closedAt: asFiniteNumber(row.closedAt)
            ?? asFiniteNumber(row.completedAt)
            ?? asFiniteNumber(result.completedAt)
    } satisfies ExecutionOutcome;
}

export function isTerminalOutcomeStatus(status: string): boolean {
    return TERMINAL_OUTCOME_STATUSES.has(String(status ?? '').trim().toLowerCase());
}

export function extractArray(input: unknown): unknown[] {
    if (Array.isArray(input)) return input;
    if (input && typeof input === 'object') {
        const candidateKeys = ['items', 'recommendations', 'tasks', 'records', 'outcomes'];
        for (const key of candidateKeys) {
            const value = (input as Record<string, unknown>)[key];
            if (Array.isArray(value)) return value;
        }
    }
    return [];
}

export function outcomesFromGenericPayload(
    input: unknown,
    recommendationByTaskId: RecommendationLookup = new Map()
): ExecutionOutcome[] {
    return extractArray(input)
        .map((row) => toExecutionOutcome(asRecord(row), recommendationByTaskId, 'generic'))
        .filter((row): row is ExecutionOutcome => row !== null);
}

export function outcomesFromTaskPackage(
    payload: unknown,
    recommendationByTaskId: RecommendationLookup = new Map()
): ExecutionOutcome[] {
    const root = asRecord(payload);
    const requests = Array.isArray(root.requests) ? root.requests : [];
    const blocked = Array.isArray(root.blocked) ? root.blocked : [];

    const requestOutcomes = requests
        .map((item) => {
            const request = asRecord(item);
            const context = asRecord(request.context);

            const taskId = asString(request.id) ?? asString(request.taskId);
            const recommendationId = asString(context.recommendationId)
                ?? asString(request.recommendationId)
                ?? (taskId ? recommendationByTaskId.get(taskId) : undefined);

            return {
                taskId,
                recommendationId,
                status: 'dispatched',
                owner: asString(request.target),
                attempts: 0,
                createdAt: asFiniteNumber(request.createdAt)
            } satisfies ExecutionOutcome;
        });

    const blockedOutcomes = blocked
        .map((item) => {
            const row = asRecord(item);
            const reason = asString(row.reason);
            const status = normalizeStatus(reason ?? 'rejected', 'package');

            return {
                taskId: asString(row.taskId) ?? asString(row.id),
                recommendationId: asString(row.recommendationId),
                status,
                owner: undefined,
                attempts: 0,
                createdAt: asFiniteNumber(row.createdAt)
            } satisfies ExecutionOutcome;
        });

    return [...requestOutcomes, ...blockedOutcomes];
}

export function outcomesFromJournalEntries(
    entries: unknown[],
    recommendationByTaskId: RecommendationLookup = new Map()
): ExecutionOutcome[] {
    const state = new Map<string, Record<string, unknown>>();

    for (const entry of entries) {
        const row = asRecord(entry);

        const eventType = asString(row.type);
        if (eventType === 'snapshot') {
            state.clear();
            const records = asRecord(row.records);
            for (const [taskId, recordValue] of Object.entries(records)) {
                const record = asRecord(recordValue);
                state.set(taskId, {
                    taskId,
                    ...record
                });
            }
            continue;
        }

        if (eventType === 'delete') {
            const taskId = asString(row.taskId);
            if (taskId) {
                state.delete(taskId);
            }
            continue;
        }

        if (eventType === 'upsert') {
            const taskId = asString(row.taskId);
            const record = asRecord(row.record);
            if (taskId) {
                state.set(taskId, {
                    taskId,
                    ...record
                });
            }
            continue;
        }

        const kind = asString(row.kind);
        if (kind === 'task_result') {
            const taskId = asString(row.taskId);
            if (!taskId) continue;

            const previous = state.get(taskId) ?? { taskId };
            state.set(taskId, {
                ...previous,
                taskId,
                status: normalizeStatus(row.status, 'journal'),
                result: row,
                closedAt: asFiniteNumber(row.completedAt) ?? asFiniteNumber((previous as Record<string, unknown>).closedAt)
            });
            continue;
        }

        if (kind === 'task_receipt') {
            const taskId = asString(row.taskId);
            if (!taskId) continue;

            const previous = state.get(taskId) ?? { taskId };
            const accepted = row.accepted === true;
            state.set(taskId, {
                ...previous,
                taskId,
                status: accepted ? 'acknowledged' : 'rejected',
                closedAt: accepted
                    ? asFiniteNumber((previous as Record<string, unknown>).closedAt)
                    : asFiniteNumber(row.timestamp) ?? asFiniteNumber((previous as Record<string, unknown>).closedAt)
            });
            continue;
        }

        const taskId = asString(row.taskId) ?? asString(row.id);
        if (taskId && (row.status !== undefined || row.result !== undefined || row.reason !== undefined)) {
            state.set(taskId, {
                ...state.get(taskId),
                ...row,
                taskId
            });
        }
    }

    return [...state.values()]
        .map((record) => toExecutionOutcome(record, recommendationByTaskId, 'journal'))
        .filter((row): row is ExecutionOutcome => row !== null);
}

export type { RecommendationLookup };
