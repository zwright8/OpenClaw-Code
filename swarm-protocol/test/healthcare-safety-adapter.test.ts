import test from 'node:test';
import assert from 'node:assert/strict';
import {
    adaptHealthcareSafetyProtocols,
    healthcareSafetyToTasks,
    HealthcareSafetyProtocolAdapter
} from '../index.js';

function baseInput() {
    return {
        workflows: [
            {
                workflowId: 'wf-med-admin',
                setting: 'hospital',
                riskLevel: 'high',
                patientSafetyCriticality: 88,
                steps: [
                    {
                        id: 'step-verify',
                        action: 'Verify patient identity',
                        domains: ['identity'],
                        requiresHumanSignoff: true
                    },
                    {
                        id: 'step-administer',
                        action: 'Administer medication',
                        domains: ['medication']
                    }
                ]
            }
        ],
        protocols: [
            {
                protocolId: 'proto-identity',
                mandatory: true,
                triggerDomains: ['identity'],
                settings: ['hospital'],
                requiresSignoff: true,
                criticality: 85
            },
            {
                protocolId: 'proto-med',
                mandatory: true,
                triggerDomains: ['medication'],
                settings: ['hospital'],
                requiresSignoff: true,
                criticality: 90
            }
        ]
    };
}

test('adaptHealthcareSafetyProtocols flags missing signoff/mandatory protocol gates', () => {
    const report = adaptHealthcareSafetyProtocols(baseInput(), {
        now: () => 1_200_000
    });

    assert.equal(report.summary.workflowCount, 1);
    assert.equal(report.summary.reviewRequiredCount + report.summary.blockedCount >= 1, true);
    assert.equal(report.alerts.includes('healthcare_signoff_gap') || report.alerts.includes('healthcare_mandatory_check_missing'), true);
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'request_clinical_review' || entry.type === 'enforce_safety_gate'
    )), true);
});

test('adaptHealthcareSafetyProtocols reports safe posture for fully signed-off low-risk flow', () => {
    const report = adaptHealthcareSafetyProtocols({
        workflows: [
            {
                workflowId: 'wf-safe',
                setting: 'clinic',
                riskLevel: 'low',
                patientSafetyCriticality: 62,
                steps: [
                    {
                        id: 'step-1',
                        action: 'Check appointment',
                        domains: ['intake'],
                        requiresHumanSignoff: true
                    }
                ]
            }
        ],
        protocols: [
            {
                protocolId: 'proto-intake',
                mandatory: true,
                triggerDomains: ['intake'],
                settings: ['clinic'],
                requiresSignoff: true,
                criticality: 60
            }
        ]
    }, {
        now: () => 1_201_000
    });

    assert.equal(report.summary.posture, 'safe');
    assert.equal(report.summary.blockedCount, 0);
});

test('healthcareSafetyToTasks and class wrapper emit schema-valid tasks and history', () => {
    const adapter = new HealthcareSafetyProtocolAdapter({
        localAgentId: 'agent:health-safety-local',
        now: () => 1_202_000
    });

    const report = adapter.evaluate(baseInput());
    const tasks = healthcareSafetyToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = adapter.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:health-safety-local');
    assert.equal(adapter.listHistory({ limit: 5 }).length, 1);
});
