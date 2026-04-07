import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Rights Skill',
    readyPosture: 'rights_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:rights-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_rights_skill_gaps',
        guard: 'mitigate_rights_skill_coverage_risk',
        audit: 'audit_rights_skill_gap_signals',
        publish: 'publish_rights_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_rights_skill_gaps: 'agent:learning',
        mitigate_rights_skill_coverage_risk: 'agent:operations',
        audit_rights_skill_gap_signals: 'agent:trust',
        publish_rights_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseRightsSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsSkillGapDiagnoser extends BaseManager {}

export const __rightsSkillGapDiagnoserInternals = toolkit.internals;
