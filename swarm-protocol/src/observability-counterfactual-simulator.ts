import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Observability Scenario',
    readyPosture: 'observability_counterfactual_ready',
    defaultAgentId: 'agent:observability-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_observability_counterfactuals',
        guard: 'mitigate_unmodeled_observability_risk',
        audit: 'audit_observability_counterfactual_signals',
        publish: 'publish_observability_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_observability_counterfactuals: 'agent:observability',
        mitigate_unmodeled_observability_risk: 'agent:risk',
        audit_observability_counterfactual_signals: 'agent:trust',
        publish_observability_counterfactual_status: 'agent:ops'
    }
});

export function simulateObservabilityCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityCounterfactualSimulator extends BaseManager {}

export const __observabilityCounterfactualSimulatorInternals = toolkit.internals;
