import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Collab Scenario',
    readyPosture: 'collab_counterfactual_ready',
    defaultAgentId: 'agent:collab-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_collab_counterfactuals',
        guard: 'mitigate_unmodeled_collab_risk',
        audit: 'audit_collab_counterfactual_signals',
        publish: 'publish_collab_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_collab_counterfactuals: 'agent:collab',
        mitigate_unmodeled_collab_risk: 'agent:risk',
        audit_collab_counterfactual_signals: 'agent:trust',
        publish_collab_counterfactual_status: 'agent:ops'
    }
});

export function simulateCollabCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabCounterfactualSimulator extends BaseManager {}

export const __collabCounterfactualSimulatorInternals = toolkit.internals;
