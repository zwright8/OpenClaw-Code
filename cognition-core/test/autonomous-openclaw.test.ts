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

test('buildAutonomousBatchPlan supports sliding-window linucb contextual ranking under drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 185, code: 'SK-00185', title: 'Skill 185' },
            { id: 186, code: 'SK-00186', title: 'Skill 186' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 33,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '185': { attempts: 12, successes: 10, failures: 2, consecutiveFailures: 0, lastWave: 33, lastStatus: 'completed' },
                '186': { attempts: 12, successes: 2, failures: 10, consecutiveFailures: 0, lastWave: 8, lastStatus: 'failed' }
            },
            contextualBanditModels: {
                skills: {
                    samples: 64,
                    matrixA: [
                        [1, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0, 1]
                    ],
                    vectorB: [0, 2, -2, 0, 0, -2],
                    recentObservations: [
                        { reward: 1, featureVector: [1, 0, 1, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0, 1, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0, 1, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0, 1, 0, 0, 1] }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 34,
        selectionPolicyConfig: {
            mode: 'sw_linucb',
            slidingWindowSize: 4,
            linucbAlpha: 0.2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [186]);
    assert.equal(plan.selection.policy.skills, 'sw_linucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_linucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionFeatures?.values?.length, 6);
});

test('buildAutonomousBatchPlan supports adwin_linucb contextual drift adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 187, code: 'SK-00187', title: 'Skill 187' },
            { id: 188, code: 'SK-00188', title: 'Skill 188' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 35,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '187': { attempts: 10, successes: 8, failures: 2, consecutiveFailures: 0, lastWave: 35, lastStatus: 'completed' },
                '188': { attempts: 10, successes: 2, failures: 8, consecutiveFailures: 0, lastWave: 20, lastStatus: 'failed' }
            },
            contextualBanditModels: {
                skills: {
                    samples: 8,
                    matrixA: [
                        [1, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0, 1]
                    ],
                    vectorB: [0, 2, -2, 0, 0, -2],
                    recentObservations: [
                        { reward: 0, featureVector: [1, 0.8, 0.2, 0, 0, 0] },
                        { reward: 0, featureVector: [1, 0.8, 0.2, 0, 0, 0] },
                        { reward: 0, featureVector: [1, 0.8, 0.2, 0, 0, 0] },
                        { reward: 0, featureVector: [1, 0.8, 0.2, 0, 0, 0] },
                        { reward: 1, featureVector: [1, 0.2, 0.8, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0.2, 0.8, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0.2, 0.8, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0.2, 0.8, 0, 0, 1] }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 36,
        selectionPolicyConfig: {
            mode: 'adwin_linucb',
            linucbAlpha: 0.1,
            changeDetectionMinSamples: 2,
            adwinDelta: 0.2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [188]);
    assert.equal(plan.selection.policy.skills, 'adwin_linucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'adwin_linucb');
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

test('buildAutonomousBatchPlan supports sliding-window linear thompson contextual ranking under drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 285, code: 'SK-00285', title: 'Skill 285' },
            { id: 286, code: 'SK-00286', title: 'Skill 286' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 34,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '285': { attempts: 12, successes: 10, failures: 2, consecutiveFailures: 0, lastWave: 34, lastStatus: 'completed' },
                '286': { attempts: 12, successes: 2, failures: 10, consecutiveFailures: 0, lastWave: 9, lastStatus: 'failed' }
            },
            contextualBanditModels: {
                skills: {
                    samples: 64,
                    matrixA: [
                        [1, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0, 1]
                    ],
                    vectorB: [0, 2, -2, 0, 0, -2],
                    recentObservations: [
                        { reward: 1, featureVector: [1, 0, 1, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0, 1, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0, 1, 0, 0, 1] },
                        { reward: 1, featureVector: [1, 0, 1, 0, 0, 1] }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 35,
        selectionPolicyConfig: {
            mode: 'sw_lints',
            slidingWindowSize: 4,
            lintsAlpha: 0.0001
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [286]);
    assert.equal(plan.selection.policy.skills, 'sw_lints');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_lints');
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

test('buildAutonomousBatchPlan supports bayesian-bootstrap thompson ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 415, code: 'SK-00415', title: 'Skill 415' },
            { id: 416, code: 'SK-00416', title: 'Skill 416' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 14,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '415': { attempts: 12, successes: 9, failures: 3, consecutiveFailures: 0, lastWave: 13, lastStatus: 'completed' },
                '416': { attempts: 12, successes: 4, failures: 8, consecutiveFailures: 0, lastWave: 13, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 15,
        selectionPolicyConfig: {
            mode: 'bb_ts',
            thompsonExploration: 0
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [415]);
    assert.equal(plan.selection.policy.skills, 'bb_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'bb_ts');
});

test('buildAutonomousBatchPlan supports adaptive auto_epsilon_ts exploration under uncertainty', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 411, code: 'SK-00411', title: 'Skill 411' },
            { id: 412, code: 'SK-00412', title: 'Skill 412' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 18,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '411': { attempts: 16, successes: 13, failures: 3, consecutiveFailures: 0, lastWave: 17, lastStatus: 'completed' },
                '412': { attempts: 2, successes: 1, failures: 1, consecutiveFailures: 0, lastWave: 17, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 19,
        selectionPolicyConfig: {
            mode: 'auto_epsilon_ts',
            thompsonExploration: 0,
            thompsonUncertaintyWeight: 1.5,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [412]);
    assert.equal(plan.selection.policy.skills, 'auto_epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'auto_epsilon_ts');
});

test('buildAutonomousBatchPlan supports cp_epsilon_ts surprise-adaptive drift resets', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 413, code: 'SK-00413', title: 'Skill 413' },
            { id: 414, code: 'SK-00414', title: 'Skill 414' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 19,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '413': {
                    attempts: 28,
                    successes: 20,
                    failures: 8,
                    consecutiveFailures: 0,
                    lastWave: 18,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 7, status: 'completed' },
                        { wave: 8, status: 'completed' },
                        { wave: 9, status: 'completed' },
                        { wave: 10, status: 'completed' },
                        { wave: 11, status: 'completed' },
                        { wave: 12, status: 'completed' },
                        { wave: 13, status: 'completed' },
                        { wave: 14, status: 'completed' },
                        { wave: 15, status: 'failed' },
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' }
                    ]
                },
                '414': {
                    attempts: 28,
                    successes: 8,
                    failures: 20,
                    consecutiveFailures: 0,
                    lastWave: 18,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 7, status: 'failed' },
                        { wave: 8, status: 'failed' },
                        { wave: 9, status: 'failed' },
                        { wave: 10, status: 'failed' },
                        { wave: 11, status: 'failed' },
                        { wave: 12, status: 'failed' },
                        { wave: 13, status: 'failed' },
                        { wave: 14, status: 'failed' },
                        { wave: 15, status: 'completed' },
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 19,
        selectionPolicyConfig: {
            mode: 'cp_epsilon_ts',
            thompsonExploration: 0,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1,
            thompsonHazardRate: 0.1,
            thompsonSurpriseSensitivity: 2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [414]);
    assert.equal(plan.selection.policy.skills, 'cp_epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'cp_epsilon_ts');
});

test('buildAutonomousBatchPlan supports sw_cp_epsilon_ts windowed surprise-adaptive resets', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 415, code: 'SK-00415', title: 'Skill 415' },
            { id: 416, code: 'SK-00416', title: 'Skill 416' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 20,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '415': {
                    attempts: 28,
                    successes: 18,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 19,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 12, status: 'completed' },
                        { wave: 13, status: 'completed' },
                        { wave: 14, status: 'completed' },
                        { wave: 15, status: 'completed' },
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' }
                    ]
                },
                '416': {
                    attempts: 28,
                    successes: 10,
                    failures: 18,
                    consecutiveFailures: 0,
                    lastWave: 19,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 12, status: 'failed' },
                        { wave: 13, status: 'failed' },
                        { wave: 14, status: 'failed' },
                        { wave: 15, status: 'failed' },
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 20,
        selectionPolicyConfig: {
            mode: 'sw_cp_epsilon_ts',
            slidingWindowSize: 4,
            thompsonExploration: 0,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1,
            thompsonHazardRate: 0.08,
            thompsonSurpriseSensitivity: 2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [416]);
    assert.equal(plan.selection.policy.skills, 'sw_cp_epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_cp_epsilon_ts');
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

test('buildAutonomousBatchPlan supports sliding-window ucb_v drift-aware ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 193, code: 'SK-00193', title: 'Skill 193' },
            { id: 194, code: 'SK-00194', title: 'Skill 194' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 18,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '193': {
                    attempts: 20,
                    successes: 15,
                    failures: 5,
                    consecutiveFailures: 0,
                    lastWave: 18,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 15, status: 'completed' },
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' }
                    ]
                },
                '194': {
                    attempts: 20,
                    successes: 9,
                    failures: 11,
                    consecutiveFailures: 0,
                    lastWave: 18,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 15, status: 'failed' },
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 19,
        selectionPolicyConfig: {
            mode: 'sw_ucb_v',
            slidingWindowSize: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [194]);
    assert.equal(plan.selection.policy.skills, 'sw_ucb_v');
});

test('buildAutonomousBatchPlan supports discounted ucb_v recency adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 195, code: 'SK-00195', title: 'Skill 195' },
            { id: 196, code: 'SK-00196', title: 'Skill 196' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 19,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '195': {
                    attempts: 20,
                    successes: 15,
                    failures: 5,
                    consecutiveFailures: 0,
                    lastWave: 19,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 14, status: 'completed' },
                        { wave: 15, status: 'completed' },
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' }
                    ]
                },
                '196': {
                    attempts: 20,
                    successes: 9,
                    failures: 11,
                    consecutiveFailures: 0,
                    lastWave: 19,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 14, status: 'failed' },
                        { wave: 15, status: 'failed' },
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 20,
        selectionPolicyConfig: {
            mode: 'd_ucb_v',
            discountFactor: 0.7
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [196]);
    assert.equal(plan.selection.policy.skills, 'd_ucb_v');
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

test('buildAutonomousBatchPlan supports sliding-window moss_anytime drift-aware ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 73, code: 'SK-00073', title: 'Skill 73' },
            { id: 74, code: 'SK-00074', title: 'Skill 74' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 26,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '73': {
                    attempts: 24,
                    successes: 18,
                    failures: 6,
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
                '74': {
                    attempts: 24,
                    successes: 11,
                    failures: 13,
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
            mode: 'sw_moss_anytime',
            mossAlpha: 1.2,
            slidingWindowSize: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [74]);
    assert.equal(plan.selection.policy.skills, 'sw_moss_anytime');
});

test('buildAutonomousBatchPlan supports discounted moss_anytime recency adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 75, code: 'SK-00075', title: 'Skill 75' },
            { id: 76, code: 'SK-00076', title: 'Skill 76' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 27,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '75': {
                    attempts: 24,
                    successes: 17,
                    failures: 7,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' }
                    ]
                },
                '76': {
                    attempts: 24,
                    successes: 10,
                    failures: 14,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 28,
        selectionPolicyConfig: {
            mode: 'd_moss_anytime',
            mossAlpha: 1.2,
            discountFactor: 0.7
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [76]);
    assert.equal(plan.selection.policy.skills, 'd_moss_anytime');
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

test('buildAutonomousBatchPlan supports downward-only Page-Hinkley drift focus', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 745, code: 'SK-00745', title: 'Skill 745' },
            { id: 746, code: 'SK-00746', title: 'Skill 746' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 31,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '745': {
                    attempts: 24,
                    successes: 8,
                    failures: 16,
                    consecutiveFailures: 0,
                    lastWave: 31,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' },
                        { wave: 28, status: 'completed' },
                        { wave: 29, status: 'completed' },
                        { wave: 30, status: 'completed' },
                        { wave: 31, status: 'completed' }
                    ]
                },
                '746': {
                    attempts: 24,
                    successes: 14,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 31,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'completed' },
                        { wave: 28, status: 'completed' },
                        { wave: 29, status: 'failed' },
                        { wave: 30, status: 'completed' },
                        { wave: 31, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 32,
        selectionPolicyConfig: {
            mode: 'cd_ucb',
            changeDetectionMinSamples: 4,
            changeDetectionThreshold: 0.35,
            changeDetectionDelta: 0.01,
            changeDetectionDirection: 'down'
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [746]);
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

test('buildAutonomousBatchPlan supports downward-only CUSUM drift focus', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 845, code: 'SK-00845', title: 'Skill 845' },
            { id: 846, code: 'SK-00846', title: 'Skill 846' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 32,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '845': {
                    attempts: 24,
                    successes: 8,
                    failures: 16,
                    consecutiveFailures: 0,
                    lastWave: 32,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' },
                        { wave: 28, status: 'failed' },
                        { wave: 29, status: 'completed' },
                        { wave: 30, status: 'completed' },
                        { wave: 31, status: 'completed' },
                        { wave: 32, status: 'completed' }
                    ]
                },
                '846': {
                    attempts: 24,
                    successes: 14,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 32,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'failed' },
                        { wave: 28, status: 'completed' },
                        { wave: 29, status: 'completed' },
                        { wave: 30, status: 'failed' },
                        { wave: 31, status: 'completed' },
                        { wave: 32, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 33,
        selectionPolicyConfig: {
            mode: 'cusum_ucb',
            changeDetectionMinSamples: 4,
            cusumThreshold: 0.35,
            cusumBaselineWeight: 0.2,
            changeDetectionDirection: 'down'
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [846]);
});

test('buildAutonomousBatchPlan supports sw_cd_ucb for recency-windowed Page-Hinkley adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 345, code: 'SK-00345', title: 'Skill 345' },
            { id: 346, code: 'SK-00346', title: 'Skill 346' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 26,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '345': {
                    attempts: 32,
                    successes: 12,
                    failures: 20,
                    consecutiveFailures: 0,
                    lastWave: 26,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 15, status: 'failed' },
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' }
                    ]
                },
                '346': {
                    attempts: 32,
                    successes: 20,
                    failures: 12,
                    consecutiveFailures: 0,
                    lastWave: 26,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 15, status: 'completed' },
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 27,
        selectionPolicyConfig: {
            mode: 'sw_cd_ucb',
            slidingWindowSize: 4,
            changeDetectionMinSamples: 4,
            changeDetectionThreshold: 10,
            changeDetectionDelta: 0.02
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [345]);
    assert.equal(plan.selection.policy.skills, 'sw_cd_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_cd_ucb');
});

test('buildAutonomousBatchPlan supports sw_cusum_ucb for recency-windowed CUSUM adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 445, code: 'SK-00445', title: 'Skill 445' },
            { id: 446, code: 'SK-00446', title: 'Skill 446' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 27,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '445': {
                    attempts: 32,
                    successes: 12,
                    failures: 20,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'completed' }
                    ]
                },
                '446': {
                    attempts: 32,
                    successes: 20,
                    failures: 12,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 28,
        selectionPolicyConfig: {
            mode: 'sw_cusum_ucb',
            slidingWindowSize: 4,
            changeDetectionMinSamples: 4,
            cusumThreshold: 10,
            cusumBaselineWeight: 0.2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [445]);
    assert.equal(plan.selection.policy.skills, 'sw_cusum_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_cusum_ucb');
});

test('buildAutonomousBatchPlan supports cd_epsilon_ts for abrupt drift adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 545, code: 'SK-00545', title: 'Skill 545' },
            { id: 546, code: 'SK-00546', title: 'Skill 546' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 28,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '545': {
                    attempts: 24,
                    successes: 7,
                    failures: 17,
                    consecutiveFailures: 0,
                    lastWave: 28,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'completed' },
                        { wave: 28, status: 'completed' }
                    ]
                },
                '546': {
                    attempts: 24,
                    successes: 15,
                    failures: 9,
                    consecutiveFailures: 0,
                    lastWave: 28,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' },
                        { wave: 28, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 29,
        selectionPolicyConfig: {
            mode: 'cd_epsilon_ts',
            thompsonExploration: 0,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1,
            changeDetectionMinSamples: 4,
            changeDetectionThreshold: 1.2,
            changeDetectionDelta: 0.02
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [545]);
    assert.equal(plan.selection.policy.skills, 'cd_epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'cd_epsilon_ts');
});

test('buildAutonomousBatchPlan supports sw_cusum_epsilon_ts for recency-windowed drift adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 645, code: 'SK-00645', title: 'Skill 645' },
            { id: 646, code: 'SK-00646', title: 'Skill 646' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 29,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '645': {
                    attempts: 32,
                    successes: 12,
                    failures: 20,
                    consecutiveFailures: 0,
                    lastWave: 29,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'completed' },
                        { wave: 28, status: 'completed' },
                        { wave: 29, status: 'completed' }
                    ]
                },
                '646': {
                    attempts: 32,
                    successes: 20,
                    failures: 12,
                    consecutiveFailures: 0,
                    lastWave: 29,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' },
                        { wave: 28, status: 'failed' },
                        { wave: 29, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 30,
        selectionPolicyConfig: {
            mode: 'sw_cusum_epsilon_ts',
            thompsonExploration: 0,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1,
            slidingWindowSize: 4,
            changeDetectionMinSamples: 4,
            cusumThreshold: 10,
            cusumBaselineWeight: 0.2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [645]);
    assert.equal(plan.selection.policy.skills, 'sw_cusum_epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_cusum_epsilon_ts');
});

test('buildAutonomousBatchPlan supports glr_kl_ucb for abrupt-shift KL-UCB adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 455, code: 'SK-00455', title: 'Skill 455' },
            { id: 456, code: 'SK-00456', title: 'Skill 456' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 27,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '455': {
                    attempts: 36,
                    successes: 16,
                    failures: 20,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'completed' }
                    ]
                },
                '456': {
                    attempts: 36,
                    successes: 20,
                    failures: 16,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 28,
        selectionPolicyConfig: {
            mode: 'glr_kl_ucb',
            changeDetectionMinSamples: 4,
            changeDetectionThreshold: 0.25,
            changeDetectionDelta: 0.02,
            klUcbConfidence: 3
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [455]);
    assert.equal(plan.selection.policy.skills, 'glr_kl_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'glr_kl_ucb');
});

test('buildAutonomousBatchPlan supports sw_glr_kl_ucb for recency-windowed GLR KL-UCB adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 457, code: 'SK-00457', title: 'Skill 457' },
            { id: 458, code: 'SK-00458', title: 'Skill 458' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 27,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '457': {
                    attempts: 36,
                    successes: 16,
                    failures: 20,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 16, status: 'failed' },
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' },
                        { wave: 25, status: 'completed' },
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'completed' }
                    ]
                },
                '458': {
                    attempts: 36,
                    successes: 20,
                    failures: 16,
                    consecutiveFailures: 0,
                    lastWave: 27,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 16, status: 'completed' },
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' },
                        { wave: 25, status: 'failed' },
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 28,
        selectionPolicyConfig: {
            mode: 'sw_glr_kl_ucb',
            slidingWindowSize: 8,
            changeDetectionMinSamples: 4,
            changeDetectionThreshold: 0.25,
            changeDetectionDelta: 0.02,
            klUcbConfidence: 3
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [457]);
    assert.equal(plan.selection.policy.skills, 'sw_glr_kl_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_glr_kl_ucb');
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

test('buildAutonomousBatchPlan supports corral_exp3_plus corralling expanded base policy pool', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 247, code: 'SK-00247', title: 'Skill 247' },
            { id: 248, code: 'SK-00248', title: 'Skill 248' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '247': {
                    attempts: 24,
                    successes: 8,
                    failures: 16,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'completed' }
                    ]
                },
                '248': {
                    attempts: 24,
                    successes: 16,
                    failures: 8,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' }
                    ]
                }
            },
            policyExecutionStats: {
                skills: {
                    ucb: { attempts: 10, successes: 4, failures: 6, cumulativeReward: 4 },
                    epsilon_ts: { attempts: 10, successes: 4, failures: 6, cumulativeReward: 4 },
                    kl_ucb: { attempts: 10, successes: 4, failures: 6, cumulativeReward: 4 },
                    cd_ucb: { attempts: 10, successes: 4, failures: 6, cumulativeReward: 4 },
                    ucb_tuned: { attempts: 10, successes: 4, failures: 6, cumulativeReward: 4 },
                    ucb_v: { attempts: 10, successes: 4, failures: 6, cumulativeReward: 4 },
                    bayes_ucb: { attempts: 10, successes: 4, failures: 6, cumulativeReward: 4 },
                    cusum_ucb: { attempts: 10, successes: 10, failures: 0, cumulativeReward: 10 }
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 25,
        selectionPolicyConfig: {
            mode: 'corral_exp3_plus',
            corralGamma: 0,
            corralEta: 5,
            changeDetectionMinSamples: 4,
            cusumThreshold: 1.2,
            cusumBaselineWeight: 0.2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [247]);
    assert.equal(plan.selection.policy.skills, 'cusum_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'cusum_ucb');
});

test('buildAutonomousBatchPlan lets corral_exp3_plus route to ADWIN expert when best recent performer', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 847, code: 'SK-00847', title: 'Skill 847' },
            { id: 848, code: 'SK-00848', title: 'Skill 848' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 29,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '847': {
                    attempts: 18,
                    successes: 6,
                    failures: 12,
                    consecutiveFailures: 0,
                    lastWave: 28,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 26, status: 'failed' },
                        { wave: 27, status: 'failed' },
                        { wave: 28, status: 'completed' },
                        { wave: 29, status: 'completed' }
                    ]
                },
                '848': {
                    attempts: 18,
                    successes: 12,
                    failures: 6,
                    consecutiveFailures: 0,
                    lastWave: 28,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 26, status: 'completed' },
                        { wave: 27, status: 'completed' },
                        { wave: 28, status: 'failed' },
                        { wave: 29, status: 'failed' }
                    ]
                }
            },
            policyExecutionStats: {
                skills: {
                    ucb: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    epsilon_ts: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    kl_ucb: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    cd_ucb: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    ucb_tuned: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    ucb_v: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    bayes_ucb: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    cusum_ucb: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    adwin_ucb: {
                        attempts: 20,
                        successes: 20,
                        failures: 0,
                        cumulativeReward: 20,
                        recentOutcomes: [
                            { wave: 26, status: 'completed' },
                            { wave: 27, status: 'completed' },
                            { wave: 28, status: 'completed' },
                            { wave: 29, status: 'completed' }
                        ]
                    },
                    adwin_epsilon_ts: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    fdsw_ucb: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    fdsw_epsilon_ts: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 },
                    bge: { attempts: 20, successes: 10, failures: 10, cumulativeReward: 10 }
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 30,
        selectionPolicyConfig: {
            mode: 'corral_exp3_plus',
            corralGamma: 0,
            corralEta: 5,
            changeDetectionMinSamples: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [847]);
    assert.equal(plan.selection.policy.skills, 'adwin_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'adwin_ucb');
});

test('buildAutonomousBatchPlan supports sw_corral_exp3 recency-aware expert corralling', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 749, code: 'SK-00749', title: 'Skill 749' },
            { id: 750, code: 'SK-00750', title: 'Skill 750' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 41,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '749': { attempts: 10, successes: 8, failures: 2, consecutiveFailures: 0, lastWave: 40, lastStatus: 'completed' },
                '750': { attempts: 10, successes: 4, failures: 6, consecutiveFailures: 0, lastWave: 40, lastStatus: 'completed' }
            },
            policyExecutionStats: {
                skills: {
                    ucb: {
                        attempts: 12,
                        successes: 7,
                        failures: 5,
                        cumulativeReward: 7,
                        recentOutcomes: [
                            { wave: 38, status: 'failed' },
                            { wave: 39, status: 'failed' },
                            { wave: 40, status: 'failed' },
                            { wave: 41, status: 'failed' }
                        ]
                    },
                    epsilon_ts: {
                        attempts: 12,
                        successes: 5,
                        failures: 7,
                        cumulativeReward: 5,
                        recentOutcomes: [
                            { wave: 38, status: 'completed' },
                            { wave: 39, status: 'completed' },
                            { wave: 40, status: 'completed' },
                            { wave: 41, status: 'completed' }
                        ]
                    },
                    kl_ucb: { attempts: 12, successes: 6, failures: 6, cumulativeReward: 6 },
                    cd_ucb: { attempts: 12, successes: 6, failures: 6, cumulativeReward: 6 }
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 42,
        selectionPolicyConfig: {
            mode: 'sw_corral_exp3',
            corralGamma: 0,
            corralEta: 5,
            slidingWindowSize: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [749]);
    assert.equal(plan.selection.policy.skills, 'epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'epsilon_ts');
});

test('buildAutonomousBatchPlan supports d_corral_exp3_plus discounted expert corralling', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 851, code: 'SK-00851', title: 'Skill 851' },
            { id: 852, code: 'SK-00852', title: 'Skill 852' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 55,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '851': {
                    attempts: 16,
                    successes: 7,
                    failures: 9,
                    consecutiveFailures: 0,
                    lastWave: 54,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 52, status: 'failed' },
                        { wave: 53, status: 'failed' },
                        { wave: 54, status: 'completed' },
                        { wave: 55, status: 'completed' }
                    ]
                },
                '852': {
                    attempts: 16,
                    successes: 13,
                    failures: 3,
                    consecutiveFailures: 0,
                    lastWave: 54,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 52, status: 'completed' },
                        { wave: 53, status: 'completed' },
                        { wave: 54, status: 'failed' },
                        { wave: 55, status: 'failed' }
                    ]
                }
            },
            policyExecutionStats: {
                skills: {
                    ucb: { attempts: 30, successes: 21, failures: 9, cumulativeReward: 21 },
                    epsilon_ts: { attempts: 30, successes: 20, failures: 10, cumulativeReward: 20 },
                    kl_ucb: { attempts: 30, successes: 20, failures: 10, cumulativeReward: 20 },
                    cd_ucb: { attempts: 30, successes: 19, failures: 11, cumulativeReward: 19 },
                    ucb_tuned: { attempts: 30, successes: 18, failures: 12, cumulativeReward: 18 },
                    ucb_v: { attempts: 30, successes: 18, failures: 12, cumulativeReward: 18 },
                    bayes_ucb: { attempts: 30, successes: 18, failures: 12, cumulativeReward: 18 },
                    cusum_ucb: {
                        attempts: 30,
                        successes: 18,
                        failures: 12,
                        cumulativeReward: 18,
                        recentOutcomes: [
                            { wave: 52, status: 'failed' },
                            { wave: 53, status: 'failed' },
                            { wave: 54, status: 'completed' },
                            { wave: 55, status: 'completed' }
                        ]
                    }
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 56,
        selectionPolicyConfig: {
            mode: 'd_corral_exp3_plus',
            corralGamma: 0,
            corralEta: 5,
            discountFactor: 0.6
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [851]);
    assert.equal(plan.selection.policy.skills, 'cusum_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'cusum_ucb');
});

test('buildAutonomousBatchPlan lets corral_exp3 force exploration toward under-sampled experts', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 953, code: 'SK-00953', title: 'Skill 953' },
            { id: 954, code: 'SK-00954', title: 'Skill 954' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 33,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '953': { attempts: 14, successes: 9, failures: 5, consecutiveFailures: 0, lastWave: 32, lastStatus: 'completed' },
                '954': { attempts: 14, successes: 8, failures: 6, consecutiveFailures: 0, lastWave: 32, lastStatus: 'completed' }
            },
            policyExecutionStats: {
                skills: {
                    ucb: { attempts: 20, successes: 15, failures: 5, cumulativeReward: 15 },
                    epsilon_ts: { attempts: 20, successes: 14, failures: 6, cumulativeReward: 14 },
                    kl_ucb: { attempts: 20, successes: 13, failures: 7, cumulativeReward: 13 },
                    cd_ucb: { attempts: 0, successes: 0, failures: 0, cumulativeReward: 0 }
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 34,
        selectionPolicyConfig: {
            mode: 'corral_exp3',
            corralGamma: 0,
            corralEta: 5,
            corralMinPolicyAttempts: 1,
            corralForcedExploration: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [953]);
    assert.equal(plan.selection.policy.skills, 'cd_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'cd_ucb');
});

test('buildAutonomousBatchPlan supports bge policy for Boltzmann-Gumbel exploration', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 861, code: 'SK-00861', title: 'Skill 861' },
            { id: 862, code: 'SK-00862', title: 'Skill 862' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 30,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '861': { attempts: 120, successes: 98, failures: 22, consecutiveFailures: 0, lastWave: 29, lastStatus: 'completed' },
                '862': { attempts: 120, successes: 54, failures: 66, consecutiveFailures: 0, lastWave: 29, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 31,
        selectionPolicyConfig: {
            mode: 'bge',
            boltzmannGumbelC: 0.5
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [861]);
    assert.equal(plan.selection.policy.skills, 'bge');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'bge');
});

test('buildAutonomousBatchPlan supports sw_bge for recency-weighted Boltzmann-Gumbel exploration', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 863, code: 'SK-00863', title: 'Skill 863' },
            { id: 864, code: 'SK-00864', title: 'Skill 864' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 36,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '863': {
                    attempts: 16,
                    successes: 12,
                    failures: 4,
                    lastWave: 35,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 33, status: 'failed' },
                        { wave: 34, status: 'failed' },
                        { wave: 35, status: 'failed' },
                        { wave: 36, status: 'failed' }
                    ]
                },
                '864': {
                    attempts: 16,
                    successes: 8,
                    failures: 8,
                    lastWave: 35,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 33, status: 'completed' },
                        { wave: 34, status: 'completed' },
                        { wave: 35, status: 'completed' },
                        { wave: 36, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 37,
        selectionPolicyConfig: {
            mode: 'sw_bge',
            boltzmannGumbelC: 0.5,
            slidingWindowSize: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [864]);
    assert.equal(plan.selection.policy.skills, 'sw_bge');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_bge');
});

test('buildAutonomousBatchPlan supports d_bge for discounted Boltzmann-Gumbel exploration', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 865, code: 'SK-00865', title: 'Skill 865' },
            { id: 866, code: 'SK-00866', title: 'Skill 866' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 43,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '865': {
                    attempts: 8,
                    successes: 6,
                    failures: 2,
                    lastWave: 42,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 36, status: 'completed' },
                        { wave: 37, status: 'completed' },
                        { wave: 38, status: 'completed' },
                        { wave: 39, status: 'completed' },
                        { wave: 40, status: 'failed' },
                        { wave: 41, status: 'failed' },
                        { wave: 42, status: 'failed' },
                        { wave: 43, status: 'failed' }
                    ]
                },
                '866': {
                    attempts: 8,
                    successes: 3,
                    failures: 5,
                    lastWave: 42,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 36, status: 'failed' },
                        { wave: 37, status: 'failed' },
                        { wave: 38, status: 'failed' },
                        { wave: 39, status: 'failed' },
                        { wave: 40, status: 'completed' },
                        { wave: 41, status: 'completed' },
                        { wave: 42, status: 'completed' },
                        { wave: 43, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 44,
        selectionPolicyConfig: {
            mode: 'd_bge',
            boltzmannGumbelC: 0.5,
            discountFactor: 0.6
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [866]);
    assert.equal(plan.selection.policy.skills, 'd_bge');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'd_bge');
});

test('buildAutonomousBatchPlan supports phe policy for perturbed-history exploration', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 1161, code: 'SK-01161', title: 'Skill 1161' },
            { id: 1162, code: 'SK-01162', title: 'Skill 1162' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 30,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '1161': { attempts: 120, successes: 90, failures: 30, consecutiveFailures: 0, lastWave: 29, lastStatus: 'completed' },
                '1162': { attempts: 120, successes: 40, failures: 80, consecutiveFailures: 0, lastWave: 29, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 31,
        selectionPolicyConfig: {
            mode: 'phe',
            phePerturbationScale: 2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [1161]);
    assert.equal(plan.selection.policy.skills, 'phe');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'phe');
});

test('buildAutonomousBatchPlan supports sw_phe for recency-weighted perturbed-history exploration', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 1163, code: 'SK-01163', title: 'Skill 1163' },
            { id: 1164, code: 'SK-01164', title: 'Skill 1164' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 36,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '1163': {
                    attempts: 16,
                    successes: 12,
                    failures: 4,
                    lastWave: 35,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 33, status: 'failed' },
                        { wave: 34, status: 'failed' },
                        { wave: 35, status: 'failed' },
                        { wave: 36, status: 'failed' }
                    ]
                },
                '1164': {
                    attempts: 16,
                    successes: 8,
                    failures: 8,
                    lastWave: 35,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 33, status: 'completed' },
                        { wave: 34, status: 'completed' },
                        { wave: 35, status: 'completed' },
                        { wave: 36, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 37,
        selectionPolicyConfig: {
            mode: 'sw_phe',
            phePerturbationScale: 2,
            slidingWindowSize: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [1164]);
    assert.equal(plan.selection.policy.skills, 'sw_phe');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_phe');
});

test('buildAutonomousBatchPlan supports d_phe for discounted perturbed-history exploration', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 1165, code: 'SK-01165', title: 'Skill 1165' },
            { id: 1166, code: 'SK-01166', title: 'Skill 1166' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 43,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '1165': {
                    attempts: 8,
                    successes: 6,
                    failures: 2,
                    lastWave: 42,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 36, status: 'completed' },
                        { wave: 37, status: 'completed' },
                        { wave: 38, status: 'completed' },
                        { wave: 39, status: 'completed' },
                        { wave: 40, status: 'failed' },
                        { wave: 41, status: 'failed' },
                        { wave: 42, status: 'failed' },
                        { wave: 43, status: 'failed' }
                    ]
                },
                '1166': {
                    attempts: 8,
                    successes: 3,
                    failures: 5,
                    lastWave: 42,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 36, status: 'failed' },
                        { wave: 37, status: 'failed' },
                        { wave: 38, status: 'failed' },
                        { wave: 39, status: 'failed' },
                        { wave: 40, status: 'completed' },
                        { wave: 41, status: 'completed' },
                        { wave: 42, status: 'completed' },
                        { wave: 43, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 44,
        selectionPolicyConfig: {
            mode: 'd_phe',
            phePerturbationScale: 2,
            discountFactor: 0.6
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [1166]);
    assert.equal(plan.selection.policy.skills, 'd_phe');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'd_phe');
});

test('buildAutonomousBatchPlan supports adwin_ucb adaptive-window drift re-ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 867, code: 'SK-00867', title: 'Skill 867' },
            { id: 868, code: 'SK-00868', title: 'Skill 868' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 48,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '867': {
                    attempts: 12,
                    successes: 8,
                    failures: 4,
                    lastWave: 47,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 37, status: 'completed' },
                        { wave: 38, status: 'completed' },
                        { wave: 39, status: 'completed' },
                        { wave: 40, status: 'completed' },
                        { wave: 41, status: 'completed' },
                        { wave: 42, status: 'completed' },
                        { wave: 43, status: 'failed' },
                        { wave: 44, status: 'failed' },
                        { wave: 45, status: 'failed' },
                        { wave: 46, status: 'failed' },
                        { wave: 47, status: 'failed' },
                        { wave: 48, status: 'failed' }
                    ]
                },
                '868': {
                    attempts: 12,
                    successes: 4,
                    failures: 8,
                    lastWave: 47,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 37, status: 'failed' },
                        { wave: 38, status: 'failed' },
                        { wave: 39, status: 'failed' },
                        { wave: 40, status: 'failed' },
                        { wave: 41, status: 'failed' },
                        { wave: 42, status: 'failed' },
                        { wave: 43, status: 'completed' },
                        { wave: 44, status: 'completed' },
                        { wave: 45, status: 'completed' },
                        { wave: 46, status: 'completed' },
                        { wave: 47, status: 'completed' },
                        { wave: 48, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 49,
        selectionPolicyConfig: {
            mode: 'adwin_ucb',
            adwinDelta: 0.01,
            changeDetectionMinSamples: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [868]);
    assert.equal(plan.selection.policy.skills, 'adwin_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'adwin_ucb');
});

test('buildAutonomousBatchPlan supports adwin_epsilon_ts adaptive-window Thompson re-ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 869, code: 'SK-00869', title: 'Skill 869' },
            { id: 870, code: 'SK-00870', title: 'Skill 870' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 52,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '869': {
                    attempts: 12,
                    successes: 8,
                    failures: 4,
                    lastWave: 51,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 41, status: 'completed' },
                        { wave: 42, status: 'completed' },
                        { wave: 43, status: 'completed' },
                        { wave: 44, status: 'completed' },
                        { wave: 45, status: 'completed' },
                        { wave: 46, status: 'completed' },
                        { wave: 47, status: 'failed' },
                        { wave: 48, status: 'failed' },
                        { wave: 49, status: 'failed' },
                        { wave: 50, status: 'failed' },
                        { wave: 51, status: 'failed' },
                        { wave: 52, status: 'failed' }
                    ]
                },
                '870': {
                    attempts: 12,
                    successes: 4,
                    failures: 8,
                    lastWave: 51,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 41, status: 'failed' },
                        { wave: 42, status: 'failed' },
                        { wave: 43, status: 'failed' },
                        { wave: 44, status: 'failed' },
                        { wave: 45, status: 'failed' },
                        { wave: 46, status: 'failed' },
                        { wave: 47, status: 'completed' },
                        { wave: 48, status: 'completed' },
                        { wave: 49, status: 'completed' },
                        { wave: 50, status: 'completed' },
                        { wave: 51, status: 'completed' },
                        { wave: 52, status: 'completed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 53,
        selectionPolicyConfig: {
            mode: 'adwin_epsilon_ts',
            adwinDelta: 0.01,
            changeDetectionMinSamples: 4,
            thompsonExploration: 0
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [870]);
    assert.equal(plan.selection.policy.skills, 'adwin_epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'adwin_epsilon_ts');
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

test('buildAutonomousBatchPlan supports exp3_ix auto-eta with decoupled implicit gamma', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 490, code: 'SK-00490', title: 'Skill 490' },
            { id: 491, code: 'SK-00491', title: 'Skill 491' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 22,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '490': { attempts: 80, successes: 16, failures: 64, consecutiveFailures: 0, lastWave: 21, lastStatus: 'failed' },
                '491': { attempts: 20, successes: 14, failures: 6, consecutiveFailures: 0, lastWave: 21, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 23,
        selectionPolicyConfig: {
            mode: 'exp3_ix',
            exp3ExplorationGamma: 0.07,
            exp3IxEta: 1,
            exp3AutoEta: true
        },
        nowFactory: () => 100_000
    });

    const runtimePolicy = plan.selection.policyProbabilities.skills;
    assert.equal(runtimePolicy?.mode, 'exp3_ix');
    assert.equal(runtimePolicy?.autoEta, true);
    assert.ok(Number(runtimePolicy?.eta) > 0);
    assert.ok(Number(runtimePolicy?.eta) < 1);
    assert.equal(
        Number(runtimePolicy?.implicitGamma),
        Number((Number(runtimePolicy?.eta) / 2).toFixed(6))
    );
});

test('buildAutonomousBatchPlan supports exp3_s share-mixing to smooth adversarial probabilities', () => {
    const baseInput = {
        skillCatalog: [
            { id: 540, code: 'SK-00540', title: 'Skill 540' },
            { id: 541, code: 'SK-00541', title: 'Skill 541' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 23,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '540': { attempts: 48, successes: 30, failures: 18, consecutiveFailures: 0, lastWave: 22, lastStatus: 'completed' },
                '541': { attempts: 12, successes: 4, failures: 8, consecutiveFailures: 0, lastWave: 22, lastStatus: 'completed' }
            }
        },
        skillsPerWave: 2,
        capabilitiesPerWave: 0,
        waveIndex: 24,
        nowFactory: () => 100_000
    };
    const ixPlan = buildAutonomousBatchPlan({
        ...baseInput,
        selectionPolicyConfig: {
            mode: 'exp3_ix',
            exp3IxGamma: 0.07,
            exp3IxEta: 1
        }
    });
    const sharedPlan = buildAutonomousBatchPlan({
        ...baseInput,
        selectionPolicyConfig: {
            mode: 'exp3_s',
            exp3IxGamma: 0.07,
            exp3IxEta: 1,
            exp3ShareAlpha: 1
        }
    });

    const ixProbabilities = ixPlan.tasks
        .map((task) => Number(task.context?.autonomy?.selectionProbability || 0));
    const sharedProbabilities = sharedPlan.tasks
        .map((task) => Number(task.context?.autonomy?.selectionProbability || 0));
    const ixSpread = Math.abs(ixProbabilities[0] - ixProbabilities[1]);
    const sharedSpread = Math.abs(sharedProbabilities[0] - sharedProbabilities[1]);

    assert.equal(sharedPlan.selection.policy.skills, 'exp3_s');
    assert.equal(sharedPlan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'exp3_s');
    assert.ok(sharedSpread < ixSpread);
});

test('buildAutonomousBatchPlan supports rexp3_ix periodic restarts for wave-level drift adaptation', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 501, code: 'SK-00501', title: 'Skill 501' },
            { id: 502, code: 'SK-00502', title: 'Skill 502' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 23,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '501': {
                    attempts: 40,
                    successes: 30,
                    failures: 10,
                    consecutiveFailures: 2,
                    lastWave: 23,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'failed' }
                    ]
                },
                '502': {
                    attempts: 40,
                    successes: 10,
                    failures: 30,
                    consecutiveFailures: 0,
                    lastWave: 23,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'failed' },
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
            mode: 'rexp3_ix',
            exp3IxGamma: 0.07,
            exp3IxEta: 1,
            exp3RestartInterval: 2
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [502]);
    assert.equal(plan.selection.policy.skills, 'rexp3_ix');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'rexp3_ix');
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

test('buildAutonomousBatchPlan supports sliding-window exp3_s adaptation emphasizing recent adversarial outcomes', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 171, code: 'SK-00171', title: 'Skill 171' },
            { id: 172, code: 'SK-00172', title: 'Skill 172' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '171': {
                    attempts: 40,
                    successes: 30,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 23,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' }
                    ]
                },
                '172': {
                    attempts: 40,
                    successes: 12,
                    failures: 28,
                    consecutiveFailures: 0,
                    lastWave: 23,
                    lastStatus: 'completed',
                    recentOutcomes: [
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
            mode: 'sw_exp3_s',
            slidingWindowSize: 3,
            exp3IxGamma: 0.07,
            exp3IxEta: 1,
            exp3ShareAlpha: 0.1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [172]);
    assert.equal(plan.selection.policy.skills, 'sw_exp3_s');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_exp3_s');
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

test('buildAutonomousBatchPlan supports discounted exp3_s adaptation for recency-weighted adversarial ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 173, code: 'SK-00173', title: 'Skill 173' },
            { id: 174, code: 'SK-00174', title: 'Skill 174' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 25,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '173': {
                    attempts: 12,
                    successes: 9,
                    failures: 3,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' }
                    ]
                },
                '174': {
                    attempts: 12,
                    successes: 3,
                    failures: 9,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
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
        waveIndex: 26,
        selectionPolicyConfig: {
            mode: 'd_exp3_s',
            discountFactor: 0.6,
            exp3IxGamma: 0.07,
            exp3IxEta: 1,
            exp3ShareAlpha: 0.1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [174]);
    assert.equal(plan.selection.policy.skills, 'd_exp3_s');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'd_exp3_s');
    assert.ok(Number(plan.tasks[0].context?.autonomy?.selectionProbability) > 0);
});

test('buildAutonomousBatchPlan keeps sliding-window exp3_ix adjustments aligned to recency stats', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 153, code: 'SK-00153', title: 'Skill 153' },
            { id: 154, code: 'SK-00154', title: 'Skill 154' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '153': {
                    attempts: 20,
                    successes: 10,
                    failures: 10,
                    consecutiveFailures: 6,
                    lastWave: 24,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'failed' }
                    ]
                },
                '154': {
                    attempts: 20,
                    successes: 10,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 23, status: 'completed' },
                        { wave: 24, status: 'failed' }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 25,
        selectionPolicyConfig: {
            mode: 'sw_exp3_ix',
            slidingWindowSize: 2,
            exp3IxGamma: 0.07,
            exp3IxEta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [153]);
    assert.equal(plan.selection.policy.skills, 'sw_exp3_ix');
});

test('buildAutonomousBatchPlan treats partial outcomes as fractional reward in sliding-window UCB', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 155, code: 'SK-00155', title: 'Skill 155' },
            { id: 156, code: 'SK-00156', title: 'Skill 156' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 25,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '155': {
                    attempts: 18,
                    successes: 15,
                    failures: 3,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'partial',
                    recentOutcomes: [
                        { wave: 22, status: 'partial' },
                        { wave: 23, status: 'partial' },
                        { wave: 24, status: 'partial' }
                    ]
                },
                '156': {
                    attempts: 18,
                    successes: 9,
                    failures: 9,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'completed',
                    recentOutcomes: [
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
            mode: 'sw_ucb',
            slidingWindowSize: 3
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [156]);
    assert.equal(plan.selection.policy.skills, 'sw_ucb');
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

test('buildAutonomousBatchPlan supports mw_ucb multi-window adaptation under mixed drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 521, code: 'SK-00521', title: 'Skill 521' },
            { id: 522, code: 'SK-00522', title: 'Skill 522' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 23,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '521': {
                    attempts: 20,
                    successes: 18,
                    failures: 2,
                    consecutiveFailures: 0,
                    lastWave: 23,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' }
                    ]
                },
                '522': {
                    attempts: 20,
                    successes: 10,
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
            mode: 'mw_ucb',
            multiWindowSizes: [2, 4, 8]
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [522]);
    assert.equal(plan.selection.policy.skills, 'mw_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'mw_ucb');
});

test('buildAutonomousBatchPlan supports bob_sw_ucb adaptive meta-window routing under drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 621, code: 'SK-00621', title: 'Skill 621' },
            { id: 622, code: 'SK-00622', title: 'Skill 622' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '621': {
                    attempts: 20,
                    successes: 18,
                    failures: 2,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 21, status: 'completed' },
                        { wave: 22, status: 'completed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' }
                    ]
                },
                '622': {
                    attempts: 20,
                    successes: 10,
                    failures: 10,
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
            },
            windowPolicyExecutionStats: {
                skills: {
                    '2': { attempts: 30, successes: 10, failures: 20, cumulativeReward: 10 },
                    '8': { attempts: 30, successes: 25, failures: 5, cumulativeReward: 25 }
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 25,
        selectionPolicyConfig: {
            mode: 'bob_sw_ucb',
            multiWindowSizes: [2, 8],
            bobGamma: 0
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [621]);
    assert.equal(plan.selection.policy.skills, 'bob_sw_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'bob_sw_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyConfig?.selectedWindowSize, 8);
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

test('buildAutonomousBatchPlan supports sliding-window bayesian-bootstrap thompson ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 611, code: 'SK-00611', title: 'Skill 611' },
            { id: 612, code: 'SK-00612', title: 'Skill 612' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '611': {
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
                '612': {
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
            mode: 'sw_bb_ts',
            slidingWindowSize: 4,
            thompsonExploration: 0
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [612]);
    assert.equal(plan.selection.policy.skills, 'sw_bb_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_bb_ts');
});

test('buildAutonomousBatchPlan supports sliding-window adaptive auto_epsilon_ts ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 565, code: 'SK-00565', title: 'Skill 565' },
            { id: 566, code: 'SK-00566', title: 'Skill 566' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 58,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '565': {
                    attempts: 8,
                    successes: 6,
                    failures: 2,
                    consecutiveFailures: 0,
                    lastWave: 57,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { status: 'completed', wave: 57, reward: 1 },
                        { status: 'completed', wave: 56, reward: 1 },
                        { status: 'completed', wave: 55, reward: 1 },
                        { status: 'failed', wave: 54, reward: 0 },
                        { status: 'completed', wave: 53, reward: 1 }
                    ]
                },
                '566': {
                    attempts: 8,
                    successes: 6,
                    failures: 2,
                    consecutiveFailures: 0,
                    lastWave: 57,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { status: 'completed', wave: 57, reward: 1 },
                        { status: 'failed', wave: 56, reward: 0 },
                        { status: 'failed', wave: 55, reward: 0 },
                        { status: 'failed', wave: 54, reward: 0 },
                        { status: 'completed', wave: 53, reward: 1 }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 59,
        selectionPolicyConfig: {
            mode: 'sw_auto_epsilon_ts',
            slidingWindowSize: 3,
            thompsonExploration: 0,
            thompsonUncertaintyWeight: 1,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [565]);
    assert.equal(plan.selection.policy.skills, 'sw_auto_epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'sw_auto_epsilon_ts');
});

test('buildAutonomousBatchPlan supports hybrid fdsw_epsilon_ts ranking under mixed drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 81, code: 'SK-00081', title: 'Skill 81' },
            { id: 82, code: 'SK-00082', title: 'Skill 82' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '81': {
                    attempts: 24,
                    successes: 14,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' }
                    ]
                },
                '82': {
                    attempts: 24,
                    successes: 10,
                    failures: 14,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'completed' },
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
            mode: 'fdsw_epsilon_ts',
            slidingWindowSize: 4,
            discountFactor: 0.8,
            hybridTsAggregation: 'mean',
            thompsonExploration: 0,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.equal(plan.selection.policy.skills, 'fdsw_epsilon_ts');
    assert.deepEqual(plan.selection.skillIds, [82]);
});

test('buildAutonomousBatchPlan supports hybrid fdsw_ucb ranking under mixed drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 83, code: 'SK-00083', title: 'Skill 83' },
            { id: 84, code: 'SK-00084', title: 'Skill 84' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 24,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '83': {
                    attempts: 24,
                    successes: 14,
                    failures: 10,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { wave: 17, status: 'completed' },
                        { wave: 18, status: 'completed' },
                        { wave: 19, status: 'completed' },
                        { wave: 20, status: 'completed' },
                        { wave: 21, status: 'failed' },
                        { wave: 22, status: 'failed' },
                        { wave: 23, status: 'failed' },
                        { wave: 24, status: 'failed' }
                    ]
                },
                '84': {
                    attempts: 24,
                    successes: 10,
                    failures: 14,
                    consecutiveFailures: 0,
                    lastWave: 24,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { wave: 17, status: 'failed' },
                        { wave: 18, status: 'failed' },
                        { wave: 19, status: 'failed' },
                        { wave: 20, status: 'failed' },
                        { wave: 21, status: 'completed' },
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
            mode: 'fdsw_ucb',
            slidingWindowSize: 4,
            discountFactor: 0.8,
            hybridTsAggregation: 'mean'
        },
        nowFactory: () => 100_000
    });

    assert.equal(plan.selection.policy.skills, 'fdsw_ucb');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'fdsw_ucb');
    assert.deepEqual(plan.selection.skillIds, [84]);
});

test('buildAutonomousBatchPlan supports adaptive hybrid aggregation for fdsw_ucb', () => {
    const catalog = [
        { id: 631, code: 'SK-00631', title: 'Skill 631' },
        { id: 632, code: 'SK-00632', title: 'Skill 632' }
    ];
    const state = {
        runCount: 40,
        skillCursor: 0,
        capabilityCursor: 0,
        successfulSkillIds: [],
        successfulCapabilityIds: [],
        skillExecutionStats: {
            '631': {
                attempts: 16,
                successes: 14,
                failures: 2,
                consecutiveFailures: 0,
                lastWave: 40,
                lastStatus: 'failed',
                recentOutcomes: [
                    { wave: 25, status: 'completed' },
                    { wave: 26, status: 'completed' },
                    { wave: 27, status: 'completed' },
                    { wave: 28, status: 'completed' },
                    { wave: 29, status: 'completed' },
                    { wave: 30, status: 'completed' },
                    { wave: 31, status: 'completed' },
                    { wave: 32, status: 'completed' },
                    { wave: 33, status: 'completed' },
                    { wave: 34, status: 'completed' },
                    { wave: 35, status: 'completed' },
                    { wave: 36, status: 'completed' },
                    { wave: 37, status: 'completed' },
                    { wave: 38, status: 'failed' },
                    { wave: 39, status: 'completed' },
                    { wave: 40, status: 'failed' }
                ]
            },
            '632': {
                attempts: 16,
                successes: 4,
                failures: 12,
                consecutiveFailures: 0,
                lastWave: 40,
                lastStatus: 'completed',
                recentOutcomes: [
                    { wave: 25, status: 'failed' },
                    { wave: 26, status: 'failed' },
                    { wave: 27, status: 'failed' },
                    { wave: 28, status: 'failed' },
                    { wave: 29, status: 'failed' },
                    { wave: 30, status: 'failed' },
                    { wave: 31, status: 'failed' },
                    { wave: 32, status: 'failed' },
                    { wave: 33, status: 'failed' },
                    { wave: 34, status: 'failed' },
                    { wave: 35, status: 'failed' },
                    { wave: 36, status: 'failed' },
                    { wave: 37, status: 'completed' },
                    { wave: 38, status: 'completed' },
                    { wave: 39, status: 'completed' },
                    { wave: 40, status: 'completed' }
                ]
            }
        }
    };

    const meanPlan = buildAutonomousBatchPlan({
        skillCatalog: catalog,
        capabilityCatalog: [],
        state,
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 41,
        selectionPolicyConfig: {
            mode: 'fdsw_ucb',
            slidingWindowSize: 4,
            discountFactor: 0.9,
            hybridTsAggregation: 'mean'
        },
        nowFactory: () => 100_000
    });
    const adaptivePlan = buildAutonomousBatchPlan({
        skillCatalog: catalog,
        capabilityCatalog: [],
        state,
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 41,
        selectionPolicyConfig: {
            mode: 'fdsw_ucb',
            slidingWindowSize: 4,
            discountFactor: 0.9,
            hybridTsAggregation: 'adaptive'
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(meanPlan.selection.skillIds, [632]);
    assert.deepEqual(adaptivePlan.selection.skillIds, [631]);
    assert.equal(adaptivePlan.selection.policy.skills, 'fdsw_ucb');
    assert.equal(adaptivePlan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'fdsw_ucb');
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

test('buildAutonomousBatchPlan supports discounted KL-UCB for recency-weighted optimistic ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 667, code: 'SK-00667', title: 'Skill 667' },
            { id: 668, code: 'SK-00668', title: 'Skill 668' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 26,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '667': {
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
                '668': {
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
            mode: 'd_kl_ucb',
            discountFactor: 0.7,
            klUcbConfidence: 3
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [668]);
    assert.equal(plan.selection.policy.skills, 'd_kl_ucb');
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

test('buildAutonomousBatchPlan supports sliding-window UCB-Tuned ranking under drift', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 169, code: 'SK-00169', title: 'Skill 169' },
            { id: 170, code: 'SK-00170', title: 'Skill 170' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 28,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '169': {
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
                '170': {
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
            mode: 'sw_ucb_tuned',
            slidingWindowSize: 4
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [170]);
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

test('buildAutonomousBatchPlan supports discounted bayesian-bootstrap thompson ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 721, code: 'SK-00721', title: 'Skill 721' },
            { id: 722, code: 'SK-00722', title: 'Skill 722' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 26,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '721': {
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
                '722': {
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
            mode: 'd_bb_ts',
            discountFactor: 0.7,
            thompsonExploration: 0
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [722]);
    assert.equal(plan.selection.policy.skills, 'd_bb_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'd_bb_ts');
});

test('buildAutonomousBatchPlan supports discounted adaptive auto_epsilon_ts ranking', () => {
    const plan = buildAutonomousBatchPlan({
        skillCatalog: [
            { id: 735, code: 'SK-00735', title: 'Skill 735' },
            { id: 736, code: 'SK-00736', title: 'Skill 736' }
        ],
        capabilityCatalog: [],
        state: {
            runCount: 72,
            skillCursor: 0,
            capabilityCursor: 0,
            successfulSkillIds: [],
            successfulCapabilityIds: [],
            skillExecutionStats: {
                '735': {
                    attempts: 8,
                    successes: 6,
                    failures: 2,
                    consecutiveFailures: 0,
                    lastWave: 71,
                    lastStatus: 'completed',
                    recentOutcomes: [
                        { status: 'completed', wave: 71, reward: 1 },
                        { status: 'completed', wave: 70, reward: 1 },
                        { status: 'failed', wave: 69, reward: 0 },
                        { status: 'failed', wave: 68, reward: 0 },
                        { status: 'failed', wave: 67, reward: 0 },
                        { status: 'failed', wave: 66, reward: 0 }
                    ]
                },
                '736': {
                    attempts: 8,
                    successes: 5,
                    failures: 3,
                    consecutiveFailures: 1,
                    lastWave: 71,
                    lastStatus: 'failed',
                    recentOutcomes: [
                        { status: 'failed', wave: 71, reward: 0 },
                        { status: 'failed', wave: 70, reward: 0 },
                        { status: 'completed', wave: 69, reward: 1 },
                        { status: 'completed', wave: 68, reward: 1 },
                        { status: 'completed', wave: 67, reward: 1 },
                        { status: 'completed', wave: 66, reward: 1 }
                    ]
                }
            }
        },
        skillsPerWave: 1,
        capabilitiesPerWave: 0,
        waveIndex: 73,
        selectionPolicyConfig: {
            mode: 'd_auto_epsilon_ts',
            discountFactor: 0.85,
            thompsonExploration: 0,
            thompsonUncertaintyWeight: 1,
            thompsonPriorAlpha: 1,
            thompsonPriorBeta: 1
        },
        nowFactory: () => 100_000
    });

    assert.deepEqual(plan.selection.skillIds, [736]);
    assert.equal(plan.selection.policy.skills, 'd_auto_epsilon_ts');
    assert.equal(plan.tasks[0].context?.autonomy?.selectionPolicyApplied, 'd_auto_epsilon_ts');
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

test('runAutonomousOpenClaw records sliding-window linucb contextual observations', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const storePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const statePath = path.join(dir, 'autonomy-state-sw-linucb.json');

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
            mode: 'sw_linucb',
            linucbAlpha: 0.6,
            slidingWindowSize: 8
        },
        nowFactory: () => Date.now()
    });

    assert.equal(report.config.selectionPolicy.mode, 'sw_linucb');
    const saved = loadAutonomousState(statePath);
    assert.ok(saved.contextualBanditModels.skills.samples > 0);
    assert.ok(saved.contextualBanditModels.skills.recentObservations.length > 0);
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

test('runAutonomousOpenClaw records sliding-window linear thompson contextual observations', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const storePath = path.join(dir, 'tasks.journal.jsonl');
    const outboxDir = path.join(dir, 'outbox');
    const archiveDir = path.join(outboxDir, 'processed');
    const statePath = path.join(dir, 'autonomy-state-sw-lints.json');

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
            mode: 'sw_lints',
            lintsAlpha: 0.5,
            slidingWindowSize: 8
        },
        nowFactory: () => Date.now()
    });

    assert.equal(report.config.selectionPolicy.mode, 'sw_lints');
    const saved = loadAutonomousState(statePath);
    assert.ok(saved.contextualBanditModels.skills.samples > 0);
    assert.ok(saved.contextualBanditModels.skills.recentObservations.length > 0);
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
    assert.equal(coverage.skillExecutionStats['111'].recentOutcomes[0].reward, 0.6);
    assert.equal(coverage.skillExecutionStats['112'].recentOutcomes[0].reward, 0.6);
    assert.ok(Math.abs(coverage.policyExecutionStats.skills.ucb.cumulativeReward - 0.6) < 1e-9);
    assert.equal(coverage.policyExecutionStats.skills.ucb.recentOutcomes[0].status, 'partial');
    assert.equal(coverage.policyExecutionStats.skills.ucb.recentOutcomes[0].reward, 0.6);
    assert.ok(Math.abs(coverage.contextualBanditModels.skills.vectorB[0] - 0.6) < 1e-9);
});

test('collectAutonomousCoverage tracks non-corral policy lanes and adwin_lints contextual updates', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const store = new FileTaskStore({ filePath: queuePath, now: () => 100_000 });

    const adwinLintsRequest = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000001113',
        from: 'agent:test',
        target: 'agent:skills-runtime',
        priority: 'high',
        task: '[AUTO][SK-00113] Execute test',
        context: {
            skillId: 113,
            autonomy: {
                lane: 'skills',
                wave: 7,
                selectionPolicyApplied: 'adwin_lints',
                selectionPolicyConfig: { mode: 'adwin_lints' },
                selectionFeatures: {
                    values: [1, 0.1, 0.9, 0, 0, 1]
                }
            }
        },
        createdAt: 90_000
    });

    const exp3Request = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000001114',
        from: 'agent:test',
        target: 'agent:skills-runtime',
        priority: 'high',
        task: '[AUTO][SK-00114] Execute test',
        context: {
            skillId: 114,
            autonomy: {
                lane: 'skills',
                wave: 7,
                selectionPolicyApplied: 'd_exp3_s',
                selectionPolicyConfig: { mode: 'd_exp3_s', discountFactor: 0.9 }
            }
        },
        createdAt: 90_100
    });

    const adwinLintsRecord = buildQueueRecordFromTaskRequest(adwinLintsRequest, { nowFactory: () => 95_000 });
    adwinLintsRecord.status = 'completed';
    adwinLintsRecord.updatedAt = 100_100;
    await store.saveRecord(adwinLintsRecord);

    const exp3Record = buildQueueRecordFromTaskRequest(exp3Request, { nowFactory: () => 95_100 });
    exp3Record.status = 'partial';
    exp3Record.updatedAt = 100_200;
    await store.saveRecord(exp3Record);

    const coverage = await collectAutonomousCoverage({ storePath: queuePath, nowFactory: () => 100_500 });

    assert.equal(coverage.policyExecutionStats.skills.adwin_lints.attempts, 1);
    assert.ok(Math.abs(coverage.policyExecutionStats.skills.adwin_lints.cumulativeReward - 1) < 1e-9);
    assert.equal(coverage.policyExecutionStats.skills.d_exp3_s.attempts, 1);
    assert.ok(Math.abs(coverage.policyExecutionStats.skills.d_exp3_s.cumulativeReward - 0.6) < 1e-9);
    assert.ok(coverage.contextualBanditModels.skills.samples > 0);
});

test('collectAutonomousCoverage tracks bob_sw_ucb selected window outcomes', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const queuePath = path.join(dir, 'tasks.journal.jsonl');
    const store = new FileTaskStore({ filePath: queuePath, now: () => 100_000 });

    const bobRequest = buildTaskRequest({
        id: '00000000-0000-4000-8000-000000001113',
        from: 'agent:test',
        target: 'agent:skills-runtime',
        priority: 'high',
        task: '[AUTO][SK-00113] Execute test',
        context: {
            skillId: 113,
            autonomy: {
                lane: 'skills',
                wave: 6,
                selectionPolicyApplied: 'bob_sw_ucb',
                selectionPolicyConfig: {
                    mode: 'bob_sw_ucb',
                    selectedWindowSize: 8,
                    multiWindowSizes: [4, 8, 16]
                }
            }
        },
        createdAt: 90_100
    });

    const bobRecord = buildQueueRecordFromTaskRequest(bobRequest, { nowFactory: () => 95_100 });
    bobRecord.status = 'partial';
    bobRecord.updatedAt = 100_300;
    await store.saveRecord(bobRecord);

    const coverage = await collectAutonomousCoverage({ storePath: queuePath, nowFactory: () => 100_500 });

    assert.equal(coverage.windowPolicyExecutionStats.skills['8'].attempts, 1);
    assert.equal(coverage.windowPolicyExecutionStats.skills['8'].successes, 1);
    assert.ok(Math.abs(coverage.windowPolicyExecutionStats.skills['8'].cumulativeReward - 0.6) < 1e-9);
    assert.equal(coverage.windowPolicyExecutionStats.skills['8'].recentOutcomes[0].reward, 0.6);
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
