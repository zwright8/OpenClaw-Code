import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Rights Goal',
    readyPosture: 'rights_goals_decomposed',
    defaultAgentId: 'agent:rights-goals',
    recommendationTypes: {
        primary: 'decompose_rights_goal',
        guard: 'mitigate_unbounded_rights_scope',
        audit: 'audit_rights_decomposition_signals',
        publish: 'publish_rights_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_rights_goal: 'agent:rights',
        mitigate_unbounded_rights_scope: 'agent:planning',
        audit_rights_decomposition_signals: 'agent:trust',
        publish_rights_decomposition_status: 'agent:ops'
    }
});

export function decomposeRightsGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsGoalDecomposer extends BaseManager {}

export const __rightsGoalDecomposerInternals = toolkit.internals;
