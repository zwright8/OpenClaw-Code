import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Infra Context',
    readyPosture: 'infra_context_prioritized',
    defaultAgentId: 'agent:infra-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_infra_context_window',
        guard: 'mitigate_infra_context_omission_risk',
        audit: 'audit_infra_context_prioritization',
        publish: 'publish_infra_context_status'
    },
    recommendationTargetMap: {
        prioritize_infra_context_window: 'agent:infra',
        mitigate_infra_context_omission_risk: 'agent:policy',
        audit_infra_context_prioritization: 'agent:trust',
        publish_infra_context_status: 'agent:ops'
    }
});

export function prioritizeInfraContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraContextWindowPrioritizer extends BaseManager {}

export const __infraContextWindowPrioritizerInternals = toolkit.internals;
