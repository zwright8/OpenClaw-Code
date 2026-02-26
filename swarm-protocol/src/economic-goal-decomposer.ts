import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Economic Goal',
    readyPosture: 'economic_goals_decomposed',
    defaultAgentId: 'agent:economic-goals',
    recommendationTypes: {
        primary: 'decompose_economic_goal',
        guard: 'mitigate_unbounded_economic_scope',
        audit: 'audit_economic_decomposition_signals',
        publish: 'publish_economic_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_economic_goal: 'agent:economic',
        mitigate_unbounded_economic_scope: 'agent:planning',
        audit_economic_decomposition_signals: 'agent:trust',
        publish_economic_decomposition_status: 'agent:ops'
    }
});

export function decomposeEconomicGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicGoalDecomposer extends BaseManager {}

export const __economicGoalDecomposerInternals = toolkit.internals;
