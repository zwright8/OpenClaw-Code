import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Governance Goal',
    readyPosture: 'governance_goals_decomposed',
    defaultAgentId: 'agent:governance-goals',
    recommendationTypes: {
        primary: 'decompose_governance_goal',
        guard: 'mitigate_unbounded_governance_scope',
        audit: 'audit_governance_decomposition_signals',
        publish: 'publish_governance_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_governance_goal: 'agent:governance',
        mitigate_unbounded_governance_scope: 'agent:planning',
        audit_governance_decomposition_signals: 'agent:trust',
        publish_governance_decomposition_status: 'agent:ops'
    }
});

export function decomposeGovernanceGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceGoalDecomposer extends BaseManager {}

export const __governanceGoalDecomposerInternals = toolkit.internals;
