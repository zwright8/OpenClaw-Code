import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Research Negotiation',
    readyPosture: 'research_negotiation_mediation_ready',
    defaultAgentId: 'agent:research-negotiation',
    recommendationTypes: {
        primary: 'mediate_research_multi_agent_negotiation',
        guard: 'mitigate_research_negotiation_deadlock',
        audit: 'audit_research_negotiation_signals',
        publish: 'publish_research_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_research_multi_agent_negotiation: 'agent:research',
        mitigate_research_negotiation_deadlock: 'agent:policy',
        audit_research_negotiation_signals: 'agent:trust',
        publish_research_negotiation_status: 'agent:ops'
    }
});

export function mediateResearchMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchMultiAgentNegotiationMediator extends BaseManager {}

export const __researchMultiAgentNegotiationMediatorInternals = toolkit.internals;
