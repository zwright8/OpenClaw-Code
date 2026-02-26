import test from 'node:test';
import assert from 'node:assert/strict';
import {
    scoreCollaborationTrust,
    collaborationTrustToTasks,
    CollaborationTrustScoreEngine
} from '../index.js';

function baseInput() {
    return {
        collaborations: [
            {
                collaborationId: 'collab-relief',
                participants: ['agent:ops', 'agent:field', 'agent:logistics'],
                sharedObjectiveClarity: 52,
                commitmentReliability: 48,
                transparency: 38,
                evidenceTraceability: 42,
                coordinationLatency: 58,
                resolutionRate: 46,
                incidentRate: 68,
                reviewCadenceDays: 44
            },
            {
                collaborationId: 'collab-product',
                participants: ['agent:product', 'agent:data'],
                sharedObjectiveClarity: 72,
                commitmentReliability: 70,
                transparency: 68,
                evidenceTraceability: 66,
                coordinationLatency: 22,
                resolutionRate: 74,
                incidentRate: 24,
                reviewCadenceDays: 21
            }
        ]
    };
}

test('scoreCollaborationTrust flags trust-critical and transparency pressure', () => {
    const report = scoreCollaborationTrust(baseInput(), {
        now: () => 1_700_000
    });

    assert.equal(report.summary.collaborationCount, 2);
    assert.equal(report.summary.tierCounts.critical + report.summary.tierCounts.low + report.summary.tierCounts.moderate + report.summary.tierCounts.high, 2);
    assert.equal(
        report.alerts.includes('collaboration_trust_critical_present')
        || report.alerts.includes('collaboration_transparency_gap')
        || report.alerts.includes('collaboration_incident_rate_high'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'initiate_trust_repair' || entry.type === 'add_evidence_transparency'
    )), true);
});

test('scoreCollaborationTrust reports trusted posture for strong collaboration quality', () => {
    const report = scoreCollaborationTrust({
        collaborations: [
            {
                collaborationId: 'collab-ok',
                participants: ['agent:a', 'agent:b'],
                sharedObjectiveClarity: 92,
                commitmentReliability: 90,
                transparency: 88,
                evidenceTraceability: 86,
                coordinationLatency: 8,
                resolutionRate: 90,
                incidentRate: 6,
                reviewCadenceDays: 10
            }
        ]
    }, {
        now: () => 1_701_000
    });

    assert.equal(report.summary.posture, 'trusted');
    assert.equal(report.summary.tierCounts.critical, 0);
    assert.equal(report.summary.tierCounts.low, 0);
});

test('collaborationTrustToTasks and class wrapper emit schema-valid tasks and history', () => {
    const engine = new CollaborationTrustScoreEngine({
        localAgentId: 'agent:trust-local',
        now: () => 1_702_000
    });

    const report = engine.evaluate(baseInput());
    const tasks = collaborationTrustToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = engine.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:trust-local');
    assert.equal(engine.listHistory({ limit: 5 }).length, 1);
});
