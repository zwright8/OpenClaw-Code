import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MissionForecastLab,
    forecastMissionPortfolioScenarios,
    forecastToTaskRequests
} from '../index.js';

function baseMissions() {
    return [
        {
            missionId: 'mission-a',
            objective: 'Mission A',
            impactScore: 90,
            urgencyScore: 78,
            readinessReport: {
                status: 'ready',
                readinessScore: 92
            },
            governorDecision: {
                mode: 'normal',
                riskScore: 12
            }
        },
        {
            missionId: 'mission-b',
            objective: 'Mission B',
            impactScore: 75,
            urgencyScore: 74,
            readinessReport: {
                status: 'needs_attention',
                readinessScore: 76
            },
            governorDecision: {
                mode: 'degraded',
                riskScore: 32
            }
        },
        {
            missionId: 'mission-c',
            objective: 'Mission C',
            impactScore: 80,
            urgencyScore: 82,
            readinessReport: {
                status: 'blocked',
                readinessScore: 39
            },
            governorDecision: {
                mode: 'normal',
                riskScore: 20
            }
        }
    ];
}

test('forecastMissionPortfolioScenarios evaluates baseline and scenarios with recommendation', () => {
    const forecast = forecastMissionPortfolioScenarios({
        missions: baseMissions(),
        scenarios: [
            {
                name: 'capacity-upgrade',
                maxConcurrentMissions: 3,
                missionOverrides: {
                    'mission-b': {
                        readinessReport: {
                            status: 'ready',
                            readinessScore: 87
                        },
                        governorDecision: {
                            mode: 'normal',
                            riskScore: 18
                        }
                    }
                }
            },
            {
                name: 'risk-spike',
                maxConcurrentMissions: 2,
                missionOverrides: {
                    'mission-a': {
                        governorDecision: {
                            mode: 'restricted',
                            riskScore: 68
                        }
                    }
                }
            }
        ]
    }, {
        maxConcurrentMissions: 2
    });

    assert.equal(forecast.baseline.name, 'baseline');
    assert.equal(forecast.scenarios.length, 2);
    assert.ok(forecast.recommendedScenario);
    assert.equal(typeof forecast.recommendedScenario.metrics.scenarioScore, 'number');
});

test('scenario overrides change lane outcomes and improve score when constraints are lifted', () => {
    const forecast = forecastMissionPortfolioScenarios({
        missions: baseMissions(),
        scenarios: [
            {
                name: 'unblock-mission-c',
                maxConcurrentMissions: 3,
                missionOverrides: {
                    'mission-c': {
                        readinessReport: {
                            status: 'ready',
                            readinessScore: 84
                        }
                    }
                }
            }
        ]
    }, {
        maxConcurrentMissions: 2
    });

    const baseline = forecast.baseline;
    const scenario = forecast.scenarios[0];

    assert.ok(scenario.metrics.nowCount >= baseline.metrics.nowCount);
    assert.ok(scenario.metrics.scenarioScore >= baseline.metrics.scenarioScore);
});

test('forecastToTaskRequests emits schema-valid scenario adoption tasks', () => {
    const forecast = forecastMissionPortfolioScenarios({
        missions: baseMissions(),
        scenarios: [
            {
                name: 'capacity-upgrade',
                maxConcurrentMissions: 3
            }
        ]
    }, {
        maxConcurrentMissions: 2
    });

    const tasks = forecastToTaskRequests(forecast, {
        fromAgentId: 'agent:planner'
    });

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].context.scenarioName, 'string');
});

test('MissionForecastLab stores history and builds tasks', () => {
    const lab = new MissionForecastLab({
        localAgentId: 'agent:forecast-lab',
        now: () => 8_000
    });

    const forecast = lab.evaluate({
        missions: baseMissions(),
        scenarios: [
            {
                name: 'short-window',
                maxConcurrentMissions: 1
            }
        ]
    }, {
        maxConcurrentMissions: 2
    });

    const tasks = lab.buildTaskRequests(forecast);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].from, 'agent:forecast-lab');
    assert.equal(lab.listHistory({ limit: 5 }).length, 1);
});
