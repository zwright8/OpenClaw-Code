import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InfraHumanApprovalRouter,
    infraHumanApprovalRouterToTasks,
    routeInfraHumanApprovals
} from '../src/infra-human-approval-router.js';
import {
    InfraTaskHandoffContractor,
    contractInfraTaskHandoffs,
    infraTaskHandoffContractorToTasks
} from '../src/infra-task-handoff-contractor.js';
import {
    InfraToolHealthMonitor,
    infraToolHealthMonitorToTasks,
    monitorInfraToolHealth
} from '../src/infra-tool-health-monitor.js';
import {
    InfraAutoRetryBackoffCoordinator,
    coordinateInfraAutoRetryBackoff,
    infraAutoRetryBackoffCoordinatorToTasks
} from '../src/infra-auto-retry-backoff-coordinator.js';
import {
    InfraFailureRootCauseMiner,
    infraFailureRootCauseMinerToTasks,
    mineInfraFailureRootCauses
} from '../src/infra-failure-root-cause-miner.js';
import {
    InfraRegressionSentinel,
    detectInfraRegressions,
    infraRegressionSentinelToTasks
} from '../src/infra-regression-sentinel.js';
import {
    InfraMemoryConsolidationPipeline,
    consolidateInfraMemory,
    infraMemoryConsolidationPipelineToTasks
} from '../src/infra-memory-consolidation-pipeline.js';
import {
    InfraKnowledgeGraphLinker,
    infraKnowledgeGraphLinkerToTasks,
    linkInfraKnowledgeGraph
} from '../src/infra-knowledge-graph-linker.js';

const capabilities = [
    {
        number: 932,
        capabilityId: 'infra_human_approval_router',
        evaluate: routeInfraHumanApprovals,
        toTasks: infraHumanApprovalRouterToTasks,
        classRef: InfraHumanApprovalRouter,
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 933,
        capabilityId: 'infra_task_handoff_contractor',
        evaluate: contractInfraTaskHandoffs,
        toTasks: infraTaskHandoffContractorToTasks,
        classRef: InfraTaskHandoffContractor,
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 934,
        capabilityId: 'infra_tool_health_monitor',
        evaluate: monitorInfraToolHealth,
        toTasks: infraToolHealthMonitorToTasks,
        classRef: InfraToolHealthMonitor,
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 935,
        capabilityId: 'infra_auto_retry_backoff_coordinator',
        evaluate: coordinateInfraAutoRetryBackoff,
        toTasks: infraAutoRetryBackoffCoordinatorToTasks,
        classRef: InfraAutoRetryBackoffCoordinator,
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 936,
        capabilityId: 'infra_failure_root_cause_miner',
        evaluate: mineInfraFailureRootCauses,
        toTasks: infraFailureRootCauseMinerToTasks,
        classRef: InfraFailureRootCauseMiner,
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 937,
        capabilityId: 'infra_regression_sentinel',
        evaluate: detectInfraRegressions,
        toTasks: infraRegressionSentinelToTasks,
        classRef: InfraRegressionSentinel,
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 938,
        capabilityId: 'infra_memory_consolidation_pipeline',
        evaluate: consolidateInfraMemory,
        toTasks: infraMemoryConsolidationPipelineToTasks,
        classRef: InfraMemoryConsolidationPipeline,
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 939,
        capabilityId: 'infra_knowledge_graph_linker',
        evaluate: linkInfraKnowledgeGraph,
        toTasks: infraKnowledgeGraphLinkerToTasks,
        classRef: InfraKnowledgeGraphLinker,
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
            now: () => 9320000 + index
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
            now: () => 9330000 + index
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
            now: () => 4700000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
