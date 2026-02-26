import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { LogAnalyzerV2, buildComparison, buildRemediationPlan } from '../src/log-analyzer-v2.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-core-'));
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeJsonl(filePath, lines) {
    fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

test('uses sessionId fallback and tracks malformed lines and tool errors', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const now = Date.now() - 5_000;
    const sessionId = '11111111-1111-4111-8111-111111111111';
    const sessionFile = path.join(dir, `${sessionId}.jsonl`);
    const sessionsFile = path.join(dir, 'sessions.json');

    writeJsonl(sessionFile, [
        JSON.stringify({
            type: 'message',
            timestamp: new Date(now).toISOString(),
            message: {
                role: 'assistant',
                content: [{ type: 'toolCall', name: 'exec' }],
                model: 'gemini-3-flash-preview',
                provider: 'google',
                stopReason: 'toolUse',
                timestamp: now
            }
        }),
        JSON.stringify({
            type: 'message',
            message: {
                role: 'toolResult',
                toolName: 'exec',
                isError: true,
                details: { durationMs: 250 },
                timestamp: now
            }
        }),
        '{this-is-not-json'
    ]);

    writeJson(sessionsFile, {
        'agent:main:test': {
            sessionId,
            updatedAt: now
        }
    });

    const analyzer = new LogAnalyzerV2(sessionsFile);
    await analyzer.analyze(1);
    const summary = analyzer.toJSON();

    assert.equal(summary.sessionsScanned, 1);
    assert.equal(summary.sessionsMissingFile, 0);
    assert.equal(summary.toolCalls, 1);
    assert.equal(summary.toolResults, 1);
    assert.equal(summary.errors, 1);
    assert.equal(summary.malformedLines, 1);
    assert.equal(summary.tools.exec.calls, 1);
    assert.equal(summary.tools.exec.errors, 1);
    assert.equal(summary.tools.exec.avgDurationMs, 250);
    assert.equal(summary.stopReasons.toolUse, 1);
    assert.equal(summary.providers.google, 1);
    assert.ok(summary.reliabilityScore >= 0 && summary.reliabilityScore <= 100);
});

test('dedupes repeated session files and skips old sessions', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const now = Date.now() - 5_000;
    const sessionId = '22222222-2222-4222-8222-222222222222';
    const sessionFile = path.join(dir, `${sessionId}.jsonl`);
    const oldSessionFile = path.join(dir, 'old-session.jsonl');
    const sessionsFile = path.join(dir, 'sessions.json');

    writeJsonl(sessionFile, [
        JSON.stringify({
            type: 'message',
            message: {
                role: 'assistant',
                content: [{ type: 'toolCall', name: 'read' }],
                timestamp: now
            }
        })
    ]);
    writeJsonl(oldSessionFile, []);

    writeJson(sessionsFile, {
        'agent:main:one': {
            sessionId,
            updatedAt: now
        },
        'agent:main:two': {
            sessionFile,
            updatedAt: now
        },
        'agent:main:old': {
            sessionFile: oldSessionFile,
            updatedAt: now - (10 * DAY_MS)
        }
    });

    const analyzer = new LogAnalyzerV2(sessionsFile);
    await analyzer.analyze(1);
    const summary = analyzer.toJSON();

    assert.equal(summary.sessionsDiscovered, 1);
    assert.equal(summary.sessionsScanned, 1);
    assert.equal(summary.sessionsDeduped, 1);
    assert.equal(summary.sessionsSkippedOld, 1);
    assert.equal(summary.toolCalls, 1);
    assert.equal(summary.tools.read.calls, 1);
});

test('respects session limit after recency sort', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const now = Date.now() - 5_000;
    const recentSession = '33333333-3333-4333-8333-333333333333';
    const olderSession = '44444444-4444-4444-8444-444444444444';
    const recentPath = path.join(dir, `${recentSession}.jsonl`);
    const olderPath = path.join(dir, `${olderSession}.jsonl`);
    const sessionsFile = path.join(dir, 'sessions.json');

    writeJsonl(recentPath, [
        JSON.stringify({
            type: 'message',
            message: {
                role: 'assistant',
                content: [{ type: 'toolCall', name: 'exec' }],
                timestamp: now
            }
        })
    ]);
    writeJsonl(olderPath, [
        JSON.stringify({
            type: 'message',
            message: {
                role: 'assistant',
                content: [{ type: 'toolCall', name: 'read' }],
                timestamp: now
            }
        })
    ]);

    writeJson(sessionsFile, {
        'agent:main:recent': {
            sessionId: recentSession,
            updatedAt: now
        },
        'agent:main:older': {
            sessionId: olderSession,
            updatedAt: now - 1_000
        }
    });

    const analyzer = new LogAnalyzerV2(sessionsFile);
    await analyzer.analyze(1, { limitSessions: 1 });
    const summary = analyzer.toJSON();

    assert.equal(summary.sessionsDiscovered, 2);
    assert.equal(summary.sessionsScanned, 1);
    assert.equal(summary.sessionsLimited, 1);
    assert.equal(summary.toolCalls, 1);
    assert.equal(summary.tools.exec.calls, 1);
    assert.equal(summary.tools.read, undefined);
});

test('supports explicit time windows and tracks future/old skips', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const anchor = Date.now();
    const start = anchor - (2 * 60 * 60 * 1000);
    const end = anchor - (60 * 60 * 1000);
    const sessionsFile = path.join(dir, 'sessions.json');

    const inRangeId = '55555555-5555-4555-8555-555555555555';
    const oldId = '66666666-6666-4666-8666-666666666666';
    const futureId = '77777777-7777-4777-8777-777777777777';

    writeJsonl(path.join(dir, `${inRangeId}.jsonl`), [
        JSON.stringify({
            type: 'message',
            message: {
                role: 'assistant',
                content: [{ type: 'toolCall', name: 'exec' }],
                timestamp: start + 5_000
            }
        })
    ]);
    writeJsonl(path.join(dir, `${oldId}.jsonl`), []);
    writeJsonl(path.join(dir, `${futureId}.jsonl`), []);

    writeJson(sessionsFile, {
        inRange: { sessionId: inRangeId, updatedAt: start + 1_000 },
        old: { sessionId: oldId, updatedAt: start - 1_000 },
        future: { sessionId: futureId, updatedAt: end + 1_000 }
    });

    const analyzer = new LogAnalyzerV2(sessionsFile);
    await analyzer.analyze(1, { rangeStartMs: start, rangeEndMs: end });
    const summary = analyzer.toJSON();

    assert.equal(summary.sessionsScanned, 1);
    assert.equal(summary.sessionsSkippedOld, 1);
    assert.equal(summary.sessionsSkippedFuture, 1);
    assert.equal(summary.toolCalls, 1);
    assert.equal(summary.tools.exec.calls, 1);
    assert.equal(summary.startIso, new Date(start).toISOString());
    assert.equal(summary.endIso, new Date(end).toISOString());
});

test('builds trend comparison and prioritized remediation plan', () => {
    const current = {
        startIso: '2026-02-20T00:00:00.000Z',
        endIso: '2026-02-27T00:00:00.000Z',
        windowDays: 7,
        reliabilityScore: 82,
        errors: 6,
        toolCalls: 40,
        toolResults: 30,
        malformedLines: 2,
        sessionsMissingFile: 1,
        tools: {
            exec: {
                calls: 20,
                errors: 6,
                results: 18,
                avgDurationMs: 4200,
                errorRate: 30
            },
            read: {
                calls: 10,
                errors: 0,
                results: 0,
                avgDurationMs: null,
                errorRate: 0
            }
        }
    };
    const baseline = {
        startIso: '2026-02-13T00:00:00.000Z',
        endIso: '2026-02-20T00:00:00.000Z',
        windowDays: 7,
        reliabilityScore: 93,
        errors: 1,
        toolCalls: 35,
        toolResults: 32,
        malformedLines: 0,
        sessionsMissingFile: 0,
        tools: {
            exec: {
                calls: 18,
                errors: 1,
                results: 18,
                avgDurationMs: 1200,
                errorRate: 5.56
            },
            read: {
                calls: 12,
                errors: 0,
                results: 0,
                avgDurationMs: null,
                errorRate: 0
            }
        }
    };

    const comparison = buildComparison(current, baseline);
    assert.equal(comparison.status, 'regressing');
    assert.ok(comparison.kpis.reliabilityScore.delta < 0);
    assert.ok(comparison.topRegressions.length > 0);
    assert.equal(comparison.topRegressions[0].tool, 'exec');
    assert.ok(comparison.topRegressions[0].errorRateDelta > 0);

    const remediation = buildRemediationPlan(current, comparison);
    assert.ok(remediation.length > 0);
    assert.equal(remediation[0].priority, 'P1');
    assert.ok(remediation.some((item) => item.title.includes('exec')));
});
