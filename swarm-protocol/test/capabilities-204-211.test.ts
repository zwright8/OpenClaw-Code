import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 204,
        capabilityId: 'oversight_contradiction_detector',
        evaluate: 'detectOversightContradictions',
        toTasks: 'oversightContradictionDetectorToTasks',
        className: 'OversightContradictionDetector',
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 205,
        capabilityId: 'oversight_confidence_calibration_engine',
        evaluate: 'calibrateOversightConfidence',
        toTasks: 'oversightConfidenceCalibrationEngineToTasks',
        className: 'OversightConfidenceCalibrationEngine',
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 206,
        capabilityId: 'oversight_counterfactual_simulator',
        evaluate: 'simulateOversightCounterfactuals',
        toTasks: 'oversightCounterfactualSimulatorToTasks',
        className: 'OversightCounterfactualSimulator',
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 207,
        capabilityId: 'oversight_goal_decomposer',
        evaluate: 'decomposeOversightGoals',
        toTasks: 'oversightGoalDecomposerToTasks',
        className: 'OversightGoalDecomposer',
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 208,
        capabilityId: 'oversight_dependency_dag_planner',
        evaluate: 'planOversightDependencyDag',
        toTasks: 'oversightDependencyDagPlannerToTasks',
        className: 'OversightDependencyDagPlanner',
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 209,
        capabilityId: 'oversight_resource_budget_allocator',
        evaluate: 'allocateOversightResourceBudgets',
        toTasks: 'oversightResourceBudgetAllocatorToTasks',
        className: 'OversightResourceBudgetAllocator',
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 210,
        capabilityId: 'oversight_risk_aware_scheduler',
        evaluate: 'scheduleOversightRiskAware',
        toTasks: 'oversightRiskAwareSchedulerToTasks',
        className: 'OversightRiskAwareScheduler',
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 211,
        capabilityId: 'oversight_policy_constraint_compiler',
        evaluate: 'compileOversightPolicyConstraints',
        toTasks: 'oversightPolicyConstraintCompilerToTasks',
        className: 'OversightPolicyConstraintCompiler',
        collectionField: 'policyRules',
        idField: 'ruleId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 84,
        capacity: 43,
        risk: 79,
        impact: 83,
        readiness: 42,
        resilience: 35,
        equity: 55,
        efficiency: 49,
        quality: 57,
        trust: 50,
        opportunity: 82,
        criticality: 95,
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
                    demand: 46,
                    capacity: 94,
                    risk: 17,
                    readiness: 89,
                    resilience: 92,
                    trust: 90,
                    quality: 87,
                    efficiency: 84,
                    criticality: 41
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 20,
                reviewHours: 9
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2000000 + index
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
                    demand: 50,
                    capacity: 96,
                    risk: 15,
                    readiness: 91,
                    resilience: 93,
                    trust: 92,
                    quality: 89,
                    efficiency: 86,
                    criticality: 39
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 46,
                reviewHours: 22
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2010000 + index
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
            now: () => 2020000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
