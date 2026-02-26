import test from 'node:test';
import assert from 'node:assert/strict';
import {
    PolicyDiffSimulator,
    simulatePolicyDiffs,
    policyDiffRecommendationsToTasks
} from '../index.js';

function policyInput() {
    return {
        baselinePolicy: {
            id: 'baseline',
            name: 'Baseline',
            strictness: 56,
            safetyBudget: 54,
            evidenceThreshold: 50,
            autonomyLevel: 58,
            humanReviewDepth: 46
        },
        variants: [
            {
                id: 'variant-safe',
                name: 'Safety Plus',
                changes: {
                    strictness: 66,
                    safetyBudget: 68,
                    evidenceThreshold: 62,
                    autonomyLevel: 52,
                    humanReviewDepth: 58
                }
            },
            {
                id: 'variant-fast',
                name: 'Speed First',
                changes: {
                    strictness: 35,
                    safetyBudget: 32,
                    evidenceThreshold: 34,
                    autonomyLevel: 86,
                    humanReviewDepth: 22
                }
            }
        ],
        context: {
            harmRisk: 58,
            misuseThreat: 52,
            equityGap: 33,
            readinessScore: 74,
            missionUrgency: 68,
            costPressure: 47
        }
    };
}

test('simulatePolicyDiffs builds diff matrix and ranked variant list', () => {
    const report = simulatePolicyDiffs(policyInput(), {
        now: () => 140_000
    });

    assert.equal(report.diffMatrix.length > 0, true);
    assert.equal(report.ranked.length >= 2, true);
    assert.equal(typeof report.summary.topVariantId, 'string');
    assert.equal(report.summary.maxParameterDistance >= 0, true);
});

test('simulatePolicyDiffs flags high divergence and risk deltas', () => {
    const report = simulatePolicyDiffs(policyInput(), {
        now: () => 141_000
    });

    assert.equal(report.alerts.some((alert) => alert === 'policy_parameter_divergence_high' || alert === 'policy_risk_delta_high'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'investigate_large_policy_gap'), true);
});

test('policyDiffRecommendationsToTasks and class wrapper emit schema-valid tasks and history', () => {
    const simulator = new PolicyDiffSimulator({
        localAgentId: 'agent:policy-diff-local',
        now: () => 142_000
    });

    const report = simulator.evaluate(policyInput());
    const tasks = policyDiffRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = simulator.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:policy-diff-local');
    assert.equal(simulator.listHistory({ limit: 5 }).length, 1);
});
