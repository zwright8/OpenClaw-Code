import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Oversight Decision',
    readyPosture: 'oversight_explainability_ready',
    defaultAgentId: 'agent:oversight-explainability',
    recommendationTypes: {
        primary: 'build_oversight_explainability_narrative',
        guard: 'mitigate_oversight_explanation_gap',
        audit: 'audit_oversight_explainability_signals',
        publish: 'publish_oversight_explainability_status'
    },
    recommendationTargetMap: {
        build_oversight_explainability_narrative: 'agent:oversight',
        mitigate_oversight_explanation_gap: 'agent:policy',
        audit_oversight_explainability_signals: 'agent:trust',
        publish_oversight_explainability_status: 'agent:ops'
    }
});

export function buildOversightExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightExplainabilityNarrativeBuilder extends BaseManager {}

export const __oversightExplainabilityNarrativeBuilderInternals = toolkit.internals;
