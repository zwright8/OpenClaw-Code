import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Cultural Scenario',
    readyPosture: 'cultural_counterfactual_ready',
    defaultAgentId: 'agent:cultural-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_cultural_counterfactuals',
        guard: 'mitigate_unmodeled_cultural_risk',
        audit: 'audit_cultural_counterfactual_signals',
        publish: 'publish_cultural_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_cultural_counterfactuals: 'agent:cultural',
        mitigate_unmodeled_cultural_risk: 'agent:risk',
        audit_cultural_counterfactual_signals: 'agent:trust',
        publish_cultural_counterfactual_status: 'agent:ops'
    }
});

export function simulateCulturalCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalCounterfactualSimulator extends BaseManager {}

export const __culturalCounterfactualSimulatorInternals = toolkit.internals;
