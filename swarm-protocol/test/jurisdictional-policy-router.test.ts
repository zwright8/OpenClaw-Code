import test from 'node:test';
import assert from 'node:assert/strict';
import {
    routeJurisdictionalPolicies,
    jurisdictionRoutesToTasks,
    JurisdictionalPolicyRouter
} from '../index.js';

function baseInput() {
    return {
        policies: [
            {
                id: 'policy-us-deny-self-harm',
                jurisdictions: ['US'],
                priority: 90,
                decision: 'deny',
                condition: {
                    riskTagsAny: ['self_harm']
                },
                dataResidency: 'US'
            },
            {
                id: 'policy-us-approval-shell',
                jurisdictions: ['US'],
                priority: 78,
                decision: 'require_approval',
                condition: {
                    capabilitiesAny: ['destructive_shell']
                }
            },
            {
                id: 'policy-us-allow-self-harm',
                jurisdictions: ['US'],
                priority: 60,
                decision: 'allow',
                condition: {
                    riskTagsAny: ['self_harm']
                }
            }
        ],
        requests: [
            {
                requestId: 'req-1',
                jurisdiction: 'US',
                task: 'Handle dangerous request',
                riskTags: ['self_harm'],
                capabilities: ['analysis'],
                dataClasses: ['sensitive'],
                dataResidence: 'EU',
                priority: 'critical'
            },
            {
                requestId: 'req-2',
                jurisdiction: 'EU',
                task: 'General task',
                riskTags: ['normal'],
                capabilities: ['analysis'],
                dataClasses: ['public'],
                dataResidence: 'EU',
                priority: 'normal'
            }
        ]
    };
}

test('routeJurisdictionalPolicies detects conflicts, residency issues, and missing jurisdiction coverage', () => {
    const report = routeJurisdictionalPolicies(baseInput(), {
        now: () => 600_000
    });

    assert.equal(report.summary.requestCount, 2);
    assert.equal(report.summary.conflictCount >= 1, true);
    assert.equal(report.summary.blockedCount >= 1, true);
    assert.equal(report.alerts.includes('jurisdiction_policy_missing'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'resolve_jurisdiction_conflict'), true);
});

test('routeJurisdictionalPolicies routes cleanly when policy set is non-conflicting and complete', () => {
    const report = routeJurisdictionalPolicies({
        policies: [
            {
                id: 'policy-global-allow',
                jurisdictions: ['global'],
                priority: 50,
                decision: 'allow'
            }
        ],
        requests: [
            {
                requestId: 'req-ok',
                jurisdiction: 'CA',
                riskTags: ['normal'],
                capabilities: ['analysis'],
                dataClasses: ['public'],
                dataResidence: 'CA',
                priority: 'normal'
            }
        ]
    }, {
        now: () => 601_000
    });

    assert.equal(report.summary.blockedCount, 0);
    assert.equal(report.summary.reviewRequiredCount, 0);
    assert.equal(report.routes[0].posture, 'routed');
});

test('jurisdictionRoutesToTasks and class wrapper emit schema-valid tasks and history', () => {
    const router = new JurisdictionalPolicyRouter({
        localAgentId: 'agent:jurisdiction-local',
        now: () => 602_000
    });

    const report = router.evaluate(baseInput());
    const tasks = jurisdictionRoutesToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = router.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:jurisdiction-local');
    assert.equal(router.listHistory({ limit: 5 }).length, 1);
});
