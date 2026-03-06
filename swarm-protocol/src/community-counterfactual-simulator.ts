import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Community Scenario',
    readyPosture: 'community_counterfactual_ready',
    defaultAgentId: 'agent:community-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_community_counterfactuals',
        guard: 'mitigate_unmodeled_community_risk',
        audit: 'audit_community_counterfactual_signals',
        publish: 'publish_community_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_community_counterfactuals: 'agent:community',
        mitigate_unmodeled_community_risk: 'agent:risk',
        audit_community_counterfactual_signals: 'agent:trust',
        publish_community_counterfactual_status: 'agent:ops'
    }
});

export function simulateCommunityCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityCounterfactualSimulator extends BaseManager {}

export const __communityCounterfactualSimulatorInternals = toolkit.internals;
