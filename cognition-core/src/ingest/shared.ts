import fs from 'fs';
import path from 'path';

export interface LoadedRecord {
    value: unknown;
    sourcePath: string;
    line?: number;
}

export function expandInputPaths(paths: string[] = []): string[] {
    const expanded = new Set<string>();

    for (const inputPath of paths) {
        if (typeof inputPath !== 'string' || !inputPath.trim()) continue;
        const normalized = inputPath.startsWith('~')
            ? path.join(process.env.HOME || '', inputPath.slice(1))
            : inputPath;
        expanded.add(path.resolve(normalized));
    }

    return Array.from(expanded).sort((a, b) => a.localeCompare(b));
}

export function listFilesRecursive(targetPath: string): string[] {
    if (!fs.existsSync(targetPath)) return [];

    const stat = fs.statSync(targetPath);
    if (stat.isFile()) return [targetPath];
    if (!stat.isDirectory()) return [];

    const out: string[] = [];
    const entries = fs.readdirSync(targetPath, { withFileTypes: true })
        .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
        const abs = path.join(targetPath, entry.name);
        if (entry.isDirectory()) {
            out.push(...listFilesRecursive(abs));
        } else if (entry.isFile()) {
            out.push(abs);
        }
    }

    return out;
}

function parseJsonSafely(input: string): unknown {
    try {
        return JSON.parse(input);
    } catch {
        return null;
    }
}

export function loadRecordsFromFile(filePath: string): LoadedRecord[] {
    if (!fs.existsSync(filePath)) return [];

    const ext = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, 'utf8');

    if (ext === '.json') {
        const parsed = parseJsonSafely(content);

        if (Array.isArray(parsed)) {
            return parsed.map((value, index) => ({
                value,
                sourcePath: filePath,
                line: index + 1
            }));
        }

        if (parsed !== null) {
            return [{ value: parsed, sourcePath: filePath, line: 1 }];
        }

        return content
            .split(/\r?\n/)
            .map((line, index) => ({ line, index }))
            .filter((item) => item.line.trim())
            .map((item) => {
                const parsedLine = parseJsonSafely(item.line);
                return {
                    value: parsedLine === null ? { message: item.line } : parsedLine,
                    sourcePath: filePath,
                    line: item.index + 1
                };
            });
    }

    return content
        .split(/\r?\n/)
        .map((line, index) => ({ line, index }))
        .filter((item) => item.line.trim())
        .map((item) => {
            const parsedLine = parseJsonSafely(item.line);
            return {
                value: parsedLine === null ? { message: item.line } : parsedLine,
                sourcePath: filePath,
                line: item.index + 1
            };
        });
}

export function loadRecords(paths: string[] = []): LoadedRecord[] {
    const output: LoadedRecord[] = [];
    const expanded = expandInputPaths(paths);

    for (const inputPath of expanded) {
        const files = listFilesRecursive(inputPath).sort((a, b) => a.localeCompare(b));
        for (const file of files) {
            output.push(...loadRecordsFromFile(file));
        }
    }

    return output;
}

export function normalizeText(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.trim();
}

export function readTimestampFromRecord(record: Record<string, unknown>): unknown {
    return record.ts
        ?? record.timestamp
        ?? record.time
        ?? record.createdAt
        ?? record.updatedAt
        ?? record.date;
}

export function normalizeSeverityFromRecord(record: Record<string, unknown>, fallback = 'info'): string {
    const level = String(record.severity ?? record.level ?? fallback).trim().toLowerCase();
    if (level === 'warn') return 'warning';
    if (level === 'fatal') return 'critical';
    if (level === 'debug' || level === 'trace') return 'info';
    if (level === 'critical' || level === 'error' || level === 'warning' || level === 'info') return level;
    return fallback;
}

export function inferSeverityFromText(text: string, fallback = 'info'): string {
    const normalized = text.toLowerCase();
    if (!normalized) return fallback;
    if (/critical|panic|outage|breach/.test(normalized)) return 'critical';
    if (/error|failed|exception|disconnect/.test(normalized)) return 'error';
    if (/warn|degraded|slow|retry/.test(normalized)) return 'warning';
    return fallback;
}

export function inferRiskFromSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    if (severity === 'critical') return 'critical';
    if (severity === 'error') return 'high';
    if (severity === 'warning') return 'medium';
    return 'low';
}
