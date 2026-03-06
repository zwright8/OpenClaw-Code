import test from 'node:test';
import assert from 'node:assert/strict';
import {
    assertValidDag,
    compileRecommendationDag,
    validateDag
} from '../../src/planner/dag-compiler.js';

test('compileRecommendationDag builds deterministic dependencies and success criteria', () => {
    const recommendations = [
        {
            recommendationId: 'rec-002',
            title: 'Deploy retry guardrails',
            priority: 'P2',
            riskTier: 'high',
            requiresHumanApproval: true,
            approvalStatus: 'approved',
            dependsOn: ['rec-001'],
            actions: ['apply retry backoff'],
            verificationPlan: {
                checks: ['error rate drops below 2%']
            }
        },
        {
            recommendationId: 'rec-001',
            title: 'Baseline instrumentation',
            priority: 'P1',
            riskTier: 'medium',
            actions: ['enable telemetry export'],
            successCriteria: ['telemetry stream has no gaps']
        }
    ];

    const dag = compileRecommendationDag(recommendations, {
        generatedAt: '2026-02-28T05:00:00.000Z'
    });

    assert.equal(dag.tasks.length, 2);
    assert.equal(dag.edges.length, 1);

    const root = dag.tasks.find((task) => task.recommendationId === 'rec-001');
    const dependent = dag.tasks.find((task) => task.recommendationId === 'rec-002');

    assert.ok(root);
    assert.ok(dependent);
    assert.equal(root?.dependencies.length, 0);
    assert.deepEqual(dependent?.dependencyRecommendationIds, ['rec-001']);
    assert.deepEqual(dependent?.successCriteria, ['error rate drops below 2%']);
    assert.equal(dag.summary.maxDepth, 1);

    assert.doesNotThrow(() => assertValidDag(dag));
    assert.equal(validateDag(dag).valid, true);
});

test('compileRecommendationDag rejects cyclic dependency graphs', () => {
    const recommendations = [
        {
            recommendationId: 'rec-a',
            title: 'Task A',
            dependsOn: ['rec-b']
        },
        {
            recommendationId: 'rec-b',
            title: 'Task B',
            dependsOn: ['rec-a']
        }
    ];

    assert.throws(
        () => compileRecommendationDag(recommendations),
        /Cycle detected/
    );
});
