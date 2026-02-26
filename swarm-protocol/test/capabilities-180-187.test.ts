import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 180,
        capabilityId: 'governance_semantic_retrieval_ranker',
        evaluate: 'rankGovernanceSemanticRetrieval',
        toTasks: 'governanceSemanticRetrievalRankerToTasks',
        className: 'GovernanceSemanticRetrievalRanker',
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 181,
        capabilityId: 'governance_plan_quality_evaluator',
        evaluate: 'evaluateGovernancePlanQuality',
        toTasks: 'governancePlanQualityEvaluatorToTasks',
        className: 'GovernancePlanQualityEvaluator',
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 182,
        capabilityId: 'governance_multi_agent_negotiation_mediator',
        evaluate: 'mediateGovernanceMultiAgentNegotiation',
        toTasks: 'governanceMultiAgentNegotiationMediatorToTasks',
        className: 'GovernanceMultiAgentNegotiationMediator',
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 183,
        capabilityId: 'governance_conflict_resolution_coach',
        evaluate: 'coachGovernanceConflictResolution',
        toTasks: 'governanceConflictResolutionCoachToTasks',
        className: 'GovernanceConflictResolutionCoach',
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 184,
        capabilityId: 'governance_explainability_narrative_builder',
        evaluate: 'buildGovernanceExplainabilityNarratives',
        toTasks: 'governanceExplainabilityNarrativeBuilderToTasks',
        className: 'GovernanceExplainabilityNarrativeBuilder',
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 185,
        capabilityId: 'governance_uncertainty_communicator',
        evaluate: 'communicateGovernanceUncertainty',
        toTasks: 'governanceUncertaintyCommunicatorToTasks',
        className: 'GovernanceUncertaintyCommunicator',
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 186,
        capabilityId: 'governance_experiment_design_generator',
        evaluate: 'generateGovernanceExperimentDesigns',
        toTasks: 'governanceExperimentDesignGeneratorToTasks',
        className: 'GovernanceExperimentDesignGenerator',
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 187,
        capabilityId: 'governance_ab_rollout_governor',
        evaluate: 'governGovernanceAbRollouts',
        toTasks: 'governanceAbRolloutGovernorToTasks',
        className: 'GovernanceAbRolloutGovernor',
        collectionField: 'rollouts',
        idField: 'rolloutId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 84,
        capacity: 46,
        risk: 76,
        impact: 80,
        readiness: 40,
        resilience: 34,
        equity: 53,
        efficiency: 47,
        quality: 55,
        trust: 48,
        opportunity: 80,
        criticality: 92,
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
                    demand: 49,
                    capacity: 91,
                    risk: 20,
                    readiness: 86,
                    resilience: 89,
                    trust: 87,
                    quality: 84,
                    efficiency: 81,
                    criticality: 44
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 16,
                reviewHours: 6
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1910000 + index
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
                    demand: 53,
                    capacity: 93,
                    risk: 17,
                    readiness: 88,
                    resilience: 90,
                    trust: 89,
                    quality: 86,
                    efficiency: 83,
                    criticality: 42
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 18
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1920000 + index
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
            now: () => 1930000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
