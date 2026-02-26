import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Oversight Policy Rule',
    readyPosture: 'oversight_policy_constraints_compiled',
    defaultAgentId: 'agent:oversight-policy-compiler',
    recommendationTypes: {
        primary: 'compile_oversight_policy_constraints',
        guard: 'mitigate_oversight_unenforced_policy_risk',
        audit: 'audit_oversight_policy_compilation',
        publish: 'publish_oversight_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_oversight_policy_constraints: 'agent:oversight',
        mitigate_oversight_unenforced_policy_risk: 'agent:compliance',
        audit_oversight_policy_compilation: 'agent:trust',
        publish_oversight_policy_compilation_status: 'agent:ops'
    }
});

export function compileOversightPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightPolicyConstraintCompiler extends BaseManager {}

export const __oversightPolicyConstraintCompilerInternals = toolkit.internals;
