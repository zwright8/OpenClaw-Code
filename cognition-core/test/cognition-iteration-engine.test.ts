import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildCognitionIterationPlan,
    renderCognitionIterationMarkdown
} from '../src/cognition-iteration-engine.js';

test('buildCognitionIterationPlan creates recovery-focused hypotheses under warning signals', () => {
    const plan = buildCognitionIterationPlan({
        analysisReport: {
            topTools: [{ name: 'exec', calls: 50, errorRate: 0 }],
            memoryDrift: {
                driftLevel: 'watch',
                currentWindow: { reflectionCoverage: 0.4 }
            }
        },
        learningReport: {
            summary: { total: 0 },
            errorTaxonomy: { recurringSignatures: 2 },
            skillGrowthPlan: { focusAreas: [] },
            state: { driftLevel: 'stable' }
        },
        memoryGuardrailsReport: {
            status: 'warn',
            totals: { complianceRate: 0.5 }
        },
        readinessReport: { status: 'warn' },
        history: [{ hypothesisKeys: ['capture-task-outcomes'] }]
    });

    assert.equal(plan.posture, 'stabilize');
    assert.ok(plan.hypotheses.length > 0);
    assert.ok(plan.hypotheses.some((item) => item.id === 'capture-task-outcomes'));
    assert.ok(plan.hypotheses.some((item) => item.id === 'memory-reflection-acceleration'));
    assert.ok(plan.experiments.length === plan.hypotheses.length);
});

test('buildCognitionIterationPlan creates exploratory hypothesis when stable', () => {
    const plan = buildCognitionIterationPlan({
        analysisReport: {
            topTools: [{ name: 'exec', calls: 8, errorRate: 0 }],
            memoryDrift: { driftLevel: 'stable', currentWindow: { reflectionCoverage: 1.2 } }
        },
        learningReport: {
            summary: { total: 42 },
            errorTaxonomy: { recurringSignatures: 0 },
            skillGrowthPlan: { focusAreas: [] },
            state: { driftLevel: 'stable' }
        },
        memoryGuardrailsReport: {
            status: 'pass',
            totals: { complianceRate: 1 }
        },
        readinessReport: { status: 'pass' },
        history: []
    });

    assert.equal(plan.posture, 'explore');
    assert.ok(plan.hypotheses.some((item) => item.id === 'curiosity-frontier-expansion'));
});

test('renderCognitionIterationMarkdown produces readable report', () => {
    const plan = buildCognitionIterationPlan({
        analysisReport: { topTools: [] },
        learningReport: { summary: { total: 0 }, errorTaxonomy: {}, skillGrowthPlan: {}, state: {} },
        memoryGuardrailsReport: { status: 'warn', totals: { complianceRate: 0.2 } },
        readinessReport: { status: 'warn' }
    });
    const markdown = renderCognitionIterationMarkdown(plan);

    assert.ok(markdown.includes('# Cognition Iteration Plan'));
    assert.ok(markdown.includes('## Hypotheses'));
    assert.ok(markdown.includes('## Curiosity Prompts'));
});
