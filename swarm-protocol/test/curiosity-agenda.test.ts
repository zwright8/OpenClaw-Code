import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CuriosityAgendaPlanner,
    compileCuriosityAgenda,
    curiosityAgendaToTaskRequests
} from '../index.js';

function sampleTruthReport() {
    return {
        results: [
            {
                id: 'h-critical-uncertain',
                statement: 'Critical uncertain hypothesis',
                priorConfidence: 0.5,
                posteriorConfidence: 0.48,
                confidenceDelta: -0.02,
                supportScore: 0.2,
                contradictionScore: 0.4,
                status: 'uncertain',
                criticality: 'critical',
                relatedMissionIds: ['mission-a']
            },
            {
                id: 'h-supported-normal',
                statement: 'Supported normal hypothesis',
                priorConfidence: 0.7,
                posteriorConfidence: 0.85,
                confidenceDelta: 0.15,
                supportScore: 0.8,
                contradictionScore: 0.1,
                status: 'supported',
                criticality: 'normal',
                relatedMissionIds: ['mission-b']
            },
            {
                id: 'h-unlikely-high',
                statement: 'Unlikely high-impact hypothesis',
                priorConfidence: 0.45,
                posteriorConfidence: 0.22,
                confidenceDelta: -0.23,
                supportScore: 0.1,
                contradictionScore: 0.9,
                status: 'unlikely',
                criticality: 'high',
                relatedMissionIds: ['mission-a']
            }
        ]
    };
}

function sampleMissionPortfolio() {
    return {
        rankedMissions: [
            { missionId: 'mission-a', score: 90 },
            { missionId: 'mission-b', score: 58 }
        ]
    };
}

test('compileCuriosityAgenda prioritizes uncertain critical and unlikely hypotheses', () => {
    const agenda = compileCuriosityAgenda({
        truthReport: sampleTruthReport(),
        missionPortfolio: sampleMissionPortfolio()
    }, {
        maxConcurrentExperiments: 3
    });

    assert.equal(agenda.summary.hypothesisCount, 3);
    assert.equal(agenda.rankedAgenda[0].id, 'h-unlikely-high');
    assert.ok(agenda.rankedAgenda[0].curiosityScore >= agenda.rankedAgenda[1].curiosityScore);
    assert.ok(agenda.recommendations.some((row) => row.type === 'falsify_hypothesis'));
    assert.ok(agenda.recommendations.some((row) => row.type === 'gather_evidence'));
});

test('capacity constraints defer overflow now-lane hypotheses into next lane', () => {
    const agenda = compileCuriosityAgenda({
        truthReport: sampleTruthReport(),
        missionPortfolio: sampleMissionPortfolio()
    }, {
        maxConcurrentExperiments: 1
    });

    assert.equal(agenda.summary.nowCount, 1);
    assert.ok(agenda.summary.nextCount >= 1);
    assert.ok(agenda.rankedAgenda.some((row) => row.capacityDeferred === true));
    assert.ok(agenda.recommendations.some((row) => row.type === 'prepare_experiment'));
});

test('curiosityAgendaToTaskRequests emits schema-valid tasks', () => {
    const agenda = compileCuriosityAgenda({
        truthReport: sampleTruthReport(),
        missionPortfolio: sampleMissionPortfolio()
    }, {
        maxConcurrentExperiments: 2
    });

    const tasks = curiosityAgendaToTaskRequests(agenda, {
        fromAgentId: 'agent:science'
    });

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:science');
    assert.equal(typeof tasks[0].context.hypothesisId, 'string');
});

test('CuriosityAgendaPlanner stores history and produces tasks', () => {
    const planner = new CuriosityAgendaPlanner({
        localAgentId: 'agent:curiosity-planner',
        now: () => 7_000
    });

    const agenda = planner.compile({
        truthReport: sampleTruthReport(),
        missionPortfolio: sampleMissionPortfolio()
    }, {
        maxConcurrentExperiments: 2
    });
    const tasks = planner.buildTaskRequests(agenda);

    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].from, 'agent:curiosity-planner');
    assert.equal(planner.listHistory({ limit: 5 }).length, 1);
});
