import test from 'node:test';
import assert from 'node:assert/strict';
import {
    mapComplianceStandards,
    complianceMappingToTasks,
    ComplianceStandardMapper
} from '../index.js';

function baseInput() {
    return {
        controls: [
            {
                id: 'control-access-review',
                name: 'Privileged access review',
                domains: ['identity', 'access'],
                standards: ['soc2'],
                requirementIds: ['soc2-cc6.1'],
                coverage: 82,
                effectiveness: 78,
                evidenceRefs: ['evidence:access-review-q1'],
                owner: 'team:iam'
            },
            {
                id: 'control-change-approval',
                name: 'Change approval workflow',
                domains: ['change', 'operations'],
                standards: ['soc2', 'iso27001'],
                requirementIds: ['soc2-cc8.1', 'iso-a12.1'],
                coverage: 68,
                effectiveness: 64,
                evidenceRefs: [],
                owner: 'team:platform'
            },
            {
                id: 'control-incident-playbook',
                name: 'Incident response playbooks',
                domains: ['incident', 'operations'],
                standards: ['iso27001'],
                requirementIds: ['iso-a16.1'],
                coverage: 74,
                effectiveness: 72,
                evidenceRefs: ['evidence:incident-drill'],
                owner: 'team:reliability'
            }
        ],
        standards: [
            {
                id: 'soc2',
                name: 'SOC 2',
                requirements: [
                    {
                        id: 'soc2-cc6.1',
                        title: 'Logical access controls',
                        domains: ['identity', 'access'],
                        mandatory: true,
                        minCoverage: 75,
                        minEffectiveness: 70
                    },
                    {
                        id: 'soc2-cc8.1',
                        title: 'Change management controls',
                        domains: ['change'],
                        mandatory: true,
                        minCoverage: 75,
                        minEffectiveness: 70
                    }
                ]
            },
            {
                id: 'iso27001',
                name: 'ISO 27001',
                requirements: [
                    {
                        id: 'iso-a16.1',
                        title: 'Incident management',
                        domains: ['incident'],
                        mandatory: true,
                        minCoverage: 72,
                        minEffectiveness: 70
                    },
                    {
                        id: 'iso-a9.2',
                        title: 'User access provisioning',
                        domains: ['identity'],
                        mandatory: true,
                        minCoverage: 75,
                        minEffectiveness: 75
                    }
                ]
            }
        ]
    };
}

test('mapComplianceStandards surfaces mandatory gaps and remediation recommendations', () => {
    const report = mapComplianceStandards(baseInput(), {
        now: () => 500_000
    });

    assert.equal(report.summary.standardCount, 2);
    assert.equal(report.summary.missingMandatoryCount >= 1, true);
    assert.equal(report.alerts.includes('mandatory_compliance_gap_detected'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'remediate_mandatory_gap'), true);
});

test('mapComplianceStandards reports compliant posture when requirements are fully covered', () => {
    const report = mapComplianceStandards({
        controls: [
            {
                id: 'control-1',
                name: 'Access governance',
                domains: ['identity'],
                standards: ['std-a'],
                requirementIds: ['std-a-1'],
                coverage: 90,
                effectiveness: 88,
                evidenceRefs: ['e1']
            }
        ],
        standards: [
            {
                id: 'std-a',
                name: 'Standard A',
                requirements: [
                    {
                        id: 'std-a-1',
                        title: 'Identity control',
                        domains: ['identity'],
                        mandatory: true,
                        minCoverage: 75,
                        minEffectiveness: 75
                    }
                ]
            }
        ]
    }, {
        now: () => 501_000
    });

    assert.equal(report.summary.posture, 'compliant');
    assert.equal(report.summary.missingMandatoryCount, 0);
    assert.equal(report.standards[0].posture, 'compliant');
});

test('complianceMappingToTasks and class wrapper emit schema-valid tasks and history', () => {
    const mapper = new ComplianceStandardMapper({
        localAgentId: 'agent:compliance-local',
        now: () => 502_000
    });

    const report = mapper.evaluate(baseInput());
    const tasks = complianceMappingToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = mapper.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:compliance-local');
    assert.equal(mapper.listHistory({ limit: 5 }).length, 1);
});
