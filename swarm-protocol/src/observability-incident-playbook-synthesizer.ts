import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Observability Incident',
    readyPosture: 'observability_incident_playbook_ready',
    defaultAgentId: 'agent:observability-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_observability_incident_playbook',
        guard: 'mitigate_observability_incident_response_gap',
        audit: 'audit_observability_incident_playbook_signals',
        publish: 'publish_observability_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_observability_incident_playbook: 'agent:observability',
        mitigate_observability_incident_response_gap: 'agent:reliability',
        audit_observability_incident_playbook_signals: 'agent:trust',
        publish_observability_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeObservabilityIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityIncidentPlaybookSynthesizer extends BaseManager {}

export const __observabilityIncidentPlaybookSynthesizerInternals = toolkit.internals;
