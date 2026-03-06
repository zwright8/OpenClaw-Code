import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Infra Error Pattern',
    readyPosture: 'infra_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:infra-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_infra_self_reflection_errors',
        guard: 'mitigate_infra_repeat_reasoning_errors',
        audit: 'audit_infra_self_reflection_signals',
        publish: 'publish_infra_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_infra_self_reflection_errors: 'agent:quality',
        mitigate_infra_repeat_reasoning_errors: 'agent:operations',
        audit_infra_self_reflection_signals: 'agent:trust',
        publish_infra_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyInfraSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraSelfReflectionErrorTaxonomist extends BaseManager {}

export const __infraSelfReflectionErrorTaxonomistInternals = toolkit.internals;
