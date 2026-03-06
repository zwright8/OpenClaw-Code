import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Federation Threat Surface',
    readyPosture: 'federation_threat_modeling_ready',
    defaultAgentId: 'agent:federation-threat-modeler',
    recommendationTypes: {
        primary: 'model_federation_security_threat_surface',
        guard: 'mitigate_federation_exploitable_attack_path',
        audit: 'audit_federation_threat_modeling_signals',
        publish: 'publish_federation_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_federation_security_threat_surface: 'agent:security',
        mitigate_federation_exploitable_attack_path: 'agent:platform',
        audit_federation_threat_modeling_signals: 'agent:trust',
        publish_federation_threat_modeling_status: 'agent:ops'
    }
});

export function modelFederationSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationSecurityThreatModeler extends BaseManager {}

export const __federationSecurityThreatModelerInternals = toolkit.internals;
