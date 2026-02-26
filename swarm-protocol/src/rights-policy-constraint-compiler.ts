import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Rights Policy Rule',
    readyPosture: 'rights_policy_constraints_compiled',
    defaultAgentId: 'agent:rights-policy-compiler',
    recommendationTypes: {
        primary: 'compile_rights_policy_constraints',
        guard: 'mitigate_unenforced_rights_policy_risk',
        audit: 'audit_rights_policy_compilation',
        publish: 'publish_rights_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_rights_policy_constraints: 'agent:rights',
        mitigate_unenforced_rights_policy_risk: 'agent:compliance',
        audit_rights_policy_compilation: 'agent:trust',
        publish_rights_policy_compilation_status: 'agent:ops'
    }
});

export function compileRightsPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsPolicyConstraintCompiler extends BaseManager {}

export const __rightsPolicyConstraintCompilerInternals = toolkit.internals;
