import fs from 'node:fs/promises';
import path from 'node:path';
import {
    createEmptyCognitionState,
    validateCognitionState,
    validateIncidentSnapshot,
    type CognitionIncidentSnapshot,
    type CognitionState
} from '../contracts/state.js';

export interface CognitionStateStoreOptions {
    filePath: string;
    createIfMissing?: boolean;
    prettyPrint?: boolean;
    now?: () => number;
}

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function uniqueStrings(values: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];

    for (const value of values) {
        if (seen.has(value)) continue;
        seen.add(value);
        out.push(value);
    }

    return out;
}

export class CognitionStateStore {
    private readonly filePath: string;
    private readonly createIfMissing: boolean;
    private readonly prettyPrint: boolean;
    private readonly now: () => number;

    constructor(options: CognitionStateStoreOptions) {
        this.filePath = options.filePath;
        this.createIfMissing = options.createIfMissing ?? true;
        this.prettyPrint = options.prettyPrint ?? true;
        this.now = options.now ?? Date.now;
    }

    async load(): Promise<CognitionState> {
        try {
            const raw = await fs.readFile(this.filePath, 'utf8');
            const parsed = JSON.parse(raw) as unknown;
            const result = validateCognitionState(parsed);
            if (!result.ok) {
                const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
                throw new Error(`State validation failed: ${message}`);
            }
            return result.value;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT' && this.createIfMissing) {
                const state = createEmptyCognitionState(this.now());
                await this.save(state);
                return state;
            }
            throw error;
        }
    }

    async save(value: unknown): Promise<CognitionState> {
        const result = validateCognitionState(value);
        if (!result.ok) {
            const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
            throw new Error(`Cannot save invalid cognition state: ${message}`);
        }

        const stateToWrite = clone(result.value);
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(
            this.filePath,
            this.prettyPrint
                ? `${JSON.stringify(stateToWrite, null, 2)}\n`
                : JSON.stringify(stateToWrite),
            'utf8'
        );

        return stateToWrite;
    }

    async update(mutator: (state: CognitionState) => CognitionState | void): Promise<CognitionState> {
        const current = await this.load();
        const draft = clone(current);

        const maybeNext = mutator(draft);
        const next = maybeNext ?? draft;
        next.updatedAt = this.now();

        return this.save(next);
    }

    async appendTimelineEventIds(eventIds: string[]): Promise<CognitionState> {
        return this.update((state) => {
            const sanitized = eventIds.map((id) => id.trim()).filter((id) => id.length > 0);
            state.timelineEventIds = uniqueStrings([...state.timelineEventIds, ...sanitized]);
            return state;
        });
    }

    async upsertIncident(incident: unknown): Promise<CognitionState> {
        const result = validateIncidentSnapshot(incident, 'incident');
        if (!result.ok) {
            const message = result.errors.map((issue) => `${issue.path}: ${issue.message}`).join(' | ');
            throw new Error(`Cannot upsert incident: ${message}`);
        }

        const normalized = result.value;

        return this.update((state) => {
            state.incidents[normalized.incidentId] = normalized;
            return state;
        });
    }

    async removeIncident(incidentId: string): Promise<CognitionState> {
        return this.update((state) => {
            delete state.incidents[incidentId];
            return state;
        });
    }

    async replaceIncidents(incidents: CognitionIncidentSnapshot[]): Promise<CognitionState> {
        return this.update((state) => {
            const out: Record<string, CognitionIncidentSnapshot> = {};
            for (const incident of incidents) {
                out[incident.incidentId] = incident;
            }
            state.incidents = out;
            return state;
        });
    }

    getStatePath(): string {
        return this.filePath;
    }
}

export function createCognitionStateStore(options: CognitionStateStoreOptions): CognitionStateStore {
    return new CognitionStateStore(options);
}
