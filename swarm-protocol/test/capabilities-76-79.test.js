import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 76,
        capabilityId: 'social_simulation_sandbox',
        evaluate: 'simulateSocialDynamicsSandbox',
        toTasks: 'socialSimulationToTasks',
        className: 'SocialSimulationSandbox',
        collectionField: 'scenarios',
        idField: 'scenarioId',
        signalFields: {
            demand: 'interactionDensity',
            capacity: 'moderationCapacity',
            risk: 'harmRisk',
            impact: 'societalImpact',
            readiness: 'modelReadiness',
            resilience: 'policyResilience',
            equity: 'inclusionScore',
            efficiency: 'simulationEfficiency',
            quality: 'dataQuality',
            trust: 'communityTrust',
            opportunity: 'learningPotential',
            criticality: 'urgency'
        }
    },
    {
        number: 77,
        capabilityId: 'consensus_formation_facilitator',
        evaluate: 'facilitateConsensusFormation',
        toTasks: 'consensusFormationToTasks',
        className: 'ConsensusFormationFacilitator',
        collectionField: 'proposals',
        idField: 'proposalId',
        signalFields: {
            demand: 'stakeholderDemand',
            capacity: 'facilitationCapacity',
            risk: 'polarizationRisk',
            impact: 'agreementImpact',
            readiness: 'draftReadiness',
            resilience: 'compromiseResilience',
            equity: 'representationEquity',
            efficiency: 'decisionVelocity',
            quality: 'proposalQuality',
            trust: 'crossGroupTrust',
            opportunity: 'alignmentOpportunity',
            criticality: 'timelineCriticality'
        }
    },
    {
        number: 78,
        capabilityId: 'debate_mediator_fact_checker',
        evaluate: 'mediateDebateAndFactCheck',
        toTasks: 'debateMediationToTasks',
        className: 'DebateMediatorFactChecker',
        collectionField: 'debates',
        idField: 'debateId',
        signalFields: {
            demand: 'debateVolume',
            capacity: 'moderationCapacity',
            risk: 'misinformationRisk',
            impact: 'publicImpact',
            readiness: 'briefingReadiness',
            resilience: 'dialogueResilience',
            equity: 'voiceBalance',
            efficiency: 'resolutionEfficiency',
            quality: 'evidenceQuality',
            trust: 'participantTrust',
            opportunity: 'learningOpportunity',
            criticality: 'urgency'
        }
    },
    {
        number: 79,
        capabilityId: 'uncertainty_communication_composer',
        evaluate: 'composeUncertaintyCommunication',
        toTasks: 'uncertaintyCommunicationToTasks',
        className: 'UncertaintyCommunicationComposer',
        collectionField: 'findings',
        idField: 'findingId',
        signalFields: {
            demand: 'audienceDemand',
            capacity: 'communicationCapacity',
            risk: 'misinterpretationRisk',
            impact: 'decisionImpact',
            readiness: 'messageReadiness',
            resilience: 'feedbackResilience',
            equity: 'accessibilityEquity',
            efficiency: 'deliveryEfficiency',
            quality: 'clarityQuality',
            trust: 'audienceTrust',
            opportunity: 'learningOpportunity',
            criticality: 'urgency'
        }
    }
];

const stressedDefaults = {
    demand: 84,
    capacity: 36,
    risk: 78,
    impact: 88,
    readiness: 42,
    resilience: 40,
    equity: 52,
    efficiency: 45,
    quality: 50,
    trust: 44,
    opportunity: 80,
    criticality: 86
};

const healthyDefaults = {
    demand: 42,
    capacity: 84,
    risk: 24,
    impact: 64,
    readiness: 82,
    resilience: 86,
    equity: 74,
    efficiency: 80,
    quality: 78,
    trust: 82,
    opportunity: 62,
    criticality: 40
};

function buildEntity(capability, id, profile = stressedDefaults, overrides = {}) {
    const entity = {
        [capability.idField]: id,
        name: `Entity ${id}`
    };

    for (const [signalKey, fieldName] of Object.entries(capability.signalFields)) {
        entity[fieldName] = profile[signalKey];
    }

    return {
        ...entity,
        ...overrides
    };
}

for (const [index, capability] of capabilities.entries()) {
    test(`${capability.number} ${capability.capabilityId} generates capability report`, () => {
        const evaluate = swarm[capability.evaluate];
        assert.equal(typeof evaluate, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability, `${capability.number}-a`, stressedDefaults),
                buildEntity(capability, `${capability.number}-b`, healthyDefaults)
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 12,
                reviewHours: 5
            }
        };

        const report = evaluate(payload, {
            now: () => 1_760_000 + index
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
        const evaluate = swarm[capability.evaluate];
        const toTasks = swarm[capability.toTasks];
        const ManagerClass = swarm[capability.className];

        assert.equal(typeof toTasks, 'function');
        assert.equal(typeof ManagerClass, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability, `${capability.number}-x`, stressedDefaults),
                buildEntity(capability, `${capability.number}-y`, healthyDefaults)
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 14
            }
        };

        const report = evaluate(payload, {
            now: () => 1_790_000 + index
        });
        const tasks = toTasks(report, {
            fromAgentId: 'agent:test-runner'
        });

        assert.equal(tasks.length > 0, true);
        assert.equal(tasks[0].kind, 'task_request');
        assert.equal(tasks[0].from, 'agent:test-runner');

        const manager = new ManagerClass({
            localAgentId: 'agent:manager-local',
            now: () => 1_800_000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
