import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Infra Skill',
    readyPosture: 'infra_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:infra-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_infra_skill_gaps',
        guard: 'mitigate_infra_skill_coverage_risk',
        audit: 'audit_infra_skill_gap_signals',
        publish: 'publish_infra_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_infra_skill_gaps: 'agent:learning',
        mitigate_infra_skill_coverage_risk: 'agent:operations',
        audit_infra_skill_gap_signals: 'agent:trust',
        publish_infra_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseInfraSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraSkillGapDiagnoser extends BaseManager {}

export const __infraSkillGapDiagnoserInternals = toolkit.internals;
