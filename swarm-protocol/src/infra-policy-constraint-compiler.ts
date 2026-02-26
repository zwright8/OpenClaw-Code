import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Infra Policy Rule',
    readyPosture: 'infra_policy_constraints_compiled',
    defaultAgentId: 'agent:infra-policy-compiler',
    recommendationTypes: {
        primary: 'compile_infra_policy_constraints',
        guard: 'mitigate_unenforced_infra_policy_risk',
        audit: 'audit_infra_policy_compilation',
        publish: 'publish_infra_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_infra_policy_constraints: 'agent:infra',
        mitigate_unenforced_infra_policy_risk: 'agent:compliance',
        audit_infra_policy_compilation: 'agent:trust',
        publish_infra_policy_compilation_status: 'agent:ops'
    }
});

export function compileInfraPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraPolicyConstraintCompiler extends BaseManager {}

export const __infraPolicyConstraintCompilerInternals = toolkit.internals;
