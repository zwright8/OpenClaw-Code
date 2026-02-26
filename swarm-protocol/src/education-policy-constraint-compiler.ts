import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'education_policy_constraints_compiled',
    defaultAgentId: 'agent:education-policy-compiler',
    recommendationTypes: {
        primary: 'compile_education_policy_constraints',
        guard: 'mitigate_unenforced_education_policy_risk',
        audit: 'audit_education_policy_compilation',
        publish: 'publish_education_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_education_policy_constraints: 'agent:education',
        mitigate_unenforced_education_policy_risk: 'agent:compliance',
        audit_education_policy_compilation: 'agent:trust',
        publish_education_policy_compilation_status: 'agent:ops'
    }
});

export function compileEducationPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationPolicyConstraintCompiler extends BaseManager {}

export const __educationPolicyConstraintCompilerInternals = toolkit.internals;
