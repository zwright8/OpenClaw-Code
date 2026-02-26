import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_skill_gap_diagnoser',
    collectionField: 'skills',
    idField: 'skillId',
    defaultName: 'Governance Skill',
    readyPosture: 'governance_skill_gap_diagnosis_ready',
    defaultAgentId: 'agent:governance-skill-gap',
    recommendationTypes: {
        primary: 'diagnose_governance_skill_gap',
        guard: 'mitigate_governance_skill_coverage_risk',
        audit: 'audit_governance_skill_gap_signals',
        publish: 'publish_governance_skill_gap_status'
    },
    recommendationTargetMap: {
        diagnose_governance_skill_gap: 'agent:learning',
        mitigate_governance_skill_coverage_risk: 'agent:operations',
        audit_governance_skill_gap_signals: 'agent:trust',
        publish_governance_skill_gap_status: 'agent:ops'
    }
});

export function diagnoseGovernanceSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceSkillGapDiagnoserToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceSkillGapDiagnoser extends BaseManager {}

export const __governanceSkillGapDiagnoserInternals = toolkit.internals;
