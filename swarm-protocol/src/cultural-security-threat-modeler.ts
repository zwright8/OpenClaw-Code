import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Cultural Threat Surface',
    readyPosture: 'cultural_threat_modeling_ready',
    defaultAgentId: 'agent:cultural-threat-modeler',
    recommendationTypes: {
        primary: 'model_cultural_security_threat_surface',
        guard: 'mitigate_cultural_exploitable_attack_path',
        audit: 'audit_cultural_threat_modeling_signals',
        publish: 'publish_cultural_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_cultural_security_threat_surface: 'agent:security',
        mitigate_cultural_exploitable_attack_path: 'agent:platform',
        audit_cultural_threat_modeling_signals: 'agent:trust',
        publish_cultural_threat_modeling_status: 'agent:ops'
    }
});

export function modelCulturalSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalSecurityThreatModeler extends BaseManager {}

export const __culturalSecurityThreatModelerInternals = toolkit.internals;
