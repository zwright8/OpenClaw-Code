import test from 'node:test';
import assert from 'node:assert/strict';
import {
    runScientificHypothesisMarketplace,
    hypothesisMarketplaceToTasks,
    ScientificHypothesisMarketplace
} from '../index.js';

function baseInput() {
    return {
        hypotheses: [
            {
                hypothesisId: 'hyp-climate-relief',
                domains: ['climate', 'logistics'],
                expectedImpact: 90,
                novelty: 78,
                falsifiability: 70,
                evidenceSupport: 28,
                resourceNeed: 3,
                budgetNeed: 4,
                risk: 66
            },
            {
                hypothesisId: 'hyp-disease-surveillance',
                domains: ['health'],
                expectedImpact: 84,
                novelty: 72,
                falsifiability: 76,
                evidenceSupport: 40,
                resourceNeed: 2,
                budgetNeed: 3,
                risk: 54
            }
        ],
        resources: [
            {
                resourceId: 'resource-lab-a',
                domains: ['health'],
                capacityUnits: 2,
                quality: 82,
                availability: 70,
                costEfficiency: 68
            },
            {
                resourceId: 'resource-climate-net',
                domains: ['climate'],
                capacityUnits: 1,
                quality: 75,
                availability: 64,
                costEfficiency: 60
            }
        ],
        capacity: {
            experimentSlots: 1,
            budgetUnits: 3,
            reviewHours: 6
        }
    };
}

test('runScientificHypothesisMarketplace surfaces resource and review constraints under tight capacity', () => {
    const report = runScientificHypothesisMarketplace(baseInput(), {
        now: () => 2_000_000
    });

    assert.equal(report.summary.hypothesisCount, 2);
    assert.equal(report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold, 2);
    assert.equal(
        report.alerts.includes('hypothesis_market_hold_queue_present')
        || report.alerts.includes('hypothesis_resource_shortage')
        || report.alerts.includes('hypothesis_peer_review_capacity_gap'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'allocate_evidence_resource' || entry.type === 'run_peer_review'
    )), true);
});

test('runScientificHypothesisMarketplace reports market_ready posture for strong capacity and matching resources', () => {
    const report = runScientificHypothesisMarketplace({
        hypotheses: [
            {
                hypothesisId: 'hyp-ok',
                domains: ['education'],
                expectedImpact: 72,
                novelty: 68,
                falsifiability: 86,
                evidenceSupport: 64,
                resourceNeed: 1,
                budgetNeed: 1,
                risk: 30
            }
        ],
        resources: [
            {
                resourceId: 'resource-ok',
                domains: ['education'],
                capacityUnits: 3,
                quality: 92,
                availability: 90,
                costEfficiency: 88
            }
        ],
        capacity: {
            experimentSlots: 3,
            budgetUnits: 8,
            reviewHours: 24
        }
    }, {
        now: () => 2_001_000
    });

    assert.equal(report.summary.posture, 'market_ready');
    assert.equal(report.summary.laneCounts.hold, 0);
});

test('hypothesisMarketplaceToTasks and class wrapper emit schema-valid tasks and history', () => {
    const marketplace = new ScientificHypothesisMarketplace({
        localAgentId: 'agent:market-local',
        now: () => 2_002_000
    });

    const report = marketplace.evaluate(baseInput());
    const tasks = hypothesisMarketplaceToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = marketplace.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:market-local');
    assert.equal(marketplace.listHistory({ limit: 5 }).length, 1);
});
