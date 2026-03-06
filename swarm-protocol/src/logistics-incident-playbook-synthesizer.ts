import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Logistics Incident',
    readyPosture: 'logistics_incident_playbook_ready',
    defaultAgentId: 'agent:logistics-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_logistics_incident_playbook',
        guard: 'mitigate_logistics_incident_response_gap',
        audit: 'audit_logistics_incident_playbook_signals',
        publish: 'publish_logistics_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_logistics_incident_playbook: 'agent:logistics',
        mitigate_logistics_incident_response_gap: 'agent:reliability',
        audit_logistics_incident_playbook_signals: 'agent:trust',
        publish_logistics_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeLogisticsIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsIncidentPlaybookSynthesizer extends BaseManager {}

export const __logisticsIncidentPlaybookSynthesizerInternals = toolkit.internals;
