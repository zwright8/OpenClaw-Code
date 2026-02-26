import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Engineering Threat Surface',
    readyPosture: 'engineering_threat_modeling_ready',
    defaultAgentId: 'agent:engineering-threat-modeler',
    recommendationTypes: {
        primary: 'model_engineering_security_threat_surface',
        guard: 'mitigate_engineering_exploitable_attack_path',
        audit: 'audit_engineering_threat_modeling_signals',
        publish: 'publish_engineering_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_engineering_security_threat_surface: 'agent:security',
        mitigate_engineering_exploitable_attack_path: 'agent:platform',
        audit_engineering_threat_modeling_signals: 'agent:trust',
        publish_engineering_threat_modeling_status: 'agent:ops'
    }
});

export function modelEngineeringSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringSecurityThreatModeler extends BaseManager {}

export const __engineeringSecurityThreatModelerInternals = toolkit.internals;
