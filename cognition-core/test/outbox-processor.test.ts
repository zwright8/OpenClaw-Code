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
import {
    applyRetryHintJitterMs,
    computeRetryDelayMs,
    extractRetryAfterHintMs,
    processOutboxEnvelopes
} from '../src/outbox-processor.js';

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

test('computeRetryDelayMs supports symmetric jitter strategy', () => {
    const delay = computeRetryDelayMs({
        baseDelayMs: 100,
        maxDelayMs: 100,
        attempt: 1,
        jitter: 0.2,
        jitterStrategy: 'symmetric',
        rng: () => 0
    });
    assert.equal(delay, 80);
});

test('computeRetryDelayMs supports full jitter strategy', () => {
    const minDelay = computeRetryDelayMs({
        baseDelayMs: 100,
        maxDelayMs: 100,
        attempt: 1,
        jitter: 1,
        jitterStrategy: 'full',
        rng: () => 0
    });
    const maxDelay = computeRetryDelayMs({
        baseDelayMs: 100,
        maxDelayMs: 100,
        attempt: 1,
        jitter: 1,
        jitterStrategy: 'full',
        rng: () => 1
    });
    assert.equal(minDelay, 0);
    assert.equal(maxDelay, 100);
});

test('computeRetryDelayMs supports decorrelated jitter strategy', () => {
    const minDelay = computeRetryDelayMs({
        baseDelayMs: 100,
        maxDelayMs: 1_000,
        attempt: 2,
        jitter: 1,
        jitterStrategy: 'decorrelated',
        previousDelayMs: 80,
        rng: () => 0
    });
    const maxDelay = computeRetryDelayMs({
        baseDelayMs: 100,
        maxDelayMs: 1_000,
        attempt: 2,
        jitter: 1,
        jitterStrategy: 'decorrelated',
        previousDelayMs: 80,
        rng: () => 1
    });
    assert.equal(minDelay, 100);
    assert.equal(maxDelay, 300);
});

test('extractRetryAfterHintMs supports numeric seconds and HTTP-date values', () => {
    const nowMs = Date.parse('2026-03-14T00:00:00.000Z');
    const fromSecondsMetric = extractRetryAfterHintMs(
        {
            metrics: {
                retryAfterSeconds: 2.5
            }
        },
        { nowFactory: () => nowMs }
    );
    assert.equal(fromSecondsMetric, 2_500);

    const fromHttpDate = extractRetryAfterHintMs(
        {
            metrics: {
                retryAfter: 'Sat, 14 Mar 2026 00:00:03 GMT'
            }
        },
        { nowFactory: () => nowMs }
    );
    assert.equal(fromHttpDate, 3_000);
});

test('extractRetryAfterHintMs supports RateLimit-Reset style hints', () => {
    const nowMs = Date.parse('2026-03-14T00:00:00.000Z');
    const fromRateLimitResetSeconds = extractRetryAfterHintMs(
        {
            metrics: {
                rateLimitReset: 5
            }
        },
        { nowFactory: () => nowMs }
    );
    assert.equal(fromRateLimitResetSeconds, 5_000);

    const fromXRateLimitResetEpoch = extractRetryAfterHintMs(
        {
            metrics: {
                xRateLimitReset: 1_773_446_410
            }
        },
        { nowFactory: () => nowMs }
    );
    assert.equal(fromXRateLimitResetEpoch, 10_000);
});

test('extractRetryAfterHintMs supports hyphenated hint keys and duration literals', () => {
    const nowMs = Date.parse('2026-03-14T00:00:00.000Z');
    const hint = extractRetryAfterHintMs(
        {
            metrics: {
                'retry-after-ms': '17ms',
                'x-ms-retry-after-ms': '6m0s'
            }
        },
        { nowFactory: () => nowMs }
    );
    assert.equal(hint, 360_000);
});

test('extractRetryAfterHintMs prefers the most conservative hint when multiple are present', () => {
    const nowMs = Date.parse('2026-03-14T00:00:00.000Z');
    const hint = extractRetryAfterHintMs(
        {
            metrics: {
                retryAfterSeconds: 1
            },
            output: 'Retry-After: 3'
        },
        { nowFactory: () => nowMs }
    );
    assert.equal(hint, 3_000);
});

test('applyRetryHintJitterMs only adds delay above minimum retry hint', () => {
    const base = applyRetryHintJitterMs({
        delayMs: 1_000,
        jitter: 0.2,
        rng: () => 0
    });
    const high = applyRetryHintJitterMs({
        delayMs: 1_000,
        jitter: 0.2,
        rng: () => 1
    });
    assert.equal(base, 1_000);
    assert.equal(high, 1_200);
});

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

test('processOutboxEnvelopes honors retry-after hints on transient retries', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000741', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 90_500 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 90_501
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
    const attemptStartedAt = [];
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
        botRetryHintMaxDelayMs: 100,
        botExecute: async () => {
            attempts++;
            attemptStartedAt.push(Date.now());
            if (attempts === 1) {
                return {
                    mode: 'generic',
                    status: 'failure',
                    output: '429 too many requests',
                    metrics: {
                        retryable: 1,
                        retryAfterSeconds: 0.03
                    },
                    artifacts: [],
                    followupTasks: []
                };
            }
            return {
                mode: 'generic',
                status: 'success',
                output: 'Recovered after retry-after delay.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 2);
    assert.equal(stats.botRetriesAttempted, 1);
    assert.equal(stats.botRetriesRecovered, 1);
    assert.ok(attemptStartedAt[1] - attemptStartedAt[0] >= 20);
});

test('processOutboxEnvelopes honors ratelimit-reset hints with jittered delay', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000742', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 90_500 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 90_501
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
    const attemptStartedAt = [];
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
        botRetryHintMaxDelayMs: 100,
        botRetryHintJitter: 0.5,
        rng: () => 0,
        botExecute: async () => {
            attempts++;
            attemptStartedAt.push(Date.now());
            if (attempts === 1) {
                return {
                    mode: 'generic',
                    status: 'failure',
                    output: '429 too many requests',
                    metrics: {
                        retryable: 1,
                        rateLimitReset: 0.08
                    },
                    artifacts: [],
                    followupTasks: []
                };
            }
            return {
                mode: 'generic',
                status: 'success',
                output: 'Recovered after ratelimit-reset delay.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 2);
    assert.equal(stats.botRetriesAttempted, 1);
    assert.equal(stats.botRetriesRecovered, 1);
    assert.ok(attemptStartedAt[1] - attemptStartedAt[0] >= 35);
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

test('processOutboxEnvelopes hedged attempts recover from slow primaries', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000703', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 91_050 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 91_051
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

    let launched = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botAttemptTimeoutMs: 1_000,
        botHedgedAttemptCount: 2,
        botHedgedDelayMs: 10,
        botExecute: async () => {
            launched++;
            if (launched === 1) {
                await new Promise((resolve) => setTimeout(resolve, 80));
                return {
                    mode: 'generic',
                    status: 'success',
                    output: 'Slow primary response.',
                    metrics: {},
                    artifacts: [],
                    followupTasks: []
                };
            }
            await new Promise((resolve) => setTimeout(resolve, 5));
            return {
                mode: 'generic',
                status: 'success',
                output: 'Fast hedge response.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(stats.botTasksExecuted, 1);
    assert.equal(stats.botHedgedAttemptsLaunched, 1);
    assert.equal(stats.botHedgedSuccesses, 1);
    assert.equal(stats.botHedgedWins, 1);

    const records = await store.loadRecords();
    const completedParent = records.find((entry) => entry.taskId === request.id);
    assert.equal(completedParent?.status, 'completed');
    assert.match(completedParent?.result?.output || '', /Fast hedge response/);
    assert.equal(completedParent?.result?.metrics?.hedgeSelectedAttempt, 2);
});

test('processOutboxEnvelopes hedging skips follower launches after fast primary success', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000704', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 91_100 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 91_101
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

    let launched = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botAttemptTimeoutMs: 1_000,
        botHedgedAttemptCount: 3,
        botHedgedDelayMs: 20,
        botExecute: async () => {
            launched++;
            return {
                mode: 'generic',
                status: 'success',
                output: 'Primary completed immediately.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(launched, 1);
    assert.equal(stats.botHedgedAttemptsLaunched, 0);
    assert.equal(stats.botHedgedSuccesses, 0);
    assert.equal(stats.botHedgedWins, 0);

    const records = await store.loadRecords();
    const completedParent = records.find((entry) => entry.taskId === request.id);
    assert.equal(completedParent?.status, 'completed');
    assert.match(completedParent?.result?.output || '', /Primary completed immediately/);
    assert.equal(completedParent?.result?.metrics?.hedgeSelectedAttempt, 1);
});

test('processOutboxEnvelopes adapts attempt timeout from recent durations when enabled', async (t) => {
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

    let logicalNow = 1_000;
    let attempts = 0;
    await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 2,
        botRetryBaseDelayMs: 0,
        botRetryMaxDelayMs: 0,
        botRetryJitter: 0,
        botAttemptTimeoutMs: 1_000,
        botAttemptTimeoutAutoTarget: true,
        botAttemptTimeoutAutoPercentile: 0.95,
        botAttemptTimeoutAutoMinSamples: 1,
        botAttemptTimeoutAutoWindowSize: 8,
        botAttemptTimeoutAutoBlend: 1,
        nowFactory: () => logicalNow,
        botExecute: async () => {
            attempts++;
            if (attempts === 1) {
                logicalNow += 200_000;
                return {
                    mode: 'generic',
                    status: 'failure',
                    output: 'Transient transport timeout contacting runtime.',
                    metrics: {},
                    artifacts: [],
                    followupTasks: []
                };
            }
            logicalNow += 1_000;
            return {
                mode: 'generic',
                status: 'success',
                output: 'Recovered with adaptive timeout.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    const records = await store.loadRecords();
    const completedParent = records.find((entry) => entry.taskId === request.id);
    assert.equal(completedParent?.status, 'completed');
    assert.equal(completedParent?.result?.metrics?.attemptTimeoutMs, 200_000);
    assert.equal(completedParent?.result?.metrics?.attemptTimeoutAutoTargetMs, 200_000);
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

test('processOutboxEnvelopes enforces retry max elapsed budget and skips extra retries', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const request = makeRequest('00000000-0000-4000-8000-000000000704', target, 'high');

    const store = new FileTaskStore({ filePath: queuePath, now: () => 92_500 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/remediation-tasks.json',
        nowFactory: () => 92_501
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
        botRetryBaseDelayMs: 20,
        botRetryMaxDelayMs: 20,
        botRetryJitter: 0,
        botRetryMaxElapsedMs: 10,
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
    assert.equal(stats.botRetriesAttempted, 1);
    assert.equal(stats.botRetriesDeadlineExceeded, 1);
    assert.equal(stats.botRetriesExhausted, 1);

    const records = await store.loadRecords();
    const completedParent = records.find((entry) => entry.taskId === request.id);
    assert.equal(completedParent?.status, 'failed');
    assert.match(completedParent?.result?.output || '', /Retry deadline would be exceeded/i);
});

test('processOutboxEnvelopes opens circuit breaker and fails fast during cooldown', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000711', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000712', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000713', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 93_000 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 93_001
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 2,
        botCircuitBreakerCooldownMs: 10_000,
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

    assert.equal(attempts, 2);
    assert.equal(stats.botCircuitBreakerOpened, 1);
    assert.equal(stats.botCircuitBreakerOpenSkips, 1);

    const records = await store.loadRecords();
    const third = records.find((entry) => entry.taskId === requests[2].id);
    assert.equal(third?.status, 'failed');
    assert.match(third?.result?.output || '', /circuit breaker is open/);
});

test('processOutboxEnvelopes closes circuit breaker after cooldown and successful probe', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000721', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000722', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 94_000 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 94_001
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let logicalNow = 1_000;
    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 1,
        botCircuitBreakerCooldownMs: 20,
        botCircuitBreakerHalfOpenMaxProbes: 1,
        botCircuitBreakerHalfOpenSuccessThreshold: 1,
        nowFactory: () => logicalNow,
        botExecute: async () => {
            attempts++;
            if (attempts === 1) {
                logicalNow = 1_100;
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
                output: 'Probe recovered backend dependency.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 2);
    assert.equal(stats.botCircuitBreakerOpened, 1);
    assert.equal(stats.botCircuitBreakerOpenSkips, 0);
    assert.equal(stats.botCircuitBreakerHalfOpenProbes, 1);
    assert.equal(stats.botCircuitBreakerClosed, 1);
    assert.equal(stats.botTasksFailed, 1);

    const records = await store.loadRecords();
    const second = records.find((entry) => entry.taskId === requests[1].id);
    assert.equal(second?.status, 'completed');
    assert.match(second?.result?.output || '', /Probe recovered backend dependency/);
});

test('processOutboxEnvelopes exponentially backs off breaker cooldown across repeated half-open failures', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000724', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000725', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000726', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 94_500 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 94_501
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let logicalNow = 1_000;
    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 1,
        botCircuitBreakerCooldownMs: 20,
        botCircuitBreakerCooldownBackoffMultiplier: 2,
        botCircuitBreakerMaxCooldownMs: 30,
        botCircuitBreakerHalfOpenMaxProbes: 1,
        botCircuitBreakerHalfOpenSuccessThreshold: 1,
        nowFactory: () => logicalNow,
        botExecute: async () => {
            attempts++;
            if (attempts === 1) {
                logicalNow = 1_050;
            }
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

    assert.equal(attempts, 2);
    assert.equal(stats.botCircuitBreakerOpened, 2);
    assert.equal(stats.botCircuitBreakerOpenSkips, 1);

    const records = await store.loadRecords();
    const second = records.find((entry) => entry.taskId === requests[1].id);
    const third = records.find((entry) => entry.taskId === requests[2].id);
    assert.equal(Number(second?.result?.metrics?.circuitBreakerCooldownMs), 30);
    assert.match(second?.result?.output || '', /reopened for 30ms/);
    assert.match(third?.result?.output || '', /another 30ms/);
});

test('processOutboxEnvelopes applies minimum-preserving jitter to breaker cooldown windows', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000727', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000728', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 94_600 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 94_601
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    const logicalNow = 5_000;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 1,
        botCircuitBreakerCooldownMs: 20,
        botCircuitBreakerCooldownJitter: 0.5,
        nowFactory: () => logicalNow,
        rng: () => 1,
        botExecute: async () => ({
            mode: 'generic',
            status: 'failure',
            output: 'Transient transport timeout contacting runtime.',
            metrics: {},
            artifacts: [],
            followupTasks: []
        })
    });

    assert.equal(stats.botCircuitBreakerOpened, 1);
    assert.equal(stats.botCircuitBreakerOpenSkips, 1);

    const records = await store.loadRecords();
    const first = records.find((entry) => entry.taskId === requests[0].id);
    const second = records.find((entry) => entry.taskId === requests[1].id);
    assert.equal(Number(first?.result?.metrics?.circuitBreakerCooldownMs), 30);
    assert.match(second?.result?.output || '', /another 30ms/);
});

test('processOutboxEnvelopes extends breaker cooldown using retry-after hints when opening', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000729', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000730', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 94_700 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 94_701
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 1,
        botCircuitBreakerCooldownMs: 20,
        botRetryHintMaxDelayMs: 500,
        botRetryHintJitter: 0,
        nowFactory: () => 5_000,
        botExecute: async () => {
            attempts++;
            return {
                mode: 'generic',
                status: 'failure',
                output: 'Transient transport timeout contacting runtime.',
                metrics: {
                    retryAfterMs: 200
                },
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 1);
    assert.equal(stats.botCircuitBreakerOpened, 1);
    assert.equal(stats.botCircuitBreakerOpenSkips, 1);

    const records = await store.loadRecords();
    const first = records.find((entry) => entry.taskId === requests[0].id);
    const second = records.find((entry) => entry.taskId === requests[1].id);
    assert.equal(Number(first?.result?.metrics?.circuitBreakerCooldownMs), 200);
    assert.equal(Number(first?.result?.metrics?.circuitBreakerRetryAfterHintMs), 200);
    assert.match(second?.result?.output || '', /another 200ms/);
});

test('processOutboxEnvelopes requires configured half-open success probes before closing breaker', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000731', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000732', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000733', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 95_000 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 95_001
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let logicalNow = 2_000;
    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 1,
        botCircuitBreakerCooldownMs: 20,
        botCircuitBreakerHalfOpenMaxProbes: 2,
        botCircuitBreakerHalfOpenSuccessThreshold: 2,
        nowFactory: () => logicalNow,
        botExecute: async () => {
            attempts++;
            if (attempts === 1) {
                logicalNow = 2_100;
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
                output: `Half-open probe ${attempts - 1} succeeded.`,
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 3);
    assert.equal(stats.botCircuitBreakerOpened, 1);
    assert.equal(stats.botCircuitBreakerOpenSkips, 0);
    assert.equal(stats.botCircuitBreakerHalfOpenProbes, 2);
    assert.equal(stats.botCircuitBreakerClosed, 1);

    const records = await store.loadRecords();
    const second = records.find((entry) => entry.taskId === requests[1].id);
    const third = records.find((entry) => entry.taskId === requests[2].id);
    assert.equal(second?.status, 'completed');
    assert.equal(third?.status, 'completed');
    assert.match(third?.result?.output || '', /Half-open probe 2 succeeded/);
});

test('processOutboxEnvelopes extends half-open failure reopen cooldown using retry-after hints', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000737', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000738', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000739', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 95_300 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 95_301
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let logicalNow = 1_000;
    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 1,
        botCircuitBreakerCooldownMs: 10,
        botRetryHintMaxDelayMs: 500,
        botRetryHintJitter: 0,
        nowFactory: () => logicalNow,
        botExecute: async () => {
            attempts++;
            if (attempts === 1) {
                logicalNow = 1_050;
                return {
                    mode: 'generic',
                    status: 'failure',
                    output: 'Transient transport timeout contacting runtime.',
                    metrics: {
                        retryAfterMs: 20
                    },
                    artifacts: [],
                    followupTasks: []
                };
            }
            return {
                mode: 'generic',
                status: 'failure',
                output: 'Transient transport timeout contacting runtime.',
                metrics: {
                    retryAfterMs: 80
                },
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 2);
    assert.equal(stats.botCircuitBreakerOpened, 2);
    assert.equal(stats.botCircuitBreakerOpenSkips, 1);

    const records = await store.loadRecords();
    const second = records.find((entry) => entry.taskId === requests[1].id);
    const third = records.find((entry) => entry.taskId === requests[2].id);
    assert.equal(Number(second?.result?.metrics?.circuitBreakerCooldownMs), 80);
    assert.equal(Number(second?.result?.metrics?.circuitBreakerRetryAfterHintMs), 80);
    assert.match(third?.result?.output || '', /another 80ms/);
});

test('processOutboxEnvelopes reopens breaker when half-open max-wait window is exceeded', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000734', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000735', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000736', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 95_200 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 95_201
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let logicalNow = 3_000;
    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 1,
        botCircuitBreakerCooldownMs: 20,
        botCircuitBreakerHalfOpenMaxProbes: 2,
        botCircuitBreakerHalfOpenSuccessThreshold: 2,
        botCircuitBreakerHalfOpenMaxWaitMs: 50,
        nowFactory: () => logicalNow,
        botExecute: async () => {
            attempts++;
            logicalNow = 3_120;
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
    assert.equal(stats.botCircuitBreakerOpened, 2);
    assert.equal(stats.botCircuitBreakerOpenSkips, 2);

    const records = await store.loadRecords();
    const second = records.find((entry) => entry.taskId === requests[1].id);
    const third = records.find((entry) => entry.taskId === requests[2].id);
    assert.match(second?.result?.output || '', /half-open max-wait window exceeded/i);
    assert.equal(Number(second?.result?.metrics?.circuitBreakerHalfOpenMaxWaitExceeded), 1);
    assert.match(third?.result?.output || '', /circuit breaker is open/);
});

test('processOutboxEnvelopes opens circuit breaker on rolling transient failure-rate threshold', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000741', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000742', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000743', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000744', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000745', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000746', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 96_000 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 96_001
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let attempts = 0;
    const outcomes = [
        'failure',
        'success',
        'failure',
        'success',
        'failure'
    ];
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 0,
        botCircuitBreakerFailureRateThreshold: 0.6,
        botCircuitBreakerFailureRateWindow: 5,
        botCircuitBreakerFailureRateMinSamples: 5,
        botCircuitBreakerCooldownMs: 10_000,
        nowFactory: () => 5_000,
        botExecute: async () => {
            const next = outcomes[attempts];
            attempts++;
            if (next === 'failure') {
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
                output: 'Recovered.',
                metrics: {},
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 5);
    assert.equal(stats.botCircuitBreakerOpened, 1);
    assert.equal(stats.botCircuitBreakerOpenSkips, 1);

    const records = await store.loadRecords();
    const fifth = records.find((entry) => entry.taskId === requests[4].id);
    const sixth = records.find((entry) => entry.taskId === requests[5].id);
    assert.equal(fifth?.status, 'failed');
    assert.match(fifth?.result?.output || '', /failure-rate threshold/);
    assert.equal(sixth?.status, 'failed');
    assert.match(sixth?.result?.output || '', /circuit breaker is open/);
});

test('processOutboxEnvelopes keeps failure-rate breaker closed below min sample gate', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000751', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000752', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000753', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000754', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 97_000 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 97_001
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 0,
        botCircuitBreakerFailureRateThreshold: 0.5,
        botCircuitBreakerFailureRateWindow: 5,
        botCircuitBreakerFailureRateMinSamples: 5,
        botCircuitBreakerCooldownMs: 10_000,
        nowFactory: () => 6_000,
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

    assert.equal(attempts, 4);
    assert.equal(stats.botCircuitBreakerOpened, 0);
    assert.equal(stats.botCircuitBreakerOpenSkips, 0);
});

test('processOutboxEnvelopes opens circuit breaker on rolling slow-call rate threshold', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000761', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000762', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000763', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000764', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000765', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000766', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 98_000 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 98_001
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let attempts = 0;
    const durations = [150, 80, 150, 80, 150];
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 0,
        botCircuitBreakerSlowCallRateThreshold: 0.6,
        botCircuitBreakerSlowCallDurationMs: 100,
        botCircuitBreakerSlowCallWindow: 5,
        botCircuitBreakerSlowCallMinSamples: 5,
        botCircuitBreakerCooldownMs: 10_000,
        nowFactory: () => 7_000,
        botExecute: async () => {
            const durationMs = durations[attempts];
            attempts++;
            return {
                mode: 'generic',
                status: 'success',
                output: `Completed in ${durationMs}ms.`,
                metrics: { durationMs },
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 5);
    assert.equal(stats.botCircuitBreakerOpened, 1);
    assert.equal(stats.botCircuitBreakerOpenSkips, 1);

    const records = await store.loadRecords();
    const fifth = records.find((entry) => entry.taskId === requests[4].id);
    const sixth = records.find((entry) => entry.taskId === requests[5].id);
    assert.equal(fifth?.status, 'completed');
    assert.match(fifth?.result?.output || '', /slow-call rate threshold/);
    assert.equal(sixth?.status, 'failed');
    assert.match(sixth?.result?.output || '', /circuit breaker is open/);
});

test('processOutboxEnvelopes keeps slow-call breaker closed below min sample gate', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const target = 'agent:ops';
    const requests = [
        makeRequest('00000000-0000-4000-8000-000000000771', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000772', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000773', target, 'high'),
        makeRequest('00000000-0000-4000-8000-000000000774', target, 'high')
    ];

    const store = new FileTaskStore({ filePath: queuePath, now: () => 99_000 });
    for (const request of requests) {
        const record = buildQueueRecordFromTaskRequest(request, {
            source: 'reports/remediation-tasks.json',
            nowFactory: () => 99_001
        });
        record.status = 'dispatched';
        record.attempts = 1;
        await store.saveRecord(record);
    }

    fs.mkdirSync(outboxDir, { recursive: true });
    fs.writeFileSync(
        path.join(outboxDir, targetToFile(target)),
        `${requests.map((request) => JSON.stringify(createEnvelope({ target, request }))).join('\n')}\n`,
        'utf8'
    );

    let attempts = 0;
    const stats = await processOutboxEnvelopes({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        botMaxAttempts: 1,
        botCircuitBreakerFailureThreshold: 0,
        botCircuitBreakerSlowCallRateThreshold: 0.5,
        botCircuitBreakerSlowCallDurationMs: 100,
        botCircuitBreakerSlowCallWindow: 5,
        botCircuitBreakerSlowCallMinSamples: 5,
        botCircuitBreakerCooldownMs: 10_000,
        nowFactory: () => 8_000,
        botExecute: async () => {
            attempts++;
            return {
                mode: 'generic',
                status: 'success',
                output: 'Completed slowly.',
                metrics: { durationMs: 130 },
                artifacts: [],
                followupTasks: []
            };
        }
    });

    assert.equal(attempts, 4);
    assert.equal(stats.botCircuitBreakerOpened, 0);
    assert.equal(stats.botCircuitBreakerOpenSkips, 0);
});
