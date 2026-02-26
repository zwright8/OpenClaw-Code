import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Cultural Policy Rule',
    readyPosture: 'cultural_policy_constraints_compiled',
    defaultAgentId: 'agent:cultural-policy-compiler',
    recommendationTypes: {
        primary: 'compile_cultural_policy_constraints',
        guard: 'mitigate_cultural_policy_conflicts',
        audit: 'audit_cultural_policy_signals',
        publish: 'publish_cultural_policy_status'
    },
    recommendationTargetMap: {
        compile_cultural_policy_constraints: 'agent:cultural',
        mitigate_cultural_policy_conflicts: 'agent:policy',
        audit_cultural_policy_signals: 'agent:trust',
        publish_cultural_policy_status: 'agent:ops'
    }
});

export function compileCulturalPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalPolicyConstraintCompiler extends BaseManager {}

export const __culturalPolicyConstraintCompilerInternals = toolkit.internals;
