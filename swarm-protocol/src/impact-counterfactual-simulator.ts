import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Impact Scenario',
    readyPosture: 'impact_counterfactual_ready',
    defaultAgentId: 'agent:impact-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_impact_counterfactuals',
        guard: 'mitigate_unmodeled_impact_risk',
        audit: 'audit_impact_counterfactual_signals',
        publish: 'publish_impact_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_impact_counterfactuals: 'agent:impact',
        mitigate_unmodeled_impact_risk: 'agent:risk',
        audit_impact_counterfactual_signals: 'agent:trust',
        publish_impact_counterfactual_status: 'agent:ops'
    }
});

export function simulateImpactCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactCounterfactualSimulator extends BaseManager {}

export const __impactCounterfactualSimulatorInternals = toolkit.internals;
