import test from 'node:test';
import assert from 'node:assert/strict';
import {
    RightsSemanticRetrievalRanker,
    rankRightsSemanticRetrieval,
    rightsSemanticRetrievalRankerToTasks
} from '../src/rights-semantic-retrieval-ranker.js';
import {
    RightsPlanQualityEvaluator,
    evaluateRightsPlanQuality,
    rightsPlanQualityEvaluatorToTasks
} from '../src/rights-plan-quality-evaluator.js';
import {
    RightsMultiAgentNegotiationMediator,
    mediateRightsMultiAgentNegotiation,
    rightsMultiAgentNegotiationMediatorToTasks
} from '../src/rights-multi-agent-negotiation-mediator.js';
import {
    RightsConflictResolutionCoach,
    coachRightsConflictResolution,
    rightsConflictResolutionCoachToTasks
} from '../src/rights-conflict-resolution-coach.js';
import {
    RightsExplainabilityNarrativeBuilder,
    buildRightsExplainabilityNarratives,
    rightsExplainabilityNarrativeBuilderToTasks
} from '../src/rights-explainability-narrative-builder.js';
import {
    RightsUncertaintyCommunicator,
    communicateRightsUncertainty,
    rightsUncertaintyCommunicatorToTasks
} from '../src/rights-uncertainty-communicator.js';
import {
    RightsExperimentDesignGenerator,
    generateRightsExperimentDesigns,
    rightsExperimentDesignGeneratorToTasks
} from '../src/rights-experiment-design-generator.js';
import {
    RightsAbRolloutGovernor,
    governRightsAbRollouts,
    rightsAbRolloutGovernorToTasks
} from '../src/rights-ab-rollout-governor.js';

const capabilities = [
    {
        number: 900,
        capabilityId: 'rights_semantic_retrieval_ranker',
        evaluate: rankRightsSemanticRetrieval,
        toTasks: rightsSemanticRetrievalRankerToTasks,
        classRef: RightsSemanticRetrievalRanker,
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 901,
        capabilityId: 'rights_plan_quality_evaluator',
        evaluate: evaluateRightsPlanQuality,
        toTasks: rightsPlanQualityEvaluatorToTasks,
        classRef: RightsPlanQualityEvaluator,
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 902,
        capabilityId: 'rights_multi_agent_negotiation_mediator',
        evaluate: mediateRightsMultiAgentNegotiation,
        toTasks: rightsMultiAgentNegotiationMediatorToTasks,
        classRef: RightsMultiAgentNegotiationMediator,
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 903,
        capabilityId: 'rights_conflict_resolution_coach',
        evaluate: coachRightsConflictResolution,
        toTasks: rightsConflictResolutionCoachToTasks,
        classRef: RightsConflictResolutionCoach,
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 904,
        capabilityId: 'rights_explainability_narrative_builder',
        evaluate: buildRightsExplainabilityNarratives,
        toTasks: rightsExplainabilityNarrativeBuilderToTasks,
        classRef: RightsExplainabilityNarrativeBuilder,
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 905,
        capabilityId: 'rights_uncertainty_communicator',
        evaluate: communicateRightsUncertainty,
        toTasks: rightsUncertaintyCommunicatorToTasks,
        classRef: RightsUncertaintyCommunicator,
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 906,
        capabilityId: 'rights_experiment_design_generator',
        evaluate: generateRightsExperimentDesigns,
        toTasks: rightsExperimentDesignGeneratorToTasks,
        classRef: RightsExperimentDesignGenerator,
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 907,
        capabilityId: 'rights_ab_rollout_governor',
        evaluate: governRightsAbRollouts,
        toTasks: rightsAbRolloutGovernorToTasks,
        classRef: RightsAbRolloutGovernor,
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
            now: () => 9000000 + index
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
            now: () => 9010000 + index
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
            now: () => 4300000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
