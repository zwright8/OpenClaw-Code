import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Decision',
    readyPosture: 'explainability_narratives_ready',
    defaultAgentId: 'agent:tooling-explainability',
    recommendationTypes: {
        primary: 'build_explainability_narrative',
        guard: 'mitigate_explanation_gap_risk',
        audit: 'audit_explainability_signals',
        publish: 'publish_explainability_status'
    },
    recommendationTargetMap: {
        build_explainability_narrative: 'agent:ux',
        mitigate_explanation_gap_risk: 'agent:governance',
        audit_explainability_signals: 'agent:trust',
        publish_explainability_status: 'agent:ops'
    }
});

export function buildToolingExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingExplainabilityNarrativeBuilder extends BaseManager {}

export const __toolingExplainabilityNarrativeBuilderInternals = toolkit.internals;
