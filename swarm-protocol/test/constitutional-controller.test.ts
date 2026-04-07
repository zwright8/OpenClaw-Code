import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ConstitutionalExecutionController,
    computeConstitutionalExecutionPlan,
    constitutionalPlanToDispatchTasks,
    constitutionalPlanToMitigationTasks
} from '../index.js';

function sampleLaunchBatch() {
    return {
        launches: [
            {
                missionId: 'mission-a',
                objective: 'Mission A',
                score: 90,
                launchDecision: 'immediate',
                taskRequest: {
                    kind: 'task_request',
                    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
                    from: 'agent:launcher',
                    target: 'agent:ops',
                    priority: 'high',
                    task: 'Launch mission a',
                    createdAt: 1_000
                }
            },
            {
                missionId: 'mission-b',
                objective: 'Mission B',
                score: 82,
                launchDecision: 'immediate',
                taskRequest: {
                    kind: 'task_request',
                    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
                    from: 'agent:launcher',
                    target: 'agent:ops',
                    priority: 'normal',
                    task: 'Launch mission b',
                    createdAt: 1_001
                }
            },
            {
                missionId: 'mission-c',
                objective: 'Mission C',
                score: 70,
                launchDecision: 'deferred',
                reason: 'capacity_deferred',
                taskRequest: {
                    kind: 'task_request',
                    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
                    from: 'agent:launcher',
                    target: 'agent:ops',
                    priority: 'normal',
                    task: 'Launch mission c',
                    createdAt: 1_002
                }
            }
        ]
    };
}

test('computeConstitutionalExecutionPlan dispatches immediate launches in active mode', () => {
    const plan = computeConstitutionalExecutionPlan({
        launchBatch: sampleLaunchBatch(),
        constitutionReport: {
            tier: 'aligned',
            overallScore: 84,
            recommendations: []
        },
        humanityReport: {
            posture: 'aligned',
            recommendations: []
        }
    }, {
        maxActiveLaunches: 5
    });

    assert.equal(plan.mode, 'active');
    assert.equal(plan.summary.dispatchCount, 2);
    assert.equal(plan.summary.blockedCount, 0);
});

test('caution mode throttles immediate launches', () => {
    const plan = computeConstitutionalExecutionPlan({
        launchBatch: sampleLaunchBatch(),
        constitutionReport: {
            tier: 'caution',
            overallScore: 58,
            recommendations: []
        },
        humanityReport: {
            posture: 'review_required',
            recommendations: []
        }
    }, {
        cautionThrottleFactor: 0.5,
        allowLaunchWhenReviewRequired: true
    });

    assert.equal(plan.mode, 'caution');
    assert.equal(plan.summary.dispatchCount, 1);
    assert.ok(plan.summary.deferredByConstitutionCount >= 1);
});

test('paused mode blocks launches and carries blocking reasons', () => {
    const plan = computeConstitutionalExecutionPlan({
        launchBatch: sampleLaunchBatch(),
        constitutionReport: {
            tier: 'non_compliant',
            overallScore: 28,
            blockingReasons: ['pro_humanity_low'],
            recommendations: [
                {
                    type: 'pause_autonomy',
                    title: 'Pause autonomy',
                    description: 'non compliant',
                    priority: 'P1'
                }
            ]
        },
        humanityReport: {
            posture: 'blocked',
            recommendations: [
                {
                    type: 'redesign_for_human_safety',
                    title: 'Redesign',
                    description: 'humanity blocked',
                    priority: 'P1'
                }
            ]
        }
    });

    assert.equal(plan.mode, 'paused');
    assert.equal(plan.summary.dispatchCount, 0);
    assert.ok(plan.blockingReasons.includes('constitution_paused'));
    assert.ok(plan.blockingReasons.includes('humanity_blocked'));
    assert.ok(plan.recommendations.length >= 2);
});

test('task conversion and class wrapper emit valid tasks and history', () => {
    const controller = new ConstitutionalExecutionController({
        localAgentId: 'agent:constitution-controller',
        now: () => 22_000
    });

    const plan = controller.plan({
        launchBatch: sampleLaunchBatch(),
        constitutionReport: {
            tier: 'caution',
            overallScore: 54,
            recommendations: [
                {
                    type: 'strengthen_truth_process',
                    title: 'Strengthen truth',
                    description: 'raise evidence quality',
                    priority: 'P2'
                }
            ]
        },
        humanityReport: {
            posture: 'review_required',
            recommendations: [
                {
                    type: 'add_humanity_safeguards',
                    title: 'Add safeguards',
                    description: 'reduce risk',
                    priority: 'P2'
                }
            ]
        }
    }, {
        cautionThrottleFactor: 0.5,
        allowLaunchWhenReviewRequired: true
    });

    const dispatchTasks = constitutionalPlanToDispatchTasks(plan);
    const mitigationTasks = constitutionalPlanToMitigationTasks(plan, {
        fromAgentId: 'agent:planner'
    });
    const classMitigationTasks = controller.buildMitigationTasks(plan);

    assert.ok(dispatchTasks.length >= 1);
    assert.equal(dispatchTasks[0].kind, 'task_request');

    assert.ok(mitigationTasks.length >= 1);
    assert.equal(mitigationTasks[0].from, 'agent:planner');

    assert.ok(classMitigationTasks.length >= 1);
    assert.equal(classMitigationTasks[0].from, 'agent:constitution-controller');
    assert.equal(controller.listHistory({ limit: 3 }).length, 1);
});
