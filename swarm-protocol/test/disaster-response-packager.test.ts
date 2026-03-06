import test from 'node:test';
import assert from 'node:assert/strict';
import {
    packageDisasterResponseMissions,
    disasterMissionPackagesToTasks,
    DisasterResponseMissionPackager
} from '../index.js';

function baseInput() {
    return {
        disasters: [
            {
                disasterId: 'dis-1',
                type: 'flood',
                region: 'US-Gulf',
                severity: 'critical',
                impactedPopulation: 240000,
                urgencyHours: 10,
                requiredCapabilities: ['medical', 'logistics', 'shelter'],
                logisticsConstraints: ['road_closure', 'fuel_shortage'],
                criticalNeeds: ['shelter', 'clean_water', 'medical_support']
            }
        ],
        resources: [
            {
                id: 'res-medical',
                regionCoverage: ['US-Gulf'],
                capabilities: ['medical'],
                quantity: 2,
                readiness: 72,
                availableHours: 18
            },
            {
                id: 'res-logistics',
                regionCoverage: ['global'],
                capabilities: ['logistics'],
                quantity: 1,
                readiness: 68,
                availableHours: 20
            }
        ]
    };
}

test('packageDisasterResponseMissions highlights resource/logistics gaps and emits mitigation tasks', () => {
    const report = packageDisasterResponseMissions(baseInput(), {
        now: () => 1_100_000
    });

    assert.equal(report.summary.missionCount, 1);
    assert.equal(report.summary.reviewRequiredCount + report.summary.blockedCount >= 1, true);
    assert.equal(report.alerts.includes('disaster_capability_gap') || report.alerts.includes('disaster_logistics_risk_high'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'fill_resource_gap'), true);
});

test('packageDisasterResponseMissions marks launch_ready with strong capability coverage', () => {
    const report = packageDisasterResponseMissions({
        disasters: [
            {
                disasterId: 'dis-ok',
                type: 'storm',
                region: 'global',
                severity: 'high',
                impactedPopulation: 50000,
                urgencyHours: 24,
                requiredCapabilities: ['medical', 'logistics'],
                logisticsConstraints: [],
                criticalNeeds: ['medical_support']
            }
        ],
        resources: [
            {
                id: 'res-a',
                regionCoverage: ['global'],
                capabilities: ['medical', 'logistics'],
                quantity: 4,
                readiness: 88,
                availableHours: 48
            }
        ]
    }, {
        now: () => 1_101_000
    });

    assert.equal(report.summary.posture, 'ready');
    assert.equal(report.summary.blockedCount, 0);
    assert.equal(report.missionPackages[0].posture, 'launch_ready');
});

test('disasterMissionPackagesToTasks and class wrapper emit schema-valid tasks and history', () => {
    const packager = new DisasterResponseMissionPackager({
        localAgentId: 'agent:disaster-local',
        now: () => 1_102_000
    });

    const report = packager.evaluate(baseInput());
    const tasks = disasterMissionPackagesToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = packager.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:disaster-local');
    assert.equal(packager.listHistory({ limit: 5 }).length, 1);
});
