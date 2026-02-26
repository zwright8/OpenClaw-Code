import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Comms Error Pattern',
    readyPosture: 'comms_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:comms-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_comms_self_reflection_errors',
        guard: 'mitigate_comms_repeat_reasoning_errors',
        audit: 'audit_comms_self_reflection_signals',
        publish: 'publish_comms_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_comms_self_reflection_errors: 'agent:quality',
        mitigate_comms_repeat_reasoning_errors: 'agent:operations',
        audit_comms_self_reflection_signals: 'agent:trust',
        publish_comms_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyCommsSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsSelfReflectionErrorTaxonomist extends BaseManager {}

export const __commsSelfReflectionErrorTaxonomistInternals = toolkit.internals;
