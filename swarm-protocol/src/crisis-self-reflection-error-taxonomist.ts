import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Crisis Error Pattern',
    readyPosture: 'crisis_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:crisis-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_crisis_self_reflection_errors',
        guard: 'mitigate_crisis_repeat_reasoning_errors',
        audit: 'audit_crisis_self_reflection_signals',
        publish: 'publish_crisis_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_crisis_self_reflection_errors: 'agent:quality',
        mitigate_crisis_repeat_reasoning_errors: 'agent:operations',
        audit_crisis_self_reflection_signals: 'agent:trust',
        publish_crisis_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyCrisisSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisSelfReflectionErrorTaxonomist extends BaseManager {}

export const __crisisSelfReflectionErrorTaxonomistInternals = toolkit.internals;
