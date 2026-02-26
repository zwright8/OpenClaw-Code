import test from 'node:test';
import assert from 'node:assert/strict';
import { DriftSentinel } from '../index.js';

function baselineSnapshot() {
    return {
        at: 10_000,
        worldState: {
            avgEntityConfidence: 0.82,
            avgEdgeConfidence: 0.79,
            entities: 120,
            edges: 320
        },
        marketplace: {
            skills: [
                {
                    id: 'skill:analysis-fast',
                    status: 'active',
                    qualityScore: 0.9,
                    verification: {
                        attempts: 20,
                        successes: 18,
                        failures: 2
                    }
                },
                {
                    id: 'skill:ops',
                    status: 'active',
                    qualityScore: 0.88,
                    verification: {
                        attempts: 20,
                        successes: 19,
                        failures: 1
                    }
                }
            ]
        },
        optimizer: {
            successRateAvg: 0.9,
            avgLatencyMs: 120,
            timeoutRateAvg: 0.04
        }
    };
}

function driftedSnapshot() {
    return {
        at: 20_000,
        worldState: {
            avgEntityConfidence: 0.68,
            avgEdgeConfidence: 0.62,
            entities: 100,
            edges: 280
        },
        marketplace: {
            skills: [
                {
                    id: 'skill:analysis-fast',
                    status: 'active',
                    qualityScore: 0.9,
                    verification: {
                        attempts: 20,
                        successes: 11,
                        failures: 9
                    }
                },
                {
                    id: 'skill:ops',
                    status: 'retired',
                    qualityScore: 0.88,
                    verification: {
                        attempts: 20,
                        successes: 18,
                        failures: 2
                    }
                }
            ]
        },
        optimizer: {
            successRateAvg: 0.71,
            avgLatencyMs: 190,
            timeoutRateAvg: 0.19
        }
    };
}

test('evaluate detects multi-domain drift alerts', () => {
    const sentinel = new DriftSentinel();
    sentinel.setBaseline(baselineSnapshot());

    const report = sentinel.evaluate(driftedSnapshot(), {
        entityConfidenceDropThreshold: 0.08,
        edgeConfidenceDropThreshold: 0.08,
        skillSuccessDropThreshold: 0.15,
        latencyIncreaseRatioThreshold: 0.2,
        timeoutIncreaseThreshold: 0.1
    });

    assert.ok(report.alerts.length >= 5);
    assert.ok(report.alerts.some((alert) => alert.code === 'world_state_entity_confidence_drop'));
    assert.ok(report.alerts.some((alert) => alert.code === 'skill_success_rate_drop'));
    assert.ok(report.alerts.some((alert) => alert.code === 'optimizer_latency_regression'));
});

test('buildMitigationTasks creates task requests from drift alerts', () => {
    const sentinel = new DriftSentinel();
    sentinel.setBaseline(baselineSnapshot());
    const report = sentinel.evaluate(driftedSnapshot());

    const tasks = sentinel.buildMitigationTasks(report.alerts);
    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:drift-sentinel');
    assert.ok(tasks[0].task.includes('Investigate drift'));
});

test('history tracks sequential evaluations', () => {
    const sentinel = new DriftSentinel();
    sentinel.setBaseline(baselineSnapshot());

    sentinel.evaluate(driftedSnapshot());
    sentinel.evaluate(driftedSnapshot(), {
        entityConfidenceDropThreshold: 0.2,
        edgeConfidenceDropThreshold: 0.2,
        skillSuccessDropThreshold: 0.3,
        latencyIncreaseRatioThreshold: 0.5,
        timeoutIncreaseThreshold: 0.3
    });

    const history = sentinel.listHistory();
    assert.equal(history.length, 2);
    assert.ok(history[0].alerts.length >= history[1].alerts.length);
});
