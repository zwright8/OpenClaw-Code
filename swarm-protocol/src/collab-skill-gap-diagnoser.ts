import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Collab Skill',
    readyPosture: 'collab_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:collab-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_collab_skill_gap',
        guard: 'mitigate_collab_skill_coverage_risk',
        audit: 'audit_collab_skill_gap_signals',
        publish: 'publish_collab_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_collab_skill_gap: 'agent:learning',
        mitigate_collab_skill_coverage_risk: 'agent:operations',
        audit_collab_skill_gap_signals: 'agent:trust',
        publish_collab_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseCollabSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabSkillGapDiagnoser extends BaseManager {}

export const __collabSkillGapDiagnoserInternals = toolkit.internals;
