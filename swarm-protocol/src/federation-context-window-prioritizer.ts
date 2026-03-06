import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Federation Context',
    readyPosture: 'federation_context_prioritized',
    defaultAgentId: 'agent:federation-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_federation_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_federation_context_prioritization',
        publish: 'publish_federation_context_status'
    },
    recommendationTargetMap: {
        prioritize_federation_context_window: 'agent:federation',
        mitigate_context_omission_risk: 'agent:policy',
        audit_federation_context_prioritization: 'agent:trust',
        publish_federation_context_status: 'agent:ops'
    }
});

export function prioritizeFederationContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationContextWindowPrioritizer extends BaseManager {}

export const __federationContextWindowPrioritizerInternals = toolkit.internals;
