import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InfraIncidentPlaybookSynthesizer,
    infraIncidentPlaybookSynthesizerToTasks,
    synthesizeInfraIncidentPlaybooks
} from '../src/infra-incident-playbook-synthesizer.js';
import {
    InfraDisasterRecoveryOrchestrator,
    infraDisasterRecoveryOrchestratorToTasks,
    orchestrateInfraDisasterRecovery
} from '../src/infra-disaster-recovery-orchestrator.js';
import {
    InfraPrivacyPreservingDataBroker,
    brokerInfraPrivacyData,
    infraPrivacyPreservingDataBrokerToTasks
} from '../src/infra-privacy-preserving-data-broker.js';
import {
    InfraSecurityThreatModeler,
    infraSecurityThreatModelerToTasks,
    modelInfraSecurityThreats
} from '../src/infra-security-threat-modeler.js';
import {
    InfraComplianceEvidenceMapper,
    infraComplianceEvidenceMapperToTasks,
    mapInfraComplianceEvidence
} from '../src/infra-compliance-evidence-mapper.js';
import {
    InfraCostBenefitForecaster,
    forecastInfraCostBenefit,
    infraCostBenefitForecasterToTasks
} from '../src/infra-cost-benefit-forecaster.js';
import {
    InfraEquityImpactScorer,
    infraEquityImpactScorerToTasks,
    scoreInfraEquityImpact
} from '../src/infra-equity-impact-scorer.js';
import {
    InfraCommunityFeedbackHarvester,
    harvestInfraCommunityFeedback,
    infraCommunityFeedbackHarvesterToTasks
} from '../src/infra-community-feedback-harvester.js';

const capabilities = [
    {
        number: 948,
        capabilityId: 'infra_incident_playbook_synthesizer',
        evaluate: synthesizeInfraIncidentPlaybooks,
        toTasks: infraIncidentPlaybookSynthesizerToTasks,
        classRef: InfraIncidentPlaybookSynthesizer,
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 949,
        capabilityId: 'infra_disaster_recovery_orchestrator',
        evaluate: orchestrateInfraDisasterRecovery,
        toTasks: infraDisasterRecoveryOrchestratorToTasks,
        classRef: InfraDisasterRecoveryOrchestrator,
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 950,
        capabilityId: 'infra_privacy_preserving_data_broker',
        evaluate: brokerInfraPrivacyData,
        toTasks: infraPrivacyPreservingDataBrokerToTasks,
        classRef: InfraPrivacyPreservingDataBroker,
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 951,
        capabilityId: 'infra_security_threat_modeler',
        evaluate: modelInfraSecurityThreats,
        toTasks: infraSecurityThreatModelerToTasks,
        classRef: InfraSecurityThreatModeler,
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 952,
        capabilityId: 'infra_compliance_evidence_mapper',
        evaluate: mapInfraComplianceEvidence,
        toTasks: infraComplianceEvidenceMapperToTasks,
        classRef: InfraComplianceEvidenceMapper,
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 953,
        capabilityId: 'infra_cost_benefit_forecaster',
        evaluate: forecastInfraCostBenefit,
        toTasks: infraCostBenefitForecasterToTasks,
        classRef: InfraCostBenefitForecaster,
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 954,
        capabilityId: 'infra_equity_impact_scorer',
        evaluate: scoreInfraEquityImpact,
        toTasks: infraEquityImpactScorerToTasks,
        classRef: InfraEquityImpactScorer,
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 955,
        capabilityId: 'infra_community_feedback_harvester',
        evaluate: harvestInfraCommunityFeedback,
        toTasks: infraCommunityFeedbackHarvesterToTasks,
        classRef: InfraCommunityFeedbackHarvester,
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

        const report = capability.evaluate(payload, {
            now: () => 9480000 + index
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

        const report = capability.evaluate(payload, {
            now: () => 9490000 + index
        });
        const tasks = capability.toTasks(report, {
            fromAgentId: 'agent:test-runner'
        });

        assert.equal(tasks.length > 0, true);
        assert.equal(tasks[0].kind, 'task_request');
        assert.equal(tasks[0].from, 'agent:test-runner');

        const ManagerCtor = capability.classRef as new (options: unknown) => {
            evaluate: (input: unknown) => any;
            buildTasks: (reportPayload: unknown) => any[];
            listHistory: (options: { limit: number }) => unknown[];
        };
        const manager = new ManagerCtor({
            localAgentId: 'agent:manager-local',
            now: () => 4900000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
