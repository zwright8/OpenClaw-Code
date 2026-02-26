import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CommunityContradictionDetector,
    communityContradictionDetectorToTasks,
    detectCommunityContradictions
} from '../src/community-contradiction-detector.js';
import {
    CommunityConfidenceCalibrationEngine,
    calibrateCommunityConfidence,
    communityConfidenceCalibrationEngineToTasks
} from '../src/community-confidence-calibration-engine.js';
import {
    CommunityCounterfactualSimulator,
    communityCounterfactualSimulatorToTasks,
    simulateCommunityCounterfactuals
} from '../src/community-counterfactual-simulator.js';
import {
    CommunityGoalDecomposer,
    communityGoalDecomposerToTasks,
    decomposeCommunityGoals
} from '../src/community-goal-decomposer.js';
import {
    CommunityDependencyDagPlanner,
    communityDependencyDagPlannerToTasks,
    planCommunityDependencyDag
} from '../src/community-dependency-dag-planner.js';
import {
    CommunityResourceBudgetAllocator,
    allocateCommunityResourceBudgets,
    communityResourceBudgetAllocatorToTasks
} from '../src/community-resource-budget-allocator.js';
import {
    CommunityRiskAwareScheduler,
    communityRiskAwareSchedulerToTasks,
    scheduleCommunityRiskAware
} from '../src/community-risk-aware-scheduler.js';
import {
    CommunityPolicyConstraintCompiler,
    communityPolicyConstraintCompilerToTasks,
    compileCommunityPolicyConstraints
} from '../src/community-policy-constraint-compiler.js';

const capabilities = [
    {
        number: 844,
        capabilityId: 'community_contradiction_detector',
        evaluate: detectCommunityContradictions,
        toTasks: communityContradictionDetectorToTasks,
        classRef: CommunityContradictionDetector,
        collectionField: 'claims',
        idField: 'claimId'
    },
    {
        number: 845,
        capabilityId: 'community_confidence_calibration_engine',
        evaluate: calibrateCommunityConfidence,
        toTasks: communityConfidenceCalibrationEngineToTasks,
        classRef: CommunityConfidenceCalibrationEngine,
        collectionField: 'calibrationSets',
        idField: 'setId'
    },
    {
        number: 846,
        capabilityId: 'community_counterfactual_simulator',
        evaluate: simulateCommunityCounterfactuals,
        toTasks: communityCounterfactualSimulatorToTasks,
        classRef: CommunityCounterfactualSimulator,
        collectionField: 'scenarios',
        idField: 'scenarioId'
    },
    {
        number: 847,
        capabilityId: 'community_goal_decomposer',
        evaluate: decomposeCommunityGoals,
        toTasks: communityGoalDecomposerToTasks,
        classRef: CommunityGoalDecomposer,
        collectionField: 'goals',
        idField: 'goalId'
    },
    {
        number: 848,
        capabilityId: 'community_dependency_dag_planner',
        evaluate: planCommunityDependencyDag,
        toTasks: communityDependencyDagPlannerToTasks,
        classRef: CommunityDependencyDagPlanner,
        collectionField: 'workflowNodes',
        idField: 'nodeId'
    },
    {
        number: 849,
        capabilityId: 'community_resource_budget_allocator',
        evaluate: allocateCommunityResourceBudgets,
        toTasks: communityResourceBudgetAllocatorToTasks,
        classRef: CommunityResourceBudgetAllocator,
        collectionField: 'budgetItems',
        idField: 'itemId'
    },
    {
        number: 850,
        capabilityId: 'community_risk_aware_scheduler',
        evaluate: scheduleCommunityRiskAware,
        toTasks: communityRiskAwareSchedulerToTasks,
        classRef: CommunityRiskAwareScheduler,
        collectionField: 'scheduleItems',
        idField: 'scheduleId'
    },
    {
        number: 851,
        capabilityId: 'community_policy_constraint_compiler',
        evaluate: compileCommunityPolicyConstraints,
        toTasks: communityPolicyConstraintCompilerToTasks,
        classRef: CommunityPolicyConstraintCompiler,
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
            now: () => 8440000 + index
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
            now: () => 8450000 + index
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
            now: () => 3600000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
