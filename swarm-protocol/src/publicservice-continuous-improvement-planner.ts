import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'PublicService Improvement',
    readyPosture: 'publicservice_continuous_improvement_ready',
    defaultAgentId: 'agent:publicservice-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_publicservice_continuous_improvement',
        guard: 'mitigate_publicservice_improvement_stagnation',
        audit: 'audit_publicservice_continuous_improvement_signals',
        publish: 'publish_publicservice_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_publicservice_continuous_improvement: 'agent:operations',
        mitigate_publicservice_improvement_stagnation: 'agent:quality',
        audit_publicservice_continuous_improvement_signals: 'agent:trust',
        publish_publicservice_continuous_improvement_status: 'agent:ops'
    }
});

export function planPublicServiceContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceContinuousImprovementPlanner extends BaseManager {}

export const __publicServiceContinuousImprovementPlannerInternals = toolkit.internals;
