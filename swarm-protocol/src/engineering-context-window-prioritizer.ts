import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Engineering Context',
    readyPosture: 'engineering_context_prioritized',
    defaultAgentId: 'agent:engineering-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_engineering_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_engineering_context_prioritization',
        publish: 'publish_engineering_context_status'
    },
    recommendationTargetMap: {
        prioritize_engineering_context_window: 'agent:engineering',
        mitigate_context_omission_risk: 'agent:policy',
        audit_engineering_context_prioritization: 'agent:trust',
        publish_engineering_context_status: 'agent:ops'
    }
});

export function prioritizeEngineeringContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringContextWindowPrioritizer extends BaseManager {}

export const __engineeringContextWindowPrioritizerInternals = toolkit.internals;
