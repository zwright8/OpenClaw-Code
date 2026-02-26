import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Evolution Goal',
    readyPosture: 'evolution_goals_decomposed',
    defaultAgentId: 'agent:evolution-goals',
    recommendationTypes: {
        primary: 'decompose_evolution_goal',
        guard: 'mitigate_unbounded_evolution_scope',
        audit: 'audit_evolution_decomposition_signals',
        publish: 'publish_evolution_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_evolution_goal: 'agent:evolution',
        mitigate_unbounded_evolution_scope: 'agent:planning',
        audit_evolution_decomposition_signals: 'agent:trust',
        publish_evolution_decomposition_status: 'agent:ops'
    }
});

export function decomposeEvolutionGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionGoalDecomposer extends BaseManager {}

export const __evolutionGoalDecomposerInternals = toolkit.internals;
