import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Economic Scenario',
    readyPosture: 'economic_counterfactual_ready',
    defaultAgentId: 'agent:economic-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_economic_counterfactuals',
        guard: 'mitigate_unmodeled_economic_risk',
        audit: 'audit_economic_counterfactual_signals',
        publish: 'publish_economic_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_economic_counterfactuals: 'agent:economic',
        mitigate_unmodeled_economic_risk: 'agent:risk',
        audit_economic_counterfactual_signals: 'agent:trust',
        publish_economic_counterfactual_status: 'agent:ops'
    }
});

export function simulateEconomicCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicCounterfactualSimulator extends BaseManager {}

export const __economicCounterfactualSimulatorInternals = toolkit.internals;
