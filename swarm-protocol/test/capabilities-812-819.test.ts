import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InclusionHumanApprovalRouter,
    inclusionHumanApprovalRouterToTasks,
    routeInclusionHumanApprovals
} from '../src/inclusion-human-approval-router.js';
import {
    InclusionTaskHandoffContractor,
    contractInclusionTaskHandoffs,
    inclusionTaskHandoffContractorToTasks
} from '../src/inclusion-task-handoff-contractor.js';
import {
    InclusionToolHealthMonitor,
    inclusionToolHealthMonitorToTasks,
    monitorInclusionToolHealth
} from '../src/inclusion-tool-health-monitor.js';
import {
    InclusionAutoRetryBackoffCoordinator,
    coordinateInclusionAutoRetryBackoff,
    inclusionAutoRetryBackoffCoordinatorToTasks
} from '../src/inclusion-auto-retry-backoff-coordinator.js';
import {
    InclusionFailureRootCauseMiner,
    inclusionFailureRootCauseMinerToTasks,
    mineInclusionFailureRootCauses
} from '../src/inclusion-failure-root-cause-miner.js';
import {
    InclusionRegressionSentinel,
    detectInclusionRegressions,
    inclusionRegressionSentinelToTasks
} from '../src/inclusion-regression-sentinel.js';
import {
    InclusionMemoryConsolidationPipeline,
    consolidateInclusionMemory,
    inclusionMemoryConsolidationPipelineToTasks
} from '../src/inclusion-memory-consolidation-pipeline.js';
import {
    InclusionKnowledgeGraphLinker,
    inclusionKnowledgeGraphLinkerToTasks,
    linkInclusionKnowledgeGraph
} from '../src/inclusion-knowledge-graph-linker.js';

const capabilities = [
    {
        number: 812,
        capabilityId: 'inclusion_human_approval_router',
        evaluate: routeInclusionHumanApprovals,
        toTasks: inclusionHumanApprovalRouterToTasks,
        classRef: InclusionHumanApprovalRouter,
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 813,
        capabilityId: 'inclusion_task_handoff_contractor',
        evaluate: contractInclusionTaskHandoffs,
        toTasks: inclusionTaskHandoffContractorToTasks,
        classRef: InclusionTaskHandoffContractor,
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 814,
        capabilityId: 'inclusion_tool_health_monitor',
        evaluate: monitorInclusionToolHealth,
        toTasks: inclusionToolHealthMonitorToTasks,
        classRef: InclusionToolHealthMonitor,
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 815,
        capabilityId: 'inclusion_auto_retry_backoff_coordinator',
        evaluate: coordinateInclusionAutoRetryBackoff,
        toTasks: inclusionAutoRetryBackoffCoordinatorToTasks,
        classRef: InclusionAutoRetryBackoffCoordinator,
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 816,
        capabilityId: 'inclusion_failure_root_cause_miner',
        evaluate: mineInclusionFailureRootCauses,
        toTasks: inclusionFailureRootCauseMinerToTasks,
        classRef: InclusionFailureRootCauseMiner,
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 817,
        capabilityId: 'inclusion_regression_sentinel',
        evaluate: detectInclusionRegressions,
        toTasks: inclusionRegressionSentinelToTasks,
        classRef: InclusionRegressionSentinel,
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 818,
        capabilityId: 'inclusion_memory_consolidation_pipeline',
        evaluate: consolidateInclusionMemory,
        toTasks: inclusionMemoryConsolidationPipelineToTasks,
        classRef: InclusionMemoryConsolidationPipeline,
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 819,
        capabilityId: 'inclusion_knowledge_graph_linker',
        evaluate: linkInclusionKnowledgeGraph,
        toTasks: inclusionKnowledgeGraphLinkerToTasks,
        classRef: InclusionKnowledgeGraphLinker,
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
            now: () => 8120000 + index
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
            now: () => 8130000 + index
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
            now: () => 3200000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
