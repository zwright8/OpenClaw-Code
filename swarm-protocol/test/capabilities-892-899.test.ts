import test from 'node:test';
import assert from 'node:assert/strict';
import {
    RightsHumanApprovalRouter,
    rightsHumanApprovalRouterToTasks,
    routeRightsHumanApprovals
} from '../src/rights-human-approval-router.js';
import {
    RightsTaskHandoffContractor,
    contractRightsTaskHandoffs,
    rightsTaskHandoffContractorToTasks
} from '../src/rights-task-handoff-contractor.js';
import {
    RightsToolHealthMonitor,
    monitorRightsToolHealth,
    rightsToolHealthMonitorToTasks
} from '../src/rights-tool-health-monitor.js';
import {
    RightsAutoRetryBackoffCoordinator,
    coordinateRightsAutoRetryBackoff,
    rightsAutoRetryBackoffCoordinatorToTasks
} from '../src/rights-auto-retry-backoff-coordinator.js';
import {
    RightsFailureRootCauseMiner,
    mineRightsFailureRootCauses,
    rightsFailureRootCauseMinerToTasks
} from '../src/rights-failure-root-cause-miner.js';
import {
    RightsRegressionSentinel,
    detectRightsRegressions,
    rightsRegressionSentinelToTasks
} from '../src/rights-regression-sentinel.js';
import {
    RightsMemoryConsolidationPipeline,
    consolidateRightsMemory,
    rightsMemoryConsolidationPipelineToTasks
} from '../src/rights-memory-consolidation-pipeline.js';
import {
    RightsKnowledgeGraphLinker,
    linkRightsKnowledgeGraph,
    rightsKnowledgeGraphLinkerToTasks
} from '../src/rights-knowledge-graph-linker.js';

const capabilities = [
    {
        number: 892,
        capabilityId: 'rights_human_approval_router',
        evaluate: routeRightsHumanApprovals,
        toTasks: rightsHumanApprovalRouterToTasks,
        classRef: RightsHumanApprovalRouter,
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 893,
        capabilityId: 'rights_task_handoff_contractor',
        evaluate: contractRightsTaskHandoffs,
        toTasks: rightsTaskHandoffContractorToTasks,
        classRef: RightsTaskHandoffContractor,
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 894,
        capabilityId: 'rights_tool_health_monitor',
        evaluate: monitorRightsToolHealth,
        toTasks: rightsToolHealthMonitorToTasks,
        classRef: RightsToolHealthMonitor,
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 895,
        capabilityId: 'rights_auto_retry_backoff_coordinator',
        evaluate: coordinateRightsAutoRetryBackoff,
        toTasks: rightsAutoRetryBackoffCoordinatorToTasks,
        classRef: RightsAutoRetryBackoffCoordinator,
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 896,
        capabilityId: 'rights_failure_root_cause_miner',
        evaluate: mineRightsFailureRootCauses,
        toTasks: rightsFailureRootCauseMinerToTasks,
        classRef: RightsFailureRootCauseMiner,
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 897,
        capabilityId: 'rights_regression_sentinel',
        evaluate: detectRightsRegressions,
        toTasks: rightsRegressionSentinelToTasks,
        classRef: RightsRegressionSentinel,
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 898,
        capabilityId: 'rights_memory_consolidation_pipeline',
        evaluate: consolidateRightsMemory,
        toTasks: rightsMemoryConsolidationPipelineToTasks,
        classRef: RightsMemoryConsolidationPipeline,
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 899,
        capabilityId: 'rights_knowledge_graph_linker',
        evaluate: linkRightsKnowledgeGraph,
        toTasks: rightsKnowledgeGraphLinkerToTasks,
        classRef: RightsKnowledgeGraphLinker,
        collectionField: 'entities',
        idField: 'entityId'
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
            now: () => 8920000 + index
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
            now: () => 8930000 + index
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
            now: () => 4200000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
