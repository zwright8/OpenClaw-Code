import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillExecutionTask,
    SkillRolloutPromotionPolicyLabRun
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const POLICY_LAB_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab.json');
const POLICY_LAB_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab.md');
const POLICY_LAB_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab-tasks.json');
const POLICY_LAB_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-lab-tasks.md');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    for (const requiredPath of [
        POLICY_LAB_PATH,
        POLICY_LAB_MD_PATH,
        POLICY_LAB_TASKS_PATH,
        POLICY_LAB_TASKS_MD_PATH
    ]) {
        assert.ok(fs.existsSync(requiredPath), `Missing required promotion policy lab artifact: ${requiredPath}`);
    }

    const labRun = loadJson<SkillRolloutPromotionPolicyLabRun>(POLICY_LAB_PATH);
    const tasks = loadJson<SkillExecutionTask[]>(POLICY_LAB_TASKS_PATH);

    assert.ok(labRun.sampleSize >= 1, 'Expected lab sample size >= 1');
    assert.ok(
        labRun.driftLevel === 'stable' || labRun.driftLevel === 'watch' || labRun.driftLevel === 'critical',
        'Invalid policy lab drift level'
    );
    assert.ok(labRun.variants.length >= 3, 'Expected at least three policy lab variants');
    assert.ok(labRun.assumptions.length >= 1, 'Expected at least one policy lab assumption');

    const baseline = labRun.variants.find((variant) => variant.name === 'baseline');
    assert.ok(baseline, 'Missing baseline policy lab variant');

    const scoreSorted = labRun.variants.slice().sort((a, b) => a.score - b.score);
    assert.equal(
        scoreSorted[0].score,
        labRun.recommendedScore,
        'Recommended score must match top-ranked variant score'
    );

    assert.equal(
        labRun.baselineScore,
        baseline.score,
        'Baseline score mismatch with baseline variant score'
    );
    assert.equal(
        labRun.scoreDelta,
        Number((labRun.recommendedScore - labRun.baselineScore).toFixed(3)),
        'Policy lab score delta mismatch'
    );

    for (const variant of labRun.variants) {
        assert.ok(variant.rationale.length >= 1, `Variant ${variant.name} missing rationale`);
        assert.ok(variant.projectedFailureRate >= 0 && variant.projectedFailureRate <= 1, 'Projected failure rate out of range');
        assert.ok(
            variant.projectedApprovalPendingRate >= 0 && variant.projectedApprovalPendingRate <= 1,
            'Projected approval pending rate out of range'
        );
        assert.ok(variant.projectedSuccessRate >= 0 && variant.projectedSuccessRate <= 1, 'Projected success rate out of range');
        assert.ok(
            variant.projectedCandidateWinRate >= 0 && variant.projectedCandidateWinRate <= 1,
            'Projected candidate win-rate out of range'
        );
        assert.ok(variant.projectedRejectionRate >= 0 && variant.projectedRejectionRate <= 1, 'Projected rejection rate out of range');
    }

    assert.ok(tasks.length >= 3, 'Expected at least three policy lab tasks');
    assert.ok(tasks.some((task) => task.id === 'promotion-policy-lab-publish'), 'Missing promotion-policy-lab-publish task');
    assert.ok(tasks.some((task) => task.id === 'promotion-policy-lab-audit'), 'Missing promotion-policy-lab-audit task');

    const hasCanary = tasks.some((task) => task.id === 'promotion-policy-lab-canary');
    const hasMaintain = tasks.some((task) => task.id === 'promotion-policy-lab-maintain');
    assert.ok(hasCanary || hasMaintain, 'Expected either canary or maintain task');

    if (labRun.driftLevel === 'critical') {
        assert.ok(
            tasks.some((task) => task.id === 'promotion-policy-lab-critical-review'),
            'Critical drift should include critical review task'
        );
    }

    console.log(
        `[validate-skill-rollout-promotion-policy-lab] Validated policy lab drift=${labRun.driftLevel} ` +
        `variants=${labRun.variants.length} tasks=${tasks.length}`
    );
}

main();
