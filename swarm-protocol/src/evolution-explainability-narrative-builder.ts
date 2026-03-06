import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Evolution Decision',
    readyPosture: 'evolution_explainability_ready',
    defaultAgentId: 'agent:evolution-explainability',
    recommendationTypes: {
        primary: 'build_evolution_explainability_narratives',
        guard: 'mitigate_evolution_explainability_gaps',
        audit: 'audit_evolution_explainability_signals',
        publish: 'publish_evolution_explainability_status'
    },
    recommendationTargetMap: {
        build_evolution_explainability_narratives: 'agent:evolution',
        mitigate_evolution_explainability_gaps: 'agent:policy',
        audit_evolution_explainability_signals: 'agent:trust',
        publish_evolution_explainability_status: 'agent:ops'
    }
});

export function buildEvolutionExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionExplainabilityNarrativeBuilder extends BaseManager {}

export const __evolutionExplainabilityNarrativeBuilderInternals = toolkit.internals;
