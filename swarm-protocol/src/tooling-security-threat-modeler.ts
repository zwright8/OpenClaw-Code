import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Threat Surface',
    readyPosture: 'threat_modeling_ready',
    defaultAgentId: 'agent:tooling-threat-modeler',
    recommendationTypes: {
        primary: 'model_security_threat_surface',
        guard: 'mitigate_exploitable_attack_path',
        audit: 'audit_threat_modeling_signals',
        publish: 'publish_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_security_threat_surface: 'agent:security',
        mitigate_exploitable_attack_path: 'agent:platform',
        audit_threat_modeling_signals: 'agent:trust',
        publish_threat_modeling_status: 'agent:ops'
    }
});

export function modelToolingSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingSecurityThreatModeler extends BaseManager {}

export const __toolingSecurityThreatModelerInternals = toolkit.internals;
