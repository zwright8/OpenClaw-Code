import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Inclusion Goal',
    readyPosture: 'inclusion_goal_graph_ready',
    defaultAgentId: 'agent:inclusion-goal-graph',
    recommendationTypes: {
        primary: 'decompose_inclusion_goals',
        guard: 'mitigate_underspecified_inclusion_goals',
        audit: 'audit_inclusion_goal_decomposition',
        publish: 'publish_inclusion_goal_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_inclusion_goals: 'agent:inclusion',
        mitigate_underspecified_inclusion_goals: 'agent:strategy',
        audit_inclusion_goal_decomposition: 'agent:trust',
        publish_inclusion_goal_decomposition_status: 'agent:ops'
    }
});

export function decomposeInclusionGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionGoalDecomposer extends BaseManager {}

export const __inclusionGoalDecomposerInternals = toolkit.internals;
