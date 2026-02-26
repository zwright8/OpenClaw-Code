import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillExecutionTask,
    SkillRolloutOptimizationRun
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const OPTIMIZATION_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-optimization.json');
const PROMOTION_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-tasks.json');
const PROMOTION_TASKS_MD_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-promotion-tasks.md');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    for (const required of [OPTIMIZATION_PATH, PROMOTION_TASKS_PATH, PROMOTION_TASKS_MD_PATH]) {
        assert.ok(fs.existsSync(required), `Missing required promotion artifact: ${required}`);
    }

    const optimization = loadJson<SkillRolloutOptimizationRun>(OPTIMIZATION_PATH);
    const tasks = loadJson<SkillExecutionTask[]>(PROMOTION_TASKS_PATH);

    assert.ok(tasks.length >= 4, 'Expected at least four promotion tasks');

    const ids = new Set<string>();
    for (const task of tasks) {
        assert.equal(task.kind, 'task_request', `Task ${task.id} must be task_request`);
        assert.ok(task.id.length >= 6, 'Task id is too short');
        assert.ok(!ids.has(task.id), `Duplicate task id: ${task.id}`);
        ids.add(task.id);
        assert.ok(task.from.length >= 4, `Task ${task.id} missing from`);
        assert.ok(task.to.length >= 4, `Task ${task.id} missing to`);
        assert.ok(task.task.length >= 8, `Task ${task.id} missing task description`);
        assert.ok(
            task.priority === 'P0' || task.priority === 'P1' || task.priority === 'P2',
            `Task ${task.id} has invalid priority`
        );
    }

    const hasDecision = tasks.some((task) => task.id === 'promotion-decision-publish');
    const hasAudit = tasks.some((task) => task.id === 'promotion-audit-log');
    assert.ok(hasDecision, 'Expected promotion-decision-publish task');
    assert.ok(hasAudit, 'Expected promotion-audit-log task');

    const verifyTasks = tasks.filter((task) => task.id.startsWith('promotion-verify-'));
    const shadowTasks = tasks.filter((task) => task.id.startsWith('promotion-shadow-'));
    const hasApply = tasks.some((task) => task.id === 'promotion-apply-selected-config');
    const hasRetain = tasks.some((task) => task.id === 'promotion-retain-baseline-config');
    const hasInvestigation = tasks.some((task) => task.id === 'promotion-policy-investigation');

    if (optimization.promotion.status === 'approved') {
        assert.ok(hasApply, 'Approved promotion requires apply-selected-config task');
        assert.ok(!hasRetain, 'Approved promotion should not include retain-baseline-config task');
        assert.ok(verifyTasks.length >= 20, 'Approved promotion should include verify tasks for promoted skills');
        assert.equal(shadowTasks.length, 0, 'Approved promotion should not include shadow tasks');
    } else {
        assert.ok(hasRetain, 'Rejected promotion requires retain-baseline-config task');
        assert.ok(!hasApply, 'Rejected promotion should not include apply-selected-config task');
        assert.ok(hasInvestigation, 'Rejected promotion requires policy investigation task');
        assert.ok(shadowTasks.length >= 20, 'Rejected promotion should include shadow validation tasks');
        assert.equal(verifyTasks.length, 0, 'Rejected promotion should not include verify tasks');
    }

    console.log(
        `[validate-skill-rollout-promotion] Validated promotion tasks for ${optimization.promotion.status} ` +
        `decision (tasks=${tasks.length})`
    );
}

main();
