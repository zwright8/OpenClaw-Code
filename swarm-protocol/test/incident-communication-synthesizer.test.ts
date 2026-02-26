import test from 'node:test';
import assert from 'node:assert/strict';
import {
    synthesizeIncidentCommunications,
    incidentCommunicationsToTasks,
    IncidentCommunicationSynthesizer
} from '../index.js';

function baseInput(nowMs = 700_000) {
    return {
        incidents: [
            {
                incidentId: 'inc-1',
                title: 'API elevated error rate',
                severity: 'critical',
                status: 'mitigating',
                startedAt: nowMs - 45 * 60_000,
                affectedServices: ['api', 'auth'],
                regions: ['us-east-1'],
                customerImpact: 'Some requests are failing.',
                internalImpact: 'On-call load increased.',
                summary: 'A dependency regression triggered elevated 5xx rates.',
                mitigationActions: ['rollback dependency', 'traffic shift'],
                nextUpdateAt: nowMs + 10 * 60_000,
                etaResolutionAt: null,
                unknowns: ['full blast radius'],
                confidence: 62
            }
        ],
        audiences: [
            { id: 'customers', label: 'Customers', detailLevel: 'concise', updateCadenceMinutes: 30 },
            { id: 'ops', label: 'Operations', detailLevel: 'deep', includeInternal: true, updateCadenceMinutes: 15 }
        ]
    };
}

test('synthesizeIncidentCommunications builds per-audience updates and uncertainty alerts', () => {
    const report = synthesizeIncidentCommunications(baseInput(), {
        now: () => 700_000
    });

    assert.equal(report.summary.messageCount, 2);
    assert.equal(report.alerts.includes('incident_eta_missing'), true);
    assert.equal(report.alerts.includes('incident_update_due_soon'), true);
    assert.equal(report.recommendations.some((entry) => entry.type === 'publish_incident_update'), true);
});

test('synthesizeIncidentCommunications has ready posture for high-confidence complete incidents', () => {
    const report = synthesizeIncidentCommunications({
        incidents: [
            {
                incidentId: 'inc-ok',
                title: 'Minor latency blip',
                severity: 'low',
                status: 'monitoring',
                startedAt: 710_000,
                affectedServices: ['api'],
                regions: ['global'],
                customerImpact: 'No observable customer impact.',
                internalImpact: 'Telemetry spike only.',
                summary: 'Transient latency recovered automatically.',
                mitigationActions: ['monitor'],
                nextUpdateAt: 770_000,
                etaResolutionAt: 760_000,
                unknowns: [],
                confidence: 92
            }
        ]
    }, {
        now: () => 720_000
    });

    assert.equal(report.summary.posture, 'ready');
    assert.equal(report.alerts.includes('incident_uncertainty_high'), false);
});

test('incidentCommunicationsToTasks and class wrapper emit schema-valid tasks and history', () => {
    const synthesizer = new IncidentCommunicationSynthesizer({
        localAgentId: 'agent:comms-local',
        now: () => 730_000
    });

    const report = synthesizer.evaluate(baseInput(730_000));
    const tasks = incidentCommunicationsToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = synthesizer.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:comms-local');
    assert.equal(synthesizer.listHistory({ limit: 5 }).length, 1);
});
