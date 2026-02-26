import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 252,
        capabilityId: 'collab_human_approval_router',
        evaluate: 'routeCollabHumanApprovals',
        toTasks: 'collabHumanApprovalRouterToTasks',
        className: 'CollabHumanApprovalRouter',
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 253,
        capabilityId: 'collab_task_handoff_contractor',
        evaluate: 'contractCollabTaskHandoffs',
        toTasks: 'collabTaskHandoffContractorToTasks',
        className: 'CollabTaskHandoffContractor',
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 254,
        capabilityId: 'collab_tool_health_monitor',
        evaluate: 'monitorCollabToolHealth',
        toTasks: 'collabToolHealthMonitorToTasks',
        className: 'CollabToolHealthMonitor',
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 255,
        capabilityId: 'collab_auto_retry_backoff_coordinator',
        evaluate: 'coordinateCollabAutoRetryBackoff',
        toTasks: 'collabAutoRetryBackoffCoordinatorToTasks',
        className: 'CollabAutoRetryBackoffCoordinator',
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 256,
        capabilityId: 'collab_failure_root_cause_miner',
        evaluate: 'mineCollabFailureRootCauses',
        toTasks: 'collabFailureRootCauseMinerToTasks',
        className: 'CollabFailureRootCauseMiner',
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 257,
        capabilityId: 'collab_regression_sentinel',
        evaluate: 'detectCollabRegressions',
        toTasks: 'collabRegressionSentinelToTasks',
        className: 'CollabRegressionSentinel',
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 258,
        capabilityId: 'collab_memory_consolidation_pipeline',
        evaluate: 'consolidateCollabMemory',
        toTasks: 'collabMemoryConsolidationPipelineToTasks',
        className: 'CollabMemoryConsolidationPipeline',
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 259,
        capabilityId: 'collab_knowledge_graph_linker',
        evaluate: 'linkCollabKnowledgeGraph',
        toTasks: 'collabKnowledgeGraphLinkerToTasks',
        className: 'CollabKnowledgeGraphLinker',
        collectionField: 'entities',
        idField: 'entityId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 90,
        capacity: 37,
        risk: 85,
        impact: 89,
        readiness: 48,
        resilience: 29,
        equity: 61,
        efficiency: 55,
        quality: 63,
        trust: 56,
        opportunity: 88,
        criticality: 101,
        ...overrides
    };
}

for (const [index, capability] of capabilities.entries()) {
    test(`${capability.number} ${capability.capabilityId} generates capability report`, () => {
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        assert.equal(typeof evaluate, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, `${capability.number}-a`),
                buildEntity(capability.idField, `${capability.number}-b`, {
                    demand: 40,
                    capacity: 100,
                    risk: 11,
                    readiness: 95,
                    resilience: 98,
                    trust: 96,
                    quality: 93,
                    efficiency: 90,
                    criticality: 35
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 26,
                reviewHours: 15
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2180000 + index
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
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        const toTasks = swarm[capability.toTasks as keyof typeof swarm];
        const ManagerClass = swarm[capability.className as keyof typeof swarm];

        assert.equal(typeof evaluate, 'function');
        assert.equal(typeof toTasks, 'function');
        assert.equal(typeof ManagerClass, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, `${capability.number}-x`),
                buildEntity(capability.idField, `${capability.number}-y`, {
                    demand: 44,
                    capacity: 102,
                    risk: 9,
                    readiness: 97,
                    resilience: 99,
                    trust: 98,
                    quality: 95,
                    efficiency: 92,
                    criticality: 33
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 58,
                reviewHours: 28
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2190000 + index
        });
        const tasks = (toTasks as (reportPayload: unknown, options: unknown) => any[])(report, {
            fromAgentId: 'agent:test-runner'
        });

        assert.equal(tasks.length > 0, true);
        assert.equal(tasks[0].kind, 'task_request');
        assert.equal(tasks[0].from, 'agent:test-runner');

        const ManagerCtor = ManagerClass as new (options: unknown) => {
            evaluate: (input: unknown) => any;
            buildTasks: (reportPayload: unknown) => any[];
            listHistory: (options: { limit: number }) => unknown[];
        };
        const manager = new ManagerCtor({
            localAgentId: 'agent:manager-local',
            now: () => 2200000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
