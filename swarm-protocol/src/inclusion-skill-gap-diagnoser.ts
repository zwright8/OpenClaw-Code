import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Inclusion Skill',
    readyPosture: 'inclusion_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:inclusion-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_inclusion_skill_gaps',
        guard: 'mitigate_inclusion_skill_coverage_risk',
        audit: 'audit_inclusion_skill_gap_signals',
        publish: 'publish_inclusion_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_inclusion_skill_gaps: 'agent:learning',
        mitigate_inclusion_skill_coverage_risk: 'agent:operations',
        audit_inclusion_skill_gap_signals: 'agent:trust',
        publish_inclusion_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseInclusionSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionSkillGapDiagnoser extends BaseManager {}

export const __inclusionSkillGapDiagnoserInternals = toolkit.internals;
