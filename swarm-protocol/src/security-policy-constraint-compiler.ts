import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'security_policy_constraints_compiled',
    defaultAgentId: 'agent:security-policy-compiler',
    recommendationTypes: {
        primary: 'compile_security_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_security_policy_compilation',
        publish: 'publish_security_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_security_policy_constraints: 'agent:security',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_security_policy_compilation: 'agent:trust',
        publish_security_policy_compilation_status: 'agent:ops'
    }
});

export function compileSecurityPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityPolicyConstraintCompiler extends BaseManager {}

export const __securityPolicyConstraintCompilerInternals = toolkit.internals;
