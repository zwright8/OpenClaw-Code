import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_counterfactual_simulator',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Research Scenario',
    readyPosture: 'research_counterfactual_ready',
    defaultAgentId: 'agent:research-counterfactuals',
    recommendationTypes: {
        primary: 'simulate_research_counterfactuals',
        guard: 'mitigate_unmodeled_research_risk',
        audit: 'audit_research_counterfactual_signals',
        publish: 'publish_research_counterfactual_status'
    },
    recommendationTargetMap: {
        simulate_research_counterfactuals: 'agent:research',
        mitigate_unmodeled_research_risk: 'agent:risk',
        audit_research_counterfactual_signals: 'agent:trust',
        publish_research_counterfactual_status: 'agent:ops'
    }
});

export function simulateResearchCounterfactuals(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchCounterfactualSimulatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchCounterfactualSimulator extends BaseManager {}

export const __researchCounterfactualSimulatorInternals = toolkit.internals;
