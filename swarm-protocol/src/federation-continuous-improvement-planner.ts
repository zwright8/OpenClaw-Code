import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Federation Improvement',
    readyPosture: 'federation_continuous_improvement_planned',
    defaultAgentId: 'agent:federation-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_federation_improvement',
        guard: 'mitigate_federation_improvement_backlog_risk',
        audit: 'audit_federation_continuous_improvement_signals',
        publish: 'publish_federation_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_federation_improvement: 'agent:strategy',
        mitigate_federation_improvement_backlog_risk: 'agent:operations',
        audit_federation_continuous_improvement_signals: 'agent:trust',
        publish_federation_continuous_improvement_status: 'agent:ops'
    }
});

export function planFederationContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationContinuousImprovementPlanner extends BaseManager {}

export const __federationContinuousImprovementPlannerInternals = toolkit.internals;
