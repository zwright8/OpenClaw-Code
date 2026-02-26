import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'PublicService Threat Surface',
    readyPosture: 'publicservice_threat_modeling_ready',
    defaultAgentId: 'agent:publicservice-threat-modeler',
    recommendationTypes: {
        primary: 'model_publicservice_security_threat_surface',
        guard: 'mitigate_publicservice_exploitable_attack_path',
        audit: 'audit_publicservice_threat_modeling_signals',
        publish: 'publish_publicservice_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_publicservice_security_threat_surface: 'agent:security',
        mitigate_publicservice_exploitable_attack_path: 'agent:platform',
        audit_publicservice_threat_modeling_signals: 'agent:trust',
        publish_publicservice_threat_modeling_status: 'agent:ops'
    }
});

export function modelPublicServiceSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceSecurityThreatModeler extends BaseManager {}

export const __publicServiceSecurityThreatModelerInternals = toolkit.internals;
