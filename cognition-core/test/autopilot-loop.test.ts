import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildAutopilotFocusBundleSpecs,
    buildAutopilotCycleSnapshot,
    buildAutopilotSummary,
    createAutopilotProfileMemory,
    detectPersistentStagnation,
    deriveAutopilotExecutionProfile,
    recordAutopilotProfileObservation,
    recommendAutopilotProfileFromMemory,
    shouldStopAutopilot
} from '../src/autopilot-loop.js';

test('buildAutopilotCycleSnapshot extracts key cycle metrics', () => {
    const snapshot = buildAutopilotCycleSnapshot({
        cycle: 2,
        buildExitCode: 2,
        startedAt: 1_000,
        finishedAt: 1_550,
        readiness: { status: 'warn', readinessScore: 0.82 },
        learning: {
            summary: { total: 12, successRate: 0.75, failureRate: 0.25 },
            state: { driftLevel: 'watch' }
        },
        analysis: { reliabilityScore: 92.4 }
    });

    assert.equal(snapshot.cycle, 2);
    assert.equal(snapshot.buildExitCode, 2);
    assert.equal(snapshot.durationMs, 550);
    assert.equal(snapshot.readinessStatus, 'warn');
    assert.equal(snapshot.readinessScore, 0.82);
    assert.equal(snapshot.outcomeTotal, 12);
    assert.equal(snapshot.successRate, 0.75);
    assert.equal(snapshot.failureRate, 0.25);
    assert.equal(snapshot.learningDrift, 'watch');
    assert.equal(snapshot.reliabilityScore, 92.4);
});

test('shouldStopAutopilot stops when target status reached', () => {
    const cycles = [
        { readinessStatus: 'fail', readinessScore: 0.6 },
        { readinessStatus: 'pass', readinessScore: 0.92 }
    ];
    const decision = shouldStopAutopilot(cycles, { targetStatus: 'pass' });
    assert.equal(decision.stop, true);
    assert.equal(decision.reason, 'target_status_reached:pass');
});

test('shouldStopAutopilot stops when readiness and outcomes plateau after patience window', () => {
    const cycles = [
        { readinessStatus: 'fail', readinessScore: 0.70, outcomeTotal: 10 },
        { readinessStatus: 'fail', readinessScore: 0.702, outcomeTotal: 10 },
        { readinessStatus: 'fail', readinessScore: 0.703, outcomeTotal: 10 }
    ];
    const decision = shouldStopAutopilot(cycles, {
        targetStatus: 'pass',
        plateauPatience: 2,
        minReadinessGain: 0.005,
        minOutcomeGain: 1
    });
    assert.equal(decision.stop, true);
    assert.ok(decision.reason.startsWith('plateau:'));
    assert.equal(decision.stagnationCause, 'both');
});

test('shouldStopAutopilot continues when outcomes still grow despite readiness plateau', () => {
    const cycles = [
        { readinessStatus: 'fail', readinessScore: 0.70, outcomeTotal: 10 },
        { readinessStatus: 'fail', readinessScore: 0.702, outcomeTotal: 11 },
        { readinessStatus: 'fail', readinessScore: 0.703, outcomeTotal: 12 }
    ];
    const decision = shouldStopAutopilot(cycles, {
        targetStatus: 'pass',
        plateauPatience: 2,
        minReadinessGain: 0.005,
        minOutcomeGain: 1
    });
    assert.equal(decision.stop, false);
    assert.equal(decision.reason, 'continue');
    assert.equal(decision.stagnationCause, 'readiness_only');
});

test('shouldStopAutopilot adapts thresholds from baseline and stops after mixed gains flatten', () => {
    const cycles = [
        { readinessStatus: 'fail', readinessScore: 0.60, outcomeTotal: 2 },
        { readinessStatus: 'fail', readinessScore: 0.75, outcomeTotal: 6 },
        { readinessStatus: 'warn', readinessScore: 0.83, outcomeTotal: 9 },
        { readinessStatus: 'warn', readinessScore: 0.84, outcomeTotal: 10 },
        { readinessStatus: 'warn', readinessScore: 0.841, outcomeTotal: 10 }
    ];

    const prePlateau = shouldStopAutopilot(cycles.slice(0, 4), {
        targetStatus: 'pass',
        plateauPatience: 2,
        minReadinessGain: 0.005,
        minOutcomeGain: 1
    });
    assert.equal(prePlateau.stop, false);
    assert.equal(prePlateau.stagnationCause, 'none');

    const decision = shouldStopAutopilot(cycles, {
        targetStatus: 'pass',
        plateauPatience: 2,
        minReadinessGain: 0.005,
        minOutcomeGain: 1
    });
    assert.equal(decision.stop, true);
    assert.equal(decision.stagnationCause, 'both');
    assert.equal(decision.thresholds.adaptiveApplied, true);
    assert.ok(decision.thresholds.effectiveReadinessGain > 0.005);
    assert.ok(decision.thresholds.effectiveOutcomeGain > 1);
});

test('buildAutopilotSummary computes gains and final status', () => {
    const cycles = [
        { readinessStatus: 'fail', readinessScore: 0.75, outcomeTotal: 2 },
        { readinessStatus: 'warn', readinessScore: 0.81, outcomeTotal: 5 }
    ];
    const summary = buildAutopilotSummary(cycles, { reason: 'continue' });

    assert.equal(summary.cycles, 2);
    assert.equal(summary.finalReadinessStatus, 'warn');
    assert.equal(summary.finalReadinessScore, 0.81);
    assert.equal(summary.readinessGain, 0.06);
    assert.equal(summary.outcomeGain, 3);
    assert.equal(summary.stagnationCause, 'none');
    assert.equal(summary.stopReason, 'continue');
});

test('deriveAutopilotExecutionProfile prioritizes remediation on readiness stagnation', () => {
    const cycles = [
        { readinessStatus: 'fail', readinessScore: 0.75, outcomeTotal: 8 }
    ];
    const profile = deriveAutopilotExecutionProfile(cycles, {
        stagnationCause: 'readiness_only',
        thresholds: { adaptiveApplied: false }
    });

    assert.equal(profile.focus, 'reliability_recovery');
    assert.equal(profile.stagnationCause, 'readiness_only');
    assert.ok(profile.remediationMax > profile.skillGrowthMax);
    assert.ok(profile.dispatchLimit >= 50);
});

test('deriveAutopilotExecutionProfile prioritizes skill growth on outcome stagnation', () => {
    const cycles = [
        { readinessStatus: 'warn', readinessScore: 0.83, outcomeTotal: 12 }
    ];
    const profile = deriveAutopilotExecutionProfile(cycles, {
        stagnationCause: 'outcomes_only',
        thresholds: { adaptiveApplied: false }
    });

    assert.equal(profile.focus, 'balanced_stabilization');
    assert.equal(profile.stagnationCause, 'outcomes_only');
    assert.ok(profile.skillGrowthMax > profile.remediationMax);
    assert.ok(profile.iterationMax >= 5);
});

test('deriveAutopilotExecutionProfile escalates to systemic sprint on dual stagnation', () => {
    const cycles = [
        { readinessStatus: 'warn', readinessScore: 0.86, outcomeTotal: 10 }
    ];
    const profile = deriveAutopilotExecutionProfile(cycles, {
        stagnationCause: 'both',
        thresholds: { adaptiveApplied: true }
    });

    assert.equal(profile.focus, 'systemic_recovery_sprint');
    assert.equal(profile.stagnationCause, 'both');
    assert.equal(profile.adaptiveApplied, true);
    assert.ok(profile.dispatchLimit >= 60);
    assert.ok(profile.iterationMax >= 7);
});

test('profile memory records observations and recommends best profile for context', () => {
    let memory = createAutopilotProfileMemory();
    memory = recordAutopilotProfileObservation(memory, {
        executionProfile: {
            focus: 'reliability_recovery',
            readinessStatus: 'fail',
            stagnationCause: 'readiness_only',
            maxRemediationTasks: 6,
            maxSkillGrowthTasks: 3,
            maxIterationTasks: 4,
            dispatchLimit: 60
        },
        previousCycle: { readinessScore: 0.6, outcomeTotal: 5 },
        currentCycle: { readinessScore: 0.7, outcomeTotal: 7 },
        stopDecision: { stagnationCause: 'readiness_only' }
    });
    memory = recordAutopilotProfileObservation(memory, {
        executionProfile: {
            focus: 'reliability_recovery',
            readinessStatus: 'fail',
            stagnationCause: 'readiness_only',
            maxRemediationTasks: 6,
            maxSkillGrowthTasks: 3,
            maxIterationTasks: 4,
            dispatchLimit: 60
        },
        previousCycle: { readinessScore: 0.7, outcomeTotal: 7 },
        currentCycle: { readinessScore: 0.78, outcomeTotal: 8 },
        stopDecision: { stagnationCause: 'readiness_only' }
    });
    memory = recordAutopilotProfileObservation(memory, {
        executionProfile: {
            focus: 'frontier_exploration',
            readinessStatus: 'fail',
            stagnationCause: 'readiness_only',
            maxRemediationTasks: 3,
            maxSkillGrowthTasks: 5,
            maxIterationTasks: 5,
            dispatchLimit: 45
        },
        previousCycle: { readinessScore: 0.78, outcomeTotal: 8 },
        currentCycle: { readinessScore: 0.76, outcomeTotal: 8 },
        stopDecision: { stagnationCause: 'readiness_only' }
    });

    assert.equal(memory.totalObservations, 3);
    const recommendation = recommendAutopilotProfileFromMemory(memory, {
        readinessStatus: 'fail',
        stagnationCause: 'readiness_only',
        minObservations: 2
    });
    assert.equal(recommendation.selected.focus, 'reliability_recovery');
});

test('deriveAutopilotExecutionProfile blends with profile memory recommendation', () => {
    const memory = {
        version: 1,
        profiles: {
            reliability_recovery: {
                observations: 3,
                avgScore: 2.1,
                avgRemediationMax: 9,
                avgSkillGrowthMax: 2,
                avgIterationMax: 6,
                avgDispatchLimit: 80,
                contexts: {}
            }
        }
    };
    const profile = deriveAutopilotExecutionProfile(
        [{ readinessStatus: 'fail', readinessScore: 0.7, outcomeTotal: 10 }],
        { stagnationCause: 'readiness_only', thresholds: { adaptiveApplied: false } },
        { profileMemory: memory, profileMemoryWeight: 0.5, minProfileObservations: 2 }
    );

    assert.ok(profile.remediationMax >= 7);
    assert.ok(profile.dispatchLimit >= 70);
    assert.ok(profile.rationale.some((item) => item.includes('memory')));
    assert.equal(profile.memoryRecommendation.focus, 'reliability_recovery');
});

test('detectPersistentStagnation requires sustained non-none causes', () => {
    const persisted = detectPersistentStagnation([
        { stagnationCause: 'none' },
        { stagnationCause: 'readiness_only' },
        { stagnationCause: 'readiness_only' }
    ], { window: 2 });
    assert.equal(persisted.persisted, true);
    assert.equal(persisted.cause, 'readiness_only');

    const notPersisted = detectPersistentStagnation([
        { stagnationCause: 'none' },
        { stagnationCause: 'none' }
    ], { window: 2 });
    assert.equal(notPersisted.persisted, false);
});

test('buildAutopilotFocusBundleSpecs emits actionable tasks for persistent stagnation', () => {
    const specs = buildAutopilotFocusBundleSpecs({
        executionProfile: { focus: 'systemic_recovery_sprint', stagnationCause: 'both' },
        stopDecision: { stagnationCause: 'both' },
        persistence: { persisted: true, cause: 'both' },
        cycle: 4
    }, { maxItems: 2 });

    assert.equal(specs.length, 2);
    assert.equal(specs[0].priority, 'critical');
    assert.equal(specs[0].target, 'agent:cognition:critical');
    assert.ok(specs[0].task.includes('Stagnation cause: both'));
});
