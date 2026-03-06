import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ExplainabilityNarrativeGenerator,
    generateExplainabilityNarrative,
    explainabilityRecommendationsToTasks
} from '../index.js';

test('generateExplainabilityNarrative produces ranked reasons and markdown narrative', () => {
    const report = generateExplainabilityNarrative({
        decision: {
            id: 'decision-1',
            decisionType: 'launch_batch',
            outcome: 'approved',
            mode: 'active',
            score: 78,
            summary: 'Launch selected missions for immediate execution.'
        },
        governorDecision: {
            mode: 'normal',
            riskScore: 24
        },
        constitutionReport: {
            tier: 'aligned',
            overallScore: 82
        },
        humanityReport: {
            posture: 'aligned',
            summary: { blockedCount: 0 }
        },
        readinessReport: {
            status: 'ready',
            readinessScore: 88
        },
        misuseReport: {
            summary: {
                threatLevel: 'guarded',
                highRiskActorCount: 0
            }
        }
    }, {
        now: () => 110_000
    });

    assert.equal(report.reasons.length > 0, true);
    assert.equal(typeof report.markdown, 'string');
    assert.equal(report.markdown.includes('Explainability Narrative'), true);
    assert.equal(report.headline.includes('launch_batch'), true);
});

test('generateExplainabilityNarrative emits evidence recommendation when uncertainty is high', () => {
    const report = generateExplainabilityNarrative({
        decision: {
            decisionType: 'policy_override',
            outcome: 'pending',
            mode: 'caution',
            score: 54
        },
        constitutionReport: {
            tier: 'caution',
            overallScore: 49
        },
        readinessReport: {
            status: 'needs_attention',
            readinessScore: 42
        },
        harmReport: {
            escalationLevel: 'severe',
            scores: { currentRiskScore: 71 }
        },
        misuseReport: {
            summary: {
                threatLevel: 'high',
                highRiskActorCount: 2
            }
        }
    }, {
        now: () => 111_000
    });

    assert.equal(report.uncertainty.uncertaintyScore >= 55, true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'request_additional_evidence'), true);
    assert.equal(report.alerts.includes('narrative_uncertainty_high'), true);
});

test('explainabilityRecommendationsToTasks and generator class emit schema-valid tasks and history', () => {
    const generator = new ExplainabilityNarrativeGenerator({
        localAgentId: 'agent:explain-local',
        now: () => 112_000
    });

    const report = generator.evaluate({
        decision: {
            id: 'decision-z',
            decisionType: 'mission_pause',
            outcome: 'blocked',
            mode: 'paused',
            score: 44
        },
        constitutionReport: {
            tier: 'non_compliant',
            overallScore: 34
        },
        harmReport: {
            escalationLevel: 'critical',
            scores: { currentRiskScore: 88 }
        }
    });

    const tasks = explainabilityRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = generator.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:explain-local');
    assert.equal(generator.listHistory({ limit: 5 }).length, 1);
});
