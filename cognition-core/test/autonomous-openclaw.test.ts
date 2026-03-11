import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    buildAutonomousBatchPlan,
    collectAutonomousCoverage,
    loadCapabilityCatalog,
    loadExternalSkillCatalog,
    loadAutonomousState,
    runAutonomousOpenClaw
} from '../src/autonomous-openclaw.js';
import {
    buildTaskRequest,
    FileTaskStore
} from '../../swarm-protocol/runtime.js';
import { buildQueueRecordFromTaskRequest } from '../src/task-bundle-enqueuer.js';
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

test('buildAutonomousBatchPlan supports linucb contextual ranking and feature emission', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 81, code: 'SK-00081', title: 'Skill 81' },
            { id: 82, code: 'SK-00082', title: 'Skill 82' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 29,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '81': { attempts: 10, successes: 9, failures: 1, consecutiveFailures: 0, lastWave: 29, lastStatus: 'completed' },
                '82': { attempts: 10, successes: 2, failures: 8, consecutiveFailures: 0, lastWave: 3, lastStatus: 'failed' }
            },
            contextualBanditModels: {
                skills: {
                    samples: 50,
                    matrixA: [
                        [1, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0, 1]
                    ],
                    vectorB: [0, -1, 0, 0, 0, 2]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 30,
        selectionPolicyConfig: {
            mode: 'linucb',
            linucbAlpha: 0.2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [82]);
    assert.equal(plan.selection.policy.skills, 'linucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'linucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionFeatures?.values?.length, 6);
});

test('buildAutonomousBatchPlan supports discounted linucb contextual ranking under drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 181, code: 'SK-00181', title: 'Skill 181' },
            { id: 182, code: 'SK-00182', title: 'Skill 182' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 30,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '181': { attempts: 12, successes: 9, failures: 3, consecutiveFailures: 0, lastWave: 30, lastStatus: 'completed' },
                '182': { attempts: 12, successes: 3, failures: 9, consecutiveFailures: 0, lastWave: 5, lastStatus: 'failed' }
            },
            contextualBanditModels: {
                skills: {
                    samples: 60,
                    matrixA: [
                        [1, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0, 1]
                    ],
                    vectorB: [0, -1, 0, 0, 0, 2]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 31,
        selectionPolicyConfig: {
            mode: 'd_linucb',
            discountFactor: 0.9,
            linucbAlpha: 0.2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [182]);
    assert.equal(plan.selection.policy.skills, 'd_linucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'd_linucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyConfig?.discountFactor, 0.9);
    assert.equal(plan.tasks[0].context?.autonomy?.selectionFeatures?.values?.length, 6);
});

test('buildAutonomousBatchPlan supports linear thompson contextual ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 281, code: 'SK-00281', title: 'Skill 281' },
            { id: 282, code: 'SK-00282', title: 'Skill 282' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 31,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '281': { attempts: 12, successes: 9, failures: 3, consecutiveFailures: 0, lastWave: 31, lastStatus: 'completed' },
                '282': { attempts: 12, successes: 3, failures: 9, consecutiveFailures: 0, lastWave: 6, lastStatus: 'failed' }
            },
            contextualBanditModels: {
                skills: {
                    samples: 70,
                    matrixA: [
                        [1, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0, 1]
                    ],
                    vectorB: [0, -1, 0, 0, 0, 2]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 32,
        selectionPolicyConfig: {
            mode: 'lints',
            lintsAlpha: 0.1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [282]);
    assert.equal(plan.selection.policy.skills, 'lints');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'lints');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionFeatures?.values?.length, 6);
});

test('buildAutonomousBatchPlan supports discounted linear thompson contextual ranking under drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 283, code: 'SK-00283', title: 'Skill 283' },
            { id: 284, code: 'SK-00284', title: 'Skill 284' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 32,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '283': { attempts: 12, successes: 9, failures: 3, consecutiveFailures: 0, lastWave: 32, lastStatus: 'completed' },
                '284': { attempts: 12, successes: 3, failures: 9, consecutiveFailures: 0, lastWave: 7, lastStatus: 'failed' }
            },
            contextualBanditModels: {
                skills: {
                    samples: 70,
                    matrixA: [
                        [1, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0, 1]
                    ],
                    vectorB: [0, -1, 0, 0, 0, 2]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 33,
        selectionPolicyConfig: {
            mode: 'd_lints',
            discountFactor: 0.9,
            lintsAlpha: 0.1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [284]);
    assert.equal(plan.selection.policy.skills, 'd_lints');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'd_lints');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyConfig?.discountFactor, 0.9);
    assert.equal(plan.tasks[0].context?.autonomy?.selectionFeatures?.values?.length, 6);
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

test('buildAutonomousBatchPlan supports KL-UCB policy for bounded outcomes', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 43, code: 'SK-00043', title: 'Skill 43' },
            { id: 44, code: 'SK-00044', title: 'Skill 44' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 16,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '43': { attempts: 12, successes: 10, failures: 2, consecutiveFailures: 0, lastWave: 15, lastStatus: 'completed' },
                '44': { attempts: 12, successes: 4, failures: 8, consecutiveFailures: 0, lastWave: 15, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 17,
        selectionPolicyConfig: {
            mode: 'kl_ucb'
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [43]);
});

test('buildAutonomousBatchPlan supports ucb_v variance-aware exploration policy', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 91, code: 'SK-00091', title: 'Skill 91' },
            { id: 92, code: 'SK-00092', title: 'Skill 92' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 17,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '91': { attempts: 2, successes: 2, failures: 0, consecutiveFailures: 0, lastWave: 16, lastStatus: 'completed' },
                '92': { attempts: 2, successes: 1, failures: 1, consecutiveFailures: 0, lastWave: 16, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 18,
        selectionPolicyConfig: {
            mode: 'ucb_v'
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [92]);
    assert.equal(plan.selection.policy.skills, 'ucb_v');
});

test('buildAutonomousBatchPlan supports Bayes-UCB policy for optimistic posterior ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 443, code: 'SK-00443', title: 'Skill 443' },
            { id: 444, code: 'SK-00444', title: 'Skill 444' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 17,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '443': { attempts: 14, successes: 11, failures: 3, consecutiveFailures: 0, lastWave: 16, lastStatus: 'completed' },
                '444': { attempts: 14, successes: 5, failures: 9, consecutiveFailures: 0, lastWave: 16, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 18,
        selectionPolicyConfig: {
            mode: 'bayes_ucb',
            bayesUcbQuantile: 0.95,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [443]);
    assert.equal(plan.selection.policy.skills, 'bayes_ucb');
});

test('buildAutonomousBatchPlan supports moss_anytime policy for minimax cold-start exploration', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 71, code: 'SK-00071', title: 'Skill 71' },
            { id: 72, code: 'SK-00072', title: 'Skill 72' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 18,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '71': { attempts: 50, successes: 45, failures: 5, consecutiveFailures: 0, lastWave: 17, lastStatus: 'completed' },
                '72': { attempts: 5, successes: 3, failures: 2, consecutiveFailures: 0, lastWave: 17, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 19,
        selectionPolicyConfig: {
            mode: 'moss_anytime',
            mossAlpha: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [72]);
});

test('buildAutonomousBatchPlan supports change-detection UCB for abrupt drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 45, code: 'SK-00045', title: 'Skill 45' },
            { id: 46, code: 'SK-00046', title: 'Skill 46' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 20,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '45': {
                    attempts: 24,
                    successes: 7,
                    failures: 17,
                    consecutiveFailures: 0,
                    lastWave: 20,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 13, status: 'failed' },
                        { wave: 14, status: 'failed' },
                        { wave: 15, status: 'failed' },
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' }
                    ]
                },
                '46': {
                    attempts: 24,
                    successes: 15,
                    failures: 9,
                    consecutiveFailures: 0,
                    lastWave: 20,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 13, status: 'completed' },
                        { wave: 14, status: 'completed' },
                        { wave: 15, status: 'completed' },
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 21,
        selectionPolicyConfig: {
            mode: 'cd_ucb',
            changeDetectionMinSamples: 4,
            changeDetectionThreshold: 1.2,
            changeDetectionDelta: 0.02
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [45]);
});

test('buildAutonomousBatchPlan supports cusum_ucb for abrupt drift with baseline adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 145, code: 'SK-00145', title: 'Skill 145' },
            { id: 146, code: 'SK-00146', title: 'Skill 146' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 21,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '145': {
                    attempts: 24,
                    successes: 8,
                    failures: 16,
                    consecutiveFailures: 0,
                    lastWave: 21,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 14, status: 'failed' },
                        { wave: 15, status: 'failed' },
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' }
                    ]
                },
                '146': {
                    attempts: 24,
                    successes: 16,
                    failures: 8,
                    consecutiveFailures: 0,
                    lastWave: 21,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 14, status: 'completed' },
                        { wave: 15, status: 'completed' },
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 22,
        selectionPolicyConfig: {
            mode: 'cusum_ucb',
            changeDetectionMinSamples: 4,
            cusumThreshold: 1.2,
            cusumBaselineWeight: 0.2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [145]);
});

test('buildAutonomousBatchPlan supports corral_exp3 policy adaptation across base policies', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 47, code: 'SK-00047', title: 'Skill 47' },
            { id: 48, code: 'SK-00048', title: 'Skill 48' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 21,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '47': { attempts: 12, successes: 9, failures: 3, consecutiveFailures: 0, lastWave: 20, lastStatus: 'completed' },
                '48': { attempts: 12, successes: 5, failures: 7, consecutiveFailures: 0, lastWave: 20, lastStatus: 'completed' }
            },
            policyExecutionStats: {
                skills: {
                    ucb: { attempts: 10, successes: 4, failures: 6, cumulativeReward: 4 },
                    epsilon_ts: { attempts: 10, successes: 9, failures: 1, cumulativeReward: 9 },
                    kl_ucb: { attempts: 10, successes: 3, failures: 7, cumulativeReward: 3 },
                    cd_ucb: { attempts: 10, successes: 2, failures: 8, cumulativeReward: 2 }
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 22,
        selectionPolicyConfig: {
            mode: 'corral_exp3',
            corralGamma: 0.05,
            corralEta: 1.5
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [47]);
    assert.equal(plan.selection.policy.skills, 'epsilon_ts');
    assert.ok(plan.tasks[0].context?.autonomy?.selectionPolicyApplied);
});

test('buildAutonomousBatchPlan supports exp3_ix policy for adversarial-style ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 49, code: 'SK-00049', title: 'Skill 49' },
            { id: 50, code: 'SK-00050', title: 'Skill 50' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 22,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '49': { attempts: 40, successes: 15, failures: 25, consecutiveFailures: 0, lastWave: 21, lastStatus: 'failed' },
                '50': { attempts: 12, successes: 9, failures: 3, consecutiveFailures: 0, lastWave: 21, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 23,
        selectionPolicyConfig: {
            mode: 'exp3_ix',
            exp3IxGamma: 0.07,
            exp3IxEta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [50]);
    assert.equal(plan.selection.policy.skills, 'exp3_ix');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'exp3_ix');
    assert.ok(Number(plan.tasks[0].context?.autonomy?.selectionProbability) > 0);
});

test('buildAutonomousBatchPlan supports sliding-window exp3_ix for drift-aware adversarial ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 149, code: 'SK-00149', title: 'Skill 149' },
            { id: 150, code: 'SK-00150', title: 'Skill 150' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 23,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '149': {
                    attempts: 40,
                    successes: 30,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 22,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' }
                    ]
                },
                '150': {
                    attempts: 40,
                    successes: 12,
                    failures: 28,
                    consecutiveFailures: 0,
                    lastWave: 22,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 24,
        selectionPolicyConfig: {
            mode: 'sw_exp3_ix',
            slidingWindowSize: 3,
            exp3IxGamma: 0.07,
            exp3IxEta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [150]);
    assert.equal(plan.selection.policy.skills, 'sw_exp3_ix');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_exp3_ix');
    assert.ok(Number(plan.tasks[0].context?.autonomy?.selectionProbability) > 0);
});

test('buildAutonomousBatchPlan supports discounted exp3_ix for recency-weighted adversarial ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 151, code: 'SK-00151', title: 'Skill 151' },
            { id: 152, code: 'SK-00152', title: 'Skill 152' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '151': {
                    attempts: 12,
                    successes: 9,
                    failures: 3,
                    consecutiveFailures: 0,
                    lastWave: 23,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' }
                    ]
                },
                '152': {
                    attempts: 12,
                    successes: 3,
                    failures: 9,
                    consecutiveFailures: 0,
                    lastWave: 23,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 25,
        selectionPolicyConfig: {
            mode: 'd_exp3_ix',
            discountFactor: 0.6,
            exp3IxGamma: 0.07,
            exp3IxEta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [152]);
    assert.equal(plan.selection.policy.skills, 'd_exp3_ix');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'd_exp3_ix');
    assert.ok(Number(plan.tasks[0].context?.autonomy?.selectionProbability) > 0);
});

test('buildAutonomousBatchPlan supports sliding-window UCB to react to drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 51, code: 'SK-00051', title: 'Skill 51' },
            { id: 52, code: 'SK-00052', title: 'Skill 52' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 22,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '51': {
                    attempts: 14,
                    successes: 10,
                    failures: 4,
                    consecutiveFailures: 0,
                    lastWave: 22,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' }
                    ]
                },
                '52': {
                    attempts: 14,
                    successes: 8,
                    failures: 6,
                    consecutiveFailures: 0,
                    lastWave: 22,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 23,
        selectionPolicyConfig: {
            mode: 'sw_ucb',
            slidingWindowSize: 3
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [52]);
});

test('buildAutonomousBatchPlan supports sliding-window KL-UCB for drift-aware ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 53, code: 'SK-00053', title: 'Skill 53' },
            { id: 54, code: 'SK-00054', title: 'Skill 54' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 23,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '53': {
                    attempts: 18,
                    successes: 11,
                    failures: 7,
                    consecutiveFailures: 0,
                    lastWave: 23,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' }
                    ]
                },
                '54': {
                    attempts: 18,
                    successes: 8,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 23,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 24,
        selectionPolicyConfig: {
            mode: 'sw_kl_ucb',
            slidingWindowSize: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [54]);
});

test('buildAutonomousBatchPlan supports sliding-window epsilon-thompson ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 61, code: 'SK-00061', title: 'Skill 61' },
            { id: 62, code: 'SK-00062', title: 'Skill 62' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '61': {
                    attempts: 20,
                    successes: 14,
                    failures: 6,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' }
                    ]
                },
                '62': {
                    attempts: 20,
                    successes: 9,
                    failures: 11,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 25,
        selectionPolicyConfig: {
            mode: 'sw_epsilon_ts',
            slidingWindowSize: 4,
            thompsonExploration: 0,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [62]);
});

test('buildAutonomousBatchPlan supports discounted UCB for recency-weighted drift adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 63, code: 'SK-00063', title: 'Skill 63' },
            { id: 64, code: 'SK-00064', title: 'Skill 64' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 25,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '63': {
                    attempts: 30,
                    successes: 20,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 25,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' }
                    ]
                },
                '64': {
                    attempts: 30,
                    successes: 10,
                    failures: 20,
                    consecutiveFailures: 0,
                    lastWave: 25,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 26,
        selectionPolicyConfig: {
            mode: 'd_ucb',
            discountFactor: 0.7
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [64]);
});

test('buildAutonomousBatchPlan supports discounted Bayes-UCB for recency-weighted posterior adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 665, code: 'SK-00665', title: 'Skill 665' },
            { id: 666, code: 'SK-00666', title: 'Skill 666' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 26,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '665': {
                    attempts: 40,
                    successes: 30,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 26,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' }
                    ]
                },
                '666': {
                    attempts: 40,
                    successes: 12,
                    failures: 28,
                    consecutiveFailures: 0,
                    lastWave: 26,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 27,
        selectionPolicyConfig: {
            mode: 'd_bayes_ucb',
            discountFactor: 0.7,
            bayesUcbQuantile: 0.9,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [666]);
    assert.equal(plan.selection.policy.skills, 'd_bayes_ucb');
});

test('buildAutonomousBatchPlan supports UCB-Tuned variance-aware ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 67, code: 'SK-00067', title: 'Skill 67' },
            { id: 68, code: 'SK-00068', title: 'Skill 68' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 27,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '67': {
                    attempts: 120,
                    successes: 95,
                    failures: 25,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'completed'
                },
                '68': {
                    attempts: 6,
                    successes: 3,
                    failures: 3,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'completed'
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 28,
        selectionPolicyConfig: {
            mode: 'ucb_tuned'
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [68]);
});

test('buildAutonomousBatchPlan supports discounted UCB-Tuned ranking under drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 69, code: 'SK-00069', title: 'Skill 69' },
            { id: 70, code: 'SK-00070', title: 'Skill 70' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 28,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '69': {
                    attempts: 32,
                    successes: 24,
                    failures: 8,
                    consecutiveFailures: 0,
                    lastWave: 28,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'failed' },
                        { wave: 28, status: 'failed' }
                    ]
                },
                '70': {
                    attempts: 32,
                    successes: 14,
                    failures: 18,
                    consecutiveFailures: 0,
                    lastWave: 28,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'completed' },
                        { wave: 28, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 29,
        selectionPolicyConfig: {
            mode: 'd_ucb_tuned',
            discountFactor: 0.6
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [70]);
});

test('buildAutonomousBatchPlan supports discounted epsilon-thompson ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 65, code: 'SK-00065', title: 'Skill 65' },
            { id: 66, code: 'SK-00066', title: 'Skill 66' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 26,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '65': {
                    attempts: 30,
                    successes: 20,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 26,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' }
                    ]
                },
                '66': {
                    attempts: 30,
                    successes: 10,
                    failures: 20,
                    consecutiveFailures: 0,
                    lastWave: 26,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 27,
        selectionPolicyConfig: {
            mode: 'd_epsilon_ts',
            discountFactor: 0.7,
            thompsonExploration: 0,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [66]);
});

test('runAutonomousOpenClaw records linucb contextual model samples', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const storePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const statePath = path.join(dir, 'autonomy-state-linucb.json');

    const report = await runAutonomousOpenClaw({
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
        selectionPolicyConfig: {
            mode: 'linucb',
            linucbAlpha: 0.6
        },
        nowFactory: () => Date.now()
    });

    assert.equal(report.config.selectionPolicy.mode, 'linucb');
    const saved = loadAutonomousState(statePath);
    assert.ok(saved.contextualBanditModels.skills.samples > 0);
});

test('runAutonomousOpenClaw records discounted linucb contextual model samples', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const storePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const statePath = path.join(dir, 'autonomy-state-d-linucb.json');

    const report = await runAutonomousOpenClaw({
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
        selectionPolicyConfig: {
            mode: 'd_linucb',
            linucbAlpha: 0.6,
            discountFactor: 0.9
        },
        nowFactory: () => Date.now()
    });

    assert.equal(report.config.selectionPolicy.mode, 'd_linucb');
    const saved = loadAutonomousState(statePath);
    assert.ok(saved.contextualBanditModels.skills.samples > 0);
});

test('runAutonomousOpenClaw records linear thompson contextual model samples', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const storePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const statePath = path.join(dir, 'autonomy-state-lints.json');

    const report = await runAutonomousOpenClaw({
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
        selectionPolicyConfig: {
            mode: 'lints',
            lintsAlpha: 0.5
        },
        nowFactory: () => Date.now()
    });

    assert.equal(report.config.selectionPolicy.mode, 'lints');
    const saved = loadAutonomousState(statePath);
    assert.ok(saved.contextualBanditModels.skills.samples > 0);
});

test('runAutonomousOpenClaw records discounted linear thompson contextual model samples', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const storePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const statePath = path.join(dir, 'autonomy-state-d-lints.json');

    const report = await runAutonomousOpenClaw({
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
        selectionPolicyConfig: {
            mode: 'd_lints',
            lintsAlpha: 0.5,
            discountFactor: 0.9
        },
        nowFactory: () => Date.now()
    });

    assert.equal(report.config.selectionPolicy.mode, 'd_lints');
    const saved = loadAutonomousState(statePath);
    assert.ok(saved.contextualBanditModels.skills.samples > 0);
});

test('collectAutonomousCoverage uses graded partial rewards for policy and contextual updates', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const store = new FileTaskStore({ filePath: queuePath, now: () => 100_000 });

    const linucbRequest = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000001111',
        from: 'agent:test',
        target: 'agent:skills-runtime',
        priority: 'high',
        task: '[AUTO][SK-00111] Execute test',
        context: {
            skillId: 111,
            autonomy: {
                lane: 'skills',
                wave: 5,
                selectionPolicyApplied: 'linucb',
                selectionPolicyConfig: { mode: 'linucb' },
                selectionFeatures: {
                    values: [1, 0, 0, 0, 0, 0]
                }
            }
        },
        createdAt: 90_000
    });

    const ucbRequest = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000001112',
        from: 'agent:test',
        target: 'agent:skills-runtime',
        priority: 'high',
        task: '[AUTO][SK-00112] Execute test',
        context: {
            skillId: 112,
            autonomy: {
                lane: 'skills',
                wave: 5,
                selectionPolicyApplied: 'ucb',
                selectionPolicyConfig: { mode: 'ucb' }
            }
        },
        createdAt: 90_100
    });

    const linucbRecord = buildQueueRecordFromTaskRequest(linucbRequest, { nowFactory: () => 95_000 });
    linucbRecord.status = 'partial';
    linucbRecord.updatedAt = 100_100;
    await store.saveRecord(linucbRecord);

    const ucbRecord = buildQueueRecordFromTaskRequest(ucbRequest, { nowFactory: () => 95_100 });
    ucbRecord.status = 'partial';
    ucbRecord.updatedAt = 100_200;
    await store.saveRecord(ucbRecord);

    const coverage = await collectAutonomousCoverage({ storePath: queuePath, nowFactory: () => 100_500 });

    assert.equal(coverage.skillExecutionStats['111'].successes, 1);
    assert.equal(coverage.skillExecutionStats['112'].successes, 1);
    assert.ok(Math.abs(coverage.policyExecutionStats.skills.ucb.cumulativeReward - 0.6) < 1e-9);
    assert.ok(Math.abs(coverage.contextualBanditModels.skills.vectorB[0] - 0.6) < 1e-9);
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
