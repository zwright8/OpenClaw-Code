import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'PublicService Negotiation',
    readyPosture: 'publicservice_negotiation_mediation_ready',
    defaultAgentId: 'agent:publicservice-negotiation',
    recommendationTypes: {
        primary: 'mediate_publicservice_multi_agent_negotiation',
        guard: 'mitigate_publicservice_negotiation_deadlock',
        audit: 'audit_publicservice_negotiation_signals',
        publish: 'publish_publicservice_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_publicservice_multi_agent_negotiation: 'agent:publicservice',
        mitigate_publicservice_negotiation_deadlock: 'agent:policy',
        audit_publicservice_negotiation_signals: 'agent:trust',
        publish_publicservice_negotiation_status: 'agent:ops'
    }
});

export function mediatePublicServiceMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceMultiAgentNegotiationMediator extends BaseManager {}

export const __publicServiceMultiAgentNegotiationMediatorInternals = toolkit.internals;
