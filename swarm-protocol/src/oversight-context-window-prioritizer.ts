import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Oversight Context',
    readyPosture: 'oversight_context_prioritized',
    defaultAgentId: 'agent:oversight-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_oversight_context_window',
        guard: 'mitigate_oversight_context_omission_risk',
        audit: 'audit_oversight_context_prioritization',
        publish: 'publish_oversight_context_status'
    },
    recommendationTargetMap: {
        prioritize_oversight_context_window: 'agent:oversight',
        mitigate_oversight_context_omission_risk: 'agent:policy',
        audit_oversight_context_prioritization: 'agent:trust',
        publish_oversight_context_status: 'agent:ops'
    }
});

export function prioritizeOversightContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightContextWindowPrioritizer extends BaseManager {}

export const __oversightContextWindowPrioritizerInternals = toolkit.internals;
