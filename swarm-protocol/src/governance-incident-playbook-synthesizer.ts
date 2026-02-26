import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Governance Incident',
    readyPosture: 'governance_incident_playbook_ready',
    defaultAgentId: 'agent:governance-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_governance_incident_playbook',
        guard: 'mitigate_governance_incident_response_gap',
        audit: 'audit_governance_incident_playbook_signals',
        publish: 'publish_governance_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_governance_incident_playbook: 'agent:governance',
        mitigate_governance_incident_response_gap: 'agent:reliability',
        audit_governance_incident_playbook_signals: 'agent:trust',
        publish_governance_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeGovernanceIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceIncidentPlaybookSynthesizer extends BaseManager {}

export const __governanceIncidentPlaybookSynthesizerInternals = toolkit.internals;
