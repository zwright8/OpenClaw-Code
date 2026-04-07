import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Comms Context',
    readyPosture: 'comms_context_prioritized',
    defaultAgentId: 'agent:comms-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_comms_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_comms_context_prioritization',
        publish: 'publish_comms_context_status'
    },
    recommendationTargetMap: {
        prioritize_comms_context_window: 'agent:comms',
        mitigate_context_omission_risk: 'agent:policy',
        audit_comms_context_prioritization: 'agent:trust',
        publish_comms_context_status: 'agent:ops'
    }
});

export function prioritizeCommsContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsContextWindowPrioritizer extends BaseManager {}

export const __commsContextWindowPrioritizerInternals = toolkit.internals;
