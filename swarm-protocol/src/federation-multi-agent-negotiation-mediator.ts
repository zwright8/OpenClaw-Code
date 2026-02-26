import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Federation Negotiation',
    readyPosture: 'federation_negotiation_mediation_ready',
    defaultAgentId: 'agent:federation-negotiation',
    recommendationTypes: {
        primary: 'mediate_federation_multi_agent_negotiation',
        guard: 'mitigate_federation_negotiation_deadlock',
        audit: 'audit_federation_negotiation_signals',
        publish: 'publish_federation_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_federation_multi_agent_negotiation: 'agent:federation',
        mitigate_federation_negotiation_deadlock: 'agent:policy',
        audit_federation_negotiation_signals: 'agent:trust',
        publish_federation_negotiation_status: 'agent:ops'
    }
});

export function mediateFederationMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationMultiAgentNegotiationMediator extends BaseManager {}

export const __federationMultiAgentNegotiationMediatorInternals = toolkit.internals;
