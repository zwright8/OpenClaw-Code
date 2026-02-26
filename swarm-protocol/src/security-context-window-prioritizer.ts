import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Security Context',
    readyPosture: 'security_context_prioritized',
    defaultAgentId: 'agent:security-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_security_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_security_context_prioritization',
        publish: 'publish_security_context_status'
    },
    recommendationTargetMap: {
        prioritize_security_context_window: 'agent:security',
        mitigate_context_omission_risk: 'agent:policy',
        audit_security_context_prioritization: 'agent:trust',
        publish_security_context_status: 'agent:ops'
    }
});

export function prioritizeSecurityContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityContextWindowPrioritizer extends BaseManager {}

export const __securityContextWindowPrioritizerInternals = toolkit.internals;
