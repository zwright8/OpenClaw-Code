import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Community Error Pattern',
    readyPosture: 'community_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:community-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_community_self_reflection_errors',
        guard: 'mitigate_community_repeat_reasoning_errors',
        audit: 'audit_community_self_reflection_signals',
        publish: 'publish_community_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_community_self_reflection_errors: 'agent:quality',
        mitigate_community_repeat_reasoning_errors: 'agent:operations',
        audit_community_self_reflection_signals: 'agent:trust',
        publish_community_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyCommunitySelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communitySelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunitySelfReflectionErrorTaxonomist extends BaseManager {}

export const __communitySelfReflectionErrorTaxonomistInternals = toolkit.internals;
