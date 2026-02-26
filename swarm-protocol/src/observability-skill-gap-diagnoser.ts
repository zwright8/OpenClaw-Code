import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Observability Skill',
    readyPosture: 'observability_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:observability-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_observability_skill_gap',
        guard: 'mitigate_observability_skill_coverage_risk',
        audit: 'audit_observability_skill_gap_signals',
        publish: 'publish_observability_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_observability_skill_gap: 'agent:learning',
        mitigate_observability_skill_coverage_risk: 'agent:operations',
        audit_observability_skill_gap_signals: 'agent:trust',
        publish_observability_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseObservabilitySkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilitySkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilitySkillGapDiagnoser extends BaseManager {}

export const __observabilitySkillGapDiagnoserInternals = toolkit.internals;
