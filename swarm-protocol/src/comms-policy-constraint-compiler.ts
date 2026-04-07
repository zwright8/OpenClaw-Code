import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'comms_policy_constraints_compiled',
    defaultAgentId: 'agent:comms-policy-compiler',
    recommendationTypes: {
        primary: 'compile_comms_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_comms_policy_compilation',
        publish: 'publish_comms_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_comms_policy_constraints: 'agent:comms',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_comms_policy_compilation: 'agent:trust',
        publish_comms_policy_compilation_status: 'agent:ops'
    }
});

export function compileCommsPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsPolicyConstraintCompiler extends BaseManager {}

export const __commsPolicyConstraintCompilerInternals = toolkit.internals;
