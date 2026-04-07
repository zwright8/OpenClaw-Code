import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InclusionIncidentPlaybookSynthesizer,
    inclusionIncidentPlaybookSynthesizerToTasks,
    synthesizeInclusionIncidentPlaybooks
} from '../src/inclusion-incident-playbook-synthesizer.js';
import {
    InclusionDisasterRecoveryOrchestrator,
    inclusionDisasterRecoveryOrchestratorToTasks,
    orchestrateInclusionDisasterRecovery
} from '../src/inclusion-disaster-recovery-orchestrator.js';
import {
    InclusionPrivacyPreservingDataBroker,
    brokerInclusionPrivacyData,
    inclusionPrivacyPreservingDataBrokerToTasks
} from '../src/inclusion-privacy-preserving-data-broker.js';
import {
    InclusionSecurityThreatModeler,
    inclusionSecurityThreatModelerToTasks,
    modelInclusionSecurityThreats
} from '../src/inclusion-security-threat-modeler.js';
import {
    InclusionComplianceEvidenceMapper,
    inclusionComplianceEvidenceMapperToTasks,
    mapInclusionComplianceEvidence
} from '../src/inclusion-compliance-evidence-mapper.js';
import {
    InclusionCostBenefitForecaster,
    forecastInclusionCostBenefit,
    inclusionCostBenefitForecasterToTasks
} from '../src/inclusion-cost-benefit-forecaster.js';
import {
    InclusionEquityImpactScorer,
    inclusionEquityImpactScorerToTasks,
    scoreInclusionEquityImpact
} from '../src/inclusion-equity-impact-scorer.js';
import {
    InclusionCommunityFeedbackHarvester,
    harvestInclusionCommunityFeedback,
    inclusionCommunityFeedbackHarvesterToTasks
} from '../src/inclusion-community-feedback-harvester.js';

const capabilities = [
    {
        number: 828,
        capabilityId: 'inclusion_incident_playbook_synthesizer',
        evaluate: synthesizeInclusionIncidentPlaybooks,
        toTasks: inclusionIncidentPlaybookSynthesizerToTasks,
        classRef: InclusionIncidentPlaybookSynthesizer,
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 829,
        capabilityId: 'inclusion_disaster_recovery_orchestrator',
        evaluate: orchestrateInclusionDisasterRecovery,
        toTasks: inclusionDisasterRecoveryOrchestratorToTasks,
        classRef: InclusionDisasterRecoveryOrchestrator,
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 830,
        capabilityId: 'inclusion_privacy_preserving_data_broker',
        evaluate: brokerInclusionPrivacyData,
        toTasks: inclusionPrivacyPreservingDataBrokerToTasks,
        classRef: InclusionPrivacyPreservingDataBroker,
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 831,
        capabilityId: 'inclusion_security_threat_modeler',
        evaluate: modelInclusionSecurityThreats,
        toTasks: inclusionSecurityThreatModelerToTasks,
        classRef: InclusionSecurityThreatModeler,
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 832,
        capabilityId: 'inclusion_compliance_evidence_mapper',
        evaluate: mapInclusionComplianceEvidence,
        toTasks: inclusionComplianceEvidenceMapperToTasks,
        classRef: InclusionComplianceEvidenceMapper,
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 833,
        capabilityId: 'inclusion_cost_benefit_forecaster',
        evaluate: forecastInclusionCostBenefit,
        toTasks: inclusionCostBenefitForecasterToTasks,
        classRef: InclusionCostBenefitForecaster,
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 834,
        capabilityId: 'inclusion_equity_impact_scorer',
        evaluate: scoreInclusionEquityImpact,
        toTasks: inclusionEquityImpactScorerToTasks,
        classRef: InclusionEquityImpactScorer,
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 835,
        capabilityId: 'inclusion_community_feedback_harvester',
        evaluate: harvestInclusionCommunityFeedback,
        toTasks: inclusionCommunityFeedbackHarvesterToTasks,
        classRef: InclusionCommunityFeedbackHarvester,
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
            now: () => 8280000 + index
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
            now: () => 8290000 + index
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
            now: () => 3400000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
