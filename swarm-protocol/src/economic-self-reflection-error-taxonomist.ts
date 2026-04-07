import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Economic Error Pattern',
    readyPosture: 'economic_error_taxonomy_ready',
    defaultAgentId: 'agent:economic-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_economic_self_reflection_errors',
        guard: 'mitigate_economic_repeat_reasoning_failure',
        audit: 'audit_economic_error_taxonomy_signals',
        publish: 'publish_economic_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_economic_self_reflection_errors: 'agent:analysis',
        mitigate_economic_repeat_reasoning_failure: 'agent:quality',
        audit_economic_error_taxonomy_signals: 'agent:trust',
        publish_economic_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyEconomicSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicSelfReflectionErrorTaxonomist extends BaseManager {}

export const __economicSelfReflectionErrorTaxonomistInternals = toolkit.internals;
