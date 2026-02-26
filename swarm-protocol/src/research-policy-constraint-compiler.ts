import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_policy_constraint_compiler',
    collectionField: 'policyRules',
    idField: 'ruleId',
    defaultName: 'Policy Rule',
    readyPosture: 'research_policy_constraints_compiled',
    defaultAgentId: 'agent:research-policy-compiler',
    recommendationTypes: {
        primary: 'compile_research_policy_constraints',
        guard: 'mitigate_unenforced_policy_risk',
        audit: 'audit_research_policy_compilation',
        publish: 'publish_research_policy_compilation_status'
    },
    recommendationTargetMap: {
        compile_research_policy_constraints: 'agent:research',
        mitigate_unenforced_policy_risk: 'agent:compliance',
        audit_research_policy_compilation: 'agent:trust',
        publish_research_policy_compilation_status: 'agent:ops'
    }
});

export function compileResearchPolicyConstraints(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchPolicyConstraintCompilerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchPolicyConstraintCompiler extends BaseManager {}

export const __researchPolicyConstraintCompilerInternals = toolkit.internals;
