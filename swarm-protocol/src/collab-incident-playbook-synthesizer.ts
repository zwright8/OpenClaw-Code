import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Collab Incident',
    readyPosture: 'collab_incident_playbook_ready',
    defaultAgentId: 'agent:collab-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_collab_incident_playbook',
        guard: 'mitigate_collab_incident_response_gap',
        audit: 'audit_collab_incident_playbook_signals',
        publish: 'publish_collab_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_collab_incident_playbook: 'agent:collab',
        mitigate_collab_incident_response_gap: 'agent:reliability',
        audit_collab_incident_playbook_signals: 'agent:trust',
        publish_collab_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeCollabIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabIncidentPlaybookSynthesizer extends BaseManager {}

export const __collabIncidentPlaybookSynthesizerInternals = toolkit.internals;
