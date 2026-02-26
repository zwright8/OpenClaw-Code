import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Security Incident',
    readyPosture: 'security_incident_playbook_ready',
    defaultAgentId: 'agent:security-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_security_incident_playbook',
        guard: 'mitigate_security_incident_response_gap',
        audit: 'audit_security_incident_playbook_signals',
        publish: 'publish_security_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_security_incident_playbook: 'agent:security',
        mitigate_security_incident_response_gap: 'agent:reliability',
        audit_security_incident_playbook_signals: 'agent:trust',
        publish_security_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeSecurityIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityIncidentPlaybookSynthesizer extends BaseManager {}

export const __securityIncidentPlaybookSynthesizerInternals = toolkit.internals;
