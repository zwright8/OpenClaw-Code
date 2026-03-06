import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'PublicService Scenario',
    readyPosture: 'publicservice_counterfactual_ready',
    defaultAgentId: 'agent:publicservice-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_publicservice_counterfactuals',
        guard: 'mitigate_unmodeled_publicservice_risk',
        audit: 'audit_publicservice_counterfactual_signals',
        publish: 'publish_publicservice_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_publicservice_counterfactuals: 'agent:publicservice',
        mitigate_unmodeled_publicservice_risk: 'agent:risk',
        audit_publicservice_counterfactual_signals: 'agent:trust',
        publish_publicservice_counterfactual_status: 'agent:ops'
    }
});

export function simulatePublicServiceCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceCounterfactualSimulator extends BaseManager {}

export const __publicServiceCounterfactualSimulatorInternals = toolkit.internals;
