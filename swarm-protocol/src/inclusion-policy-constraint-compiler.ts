import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Inclusion Policy Rule',
    readyPosture: 'inclusion_policy_constraints_compiled',
    defaultAgentId: 'agent:inclusion-policy-compiler',
    recommendationTypes: {
        primary: 'compile_inclusion_policy_constraints',
        guard: 'mitigate_inclusion_policy_conflicts',
        audit: 'audit_inclusion_policy_signals',
        publish: 'publish_inclusion_policy_status'
    },
    recommendationTargetMap: {
        compile_inclusion_policy_constraints: 'agent:inclusion',
        mitigate_inclusion_policy_conflicts: 'agent:policy',
        audit_inclusion_policy_signals: 'agent:trust',
        publish_inclusion_policy_status: 'agent:ops'
    }
});

export function compileInclusionPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionPolicyConstraintCompiler extends BaseManager {}

export const __inclusionPolicyConstraintCompilerInternals = toolkit.internals;
