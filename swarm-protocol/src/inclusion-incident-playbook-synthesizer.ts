import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Inclusion Incident',
    readyPosture: 'inclusion_incident_playbook_ready',
    defaultAgentId: 'agent:inclusion-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_inclusion_incident_playbook',
        guard: 'mitigate_inclusion_incident_response_gap',
        audit: 'audit_inclusion_incident_playbook_signals',
        publish: 'publish_inclusion_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_inclusion_incident_playbook: 'agent:inclusion',
        mitigate_inclusion_incident_response_gap: 'agent:reliability',
        audit_inclusion_incident_playbook_signals: 'agent:trust',
        publish_inclusion_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeInclusionIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionIncidentPlaybookSynthesizer extends BaseManager {}

export const __inclusionIncidentPlaybookSynthesizerInternals = toolkit.internals;
