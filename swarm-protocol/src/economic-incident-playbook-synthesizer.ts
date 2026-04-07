import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Economic Incident',
    readyPosture: 'economic_incident_playbook_ready',
    defaultAgentId: 'agent:economic-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_economic_incident_playbook',
        guard: 'mitigate_economic_incident_response_gap',
        audit: 'audit_economic_incident_playbook_signals',
        publish: 'publish_economic_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_economic_incident_playbook: 'agent:economic',
        mitigate_economic_incident_response_gap: 'agent:reliability',
        audit_economic_incident_playbook_signals: 'agent:trust',
        publish_economic_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeEconomicIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicIncidentPlaybookSynthesizer extends BaseManager {}

export const __economicIncidentPlaybookSynthesizerInternals = toolkit.internals;
