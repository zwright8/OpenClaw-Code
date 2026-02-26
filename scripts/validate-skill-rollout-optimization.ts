import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillRolloutControlRun,
    SkillRolloutPromotionDecision,
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
const PROMOTION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion.json');
const PROMOTION_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion.md');

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
        OPTIMIZED_CONTROL_TASKS_PATH,
        PROMOTION_PATH,
        PROMOTION_MD_PATH
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
    const promotion = loadJson<SkillRolloutPromotionDecision>(PROMOTION_PATH);

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
    assert.equal(
        optimization.search.scoreDelta,
        Number((optimization.search.selectedScore - optimization.search.baselineScore).toFixed(3)),
        'Optimization search scoreDelta mismatch'
    );

    const current = optimization.recommendation.currentConfig;
    const recommended = optimization.recommendation.recommendedConfig;
    assert.ok(current.nowWaveCapacity >= 8 && current.nextWaveCapacity >= 8 && current.maxPerDomainPerWave >= 1);
    assert.ok(recommended.nowWaveCapacity >= 8 && recommended.nextWaveCapacity >= 8 && recommended.maxPerDomainPerWave >= 1);
    assert.ok(optimization.recommendation.reasons.length >= 1, 'Optimization recommendation must include reasons');
    assert.ok(
        optimization.promotion.status === 'approved' || optimization.promotion.status === 'rejected',
        'Invalid promotion status'
    );
    assert.ok(optimization.promotion.rationale.length >= 1, 'Promotion decision must include rationale');
    assert.ok(optimization.promotion.robustness.scenarioCount >= 1, 'Expected at least one robustness scenario');
    assert.ok(optimization.promotion.robustness.evaluatedTrials >= 1, 'Expected at least one robustness trial');
    assert.ok(
        optimization.promotion.robustness.candidateWinRate >= 0
        && optimization.promotion.robustness.candidateWinRate <= 1,
        'Promotion candidate win-rate out of range'
    );
    assert.ok(
        Number.isFinite(optimization.promotion.robustness.weightedScoreDelta),
        'Invalid weighted score delta'
    );
    assert.ok(
        optimization.promotion.policy.minCandidateWinRate >= 0
        && optimization.promotion.policy.minCandidateWinRate <= 1,
        'Invalid minCandidateWinRate policy threshold'
    );
    assert.ok(
        optimization.promotion.policy.maxWorstScoreDelta >= optimization.promotion.policy.maxWeightedScoreDelta,
        'Promotion score policy thresholds are inconsistent'
    );
    assert.deepEqual(promotion, optimization.promotion, 'Standalone promotion artifact mismatch');

    const expectedTrialCount = optimization.promotion.robustness.scenarios
        .reduce((sum, scenario) => sum + scenario.trials, 0);
    assert.equal(
        optimization.promotion.robustness.evaluatedTrials,
        expectedTrialCount,
        'Promotion evaluatedTrials mismatch'
    );
    assert.equal(
        optimization.promotion.robustness.scenarioCount,
        optimization.promotion.robustness.scenarios.length,
        'Promotion scenario count mismatch'
    );
    assert.equal(
        optimization.promotion.baselineConfig.nowWaveCapacity,
        optimization.recommendation.currentConfig.nowWaveCapacity,
        'Promotion baseline nowWaveCapacity mismatch'
    );
    assert.equal(
        optimization.promotion.baselineConfig.nextWaveCapacity,
        optimization.recommendation.currentConfig.nextWaveCapacity,
        'Promotion baseline nextWaveCapacity mismatch'
    );
    assert.equal(
        optimization.promotion.baselineConfig.maxPerDomainPerWave,
        optimization.recommendation.currentConfig.maxPerDomainPerWave,
        'Promotion baseline maxPerDomainPerWave mismatch'
    );

    assert.equal(
        optimizedWaves.config.nowWaveCapacity,
        optimization.promotion.effectiveConfig.nowWaveCapacity,
        'Optimized nowWaveCapacity mismatch'
    );
    assert.equal(
        optimizedWaves.config.nextWaveCapacity,
        optimization.promotion.effectiveConfig.nextWaveCapacity,
        'Optimized nextWaveCapacity mismatch'
    );
    assert.equal(
        optimizedWaves.config.maxPerDomainPerWave,
        optimization.promotion.effectiveConfig.maxPerDomainPerWave,
        'Optimized maxPerDomainPerWave mismatch'
    );
    if (optimization.promotion.status === 'approved') {
        assert.equal(
            optimization.promotion.effectiveConfig.nowWaveCapacity,
            optimization.search.selectedConfig.nowWaveCapacity,
            'Approved promotion must use selected nowWaveCapacity'
        );
        assert.equal(
            optimization.promotion.effectiveConfig.nextWaveCapacity,
            optimization.search.selectedConfig.nextWaveCapacity,
            'Approved promotion must use selected nextWaveCapacity'
        );
        assert.equal(
            optimization.promotion.effectiveConfig.maxPerDomainPerWave,
            optimization.search.selectedConfig.maxPerDomainPerWave,
            'Approved promotion must use selected maxPerDomainPerWave'
        );
    } else {
        assert.equal(
            optimization.promotion.effectiveConfig.nowWaveCapacity,
            optimization.recommendation.currentConfig.nowWaveCapacity,
            'Rejected promotion must retain baseline nowWaveCapacity'
        );
        assert.equal(
            optimization.promotion.effectiveConfig.nextWaveCapacity,
            optimization.recommendation.currentConfig.nextWaveCapacity,
            'Rejected promotion must retain baseline nextWaveCapacity'
        );
        assert.equal(
            optimization.promotion.effectiveConfig.maxPerDomainPerWave,
            optimization.recommendation.currentConfig.maxPerDomainPerWave,
            'Rejected promotion must retain baseline maxPerDomainPerWave'
        );
    }

    assert.equal(
        optimizedWaves.summary.scheduledSkills + optimizedWaves.summary.oversightSkills,
        1000,
        'Optimized wave plan must cover 1000 skills'
    );
    assert.equal(optimizedControl.sourceTaskCount, optimizedWaveTasks.length, 'Optimized control source task count mismatch');
    assert.equal(optimizedControl.taskResults.length, optimizedWaveTasks.length, 'Optimized task result count mismatch');
    assert.ok(optimizedControlTasks.length >= 1, 'Expected optimized control follow-up tasks');

    if (optimization.promotion.status === 'approved') {
        assert.equal(
            optimizedControl.summary.totalTasks,
            optimization.candidate.controlSummary.totalTasks,
            'Approved promotion must emit candidate control summary'
        );
    } else {
        assert.equal(
            optimizedControl.summary.totalTasks,
            optimization.baseline.controlSummary.totalTasks,
            'Rejected promotion must emit baseline control summary'
        );
    }

    const baselineWaveCount = optimization.baseline.waveSummary.waveCounts.now + optimization.baseline.waveSummary.waveCounts.next;
    const candidateWaveCount = optimization.candidate.waveSummary.waveCounts.now + optimization.candidate.waveSummary.waveCounts.next;
    const computedDelta = {
        waveCountDelta: candidateWaveCount - baselineWaveCount,
        taskCountDelta: optimization.candidate.controlSummary.totalTasks - optimization.baseline.controlSummary.totalTasks,
        failureDelta: optimization.candidate.controlSummary.failedCount - optimization.baseline.controlSummary.failedCount,
        approvalPendingDelta: optimization.candidate.controlSummary.approvalPendingCount - optimization.baseline.controlSummary.approvalPendingCount,
        skippedDelta: optimization.candidate.controlSummary.skippedCount - optimization.baseline.controlSummary.skippedCount,
        criticalWavesDelta: optimization.candidate.controlSummary.wavePostureCounts.critical - optimization.baseline.controlSummary.wavePostureCounts.critical,
        degradedWavesDelta: optimization.candidate.controlSummary.wavePostureCounts.degraded - optimization.baseline.controlSummary.wavePostureCounts.degraded,
        stableWavesDelta: optimization.candidate.controlSummary.wavePostureCounts.stable - optimization.baseline.controlSummary.wavePostureCounts.stable
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
        `promotion=${optimization.promotion.status} ` +
        `waveDelta=${optimization.delta.waveCountDelta} failureDelta=${optimization.delta.failureDelta} ` +
        `pendingDelta=${optimization.delta.approvalPendingDelta}`
    );
}

main();
