import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Federation Incident',
    readyPosture: 'federation_incident_playbook_ready',
    defaultAgentId: 'agent:federation-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_federation_incident_playbook',
        guard: 'mitigate_federation_incident_response_gap',
        audit: 'audit_federation_incident_playbook_signals',
        publish: 'publish_federation_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_federation_incident_playbook: 'agent:federation',
        mitigate_federation_incident_response_gap: 'agent:reliability',
        audit_federation_incident_playbook_signals: 'agent:trust',
        publish_federation_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeFederationIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationIncidentPlaybookSynthesizer extends BaseManager {}

export const __federationIncidentPlaybookSynthesizerInternals = toolkit.internals;
