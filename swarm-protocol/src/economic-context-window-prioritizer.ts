import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Economic Context',
    readyPosture: 'economic_context_prioritized',
    defaultAgentId: 'agent:economic-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_economic_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_economic_context_prioritization',
        publish: 'publish_economic_context_status'
    },
    recommendationTargetMap: {
        prioritize_economic_context_window: 'agent:economic',
        mitigate_context_omission_risk: 'agent:policy',
        audit_economic_context_prioritization: 'agent:trust',
        publish_economic_context_status: 'agent:ops'
    }
});

export function prioritizeEconomicContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicContextWindowPrioritizer extends BaseManager {}

export const __economicContextWindowPrioritizerInternals = toolkit.internals;
