import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Inclusion Context',
    readyPosture: 'inclusion_context_prioritized',
    defaultAgentId: 'agent:inclusion-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_inclusion_context_window',
        guard: 'mitigate_inclusion_context_omission_risk',
        audit: 'audit_inclusion_context_prioritization',
        publish: 'publish_inclusion_context_status'
    },
    recommendationTargetMap: {
        prioritize_inclusion_context_window: 'agent:inclusion',
        mitigate_inclusion_context_omission_risk: 'agent:policy',
        audit_inclusion_context_prioritization: 'agent:trust',
        publish_inclusion_context_status: 'agent:ops'
    }
});

export function prioritizeInclusionContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionContextWindowPrioritizer extends BaseManager {}

export const __inclusionContextWindowPrioritizerInternals = toolkit.internals;
