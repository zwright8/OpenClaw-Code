import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillExecutionTask,
    SkillRolloutPromotionPolicyDriftReport,
    SkillRolloutPromotionPolicyHistory
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const STATE_ROOT = path.join(REPO_ROOT, 'skills', 'state');
const POLICY_HISTORY_STATE_PATH = path.join(STATE_ROOT, 'runtime.rollout-promotion-policy-history.state.json');
const POLICY_HISTORY_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-history.json');
const POLICY_HISTORY_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-history.md');
const POLICY_DRIFT_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-drift.json');
const POLICY_DRIFT_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-drift.md');
const POLICY_DRIFT_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-drift-tasks.json');
const POLICY_DRIFT_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-drift-tasks.md');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    for (const requiredPath of [
        POLICY_HISTORY_PATH,
        POLICY_HISTORY_STATE_PATH,
        POLICY_HISTORY_MD_PATH,
        POLICY_DRIFT_PATH,
        POLICY_DRIFT_MD_PATH,
        POLICY_DRIFT_TASKS_PATH,
        POLICY_DRIFT_TASKS_MD_PATH
    ]) {
        assert.ok(fs.existsSync(requiredPath), `Missing required promotion-history artifact: ${requiredPath}`);
    }

    const history = loadJson<SkillRolloutPromotionPolicyHistory>(POLICY_HISTORY_PATH);
    const historyState = loadJson<SkillRolloutPromotionPolicyHistory>(POLICY_HISTORY_STATE_PATH);
    const drift = loadJson<SkillRolloutPromotionPolicyDriftReport>(POLICY_DRIFT_PATH);
    const driftTasks = loadJson<SkillExecutionTask[]>(POLICY_DRIFT_TASKS_PATH);

    assert.equal(history.entryCount, history.entries.length, 'History entryCount mismatch');
    assert.ok(history.entryCount >= 1, 'Expected at least one history entry');
    assert.deepEqual(historyState, history, 'Persistent history state mismatch');

    for (const entry of history.entries) {
        assert.ok(
            entry.promotionStatus === 'approved' || entry.promotionStatus === 'rejected',
            `Invalid promotion status in history: ${entry.promotionStatus}`
        );
        assert.ok(
            entry.controlPosture === 'stable' || entry.controlPosture === 'degraded' || entry.controlPosture === 'critical',
            `Invalid control posture in history: ${entry.controlPosture}`
        );
        assert.ok(
            entry.adjustmentStrategy === 'tighten' || entry.adjustmentStrategy === 'maintain' || entry.adjustmentStrategy === 'relax',
            `Invalid adjustment strategy in history: ${entry.adjustmentStrategy}`
        );
        assert.ok(entry.policy.minCandidateWinRate >= 0.45 && entry.policy.minCandidateWinRate <= 0.75);
        assert.ok(entry.policy.maxWeightedScoreDelta >= 0.1 && entry.policy.maxWeightedScoreDelta <= 12);
        assert.ok(entry.policy.maxWorstScoreDelta >= 20 && entry.policy.maxWorstScoreDelta <= 200);
    }

    assert.ok(
        drift.driftLevel === 'stable' || drift.driftLevel === 'watch' || drift.driftLevel === 'critical',
        'Invalid drift level'
    );
    assert.ok(drift.sampleSize >= 1, 'Invalid drift sample size');
    assert.ok(drift.reasons.length >= 1, 'Drift report should include reasons');
    assert.ok(drift.recommendedActions.length >= 1, 'Drift report should include recommended actions');

    for (const value of Object.values(drift.trend)) {
        assert.ok(Number.isFinite(value), 'Drift trend contains non-finite value');
    }

    assert.ok(driftTasks.length >= 3, 'Expected at least three drift tasks');
    assert.ok(driftTasks.some((task) => task.id === 'promotion-drift-publish'), 'Missing promotion-drift-publish task');
    assert.ok(driftTasks.some((task) => task.id === 'promotion-drift-audit'), 'Missing promotion-drift-audit task');

    if (drift.driftLevel === 'critical') {
        assert.ok(
            driftTasks.some((task) => task.id === 'promotion-drift-critical-response'),
            'Critical drift should include critical response task'
        );
    } else if (drift.driftLevel === 'watch') {
        assert.ok(
            driftTasks.some((task) => task.id === 'promotion-drift-watch-review'),
            'Watch drift should include watch review task'
        );
    } else {
        assert.ok(
            driftTasks.some((task) => task.id === 'promotion-drift-stable-monitor'),
            'Stable drift should include stable monitor task'
        );
    }

    console.log(
        `[validate-skill-rollout-promotion-history] Validated history entries=${history.entryCount} ` +
        `drift=${drift.driftLevel} tasks=${driftTasks.length}`
    );
}

main();
