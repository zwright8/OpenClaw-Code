import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InterventionPortfolioOptimizer,
    optimizeInterventionPortfolio,
    interventionPortfolioToTasks
} from '../index.js';

function baselineInput() {
    return {
        baseline: {
            humanity: 70,
            truth: 66,
            curiosity: 62,
            reliability: 68
        }
    };
}

test('optimizeInterventionPortfolio finds a feasible high-benefit bundle', () => {
    const report = optimizeInterventionPortfolio({
        ...baselineInput(),
        interventions: [
            {
                id: 'safety-a',
                name: 'Safety telemetry expansion',
                type: 'safety',
                costUsd: 2400,
                riskScore: 16,
                rolloutDays: 7,
                effects: {
                    humanity: 8,
                    truth: 2,
                    curiosity: 1,
                    reliability: 9
                }
            },
            {
                id: 'research-b',
                name: 'Evidence quality research loop',
                type: 'research',
                costUsd: 2600,
                riskScore: 18,
                rolloutDays: 10,
                effects: {
                    humanity: 3,
                    truth: 10,
                    curiosity: 6,
                    reliability: 2
                }
            },
            {
                id: 'risky-c',
                name: 'High-risk unbounded automation',
                type: 'automation',
                costUsd: 6800,
                riskScore: 62,
                rolloutDays: 3,
                effects: {
                    humanity: 12,
                    truth: 4,
                    curiosity: 1,
                    reliability: 15
                }
            }
        ],
        constraints: {
            budgetUsd: 5500,
            maxRiskScore: 50,
            maxInterventions: 2
        }
    }, {
        now: () => 7_000
    });

    assert.ok(report.recommendedPortfolio);
    assert.equal(report.summary.feasibleCount > 0, true);
    assert.equal(report.recommendedPortfolio.totals.costUsd <= 5500, true);
    assert.equal(report.recommendedPortfolio.interventionIds.includes('risky-c'), false);
    assert.equal(report.recommendedPortfolio.metrics.societalDelta > 0, true);
});

test('optimizeInterventionPortfolio honors risk ceilings when ranking candidates', () => {
    const report = optimizeInterventionPortfolio({
        ...baselineInput(),
        interventions: [
            {
                id: 'safe-1',
                name: 'Safe intervention',
                type: 'governance',
                costUsd: 1200,
                riskScore: 12,
                effects: {
                    humanity: 3,
                    truth: 4,
                    curiosity: 2,
                    reliability: 3
                }
            },
            {
                id: 'risky-2',
                name: 'Risky intervention',
                type: 'automation',
                costUsd: 900,
                riskScore: 88,
                effects: {
                    humanity: 5,
                    truth: 5,
                    curiosity: 1,
                    reliability: 4
                }
            }
        ],
        constraints: {
            budgetUsd: 4000,
            maxRiskScore: 24,
            maxInterventions: 2
        }
    }, {
        now: () => 8_000
    });

    assert.ok(report.recommendedPortfolio);
    assert.deepEqual(report.recommendedPortfolio.interventionIds, ['safe-1']);
    assert.equal(report.recommendedPortfolio.totals.aggregateRiskScore <= 24, true);
    assert.equal(report.rejectedPortfolios.length > 0, true);
});

test('optimizeInterventionPortfolio reports review recommendation when no portfolio is feasible', () => {
    const report = optimizeInterventionPortfolio({
        ...baselineInput(),
        interventions: [
            {
                id: 'expensive',
                name: 'Expensive intervention',
                costUsd: 50_000,
                riskScore: 50,
                effects: {
                    humanity: 8,
                    truth: 8,
                    curiosity: 8,
                    reliability: 8
                }
            }
        ],
        constraints: {
            budgetUsd: 100,
            maxRiskScore: 10,
            maxInterventions: 1,
            minProjectedHumanity: 95
        }
    });

    assert.equal(report.recommendedPortfolio, null);
    assert.equal(report.summary.feasibleCount, 0);
    assert.equal(report.recommendations[0].type, 'review_portfolio');
});

test('interventionPortfolioToTasks and optimizer class produce schema-valid tasks and history', () => {
    const optimizer = new InterventionPortfolioOptimizer({
        localAgentId: 'agent:portfolio',
        now: () => 12_000
    });

    const report = optimizer.evaluate({
        ...baselineInput(),
        interventions: [
            {
                id: 'safety-a',
                name: 'Safety telemetry expansion',
                type: 'safety',
                costUsd: 1400,
                riskScore: 18,
                effects: {
                    humanity: 6,
                    truth: 3,
                    curiosity: 1,
                    reliability: 7
                }
            }
        ],
        constraints: {
            budgetUsd: 3000,
            maxRiskScore: 45,
            maxInterventions: 1
        }
    });

    const tasks = interventionPortfolioToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = optimizer.buildTasks(report);

    assert.equal(Array.isArray(tasks), true);
    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');

    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:portfolio');
    assert.equal(optimizer.listHistory({ limit: 5 }).length, 1);
});
