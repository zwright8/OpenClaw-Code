import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Research Skill',
    readyPosture: 'research_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:research-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_research_skill_gap',
        guard: 'mitigate_research_skill_coverage_risk',
        audit: 'audit_research_skill_gap_signals',
        publish: 'publish_research_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_research_skill_gap: 'agent:learning',
        mitigate_research_skill_coverage_risk: 'agent:operations',
        audit_research_skill_gap_signals: 'agent:trust',
        publish_research_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseResearchSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchSkillGapDiagnoser extends BaseManager {}

export const __researchSkillGapDiagnoserInternals = toolkit.internals;
