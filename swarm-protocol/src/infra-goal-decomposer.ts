import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Infra Goal',
    readyPosture: 'infra_goals_decomposed',
    defaultAgentId: 'agent:infra-goals',
    recommendationTypes: {
        primary: 'decompose_infra_goal',
        guard: 'mitigate_unbounded_infra_scope',
        audit: 'audit_infra_decomposition_signals',
        publish: 'publish_infra_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_infra_goal: 'agent:infra',
        mitigate_unbounded_infra_scope: 'agent:planning',
        audit_infra_decomposition_signals: 'agent:trust',
        publish_infra_decomposition_status: 'agent:ops'
    }
});

export function decomposeInfraGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraGoalDecomposer extends BaseManager {}

export const __infraGoalDecomposerInternals = toolkit.internals;
