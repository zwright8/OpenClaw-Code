import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Logistics Skill',
    readyPosture: 'logistics_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:logistics-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_logistics_skill_gaps',
        guard: 'mitigate_logistics_skill_coverage_risk',
        audit: 'audit_logistics_skill_gap_signals',
        publish: 'publish_logistics_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_logistics_skill_gaps: 'agent:learning',
        mitigate_logistics_skill_coverage_risk: 'agent:operations',
        audit_logistics_skill_gap_signals: 'agent:trust',
        publish_logistics_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseLogisticsSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsSkillGapDiagnoser extends BaseManager {}

export const __logisticsSkillGapDiagnoserInternals = toolkit.internals;
