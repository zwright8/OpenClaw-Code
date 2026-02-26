import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Logistics Goal',
    readyPosture: 'logistics_goals_decomposed',
    defaultAgentId: 'agent:logistics-goals',
    recommendationTypes: {
        primary: 'decompose_logistics_goal',
        guard: 'mitigate_unbounded_logistics_scope',
        audit: 'audit_logistics_decomposition_signals',
        publish: 'publish_logistics_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_logistics_goal: 'agent:logistics',
        mitigate_unbounded_logistics_scope: 'agent:planning',
        audit_logistics_decomposition_signals: 'agent:trust',
        publish_logistics_decomposition_status: 'agent:ops'
    }
});

export function decomposeLogisticsGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsGoalDecomposer extends BaseManager {}

export const __logisticsGoalDecomposerInternals = toolkit.internals;
