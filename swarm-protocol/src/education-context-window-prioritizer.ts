import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Education Context',
    readyPosture: 'education_context_prioritized',
    defaultAgentId: 'agent:education-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_education_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_education_context_prioritization',
        publish: 'publish_education_context_status'
    },
    recommendationTargetMap: {
        prioritize_education_context_window: 'agent:education',
        mitigate_context_omission_risk: 'agent:policy',
        audit_education_context_prioritization: 'agent:trust',
        publish_education_context_status: 'agent:ops'
    }
});

export function prioritizeEducationContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationContextWindowPrioritizer extends BaseManager {}

export const __educationContextWindowPrioritizerInternals = toolkit.internals;
