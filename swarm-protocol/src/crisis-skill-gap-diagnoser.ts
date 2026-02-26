import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Crisis Skill',
    readyPosture: 'crisis_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:crisis-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_crisis_skill_gaps',
        guard: 'mitigate_crisis_skill_coverage_risk',
        audit: 'audit_crisis_skill_gap_signals',
        publish: 'publish_crisis_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_crisis_skill_gaps: 'agent:learning',
        mitigate_crisis_skill_coverage_risk: 'agent:operations',
        audit_crisis_skill_gap_signals: 'agent:trust',
        publish_crisis_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseCrisisSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisSkillGapDiagnoser extends BaseManager {}

export const __crisisSkillGapDiagnoserInternals = toolkit.internals;
