import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Inclusion Scenario',
    readyPosture: 'inclusion_counterfactual_ready',
    defaultAgentId: 'agent:inclusion-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_inclusion_counterfactuals',
        guard: 'mitigate_unmodeled_inclusion_risk',
        audit: 'audit_inclusion_counterfactual_signals',
        publish: 'publish_inclusion_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_inclusion_counterfactuals: 'agent:inclusion',
        mitigate_unmodeled_inclusion_risk: 'agent:risk',
        audit_inclusion_counterfactual_signals: 'agent:trust',
        publish_inclusion_counterfactual_status: 'agent:ops'
    }
});

export function simulateInclusionCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionCounterfactualSimulator extends BaseManager {}

export const __inclusionCounterfactualSimulatorInternals = toolkit.internals;
