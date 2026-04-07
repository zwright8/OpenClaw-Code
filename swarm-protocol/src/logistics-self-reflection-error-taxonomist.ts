import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Logistics Error Pattern',
    readyPosture: 'logistics_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:logistics-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_logistics_self_reflection_errors',
        guard: 'mitigate_logistics_repeat_reasoning_errors',
        audit: 'audit_logistics_self_reflection_signals',
        publish: 'publish_logistics_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_logistics_self_reflection_errors: 'agent:quality',
        mitigate_logistics_repeat_reasoning_errors: 'agent:operations',
        audit_logistics_self_reflection_signals: 'agent:trust',
        publish_logistics_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyLogisticsSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsSelfReflectionErrorTaxonomist extends BaseManager {}

export const __logisticsSelfReflectionErrorTaxonomistInternals = toolkit.internals;
