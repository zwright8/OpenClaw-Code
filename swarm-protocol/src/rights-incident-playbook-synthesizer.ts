import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Rights Incident',
    readyPosture: 'rights_incident_playbooks_synthesized',
    defaultAgentId: 'agent:rights-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_rights_incident_playbooks',
        guard: 'mitigate_rights_incident_repeat_risk',
        audit: 'audit_rights_incident_playbook_signals',
        publish: 'publish_rights_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_rights_incident_playbooks: 'agent:rights',
        mitigate_rights_incident_repeat_risk: 'agent:reliability',
        audit_rights_incident_playbook_signals: 'agent:trust',
        publish_rights_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeRightsIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsIncidentPlaybookSynthesizer extends BaseManager {}

export const __rightsIncidentPlaybookSynthesizerInternals = toolkit.internals;
