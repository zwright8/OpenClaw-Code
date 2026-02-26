import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Logistics Context',
    readyPosture: 'logistics_context_prioritized',
    defaultAgentId: 'agent:logistics-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_logistics_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_logistics_context_prioritization',
        publish: 'publish_logistics_context_status'
    },
    recommendationTargetMap: {
        prioritize_logistics_context_window: 'agent:logistics',
        mitigate_context_omission_risk: 'agent:policy',
        audit_logistics_context_prioritization: 'agent:trust',
        publish_logistics_context_status: 'agent:ops'
    }
});

export function prioritizeLogisticsContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsContextWindowPrioritizer extends BaseManager {}

export const __logisticsContextWindowPrioritizerInternals = toolkit.internals;
