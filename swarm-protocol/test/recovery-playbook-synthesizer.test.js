import test from 'node:test';
import assert from 'node:assert/strict';
import {
    synthesizeRecoveryPlaybooks,
    recoveryPlaybooksToTasks,
    RecoveryPlaybookSynthesizer
} from '../index.js';

function baseInput() {
    return {
        incidents: [
            {
                incidentId: 'inc-db-1',
                category: 'database',
                severity: 'critical',
                detectionLagMinutes: 18,
                mitigationMinutes: 40,
                restorationMinutes: 95,
                recurrenceRisk: 78,
                impactedSystems: ['db-primary', 'api'],
                rootCauseSignals: ['replication_lag', 'disk_saturation'],
                successfulActions: ['promote replica', 'throttle writes'],
                failedActions: ['restart primary'],
                telemetryCoverage: 58
            },
            {
                incidentId: 'inc-db-2',
                category: 'database',
                severity: 'high',
                detectionLagMinutes: 14,
                mitigationMinutes: 35,
                restorationMinutes: 70,
                recurrenceRisk: 66,
                impactedSystems: ['db-primary'],
                rootCauseSignals: ['replication_lag'],
                successfulActions: ['promote replica', 'clear queue backlog'],
                failedActions: [],
                telemetryCoverage: 62
            },
            {
                incidentId: 'inc-cache-1',
                category: 'cache',
                severity: 'medium',
                detectionLagMinutes: 10,
                mitigationMinutes: 18,
                restorationMinutes: 30,
                recurrenceRisk: 34,
                impactedSystems: ['cache'],
                rootCauseSignals: ['memory_pressure'],
                successfulActions: ['scale cache cluster'],
                failedActions: [],
                telemetryCoverage: 84
            }
        ]
    };
}

test('synthesizeRecoveryPlaybooks creates categorized playbooks and high-risk alerts', () => {
    const report = synthesizeRecoveryPlaybooks(baseInput(), {
        now: () => 1_000_000
    });

    assert.equal(report.summary.playbookCount, 2);
    assert.equal(report.alerts.includes('recovery_playbook_validation_required') || report.alerts.includes('recovery_playbook_high_risk'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'run_recovery_tabletop' || entry.type === 'adopt_recovery_playbook'), true);
});

test('synthesizeRecoveryPlaybooks yields adopt-ready posture for well-instrumented low-risk patterns', () => {
    const report = synthesizeRecoveryPlaybooks({
        incidents: [
            {
                incidentId: 'inc-ok-1',
                category: 'network',
                severity: 'low',
                detectionLagMinutes: 4,
                mitigationMinutes: 10,
                restorationMinutes: 18,
                recurrenceRisk: 18,
                impactedSystems: ['edge'],
                rootCauseSignals: ['packet_loss'],
                successfulActions: ['route failover'],
                failedActions: [],
                telemetryCoverage: 92
            },
            {
                incidentId: 'inc-ok-2',
                category: 'network',
                severity: 'low',
                detectionLagMinutes: 3,
                mitigationMinutes: 9,
                restorationMinutes: 16,
                recurrenceRisk: 15,
                impactedSystems: ['edge'],
                rootCauseSignals: ['packet_loss'],
                successfulActions: ['route failover'],
                failedActions: [],
                telemetryCoverage: 94
            }
        ]
    }, {
        now: () => 1_001_000
    });

    assert.equal(report.summary.posture, 'ready');
    assert.equal(report.summary.highRiskCount, 0);
    assert.equal(report.playbooks[0].posture, 'adopt_ready');
});

test('recoveryPlaybooksToTasks and class wrapper emit schema-valid tasks and history', () => {
    const synthesizer = new RecoveryPlaybookSynthesizer({
        localAgentId: 'agent:recovery-local',
        now: () => 1_002_000
    });

    const report = synthesizer.evaluate(baseInput());
    const tasks = recoveryPlaybooksToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = synthesizer.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:recovery-local');
    assert.equal(synthesizer.listHistory({ limit: 5 }).length, 1);
});
