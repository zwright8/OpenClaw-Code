import test from 'node:test';
import assert from 'node:assert/strict';
import {
    VulnerablePopulationSafeguard,
    evaluateVulnerablePopulationSafeguards,
    vulnerableSafeguardToTasks
} from '../index.js';

function baseInput() {
    return {
        populations: [
            {
                id: 'pop-a',
                name: 'High-risk community A',
                vulnerabilityIndex: 86,
                populationSize: 12000,
                currentHarmExposure: 58,
                accessCoverage: 52,
                safeguardCoverage: 48
            },
            {
                id: 'pop-b',
                name: 'Moderate-risk community B',
                vulnerabilityIndex: 62,
                populationSize: 18000,
                currentHarmExposure: 40,
                accessCoverage: 64,
                safeguardCoverage: 60
            }
        ],
        interventions: [
            {
                id: 'intervention-safeguard',
                name: 'Safeguard expansion',
                rolloutCoverage: 70,
                riskScore: 24,
                effects: {
                    'pop-a': { harmDelta: -14, accessDelta: 9, safeguardDelta: 18 },
                    'pop-b': { harmDelta: -6, accessDelta: 7, safeguardDelta: 10 }
                }
            }
        ],
        thresholds: {
            maxProjectedHarm: 48,
            minSafeguardCoverage: 62,
            minAccessCoverage: 58,
            maxVulnerabilityWeightedRisk: 56
        }
    };
}

test('evaluateVulnerablePopulationSafeguards computes posture and weighted risk per population', () => {
    const report = evaluateVulnerablePopulationSafeguards(baseInput(), {
        now: () => 180_000
    });

    assert.equal(report.populations.length, 2);
    assert.equal(report.summary.populationCount, 2);
    assert.equal(report.summary.avgWeightedRisk >= 0, true);
    assert.equal(report.populations.some((row) => ['protected', 'review_required', 'blocked'].includes(row.posture)), true);
});

test('evaluateVulnerablePopulationSafeguards flags blocked posture under high projected harm', () => {
    const report = evaluateVulnerablePopulationSafeguards({
        ...baseInput(),
        interventions: [
            {
                id: 'intervention-risky',
                name: 'Risky rollout',
                rolloutCoverage: 90,
                riskScore: 80,
                effects: {
                    'pop-a': { harmDelta: 18, accessDelta: -10, safeguardDelta: -12 },
                    'pop-b': { harmDelta: 10, accessDelta: -6, safeguardDelta: -8 }
                }
            }
        ]
    }, {
        now: () => 181_000
    });

    assert.equal(report.summary.blockedCount >= 1, true);
    assert.equal(report.alerts.includes('vulnerable_population_harm_blocked'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'pause_high_harm_rollout'), true);
});

test('vulnerableSafeguardToTasks and class wrapper emit schema-valid tasks and history', () => {
    const safeguard = new VulnerablePopulationSafeguard({
        localAgentId: 'agent:vuln-local',
        now: () => 182_000
    });

    const report = safeguard.evaluate(baseInput());
    const tasks = vulnerableSafeguardToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = safeguard.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:vuln-local');
    assert.equal(safeguard.listHistory({ limit: 5 }).length, 1);
});
