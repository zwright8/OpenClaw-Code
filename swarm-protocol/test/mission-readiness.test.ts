import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MissionReadinessGate,
    assessMissionReadiness,
    buildReadinessTasks,
    compileMissionPlan
} from '../index.js';

function fullSandboxProfiles() {
    return [
        {
            id: 'strict-readonly',
            allowedCapabilities: ['analysis', 'read', 'reasoning'],
            blockedRiskTags: ['production', 'security'],
            requiresEscalation: false
        },
        {
            id: 'balanced-tooling',
            allowedCapabilities: ['analysis', 'reporting', 'review', 'planning', 'web-search'],
            blockedRiskTags: [],
            requiresEscalation: false
        },
        {
            id: 'privileged-controlled',
            allowedCapabilities: ['operations', 'deploy', 'analysis', 'reporting', 'review'],
            blockedRiskTags: [],
            requiresEscalation: true
        }
    ];
}

test('assessMissionReadiness returns ready when mission is executable within constraints', () => {
    const missionPlan = compileMissionPlan({
        objective: 'Generate weekly reliability analysis report for API latency'
    });

    const report = assessMissionReadiness({
        missionPlan,
        agents: [
            {
                id: 'agent:analyst',
                status: 'idle',
                capabilities: ['analysis', 'reporting', 'review']
            },
            {
                id: 'agent:backup',
                status: 'busy',
                capabilities: ['analysis', 'reporting']
            }
        ],
        skills: [
            {
                id: 'skill:review-fast',
                status: 'active',
                capabilities: ['review'],
                costUsdPerTask: 1.1
            }
        ],
        sandboxProfiles: fullSandboxProfiles(),
        maxEstimatedCostUsd: 120,
        maxEstimatedDurationMs: 120_000
    });

    assert.equal(report.status, 'ready');
    assert.equal(report.summary.missingCapabilityCount, 0);
    assert.equal(report.summary.sandboxGapCount, 0);
    assert.equal(report.checks.budget.ok, true);
    assert.equal(report.checks.duration.ok, true);
    assert.ok(report.readinessScore >= 90);
});

test('assessMissionReadiness blocks mission on missing capability providers and sandbox profile gaps', () => {
    const missionPlan = compileMissionPlan({
        objective: 'Deploy production migration for billing service'
    });

    const report = assessMissionReadiness({
        missionPlan,
        agents: [
            {
                id: 'agent:analysis',
                status: 'idle',
                capabilities: ['analysis']
            }
        ],
        skills: [
            {
                id: 'skill:reporting',
                status: 'active',
                capabilities: ['reporting'],
                costUsdPerTask: 1.7
            }
        ],
        sandboxProfiles: [
            {
                id: 'strict-readonly',
                allowedCapabilities: ['analysis'],
                blockedRiskTags: ['production', 'security'],
                requiresEscalation: false
            },
            {
                id: 'balanced-tooling',
                allowedCapabilities: ['analysis', 'reporting'],
                blockedRiskTags: [],
                requiresEscalation: false
            }
        ]
    });

    assert.equal(report.status, 'blocked');
    assert.ok(report.summary.missingCapabilityCount > 0);
    assert.ok(report.summary.sandboxGapCount > 0);
    assert.ok(report.remediation.some((item) => item.code === 'missing_capability'));
    assert.ok(report.remediation.some((item) => item.code === 'missing_sandbox_profile'));
});

test('assessMissionReadiness reports needs_attention when budget and duration ceilings are exceeded', () => {
    const missionPlan = compileMissionPlan({
        objective: 'Summarize onboarding funnel performance and recommendations'
    });

    const report = assessMissionReadiness({
        missionPlan,
        agents: [
            {
                id: 'agent:analyst',
                status: 'idle',
                capabilities: ['analysis', 'reporting', 'review']
            }
        ],
        sandboxProfiles: fullSandboxProfiles(),
        maxEstimatedCostUsd: 1,
        maxEstimatedDurationMs: 1_000
    });

    assert.equal(report.status, 'needs_attention');
    assert.equal(report.checks.budget.ok, false);
    assert.equal(report.checks.duration.ok, false);
    assert.ok(report.remediation.some((item) => item.code === 'budget_overrun'));
    assert.ok(report.remediation.some((item) => item.code === 'duration_overrun'));
});

test('buildReadinessTasks and MissionReadinessGate emit schema-valid remediation tasks and retain history', () => {
    const missionPlan = compileMissionPlan({
        objective: 'Deploy production migration for billing service'
    });

    const gate = new MissionReadinessGate({
        localAgentId: 'agent:readiness-gate',
        now: () => 5_000
    });

    const report = gate.assess({
        missionPlan,
        agents: [
            {
                id: 'agent:analysis',
                status: 'idle',
                capabilities: ['analysis']
            }
        ],
        sandboxProfiles: [
            {
                id: 'strict-readonly',
                allowedCapabilities: ['analysis'],
                blockedRiskTags: ['production', 'security'],
                requiresEscalation: false
            }
        ]
    });

    const tasks = buildReadinessTasks(report, {
        fromAgentId: 'agent:planner',
        defaultTarget: 'agent:ops'
    });
    const gateTasks = gate.buildRemediationTasks(report);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].context.remediationCode, 'string');

    assert.ok(gateTasks.length > 0);
    assert.equal(gateTasks[0].from, 'agent:readiness-gate');
    assert.equal(gate.listHistory({ limit: 5 }).length, 1);
});
