import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type { SkillExecutionTask, SkillRolloutPlan } from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const PLAN_JSON_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-plan.json');
const TASKS_JSON_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-tasks.json');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    assert.ok(fs.existsSync(PLAN_JSON_PATH), `Missing rollout plan file: ${PLAN_JSON_PATH}`);
    assert.ok(fs.existsSync(TASKS_JSON_PATH), `Missing rollout tasks file: ${TASKS_JSON_PATH}`);

    const plan = loadJson<SkillRolloutPlan>(PLAN_JSON_PATH);
    const tasks = loadJson<SkillExecutionTask[]>(TASKS_JSON_PATH);

    assert.equal(plan.totalSkills, 1000, `Expected 1000 skills in rollout plan, found ${plan.totalSkills}`);
    assert.equal(plan.entries.length, 1000, `Expected 1000 rollout entries, found ${plan.entries.length}`);
    assert.ok(Array.isArray(plan.scenarios) && plan.scenarios.length >= 3, 'Expected at least 3 rollout scenarios');
    assert.ok(plan.summary.laneCounts.now >= 0, 'Invalid now lane count');
    assert.ok(plan.summary.laneCounts.next >= 0, 'Invalid next lane count');
    assert.ok(plan.summary.laneCounts.hold >= 0, 'Invalid hold lane count');
    assert.equal(
        plan.summary.laneCounts.now + plan.summary.laneCounts.next + plan.summary.laneCounts.hold,
        plan.entries.length,
        'Lane counts do not add up to total entries'
    );

    const scenarioWeight = plan.scenarios.reduce((sum, scenario) => sum + Number(scenario.weight), 0);
    assert.ok(Math.abs(scenarioWeight - 1) <= 0.002, `Scenario weights should sum to ~1.0, got ${scenarioWeight}`);

    const seenIds = new Set<number>();
    for (const entry of plan.entries) {
        assert.ok(!seenIds.has(entry.skillId), `Duplicate skill id in rollout plan: ${entry.skillId}`);
        seenIds.add(entry.skillId);

        assert.ok(entry.skillName.length > 0, `Missing skill name for ${entry.skillId}`);
        assert.ok(entry.title.length > 0, `Missing title for ${entry.skillId}`);
        assert.ok(entry.lane === 'now' || entry.lane === 'next' || entry.lane === 'hold', `Invalid lane for ${entry.skillId}`);
        assert.ok(entry.priority === 'P0' || entry.priority === 'P1' || entry.priority === 'P2', `Invalid priority for ${entry.skillId}`);
        assert.ok(entry.readinessIndex >= 0 && entry.readinessIndex <= 100, `Invalid readinessIndex for ${entry.skillId}`);
        assert.ok(entry.riskIndex >= 0 && entry.riskIndex <= 100, `Invalid riskIndex for ${entry.skillId}`);
        assert.ok(entry.requiredApprovalGates.length >= 1, `Missing approval gates for ${entry.skillId}`);
        assert.ok(entry.reasons.length >= 1, `Missing reasons for ${entry.skillId}`);
        assert.equal(entry.assessments.length, plan.scenarios.length, `Scenario assessment count mismatch for ${entry.skillId}`);

        const postureTotal = entry.postureDistribution.ready
            + entry.postureDistribution.review_required
            + entry.postureDistribution.critical;
        assert.equal(postureTotal, plan.scenarios.length, `Invalid posture distribution for ${entry.skillId}`);
    }

    assert.equal(tasks.length, plan.entries.length, `Expected ${plan.entries.length} rollout tasks, found ${tasks.length}`);
    const taskById = new Map<number, SkillExecutionTask>();
    for (const task of tasks) {
        assert.equal(task.kind, 'task_request');
        assert.ok(task.id.startsWith('rollout-'), `Unexpected task id: ${task.id}`);
        assert.ok(task.from.length > 0, `Missing task sender for ${task.id}`);
        assert.ok(task.to.length > 0, `Missing task target for ${task.id}`);
        assert.ok(task.task.length > 0, `Missing task description for ${task.id}`);
        assert.ok(task.priority === 'P0' || task.priority === 'P1' || task.priority === 'P2');

        const skillId = Number(task.id.replace('rollout-', ''));
        assert.ok(Number.isFinite(skillId) && skillId >= 1 && skillId <= 1000, `Invalid skill id in task ${task.id}`);
        taskById.set(skillId, task);
    }

    for (const entry of plan.entries) {
        const task = taskById.get(entry.skillId);
        assert.ok(task, `Missing task for skill ${entry.skillId}`);
        assert.equal(task?.priority, entry.priority, `Priority mismatch for skill ${entry.skillId}`);
        const context = (task?.context || {}) as Record<string, unknown>;
        assert.equal(context.skillId, entry.skillId, `Context skillId mismatch for skill ${entry.skillId}`);
        assert.equal(context.lane, entry.lane, `Context lane mismatch for skill ${entry.skillId}`);
    }

    console.log(
        `[validate-skill-rollout] Validated rollout plan for ${plan.entries.length} skills ` +
        `(now=${plan.summary.laneCounts.now}, next=${plan.summary.laneCounts.next}, hold=${plan.summary.laneCounts.hold})`
    );
}

main();
