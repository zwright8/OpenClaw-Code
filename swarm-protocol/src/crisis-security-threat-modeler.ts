import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Crisis Threat Surface',
    readyPosture: 'crisis_threat_modeling_ready',
    defaultAgentId: 'agent:crisis-threat-modeler',
    recommendationTypes: {
        primary: 'model_crisis_security_threat_surface',
        guard: 'mitigate_crisis_exploitable_attack_path',
        audit: 'audit_crisis_threat_modeling_signals',
        publish: 'publish_crisis_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_crisis_security_threat_surface: 'agent:security',
        mitigate_crisis_exploitable_attack_path: 'agent:platform',
        audit_crisis_threat_modeling_signals: 'agent:trust',
        publish_crisis_threat_modeling_status: 'agent:ops'
    }
});

export function modelCrisisSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisSecurityThreatModeler extends BaseManager {}

export const __crisisSecurityThreatModelerInternals = toolkit.internals;
