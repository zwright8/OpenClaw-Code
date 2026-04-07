import test from 'node:test';
import assert from 'node:assert/strict';
import {
    TruthSeekingEngine,
    evaluateTruthHypotheses,
    truthRecommendationsToTasks
} from '../index.js';

function hypothesisSet() {
    return [
        {
            id: 'h-routing-regression',
            statement: 'Routing latency regression is driven by timeout hotspots',
            priorConfidence: 0.55,
            supportSignals: ['optimizer_timeout_regression', 'timeout_spike'],
            contradictSignals: ['readiness_ready'],
            criticality: 'critical'
        },
        {
            id: 'h-skill-health',
            statement: 'Skill marketplace quality is stable',
            priorConfidence: 0.7,
            supportSignals: ['readiness_ready'],
            contradictSignals: ['skill_success_rate_drop'],
            criticality: 'normal'
        }
    ];
}

test('evaluateTruthHypotheses updates confidence from evidence signals', () => {
    const report = evaluateTruthHypotheses({
        hypotheses: hypothesisSet(),
        driftReport: {
            alerts: [
                { code: 'optimizer_timeout_regression', priority: 'P1' },
                { code: 'skill_success_rate_drop', priority: 'P1' }
            ]
        },
        incidents: [
            { code: 'timeout_spike', priority: 'P1' }
        ],
        readinessReport: {
            status: 'needs_attention'
        }
    });

    const routing = report.results.find((row) => row.id === 'h-routing-regression');
    const skill = report.results.find((row) => row.id === 'h-skill-health');

    assert.ok(routing.posteriorConfidence > routing.priorConfidence);
    assert.ok(skill.posteriorConfidence < skill.priorConfidence);
    assert.equal(report.summary.hypothesisCount, 2);
    assert.ok(report.summary.evidenceCount > 0);
});

test('evaluateTruthHypotheses emits recommendations for uncertain and unlikely hypotheses', () => {
    const report = evaluateTruthHypotheses({
        hypotheses: [
            {
                id: 'h-uncertain',
                statement: 'Uncertain hypothesis',
                priorConfidence: 0.5,
                supportSignals: ['signal-a'],
                contradictSignals: ['signal-b']
            },
            {
                id: 'h-unlikely',
                statement: 'Likely wrong hypothesis',
                priorConfidence: 0.45,
                supportSignals: [],
                contradictSignals: ['signal-b'],
                criticality: 'critical'
            }
        ],
        evidenceSignals: [
            { code: 'signal-a', strength: 0.2 },
            { code: 'signal-b', strength: 0.9 }
        ]
    });

    assert.ok(report.recommendations.some((row) => row.hypothesisId === 'h-uncertain'));
    assert.ok(report.recommendations.some((row) => row.hypothesisId === 'h-unlikely'));
});

test('truthRecommendationsToTasks emits schema-valid task requests', () => {
    const report = evaluateTruthHypotheses({
        hypotheses: hypothesisSet(),
        evidenceSignals: [
            { code: 'skill_success_rate_drop', strength: 0.9 }
        ]
    });

    const tasks = truthRecommendationsToTasks(report, {
        fromAgentId: 'agent:science'
    });

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:science');
    assert.equal(typeof tasks[0].context.hypothesisId, 'string');
});

test('TruthSeekingEngine stores history and builds recommendation tasks', () => {
    const engine = new TruthSeekingEngine({
        localAgentId: 'agent:truth',
        now: () => 9_000
    });

    const report = engine.evaluate({
        hypotheses: hypothesisSet(),
        incidents: [{ code: 'timeout_spike', priority: 'P1' }]
    });
    const tasks = engine.buildTasks(report);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].from, 'agent:truth');
    assert.equal(engine.listHistory({ limit: 5 }).length, 1);
});
