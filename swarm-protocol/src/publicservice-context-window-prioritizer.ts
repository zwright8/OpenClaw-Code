import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'PublicService Context',
    readyPosture: 'publicservice_context_window_prioritized',
    defaultAgentId: 'agent:publicservice-context-window',
    recommendationTypes: {
        primary: 'prioritize_publicservice_context_window',
        guard: 'mitigate_publicservice_context_overflow',
        audit: 'audit_publicservice_context_prioritization',
        publish: 'publish_publicservice_context_priority_status'
    },
    recommendationTargetMap: {
        prioritize_publicservice_context_window: 'agent:publicservice',
        mitigate_publicservice_context_overflow: 'agent:platform',
        audit_publicservice_context_prioritization: 'agent:trust',
        publish_publicservice_context_priority_status: 'agent:ops'
    }
});

export function prioritizePublicServiceContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceContextWindowPrioritizer extends BaseManager {}

export const __publicServiceContextWindowPrioritizerInternals = toolkit.internals;
