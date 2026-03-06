import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Federation Scenario',
    readyPosture: 'federation_counterfactual_ready',
    defaultAgentId: 'agent:federation-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_federation_counterfactuals',
        guard: 'mitigate_unmodeled_federation_risk',
        audit: 'audit_federation_counterfactual_signals',
        publish: 'publish_federation_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_federation_counterfactuals: 'agent:federation',
        mitigate_unmodeled_federation_risk: 'agent:risk',
        audit_federation_counterfactual_signals: 'agent:trust',
        publish_federation_counterfactual_status: 'agent:ops'
    }
});

export function simulateFederationCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationCounterfactualSimulator extends BaseManager {}

export const __federationCounterfactualSimulatorInternals = toolkit.internals;
