import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Inclusion Threat Surface',
    readyPosture: 'inclusion_threat_modeling_ready',
    defaultAgentId: 'agent:inclusion-threat-modeler',
    recommendationTypes: {
        primary: 'model_inclusion_security_threat_surface',
        guard: 'mitigate_inclusion_exploitable_attack_path',
        audit: 'audit_inclusion_threat_modeling_signals',
        publish: 'publish_inclusion_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_inclusion_security_threat_surface: 'agent:security',
        mitigate_inclusion_exploitable_attack_path: 'agent:platform',
        audit_inclusion_threat_modeling_signals: 'agent:trust',
        publish_inclusion_threat_modeling_status: 'agent:ops'
    }
});

export function modelInclusionSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionSecurityThreatModeler extends BaseManager {}

export const __inclusionSecurityThreatModelerInternals = toolkit.internals;
