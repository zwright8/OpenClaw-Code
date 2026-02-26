import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Cultural Goal',
    readyPosture: 'cultural_goal_graph_ready',
    defaultAgentId: 'agent:cultural-goal-graph',
    recommendationTypes: {
        primary: 'decompose_cultural_goals',
        guard: 'mitigate_underspecified_cultural_goals',
        audit: 'audit_cultural_goal_decomposition',
        publish: 'publish_cultural_goal_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_cultural_goals: 'agent:cultural',
        mitigate_underspecified_cultural_goals: 'agent:strategy',
        audit_cultural_goal_decomposition: 'agent:trust',
        publish_cultural_goal_decomposition_status: 'agent:ops'
    }
});

export function decomposeCulturalGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalGoalDecomposer extends BaseManager {}

export const __culturalGoalDecomposerInternals = toolkit.internals;
