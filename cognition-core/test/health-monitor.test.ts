import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readLatestWorkerLoopCheckpoint } from '../scripts/health-monitor.ts';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-health-monitor-'));
}

test('readLatestWorkerLoopCheckpoint summarizes lifecycle resume metadata', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const reportPath = path.join(dir, 'bot-worker-loop.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        stopReason: 'awaiting_approval_only',
        lifecycleCheckpoint: {
            schemaVersion: 'bot-worker-loop.lifecycle.v1',
            nextAction: 'review_pending_approvals',
            resumeRecommended: true,
            resumeKey: 'review_pending_approvals:1234567890abcdef',
            stateFingerprint: '1234567890abcdef',
            attentionReasons: ['pending_approval'],
            queue: {
                open: 2,
                awaitingApproval: 2
            }
        }
    }));

    const result = readLatestWorkerLoopCheckpoint(reportPath);

    assert.equal(result.ok, true);
    assert.equal(result.stopReason, 'awaiting_approval_only');
    assert.equal(result.nextAction, 'review_pending_approvals');
    assert.equal(result.resumeRecommended, true);
    assert.equal(result.resumeKey, 'review_pending_approvals:1234567890abcdef');
    assert.equal(result.stateFingerprint, '1234567890abcdef');
    assert.deepEqual(result.attentionReasons, ['pending_approval']);
    assert.deepEqual(result.queue, {
        open: 2,
        awaitingApproval: 2
    });
});

test('readLatestWorkerLoopCheckpoint reports missing report', () => {
    const reportPath = path.join(os.tmpdir(), 'missing-bot-worker-loop-report.json');
    const result = readLatestWorkerLoopCheckpoint(reportPath);

    assert.equal(result.ok, false);
    assert.equal(result.reason, 'report_missing');
    assert.equal(result.reportPath, reportPath);
});

test('readLatestWorkerLoopCheckpoint reports invalid json', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const reportPath = path.join(dir, 'bot-worker-loop.json');
    fs.writeFileSync(reportPath, '{not json');

    const result = readLatestWorkerLoopCheckpoint(reportPath);

    assert.equal(result.ok, false);
    assert.equal(result.reason, 'report_invalid_json');
    assert.equal(result.reportPath, reportPath);
    assert.match(result.detail, /JSON/);
});

test('readLatestWorkerLoopCheckpoint reports missing checkpoint', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const reportPath = path.join(dir, 'bot-worker-loop.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        stopReason: 'queue_drained'
    }));

    const result = readLatestWorkerLoopCheckpoint(reportPath);

    assert.equal(result.ok, false);
    assert.equal(result.reason, 'checkpoint_missing');
    assert.equal(result.reportPath, reportPath);
});
