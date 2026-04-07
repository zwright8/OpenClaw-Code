import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CulturalHumanApprovalRouter,
    culturalHumanApprovalRouterToTasks,
    routeCulturalHumanApprovals
} from '../src/cultural-human-approval-router.js';
import {
    CulturalTaskHandoffContractor,
    contractCulturalTaskHandoffs,
    culturalTaskHandoffContractorToTasks
} from '../src/cultural-task-handoff-contractor.js';
import {
    CulturalToolHealthMonitor,
    culturalToolHealthMonitorToTasks,
    monitorCulturalToolHealth
} from '../src/cultural-tool-health-monitor.js';
import {
    CulturalAutoRetryBackoffCoordinator,
    coordinateCulturalAutoRetryBackoff,
    culturalAutoRetryBackoffCoordinatorToTasks
} from '../src/cultural-auto-retry-backoff-coordinator.js';
import {
    CulturalFailureRootCauseMiner,
    culturalFailureRootCauseMinerToTasks,
    mineCulturalFailureRootCauses
} from '../src/cultural-failure-root-cause-miner.js';
import {
    CulturalRegressionSentinel,
    culturalRegressionSentinelToTasks,
    detectCulturalRegressions
} from '../src/cultural-regression-sentinel.js';
import {
    CulturalMemoryConsolidationPipeline,
    consolidateCulturalMemory,
    culturalMemoryConsolidationPipelineToTasks
} from '../src/cultural-memory-consolidation-pipeline.js';
import {
    CulturalKnowledgeGraphLinker,
    culturalKnowledgeGraphLinkerToTasks,
    linkCulturalKnowledgeGraph
} from '../src/cultural-knowledge-graph-linker.js';

const capabilities = [
    {
        number: 772,
        capabilityId: 'cultural_human_approval_router',
        evaluate: routeCulturalHumanApprovals,
        toTasks: culturalHumanApprovalRouterToTasks,
        classRef: CulturalHumanApprovalRouter,
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 773,
        capabilityId: 'cultural_task_handoff_contractor',
        evaluate: contractCulturalTaskHandoffs,
        toTasks: culturalTaskHandoffContractorToTasks,
        classRef: CulturalTaskHandoffContractor,
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 774,
        capabilityId: 'cultural_tool_health_monitor',
        evaluate: monitorCulturalToolHealth,
        toTasks: culturalToolHealthMonitorToTasks,
        classRef: CulturalToolHealthMonitor,
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 775,
        capabilityId: 'cultural_auto_retry_backoff_coordinator',
        evaluate: coordinateCulturalAutoRetryBackoff,
        toTasks: culturalAutoRetryBackoffCoordinatorToTasks,
        classRef: CulturalAutoRetryBackoffCoordinator,
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 776,
        capabilityId: 'cultural_failure_root_cause_miner',
        evaluate: mineCulturalFailureRootCauses,
        toTasks: culturalFailureRootCauseMinerToTasks,
        classRef: CulturalFailureRootCauseMiner,
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 777,
        capabilityId: 'cultural_regression_sentinel',
        evaluate: detectCulturalRegressions,
        toTasks: culturalRegressionSentinelToTasks,
        classRef: CulturalRegressionSentinel,
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 778,
        capabilityId: 'cultural_memory_consolidation_pipeline',
        evaluate: consolidateCulturalMemory,
        toTasks: culturalMemoryConsolidationPipelineToTasks,
        classRef: CulturalMemoryConsolidationPipeline,
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 779,
        capabilityId: 'cultural_knowledge_graph_linker',
        evaluate: linkCulturalKnowledgeGraph,
        toTasks: culturalKnowledgeGraphLinkerToTasks,
        classRef: CulturalKnowledgeGraphLinker,
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
            now: () => 7720000 + index
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
            now: () => 7730000 + index
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
            now: () => 2700000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
