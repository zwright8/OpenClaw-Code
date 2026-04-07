import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'PublicService Incident',
    readyPosture: 'publicservice_incident_playbook_ready',
    defaultAgentId: 'agent:publicservice-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_publicservice_incident_playbook',
        guard: 'mitigate_publicservice_incident_response_gap',
        audit: 'audit_publicservice_incident_playbook_signals',
        publish: 'publish_publicservice_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_publicservice_incident_playbook: 'agent:publicservice',
        mitigate_publicservice_incident_response_gap: 'agent:reliability',
        audit_publicservice_incident_playbook_signals: 'agent:trust',
        publish_publicservice_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizePublicServiceIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceIncidentPlaybookSynthesizer extends BaseManager {}

export const __publicServiceIncidentPlaybookSynthesizerInternals = toolkit.internals;
