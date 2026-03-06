import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 228,
        capabilityId: 'oversight_incident_playbook_synthesizer',
        evaluate: 'synthesizeOversightIncidentPlaybooks',
        toTasks: 'oversightIncidentPlaybookSynthesizerToTasks',
        className: 'OversightIncidentPlaybookSynthesizer',
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 229,
        capabilityId: 'oversight_disaster_recovery_orchestrator',
        evaluate: 'orchestrateOversightDisasterRecovery',
        toTasks: 'oversightDisasterRecoveryOrchestratorToTasks',
        className: 'OversightDisasterRecoveryOrchestrator',
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 230,
        capabilityId: 'oversight_privacy_preserving_data_broker',
        evaluate: 'brokerOversightPrivacyData',
        toTasks: 'oversightPrivacyPreservingDataBrokerToTasks',
        className: 'OversightPrivacyPreservingDataBroker',
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 231,
        capabilityId: 'oversight_security_threat_modeler',
        evaluate: 'modelOversightSecurityThreats',
        toTasks: 'oversightSecurityThreatModelerToTasks',
        className: 'OversightSecurityThreatModeler',
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 232,
        capabilityId: 'oversight_compliance_evidence_mapper',
        evaluate: 'mapOversightComplianceEvidence',
        toTasks: 'oversightComplianceEvidenceMapperToTasks',
        className: 'OversightComplianceEvidenceMapper',
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 233,
        capabilityId: 'oversight_cost_benefit_forecaster',
        evaluate: 'forecastOversightCostBenefit',
        toTasks: 'oversightCostBenefitForecasterToTasks',
        className: 'OversightCostBenefitForecaster',
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 234,
        capabilityId: 'oversight_equity_impact_scorer',
        evaluate: 'scoreOversightEquityImpact',
        toTasks: 'oversightEquityImpactScorerToTasks',
        className: 'OversightEquityImpactScorer',
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 235,
        capabilityId: 'oversight_community_feedback_harvester',
        evaluate: 'harvestOversightCommunityFeedback',
        toTasks: 'oversightCommunityFeedbackHarvesterToTasks',
        className: 'OversightCommunityFeedbackHarvester',
        collectionField: 'feedbackEntries',
        idField: 'entryId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 87,
        capacity: 40,
        risk: 82,
        impact: 86,
        readiness: 45,
        resilience: 32,
        equity: 58,
        efficiency: 52,
        quality: 60,
        trust: 53,
        opportunity: 85,
        criticality: 98,
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
                    demand: 43,
                    capacity: 97,
                    risk: 14,
                    readiness: 92,
                    resilience: 95,
                    trust: 93,
                    quality: 90,
                    efficiency: 87,
                    criticality: 38
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 23,
                reviewHours: 12
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2090000 + index
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
                    demand: 47,
                    capacity: 99,
                    risk: 12,
                    readiness: 94,
                    resilience: 96,
                    trust: 95,
                    quality: 92,
                    efficiency: 89,
                    criticality: 36
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 52,
                reviewHours: 25
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2100000 + index
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
            now: () => 2110000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
