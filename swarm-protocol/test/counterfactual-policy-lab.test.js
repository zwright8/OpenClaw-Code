import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CounterfactualPolicyLab,
    runCounterfactualPolicyLab,
    policyLabRecommendationsToTasks
} from '../index.js';

test('runCounterfactualPolicyLab ranks variants and identifies strongest candidate', () => {
    const report = runCounterfactualPolicyLab({
        baselinePolicy: {
            id: 'baseline',
            name: 'Baseline',
            strictness: 55,
            safetyBudget: 52,
            evidenceThreshold: 48,
            autonomyLevel: 60,
            humanReviewDepth: 44
        },
        variants: [
            {
                id: 'variant-a',
                name: 'Balanced Safety Lift',
                changes: {
                    strictness: 64,
                    safetyBudget: 64,
                    evidenceThreshold: 62,
                    autonomyLevel: 57,
                    humanReviewDepth: 55
                }
            },
            {
                id: 'variant-b',
                name: 'Aggressive Autonomy',
                changes: {
                    strictness: 40,
                    safetyBudget: 38,
                    evidenceThreshold: 35,
                    autonomyLevel: 86,
                    humanReviewDepth: 25
                }
            }
        ],
        context: {
            harmRisk: 48,
            misuseThreat: 42,
            equityGap: 28,
            readinessScore: 72,
            missionUrgency: 66,
            costPressure: 44
        }
    }, {
        now: () => 130_000
    });

    assert.equal(report.variants.length, 2);
    assert.equal(report.summary.bestVariantId !== null, true);
    assert.equal(report.variants[0].overallScore >= report.variants[1].overallScore, true);
});

test('runCounterfactualPolicyLab penalizes lax variants in high-risk contexts', () => {
    const report = runCounterfactualPolicyLab({
        baselinePolicy: {
            id: 'baseline',
            name: 'Baseline',
            strictness: 58,
            safetyBudget: 58,
            evidenceThreshold: 56,
            autonomyLevel: 55,
            humanReviewDepth: 50
        },
        variants: [
            {
                id: 'lax',
                name: 'Lax Variant',
                changes: {
                    strictness: 25,
                    safetyBudget: 20,
                    evidenceThreshold: 22,
                    autonomyLevel: 85,
                    humanReviewDepth: 18
                }
            }
        ],
        context: {
            harmRisk: 82,
            misuseThreat: 74,
            equityGap: 55,
            readinessScore: 68,
            missionUrgency: 72,
            costPressure: 45
        }
    }, {
        now: () => 131_000
    });

    assert.equal(report.variants[0].riskScore >= report.baseline.riskScore, true);
    assert.equal(report.alerts.includes('variant_risk_high') || report.recommendations.some((entry) => entry.type === 'investigate_policy_tradeoff'), true);
});

test('policyLabRecommendationsToTasks and class wrapper emit schema-valid tasks and history', () => {
    const lab = new CounterfactualPolicyLab({
        localAgentId: 'agent:policy-local',
        now: () => 132_000
    });

    const report = lab.evaluate({
        baselinePolicy: {
            name: 'Baseline',
            strictness: 56,
            safetyBudget: 52,
            evidenceThreshold: 50,
            autonomyLevel: 58,
            humanReviewDepth: 46
        },
        variants: [
            {
                name: 'Variant One',
                changes: {
                    strictness: 62,
                    safetyBudget: 60,
                    evidenceThreshold: 58,
                    autonomyLevel: 55,
                    humanReviewDepth: 52
                }
            }
        ],
        context: {
            harmRisk: 44,
            misuseThreat: 36,
            equityGap: 22,
            readinessScore: 76,
            missionUrgency: 64,
            costPressure: 40
        }
    });

    const tasks = policyLabRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = lab.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:policy-local');
    assert.equal(lab.listHistory({ limit: 5 }).length, 1);
});
