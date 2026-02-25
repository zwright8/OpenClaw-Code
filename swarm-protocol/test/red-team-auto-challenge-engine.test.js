import test from 'node:test';
import assert from 'node:assert/strict';
import {
    runRedTeamAutoChallenge,
    redTeamChallengesToTasks,
    RedTeamAutoChallengeEngine
} from '../index.js';

function baseInput() {
    return {
        surfaces: [
            {
                surfaceId: 'surface-payments',
                domains: ['payments'],
                privilegeLevel: 86,
                guardrailStrength: 42,
                historicalFailures: 58,
                attackComplexity: 34,
                sensitivity: 92
            },
            {
                surfaceId: 'surface-docs',
                domains: ['documentation'],
                privilegeLevel: 36,
                guardrailStrength: 82,
                historicalFailures: 12,
                attackComplexity: 70,
                sensitivity: 40
            }
        ],
        probes: [
            {
                probeId: 'probe-payments',
                domains: ['payments'],
                potency: 88,
                coverage: 84,
                complexityCost: 52,
                analysisCost: 6
            },
            {
                probeId: 'probe-generic',
                domains: [],
                potency: 70,
                coverage: 66,
                complexityCost: 34,
                analysisCost: 3
            }
        ],
        capacity: {
            runSlots: 1,
            analysisHours: 4,
            manualReviewSlots: 0
        }
    };
}

test('runRedTeamAutoChallenge exposes probe and manual-review gaps under constrained capacity', () => {
    const report = runRedTeamAutoChallenge(baseInput(), {
        now: () => 2_400_000
    });

    assert.equal(report.summary.surfaceCount, 2);
    assert.equal(report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold, 2);
    assert.equal(
        report.alerts.includes('red_team_hold_queue_present')
        || report.alerts.includes('red_team_probe_coverage_gap')
        || report.alerts.includes('red_team_manual_review_gap'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'harden_guardrail_surface' || entry.type === 'schedule_manual_red_team_review'
    )), true);
});

test('runRedTeamAutoChallenge reports hardened posture when risk is low and probe capacity is sufficient', () => {
    const report = runRedTeamAutoChallenge({
        surfaces: [
            {
                surfaceId: 'surface-ok',
                domains: ['docs'],
                privilegeLevel: 20,
                guardrailStrength: 94,
                historicalFailures: 6,
                attackComplexity: 80,
                sensitivity: 28
            }
        ],
        probes: [
            {
                probeId: 'probe-ok',
                domains: ['docs'],
                potency: 74,
                coverage: 78,
                complexityCost: 18,
                analysisCost: 2
            }
        ],
        capacity: {
            runSlots: 4,
            analysisHours: 30,
            manualReviewSlots: 2
        }
    }, {
        now: () => 2_401_000
    });

    assert.equal(report.summary.posture, 'hardened');
    assert.equal(report.summary.laneCounts.hold, 0);
});

test('redTeamChallengesToTasks and class wrapper emit schema-valid tasks and history', () => {
    const engine = new RedTeamAutoChallengeEngine({
        localAgentId: 'agent:red-local',
        now: () => 2_402_000
    });

    const report = engine.evaluate(baseInput());
    const tasks = redTeamChallengesToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = engine.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:red-local');
    assert.equal(engine.listHistory({ limit: 5 }).length, 1);
});
