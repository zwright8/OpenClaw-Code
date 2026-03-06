import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Education Skill',
    readyPosture: 'education_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:education-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_education_skill_gap',
        guard: 'mitigate_education_skill_coverage_risk',
        audit: 'audit_education_skill_gap_signals',
        publish: 'publish_education_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_education_skill_gap: 'agent:learning',
        mitigate_education_skill_coverage_risk: 'agent:operations',
        audit_education_skill_gap_signals: 'agent:trust',
        publish_education_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseEducationSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationSkillGapDiagnoser extends BaseManager {}

export const __educationSkillGapDiagnoserInternals = toolkit.internals;
