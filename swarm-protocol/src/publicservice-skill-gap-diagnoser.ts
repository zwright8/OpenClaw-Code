import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'PublicService Skill',
    readyPosture: 'publicservice_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:publicservice-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_publicservice_skill_gaps',
        guard: 'mitigate_publicservice_skill_coverage_risk',
        audit: 'audit_publicservice_skill_gap_signals',
        publish: 'publish_publicservice_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_publicservice_skill_gaps: 'agent:learning',
        mitigate_publicservice_skill_coverage_risk: 'agent:operations',
        audit_publicservice_skill_gap_signals: 'agent:trust',
        publish_publicservice_skill_gap_status: 'agent:ops'
    }
});

export function diagnosePublicServiceSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceSkillGapDiagnoser extends BaseManager {}

export const __publicServiceSkillGapDiagnoserInternals = toolkit.internals;
