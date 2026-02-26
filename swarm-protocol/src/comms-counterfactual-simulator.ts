import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Comms Scenario',
    readyPosture: 'comms_counterfactual_ready',
    defaultAgentId: 'agent:comms-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_comms_counterfactuals',
        guard: 'mitigate_unmodeled_comms_risk',
        audit: 'audit_comms_counterfactual_signals',
        publish: 'publish_comms_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_comms_counterfactuals: 'agent:comms',
        mitigate_unmodeled_comms_risk: 'agent:risk',
        audit_comms_counterfactual_signals: 'agent:trust',
        publish_comms_counterfactual_status: 'agent:ops'
    }
});

export function simulateCommsCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsCounterfactualSimulator extends BaseManager {}

export const __commsCounterfactualSimulatorInternals = toolkit.internals;
