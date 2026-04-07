import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Research Error Pattern',
    readyPosture: 'research_error_taxonomy_ready',
    defaultAgentId: 'agent:research-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_research_self_reflection_errors',
        guard: 'mitigate_research_repeat_reasoning_failure',
        audit: 'audit_research_error_taxonomy_signals',
        publish: 'publish_research_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_research_self_reflection_errors: 'agent:analysis',
        mitigate_research_repeat_reasoning_failure: 'agent:quality',
        audit_research_error_taxonomy_signals: 'agent:trust',
        publish_research_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyResearchSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchSelfReflectionErrorTaxonomist extends BaseManager {}

export const __researchSelfReflectionErrorTaxonomistInternals = toolkit.internals;
