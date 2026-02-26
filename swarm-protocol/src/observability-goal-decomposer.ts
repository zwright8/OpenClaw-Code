import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Observability Goal',
    readyPosture: 'observability_goals_decomposed',
    defaultAgentId: 'agent:observability-goals',
    recommendationTypes: {
        primary: 'decompose_observability_goal',
        guard: 'mitigate_unbounded_observability_scope',
        audit: 'audit_observability_decomposition_signals',
        publish: 'publish_observability_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_observability_goal: 'agent:observability',
        mitigate_unbounded_observability_scope: 'agent:planning',
        audit_observability_decomposition_signals: 'agent:trust',
        publish_observability_decomposition_status: 'agent:ops'
    }
});

export function decomposeObservabilityGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityGoalDecomposer extends BaseManager {}

export const __observabilityGoalDecomposerInternals = toolkit.internals;
