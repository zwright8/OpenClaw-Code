import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_incident_playbook_synthesizer',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Community Incident',
    readyPosture: 'community_incident_playbook_ready',
    defaultAgentId: 'agent:community-incident-playbooks',
    recommendationTypes: {
        primary: 'synthesize_community_incident_playbook',
        guard: 'mitigate_community_incident_response_gap',
        audit: 'audit_community_incident_playbook_signals',
        publish: 'publish_community_incident_playbook_status'
    },
    recommendationTargetMap: {
        synthesize_community_incident_playbook: 'agent:community',
        mitigate_community_incident_response_gap: 'agent:reliability',
        audit_community_incident_playbook_signals: 'agent:trust',
        publish_community_incident_playbook_status: 'agent:ops'
    }
});

export function synthesizeCommunityIncidentPlaybooks(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityIncidentPlaybookSynthesizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityIncidentPlaybookSynthesizer extends BaseManager {}

export const __communityIncidentPlaybookSynthesizerInternals = toolkit.internals;
