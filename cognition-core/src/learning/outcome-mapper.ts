import type { EvaluationStatus, ExecutionOutcome } from './evaluator.js';

const TERMINAL_OUTCOME_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'timed_out',
    'rejected',
    'transport_error'
]);

const STATUS_PRIORITY = new Map<string, number>([
    ['completed', 80],
    ['partial', 70],
    ['failed', 60],
    ['timed_out', 50],
    ['rejected', 40],
    ['transport_error', 30],
    ['awaiting_approval', 20],
    ['acknowledged', 10],
    ['dispatched', 5]
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

function normalizeStatus(value: unknown, _sourceHint: SourceHint): EvaluationStatus {
    const normalized = String(value ?? '').trim().toLowerCase();

    if (!normalized) {
        return 'dispatched';
    }

    if (normalized === 'success') return 'completed';
    if (normalized === 'failure') return 'failed';
    if (normalized === 'timeout' || normalized === 'timedout') return 'timed_out';
    if (normalized === 'approval_pending' || normalized === 'awaiting_human_approval') {
        return 'awaiting_approval';
    }

    return normalized;
}

function normalizeStatusKey(status: unknown): string {
    return String(status ?? '').trim().toLowerCase();
}

function statusPriority(status: unknown): number {
    const normalized = normalizeStatusKey(status);
    if (STATUS_PRIORITY.has(normalized)) {
        return STATUS_PRIORITY.get(normalized) ?? 0;
    }

    return TERMINAL_OUTCOME_STATUSES.has(normalized) ? 1 : 0;
}

function asNullableFiniteNumber(value: unknown): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function compareNullableNumbers(a: number | null, b: number | null): number {
    if (a !== null && b !== null && a !== b) {
        return a > b ? 1 : -1;
    }
    if (a !== null && b === null) return 1;
    if (a === null && b !== null) return -1;
    return 0;
}

function isTerminalStatus(status: unknown): boolean {
    return TERMINAL_OUTCOME_STATUSES.has(normalizeStatusKey(status));
}

function selectProgressiveStatus(
    previousStatus: EvaluationStatus,
    nextStatus: EvaluationStatus,
    previousClosedAt?: number,
    nextClosedAt?: number
): EvaluationStatus {
    const previousIsTerminal = isTerminalStatus(previousStatus);
    const nextIsTerminal = isTerminalStatus(nextStatus);

    if (previousIsTerminal !== nextIsTerminal) {
        return previousIsTerminal ? previousStatus : nextStatus;
    }

    const timestampOrder = compareNullableNumbers(
        asNullableFiniteNumber(previousClosedAt),
        asNullableFiniteNumber(nextClosedAt)
    );
    if (timestampOrder !== 0) {
        return timestampOrder > 0 ? previousStatus : nextStatus;
    }

    const previousPriority = statusPriority(previousStatus);
    const nextPriority = statusPriority(nextStatus);
    if (previousPriority !== nextPriority) {
        return previousPriority > nextPriority ? previousStatus : nextStatus;
    }

    return nextStatus;
}

function selectProgressiveClosedAt(
    previousStatus: EvaluationStatus,
    nextStatus: EvaluationStatus,
    selectedStatus: EvaluationStatus,
    previousClosedAt?: number,
    nextClosedAt?: number
): number | undefined {
    if (selectedStatus === previousStatus && selectedStatus !== nextStatus) {
        return previousClosedAt;
    }

    if (selectedStatus === nextStatus && selectedStatus !== previousStatus) {
        return nextClosedAt ?? previousClosedAt;
    }

    const timestampOrder = compareNullableNumbers(
        asNullableFiniteNumber(previousClosedAt),
        asNullableFiniteNumber(nextClosedAt)
    );
    if (timestampOrder > 0) {
        return previousClosedAt ?? nextClosedAt;
    }
    if (timestampOrder < 0) {
        return nextClosedAt ?? previousClosedAt;
    }

    return nextClosedAt ?? previousClosedAt;
}

function recommendationIdFromRow(row: Record<string, unknown>, taskId: string | undefined, recommendationByTaskId: RecommendationLookup): string | undefined {
    const request = asRecord(row.request);
    const requestContext = asRecord(request.context);
    const result = asRecord(row.result);
    const resultRequest = asRecord(result.request);
    const resultRequestContext = asRecord(resultRequest.context);

    return asString(row.recommendationId)
        ?? asString(row.sourceRecommendationId)
        ?? asString(result.recommendationId)
        ?? asString(result.sourceRecommendationId)
        ?? asString(request.recommendationId)
        ?? asString(request.sourceRecommendationId)
        ?? asString(resultRequest.recommendationId)
        ?? asString(resultRequest.sourceRecommendationId)
        ?? asString(requestContext.recommendationId)
        ?? asString(requestContext.sourceRecommendationId)
        ?? asString(resultRequestContext.recommendationId)
        ?? asString(resultRequestContext.sourceRecommendationId)
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
    const request = asRecord(row.request);

    const taskId = asString(row.taskId)
        ?? asString(row.id)
        ?? asString(row.requestId)
        ?? asString(result.taskId)
        ?? asString(request.taskId)
        ?? asString(request.id);

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
        createdAt: asFiniteNumber(row.createdAt) ?? asFiniteNumber(request.createdAt),
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
            const taskId = asString(row.taskId) ?? asString(row.id);

            return {
                taskId,
                recommendationId: asString(row.recommendationId)
                    ?? asString(row.sourceRecommendationId)
                    ?? (taskId ? recommendationByTaskId.get(taskId) : undefined),
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
                const previous = state.get(taskId) ?? { taskId };
                const previousRecord = previous as Record<string, unknown>;
                const previousStatus = normalizeStatus(previousRecord.status, 'journal');
                const nextStatus = normalizeStatus(record.status, 'journal');
                const previousClosedAt = asFiniteNumber(previousRecord.closedAt);
                const nextClosedAt = asFiniteNumber(record.closedAt) ?? asFiniteNumber(record.completedAt);

                const selectedStatus = selectProgressiveStatus(
                    previousStatus,
                    nextStatus,
                    previousClosedAt,
                    nextClosedAt
                );

                state.set(taskId, {
                    ...previous,
                    taskId,
                    ...record,
                    status: selectedStatus,
                    closedAt: selectProgressiveClosedAt(
                        previousStatus,
                        nextStatus,
                        selectedStatus,
                        previousClosedAt,
                        nextClosedAt
                    )
                });
            }
            continue;
        }

        const kind = asString(row.kind);
        if (kind === 'task_result') {
            const taskId = asString(row.taskId);
            if (!taskId) continue;

            const previous = state.get(taskId) ?? { taskId };
            const previousRecord = previous as Record<string, unknown>;
            const previousStatus = normalizeStatus(previousRecord.status, 'journal');
            const nextStatus = normalizeStatus(row.status, 'journal');
            const previousClosedAt = asFiniteNumber(previousRecord.closedAt);
            const nextClosedAt = asFiniteNumber(row.completedAt);

            const selectedStatus = selectProgressiveStatus(
                previousStatus,
                nextStatus,
                previousClosedAt,
                nextClosedAt
            );

            state.set(taskId, {
                ...previous,
                taskId,
                status: selectedStatus,
                result: row,
                closedAt: selectProgressiveClosedAt(
                    previousStatus,
                    nextStatus,
                    selectedStatus,
                    previousClosedAt,
                    nextClosedAt
                )
            });
            continue;
        }

        if (kind === 'task_receipt') {
            const taskId = asString(row.taskId);
            if (!taskId) continue;

            const previous = state.get(taskId) ?? { taskId };
            const previousRecord = previous as Record<string, unknown>;
            const previousStatus = normalizeStatus(previousRecord.status, 'journal');
            const accepted = row.accepted === true;
            const nextStatus: EvaluationStatus = accepted ? 'acknowledged' : 'rejected';
            const previousClosedAt = asFiniteNumber(previousRecord.closedAt);
            const nextClosedAt = accepted ? undefined : asFiniteNumber(row.timestamp);

            const selectedStatus = selectProgressiveStatus(
                previousStatus,
                nextStatus,
                previousClosedAt,
                nextClosedAt
            );

            state.set(taskId, {
                ...previous,
                taskId,
                status: selectedStatus,
                closedAt: selectProgressiveClosedAt(
                    previousStatus,
                    nextStatus,
                    selectedStatus,
                    previousClosedAt,
                    nextClosedAt
                )
            });
            continue;
        }

        const taskId = asString(row.taskId) ?? asString(row.id);
        if (taskId && (row.status !== undefined || row.result !== undefined || row.reason !== undefined)) {
            const previous = state.get(taskId) ?? { taskId };
            const previousRecord = previous as Record<string, unknown>;
            const previousStatus = normalizeStatus(previousRecord.status, 'journal');
            const nextStatus = normalizeStatus(row.status ?? row.reason, 'journal');
            const previousClosedAt = asFiniteNumber(previousRecord.closedAt);
            const nextClosedAt = asFiniteNumber(row.closedAt) ?? asFiniteNumber(row.completedAt);

            const selectedStatus = selectProgressiveStatus(
                previousStatus,
                nextStatus,
                previousClosedAt,
                nextClosedAt
            );

            state.set(taskId, {
                ...previous,
                ...row,
                taskId,
                status: selectedStatus,
                closedAt: selectProgressiveClosedAt(
                    previousStatus,
                    nextStatus,
                    selectedStatus,
                    previousClosedAt,
                    nextClosedAt
                )
            });
        }
    }

    return [...state.values()]
        .map((record) => toExecutionOutcome(record, recommendationByTaskId, 'journal'))
        .filter((row): row is ExecutionOutcome => row !== null);
}

export type { RecommendationLookup };
