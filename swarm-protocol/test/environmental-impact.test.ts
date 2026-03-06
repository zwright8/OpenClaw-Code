import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EnvironmentalImpactEstimator,
    environmentalRecommendationsToTasks,
    estimateEnvironmentalImpact
} from '../index.js';

function baseInput() {
    return {
        activities: [
            {
                id: 'activity-data-batch',
                name: 'Nightly data processing',
                region: 'dry-zone',
                energyKwh: 1_800,
                renewableShare: 20,
                travelKm: 1_200,
                cloudComputeHours: 300,
                waterLiters: 12_000,
                wasteKg: 140,
                materialCircularity: 35,
                biodiversityRisk: 72
            },
            {
                id: 'activity-community-ops',
                name: 'Community operations',
                region: 'global',
                energyKwh: 220,
                renewableShare: 80,
                travelKm: 80,
                cloudComputeHours: 40,
                waterLiters: 1_200,
                wasteKg: 18,
                materialCircularity: 75,
                biodiversityRisk: 28
            }
        ],
        factors: {
            kgCo2PerKwh: 0.42,
            kgCo2PerTravelKm: 0.19,
            kgCo2PerComputeHour: 0.08,
            kgCo2PerWasteKg: 1.2,
            waterStressMultiplier: 1,
            regionalStress: {
                'dry-zone': 1.8
            }
        },
        thresholds: {
            maxCarbonKg: 900,
            maxWaterLiters: 10_000,
            maxWasteKg: 100,
            maxImpactScore: 64,
            maxPortfolioCarbonKg: 1_400
        }
    };
}

test('estimateEnvironmentalImpact flags high externality activities and emits blocker alerts', () => {
    const report = estimateEnvironmentalImpact(baseInput(), {
        now: () => 200_000
    });

    assert.equal(report.summary.activityCount, 2);
    assert.equal(report.summary.blockedCount >= 1, true);
    assert.equal(report.alerts.includes('environmental_blockers_detected'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'reduce_carbon_intensity'), true);
});

test('estimateEnvironmentalImpact reports sustainable posture for low-impact activity profile', () => {
    const report = estimateEnvironmentalImpact({
        activities: [
            {
                id: 'activity-low-impact',
                name: 'Low impact analysis job',
                region: 'global',
                energyKwh: 120,
                renewableShare: 90,
                travelKm: 15,
                cloudComputeHours: 12,
                waterLiters: 500,
                wasteKg: 4,
                materialCircularity: 90,
                biodiversityRisk: 10
            }
        ],
        thresholds: {
            maxCarbonKg: 900,
            maxWaterLiters: 10_000,
            maxWasteKg: 100,
            maxImpactScore: 64,
            maxPortfolioCarbonKg: 1_400
        }
    }, {
        now: () => 201_000
    });

    assert.equal(report.summary.sustainableCount, 1);
    assert.equal(report.summary.blockedCount, 0);
    assert.equal(report.activities[0].posture, 'sustainable');
});

test('environmentalRecommendationsToTasks and class wrapper emit schema-valid tasks and history', () => {
    const estimator = new EnvironmentalImpactEstimator({
        localAgentId: 'agent:env-local',
        now: () => 202_000
    });

    const report = estimator.evaluate(baseInput());
    const tasks = environmentalRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = estimator.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:env-local');
    assert.equal(estimator.listHistory({ limit: 5 }).length, 1);
});
