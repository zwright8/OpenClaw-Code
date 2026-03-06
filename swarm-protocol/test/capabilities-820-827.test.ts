import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InclusionSemanticRetrievalRanker,
    inclusionSemanticRetrievalRankerToTasks,
    rankInclusionSemanticRetrieval
} from '../src/inclusion-semantic-retrieval-ranker.js';
import {
    InclusionPlanQualityEvaluator,
    evaluateInclusionPlanQuality,
    inclusionPlanQualityEvaluatorToTasks
} from '../src/inclusion-plan-quality-evaluator.js';
import {
    InclusionMultiAgentNegotiationMediator,
    inclusionMultiAgentNegotiationMediatorToTasks,
    mediateInclusionMultiAgentNegotiation
} from '../src/inclusion-multi-agent-negotiation-mediator.js';
import {
    InclusionConflictResolutionCoach,
    coachInclusionConflictResolution,
    inclusionConflictResolutionCoachToTasks
} from '../src/inclusion-conflict-resolution-coach.js';
import {
    InclusionExplainabilityNarrativeBuilder,
    buildInclusionExplainabilityNarratives,
    inclusionExplainabilityNarrativeBuilderToTasks
} from '../src/inclusion-explainability-narrative-builder.js';
import {
    InclusionUncertaintyCommunicator,
    communicateInclusionUncertainty,
    inclusionUncertaintyCommunicatorToTasks
} from '../src/inclusion-uncertainty-communicator.js';
import {
    InclusionExperimentDesignGenerator,
    generateInclusionExperimentDesigns,
    inclusionExperimentDesignGeneratorToTasks
} from '../src/inclusion-experiment-design-generator.js';
import {
    InclusionAbRolloutGovernor,
    governInclusionAbRollouts,
    inclusionAbRolloutGovernorToTasks
} from '../src/inclusion-ab-rollout-governor.js';

const capabilities = [
    {
        number: 820,
        capabilityId: 'inclusion_semantic_retrieval_ranker',
        evaluate: rankInclusionSemanticRetrieval,
        toTasks: inclusionSemanticRetrievalRankerToTasks,
        classRef: InclusionSemanticRetrievalRanker,
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 821,
        capabilityId: 'inclusion_plan_quality_evaluator',
        evaluate: evaluateInclusionPlanQuality,
        toTasks: inclusionPlanQualityEvaluatorToTasks,
        classRef: InclusionPlanQualityEvaluator,
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 822,
        capabilityId: 'inclusion_multi_agent_negotiation_mediator',
        evaluate: mediateInclusionMultiAgentNegotiation,
        toTasks: inclusionMultiAgentNegotiationMediatorToTasks,
        classRef: InclusionMultiAgentNegotiationMediator,
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 823,
        capabilityId: 'inclusion_conflict_resolution_coach',
        evaluate: coachInclusionConflictResolution,
        toTasks: inclusionConflictResolutionCoachToTasks,
        classRef: InclusionConflictResolutionCoach,
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 824,
        capabilityId: 'inclusion_explainability_narrative_builder',
        evaluate: buildInclusionExplainabilityNarratives,
        toTasks: inclusionExplainabilityNarrativeBuilderToTasks,
        classRef: InclusionExplainabilityNarrativeBuilder,
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 825,
        capabilityId: 'inclusion_uncertainty_communicator',
        evaluate: communicateInclusionUncertainty,
        toTasks: inclusionUncertaintyCommunicatorToTasks,
        classRef: InclusionUncertaintyCommunicator,
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 826,
        capabilityId: 'inclusion_experiment_design_generator',
        evaluate: generateInclusionExperimentDesigns,
        toTasks: inclusionExperimentDesignGeneratorToTasks,
        classRef: InclusionExperimentDesignGenerator,
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 827,
        capabilityId: 'inclusion_ab_rollout_governor',
        evaluate: governInclusionAbRollouts,
        toTasks: inclusionAbRolloutGovernorToTasks,
        classRef: InclusionAbRolloutGovernor,
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
            now: () => 8200000 + index
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
            now: () => 8210000 + index
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
            now: () => 3300000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
