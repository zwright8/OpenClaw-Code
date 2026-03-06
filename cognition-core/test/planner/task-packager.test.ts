import test from 'node:test';
import assert from 'node:assert/strict';
import { compileRecommendationDag } from '../../src/planner/dag-compiler.js';
import { packageDagForSwarm } from '../../src/planner/task-packager.js';

const RECOMMENDATIONS = [
    {
        recommendationId: 'rec-low',
        title: 'Refresh dashboard copy',
        priority: 'P3',
        riskTier: 'low',
        requiresHumanApproval: false,
        actions: ['publish dashboard copy refresh'],
        successCriteria: ['copy update visible in production']
    },
    {
        recommendationId: 'rec-high',
        title: 'Rotate execution credentials',
        priority: 'P1',
        riskTier: 'high',
        requiresHumanApproval: true,
        approvalStatus: 'pending',
        policyGate: {
            requiredApprovers: ['security-ops']
        },
        actions: ['rotate secret bundle'],
        successCriteria: ['credential hash updated and validated']
    }
];

test('packageDagForSwarm blocks pending approvals by default and preserves policy metadata', () => {
    const dag = compileRecommendationDag(RECOMMENDATIONS, {
        generatedAt: '2026-02-28T05:10:00.000Z'
    });

    const packaged = packageDagForSwarm(dag, {
        fromAgentId: 'agent:cognition',
        defaultTarget: 'agent:ops',
        createdAtBase: 1_000
    });

    assert.equal(packaged.requests.length, 1);
    assert.equal(packaged.blocked.length, 1);
    assert.equal(packaged.blocked[0].recommendationId, 'rec-high');
    assert.equal(packaged.blocked[0].policyGate.approvalStatus, 'pending');

    const request = packaged.requests[0];
    assert.equal(request.from, 'agent:cognition');
    assert.equal(request.context.policyGate.requiresHumanApproval, false);
    assert.equal(request.createdAt, 1_001);
});

test('packageDagForSwarm can include pending approvals and passes gate through context', () => {
    const dag = compileRecommendationDag(RECOMMENDATIONS, {
        generatedAt: '2026-02-28T05:11:00.000Z'
    });

    const packaged = packageDagForSwarm(dag, {
        includeApprovalPending: true,
        createdAtBase: 2_000
    });

    assert.equal(packaged.requests.length, 2);
    const highRiskRequest = packaged.requests.find((request) => request.context.recommendationId === 'rec-high');

    assert.ok(highRiskRequest);
    assert.equal(highRiskRequest?.context.policyGate.requiresHumanApproval, true);
    assert.equal(highRiskRequest?.context.policyGate.approvalStatus, 'pending');
    assert.deepEqual(highRiskRequest?.context.policyGate.passthrough, {
        requiredApprovers: ['security-ops']
    });
    assert.ok(highRiskRequest?.constraints?.includes('human-approval-required'));
});
