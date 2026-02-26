import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Collab Improvement',
    readyPosture: 'collab_continuous_improvement_planned',
    defaultAgentId: 'agent:collab-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_continuous_collab_improvement',
        guard: 'mitigate_collab_improvement_backlog_risk',
        audit: 'audit_collab_continuous_improvement_signals',
        publish: 'publish_collab_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_continuous_collab_improvement: 'agent:strategy',
        mitigate_collab_improvement_backlog_risk: 'agent:operations',
        audit_collab_continuous_improvement_signals: 'agent:trust',
        publish_collab_continuous_improvement_status: 'agent:ops'
    }
});

export function planCollabContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabContinuousImprovementPlanner extends BaseManager {}

export const __collabContinuousImprovementPlannerInternals = toolkit.internals;
