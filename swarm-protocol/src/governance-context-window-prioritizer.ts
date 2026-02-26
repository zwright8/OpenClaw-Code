import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Governance Context',
    readyPosture: 'governance_context_prioritized',
    defaultAgentId: 'agent:governance-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_governance_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_governance_context_prioritization',
        publish: 'publish_governance_context_status'
    },
    recommendationTargetMap: {
        prioritize_governance_context_window: 'agent:governance',
        mitigate_context_omission_risk: 'agent:policy',
        audit_governance_context_prioritization: 'agent:trust',
        publish_governance_context_status: 'agent:ops'
    }
});

export function prioritizeGovernanceContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceContextWindowPrioritizer extends BaseManager {}

export const __governanceContextWindowPrioritizerInternals = toolkit.internals;
