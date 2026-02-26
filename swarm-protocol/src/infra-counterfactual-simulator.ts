import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Infra Scenario',
    readyPosture: 'infra_counterfactual_ready',
    defaultAgentId: 'agent:infra-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_infra_counterfactuals',
        guard: 'mitigate_unmodeled_infra_risk',
        audit: 'audit_infra_counterfactual_signals',
        publish: 'publish_infra_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_infra_counterfactuals: 'agent:infra',
        mitigate_unmodeled_infra_risk: 'agent:risk',
        audit_infra_counterfactual_signals: 'agent:trust',
        publish_infra_counterfactual_status: 'agent:ops'
    }
});

export function simulateInfraCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraCounterfactualSimulator extends BaseManager {}

export const __infraCounterfactualSimulatorInternals = toolkit.internals;
