import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Engineering Scenario',
    readyPosture: 'engineering_counterfactual_ready',
    defaultAgentId: 'agent:engineering-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_engineering_counterfactuals',
        guard: 'mitigate_unmodeled_engineering_risk',
        audit: 'audit_engineering_counterfactual_signals',
        publish: 'publish_engineering_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_engineering_counterfactuals: 'agent:engineering',
        mitigate_unmodeled_engineering_risk: 'agent:risk',
        audit_engineering_counterfactual_signals: 'agent:trust',
        publish_engineering_counterfactual_status: 'agent:ops'
    }
});

export function simulateEngineeringCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringCounterfactualSimulator extends BaseManager {}

export const __engineeringCounterfactualSimulatorInternals = toolkit.internals;
