import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Observability Improvement',
    readyPosture: 'observability_continuous_improvement_planned',
    defaultAgentId: 'agent:observability-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_observability_improvement',
        guard: 'mitigate_observability_improvement_backlog_risk',
        audit: 'audit_observability_continuous_improvement_signals',
        publish: 'publish_observability_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_observability_improvement: 'agent:strategy',
        mitigate_observability_improvement_backlog_risk: 'agent:operations',
        audit_observability_continuous_improvement_signals: 'agent:trust',
        publish_observability_continuous_improvement_status: 'agent:ops'
    }
});

export function planObservabilityContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityContinuousImprovementPlanner extends BaseManager {}

export const __observabilityContinuousImprovementPlannerInternals = toolkit.internals;
