import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Collab Decision',
    readyPosture: 'collab_explainability_ready',
    defaultAgentId: 'agent:collab-explainability',
    recommendationTypes: {
        primary: 'build_collab_explainability_narrative',
        guard: 'mitigate_collab_explanation_gap',
        audit: 'audit_collab_explainability_signals',
        publish: 'publish_collab_explainability_status'
    },
    recommendationTargetMap: {
        build_collab_explainability_narrative: 'agent:collab',
        mitigate_collab_explanation_gap: 'agent:policy',
        audit_collab_explainability_signals: 'agent:trust',
        publish_collab_explainability_status: 'agent:ops'
    }
});

export function buildCollabExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabExplainabilityNarrativeBuilder extends BaseManager {}

export const __collabExplainabilityNarrativeBuilderInternals = toolkit.internals;
