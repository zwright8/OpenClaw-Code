import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Crisis Incident',
    readyPosture: 'crisis_incident_playbook_ready',
    defaultAgentId: 'agent:crisis-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_crisis_incident_playbook',
        guard: 'mitigate_crisis_incident_response_gap',
        audit: 'audit_crisis_incident_playbook_signals',
        publish: 'publish_crisis_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_crisis_incident_playbook: 'agent:crisis',
        mitigate_crisis_incident_response_gap: 'agent:reliability',
        audit_crisis_incident_playbook_signals: 'agent:trust',
        publish_crisis_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeCrisisIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisIncidentPlaybookSynthesizer extends BaseManager {}

export const __crisisIncidentPlaybookSynthesizerInternals = toolkit.internals;
