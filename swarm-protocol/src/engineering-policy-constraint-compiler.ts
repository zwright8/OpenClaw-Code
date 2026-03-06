import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'engineering_policy_constraints_compiled',
    defaultAgentId: 'agent:engineering-policy-compiler',
    recommendationTypes: {
        primary: 'compile_engineering_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_engineering_policy_compilation',
        publish: 'publish_engineering_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_engineering_policy_constraints: 'agent:engineering',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_engineering_policy_compilation: 'agent:trust',
        publish_engineering_policy_compilation_status: 'agent:ops'
    }
});

export function compileEngineeringPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringPolicyConstraintCompiler extends BaseManager {}

export const __engineeringPolicyConstraintCompilerInternals = toolkit.internals;
