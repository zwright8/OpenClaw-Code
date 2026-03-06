import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import type {
    SkillExecutionTask,
    SkillRolloutPlan,
    SkillRolloutWavePlan
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const SOURCE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-plan.json');
const WAVE_PLAN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-waves.json');
const WAVE_TASKS_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-wave-tasks.json');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    assert.ok(fs.existsSync(SOURCE_PLAN_PATH), `Missing source rollout plan: ${SOURCE_PLAN_PATH}`);
    assert.ok(fs.existsSync(WAVE_PLAN_PATH), `Missing wave plan: ${WAVE_PLAN_PATH}`);
    assert.ok(fs.existsSync(WAVE_TASKS_PATH), `Missing wave tasks: ${WAVE_TASKS_PATH}`);

    const sourcePlan = loadJson<SkillRolloutPlan>(SOURCE_PLAN_PATH);
    const wavePlan = loadJson<SkillRolloutWavePlan>(WAVE_PLAN_PATH);
    const tasks = loadJson<SkillExecutionTask[]>(WAVE_TASKS_PATH);

    const laneNow = sourcePlan.entries.filter((entry) => entry.lane === 'now');
    const laneNext = sourcePlan.entries.filter((entry) => entry.lane === 'next');
    const laneHold = sourcePlan.entries.filter((entry) => entry.lane === 'hold');

    const scheduledFromWaves = wavePlan.waves.reduce((sum, wave) => sum + wave.entryCount, 0);
    assert.equal(scheduledFromWaves, wavePlan.summary.scheduledSkills, 'Scheduled count mismatch in wave summary');
    assert.equal(wavePlan.oversightQueue.length, wavePlan.summary.oversightSkills, 'Oversight count mismatch in wave summary');
    assert.equal(wavePlan.summary.scheduledSkills + wavePlan.summary.oversightSkills, 1000, 'Wave plan should cover all 1000 skills');

    assert.equal(wavePlan.summary.scheduledSkills, laneNow.length + laneNext.length, 'Scheduled count should equal now+next lanes');
    assert.equal(wavePlan.summary.oversightSkills, laneHold.length, 'Oversight queue should equal hold lane count');
    assert.equal(
        wavePlan.summary.waveCounts.now + wavePlan.summary.waveCounts.next,
        wavePlan.waves.length,
        'Wave count summary mismatch'
    );
    assert.ok(wavePlan.summary.avgWaveFillRate > 0 && wavePlan.summary.avgWaveFillRate <= 1.001, 'Invalid avgWaveFillRate');

    const seenSkillIds = new Set<number>();
    const executionOrders = new Set<number>();
    for (const wave of wavePlan.waves) {
        assert.ok(wave.entryCount <= wave.capacity, `Wave ${wave.waveId} exceeds capacity`);
        assert.equal(wave.entries.length, wave.entryCount, `Wave ${wave.waveId} entry count mismatch`);

        const domainCounts = new Map<string, number>();
        for (const entry of wave.entries) {
            assert.ok(!seenSkillIds.has(entry.skillId), `Skill ${entry.skillId} appears in multiple waves`);
            seenSkillIds.add(entry.skillId);

            assert.equal(entry.waveId, wave.waveId, `Wave id mismatch for skill ${entry.skillId}`);
            assert.equal(entry.waveIndex, wave.waveIndex, `Wave index mismatch for skill ${entry.skillId}`);
            assert.ok(entry.lane === 'now' || entry.lane === 'next', `Invalid wave lane for skill ${entry.skillId}`);
            assert.ok(entry.executionOrder >= 1, `Invalid execution order for ${entry.skillId}`);
            assert.ok(!executionOrders.has(entry.executionOrder), `Duplicate execution order ${entry.executionOrder}`);
            executionOrders.add(entry.executionOrder);
            assert.ok(entry.readinessIndex >= 0 && entry.readinessIndex <= 100);
            assert.ok(entry.riskIndex >= 0 && entry.riskIndex <= 100);

            domainCounts.set(entry.domain, (domainCounts.get(entry.domain) || 0) + 1);
        }

        for (const [domain, count] of domainCounts.entries()) {
            assert.ok(count <= wavePlan.config.maxPerDomainPerWave, `Wave ${wave.waveId} exceeds per-domain cap for ${domain}`);
        }
    }
    assert.equal(executionOrders.size, wavePlan.summary.scheduledSkills, 'Execution orders should cover all scheduled skills');

    for (const item of wavePlan.oversightQueue) {
        assert.ok(!seenSkillIds.has(item.skillId), `Skill ${item.skillId} duplicated between waves and oversight queue`);
        seenSkillIds.add(item.skillId);
        assert.equal(item.priority, 'P0', `Oversight item ${item.skillId} must be P0`);
    }
    assert.equal(seenSkillIds.size, 1000, `Expected 1000 unique skills in wave plan, found ${seenSkillIds.size}`);

    const kickoffTasks = tasks.filter((task) => task.id.startsWith('wave-kickoff-'));
    const waveSkillTasks = tasks.filter((task) => task.id.startsWith('wave-') && !task.id.startsWith('wave-kickoff-'));
    const oversightTasks = tasks.filter((task) => task.id.startsWith('oversight-'));

    assert.equal(kickoffTasks.length, wavePlan.waves.length, 'Expected one kickoff task per wave');
    assert.equal(waveSkillTasks.length, wavePlan.summary.scheduledSkills, 'Expected one skill task per scheduled skill');
    assert.equal(oversightTasks.length, wavePlan.summary.oversightSkills, 'Expected one oversight task per hold skill');
    assert.equal(tasks.length, kickoffTasks.length + waveSkillTasks.length + oversightTasks.length, 'Unexpected total task count');

    for (const task of kickoffTasks) {
        assert.equal(task.to, 'agent:rollout-controller', `Kickoff task ${task.id} must target rollout controller`);
        assert.equal(task.kind, 'task_request');
    }
    for (const task of oversightTasks) {
        assert.equal(task.to, 'agent:human-oversight', `Oversight task ${task.id} must target human oversight`);
        assert.equal(task.priority, 'P0', `Oversight task ${task.id} must be P0`);
    }

    console.log(
        `[validate-skill-rollout-orchestration] Validated ${wavePlan.waves.length} waves, ` +
        `${wavePlan.summary.scheduledSkills} scheduled skills, ${wavePlan.summary.oversightSkills} oversight skills`
    );
}

main();
