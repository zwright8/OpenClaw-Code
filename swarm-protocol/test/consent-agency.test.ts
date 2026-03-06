import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ConsentAgencyMapper,
    mapConsentAndAgency,
    consentAgencyToTasks
} from '../index.js';

function baseInput() {
    return {
        participants: [
            {
                id: 'participant-a',
                name: 'Participant A',
                consentStatus: 'granted',
                grantedScopes: ['notifications', 'analytics'],
                revocationEnabled: true,
                requiredNoticeHours: 0
            },
            {
                id: 'participant-b',
                name: 'Participant B',
                consentStatus: 'unknown',
                grantedScopes: ['notifications'],
                revocationEnabled: false,
                requiredNoticeHours: 12
            }
        ],
        actions: [
            {
                id: 'action-1',
                name: 'Targeted notification run',
                targetParticipantIds: ['participant-a', 'participant-b'],
                requiredScopes: ['notifications', 'analytics'],
                riskScore: 62,
                urgencyScore: 72
            }
        ],
        policy: {
            conditionalRiskLimit: 45,
            unknownConsentBlocks: true,
            requireRevocationForRiskAbove: 55
        }
    };
}

test('mapConsentAndAgency blocks actions with unknown consent and scope gaps', () => {
    const report = mapConsentAndAgency(baseInput(), {
        now: () => 170_000
    });

    assert.equal(report.summary.blockedActionCount, 1);
    assert.equal(report.alerts.includes('unconsented_action_detected'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'block_unconsented_action'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'request_explicit_consent'), true);
});

test('mapConsentAndAgency allows actions when consent and scope are fully satisfied', () => {
    const report = mapConsentAndAgency({
        participants: [
            {
                id: 'participant-a',
                consentStatus: 'granted',
                grantedScopes: ['notifications', 'analytics'],
                revocationEnabled: true
            }
        ],
        actions: [
            {
                id: 'action-allow',
                targetParticipantIds: ['participant-a'],
                requiredScopes: ['notifications'],
                riskScore: 25,
                urgencyScore: 40
            }
        ],
        policy: {
            unknownConsentBlocks: true
        }
    }, {
        now: () => 171_000
    });

    assert.equal(report.summary.allowedActionCount, 1);
    assert.equal(report.summary.blockedActionCount, 0);
    assert.equal(report.actions[0].posture, 'allowed');
});

test('consentAgencyToTasks and class wrapper emit schema-valid tasks and history', () => {
    const mapper = new ConsentAgencyMapper({
        localAgentId: 'agent:consent-local',
        now: () => 172_000
    });

    const report = mapper.evaluate(baseInput());
    const tasks = consentAgencyToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = mapper.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:consent-local');
    assert.equal(mapper.listHistory({ limit: 5 }).length, 1);
});
