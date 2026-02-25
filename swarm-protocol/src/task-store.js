import fs from 'fs/promises';
import path from 'path';

const EVENT_UPSERT = 'upsert';
const EVENT_DELETE = 'delete';
const EVENT_SNAPSHOT = 'snapshot';

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

export class FileTaskStore {
    constructor({
        filePath,
        now = Date.now,
        logger = console
    }) {
        if (!filePath || typeof filePath !== 'string') {
            throw new Error('filePath is required for FileTaskStore');
        }

        this.filePath = path.resolve(filePath);
        this.now = typeof now === 'function' ? now : Date.now;
        this.logger = logger;
    }

    async _ensureParentDir() {
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
    }

    async _appendEvent(event) {
        await this._ensureParentDir();
        const line = `${JSON.stringify(event)}\n`;
        await fs.appendFile(this.filePath, line, 'utf8');
    }

    async saveRecord(record) {
        if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') {
            throw new Error('saveRecord expects a record object with taskId');
        }

        await this._appendEvent({
            type: EVENT_UPSERT,
            taskId: record.taskId,
            at: Number(this.now()),
            record: clone(record)
        });
    }

    async deleteRecord(taskId) {
        if (!taskId || typeof taskId !== 'string') {
            throw new Error('deleteRecord expects a taskId string');
        }

        await this._appendEvent({
            type: EVENT_DELETE,
            taskId,
            at: Number(this.now())
        });
    }

    _applyEvent(state, event) {
        if (!event || typeof event !== 'object') return;

        if (event.type === EVENT_SNAPSHOT && event.records && typeof event.records === 'object') {
            state.clear();
            for (const [taskId, record] of Object.entries(event.records)) {
                if (!taskId || typeof record !== 'object') continue;
                state.set(taskId, record);
            }
            return;
        }

        if (event.type === EVENT_UPSERT && event.taskId && event.record) {
            state.set(event.taskId, event.record);
            return;
        }

        if (event.type === EVENT_DELETE && event.taskId) {
            state.delete(event.taskId);
        }
    }

    async loadRecords() {
        if (!(await pathExists(this.filePath))) {
            return [];
        }

        const content = await fs.readFile(this.filePath, 'utf8');
        const lines = content.split('\n').filter((line) => line.trim());
        const state = new Map();

        for (let i = 0; i < lines.length; i++) {
            try {
                const event = JSON.parse(lines[i]);
                this._applyEvent(state, event);
            } catch (error) {
                this.logger.warn?.(
                    `[Swarm] Skipping malformed task store event at line ${i + 1}: ${error.message}`
                );
            }
        }

        return [...state.values()].map((record) => clone(record));
    }

    async compact(records) {
        const list = Array.isArray(records) ? records : [];
        const snapshot = {};
        for (const record of list) {
            if (!record || typeof record !== 'object' || typeof record.taskId !== 'string') continue;
            snapshot[record.taskId] = clone(record);
        }

        await this._ensureParentDir();
        const tempPath = `${this.filePath}.tmp`;
        const payload = `${JSON.stringify({
            type: EVENT_SNAPSHOT,
            at: Number(this.now()),
            records: snapshot
        })}\n`;

        await fs.writeFile(tempPath, payload, 'utf8');
        await fs.rename(tempPath, this.filePath);
    }
}
