import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Rights Error Pattern',
    readyPosture: 'rights_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:rights-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_rights_self_reflection_errors',
        guard: 'mitigate_rights_repeat_reasoning_errors',
        audit: 'audit_rights_self_reflection_signals',
        publish: 'publish_rights_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_rights_self_reflection_errors: 'agent:quality',
        mitigate_rights_repeat_reasoning_errors: 'agent:operations',
        audit_rights_self_reflection_signals: 'agent:trust',
        publish_rights_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyRightsSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsSelfReflectionErrorTaxonomist extends BaseManager {}

export const __rightsSelfReflectionErrorTaxonomistInternals = toolkit.internals;
