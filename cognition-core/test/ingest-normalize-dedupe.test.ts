import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ingestGatewaySignals } from '../src/ingest/gateway-ingest.js';
import { ingestRuntimeSignals } from '../src/ingest/runtime-ingest.js';
import { ingestBusinessSignals } from '../src/ingest/business-ingest.js';
import { normalizeEventBatch } from '../src/normalize/event-normalizer.js';
import { enrichEvents } from '../src/normalize/enrichment.js';
import { dedupeEvents } from '../src/normalize/dedupe.js';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-ingest-'));
}

function writeJson(filePath: string, value: unknown) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath: string, values: unknown[]) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const content = values.map((value) => JSON.stringify(value)).join('\n');
    fs.writeFileSync(filePath, `${content}\n`);
}

test('runtime ingest expands sessions index and maps tool events', () => {
    const dir = mkTmpDir();
    const now = Date.now() - 5_000;

    try {
        const sessionsFile = path.join(dir, 'sessions.json');
        const sessionId = 'aaaa1111-bbbb-4222-8333-ccccdddd0001';
        const sessionPath = path.join(dir, `${sessionId}.jsonl`);

        writeJsonl(sessionPath, [
            {
                type: 'message',
                timestamp: now,
                message: {
                    role: 'assistant',
                    timestamp: now,
                    content: [{ type: 'toolCall', name: 'read' }],
                    model: 'gpt-5.3',
                    provider: 'openai'
                }
            },
            {
                type: 'message',
                timestamp: now + 10,
                message: {
                    role: 'toolResult',
                    timestamp: now + 10,
                    toolName: 'read',
                    isError: false,
                    details: {
                        durationMs: 87
                    }
                }
            }
        ]);

        writeJson(sessionsFile, {
            'agent:main:main': {
                sessionId,
                updatedAt: now
            }
        });

        const runtime = ingestRuntimeSignals({ paths: [sessionsFile], sinceMs: now - 1_000 });

        assert.equal(runtime.length, 2);
        assert.equal(runtime[0].source, 'runtime');
        assert.ok(runtime.some((event) => event.type === 'runtime.tool_call'));
        assert.ok(runtime.some((event) => event.type === 'runtime.tool_result'));
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test('ingest + normalize + dedupe pipeline is deterministic and ordered', () => {
    const dir = mkTmpDir();
    const baseTs = Date.now() - 60_000;

    try {
        const gatewayPath = path.join(dir, 'gateway.jsonl');
        const runtimePath = path.join(dir, 'runtime.jsonl');
        const businessPath = path.join(dir, 'business.json');

        const duplicateGateway = {
            timestamp: baseTs + 2_000,
            type: 'disconnect',
            level: 'error',
            gatewayId: 'gw-1',
            message: 'Gateway disconnected from upstream control plane'
        };

        writeJsonl(gatewayPath, [duplicateGateway, duplicateGateway]);
        writeJsonl(runtimePath, [
            {
                timestamp: baseTs,
                type: 'message',
                message: {
                    role: 'assistant',
                    timestamp: baseTs,
                    content: [{ type: 'toolCall', name: 'exec' }],
                    provider: 'openai',
                    model: 'gpt-5.3'
                }
            },
            {
                timestamp: baseTs + 1_000,
                type: 'message',
                message: {
                    role: 'toolResult',
                    timestamp: baseTs + 1_000,
                    toolName: 'exec',
                    isError: true,
                    details: {
                        durationMs: 301
                    }
                }
            }
        ]);
        writeJson(businessPath, [
            {
                timestamp: baseTs + 3_000,
                domain: 'revenue',
                amount: -120000,
                currency: 'USD',
                customerId: 'acct-77',
                message: 'ARR drop after enterprise churn'
            }
        ]);

        const rawGateway = ingestGatewaySignals({ paths: [gatewayPath] });
        const rawRuntime = ingestRuntimeSignals({ paths: [runtimePath] });
        const rawBusiness = ingestBusinessSignals({ paths: [businessPath] });
        const rawSignals = [...rawBusiness, ...rawGateway, ...rawRuntime];

        assert.equal(rawSignals.length, 5);

        const normalizedA = normalizeEventBatch(rawSignals);
        const normalizedB = normalizeEventBatch(rawSignals);

        assert.deepEqual(normalizedA, normalizedB);
        assert.equal(normalizedA[0].ts, baseTs);
        assert.equal(normalizedA[normalizedA.length - 1].ts, baseTs + 3_000);

        const enriched = enrichEvents(normalizedA);
        assert.ok(enriched.every((event) => event.entities.length > 0));

        const deduped = dedupeEvents(enriched);

        assert.equal(deduped.duplicates, 1);
        assert.equal(deduped.events.length, 4);
        assert.ok(deduped.events.every((event) => event.eventId));

        const eventIds = deduped.events.map((event) => event.eventId);
        const sortedEventIds = [...eventIds].sort((a, b) => a.localeCompare(b));
        assert.notDeepEqual(eventIds, sortedEventIds, 'events should be ordered by timeline, not eventId');
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
