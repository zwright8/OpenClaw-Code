import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Collab Goal',
    readyPosture: 'collab_goals_decomposed',
    defaultAgentId: 'agent:collab-goals',
    recommendationTypes: {
        primary: 'decompose_collab_goal',
        guard: 'mitigate_unbounded_collab_scope',
        audit: 'audit_collab_decomposition_signals',
        publish: 'publish_collab_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_collab_goal: 'agent:collab',
        mitigate_unbounded_collab_scope: 'agent:planning',
        audit_collab_decomposition_signals: 'agent:trust',
        publish_collab_decomposition_status: 'agent:ops'
    }
});

export function decomposeCollabGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabGoalDecomposer extends BaseManager {}

export const __collabGoalDecomposerInternals = toolkit.internals;
