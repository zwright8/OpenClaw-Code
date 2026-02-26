import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Engineering Goal',
    readyPosture: 'engineering_goals_decomposed',
    defaultAgentId: 'agent:engineering-goals',
    recommendationTypes: {
        primary: 'decompose_engineering_goal',
        guard: 'mitigate_unbounded_engineering_scope',
        audit: 'audit_engineering_decomposition_signals',
        publish: 'publish_engineering_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_engineering_goal: 'agent:engineering',
        mitigate_unbounded_engineering_scope: 'agent:planning',
        audit_engineering_decomposition_signals: 'agent:trust',
        publish_engineering_decomposition_status: 'agent:ops'
    }
});

export function decomposeEngineeringGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringGoalDecomposer extends BaseManager {}

export const __engineeringGoalDecomposerInternals = toolkit.internals;
