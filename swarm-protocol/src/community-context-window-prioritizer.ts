import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Community Context',
    readyPosture: 'community_context_prioritized',
    defaultAgentId: 'agent:community-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_community_context_window',
        guard: 'mitigate_community_context_omission_risk',
        audit: 'audit_community_context_prioritization',
        publish: 'publish_community_context_status'
    },
    recommendationTargetMap: {
        prioritize_community_context_window: 'agent:community',
        mitigate_community_context_omission_risk: 'agent:policy',
        audit_community_context_prioritization: 'agent:trust',
        publish_community_context_status: 'agent:ops'
    }
});

export function prioritizeCommunityContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityContextWindowPrioritizer extends BaseManager {}

export const __communityContextWindowPrioritizerInternals = toolkit.internals;
