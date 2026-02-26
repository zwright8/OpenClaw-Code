import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Cultural Skill',
    readyPosture: 'cultural_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:cultural-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_cultural_skill_gaps',
        guard: 'mitigate_cultural_skill_coverage_risk',
        audit: 'audit_cultural_skill_gap_signals',
        publish: 'publish_cultural_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_cultural_skill_gaps: 'agent:learning',
        mitigate_cultural_skill_coverage_risk: 'agent:operations',
        audit_cultural_skill_gap_signals: 'agent:trust',
        publish_cultural_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseCulturalSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalSkillGapDiagnoser extends BaseManager {}

export const __culturalSkillGapDiagnoserInternals = toolkit.internals;
