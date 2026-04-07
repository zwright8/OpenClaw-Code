import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Impact Threat Surface',
    readyPosture: 'impact_threat_modeling_ready',
    defaultAgentId: 'agent:impact-threat-modeler',
    recommendationTypes: {
        primary: 'model_impact_security_threat_surface',
        guard: 'mitigate_impact_exploitable_attack_path',
        audit: 'audit_impact_threat_modeling_signals',
        publish: 'publish_impact_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_impact_security_threat_surface: 'agent:security',
        mitigate_impact_exploitable_attack_path: 'agent:platform',
        audit_impact_threat_modeling_signals: 'agent:trust',
        publish_impact_threat_modeling_status: 'agent:ops'
    }
});

export function modelImpactSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactSecurityThreatModeler extends BaseManager {}

export const __impactSecurityThreatModelerInternals = toolkit.internals;
