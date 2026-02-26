import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AccessibilityQualityAuditor,
    auditAccessibilityQuality,
    accessibilityRecommendationsToTasks
} from '../index.js';

function baseInput() {
    return {
        surfaces: [
            {
                id: 'surface-home',
                name: 'Home page',
                trafficWeight: 85,
                criticality: 74,
                checks: {
                    colorContrast: 78,
                    keyboardNavigation: 80,
                    screenReaderSupport: 76,
                    focusManagement: 72,
                    semanticStructure: 75,
                    mediaAccessibility: 70
                }
            },
            {
                id: 'surface-checkout',
                name: 'Checkout page',
                trafficWeight: 92,
                criticality: 88,
                checks: {
                    colorContrast: 48,
                    keyboardNavigation: 52,
                    screenReaderSupport: 45,
                    focusManagement: 50,
                    semanticStructure: 56,
                    mediaAccessibility: 44
                },
                knownBlockers: ['missing_form_labels']
            }
        ],
        thresholds: {
            minimumComplianceScore: 72,
            criticalCheckFloor: 55,
            maxCriticalIssueCount: 0
        }
    };
}

test('auditAccessibilityQuality evaluates surface posture and flags blockers', () => {
    const report = auditAccessibilityQuality(baseInput(), {
        now: () => 190_000
    });

    assert.equal(report.summary.surfaceCount, 2);
    assert.equal(report.summary.blockedCount >= 1, true);
    assert.equal(report.alerts.includes('accessibility_blockers_detected'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'fix_accessibility_blocker'), true);
});

test('auditAccessibilityQuality reports compliant posture for high-quality surfaces', () => {
    const report = auditAccessibilityQuality({
        surfaces: [
            {
                id: 'surface-docs',
                name: 'Docs',
                checks: {
                    colorContrast: 88,
                    keyboardNavigation: 90,
                    screenReaderSupport: 86,
                    focusManagement: 84,
                    semanticStructure: 87,
                    mediaAccessibility: 82
                }
            }
        ],
        thresholds: {
            minimumComplianceScore: 72,
            criticalCheckFloor: 55,
            maxCriticalIssueCount: 0
        }
    }, {
        now: () => 191_000
    });

    assert.equal(report.summary.compliantCount, 1);
    assert.equal(report.summary.blockedCount, 0);
    assert.equal(report.surfaces[0].posture, 'compliant');
});

test('accessibilityRecommendationsToTasks and class wrapper emit schema-valid tasks and history', () => {
    const auditor = new AccessibilityQualityAuditor({
        localAgentId: 'agent:access-local',
        now: () => 192_000
    });

    const report = auditor.evaluate(baseInput());
    const tasks = accessibilityRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = auditor.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:access-local');
    assert.equal(auditor.listHistory({ limit: 5 }).length, 1);
});
