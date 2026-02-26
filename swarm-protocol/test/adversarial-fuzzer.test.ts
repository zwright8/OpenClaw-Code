import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AdversarialRobustnessFuzzer,
    runAdversarialRobustnessFuzzer,
    adversarialFuzzerToTasks
} from '../index.js';

test('runAdversarialRobustnessFuzzer reports elevated/critical risk for weakly-guarded high-privilege surfaces', () => {
    const report = runAdversarialRobustnessFuzzer({
        targets: [
            {
                id: 'target-weak',
                name: 'Privileged shell orchestrator',
                surface: 'tooling',
                guardCoverage: 18,
                privilegeLevel: 92,
                exposureLevel: 85,
                historicalIncidentRate: 68,
                capabilities: ['shell_exec', 'network_access', 'filesystem_write', 'secrets_access']
            }
        ]
    }, {
        now: () => 100_000,
        maxCasesPerType: 2
    });

    assert.equal(report.summary.robustnessScore <= 52, true);
    assert.equal(['high', 'critical'].includes(report.summary.threatLevel), true);
    assert.equal(report.alerts.includes('critical_exposure_detected'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'patch_guardrail'), true);
});

test('runAdversarialRobustnessFuzzer reports stable posture for hardened low-privilege targets', () => {
    const report = runAdversarialRobustnessFuzzer({
        targets: [
            {
                id: 'target-safe',
                name: 'Read-only analysis worker',
                surface: 'analysis',
                guardCoverage: 92,
                privilegeLevel: 18,
                exposureLevel: 20,
                historicalIncidentRate: 4,
                capabilities: ['read_only']
            }
        ]
    }, {
        now: () => 101_000,
        maxCasesPerType: 2
    });

    assert.equal(report.summary.robustnessScore >= 70, true);
    assert.equal(['stable', 'elevated'].includes(report.summary.threatLevel), true);
});

test('adversarialFuzzerToTasks and class wrapper emit schema-valid tasks and history', () => {
    const fuzzer = new AdversarialRobustnessFuzzer({
        localAgentId: 'agent:fuzzer-local',
        now: () => 102_000
    });

    const report = fuzzer.evaluate({
        targets: [
            {
                id: 'target-mid',
                name: 'Workflow router',
                surface: 'routing',
                guardCoverage: 55,
                privilegeLevel: 55,
                exposureLevel: 60,
                historicalIncidentRate: 22,
                capabilities: ['task_routing', 'tool_call']
            }
        ]
    }, {
        maxCasesPerType: 1
    });

    const tasks = adversarialFuzzerToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = fuzzer.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:fuzzer-local');
    assert.equal(fuzzer.listHistory({ limit: 5 }).length, 1);
});
