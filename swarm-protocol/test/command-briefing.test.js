import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CommandBriefingCenter,
    buildCommandBrief,
    commandBriefToMarkdown,
    commandBriefToTaskRequests
} from '../index.js';

test('buildCommandBrief returns normal severity for stable signals', () => {
    const brief = buildCommandBrief({
        readinessReport: {
            status: 'ready',
            readinessScore: 97,
            summary: {
                missingCapabilityCount: 0,
                sandboxGapCount: 0,
                approvalRequiredCount: 0,
                approvalErrorCount: 0
            },
            remediation: []
        },
        governorDecision: {
            mode: 'normal',
            riskScore: 12,
            reasons: [],
            recommendedActions: []
        },
        driftReport: {
            alerts: []
        },
        incidents: []
    });

    assert.equal(brief.severity, 'normal');
    assert.equal(brief.summary.actionCount, 0);
    assert.ok(brief.headline.toLowerCase().includes('stable'));
});

test('buildCommandBrief returns critical severity and merges actions under severe risk', () => {
    const brief = buildCommandBrief({
        readinessReport: {
            status: 'blocked',
            readinessScore: 43,
            summary: {
                missingCapabilityCount: 2,
                sandboxGapCount: 1,
                approvalRequiredCount: 6,
                approvalErrorCount: 0
            },
            remediation: [
                {
                    code: 'missing_capability',
                    title: 'Provision capability "deploy"',
                    description: 'No provider available for deploy capability.',
                    priority: 'P1'
                }
            ]
        },
        governorDecision: {
            mode: 'halted',
            riskScore: 89,
            reasons: [
                {
                    source: 'readiness',
                    code: 'mission_blocked',
                    weight: 45,
                    detail: 'mission readiness blocked'
                }
            ],
            recommendedActions: [
                {
                    type: 'emergency_freeze',
                    title: 'Apply temporary execution freeze',
                    description: 'Halted mode requires freeze.',
                    priority: 'P0'
                }
            ]
        },
        driftReport: {
            alerts: [
                {
                    code: 'optimizer_latency_regression',
                    priority: 'P1',
                    summary: 'Latency regression detected'
                }
            ]
        },
        incidents: [
            {
                code: 'timeout_spike',
                priority: 'P1',
                summary: 'Timeouts exceeded threshold'
            }
        ]
    });

    assert.equal(brief.severity, 'critical');
    assert.ok(brief.summary.actionCount >= 2);
    assert.ok(brief.actions.some((action) => action.code === 'missing_capability'));
    assert.ok(brief.actions.some((action) => action.code === 'emergency_freeze'));
    assert.ok(brief.concerns.length > 0);
});

test('commandBriefToMarkdown renders key sections', () => {
    const brief = buildCommandBrief({
        readinessReport: {
            status: 'needs_attention',
            readinessScore: 80,
            remediation: []
        },
        governorDecision: {
            mode: 'degraded',
            riskScore: 38,
            reasons: [],
            recommendedActions: []
        },
        driftAlerts: [
            { code: 'skill_success_rate_drop', priority: 'P2' }
        ],
        incidents: []
    });

    const markdown = commandBriefToMarkdown(brief);
    assert.ok(markdown.includes('# Command Briefing'));
    assert.ok(markdown.includes('## Top Concerns'));
    assert.ok(markdown.includes('## Recommended Actions'));
});

test('commandBriefToTaskRequests and CommandBriefingCenter produce schema-valid tasks and history', () => {
    const center = new CommandBriefingCenter({
        localAgentId: 'agent:briefing',
        now: () => 9_000
    });

    const brief = center.createBrief({
        readinessReport: {
            status: 'blocked',
            readinessScore: 39,
            remediation: [
                {
                    code: 'missing_sandbox_profile',
                    title: 'Register sandbox profile',
                    description: 'Profile missing for privileged steps.',
                    priority: 'P1'
                }
            ]
        },
        governorDecision: {
            mode: 'halted',
            riskScore: 92,
            reasons: [],
            recommendedActions: [
                {
                    type: 'invoke_recovery_supervisor',
                    title: 'Invoke recovery supervisor',
                    description: 'Generate recovery tasks.',
                    priority: 'P1'
                }
            ]
        },
        incidents: [
            {
                code: 'dispatch_error_cluster',
                priority: 'P1',
                summary: 'Dispatch errors observed'
            }
        ]
    });

    const tasks = commandBriefToTaskRequests(brief, {
        fromAgentId: 'agent:planner'
    });
    const centerTasks = center.buildActionTasks(brief);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].context.briefingSeverity, 'string');

    assert.ok(centerTasks.length > 0);
    assert.equal(centerTasks[0].from, 'agent:briefing');
    assert.equal(center.listHistory({ limit: 3 }).length, 1);
});
