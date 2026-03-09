import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { buildTaskRequest } from '../../swarm-protocol/runtime.js';
import { OpenClawBot } from '../src/openclaw-bot.js';

const cwd = path.resolve(process.cwd());
const REPO_ROOT = path.basename(cwd) === 'cognition-core'
    ? path.resolve(cwd, '..')
    : cwd;

test('OpenClawBot executes skill tasks and emits follow-up task requests', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 1_000_000
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000901',
        from: 'agent:main',
        target: 'agent:skills-runtime',
        task: 'Run skill runtime for id 1',
        context: {
            skillId: 1,
            skillInput: {
                signalQuality: 88,
                evidenceCoverage: 87,
                confidenceHealth: 84,
                operationalReadiness: 82,
                harmPotential: 18,
                resourcePressure: 30,
                urgency: 62,
                impactPotential: 81,
                humanApprovalLatency: 20
            }
        },
        createdAt: 500_000
    });

    const result = await bot.executeTask(task);

    assert.equal(result.mode, 'skill');
    assert.equal(result.status, 'success');
    assert.match(result.output, /Skill/);
    assert.ok(result.metrics.overallScore >= 0);
    assert.ok(result.followupTasks.length >= 3);
    assert.equal(result.followupTasks[0].kind, 'task_request');
});

test('OpenClawBot executes capability tasks via capability runtime', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 2_000_000
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000902',
        from: 'agent:main',
        target: 'agent:cultural',
        task: 'Evaluate cultural context windows',
        context: {
            capabilityId: 'cultural_context_window_prioritizer',
            capabilityInput: {
                contexts: [
                    {
                        contextId: 'ctx-1',
                        demand: 82,
                        capacity: 38,
                        risk: 74,
                        impact: 80,
                        readiness: 44,
                        trust: 49,
                        quality: 46
                    }
                ]
            }
        },
        createdAt: 500_100
    });

    const result = await bot.executeTask(task);

    assert.equal(result.mode, 'capability');
    assert.equal(result.status, 'success');
    assert.match(result.output, /Capability/);
    assert.ok(result.metrics.recommendationCount >= 1);
    assert.ok(result.followupTasks.length >= 1);
});

test('OpenClawBot executes capability action tasks when recommendation context is provided', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 3_000_000
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000903',
        from: 'agent:main',
        target: 'agent:ops',
        task: 'Perform recommendation follow-up',
        context: {
            capabilityId: 'truth_engine',
            recommendationType: 'gather_evidence',
            entityId: 'hypothesis-7',
            holdCount: 1,
            residualGap: 42
        },
        createdAt: 500_200
    });

    const result = await bot.executeTask(task);

    assert.equal(result.mode, 'capability_action');
    assert.equal(result.status, 'success');
    assert.match(result.output, /Capability action/);
    assert.equal(result.followupTasks.length, 0);
});

test('OpenClawBot treats skill execution subtasks as terminal skill actions', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 3_500_000
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000905',
        from: 'agent:main',
        target: 'agent:skills-runtime',
        task: 'Execute rollout workflow',
        context: {
            skillId: 1,
            actions: ['deploy-flag:test']
        },
        createdAt: 500_250
    });

    const result = await bot.executeTask(task);

    assert.equal(result.mode, 'skill_action');
    assert.equal(result.status, 'success');
    assert.match(result.output, /Skill execution task completed/);
    assert.equal(result.followupTasks.length, 0);
});

test('OpenClawBot executes external skill blueprint entries when implementation is missing', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 3_750_000
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000906',
        from: 'agent:main',
        target: 'agent:skills-runtime',
        task: '[AUTO][SK-19001] Execute Synthetic Skill Blueprint',
        context: {
            skillId: 19001,
            skillBlueprint: {
                code: 'SK-19001',
                title: 'Synthetic Skill Blueprint',
                reason: 'External skill catalog coverage'
            }
        },
        createdAt: 500_275
    });

    const result = await bot.executeTask(task);

    assert.equal(result.mode, 'skill_blueprint');
    assert.equal(result.status, 'success');
    assert.match(result.output, /Skill blueprint executed/);
    assert.equal(result.followupTasks.length, 0);
});

test('OpenClawBot blocks non-deployable skills when hardening policy is enforced', async (t) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openclaw-hardening-'));
    t.after(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    const deployabilityIndexPath = path.join(tmpDir, 'deployability.index.json');
    fs.writeFileSync(deployabilityIndexPath, `${JSON.stringify({
        version: 1,
        generatedAt: new Date(0).toISOString(),
        minDeployableScore: 82,
        entries: [
            {
                key: 'manifest:1',
                source: 'manifest',
                skillId: 1,
                skillName: 'blocked-skill',
                title: 'Blocked Skill',
                deployable: false,
                hardeningScore: 40,
                blockingFindings: 2,
                generatedAt: new Date(0).toISOString()
            }
        ]
    }, null, 2)}\n`);

    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 3_900_000,
        skillHardeningPolicy: 'enforce',
        skillDeployabilityIndexPath: deployabilityIndexPath
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000907',
        from: 'agent:main',
        target: 'agent:skills-runtime',
        task: 'Run skill runtime for id 1',
        context: {
            skillId: 1
        },
        createdAt: 500_290
    });

    const result = await bot.executeTask(task);

    assert.equal(result.mode, 'skill');
    assert.equal(result.status, 'partial');
    assert.match(result.output, /blocked by hardening gate/);
    assert.equal(result.metrics.hardeningDeployable, 0);
    assert.ok(result.followupTasks.length >= 2);
});

test('OpenClawBot falls back to generic execution when no skill/capability context is present', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 4_000_000
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000904',
        from: 'agent:main',
        target: 'agent:ops',
        task: 'Generic queue operation',
        context: {
            planner: 'cognition-core/remediation-task-planner'
        },
        createdAt: 500_300
    });

    const result = await bot.executeTask(task);

    assert.equal(result.mode, 'generic');
    assert.equal(result.status, 'success');
    assert.match(result.output, /Generic task completed/);
    assert.equal(result.followupTasks.length, 0);
});

test('OpenClawBot supports task-level hardening policy override', async (t) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openclaw-hardening-override-'));
    t.after(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    const deployabilityIndexPath = path.join(tmpDir, 'deployability.index.json');
    fs.writeFileSync(deployabilityIndexPath, `${JSON.stringify({
        version: 1,
        generatedAt: new Date(0).toISOString(),
        profile: {
            version: 1,
            generatedAt: new Date(0).toISOString(),
            defaultPolicy: {
                policy: 'enforce',
                minDeployableScore: 82,
                strict: true
            },
            rules: []
        },
        entries: [
            {
                key: 'manifest:1',
                source: 'manifest',
                skillId: 1,
                skillName: 'blocked-skill',
                title: 'Blocked Skill',
                policy: 'enforce',
                minDeployableScore: 90,
                strict: true,
                matchedRuleIds: [],
                deployable: false,
                hardeningGatePass: false,
                hardeningScore: 40,
                blockingFindings: 2,
                generatedAt: new Date(0).toISOString()
            }
        ]
    }, null, 2)}\n`);

    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 4_100_000,
        skillHardeningPolicy: 'enforce',
        skillDeployabilityIndexPath: deployabilityIndexPath
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000908',
        from: 'agent:main',
        target: 'agent:skills-runtime',
        task: 'Run skill runtime for id 1 with override',
        context: {
            skillId: 1,
            hardeningPolicy: 'report'
        },
        createdAt: 500_310
    });

    const result = await bot.executeTask(task);

    assert.equal(result.mode, 'skill');
    assert.equal(result.status, 'success');
    assert.equal(result.metrics.hardeningPolicyReport, 1);
});

test('OpenClawBot replays cached result for duplicate task requests', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 4_200_000,
        taskReplayTtlMs: 60_000
    });

    const task = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000909',
        from: 'agent:main',
        target: 'agent:ops',
        task: 'Generic replay-safe operation',
        context: {
            planner: 'cognition-core/test'
        },
        createdAt: 4_199_900
    });

    const first = await bot.executeTask(task);
    const replayed = await bot.executeTask(task);

    assert.equal(first.status, 'success');
    assert.equal(replayed.status, 'success');
    assert.equal(replayed.metrics.replayCacheHit, 1);
    assert.equal(replayed.metrics.duplicateDelivery, 1);
    assert.match(replayed.output, /duplicate_task_replay/);
});

test('OpenClawBot rejects duplicate task ids with mismatched payload fingerprints', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 4_300_000,
        taskReplayTtlMs: 60_000
    });

    const baseTask = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000910',
        from: 'agent:main',
        target: 'agent:ops',
        task: 'First payload',
        context: {
            planner: 'cognition-core/test'
        },
        createdAt: 4_299_900
    });

    const conflictingTask = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000910',
        from: 'agent:main',
        target: 'agent:ops',
        task: 'Second payload',
        context: {
            planner: 'cognition-core/test',
            variant: 'conflict'
        },
        createdAt: 4_299_901
    });

    await bot.executeTask(baseTask);
    const conflict = await bot.executeTask(conflictingTask);

    assert.equal(conflict.status, 'failure');
    assert.equal(conflict.metrics.duplicateTaskIdConflict, 1);
    assert.match(conflict.output, /reused with a different payload/);
});

test('OpenClawBot drops stale tasks when maxTaskAgeMs is configured', async () => {
    const bot = new OpenClawBot({
        repoRoot: REPO_ROOT,
        nowFactory: () => 50_000,
        maxTaskAgeMs: 1_000
    });

    const staleTask = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000000911',
        from: 'agent:main',
        target: 'agent:ops',
        task: 'Expired generic operation',
        createdAt: 47_000
    });

    const result = await bot.executeTask(staleTask);

    assert.equal(result.mode, 'generic');
    assert.equal(result.status, 'partial');
    assert.equal(result.metrics.staleTaskDropped, 1);
    assert.equal(result.metrics.taskAgeMs, 3_000);
    assert.equal(result.metrics.taskMaxAgeMs, 1_000);
});
