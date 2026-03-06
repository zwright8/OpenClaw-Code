import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Comms Goal',
    readyPosture: 'comms_goals_decomposed',
    defaultAgentId: 'agent:comms-goals',
    recommendationTypes: {
        primary: 'decompose_comms_goal',
        guard: 'mitigate_unbounded_comms_scope',
        audit: 'audit_comms_decomposition_signals',
        publish: 'publish_comms_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_comms_goal: 'agent:comms',
        mitigate_unbounded_comms_scope: 'agent:planning',
        audit_comms_decomposition_signals: 'agent:trust',
        publish_comms_decomposition_status: 'agent:ops'
    }
});

export function decomposeCommsGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsGoalDecomposer extends BaseManager {}

export const __commsGoalDecomposerInternals = toolkit.internals;
