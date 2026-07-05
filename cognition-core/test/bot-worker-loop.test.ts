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
    buildBotWorkerLoopOtelSpans,
    buildBotWorkerLoopTraceExportDiagnostics,
    buildStaleDispatchRecoveryPlan,
    renderBotWorkerLoopMarkdown,
    runBotWorkerLoop,
    writeBotWorkerLoopReport
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
    assert.match(report.traceparent, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
    assert.match(report.traceContext.traceId, /^[0-9a-f]{32}$/);
    assert.match(report.traceContext.spanId, /^[0-9a-f]{16}$/);
    const dispatchTrace = report.traceEvents.find((event) => event.phase === 'dispatch');
    assert.equal(dispatchTrace.schemaVersion, 'bot-worker-loop.trace.v2');
    assert.equal(dispatchTrace.traceId, report.traceId);
    assert.equal(dispatchTrace.parentSpanId, `${report.traceId.replace(/[^a-z0-9_./:-]+/g, '_')}.root`);
    assert.match(dispatchTrace.traceparent, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
    assert.match(dispatchTrace.spanContext.traceId, /^[0-9a-f]{32}$/);
    assert.match(dispatchTrace.spanContext.spanId, /^[0-9a-f]{16}$/);
    assert.equal(dispatchTrace.spanContext.parentSpanId, report.traceContext.spanId);
    assert.equal(dispatchTrace.attributes.trace_id, dispatchTrace.spanContext.traceId);
    assert.equal(dispatchTrace.attributes.span_id, dispatchTrace.spanContext.spanId);
    assert.equal(dispatchTrace.attributes.parent_span_id, report.traceContext.spanId);
    assert.equal(dispatchTrace.attributes.traceparent, dispatchTrace.traceparent);
    assert.equal(dispatchTrace.name, 'bot_worker_loop.dispatch');
    assert.equal(dispatchTrace.kind, 'tool');
    assert.equal(dispatchTrace.attributes['gen_ai.operation.name'], 'execute_tool');
    assert.equal(dispatchTrace.attributes['openclaw.workflow.phase'], 'dispatch');
    const otelSpans = buildBotWorkerLoopOtelSpans(report);
    const dispatchSpan = otelSpans.find((span) => span.name === 'bot_worker_loop.dispatch');
    assert.ok(dispatchSpan);
    assert.equal(dispatchSpan.schemaVersion, 'bot-worker-loop.otel-jsonl.v1');
    assert.equal(dispatchSpan.traceId, dispatchTrace.spanContext.traceId);
    assert.equal(dispatchSpan.spanId, dispatchTrace.spanContext.spanId);
    assert.equal(dispatchSpan.parentSpanId, report.traceContext.spanId);
    assert.equal(dispatchSpan.kind, 1);
    assert.match(dispatchSpan.startTimeUnixNano, /^[0-9]+000000$/);
    assert.equal(dispatchSpan.attributes['gen_ai.operation.name'], 'execute_tool');
    assert.equal(dispatchSpan.attributes['openclaw.workflow.phase'], 'dispatch');
    assert.equal(dispatchSpan.attributes['openclaw.trace.schema_version'], 'bot-worker-loop.trace.v2');
    assert.equal(dispatchSpan.status.code, 1);
    assert.equal(report.traceExportDiagnostics.schemaVersion, 'bot-worker-loop.trace-export-diagnostics.v1');
    assert.equal(report.traceExportDiagnostics.traceEventCount, report.traceEvents.length);
    assert.equal(report.traceExportDiagnostics.exportedSpanCount, report.traceEvents.length);
    assert.equal(report.traceExportDiagnostics.droppedEventCount, 0);
    assert.equal(report.traceExportDiagnostics.exportCoverage, 1);
    assert.equal(report.traceExportDiagnostics.status, 'pass');
    assert.equal(report.lifecycleCheckpoint.schemaVersion, 'bot-worker-loop.lifecycle.v1');
    assert.equal(report.lifecycleCheckpoint.nextAction, 'no_resume_needed');
    assert.equal(report.lifecycleCheckpoint.resumeRecommended, false);
    assert.match(report.lifecycleCheckpoint.resumeKey, /^no_resume_needed:[a-f0-9]{16}$/);
    assert.match(report.lifecycleCheckpoint.stateFingerprint, /^[a-f0-9]{16}$/);
    assert.equal(report.runEvaluation.schemaVersion, 'bot-worker-loop.evaluation.v1');
    assert.equal(report.runEvaluation.status, 'pass');
    assert.equal(report.runEvaluation.score, 100);
    assert.equal(report.runEvaluation.passed, true);
    assert.deepEqual(report.runEvaluation.penalties, []);
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'lifecycle_checkpoint'
        && event.nextAction === 'no_resume_needed'
        && event.resumeKey === report.lifecycleCheckpoint.resumeKey
        && event.stateFingerprint === report.lifecycleCheckpoint.stateFingerprint
        && event.attributes['gen_ai.operation.name'] === 'invoke_workflow'
    )));
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'run_evaluation'
        && event.status === 'pass'
        && event.score === 100
        && event.passed === true
    )));

    const records = await store.loadRecords();
    assert.ok(records.length >= 2);
    assert.ok(records.every((entry) => entry.status === 'completed' || entry.status === 'failed' || entry.status === 'partial' || entry.status === 'rejected' || entry.status === 'timed_out' || entry.status === 'transport_error'));
});

test('writeBotWorkerLoopReport writes OTel-compatible span JSONL', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const otelPath = path.join(dir, 'bot-worker-loop.otel.jsonl');
    await writeBotWorkerLoopReport({
        report: {
            traceEvents: [
                {
                    at: 100,
                    cycle: 1,
                    phase: 'dispatch_failure',
                    schemaVersion: 'bot-worker-loop.trace.v2',
                    traceparent: '00-11111111111111111111111111111111-2222222222222222-01',
                    spanKind: 'INTERNAL',
                    name: 'bot_worker_loop.dispatch_failure',
                    kind: 'guardrail',
                    failedDispatch: 1,
                    spanContext: {
                        traceId: '11111111111111111111111111111111',
                        spanId: '3333333333333333',
                        parentSpanId: '2222222222222222',
                        traceFlags: '01'
                    },
                    attributes: {
                        'gen_ai.operation.name': 'invoke_workflow',
                        'openclaw.workflow.phase': 'dispatch_failure'
                    }
                }
            ]
        },
        otelJsonlPath: otelPath
    });

    const lines = fs.readFileSync(otelPath, 'utf8').trim().split('\n');
    assert.equal(lines.length, 1);
    const span = JSON.parse(lines[0]);
    assert.equal(span.schemaVersion, 'bot-worker-loop.otel-jsonl.v1');
    assert.equal(span.traceId, '11111111111111111111111111111111');
    assert.equal(span.spanId, '3333333333333333');
    assert.equal(span.parentSpanId, '2222222222222222');
    assert.equal(span.status.code, 2);
    assert.equal(span.attributes['openclaw.workflow.phase'], 'dispatch_failure');
    assert.equal(span.attributes['openclaw.trace.traceparent'], '00-11111111111111111111111111111111-2222222222222222-01');
});

test('writeBotWorkerLoopReport writes standalone stale dispatch recovery plan', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const recoveryPlanPath = path.join(dir, 'bot-worker-loop.recovery-plan.json');
    const recoveryPlan = {
        schemaVersion: 'bot-worker-loop.stale-dispatch-recovery.v1',
        generatedAt: 120_000,
        staleDispatchMs: 60_000,
        totalCandidates: 1,
        dryRun: true,
        mutatesQueue: false,
        defaultAction: 'inspect_external_runtime_before_requeue',
        rationale: 'Inspect external side effects before mutation.',
        candidates: [
            {
                taskId: 'stale-task-1',
                target: 'agent:openclaw-bot',
                ageMs: 90_000,
                updatedAt: 30_000,
                attempts: 1,
                traceparent: '00-11111111111111111111111111111111-2222222222222222-01',
                idempotencyKey: 'task:stale-task-1:attempt:1',
                recoveryDecisionRequired: true,
                recoveryDecisionRecord: {
                    schemaVersion: 'bot-worker-loop.stale-dispatch-decision.v1',
                    taskId: 'stale-task-1',
                    decision: 'pending'
                },
                recommendedAction: 'inspect_external_runtime_before_requeue',
                evidenceRequired: [
                    {
                        id: 'external_runtime_result_checked',
                        description: 'Check external runtime.'
                    }
                ],
                operatorCommands: [
                    'npm --prefix swarm-protocol run ops -- replay stale-task-1'
                ]
            }
        ],
        nextSteps: [
            'Inspect each replay timeline and external runtime result store for a late completion.'
        ]
    };

    await writeBotWorkerLoopReport({
        report: {
            stopReason: 'stale_dispatch_detected',
            staleDispatchRecoveryPlan: recoveryPlan
        },
        recoveryPlanPath
    });

    assert.equal(fs.existsSync(recoveryPlanPath), true);
    const written = JSON.parse(fs.readFileSync(recoveryPlanPath, 'utf8'));
    assert.deepEqual(written, recoveryPlan);
    assert.equal(written.candidates[0].recoveryDecisionRecord.decision, 'pending');
    assert.equal(written.candidates[0].mutatesQueue, undefined);
});

test('writeBotWorkerLoopReport skips malformed OTel span JSONL rows', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const otelPath = path.join(dir, 'bot-worker-loop.otel.jsonl');
    await writeBotWorkerLoopReport({
        report: {
            traceEvents: [
                {
                    at: 100,
                    cycle: 1,
                    phase: 'dispatch',
                    traceparent: '00-11111111111111111111111111111111-2222222222222222-01',
                    spanContext: {
                        traceId: '11111111111111111111111111111111',
                        spanId: '3333333333333333',
                        parentSpanId: '2222222222222222'
                    }
                },
                {
                    at: 120,
                    cycle: 1,
                    phase: 'queue_after',
                    traceparent: '00-00000000000000000000000000000000-4444444444444444-01',
                    spanContext: {
                        traceId: '00000000000000000000000000000000',
                        spanId: '4444444444444444'
                    }
                },
                {
                    at: 130,
                    cycle: 1,
                    phase: 'run_evaluation',
                    traceparent: 'not-a-traceparent',
                    spanContext: {
                        traceId: '55555555555555555555555555555555',
                        spanId: '6666666666666666'
                    }
                }
            ]
        },
        otelJsonlPath: otelPath
    });

    const lines = fs.readFileSync(otelPath, 'utf8').trim().split('\n');
    assert.equal(lines.length, 1);
    assert.equal(JSON.parse(lines[0]).name, 'bot_worker_loop.event');
});

test('buildBotWorkerLoopTraceExportDiagnostics reports dropped malformed trace events', () => {
    const diagnostics = buildBotWorkerLoopTraceExportDiagnostics({
        traceEvents: [
            {
                phase: 'dispatch',
                traceparent: '00-11111111111111111111111111111111-2222222222222222-01',
                spanContext: {
                    traceId: '11111111111111111111111111111111',
                    spanId: '2222222222222222'
                }
            },
            {
                phase: 'queue_after',
                spanContext: {
                    traceId: '33333333333333333333333333333333'
                }
            },
            {
                phase: 'lifecycle_checkpoint',
                traceparent: 'not-a-traceparent',
                spanContext: {
                    traceId: '00000000000000000000000000000000',
                    spanId: '4444444444444444'
                }
            },
            {
                phase: 'stale_dispatch_recovery_plan',
                spanContext: {
                    traceId: '55555555555555555555555555555555',
                    spanId: '0000000000000000'
                }
            },
            {
                phase: 'run_evaluation'
            }
        ]
    });

    assert.equal(diagnostics.schemaVersion, 'bot-worker-loop.trace-export-diagnostics.v1');
    assert.equal(diagnostics.traceEventCount, 5);
    assert.equal(diagnostics.exportedSpanCount, 1);
    assert.equal(diagnostics.droppedEventCount, 4);
    assert.equal(diagnostics.missingSpanContext, 1);
    assert.equal(diagnostics.missingTraceId, 1);
    assert.equal(diagnostics.missingSpanId, 2);
    assert.equal(diagnostics.invalidTraceId, 1);
    assert.equal(diagnostics.invalidSpanId, 1);
    assert.equal(diagnostics.invalidTraceparent, 1);
    assert.equal(diagnostics.exportCoverage, 0.2);
    assert.equal(diagnostics.status, 'warn');
    assert.deepEqual(diagnostics.droppedEvents, [
        {
            index: 1,
            phase: 'queue_after',
            reasons: ['missing_span_id']
        },
        {
            index: 2,
            phase: 'lifecycle_checkpoint',
            reasons: ['invalid_trace_id', 'invalid_traceparent']
        },
        {
            index: 3,
            phase: 'stale_dispatch_recovery_plan',
            reasons: ['invalid_span_id']
        },
        {
            index: 4,
            phase: 'run_evaluation',
            reasons: ['missing_span_context', 'missing_trace_id', 'missing_span_id']
        }
    ]);
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
    assert.ok(report.traceEvents.some((event) => event.phase === 'maintenance'));
    assert.ok(report.traceEvents.some((event) => event.phase === 'queue_after' && event.queueOpen === 0));
    assert.equal(report.lifecycleCheckpoint.nextAction, 'no_resume_needed');
});

test('runBotWorkerLoop executes maintenance retries before processing outbox results', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const request = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000974',
        from: 'agent:main',
        target: 'agent:openclaw-bot',
        priority: 'normal',
        task: 'Retry queued maintenance task',
        context: {
            planner: 'cognition-core/cognition-iteration-task-planner'
        },
        createdAt: 10_000
    });
    const store = new FileTaskStore({ filePath: queuePath, now: () => 120_000 });
    const record = buildQueueRecordFromTaskRequest(request, {
        source: 'reports/cognition-iteration-tasks.json',
        nowFactory: () => 10_500,
        maxRetries: 2
    });
    record.status = 'retry_scheduled';
    record.attempts = 1;
    record.nextRetryAt = 11_000;
    record.updatedAt = 10_600;
    await store.saveRecord(record);

    const report = await runBotWorkerLoop({
        storePath: queuePath,
        outboxDir,
        archiveDir,
        maxCycles: 4,
        idleCyclesToStop: 1,
        dispatchLimit: 10,
        botRuntime: false,
        nowFactory: () => 120_000
    });

    assert.equal(report.stopReason, 'queue_drained');
    assert.equal(report.totals.maintenanceRetried, 1);
    assert.equal(report.totals.maintenanceTimedOut, 0);
    assert.equal(report.totals.resultsAccepted, 1);
    assert.equal(report.finalQueue.open, 0);
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'maintenance'
        && event.retried === 1
        && event.transportFailures === 0
    )));
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'queue_after'
        && event.queueRetryScheduled === 0
    )));

    const records = await store.loadRecords();
    assert.equal(records[0].status, 'completed');
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

test('runBotWorkerLoop stops with recovery checkpoint for stale dispatched tasks', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const request = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000973',
        from: 'agent:main',
        target: 'agent:openclaw-bot',
        priority: 'normal',
        task: 'Run stale dispatched recovery check',
        context: {
            planner: 'cognition-core/cognition-iteration-task-planner',
            traceparent: '00-11111111111111111111111111111111-2222222222222222-01'
        },
        traceparent: '00-11111111111111111111111111111111-2222222222222222-01',
        createdAt: 10_000
    });
    const store = new FileTaskStore({ filePath: queuePath, now: () => 120_000 });
    await store.saveRecord({
        ...buildQueueRecordFromTaskRequest(request, {
            source: 'reports/cognition-iteration-tasks.json',
            nowFactory: () => 10_500
        }),
        status: 'dispatched',
        updatedAt: 10_500
    });

    const report = await runBotWorkerLoop({
        storePath: queuePath,
        outboxDir,
        maxCycles: 4,
        idleCyclesToStop: 1,
        dispatchLimit: 10,
        botRuntime: true,
        botRepoRoot: REPO_ROOT,
        staleDispatchMs: 60_000,
        nowFactory: () => 120_000
    });

    assert.equal(report.stopReason, 'stale_dispatch_detected');
    assert.equal(report.cyclesRun, 1);
    assert.equal(report.staleDispatchMs, 60_000);
    assert.equal(report.finalQueue.dispatched, 1);
    assert.equal(report.finalQueue.dispatchedStale, 1);
    assert.equal(report.finalQueue.oldestDispatchedAgeMs, 109_500);
    assert.deepEqual(report.finalQueue.staleDispatchedTaskIds, [request.id]);
    assert.equal(report.lifecycleCheckpoint.nextAction, 'recover_stale_dispatches');
    assert.equal(report.lifecycleCheckpoint.resumeRecommended, true);
    assert.match(report.lifecycleCheckpoint.resumeKey, /^recover_stale_dispatches:[a-f0-9]{16}$/);
    assert.ok(report.lifecycleCheckpoint.attentionReasons.includes('stale_dispatched_tasks'));
    assert.equal(report.lifecycleCheckpoint.queue.dispatchedStale, 1);
    assert.deepEqual(report.lifecycleCheckpoint.queue.staleDispatchedTaskIds, [request.id]);
    assert.equal(report.runEvaluation.status, 'fail');
    assert.equal(report.runEvaluation.passed, false);
    assert.ok(report.runEvaluation.score < 100);
    assert.ok(report.runEvaluation.penalties.some((penalty) => (
        penalty.reason === 'stale_dispatched_tasks'
        && penalty.points === 25
        && penalty.count === 1
    )));
    assert.equal(report.runEvaluation.signals.nextAction, 'recover_stale_dispatches');
    assert.equal(report.staleDispatchRecoveryPlan.schemaVersion, 'bot-worker-loop.stale-dispatch-recovery.v1');
    assert.equal(report.staleDispatchRecoveryPlan.dryRun, true);
    assert.equal(report.staleDispatchRecoveryPlan.mutatesQueue, false);
    assert.equal(report.staleDispatchRecoveryPlan.totalCandidates, 1);
    assert.equal(report.staleDispatchRecoveryPlan.defaultAction, 'inspect_external_runtime_before_requeue');
    assert.deepEqual(report.staleDispatchRecoveryPlan.candidates.map((candidate) => candidate.taskId), [request.id]);
    assert.equal(report.staleDispatchRecoveryPlan.candidates[0].ageMs, 109_500);
    assert.equal(report.staleDispatchRecoveryPlan.candidates[0].target, 'agent:openclaw-bot');
    assert.equal(
        report.staleDispatchRecoveryPlan.candidates[0].traceparent,
        '00-11111111111111111111111111111111-2222222222222222-01'
    );
    assert.equal(
        report.staleDispatchRecoveryPlan.candidates[0].idempotencyKey,
        `task:${request.id}:attempt:0`
    );
    assert.equal(report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRequired, true);
    assert.equal(
        report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRecord.schemaVersion,
        'bot-worker-loop.stale-dispatch-decision.v1'
    );
    assert.equal(
        report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRecord.taskId,
        request.id
    );
    assert.equal(
        report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRecord.correlation,
        '00-11111111111111111111111111111111-2222222222222222-01'
    );
    assert.equal(
        report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRecord.idempotencyKey,
        `task:${request.id}:attempt:0`
    );
    assert.equal(report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRecord.decision, 'pending');
    assert.deepEqual(
        report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRecord.requiredBeforeDecision,
        [
            'replay_timeline_reviewed',
            'external_runtime_result_checked',
            'side_effect_ledger_checked'
        ]
    );
    assert.ok(
        report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRecord.allowedDecisions.includes('requeue_no_side_effect')
    );
    assert.ok(
        report.staleDispatchRecoveryPlan.candidates[0].recoveryDecisionRecord.requiredFields.includes('sideEffectStatus')
    );
    assert.deepEqual(
        report.staleDispatchRecoveryPlan.candidates[0].evidenceRequired.map((item) => item.id),
        [
            'replay_timeline_reviewed',
            'external_runtime_result_checked',
            'side_effect_ledger_checked',
            'operator_decision_recorded'
        ]
    );
    assert.match(
        report.staleDispatchRecoveryPlan.candidates[0].evidenceRequired[1].description,
        /11111111111111111111111111111111/
    );
    assert.equal(
        report.staleDispatchRecoveryPlan.candidates[0].recommendedAction,
        'inspect_external_runtime_before_requeue'
    );
    assert.ok(report.staleDispatchRecoveryPlan.candidates[0].operatorCommands.some((command) => (
        command.includes(`replay ${request.id}`)
    )));
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'bot_runtime_attention'
        && event.kind === 'guardrail'
        && event.staleDispatches === 1
        && event.oldestDispatchedAgeMs === 109_500
        && event.staleDispatchMs === 60_000
    )));
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'lifecycle_checkpoint'
        && event.nextAction === 'recover_stale_dispatches'
        && event.queueDispatchedStale === 1
        && event.oldestDispatchedAgeMs === 109_500
    )));
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'run_evaluation'
        && event.status === 'fail'
        && event.nextAction === 'recover_stale_dispatches'
        && event.penalties.some((penalty) => penalty.reason === 'stale_dispatched_tasks')
    )));
    assert.ok(report.traceEvents.some((event) => (
        event.phase === 'stale_dispatch_recovery_plan'
        && event.totalCandidates === 1
        && event.dryRun === true
        && event.mutatesQueue === false
        && event.candidateTaskIds.includes(request.id)
        && event.candidateTraceparents.includes('00-11111111111111111111111111111111-2222222222222222-01')
    )));
});

test('buildStaleDispatchRecoveryPlan is deterministic and non-mutating', () => {
    const records = [
        {
            taskId: 'fresh-dispatch',
            target: 'agent:fresh',
            status: 'dispatched',
            attempts: 1,
            updatedAt: 115_000,
            history: [{ at: 115_000, event: 'send_success' }]
        },
        {
            taskId: 'old-dispatch',
            target: 'agent:old',
            status: 'dispatched',
            attempts: 2,
            updatedAt: 10_000,
            request: {
                context: {
                    traceparent: '00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01'
                }
            },
            history: [{ at: 10_000, event: 'send_success' }, { at: 12_000, event: 'receipt_timeout' }]
        },
        {
            taskId: 'done',
            target: 'agent:old',
            status: 'completed',
            attempts: 1,
            updatedAt: 1_000
        }
    ];

    const plan = buildStaleDispatchRecoveryPlan(records, {
        nowMs: 120_000,
        staleDispatchMs: 60_000
    });

    assert.equal(plan.schemaVersion, 'bot-worker-loop.stale-dispatch-recovery.v1');
    assert.equal(plan.dryRun, true);
    assert.equal(plan.mutatesQueue, false);
    assert.equal(plan.totalCandidates, 1);
    assert.equal(plan.candidates.length, 1);
    assert.equal(plan.candidates[0].taskId, 'old-dispatch');
    assert.equal(plan.candidates[0].ageMs, 110_000);
    assert.equal(plan.candidates[0].traceparent, '00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01');
    assert.equal(plan.candidates[0].idempotencyKey, 'task:old-dispatch:attempt:2');
    assert.equal(plan.candidates[0].recoveryDecisionRequired, true);
    assert.deepEqual(plan.candidates[0].recoveryDecisionRecord.defaults, {
        operator: null,
        decidedAt: null,
        evidenceReviewed: [],
        externalRuntimeCorrelation: '00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01',
        sideEffectStatus: 'unknown',
        notes: null
    });
    assert.deepEqual(plan.candidates[0].evidenceRequired.map((item) => item.id), [
        'replay_timeline_reviewed',
        'external_runtime_result_checked',
        'side_effect_ledger_checked',
        'operator_decision_recorded'
    ]);
    assert.deepEqual(plan.candidates[0].latestHistoryEvent, {
        at: 12_000,
        event: 'receipt_timeout'
    });
    assert.equal(records[1].status, 'dispatched');
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
            dispatchedStale: 1,
            awaitingApproval: 0
        },
        lifecycleCheckpoint: {
            schemaVersion: 'bot-worker-loop.lifecycle.v1',
            nextAction: 'recover_stale_dispatches',
            resumeRecommended: true,
            resumeKey: 'recover_stale_dispatches:0000000000000001',
            stateFingerprint: '0000000000000001',
            attentionReasons: ['pending_dispatched_tasks', 'stale_dispatched_tasks'],
            queue: {
                open: 1,
                dispatchedStale: 1,
                oldestDispatchedAgeMs: 120000,
                awaitingApproval: 0
            }
        },
        runEvaluation: {
            schemaVersion: 'bot-worker-loop.evaluation.v1',
            status: 'fail',
            score: 63,
            passed: false,
            signals: {
                nextAction: 'recover_stale_dispatches'
            },
            penalties: [
                {
                    reason: 'stale_dispatched_tasks',
                    points: 25,
                    count: 1
                },
                {
                    reason: 'bot_task_failures',
                    points: 15,
                    count: 1
                }
            ]
        },
        staleDispatchRecoveryPlan: {
            schemaVersion: 'bot-worker-loop.stale-dispatch-recovery.v1',
            dryRun: true,
            mutatesQueue: false,
            totalCandidates: 1,
            defaultAction: 'inspect_external_runtime_before_requeue',
            candidates: [
                {
                    taskId: 'task-stale',
                    target: 'agent:openclaw-bot',
                    ageMs: 120000,
                    attempts: 1,
                    traceparent: '00-33333333333333333333333333333333-4444444444444444-01',
                    idempotencyKey: 'task:task-stale:attempt:1',
                    recoveryDecisionRequired: true,
                    recoveryDecisionRecord: {
                        schemaVersion: 'bot-worker-loop.stale-dispatch-decision.v1',
                        allowedDecisions: [
                            'close_completed',
                            'requeue_no_side_effect',
                            'fail_side_effect_unknown',
                            'escalate_manual_review'
                        ],
                        requiredFields: [
                            'decision',
                            'operator',
                            'decidedAt',
                            'evidenceReviewed',
                            'externalRuntimeCorrelation',
                            'sideEffectStatus',
                            'notes'
                        ]
                    },
                    evidenceRequired: [
                        { id: 'replay_timeline_reviewed' },
                        { id: 'external_runtime_result_checked' },
                        { id: 'side_effect_ledger_checked' },
                        { id: 'operator_decision_recorded' }
                    ],
                    recommendedAction: 'inspect_external_runtime_before_requeue'
                }
            ]
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
    assert.match(markdown, /finalQueue\.dispatchedStale: 1/);
    assert.match(markdown, /## Lifecycle Checkpoint/);
    assert.match(markdown, /nextAction: recover_stale_dispatches/);
    assert.match(markdown, /resumeKey: recover_stale_dispatches:0000000000000001/);
    assert.match(markdown, /stateFingerprint: [a-f0-9]{16}/);
    assert.match(markdown, /attentionReasons: pending_dispatched_tasks, stale_dispatched_tasks/);
    assert.match(markdown, /queue\.dispatchedStale: 1/);
    assert.match(markdown, /queue\.oldestDispatchedAgeMs: 120000/);
    assert.match(markdown, /## Run Evaluation/);
    assert.match(markdown, /status: fail/);
    assert.match(markdown, /score: 63/);
    assert.match(markdown, /penalties: stale_dispatched_tasks:25, bot_task_failures:15/);
    assert.match(markdown, /## Trace Export/);
    assert.match(markdown, /traceEventCount: 1/);
    assert.match(markdown, /exportedSpanCount: 0/);
    assert.match(markdown, /droppedEventCount: 1/);
    assert.match(markdown, /droppedEvents: bot_runtime_attention:missing_span_context\+missing_trace_id\+missing_span_id/);
    assert.match(markdown, /## Recovery Plan/);
    assert.match(markdown, /dryRun: true/);
    assert.match(markdown, /mutatesQueue: false/);
    assert.match(markdown, /candidate task-stale: target=agent:openclaw-bot ageMs=120000 attempts=1 action=inspect_external_runtime_before_requeue/);
    assert.match(markdown, /traceparent: 00-33333333333333333333333333333333-4444444444444444-01/);
    assert.match(markdown, /idempotencyKey: task:task-stale:attempt:1/);
    assert.match(markdown, /recoveryDecisionRequired: true/);
    assert.match(markdown, /decisionRecordSchema: bot-worker-loop.stale-dispatch-decision.v1/);
    assert.match(markdown, /allowedDecisions: close_completed, requeue_no_side_effect, fail_side_effect_unknown, escalate_manual_review/);
    assert.match(markdown, /requiredFields: decision, operator, decidedAt, evidenceReviewed, externalRuntimeCorrelation, sideEffectStatus, notes/);
    assert.match(markdown, /evidenceRequired: replay_timeline_reviewed, external_runtime_result_checked, side_effect_ledger_checked, operator_decision_recorded/);
    assert.match(markdown, /## Trace Events/);
    assert.match(markdown, /phase=bot_runtime_attention/);
    assert.match(markdown, /name=bot_worker_loop\.bot_runtime_attention/);
    assert.match(markdown, /kind=guardrail/);
    assert.match(markdown, /botSkillHardeningBlocked=1/);
});
