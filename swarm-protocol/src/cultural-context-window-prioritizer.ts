import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Cultural Context',
    readyPosture: 'cultural_context_prioritized',
    defaultAgentId: 'agent:cultural-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_cultural_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_cultural_context_prioritization',
        publish: 'publish_cultural_context_status'
    },
    recommendationTargetMap: {
        prioritize_cultural_context_window: 'agent:cultural',
        mitigate_context_omission_risk: 'agent:policy',
        audit_cultural_context_prioritization: 'agent:trust',
        publish_cultural_context_status: 'agent:ops'
    }
});

export function prioritizeCulturalContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalContextWindowPrioritizer extends BaseManager {}

export const __culturalContextWindowPrioritizerInternals = toolkit.internals;
