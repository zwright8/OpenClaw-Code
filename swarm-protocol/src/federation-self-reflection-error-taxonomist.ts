import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Federation Error Pattern',
    readyPosture: 'federation_error_taxonomy_ready',
    defaultAgentId: 'agent:federation-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_federation_self_reflection_errors',
        guard: 'mitigate_federation_repeat_reasoning_failure',
        audit: 'audit_federation_error_taxonomy_signals',
        publish: 'publish_federation_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_federation_self_reflection_errors: 'agent:analysis',
        mitigate_federation_repeat_reasoning_failure: 'agent:quality',
        audit_federation_error_taxonomy_signals: 'agent:trust',
        publish_federation_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyFederationSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationSelfReflectionErrorTaxonomist extends BaseManager {}

export const __federationSelfReflectionErrorTaxonomistInternals = toolkit.internals;
