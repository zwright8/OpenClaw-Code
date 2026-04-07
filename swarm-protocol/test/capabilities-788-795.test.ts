import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CulturalIncidentPlaybookSynthesizer,
    culturalIncidentPlaybookSynthesizerToTasks,
    synthesizeCulturalIncidentPlaybooks
} from '../src/cultural-incident-playbook-synthesizer.js';
import {
    CulturalDisasterRecoveryOrchestrator,
    culturalDisasterRecoveryOrchestratorToTasks,
    orchestrateCulturalDisasterRecovery
} from '../src/cultural-disaster-recovery-orchestrator.js';
import {
    CulturalPrivacyPreservingDataBroker,
    brokerCulturalPrivacyData,
    culturalPrivacyPreservingDataBrokerToTasks
} from '../src/cultural-privacy-preserving-data-broker.js';
import {
    CulturalSecurityThreatModeler,
    culturalSecurityThreatModelerToTasks,
    modelCulturalSecurityThreats
} from '../src/cultural-security-threat-modeler.js';
import {
    CulturalComplianceEvidenceMapper,
    culturalComplianceEvidenceMapperToTasks,
    mapCulturalComplianceEvidence
} from '../src/cultural-compliance-evidence-mapper.js';
import {
    CulturalCostBenefitForecaster,
    culturalCostBenefitForecasterToTasks,
    forecastCulturalCostBenefit
} from '../src/cultural-cost-benefit-forecaster.js';
import {
    CulturalEquityImpactScorer,
    culturalEquityImpactScorerToTasks,
    scoreCulturalEquityImpact
} from '../src/cultural-equity-impact-scorer.js';
import {
    CulturalCommunityFeedbackHarvester,
    culturalCommunityFeedbackHarvesterToTasks,
    harvestCulturalCommunityFeedback
} from '../src/cultural-community-feedback-harvester.js';

const capabilities = [
    {
        number: 788,
        capabilityId: 'cultural_incident_playbook_synthesizer',
        evaluate: synthesizeCulturalIncidentPlaybooks,
        toTasks: culturalIncidentPlaybookSynthesizerToTasks,
        classRef: CulturalIncidentPlaybookSynthesizer,
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 789,
        capabilityId: 'cultural_disaster_recovery_orchestrator',
        evaluate: orchestrateCulturalDisasterRecovery,
        toTasks: culturalDisasterRecoveryOrchestratorToTasks,
        classRef: CulturalDisasterRecoveryOrchestrator,
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 790,
        capabilityId: 'cultural_privacy_preserving_data_broker',
        evaluate: brokerCulturalPrivacyData,
        toTasks: culturalPrivacyPreservingDataBrokerToTasks,
        classRef: CulturalPrivacyPreservingDataBroker,
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 791,
        capabilityId: 'cultural_security_threat_modeler',
        evaluate: modelCulturalSecurityThreats,
        toTasks: culturalSecurityThreatModelerToTasks,
        classRef: CulturalSecurityThreatModeler,
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 792,
        capabilityId: 'cultural_compliance_evidence_mapper',
        evaluate: mapCulturalComplianceEvidence,
        toTasks: culturalComplianceEvidenceMapperToTasks,
        classRef: CulturalComplianceEvidenceMapper,
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 793,
        capabilityId: 'cultural_cost_benefit_forecaster',
        evaluate: forecastCulturalCostBenefit,
        toTasks: culturalCostBenefitForecasterToTasks,
        classRef: CulturalCostBenefitForecaster,
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 794,
        capabilityId: 'cultural_equity_impact_scorer',
        evaluate: scoreCulturalEquityImpact,
        toTasks: culturalEquityImpactScorerToTasks,
        classRef: CulturalEquityImpactScorer,
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 795,
        capabilityId: 'cultural_community_feedback_harvester',
        evaluate: harvestCulturalCommunityFeedback,
        toTasks: culturalCommunityFeedbackHarvesterToTasks,
        classRef: CulturalCommunityFeedbackHarvester,
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
            now: () => 7880000 + index
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
            now: () => 7890000 + index
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
            now: () => 2900000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
