import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Comms Incident',
    readyPosture: 'comms_incident_playbook_ready',
    defaultAgentId: 'agent:comms-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_comms_incident_playbook',
        guard: 'mitigate_comms_incident_response_gap',
        audit: 'audit_comms_incident_playbook_signals',
        publish: 'publish_comms_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_comms_incident_playbook: 'agent:comms',
        mitigate_comms_incident_response_gap: 'agent:reliability',
        audit_comms_incident_playbook_signals: 'agent:trust',
        publish_comms_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeCommsIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsIncidentPlaybookSynthesizer extends BaseManager {}

export const __commsIncidentPlaybookSynthesizerInternals = toolkit.internals;
