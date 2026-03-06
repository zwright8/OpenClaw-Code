import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'crisis_policy_constraints_compiled',
    defaultAgentId: 'agent:crisis-policy-compiler',
    recommendationTypes: {
        primary: 'compile_crisis_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_crisis_policy_compilation',
        publish: 'publish_crisis_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_crisis_policy_constraints: 'agent:crisis',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_crisis_policy_compilation: 'agent:trust',
        publish_crisis_policy_compilation_status: 'agent:ops'
    }
});

export function compileCrisisPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisPolicyConstraintCompiler extends BaseManager {}

export const __crisisPolicyConstraintCompilerInternals = toolkit.internals;
