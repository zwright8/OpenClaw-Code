import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Governance Scenario',
    readyPosture: 'governance_counterfactual_ready',
    defaultAgentId: 'agent:governance-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_governance_counterfactuals',
        guard: 'mitigate_unmodeled_governance_risk',
        audit: 'audit_governance_counterfactual_signals',
        publish: 'publish_governance_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_governance_counterfactuals: 'agent:governance',
        mitigate_unmodeled_governance_risk: 'agent:risk',
        audit_governance_counterfactual_signals: 'agent:trust',
        publish_governance_counterfactual_status: 'agent:ops'
    }
});

export function simulateGovernanceCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceCounterfactualSimulator extends BaseManager {}

export const __governanceCounterfactualSimulatorInternals = toolkit.internals;
