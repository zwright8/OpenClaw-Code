import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Cultural Error Pattern',
    readyPosture: 'cultural_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:cultural-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_cultural_self_reflection_errors',
        guard: 'mitigate_cultural_repeat_reasoning_errors',
        audit: 'audit_cultural_self_reflection_signals',
        publish: 'publish_cultural_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_cultural_self_reflection_errors: 'agent:quality',
        mitigate_cultural_repeat_reasoning_errors: 'agent:operations',
        audit_cultural_self_reflection_signals: 'agent:trust',
        publish_cultural_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyCulturalSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalSelfReflectionErrorTaxonomist extends BaseManager {}

export const __culturalSelfReflectionErrorTaxonomistInternals = toolkit.internals;
