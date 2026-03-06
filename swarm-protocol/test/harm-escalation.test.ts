import test from 'node:test';
import assert from 'node:assert/strict';
import {
    HarmEscalationEarlyWarning,
    evaluateHarmEscalation,
    harmEscalationToTasks
} from '../index.js';

test('evaluateHarmEscalation returns normal/watch levels when signals are low', () => {
    const report = evaluateHarmEscalation({
        incidents: [
            {
                id: 'inc-1',
                severity: 25,
                growthRate: 8,
                affectedPopulation: 800,
                confidence: 70,
                containmentCoverage: 85
            }
        ],
        communityReport: {
            summary: {
                highRiskCount: 0,
                urgentCount: 0
            }
        },
        equityReport: {
            summary: {
                posture: 'aligned',
                disparityGap: 8,
                highVulnerabilityHarm: 14
            }
        },
        societalReport: {
            summary: {
                trajectory: 'stable',
                alertCount: 0
            }
        }
    }, {
        now: () => 80_000
    });

    assert.equal(['normal', 'watch'].includes(report.escalationLevel), true);
    assert.equal(report.scores.currentRiskScore < 60, true);
    assert.equal(report.alerts.includes('broad_harm_escalation_likely'), false);
});

test('evaluateHarmEscalation marks severe/critical under rapid high-harm escalation signals', () => {
    const report = evaluateHarmEscalation({
        incidents: [
            {
                id: 'inc-a',
                severity: 92,
                growthRate: 88,
                affectedPopulation: 340_000,
                confidence: 90,
                containmentCoverage: 15
            },
            {
                id: 'inc-b',
                severity: 84,
                growthRate: 81,
                affectedPopulation: 220_000,
                confidence: 86,
                containmentCoverage: 22
            }
        ],
        communityReport: {
            summary: {
                highRiskCount: 3,
                urgentCount: 4
            }
        },
        equityReport: {
            summary: {
                posture: 'blocked',
                disparityGap: 48,
                highVulnerabilityHarm: 58
            }
        },
        societalReport: {
            summary: {
                trajectory: 'declining',
                alertCount: 3
            }
        },
        externalityReport: {
            summary: {
                trajectory: 'fragile',
                finalRiskScore: 76
            }
        },
        humanityReport: {
            summary: {
                blockedCount: 3
            }
        }
    }, {
        now: () => 81_000,
        horizonHours: 24
    });

    assert.equal(['severe', 'critical'].includes(report.escalationLevel), true);
    assert.equal(report.scores.currentRiskScore >= 70, true);
    assert.equal(report.alerts.includes('broad_harm_escalation_likely'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'activate_harm_containment'), true);
});

test('harmEscalationToTasks and class wrapper emit schema-valid tasks and history', () => {
    const warning = new HarmEscalationEarlyWarning({
        localAgentId: 'agent:harm-local',
        now: () => 82_000
    });

    const report = warning.evaluate({
        incidents: [
            {
                id: 'inc-a',
                severity: 78,
                growthRate: 68,
                affectedPopulation: 90_000,
                confidence: 82,
                containmentCoverage: 30
            }
        ],
        communityReport: {
            summary: {
                highRiskCount: 1,
                urgentCount: 1
            }
        }
    });

    const tasks = harmEscalationToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = warning.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');

    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:harm-local');
    assert.equal(warning.listHistory({ limit: 5 }).length, 1);
});
