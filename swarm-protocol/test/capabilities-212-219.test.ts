import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 212,
        capabilityId: 'oversight_human_approval_router',
        evaluate: 'routeOversightHumanApprovals',
        toTasks: 'oversightHumanApprovalRouterToTasks',
        className: 'OversightHumanApprovalRouter',
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 213,
        capabilityId: 'oversight_task_handoff_contractor',
        evaluate: 'contractOversightTaskHandoffs',
        toTasks: 'oversightTaskHandoffContractorToTasks',
        className: 'OversightTaskHandoffContractor',
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 214,
        capabilityId: 'oversight_tool_health_monitor',
        evaluate: 'monitorOversightToolHealth',
        toTasks: 'oversightToolHealthMonitorToTasks',
        className: 'OversightToolHealthMonitor',
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 215,
        capabilityId: 'oversight_auto_retry_backoff_coordinator',
        evaluate: 'coordinateOversightAutoRetryBackoff',
        toTasks: 'oversightAutoRetryBackoffCoordinatorToTasks',
        className: 'OversightAutoRetryBackoffCoordinator',
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 216,
        capabilityId: 'oversight_failure_root_cause_miner',
        evaluate: 'mineOversightFailureRootCauses',
        toTasks: 'oversightFailureRootCauseMinerToTasks',
        className: 'OversightFailureRootCauseMiner',
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 217,
        capabilityId: 'oversight_regression_sentinel',
        evaluate: 'detectOversightRegressions',
        toTasks: 'oversightRegressionSentinelToTasks',
        className: 'OversightRegressionSentinel',
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 218,
        capabilityId: 'oversight_memory_consolidation_pipeline',
        evaluate: 'consolidateOversightMemory',
        toTasks: 'oversightMemoryConsolidationPipelineToTasks',
        className: 'OversightMemoryConsolidationPipeline',
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 219,
        capabilityId: 'oversight_knowledge_graph_linker',
        evaluate: 'linkOversightKnowledgeGraph',
        toTasks: 'oversightKnowledgeGraphLinkerToTasks',
        className: 'OversightKnowledgeGraphLinker',
        collectionField: 'entities',
        idField: 'entityId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 85,
        capacity: 42,
        risk: 80,
        impact: 84,
        readiness: 43,
        resilience: 34,
        equity: 56,
        efficiency: 50,
        quality: 58,
        trust: 51,
        opportunity: 83,
        criticality: 96,
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
                    demand: 45,
                    capacity: 95,
                    risk: 16,
                    readiness: 90,
                    resilience: 93,
                    trust: 91,
                    quality: 88,
                    efficiency: 85,
                    criticality: 40
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 21,
                reviewHours: 10
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2030000 + index
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
                    demand: 49,
                    capacity: 97,
                    risk: 14,
                    readiness: 92,
                    resilience: 94,
                    trust: 93,
                    quality: 90,
                    efficiency: 87,
                    criticality: 38
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 48,
                reviewHours: 23
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2040000 + index
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
            now: () => 2050000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
