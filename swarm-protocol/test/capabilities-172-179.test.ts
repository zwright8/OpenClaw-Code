import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 172,
        capabilityId: 'governance_human_approval_router',
        evaluate: 'routeGovernanceHumanApprovals',
        toTasks: 'governanceHumanApprovalRouterToTasks',
        className: 'GovernanceHumanApprovalRouter',
        collectionField: 'approvalItems',
        idField: 'approvalId'
    },
    {
        number: 173,
        capabilityId: 'governance_task_handoff_contractor',
        evaluate: 'contractGovernanceTaskHandoffs',
        toTasks: 'governanceTaskHandoffContractorToTasks',
        className: 'GovernanceTaskHandoffContractor',
        collectionField: 'handoffs',
        idField: 'handoffId'
    },
    {
        number: 174,
        capabilityId: 'governance_tool_health_monitor',
        evaluate: 'monitorGovernanceToolHealth',
        toTasks: 'governanceToolHealthMonitorToTasks',
        className: 'GovernanceToolHealthMonitor',
        collectionField: 'tools',
        idField: 'toolId'
    },
    {
        number: 175,
        capabilityId: 'governance_auto_retry_backoff_coordinator',
        evaluate: 'coordinateGovernanceAutoRetryBackoff',
        toTasks: 'governanceAutoRetryBackoffCoordinatorToTasks',
        className: 'GovernanceAutoRetryBackoffCoordinator',
        collectionField: 'retryPlans',
        idField: 'planId'
    },
    {
        number: 176,
        capabilityId: 'governance_failure_root_cause_miner',
        evaluate: 'mineGovernanceFailureRootCauses',
        toTasks: 'governanceFailureRootCauseMinerToTasks',
        className: 'GovernanceFailureRootCauseMiner',
        collectionField: 'failures',
        idField: 'failureId'
    },
    {
        number: 177,
        capabilityId: 'governance_regression_sentinel',
        evaluate: 'detectGovernanceRegressions',
        toTasks: 'governanceRegressionSentinelToTasks',
        className: 'GovernanceRegressionSentinel',
        collectionField: 'regressionChecks',
        idField: 'checkId'
    },
    {
        number: 178,
        capabilityId: 'governance_memory_consolidation_pipeline',
        evaluate: 'consolidateGovernanceMemory',
        toTasks: 'governanceMemoryConsolidationPipelineToTasks',
        className: 'GovernanceMemoryConsolidationPipeline',
        collectionField: 'memoryBatches',
        idField: 'batchId'
    },
    {
        number: 179,
        capabilityId: 'governance_knowledge_graph_linker',
        evaluate: 'linkGovernanceKnowledgeGraph',
        toTasks: 'governanceKnowledgeGraphLinkerToTasks',
        className: 'GovernanceKnowledgeGraphLinker',
        collectionField: 'entities',
        idField: 'entityId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 83,
        capacity: 45,
        risk: 75,
        impact: 81,
        readiness: 41,
        resilience: 35,
        equity: 54,
        efficiency: 48,
        quality: 56,
        trust: 49,
        opportunity: 79,
        criticality: 91,
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
                    demand: 48,
                    capacity: 90,
                    risk: 21,
                    readiness: 85,
                    resilience: 88,
                    trust: 86,
                    quality: 83,
                    efficiency: 80,
                    criticality: 45
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 16,
                reviewHours: 6
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1880000 + index
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
                    demand: 52,
                    capacity: 92,
                    risk: 18,
                    readiness: 87,
                    resilience: 89,
                    trust: 88,
                    quality: 85,
                    efficiency: 82,
                    criticality: 43
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 18
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1890000 + index
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
            now: () => 1900000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
