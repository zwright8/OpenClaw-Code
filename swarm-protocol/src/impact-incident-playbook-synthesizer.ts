import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Impact Incident',
    readyPosture: 'impact_incident_playbook_ready',
    defaultAgentId: 'agent:impact-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_impact_incident_playbook',
        guard: 'mitigate_impact_incident_response_gap',
        audit: 'audit_impact_incident_playbook_signals',
        publish: 'publish_impact_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_impact_incident_playbook: 'agent:impact',
        mitigate_impact_incident_response_gap: 'agent:reliability',
        audit_impact_incident_playbook_signals: 'agent:trust',
        publish_impact_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeImpactIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactIncidentPlaybookSynthesizer extends BaseManager {}

export const __impactIncidentPlaybookSynthesizerInternals = toolkit.internals;
