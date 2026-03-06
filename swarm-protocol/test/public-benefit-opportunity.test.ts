import test from 'node:test';
import assert from 'node:assert/strict';
import {
    PublicBenefitOpportunityMiner,
    minePublicBenefitOpportunities,
    publicBenefitRecommendationsToTasks
} from '../index.js';

test('minePublicBenefitOpportunities prioritizes high-leverage validated opportunities', () => {
    const report = minePublicBenefitOpportunities({
        opportunities: [
            {
                id: 'health-outreach',
                title: 'Mobile health outreach support',
                domain: 'healthcare',
                affectedPopulation: 400_000,
                expectedBenefitScore: 88,
                feasibilityScore: 74,
                urgencyScore: 68,
                equityBoostScore: 82,
                evidenceStrengthScore: 79,
                timeToImpactDays: 18,
                estimatedCostUsd: 12_000,
                riskScore: 20
            },
            {
                id: 'weak-evidence',
                title: 'Low-evidence awareness campaign',
                domain: 'education',
                affectedPopulation: 350_000,
                expectedBenefitScore: 78,
                feasibilityScore: 60,
                urgencyScore: 50,
                equityBoostScore: 55,
                evidenceStrengthScore: 24,
                timeToImpactDays: 12,
                estimatedCostUsd: 6_000,
                riskScore: 18
            }
        ],
        constraints: {
            budgetUsd: 30_000,
            maxNow: 2,
            maxNext: 2,
            maxRiskScore: 60,
            minEvidenceScore: 35
        }
    }, {
        now: () => 70_000
    });

    const health = report.opportunities.find((item) => item.id === 'health-outreach');
    const weak = report.opportunities.find((item) => item.id === 'weak-evidence');

    assert.ok(health);
    assert.ok(weak);
    assert.equal(health.scheduledLane, 'now');
    assert.equal(weak.scheduledLane, 'backlog');
    assert.equal(report.summary.nowCount >= 1, true);
});

test('minePublicBenefitOpportunities defers opportunities when budget is constrained', () => {
    const report = minePublicBenefitOpportunities({
        opportunities: [
            {
                id: 'op-a',
                title: 'Program A',
                affectedPopulation: 200_000,
                expectedBenefitScore: 82,
                feasibilityScore: 70,
                urgencyScore: 65,
                equityBoostScore: 76,
                evidenceStrengthScore: 72,
                timeToImpactDays: 20,
                estimatedCostUsd: 20_000,
                riskScore: 22
            },
            {
                id: 'op-b',
                title: 'Program B',
                affectedPopulation: 220_000,
                expectedBenefitScore: 80,
                feasibilityScore: 69,
                urgencyScore: 64,
                equityBoostScore: 74,
                evidenceStrengthScore: 70,
                timeToImpactDays: 22,
                estimatedCostUsd: 19_000,
                riskScore: 24
            }
        ],
        constraints: {
            budgetUsd: 22_000,
            maxNow: 2,
            maxNext: 1,
            maxRiskScore: 60,
            minEvidenceScore: 35
        }
    }, {
        now: () => 71_000
    });

    assert.equal(report.summary.backlogCount >= 1, true);
    assert.equal(report.opportunities.some((item) => item.deferredReason === 'budget_limited'), true);
    assert.equal(report.recommendations.some((item) => item.type === 'unblock_opportunity'), true);
});

test('publicBenefitRecommendationsToTasks and miner class emit schema-valid tasks and history', () => {
    const miner = new PublicBenefitOpportunityMiner({
        localAgentId: 'agent:benefit-local',
        now: () => 72_000
    });

    const report = miner.evaluate({
        opportunities: [
            {
                id: 'op-1',
                title: 'Community service digitization',
                affectedPopulation: 180_000,
                expectedBenefitScore: 76,
                feasibilityScore: 72,
                urgencyScore: 58,
                equityBoostScore: 70,
                evidenceStrengthScore: 68,
                timeToImpactDays: 30,
                estimatedCostUsd: 8_000,
                riskScore: 18
            }
        ],
        constraints: {
            budgetUsd: 20_000,
            maxNow: 1,
            maxNext: 2
        }
    });

    const tasks = publicBenefitRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = miner.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:benefit-local');
    assert.equal(miner.listHistory({ limit: 5 }).length, 1);
});
