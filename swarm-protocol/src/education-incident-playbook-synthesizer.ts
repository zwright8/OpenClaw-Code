import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Education Incident',
    readyPosture: 'education_incident_playbook_ready',
    defaultAgentId: 'agent:education-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_education_incident_playbook',
        guard: 'mitigate_education_incident_response_gap',
        audit: 'audit_education_incident_playbook_signals',
        publish: 'publish_education_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_education_incident_playbook: 'agent:education',
        mitigate_education_incident_response_gap: 'agent:reliability',
        audit_education_incident_playbook_signals: 'agent:trust',
        publish_education_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeEducationIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationIncidentPlaybookSynthesizer extends BaseManager {}

export const __educationIncidentPlaybookSynthesizerInternals = toolkit.internals;
