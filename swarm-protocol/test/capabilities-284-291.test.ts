import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 284,
        capabilityId: 'federation_contradiction_detector',
        evaluate: 'detectFederationContradictions',
        toTasks: 'federationContradictionDetectorToTasks',
        className: 'FederationContradictionDetector',
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 285,
        capabilityId: 'federation_confidence_calibration_engine',
        evaluate: 'calibrateFederationConfidence',
        toTasks: 'federationConfidenceCalibrationEngineToTasks',
        className: 'FederationConfidenceCalibrationEngine',
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 286,
        capabilityId: 'federation_counterfactual_simulator',
        evaluate: 'simulateFederationCounterfactuals',
        toTasks: 'federationCounterfactualSimulatorToTasks',
        className: 'FederationCounterfactualSimulator',
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 287,
        capabilityId: 'federation_goal_decomposer',
        evaluate: 'decomposeFederationGoals',
        toTasks: 'federationGoalDecomposerToTasks',
        className: 'FederationGoalDecomposer',
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 288,
        capabilityId: 'federation_dependency_dag_planner',
        evaluate: 'planFederationDependencyDag',
        toTasks: 'federationDependencyDagPlannerToTasks',
        className: 'FederationDependencyDagPlanner',
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 289,
        capabilityId: 'federation_resource_budget_allocator',
        evaluate: 'allocateFederationResourceBudgets',
        toTasks: 'federationResourceBudgetAllocatorToTasks',
        className: 'FederationResourceBudgetAllocator',
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 290,
        capabilityId: 'federation_risk_aware_scheduler',
        evaluate: 'scheduleFederationRiskAware',
        toTasks: 'federationRiskAwareSchedulerToTasks',
        className: 'FederationRiskAwareScheduler',
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 291,
        capabilityId: 'federation_policy_constraint_compiler',
        evaluate: 'compileFederationPolicyConstraints',
        toTasks: 'federationPolicyConstraintCompilerToTasks',
        className: 'FederationPolicyConstraintCompiler',
        collectionField: 'policyRules',
        idField: 'ruleId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 95,
        capacity: 32,
        risk: 90,
        impact: 94,
        readiness: 42,
        resilience: 24,
        equity: 66,
        efficiency: 59,
        quality: 68,
        trust: 61,
        opportunity: 93,
        criticality: 105,
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
                    demand: 36,
                    capacity: 111,
                    risk: 3,
                    readiness: 103,
                    resilience: 105,
                    trust: 104,
                    quality: 101,
                    efficiency: 98,
                    criticality: 27
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 30,
                reviewHours: 19
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2300000 + index
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
                    demand: 40,
                    capacity: 112,
                    risk: 2,
                    readiness: 104,
                    resilience: 106,
                    trust: 105,
                    quality: 102,
                    efficiency: 99,
                    criticality: 26
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 66,
                reviewHours: 33
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2310000 + index
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
            now: () => 2320000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
