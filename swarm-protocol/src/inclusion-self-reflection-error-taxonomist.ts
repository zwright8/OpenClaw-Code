import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Inclusion Error Pattern',
    readyPosture: 'inclusion_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:inclusion-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_inclusion_self_reflection_errors',
        guard: 'mitigate_inclusion_repeat_reasoning_errors',
        audit: 'audit_inclusion_self_reflection_signals',
        publish: 'publish_inclusion_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_inclusion_self_reflection_errors: 'agent:quality',
        mitigate_inclusion_repeat_reasoning_errors: 'agent:operations',
        audit_inclusion_self_reflection_signals: 'agent:trust',
        publish_inclusion_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyInclusionSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionSelfReflectionErrorTaxonomist extends BaseManager {}

export const __inclusionSelfReflectionErrorTaxonomistInternals = toolkit.internals;
