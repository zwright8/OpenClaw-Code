import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CommunityHumanApprovalRouter,
    communityHumanApprovalRouterToTasks,
    routeCommunityHumanApprovals
} from '../src/community-human-approval-router.js';
import {
    CommunityTaskHandoffContractor,
    communityTaskHandoffContractorToTasks,
    contractCommunityTaskHandoffs
} from '../src/community-task-handoff-contractor.js';
import {
    CommunityToolHealthMonitor,
    communityToolHealthMonitorToTasks,
    monitorCommunityToolHealth
} from '../src/community-tool-health-monitor.js';
import {
    CommunityAutoRetryBackoffCoordinator,
    communityAutoRetryBackoffCoordinatorToTasks,
    coordinateCommunityAutoRetryBackoff
} from '../src/community-auto-retry-backoff-coordinator.js';
import {
    CommunityFailureRootCauseMiner,
    communityFailureRootCauseMinerToTasks,
    mineCommunityFailureRootCauses
} from '../src/community-failure-root-cause-miner.js';
import {
    CommunityRegressionSentinel,
    communityRegressionSentinelToTasks,
    detectCommunityRegressions
} from '../src/community-regression-sentinel.js';
import {
    CommunityMemoryConsolidationPipeline,
    communityMemoryConsolidationPipelineToTasks,
    consolidateCommunityMemory
} from '../src/community-memory-consolidation-pipeline.js';
import {
    CommunityKnowledgeGraphLinker,
    communityKnowledgeGraphLinkerToTasks,
    linkCommunityKnowledgeGraph
} from '../src/community-knowledge-graph-linker.js';

const capabilities = [
    {
        number: 852,
        capabilityId: 'community_human_approval_router',
        evaluate: routeCommunityHumanApprovals,
        toTasks: communityHumanApprovalRouterToTasks,
        classRef: CommunityHumanApprovalRouter,
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 853,
        capabilityId: 'community_task_handoff_contractor',
        evaluate: contractCommunityTaskHandoffs,
        toTasks: communityTaskHandoffContractorToTasks,
        classRef: CommunityTaskHandoffContractor,
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 854,
        capabilityId: 'community_tool_health_monitor',
        evaluate: monitorCommunityToolHealth,
        toTasks: communityToolHealthMonitorToTasks,
        classRef: CommunityToolHealthMonitor,
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 855,
        capabilityId: 'community_auto_retry_backoff_coordinator',
        evaluate: coordinateCommunityAutoRetryBackoff,
        toTasks: communityAutoRetryBackoffCoordinatorToTasks,
        classRef: CommunityAutoRetryBackoffCoordinator,
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 856,
        capabilityId: 'community_failure_root_cause_miner',
        evaluate: mineCommunityFailureRootCauses,
        toTasks: communityFailureRootCauseMinerToTasks,
        classRef: CommunityFailureRootCauseMiner,
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 857,
        capabilityId: 'community_regression_sentinel',
        evaluate: detectCommunityRegressions,
        toTasks: communityRegressionSentinelToTasks,
        classRef: CommunityRegressionSentinel,
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 858,
        capabilityId: 'community_memory_consolidation_pipeline',
        evaluate: consolidateCommunityMemory,
        toTasks: communityMemoryConsolidationPipelineToTasks,
        classRef: CommunityMemoryConsolidationPipeline,
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 859,
        capabilityId: 'community_knowledge_graph_linker',
        evaluate: linkCommunityKnowledgeGraph,
        toTasks: communityKnowledgeGraphLinkerToTasks,
        classRef: CommunityKnowledgeGraphLinker,
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
            now: () => 8520000 + index
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
            now: () => 8530000 + index
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
            now: () => 3700000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
