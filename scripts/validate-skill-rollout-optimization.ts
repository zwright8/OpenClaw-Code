import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillRolloutControlRun,
    SkillRolloutOptimizationRun,
    SkillRolloutWavePlan
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const BASELINE_WAVES_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.json');
const BASELINE_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-control.json');
const OPTIMIZATION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.json');
const OPTIMIZED_WAVES_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-waves.json');
const OPTIMIZED_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-control.json');
const OPTIMIZED_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-wave-tasks.json');
const OPTIMIZED_CONTROL_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimized-control-tasks.json');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    for (const requiredPath of [
        BASELINE_WAVES_PATH,
        BASELINE_CONTROL_PATH,
        OPTIMIZATION_PATH,
        OPTIMIZED_WAVES_PATH,
        OPTIMIZED_CONTROL_PATH,
        OPTIMIZED_TASKS_PATH,
        OPTIMIZED_CONTROL_TASKS_PATH
    ]) {
        assert.ok(fs.existsSync(requiredPath), `Missing required optimization artifact: ${requiredPath}`);
    }

    const baselineWaves = loadJson<SkillRolloutWavePlan>(BASELINE_WAVES_PATH);
    const baselineControl = loadJson<SkillRolloutControlRun>(BASELINE_CONTROL_PATH);
    const optimization = loadJson<SkillRolloutOptimizationRun>(OPTIMIZATION_PATH);
    const optimizedWaves = loadJson<SkillRolloutWavePlan>(OPTIMIZED_WAVES_PATH);
    const optimizedControl = loadJson<SkillRolloutControlRun>(OPTIMIZED_CONTROL_PATH);
    const optimizedWaveTasks = loadJson<Array<{ id: string; }>>(OPTIMIZED_TASKS_PATH);
    const optimizedControlTasks = loadJson<Array<{ id: string; }>>(OPTIMIZED_CONTROL_TASKS_PATH);

    assert.ok(
        optimization.recommendation.strategy === 'stabilize'
        || optimization.recommendation.strategy === 'balance'
        || optimization.recommendation.strategy === 'expand',
        'Invalid optimization strategy'
    );
    assert.ok(optimization.search.evaluatedCount >= 1, 'Expected at least one evaluated optimization candidate');
    assert.equal(optimization.search.candidates.length, optimization.search.evaluatedCount, 'Candidate count mismatch');
    assert.ok(Number.isFinite(optimization.search.baselineScore), 'Invalid baseline optimization score');
    assert.ok(Number.isFinite(optimization.search.selectedScore), 'Invalid selected optimization score');

    const current = optimization.recommendation.currentConfig;
    const recommended = optimization.recommendation.recommendedConfig;
    assert.ok(current.nowWaveCapacity >= 8 && current.nextWaveCapacity >= 8 && current.maxPerDomainPerWave >= 1);
    assert.ok(recommended.nowWaveCapacity >= 8 && recommended.nextWaveCapacity >= 8 && recommended.maxPerDomainPerWave >= 1);
    assert.ok(optimization.recommendation.reasons.length >= 1, 'Optimization recommendation must include reasons');

    assert.equal(
        optimizedWaves.config.nowWaveCapacity,
        optimization.search.selectedConfig.nowWaveCapacity,
        'Optimized nowWaveCapacity mismatch'
    );
    assert.equal(
        optimizedWaves.config.nextWaveCapacity,
        optimization.search.selectedConfig.nextWaveCapacity,
        'Optimized nextWaveCapacity mismatch'
    );
    assert.equal(
        optimizedWaves.config.maxPerDomainPerWave,
        optimization.search.selectedConfig.maxPerDomainPerWave,
        'Optimized maxPerDomainPerWave mismatch'
    );

    assert.equal(
        optimizedWaves.summary.scheduledSkills + optimizedWaves.summary.oversightSkills,
        1000,
        'Optimized wave plan must cover 1000 skills'
    );
    assert.equal(optimizedControl.sourceTaskCount, optimizedWaveTasks.length, 'Optimized control source task count mismatch');
    assert.equal(optimizedControl.taskResults.length, optimizedWaveTasks.length, 'Optimized task result count mismatch');
    assert.ok(optimizedControlTasks.length >= 1, 'Expected optimized control follow-up tasks');

    const computedDelta = {
        waveCountDelta: optimizedWaves.waves.length - baselineWaves.waves.length,
        taskCountDelta: optimizedControl.summary.totalTasks - baselineControl.summary.totalTasks,
        failureDelta: optimizedControl.summary.failedCount - baselineControl.summary.failedCount,
        approvalPendingDelta: optimizedControl.summary.approvalPendingCount - baselineControl.summary.approvalPendingCount,
        skippedDelta: optimizedControl.summary.skippedCount - baselineControl.summary.skippedCount,
        criticalWavesDelta: optimizedControl.summary.wavePostureCounts.critical - baselineControl.summary.wavePostureCounts.critical,
        degradedWavesDelta: optimizedControl.summary.wavePostureCounts.degraded - baselineControl.summary.wavePostureCounts.degraded,
        stableWavesDelta: optimizedControl.summary.wavePostureCounts.stable - baselineControl.summary.wavePostureCounts.stable
    };
    assert.equal(computedDelta.waveCountDelta, optimization.delta.waveCountDelta, 'Optimization waveCountDelta mismatch');
    assert.equal(computedDelta.taskCountDelta, optimization.delta.taskCountDelta, 'Optimization taskCountDelta mismatch');
    assert.equal(computedDelta.failureDelta, optimization.delta.failureDelta, 'Optimization failureDelta mismatch');
    assert.equal(computedDelta.approvalPendingDelta, optimization.delta.approvalPendingDelta, 'Optimization approvalPendingDelta mismatch');
    assert.equal(computedDelta.skippedDelta, optimization.delta.skippedDelta, 'Optimization skippedDelta mismatch');
    assert.equal(computedDelta.criticalWavesDelta, optimization.delta.criticalWavesDelta, 'Optimization criticalWavesDelta mismatch');
    assert.equal(computedDelta.degradedWavesDelta, optimization.delta.degradedWavesDelta, 'Optimization degradedWavesDelta mismatch');
    assert.equal(computedDelta.stableWavesDelta, optimization.delta.stableWavesDelta, 'Optimization stableWavesDelta mismatch');

    console.log(
        `[validate-skill-rollout-optimization] Validated optimization (${optimization.recommendation.strategy}) ` +
        `waveDelta=${optimization.delta.waveCountDelta} failureDelta=${optimization.delta.failureDelta} ` +
        `pendingDelta=${optimization.delta.approvalPendingDelta}`
    );
}

main();
