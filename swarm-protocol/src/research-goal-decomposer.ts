import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Research Goal',
    readyPosture: 'research_goals_decomposed',
    defaultAgentId: 'agent:research-goals',
    recommendationTypes: {
        primary: 'decompose_research_goal',
        guard: 'mitigate_unbounded_research_scope',
        audit: 'audit_research_decomposition_signals',
        publish: 'publish_research_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_research_goal: 'agent:research',
        mitigate_unbounded_research_scope: 'agent:planning',
        audit_research_decomposition_signals: 'agent:trust',
        publish_research_decomposition_status: 'agent:ops'
    }
});

export function decomposeResearchGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchGoalDecomposer extends BaseManager {}

export const __researchGoalDecomposerInternals = toolkit.internals;
