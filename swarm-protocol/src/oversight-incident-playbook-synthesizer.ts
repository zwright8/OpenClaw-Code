import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Oversight Incident',
    readyPosture: 'oversight_incident_playbook_ready',
    defaultAgentId: 'agent:oversight-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_oversight_incident_playbook',
        guard: 'mitigate_oversight_incident_response_gap',
        audit: 'audit_oversight_incident_playbook_signals',
        publish: 'publish_oversight_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_oversight_incident_playbook: 'agent:oversight',
        mitigate_oversight_incident_response_gap: 'agent:reliability',
        audit_oversight_incident_playbook_signals: 'agent:trust',
        publish_oversight_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeOversightIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightIncidentPlaybookSynthesizer extends BaseManager {}

export const __oversightIncidentPlaybookSynthesizerInternals = toolkit.internals;
