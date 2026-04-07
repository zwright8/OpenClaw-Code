import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MissionPortfolioManager,
    planMissionPortfolio,
    portfolioToTaskRequests
} from '../index.js';

test('planMissionPortfolio prioritizes high-impact ready missions', () => {
    const now = 1_000_000;
    const report = planMissionPortfolio({
        missions: [
            {
                missionId: 'mission-alpha',
                objective: 'Ship reliability dashboard',
                impactScore: 90,
                urgencyScore: 82,
                readinessReport: {
                    status: 'ready',
                    readinessScore: 94
                },
                governorDecision: {
                    mode: 'normal',
                    riskScore: 12
                }
            },
            {
                missionId: 'mission-beta',
                objective: 'Run documentation cleanup',
                impactScore: 55,
                urgencyScore: 45,
                readinessReport: {
                    status: 'ready',
                    readinessScore: 88
                },
                governorDecision: {
                    mode: 'normal',
                    riskScore: 8
                }
            }
        ]
    }, {
        now: () => now,
        maxConcurrentMissions: 2
    });

    assert.equal(report.rankedMissions[0].missionId, 'mission-alpha');
    assert.equal(report.rankedMissions[0].scheduledLane, 'now');
    assert.ok(report.rankedMissions[0].score > report.rankedMissions[1].score);
});

test('planMissionPortfolio keeps blocked missions on hold even with high business value', () => {
    const report = planMissionPortfolio({
        missions: [
            {
                missionId: 'mission-critical-blocked',
                objective: 'Deploy critical migration',
                impactScore: 98,
                urgencyScore: 96,
                readinessReport: {
                    status: 'blocked',
                    readinessScore: 35
                },
                governorDecision: {
                    mode: 'normal',
                    riskScore: 20
                }
            }
        ]
    }, {
        maxConcurrentMissions: 3
    });

    assert.equal(report.rankedMissions[0].lane, 'hold');
    assert.equal(report.rankedMissions[0].scheduledLane, 'hold');
    assert.ok(report.recommendations.some((item) => item.type === 'unblock_mission'));
});

test('capacity-limited scheduling defers overflow now-lane missions to next', () => {
    const report = planMissionPortfolio({
        missions: [
            {
                missionId: 'mission-1',
                objective: 'Mission 1',
                impactScore: 88,
                urgencyScore: 84,
                readinessReport: { status: 'ready', readinessScore: 95 },
                governorDecision: { mode: 'normal', riskScore: 5 }
            },
            {
                missionId: 'mission-2',
                objective: 'Mission 2',
                impactScore: 86,
                urgencyScore: 82,
                readinessReport: { status: 'ready', readinessScore: 93 },
                governorDecision: { mode: 'normal', riskScore: 6 }
            }
        ]
    }, {
        maxConcurrentMissions: 1
    });

    assert.equal(report.lanes.now.length, 1);
    assert.equal(report.lanes.next.length, 1);
    assert.ok(report.rankedMissions.some((item) => item.capacityDeferred === true));
});

test('portfolioToTaskRequests and MissionPortfolioManager emit schema-valid tasks and history', () => {
    const manager = new MissionPortfolioManager({
        localAgentId: 'agent:portfolio',
        now: () => 4_000
    });

    const report = manager.evaluate({
        missions: [
            {
                missionId: 'mission-launch',
                objective: 'Launch new recovery playbook',
                impactScore: 90,
                urgencyScore: 76,
                preferredTarget: 'agent:ops',
                readinessReport: { status: 'ready', readinessScore: 91 },
                governorDecision: { mode: 'normal', riskScore: 10 }
            },
            {
                missionId: 'mission-blocked',
                objective: 'Blocked mission',
                impactScore: 80,
                urgencyScore: 80,
                readinessReport: { status: 'blocked', readinessScore: 40 },
                governorDecision: { mode: 'normal', riskScore: 15 }
            }
        ]
    }, {
        maxConcurrentMissions: 1
    });

    const tasks = portfolioToTaskRequests(report, {
        fromAgentId: 'agent:planner'
    });
    const managerTasks = manager.buildTaskRequests(report);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].context.missionId, 'string');

    assert.ok(managerTasks.length > 0);
    assert.equal(managerTasks[0].from, 'agent:portfolio');
    assert.equal(manager.listHistory({ limit: 2 }).length, 1);
});
