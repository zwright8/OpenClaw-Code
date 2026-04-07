import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Observability Threat Surface',
    readyPosture: 'observability_threat_modeling_ready',
    defaultAgentId: 'agent:observability-threat-modeler',
    recommendationTypes: {
        primary: 'model_observability_security_threat_surface',
        guard: 'mitigate_observability_exploitable_attack_path',
        audit: 'audit_observability_threat_modeling_signals',
        publish: 'publish_observability_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_observability_security_threat_surface: 'agent:security',
        mitigate_observability_exploitable_attack_path: 'agent:platform',
        audit_observability_threat_modeling_signals: 'agent:trust',
        publish_observability_threat_modeling_status: 'agent:ops'
    }
});

export function modelObservabilitySecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilitySecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilitySecurityThreatModeler extends BaseManager {}

export const __observabilitySecurityThreatModelerInternals = toolkit.internals;
