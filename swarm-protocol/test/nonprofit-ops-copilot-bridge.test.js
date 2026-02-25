import test from 'node:test';
import assert from 'node:assert/strict';
import {
    bridgeNonprofitOpsCopilot,
    nonprofitOpsToTasks,
    NonprofitOpsCopilotBridge
} from '../index.js';

function baseInput() {
    return {
        programs: [
            {
                programId: 'prog-food-aid',
                adminLoad: 84,
                fundingVolatility: 72,
                volunteerDependence: 88,
                complianceBurden: 70,
                impactCriticality: 92,
                operationalDomains: ['grant_reporting', 'volunteer_management', 'case_intake']
            },
            {
                programId: 'prog-youth',
                adminLoad: 58,
                fundingVolatility: 44,
                volunteerDependence: 62,
                complianceBurden: 52,
                impactCriticality: 76,
                operationalDomains: ['scheduling', 'reporting']
            }
        ],
        copilotCapabilities: [
            {
                capabilityId: 'cap-grants',
                domains: ['grant_reporting'],
                quality: 82,
                reliability: 79,
                setupCost: 48,
                governanceReadiness: 58
            },
            {
                capabilityId: 'cap-volunteers',
                domains: ['volunteer_management'],
                quality: 75,
                reliability: 70,
                setupCost: 42,
                governanceReadiness: 66
            }
        ],
        capacity: {
            onboardingSlots: 1,
            implementationHours: 20,
            governanceReviewHours: 8
        }
    };
}

test('bridgeNonprofitOpsCopilot exposes ops gaps and coverage constraints under tight capacity', () => {
    const report = bridgeNonprofitOpsCopilot(baseInput(), {
        now: () => 1_500_000
    });

    assert.equal(report.summary.programCount, 2);
    assert.equal(report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold, 2);
    assert.equal(report.alerts.includes('nonprofit_ops_hold_queue_present') || report.alerts.includes('nonprofit_copilot_coverage_gap') || report.alerts.includes('nonprofit_ops_gap_high'), true);
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'configure_grant_reporting_flow' || entry.type === 'deploy_nonprofit_copilot'
    )), true);
});

test('bridgeNonprofitOpsCopilot reports bridge_ready for low-friction well-covered programs', () => {
    const report = bridgeNonprofitOpsCopilot({
        programs: [
            {
                programId: 'prog-ok',
                adminLoad: 35,
                fundingVolatility: 25,
                volunteerDependence: 40,
                complianceBurden: 30,
                impactCriticality: 70,
                operationalDomains: ['reporting']
            }
        ],
        copilotCapabilities: [
            {
                capabilityId: 'cap-ok',
                domains: ['reporting'],
                quality: 90,
                reliability: 88,
                setupCost: 18,
                governanceReadiness: 90
            }
        ],
        capacity: {
            onboardingSlots: 4,
            implementationHours: 120,
            governanceReviewHours: 40
        }
    }, {
        now: () => 1_501_000
    });

    assert.equal(report.summary.posture, 'bridge_ready');
    assert.equal(report.summary.laneCounts.hold, 0);
});

test('nonprofitOpsToTasks and class wrapper emit schema-valid tasks and history', () => {
    const bridge = new NonprofitOpsCopilotBridge({
        localAgentId: 'agent:nonprofit-local',
        now: () => 1_502_000
    });

    const report = bridge.evaluate(baseInput());
    const tasks = nonprofitOpsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = bridge.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:nonprofit-local');
    assert.equal(bridge.listHistory({ limit: 5 }).length, 1);
});
