import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_continuous_improvement_planner',
    collectionField: 'improvements',
    idField: 'improvementId',
    defaultName: 'Community Improvement',
    readyPosture: 'community_continuous_improvement_ready',
    defaultAgentId: 'agent:community-continuous-improvement',
    recommendationTypes: {
        primary: 'plan_community_continuous_improvement',
        guard: 'mitigate_community_improvement_stagnation',
        audit: 'audit_community_continuous_improvement_signals',
        publish: 'publish_community_continuous_improvement_status'
    },
    recommendationTargetMap: {
        plan_community_continuous_improvement: 'agent:operations',
        mitigate_community_improvement_stagnation: 'agent:quality',
        audit_community_continuous_improvement_signals: 'agent:trust',
        publish_community_continuous_improvement_status: 'agent:ops'
    }
});

export function planCommunityContinuousImprovement(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityContinuousImprovementPlannerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityContinuousImprovementPlanner extends BaseManager {}

export const __communityContinuousImprovementPlannerInternals = toolkit.internals;
