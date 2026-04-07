import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 220,
        capabilityId: 'oversight_semantic_retrieval_ranker',
        evaluate: 'rankOversightSemanticRetrieval',
        toTasks: 'oversightSemanticRetrievalRankerToTasks',
        className: 'OversightSemanticRetrievalRanker',
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 221,
        capabilityId: 'oversight_plan_quality_evaluator',
        evaluate: 'evaluateOversightPlanQuality',
        toTasks: 'oversightPlanQualityEvaluatorToTasks',
        className: 'OversightPlanQualityEvaluator',
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 222,
        capabilityId: 'oversight_multi_agent_negotiation_mediator',
        evaluate: 'mediateOversightMultiAgentNegotiation',
        toTasks: 'oversightMultiAgentNegotiationMediatorToTasks',
        className: 'OversightMultiAgentNegotiationMediator',
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 223,
        capabilityId: 'oversight_conflict_resolution_coach',
        evaluate: 'coachOversightConflictResolution',
        toTasks: 'oversightConflictResolutionCoachToTasks',
        className: 'OversightConflictResolutionCoach',
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 224,
        capabilityId: 'oversight_explainability_narrative_builder',
        evaluate: 'buildOversightExplainabilityNarratives',
        toTasks: 'oversightExplainabilityNarrativeBuilderToTasks',
        className: 'OversightExplainabilityNarrativeBuilder',
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 225,
        capabilityId: 'oversight_uncertainty_communicator',
        evaluate: 'communicateOversightUncertainty',
        toTasks: 'oversightUncertaintyCommunicatorToTasks',
        className: 'OversightUncertaintyCommunicator',
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 226,
        capabilityId: 'oversight_experiment_design_generator',
        evaluate: 'generateOversightExperimentDesigns',
        toTasks: 'oversightExperimentDesignGeneratorToTasks',
        className: 'OversightExperimentDesignGenerator',
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 227,
        capabilityId: 'oversight_ab_rollout_governor',
        evaluate: 'governOversightAbRollouts',
        toTasks: 'oversightAbRolloutGovernorToTasks',
        className: 'OversightAbRolloutGovernor',
        collectionField: 'rollouts',
        idField: 'rolloutId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 86,
        capacity: 41,
        risk: 81,
        impact: 85,
        readiness: 44,
        resilience: 33,
        equity: 57,
        efficiency: 51,
        quality: 59,
        trust: 52,
        opportunity: 84,
        criticality: 97,
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
                    demand: 44,
                    capacity: 96,
                    risk: 15,
                    readiness: 91,
                    resilience: 94,
                    trust: 92,
                    quality: 89,
                    efficiency: 86,
                    criticality: 39
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 22,
                reviewHours: 11
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2060000 + index
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
                    demand: 48,
                    capacity: 98,
                    risk: 13,
                    readiness: 93,
                    resilience: 95,
                    trust: 94,
                    quality: 91,
                    efficiency: 88,
                    criticality: 37
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 50,
                reviewHours: 24
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2070000 + index
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
            now: () => 2080000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
