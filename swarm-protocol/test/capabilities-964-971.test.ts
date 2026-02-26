import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EvolutionContradictionDetector,
    detectEvolutionContradictions,
    evolutionContradictionDetectorToTasks
} from '../src/evolution-contradiction-detector.js';
import {
    EvolutionConfidenceCalibrationEngine,
    calibrateEvolutionConfidence,
    evolutionConfidenceCalibrationEngineToTasks
} from '../src/evolution-confidence-calibration-engine.js';
import {
    EvolutionCounterfactualSimulator,
    evolutionCounterfactualSimulatorToTasks,
    simulateEvolutionCounterfactuals
} from '../src/evolution-counterfactual-simulator.js';
import {
    EvolutionGoalDecomposer,
    decomposeEvolutionGoals,
    evolutionGoalDecomposerToTasks
} from '../src/evolution-goal-decomposer.js';
import {
    EvolutionDependencyDagPlanner,
    evolutionDependencyDagPlannerToTasks,
    planEvolutionDependencyDag
} from '../src/evolution-dependency-dag-planner.js';
import {
    EvolutionResourceBudgetAllocator,
    allocateEvolutionResourceBudgets,
    evolutionResourceBudgetAllocatorToTasks
} from '../src/evolution-resource-budget-allocator.js';
import {
    EvolutionRiskAwareScheduler,
    evolutionRiskAwareSchedulerToTasks,
    scheduleEvolutionRiskAware
} from '../src/evolution-risk-aware-scheduler.js';
import {
    EvolutionPolicyConstraintCompiler,
    compileEvolutionPolicyConstraints,
    evolutionPolicyConstraintCompilerToTasks
} from '../src/evolution-policy-constraint-compiler.js';

const capabilities = [
    {
        number: 964,
        capabilityId: 'evolution_contradiction_detector',
        evaluate: detectEvolutionContradictions,
        toTasks: evolutionContradictionDetectorToTasks,
        classRef: EvolutionContradictionDetector,
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 965,
        capabilityId: 'evolution_confidence_calibration_engine',
        evaluate: calibrateEvolutionConfidence,
        toTasks: evolutionConfidenceCalibrationEngineToTasks,
        classRef: EvolutionConfidenceCalibrationEngine,
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 966,
        capabilityId: 'evolution_counterfactual_simulator',
        evaluate: simulateEvolutionCounterfactuals,
        toTasks: evolutionCounterfactualSimulatorToTasks,
        classRef: EvolutionCounterfactualSimulator,
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 967,
        capabilityId: 'evolution_goal_decomposer',
        evaluate: decomposeEvolutionGoals,
        toTasks: evolutionGoalDecomposerToTasks,
        classRef: EvolutionGoalDecomposer,
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 968,
        capabilityId: 'evolution_dependency_dag_planner',
        evaluate: planEvolutionDependencyDag,
        toTasks: evolutionDependencyDagPlannerToTasks,
        classRef: EvolutionDependencyDagPlanner,
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 969,
        capabilityId: 'evolution_resource_budget_allocator',
        evaluate: allocateEvolutionResourceBudgets,
        toTasks: evolutionResourceBudgetAllocatorToTasks,
        classRef: EvolutionResourceBudgetAllocator,
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 970,
        capabilityId: 'evolution_risk_aware_scheduler',
        evaluate: scheduleEvolutionRiskAware,
        toTasks: evolutionRiskAwareSchedulerToTasks,
        classRef: EvolutionRiskAwareScheduler,
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 971,
        capabilityId: 'evolution_policy_constraint_compiler',
        evaluate: compileEvolutionPolicyConstraints,
        toTasks: evolutionPolicyConstraintCompilerToTasks,
        classRef: EvolutionPolicyConstraintCompiler,
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
            now: () => 9640000 + index
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
            now: () => 9650000 + index
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
            now: () => 5100000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
