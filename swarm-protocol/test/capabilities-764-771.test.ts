import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CulturalContradictionDetector,
    culturalContradictionDetectorToTasks,
    detectCulturalContradictions
} from '../src/cultural-contradiction-detector.js';
import {
    CulturalConfidenceCalibrationEngine,
    calibrateCulturalConfidence,
    culturalConfidenceCalibrationEngineToTasks
} from '../src/cultural-confidence-calibration-engine.js';
import {
    CulturalCounterfactualSimulator,
    culturalCounterfactualSimulatorToTasks,
    simulateCulturalCounterfactuals
} from '../src/cultural-counterfactual-simulator.js';
import {
    CulturalGoalDecomposer,
    culturalGoalDecomposerToTasks,
    decomposeCulturalGoals
} from '../src/cultural-goal-decomposer.js';
import {
    CulturalDependencyDagPlanner,
    culturalDependencyDagPlannerToTasks,
    planCulturalDependencyDag
} from '../src/cultural-dependency-dag-planner.js';
import {
    CulturalResourceBudgetAllocator,
    allocateCulturalResourceBudgets,
    culturalResourceBudgetAllocatorToTasks
} from '../src/cultural-resource-budget-allocator.js';
import {
    CulturalRiskAwareScheduler,
    culturalRiskAwareSchedulerToTasks,
    scheduleCulturalRiskAware
} from '../src/cultural-risk-aware-scheduler.js';
import {
    CulturalPolicyConstraintCompiler,
    compileCulturalPolicyConstraints,
    culturalPolicyConstraintCompilerToTasks
} from '../src/cultural-policy-constraint-compiler.js';

const capabilities = [
    {
        number: 764,
        capabilityId: 'cultural_contradiction_detector',
        evaluate: detectCulturalContradictions,
        toTasks: culturalContradictionDetectorToTasks,
        classRef: CulturalContradictionDetector,
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 765,
        capabilityId: 'cultural_confidence_calibration_engine',
        evaluate: calibrateCulturalConfidence,
        toTasks: culturalConfidenceCalibrationEngineToTasks,
        classRef: CulturalConfidenceCalibrationEngine,
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 766,
        capabilityId: 'cultural_counterfactual_simulator',
        evaluate: simulateCulturalCounterfactuals,
        toTasks: culturalCounterfactualSimulatorToTasks,
        classRef: CulturalCounterfactualSimulator,
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 767,
        capabilityId: 'cultural_goal_decomposer',
        evaluate: decomposeCulturalGoals,
        toTasks: culturalGoalDecomposerToTasks,
        classRef: CulturalGoalDecomposer,
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 768,
        capabilityId: 'cultural_dependency_dag_planner',
        evaluate: planCulturalDependencyDag,
        toTasks: culturalDependencyDagPlannerToTasks,
        classRef: CulturalDependencyDagPlanner,
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 769,
        capabilityId: 'cultural_resource_budget_allocator',
        evaluate: allocateCulturalResourceBudgets,
        toTasks: culturalResourceBudgetAllocatorToTasks,
        classRef: CulturalResourceBudgetAllocator,
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 770,
        capabilityId: 'cultural_risk_aware_scheduler',
        evaluate: scheduleCulturalRiskAware,
        toTasks: culturalRiskAwareSchedulerToTasks,
        classRef: CulturalRiskAwareScheduler,
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 771,
        capabilityId: 'cultural_policy_constraint_compiler',
        evaluate: compileCulturalPolicyConstraints,
        toTasks: culturalPolicyConstraintCompilerToTasks,
        classRef: CulturalPolicyConstraintCompiler,
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
            now: () => 7640000 + index
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
            now: () => 7650000 + index
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
            now: () => 2600000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
