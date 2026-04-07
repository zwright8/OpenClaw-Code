import test from 'node:test';
import assert from 'node:assert/strict';
import {
    planCivicServiceAutomation,
    civicAutomationToTasks,
    CivicServiceAutomationPlanner
} from '../index.js';

function baseInput() {
    return {
        services: [
            {
                serviceId: 'svc-housing-aid',
                requestVolume: 1400,
                backlog: 260,
                avgProcessingMinutes: 42,
                manualEffort: 82,
                citizenImpact: 90,
                digitalAccess: 46,
                equitySensitivity: 88,
                domains: ['intake', 'eligibility']
            },
            {
                serviceId: 'svc-permits',
                requestVolume: 500,
                backlog: 70,
                avgProcessingMinutes: 20,
                manualEffort: 58,
                citizenImpact: 62,
                digitalAccess: 74,
                equitySensitivity: 54,
                domains: ['document_processing']
            }
        ],
        automations: [
            {
                automationId: 'auto-intake',
                domains: ['intake'],
                throughputGain: 38,
                complexityCost: 52,
                equityGuardrail: 70,
                capacityCost: 2
            },
            {
                automationId: 'auto-doc',
                domains: ['document_processing'],
                throughputGain: 30,
                complexityCost: 34,
                equityGuardrail: 64,
                capacityCost: 1
            }
        ],
        capacity: {
            implementationSlots: 2,
            engineeringHours: 24,
            serviceDeskHours: 8
        }
    };
}

test('planCivicServiceAutomation surfaces hold/fallback needs under tight capacity', () => {
    const report = planCivicServiceAutomation(baseInput(), {
        now: () => 1_400_000
    });

    assert.equal(report.summary.serviceCount, 2);
    assert.equal(report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold, 2);
    assert.equal(report.alerts.includes('civic_human_assist_gap') || report.alerts.includes('civic_service_hold_queue_present') || report.alerts.includes('civic_automation_coverage_gap'), true);
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'add_human_assist_fallback' || entry.type === 'digitize_intake_channel'
    )), true);
});

test('planCivicServiceAutomation returns deploy_ready posture for well-resourced service set', () => {
    const report = planCivicServiceAutomation({
        services: [
            {
                serviceId: 'svc-ok',
                requestVolume: 120,
                backlog: 8,
                avgProcessingMinutes: 8,
                manualEffort: 35,
                citizenImpact: 60,
                digitalAccess: 90,
                equitySensitivity: 40,
                domains: ['document_processing']
            }
        ],
        automations: [
            {
                automationId: 'auto-ok',
                domains: ['document_processing'],
                throughputGain: 24,
                complexityCost: 20,
                equityGuardrail: 72,
                capacityCost: 1
            }
        ],
        capacity: {
            implementationSlots: 5,
            engineeringHours: 100,
            serviceDeskHours: 30
        }
    }, {
        now: () => 1_401_000
    });

    assert.equal(report.summary.posture, 'deploy_ready');
    assert.equal(report.summary.laneCounts.hold, 0);
});

test('civicAutomationToTasks and class wrapper emit schema-valid tasks and history', () => {
    const planner = new CivicServiceAutomationPlanner({
        localAgentId: 'agent:civic-local',
        now: () => 1_402_000
    });

    const report = planner.evaluate(baseInput());
    const tasks = civicAutomationToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = planner.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:civic-local');
    assert.equal(planner.listHistory({ limit: 5 }).length, 1);
});
