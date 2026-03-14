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
import { processOutboxEnvelopes } from '../src/outbox-processor.js';

const cwd = path.resolve(process.cwd());
const REPO_ROOT = path.basename(cwd) === 'cognition-core'
    ? path.resolve(cwd, '..')
    : cwd;

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-outbox-'));
}

function targetToFile(target) {
    return `${target.replace(/[^a-z0-9._-]+/gi, '_')}.jsonl`;
}

function createEnvelope({ target, request, sentAt = 1_000 }) {
    return {
        kind: 'task_dispatch_envelope',
        target,
        sentAt,
        message: request
    };
}

function makeRequest(
    id,
    target = 'agent:ops',
    priority = 'high',
    context = { planner: 'cognition-core/remediation-task-planner' }
) {
    return buildTaskRequest({
        id,
        from: 'agent:main',
        target,
        priority,
        task: `Task ${id}`,
        context,
        createdAt: 50_000
    });
}

test('processOutboxEnvelopes ingests receipt/result and archives processed files', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000301', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 60_000 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 60_001
    });
    record.status = 'dispatched';
    record.attempts = 1;
    record.updatedAt = 60_002;
    await store.saveRecord(record);

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${JSON.stringify(createEnvelope({ target, request }))}\n`,
        'utf8'
    );

    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: false
    });

    assert.equal(stats.filesFound, 1);
    assert.equal(stats.filesArchived, 1);
    assert.equal(stats.receiptsAccepted, 1);
    assert.equal(stats.resultsAccepted, 1);

    const records = await store.loadRecords();
    assert.equal(records.length, 1);
    assert.equal(records[0].status, 'completed');

    const archived = fs.readdirSync(archiveDir).filter((item) => item.endsWith('.jsonl'));
    assert.equal(archived.length, 1);
    assert.equal(fs.existsSync(path.join(outboxDir, targetToFile(target))), false);
});

test('processOutboxEnvelopes skips unknown tasks but still archives file', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:unknown';
    const request = makeRequest('00000000-0000-4000-8000-000000000401', target, 'high');

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${JSON.stringify(createEnvelope({ target, request }))}\n`,
        'utf8'
    );

    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: false
    });

    assert.equal(stats.skippedUnknownTask, 1);
    assert.equal(stats.filesArchived, 1);
    assert.equal(stats.resultsAccepted, 0);
});

test('processOutboxEnvelopes dry-run does not mutate store or outbox', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000501', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 70_000 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 70_001
    });
    record.status = 'dispatched';
    record.attempts = 1;
    await store.saveRecord(record);

    fs.mkdirSync(outboxDir, { recursive: true });
    const outboxFile = path.join(outboxDir, targetToFile(target));
    fs.writeFileSync(
        outboxFile,
        `${JSON.stringify(createEnvelope({ target, request }))}\n`,
        'utf8'
    );

    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: false,
        dryRun: true
    });

    assert.equal(stats.dryRun, true);
    assert.equal(stats.filesArchived, 0);
    assert.equal(fs.existsSync(outboxFile), true);

    const records = await store.loadRecords();
    assert.equal(records[0].status, 'dispatched');
    assert.equal(fs.existsSync(archiveDir), false);
});

test('processOutboxEnvelopes executes bot runtime and enqueues generated follow-up tasks', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:skills-runtime';
    const request = makeRequest(
        '00000000-0000-4000-8000-000000000601',
        target,
        'high',
        {
            planner: 'cognition-core/skill-growth-task-planner',
            skillId: 1,
            skillInput: {
                signalQuality: 85,
                evidenceCoverage: 83,
                confidenceHealth: 81,
                operationalReadiness: 80,
                harmPotential: 25,
                resourcePressure: 28,
                urgency: 61,
                impactPotential: 82,
                humanApprovalLatency: 22
            }
        }
    );

    const store = new FileTaskStore({ filePath: queuePath, now: () => 80_000 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/skill-growth-tasks.json',
        nowFactory: () => 80_001
    });
    record.status = 'dispatched';
    record.attempts = 1;
    await store.saveRecord(record);

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${JSON.stringify(createEnvelope({ target, request }))}\n`,
        'utf8'
    );

    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        enqueueFollowupTasks: true
    });

    assert.equal(stats.botRuntime, true);
    assert.equal(stats.botTasksExecuted, 1);
    assert.equal(stats.botSkillTasks, 1);
    assert.ok(stats.followupTasksGenerated >= 3);
    assert.ok(stats.followupTasksSaved >= 3);

    const records = await store.loadRecords();
    const completedParent = records.find((entry) => entry.taskId === request.id);
    assert.equal(completedParent?.status, 'completed');
    assert.match(completedParent?.result?.output || '', /Skill/);

    const followups = records.filter((entry) => entry.taskId !== request.id);
    assert.ok(followups.length >= 3);
    assert.ok(followups.every((entry) => entry.status === 'created'));
});

test('processOutboxEnvelopes retries transient bot failures and recovers', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000701', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 90_000 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 90_001
    });
    record.status = 'dispatched';
    record.attempts = 1;
    await store.saveRecord(record);

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${JSON.stringify(createEnvelope({ target, request }))}\n`,
        'utf8'
    );

    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 3,
        botRetryBaseDelayMs: 0,
        botRetryMaxDelayMs: 0,
        botRetryJitter: 0,
        botExecute: async () => {
            attempts++;
            if (attempts === 1) {
                return {
                    mode: 'generic',
                    status: 'failure',
                    output: 'Transient transport timeout contacting runtime.',
                    metrics: {},
                    artifacts: [],
                    followupTasks: []
                };
            }
            return {
                mode: 'generic',
                status: 'success',
                output: 'Recovered after retry.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 2);
    assert.equal(stats.botTasksExecuted, 1);
    assert.equal(stats.botTasksFailed, 0);
    assert.equal(stats.botRetriesAttempted, 1);
    assert.equal(stats.botRetriesRecovered, 1);
    assert.equal(stats.botRetriesExhausted, 0);

    const records = await store.loadRecords();
    const completedParent = records.find((entry) => entry.taskId === request.id);
    assert.equal(completedParent?.status, 'completed');
    assert.match(completedParent?.result?.output || '', /Recovered after retry/);
});

test('processOutboxEnvelopes retries timed out bot attempts and recovers', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000702', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 91_000 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 91_001
    });
    record.status = 'dispatched';
    record.attempts = 1;
    await store.saveRecord(record);

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${JSON.stringify(createEnvelope({ target, request }))}\n`,
        'utf8'
    );

    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 2,
        botRetryBaseDelayMs: 0,
        botRetryMaxDelayMs: 0,
        botRetryJitter: 0,
        botAttemptTimeoutMs: 1,
        botExecute: async () => {
            attempts++;
            if (attempts === 1) {
                await new Promise((resolve) => setTimeout(resolve, 10));
                return {
                    mode: 'generic',
                    status: 'success',
                    output: 'Unexpected late success.',
                    metrics: {},
                    artifacts: [],
                    followupTasks: []
                };
            }
            return {
                mode: 'generic',
                status: 'success',
                output: 'Recovered after timeout retry.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 2);
    assert.equal(stats.botRetriesAttempted, 1);
    assert.equal(stats.botRetriesRecovered, 1);
    assert.equal(stats.botRetriesExhausted, 0);
    assert.equal(stats.botAttemptTimeouts, 1);

    const records = await store.loadRecords();
    const completedParent = records.find((entry) => entry.taskId === request.id);
    assert.equal(completedParent?.status, 'completed');
    assert.match(completedParent?.result?.output || '', /Recovered after timeout retry/);
});

test('processOutboxEnvelopes enforces retry budget and skips extra retries', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000703', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 92_000 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 92_001
    });
    record.status = 'dispatched';
    record.attempts = 1;
    await store.saveRecord(record);

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${JSON.stringify(createEnvelope({ target, request }))}\n`,
        'utf8'
    );

    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 3,
        botRetryBaseDelayMs: 0,
        botRetryMaxDelayMs: 0,
        botRetryJitter: 0,
        botRetryBudgetRatio: 0.4,
        botExecute: async () => {
            attempts++;
            return {
                mode: 'generic',
                status: 'failure',
                output: 'Transient transport timeout contacting runtime.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 1);
    assert.equal(stats.botRetriesAttempted, 0);
    assert.equal(stats.botRetriesBudgetExhausted, 1);
    assert.equal(stats.botRetriesExhausted, 1);

    const records = await store.loadRecords();
    const completedParent = records.find((entry) => entry.taskId === request.id);
    assert.equal(completedParent?.status, 'failed');
    assert.match(completedParent?.result?.output || '', /Retry budget exhausted/);
});
