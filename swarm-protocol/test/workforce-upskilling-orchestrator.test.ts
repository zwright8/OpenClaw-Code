import test from 'node:test';
import assert from 'node:assert/strict';
import {
    orchestrateWorkforceUpskilling,
    upskillingPlanToTasks,
    WorkforceUpskillingOrchestrator
} from '../index.js';

function baseInput() {
    return {
        roles: [
            {
                roleId: 'role-field-services',
                headcount: 24,
                skillCoverage: 42,
                automationExposure: 84,
                criticality: 88,
                attritionRisk: 62,
                learningReadiness: 54,
                domains: ['case_triage', 'intake']
            },
            {
                roleId: 'role-backoffice',
                headcount: 14,
                skillCoverage: 55,
                automationExposure: 68,
                criticality: 70,
                attritionRisk: 48,
                learningReadiness: 66,
                domains: ['documentation']
            }
        ],
        learningPrograms: [
            {
                programId: 'program-ai-triage',
                domains: ['case_triage'],
                expectedSkillGain: 42,
                deliveryComplexity: 58,
                mentorIntensity: 44,
                budgetCost: 3,
                slotCost: 1
            },
            {
                programId: 'program-docs',
                domains: ['documentation'],
                expectedSkillGain: 28,
                deliveryComplexity: 36,
                mentorIntensity: 24,
                budgetCost: 2,
                slotCost: 1
            }
        ],
        capacity: {
            trainingSlots: 1,
            mentorHours: 10,
            budgetUnits: 2
        }
    };
}

test('orchestrateWorkforceUpskilling surfaces hold and capacity pressure under tight constraints', () => {
    const report = orchestrateWorkforceUpskilling(baseInput(), {
        now: () => 1_600_000
    });

    assert.equal(report.summary.roleCount, 2);
    assert.equal(report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold, 2);
    assert.equal(
        report.alerts.includes('workforce_upskilling_hold_queue_present')
        || report.alerts.includes('workforce_mentor_capacity_gap')
        || report.alerts.includes('workforce_program_coverage_gap'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'assign_mentor_capacity' || entry.type === 'secure_training_budget'
    )), true);
});

test('orchestrateWorkforceUpskilling reports upskilling_ready for well-resourced training profile', () => {
    const report = orchestrateWorkforceUpskilling({
        roles: [
            {
                roleId: 'role-ok',
                headcount: 8,
                skillCoverage: 72,
                automationExposure: 44,
                criticality: 64,
                attritionRisk: 25,
                learningReadiness: 84,
                domains: ['documentation']
            }
        ],
        learningPrograms: [
            {
                programId: 'program-ok',
                domains: ['documentation'],
                expectedSkillGain: 22,
                deliveryComplexity: 20,
                mentorIntensity: 10,
                budgetCost: 1,
                slotCost: 1
            }
        ],
        capacity: {
            trainingSlots: 5,
            mentorHours: 90,
            budgetUnits: 20
        }
    }, {
        now: () => 1_601_000
    });

    assert.equal(report.summary.posture, 'upskilling_ready');
    assert.equal(report.summary.laneCounts.hold, 0);
});

test('upskillingPlanToTasks and class wrapper emit schema-valid tasks and history', () => {
    const orchestrator = new WorkforceUpskillingOrchestrator({
        localAgentId: 'agent:upskilling-local',
        now: () => 1_602_000
    });

    const report = orchestrator.evaluate(baseInput());
    const tasks = upskillingPlanToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = orchestrator.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:upskilling-local');
    assert.equal(orchestrator.listHistory({ limit: 5 }).length, 1);
});
