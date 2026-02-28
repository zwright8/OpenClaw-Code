import {
    COGNITION_EVENT_SEVERITIES,
    COGNITION_RISK_TIERS,
    type CognitionEventSeverity,
    type CognitionRiskTier,
    type ContractValidationIssue,
    type ContractValidationResult
} from './events.js';

export const COGNITION_INCIDENT_STATUSES = ['open', 'monitoring', 'mitigated', 'closed'] as const;
export type CognitionIncidentStatus = (typeof COGNITION_INCIDENT_STATUSES)[number];

export const COGNITION_TASK_JOURNAL_STATUSES = [
    'queued',
    'running',
    'blocked',
    'completed',
    'failed',
    'cancelled'
] as const;
export type CognitionTaskJournalStatus = (typeof COGNITION_TASK_JOURNAL_STATUSES)[number];

export interface CognitionIncidentSnapshot {
    incidentId: string;
    title: string;
    status: CognitionIncidentStatus;
    severity: CognitionEventSeverity;
    riskTier: CognitionRiskTier;
    openedAt: number;
    updatedAt: number;
    closedAt?: number;
    summary?: string;
    owner?: string;
    relatedEventIds: string[];
    relatedRecommendationIds: string[];
    metadata?: Record<string, unknown>;
}

export interface CognitionBaselineWindow {
    windowId: string;
    label: string;
    startTs: number;
    endTs: number;
    metrics: Record<string, number>;
    sampleSize?: number;
    metadata?: Record<string, unknown>;
}

export interface CognitionTaskJournalEntry {
    taskId: string;
    owner: string;
    status: CognitionTaskJournalStatus;
    createdAt: number;
    updatedAt: number;
    recommendationId?: string;
    notes?: string;
    metadata?: Record<string, unknown>;
}

export interface CognitionStateMemoryStats {
    nodeCount: number;
    edgeCount: number;
    lastIndexedAt?: number;
}

export interface CognitionState {
    version: number;
    updatedAt: number;
    timelineEventIds: string[];
    incidents: Record<string, CognitionIncidentSnapshot>;
    taskJournal: CognitionTaskJournalEntry[];
    baselineWindows: CognitionBaselineWindow[];
    memory: CognitionStateMemoryStats;
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

function normalizeNonNegativeNumber(value: unknown): number | null {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return null;
    return numeric;
}

function validateStringArray(value: unknown, path: string): ContractValidationResult<string[]> {
    if (!Array.isArray(value)) {
        return { ok: false, errors: [{ path, message: 'must be an array of strings.' }] };
    }

    const errors: ContractValidationIssue[] = [];
    const out: string[] = [];

    for (let index = 0; index < value.length; index += 1) {
        const item = normalizeString(value[index]);
        if (!item) {
            errors.push({ path: `${path}[${index}]`, message: 'must be a non-empty string.' });
            continue;
        }
        out.push(item);
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return { ok: true, value: out };
}

function normalizeSeverity(value: unknown): CognitionEventSeverity | null {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    if (COGNITION_EVENT_SEVERITIES.includes(normalized as CognitionEventSeverity)) {
        return normalized as CognitionEventSeverity;
    }
    return null;
}

function normalizeRiskTier(value: unknown): CognitionRiskTier | null {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    if (COGNITION_RISK_TIERS.includes(normalized as CognitionRiskTier)) {
        return normalized as CognitionRiskTier;
    }
    return null;
}

function normalizeIncidentStatus(value: unknown): CognitionIncidentStatus | null {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    if (COGNITION_INCIDENT_STATUSES.includes(normalized as CognitionIncidentStatus)) {
        return normalized as CognitionIncidentStatus;
    }
    return null;
}

function normalizeJournalStatus(value: unknown): CognitionTaskJournalStatus | null {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    if (COGNITION_TASK_JOURNAL_STATUSES.includes(normalized as CognitionTaskJournalStatus)) {
        return normalized as CognitionTaskJournalStatus;
    }
    return null;
}

export function createEmptyCognitionState(now = Date.now()): CognitionState {
    return {
        version: 1,
        updatedAt: now,
        timelineEventIds: [],
        incidents: {},
        taskJournal: [],
        baselineWindows: [],
        memory: {
            nodeCount: 0,
            edgeCount: 0
        }
    };
}

export function validateIncidentSnapshot(value: unknown, pathPrefix = 'incident'): ContractValidationResult<CognitionIncidentSnapshot> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: pathPrefix, message: 'must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const incidentId = normalizeString(value.incidentId) ?? normalizeString(value.id);
    if (!incidentId) errors.push({ path: `${pathPrefix}.incidentId`, message: 'incidentId is required.' });

    const title = normalizeString(value.title);
    if (!title) errors.push({ path: `${pathPrefix}.title`, message: 'title is required.' });

    const status = normalizeIncidentStatus(value.status);
    if (!status) {
        errors.push({
            path: `${pathPrefix}.status`,
            message: `status must be one of: ${COGNITION_INCIDENT_STATUSES.join(', ')}.`
        });
    }

    const severity = normalizeSeverity(value.severity);
    if (!severity) {
        errors.push({
            path: `${pathPrefix}.severity`,
            message: `severity must be one of: ${COGNITION_EVENT_SEVERITIES.join(', ')}.`
        });
    }

    const riskTier = normalizeRiskTier(value.riskTier);
    if (!riskTier) {
        errors.push({
            path: `${pathPrefix}.riskTier`,
            message: `riskTier must be one of: ${COGNITION_RISK_TIERS.join(', ')}.`
        });
    }

    const openedAt = normalizeTimestamp(value.openedAt);
    if (openedAt === null) errors.push({ path: `${pathPrefix}.openedAt`, message: 'openedAt must be a timestamp.' });

    const updatedAt = normalizeTimestamp(value.updatedAt);
    if (updatedAt === null) errors.push({ path: `${pathPrefix}.updatedAt`, message: 'updatedAt must be a timestamp.' });

    const closedAtRaw = value.closedAt;
    const closedAt = closedAtRaw === undefined ? undefined : normalizeTimestamp(closedAtRaw);
    if (closedAtRaw !== undefined && closedAt === null) {
        errors.push({ path: `${pathPrefix}.closedAt`, message: 'closedAt must be a timestamp.' });
    }

    const summaryRaw = value.summary;
    const summary = summaryRaw === undefined ? undefined : normalizeString(summaryRaw) ?? undefined;

    const ownerRaw = value.owner;
    const owner = ownerRaw === undefined ? undefined : normalizeString(ownerRaw) ?? undefined;

    const relatedEventIdsResult = validateStringArray(value.relatedEventIds ?? [], `${pathPrefix}.relatedEventIds`);
    if (!relatedEventIdsResult.ok) errors.push(...relatedEventIdsResult.errors);

    const relatedRecommendationIdsResult = validateStringArray(
        value.relatedRecommendationIds ?? [],
        `${pathPrefix}.relatedRecommendationIds`
    );
    if (!relatedRecommendationIdsResult.ok) errors.push(...relatedRecommendationIdsResult.errors);

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: `${pathPrefix}.metadata`, message: 'metadata must be an object.' });
    }

    if (
        errors.length > 0 ||
        !incidentId ||
        !title ||
        !status ||
        !severity ||
        !riskTier ||
        openedAt === null ||
        updatedAt === null ||
        !relatedEventIdsResult.ok ||
        !relatedRecommendationIdsResult.ok
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            incidentId,
            title,
            status,
            severity,
            riskTier,
            openedAt,
            updatedAt,
            closedAt,
            summary,
            owner,
            relatedEventIds: relatedEventIdsResult.value,
            relatedRecommendationIds: relatedRecommendationIdsResult.value,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

function validateBaselineWindow(value: unknown, index: number): ContractValidationResult<CognitionBaselineWindow> {
    const path = `baselineWindows[${index}]`;
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path, message: 'must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const windowId = normalizeString(value.windowId) ?? normalizeString(value.id);
    if (!windowId) errors.push({ path: `${path}.windowId`, message: 'windowId is required.' });

    const label = normalizeString(value.label);
    if (!label) errors.push({ path: `${path}.label`, message: 'label is required.' });

    const startTs = normalizeTimestamp(value.startTs);
    if (startTs === null) errors.push({ path: `${path}.startTs`, message: 'startTs must be a timestamp.' });

    const endTs = normalizeTimestamp(value.endTs);
    if (endTs === null) errors.push({ path: `${path}.endTs`, message: 'endTs must be a timestamp.' });

    const metricsRaw = value.metrics;
    const metrics: Record<string, number> = {};
    if (!isRecord(metricsRaw)) {
        errors.push({ path: `${path}.metrics`, message: 'metrics must be an object of numeric values.' });
    } else {
        for (const [metricName, metricValue] of Object.entries(metricsRaw)) {
            const normalized = typeof metricValue === 'number' ? metricValue : Number(metricValue);
            if (!Number.isFinite(normalized)) {
                errors.push({ path: `${path}.metrics.${metricName}`, message: 'metric values must be numbers.' });
                continue;
            }
            metrics[metricName] = normalized;
        }
    }

    const sampleSizeRaw = value.sampleSize;
    const sampleSize = sampleSizeRaw === undefined ? undefined : normalizeNonNegativeNumber(sampleSizeRaw);
    if (sampleSizeRaw !== undefined && sampleSize === null) {
        errors.push({ path: `${path}.sampleSize`, message: 'sampleSize must be a non-negative number.' });
    }

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: `${path}.metadata`, message: 'metadata must be an object.' });
    }

    if (errors.length > 0 || !windowId || !label || startTs === null || endTs === null || !isRecord(metricsRaw)) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            windowId,
            label,
            startTs,
            endTs,
            metrics,
            sampleSize,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

function validateTaskJournalEntry(value: unknown, index: number): ContractValidationResult<CognitionTaskJournalEntry> {
    const path = `taskJournal[${index}]`;
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path, message: 'must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const taskId = normalizeString(value.taskId) ?? normalizeString(value.id);
    if (!taskId) errors.push({ path: `${path}.taskId`, message: 'taskId is required.' });

    const owner = normalizeString(value.owner);
    if (!owner) errors.push({ path: `${path}.owner`, message: 'owner is required.' });

    const status = normalizeJournalStatus(value.status);
    if (!status) {
        errors.push({
            path: `${path}.status`,
            message: `status must be one of: ${COGNITION_TASK_JOURNAL_STATUSES.join(', ')}.`
        });
    }

    const createdAt = normalizeTimestamp(value.createdAt);
    if (createdAt === null) errors.push({ path: `${path}.createdAt`, message: 'createdAt must be a timestamp.' });

    const updatedAt = normalizeTimestamp(value.updatedAt);
    if (updatedAt === null) errors.push({ path: `${path}.updatedAt`, message: 'updatedAt must be a timestamp.' });

    const recommendationIdRaw = value.recommendationId;
    const recommendationId = recommendationIdRaw === undefined
        ? undefined
        : normalizeString(recommendationIdRaw) ?? undefined;

    const notesRaw = value.notes;
    const notes = notesRaw === undefined ? undefined : normalizeString(notesRaw) ?? undefined;

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: `${path}.metadata`, message: 'metadata must be an object.' });
    }

    if (errors.length > 0 || !taskId || !owner || !status || createdAt === null || updatedAt === null) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            taskId,
            owner,
            status,
            createdAt,
            updatedAt,
            recommendationId,
            notes,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

function validateMemoryStats(value: unknown): ContractValidationResult<CognitionStateMemoryStats> {
    if (!isRecord(value)) {
        return {
            ok: false,
            errors: [{ path: 'memory', message: 'memory must be an object with node/edge counts.' }]
        };
    }

    const errors: ContractValidationIssue[] = [];

    const nodeCount = normalizeNonNegativeNumber(value.nodeCount);
    if (nodeCount === null) errors.push({ path: 'memory.nodeCount', message: 'nodeCount must be a non-negative number.' });

    const edgeCount = normalizeNonNegativeNumber(value.edgeCount);
    if (edgeCount === null) errors.push({ path: 'memory.edgeCount', message: 'edgeCount must be a non-negative number.' });

    const lastIndexedAtRaw = value.lastIndexedAt;
    const lastIndexedAt = lastIndexedAtRaw === undefined ? undefined : normalizeTimestamp(lastIndexedAtRaw);
    if (lastIndexedAtRaw !== undefined && lastIndexedAt === null) {
        errors.push({ path: 'memory.lastIndexedAt', message: 'lastIndexedAt must be a timestamp.' });
    }

    if (errors.length > 0 || nodeCount === null || edgeCount === null) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            nodeCount,
            edgeCount,
            lastIndexedAt
        }
    };
}

export function validateCognitionState(value: unknown): ContractValidationResult<CognitionState> {
    if (!isRecord(value)) {
        return { ok: false, errors: [{ path: '$', message: 'State must be an object.' }] };
    }

    const errors: ContractValidationIssue[] = [];

    const version = normalizeNonNegativeNumber(value.version);
    if (version === null || !Number.isInteger(version) || version <= 0) {
        errors.push({ path: 'version', message: 'version must be a positive integer.' });
    }

    const updatedAt = normalizeTimestamp(value.updatedAt);
    if (updatedAt === null) errors.push({ path: 'updatedAt', message: 'updatedAt must be a timestamp.' });

    const timelineEventIdsResult = validateStringArray(value.timelineEventIds ?? [], 'timelineEventIds');
    if (!timelineEventIdsResult.ok) errors.push(...timelineEventIdsResult.errors);

    const incidentsRaw = value.incidents;
    const incidents: Record<string, CognitionIncidentSnapshot> = {};
    if (!isRecord(incidentsRaw)) {
        errors.push({ path: 'incidents', message: 'incidents must be an object keyed by incidentId.' });
    } else {
        for (const [incidentId, incidentValue] of Object.entries(incidentsRaw)) {
            const incidentResult = validateIncidentSnapshot(incidentValue, `incidents.${incidentId}`);
            if (!incidentResult.ok) {
                errors.push(...incidentResult.errors);
                continue;
            }
            incidents[incidentId] = incidentResult.value;
        }
    }

    const taskJournalRaw = value.taskJournal;
    const taskJournal: CognitionTaskJournalEntry[] = [];
    if (!Array.isArray(taskJournalRaw)) {
        errors.push({ path: 'taskJournal', message: 'taskJournal must be an array.' });
    } else {
        for (let index = 0; index < taskJournalRaw.length; index += 1) {
            const entryResult = validateTaskJournalEntry(taskJournalRaw[index], index);
            if (entryResult.ok) {
                taskJournal.push(entryResult.value);
            } else {
                errors.push(...entryResult.errors);
            }
        }
    }

    const baselineWindowsRaw = value.baselineWindows;
    const baselineWindows: CognitionBaselineWindow[] = [];
    if (!Array.isArray(baselineWindowsRaw)) {
        errors.push({ path: 'baselineWindows', message: 'baselineWindows must be an array.' });
    } else {
        for (let index = 0; index < baselineWindowsRaw.length; index += 1) {
            const windowResult = validateBaselineWindow(baselineWindowsRaw[index], index);
            if (windowResult.ok) {
                baselineWindows.push(windowResult.value);
            } else {
                errors.push(...windowResult.errors);
            }
        }
    }

    const memoryResult = validateMemoryStats(value.memory);
    if (!memoryResult.ok) {
        errors.push(...memoryResult.errors);
    }

    const metadataRaw = value.metadata;
    if (metadataRaw !== undefined && !isRecord(metadataRaw)) {
        errors.push({ path: 'metadata', message: 'metadata must be an object.' });
    }

    if (
        errors.length > 0 ||
        version === null ||
        !Number.isInteger(version) ||
        version <= 0 ||
        updatedAt === null ||
        !timelineEventIdsResult.ok ||
        !isRecord(incidentsRaw) ||
        !Array.isArray(taskJournalRaw) ||
        !Array.isArray(baselineWindowsRaw) ||
        !memoryResult.ok
    ) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            version,
            updatedAt,
            timelineEventIds: timelineEventIdsResult.value,
            incidents,
            taskJournal,
            baselineWindows,
            memory: memoryResult.value,
            metadata: metadataRaw as Record<string, unknown> | undefined
        }
    };
}

export function assertCognitionState(value: unknown): CognitionState {
    const result = validateCognitionState(value);
    if (result.ok) return result.value;

    const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
    throw new Error(`Invalid CognitionState: ${message}`);
}
