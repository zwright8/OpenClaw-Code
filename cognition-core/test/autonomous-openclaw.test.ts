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
