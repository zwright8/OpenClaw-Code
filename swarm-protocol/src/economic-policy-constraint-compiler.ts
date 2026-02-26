import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'economic_policy_constraints_compiled',
    defaultAgentId: 'agent:economic-policy-compiler',
    recommendationTypes: {
        primary: 'compile_economic_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_economic_policy_compilation',
        publish: 'publish_economic_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_economic_policy_constraints: 'agent:economic',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_economic_policy_compilation: 'agent:trust',
        publish_economic_policy_compilation_status: 'agent:ops'
    }
});

export function compileEconomicPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicPolicyConstraintCompiler extends BaseManager {}

export const __economicPolicyConstraintCompilerInternals = toolkit.internals;
