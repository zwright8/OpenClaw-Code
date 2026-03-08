import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    buildAutonomousBatchPlan,
    computeErrorBudgetThrottle,
    computeFailureCooldownWaves,
    computeThrottledWaveSize,
    computeWaveFailureRate,
    loadCapabilityCatalog,
    loadExternalSkillCatalog,
    loadAutonomousState,
    runAutonomousOpenClaw
} from '../src/autonomous-openclaw.js';
import { loadSkillManifest } from '../../skills/runtime/index.js';

const cwd = path.resolve(process.cwd());
const REPO_ROOT = path.basename(cwd) === 'cognition-core'
    ? path.resolve(cwd, '..')
    : cwd;

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-autonomy-'));
}

test('loadCapabilityCatalog returns capability ids from capabilities entrypoint', () => {
    const ids = loadCapabilityCatalog(REPO_ROOT);
    assert.ok(ids.length > 50);
    assert.ok(ids.includes('truth_engine'));
    assert.ok(ids.includes('cultural_context_window_prioritizer'));
});

test('loadExternalSkillCatalog parses the 10,000-skill markdown catalog', () => {
    const entries = loadExternalSkillCatalog(path.join(REPO_ROOT, 'SKILLS_UPDATES_10000.md'));
    assert.equal(entries.length, 10000);
    assert.equal(entries[0].id, 1);
    assert.equal(entries[entries.length - 1].id, 10000);
});

test('buildAutonomousBatchPlan selects skills and capabilities with cursor progression', () => {
    const skillCatalog = loadSkillManifest(REPO_ROOT);
    const capabilityCatalog = loadCapabilityCatalog(REPO_ROOT);

    const plan = buildAutonomousBatchPlan({
        skillCatalog,
        capabilityCatalog,
        state: {
            runCount: 0,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: []
        },
        skillsPerWave: 3,
        capabilitiesPerWave: 2,
        waveIndex: 1,
        nowFactory: () => 100_000
    });

    assert.equal(plan.selection.skillIds.length, 3);
    assert.equal(plan.selection.capabilityIds.length, 2);
    assert.equal(plan.tasks.length, 5);
    assert.ok(plan.nextCursor.skillCursor > 0);
    assert.ok(plan.nextCursor.capabilityCursor > 0);

    const firstTask = plan.tasks[0];
    assert.equal(firstTask.context?.planner, 'cognition-core/autonomous-openclaw');
});

test('buildAutonomousBatchPlan deprioritizes cooldown entries and emits reliability context', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 1, code: 'SK-00001', title: 'Skill One' },
            { id: 2, code: 'SK-00002', title: 'Skill Two' },
            { id: 3, code: 'SK-00003', title: 'Skill Three' }
        ],
        capabilityCatalog: ['truth_engine', 'memory_drift'],
        state: {
            runCount: 3,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillFailureStreakById: {
                '1': 2
            },
            skillCooldownUntilRunById: {
                '1': 5
            }
        },
        skillsPerWave: 2,
        capabilitiesPerWave: 1,
        failureStreakThreshold: 2,
        failureCooldownWaves: 3,
        failureCooldownBackoffMultiplier: 2,
        failureCooldownMaxWaves: 10,
        waveIndex: 4,
        nowFactory: () => 200_000
    });

    assert.deepEqual(plan.selection.skillIds, [2, 3]);
    const skillTask = plan.tasks.find((task) => task.context?.skillId === 2);
    assert.equal(skillTask?.context?.autonomy?.reliability?.failureStreak, 0);
    assert.equal(skillTask?.context?.autonomy?.reliability?.failureStreakThreshold, 2);
    assert.equal(skillTask?.context?.autonomy?.reliability?.failureCooldownWaves, 3);
    assert.equal(skillTask?.context?.autonomy?.reliability?.failureCooldownBackoffMultiplier, 2);
    assert.equal(skillTask?.context?.autonomy?.reliability?.failureCooldownMaxWaves, 10);
});

test('computeFailureCooldownWaves scales exponentially and honors caps', () => {
    assert.equal(computeFailureCooldownWaves({
        failureStreak: 1,
        failureStreakThreshold: 2,
        failureCooldownWaves: 3
    }), 0);

    assert.equal(computeFailureCooldownWaves({
        failureStreak: 2,
        failureStreakThreshold: 2,
        failureCooldownWaves: 3,
        failureCooldownBackoffMultiplier: 2
    }), 3);

    assert.equal(computeFailureCooldownWaves({
        failureStreak: 4,
        failureStreakThreshold: 2,
        failureCooldownWaves: 3,
        failureCooldownBackoffMultiplier: 2
    }), 12);

    assert.equal(computeFailureCooldownWaves({
        failureStreak: 6,
        failureStreakThreshold: 2,
        failureCooldownWaves: 3,
        failureCooldownBackoffMultiplier: 2,
        failureCooldownMaxWaves: 16
    }), 16);
});

test('computeWaveFailureRate and error-budget throttle trigger under sustained failures', () => {
    assert.equal(computeWaveFailureRate({
        successfulCount: 6,
        failedCount: 4
    }), 0.4);

    const throttle = computeErrorBudgetThrottle({
        recentWaveFailureRates: [0.2, 0.5, 0.6, 0.3],
        errorBudgetWindowWaves: 3,
        errorBudgetFailureThreshold: 0.45,
        errorBudgetThrottleScale: 0.4
    });

    assert.equal(throttle.applied, true);
    assert.equal(throttle.scale, 0.4);
    assert.equal(throttle.averageFailureRate, 0.4667);
    assert.equal(throttle.sampleCount, 3);

    assert.equal(computeThrottledWaveSize({
        baseCount: 12,
        throttle,
        minimumCount: 2
    }), 4);
});

test('buildAutonomousBatchPlan backfills from cooldown entries when no alternatives exist', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 1, code: 'SK-00001', title: 'Skill One' },
            { id: 2, code: 'SK-00002', title: 'Skill Two' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 4,
            skillCursor: 0,
            successfulSkillIds: [],
            skillCooldownUntilRunById: {
                '1': 9,
                '2': 9
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 5,
        nowFactory: () => 210_000
    });

    assert.equal(plan.selection.skillIds.length, 1);
    assert.ok([1, 2].includes(plan.selection.skillIds[0]));
});

test('runAutonomousOpenClaw executes a wave and persists advancing autonomy state', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const storePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const statePath = path.join(dir, 'autonomy-state.json');

    const first = await runAutonomousOpenClaw({
        repoRoot: REPO_ROOT,
        storePath,
        outboxDir,
        archiveDir,
        statePath,
        waves: 1,
        skillsPerWave: 1,
        capabilitiesPerWave: 1,
        dispatchLimit: 10,
        workerCycles: 6,
        workerIdleCycles: 2,
        stopOnFullCoverage: false,
        botRuntime: true,
        enqueueFollowupTasks: true,
        nowFactory: () => Date.now()
    });

    assert.equal(first.wavesRun, 1);
    assert.equal(first.totals.plannedSkillTasks, 1);
    assert.equal(first.totals.plannedCapabilityTasks, 1);
    assert.ok(fs.existsSync(statePath));

    const stateAfterFirst = loadAutonomousState(statePath);
    assert.equal(stateAfterFirst.runCount, 1);

    const second = await runAutonomousOpenClaw({
        repoRoot: REPO_ROOT,
        storePath,
        outboxDir,
        archiveDir,
        statePath,
        waves: 1,
        skillsPerWave: 1,
        capabilitiesPerWave: 1,
        dispatchLimit: 10,
        workerCycles: 6,
        workerIdleCycles: 2,
        stopOnFullCoverage: false,
        botRuntime: true,
        enqueueFollowupTasks: true,
        nowFactory: () => Date.now()
    });

    assert.equal(second.wavesRun, 1);
    assert.equal(second.totals.plannedSkillTasks, 1);
    assert.equal(second.totals.plannedCapabilityTasks, 1);

    const stateAfterSecond = loadAutonomousState(statePath);
    assert.equal(stateAfterSecond.runCount, 2);

    const firstSkill = first.waves[0].selection.skillIds[0];
    const secondSkill = second.waves[0].selection.skillIds[0];
    assert.notEqual(firstSkill, secondSkill);
});

test('runAutonomousOpenClaw can execute waves from external 10,000-skill catalog', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const storePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const statePath = path.join(dir, 'autonomy-state.json');
    const catalogPath = path.join(REPO_ROOT, 'SKILLS_UPDATES_10000.md');

    fs.writeFileSync(statePath, `${JSON.stringify({
        runCount: 0,
        skillCursor: 1000,
        capabilityCursor: 0,
        successfulSkillIds: [],
        successfulCapabilityIds: [],
        failedSkillIds: [],
        failedCapabilityIds: []
    }, null, 2)}\n`);

    const report = await runAutonomousOpenClaw({
        repoRoot: REPO_ROOT,
        skillCatalogPath: catalogPath,
        storePath,
        outboxDir,
        archiveDir,
        statePath,
        waves: 1,
        skillsPerWave: 2,
        capabilitiesPerWave: 0,
        dispatchLimit: 10,
        workerCycles: 6,
        workerIdleCycles: 2,
        stopOnFullCoverage: false,
        botRuntime: true,
        enqueueFollowupTasks: true,
        nowFactory: () => Date.now()
    });

    assert.equal(report.wavesRun, 1);
    assert.equal(report.config.skillCatalogSource, 'external');
    assert.equal(report.coverage.skills.total, 10000);
    assert.equal(report.totals.plannedSkillTasks, 2);
    assert.equal(report.totals.plannedCapabilityTasks, 0);
    assert.deepEqual(report.waves[0].selection.skillIds, [1001, 1002]);
    assert.ok(report.coverage.skills.successful >= 2);
});
