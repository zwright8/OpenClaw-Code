import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'PublicService Decision',
    readyPosture: 'publicservice_explainability_ready',
    defaultAgentId: 'agent:publicservice-explainability',
    recommendationTypes: {
        primary: 'build_publicservice_explainability_narrative',
        guard: 'mitigate_publicservice_explanation_gap',
        audit: 'audit_publicservice_explainability_signals',
        publish: 'publish_publicservice_explainability_status'
    },
    recommendationTargetMap: {
        build_publicservice_explainability_narrative: 'agent:publicservice',
        mitigate_publicservice_explanation_gap: 'agent:policy',
        audit_publicservice_explainability_signals: 'agent:trust',
        publish_publicservice_explainability_status: 'agent:ops'
    }
});

export function buildPublicServiceExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceExplainabilityNarrativeBuilder extends BaseManager {}

export const __publicServiceExplainabilityNarrativeBuilderInternals = toolkit.internals;
