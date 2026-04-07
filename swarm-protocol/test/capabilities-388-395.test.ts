import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 388,
        capabilityId: 'logistics_incident_playbook_synthesizer',
        evaluate: 'synthesizeLogisticsIncidentPlaybooks',
        toTasks: 'logisticsIncidentPlaybookSynthesizerToTasks',
        className: 'LogisticsIncidentPlaybookSynthesizer',
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 389,
        capabilityId: 'logistics_disaster_recovery_orchestrator',
        evaluate: 'orchestrateLogisticsDisasterRecovery',
        toTasks: 'logisticsDisasterRecoveryOrchestratorToTasks',
        className: 'LogisticsDisasterRecoveryOrchestrator',
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 390,
        capabilityId: 'logistics_privacy_preserving_data_broker',
        evaluate: 'brokerLogisticsPrivacyData',
        toTasks: 'logisticsPrivacyPreservingDataBrokerToTasks',
        className: 'LogisticsPrivacyPreservingDataBroker',
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 391,
        capabilityId: 'logistics_security_threat_modeler',
        evaluate: 'modelLogisticsSecurityThreats',
        toTasks: 'logisticsSecurityThreatModelerToTasks',
        className: 'LogisticsSecurityThreatModeler',
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 392,
        capabilityId: 'logistics_compliance_evidence_mapper',
        evaluate: 'mapLogisticsComplianceEvidence',
        toTasks: 'logisticsComplianceEvidenceMapperToTasks',
        className: 'LogisticsComplianceEvidenceMapper',
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 393,
        capabilityId: 'logistics_cost_benefit_forecaster',
        evaluate: 'forecastLogisticsCostBenefit',
        toTasks: 'logisticsCostBenefitForecasterToTasks',
        className: 'LogisticsCostBenefitForecaster',
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 394,
        capabilityId: 'logistics_equity_impact_scorer',
        evaluate: 'scoreLogisticsEquityImpact',
        toTasks: 'logisticsEquityImpactScorerToTasks',
        className: 'LogisticsEquityImpactScorer',
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 395,
        capabilityId: 'logistics_community_feedback_harvester',
        evaluate: 'harvestLogisticsCommunityFeedback',
        toTasks: 'logisticsCommunityFeedbackHarvesterToTasks',
        className: 'LogisticsCommunityFeedbackHarvester',
        collectionField: 'feedbackEntries',
        idField: 'entryId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 82,
        capacity: 44,
        risk: 78,
        impact: 81,
        readiness: 39,
        resilience: 36,
        equity: 52,
        efficiency: 46,
        quality: 54,
        trust: 47,
        opportunity: 79,
        criticality: 93,
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
                    demand: 48,
                    capacity: 92,
                    risk: 19,
                    readiness: 87,
                    resilience: 90,
                    trust: 88,
                    quality: 85,
                    efficiency: 82,
                    criticality: 43
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 18,
                reviewHours: 7
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 3880000 + index
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
                    demand: 52,
                    capacity: 94,
                    risk: 18,
                    readiness: 89,
                    resilience: 91,
                    trust: 90,
                    quality: 87,
                    efficiency: 84,
                    criticality: 41
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 42,
                reviewHours: 20
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 3890000 + index
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
            now: () => 2070000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
