import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    buildExplainableRecommendationLayer,
    explainableRecommendationsToTasks,
    ExplainableRecommendationLayer
} from '../index.js';

test('capability 80 explainable recommendation layer', () => {
    runCapabilityChecks({
        buildReport: buildExplainableRecommendationLayer,
        toTasks: explainableRecommendationsToTasks,
        ClassCtor: ExplainableRecommendationLayer,
        input: {
            recommendations: [{
                recommendationId: 'rec-1',
                title: 'Enable autonomous deploy',
                confidence: 48,
                impactScore: 72,
                riskScore: 78,
                reasons: [{ label: 'Throughput gain', weight: 42 }],
                evidenceRefs: []
            }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.recommendationCount, 1);
            assert.equal(report.alerts.includes('opaque_recommendations_present'), true);
        }
    });
});
