import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Federation Decision',
    readyPosture: 'federation_explainability_ready',
    defaultAgentId: 'agent:federation-explainability',
    recommendationTypes: {
        primary: 'build_federation_explainability_narrative',
        guard: 'mitigate_federation_explanation_gap',
        audit: 'audit_federation_explainability_signals',
        publish: 'publish_federation_explainability_status'
    },
    recommendationTargetMap: {
        build_federation_explainability_narrative: 'agent:federation',
        mitigate_federation_explanation_gap: 'agent:policy',
        audit_federation_explainability_signals: 'agent:trust',
        publish_federation_explainability_status: 'agent:ops'
    }
});

export function buildFederationExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationExplainabilityNarrativeBuilder extends BaseManager {}

export const __federationExplainabilityNarrativeBuilderInternals = toolkit.internals;
