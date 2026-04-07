import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Observability Error Pattern',
    readyPosture: 'observability_error_taxonomy_ready',
    defaultAgentId: 'agent:observability-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_observability_self_reflection_errors',
        guard: 'mitigate_observability_repeat_reasoning_failure',
        audit: 'audit_observability_error_taxonomy_signals',
        publish: 'publish_observability_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_observability_self_reflection_errors: 'agent:analysis',
        mitigate_observability_repeat_reasoning_failure: 'agent:quality',
        audit_observability_error_taxonomy_signals: 'agent:trust',
        publish_observability_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyObservabilitySelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilitySelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilitySelfReflectionErrorTaxonomist extends BaseManager {}

export const __observabilitySelfReflectionErrorTaxonomistInternals = toolkit.internals;
