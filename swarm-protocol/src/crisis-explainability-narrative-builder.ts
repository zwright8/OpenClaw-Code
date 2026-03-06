import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Crisis Decision',
    readyPosture: 'crisis_explainability_ready',
    defaultAgentId: 'agent:crisis-explainability',
    recommendationTypes: {
        primary: 'build_crisis_explainability_narrative',
        guard: 'mitigate_crisis_explanation_gap',
        audit: 'audit_crisis_explainability_signals',
        publish: 'publish_crisis_explainability_status'
    },
    recommendationTargetMap: {
        build_crisis_explainability_narrative: 'agent:crisis',
        mitigate_crisis_explanation_gap: 'agent:policy',
        audit_crisis_explainability_signals: 'agent:trust',
        publish_crisis_explainability_status: 'agent:ops'
    }
});

export function buildCrisisExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisExplainabilityNarrativeBuilder extends BaseManager {}

export const __crisisExplainabilityNarrativeBuilderInternals = toolkit.internals;
