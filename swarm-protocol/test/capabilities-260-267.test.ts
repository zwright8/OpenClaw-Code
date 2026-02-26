import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 260,
        capabilityId: 'collab_semantic_retrieval_ranker',
        evaluate: 'rankCollabSemanticRetrieval',
        toTasks: 'collabSemanticRetrievalRankerToTasks',
        className: 'CollabSemanticRetrievalRanker',
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 261,
        capabilityId: 'collab_plan_quality_evaluator',
        evaluate: 'evaluateCollabPlanQuality',
        toTasks: 'collabPlanQualityEvaluatorToTasks',
        className: 'CollabPlanQualityEvaluator',
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 262,
        capabilityId: 'collab_multi_agent_negotiation_mediator',
        evaluate: 'mediateCollabMultiAgentNegotiation',
        toTasks: 'collabMultiAgentNegotiationMediatorToTasks',
        className: 'CollabMultiAgentNegotiationMediator',
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 263,
        capabilityId: 'collab_conflict_resolution_coach',
        evaluate: 'coachCollabConflictResolution',
        toTasks: 'collabConflictResolutionCoachToTasks',
        className: 'CollabConflictResolutionCoach',
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 264,
        capabilityId: 'collab_explainability_narrative_builder',
        evaluate: 'buildCollabExplainabilityNarratives',
        toTasks: 'collabExplainabilityNarrativeBuilderToTasks',
        className: 'CollabExplainabilityNarrativeBuilder',
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 265,
        capabilityId: 'collab_uncertainty_communicator',
        evaluate: 'communicateCollabUncertainty',
        toTasks: 'collabUncertaintyCommunicatorToTasks',
        className: 'CollabUncertaintyCommunicator',
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 266,
        capabilityId: 'collab_experiment_design_generator',
        evaluate: 'generateCollabExperimentDesigns',
        toTasks: 'collabExperimentDesignGeneratorToTasks',
        className: 'CollabExperimentDesignGenerator',
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 267,
        capabilityId: 'collab_ab_rollout_governor',
        evaluate: 'governCollabAbRollouts',
        toTasks: 'collabAbRolloutGovernorToTasks',
        className: 'CollabAbRolloutGovernor',
        collectionField: 'rollouts',
        idField: 'rolloutId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 92,
        capacity: 35,
        risk: 87,
        impact: 91,
        readiness: 45,
        resilience: 27,
        equity: 63,
        efficiency: 56,
        quality: 65,
        trust: 58,
        opportunity: 90,
        criticality: 102,
        ...overrides
    };
}

for (const [index, capability] of capabilities.entries()) {
    test(`${capability.number} ${capability.capabilityId} generates capability report`, () => {
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        assert.equal(typeof evaluate, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, `${capability.number}-a`),
                buildEntity(capability.idField, `${capability.number}-b`, {
                    demand: 39,
                    capacity: 104,
                    risk: 10,
                    readiness: 96,
                    resilience: 99,
                    trust: 97,
                    quality: 94,
                    efficiency: 91,
                    criticality: 34
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 27,
                reviewHours: 16
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2210000 + index
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
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        const toTasks = swarm[capability.toTasks as keyof typeof swarm];
        const ManagerClass = swarm[capability.className as keyof typeof swarm];

        assert.equal(typeof evaluate, 'function');
        assert.equal(typeof toTasks, 'function');
        assert.equal(typeof ManagerClass, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, `${capability.number}-x`),
                buildEntity(capability.idField, `${capability.number}-y`, {
                    demand: 43,
                    capacity: 106,
                    risk: 8,
                    readiness: 98,
                    resilience: 100,
                    trust: 99,
                    quality: 96,
                    efficiency: 93,
                    criticality: 32
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 60,
                reviewHours: 30
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2220000 + index
        });
        const tasks = (toTasks as (reportPayload: unknown, options: unknown) => any[])(report, {
            fromAgentId: 'agent:test-runner'
        });

        assert.equal(tasks.length > 0, true);
        assert.equal(tasks[0].kind, 'task_request');
        assert.equal(tasks[0].from, 'agent:test-runner');

        const ManagerCtor = ManagerClass as new (options: unknown) => {
            evaluate: (input: unknown) => any;
            buildTasks: (reportPayload: unknown) => any[];
            listHistory: (options: { limit: number }) => unknown[];
        };
        const manager = new ManagerCtor({
            localAgentId: 'agent:manager-local',
            now: () => 2230000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
