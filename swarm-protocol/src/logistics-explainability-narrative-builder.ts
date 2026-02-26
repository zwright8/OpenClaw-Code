import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Logistics Decision',
    readyPosture: 'logistics_explainability_ready',
    defaultAgentId: 'agent:logistics-explainability',
    recommendationTypes: {
        primary: 'build_logistics_explainability_narrative',
        guard: 'mitigate_logistics_explanation_gap',
        audit: 'audit_logistics_explainability_signals',
        publish: 'publish_logistics_explainability_status'
    },
    recommendationTargetMap: {
        build_logistics_explainability_narrative: 'agent:logistics',
        mitigate_logistics_explanation_gap: 'agent:policy',
        audit_logistics_explainability_signals: 'agent:trust',
        publish_logistics_explainability_status: 'agent:ops'
    }
});

export function buildLogisticsExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsExplainabilityNarrativeBuilder extends BaseManager {}

export const __logisticsExplainabilityNarrativeBuilderInternals = toolkit.internals;
