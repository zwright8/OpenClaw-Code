import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Education Threat Surface',
    readyPosture: 'education_threat_modeling_ready',
    defaultAgentId: 'agent:education-threat-modeler',
    recommendationTypes: {
        primary: 'model_education_security_threat_surface',
        guard: 'mitigate_education_exploitable_attack_path',
        audit: 'audit_education_threat_modeling_signals',
        publish: 'publish_education_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_education_security_threat_surface: 'agent:security',
        mitigate_education_exploitable_attack_path: 'agent:platform',
        audit_education_threat_modeling_signals: 'agent:trust',
        publish_education_threat_modeling_status: 'agent:ops'
    }
});

export function modelEducationSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationSecurityThreatModeler extends BaseManager {}

export const __educationSecurityThreatModelerInternals = toolkit.internals;
