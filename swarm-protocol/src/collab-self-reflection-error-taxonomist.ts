import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Collab Error Pattern',
    readyPosture: 'collab_error_taxonomy_ready',
    defaultAgentId: 'agent:collab-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_collab_self_reflection_errors',
        guard: 'mitigate_collab_repeat_reasoning_failure',
        audit: 'audit_collab_error_taxonomy_signals',
        publish: 'publish_collab_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_collab_self_reflection_errors: 'agent:analysis',
        mitigate_collab_repeat_reasoning_failure: 'agent:quality',
        audit_collab_error_taxonomy_signals: 'agent:trust',
        publish_collab_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyCollabSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabSelfReflectionErrorTaxonomist extends BaseManager {}

export const __collabSelfReflectionErrorTaxonomistInternals = toolkit.internals;
