import test from 'node:test';
import assert from 'node:assert/strict';
import {
    evaluateCognitionCoreReadiness,
    renderCognitionCoreReadinessMarkdown
} from '../src/readiness-gate.js';

function healthyFixture() {
    return {
        analysisReport: {
            reliabilityScore: 97.5,
            errors: 0,
            comparison: { status: 'stable' },
            memoryDrift: { driftLevel: 'stable', driftScore: 0 },
            trajectoryRisk: {
                unresolvedToolCalls: 0,
                maxConsecutiveToolErrors: 0,
                sessionsWithUnresolvedToolCalls: 0,
                sessionsWithConsecutiveToolErrors: 0
            },
            topRiskyTrajectories: [],
            topTools: [
                { name: 'exec', calls: 20, errorRate: 1.2 },
                { name: 'read', calls: 8, errorRate: 0 }
            ]
        },
        learningReport: {
            errorTaxonomy: { driftLevel: 'stable' },
            skillGrowthPlan: { focusAreas: [] },
            state: { driftLevel: 'stable', runCount: 3 }
        },
        remediationTasks: [],
        skillGrowthTasks: []
    };
}

test('evaluateCognitionCoreReadiness returns pass for healthy inputs', () => {
    const readiness = evaluateCognitionCoreReadiness({
        ...healthyFixture(),
        memoryGuardrailsReport: {
            status: 'pass',
            totals: { complianceRate: 1, entries: 3 }
        }
    });
    assert.equal(readiness.status, 'pass');
    assert.equal(readiness.totals.fail, 0);
    assert.ok(readiness.readinessScore >= 0.9);
});

test('fails readiness when critical gates are violated', () => {
    const fixture = healthyFixture();
    fixture.analysisReport.reliabilityScore = 70;
    fixture.analysisReport.topTools[0].errorRate = 15;
    fixture.analysisReport.trajectoryRisk = {
        unresolvedToolCalls: 2,
        maxConsecutiveToolErrors: 3,
        sessionsWithUnresolvedToolCalls: 1,
        sessionsWithConsecutiveToolErrors: 1
    };
    fixture.analysisReport.topRiskyTrajectories = [
        {
            sessionFile: 'risky.jsonl',
            riskScore: 20,
            flags: ['consecutive_tool_errors', 'unresolved_tool_calls']
        }
    ];
    fixture.learningReport.state.driftLevel = 'critical';
    fixture.learningReport.skillGrowthPlan.focusAreas = [
        { focus: 'timeout_resilience', priority: 'P1' }
    ];

    const readiness = evaluateCognitionCoreReadiness({
        ...fixture,
        memoryGuardrailsReport: {
            status: 'fail',
            totals: { complianceRate: 0.2, entries: 3 }
        },
        remediationTasks: [],
        skillGrowthTasks: []
    });

    assert.equal(readiness.status, 'fail');
    assert.ok(readiness.gates.some((gate) => gate.id === 'reliability' && gate.status === 'fail'));
    assert.ok(readiness.gates.some((gate) => gate.id === 'tool_error_rate' && gate.status === 'fail'));
    assert.ok(readiness.gates.some((gate) => gate.id === 'tool_trajectory_risk' && gate.status === 'fail'));
    assert.ok(readiness.gates.some((gate) => gate.id === 'learning_drift' && gate.status === 'fail'));
    assert.ok(readiness.gates.some((gate) => gate.id === 'skill_growth_coverage' && gate.status === 'fail'));
    assert.ok(readiness.gates.some((gate) => gate.id === 'memory_guardrails' && gate.status === 'fail'));
});

test('renders readiness markdown summary', () => {
    const readiness = evaluateCognitionCoreReadiness(healthyFixture());
    const markdown = renderCognitionCoreReadinessMarkdown(readiness);

    assert.ok(markdown.includes('# Cognition Core Readiness'));
    assert.ok(markdown.includes('| Gate | Status | Summary |'));
    assert.ok(markdown.includes('Readiness score'));
});
