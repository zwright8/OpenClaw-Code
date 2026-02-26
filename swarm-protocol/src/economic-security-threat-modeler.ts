import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Economic Threat Surface',
    readyPosture: 'economic_threat_modeling_ready',
    defaultAgentId: 'agent:economic-threat-modeler',
    recommendationTypes: {
        primary: 'model_economic_security_threat_surface',
        guard: 'mitigate_economic_exploitable_attack_path',
        audit: 'audit_economic_threat_modeling_signals',
        publish: 'publish_economic_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_economic_security_threat_surface: 'agent:security',
        mitigate_economic_exploitable_attack_path: 'agent:platform',
        audit_economic_threat_modeling_signals: 'agent:trust',
        publish_economic_threat_modeling_status: 'agent:ops'
    }
});

export function modelEconomicSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicSecurityThreatModeler extends BaseManager {}

export const __economicSecurityThreatModelerInternals = toolkit.internals;
