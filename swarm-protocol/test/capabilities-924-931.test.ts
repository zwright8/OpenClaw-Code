import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InfraContradictionDetector,
    detectInfraContradictions,
    infraContradictionDetectorToTasks
} from '../src/infra-contradiction-detector.js';
import {
    InfraConfidenceCalibrationEngine,
    calibrateInfraConfidence,
    infraConfidenceCalibrationEngineToTasks
} from '../src/infra-confidence-calibration-engine.js';
import {
    InfraCounterfactualSimulator,
    infraCounterfactualSimulatorToTasks,
    simulateInfraCounterfactuals
} from '../src/infra-counterfactual-simulator.js';
import {
    InfraGoalDecomposer,
    decomposeInfraGoals,
    infraGoalDecomposerToTasks
} from '../src/infra-goal-decomposer.js';
import {
    InfraDependencyDagPlanner,
    infraDependencyDagPlannerToTasks,
    planInfraDependencyDag
} from '../src/infra-dependency-dag-planner.js';
import {
    InfraResourceBudgetAllocator,
    allocateInfraResourceBudgets,
    infraResourceBudgetAllocatorToTasks
} from '../src/infra-resource-budget-allocator.js';
import {
    InfraRiskAwareScheduler,
    infraRiskAwareSchedulerToTasks,
    scheduleInfraRiskAware
} from '../src/infra-risk-aware-scheduler.js';
import {
    InfraPolicyConstraintCompiler,
    compileInfraPolicyConstraints,
    infraPolicyConstraintCompilerToTasks
} from '../src/infra-policy-constraint-compiler.js';

const capabilities = [
    {
        number: 924,
        capabilityId: 'infra_contradiction_detector',
        evaluate: detectInfraContradictions,
        toTasks: infraContradictionDetectorToTasks,
        classRef: InfraContradictionDetector,
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 925,
        capabilityId: 'infra_confidence_calibration_engine',
        evaluate: calibrateInfraConfidence,
        toTasks: infraConfidenceCalibrationEngineToTasks,
        classRef: InfraConfidenceCalibrationEngine,
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 926,
        capabilityId: 'infra_counterfactual_simulator',
        evaluate: simulateInfraCounterfactuals,
        toTasks: infraCounterfactualSimulatorToTasks,
        classRef: InfraCounterfactualSimulator,
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 927,
        capabilityId: 'infra_goal_decomposer',
        evaluate: decomposeInfraGoals,
        toTasks: infraGoalDecomposerToTasks,
        classRef: InfraGoalDecomposer,
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 928,
        capabilityId: 'infra_dependency_dag_planner',
        evaluate: planInfraDependencyDag,
        toTasks: infraDependencyDagPlannerToTasks,
        classRef: InfraDependencyDagPlanner,
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 929,
        capabilityId: 'infra_resource_budget_allocator',
        evaluate: allocateInfraResourceBudgets,
        toTasks: infraResourceBudgetAllocatorToTasks,
        classRef: InfraResourceBudgetAllocator,
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 930,
        capabilityId: 'infra_risk_aware_scheduler',
        evaluate: scheduleInfraRiskAware,
        toTasks: infraRiskAwareSchedulerToTasks,
        classRef: InfraRiskAwareScheduler,
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 931,
        capabilityId: 'infra_policy_constraint_compiler',
        evaluate: compileInfraPolicyConstraints,
        toTasks: infraPolicyConstraintCompilerToTasks,
        classRef: InfraPolicyConstraintCompiler,
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
            now: () => 9240000 + index
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
            now: () => 9250000 + index
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
            now: () => 4600000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
