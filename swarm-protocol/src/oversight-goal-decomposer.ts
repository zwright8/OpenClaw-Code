import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Oversight Goal',
    readyPosture: 'oversight_goals_decomposed',
    defaultAgentId: 'agent:oversight-goals',
    recommendationTypes: {
        primary: 'decompose_oversight_goal',
        guard: 'mitigate_unbounded_oversight_scope',
        audit: 'audit_oversight_decomposition_signals',
        publish: 'publish_oversight_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_oversight_goal: 'agent:oversight',
        mitigate_unbounded_oversight_scope: 'agent:planning',
        audit_oversight_decomposition_signals: 'agent:trust',
        publish_oversight_decomposition_status: 'agent:ops'
    }
});

export function decomposeOversightGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightGoalDecomposer extends BaseManager {}

export const __oversightGoalDecomposerInternals = toolkit.internals;
