import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    backfillMemoryEntrySections,
    backfillMemoryGuardrailSections,
    buildMemoryEntryTemplate,
    ensureMemoryTemplateFile,
    scanMemoryGuardrails
} from '../src/memory-guardrails.js';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-memory-guardrails-'));
}

test('buildMemoryEntryTemplate includes required sections', () => {
    const template = buildMemoryEntryTemplate({ date: '2026-02-26' });
    assert.ok(template.includes('## Incident Signals'));
    assert.ok(template.includes('## Root Cause'));
    assert.ok(template.includes('## Lessons Learned'));
    assert.ok(template.includes('## Action Items'));
    assert.ok(template.includes('## Skill Tags'));
});

test('ensureMemoryTemplateFile writes template and respects overwrite guard', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    const filePath = path.join(dir, 'template.md');

    const first = ensureMemoryTemplateFile(filePath, { date: '2026-02-26' });
    assert.equal(first.written, true);
    assert.ok(fs.existsSync(filePath));

    const second = ensureMemoryTemplateFile(filePath, { date: '2026-02-27' });
    assert.equal(second.written, false);
    assert.equal(second.reason, 'exists');

    const third = ensureMemoryTemplateFile(filePath, { overwrite: true, date: '2026-02-27' });
    assert.equal(third.written, true);
});

test('scanMemoryGuardrails reports compliance and missing sections', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    fs.writeFileSync(path.join(dir, 'good.md'), [
        '# Good',
        '## Incident Signals',
        '- timeout',
        '## Root Cause',
        '- transport fail',
        '## Lessons Learned',
        '- use fallback',
        '## Action Items',
        '- add retries',
        '## Skill Tags',
        '- auto-retry-and-backoff-coordinator'
    ].join('\n'));

    fs.writeFileSync(path.join(dir, 'bad.md'), [
        '# Bad',
        '## Incident Signals',
        '- bug',
        '## Action Items',
        '- fix'
    ].join('\n'));

    const report = scanMemoryGuardrails(dir);
    assert.equal(report.totals.entries, 2);
    assert.ok(report.totals.complianceRate < 1);
    assert.ok(report.missingSectionCounts['Root Cause'] >= 1);
    assert.ok(['pass', 'warn', 'fail'].includes(report.status));
    assert.ok(Array.isArray(report.topNonCompliant));
});

test('non-incident entries do not hard-fail by default', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    fs.writeFileSync(path.join(dir, 'note.md'), [
        '# Daily Note',
        '## Highlights',
        '- shipped feature'
    ].join('\n'));

    const report = scanMemoryGuardrails(dir);
    assert.equal(report.totals.withErrorSignals, 0);
    assert.notEqual(report.status, 'fail');
});

test('backfillMemoryEntrySections appends missing headings', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    const filePath = path.join(dir, 'entry.md');
    fs.writeFileSync(filePath, '# Entry\n\n## Lessons Learned\n- x\n');

    const result = backfillMemoryEntrySections(filePath, ['Action Items', 'Skill Tags']);
    assert.equal(result.updated, true);

    const updated = fs.readFileSync(filePath, 'utf8');
    assert.ok(updated.includes('## Action Items'));
    assert.ok(updated.includes('## Skill Tags'));
});

test('backfillMemoryGuardrailSections updates top non-compliant files', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    fs.writeFileSync(path.join(dir, 'one.md'), '# A\n\n## Lessons Learned\n- x\n');
    fs.writeFileSync(path.join(dir, 'two.md'), '# B\n\n## Lessons Learned\n- y\n');

    const dryRun = backfillMemoryGuardrailSections(dir, { dryRun: true, maxUpdates: 1 });
    assert.equal(dryRun.updatedFiles, 1);
    assert.equal(dryRun.after.status, dryRun.before.status);

    const applied = backfillMemoryGuardrailSections(dir, { dryRun: false, maxUpdates: 2 });
    assert.ok(applied.updatedFiles >= 1);
    assert.ok(['pass', 'warn', 'fail'].includes(applied.after.status));
});
