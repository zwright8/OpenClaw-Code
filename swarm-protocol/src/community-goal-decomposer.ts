import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Community Goal',
    readyPosture: 'community_goal_graph_ready',
    defaultAgentId: 'agent:community-goal-graph',
    recommendationTypes: {
        primary: 'decompose_community_goals',
        guard: 'mitigate_underspecified_community_goals',
        audit: 'audit_community_goal_decomposition',
        publish: 'publish_community_goal_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_community_goals: 'agent:community',
        mitigate_underspecified_community_goals: 'agent:strategy',
        audit_community_goal_decomposition: 'agent:trust',
        publish_community_goal_decomposition_status: 'agent:ops'
    }
});

export function decomposeCommunityGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityGoalDecomposer extends BaseManager {}

export const __communityGoalDecomposerInternals = toolkit.internals;
