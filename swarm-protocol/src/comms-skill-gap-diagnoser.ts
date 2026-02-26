import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Comms Skill',
    readyPosture: 'comms_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:comms-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_comms_skill_gaps',
        guard: 'mitigate_comms_skill_coverage_risk',
        audit: 'audit_comms_skill_gap_signals',
        publish: 'publish_comms_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_comms_skill_gaps: 'agent:learning',
        mitigate_comms_skill_coverage_risk: 'agent:operations',
        audit_comms_skill_gap_signals: 'agent:trust',
        publish_comms_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseCommsSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsSkillGapDiagnoser extends BaseManager {}

export const __commsSkillGapDiagnoserInternals = toolkit.internals;
