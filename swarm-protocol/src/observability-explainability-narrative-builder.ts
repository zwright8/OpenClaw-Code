import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Observability Decision',
    readyPosture: 'observability_explainability_ready',
    defaultAgentId: 'agent:observability-explainability',
    recommendationTypes: {
        primary: 'build_observability_explainability_narrative',
        guard: 'mitigate_observability_explanation_gap',
        audit: 'audit_observability_explainability_signals',
        publish: 'publish_observability_explainability_status'
    },
    recommendationTargetMap: {
        build_observability_explainability_narrative: 'agent:observability',
        mitigate_observability_explanation_gap: 'agent:policy',
        audit_observability_explainability_signals: 'agent:trust',
        publish_observability_explainability_status: 'agent:ops'
    }
});

export function buildObservabilityExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityExplainabilityNarrativeBuilder extends BaseManager {}

export const __observabilityExplainabilityNarrativeBuilderInternals = toolkit.internals;
