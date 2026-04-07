import test from 'node:test';
import assert from 'node:assert/strict';
import {
    compileGovernanceRules,
    governanceRulesToTasks,
    GovernanceRuleCompiler
} from '../index.js';

function baseInput() {
    return {
        intents: [
            {
                id: 'intent-deny-self-harm',
                name: 'Deny self-harm workflows',
                scope: 'global',
                severity: 'critical',
                priority: 92,
                condition: {
                    riskTagsAny: ['self_harm'],
                    prioritiesAny: ['critical', 'high']
                },
                action: {
                    decision: 'deny',
                    redactFields: ['sensitivePrompt']
                }
            },
            {
                id: 'intent-review-critical-shell',
                name: 'Review critical shell actions',
                scope: 'global',
                severity: 'high',
                priority: 84,
                condition: {
                    capabilitiesAny: ['destructive_shell'],
                    prioritiesAny: ['critical'],
                    requiresApproval: true
                },
                action: {
                    decision: 'require_approval',
                    reviewerGroup: 'ops-review',
                    sandboxProfile: 'restricted'
                }
            },
            {
                id: 'intent-allow-self-harm-exception',
                name: 'Allow self-harm exception',
                scope: 'global',
                severity: 'high',
                priority: 70,
                condition: {
                    riskTagsAny: ['self_harm'],
                    prioritiesAny: ['critical']
                },
                action: {
                    decision: 'allow'
                }
            }
        ]
    };
}

test('compileGovernanceRules builds executable rules and surfaces conflicts', () => {
    const report = compileGovernanceRules(baseInput(), {
        now: () => 400_000
    });

    assert.equal(report.summary.ruleCount, 3);
    assert.equal(report.summary.conflictCount >= 1, true);
    assert.equal(report.alerts.includes('governance_rule_conflict_detected'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'resolve_rule_conflict'), true);
});

test('compileGovernanceRules returns compiled posture for non-conflicting intents', () => {
    const report = compileGovernanceRules({
        intents: [
            {
                id: 'intent-a',
                name: 'Deny fraud risk',
                scope: 'global',
                severity: 'high',
                priority: 80,
                condition: {
                    riskTagsAny: ['fraud']
                },
                action: {
                    decision: 'deny'
                }
            },
            {
                id: 'intent-b',
                name: 'Require approval for privileged shell',
                scope: 'global',
                severity: 'high',
                priority: 72,
                condition: {
                    capabilitiesAny: ['destructive_shell']
                },
                action: {
                    decision: 'require_approval',
                    reviewerGroup: 'ops'
                }
            }
        ]
    }, {
        now: () => 401_000
    });

    assert.equal(report.summary.conflictCount, 0);
    assert.equal(report.summary.posture, 'compiled');
    assert.equal(report.recommendations.some((entry) => entry.type === 'activate_compiled_policy'), true);
});

test('governanceRulesToTasks and class wrapper emit schema-valid tasks and history', () => {
    const compiler = new GovernanceRuleCompiler({
        localAgentId: 'agent:governance-local',
        now: () => 402_000
    });

    const report = compiler.evaluate(baseInput());
    const tasks = governanceRulesToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = compiler.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:governance-local');
    assert.equal(compiler.listHistory({ limit: 5 }).length, 1);
});
