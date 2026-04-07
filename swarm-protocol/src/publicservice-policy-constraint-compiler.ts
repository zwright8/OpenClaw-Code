import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'PublicService Policy Rule',
    readyPosture: 'publicservice_policy_constraints_compiled',
    defaultAgentId: 'agent:publicservice-policy-compiler',
    recommendationTypes: {
        primary: 'compile_publicservice_policy_constraints',
        guard: 'mitigate_publicservice_unenforced_policy_risk',
        audit: 'audit_publicservice_policy_compilation',
        publish: 'publish_publicservice_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_publicservice_policy_constraints: 'agent:publicservice',
        mitigate_publicservice_unenforced_policy_risk: 'agent:compliance',
        audit_publicservice_policy_compilation: 'agent:trust',
        publish_publicservice_policy_compilation_status: 'agent:ops'
    }
});

export function compilePublicServicePolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServicePolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServicePolicyConstraintCompiler extends BaseManager {}

export const __publicServicePolicyConstraintCompilerInternals = toolkit.internals;
