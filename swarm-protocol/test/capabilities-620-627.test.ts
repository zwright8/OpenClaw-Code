import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 620,
        capabilityId: 'security_semantic_retrieval_ranker',
        evaluate: 'rankSecuritySemanticRetrieval',
        toTasks: 'securitySemanticRetrievalRankerToTasks',
        className: 'SecuritySemanticRetrievalRanker',
        collectionField: 'retrievalSets',
        idField: 'retrievalId'
    },
    {
        number: 621,
        capabilityId: 'security_plan_quality_evaluator',
        evaluate: 'evaluateSecurityPlanQuality',
        toTasks: 'securityPlanQualityEvaluatorToTasks',
        className: 'SecurityPlanQualityEvaluator',
        collectionField: 'plans',
        idField: 'planId'
    },
    {
        number: 622,
        capabilityId: 'security_multi_agent_negotiation_mediator',
        evaluate: 'mediateSecurityMultiAgentNegotiation',
        toTasks: 'securityMultiAgentNegotiationMediatorToTasks',
        className: 'SecurityMultiAgentNegotiationMediator',
        collectionField: 'negotiations',
        idField: 'negotiationId'
    },
    {
        number: 623,
        capabilityId: 'security_conflict_resolution_coach',
        evaluate: 'coachSecurityConflictResolution',
        toTasks: 'securityConflictResolutionCoachToTasks',
        className: 'SecurityConflictResolutionCoach',
        collectionField: 'conflicts',
        idField: 'conflictId'
    },
    {
        number: 624,
        capabilityId: 'security_explainability_narrative_builder',
        evaluate: 'buildSecurityExplainabilityNarratives',
        toTasks: 'securityExplainabilityNarrativeBuilderToTasks',
        className: 'SecurityExplainabilityNarrativeBuilder',
        collectionField: 'decisions',
        idField: 'decisionId'
    },
    {
        number: 625,
        capabilityId: 'security_uncertainty_communicator',
        evaluate: 'communicateSecurityUncertainty',
        toTasks: 'securityUncertaintyCommunicatorToTasks',
        className: 'SecurityUncertaintyCommunicator',
        collectionField: 'briefings',
        idField: 'briefingId'
    },
    {
        number: 626,
        capabilityId: 'security_experiment_design_generator',
        evaluate: 'generateSecurityExperimentDesigns',
        toTasks: 'securityExperimentDesignGeneratorToTasks',
        className: 'SecurityExperimentDesignGenerator',
        collectionField: 'experiments',
        idField: 'experimentId'
    },
    {
        number: 627,
        capabilityId: 'security_ab_rollout_governor',
        evaluate: 'governSecurityAbRollouts',
        toTasks: 'securityAbRolloutGovernorToTasks',
        className: 'SecurityAbRolloutGovernor',
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
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        assert.equal(typeof evaluate, 'function');

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

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 6200000 + index
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

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 6210000 + index
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
            now: () => 2360000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
