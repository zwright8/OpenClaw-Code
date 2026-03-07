import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildOpenClawMemoryV2Blueprint,
    buildOpenClawMemoryV2BootstrapTasks,
    buildOpenClawMemoryV2CronJobs,
    buildOpenClawMemoryV2SqlSchema,
    dedupeMemoryFingerprint,
    scoreMemoryForQuery
} from '../index.js';

test('buildOpenClawMemoryV2Blueprint emits OpenClaw-tailored defaults', () => {
    const blueprint = buildOpenClawMemoryV2Blueprint({
        workspaceRoot: '/tmp/workspace',
        ownerTarget: '+15551234567',
        now: () => 1_700_000_000_000
    });

    assert.equal(blueprint.version, 'memory-v2.0.0');
    assert.equal(blueprint.workspaceRoot, '/tmp/workspace');
    assert.equal(blueprint.storage.dbPath, '/tmp/workspace/OpenClaw-Code/skills/state/memory-v2.sqlite');
    assert.equal(blueprint.security.bindAddress, '127.0.0.1');
    assert.equal(blueprint.cron.jobs.length, 5);
    assert.equal(blueprint.cron.jobs[0].delivery.to, '+15551234567');
    assert.equal(blueprint.cron.jobs.every((job) => job.sessionTarget === 'isolated'), true);
    assert.equal(blueprint.cron.jobs.every((job) => job.payload.kind === 'agentTurn'), true);
});

test('buildOpenClawMemoryV2SqlSchema includes core reliability tables', () => {
    const ddl = buildOpenClawMemoryV2SqlSchema();

    assert.equal(ddl.includes('PRAGMA journal_mode=WAL;'), true);
    assert.equal(ddl.includes('CREATE TABLE IF NOT EXISTS memories'), true);
    assert.equal(ddl.includes('CREATE TABLE IF NOT EXISTS consolidation_runs'), true);
    assert.equal(ddl.includes('CREATE TABLE IF NOT EXISTS query_events'), true);
    assert.equal(ddl.includes('fingerprint TEXT NOT NULL UNIQUE'), true);
});

test('buildOpenClawMemoryV2CronJobs produces deterministic job order and cadence', () => {
    const jobs = buildOpenClawMemoryV2CronJobs({
        ownerChannel: 'whatsapp',
        ownerTarget: '+18133343902'
    });

    assert.deepEqual(
        jobs.map((job) => job.name),
        [
            'memory-v2-ingest-loop',
            'memory-v2-consolidation-loop',
            'memory-v2-reconsolidation-nightly',
            'memory-v2-quality-eval',
            'memory-v2-backup-and-vacuum'
        ]
    );
    assert.equal(jobs[0].schedule.everyMs, 5 * 60 * 1000);
    assert.equal(jobs[1].schedule.everyMs, 30 * 60 * 1000);
    assert.equal(jobs[2].schedule.expr, '15 3 * * *');
});

test('dedupeMemoryFingerprint is stable across whitespace/case variants', () => {
    const a = dedupeMemoryFingerprint('source-A', ' Hello\nWorld  ');
    const b = dedupeMemoryFingerprint('SOURCE-a', 'hello world');
    const c = dedupeMemoryFingerprint('source-A', 'hello world but different');

    assert.equal(a, b);
    assert.notEqual(a, c);
    assert.equal(a.length, 64);
});

test('scoreMemoryForQuery prioritizes topic overlap + recency', () => {
    const nowMs = 1_700_000_000_000;

    const highSignal = scoreMemoryForQuery({
        memoryId: 'm-1',
        summary: 'Agent memory reliability improved.',
        topics: ['openclaw', 'memory', 'reliability'],
        importance: 0.9,
        confidence: 0.85,
        createdAtMs: nowMs - 2 * 60 * 60 * 1000,
        citationWeight: 0.9
    }, {
        query: 'openclaw memory reliability',
        nowMs
    });

    const weakSignal = scoreMemoryForQuery({
        memoryId: 'm-2',
        summary: 'Unrelated old note.',
        topics: ['gardening', 'recipes'],
        importance: 0.4,
        confidence: 0.5,
        createdAtMs: nowMs - 50 * 24 * 60 * 60 * 1000,
        citationWeight: 0.2
    }, {
        query: 'openclaw memory reliability',
        nowMs
    });

    assert.equal(highSignal > weakSignal, true);
    assert.equal(highSignal <= 1, true);
    assert.equal(weakSignal >= 0, true);
});

test('buildOpenClawMemoryV2BootstrapTasks emits valid swarm task_requests', () => {
    const tasks = buildOpenClawMemoryV2BootstrapTasks({
        fromAgentId: 'agent:planner',
        targetAgentId: 'agent:memory',
        now: () => 1_700_000_100_000
    });

    assert.equal(tasks.length, 5);
    assert.equal(tasks.every((task) => task.kind === 'task_request'), true);
    assert.equal(tasks.every((task) => task.from === 'agent:planner'), true);
    assert.equal(tasks.every((task) => task.target === 'agent:memory'), true);
    assert.equal(tasks[0].priority, 'critical');
    assert.equal(tasks[0].context?.capability, 'openclaw-memory-v2');
});
