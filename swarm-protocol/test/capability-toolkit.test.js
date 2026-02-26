import test from 'node:test';
import assert from 'node:assert/strict';
import { createCapabilityToolkit } from '../src/capability-toolkit.js';

test('capability toolkit flags low signal coverage and degrades posture', () => {
    const toolkit = createCapabilityToolkit({
        capabilityId: 'coverage_audit_capability',
        collectionField: 'entities',
        idField: 'entityId',
        nameField: 'name',
        defaultName: 'Entity',
        readyPosture: 'ready'
    });

    const report = toolkit.evaluate({
        entities: [{
            entityId: 'entity-low-coverage',
            name: 'Low Coverage Entity',
            demand: 82
        }],
        capacity: {
            executionSlots: 4,
            analysisHours: 120,
            reviewHours: 60
        }
    }, {
        now: () => 1_000_000
    });

    assert.equal(report.summary.entityCount, 1);
    assert.equal(report.summary.lowCoverageCount, 1);
    assert.equal(report.summary.avgSignalCoverage < 0.2, true);
    assert.equal(report.summary.defaultedSignalRate > 0.8, true);
    assert.equal(
        report.summary.posture === 'review_required' || report.summary.posture === 'critical',
        true
    );
    assert.equal(report.alerts.includes('coverage_audit_capability_low_signal_coverage'), true);
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'coverage_audit_capability_audit_action'
    )), true);
});

test('capability toolkit preserves ready posture for high-confidence signals and emits enriched task context', () => {
    const toolkit = createCapabilityToolkit({
        capabilityId: 'coverage_ready_capability',
        collectionField: 'entities',
        idField: 'entityId',
        nameField: 'name',
        defaultName: 'Entity',
        readyPosture: 'ready'
    });

    const report = toolkit.evaluate({
        entities: [{
            entityId: 'entity-high-coverage',
            name: 'High Coverage Entity',
            demand: 32,
            capacity: 90,
            risk: 22,
            impact: 64,
            readiness: 88,
            resilience: 90,
            equity: 74,
            efficiency: 86,
            quality: 88,
            trust: 90,
            opportunity: 63,
            criticality: 34
        }],
        capacity: {
            executionSlots: 2,
            analysisHours: 64,
            reviewHours: 24
        }
    }, {
        now: () => 2_000_000
    });

    assert.equal(report.summary.entityCount, 1);
    assert.equal(report.summary.lowCoverageCount, 0);
    assert.equal(report.summary.avgSignalCoverage, 1);
    assert.equal(report.summary.defaultedSignalRate, 0);
    assert.equal(report.summary.posture, 'ready');

    const tasks = toolkit.toTasks(report, {
        fromAgentId: 'agent:test'
    });
    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].context.defaultedSignalRate, 0);
    assert.equal(tasks[0].context.lowCoverageCount, 0);
});
