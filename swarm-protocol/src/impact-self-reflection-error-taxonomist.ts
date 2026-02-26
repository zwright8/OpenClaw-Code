import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Impact Error Pattern',
    readyPosture: 'impact_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:impact-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_impact_self_reflection_errors',
        guard: 'mitigate_impact_repeat_reasoning_errors',
        audit: 'audit_impact_self_reflection_signals',
        publish: 'publish_impact_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_impact_self_reflection_errors: 'agent:quality',
        mitigate_impact_repeat_reasoning_errors: 'agent:operations',
        audit_impact_self_reflection_signals: 'agent:trust',
        publish_impact_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyImpactSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactSelfReflectionErrorTaxonomist extends BaseManager {}

export const __impactSelfReflectionErrorTaxonomistInternals = toolkit.internals;
