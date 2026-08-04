import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    inspectOpenClawHealth,
    readLatestWorkerLoopCheckpoint
} from '../scripts/health-monitor.ts';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-health-monitor-'));
}

const SCRIPT_PATH = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../scripts/health-monitor.ts'
);

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
            lastCycle: {
                finishedAt: 100_000
            },
            queue: {
                open: 2,
                awaitingApproval: 2
            }
        }
    }));

    const result = readLatestWorkerLoopCheckpoint(reportPath, {
        now: 100_000
    });

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
    assert.deepEqual(result.freshness, {
        status: 'fresh',
        observedAt: 100_000,
        ageMs: 0,
        approvalSloMs: 1_800_000
    });
});

test('readLatestWorkerLoopCheckpoint marks old approval checkpoints stale', (t) => {
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
            lastCycle: {
                finishedAt: 100_000
            },
            queue: {
                open: 1,
                awaitingApproval: 1
            }
        }
    }));

    const result = readLatestWorkerLoopCheckpoint(reportPath, {
        now: 131_000,
        approvalSloMs: 30_000
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.freshness, {
        status: 'stale',
        observedAt: 100_000,
        ageMs: 31_000,
        approvalSloMs: 30_000
    });
});

test('readLatestWorkerLoopCheckpoint reports unknown freshness without timestamps', (t) => {
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
                open: 1,
                awaitingApproval: 1
            }
        }
    }));

    const result = readLatestWorkerLoopCheckpoint(reportPath, {
        now: 131_000,
        approvalSloMs: 30_000
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.freshness, {
        status: 'unknown',
        observedAt: null,
        ageMs: null,
        approvalSloMs: 30_000
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

test('inspectOpenClawHealth returns machine-readable gateway and worker status', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const logPath = path.join(dir, 'gateway.log');
    const reportPath = path.join(dir, 'bot-worker-loop.json');
    const now = Date.now();

    fs.writeFileSync(logPath, [
        '2026-06-07T00:00:00Z WhatsApp gateway connected',
        '2026-06-07T00:01:00Z WhatsApp gateway healthy'
    ].join('\n'));
    fs.writeFileSync(reportPath, JSON.stringify({
        stopReason: 'queue_drained',
        lifecycleCheckpoint: {
            schemaVersion: 'bot-worker-loop.lifecycle.v1',
            nextAction: 'no_resume_needed',
            resumeRecommended: false,
            resumeKey: 'no_resume_needed:1234567890abcdef',
            stateFingerprint: '1234567890abcdef',
            attentionReasons: [],
            lastCycle: {
                finishedAt: now
            },
            queue: {
                open: 0,
                awaitingApproval: 0
            }
        }
    }));

    const result = inspectOpenClawHealth({
        logPath,
        workerReportPath: reportPath,
        now
    });

    assert.equal(result.schemaVersion, 'openclaw.health.v1');
    assert.equal(result.inspectedAt, now);
    assert.equal(result.status, 'ok');
    assert.deepEqual(result.attention, []);
    assert.equal(result.gateway.ok, true);
    assert.match(result.gateway.status, /WhatsApp gateway healthy/);
    assert.equal(result.workerLoop.ok, true);
    assert.equal(result.workerLoop.nextAction, 'no_resume_needed');
    assert.equal(result.workerLoop.freshness.status, 'fresh');
});

test('inspectOpenClawHealth does not alert on stale drained worker checkpoint', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const logPath = path.join(dir, 'gateway.log');
    const reportPath = path.join(dir, 'bot-worker-loop.json');

    fs.writeFileSync(logPath, '2026-06-07T00:01:00Z WhatsApp gateway healthy\n');
    fs.writeFileSync(reportPath, JSON.stringify({
        stopReason: 'queue_drained',
        lifecycleCheckpoint: {
            schemaVersion: 'bot-worker-loop.lifecycle.v1',
            nextAction: 'no_resume_needed',
            resumeRecommended: false,
            resumeKey: 'no_resume_needed:1234567890abcdef',
            stateFingerprint: '1234567890abcdef',
            attentionReasons: [],
            lastCycle: {
                finishedAt: 100_000
            },
            queue: {
                open: 0,
                awaitingApproval: 0
            }
        }
    }));

    const result = inspectOpenClawHealth({
        logPath,
        workerReportPath: reportPath,
        now: 2_000_000,
        approvalSloMs: 30_000
    });

    assert.equal(result.workerLoop.freshness.status, 'stale');
    assert.equal(result.status, 'ok');
    assert.deepEqual(result.attention, []);
});

test('inspectOpenClawHealth surfaces an over-age open task', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const logPath = path.join(dir, 'gateway.log');
    const reportPath = path.join(dir, 'bot-worker-loop.json');
    fs.writeFileSync(logPath, '2026-06-07T00:01:00Z WhatsApp gateway healthy\n');
    fs.writeFileSync(reportPath, JSON.stringify({
        stopReason: 'max_cycles_reached',
        lifecycleCheckpoint: {
            nextAction: 'rerun_dispatcher',
            resumeRecommended: true,
            attentionReasons: ['pending_created_tasks'],
            lastCycle: { finishedAt: 100_000 },
            queue: {
                open: 1,
                created: 1,
                openAgeMs: { oldest: 5_000, average: 5_000, p95: 5_000 }
            }
        }
    }));

    const result = inspectOpenClawHealth({
        logPath,
        workerReportPath: reportPath,
        now: 100_000,
        queueAgeSloMs: 4_000
    });

    assert.equal(result.status, 'attention');
    assert.equal(result.queueAgeSloMs, 4_000);
    assert.deepEqual(result.attention, [
        'worker_loop_resume_rerun_dispatcher',
        'worker_loop_open_task_age_slo_exceeded',
        'worker_loop_pending_created_tasks'
    ]);
    assert.deepEqual(result.workerLoop.queue.openAgeMs, {
        oldest: 5_000,
        average: 5_000,
        p95: 5_000
    });
});

test('health-monitor --json emits parseable machine-readable health status', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const logPath = path.join(dir, 'gateway.log');
    const reportPath = path.join(dir, 'bot-worker-loop.json');

    fs.writeFileSync(logPath, '2026-06-07T00:01:00Z WhatsApp gateway healthy\n');
    fs.writeFileSync(reportPath, JSON.stringify({
        stopReason: 'queue_drained',
        lifecycleCheckpoint: {
            schemaVersion: 'bot-worker-loop.lifecycle.v1',
            nextAction: 'no_resume_needed',
            resumeRecommended: false,
            resumeKey: 'no_resume_needed:1234567890abcdef',
            stateFingerprint: '1234567890abcdef',
            attentionReasons: [],
            lastCycle: {
                finishedAt: Date.now()
            },
            queue: {
                open: 0,
                awaitingApproval: 0
            }
        }
    }));

    const result = spawnSync('npx', ['tsx', SCRIPT_PATH, '--json'], {
        cwd: path.dirname(SCRIPT_PATH),
        env: {
            ...process.env,
            OPENCLAW_GATEWAY_LOG: logPath,
            OPENCLAW_WORKER_LOOP_REPORT: reportPath
        },
        encoding: 'utf8'
    });

    assert.equal(result.status, 0, result.stderr);
    const parsed = JSON.parse(result.stdout);
    assert.equal(parsed.schemaVersion, 'openclaw.health.v1');
    assert.equal(parsed.status, 'ok');
    assert.deepEqual(parsed.attention, []);
    assert.equal(parsed.gateway.ok, true);
    assert.equal(parsed.workerLoop.nextAction, 'no_resume_needed');
});

test('inspectOpenClawHealth reports worker attention even when gateway log is missing', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const logPath = path.join(dir, 'missing-gateway.log');
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
            lastCycle: {
                finishedAt: 100_000
            },
            queue: {
                open: 1,
                awaitingApproval: 1
            }
        }
    }));

    const result = inspectOpenClawHealth({
        logPath,
        workerReportPath: reportPath,
        now: 131_000,
        approvalSloMs: 30_000
    });

    assert.equal(result.status, 'degraded');
    assert.deepEqual(result.attention, [
        'gateway_log_missing',
        'worker_loop_resume_review_pending_approvals',
        'worker_loop_checkpoint_stale',
        'worker_loop_pending_approval'
    ]);
    assert.equal(result.gateway.ok, false);
    assert.equal(result.gateway.reason, 'log_missing');
    assert.equal(result.workerLoop.ok, true);
    assert.equal(result.workerLoop.nextAction, 'review_pending_approvals');
    assert.equal(result.workerLoop.freshness.status, 'stale');
});

test('health-monitor text output does not hide worker checkpoint when gateway log is missing', (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const logPath = path.join(dir, 'missing-gateway.log');
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
            lastCycle: {
                finishedAt: Date.now() - 31_000
            },
            queue: {
                open: 1,
                awaitingApproval: 1
            }
        }
    }));

    const result = spawnSync('npx', ['tsx', SCRIPT_PATH], {
        cwd: path.dirname(SCRIPT_PATH),
        env: {
            ...process.env,
            OPENCLAW_GATEWAY_LOG: logPath,
            OPENCLAW_WORKER_LOOP_REPORT: reportPath,
            OPENCLAW_WORKER_APPROVAL_SLO_MS: '30000'
        },
        encoding: 'utf8'
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /No gateway status available \(log_missing\)/);
    assert.match(result.stdout, /Worker loop next action: review_pending_approvals/);
    assert.match(result.stdout, /Worker loop approval pause is stale/);
});
