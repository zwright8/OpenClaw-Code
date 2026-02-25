import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ValueConflictResolver,
    resolveValueConflicts,
    valueConflictRecommendationsToTasks
} from '../index.js';

function conflictInput() {
    return {
        objectives: [
            {
                id: 'safety',
                name: 'Safety',
                weight: 35,
                currentScore: 58,
                minimumThreshold: 62,
                volatility: 32
            },
            {
                id: 'autonomy',
                name: 'Autonomy',
                weight: 30,
                currentScore: 64,
                minimumThreshold: 48,
                volatility: 28
            },
            {
                id: 'equity',
                name: 'Equity',
                weight: 35,
                currentScore: 52,
                minimumThreshold: 57,
                volatility: 26
            }
        ],
        actions: [
            {
                id: 'action-balanced',
                name: 'Balanced safeguards',
                effects: {
                    safety: 10,
                    autonomy: -4,
                    equity: 8
                },
                riskScore: 28,
                costScore: 40,
                reversibility: 68
            },
            {
                id: 'action-fast',
                name: 'Fast autonomy push',
                effects: {
                    safety: -8,
                    autonomy: 14,
                    equity: -5
                },
                riskScore: 64,
                costScore: 28,
                reversibility: 35
            }
        ]
    };
}

test('resolveValueConflicts identifies top balanced action and conflict matrix', () => {
    const report = resolveValueConflicts(conflictInput(), {
        now: () => 150_000
    });

    assert.equal(report.actions.length, 2);
    assert.equal(report.conflictMatrix.length > 0, true);
    assert.equal(report.summary.topActionId !== null, true);
    assert.equal(report.actions[0].utilityScore >= report.actions[1].utilityScore, true);
});

test('resolveValueConflicts surfaces mediation recommendations for high conflict pressure', () => {
    const report = resolveValueConflicts({
        ...conflictInput(),
        actions: [
            {
                id: 'action-risky',
                name: 'Risky tradeoff',
                effects: {
                    safety: -15,
                    autonomy: 16,
                    equity: -12
                },
                riskScore: 84,
                costScore: 20,
                reversibility: 18
            }
        ]
    }, {
        now: () => 151_000
    });

    assert.equal(['high', 'moderate'].includes(report.summary.conflictLevel), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'mediate_value_conflict' || entry.type === 'gather_missing_value_signal'), true);
});

test('valueConflictRecommendationsToTasks and class wrapper emit schema-valid tasks and history', () => {
    const resolver = new ValueConflictResolver({
        localAgentId: 'agent:value-local',
        now: () => 152_000
    });

    const report = resolver.evaluate(conflictInput());
    const tasks = valueConflictRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = resolver.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:value-local');
    assert.equal(resolver.listHistory({ limit: 5 }).length, 1);
});
