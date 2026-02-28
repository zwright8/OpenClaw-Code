import { randomUUID, createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
    validateCognitionState,
    type CognitionState
} from '../contracts/state.js';
import type { ContractValidationIssue, ContractValidationResult } from '../contracts/events.js';

export interface CognitionStateSnapshotSummary {
    timelineEventCount: number;
    incidentCount: number;
    taskJournalCount: number;
    baselineWindowCount: number;
    memoryNodeCount: number;
    memoryEdgeCount: number;
}

export interface CognitionStateSnapshot {
    snapshotId: string;
    createdAt: number;
    stateVersion: number;
    stateHash: string;
    summary: CognitionStateSnapshotSummary;
    state: CognitionState;
    metadata?: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function normalizeTimestamp(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;

        const asNumber = Number(trimmed);
        if (Number.isFinite(asNumber)) return Math.floor(asNumber);

        const asDate = Date.parse(trimmed);
        if (Number.isFinite(asDate)) return Math.floor(asDate);
    }

    return null;
}

function normalizeNonNegativeInteger(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric) || numeric < 0 || !Number.isInteger(numeric)) return null;
    return numeric;
}

function stableValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map((item) => stableValue(item));
    }

    if (isRecord(value)) {
        const out: Record<string, unknown> = {};
        const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
        for (const key of keys) {
            out[key] = stableValue(value[key]);
        }
        return out;
    }

    return value;
}

export function stableStringify(value: unknown): string {
    return JSON.stringify(stableValue(value));
}

export function hashCognitionState(state: CognitionState): string {
    const stable = stableStringify(state);
    return createHash('sha256').update(stable).digest('hex');
}

export function buildCognitionStateSnapshotSummary(state: CognitionState): CognitionStateSnapshotSummary {
    return {
        timelineEventCount: state.timelineEventIds.length,
        incidentCount: Object.keys(state.incidents).length,
        taskJournalCount: state.taskJournal.length,
        baselineWindowCount: state.baselineWindows.length,
        memoryNodeCount: state.memory.nodeCount,
        memoryEdgeCount: state.memory.edgeCount
    };
}

export function createCognitionStateSnapshot(
    state: unknown,
    {
        snapshotId = randomUUID(),
        createdAt = Date.now(),
        metadata
    }: {
        snapshotId?: string;
        createdAt?: number;
        metadata?: Record<string, unknown>;
    } = {}
): CognitionStateSnapshot {
    const stateResult = validateCognitionState(state);
    if (!stateResult.ok) {
        const message = stateResult.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
        throw new Error(`Cannot snapshot invalid state: ${message}`);
    }

    const normalizedState = stateResult.value;
    const stateHash = hashCognitionState(normalizedState);

    return {
        snapshotId,
        createdAt,
        stateVersion: normalizedState.version,
        stateHash,
        summary: buildCognitionStateSnapshotSummary(normalizedState),
        state: normalizedState,
        metadata
    };
}

export function validateCognitionStateSnapshot(value: unknown): ContractValidationResult<CognitionStateSnapshot> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: '$', message: 'Snapshot must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const snapshotId = normalizeString(value.snapshotId) ?? normalizeString(value.id);
    if (!snapshotId) errors.push({ path: 'snapshotId', message: 'snapshotId is required.' });

    const createdAt = normalizeTimestamp(value.createdAt);
    if (createdAt === null) errors.push({ path: 'createdAt', message: 'createdAt must be a timestamp.' });

    const stateVersion = normalizeNonNegativeInteger(value.stateVersion);
    if (stateVersion === null || stateVersion <= 0) {
        errors.push({ path: 'stateVersion', message: 'stateVersion must be a positive integer.' });
    }

    const stateHash = normalizeString(value.stateHash);
    if (!stateHash) errors.push({ path: 'stateHash', message: 'stateHash is required.' });

    const summaryRaw = value.summary;
    let summary: CognitionStateSnapshotSummary | null = null;
    if (!isRecord(summaryRaw)) {
        errors.push({ path: 'summary', message: 'summary must be an object.' });
    } else {
        const timelineEventCount = normalizeNonNegativeInteger(summaryRaw.timelineEventCount);
        const incidentCount = normalizeNonNegativeInteger(summaryRaw.incidentCount);
        const taskJournalCount = normalizeNonNegativeInteger(summaryRaw.taskJournalCount);
        const baselineWindowCount = normalizeNonNegativeInteger(summaryRaw.baselineWindowCount);
        const memoryNodeCount = normalizeNonNegativeInteger(summaryRaw.memoryNodeCount);
        const memoryEdgeCount = normalizeNonNegativeInteger(summaryRaw.memoryEdgeCount);

        if (timelineEventCount === null) {
            errors.push({ path: 'summary.timelineEventCount', message: 'must be a non-negative integer.' });
        }
        if (incidentCount === null) {
            errors.push({ path: 'summary.incidentCount', message: 'must be a non-negative integer.' });
        }
        if (taskJournalCount === null) {
            errors.push({ path: 'summary.taskJournalCount', message: 'must be a non-negative integer.' });
        }
        if (baselineWindowCount === null) {
            errors.push({ path: 'summary.baselineWindowCount', message: 'must be a non-negative integer.' });
        }
        if (memoryNodeCount === null) {
            errors.push({ path: 'summary.memoryNodeCount', message: 'must be a non-negative integer.' });
        }
        if (memoryEdgeCount === null) {
            errors.push({ path: 'summary.memoryEdgeCount', message: 'must be a non-negative integer.' });
        }

        if (
            timelineEventCount !== null &&
            incidentCount !== null &&
            taskJournalCount !== null &&
            baselineWindowCount !== null &&
            memoryNodeCount !== null &&
            memoryEdgeCount !== null
        ) {
            summary = {
                timelineEventCount,
                incidentCount,
                taskJournalCount,
                baselineWindowCount,
                memoryNodeCount,
                memoryEdgeCount
            };
        }
    }

    const stateResult = validateCognitionState(value.state);
    if (!stateResult.ok) {
        for (const issue of stateResult.errors) {
            errors.push({ path: `state.${issue.path}`, message: issue.message });
        }
    }

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: 'metadata', message: 'metadata must be an object.' });
    }

    if (
        errors.length > 0 ||
        !snapshotId ||
        createdAt === null ||
        stateVersion === null ||
        stateVersion <= 0 ||
        !stateHash ||
        !summary ||
        !stateResult.ok
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            snapshotId,
            createdAt,
            stateVersion,
            stateHash,
            summary,
            state: stateResult.value,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

export function verifyCognitionStateSnapshot(snapshot: unknown): ContractValidationResult<CognitionStateSnapshot> {
    const result = validateCognitionStateSnapshot(snapshot);
    if (!result.ok) return result;

    const recomputedHash = hashCognitionState(result.value.state);
    if (recomputedHash !== result.value.stateHash) {
        return {
            ok: false,
            errors: [{ path: 'stateHash', message: 'Snapshot hash does not match state payload.' }]
        };
    }

    return result;
}

export async function writeCognitionStateSnapshot(filePath: string, snapshot: unknown, prettyPrint = true): Promise<void> {
    const result = validateCognitionStateSnapshot(snapshot);
    if (!result.ok) {
        const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
        throw new Error(`Cannot write invalid snapshot: ${message}`);
    }

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(
        filePath,
        prettyPrint ? `${JSON.stringify(result.value, null, 2)}\n` : JSON.stringify(result.value),
        'utf8'
    );
}

export async function readCognitionStateSnapshot(filePath: string): Promise<CognitionStateSnapshot> {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    const result = verifyCognitionStateSnapshot(parsed);
    if (!result.ok) {
        const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
        throw new Error(`Snapshot verification failed: ${message}`);
    }
    return result.value;
}
