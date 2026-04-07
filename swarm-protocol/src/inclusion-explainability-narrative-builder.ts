import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Inclusion Decision',
    readyPosture: 'inclusion_explainability_ready',
    defaultAgentId: 'agent:inclusion-explainability',
    recommendationTypes: {
        primary: 'build_inclusion_explainability_narratives',
        guard: 'mitigate_inclusion_explainability_gaps',
        audit: 'audit_inclusion_explainability_signals',
        publish: 'publish_inclusion_explainability_status'
    },
    recommendationTargetMap: {
        build_inclusion_explainability_narratives: 'agent:inclusion',
        mitigate_inclusion_explainability_gaps: 'agent:policy',
        audit_inclusion_explainability_signals: 'agent:trust',
        publish_inclusion_explainability_status: 'agent:ops'
    }
});

export function buildInclusionExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionExplainabilityNarrativeBuilder extends BaseManager {}

export const __inclusionExplainabilityNarrativeBuilderInternals = toolkit.internals;
