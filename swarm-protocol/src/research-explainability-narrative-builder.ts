import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Research Decision',
    readyPosture: 'research_explainability_ready',
    defaultAgentId: 'agent:research-explainability',
    recommendationTypes: {
        primary: 'build_research_explainability_narrative',
        guard: 'mitigate_research_explanation_gap',
        audit: 'audit_research_explainability_signals',
        publish: 'publish_research_explainability_status'
    },
    recommendationTargetMap: {
        build_research_explainability_narrative: 'agent:research',
        mitigate_research_explanation_gap: 'agent:policy',
        audit_research_explainability_signals: 'agent:trust',
        publish_research_explainability_status: 'agent:ops'
    }
});

export function buildResearchExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchExplainabilityNarrativeBuilder extends BaseManager {}

export const __researchExplainabilityNarrativeBuilderInternals = toolkit.internals;
