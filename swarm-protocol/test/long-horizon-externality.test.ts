import test from 'node:test';
import assert from 'node:assert/strict';
import {
    LongHorizonExternalityForecaster,
    forecastLongHorizonExternalities,
    longHorizonRecommendationsToTasks
} from '../index.js';

function baselineInput() {
    return {
        baseline: {
            humanity: 71,
            truth: 67,
            curiosity: 63,
            reliability: 69
        }
    };
}

test('forecastLongHorizonExternalities projects improving trajectory for positive interventions and tailwinds', () => {
    const report = forecastLongHorizonExternalities({
        ...baselineInput(),
        horizonYears: [1, 3, 5, 10],
        interventions: [
            {
                id: 'capacity',
                name: 'Capacity building',
                rolloutYears: 2,
                persistenceYears: 8,
                volatility: 12,
                effects: {
                    humanity: 5,
                    truth: 3,
                    curiosity: 2,
                    reliability: 6
                }
            }
        ],
        externalities: [
            {
                id: 'community-tailwind',
                name: 'Community adoption tailwind',
                direction: 'tailwind',
                onsetYear: 2,
                durationYears: 6,
                intensity: 40,
                spread: 55,
                effects: {
                    humanity: 4,
                    truth: 2,
                    curiosity: 3,
                    reliability: 3
                }
            }
        ],
        feedbackLoops: [
            {
                id: 'trust-loop',
                triggerMetric: 'reliability',
                triggerThreshold: 72,
                polarity: 'reinforcing',
                gain: 24
            }
        ]
    }, {
        now: () => 20_000
    });

    assert.equal(report.yearlyProjections.length, 4);
    assert.equal(report.summary.delta > 0, true);
    assert.equal(['improving', 'regenerative'].includes(report.summary.trajectory), true);
    assert.equal(report.alerts.includes('long_horizon_decline'), false);
});

test('forecastLongHorizonExternalities raises risk alerts under sustained headwinds', () => {
    const report = forecastLongHorizonExternalities({
        ...baselineInput(),
        horizonYears: [1, 2, 4, 7],
        interventions: [
            {
                id: 'fragile-ops',
                name: 'Fragile operations automation',
                rolloutYears: 1,
                persistenceYears: 2,
                volatility: 52,
                effects: {
                    humanity: 1,
                    truth: 1,
                    curiosity: 0,
                    reliability: 1
                }
            }
        ],
        externalities: [
            {
                id: 'policy-headwind',
                name: 'Adverse policy headwind',
                direction: 'headwind',
                onsetYear: 1,
                durationYears: 7,
                intensity: 92,
                spread: 88,
                effects: {
                    humanity: 9,
                    truth: 8,
                    curiosity: 4,
                    reliability: 10
                }
            }
        ],
        feedbackLoops: [
            {
                id: 'erosion-loop',
                triggerMetric: 'humanity',
                triggerThreshold: 68,
                polarity: 'balancing',
                gain: 40
            }
        ]
    }, {
        now: () => 21_000
    });

    assert.equal(report.summary.finalRiskScore >= 60, true);
    assert.equal(report.alerts.includes('externality_risk_high'), true);
    assert.equal(report.alerts.includes('long_horizon_decline'), true);
    assert.equal(['fragile', 'declining'].includes(report.summary.trajectory), true);
});

test('longHorizonRecommendationsToTasks and forecaster class emit schema-valid tasks and history', () => {
    const forecaster = new LongHorizonExternalityForecaster({
        localAgentId: 'agent:externality',
        now: () => 22_000
    });

    const report = forecaster.evaluate({
        ...baselineInput(),
        interventions: [
            {
                id: 'capacity',
                name: 'Capacity building',
                effects: {
                    humanity: 4,
                    truth: 2,
                    curiosity: 1,
                    reliability: 4
                }
            }
        ],
        externalities: []
    });

    const tasks = longHorizonRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = forecaster.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:externality');
    assert.equal(forecaster.listHistory({ limit: 5 }).length, 1);
});
