import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Crisis Improvement',
    readyPosture: 'crisis_continuous_improvement_ready',
    defaultAgentId: 'agent:crisis-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_crisis_continuous_improvement',
        guard: 'mitigate_crisis_improvement_stagnation',
        audit: 'audit_crisis_continuous_improvement_signals',
        publish: 'publish_crisis_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_crisis_continuous_improvement: 'agent:operations',
        mitigate_crisis_improvement_stagnation: 'agent:quality',
        audit_crisis_continuous_improvement_signals: 'agent:trust',
        publish_crisis_continuous_improvement_status: 'agent:ops'
    }
});

export function planCrisisContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisContinuousImprovementPlanner extends BaseManager {}

export const __crisisContinuousImprovementPlannerInternals = toolkit.internals;
