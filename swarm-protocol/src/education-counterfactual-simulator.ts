import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Education Scenario',
    readyPosture: 'education_counterfactual_ready',
    defaultAgentId: 'agent:education-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_education_counterfactuals',
        guard: 'mitigate_unmodeled_education_risk',
        audit: 'audit_education_counterfactual_signals',
        publish: 'publish_education_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_education_counterfactuals: 'agent:education',
        mitigate_unmodeled_education_risk: 'agent:risk',
        audit_education_counterfactual_signals: 'agent:trust',
        publish_education_counterfactual_status: 'agent:ops'
    }
});

export function simulateEducationCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationCounterfactualSimulator extends BaseManager {}

export const __educationCounterfactualSimulatorInternals = toolkit.internals;
