import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InclusionContradictionDetector,
    detectInclusionContradictions,
    inclusionContradictionDetectorToTasks
} from '../src/inclusion-contradiction-detector.js';
import {
    InclusionConfidenceCalibrationEngine,
    calibrateInclusionConfidence,
    inclusionConfidenceCalibrationEngineToTasks
} from '../src/inclusion-confidence-calibration-engine.js';
import {
    InclusionCounterfactualSimulator,
    inclusionCounterfactualSimulatorToTasks,
    simulateInclusionCounterfactuals
} from '../src/inclusion-counterfactual-simulator.js';
import {
    InclusionGoalDecomposer,
    decomposeInclusionGoals,
    inclusionGoalDecomposerToTasks
} from '../src/inclusion-goal-decomposer.js';
import {
    InclusionDependencyDagPlanner,
    inclusionDependencyDagPlannerToTasks,
    planInclusionDependencyDag
} from '../src/inclusion-dependency-dag-planner.js';
import {
    InclusionResourceBudgetAllocator,
    allocateInclusionResourceBudgets,
    inclusionResourceBudgetAllocatorToTasks
} from '../src/inclusion-resource-budget-allocator.js';
import {
    InclusionRiskAwareScheduler,
    inclusionRiskAwareSchedulerToTasks,
    scheduleInclusionRiskAware
} from '../src/inclusion-risk-aware-scheduler.js';
import {
    InclusionPolicyConstraintCompiler,
    compileInclusionPolicyConstraints,
    inclusionPolicyConstraintCompilerToTasks
} from '../src/inclusion-policy-constraint-compiler.js';

const capabilities = [
    {
        number: 804,
        capabilityId: 'inclusion_contradiction_detector',
        evaluate: detectInclusionContradictions,
        toTasks: inclusionContradictionDetectorToTasks,
        classRef: InclusionContradictionDetector,
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 805,
        capabilityId: 'inclusion_confidence_calibration_engine',
        evaluate: calibrateInclusionConfidence,
        toTasks: inclusionConfidenceCalibrationEngineToTasks,
        classRef: InclusionConfidenceCalibrationEngine,
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 806,
        capabilityId: 'inclusion_counterfactual_simulator',
        evaluate: simulateInclusionCounterfactuals,
        toTasks: inclusionCounterfactualSimulatorToTasks,
        classRef: InclusionCounterfactualSimulator,
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 807,
        capabilityId: 'inclusion_goal_decomposer',
        evaluate: decomposeInclusionGoals,
        toTasks: inclusionGoalDecomposerToTasks,
        classRef: InclusionGoalDecomposer,
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 808,
        capabilityId: 'inclusion_dependency_dag_planner',
        evaluate: planInclusionDependencyDag,
        toTasks: inclusionDependencyDagPlannerToTasks,
        classRef: InclusionDependencyDagPlanner,
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 809,
        capabilityId: 'inclusion_resource_budget_allocator',
        evaluate: allocateInclusionResourceBudgets,
        toTasks: inclusionResourceBudgetAllocatorToTasks,
        classRef: InclusionResourceBudgetAllocator,
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 810,
        capabilityId: 'inclusion_risk_aware_scheduler',
        evaluate: scheduleInclusionRiskAware,
        toTasks: inclusionRiskAwareSchedulerToTasks,
        classRef: InclusionRiskAwareScheduler,
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 811,
        capabilityId: 'inclusion_policy_constraint_compiler',
        evaluate: compileInclusionPolicyConstraints,
        toTasks: inclusionPolicyConstraintCompilerToTasks,
        classRef: InclusionPolicyConstraintCompiler,
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
            now: () => 8040000 + index
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
            now: () => 8050000 + index
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
            now: () => 3100000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
