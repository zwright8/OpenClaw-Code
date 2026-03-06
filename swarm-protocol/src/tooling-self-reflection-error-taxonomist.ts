import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Error Pattern',
    readyPosture: 'error_taxonomy_ready',
    defaultAgentId: 'agent:tooling-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_tooling_self_reflection_errors',
        guard: 'mitigate_repeat_reasoning_failure',
        audit: 'audit_error_taxonomy_signals',
        publish: 'publish_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_tooling_self_reflection_errors: 'agent:analysis',
        mitigate_repeat_reasoning_failure: 'agent:quality',
        audit_error_taxonomy_signals: 'agent:trust',
        publish_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyToolingSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingSelfReflectionErrorTaxonomist extends BaseManager {}

export const __toolingSelfReflectionErrorTaxonomistInternals = toolkit.internals;
