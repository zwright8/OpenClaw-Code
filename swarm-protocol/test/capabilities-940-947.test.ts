import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InfraSemanticRetrievalRanker,
    infraSemanticRetrievalRankerToTasks,
    rankInfraSemanticRetrieval
} from '../src/infra-semantic-retrieval-ranker.js';
import {
    InfraPlanQualityEvaluator,
    evaluateInfraPlanQuality,
    infraPlanQualityEvaluatorToTasks
} from '../src/infra-plan-quality-evaluator.js';
import {
    InfraMultiAgentNegotiationMediator,
    infraMultiAgentNegotiationMediatorToTasks,
    mediateInfraMultiAgentNegotiation
} from '../src/infra-multi-agent-negotiation-mediator.js';
import {
    InfraConflictResolutionCoach,
    coachInfraConflictResolution,
    infraConflictResolutionCoachToTasks
} from '../src/infra-conflict-resolution-coach.js';
import {
    InfraExplainabilityNarrativeBuilder,
    buildInfraExplainabilityNarratives,
    infraExplainabilityNarrativeBuilderToTasks
} from '../src/infra-explainability-narrative-builder.js';
import {
    InfraUncertaintyCommunicator,
    communicateInfraUncertainty,
    infraUncertaintyCommunicatorToTasks
} from '../src/infra-uncertainty-communicator.js';
import {
    InfraExperimentDesignGenerator,
    generateInfraExperimentDesigns,
    infraExperimentDesignGeneratorToTasks
} from '../src/infra-experiment-design-generator.js';
import {
    InfraAbRolloutGovernor,
    governInfraAbRollouts,
    infraAbRolloutGovernorToTasks
} from '../src/infra-ab-rollout-governor.js';

const capabilities = [
    {
        number: 940,
        capabilityId: 'infra_semantic_retrieval_ranker',
        evaluate: rankInfraSemanticRetrieval,
        toTasks: infraSemanticRetrievalRankerToTasks,
        classRef: InfraSemanticRetrievalRanker,
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 941,
        capabilityId: 'infra_plan_quality_evaluator',
        evaluate: evaluateInfraPlanQuality,
        toTasks: infraPlanQualityEvaluatorToTasks,
        classRef: InfraPlanQualityEvaluator,
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 942,
        capabilityId: 'infra_multi_agent_negotiation_mediator',
        evaluate: mediateInfraMultiAgentNegotiation,
        toTasks: infraMultiAgentNegotiationMediatorToTasks,
        classRef: InfraMultiAgentNegotiationMediator,
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 943,
        capabilityId: 'infra_conflict_resolution_coach',
        evaluate: coachInfraConflictResolution,
        toTasks: infraConflictResolutionCoachToTasks,
        classRef: InfraConflictResolutionCoach,
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 944,
        capabilityId: 'infra_explainability_narrative_builder',
        evaluate: buildInfraExplainabilityNarratives,
        toTasks: infraExplainabilityNarrativeBuilderToTasks,
        classRef: InfraExplainabilityNarrativeBuilder,
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 945,
        capabilityId: 'infra_uncertainty_communicator',
        evaluate: communicateInfraUncertainty,
        toTasks: infraUncertaintyCommunicatorToTasks,
        classRef: InfraUncertaintyCommunicator,
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 946,
        capabilityId: 'infra_experiment_design_generator',
        evaluate: generateInfraExperimentDesigns,
        toTasks: infraExperimentDesignGeneratorToTasks,
        classRef: InfraExperimentDesignGenerator,
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 947,
        capabilityId: 'infra_ab_rollout_governor',
        evaluate: governInfraAbRollouts,
        toTasks: infraAbRolloutGovernorToTasks,
        classRef: InfraAbRolloutGovernor,
        collectionField: 'rollouts',
        idField: 'rolloutId'
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
            now: () => 9400000 + index
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
            now: () => 9410000 + index
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
            now: () => 4800000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
