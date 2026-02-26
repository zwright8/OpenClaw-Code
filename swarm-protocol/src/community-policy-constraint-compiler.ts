import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Community Policy Rule',
    readyPosture: 'community_policy_constraints_compiled',
    defaultAgentId: 'agent:community-policy-compiler',
    recommendationTypes: {
        primary: 'compile_community_policy_constraints',
        guard: 'mitigate_community_policy_conflicts',
        audit: 'audit_community_policy_signals',
        publish: 'publish_community_policy_status'
    },
    recommendationTargetMap: {
        compile_community_policy_constraints: 'agent:community',
        mitigate_community_policy_conflicts: 'agent:policy',
        audit_community_policy_signals: 'agent:trust',
        publish_community_policy_status: 'agent:ops'
    }
});

export function compileCommunityPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityPolicyConstraintCompiler extends BaseManager {}

export const __communityPolicyConstraintCompilerInternals = toolkit.internals;
