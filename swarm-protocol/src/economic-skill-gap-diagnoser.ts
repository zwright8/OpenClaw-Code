import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Economic Skill',
    readyPosture: 'economic_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:economic-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_economic_skill_gap',
        guard: 'mitigate_economic_skill_coverage_risk',
        audit: 'audit_economic_skill_gap_signals',
        publish: 'publish_economic_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_economic_skill_gap: 'agent:learning',
        mitigate_economic_skill_coverage_risk: 'agent:operations',
        audit_economic_skill_gap_signals: 'agent:trust',
        publish_economic_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseEconomicSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicSkillGapDiagnoser extends BaseManager {}

export const __economicSkillGapDiagnoserInternals = toolkit.internals;
