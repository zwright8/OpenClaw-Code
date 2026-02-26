import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Evolution Scenario',
    readyPosture: 'evolution_counterfactual_ready',
    defaultAgentId: 'agent:evolution-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_evolution_counterfactuals',
        guard: 'mitigate_unmodeled_evolution_risk',
        audit: 'audit_evolution_counterfactual_signals',
        publish: 'publish_evolution_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_evolution_counterfactuals: 'agent:evolution',
        mitigate_unmodeled_evolution_risk: 'agent:risk',
        audit_evolution_counterfactual_signals: 'agent:trust',
        publish_evolution_counterfactual_status: 'agent:ops'
    }
});

export function simulateEvolutionCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionCounterfactualSimulator extends BaseManager {}

export const __evolutionCounterfactualSimulatorInternals = toolkit.internals;
