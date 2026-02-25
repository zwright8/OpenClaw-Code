import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CommunityFeedbackHarvester,
    harvestCommunityFeedback,
    communityFeedbackToTasks
} from '../index.js';

test('harvestCommunityFeedback deduplicates repeated reports and aggregates themes', () => {
    const report = harvestCommunityFeedback({
        feedback: [
            {
                id: 'f-1',
                channel: 'forum',
                text: 'The app keeps crashing and becomes unavailable after login.',
                upvotes: 12,
                region: 'US'
            },
            {
                id: 'f-2',
                channel: 'forum',
                text: 'The app keeps crashing and becomes unavailable after login.',
                upvotes: 3,
                region: 'US'
            },
            {
                id: 'f-3',
                channel: 'discord',
                text: 'Navigation is confusing and the workflow has too much friction.',
                upvotes: 7,
                region: 'CA'
            }
        ]
    }, {
        now: () => 60_000
    });

    assert.equal(report.summary.totalFeedbackCount, 3);
    assert.equal(report.summary.uniqueFeedbackCount, 2);
    assert.equal(report.summary.duplicateCount, 1);
    assert.equal(report.themes.length > 0, true);
    assert.equal(report.themes.some((theme) => theme.theme === 'reliability' || theme.theme === 'usability'), true);
});

test('harvestCommunityFeedback escalates critical posture on urgent high-risk harm feedback', () => {
    const report = harvestCommunityFeedback({
        feedback: [
            {
                id: 'urgent-1',
                channel: 'support',
                text: 'URGENT: users are facing unsafe scam messages and harm right now. immediate fix needed.',
                flags: ['urgent', 'safety'],
                upvotes: 18,
                region: 'US'
            },
            {
                id: 'urgent-2',
                channel: 'email',
                text: 'Critical abuse issue: dangerous scam behavior is spreading rapidly.',
                flags: ['harm'],
                upvotes: 10,
                region: 'UK'
            }
        ]
    }, {
        now: () => 61_000
    });

    assert.equal(report.summary.posture, 'critical');
    assert.equal(report.alerts.includes('harm_signal_detected'), true);
    assert.equal(report.alerts.includes('community_posture_critical'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'mitigate_harm_signal'), true);
});

test('communityFeedbackToTasks and harvester class emit schema-valid tasks and history', () => {
    const harvester = new CommunityFeedbackHarvester({
        localAgentId: 'agent:community-local',
        now: () => 62_000
    });

    const report = harvester.evaluate({
        feedback: [
            {
                id: 'f-10',
                channel: 'forum',
                text: 'Useful update. The workflow is clearer and much faster now.',
                upvotes: 8,
                region: 'US'
            }
        ]
    });

    const tasks = communityFeedbackToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = harvester.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:community-local');
    assert.equal(harvester.listHistory({ limit: 5 }).length, 1);
});
