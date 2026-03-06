import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AutonomousMissionLauncher,
    compileAutonomousLaunchBatch,
    launchBatchToDispatchTasks,
    launchBatchToFollowupTasks
} from '../index.js';

function samplePortfolio() {
    return {
        rankedMissions: [
            {
                missionId: 'mission-a',
                objective: 'Deploy reliability improvements',
                preferredTarget: 'agent:ops',
                scheduledLane: 'now',
                score: 92,
                readinessStatus: 'ready',
                governorMode: 'normal',
                governorRiskScore: 12,
                estimatedDurationMs: 40_000
            },
            {
                missionId: 'mission-b',
                objective: 'Roll out telemetry expansion',
                preferredTarget: 'agent:ops',
                scheduledLane: 'now',
                score: 84,
                readinessStatus: 'ready',
                governorMode: 'normal',
                governorRiskScore: 18,
                estimatedDurationMs: 35_000
            },
            {
                missionId: 'mission-c',
                objective: 'Blocked security migration',
                preferredTarget: 'agent:ops',
                scheduledLane: 'now',
                score: 88,
                readinessStatus: 'blocked',
                governorMode: 'normal',
                governorRiskScore: 32,
                estimatedDurationMs: 50_000
            }
        ]
    };
}

test('compileAutonomousLaunchBatch launches ready missions immediately with bypass_all approvals', () => {
    const batch = compileAutonomousLaunchBatch({
        portfolioReport: samplePortfolio()
    }, {
        now: () => 1_000,
        maxLaunches: 2,
        approvalOptions: {
            mode: 'bypass_all'
        }
    });

    assert.equal(batch.summary.totalCandidates, 3);
    assert.equal(batch.summary.immediateLaunchCount, 2);
    assert.equal(batch.summary.blockedCount, 1);
    assert.ok(batch.launches.find((row) => row.missionId === 'mission-a').approval.decision.autoApproved);
});

test('maxLaunches defers overflow now-lane missions', () => {
    const batch = compileAutonomousLaunchBatch({
        portfolioReport: {
            rankedMissions: samplePortfolio().rankedMissions.filter((mission) => mission.missionId !== 'mission-c')
        }
    }, {
        now: () => 2_000,
        maxLaunches: 1,
        approvalOptions: {
            mode: 'bypass_all'
        }
    });

    assert.equal(batch.summary.immediateLaunchCount, 1);
    assert.equal(batch.summary.deferredCount, 1);
    assert.ok(batch.launches.some((row) => row.launchDecision === 'deferred'));
});

test('blocked capability hard block moves mission into blocked launch decision', () => {
    const batch = compileAutonomousLaunchBatch({
        portfolioReport: {
            rankedMissions: [
                {
                    missionId: 'mission-secure',
                    objective: 'Access restricted credentials',
                    scheduledLane: 'now',
                    score: 90,
                    readinessStatus: 'ready',
                    governorMode: 'normal',
                    governorRiskScore: 20
                }
            ]
        }
    }, {
        now: () => 3_000,
        maxLaunches: 1,
        approvalOptions: {
            mode: 'bypass_all',
            blockedCapabilities: ['operations']
        }
    });

    assert.equal(batch.summary.blockedCount, 1);
    assert.equal(batch.launches[0].launchDecision, 'blocked');
    assert.ok(batch.launches[0].reason.includes('hard_block'));
});

test('dispatch and follow-up task conversion emits schema-valid task requests', () => {
    const batch = compileAutonomousLaunchBatch({
        portfolioReport: samplePortfolio()
    }, {
        now: () => 4_000,
        maxLaunches: 1,
        approvalOptions: { mode: 'bypass_all' }
    });

    const dispatchTasks = launchBatchToDispatchTasks(batch);
    const followupTasks = launchBatchToFollowupTasks(batch, {
        fromAgentId: 'agent:launcher'
    });

    assert.equal(dispatchTasks.length, 1);
    assert.equal(dispatchTasks[0].kind, 'task_request');
    assert.equal(typeof dispatchTasks[0].context.missionId, 'string');

    assert.ok(followupTasks.length >= 1);
    assert.equal(followupTasks[0].from, 'agent:launcher');
});

test('AutonomousMissionLauncher stores history and supports forecast-recommended source', () => {
    const launcher = new AutonomousMissionLauncher({
        localAgentId: 'agent:launcher',
        now: () => 5_000
    });

    const batch = launcher.compile({
        forecastReport: {
            recommendedScenario: {
                portfolio: samplePortfolio()
            }
        }
    }, {
        maxLaunches: 2,
        approvalOptions: { mode: 'bypass_all' }
    });

    assert.equal(batch.source, 'forecast_recommended');
    assert.equal(launcher.listHistory({ limit: 5 }).length, 1);
    assert.ok(launcher.buildDispatchTasks(batch).length >= 1);
});
