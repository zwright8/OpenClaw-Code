import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Evolution Context',
    readyPosture: 'evolution_context_prioritized',
    defaultAgentId: 'agent:evolution-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_evolution_context_window',
        guard: 'mitigate_evolution_context_omission_risk',
        audit: 'audit_evolution_context_prioritization',
        publish: 'publish_evolution_context_status'
    },
    recommendationTargetMap: {
        prioritize_evolution_context_window: 'agent:evolution',
        mitigate_evolution_context_omission_risk: 'agent:policy',
        audit_evolution_context_prioritization: 'agent:trust',
        publish_evolution_context_status: 'agent:ops'
    }
});

export function prioritizeEvolutionContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionContextWindowPrioritizer extends BaseManager {}

export const __evolutionContextWindowPrioritizerInternals = toolkit.internals;
