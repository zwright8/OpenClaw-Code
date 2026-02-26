import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Skill',
    readyPosture: 'skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:tooling-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_tooling_skill_gap',
        guard: 'mitigate_skill_coverage_risk',
        audit: 'audit_skill_gap_signals',
        publish: 'publish_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_tooling_skill_gap: 'agent:learning',
        mitigate_skill_coverage_risk: 'agent:operations',
        audit_skill_gap_signals: 'agent:trust',
        publish_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseToolingSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingSkillGapDiagnoser extends BaseManager {}

export const __toolingSkillGapDiagnoserInternals = toolkit.internals;
