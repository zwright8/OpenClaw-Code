import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Engineering Skill',
    readyPosture: 'engineering_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:engineering-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_engineering_skill_gap',
        guard: 'mitigate_engineering_skill_coverage_risk',
        audit: 'audit_engineering_skill_gap_signals',
        publish: 'publish_engineering_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_engineering_skill_gap: 'agent:learning',
        mitigate_engineering_skill_coverage_risk: 'agent:operations',
        audit_engineering_skill_gap_signals: 'agent:trust',
        publish_engineering_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseEngineeringSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringSkillGapDiagnoser extends BaseManager {}

export const __engineeringSkillGapDiagnoserInternals = toolkit.internals;
