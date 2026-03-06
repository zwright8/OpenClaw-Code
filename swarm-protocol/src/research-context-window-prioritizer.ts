import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_context_window_prioritizer',
    collectionField: 'contexts',
    idField: 'contextId',
    defaultName: 'Research Context',
    readyPosture: 'research_context_prioritized',
    defaultAgentId: 'agent:research-context-prioritizer',
    recommendationTypes: {
        primary: 'prioritize_research_context_window',
        guard: 'mitigate_context_omission_risk',
        audit: 'audit_research_context_prioritization',
        publish: 'publish_research_context_status'
    },
    recommendationTargetMap: {
        prioritize_research_context_window: 'agent:research',
        mitigate_context_omission_risk: 'agent:policy',
        audit_research_context_prioritization: 'agent:trust',
        publish_research_context_status: 'agent:ops'
    }
});

export function prioritizeResearchContextWindow(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchContextWindowPrioritizerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchContextWindowPrioritizer extends BaseManager {}

export const __researchContextWindowPrioritizerInternals = toolkit.internals;
