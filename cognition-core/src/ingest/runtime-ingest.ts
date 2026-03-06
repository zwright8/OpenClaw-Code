import fs from 'fs';
import path from 'path';
import { type RawSignal } from '../normalize/event-normalizer.js';
import {
    inferRiskFromSeverity,
    loadRecords,
    loadRecordsFromFile,
    normalizeSeverityFromRecord,
    normalizeText,
    readTimestampFromRecord
} from './shared.js';

export interface RuntimeIngestOptions {
    paths?: string[];
    sinceMs?: number;
}

interface RuntimeRecord {
    value: unknown;
    sourcePath: string;
    line?: number;
    sessionId?: string;
}

function isSessionsIndex(payload: Record<string, unknown>): boolean {
    const values = Object.values(payload);
    if (values.length === 0) return false;

    return values.every((value) => {
        if (!value || typeof value !== 'object') return false;
        const meta = value as Record<string, unknown>;
        return Boolean(meta.sessionId || meta.sessionFile);
    });
}

function collectRuntimeRecords(paths: string[] = []): RuntimeRecord[] {
    const direct = loadRecords(paths).map((entry) => ({
        ...entry,
        sessionId: undefined
    }));

    const expanded: RuntimeRecord[] = [];

    for (const record of direct) {
        if (!record.value || typeof record.value !== 'object') {
            expanded.push(record);
            continue;
        }

        const payload = record.value as Record<string, unknown>;
        if (!isSessionsIndex(payload)) {
            expanded.push(record);
            continue;
        }

        const baseDir = path.dirname(record.sourcePath);
        for (const [agentId, metaValue] of Object.entries(payload)) {
            const meta = (metaValue || {}) as Record<string, unknown>;
            const sessionId = normalizeText(meta.sessionId) || agentId;
            const sessionFile = normalizeText(meta.sessionFile)
                || (sessionId ? path.join(baseDir, `${sessionId}.jsonl`) : '');

            if (!sessionFile || !fs.existsSync(sessionFile)) continue;

            const sessionRecords = loadRecordsFromFile(sessionFile);
            for (const sessionRecord of sessionRecords) {
                expanded.push({
                    ...sessionRecord,
                    sessionId
                });
            }
        }
    }

    return expanded;
}

function inferRuntimeType(payload: Record<string, unknown>): string {
    const explicitType = normalizeText(payload.type);
    if (explicitType && explicitType !== 'message') {
        return explicitType.startsWith('runtime.') ? explicitType : `runtime.${explicitType.toLowerCase()}`;
    }

    const message = payload.message;
    if (message && typeof message === 'object') {
        const msg = message as Record<string, unknown>;
        const role = normalizeText(msg.role).toLowerCase();

        if (role === 'toolresult' || role === 'tool_result') {
            return Boolean(msg.isError) ? 'runtime.tool_error' : 'runtime.tool_result';
        }

        if (role === 'assistant' && Array.isArray(msg.content)) {
            const hasToolCall = msg.content.some((part) => {
                if (!part || typeof part !== 'object') return false;
                const partObj = part as Record<string, unknown>;
                const kind = normalizeText(partObj.type).toLowerCase();
                return kind === 'toolcall' || kind === 'tool_call' || kind === 'function_call';
            });
            if (hasToolCall) return 'runtime.tool_call';
            return 'runtime.assistant_message';
        }

        if (role === 'user') return 'runtime.user_message';
        if (role === 'system') return 'runtime.system_message';
    }

    if (payload.outcome && typeof payload.outcome === 'object') {
        return 'runtime.subagent_outcome';
    }

    return 'runtime.event';
}

function inferRuntimeSeverity(payload: Record<string, unknown>, type: string): string {
    const base = normalizeSeverityFromRecord(payload);
    if (type === 'runtime.tool_error') return 'error';

    const message = payload.message;
    if (message && typeof message === 'object') {
        const msg = message as Record<string, unknown>;
        if (msg.isError) return 'error';
        if (normalizeText(msg.stopReason).toLowerCase() === 'error') return 'error';
    }

    return base;
}

function extractRuntimeEntities(payload: Record<string, unknown>, sessionId?: string): string[] {
    const entities = new Set<string>();

    if (sessionId) entities.add(sessionId);

    const message = payload.message;
    if (message && typeof message === 'object') {
        const msg = message as Record<string, unknown>;
        const toolName = normalizeText(msg.toolName);
        if (toolName) entities.add(`tool:${toolName}`);

        const model = normalizeText(msg.model);
        if (model) entities.add(`model:${model}`);

        const provider = normalizeText(msg.provider);
        if (provider) entities.add(`provider:${provider}`);

        const role = normalizeText(msg.role);
        if (role) entities.add(`role:${role}`);
    }

    const agentId = normalizeText(payload.agentId ?? payload.target ?? payload.owner);
    if (agentId) entities.add(agentId);

    return Array.from(entities).sort((a, b) => a.localeCompare(b));
}

export function ingestRuntimeSignals(options: RuntimeIngestOptions = {}): RawSignal[] {
    const records = collectRuntimeRecords(options.paths || []);
    const output: RawSignal[] = [];

    for (const record of records) {
        if (!record.value || typeof record.value !== 'object') continue;

        const payload = record.value as Record<string, unknown>;
        const type = inferRuntimeType(payload);
        const severity = inferRuntimeSeverity(payload, type);
        const ts = readTimestampFromRecord(payload)
            ?? (payload.message && typeof payload.message === 'object'
                ? readTimestampFromRecord(payload.message as Record<string, unknown>)
                : undefined);

        const normalizedTs = Number(
            typeof ts === 'number' ? (ts < 1e12 ? ts * 1000 : ts) : Date.parse(String(ts || ''))
        );

        if (Number.isFinite(Number(options.sinceMs)) && Number.isFinite(normalizedTs) && normalizedTs < Number(options.sinceMs)) {
            continue;
        }

        output.push({
            source: 'runtime',
            type,
            ts,
            severity,
            entities: extractRuntimeEntities(payload, record.sessionId),
            payload: {
                ...payload,
                __meta: {
                    sourcePath: record.sourcePath,
                    line: record.line,
                    sessionId: record.sessionId
                }
            },
            confidence: type === 'runtime.tool_error' ? 0.9 : 0.85,
            riskTier: inferRiskFromSeverity(severity)
        });
    }

    return output;
}
