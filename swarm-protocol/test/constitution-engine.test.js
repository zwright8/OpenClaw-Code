import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ConstitutionEngine,
    constitutionRecommendationsToTasks,
    evaluateConstitutionAlignment
} from '../index.js';

function alignedInput() {
    return {
        truthReport: {
            summary: {
                evidenceCount: 12,
                hypothesisCount: 6,
                uncertainCount: 4,
                avgConfidence: 0.68
            }
        },
        humanityReport: {
            posture: 'aligned',
            summary: {
                blockedCount: 0,
                reviewRequiredCount: 0,
                alignedCount: 6
            }
        },
        curiosityAgenda: {
            summary: {
                hypothesisCount: 6,
                nowCount: 3,
                nextCount: 2,
                avgCuriosityScore: 72
            }
        },
        tasks: [
            {
                task: 'Improve reliability and safety controls for incident response'
            }
        ]
    };
}

test('evaluateConstitutionAlignment returns aligned tier for strong truth/humanity/curiosity signals', () => {
    const report = evaluateConstitutionAlignment(alignedInput());

    assert.equal(report.tier, 'aligned');
    assert.ok(report.overallScore >= 75);
    assert.equal(report.blockingReasons.length, 0);
});

test('evaluateConstitutionAlignment returns non_compliant when pro-humanity score is low', () => {
    const report = evaluateConstitutionAlignment({
        ...alignedInput(),
        humanityReport: {
            posture: 'blocked',
            summary: {
                blockedCount: 2,
                reviewRequiredCount: 1,
                alignedCount: 0
            }
        }
    });

    assert.equal(report.tier, 'non_compliant');
    assert.ok(report.blockingReasons.includes('pro_humanity_low'));
    assert.ok(report.recommendations.some((row) => row.type === 'pause_autonomy'));
});

test('deception signals reduce truth-seeking score and trigger blocking reason', () => {
    const report = evaluateConstitutionAlignment({
        ...alignedInput(),
        tasks: [
            {
                task: 'Use deception and fabricate evidence to pass checks'
            }
        ]
    });

    assert.ok(report.metrics.truthSeeking.score < 60);
    assert.ok(report.blockingReasons.includes('deception_signals_detected'));
});

test('constitutionRecommendationsToTasks and class emit schema-valid tasks and history', () => {
    const engine = new ConstitutionEngine({
        localAgentId: 'agent:constitution-engine',
        now: () => 15_000
    });

    const report = engine.evaluate({
        ...alignedInput(),
        humanityReport: {
            posture: 'review_required',
            summary: {
                blockedCount: 0,
                reviewRequiredCount: 2,
                alignedCount: 1
            }
        }
    });

    const tasks = constitutionRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const engineTasks = engine.buildTasks(report);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].context.recommendationType, 'string');

    assert.ok(engineTasks.length > 0);
    assert.equal(engineTasks[0].from, 'agent:constitution-engine');
    assert.equal(engine.listHistory({ limit: 5 }).length, 1);
});
