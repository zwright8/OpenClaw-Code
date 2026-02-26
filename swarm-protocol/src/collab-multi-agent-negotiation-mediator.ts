import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_multi_agent_negotiation_mediator',
    collectionField: 'negotiations',
    idField: 'negotiationId',
    defaultName: 'Collab Negotiation',
    readyPosture: 'collab_negotiation_mediation_ready',
    defaultAgentId: 'agent:collab-negotiation',
    recommendationTypes: {
        primary: 'mediate_collab_multi_agent_negotiation',
        guard: 'mitigate_collab_negotiation_deadlock',
        audit: 'audit_collab_negotiation_signals',
        publish: 'publish_collab_negotiation_status'
    },
    recommendationTargetMap: {
        mediate_collab_multi_agent_negotiation: 'agent:collab',
        mitigate_collab_negotiation_deadlock: 'agent:policy',
        audit_collab_negotiation_signals: 'agent:trust',
        publish_collab_negotiation_status: 'agent:ops'
    }
});

export function mediateCollabMultiAgentNegotiation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabMultiAgentNegotiationMediatorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabMultiAgentNegotiationMediator extends BaseManager {}

export const __collabMultiAgentNegotiationMediatorInternals = toolkit.internals;
