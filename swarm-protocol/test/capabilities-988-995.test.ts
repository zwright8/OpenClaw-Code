import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EvolutionIncidentPlaybookSynthesizer,
    evolutionIncidentPlaybookSynthesizerToTasks,
    synthesizeEvolutionIncidentPlaybooks
} from '../src/evolution-incident-playbook-synthesizer.js';
import {
    EvolutionDisasterRecoveryOrchestrator,
    evolutionDisasterRecoveryOrchestratorToTasks,
    orchestrateEvolutionDisasterRecovery
} from '../src/evolution-disaster-recovery-orchestrator.js';
import {
    EvolutionPrivacyPreservingDataBroker,
    brokerEvolutionPrivacyData,
    evolutionPrivacyPreservingDataBrokerToTasks
} from '../src/evolution-privacy-preserving-data-broker.js';
import {
    EvolutionSecurityThreatModeler,
    evolutionSecurityThreatModelerToTasks,
    modelEvolutionSecurityThreats
} from '../src/evolution-security-threat-modeler.js';
import {
    EvolutionComplianceEvidenceMapper,
    evolutionComplianceEvidenceMapperToTasks,
    mapEvolutionComplianceEvidence
} from '../src/evolution-compliance-evidence-mapper.js';
import {
    EvolutionCostBenefitForecaster,
    evolutionCostBenefitForecasterToTasks,
    forecastEvolutionCostBenefit
} from '../src/evolution-cost-benefit-forecaster.js';
import {
    EvolutionEquityImpactScorer,
    evolutionEquityImpactScorerToTasks,
    scoreEvolutionEquityImpact
} from '../src/evolution-equity-impact-scorer.js';
import {
    EvolutionCommunityFeedbackHarvester,
    evolutionCommunityFeedbackHarvesterToTasks,
    harvestEvolutionCommunityFeedback
} from '../src/evolution-community-feedback-harvester.js';

const capabilities = [
    {
        number: 988,
        capabilityId: 'evolution_incident_playbook_synthesizer',
        evaluate: synthesizeEvolutionIncidentPlaybooks,
        toTasks: evolutionIncidentPlaybookSynthesizerToTasks,
        classRef: EvolutionIncidentPlaybookSynthesizer,
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 989,
        capabilityId: 'evolution_disaster_recovery_orchestrator',
        evaluate: orchestrateEvolutionDisasterRecovery,
        toTasks: evolutionDisasterRecoveryOrchestratorToTasks,
        classRef: EvolutionDisasterRecoveryOrchestrator,
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 990,
        capabilityId: 'evolution_privacy_preserving_data_broker',
        evaluate: brokerEvolutionPrivacyData,
        toTasks: evolutionPrivacyPreservingDataBrokerToTasks,
        classRef: EvolutionPrivacyPreservingDataBroker,
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 991,
        capabilityId: 'evolution_security_threat_modeler',
        evaluate: modelEvolutionSecurityThreats,
        toTasks: evolutionSecurityThreatModelerToTasks,
        classRef: EvolutionSecurityThreatModeler,
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 992,
        capabilityId: 'evolution_compliance_evidence_mapper',
        evaluate: mapEvolutionComplianceEvidence,
        toTasks: evolutionComplianceEvidenceMapperToTasks,
        classRef: EvolutionComplianceEvidenceMapper,
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 993,
        capabilityId: 'evolution_cost_benefit_forecaster',
        evaluate: forecastEvolutionCostBenefit,
        toTasks: evolutionCostBenefitForecasterToTasks,
        classRef: EvolutionCostBenefitForecaster,
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 994,
        capabilityId: 'evolution_equity_impact_scorer',
        evaluate: scoreEvolutionEquityImpact,
        toTasks: evolutionEquityImpactScorerToTasks,
        classRef: EvolutionEquityImpactScorer,
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 995,
        capabilityId: 'evolution_community_feedback_harvester',
        evaluate: harvestEvolutionCommunityFeedback,
        toTasks: evolutionCommunityFeedbackHarvesterToTasks,
        classRef: EvolutionCommunityFeedbackHarvester,
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
            now: () => 9880000 + index
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
            now: () => 9890000 + index
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
            now: () => 5400000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
