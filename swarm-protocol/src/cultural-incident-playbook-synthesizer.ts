import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Cultural Incident',
    readyPosture: 'cultural_incident_playbook_ready',
    defaultAgentId: 'agent:cultural-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_cultural_incident_playbook',
        guard: 'mitigate_cultural_incident_response_gap',
        audit: 'audit_cultural_incident_playbook_signals',
        publish: 'publish_cultural_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_cultural_incident_playbook: 'agent:cultural',
        mitigate_cultural_incident_response_gap: 'agent:reliability',
        audit_cultural_incident_playbook_signals: 'agent:trust',
        publish_cultural_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeCulturalIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalIncidentPlaybookSynthesizer extends BaseManager {}

export const __culturalIncidentPlaybookSynthesizerInternals = toolkit.internals;
