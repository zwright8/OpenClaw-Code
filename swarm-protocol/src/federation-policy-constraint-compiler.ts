import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'federation_policy_constraints_compiled',
    defaultAgentId: 'agent:federation-policy-compiler',
    recommendationTypes: {
        primary: 'compile_federation_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_federation_policy_compilation',
        publish: 'publish_federation_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_federation_policy_constraints: 'agent:federation',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_federation_policy_compilation: 'agent:trust',
        publish_federation_policy_compilation_status: 'agent:ops'
    }
});

export function compileFederationPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationPolicyConstraintCompiler extends BaseManager {}

export const __federationPolicyConstraintCompilerInternals = toolkit.internals;
