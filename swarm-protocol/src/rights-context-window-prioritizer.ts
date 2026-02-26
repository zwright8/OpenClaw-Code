import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Rights Context',
    readyPosture: 'rights_context_prioritized',
    defaultAgentId: 'agent:rights-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_rights_context_window',
        guard: 'mitigate_rights_context_omission_risk',
        audit: 'audit_rights_context_prioritization',
        publish: 'publish_rights_context_status'
    },
    recommendationTargetMap: {
        prioritize_rights_context_window: 'agent:rights',
        mitigate_rights_context_omission_risk: 'agent:policy',
        audit_rights_context_prioritization: 'agent:trust',
        publish_rights_context_status: 'agent:ops'
    }
});

export function prioritizeRightsContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsContextWindowPrioritizer extends BaseManager {}

export const __rightsContextWindowPrioritizerInternals = toolkit.internals;
