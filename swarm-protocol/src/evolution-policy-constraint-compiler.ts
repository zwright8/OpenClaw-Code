import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Evolution Policy Rule',
    readyPosture: 'evolution_policy_constraints_compiled',
    defaultAgentId: 'agent:evolution-policy-compiler',
    recommendationTypes: {
        primary: 'compile_evolution_policy_constraints',
        guard: 'mitigate_unenforced_evolution_policy_risk',
        audit: 'audit_evolution_policy_compilation',
        publish: 'publish_evolution_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_evolution_policy_constraints: 'agent:evolution',
        mitigate_unenforced_evolution_policy_risk: 'agent:compliance',
        audit_evolution_policy_compilation: 'agent:trust',
        publish_evolution_policy_compilation_status: 'agent:ops'
    }
});

export function compileEvolutionPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionPolicyConstraintCompiler extends BaseManager {}

export const __evolutionPolicyConstraintCompilerInternals = toolkit.internals;
