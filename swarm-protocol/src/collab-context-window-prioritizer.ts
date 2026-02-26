import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Collab Context',
    readyPosture: 'collab_context_prioritized',
    defaultAgentId: 'agent:collab-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_collab_context_window',
        guard: 'mitigate_collab_context_omission_risk',
        audit: 'audit_collab_context_prioritization',
        publish: 'publish_collab_context_status'
    },
    recommendationTargetMap: {
        prioritize_collab_context_window: 'agent:collab',
        mitigate_collab_context_omission_risk: 'agent:policy',
        audit_collab_context_prioritization: 'agent:trust',
        publish_collab_context_status: 'agent:ops'
    }
});

export function prioritizeCollabContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabContextWindowPrioritizer extends BaseManager {}

export const __collabContextWindowPrioritizerInternals = toolkit.internals;
