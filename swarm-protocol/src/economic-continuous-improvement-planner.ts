import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Economic Improvement',
    readyPosture: 'economic_continuous_improvement_planned',
    defaultAgentId: 'agent:economic-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_economic_improvement',
        guard: 'mitigate_economic_improvement_backlog_risk',
        audit: 'audit_economic_continuous_improvement_signals',
        publish: 'publish_economic_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_economic_improvement: 'agent:strategy',
        mitigate_economic_improvement_backlog_risk: 'agent:operations',
        audit_economic_continuous_improvement_signals: 'agent:trust',
        publish_economic_continuous_improvement_status: 'agent:ops'
    }
});

export function planEconomicContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicContinuousImprovementPlanner extends BaseManager {}

export const __economicContinuousImprovementPlannerInternals = toolkit.internals;
