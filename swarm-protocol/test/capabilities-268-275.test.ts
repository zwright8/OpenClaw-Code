import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 268,
        capabilityId: 'collab_incident_playbook_synthesizer',
        evaluate: 'synthesizeCollabIncidentPlaybooks',
        toTasks: 'collabIncidentPlaybookSynthesizerToTasks',
        className: 'CollabIncidentPlaybookSynthesizer',
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 269,
        capabilityId: 'collab_disaster_recovery_orchestrator',
        evaluate: 'orchestrateCollabDisasterRecovery',
        toTasks: 'collabDisasterRecoveryOrchestratorToTasks',
        className: 'CollabDisasterRecoveryOrchestrator',
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 270,
        capabilityId: 'collab_privacy_preserving_data_broker',
        evaluate: 'brokerCollabPrivacyData',
        toTasks: 'collabPrivacyPreservingDataBrokerToTasks',
        className: 'CollabPrivacyPreservingDataBroker',
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 271,
        capabilityId: 'collab_security_threat_modeler',
        evaluate: 'modelCollabSecurityThreats',
        toTasks: 'collabSecurityThreatModelerToTasks',
        className: 'CollabSecurityThreatModeler',
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 272,
        capabilityId: 'collab_compliance_evidence_mapper',
        evaluate: 'mapCollabComplianceEvidence',
        toTasks: 'collabComplianceEvidenceMapperToTasks',
        className: 'CollabComplianceEvidenceMapper',
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 273,
        capabilityId: 'collab_cost_benefit_forecaster',
        evaluate: 'forecastCollabCostBenefit',
        toTasks: 'collabCostBenefitForecasterToTasks',
        className: 'CollabCostBenefitForecaster',
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 274,
        capabilityId: 'collab_equity_impact_scorer',
        evaluate: 'scoreCollabEquityImpact',
        toTasks: 'collabEquityImpactScorerToTasks',
        className: 'CollabEquityImpactScorer',
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 275,
        capabilityId: 'collab_community_feedback_harvester',
        evaluate: 'harvestCollabCommunityFeedback',
        toTasks: 'collabCommunityFeedbackHarvesterToTasks',
        className: 'CollabCommunityFeedbackHarvester',
        collectionField: 'feedbackEntries',
        idField: 'entryId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 93,
        capacity: 34,
        risk: 88,
        impact: 92,
        readiness: 44,
        resilience: 26,
        equity: 64,
        efficiency: 57,
        quality: 66,
        trust: 59,
        opportunity: 91,
        criticality: 103,
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
                    demand: 38,
                    capacity: 107,
                    risk: 7,
                    readiness: 99,
                    resilience: 101,
                    trust: 100,
                    quality: 97,
                    efficiency: 94,
                    criticality: 31
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 28,
                reviewHours: 17
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2240000 + index
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
                    demand: 42,
                    capacity: 108,
                    risk: 6,
                    readiness: 100,
                    resilience: 102,
                    trust: 101,
                    quality: 98,
                    efficiency: 95,
                    criticality: 30
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 62,
                reviewHours: 31
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2250000 + index
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
            now: () => 2260000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
