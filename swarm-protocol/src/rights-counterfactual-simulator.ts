import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Rights Scenario',
    readyPosture: 'rights_counterfactual_ready',
    defaultAgentId: 'agent:rights-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_rights_counterfactuals',
        guard: 'mitigate_unmodeled_rights_risk',
        audit: 'audit_rights_counterfactual_signals',
        publish: 'publish_rights_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_rights_counterfactuals: 'agent:rights',
        mitigate_unmodeled_rights_risk: 'agent:risk',
        audit_rights_counterfactual_signals: 'agent:trust',
        publish_rights_counterfactual_status: 'agent:ops'
    }
});

export function simulateRightsCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsCounterfactualSimulator extends BaseManager {}

export const __rightsCounterfactualSimulatorInternals = toolkit.internals;
