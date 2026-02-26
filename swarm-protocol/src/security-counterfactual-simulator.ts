import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Security Scenario',
    readyPosture: 'security_counterfactual_ready',
    defaultAgentId: 'agent:security-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_security_counterfactuals',
        guard: 'mitigate_unmodeled_security_risk',
        audit: 'audit_security_counterfactual_signals',
        publish: 'publish_security_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_security_counterfactuals: 'agent:security',
        mitigate_unmodeled_security_risk: 'agent:risk',
        audit_security_counterfactual_signals: 'agent:trust',
        publish_security_counterfactual_status: 'agent:ops'
    }
});

export function simulateSecurityCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityCounterfactualSimulator extends BaseManager {}

export const __securityCounterfactualSimulatorInternals = toolkit.internals;
