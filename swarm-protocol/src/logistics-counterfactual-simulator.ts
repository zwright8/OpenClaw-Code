import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Logistics Scenario',
    readyPosture: 'logistics_counterfactual_ready',
    defaultAgentId: 'agent:logistics-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_logistics_counterfactuals',
        guard: 'mitigate_unmodeled_logistics_risk',
        audit: 'audit_logistics_counterfactual_signals',
        publish: 'publish_logistics_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_logistics_counterfactuals: 'agent:logistics',
        mitigate_unmodeled_logistics_risk: 'agent:risk',
        audit_logistics_counterfactual_signals: 'agent:trust',
        publish_logistics_counterfactual_status: 'agent:ops'
    }
});

export function simulateLogisticsCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsCounterfactualSimulator extends BaseManager {}

export const __logisticsCounterfactualSimulatorInternals = toolkit.internals;
