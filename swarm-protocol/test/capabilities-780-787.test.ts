import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CulturalSemanticRetrievalRanker,
    culturalSemanticRetrievalRankerToTasks,
    rankCulturalSemanticRetrieval
} from '../src/cultural-semantic-retrieval-ranker.js';
import {
    CulturalPlanQualityEvaluator,
    culturalPlanQualityEvaluatorToTasks,
    evaluateCulturalPlanQuality
} from '../src/cultural-plan-quality-evaluator.js';
import {
    CulturalMultiAgentNegotiationMediator,
    culturalMultiAgentNegotiationMediatorToTasks,
    mediateCulturalMultiAgentNegotiation
} from '../src/cultural-multi-agent-negotiation-mediator.js';
import {
    CulturalConflictResolutionCoach,
    coachCulturalConflictResolution,
    culturalConflictResolutionCoachToTasks
} from '../src/cultural-conflict-resolution-coach.js';
import {
    CulturalExplainabilityNarrativeBuilder,
    buildCulturalExplainabilityNarratives,
    culturalExplainabilityNarrativeBuilderToTasks
} from '../src/cultural-explainability-narrative-builder.js';
import {
    CulturalUncertaintyCommunicator,
    communicateCulturalUncertainty,
    culturalUncertaintyCommunicatorToTasks
} from '../src/cultural-uncertainty-communicator.js';
import {
    CulturalExperimentDesignGenerator,
    culturalExperimentDesignGeneratorToTasks,
    generateCulturalExperimentDesigns
} from '../src/cultural-experiment-design-generator.js';
import {
    CulturalAbRolloutGovernor,
    culturalAbRolloutGovernorToTasks,
    governCulturalAbRollouts
} from '../src/cultural-ab-rollout-governor.js';

const capabilities = [
    {
        number: 780,
        capabilityId: 'cultural_semantic_retrieval_ranker',
        evaluate: rankCulturalSemanticRetrieval,
        toTasks: culturalSemanticRetrievalRankerToTasks,
        classRef: CulturalSemanticRetrievalRanker,
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 781,
        capabilityId: 'cultural_plan_quality_evaluator',
        evaluate: evaluateCulturalPlanQuality,
        toTasks: culturalPlanQualityEvaluatorToTasks,
        classRef: CulturalPlanQualityEvaluator,
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 782,
        capabilityId: 'cultural_multi_agent_negotiation_mediator',
        evaluate: mediateCulturalMultiAgentNegotiation,
        toTasks: culturalMultiAgentNegotiationMediatorToTasks,
        classRef: CulturalMultiAgentNegotiationMediator,
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 783,
        capabilityId: 'cultural_conflict_resolution_coach',
        evaluate: coachCulturalConflictResolution,
        toTasks: culturalConflictResolutionCoachToTasks,
        classRef: CulturalConflictResolutionCoach,
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 784,
        capabilityId: 'cultural_explainability_narrative_builder',
        evaluate: buildCulturalExplainabilityNarratives,
        toTasks: culturalExplainabilityNarrativeBuilderToTasks,
        classRef: CulturalExplainabilityNarrativeBuilder,
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 785,
        capabilityId: 'cultural_uncertainty_communicator',
        evaluate: communicateCulturalUncertainty,
        toTasks: culturalUncertaintyCommunicatorToTasks,
        classRef: CulturalUncertaintyCommunicator,
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 786,
        capabilityId: 'cultural_experiment_design_generator',
        evaluate: generateCulturalExperimentDesigns,
        toTasks: culturalExperimentDesignGeneratorToTasks,
        classRef: CulturalExperimentDesignGenerator,
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 787,
        capabilityId: 'cultural_ab_rollout_governor',
        evaluate: governCulturalAbRollouts,
        toTasks: culturalAbRolloutGovernorToTasks,
        classRef: CulturalAbRolloutGovernor,
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
            now: () => 7800000 + index
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
            now: () => 7810000 + index
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
            now: () => 2800000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
