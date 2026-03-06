import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Oversight Scenario',
    readyPosture: 'oversight_counterfactual_ready',
    defaultAgentId: 'agent:oversight-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_oversight_counterfactuals',
        guard: 'mitigate_unmodeled_oversight_risk',
        audit: 'audit_oversight_counterfactual_signals',
        publish: 'publish_oversight_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_oversight_counterfactuals: 'agent:oversight',
        mitigate_unmodeled_oversight_risk: 'agent:risk',
        audit_oversight_counterfactual_signals: 'agent:trust',
        publish_oversight_counterfactual_status: 'agent:ops'
    }
});

export function simulateOversightCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightCounterfactualSimulator extends BaseManager {}

export const __oversightCounterfactualSimulatorInternals = toolkit.internals;

