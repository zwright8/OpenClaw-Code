import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_security_threat_modeler',
    collectionField: 'threatSurfaces',
    idField: 'surfaceId',
    defaultName: 'Governance Threat Surface',
    readyPosture: 'governance_threat_modeling_ready',
    defaultAgentId: 'agent:governance-threat-modeler',
    recommendationTypes: {
        primary: 'model_governance_security_threat_surface',
        guard: 'mitigate_governance_exploitable_attack_path',
        audit: 'audit_governance_threat_modeling_signals',
        publish: 'publish_governance_threat_modeling_status'
    },
    recommendationTargetMap: {
        model_governance_security_threat_surface: 'agent:security',
        mitigate_governance_exploitable_attack_path: 'agent:platform',
        audit_governance_threat_modeling_signals: 'agent:trust',
        publish_governance_threat_modeling_status: 'agent:ops'
    }
});

export function modelGovernanceSecurityThreats(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceSecurityThreatModelerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceSecurityThreatModeler extends BaseManager {}

export const __governanceSecurityThreatModelerInternals = toolkit.internals;
