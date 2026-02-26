import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Crisis Scenario',
    readyPosture: 'crisis_counterfactual_ready',
    defaultAgentId: 'agent:crisis-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_crisis_counterfactuals',
        guard: 'mitigate_unmodeled_crisis_risk',
        audit: 'audit_crisis_counterfactual_signals',
        publish: 'publish_crisis_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_crisis_counterfactuals: 'agent:crisis',
        mitigate_unmodeled_crisis_risk: 'agent:risk',
        audit_crisis_counterfactual_signals: 'agent:trust',
        publish_crisis_counterfactual_status: 'agent:ops'
    }
});

export function simulateCrisisCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisCounterfactualSimulator extends BaseManager {}

export const __crisisCounterfactualSimulatorInternals = toolkit.internals;
