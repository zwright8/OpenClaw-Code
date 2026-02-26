import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Logistics Threat Surface',
    readyPosture: 'logistics_threat_modeling_ready',
    defaultAgentId: 'agent:logistics-threat-modeler',
    recommendationTypes: {
        primary: 'model_logistics_security_threat_surface',
        guard: 'mitigate_logistics_exploitable_attack_path',
        audit: 'audit_logistics_threat_modeling_signals',
        publish: 'publish_logistics_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_logistics_security_threat_surface: 'agent:security',
        mitigate_logistics_exploitable_attack_path: 'agent:platform',
        audit_logistics_threat_modeling_signals: 'agent:trust',
        publish_logistics_threat_modeling_status: 'agent:ops'
    }
});

export function modelLogisticsSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsSecurityThreatModeler extends BaseManager {}

export const __logisticsSecurityThreatModelerInternals = toolkit.internals;
