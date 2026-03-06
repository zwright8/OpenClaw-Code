import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Engineering Incident',
    readyPosture: 'engineering_incident_playbook_ready',
    defaultAgentId: 'agent:engineering-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_engineering_incident_playbook',
        guard: 'mitigate_engineering_incident_response_gap',
        audit: 'audit_engineering_incident_playbook_signals',
        publish: 'publish_engineering_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_engineering_incident_playbook: 'agent:engineering',
        mitigate_engineering_incident_response_gap: 'agent:reliability',
        audit_engineering_incident_playbook_signals: 'agent:trust',
        publish_engineering_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeEngineeringIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringIncidentPlaybookSynthesizer extends BaseManager {}

export const __engineeringIncidentPlaybookSynthesizerInternals = toolkit.internals;
