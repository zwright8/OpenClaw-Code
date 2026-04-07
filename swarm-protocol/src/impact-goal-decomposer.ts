import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Impact Goal',
    readyPosture: 'impact_goals_decomposed',
    defaultAgentId: 'agent:impact-goals',
    recommendationTypes: {
        primary: 'decompose_impact_goal',
        guard: 'mitigate_unbounded_impact_scope',
        audit: 'audit_impact_decomposition_signals',
        publish: 'publish_impact_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_impact_goal: 'agent:impact',
        mitigate_unbounded_impact_scope: 'agent:planning',
        audit_impact_decomposition_signals: 'agent:trust',
        publish_impact_decomposition_status: 'agent:ops'
    }
});

export function decomposeImpactGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactGoalDecomposer extends BaseManager {}

export const __impactGoalDecomposerInternals = toolkit.internals;
