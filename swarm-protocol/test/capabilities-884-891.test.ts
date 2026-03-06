import test from 'node:test';
import assert from 'node:assert/strict';
import {
    detectRightsContradictions,
    rightsContradictionDetectorToTasks,
    RightsContradictionDetector
} from '../src/rights-contradiction-detector.js';
import {
    calibrateRightsConfidence,
    rightsConfidenceCalibrationEngineToTasks,
    RightsConfidenceCalibrationEngine
} from '../src/rights-confidence-calibration-engine.js';
import {
    rightsCounterfactualSimulatorToTasks,
    RightsCounterfactualSimulator,
    simulateRightsCounterfactuals
} from '../src/rights-counterfactual-simulator.js';
import {
    decomposeRightsGoals,
    rightsGoalDecomposerToTasks,
    RightsGoalDecomposer
} from '../src/rights-goal-decomposer.js';
import {
    planRightsDependencyDag,
    rightsDependencyDagPlannerToTasks,
    RightsDependencyDagPlanner
} from '../src/rights-dependency-dag-planner.js';
import {
    allocateRightsResourceBudgets,
    rightsResourceBudgetAllocatorToTasks,
    RightsResourceBudgetAllocator
} from '../src/rights-resource-budget-allocator.js';
import {
    rightsRiskAwareSchedulerToTasks,
    RightsRiskAwareScheduler,
    scheduleRightsRiskAware
} from '../src/rights-risk-aware-scheduler.js';
import {
    compileRightsPolicyConstraints,
    rightsPolicyConstraintCompilerToTasks,
    RightsPolicyConstraintCompiler
} from '../src/rights-policy-constraint-compiler.js';

const capabilities = [
    {
        number: 884,
        capabilityId: 'rights_contradiction_detector',
        evaluate: detectRightsContradictions,
        toTasks: rightsContradictionDetectorToTasks,
        classRef: RightsContradictionDetector,
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 885,
        capabilityId: 'rights_confidence_calibration_engine',
        evaluate: calibrateRightsConfidence,
        toTasks: rightsConfidenceCalibrationEngineToTasks,
        classRef: RightsConfidenceCalibrationEngine,
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 886,
        capabilityId: 'rights_counterfactual_simulator',
        evaluate: simulateRightsCounterfactuals,
        toTasks: rightsCounterfactualSimulatorToTasks,
        classRef: RightsCounterfactualSimulator,
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 887,
        capabilityId: 'rights_goal_decomposer',
        evaluate: decomposeRightsGoals,
        toTasks: rightsGoalDecomposerToTasks,
        classRef: RightsGoalDecomposer,
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 888,
        capabilityId: 'rights_dependency_dag_planner',
        evaluate: planRightsDependencyDag,
        toTasks: rightsDependencyDagPlannerToTasks,
        classRef: RightsDependencyDagPlanner,
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 889,
        capabilityId: 'rights_resource_budget_allocator',
        evaluate: allocateRightsResourceBudgets,
        toTasks: rightsResourceBudgetAllocatorToTasks,
        classRef: RightsResourceBudgetAllocator,
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 890,
        capabilityId: 'rights_risk_aware_scheduler',
        evaluate: scheduleRightsRiskAware,
        toTasks: rightsRiskAwareSchedulerToTasks,
        classRef: RightsRiskAwareScheduler,
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 891,
        capabilityId: 'rights_policy_constraint_compiler',
        evaluate: compileRightsPolicyConstraints,
        toTasks: rightsPolicyConstraintCompilerToTasks,
        classRef: RightsPolicyConstraintCompiler,
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
            now: () => 8840000 + index
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
            now: () => 8850000 + index
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
            now: () => 4100000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
