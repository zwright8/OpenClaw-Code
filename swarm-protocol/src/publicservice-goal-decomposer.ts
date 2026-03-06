import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'PublicService Goal',
    readyPosture: 'publicservice_goals_decomposed',
    defaultAgentId: 'agent:publicservice-goals',
    recommendationTypes: {
        primary: 'decompose_publicservice_goal',
        guard: 'mitigate_unbounded_publicservice_scope',
        audit: 'audit_publicservice_decomposition_signals',
        publish: 'publish_publicservice_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_publicservice_goal: 'agent:publicservice',
        mitigate_unbounded_publicservice_scope: 'agent:planning',
        audit_publicservice_decomposition_signals: 'agent:trust',
        publish_publicservice_decomposition_status: 'agent:ops'
    }
});

export function decomposePublicServiceGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceGoalDecomposer extends BaseManager {}

export const __publicServiceGoalDecomposerInternals = toolkit.internals;
