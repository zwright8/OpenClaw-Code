import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Incident',
    readyPosture: 'incident_playbook_ready',
    defaultAgentId: 'agent:tooling-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_incident_playbook',
        guard: 'mitigate_incident_response_gap',
        audit: 'audit_incident_playbook_signals',
        publish: 'publish_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_incident_playbook: 'agent:incident-response',
        mitigate_incident_response_gap: 'agent:reliability',
        audit_incident_playbook_signals: 'agent:trust',
        publish_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeToolingIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingIncidentPlaybookSynthesizer extends BaseManager {}

export const __toolingIncidentPlaybookSynthesizerInternals = toolkit.internals;
