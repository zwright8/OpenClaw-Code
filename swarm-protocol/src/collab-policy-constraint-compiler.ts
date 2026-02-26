import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Collab Policy Rule',
    readyPosture: 'collab_policy_constraints_compiled',
    defaultAgentId: 'agent:collab-policy-compiler',
    recommendationTypes: {
        primary: 'compile_collab_policy_constraints',
        guard: 'mitigate_collab_unenforced_policy_risk',
        audit: 'audit_collab_policy_compilation',
        publish: 'publish_collab_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_collab_policy_constraints: 'agent:collab',
        mitigate_collab_unenforced_policy_risk: 'agent:compliance',
        audit_collab_policy_compilation: 'agent:trust',
        publish_collab_policy_compilation_status: 'agent:ops'
    }
});

export function compileCollabPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabPolicyConstraintCompiler extends BaseManager {}

export const __collabPolicyConstraintCompilerInternals = toolkit.internals;
