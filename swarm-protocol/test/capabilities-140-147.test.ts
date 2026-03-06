import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 140,
        capabilityId: 'tooling_semantic_retrieval_ranker',
        evaluate: 'rankToolingSemanticRetrieval',
        toTasks: 'toolingSemanticRetrievalRankerToTasks',
        className: 'ToolingSemanticRetrievalRanker',
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 141,
        capabilityId: 'tooling_plan_quality_evaluator',
        evaluate: 'evaluateToolingPlanQuality',
        toTasks: 'toolingPlanQualityEvaluatorToTasks',
        className: 'ToolingPlanQualityEvaluator',
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 142,
        capabilityId: 'tooling_multi_agent_negotiation_mediator',
        evaluate: 'mediateToolingMultiAgentNegotiation',
        toTasks: 'toolingMultiAgentNegotiationMediatorToTasks',
        className: 'ToolingMultiAgentNegotiationMediator',
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 143,
        capabilityId: 'tooling_conflict_resolution_coach',
        evaluate: 'coachToolingConflictResolution',
        toTasks: 'toolingConflictResolutionCoachToTasks',
        className: 'ToolingConflictResolutionCoach',
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 144,
        capabilityId: 'tooling_explainability_narrative_builder',
        evaluate: 'buildToolingExplainabilityNarratives',
        toTasks: 'toolingExplainabilityNarrativeBuilderToTasks',
        className: 'ToolingExplainabilityNarrativeBuilder',
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 145,
        capabilityId: 'tooling_uncertainty_communicator',
        evaluate: 'communicateToolingUncertainty',
        toTasks: 'toolingUncertaintyCommunicatorToTasks',
        className: 'ToolingUncertaintyCommunicator',
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 146,
        capabilityId: 'tooling_experiment_design_generator',
        evaluate: 'generateToolingExperimentDesigns',
        toTasks: 'toolingExperimentDesignGeneratorToTasks',
        className: 'ToolingExperimentDesignGenerator',
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 147,
        capabilityId: 'tooling_ab_rollout_governor',
        evaluate: 'governToolingAbRollouts',
        toTasks: 'toolingAbRolloutGovernorToTasks',
        className: 'ToolingAbRolloutGovernor',
        collectionField: 'rollouts',
        idField: 'rolloutId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 79,
        capacity: 41,
        risk: 71,
        impact: 84,
        readiness: 45,
        resilience: 39,
        equity: 58,
        efficiency: 52,
        quality: 61,
        trust: 53,
        opportunity: 75,
        criticality: 86,
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
                    demand: 43,
                    capacity: 85,
                    risk: 27,
                    readiness: 79,
                    resilience: 83,
                    trust: 81,
                    quality: 77,
                    efficiency: 75,
                    criticality: 53
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 16,
                reviewHours: 6
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1760000 + index
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
                    demand: 47,
                    capacity: 87,
                    risk: 23,
                    readiness: 83,
                    resilience: 85,
                    trust: 84,
                    quality: 81,
                    efficiency: 78,
                    criticality: 48
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 18
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1770000 + index
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
            now: () => 1780000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
