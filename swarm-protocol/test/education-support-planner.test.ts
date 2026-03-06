import test from 'node:test';
import assert from 'node:assert/strict';
import {
    planEducationSupport,
    educationSupportToTasks,
    EducationSupportPlanner
} from '../index.js';

function baseInput() {
    return {
        cohorts: [
            {
                cohortId: 'cohort-a',
                name: 'Grade 8 A',
                learnerCount: 45,
                performanceIndex: 42,
                attendanceRate: 61,
                resourceAccess: 48,
                supportCoverage: 40,
                riskFactors: ['housing_instability', 'transportation'],
                region: 'north'
            },
            {
                cohortId: 'cohort-b',
                name: 'Grade 7 B',
                learnerCount: 30,
                performanceIndex: 68,
                attendanceRate: 78,
                resourceAccess: 72,
                supportCoverage: 66,
                riskFactors: [],
                region: 'north'
            }
        ],
        interventions: [
            {
                interventionId: 'int-tutoring',
                domains: ['performance'],
                intensity: 75,
                capacityCost: 2,
                expectedGain: 28
            },
            {
                interventionId: 'int-outreach',
                domains: ['attendance', 'family_outreach'],
                intensity: 68,
                capacityCost: 2,
                expectedGain: 24
            },
            {
                interventionId: 'int-resource',
                domains: ['resource_access'],
                intensity: 62,
                capacityCost: 1,
                expectedGain: 17
            }
        ],
        capacity: {
            tutorHours: 14,
            outreachHours: 6,
            interventionSlots: 3
        }
    };
}

test('planEducationSupport prioritizes high-need cohorts and surfaces capacity gaps', () => {
    const report = planEducationSupport(baseInput(), {
        now: () => 1_300_000
    });

    assert.equal(report.summary.cohortCount, 2);
    assert.equal(report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold, 2);
    assert.equal(report.alerts.includes('education_tutor_capacity_gap') || report.alerts.includes('education_outreach_capacity_gap') || report.alerts.includes('education_support_hold_queue_present'), true);
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'launch_targeted_support' || entry.type === 'assign_tutor_capacity'
    )), true);
});

test('planEducationSupport reports deploy_ready posture for sufficiently resourced cohorts', () => {
    const report = planEducationSupport({
        cohorts: [
            {
                cohortId: 'cohort-ok',
                learnerCount: 20,
                performanceIndex: 82,
                attendanceRate: 91,
                resourceAccess: 88,
                supportCoverage: 84,
                riskFactors: []
            }
        ],
        interventions: [
            {
                interventionId: 'int-ok',
                domains: ['performance'],
                intensity: 70,
                capacityCost: 1,
                expectedGain: 18
            }
        ],
        capacity: {
            tutorHours: 30,
            outreachHours: 20,
            interventionSlots: 5
        }
    }, {
        now: () => 1_301_000
    });

    assert.equal(report.summary.posture, 'deploy_ready');
    assert.equal(report.summary.laneCounts.hold, 0);
});

test('educationSupportToTasks and class wrapper emit schema-valid tasks and history', () => {
    const planner = new EducationSupportPlanner({
        localAgentId: 'agent:edu-local',
        now: () => 1_302_000
    });

    const report = planner.evaluate(baseInput());
    const tasks = educationSupportToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = planner.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:edu-local');
    assert.equal(planner.listHistory({ limit: 5 }).length, 1);
});
