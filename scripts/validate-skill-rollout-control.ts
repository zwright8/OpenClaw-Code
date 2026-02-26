import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillExecutionTask,
    SkillRolloutControlRun,
    SkillRolloutWavePlan
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const WAVE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.json');
const WAVE_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-wave-tasks.json');
const CONTROL_RUN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-control.json');
const CONTROL_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-control-tasks.json');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    assert.ok(fs.existsSync(WAVE_PLAN_PATH), `Missing wave plan: ${WAVE_PLAN_PATH}`);
    assert.ok(fs.existsSync(WAVE_TASKS_PATH), `Missing wave tasks: ${WAVE_TASKS_PATH}`);
    assert.ok(fs.existsSync(CONTROL_RUN_PATH), `Missing control run: ${CONTROL_RUN_PATH}`);
    assert.ok(fs.existsSync(CONTROL_TASKS_PATH), `Missing control follow-up tasks: ${CONTROL_TASKS_PATH}`);

    const wavePlan = loadJson<SkillRolloutWavePlan>(WAVE_PLAN_PATH);
    const sourceTasks = loadJson<SkillExecutionTask[]>(WAVE_TASKS_PATH);
    const controlRun = loadJson<SkillRolloutControlRun>(CONTROL_RUN_PATH);
    const followUpTasks = loadJson<SkillExecutionTask[]>(CONTROL_TASKS_PATH);

    assert.equal(controlRun.sourceTaskCount, sourceTasks.length, 'Control run sourceTaskCount mismatch');
    assert.equal(controlRun.taskResults.length, sourceTasks.length, 'Task result count mismatch');

    const statusCounts = {
        success: controlRun.taskResults.filter((entry) => entry.status === 'success').length,
        failed: controlRun.taskResults.filter((entry) => entry.status === 'failed').length,
        approval_pending: controlRun.taskResults.filter((entry) => entry.status === 'approval_pending').length,
        skipped: controlRun.taskResults.filter((entry) => entry.status === 'skipped').length
    };
    assert.equal(statusCounts.success, controlRun.summary.successCount, 'Summary success count mismatch');
    assert.equal(statusCounts.failed, controlRun.summary.failedCount, 'Summary failed count mismatch');
    assert.equal(statusCounts.approval_pending, controlRun.summary.approvalPendingCount, 'Summary pending count mismatch');
    assert.equal(statusCounts.skipped, controlRun.summary.skippedCount, 'Summary skipped count mismatch');
    assert.equal(
        statusCounts.success + statusCounts.failed + statusCounts.approval_pending + statusCounts.skipped,
        controlRun.summary.totalTasks,
        'Summary total task count mismatch'
    );

    assert.equal(controlRun.waveSummaries.length, wavePlan.waves.length, 'Wave summary count mismatch');
    for (const wave of controlRun.waveSummaries) {
        assert.ok(wave.taskCount >= 1, `Wave ${wave.waveId} has no tasks`);
        assert.equal(
            wave.successCount + wave.failedCount + wave.approvalPendingCount + wave.skippedCount,
            wave.taskCount,
            `Wave ${wave.waveId} count mismatch`
        );
        assert.ok(wave.successRate >= 0 && wave.successRate <= 1, `Wave ${wave.waveId} invalid successRate`);
        assert.ok(wave.failureRate >= 0 && wave.failureRate <= 1, `Wave ${wave.waveId} invalid failureRate`);
        assert.ok(wave.avgLatencyMs >= 0, `Wave ${wave.waveId} invalid avgLatencyMs`);
        assert.ok(
            wave.posture === 'stable' || wave.posture === 'degraded' || wave.posture === 'critical',
            `Wave ${wave.waveId} invalid posture`
        );
    }

    const postureCounts = {
        stable: controlRun.waveSummaries.filter((entry) => entry.posture === 'stable').length,
        degraded: controlRun.waveSummaries.filter((entry) => entry.posture === 'degraded').length,
        critical: controlRun.waveSummaries.filter((entry) => entry.posture === 'critical').length
    };
    assert.equal(postureCounts.stable, controlRun.summary.wavePostureCounts.stable, 'Stable wave posture mismatch');
    assert.equal(postureCounts.degraded, controlRun.summary.wavePostureCounts.degraded, 'Degraded wave posture mismatch');
    assert.equal(postureCounts.critical, controlRun.summary.wavePostureCounts.critical, 'Critical wave posture mismatch');

    const criticalWaveIds = new Set(controlRun.waveSummaries.filter((entry) => entry.posture === 'critical').map((entry) => entry.waveId));
    const pauseTasks = followUpTasks.filter((task) => task.id.startsWith('control-wave-'));
    assert.equal(pauseTasks.length, criticalWaveIds.size, 'Expected one critical-wave pause task per critical wave');
    for (const task of pauseTasks) {
        assert.equal(task.to, 'agent:rollout-controller');
        assert.equal(task.priority, 'P0');
    }

    assert.ok(followUpTasks.length >= 1, 'Expected at least one control follow-up task');
    const reportTask = followUpTasks.find((task) => task.id === 'control-report-publish');
    assert.ok(reportTask, 'Missing control-report-publish task');
    assert.equal(reportTask?.to, 'agent:rollout-controller');

    for (const task of followUpTasks) {
        assert.equal(task.kind, 'task_request');
        assert.ok(task.id.length > 0);
        assert.ok(task.from.length > 0);
        assert.ok(task.to.length > 0);
        assert.ok(task.task.length > 0);
        assert.ok(task.priority === 'P0' || task.priority === 'P1' || task.priority === 'P2');
    }

    console.log(
        `[validate-skill-rollout-control] Validated control loop (${controlRun.summary.overallPosture}) ` +
        `with ${followUpTasks.length} follow-up tasks`
    );
}

main();
