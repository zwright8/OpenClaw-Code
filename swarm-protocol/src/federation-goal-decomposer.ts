import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Federation Goal',
    readyPosture: 'federation_goals_decomposed',
    defaultAgentId: 'agent:federation-goals',
    recommendationTypes: {
        primary: 'decompose_federation_goal',
        guard: 'mitigate_unbounded_federation_scope',
        audit: 'audit_federation_decomposition_signals',
        publish: 'publish_federation_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_federation_goal: 'agent:federation',
        mitigate_unbounded_federation_scope: 'agent:planning',
        audit_federation_decomposition_signals: 'agent:trust',
        publish_federation_decomposition_status: 'agent:ops'
    }
});

export function decomposeFederationGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationGoalDecomposer extends BaseManager {}

export const __federationGoalDecomposerInternals = toolkit.internals;
