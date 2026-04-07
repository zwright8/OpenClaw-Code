import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'observability_policy_constraints_compiled',
    defaultAgentId: 'agent:observability-policy-compiler',
    recommendationTypes: {
        primary: 'compile_observability_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_observability_policy_compilation',
        publish: 'publish_observability_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_observability_policy_constraints: 'agent:observability',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_observability_policy_compilation: 'agent:trust',
        publish_observability_policy_compilation_status: 'agent:ops'
    }
});

export function compileObservabilityPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityPolicyConstraintCompiler extends BaseManager {}

export const __observabilityPolicyConstraintCompilerInternals = toolkit.internals;
