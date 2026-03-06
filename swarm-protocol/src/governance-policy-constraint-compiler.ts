import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'governance_policy_constraints_compiled',
    defaultAgentId: 'agent:governance-policy-compiler',
    recommendationTypes: {
        primary: 'compile_governance_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_governance_policy_compilation',
        publish: 'publish_governance_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_governance_policy_constraints: 'agent:governance',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_governance_policy_compilation: 'agent:trust',
        publish_governance_policy_compilation_status: 'agent:ops'
    }
});

export function compileGovernancePolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governancePolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernancePolicyConstraintCompiler extends BaseManager {}

export const __governancePolicyConstraintCompilerInternals = toolkit.internals;
