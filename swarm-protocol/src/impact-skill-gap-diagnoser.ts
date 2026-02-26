import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Impact Skill',
    readyPosture: 'impact_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:impact-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_impact_skill_gaps',
        guard: 'mitigate_impact_skill_coverage_risk',
        audit: 'audit_impact_skill_gap_signals',
        publish: 'publish_impact_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_impact_skill_gaps: 'agent:learning',
        mitigate_impact_skill_coverage_risk: 'agent:operations',
        audit_impact_skill_gap_signals: 'agent:trust',
        publish_impact_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseImpactSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactSkillGapDiagnoser extends BaseManager {}

export const __impactSkillGapDiagnoserInternals = toolkit.internals;
