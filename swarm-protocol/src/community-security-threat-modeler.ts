import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Community Threat Surface',
    readyPosture: 'community_threat_modeling_ready',
    defaultAgentId: 'agent:community-threat-modeler',
    recommendationTypes: {
        primary: 'model_community_security_threat_surface',
        guard: 'mitigate_community_exploitable_attack_path',
        audit: 'audit_community_threat_modeling_signals',
        publish: 'publish_community_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_community_security_threat_surface: 'agent:security',
        mitigate_community_exploitable_attack_path: 'agent:platform',
        audit_community_threat_modeling_signals: 'agent:trust',
        publish_community_threat_modeling_status: 'agent:ops'
    }
});

export function modelCommunitySecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communitySecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunitySecurityThreatModeler extends BaseManager {}

export const __communitySecurityThreatModelerInternals = toolkit.internals;
