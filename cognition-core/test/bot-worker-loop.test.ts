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
    renderBotWorkerLoopMarkdown,
    runBotWorkerLoop
} from '../src/bot-worker-loop.js';

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
    assert.ok(Array.isArray(report.traceEvents));
    assert.ok(report.traceEvents.some((event) => event.phase === 'dispatch' && event.dispatched >= 1));
    assert.ok(report.traceEvents.some((event) => event.phase === 'outbox_process' && event.resultsAccepted >= 1));
    assert.ok(report.traceId.startsWith('bot-worker-loop:'));
    const dispatchTrace = report.traceEvents.find((event) => event.phase === 'dispatch');
    assert.equal(dispatchTrace.schemaVersion, 'bot-worker-loop.trace.v2');
    assert.equal(dispatchTrace.traceId, report.traceId);
    assert.equal(dispatchTrace.parentSpanId, `${report.traceId.replace(/[^a-z0-9_./:-]+/g, '_')}.root`);
    assert.equal(dispatchTrace.name, 'bot_worker_loop.dispatch');
    assert.equal(dispatchTrace.kind, 'tool');
    assert.equal(dispatchTrace.attributes['gen_ai.operation.name'], 'execute_tool');
    assert.equal(dispatchTrace.attributes['openclaw.workflow.phase'], 'dispatch');
    assert.equal(report.lifecycleCheckpoint.schemaVersion, 'bot-worker-loop.lifecycle.v1');
    assert.equal(report.lifecycleCheckpoint.nextAction, 'no_resume_needed');
    assert.equal(report.lifecycleCheckpoint.resumeRecommended, false);
    assert.match(report.lifecycleCheckpoint.resumeKey, /^no_resume_needed:[a-f0-9]{16}$/);
    assert.match(report.lifecycleCheckpoint.stateFingerprint, /^[a-f0-9]{16}$/);
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'lifecycle_checkpoint'
        && event.nextAction === 'no_resume_needed'
        && event.resumeKey === report.lifecycleCheckpoint.resumeKey
        && event.stateFingerprint === report.lifecycleCheckpoint.stateFingerprint
        && event.attributes['gen_ai.operation.name'] === 'invoke_workflow'
    )));

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
    assert.ok(report.traceEvents.some((event) => event.phase === 'queue_before'));
    assert.ok(report.traceEvents.some((event) => event.phase === 'queue_after' && event.queueOpen === 0));
    assert.equal(report.lifecycleCheckpoint.nextAction, 'no_resume_needed');
});

test('runBotWorkerLoop checkpoint recommends approval review when only approvals remain', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const request = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000972',
        from: 'agent:main',
        target: 'agent:openclaw-bot',
        priority: 'high',
        task: 'Review operator-sensitive deployment',
        context: {
            approvalsRequired: ['manual_operator_review']
        },
        createdAt: 60_000
    });
    const store = new FileTaskStore({ filePath: queuePath, now: () => 60_500 });
    await store.saveRecord({
        ...buildQueueRecordFromTaskRequest(request, {
            source: 'reports/cognition-iteration-tasks.json',
            nowFactory: () => 60_600
        }),
        status: 'awaiting_approval',
        approval: {
            required: true,
            reason: 'manual_operator_review'
        }
    });

    const report = await runBotWorkerLoop({
        storePath: queuePath,
        outboxDir,
        maxCycles: 4,
        idleCyclesToStop: 1,
        dispatchLimit: 10,
        botRuntime: true,
        botRepoRoot: REPO_ROOT
    });

    assert.equal(report.stopReason, 'awaiting_approval_only');
    assert.equal(report.lifecycleCheckpoint.nextAction, 'review_pending_approvals');
    assert.equal(report.lifecycleCheckpoint.resumeRecommended, true);
    assert.match(report.lifecycleCheckpoint.resumeKey, /^review_pending_approvals:[a-f0-9]{16}$/);
    assert.deepEqual(report.lifecycleCheckpoint.attentionReasons, ['pending_approval']);
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'lifecycle_checkpoint'
        && event.nextAction === 'review_pending_approvals'
        && event.resumeRecommended === true
        && event.resumeKey === report.lifecycleCheckpoint.resumeKey
    )));
});

test('renderBotWorkerLoopMarkdown includes runtime attention trace events', () => {
    const markdown = renderBotWorkerLoopMarkdown({
        stopReason: 'idle_convergence',
        cyclesRun: 1,
        maxCycles: 2,
        totals: {
            dispatched: 1,
            resultsAccepted: 1,
            botTasksFailed: 1,
            botSkillHardeningBlocked: 1,
            followupTasksSaved: 0
        },
        finalQueue: {
            open: 1,
            awaitingApproval: 0
        },
        cycles: [
            {
                cycle: 1,
                dispatched: 1,
                resultsAccepted: 1,
                followupTasksSaved: 0,
                queueAfter: { open: 1 },
                idleStreak: 0
            }
        ],
        traceEvents: [
            {
                at: 100,
                cycle: 1,
                phase: 'bot_runtime_attention',
                schemaVersion: 'bot-worker-loop.trace.v2',
                traceId: 'bot-worker-loop:100',
                spanId: 'bot-worker-loop:100.1.bot_runtime_attention',
                parentSpanId: 'bot-worker-loop:100.root',
                name: 'bot_worker_loop.bot_runtime_attention',
                kind: 'guardrail',
                spanKind: 'INTERNAL',
                semconv: 'otel.gen_ai.experimental',
                attributes: {
                    'gen_ai.operation.name': 'invoke_workflow',
                    'gen_ai.agent.name': 'openclaw-bot-worker-loop',
                    'openclaw.workflow.name': 'bot_worker_loop',
                    'openclaw.workflow.phase': 'bot_runtime_attention',
                    'openclaw.workflow.cycle': 1
                },
                botTasksFailed: 1,
                botSkillHardeningBlocked: 1
            }
        ]
    });

    assert.match(markdown, /totals\.botTasksFailed: 1/);
    assert.match(markdown, /## Lifecycle Checkpoint/);
    assert.match(markdown, /nextAction: refresh_skill_hardening_inputs/);
    assert.match(markdown, /resumeKey: refresh_skill_hardening_inputs:[a-f0-9]{16}/);
    assert.match(markdown, /stateFingerprint: [a-f0-9]{16}/);
    assert.match(markdown, /attentionReasons: bot_task_failures, skill_hardening_blocks/);
    assert.match(markdown, /## Trace Events/);
    assert.match(markdown, /phase=bot_runtime_attention/);
    assert.match(markdown, /name=bot_worker_loop\.bot_runtime_attention/);
    assert.match(markdown, /kind=guardrail/);
    assert.match(markdown, /botSkillHardeningBlocked=1/);
});
