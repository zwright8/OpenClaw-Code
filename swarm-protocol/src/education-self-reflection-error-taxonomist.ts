import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Education Error Pattern',
    readyPosture: 'education_error_taxonomy_ready',
    defaultAgentId: 'agent:education-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_education_self_reflection_errors',
        guard: 'mitigate_education_repeat_reasoning_failure',
        audit: 'audit_education_error_taxonomy_signals',
        publish: 'publish_education_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_education_self_reflection_errors: 'agent:analysis',
        mitigate_education_repeat_reasoning_failure: 'agent:quality',
        audit_education_error_taxonomy_signals: 'agent:trust',
        publish_education_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyEducationSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationSelfReflectionErrorTaxonomist extends BaseManager {}

export const __educationSelfReflectionErrorTaxonomistInternals = toolkit.internals;
