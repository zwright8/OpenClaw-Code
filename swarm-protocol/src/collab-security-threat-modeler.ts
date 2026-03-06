import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Collab Threat Surface',
    readyPosture: 'collab_threat_modeling_ready',
    defaultAgentId: 'agent:collab-threat-modeler',
    recommendationTypes: {
        primary: 'model_collab_security_threat_surface',
        guard: 'mitigate_collab_exploitable_attack_path',
        audit: 'audit_collab_threat_modeling_signals',
        publish: 'publish_collab_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_collab_security_threat_surface: 'agent:security',
        mitigate_collab_exploitable_attack_path: 'agent:platform',
        audit_collab_threat_modeling_signals: 'agent:trust',
        publish_collab_threat_modeling_status: 'agent:ops'
    }
});

export function modelCollabSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabSecurityThreatModeler extends BaseManager {}

export const __collabSecurityThreatModelerInternals = toolkit.internals;
