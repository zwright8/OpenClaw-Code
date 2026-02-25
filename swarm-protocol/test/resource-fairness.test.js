import test from 'node:test';
import assert from 'node:assert/strict';
import {
    allocateResourcesFairly,
    ResourceFairnessAllocator,
    resourceFairnessToTasks
} from '../index.js';

function baseInput() {
    return {
        demands: [
            {
                id: 'group-a',
                name: 'High-risk community A',
                requestedUnits: 500,
                minimumNeedUnits: 320,
                vulnerabilityIndex: 88,
                currentCoverage: 35,
                historicalUnderserved: 80,
                populationSize: 8_000,
                priority: 'critical'
            },
            {
                id: 'group-b',
                name: 'Regional community B',
                requestedUnits: 420,
                minimumNeedUnits: 240,
                vulnerabilityIndex: 62,
                currentCoverage: 52,
                historicalUnderserved: 55,
                populationSize: 10_500,
                priority: 'high'
            },
            {
                id: 'group-c',
                name: 'General community C',
                requestedUnits: 260,
                minimumNeedUnits: 120,
                vulnerabilityIndex: 40,
                currentCoverage: 74,
                historicalUnderserved: 30,
                populationSize: 12_000,
                priority: 'normal'
            }
        ],
        supply: {
            totalUnits: 460,
            reserveUnits: 40
        },
        policy: {
            reviewCoverageFloor: 60,
            criticalShortfallTolerance: 0.75
        }
    };
}

test('allocateResourcesFairly flags blocked posture when critical needs remain unmet', () => {
    const report = allocateResourcesFairly(baseInput(), {
        now: () => 210_000
    });

    assert.equal(report.summary.groupCount, 3);
    assert.equal(report.summary.blockedCount >= 1, true);
    assert.equal(report.alerts.includes('critical_need_unmet'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'reallocate_to_critical_group'), true);
});

test('allocateResourcesFairly can produce fair posture when supply covers demand', () => {
    const report = allocateResourcesFairly({
        ...baseInput(),
        supply: {
            totalUnits: 1_500,
            reserveUnits: 50
        }
    }, {
        now: () => 211_000
    });

    assert.equal(report.summary.blockedCount, 0);
    assert.equal(report.summary.reviewRequiredCount, 0);
    assert.equal(report.summary.portfolioPosture, 'fair');
});

test('resourceFairnessToTasks and class wrapper emit schema-valid tasks and history', () => {
    const allocator = new ResourceFairnessAllocator({
        localAgentId: 'agent:fairness-local',
        now: () => 212_000
    });

    const report = allocator.evaluate(baseInput());
    const tasks = resourceFairnessToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = allocator.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:fairness-local');
    assert.equal(allocator.listHistory({ limit: 5 }).length, 1);
});
