import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Education Decision',
    readyPosture: 'education_explainability_ready',
    defaultAgentId: 'agent:education-explainability',
    recommendationTypes: {
        primary: 'build_education_explainability_narrative',
        guard: 'mitigate_education_explanation_gap',
        audit: 'audit_education_explainability_signals',
        publish: 'publish_education_explainability_status'
    },
    recommendationTargetMap: {
        build_education_explainability_narrative: 'agent:education',
        mitigate_education_explanation_gap: 'agent:policy',
        audit_education_explainability_signals: 'agent:trust',
        publish_education_explainability_status: 'agent:ops'
    }
});

export function buildEducationExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationExplainabilityNarrativeBuilder extends BaseManager {}

export const __educationExplainabilityNarrativeBuilderInternals = toolkit.internals;
