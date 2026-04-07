import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Evolution Skill',
    readyPosture: 'evolution_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:evolution-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_evolution_skill_gaps',
        guard: 'mitigate_evolution_skill_coverage_risk',
        audit: 'audit_evolution_skill_gap_signals',
        publish: 'publish_evolution_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_evolution_skill_gaps: 'agent:learning',
        mitigate_evolution_skill_coverage_risk: 'agent:operations',
        audit_evolution_skill_gap_signals: 'agent:trust',
        publish_evolution_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseEvolutionSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionSkillGapDiagnoser extends BaseManager {}

export const __evolutionSkillGapDiagnoserInternals = toolkit.internals;
