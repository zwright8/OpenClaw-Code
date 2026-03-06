import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Research Incident',
    readyPosture: 'research_incident_playbook_ready',
    defaultAgentId: 'agent:research-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_research_incident_playbook',
        guard: 'mitigate_research_incident_response_gap',
        audit: 'audit_research_incident_playbook_signals',
        publish: 'publish_research_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_research_incident_playbook: 'agent:research',
        mitigate_research_incident_response_gap: 'agent:reliability',
        audit_research_incident_playbook_signals: 'agent:trust',
        publish_research_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeResearchIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchIncidentPlaybookSynthesizer extends BaseManager {}

export const __researchIncidentPlaybookSynthesizerInternals = toolkit.internals;
