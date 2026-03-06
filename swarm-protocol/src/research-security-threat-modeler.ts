import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Research Threat Surface',
    readyPosture: 'research_threat_modeling_ready',
    defaultAgentId: 'agent:research-threat-modeler',
    recommendationTypes: {
        primary: 'model_research_security_threat_surface',
        guard: 'mitigate_research_exploitable_attack_path',
        audit: 'audit_research_threat_modeling_signals',
        publish: 'publish_research_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_research_security_threat_surface: 'agent:security',
        mitigate_research_exploitable_attack_path: 'agent:platform',
        audit_research_threat_modeling_signals: 'agent:trust',
        publish_research_threat_modeling_status: 'agent:ops'
    }
});

export function modelResearchSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchSecurityThreatModeler extends BaseManager {}

export const __researchSecurityThreatModelerInternals = toolkit.internals;
