import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Cultural Decision',
    readyPosture: 'cultural_explainability_ready',
    defaultAgentId: 'agent:cultural-explainability',
    recommendationTypes: {
        primary: 'build_cultural_explainability_narratives',
        guard: 'mitigate_cultural_explainability_gaps',
        audit: 'audit_cultural_explainability_signals',
        publish: 'publish_cultural_explainability_status'
    },
    recommendationTargetMap: {
        build_cultural_explainability_narratives: 'agent:cultural',
        mitigate_cultural_explainability_gaps: 'agent:policy',
        audit_cultural_explainability_signals: 'agent:trust',
        publish_cultural_explainability_status: 'agent:ops'
    }
});

export function buildCulturalExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalExplainabilityNarrativeBuilder extends BaseManager {}

export const __culturalExplainabilityNarrativeBuilderInternals = toolkit.internals;
