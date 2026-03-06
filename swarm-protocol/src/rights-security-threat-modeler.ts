import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Rights Threat Surface',
    readyPosture: 'rights_security_threat_models_ready',
    defaultAgentId: 'agent:rights-threat-modeling',
    recommendationTypes: {
        primary: 'model_rights_security_threats',
        guard: 'mitigate_rights_security_exposure_risk',
        audit: 'audit_rights_security_threat_signals',
        publish: 'publish_rights_security_threat_status'
    },
    recommendationTargetMap: {
        model_rights_security_threats: 'agent:rights',
        mitigate_rights_security_exposure_risk: 'agent:security',
        audit_rights_security_threat_signals: 'agent:trust',
        publish_rights_security_threat_status: 'agent:ops'
    }
});

export function modelRightsSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsSecurityThreatModeler extends BaseManager {}

export const __rightsSecurityThreatModelerInternals = toolkit.internals;
