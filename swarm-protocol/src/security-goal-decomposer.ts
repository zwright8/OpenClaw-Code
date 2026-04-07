import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_goal_decomposer',
    collectionField: 'goals',
    idField: 'goalId',
    defaultName: 'Security Goal',
    readyPosture: 'security_goals_decomposed',
    defaultAgentId: 'agent:security-goals',
    recommendationTypes: {
        primary: 'decompose_security_goal',
        guard: 'mitigate_unbounded_security_scope',
        audit: 'audit_security_decomposition_signals',
        publish: 'publish_security_decomposition_status'
    },
    recommendationTargetMap: {
        decompose_security_goal: 'agent:security',
        mitigate_unbounded_security_scope: 'agent:planning',
        audit_security_decomposition_signals: 'agent:trust',
        publish_security_decomposition_status: 'agent:ops'
    }
});

export function decomposeSecurityGoals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityGoalDecomposerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityGoalDecomposer extends BaseManager {}

export const __securityGoalDecomposerInternals = toolkit.internals;
