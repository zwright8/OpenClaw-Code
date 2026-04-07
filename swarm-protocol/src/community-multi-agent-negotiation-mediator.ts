import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Community Negotiation',
    readyPosture: 'community_negotiation_mediation_ready',
    defaultAgentId: 'agent:community-negotiation',
    recommendationTypes: {
        primary: 'mediate_community_multi_agent_negotiation',
        guard: 'mitigate_community_negotiation_deadlock',
        audit: 'audit_community_negotiation_signals',
        publish: 'publish_community_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_community_multi_agent_negotiation: 'agent:community',
        mitigate_community_negotiation_deadlock: 'agent:policy',
        audit_community_negotiation_signals: 'agent:trust',
        publish_community_negotiation_status: 'agent:ops'
    }
});

export function mediateCommunityMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityMultiAgentNegotiationMediator extends BaseManager {}

export const __communityMultiAgentNegotiationMediatorInternals = toolkit.internals;
