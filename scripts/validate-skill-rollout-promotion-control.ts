import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillExecutionTask,
    SkillRolloutPromotionControlRun,
    SkillRolloutPromotionPolicyAdjustment
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const PROMOTION_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-tasks.json');
const PROMOTION_CONTROL_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-control.json');
const PROMOTION_CONTROL_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-control.md');
const PROMOTION_POLICY_ADJUSTMENT_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-adjustment.json');
const PROMOTION_POLICY_ADJUSTMENT_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-adjustment.md');
const PROMOTION_ADJUSTMENT_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-adjustment-tasks.json');
const PROMOTION_ADJUSTMENT_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-adjustment-tasks.md');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    for (const requiredPath of [
        PROMOTION_TASKS_PATH,
        PROMOTION_CONTROL_PATH,
        PROMOTION_CONTROL_MD_PATH,
        PROMOTION_POLICY_ADJUSTMENT_PATH,
        PROMOTION_POLICY_ADJUSTMENT_MD_PATH,
        PROMOTION_ADJUSTMENT_TASKS_PATH,
        PROMOTION_ADJUSTMENT_TASKS_MD_PATH
    ]) {
        assert.ok(fs.existsSync(requiredPath), `Missing required promotion-control artifact: ${requiredPath}`);
    }

    const promotionTasks = loadJson<SkillExecutionTask[]>(PROMOTION_TASKS_PATH);
    const controlRun = loadJson<SkillRolloutPromotionControlRun>(PROMOTION_CONTROL_PATH);
    const adjustment = loadJson<SkillRolloutPromotionPolicyAdjustment>(PROMOTION_POLICY_ADJUSTMENT_PATH);
    const adjustmentTasks = loadJson<SkillExecutionTask[]>(PROMOTION_ADJUSTMENT_TASKS_PATH);

    assert.equal(controlRun.sourceTaskCount, promotionTasks.length, 'Promotion control source task count mismatch');
    assert.equal(controlRun.taskResults.length, promotionTasks.length, 'Promotion control result count mismatch');

    assert.ok(
        controlRun.summary.overallPosture === 'stable'
        || controlRun.summary.overallPosture === 'degraded'
        || controlRun.summary.overallPosture === 'critical',
        'Invalid promotion control posture'
    );

    const summaryTotal =
        controlRun.summary.successCount
        + controlRun.summary.failedCount
        + controlRun.summary.approvalPendingCount
        + controlRun.summary.skippedCount;
    assert.equal(summaryTotal, controlRun.summary.totalTasks, 'Promotion summary totals mismatch');

    const categoryCountTotal = Object.values(controlRun.summary.categoryCounts)
        .reduce((sum, value) => sum + value, 0);
    assert.equal(categoryCountTotal, controlRun.summary.totalTasks, 'Promotion category count totals mismatch');

    for (const category of Object.keys(controlRun.summary.categoryCounts)) {
        const key = category as keyof typeof controlRun.summary.categoryCounts;
        assert.ok(
            controlRun.summary.categoryFailureCounts[key] <= controlRun.summary.categoryCounts[key],
            `Category failed count exceeds total for ${category}`
        );
        assert.ok(
            controlRun.summary.categoryPendingCounts[key] <= controlRun.summary.categoryCounts[key],
            `Category pending count exceeds total for ${category}`
        );
    }

    assert.ok(
        adjustment.strategy === 'tighten' || adjustment.strategy === 'maintain' || adjustment.strategy === 'relax',
        'Invalid promotion policy adjustment strategy'
    );
    assert.ok(adjustment.confidence >= 0 && adjustment.confidence <= 1, 'Adjustment confidence out of range');
    assert.ok(adjustment.reasons.length >= 1, 'Adjustment must include at least one reason');

    assert.ok(
        adjustment.recommendedPolicy.minCandidateWinRate >= 0.45
        && adjustment.recommendedPolicy.minCandidateWinRate <= 0.75,
        'Recommended minCandidateWinRate out of bounds'
    );
    assert.ok(
        adjustment.recommendedPolicy.maxWeightedScoreDelta >= 0.1
        && adjustment.recommendedPolicy.maxWeightedScoreDelta <= 12,
        'Recommended maxWeightedScoreDelta out of bounds'
    );
    assert.ok(
        adjustment.recommendedPolicy.maxWorstScoreDelta >= 20
        && adjustment.recommendedPolicy.maxWorstScoreDelta <= 200,
        'Recommended maxWorstScoreDelta out of bounds'
    );

    if (adjustment.strategy === 'tighten') {
        assert.ok(
            adjustment.recommendedPolicy.minCandidateWinRate >= adjustment.currentPolicy.minCandidateWinRate,
            'Tighten strategy must not reduce minCandidateWinRate'
        );
        assert.ok(
            adjustment.recommendedPolicy.maxWeightedScoreDelta <= adjustment.currentPolicy.maxWeightedScoreDelta,
            'Tighten strategy must not increase maxWeightedScoreDelta'
        );
    }

    if (adjustment.strategy === 'relax') {
        assert.ok(
            adjustment.recommendedPolicy.minCandidateWinRate <= adjustment.currentPolicy.minCandidateWinRate,
            'Relax strategy must not increase minCandidateWinRate'
        );
        assert.ok(
            adjustment.recommendedPolicy.maxWeightedScoreDelta >= adjustment.currentPolicy.maxWeightedScoreDelta,
            'Relax strategy must not decrease maxWeightedScoreDelta'
        );
    }

    if (adjustment.strategy === 'maintain') {
        assert.equal(
            adjustment.recommendedPolicy.minCandidateWinRate,
            adjustment.currentPolicy.minCandidateWinRate,
            'Maintain strategy should keep minCandidateWinRate unchanged'
        );
        assert.equal(
            adjustment.recommendedPolicy.maxWeightedScoreDelta,
            adjustment.currentPolicy.maxWeightedScoreDelta,
            'Maintain strategy should keep maxWeightedScoreDelta unchanged'
        );
    }

    assert.ok(adjustmentTasks.length >= 3, 'Expected at least three promotion adjustment tasks');
    assert.ok(
        adjustmentTasks.some((task) => task.id === 'promotion-adjustment-publish'),
        'Missing promotion-adjustment-publish task'
    );
    assert.ok(
        adjustmentTasks.some((task) => task.id === 'promotion-adjustment-audit'),
        'Missing promotion-adjustment-audit task'
    );

    if (adjustment.strategy === 'tighten') {
        assert.ok(
            adjustmentTasks.some((task) => task.id === 'promotion-adjustment-apply-tighten'),
            'Missing tighten strategy task'
        );
    } else if (adjustment.strategy === 'relax') {
        assert.ok(
            adjustmentTasks.some((task) => task.id === 'promotion-adjustment-canary-relax'),
            'Missing relax strategy task'
        );
    } else {
        assert.ok(
            adjustmentTasks.some((task) => task.id === 'promotion-adjustment-maintain-policy'),
            'Missing maintain strategy task'
        );
    }

    console.log(
        `[validate-skill-rollout-promotion-control] Validated promotion control posture=${controlRun.summary.overallPosture} ` +
        `strategy=${adjustment.strategy} tasks=${adjustmentTasks.length}`
    );
}

main();
