import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EvolutionHumanApprovalRouter,
    evolutionHumanApprovalRouterToTasks,
    routeEvolutionHumanApprovals
} from '../src/evolution-human-approval-router.js';
import {
    EvolutionTaskHandoffContractor,
    contractEvolutionTaskHandoffs,
    evolutionTaskHandoffContractorToTasks
} from '../src/evolution-task-handoff-contractor.js';
import {
    EvolutionToolHealthMonitor,
    evolutionToolHealthMonitorToTasks,
    monitorEvolutionToolHealth
} from '../src/evolution-tool-health-monitor.js';
import {
    EvolutionAutoRetryBackoffCoordinator,
    coordinateEvolutionAutoRetryBackoff,
    evolutionAutoRetryBackoffCoordinatorToTasks
} from '../src/evolution-auto-retry-backoff-coordinator.js';
import {
    EvolutionFailureRootCauseMiner,
    evolutionFailureRootCauseMinerToTasks,
    mineEvolutionFailureRootCauses
} from '../src/evolution-failure-root-cause-miner.js';
import {
    EvolutionRegressionSentinel,
    detectEvolutionRegressions,
    evolutionRegressionSentinelToTasks
} from '../src/evolution-regression-sentinel.js';
import {
    EvolutionMemoryConsolidationPipeline,
    consolidateEvolutionMemory,
    evolutionMemoryConsolidationPipelineToTasks
} from '../src/evolution-memory-consolidation-pipeline.js';
import {
    EvolutionKnowledgeGraphLinker,
    evolutionKnowledgeGraphLinkerToTasks,
    linkEvolutionKnowledgeGraph
} from '../src/evolution-knowledge-graph-linker.js';

const capabilities = [
    {
        number: 972,
        capabilityId: 'evolution_human_approval_router',
        evaluate: routeEvolutionHumanApprovals,
        toTasks: evolutionHumanApprovalRouterToTasks,
        classRef: EvolutionHumanApprovalRouter,
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 973,
        capabilityId: 'evolution_task_handoff_contractor',
        evaluate: contractEvolutionTaskHandoffs,
        toTasks: evolutionTaskHandoffContractorToTasks,
        classRef: EvolutionTaskHandoffContractor,
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 974,
        capabilityId: 'evolution_tool_health_monitor',
        evaluate: monitorEvolutionToolHealth,
        toTasks: evolutionToolHealthMonitorToTasks,
        classRef: EvolutionToolHealthMonitor,
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 975,
        capabilityId: 'evolution_auto_retry_backoff_coordinator',
        evaluate: coordinateEvolutionAutoRetryBackoff,
        toTasks: evolutionAutoRetryBackoffCoordinatorToTasks,
        classRef: EvolutionAutoRetryBackoffCoordinator,
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 976,
        capabilityId: 'evolution_failure_root_cause_miner',
        evaluate: mineEvolutionFailureRootCauses,
        toTasks: evolutionFailureRootCauseMinerToTasks,
        classRef: EvolutionFailureRootCauseMiner,
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 977,
        capabilityId: 'evolution_regression_sentinel',
        evaluate: detectEvolutionRegressions,
        toTasks: evolutionRegressionSentinelToTasks,
        classRef: EvolutionRegressionSentinel,
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 978,
        capabilityId: 'evolution_memory_consolidation_pipeline',
        evaluate: consolidateEvolutionMemory,
        toTasks: evolutionMemoryConsolidationPipelineToTasks,
        classRef: EvolutionMemoryConsolidationPipeline,
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 979,
        capabilityId: 'evolution_knowledge_graph_linker',
        evaluate: linkEvolutionKnowledgeGraph,
        toTasks: evolutionKnowledgeGraphLinkerToTasks,
        classRef: EvolutionKnowledgeGraphLinker,
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
            now: () => 9720000 + index
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
            now: () => 9730000 + index
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
            now: () => 5200000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
