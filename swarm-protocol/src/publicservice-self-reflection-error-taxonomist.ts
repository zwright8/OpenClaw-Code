import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'PublicService Error Pattern',
    readyPosture: 'publicservice_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:publicservice-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_publicservice_self_reflection_errors',
        guard: 'mitigate_publicservice_repeat_reasoning_errors',
        audit: 'audit_publicservice_self_reflection_signals',
        publish: 'publish_publicservice_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_publicservice_self_reflection_errors: 'agent:quality',
        mitigate_publicservice_repeat_reasoning_errors: 'agent:operations',
        audit_publicservice_self_reflection_signals: 'agent:trust',
        publish_publicservice_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyPublicServiceSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceSelfReflectionErrorTaxonomist extends BaseManager {}

export const __publicServiceSelfReflectionErrorTaxonomistInternals = toolkit.internals;
