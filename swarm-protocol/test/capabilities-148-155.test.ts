import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 148,
        capabilityId: 'tooling_incident_playbook_synthesizer',
        evaluate: 'synthesizeToolingIncidentPlaybooks',
        toTasks: 'toolingIncidentPlaybookSynthesizerToTasks',
        className: 'ToolingIncidentPlaybookSynthesizer',
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 149,
        capabilityId: 'tooling_disaster_recovery_orchestrator',
        evaluate: 'orchestrateToolingDisasterRecovery',
        toTasks: 'toolingDisasterRecoveryOrchestratorToTasks',
        className: 'ToolingDisasterRecoveryOrchestrator',
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 150,
        capabilityId: 'tooling_privacy_preserving_data_broker',
        evaluate: 'brokerToolingPrivacyData',
        toTasks: 'toolingPrivacyPreservingDataBrokerToTasks',
        className: 'ToolingPrivacyPreservingDataBroker',
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 151,
        capabilityId: 'tooling_security_threat_modeler',
        evaluate: 'modelToolingSecurityThreats',
        toTasks: 'toolingSecurityThreatModelerToTasks',
        className: 'ToolingSecurityThreatModeler',
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 152,
        capabilityId: 'tooling_compliance_evidence_mapper',
        evaluate: 'mapToolingComplianceEvidence',
        toTasks: 'toolingComplianceEvidenceMapperToTasks',
        className: 'ToolingComplianceEvidenceMapper',
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 153,
        capabilityId: 'tooling_cost_benefit_forecaster',
        evaluate: 'forecastToolingCostBenefit',
        toTasks: 'toolingCostBenefitForecasterToTasks',
        className: 'ToolingCostBenefitForecaster',
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 154,
        capabilityId: 'tooling_equity_impact_scorer',
        evaluate: 'scoreToolingEquityImpact',
        toTasks: 'toolingEquityImpactScorerToTasks',
        className: 'ToolingEquityImpactScorer',
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 155,
        capabilityId: 'tooling_community_feedback_harvester',
        evaluate: 'harvestToolingCommunityFeedback',
        toTasks: 'toolingCommunityFeedbackHarvesterToTasks',
        className: 'ToolingCommunityFeedbackHarvester',
        collectionField: 'feedbackEntries',
        idField: 'entryId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 81,
        capacity: 43,
        risk: 72,
        impact: 83,
        readiness: 44,
        resilience: 38,
        equity: 57,
        efficiency: 51,
        quality: 59,
        trust: 52,
        opportunity: 76,
        criticality: 88,
        ...overrides
    };
}

for (const [index, capability] of capabilities.entries()) {
    test(`${capability.number} ${capability.capabilityId} generates capability report`, () => {
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        assert.equal(typeof evaluate, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, `${capability.number}-a`),
                buildEntity(capability.idField, `${capability.number}-b`, {
                    demand: 45,
                    capacity: 87,
                    risk: 24,
                    readiness: 82,
                    resilience: 85,
                    trust: 83,
                    quality: 80,
                    efficiency: 77,
                    criticality: 50
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 16,
                reviewHours: 6
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1790000 + index
        });

        assert.equal(typeof report.at, 'number');
        assert.equal(report.summary.entityCount, 2);
        assert.equal(report.assessments.length, 2);
        assert.equal(
            report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold,
            2
        );
        assert.equal(Array.isArray(report.alerts), true);
        assert.equal(Array.isArray(report.recommendations), true);
        assert.equal(report.recommendations.length > 0, true);
    });

    test(`${capability.number} ${capability.capabilityId} tasks and manager wrappers emit task requests`, () => {
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        const toTasks = swarm[capability.toTasks as keyof typeof swarm];
        const ManagerClass = swarm[capability.className as keyof typeof swarm];

        assert.equal(typeof evaluate, 'function');
        assert.equal(typeof toTasks, 'function');
        assert.equal(typeof ManagerClass, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, `${capability.number}-x`),
                buildEntity(capability.idField, `${capability.number}-y`, {
                    demand: 49,
                    capacity: 89,
                    risk: 21,
                    readiness: 84,
                    resilience: 86,
                    trust: 85,
                    quality: 82,
                    efficiency: 79,
                    criticality: 46
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 18
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1800000 + index
        });
        const tasks = (toTasks as (reportPayload: unknown, options: unknown) => any[])(report, {
            fromAgentId: 'agent:test-runner'
        });

        assert.equal(tasks.length > 0, true);
        assert.equal(tasks[0].kind, 'task_request');
        assert.equal(tasks[0].from, 'agent:test-runner');

        const ManagerCtor = ManagerClass as new (options: unknown) => {
            evaluate: (input: unknown) => any;
            buildTasks: (reportPayload: unknown) => any[];
            listHistory: (options: { limit: number }) => unknown[];
        };
        const manager = new ManagerCtor({
            localAgentId: 'agent:manager-local',
            now: () => 1810000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
