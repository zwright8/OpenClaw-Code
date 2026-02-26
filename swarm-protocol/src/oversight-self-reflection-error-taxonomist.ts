import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Oversight Error Pattern',
    readyPosture: 'oversight_error_taxonomy_ready',
    defaultAgentId: 'agent:oversight-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_oversight_self_reflection_errors',
        guard: 'mitigate_oversight_repeat_reasoning_failure',
        audit: 'audit_oversight_error_taxonomy_signals',
        publish: 'publish_oversight_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_oversight_self_reflection_errors: 'agent:analysis',
        mitigate_oversight_repeat_reasoning_failure: 'agent:quality',
        audit_oversight_error_taxonomy_signals: 'agent:trust',
        publish_oversight_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyOversightSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightSelfReflectionErrorTaxonomist extends BaseManager {}

export const __oversightSelfReflectionErrorTaxonomistInternals = toolkit.internals;
