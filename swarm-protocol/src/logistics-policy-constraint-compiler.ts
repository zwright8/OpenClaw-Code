import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Logistics Policy Rule',
    readyPosture: 'logistics_policy_constraints_compiled',
    defaultAgentId: 'agent:logistics-policy-compiler',
    recommendationTypes: {
        primary: 'compile_logistics_policy_constraints',
        guard: 'mitigate_logistics_unenforced_policy_risk',
        audit: 'audit_logistics_policy_compilation',
        publish: 'publish_logistics_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_logistics_policy_constraints: 'agent:logistics',
        mitigate_logistics_unenforced_policy_risk: 'agent:compliance',
        audit_logistics_policy_compilation: 'agent:trust',
        publish_logistics_policy_compilation_status: 'agent:ops'
    }
});

export function compileLogisticsPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsPolicyConstraintCompiler extends BaseManager {}

export const __logisticsPolicyConstraintCompilerInternals = toolkit.internals;
