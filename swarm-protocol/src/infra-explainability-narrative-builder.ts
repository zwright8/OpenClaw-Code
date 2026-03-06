import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Infra Decision',
    readyPosture: 'infra_explainability_ready',
    defaultAgentId: 'agent:infra-explainability',
    recommendationTypes: {
        primary: 'build_infra_explainability_narratives',
        guard: 'mitigate_infra_explainability_gaps',
        audit: 'audit_infra_explainability_signals',
        publish: 'publish_infra_explainability_status'
    },
    recommendationTargetMap: {
        build_infra_explainability_narratives: 'agent:infra',
        mitigate_infra_explainability_gaps: 'agent:policy',
        audit_infra_explainability_signals: 'agent:trust',
        publish_infra_explainability_status: 'agent:ops'
    }
});

export function buildInfraExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraExplainabilityNarrativeBuilder extends BaseManager {}

export const __infraExplainabilityNarrativeBuilderInternals = toolkit.internals;
