import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MultiStakeholderPreferenceModeler,
    modelStakeholderPreferences,
    stakeholderPreferencesToTasks
} from '../index.js';

function baseInput() {
    return {
        axes: ['safety', 'equity', 'cost_efficiency', 'speed'],
        stakeholders: [
            {
                id: 'stakeholder-ops',
                name: 'Operations',
                influenceWeight: 72,
                participationScore: 88,
                riskTolerance: 48,
                preferences: {
                    safety: 82,
                    equity: 64,
                    cost_efficiency: 58,
                    speed: 62
                }
            },
            {
                id: 'stakeholder-community',
                name: 'Community',
                influenceWeight: 65,
                participationScore: 74,
                riskTolerance: 38,
                preferences: {
                    safety: 78,
                    equity: 84,
                    cost_efficiency: 46,
                    speed: 52
                }
            }
        ],
        options: [
            {
                id: 'option-balanced',
                name: 'Balanced rollout',
                outcomes: {
                    safety: 80,
                    equity: 76,
                    cost_efficiency: 52,
                    speed: 58
                },
                riskScore: 32,
                costScore: 46
            },
            {
                id: 'option-fast',
                name: 'Fast rollout',
                outcomes: {
                    safety: 56,
                    equity: 50,
                    cost_efficiency: 72,
                    speed: 86
                },
                riskScore: 64,
                costScore: 40
            }
        ]
    };
}

test('modelStakeholderPreferences ranks options by consensus score', () => {
    const report = modelStakeholderPreferences(baseInput(), {
        now: () => 160_000
    });

    assert.equal(report.options.length, 2);
    assert.equal(report.summary.topOptionId, 'option-balanced');
    assert.equal(report.options[0].consensusScore >= report.options[1].consensusScore, true);
});

test('modelStakeholderPreferences detects divergence and participation alerts', () => {
    const report = modelStakeholderPreferences({
        ...baseInput(),
        stakeholders: [
            ...baseInput().stakeholders,
            {
                id: 'stakeholder-speed',
                name: 'Growth',
                influenceWeight: 70,
                participationScore: 28,
                riskTolerance: 80,
                preferences: {
                    safety: 20,
                    equity: 25,
                    cost_efficiency: 82,
                    speed: 94
                }
            }
        ]
    }, {
        now: () => 161_000
    });

    assert.equal(report.alerts.includes('high_stakeholder_divergence'), true);
    assert.equal(report.alerts.includes('low_stakeholder_participation'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'mediate_preference_divergence'), true);
});

test('stakeholderPreferencesToTasks and class wrapper emit schema-valid tasks and history', () => {
    const modeler = new MultiStakeholderPreferenceModeler({
        localAgentId: 'agent:pref-local',
        now: () => 162_000
    });

    const report = modeler.evaluate(baseInput());
    const tasks = stakeholderPreferencesToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = modeler.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:pref-local');
    assert.equal(modeler.listHistory({ limit: 5 }).length, 1);
});
