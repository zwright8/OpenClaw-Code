import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    buildAutonomousBatchPlan,
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

test('buildAutonomousBatchPlan uses adaptive ranking after initial coverage', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 1, code: 'SK-00001', title: 'Skill 1' },
            { id: 2, code: 'SK-00002', title: 'Skill 2' },
            { id: 3, code: 'SK-00003', title: 'Skill 3' },
            { id: 4, code: 'SK-00004', title: 'Skill 4' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 10,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '1': { attempts: 12, successes: 2, failures: 10, consecutiveFailures: 3, lastWave: 9 },
                '2': { attempts: 8, successes: 7, failures: 1, consecutiveFailures: 0, lastWave: 9 },
                '3': { attempts: 4, successes: 2, failures: 2, consecutiveFailures: 0, lastWave: 9 },
                '4': { attempts: 1, successes: 1, failures: 0, consecutiveFailures: 0, lastWave: 9 }
            }
        },
        skillsPerWave: 2,
        capabilitiesPerWave: 0,
        waveIndex: 10,
        failureCooldownWaves: 2,
        nowFactory: () => 100_000
    });

    assert.equal(plan.selection.skillIds.length, 2);
    assert.deepEqual(plan.selection.skillIds, [4, 2]);
});

test('buildAutonomousBatchPlan temporarily cools repeated failures', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 11, code: 'SK-00011', title: 'Skill 11' },
            { id: 12, code: 'SK-00012', title: 'Skill 12' },
            { id: 13, code: 'SK-00013', title: 'Skill 13' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 7,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '11': { attempts: 6, successes: 1, failures: 5, consecutiveFailures: 4, lastWave: 7 },
                '12': { attempts: 6, successes: 5, failures: 1, consecutiveFailures: 0, lastWave: 7 },
                '13': { attempts: 3, successes: 2, failures: 1, consecutiveFailures: 0, lastWave: 7 }
            }
        },
        skillsPerWave: 2,
        capabilitiesPerWave: 0,
        waveIndex: 8,
        failureCooldownWaves: 3,
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [12, 13]);
    assert.ok(!plan.selection.skillIds.includes(11));
});

test('buildAutonomousBatchPlan prefers recent successful outcomes over recent failures', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 21, code: 'SK-00021', title: 'Skill 21' },
            { id: 22, code: 'SK-00022', title: 'Skill 22' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 12,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '21': { attempts: 8, successes: 5, failures: 3, consecutiveFailures: 0, lastWave: 12, lastStatus: 'failed' },
                '22': { attempts: 8, successes: 5, failures: 3, consecutiveFailures: 0, lastWave: 12, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 13,
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [22]);
});

test('buildAutonomousBatchPlan revisits stale entries when performance is tied', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 31, code: 'SK-00031', title: 'Skill 31' },
            { id: 32, code: 'SK-00032', title: 'Skill 32' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 20,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '31': { attempts: 6, successes: 4, failures: 2, consecutiveFailures: 0, lastWave: 8, lastStatus: 'completed' },
                '32': { attempts: 6, successes: 4, failures: 2, consecutiveFailures: 0, lastWave: 20, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 21,
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [31]);
});

test('buildAutonomousBatchPlan supports epsilon-thompson policy with deterministic ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 41, code: 'SK-00041', title: 'Skill 41' },
            { id: 42, code: 'SK-00042', title: 'Skill 42' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 14,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '41': { attempts: 10, successes: 8, failures: 2, consecutiveFailures: 0, lastWave: 13, lastStatus: 'completed' },
                '42': { attempts: 10, successes: 3, failures: 7, consecutiveFailures: 0, lastWave: 13, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 15,
        selectionPolicyConfig: {
            mode: 'epsilon_ts',
            thompsonExploration: 0,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [41]);
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
    assert.equal(first.config.selectionPolicy.mode, 'ucb');
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
    assert.ok(Object.keys(stateAfterSecond.skillExecutionStats).length > 0);
    assert.ok(Object.keys(stateAfterSecond.capabilityExecutionStats).length > 0);

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
