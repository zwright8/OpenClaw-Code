import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Logistics Improvement',
    readyPosture: 'logistics_continuous_improvement_ready',
    defaultAgentId: 'agent:logistics-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_logistics_continuous_improvement',
        guard: 'mitigate_logistics_improvement_stagnation',
        audit: 'audit_logistics_continuous_improvement_signals',
        publish: 'publish_logistics_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_logistics_continuous_improvement: 'agent:operations',
        mitigate_logistics_improvement_stagnation: 'agent:quality',
        audit_logistics_continuous_improvement_signals: 'agent:trust',
        publish_logistics_continuous_improvement_status: 'agent:ops'
    }
});

export function planLogisticsContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsContinuousImprovementPlanner extends BaseManager {}

export const __logisticsContinuousImprovementPlannerInternals = toolkit.internals;
