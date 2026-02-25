import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'policy_intervention_optimizer',
    collectionField: 'policyBundles',
    idField: 'bundleId',
    defaultName: 'Policy Bundle',
    readyPosture: 'policy_portfolio_optimized',
    defaultAgentId: 'agent:policy-optimizer',
    recommendationTypes: {
        primary: 'optimize_policy_bundle',
        guard: 'rebalance_policy_tradeoffs',
        audit: 'audit_policy_outcome_evidence',
        publish: 'publish_policy_intervention_plan'
    },
    recommendationTargetMap: {
        optimize_policy_bundle: 'agent:policy',
        rebalance_policy_tradeoffs: 'agent:governance',
        audit_policy_outcome_evidence: 'agent:compliance',
        publish_policy_intervention_plan: 'agent:ops'
    }
});

export function optimizePolicyInterventions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function policyInterventionToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PolicyInterventionOptimizer extends BaseManager {}

export const __policyInterventionOptimizerInternals = toolkit.internals;
