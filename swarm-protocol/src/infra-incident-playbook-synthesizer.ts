import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Infra Incident',
    readyPosture: 'infra_incident_playbooks_synthesized',
    defaultAgentId: 'agent:infra-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_infra_incident_playbooks',
        guard: 'mitigate_infra_incident_repeat_risk',
        audit: 'audit_infra_incident_playbook_signals',
        publish: 'publish_infra_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_infra_incident_playbooks: 'agent:infra',
        mitigate_infra_incident_repeat_risk: 'agent:reliability',
        audit_infra_incident_playbook_signals: 'agent:trust',
        publish_infra_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeInfraIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraIncidentPlaybookSynthesizer extends BaseManager {}

export const __infraIncidentPlaybookSynthesizerInternals = toolkit.internals;
