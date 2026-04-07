import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Crisis Context',
    readyPosture: 'crisis_context_prioritized',
    defaultAgentId: 'agent:crisis-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_crisis_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_crisis_context_prioritization',
        publish: 'publish_crisis_context_status'
    },
    recommendationTargetMap: {
        prioritize_crisis_context_window: 'agent:crisis',
        mitigate_context_omission_risk: 'agent:policy',
        audit_crisis_context_prioritization: 'agent:trust',
        publish_crisis_context_status: 'agent:ops'
    }
});

export function prioritizeCrisisContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisContextWindowPrioritizer extends BaseManager {}

export const __crisisContextWindowPrioritizerInternals = toolkit.internals;
