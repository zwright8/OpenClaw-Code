import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EquityImpactAnalyzer,
    evaluateEquityImpact,
    equityRecommendationsToTasks
} from '../index.js';

function baselineGroups() {
    return [
        {
            id: 'group-urban',
            name: 'Urban low-income households',
            region: 'urban',
            population: 140_000,
            vulnerabilityIndex: 72,
            baseline: {
                benefitScore: 44,
                harmScore: 24,
                accessScore: 47
            }
        },
        {
            id: 'group-rural',
            name: 'Rural communities',
            region: 'rural',
            population: 90_000,
            vulnerabilityIndex: 64,
            baseline: {
                benefitScore: 46,
                harmScore: 22,
                accessScore: 49
            }
        },
        {
            id: 'group-suburban',
            name: 'Suburban communities',
            region: 'suburban',
            population: 120_000,
            vulnerabilityIndex: 42,
            baseline: {
                benefitScore: 48,
                harmScore: 21,
                accessScore: 54
            }
        }
    ];
}

test('evaluateEquityImpact reports aligned posture for balanced improvements across groups', () => {
    const report = evaluateEquityImpact({
        groups: baselineGroups(),
        interventions: [
            {
                id: 'inclusive-rollout',
                name: 'Inclusive rollout',
                coverage: 85,
                groupEffects: {
                    'group-urban': { benefitDelta: 10, harmDelta: -5, accessDelta: 12 },
                    'group-rural': { benefitDelta: 9, harmDelta: -4, accessDelta: 11 },
                    'group-suburban': { benefitDelta: 8, harmDelta: -3, accessDelta: 9 }
                }
            }
        ],
        thresholds: {
            maxDisparityGap: 30,
            maxHighVulnerabilityHarm: 38,
            minFairnessIndex: 55
        }
    }, {
        now: () => 50_000
    });

    assert.equal(report.summary.posture, 'aligned');
    assert.equal(report.summary.fairnessIndex >= 55, true);
    assert.equal(report.alerts.includes('equity_posture_blocked'), false);
});

test('evaluateEquityImpact blocks interventions with severe vulnerable-group harm and disparity', () => {
    const report = evaluateEquityImpact({
        groups: baselineGroups(),
        interventions: [
            {
                id: 'uneven-automation',
                name: 'Uneven automation',
                coverage: 90,
                groupEffects: {
                    'group-urban': { benefitDelta: 1, harmDelta: 28, accessDelta: -18 },
                    'group-rural': { benefitDelta: 2, harmDelta: 11, accessDelta: -8 },
                    'group-suburban': { benefitDelta: 14, harmDelta: 1, accessDelta: 8 }
                }
            }
        ],
        thresholds: {
            maxDisparityGap: 25,
            maxHighVulnerabilityHarm: 35,
            minFairnessIndex: 58
        }
    }, {
        now: () => 51_000
    });

    assert.equal(report.summary.posture, 'blocked');
    assert.equal(report.alerts.includes('vulnerable_group_harm_high'), true);
    assert.equal(report.alerts.includes('equity_posture_blocked'), true);
    assert.equal(report.recommendations[0].type, 'protect_vulnerable_groups');
});

test('equityRecommendationsToTasks and analyzer class emit schema-valid tasks and history', () => {
    const analyzer = new EquityImpactAnalyzer({
        localAgentId: 'agent:equity-local',
        now: () => 52_000
    });

    const report = analyzer.evaluate({
        groups: baselineGroups(),
        interventions: [
            {
                id: 'access-support',
                name: 'Access support',
                coverage: 70,
                groupEffects: {
                    'group-urban': { benefitDelta: 4, harmDelta: -2, accessDelta: 8 },
                    'group-rural': { benefitDelta: 3, harmDelta: -1, accessDelta: 6 },
                    'group-suburban': { benefitDelta: 2, harmDelta: 0, accessDelta: 3 }
                }
            }
        ]
    });

    const tasks = equityRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = analyzer.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:equity-local');
    assert.equal(analyzer.listHistory({ limit: 5 }).length, 1);
});
