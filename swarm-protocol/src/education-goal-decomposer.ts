import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Education Goal',
    readyPosture: 'education_goals_decomposed',
    defaultAgentId: 'agent:education-goals',
    recommendationTypes: {
        primary: 'decompose_education_goal',
        guard: 'mitigate_unbounded_education_scope',
        audit: 'audit_education_decomposition_signals',
        publish: 'publish_education_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_education_goal: 'agent:education',
        mitigate_unbounded_education_scope: 'agent:planning',
        audit_education_decomposition_signals: 'agent:trust',
        publish_education_decomposition_status: 'agent:ops'
    }
});

export function decomposeEducationGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationGoalDecomposer extends BaseManager {}

export const __educationGoalDecomposerInternals = toolkit.internals;
