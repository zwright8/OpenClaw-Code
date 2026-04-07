import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 244,
        capabilityId: 'collab_contradiction_detector',
        evaluate: 'detectCollabContradictions',
        toTasks: 'collabContradictionDetectorToTasks',
        className: 'CollabContradictionDetector',
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 245,
        capabilityId: 'collab_confidence_calibration_engine',
        evaluate: 'calibrateCollabConfidence',
        toTasks: 'collabConfidenceCalibrationEngineToTasks',
        className: 'CollabConfidenceCalibrationEngine',
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 246,
        capabilityId: 'collab_counterfactual_simulator',
        evaluate: 'simulateCollabCounterfactuals',
        toTasks: 'collabCounterfactualSimulatorToTasks',
        className: 'CollabCounterfactualSimulator',
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 247,
        capabilityId: 'collab_goal_decomposer',
        evaluate: 'decomposeCollabGoals',
        toTasks: 'collabGoalDecomposerToTasks',
        className: 'CollabGoalDecomposer',
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 248,
        capabilityId: 'collab_dependency_dag_planner',
        evaluate: 'planCollabDependencyDag',
        toTasks: 'collabDependencyDagPlannerToTasks',
        className: 'CollabDependencyDagPlanner',
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 249,
        capabilityId: 'collab_resource_budget_allocator',
        evaluate: 'allocateCollabResourceBudgets',
        toTasks: 'collabResourceBudgetAllocatorToTasks',
        className: 'CollabResourceBudgetAllocator',
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 250,
        capabilityId: 'collab_risk_aware_scheduler',
        evaluate: 'scheduleCollabRiskAware',
        toTasks: 'collabRiskAwareSchedulerToTasks',
        className: 'CollabRiskAwareScheduler',
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 251,
        capabilityId: 'collab_policy_constraint_compiler',
        evaluate: 'compileCollabPolicyConstraints',
        toTasks: 'collabPolicyConstraintCompilerToTasks',
        className: 'CollabPolicyConstraintCompiler',
        collectionField: 'policyRules',
        idField: 'ruleId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 89,
        capacity: 38,
        risk: 84,
        impact: 88,
        readiness: 47,
        resilience: 30,
        equity: 60,
        efficiency: 54,
        quality: 62,
        trust: 55,
        opportunity: 87,
        criticality: 100,
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
                    demand: 41,
                    capacity: 99,
                    risk: 12,
                    readiness: 94,
                    resilience: 97,
                    trust: 95,
                    quality: 92,
                    efficiency: 89,
                    criticality: 36
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 25,
                reviewHours: 14
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2150000 + index
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
                    demand: 45,
                    capacity: 101,
                    risk: 10,
                    readiness: 96,
                    resilience: 98,
                    trust: 97,
                    quality: 94,
                    efficiency: 91,
                    criticality: 34
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 56,
                reviewHours: 27
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2160000 + index
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
            now: () => 2170000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
