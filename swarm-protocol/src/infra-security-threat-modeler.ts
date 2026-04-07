import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Infra Threat Surface',
    readyPosture: 'infra_security_threat_models_ready',
    defaultAgentId: 'agent:infra-threat-modeling',
    recommendationTypes: {
        primary: 'model_infra_security_threats',
        guard: 'mitigate_infra_security_exposure_risk',
        audit: 'audit_infra_security_threat_signals',
        publish: 'publish_infra_security_threat_status'
    },
    recommendationTargetMap: {
        model_infra_security_threats: 'agent:infra',
        mitigate_infra_security_exposure_risk: 'agent:security',
        audit_infra_security_threat_signals: 'agent:trust',
        publish_infra_security_threat_status: 'agent:ops'
    }
});

export function modelInfraSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraSecurityThreatModeler extends BaseManager {}

export const __infraSecurityThreatModelerInternals = toolkit.internals;
