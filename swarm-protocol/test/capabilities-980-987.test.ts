import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EvolutionSemanticRetrievalRanker,
    evolutionSemanticRetrievalRankerToTasks,
    rankEvolutionSemanticRetrieval
} from '../src/evolution-semantic-retrieval-ranker.js';
import {
    EvolutionPlanQualityEvaluator,
    evaluateEvolutionPlanQuality,
    evolutionPlanQualityEvaluatorToTasks
} from '../src/evolution-plan-quality-evaluator.js';
import {
    EvolutionMultiAgentNegotiationMediator,
    evolutionMultiAgentNegotiationMediatorToTasks,
    mediateEvolutionMultiAgentNegotiation
} from '../src/evolution-multi-agent-negotiation-mediator.js';
import {
    EvolutionConflictResolutionCoach,
    coachEvolutionConflictResolution,
    evolutionConflictResolutionCoachToTasks
} from '../src/evolution-conflict-resolution-coach.js';
import {
    EvolutionExplainabilityNarrativeBuilder,
    buildEvolutionExplainabilityNarratives,
    evolutionExplainabilityNarrativeBuilderToTasks
} from '../src/evolution-explainability-narrative-builder.js';
import {
    EvolutionUncertaintyCommunicator,
    communicateEvolutionUncertainty,
    evolutionUncertaintyCommunicatorToTasks
} from '../src/evolution-uncertainty-communicator.js';
import {
    EvolutionExperimentDesignGenerator,
    evolutionExperimentDesignGeneratorToTasks,
    generateEvolutionExperimentDesigns
} from '../src/evolution-experiment-design-generator.js';
import {
    EvolutionAbRolloutGovernor,
    evolutionAbRolloutGovernorToTasks,
    governEvolutionAbRollouts
} from '../src/evolution-ab-rollout-governor.js';

const capabilities = [
    {
        number: 980,
        capabilityId: 'evolution_semantic_retrieval_ranker',
        evaluate: rankEvolutionSemanticRetrieval,
        toTasks: evolutionSemanticRetrievalRankerToTasks,
        classRef: EvolutionSemanticRetrievalRanker,
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 981,
        capabilityId: 'evolution_plan_quality_evaluator',
        evaluate: evaluateEvolutionPlanQuality,
        toTasks: evolutionPlanQualityEvaluatorToTasks,
        classRef: EvolutionPlanQualityEvaluator,
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 982,
        capabilityId: 'evolution_multi_agent_negotiation_mediator',
        evaluate: mediateEvolutionMultiAgentNegotiation,
        toTasks: evolutionMultiAgentNegotiationMediatorToTasks,
        classRef: EvolutionMultiAgentNegotiationMediator,
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 983,
        capabilityId: 'evolution_conflict_resolution_coach',
        evaluate: coachEvolutionConflictResolution,
        toTasks: evolutionConflictResolutionCoachToTasks,
        classRef: EvolutionConflictResolutionCoach,
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 984,
        capabilityId: 'evolution_explainability_narrative_builder',
        evaluate: buildEvolutionExplainabilityNarratives,
        toTasks: evolutionExplainabilityNarrativeBuilderToTasks,
        classRef: EvolutionExplainabilityNarrativeBuilder,
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 985,
        capabilityId: 'evolution_uncertainty_communicator',
        evaluate: communicateEvolutionUncertainty,
        toTasks: evolutionUncertaintyCommunicatorToTasks,
        classRef: EvolutionUncertaintyCommunicator,
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 986,
        capabilityId: 'evolution_experiment_design_generator',
        evaluate: generateEvolutionExperimentDesigns,
        toTasks: evolutionExperimentDesignGeneratorToTasks,
        classRef: EvolutionExperimentDesignGenerator,
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 987,
        capabilityId: 'evolution_ab_rollout_governor',
        evaluate: governEvolutionAbRollouts,
        toTasks: evolutionAbRolloutGovernorToTasks,
        classRef: EvolutionAbRolloutGovernor,
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
            now: () => 9800000 + index
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
            now: () => 9810000 + index
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
            now: () => 5300000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
