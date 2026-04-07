import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Federation Skill',
    readyPosture: 'federation_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:federation-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_federation_skill_gap',
        guard: 'mitigate_federation_skill_coverage_risk',
        audit: 'audit_federation_skill_gap_signals',
        publish: 'publish_federation_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_federation_skill_gap: 'agent:learning',
        mitigate_federation_skill_coverage_risk: 'agent:operations',
        audit_federation_skill_gap_signals: 'agent:trust',
        publish_federation_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseFederationSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationSkillGapDiagnoser extends BaseManager {}

export const __federationSkillGapDiagnoserInternals = toolkit.internals;
