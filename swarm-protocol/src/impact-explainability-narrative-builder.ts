import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Impact Decision',
    readyPosture: 'impact_explainability_ready',
    defaultAgentId: 'agent:impact-explainability',
    recommendationTypes: {
        primary: 'build_impact_explainability_narrative',
        guard: 'mitigate_impact_explanation_gap',
        audit: 'audit_impact_explainability_signals',
        publish: 'publish_impact_explainability_status'
    },
    recommendationTargetMap: {
        build_impact_explainability_narrative: 'agent:impact',
        mitigate_impact_explanation_gap: 'agent:policy',
        audit_impact_explainability_signals: 'agent:trust',
        publish_impact_explainability_status: 'agent:ops'
    }
});

export function buildImpactExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactExplainabilityNarrativeBuilder extends BaseManager {}

export const __impactExplainabilityNarrativeBuilderInternals = toolkit.internals;
