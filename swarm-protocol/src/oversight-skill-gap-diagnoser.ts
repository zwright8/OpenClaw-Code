import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Oversight Skill',
    readyPosture: 'oversight_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:oversight-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_oversight_skill_gap',
        guard: 'mitigate_oversight_skill_coverage_risk',
        audit: 'audit_oversight_skill_gap_signals',
        publish: 'publish_oversight_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_oversight_skill_gap: 'agent:learning',
        mitigate_oversight_skill_coverage_risk: 'agent:operations',
        audit_oversight_skill_gap_signals: 'agent:trust',
        publish_oversight_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseOversightSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightSkillGapDiagnoser extends BaseManager {}

export const __oversightSkillGapDiagnoserInternals = toolkit.internals;
