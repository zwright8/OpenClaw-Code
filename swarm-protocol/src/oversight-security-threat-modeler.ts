import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Oversight Threat Surface',
    readyPosture: 'oversight_threat_modeling_ready',
    defaultAgentId: 'agent:oversight-threat-modeler',
    recommendationTypes: {
        primary: 'model_oversight_security_threat_surface',
        guard: 'mitigate_oversight_exploitable_attack_path',
        audit: 'audit_oversight_threat_modeling_signals',
        publish: 'publish_oversight_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_oversight_security_threat_surface: 'agent:security',
        mitigate_oversight_exploitable_attack_path: 'agent:platform',
        audit_oversight_threat_modeling_signals: 'agent:trust',
        publish_oversight_threat_modeling_status: 'agent:ops'
    }
});

export function modelOversightSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightSecurityThreatModeler extends BaseManager {}

export const __oversightSecurityThreatModelerInternals = toolkit.internals;
