import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillExecutionTask,
    SkillRolloutPromotionPolicyCanaryRun
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const POLICY_CANARY_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-canary.json');
const POLICY_CANARY_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-canary.md');
const POLICY_CANARY_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-canary-tasks.json');
const POLICY_CANARY_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-policy-canary-tasks.md');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    for (const requiredPath of [
        POLICY_CANARY_PATH,
        POLICY_CANARY_MD_PATH,
        POLICY_CANARY_TASKS_PATH,
        POLICY_CANARY_TASKS_MD_PATH
    ]) {
        assert.ok(fs.existsSync(requiredPath), `Missing required promotion policy canary artifact: ${requiredPath}`);
    }

    const canary = loadJson<SkillRolloutPromotionPolicyCanaryRun>(POLICY_CANARY_PATH);
    const tasks = loadJson<SkillExecutionTask[]>(POLICY_CANARY_TASKS_PATH);

    assert.ok(canary.sampleSize >= 1, 'Canary sample size should be >= 1');
    assert.ok(canary.scenarioCount >= 3, 'Canary requires at least three scenarios');
    assert.ok(
        canary.decision === 'adopt' || canary.decision === 'defer' || canary.decision === 'rollback',
        'Invalid canary decision'
    );
    assert.ok(canary.confidence >= 0 && canary.confidence <= 1, 'Canary confidence out of range');
    assert.ok(canary.reasons.length >= 1, 'Canary must include reasons');

    assert.equal(canary.scenarioCount, canary.scenarios.length, 'Canary scenario count mismatch');
    const weightedScore = Number(
        canary.scenarios
            .reduce((sum, scenario) => sum + scenario.scoreDelta * scenario.weight, 0)
            .toFixed(3)
    );
    assert.equal(weightedScore, canary.scoreDelta, 'Canary score delta mismatch with scenario-weighted score');

    const uniqueBreaches = Array.from(new Set(canary.scenarios.flatMap((scenario) => scenario.guardrailBreaches))).sort();
    assert.deepEqual(uniqueBreaches, canary.guardrailBreaches, 'Canary guardrail breach aggregation mismatch');

    for (const scenario of canary.scenarios) {
        assert.ok(scenario.weight >= 0 && scenario.weight <= 1, `Invalid scenario weight: ${scenario.name}`);
        assert.ok(scenario.baseline.failureRate >= 0 && scenario.baseline.failureRate <= 1);
        assert.ok(scenario.candidate.failureRate >= 0 && scenario.candidate.failureRate <= 1);
        assert.ok(scenario.baseline.approvalPendingRate >= 0 && scenario.baseline.approvalPendingRate <= 1);
        assert.ok(scenario.candidate.approvalPendingRate >= 0 && scenario.candidate.approvalPendingRate <= 1);
        assert.ok(scenario.baseline.successRate >= 0 && scenario.baseline.successRate <= 1);
        assert.ok(scenario.candidate.successRate >= 0 && scenario.candidate.successRate <= 1);
        assert.ok(scenario.baseline.candidateWinRate >= 0 && scenario.baseline.candidateWinRate <= 1);
        assert.ok(scenario.candidate.candidateWinRate >= 0 && scenario.candidate.candidateWinRate <= 1);
    }

    assert.ok(tasks.length >= 3, 'Expected at least three canary tasks');
    assert.ok(tasks.some((task) => task.id === 'promotion-policy-canary-publish'), 'Missing canary publish task');
    assert.ok(tasks.some((task) => task.id === 'promotion-policy-canary-audit'), 'Missing canary audit task');

    if (canary.decision === 'adopt') {
        assert.ok(tasks.some((task) => task.id === 'promotion-policy-canary-adopt'), 'Missing canary adopt task');
    } else if (canary.decision === 'rollback') {
        assert.ok(tasks.some((task) => task.id === 'promotion-policy-canary-rollback'), 'Missing canary rollback task');
    } else {
        assert.ok(tasks.some((task) => task.id === 'promotion-policy-canary-defer'), 'Missing canary defer task');
    }

    console.log(
        `[validate-skill-rollout-promotion-policy-canary] Validated canary decision=${canary.decision} ` +
        `scenarios=${canary.scenarioCount} tasks=${tasks.length}`
    );
}

main();
