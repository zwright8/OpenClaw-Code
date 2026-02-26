import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Comms Threat Surface',
    readyPosture: 'comms_threat_modeling_ready',
    defaultAgentId: 'agent:comms-threat-modeler',
    recommendationTypes: {
        primary: 'model_comms_security_threat_surface',
        guard: 'mitigate_comms_exploitable_attack_path',
        audit: 'audit_comms_threat_modeling_signals',
        publish: 'publish_comms_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_comms_security_threat_surface: 'agent:security',
        mitigate_comms_exploitable_attack_path: 'agent:platform',
        audit_comms_threat_modeling_signals: 'agent:trust',
        publish_comms_threat_modeling_status: 'agent:ops'
    }
});

export function modelCommsSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsSecurityThreatModeler extends BaseManager {}

export const __commsSecurityThreatModelerInternals = toolkit.internals;
