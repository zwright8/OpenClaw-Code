import test from 'node:test';
import assert from 'node:assert/strict';
import {
    RightsIncidentPlaybookSynthesizer,
    rightsIncidentPlaybookSynthesizerToTasks,
    synthesizeRightsIncidentPlaybooks
} from '../src/rights-incident-playbook-synthesizer.js';
import {
    RightsDisasterRecoveryOrchestrator,
    orchestrateRightsDisasterRecovery,
    rightsDisasterRecoveryOrchestratorToTasks
} from '../src/rights-disaster-recovery-orchestrator.js';
import {
    RightsPrivacyPreservingDataBroker,
    brokerRightsPrivacyData,
    rightsPrivacyPreservingDataBrokerToTasks
} from '../src/rights-privacy-preserving-data-broker.js';
import {
    RightsSecurityThreatModeler,
    modelRightsSecurityThreats,
    rightsSecurityThreatModelerToTasks
} from '../src/rights-security-threat-modeler.js';
import {
    RightsComplianceEvidenceMapper,
    mapRightsComplianceEvidence,
    rightsComplianceEvidenceMapperToTasks
} from '../src/rights-compliance-evidence-mapper.js';
import {
    RightsCostBenefitForecaster,
    forecastRightsCostBenefit,
    rightsCostBenefitForecasterToTasks
} from '../src/rights-cost-benefit-forecaster.js';
import {
    RightsEquityImpactScorer,
    rightsEquityImpactScorerToTasks,
    scoreRightsEquityImpact
} from '../src/rights-equity-impact-scorer.js';
import {
    RightsCommunityFeedbackHarvester,
    harvestRightsCommunityFeedback,
    rightsCommunityFeedbackHarvesterToTasks
} from '../src/rights-community-feedback-harvester.js';

const capabilities = [
    {
        number: 908,
        capabilityId: 'rights_incident_playbook_synthesizer',
        evaluate: synthesizeRightsIncidentPlaybooks,
        toTasks: rightsIncidentPlaybookSynthesizerToTasks,
        classRef: RightsIncidentPlaybookSynthesizer,
        collectionField: 'incidents',
        idField: 'incidentId'
    },
    {
        number: 909,
        capabilityId: 'rights_disaster_recovery_orchestrator',
        evaluate: orchestrateRightsDisasterRecovery,
        toTasks: rightsDisasterRecoveryOrchestratorToTasks,
        classRef: RightsDisasterRecoveryOrchestrator,
        collectionField: 'recoveryMissions',
        idField: 'missionId'
    },
    {
        number: 910,
        capabilityId: 'rights_privacy_preserving_data_broker',
        evaluate: brokerRightsPrivacyData,
        toTasks: rightsPrivacyPreservingDataBrokerToTasks,
        classRef: RightsPrivacyPreservingDataBroker,
        collectionField: 'dataExchanges',
        idField: 'exchangeId'
    },
    {
        number: 911,
        capabilityId: 'rights_security_threat_modeler',
        evaluate: modelRightsSecurityThreats,
        toTasks: rightsSecurityThreatModelerToTasks,
        classRef: RightsSecurityThreatModeler,
        collectionField: 'threatSurfaces',
        idField: 'surfaceId'
    },
    {
        number: 912,
        capabilityId: 'rights_compliance_evidence_mapper',
        evaluate: mapRightsComplianceEvidence,
        toTasks: rightsComplianceEvidenceMapperToTasks,
        classRef: RightsComplianceEvidenceMapper,
        collectionField: 'controls',
        idField: 'controlId'
    },
    {
        number: 913,
        capabilityId: 'rights_cost_benefit_forecaster',
        evaluate: forecastRightsCostBenefit,
        toTasks: rightsCostBenefitForecasterToTasks,
        classRef: RightsCostBenefitForecaster,
        collectionField: 'initiatives',
        idField: 'initiativeId'
    },
    {
        number: 914,
        capabilityId: 'rights_equity_impact_scorer',
        evaluate: scoreRightsEquityImpact,
        toTasks: rightsEquityImpactScorerToTasks,
        classRef: RightsEquityImpactScorer,
        collectionField: 'cohorts',
        idField: 'cohortId'
    },
    {
        number: 915,
        capabilityId: 'rights_community_feedback_harvester',
        evaluate: harvestRightsCommunityFeedback,
        toTasks: rightsCommunityFeedbackHarvesterToTasks,
        classRef: RightsCommunityFeedbackHarvester,
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
            now: () => 9080000 + index
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
            now: () => 9090000 + index
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
            now: () => 4400000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
