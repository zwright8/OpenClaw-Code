import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    buildTaskRequest,
    FileTaskStore
} from '../../swarm-protocol/runtime.js';
import { buildQueueRecordFromTaskRequest } from '../src/task-bundle-enqueuer.js';
import { runBotWorkerLoop } from '../src/bot-worker-loop.js';

const cwd = path.resolve(process.cwd());
const REPO_ROOT = path.basename(cwd) === 'cognition-core'
    ? path.resolve(cwd, '..')
    : cwd;

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-worker-loop-'));
}

test('runBotWorkerLoop drains queue across dispatch/process cycles with capability follow-ups', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');

    const request = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000971',
        from: 'agent:main',
        target: 'agent:cultural',
        priority: 'high',
        task: 'Evaluate cultural context window priorities',
        context: {
            planner: 'cognition-core/cognition-iteration-task-planner',
            capabilityId: 'cultural_context_window_prioritizer',
            capabilityInput: {
                contexts: [
                    {
                        contextId: 'ctx-1',
                        demand: 82,
                        capacity: 34,
                        risk: 75,
                        impact: 80,
                        readiness: 40,
                        trust: 48,
                        quality: 46
                    }
                ]
            }
        },
        createdAt: 50_000
    });

    const store = new FileTaskStore({ filePath: queuePath, now: () => 55_000 });
    await store.saveRecord(buildQueueRecordFromTaskRequest(request, {
        source: 'reports/cognition-iteration-tasks.json',
        nowFactory: () => 55_100
    }));

    const report = await runBotWorkerLoop({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        maxCycles: 8,
        idleCyclesToStop: 2,
        dispatchLimit: 20,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        enqueueFollowupTasks: true
    });

    assert.equal(report.stopReason, 'queue_drained');
    assert.ok(report.cyclesRun >= 2);
    assert.ok(report.totals.dispatched >= 1);
    assert.ok(report.totals.resultsAccepted >= 1);
    assert.ok(report.totals.followupTasksSaved >= 1);
    assert.equal(report.finalQueue.open, 0);

    const records = await store.loadRecords();
    assert.ok(records.length >= 2);
    assert.ok(records.every((entry) => entry.status === 'completed' || entry.status === 'failed' || entry.status === 'partial' || entry.status === 'rejected' || entry.status === 'timed_out' || entry.status === 'transport_error'));
});

test('runBotWorkerLoop stops on idle convergence for empty queue', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');

    const report = await runBotWorkerLoop({
        storePath: queuePath,
        outboxDir,
        maxCycles: 5,
        idleCyclesToStop: 2,
        dispatchLimit: 10,
        botRuntime: true,
        botRepoRoot: REPO_ROOT
    });

    assert.equal(report.stopReason, 'queue_drained');
    assert.equal(report.cyclesRun, 1);
    assert.equal(report.totals.dispatched, 0);
    assert.equal(report.totals.resultsAccepted, 0);
    assert.equal(report.finalQueue.total, 0);
});
