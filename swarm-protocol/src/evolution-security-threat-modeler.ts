import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Evolution Threat Surface',
    readyPosture: 'evolution_security_threat_models_ready',
    defaultAgentId: 'agent:evolution-threat-modeling',
    recommendationTypes: {
        primary: 'model_evolution_security_threats',
        guard: 'mitigate_evolution_security_exposure_risk',
        audit: 'audit_evolution_security_threat_signals',
        publish: 'publish_evolution_security_threat_status'
    },
    recommendationTargetMap: {
        model_evolution_security_threats: 'agent:evolution',
        mitigate_evolution_security_exposure_risk: 'agent:security',
        audit_evolution_security_threat_signals: 'agent:trust',
        publish_evolution_security_threat_status: 'agent:ops'
    }
});

export function modelEvolutionSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionSecurityThreatModeler extends BaseManager {}

export const __evolutionSecurityThreatModelerInternals = toolkit.internals;
