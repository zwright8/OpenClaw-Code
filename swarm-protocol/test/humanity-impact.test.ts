import test from 'node:test';
import assert from 'node:assert/strict';
import {
    HumanityImpactGuardrail,
    evaluateHumanityImpact,
    humanityRecommendationsToTasks
} from '../index.js';

test('evaluateHumanityImpact marks pro-human reliability tasks as aligned', () => {
    const report = evaluateHumanityImpact({
        tasks: [
            {
                id: 'task-safe',
                task: 'Improve reliability and safety monitoring for incident response',
                context: {
                    riskTags: ['operations']
                }
            }
        ]
    });

    assert.equal(report.posture, 'aligned');
    assert.equal(report.summary.alignedCount, 1);
    assert.equal(report.summary.blockedCount, 0);
});

test('evaluateHumanityImpact blocks tasks with hard harm signals', () => {
    const report = evaluateHumanityImpact({
        tasks: [
            {
                id: 'task-harmful',
                task: 'Build malware to automate credential theft campaign',
                context: {
                    riskTags: ['security']
                }
            }
        ]
    });

    assert.equal(report.posture, 'blocked');
    assert.equal(report.summary.blockedCount, 1);
    assert.ok(report.assessments[0].hardBlockSignals.length > 0);
    assert.ok(report.recommendations.some((row) => row.type === 'redesign_for_human_safety'));
});

test('evaluateHumanityImpact flags mixed-risk items for review', () => {
    const report = evaluateHumanityImpact({
        missions: [
            {
                missionId: 'mission-mixed',
                objective: 'Expand surveillance tooling for fraud detection',
                riskTags: ['security']
            }
        ]
    }, {
        harmKeywords: ['surveillance', 'fraud'],
        hardBlockKeywords: ['malware']
    });

    assert.equal(report.posture, 'review_required');
    assert.equal(report.summary.reviewRequiredCount, 1);
    assert.ok(report.recommendations.some((row) => row.type === 'add_humanity_safeguards'));
});

test('humanityRecommendationsToTasks and guardrail class produce schema-valid tasks and history', () => {
    const guardrail = new HumanityImpactGuardrail({
        localAgentId: 'agent:humanity',
        now: () => 12_000
    });

    const report = guardrail.evaluate({
        tasks: [
            {
                id: 'task-doc',
                task: 'Investigate ambiguous operations workflow',
                context: {
                    riskTags: ['security']
                }
            }
        ]
    }, {
        benefitKeywords: ['reliability'],
        harmKeywords: ['security'],
        hardBlockKeywords: ['malware']
    });

    const tasks = humanityRecommendationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const guardrailTasks = guardrail.buildTasks(report);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].context.recommendationType, 'string');

    assert.ok(guardrailTasks.length > 0);
    assert.equal(guardrailTasks[0].from, 'agent:humanity');
    assert.equal(guardrail.listHistory({ limit: 5 }).length, 1);
});
