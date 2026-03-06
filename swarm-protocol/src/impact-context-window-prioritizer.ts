import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Impact Context',
    readyPosture: 'impact_context_prioritized',
    defaultAgentId: 'agent:impact-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_impact_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_impact_context_prioritization',
        publish: 'publish_impact_context_status'
    },
    recommendationTargetMap: {
        prioritize_impact_context_window: 'agent:impact',
        mitigate_context_omission_risk: 'agent:policy',
        audit_impact_context_prioritization: 'agent:trust',
        publish_impact_context_status: 'agent:ops'
    }
});

export function prioritizeImpactContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactContextWindowPrioritizer extends BaseManager {}

export const __impactContextWindowPrioritizerInternals = toolkit.internals;
