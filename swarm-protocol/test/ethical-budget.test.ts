import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EthicalBudgetOptimizer,
    ethicalBudgetToTasks,
    optimizeEthicalBudget
} from '../index.js';

function baseInput() {
    return {
        initiatives: [
            {
                id: 'initiative-accessibility',
                name: 'Accessibility modernization',
                costUsd: 180_000,
                benefitScore: 82,
                equityScore: 88,
                urgencyScore: 70,
                riskScore: 30,
                complianceConfidence: 92
            },
            {
                id: 'initiative-safety-audit',
                name: 'Safety automation audit',
                costUsd: 140_000,
                benefitScore: 76,
                equityScore: 72,
                urgencyScore: 68,
                riskScore: 35,
                complianceConfidence: 90
            },
            {
                id: 'initiative-community',
                name: 'Community support expansion',
                costUsd: 110_000,
                benefitScore: 74,
                equityScore: 90,
                urgencyScore: 62,
                riskScore: 28,
                complianceConfidence: 85
            },
            {
                id: 'initiative-automation',
                name: 'Autonomous rollout acceleration',
                costUsd: 220_000,
                benefitScore: 84,
                equityScore: 58,
                urgencyScore: 80,
                riskScore: 66,
                complianceConfidence: 75
            },
            {
                id: 'initiative-risky-expansion',
                name: 'Rapid expansion program',
                costUsd: 160_000,
                benefitScore: 79,
                equityScore: 60,
                urgencyScore: 72,
                riskScore: 84,
                complianceConfidence: 68
            }
        ],
        budget: {
            totalBudgetUsd: 520_000,
            reserveUsd: 20_000
        },
        policy: {
            maxAverageRisk: 60,
            minEthicalScore: 55,
            minPortfolioSize: 1,
            maxPortfolioSize: 3
        }
    };
}

test('optimizeEthicalBudget selects a viable ethical portfolio under budget and risk constraints', () => {
    const report = optimizeEthicalBudget(baseInput(), {
        now: () => 220_000
    });

    assert.equal(report.summary.portfolioCount > 0, true);
    assert.equal(report.summary.viableCount > 0, true);
    assert.equal(report.selectedPortfolio !== null, true);
    assert.equal(['viable', 'review_required', 'blocked'].includes(report.selectedPortfolio.posture), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'approve_ethical_portfolio' || entry.type === 'review_budget_tradeoff'), true);
});

test('optimizeEthicalBudget emits no-feasible alerts when budget/risk constraints cannot be satisfied', () => {
    const report = optimizeEthicalBudget({
        initiatives: [
            {
                id: 'initiative-x',
                name: 'Risky intervention X',
                costUsd: 220_000,
                benefitScore: 78,
                equityScore: 66,
                urgencyScore: 74,
                riskScore: 82,
                complianceConfidence: 60
            },
            {
                id: 'initiative-y',
                name: 'Risky intervention Y',
                costUsd: 190_000,
                benefitScore: 70,
                equityScore: 55,
                urgencyScore: 68,
                riskScore: 76,
                complianceConfidence: 62
            }
        ],
        budget: {
            totalBudgetUsd: 180_000,
            reserveUsd: 10_000
        },
        policy: {
            maxAverageRisk: 40,
            minEthicalScore: 70,
            minPortfolioSize: 1,
            maxPortfolioSize: 2
        }
    }, {
        now: () => 221_000
    });

    assert.equal(report.alerts.includes('no_feasible_ethical_portfolio'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'request_budget_adjustment'), true);
});

test('ethicalBudgetToTasks and class wrapper emit schema-valid tasks and history', () => {
    const optimizer = new EthicalBudgetOptimizer({
        localAgentId: 'agent:budget-local',
        now: () => 222_000
    });

    const report = optimizer.evaluate(baseInput());
    const tasks = ethicalBudgetToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = optimizer.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:budget-local');
    assert.equal(optimizer.listHistory({ limit: 5 }).length, 1);
});
