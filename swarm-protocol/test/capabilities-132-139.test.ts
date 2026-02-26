import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 132,
        capabilityId: 'tooling_human_approval_router',
        evaluate: 'routeToolingHumanApprovals',
        toTasks: 'toolingHumanApprovalRouterToTasks',
        className: 'ToolingHumanApprovalRouter',
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 133,
        capabilityId: 'tooling_task_handoff_contractor',
        evaluate: 'contractToolingTaskHandoffs',
        toTasks: 'toolingTaskHandoffContractorToTasks',
        className: 'ToolingTaskHandoffContractor',
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 134,
        capabilityId: 'tooling_tool_health_monitor',
        evaluate: 'monitorToolingToolHealth',
        toTasks: 'toolingToolHealthMonitorToTasks',
        className: 'ToolingToolHealthMonitor',
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 135,
        capabilityId: 'tooling_auto_retry_backoff_coordinator',
        evaluate: 'coordinateToolingAutoRetryBackoff',
        toTasks: 'toolingAutoRetryBackoffToTasks',
        className: 'ToolingAutoRetryBackoffCoordinator',
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 136,
        capabilityId: 'tooling_failure_root_cause_miner',
        evaluate: 'mineToolingFailureRootCauses',
        toTasks: 'toolingFailureRootCauseMinerToTasks',
        className: 'ToolingFailureRootCauseMiner',
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 137,
        capabilityId: 'tooling_regression_sentinel',
        evaluate: 'detectToolingRegression',
        toTasks: 'toolingRegressionSentinelToTasks',
        className: 'ToolingRegressionSentinel',
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 138,
        capabilityId: 'tooling_memory_consolidation_pipeline',
        evaluate: 'consolidateToolingMemory',
        toTasks: 'toolingMemoryConsolidationToTasks',
        className: 'ToolingMemoryConsolidationPipeline',
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 139,
        capabilityId: 'tooling_knowledge_graph_linker',
        evaluate: 'linkToolingKnowledgeGraph',
        toTasks: 'toolingKnowledgeGraphLinkerToTasks',
        className: 'ToolingKnowledgeGraphLinker',
        collectionField: 'entities',
        idField: 'entityId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 80,
        capacity: 42,
        risk: 70,
        impact: 85,
        readiness: 46,
        resilience: 40,
        equity: 59,
        efficiency: 53,
        quality: 60,
        trust: 54,
        opportunity: 74,
        criticality: 87,
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
                    demand: 44,
                    capacity: 86,
                    risk: 26,
                    readiness: 80,
                    resilience: 84,
                    trust: 82,
                    quality: 78,
                    efficiency: 76,
                    criticality: 52
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 16,
                reviewHours: 6
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1730000 + index
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
                    demand: 48,
                    capacity: 88,
                    risk: 22,
                    readiness: 84,
                    resilience: 86,
                    trust: 85,
                    quality: 82,
                    efficiency: 79,
                    criticality: 47
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 18
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1740000 + index
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
            now: () => 1750000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
