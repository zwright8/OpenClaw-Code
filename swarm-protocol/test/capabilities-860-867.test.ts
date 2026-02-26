import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CommunitySemanticRetrievalRanker,
    communitySemanticRetrievalRankerToTasks,
    rankCommunitySemanticRetrieval
} from '../src/community-semantic-retrieval-ranker.js';
import {
    CommunityPlanQualityEvaluator,
    communityPlanQualityEvaluatorToTasks,
    evaluateCommunityPlanQuality
} from '../src/community-plan-quality-evaluator.js';
import {
    CommunityMultiAgentNegotiationMediator,
    communityMultiAgentNegotiationMediatorToTasks,
    mediateCommunityMultiAgentNegotiation
} from '../src/community-multi-agent-negotiation-mediator.js';
import {
    CommunityConflictResolutionCoach,
    communityConflictResolutionCoachToTasks,
    coachCommunityConflictResolution
} from '../src/community-conflict-resolution-coach.js';
import {
    CommunityExplainabilityNarrativeBuilder,
    communityExplainabilityNarrativeBuilderToTasks,
    buildCommunityExplainabilityNarratives
} from '../src/community-explainability-narrative-builder.js';
import {
    CommunityUncertaintyCommunicator,
    communityUncertaintyCommunicatorToTasks,
    communicateCommunityUncertainty
} from '../src/community-uncertainty-communicator.js';
import {
    CommunityExperimentDesignGenerator,
    communityExperimentDesignGeneratorToTasks,
    generateCommunityExperimentDesigns
} from '../src/community-experiment-design-generator.js';
import {
    CommunityAbRolloutGovernor,
    communityAbRolloutGovernorToTasks,
    governCommunityAbRollouts
} from '../src/community-ab-rollout-governor.js';

const capabilities = [
    {
        number: 860,
        capabilityId: 'community_semantic_retrieval_ranker',
        evaluate: rankCommunitySemanticRetrieval,
        toTasks: communitySemanticRetrievalRankerToTasks,
        classRef: CommunitySemanticRetrievalRanker,
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 861,
        capabilityId: 'community_plan_quality_evaluator',
        evaluate: evaluateCommunityPlanQuality,
        toTasks: communityPlanQualityEvaluatorToTasks,
        classRef: CommunityPlanQualityEvaluator,
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 862,
        capabilityId: 'community_multi_agent_negotiation_mediator',
        evaluate: mediateCommunityMultiAgentNegotiation,
        toTasks: communityMultiAgentNegotiationMediatorToTasks,
        classRef: CommunityMultiAgentNegotiationMediator,
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 863,
        capabilityId: 'community_conflict_resolution_coach',
        evaluate: coachCommunityConflictResolution,
        toTasks: communityConflictResolutionCoachToTasks,
        classRef: CommunityConflictResolutionCoach,
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 864,
        capabilityId: 'community_explainability_narrative_builder',
        evaluate: buildCommunityExplainabilityNarratives,
        toTasks: communityExplainabilityNarrativeBuilderToTasks,
        classRef: CommunityExplainabilityNarrativeBuilder,
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 865,
        capabilityId: 'community_uncertainty_communicator',
        evaluate: communicateCommunityUncertainty,
        toTasks: communityUncertaintyCommunicatorToTasks,
        classRef: CommunityUncertaintyCommunicator,
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 866,
        capabilityId: 'community_experiment_design_generator',
        evaluate: generateCommunityExperimentDesigns,
        toTasks: communityExperimentDesignGeneratorToTasks,
        classRef: CommunityExperimentDesignGenerator,
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 867,
        capabilityId: 'community_ab_rollout_governor',
        evaluate: governCommunityAbRollouts,
        toTasks: communityAbRolloutGovernorToTasks,
        classRef: CommunityAbRolloutGovernor,
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
            now: () => 8600000 + index
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
            now: () => 8610000 + index
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
            now: () => 3800000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
