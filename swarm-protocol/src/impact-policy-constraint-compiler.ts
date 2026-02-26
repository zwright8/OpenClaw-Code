import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'impact_policy_constraints_compiled',
    defaultAgentId: 'agent:impact-policy-compiler',
    recommendationTypes: {
        primary: 'compile_impact_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_impact_policy_compilation',
        publish: 'publish_impact_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_impact_policy_constraints: 'agent:impact',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_impact_policy_compilation: 'agent:trust',
        publish_impact_policy_compilation_status: 'agent:ops'
    }
});

export function compileImpactPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactPolicyConstraintCompiler extends BaseManager {}

export const __impactPolicyConstraintCompilerInternals = toolkit.internals;
