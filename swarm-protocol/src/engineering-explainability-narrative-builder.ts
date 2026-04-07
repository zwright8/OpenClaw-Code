import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Engineering Decision',
    readyPosture: 'engineering_explainability_ready',
    defaultAgentId: 'agent:engineering-explainability',
    recommendationTypes: {
        primary: 'build_engineering_explainability_narrative',
        guard: 'mitigate_engineering_explanation_gap',
        audit: 'audit_engineering_explainability_signals',
        publish: 'publish_engineering_explainability_status'
    },
    recommendationTargetMap: {
        build_engineering_explainability_narrative: 'agent:engineering',
        mitigate_engineering_explanation_gap: 'agent:policy',
        audit_engineering_explainability_signals: 'agent:trust',
        publish_engineering_explainability_status: 'agent:ops'
    }
});

export function buildEngineeringExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringExplainabilityNarrativeBuilder extends BaseManager {}

export const __engineeringExplainabilityNarrativeBuilderInternals = toolkit.internals;
