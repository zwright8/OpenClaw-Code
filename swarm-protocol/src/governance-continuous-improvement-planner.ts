import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Governance Improvement',
    readyPosture: 'governance_continuous_improvement_planned',
    defaultAgentId: 'agent:governance-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_governance_improvement',
        guard: 'mitigate_governance_improvement_backlog_risk',
        audit: 'audit_governance_continuous_improvement_signals',
        publish: 'publish_governance_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_governance_improvement: 'agent:strategy',
        mitigate_governance_improvement_backlog_risk: 'agent:operations',
        audit_governance_continuous_improvement_signals: 'agent:trust',
        publish_governance_continuous_improvement_status: 'agent:ops'
    }
});

export function planGovernanceContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceContinuousImprovementPlanner extends BaseManager {}

export const __governanceContinuousImprovementPlannerInternals = toolkit.internals;
