import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Security Threat Surface',
    readyPosture: 'security_threat_modeling_ready',
    defaultAgentId: 'agent:security-threat-modeler',
    recommendationTypes: {
        primary: 'model_security_security_threat_surface',
        guard: 'mitigate_security_exploitable_attack_path',
        audit: 'audit_security_threat_modeling_signals',
        publish: 'publish_security_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_security_security_threat_surface: 'agent:security',
        mitigate_security_exploitable_attack_path: 'agent:platform',
        audit_security_threat_modeling_signals: 'agent:trust',
        publish_security_threat_modeling_status: 'agent:ops'
    }
});

export function modelSecuritySecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securitySecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecuritySecurityThreatModeler extends BaseManager {}

export const __securitySecurityThreatModelerInternals = toolkit.internals;
