import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    analyzeMemoryDriftFromFiles,
    compareMemoryWindows,
    scanMemoryEntries
} from '../src/memory-drift.js';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-memory-drift-'));
}

test('scanMemoryEntries parses markdown files and signal counts', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    fs.writeFileSync(path.join(dir, '2026-02-20.md'), [
        '# Incident',
        '- error timeout',
        '- lesson learned',
        '- action item: fix retry policy',
        '- skill: auto-retry-and-backoff-coordinator'
    ].join('\n'));

    const entries = scanMemoryEntries(dir);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].signals.errorMentions > 0, true);
    assert.equal(entries[0].signals.lessonMentions > 0, true);
    assert.equal(entries[0].signals.skillMentions > 0, true);
});

test('compareMemoryWindows flags degrading reflection coverage', () => {
    const baseline = [
        {
            filePath: '/tmp/2026-02-10.md',
            timestampMs: Date.parse('2026-02-10T00:00:00.000Z'),
            sizeBytes: 100,
            signals: {
                errorMentions: 2,
                lessonMentions: 2,
                actionMentions: 2,
                experimentMentions: 1,
                skillMentions: 2
            }
        }
    ];

    const current = [
        {
            filePath: '/tmp/2026-02-20.md',
            timestampMs: Date.parse('2026-02-20T00:00:00.000Z'),
            sizeBytes: 100,
            signals: {
                errorMentions: 5,
                lessonMentions: 0,
                actionMentions: 0,
                experimentMentions: 0,
                skillMentions: 0
            }
        }
    ];

    const result = compareMemoryWindows(current, baseline);
    assert.ok(result.driftScore > 0);
    assert.ok(result.driftLevel === 'watch' || result.driftLevel === 'critical');
    assert.ok(result.deltas.reflectionCoverage < 0);
});

test('analyzeMemoryDriftFromFiles compares current and baseline windows', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    fs.writeFileSync(path.join(dir, '2026-02-10.md'), '- error\n- lesson learned\n- action item: fix');
    fs.writeFileSync(path.join(dir, '2026-02-20.md'), '- error\n- error\n- timeout');
    fs.writeFileSync(path.join(dir, '2026-02-21.md'), '- error\n- failure');

    const report = analyzeMemoryDriftFromFiles(dir, {
        currentStartMs: Date.parse('2026-02-19T00:00:00.000Z'),
        currentEndMs: Date.parse('2026-02-22T00:00:00.000Z'),
        baselineStartMs: Date.parse('2026-02-09T00:00:00.000Z'),
        baselineEndMs: Date.parse('2026-02-12T00:00:00.000Z')
    });

    assert.equal(report.currentEntries, 2);
    assert.equal(report.baselineEntries, 1);
    assert.ok(['stable', 'watch', 'critical', 'improving'].includes(report.driftLevel));
    assert.ok(Array.isArray(report.recommendedActions));
});
