import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Security Skill',
    readyPosture: 'security_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:security-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_security_skill_gaps',
        guard: 'mitigate_security_skill_coverage_risk',
        audit: 'audit_security_skill_gap_signals',
        publish: 'publish_security_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_security_skill_gaps: 'agent:learning',
        mitigate_security_skill_coverage_risk: 'agent:operations',
        audit_security_skill_gap_signals: 'agent:trust',
        publish_security_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseSecuritySkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securitySkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecuritySkillGapDiagnoser extends BaseManager {}

export const __securitySkillGapDiagnoserInternals = toolkit.internals;
