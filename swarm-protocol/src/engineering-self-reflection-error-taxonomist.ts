import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Engineering Error Pattern',
    readyPosture: 'engineering_error_taxonomy_ready',
    defaultAgentId: 'agent:engineering-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_engineering_self_reflection_errors',
        guard: 'mitigate_engineering_repeat_reasoning_failure',
        audit: 'audit_engineering_error_taxonomy_signals',
        publish: 'publish_engineering_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_engineering_self_reflection_errors: 'agent:analysis',
        mitigate_engineering_repeat_reasoning_failure: 'agent:quality',
        audit_engineering_error_taxonomy_signals: 'agent:trust',
        publish_engineering_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyEngineeringSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringSelfReflectionErrorTaxonomist extends BaseManager {}

export const __engineeringSelfReflectionErrorTaxonomistInternals = toolkit.internals;
