import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildReputationAccountabilityLedger,
    accountabilityLedgerToTasks,
    ReputationAccountabilityLedger
} from '../index.js';

function baseInput() {
    return {
        events: [
            {
                eventId: 'event-1',
                actorId: 'agent:ops',
                actorName: 'Ops Agent',
                actionType: 'dispatch',
                outcomeQuality: 46,
                policyCompliance: 52,
                evidenceCompleteness: 34,
                responseLatencyMinutes: 70,
                impactCriticality: 88,
                incidentFlag: true,
                remediationComplete: false
            },
            {
                eventId: 'event-2',
                actorId: 'agent:ops',
                actorName: 'Ops Agent',
                actionType: 'approval',
                outcomeQuality: 55,
                policyCompliance: 58,
                evidenceCompleteness: 48,
                responseLatencyMinutes: 38,
                impactCriticality: 72,
                incidentFlag: true,
                remediationComplete: false
            },
            {
                eventId: 'event-3',
                actorId: 'agent:planner',
                actorName: 'Planner Agent',
                actionType: 'analysis',
                outcomeQuality: 78,
                policyCompliance: 80,
                evidenceCompleteness: 72,
                responseLatencyMinutes: 14,
                impactCriticality: 44,
                incidentFlag: false,
                remediationComplete: true
            }
        ],
        capacity: {
            reviewHours: 8,
            evidenceHours: 4,
            coachingSlots: 1
        }
    };
}

test('buildReputationAccountabilityLedger surfaces accountability and evidence risk under constrained capacity', () => {
    const report = buildReputationAccountabilityLedger(baseInput(), {
        now: () => 1_800_000
    });

    assert.equal(report.summary.actorCount, 2);
    assert.equal(report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold, 2);
    assert.equal(
        report.alerts.includes('accountability_unresolved_incidents_present')
        || report.alerts.includes('accountability_evidence_gap_present')
        || report.alerts.includes('accountability_hold_queue_present'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'open_accountability_review' || entry.type === 'request_missing_evidence'
    )), true);
});

test('buildReputationAccountabilityLedger reports accountable posture for strong actor performance', () => {
    const report = buildReputationAccountabilityLedger({
        events: [
            {
                eventId: 'event-ok-1',
                actorId: 'agent:ok',
                actionType: 'analysis',
                outcomeQuality: 92,
                policyCompliance: 94,
                evidenceCompleteness: 90,
                responseLatencyMinutes: 6,
                impactCriticality: 40,
                incidentFlag: false,
                remediationComplete: true
            },
            {
                eventId: 'event-ok-2',
                actorId: 'agent:ok',
                actionType: 'dispatch',
                outcomeQuality: 90,
                policyCompliance: 92,
                evidenceCompleteness: 88,
                responseLatencyMinutes: 8,
                impactCriticality: 42,
                incidentFlag: false,
                remediationComplete: true
            }
        ],
        capacity: {
            reviewHours: 20,
            evidenceHours: 20,
            coachingSlots: 3
        }
    }, {
        now: () => 1_801_000
    });

    assert.equal(report.summary.posture, 'accountable');
    assert.equal(report.summary.laneCounts.hold, 0);
});

test('accountabilityLedgerToTasks and class wrapper emit schema-valid tasks and history', () => {
    const ledger = new ReputationAccountabilityLedger({
        localAgentId: 'agent:ledger-local',
        now: () => 1_802_000
    });

    const report = ledger.evaluate(baseInput());
    const tasks = accountabilityLedgerToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = ledger.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:ledger-local');
    assert.equal(ledger.listHistory({ limit: 5 }).length, 1);
});
