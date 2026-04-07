import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Economic Decision',
    readyPosture: 'economic_explainability_ready',
    defaultAgentId: 'agent:economic-explainability',
    recommendationTypes: {
        primary: 'build_economic_explainability_narrative',
        guard: 'mitigate_economic_explanation_gap',
        audit: 'audit_economic_explainability_signals',
        publish: 'publish_economic_explainability_status'
    },
    recommendationTargetMap: {
        build_economic_explainability_narrative: 'agent:economic',
        mitigate_economic_explanation_gap: 'agent:policy',
        audit_economic_explainability_signals: 'agent:trust',
        publish_economic_explainability_status: 'agent:ops'
    }
});

export function buildEconomicExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicExplainabilityNarrativeBuilder extends BaseManager {}

export const __economicExplainabilityNarrativeBuilderInternals = toolkit.internals;
