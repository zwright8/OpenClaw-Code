import test from 'node:test';
import assert from 'node:assert/strict';

import { detectAnomalies } from '../src/reasoning/anomaly.js';
import { analyzeRootCauses } from '../src/reasoning/root-cause.js';
import { simulateCounterfactuals } from '../src/reasoning/counterfactual.js';
import { planRemediation } from '../src/reasoning/remediation.js';
import { scoreImpactForRecommendations } from '../src/reasoning/impact-scoring.js';

test('reasoning pipeline emits recommendations with required risk metadata', () => {
    const anomalyResult = detectAnomalies([
        {
            signalId: 'error_rate',
            label: 'Gateway Error Rate',
            currentValue: 9.2,
            baselineValue: 1.8,
            direction: 'higher_is_worse',
            evidence: [{ source: 'gateway.logs', detail: 'Error spikes observed across shards.' }]
        },
        {
            signalId: 'latency_p95',
            label: 'Gateway p95 Latency',
            currentValue: 5900,
            baselineValue: 1800,
            direction: 'higher_is_worse',
            evidence: [{ source: 'runtime.telemetry', detail: 'Queue depth and timeout counts increased.' }]
        }
    ]);

    assert.equal(anomalyResult.anomalies.length, 2);
    assert.ok(anomalyResult.recommendations.length >= 2);

    for (const recommendation of anomalyResult.recommendations) {
        assert.ok(Array.isArray(recommendation.evidence));
        assert.ok(recommendation.evidence.length > 0);
        assert.equal(typeof recommendation.confidence, 'number');
        assert.ok(recommendation.confidence >= 0 && recommendation.confidence <= 1);
        assert.ok(['low', 'medium', 'high', 'critical'].includes(recommendation.riskTier));
        assert.equal(typeof recommendation.requiresHumanApproval, 'boolean');
    }

    const rootCauseResult = analyzeRootCauses(anomalyResult.anomalies, [
        {
            causeId: 'gateway-backpressure',
            summary: 'Gateway backpressure from overloaded downstream workers',
            relatedSignals: ['error_rate', 'latency_p95'],
            likelihood: 0.84,
            riskTier: 'high',
            evidence: [{ source: 'ops.runbook', detail: 'Similar pattern in prior incidents.' }],
            remediationHints: ['Throttle producer concurrency and expand worker pool.']
        },
        {
            causeId: 'provider-throttle',
            summary: 'External provider throttling',
            relatedSignals: ['error_rate'],
            likelihood: 0.61,
            evidence: [{ source: 'provider.status', detail: 'Rate limit warnings surfaced.' }]
        }
    ]);

    assert.ok(rootCauseResult.findings.length >= 1);

    const counterfactuals = simulateCounterfactuals(rootCauseResult.findings.map((finding) => ({
        finding,
        scenarios: [
            {
                scenarioId: `${finding.causeId}-canary`,
                title: `Canary fix for ${finding.causeId}`,
                description: 'Canary deployment with rollback safeguards.',
                expectedImprovementPct: 48,
                implementationRisk: 'medium',
                executionConfidence: 0.78,
                evidence: [{ source: 'change-sim', detail: 'Canary simulation reduced retry storms.' }]
            }
        ]
    })));

    assert.ok(counterfactuals.length >= 1);

    const remediationResult = planRemediation(rootCauseResult.findings, counterfactuals, [
        {
            optionId: 'gatewayscale-1',
            title: 'Scale gateway worker pool and apply adaptive throttling',
            description: 'Increase worker capacity and control ingress load under pressure.',
            targetsCauseIds: rootCauseResult.findings.map((finding) => finding.causeId),
            expectedRiskReductionPct: 52,
            implementationEffort: 'medium',
            rollbackPlan: 'Revert scaling policy and throttling configuration.',
            verificationSteps: [
                'Monitor error-rate drop for 30 minutes post-deploy.',
                'Verify p95 latency recovery to baseline ±15%.'
            ],
            evidence: [{ source: 'perf-tests', detail: 'Load tests show improved stability at +40% traffic.' }]
        }
    ]);

    assert.equal(remediationResult.recommendations.length, 1);

    const remediation = remediationResult.recommendations[0];
    assert.ok(remediation.evidence.length > 0);
    assert.equal(typeof remediation.confidence, 'number');
    assert.ok(['low', 'medium', 'high', 'critical'].includes(remediation.riskTier));
    assert.equal(typeof remediation.requiresHumanApproval, 'boolean');

    const impactScores = scoreImpactForRecommendations(remediationResult.recommendations, {
        revenueAtRiskUsd: 25000,
        incidentCostPerHourUsd: 1800,
        affectedUsers: 1100,
        strategicPriorityMultiplier: 1.15
    });

    assert.equal(impactScores.length, remediationResult.recommendations.length);
    assert.ok(impactScores[0].impactScore > 0);
    assert.ok(impactScores[0].estimatedValueUsd > 0);
});
