import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CommunityIncidentPlaybookSynthesizer,
    communityIncidentPlaybookSynthesizerToTasks,
    synthesizeCommunityIncidentPlaybooks
} from '../src/community-incident-playbook-synthesizer.js';
import {
    CommunityDisasterRecoveryOrchestrator,
    communityDisasterRecoveryOrchestratorToTasks,
    orchestrateCommunityDisasterRecovery
} from '../src/community-disaster-recovery-orchestrator.js';
import {
    CommunityPrivacyPreservingDataBroker,
    brokerCommunityPrivacyData,
    communityPrivacyPreservingDataBrokerToTasks
} from '../src/community-privacy-preserving-data-broker.js';
import {
    CommunitySecurityThreatModeler,
    communitySecurityThreatModelerToTasks,
    modelCommunitySecurityThreats
} from '../src/community-security-threat-modeler.js';
import {
    CommunityComplianceEvidenceMapper,
    communityComplianceEvidenceMapperToTasks,
    mapCommunityComplianceEvidence
} from '../src/community-compliance-evidence-mapper.js';
import {
    CommunityCostBenefitForecaster,
    communityCostBenefitForecasterToTasks,
    forecastCommunityCostBenefit
} from '../src/community-cost-benefit-forecaster.js';
import {
    CommunityEquityImpactScorer,
    communityEquityImpactScorerToTasks,
    scoreCommunityEquityImpact
} from '../src/community-equity-impact-scorer.js';
import {
    CommunityCommunityFeedbackHarvester,
    communityCommunityFeedbackHarvesterToTasks,
    harvestCommunityCommunityFeedback
} from '../src/community-community-feedback-harvester.js';

const capabilities = [
    {
        number: 868,
        capabilityId: 'community_incident_playbook_synthesizer',
        evaluate: synthesizeCommunityIncidentPlaybooks,
        toTasks: communityIncidentPlaybookSynthesizerToTasks,
        classRef: CommunityIncidentPlaybookSynthesizer,
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 869,
        capabilityId: 'community_disaster_recovery_orchestrator',
        evaluate: orchestrateCommunityDisasterRecovery,
        toTasks: communityDisasterRecoveryOrchestratorToTasks,
        classRef: CommunityDisasterRecoveryOrchestrator,
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 870,
        capabilityId: 'community_privacy_preserving_data_broker',
        evaluate: brokerCommunityPrivacyData,
        toTasks: communityPrivacyPreservingDataBrokerToTasks,
        classRef: CommunityPrivacyPreservingDataBroker,
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 871,
        capabilityId: 'community_security_threat_modeler',
        evaluate: modelCommunitySecurityThreats,
        toTasks: communitySecurityThreatModelerToTasks,
        classRef: CommunitySecurityThreatModeler,
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 872,
        capabilityId: 'community_compliance_evidence_mapper',
        evaluate: mapCommunityComplianceEvidence,
        toTasks: communityComplianceEvidenceMapperToTasks,
        classRef: CommunityComplianceEvidenceMapper,
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 873,
        capabilityId: 'community_cost_benefit_forecaster',
        evaluate: forecastCommunityCostBenefit,
        toTasks: communityCostBenefitForecasterToTasks,
        classRef: CommunityCostBenefitForecaster,
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 874,
        capabilityId: 'community_equity_impact_scorer',
        evaluate: scoreCommunityEquityImpact,
        toTasks: communityEquityImpactScorerToTasks,
        classRef: CommunityEquityImpactScorer,
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 875,
        capabilityId: 'community_community_feedback_harvester',
        evaluate: harvestCommunityCommunityFeedback,
        toTasks: communityCommunityFeedbackHarvesterToTasks,
        classRef: CommunityCommunityFeedbackHarvester,
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
            now: () => 8680000 + index
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
            now: () => 8690000 + index
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
            now: () => 3900000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
