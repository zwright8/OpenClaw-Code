import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Crisis Goal',
    readyPosture: 'crisis_goals_decomposed',
    defaultAgentId: 'agent:crisis-goals',
    recommendationTypes: {
        primary: 'decompose_crisis_goal',
        guard: 'mitigate_unbounded_crisis_scope',
        audit: 'audit_crisis_decomposition_signals',
        publish: 'publish_crisis_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_crisis_goal: 'agent:crisis',
        mitigate_unbounded_crisis_scope: 'agent:planning',
        audit_crisis_decomposition_signals: 'agent:trust',
        publish_crisis_decomposition_status: 'agent:ops'
    }
});

export function decomposeCrisisGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisGoalDecomposer extends BaseManager {}

export const __crisisGoalDecomposerInternals = toolkit.internals;
