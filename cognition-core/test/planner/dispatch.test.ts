import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDispatchJournalEntries, dispatchArtifacts } from '../../scripts/dispatch.ts';

const TASK_A_ID = '0ede65cb-64c1-59a1-b7e5-24331a820ec1';
const TASK_B_ID = 'a941db54-6228-585f-8196-523cae4c5751';

function buildDag() {
    return {
        version: 1,
        generatedAt: '2026-02-28T06:22:10.592Z',
        tasks: [
            {
                taskId: TASK_A_ID,
                recommendationId: 'rec-observability-baseline',
                title: 'Establish cognition execution baseline telemetry',
                priority: 'P1',
                priorityScore: 1,
                riskTier: 'medium',
                owner: 'agent:observability',
                dependencies: [],
                dependencyRecommendationIds: [],
                actions: ['enable planner telemetry counters'],
                successCriteria: ['planner telemetry appears in daily report'],
                rollbackPlan: {
                    trigger: 'Telemetry ingestion introduces regression',
                    owner: 'agent:observability',
                    steps: ['disable planner telemetry flag'],
                    dataRecovery: null
                },
                policyGate: {
                    riskTier: 'medium',
                    requiresHumanApproval: false,
                    approvalStatus: null,
                    approvalMarkerPresent: false,
                    gatePassed: true,
                    passthrough: null
                },
                source: { recommendationId: 'rec-observability-baseline' }
            },
            {
                taskId: TASK_B_ID,
                recommendationId: 'rec-policy-gating-hardening',
                title: 'Enforce policy gate propagation for high-risk tasks',
                priority: 'P1',
                priorityScore: 1,
                riskTier: 'high',
                owner: null,
                dependencies: [TASK_A_ID],
                dependencyRecommendationIds: ['rec-observability-baseline'],
                actions: ['propagate approval metadata into packaged swarm tasks'],
                successCriteria: ['pending approvals are reported as blocked'],
                rollbackPlan: {
                    trigger: 'Regression, policy breach, or failed verification',
                    owner: null,
                    steps: ['Disable or revert the change'],
                    dataRecovery: null
                },
                policyGate: {
                    riskTier: 'high',
                    requiresHumanApproval: true,
                    approvalStatus: 'pending',
                    approvalMarkerPresent: true,
                    gatePassed: false,
                    passthrough: {
                        requiredApprovers: ['security-ops']
                    }
                },
                source: { recommendationId: 'rec-policy-gating-hardening' }
            }
        ],
        edges: [
            {
                id: `${TASK_A_ID}->${TASK_B_ID}`,
                from: TASK_A_ID,
                to: TASK_B_ID,
                kind: 'depends_on'
            }
        ],
        summary: {
            taskCount: 2,
            edgeCount: 1,
            approvalRequiredCount: 1,
            approvalPendingCount: 1,
            gateBlockedCount: 1,
            rootTaskCount: 1,
            maxDepth: 1
        }
    };
}

test('buildDispatchJournalEntries dispatches gate-passed task requests and blocks pending approvals', () => {
    const dag = buildDag();
    const packaged = {
        version: 1,
        generatedAt: '2026-02-28T06:22:10.594Z',
        requests: [
            {
                kind: 'task_request',
                id: TASK_A_ID,
                from: 'agent:cognition-core',
                target: 'agent:ops',
                priority: 'high',
                task: '[P1] Baseline telemetry',
                context: {
                    planner: 'cognition-core/task-packager',
                    recommendationId: 'rec-observability-baseline'
                },
                createdAt: 100
            },
            {
                kind: 'task_request',
                id: TASK_B_ID,
                from: 'agent:cognition-core',
                target: 'agent:ops:high-risk',
                priority: 'high',
                task: '[P1] Policy gating hardening',
                context: {
                    recommendationId: 'rec-policy-gating-hardening',
                    policyGate: {
                        requiresHumanApproval: true,
                        approvalStatus: 'pending',
                        gatePassed: false
                    }
                },
                createdAt: 101
            }
        ],
        blocked: [],
        stats: {
            totalTasks: 2,
            packagedTasks: 2,
            blockedTasks: 0,
            approvalRequiredCount: 1
        }
    };

    const built = buildDispatchJournalEntries(dag as never, packaged as never, {
        blockedCreatedAtBase: 5_000
    });

    assert.equal(built.dispatchEntries.length, 1);
    assert.equal(built.blockedEntries.length, 1);
    assert.equal(built.dispatchEntries[0].id, TASK_A_ID);

    const dispatchContext = built.dispatchEntries[0].context as Record<string, unknown>;
    assert.deepEqual(dispatchContext.successCriteria, ['planner telemetry appears in daily report']);
    assert.deepEqual(dispatchContext.rollbackPlan, {
        trigger: 'Telemetry ingestion introduces regression',
        owner: 'agent:observability',
        steps: ['disable planner telemetry flag'],
        dataRecovery: null
    });

    assert.equal(built.blockedEntries[0].taskId, TASK_B_ID);
    assert.equal(built.blockedEntries[0].reason, 'awaiting_human_approval');
    assert.equal(built.blockedEntries[0].blockedSource, 'dispatch_request');
    assert.equal(built.blockedEntries[0].approvalFlow.approvalStatus, 'pending');
    assert.equal(built.blockedEntries[0].approvalFlow.requiresHumanApproval, true);

    const blockedContext = built.blockedEntries[0].context as Record<string, unknown>;
    const blockedApprovalFlow = blockedContext.approvalFlow as Record<string, unknown>;
    assert.equal(blockedApprovalFlow.approvalStatus, 'pending');

    assert.deepEqual(built.stats.blockedByReason, { awaiting_human_approval: 1 });
    assert.deepEqual(built.stats.blockedBySource, { dispatch_request: 1 });
    assert.deepEqual(built.stats.blockedByApprovalStatus, { pending: 1 });
    assert.equal(built.stats.blockedApprovalRequiredCount, 1);
});

test('dispatchArtifacts appends dispatchable and blocked journal entries and writes report stats', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cognition-dispatch-'));

    const taskDagPath = path.join(tmpDir, 'skills', 'state', 'cognition-task-dag.json');
    const taskPackagePath = path.join(tmpDir, 'reports', 'cognition-task-package.json');
    const journalPath = path.join(tmpDir, 'swarm-protocol', 'state', 'tasks.journal.jsonl');
    const reportPath = path.join(tmpDir, 'cognition-core', 'reports', 'cognition-dispatch.report.json');

    fs.mkdirSync(path.dirname(taskDagPath), { recursive: true });
    fs.mkdirSync(path.dirname(taskPackagePath), { recursive: true });

    const dag = buildDag();
    const packaged = {
        version: 1,
        generatedAt: '2026-02-28T06:22:10.594Z',
        requests: [
            {
                kind: 'task_request',
                id: TASK_A_ID,
                from: 'agent:cognition-core',
                target: 'agent:ops',
                priority: 'high',
                task: '[P1] Baseline telemetry',
                context: {
                    recommendationId: 'rec-observability-baseline'
                },
                createdAt: 100
            }
        ],
        blocked: [
            {
                taskId: TASK_B_ID,
                recommendationId: 'rec-policy-gating-hardening',
                reason: 'awaiting_human_approval',
                policyGate: {
                    riskTier: 'high',
                    requiresHumanApproval: true,
                    approvalStatus: 'pending',
                    gatePassed: false,
                    passthrough: {
                        requiredApprovers: ['security-ops']
                    }
                },
                dependencies: [TASK_A_ID]
            }
        ],
        stats: {
            totalTasks: 2,
            packagedTasks: 1,
            blockedTasks: 1,
            approvalRequiredCount: 1
        }
    };

    fs.writeFileSync(taskDagPath, `${JSON.stringify(dag, null, 2)}\n`);
    fs.writeFileSync(taskPackagePath, `${JSON.stringify(packaged, null, 2)}\n`);

    const result = dispatchArtifacts({
        taskDagPath,
        taskPackagePath,
        journalPath,
        reportPath,
        now: () => 20_000
    });

    assert.equal(result.dispatchCount, 1);
    assert.equal(result.blockedCount, 1);
    assert.equal(result.appendedEntries, 2);

    const journalLines = fs.readFileSync(journalPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.equal(journalLines.length, 2);
    assert.equal(journalLines[0].kind, 'task_request');
    assert.equal(journalLines[1].kind, 'task_blocked');
    assert.equal(journalLines[1].blockedSource, 'task_package_blocked');
    assert.equal(journalLines[1].approvalFlow.approvalStatus, 'pending');

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(report.stats.dispatchCount, 1);
    assert.equal(report.stats.blockedCount, 1);
    assert.equal(report.stats.appendedEntries, 2);
    assert.equal(report.stats.blockedApprovalRequiredCount, 1);
    assert.deepEqual(report.stats.blockedByReason, { awaiting_human_approval: 1 });
    assert.deepEqual(report.stats.blockedBySource, { task_package_blocked: 1 });
    assert.deepEqual(report.stats.blockedByApprovalStatus, { pending: 1 });

    assert.equal(report.approvalFlow.pendingCount, 1);
    assert.deepEqual(report.approvalFlow.pendingTaskIds, [TASK_B_ID]);
    assert.deepEqual(report.approvalFlow.requiredApprovers, [
        {
            approver: 'security-ops',
            blockedTaskCount: 1
        }
    ]);

    assert.deepEqual(report.blockedEntries, [
        {
            taskId: TASK_B_ID,
            recommendationId: 'rec-policy-gating-hardening',
            reason: 'awaiting_human_approval',
            blockedSource: 'task_package_blocked',
            approvalFlow: {
                requiresHumanApproval: true,
                approvalStatus: 'pending',
                gatePassed: false,
                approvalMarkerPresent: null,
                riskTier: 'high',
                requiredApprovers: ['security-ops']
            }
        }
    ]);

    fs.rmSync(tmpDir, { recursive: true, force: true });
});
