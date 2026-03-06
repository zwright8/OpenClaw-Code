import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 164,
        capabilityId: 'governance_contradiction_detector',
        evaluate: 'detectGovernanceContradictions',
        toTasks: 'governanceContradictionDetectorToTasks',
        className: 'GovernanceContradictionDetector',
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 165,
        capabilityId: 'governance_confidence_calibration_engine',
        evaluate: 'calibrateGovernanceConfidence',
        toTasks: 'governanceConfidenceCalibrationEngineToTasks',
        className: 'GovernanceConfidenceCalibrationEngine',
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 166,
        capabilityId: 'governance_counterfactual_simulator',
        evaluate: 'simulateGovernanceCounterfactuals',
        toTasks: 'governanceCounterfactualSimulatorToTasks',
        className: 'GovernanceCounterfactualSimulator',
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 167,
        capabilityId: 'governance_goal_decomposer',
        evaluate: 'decomposeGovernanceGoals',
        toTasks: 'governanceGoalDecomposerToTasks',
        className: 'GovernanceGoalDecomposer',
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 168,
        capabilityId: 'governance_dependency_dag_planner',
        evaluate: 'planGovernanceDependencyDag',
        toTasks: 'governanceDependencyDagPlannerToTasks',
        className: 'GovernanceDependencyDagPlanner',
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 169,
        capabilityId: 'governance_resource_budget_allocator',
        evaluate: 'allocateGovernanceResourceBudgets',
        toTasks: 'governanceResourceBudgetAllocatorToTasks',
        className: 'GovernanceResourceBudgetAllocator',
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 170,
        capabilityId: 'governance_risk_aware_scheduler',
        evaluate: 'scheduleGovernanceRiskAware',
        toTasks: 'governanceRiskAwareSchedulerToTasks',
        className: 'GovernanceRiskAwareScheduler',
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 171,
        capabilityId: 'governance_policy_constraint_compiler',
        evaluate: 'compileGovernancePolicyConstraints',
        toTasks: 'governancePolicyConstraintCompilerToTasks',
        className: 'GovernancePolicyConstraintCompiler',
        collectionField: 'policyRules',
        idField: 'ruleId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 82,
        capacity: 44,
        risk: 74,
        impact: 82,
        readiness: 42,
        resilience: 36,
        equity: 55,
        efficiency: 49,
        quality: 57,
        trust: 50,
        opportunity: 78,
        criticality: 90,
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
                    demand: 47,
                    capacity: 89,
                    risk: 22,
                    readiness: 84,
                    resilience: 87,
                    trust: 85,
                    quality: 82,
                    efficiency: 79,
                    criticality: 46
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 16,
                reviewHours: 6
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1850000 + index
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
                    demand: 51,
                    capacity: 91,
                    risk: 19,
                    readiness: 86,
                    resilience: 88,
                    trust: 87,
                    quality: 84,
                    efficiency: 81,
                    criticality: 44
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 18
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1860000 + index
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
            now: () => 1870000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
