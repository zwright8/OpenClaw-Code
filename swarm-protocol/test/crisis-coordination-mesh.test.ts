import test from 'node:test';
import assert from 'node:assert/strict';
import {
    coordinateCrisisMesh,
    crisisCoordinationToTasks,
    CrisisCoordinationMesh
} from '../index.js';

function baseInput() {
    return {
        teams: [
            {
                id: 'team-core-ops',
                specialties: ['mitigation', 'operations', 'communications'],
                regionCoverage: ['US', 'global'],
                capacity: 4,
                activeLoad: 2,
                shiftStatus: 'active'
            },
            {
                id: 'team-security',
                specialties: ['security', 'forensics'],
                regionCoverage: ['US', 'EU'],
                capacity: 2,
                activeLoad: 2,
                shiftStatus: 'active'
            }
        ],
        crises: [
            {
                crisisId: 'crisis-1',
                title: 'Regional outage',
                severity: 'critical',
                region: 'US',
                requiredCapabilities: ['mitigation', 'communications', 'logistics'],
                impactedPopulation: 120000,
                deadlineMinutes: 30,
                communicationRequired: true
            }
        ]
    };
}

test('coordinateCrisisMesh detects role gaps and recommends war-room coordination', () => {
    const report = coordinateCrisisMesh(baseInput(), {
        now: () => 800_000
    });

    assert.equal(report.summary.crisisCount, 1);
    assert.equal(report.summary.coordinatedCount + report.summary.reviewRequiredCount + report.summary.criticalCount >= 1, true);
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'open_joint_war_room' || entry.type === 'request_mutual_aid'
    )), true);
});

test('coordinateCrisisMesh reaches coordinated posture when multi-role coverage is strong', () => {
    const report = coordinateCrisisMesh({
        teams: [
            {
                id: 'team-a',
                specialties: ['mitigation', 'communications', 'logistics'],
                regionCoverage: ['global'],
                capacity: 5,
                activeLoad: 1
            },
            {
                id: 'team-b',
                specialties: ['mitigation', 'logistics'],
                regionCoverage: ['global'],
                capacity: 4,
                activeLoad: 1
            },
            {
                id: 'team-c',
                specialties: ['communications', 'logistics'],
                regionCoverage: ['global'],
                capacity: 3,
                activeLoad: 0
            }
        ],
        crises: [
            {
                crisisId: 'crisis-ok',
                title: 'Moderate incident',
                severity: 'medium',
                region: 'global',
                requiredCapabilities: ['mitigation', 'communications'],
                deadlineMinutes: 120,
                communicationRequired: true
            }
        ]
    }, {
        now: () => 801_000
    });

    assert.equal(report.summary.posture, 'ready');
    assert.equal(report.summary.criticalCount, 0);
});

test('crisisCoordinationToTasks and class wrapper emit schema-valid tasks and history', () => {
    const mesh = new CrisisCoordinationMesh({
        localAgentId: 'agent:crisis-local',
        now: () => 802_000
    });

    const report = mesh.evaluate(baseInput());
    const tasks = crisisCoordinationToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = mesh.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:crisis-local');
    assert.equal(mesh.listHistory({ limit: 5 }).length, 1);
});
